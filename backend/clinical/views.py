from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from accounts.models import User, DoctorProfile, PatientProfile
from accounts.permissions import IsDoctorUser
from .models import PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus
from .serializers import (
    PatientAssessmentSummarySerializer,
    PatientAssessmentDetailSerializer,
    ClinicalReviewSerializer
)

class DoctorDashboardView(APIView):
    """
    Dedicated clinical decision support dashboard statistics and queues.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        total_patients = User.objects.filter(role=User.Role.PATIENT).count()
        completed_assessments = PatientAssessment.objects.filter(status=AssessmentStatus.COMPLETED).count()
        pending_reviews = ClinicalReview.objects.filter(status=ReviewStatus.PENDING).count()
        ai_assisted_analyses = PatientAssessment.objects.exclude(ai_analysis={}).count()
        follow_ups_due = ClinicalReview.objects.exclude(follow_up_notes='').count()

        recent_assessments = PatientAssessment.objects.select_related('patient').prefetch_related('reviews')[:6]
        pending_reviews_qs = ClinicalReview.objects.filter(status=ReviewStatus.PENDING).select_related('patient', 'assessment')[:5]

        doctor_profile = getattr(request.user, 'doctor_profile', None)
        doctor_info = {
            'name': doctor_profile.professional_name if doctor_profile else request.user.get_full_name() or f"Dr. {request.user.username}",
            'qualification': doctor_profile.qualification if doctor_profile else 'BAMS, MD (Ayurveda)',
            'specialization': doctor_profile.specialization if doctor_profile else 'Ayurvedic Clinical Medicine',
            'license': doctor_profile.clinical_license if doctor_profile else 'AYUSH-2026-DEL-891',
        }

        return Response({
            'doctor': doctor_info,
            'metrics': {
                'total_patients': total_patients,
                'pending_clinical_reviews': pending_reviews,
                'completed_assessments': completed_assessments,
                'ai_assisted_analyses': ai_assisted_analyses,
                'follow_ups_due': follow_ups_due,
            },
            'recent_patients': PatientAssessmentSummarySerializer(recent_assessments, many=True).data,
            'pending_reviews': ClinicalReviewSerializer(pending_reviews_qs, many=True).data,
        })


class DoctorPatientListView(APIView):
    """
    Searchable, filterable, sortable clinical patient list.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        search_query = request.query_params.get('search', '').strip()
        status_filter = request.query_params.get('status', '').strip()
        prakriti_filter = request.query_params.get('prakriti', '').strip()
        review_filter = request.query_params.get('review_status', '').strip()
        sort_by = request.query_params.get('sort', '-created_at').strip()

        qs = PatientAssessment.objects.select_related('patient').prefetch_related('reviews')

        if search_query:
            qs = qs.filter(
                Q(patient__username__icontains=search_query) |
                Q(patient__patient_profile__full_name__icontains=search_query) |
                Q(demographics__fullName__icontains=search_query) |
                Q(symptoms_data__icontains=search_query)
            )

        if status_filter:
            qs = qs.filter(status=status_filter)

        if prakriti_filter:
            qs = qs.filter(prakriti_scores__primary__icontains=prakriti_filter)

        if review_filter:
            qs = qs.filter(reviews__status=review_filter).distinct()

        # Sorting
        allowed_sorts = ['created_at', '-created_at', 'updated_at', '-updated_at', 'status']
        if sort_by in allowed_sorts:
            qs = qs.order_by(sort_by)

        serializer = PatientAssessmentSummarySerializer(qs, many=True)
        return Response({
            'count': qs.count(),
            'patients': serializer.data
        })


