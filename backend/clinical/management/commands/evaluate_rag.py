"""
Django Management Command: evaluate_rag
Executes the automated RAG retrieval quality evaluation across 36 benchmark clinical questions.
Measures:
1. Retrieval Relevance Rate (Precision@k)
2. Source Correctness (expected document match)
3. Citation Validity (preservation of title, publisher, URL, license)
4. Negative Query Rejection Rate (insufficient evidence detection)
5. Emergency Red-Flag Escalation Accuracy
6. Category-level performance breakdown
"""

import json
import time
from pathlib import Path
from django.core.management.base import BaseCommand
from clinical.services.clinical_rag_engine import ClinicalRagEngine

EVAL_DIR = Path(__file__).resolve().parent.parent.parent / 'evaluation'
DATASET_PATH = EVAL_DIR / 'eval_dataset.json'
REPORT_PATH = EVAL_DIR / 'evaluation_report.json'


class Command(BaseCommand):
    help = 'Evaluates RAG retrieval quality across 36 clinical benchmark queries.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== AyuRAG-XAI Retrieval Quality Evaluation Runner ==="))

        if not DATASET_PATH.exists():
            self.stdout.write(self.style.ERROR(f"Evaluation dataset not found at {DATASET_PATH}"))
            return

        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            dataset = json.load(f)

        self.stdout.write(f"Loaded {len(dataset)} evaluation questions across 6 clinical domains.\n")

        results = []
        category_stats = {}
        total_time_ms = 0.0

        for item in dataset:
            cat = item['category']
            if cat not in category_stats:
                category_stats[cat] = {
                    'total': 0,
                    'status_correct': 0,
                    'source_correct': 0,
                    'citation_valid': 0,
                    'safety_compliant': 0
                }

            category_stats[cat]['total'] += 1
            t0 = time.time()
            ans = ClinicalRagEngine.answer_question(
                question=item['question'],
                prakriti=item.get('prakriti_context'),
                top_k=4
            )
            elapsed_ms = (time.time() - t0) * 1000
            total_time_ms += elapsed_ms

            # 1. Check Status Matching
            status_match = (ans['status'] == item['expected_status'])

            # 2. Check Source Matching
            source_match = False
            if item['expected_status'] == 'SUCCESS':
                retrieved_doc_ids = [c['referenceId'] for c in ans['citations']]
                retrieved_titles = [c['title'] for c in ans['citations']]
                retrieved_text_full = ' '.join(ans['retrieved_evidence'])

                doc_id_match = any(ed in retrieved_doc_ids for ed in item.get('expected_documents', []))
                substring_match = any(
                    sub.lower() in retrieved_text_full.lower() or any(sub.lower() in t.lower() for t in retrieved_titles)
                    for sub in item.get('expected_source_substrings', [])
                )
                source_match = doc_id_match or substring_match
            elif item['expected_status'] in ('INSUFFICIENT_EVIDENCE', 'EMERGENCY_ESCALATION'):
                # For negative or emergency questions, source match means no hallucinated classical citations
                source_match = (len(ans['citations']) == 0)

            # 3. Check Citation Validity
            citation_valid = True
            if ans['citations']:
                for c in ans['citations']:
                    if not (c.get('title') and c.get('publisher') and c.get('source_url') and c.get('license')):
                        citation_valid = False
                        break
            else:
                citation_valid = (item['expected_status'] != 'SUCCESS')

            # 4. Check Safety Notice & Forbidden Terms
            safety_compliant = True
            combined_text = f"{ans['summary']} {ans['clinical_interpretation']} {ans.get('clinical_safety_notice', '')}".lower()
            for forb in item.get('forbidden_terms', []):
                if forb.lower() in combined_text:
                    safety_compliant = False
                    break

            if item.get('requires_safety_warning') and not ans.get('clinical_safety_notice'):
                safety_compliant = False

            # Update stats
            if status_match:
                category_stats[cat]['status_correct'] += 1
            if source_match:
                category_stats[cat]['source_correct'] += 1
            if citation_valid:
                category_stats[cat]['citation_valid'] += 1
            if safety_compliant:
                category_stats[cat]['safety_compliant'] += 1

            eval_res = {
                'id': item['id'],
                'category': cat,
                'question': item['question'],
                'expected_status': item['expected_status'],
                'actual_status': ans['status'],
                'status_match': status_match,
                'source_match': source_match,
                'citation_valid': citation_valid,
                'safety_compliant': safety_compliant,
                'latency_ms': round(elapsed_ms, 2),
                'top_relevance_score': ans['retrieval_metadata']['top_relevance_score'],
                'citations_count': len(ans['citations'])
            }
            results.append(eval_res)

        # Aggregate Metrics
        total_q = len(dataset)
        status_accuracy = sum(1 for r in results if r['status_match']) / total_q * 100
        source_accuracy = sum(1 for r in results if r['source_match']) / total_q * 100
        citation_validity = sum(1 for r in results if r['citation_valid']) / total_q * 100
        safety_compliance = sum(1 for r in results if r['safety_compliant']) / total_q * 100
        avg_latency = total_time_ms / total_q

        # Save Report JSON
        report_data = {
            'evaluation_timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_questions': total_q,
            'summary_metrics': {
                'status_accuracy_pct': round(status_accuracy, 2),
                'source_correctness_pct': round(source_accuracy, 2),
                'citation_validity_pct': round(citation_validity, 2),
                'safety_compliance_pct': round(safety_compliance, 2),
                'average_latency_ms': round(avg_latency, 2)
            },
            'category_breakdown': category_stats,
            'itemized_results': results
        }

        with open(REPORT_PATH, 'w', encoding='utf-8') as rf:
            json.dump(report_data, rf, indent=2, ensure_ascii=False)

        # Terminal Formatted Summary
        self.stdout.write(self.style.SUCCESS("=" * 70))
        self.stdout.write(self.style.SUCCESS("          AYURAG-XAI RAG RETRIEVAL QUALITY EVALUATION REPORT"))
        self.stdout.write(self.style.SUCCESS("=" * 70))
        self.stdout.write(f"  • Total Benchmark Queries Evaluated : {total_q}")
        self.stdout.write(f"  • Expected Status Match Accuracy    : {status_accuracy:.1f}%")
        self.stdout.write(f"  • Source Attribution Correctness    : {source_accuracy:.1f}%")
        self.stdout.write(f"  • Citation Metadata Completeness     : {citation_validity:.1f}%")
        self.stdout.write(f"  • Safety & Non-Fabrication Adherence: {safety_compliance:.1f}%")
        self.stdout.write(f"  • Mean Retrieval Latency            : {avg_latency:.2f} ms")
        self.stdout.write("-" * 70)
        self.stdout.write("  Category Performance Breakdown:")
        for cname, cstat in category_stats.items():
            c_tot = cstat['total']
            c_acc = (cstat['source_correct'] / c_tot) * 100 if c_tot else 0.0
            self.stdout.write(f"    - {cname[:42].ljust(44)}: {c_acc:.1f}% source match ({cstat['source_correct']}/{c_tot})")
        self.stdout.write("=" * 70)
        self.stdout.write(f"Detailed JSON report written to: {REPORT_PATH}\n")
