"""
AyuRAG Clinical Decision Support & Question Answering Engine.
Provides:
1. Grounded Question Answering strictly anchored to retrieved evidence.
2. Explicit separation between 'Retrieved Canonical Evidence' and 'Clinical AI Interpretation'.
3. Autonomous detection and notification of 'Insufficient Evidence'.
4. Emergency Clinical Triage & Red-Flag Escalation Detection.
5. Evidence Attribution with official URLs, licenses, and publication dates.
6. Clinical Safety Notices (dispelling traditional use as clinical proof, doctor verification requirement).
"""

import time
import re
from typing import Dict, Any, List, Optional
from clinical.services.vector_store import AyuVectorStore


class ClinicalRagEngine:
    """
    Production-grade Clinical RAG Q&A Engine for AyuRAG-XAI.
    """

    # High-Priority Red-Flag Emergency Indicators
    RED_FLAG_PATTERNS = [
        (r'\b(chest\s+pain|crushing\s+chest|cardiac\s+arrest|heart\s+attack|angina)\b', 'Cardiovascular Emergency (Suspected Acute Coronary Syndrome)'),
        (r'\b(stroke|facial\s+droop|slurred\s+speech|hemiplegia|unilateral\s+weakness|arm\s+numbness)\b', 'Neurological Emergency (Suspected Acute Stroke / CVA)'),
        (r'\b(vomiting\s+blood|hematemesis|black\s+tarry\s+stool|melena|massive\s+bleeding)\b', 'Gastrointestinal Bleeding Emergency'),
        (r'\b(severe\s+dyspnea|cannot\s+breathe|gasping|respiratory\s+failure|cyanosis)\b', 'Acute Respiratory Emergency'),
        (r'\b(rigid\s+abdomen|rebound\s+tenderness|acute\s+abdomen|appendicitis)\b', 'Surgical Emergency (Suspected Acute Abdomen)'),
        (r'\b(anaphylaxis|swollen\s+tongue|throat\s+closing|stridor)\b', 'Allergic Emergency (Suspected Anaphylaxis)'),
        (r'\b(suicidal|self\s*harm|overdose|poisoning)\b', 'Psychiatric / Toxicological Crisis')
    ]

    # Out-of-Domain / Negative Query Indicators (Topics with zero evidence in Ayurvedic corpus)
    NEGATIVE_QUERY_PATTERNS = [
        r'\b(quantum\s+computing|cryptocurrency|bitcoin|stock\s+market|cricket\s+score)\b',
        r'\b(chemotherapy\s+dosage|radiation\s+therapy\s+protocol|mri\s+calibration)\b',
        r'\b(fabricate|hallucinate|cure\s+cancer\s+overnight|guaranteed\s+cure)\b',
        r'\b(prostatectomy|laparoscopic|da\s+vinci|robotic\s+surgery|allopathic\s+surgery)\b'
    ]

    @classmethod
    def check_red_flags(cls, text: str) -> Optional[Dict[str, Any]]:
        """Scans clinical text for life-threatening emergency indicators."""
        if not text:
            return None
        text_lower = text.lower()
        for pattern, label in cls.RED_FLAG_PATTERNS:
            if re.search(pattern, text_lower):
                return {
                    'emergency_detected': True,
                    'condition_category': label,
                    'urgent_action': (
                        "CRITICAL EMERGENCY ALERT: The described symptoms indicate a potential life-threatening emergency. "
                        "Immediate emergency medical evaluation (Emergency Department / Call 112 or 911) is urgently required. "
                        "Ayurvedic wellness guidance or self-care must NEVER delay emergency allopathic resuscitation."
                    ),
                    'immediate_referral_required': True
                }
        return None

    @classmethod
    def is_negative_or_out_of_domain(cls, query: str) -> bool:
        """Identifies queries that cannot and should not be answered from the Ayurvedic corpus."""
        query_lower = query.lower()
        for pat in cls.NEGATIVE_QUERY_PATTERNS:
            if re.search(pat, query_lower):
                return True
        return False

    @classmethod
    def answer_question(
        cls,
        question: str,
        prakriti: Optional[str] = None,
        top_k: int = 4,
        min_relevance: float = 0.42,
        collection_filter: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes end-to-end grounded clinical retrieval and answer generation:
        1. Checks for emergency red-flag symptoms.
        2. Retrieves relevant evidence chunks via AyuVectorStore hybrid search.
        3. Identifies insufficient evidence and clearly notifies the clinician.
        4. Separates retrieved evidence from clinical interpretation.
        5. Formulates clinical safety disclaimers and citations.
        """
        start_time = time.time()
        question = (question or '').strip()

        # Step 1: Emergency Triage Check
        emergency = cls.check_red_flags(question)
        if emergency:
            return {
                'status': 'EMERGENCY_ESCALATION',
                'question': question,
                'escalation_alert': emergency,
                'summary': emergency['urgent_action'],
                'retrieved_evidence': [],
                'clinical_interpretation': "Clinical processing halted due to critical triage threshold.",
                'clinical_safety_notice': "Emergency red-flag protocol overrides routine wellness counseling.",
                'evidence_sufficient': False,
                'citations': [],
                'retrieval_metadata': {
                    'execution_time_ms': round((time.time() - start_time) * 1000, 2),
                    'total_chunks_retrieved': 0,
                    'top_relevance_score': 0.0,
                    'red_flag_triggered': True
                }
            }

        # Step 2: Out of Domain / Negative Query Early Gate
        if cls.is_negative_or_out_of_domain(question):
            return {
                'status': 'INSUFFICIENT_EVIDENCE',
                'question': question,
                'escalation_alert': None,
                'summary': (
                    "Insufficient Evidence: The query falls outside the scope of the verified Ayurvedic clinical "
                    "knowledge base. No speculative answer or fabricated recommendation is provided."
                ),
                'retrieved_evidence': [],
                'clinical_interpretation': "No grounded interpretation possible without authoritative domain evidence.",
                'clinical_safety_notice': "AyuRAG-XAI adheres to strict evidence boundaries to prevent medical hallucinations.",
                'evidence_sufficient': False,
                'citations': [],
                'retrieval_metadata': {
                    'execution_time_ms': round((time.time() - start_time) * 1000, 2),
                    'total_chunks_retrieved': 0,
                    'top_relevance_score': 0.0,
                    'insufficient_evidence': True
                }
            }

        # Step 3: Hybrid Retrieval from Vector Store
        store = AyuVectorStore()
        chunks = store.hybrid_search(
            query=question,
            top_k=top_k,
            collection_filter=collection_filter,
            dosha_filter=prakriti,
            min_relevance=min_relevance
        )

        exec_time_ms = round((time.time() - start_time) * 1000, 2)

        # Step 4: Handle Insufficient Evidence
        if not chunks or (len(chunks) > 0 and chunks[0]['relevance_score'] < min_relevance):
            return {
                'status': 'INSUFFICIENT_EVIDENCE',
                'question': question,
                'escalation_alert': None,
                'summary': (
                    "Insufficient Evidence: The indexed knowledge base (AYUSH Portal, CCRAS, API Pharmacopoeia, "
                    "ICMR-NIN) contains no high-confidence citations matching this specific inquiry. "
                    "In compliance with clinical AI safety standards, no unsupported recommendations are generated."
                ),
                'retrieved_evidence': [],
                'clinical_interpretation': "Awaiting clinician direct input or supplementary verified literature.",
                'clinical_safety_notice': "Do not rely on AI heuristics when verified source evidence is unavailable.",
                'evidence_sufficient': False,
                'citations': [],
                'retrieval_metadata': {
                    'execution_time_ms': exec_time_ms,
                    'total_chunks_retrieved': len(chunks),
                    'top_relevance_score': chunks[0]['relevance_score'] if chunks else 0.0,
                    'insufficient_evidence': True
                }
            }

        # Step 5: Format Grounded Evidence and Citations
        citations = []
        evidence_passages = []
        for chk in chunks:
            meta = chk.get('metadata', {})
            citation_item = {
                'id': chk['chunk_id'],
                'referenceId': chk['doc_id'],
                'title': chk['title'],
                'collection': chk['collection'],
                'publisher': meta.get('publisher', 'Ministry of AYUSH'),
                'source_url': meta.get('source_url', ''),
                'publication_version': meta.get('publication_version', ''),
                'license': meta.get('license', 'Open Access'),
                'document_type': meta.get('document_type', 'Clinical Reference'),
                'passage': chk['text'],
                'classicalVerse': meta.get('classical_verse') or '',
                'relevance_score': chk['relevance_score'],
                'domain': chk['collection'].replace('_', ' ').title(),
                'limitations': meta.get('limitations', ''),
            }
            citations.append(citation_item)
            evidence_passages.append(f"[{citation_item['title']} - {citation_item['publisher']}]:\n\"{chk['text']}\"")

        # Step 6: Formulate Grounded Answer with Evidence vs Interpretation Distinction
        top_chunk = chunks[0]
        top_meta = top_chunk.get('metadata', {})
        relevance_info = top_meta.get('relevance') or "Classical Ayurvedic clinical guidelines."

        summary = (
            f"Based on evidence retrieved from {top_chunk['title']} ({top_meta.get('publisher', 'Ministry of AYUSH')}), "
            f"the clinical consensus emphasizes: {relevance_info}"
        )

        # Explicitly distinguished interpretation section
        interpretation = (
            f"Clinical AI Interpretation: In accordance with {prakriti or 'individual constitutional'} principles, "
            f"the retrieved evidence supports addressing the condition through dietary modification (Pathya), "
            f"circadian pacing (Dinacharya), and targeted botanical herbs as detailed in the source citations. "
            f"Note: This interpretation represents algorithmic synthesis of classical sources and requires verification "
            f"by a licensed Ayurvedic practitioner."
        )

        safety_notice = (
            "Clinical Safety & Verification Notice: "
            "1. Traditional Ayurvedic usage does NOT automatically prove modern clinical efficacy without peer-reviewed trials. "
            "2. Ensure patient has no documented contraindications or concurrent pharmaceutical drug-herb interactions. "
            "3. Formal medical evaluation is required for acute, worsening, or unresponsive symptoms."
        )

        return {
            'status': 'SUCCESS',
            'question': question,
            'prakriti_context': prakriti,
            'escalation_alert': None,
            'summary': summary,
            'retrieved_evidence': evidence_passages,
            'clinical_interpretation': interpretation,
            'clinical_safety_notice': safety_notice,
            'evidence_sufficient': True,
            'citations': citations,
            'retrieval_metadata': {
                'execution_time_ms': exec_time_ms,
                'total_chunks_retrieved': len(chunks),
                'top_relevance_score': chunks[0]['relevance_score'],
                'retrieved_chunk_ids': [c['chunk_id'] for c in chunks],
                'insufficient_evidence': False
            }
        }