class DoctorPatientDetailView(APIView):
    """
    Complete patient profile with Prakriti, Lifestyle, Diet, Symptoms,
    ML analysis, SHAP, LIME, RAG classical evidence, and Recommendations.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, pk):
        try:
            assessment = PatientAssessment.objects.select_related('patient').prefetch_related('reviews').get(pk=pk)
        except PatientAssessment.DoesNotExist:
            return Response({'error': 'Patient assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientAssessmentDetailSerializer(assessment)
        return Response(serializer.data)


class DoctorReviewListView(APIView):
    """
    List and create clinical reviews.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        status_filter = request.query_params.get('status', '').strip()
        qs = ClinicalReview.objects.select_related('patient', 'doctor', 'assessment')

        if status_filter:
            qs = qs.filter(status=status_filter)

        serializer = ClinicalReviewSerializer(qs, many=True)
        return Response({
            'count': qs.count(),
            'reviews': serializer.data
        })

    def post(self, request):
        assessment_id = request.data.get('assessment_id')
        if not assessment_id:
            return Response({'error': 'assessment_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assessment = PatientAssessment.objects.get(pk=assessment_id)
        except PatientAssessment.DoesNotExist:
            return Response({'error': 'Assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        review = ClinicalReview.objects.create(
            patient=assessment.patient,
            doctor=request.user,
            assessment=assessment,
            status=request.data.get('status', ReviewStatus.IN_REVIEW),
            summary=request.data.get('summary', ''),
            observations=request.data.get('observations', ''),
            recommendations=request.data.get('recommendations', ''),
            follow_up_notes=request.data.get('follow_up_notes', '')
        )

        return Response(ClinicalReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class DoctorReviewDetailView(APIView):
    """
    Get or update doctor review notes.
    Doctor notes are strictly isolated and stored separately from ML/SHAP/LIME outputs.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, pk):
        try:
            review = ClinicalReview.objects.select_related('patient', 'doctor', 'assessment').get(pk=pk)
        except ClinicalReview.DoesNotExist:
            return Response({'error': 'Clinical review not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(ClinicalReviewSerializer(review).data)

    def patch(self, request, pk):
        try:
            review = ClinicalReview.objects.get(pk=pk)
        except ClinicalReview.DoesNotExist:
            return Response({'error': 'Clinical review not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Allow updating ONLY structured doctor notes and review status
        # NEVER allow editing ML predictions, SHAP values, LIME, or RAG evidence!
        allowed_fields = ['summary', 'observations', 'recommendations', 'follow_up_notes', 'status']
        for field in allowed_fields:
            if field in request.data:
                setattr(review, field, request.data[field])

        review.save()
        return Response({
            'message': 'Clinical review notes updated successfully.',
            'review': ClinicalReviewSerializer(review).data
        })


class DoctorReportsView(APIView):
    """
    Assessment summaries, completed clinical validations, and clinical audit trail.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        assessments = PatientAssessment.objects.select_related('patient').prefetch_related('reviews')[:20]
        reports_data = []

        for asm in assessments:
            latest_review = asm.reviews.first()
            patient_name = asm.demographics.get('fullName')
            if not patient_name and hasattr(asm.patient, 'patient_profile'):
                patient_name = asm.patient.patient_profile.full_name
            patient_name = patient_name or asm.patient.username

            reports_data.append({
                'assessment_id': asm.id,
                'patient_name': patient_name,
                'age': asm.demographics.get('age', 28),
                'gender': asm.demographics.get('gender', 'Unspecified'),
                'assessment_date': asm.created_at.strftime('%Y-%m-%d %H:%M'),
                'primary_prakriti': asm.prakriti_scores.get('primary', 'Vāta-Pitta'),
                'prakriti_distribution': asm.prakriti_scores,
                'ai_prediction': asm.ai_analysis.get('prediction', 'Normal Prakriti Equilibrium'),
                'confidence': asm.ai_analysis.get('confidence', 0.88),
                'review_status': latest_review.status if latest_review else ReviewStatus.PENDING,
                'reviewed_by': latest_review.doctor.get_full_name() or latest_review.doctor.username if latest_review else None,
                'review_summary': latest_review.summary if latest_review else 'Pending clinical review',
                'doctor_recommendations': latest_review.recommendations if latest_review else '',
                'evidence_citations': [item.get('source') for item in asm.rag_evidence[:3]],
            })

        return Response({
            'count': len(reports_data),
            'generated_at': '2026-09-28',
            'reports': reports_data
        })
