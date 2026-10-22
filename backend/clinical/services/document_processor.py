"""
AyuRAG Document Processor.
Handles format-agnostic text extraction, semantic chunking, metadata preservation,
and deduplication for Ayurvedic clinical knowledge sources.
"""

import re
import zlib
import hashlib
from typing import List, Dict, Any, Optional
from html.parser import HTMLParser


class SimpleHTMLTextExtractor(HTMLParser):
    """Clean HTML to plain text converter stripping tags, scripts, and styling."""
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []
        self._skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'nav', 'header', 'footer'):
            self._skip = True

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'nav', 'header', 'footer'):
            self._skip = False
        if tag in ('p', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'li', 'tr'):
            self.fed.append('\n')

    def handle_data(self, data):
        if not self._skip:
            self.fed.append(data)

    def get_text(self) -> str:
        return ''.join(self.fed)


class AyuDocumentProcessor:
    """
    Standardized document processing pipeline for AyuRAG-XAI.
    Extracts, cleans, chunks, and formats clinical text.
    """

    DEFAULT_CHUNK_SIZE_CHARS = 1200  # Approx 250-300 words
    DEFAULT_CHUNK_OVERLAP_CHARS = 200

    @classmethod
    def clean_text(cls, raw_text: str) -> str:
        """Removes excessive whitespace, control characters, and boilerplate."""
        if not raw_text:
            return ""
        # Normalize newlines
        text = raw_text.replace('\r\n', '\n').replace('\r', '\n')
        # Replace non-breaking spaces and tabs
        text = text.replace('\xa0', ' ').replace('\t', ' ')
        # Collapse multiple horizontal spaces
        text = re.sub(r'[ ]{2,}', ' ', text)
        # Collapse excessive newlines (max 2 consecutive)
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()

    @classmethod
    def extract_from_html(cls, html_content: str) -> str:
        """Extracts clean text from HTML content."""
        parser = SimpleHTMLTextExtractor()
        parser.feed(html_content)
        return cls.clean_text(parser.get_text())

    @classmethod
    def extract_from_pdf_stream(cls, pdf_bytes: bytes) -> str:
        """
        Native stream decoder for PDF documents.
        Decodes uncompressed and Flate-compressed text streams without external C-dependencies.
        """
        text_fragments = []
        # Find stream objects
        stream_matches = re.finditer(b'stream\r?\n(.*?)\r?\nendstream', pdf_bytes, re.DOTALL)
        for m in stream_matches:
            stream_data = m.group(1)
            # Try zlib decompression
            try:
                decompressed = zlib.decompress(stream_data)
            except Exception:
                decompressed = stream_data

            # Look for BT ... ET text blocks or plain text strings (Tj, TJ)
            matches = re.findall(rb'\((.*?)\)\s*T[jJ]', decompressed)
            for raw_str in matches:
                try:
                    decoded = raw_str.decode('utf-8', errors='ignore')
                    if len(decoded.strip()) > 1:
                        text_fragments.append(decoded)
                except Exception:
                    pass

        if text_fragments:
            return cls.clean_text(' '.join(text_fragments))
        return ""

    @classmethod
    def chunk_text(
        cls,
        text: str,
        chunk_size: int = DEFAULT_CHUNK_SIZE_CHARS,
        chunk_overlap: int = DEFAULT_CHUNK_OVERLAP_CHARS
    ) -> List[str]:
        """
        Splits text into overlapping semantic chunks, preserving sentence and paragraph boundaries.
        """
        cleaned = cls.clean_text(text)
        if not cleaned:
            return []

        if len(cleaned) <= chunk_size:
            return [cleaned]

        chunks = []
        start = 0
        total_len = len(cleaned)

        while start < total_len:
            end = start + chunk_size
            if end >= total_len:
                chunks.append(cleaned[start:].strip())
                break

            # Find natural break: paragraph, sentence, or clause
            candidate_window = cleaned[start:end]
            break_point = -1

            # Priority 1: Paragraph break (\n\n)
            last_para = candidate_window.rfind('\n\n')
            if last_para > chunk_size * 0.6:
                break_point = start + last_para

            # Priority 2: Sentence end (. / ! / ? / ।) followed by space
            if break_point == -1:
                last_sentence = max(
                    candidate_window.rfind('. '),
                    candidate_window.rfind('। '),
                    candidate_window.rfind('? '),
                    candidate_window.rfind('!\n'),
                    candidate_window.rfind('.\n')
                )
                if last_sentence > chunk_size * 0.5:
                    break_point = start + last_sentence + 1

            # Priority 3: Semicolon or comma
            if break_point == -1:
                last_clause = max(candidate_window.rfind('; '), candidate_window.rfind(', '))
                if last_clause > chunk_size * 0.7:
                    break_point = start + last_clause + 1

            # Fallback: Last space
            if break_point == -1:
                last_space = candidate_window.rfind(' ')
                if last_space > chunk_size * 0.5:
                    break_point = start + last_space
                else:
                    break_point = end

            chunk = cleaned[start:break_point].strip()
            if chunk:
                chunks.append(chunk)

            # Advance with overlap
            start = max(start + 1, break_point - chunk_overlap)

        return chunks

    @classmethod
    def process_document(
        cls,
        doc_data: Dict[str, Any],
        chunk_size: int = DEFAULT_CHUNK_SIZE_CHARS,
        chunk_overlap: int = DEFAULT_CHUNK_OVERLAP_CHARS
    ) -> List[Dict[str, Any]]:
        """
        Transforms a raw knowledge document into fully indexed, metadata-rich, hashed chunks.
        """
        doc_id = doc_data['id']
        title = doc_data.get('title', 'Ayurvedic Clinical Reference')
        collection = doc_data.get('collection', 'general')
        publisher = doc_data.get('publisher', 'Ministry of AYUSH')
        source_url = doc_data.get('source_url', '')
        publication_version = doc_data.get('publication_version', '')
        license_str = doc_data.get('license', 'Open Access')
        doc_type = doc_data.get('document_type', 'Clinical Reference')
        relevance = doc_data.get('relevance', '')
        limitations = doc_data.get('limitations', '')
        tags = doc_data.get('tags', [])
        dosha_affinity = doc_data.get('dosha_affinity', [])
        classical_verse = doc_data.get('classical_verse', None)
        raw_content = doc_data.get('content', '')

        # Chunk the content
        text_chunks = cls.chunk_text(raw_content, chunk_size, chunk_overlap)
        processed_chunks = []

        for idx, chunk_text in enumerate(text_chunks):
            # Deterministic idempotent hash
            hash_src = f"{doc_id}:{idx}:{chunk_text[:128]}"
            chunk_hash = hashlib.sha256(hash_src.encode('utf-8')).hexdigest()

            chunk_record = {
                'chunk_id': f"{doc_id}_chk_{idx + 1}",
                'content_hash': chunk_hash,
                'doc_id': doc_id,
                'chunk_index': idx + 1,
                'total_chunks': len(text_chunks),
                'title': title,
                'collection': collection,
                'publisher': publisher,
                'source_url': source_url,
                'publication_version': publication_version,
                'license': license_str,
                'document_type': doc_type,
                'relevance': relevance,
                'limitations': limitations,
                'tags': tags,
                'dosha_affinity': dosha_affinity,
                'classical_verse': classical_verse if idx == 0 else None,
                'text': chunk_text,
                'char_count': len(chunk_text),
                'word_count': len(chunk_text.split()),
            }
            processed_chunks.append(chunk_record)

        return processed_chunks
