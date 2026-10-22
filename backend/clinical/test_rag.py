"""
Dedicated Unit Tests for AyuRAG-XAI Knowledge Base, Vector Store, and Grounded Clinical RAG Engine.
"""

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from clinical.services.vector_store import AyuVectorStore, AyuSemanticVectorizer
from clinical.services.document_processor import AyuDocumentProcessor
from clinical.services.clinical_rag_engine import ClinicalRagEngine
from clinical.services.rag_service import retrieve_relevant_knowledge, answer_clinical_question


class AyuRagPipelineTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.store = AyuVectorStore()

    def test_vectorizer_properties(self):
        """Vectorizer creates normalized 256-d vectors and calculates exact cosine similarity."""
        vec = AyuSemanticVectorizer.vectorize("Ashwagandha withania somnifera rasayana vata shamana")
        self.assertEqual(len(vec), 256)
        # Unit norm check
        norm = sum(x * x for x in vec)
        self.assertAlmostEqual(norm, 1.0, places=3)

        # Orthogonal / distinct query check
        vec2 = AyuSemanticVectorizer.vectorize("Quantum computing qubit superconducting gates")
        sim = AyuSemanticVectorizer.cosine_similarity(vec, vec2)
        self.assertLess(sim, 0.40)

    def test_document_processor_chunking(self):
        """Document processor correctly cleans and splits text while preserving metadata."""
        sample_doc = {
            'id': 'TEST-DOC-01',
            'title': 'Test Botanical Monograph',
            'collection': 'botanical_pharmacopoeia',
            'publisher': 'PCIM&H',
            'source_url': 'https://pcimh.gov.in/test',
            'publication_version': 'Vol 1',
            'license': 'Open Access',
            'document_type': 'Monograph',
            'content': 'Paragraph one.\n\nParagraph two with detailed botanical information.\n\nParagraph three.'
        }
        chunks = AyuDocumentProcessor.process_document(sample_doc, chunk_size=50, chunk_overlap=10)
        self.assertGreater(len(chunks), 1)
        self.assertEqual(chunks[0]['doc_id'], 'TEST-DOC-01')
        self.assertEqual(chunks[0]['publisher'], 'PCIM&H')
        self.assertTrue(chunks[0]['content_hash'])

    def test_vector_store_stats(self):
        """Vector store reports indexed documents and chunks."""
        stats = self.store.get_stats()
        self.assertGreaterEqual(stats['total_documents'], 50)
        self.assertGreaterEqual(stats['total_chunks'], 50)
        self.assertIn('classical_compendia', stats['by_collection'])
        self.assertIn('botanical_pharmacopoeia', stats['by_collection'])

    def test_clinical_rag_grounded_answer(self):
        """ClinicalRagEngine produces answers with separated evidence, interpretation, and valid citations."""
        res = ClinicalRagEngine.answer_question(
            question="What are the contraindications and interactions of Ashwagandha?",
            prakriti="Vata"
        )
        self.assertEqual(res['status'], 'SUCCESS')
        self.assertTrue(res['evidence_sufficient'])
        self.assertGreater(len(res['citations']), 0)
        self.assertIn('Clinical AI Interpretation', res['clinical_interpretation'])
        self.assertIn('Clinical Safety & Verification Notice', res['clinical_safety_notice'])

        # Check citation completeness
        top_cite = res['citations'][0]
        self.assertTrue(top_cite['title'])
        self.assertTrue(top_cite['publisher'])
        self.assertTrue(top_cite['source_url'])
        self.assertTrue(top_cite['license'])

    def test_clinical_rag_emergency_red_flag(self):
        """Emergency red-flag symptom immediately triggers escalation protocol without speculative advice."""
        res = ClinicalRagEngine.answer_question(
            question="Patient presents with acute crushing chest pain radiating to left jaw and severe diaphoresis"
        )
        self.assertEqual(res['status'], 'EMERGENCY_ESCALATION')
        self.assertFalse(res['evidence_sufficient'])
        self.assertIsNotNone(res['escalation_alert'])
        self.assertTrue(res['escalation_alert']['emergency_detected'])
        self.assertIn('Cardiovascular Emergency', res['escalation_alert']['condition_category'])
        self.assertEqual(len(res['citations']), 0)

    def test_clinical_rag_insufficient_evidence(self):
        """Out of domain queries return explicit INSUFFICIENT_EVIDENCE notice without fabrication."""
        res = ClinicalRagEngine.answer_question(
            question="What is the recommended chemotherapy dosage of doxorubicin for stage 4 invasive breast carcinoma?"
        )
        self.assertEqual(res['status'], 'INSUFFICIENT_EVIDENCE')
        self.assertFalse(res['evidence_sufficient'])
        self.assertEqual(len(res['citations']), 0)
        self.assertIn('Insufficient Evidence', res['summary'])

    def test_rag_api_query_endpoint(self):
        """POST /api/clinical/rag/query/ returns structured RAG answer."""
        response = self.client.post('/api/clinical/rag/query/', {
            'question': 'What are the qualitative properties of Vata dosha in Charaka Samhita?',
            'prakriti': 'Vata'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertGreater(len(data['citations']), 0)
        self.assertIn('retrieval_metadata', data)

    def test_rag_api_empty_question(self):
        """POST /api/clinical/rag/query/ with empty question returns 400 Bad Request."""
        response = self.client.post('/api/clinical/rag/query/', {
            'question': '   '
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rag_api_stats_endpoint(self):
        """GET /api/clinical/rag/stats/ returns vector database collection breakdown."""
        response = self.client.get('/api/clinical/rag/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_documents', response.data)
        self.assertIn('total_chunks', response.data)
        self.assertGreater(response.data['total_documents'], 0)
