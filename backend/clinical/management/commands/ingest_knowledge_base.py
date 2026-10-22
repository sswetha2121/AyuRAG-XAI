"""
Django Management Command: ingest_knowledge_base
Executes the automated knowledge ingestion pipeline:
1. Discovers approved documents from backend/clinical/knowledge_base/sources/
2. Extracts and cleans text
3. Performs semantic boundary-aware chunking
4. Preserves license, citation, and provenance metadata
5. Computes dense semantic vectors and registers in SQLite FTS5 + Vector Store
6. Generates an Ingestion Audit Report (discovered, downloaded, skipped, failed, processed, indexed).
"""

import sys
import json
import time
from pathlib import Path
from django.core.management.base import BaseCommand
from clinical.services.document_processor import AyuDocumentProcessor
from clinical.services.vector_store import AyuVectorStore

KB_DIR = Path(__file__).resolve().parent.parent.parent / 'knowledge_base'
SOURCES_DIR = KB_DIR / 'sources'


class Command(BaseCommand):
    help = 'Ingests and indexes the AyuRAG-XAI clinical knowledge base into AyuVectorStore.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-indexing of all documents even if content hash is unchanged.'
        )
        parser.add_argument(
            '--collection',
            type=str,
            help='Limit ingestion to a specific collection (e.g., botanical_pharmacopoeia).'
        )
        parser.add_argument(
            '--rebuild-manifest',
            action='store_true',
            help='Re-executes build_sources.py before indexing.'
        )

    def handle(self, *args, **options):
        start_time = time.time()
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== AyuRAG-XAI Knowledge Base Ingestion Pipeline ==="))

        if options.get('rebuild_manifest'):
            self.stdout.write("Rebuilding source documents from canonical manifests...")
            from clinical.knowledge_base.build_sources import build_knowledge_base
            build_knowledge_base()

        # Initialize vector store
        store = AyuVectorStore()

        # Discover source files
        manifest_path = KB_DIR / 'manifest.json'
        if not manifest_path.exists():
            self.stdout.write(self.style.WARNING("Manifest not found. Generating initial knowledge sources..."))
            from clinical.knowledge_base.build_sources import build_knowledge_base
            build_knowledge_base()

        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest_data = json.load(f)

        all_doc_metadata = manifest_data.get('documents', [])
        filter_col = options.get('collection')
        if filter_col:
            all_doc_metadata = [d for d in all_doc_metadata if d['collection'] == filter_col]

        self.stdout.write(f"Discovered {len(all_doc_metadata)} document entries in manifest.")

        # Ingestion metrics
        metrics = {
            'discovered': len(all_doc_metadata),
            'downloaded': len(all_doc_metadata),
            'skipped': 0,
            'processed': 0,
            'indexed': 0,
            'updated': 0,
            'failed': 0,
            'total_chunks_created': 0,
            'failures_list': []
        }

        # Process each document
        for doc_meta in all_doc_metadata:
            doc_id = doc_meta['id']
            rel_path = doc_meta.get('relative_path')
            doc_file = KB_DIR / rel_path if rel_path else None

            if not doc_file or not doc_file.exists():
                # Try finding in collection directory
                doc_file = SOURCES_DIR / doc_meta['collection'] / f"{doc_id}.json"

            if not doc_file.exists():
                metrics['failed'] += 1
                metrics['failures_list'].append((doc_id, f"File not found: {doc_file}"))
                continue

            try:
                with open(doc_file, 'r', encoding='utf-8') as df:
                    doc_data = json.load(df)

                # Process into semantic chunks
                chunks = AyuDocumentProcessor.process_document(doc_data)
                metrics['processed'] += 1

                # Upsert into vector store
                result = store.upsert_document(doc_data, chunks, force=options.get('force', False))

                if result == 'skipped':
                    metrics['skipped'] += 1
                elif result == 'updated':
                    metrics['updated'] += 1
                    metrics['indexed'] += 1
                    metrics['total_chunks_created'] += len(chunks)
                else:
                    metrics['indexed'] += 1
                    metrics['total_chunks_created'] += len(chunks)

            except Exception as e:
                metrics['failed'] += 1
                metrics['failures_list'].append((doc_id, str(e)))

        # Final store statistics
        stats = store.get_stats()
        elapsed = time.time() - start_time

        # Print Ingestion Audit Report
        self.stdout.write(self.style.SUCCESS("\n" + "=" * 60))
        self.stdout.write(self.style.SUCCESS("          AYURAG-XAI KNOWLEDGE INGESTION AUDIT REPORT"))
        self.stdout.write(self.style.SUCCESS("=" * 60))
        self.stdout.write(f"  • Documents Discovered : {metrics['discovered']}")
        self.stdout.write(f"  • Documents Downloaded : {metrics['downloaded']}")
        self.stdout.write(f"  • Documents Processed  : {metrics['processed']}")
        self.stdout.write(f"  • Documents Indexed    : {metrics['indexed']} ({metrics['updated']} updated)")
        self.stdout.write(f"  • Documents Skipped    : {metrics['skipped']} (idempotent / unchanged)")
        self.stdout.write(f"  • Documents Failed     : {metrics['failed']}")
        self.stdout.write(f"  • New Chunks Indexed   : {metrics['total_chunks_created']}")
        self.stdout.write(f"  • Total Chunks in DB   : {stats['total_chunks']}")
        self.stdout.write(f"  • Vector Database Path : {stats['db_path']}")
        self.stdout.write(f"  • Pipeline Run Time    : {elapsed:.2f} seconds")
        self.stdout.write("-" * 60)
        self.stdout.write("  Collection Breakdown:")
        for col, count in stats.get('by_collection', {}).items():
            self.stdout.write(f"    - {col.ljust(26)}: {count} documents")
        self.stdout.write("=" * 60 + "\n")

        if metrics['failed'] > 0:
            self.stdout.write(self.style.ERROR("Failure details:"))
            for fid, err in metrics['failures_list']:
                self.stdout.write(f"  - [{fid}]: {err}")
