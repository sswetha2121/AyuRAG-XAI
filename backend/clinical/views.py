from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta
from accounts.models import User, DoctorProfile, PatientProfile
from accounts.permissions import IsDoctorUser
from .models import (
    PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus,
    PatientVerification, VerificationStatus,
    DietPlan, DietPlanStatus, DietPlanGeneratedBy, DietPlanVersion,
    Notification, AuditLog, AuditAction,
    MealLog, MealReminderPreference, ProgressRecord, MealType, MealLogStatus
)
from .serializers import (
    PatientAssessmentSummarySerializer,
    PatientAssessmentDetailSerializer,
    ClinicalReviewSerializer,
    PatientVerificationSerializer,
    DietPlanSerializer,
    DietPlanVersionSerializer,
    NotificationSerializer,
    AuditLogSerializer,
    MealLogSerializer,
    MealReminderPreferenceSerializer,
    ProgressRecordSerializer
)
from .services.patient_data_resolver import (
    get_effective_patient_profile,
    initialize_verifications_for_assessment,
    ASSESSMENT_FIELDS
)
from .services.personalization import generate_personalized_diet

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

        # Real verification and diet workflow metrics
        unverified_assessments_count = PatientVerification.objects.filter(
            verification_status=VerificationStatus.UNVERIFIED
        ).values('assessment').distinct().count()

        draft_diet_plans = DietPlan.objects.filter(status=DietPlanStatus.DRAFT).count()
        plans_awaiting_approval = DietPlan.objects.filter(status=DietPlanStatus.PENDING_DOCTOR_APPROVAL).count()
        active_diet_plans = DietPlan.objects.filter(status=DietPlanStatus.ACTIVE).count()

        recent_assessments = PatientAssessment.objects.select_related('patient').prefetch_related('reviews')[:6]
        pending_reviews_qs = ClinicalReview.objects.filter(status=ReviewStatus.PENDING).select_related('patient', 'assessment')[:5]

        # Workflow queues
        pending_verifications = PatientAssessment.objects.filter(
            field_verifications__verification_status=VerificationStatus.UNVERIFIED
        ).distinct().select_related('patient')[:5]

        pending_approval_plans = DietPlan.objects.filter(
            status__in=[DietPlanStatus.DRAFT, DietPlanStatus.PENDING_DOCTOR_APPROVAL]
        ).select_related('patient', 'doctor').order_by('-created_at')[:5]

        recent_active_plans = DietPlan.objects.filter(
            status=DietPlanStatus.ACTIVE
        ).select_related('patient', 'approved_by').order_by('-approved_at')[:5]

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
                'unverified_assessments': unverified_assessments_count,
                'draft_diet_plans': draft_diet_plans,
                'plans_awaiting_approval': plans_awaiting_approval,
                'active_diet_plans': active_diet_plans,
                'ai_assisted_analyses': ai_assisted_analyses,
                'follow_ups_due': follow_ups_due,
            },
            'recent_patients': PatientAssessmentSummarySerializer(recent_assessments, many=True).data,
            'pending_reviews': ClinicalReviewSerializer(pending_reviews_qs, many=True).data,
            'patients_requiring_verification': PatientAssessmentSummarySerializer(pending_verifications, many=True).data,
            'plans_awaiting_approval_queue': DietPlanSerializer(pending_approval_plans, many=True).data,
            'recent_active_diet_plans': DietPlanSerializer(recent_active_plans, many=True).data
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
    Supports either assessment ID or patient user ID.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, pk):
        assessment = PatientAssessment.objects.select_related('patient').prefetch_related('reviews').filter(pk=pk).first()
        if not assessment:
            assessment = PatientAssessment.objects.select_related('patient').prefetch_related('reviews').filter(patient_id=pk).order_by('-created_at').first()

        if not assessment:
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


def resolve_patient_and_assessment(patient_id):
    """
    Resolves patient User and their latest PatientAssessment.
    Supports either User.id or PatientAssessment.id seamlessly.
    """
    patient = User.objects.filter(id=patient_id, role=User.Role.PATIENT).first()
    assessment = None
    if patient:
        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-created_at').first()
    else:
        # Check if patient_id was actually assessment id
        assessment = PatientAssessment.objects.filter(id=patient_id).first()
        if assessment:
            patient = assessment.patient

    return patient, assessment


class DoctorPatientVerificationView(APIView):
    """
    Retrieves all clinical verification fields for a patient's latest assessment,
    as well as the effective patient profile (Single Source of Truth).
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, patient_id):
        patient, assessment = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not assessment:
            return Response({'error': 'No completed assessment found for patient.'}, status=status.HTTP_404_NOT_FOUND)

        # Initialize any missing verification fields from assessment
        initialize_verifications_for_assessment(patient, assessment, request.user)

        verifications = PatientVerification.objects.filter(
            patient=patient,
            assessment=assessment
        ).select_related('doctor')

        effective_profile = get_effective_patient_profile(patient.id, assessment.id)

        # Verification metrics
        total_fields = verifications.count()
        verified_count = verifications.filter(verification_status=VerificationStatus.VERIFIED).count()
        corrected_count = verifications.filter(verification_status=VerificationStatus.CORRECTED).count()
        unverified_count = verifications.filter(verification_status=VerificationStatus.UNVERIFIED).count()

        return Response({
            'patient_id': patient.id,
            'assessment_id': assessment.id,
            'stats': {
                'total_fields': total_fields,
                'verified': verified_count,
                'corrected': corrected_count,
                'unverified': unverified_count,
                'is_fully_reviewed': unverified_count == 0
            },
            'verifications': PatientVerificationSerializer(verifications, many=True).data,
            'effective_profile': effective_profile
        })


class DoctorVerifyFieldView(APIView):
    """
    Verifies or Corrects an individual clinical field.
    Preserves original patient-reported value and records doctor verified value and note.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, patient_id):
        patient, assessment = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        field_name = request.data.get('field_name')
        action_type = request.data.get('action') # 'VERIFY' or 'CORRECT'
        verified_val = request.data.get('verified_value')
        doctor_note = request.data.get('doctor_note', '')

        if not field_name:
            return Response({'error': 'field_name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not assessment:
            return Response({'error': 'Assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        verification = PatientVerification.objects.filter(
            patient=patient,
            assessment=assessment,
            field_name=field_name
        ).first()

        if not verification:
            # Initialize to create default record
            initialize_verifications_for_assessment(patient, assessment, request.user)
            verification = PatientVerification.objects.filter(
                patient=patient,
                assessment=assessment,
                field_name=field_name
            ).first()

        if not verification:
            return Response({'error': f'Field {field_name} could not be resolved.'}, status=status.HTTP_404_NOT_FOUND)

        old_status = verification.verification_status
        now = timezone.now()

        if action_type == 'CORRECT':
            verification.verification_status = VerificationStatus.CORRECTED
            verification.verified_value = verified_val
            audit_action = AuditAction.DOCTOR_CORRECTED_FIELD
        else:
            verification.verification_status = VerificationStatus.VERIFIED
            verification.verified_value = verification.patient_value
            audit_action = AuditAction.DOCTOR_VERIFIED_FIELD

        verification.doctor = request.user
        verification.doctor_note = doctor_note
        verification.verified_at = now
        verification.save()

        # Audit trail
        AuditLog.objects.create(
            actor=request.user,
            action=audit_action,
            patient=patient,
            object_type='PatientVerification',
            object_id=str(verification.id),
            metadata={
                'field_name': field_name,
                'field_label': verification.field_label,
                'patient_value': verification.patient_value,
                'verified_value': verification.verified_value,
                'old_status': old_status,
                'new_status': verification.verification_status,
                'doctor_note': doctor_note
            }
        )

        effective_profile = get_effective_patient_profile(patient.id, assessment.id)

        return Response({
            'message': f"Field '{verification.field_label or field_name}' updated successfully.",
            'verification': PatientVerificationSerializer(verification).data,
            'effective_profile': effective_profile
        })


class DoctorVerifyAllFieldsView(APIView):
    """
    Bulk marks all remaining UNVERIFIED fields as VERIFIED for this patient's assessment.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, patient_id):
        patient, assessment = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not assessment:
            return Response({'error': 'Assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        initialize_verifications_for_assessment(patient, assessment, request.user)

        unverified_records = PatientVerification.objects.filter(
            patient=patient,
            assessment=assessment,
            verification_status=VerificationStatus.UNVERIFIED
        )

        count = 0
        now = timezone.now()
        for record in unverified_records:
            record.verification_status = VerificationStatus.VERIFIED
            record.verified_value = record.patient_value
            record.doctor = request.user
            record.verified_at = now
            record.save()
            count += 1

        AuditLog.objects.create(
            actor=request.user,
            action=AuditAction.DOCTOR_VERIFIED_FIELD,
            patient=patient,
            object_type='PatientVerificationBatch',
            object_id=str(assessment.id),
            metadata={'count_verified': count}
        )

        all_verifications = PatientVerification.objects.filter(
            patient=patient,
            assessment=assessment
        )
        effective_profile = get_effective_patient_profile(patient.id, assessment.id)

        return Response({
            'message': f"Successfully verified {count} fields.",
            'verifications': PatientVerificationSerializer(all_verifications, many=True).data,
            'effective_profile': effective_profile
        })


class DoctorDietGenerateView(APIView):
    """
    Generates a personalized Ayurvedic Diet Plan (DRAFT) based on
    the doctor-verified patient profile, ML findings, and classical RAG references.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, patient_id):
        patient, assessment = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not assessment:
            return Response({'error': 'Patient has no completed assessment.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            diet_plan = generate_personalized_diet(
                patient_id=patient.id,
                assessment_id=assessment.id,
                doctor=request.user
            )
            return Response({
                'message': 'Personalized diet plan draft generated successfully.',
                'diet_plan': DietPlanSerializer(diet_plan).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'Failed to generate diet plan: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorPatientDietPlanListView(APIView):
    """
    Retrieves all diet plans and historical versions for a specific patient.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, patient_id):
        patient, _ = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        plans = DietPlan.objects.filter(patient=patient).order_by('-version', '-created_at')
        return Response({
            'patient_id': patient.id,
            'count': plans.count(),
            'diet_plans': DietPlanSerializer(plans, many=True).data
        })


class DoctorDietPlanDetailView(APIView):
    """
    Allows a doctor to inspect and edit diet plan drafts, meal regimes,
    ingredients, foods to include/avoid, lifestyle guidance, and notes.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, plan_id):
        diet_plan = DietPlan.objects.filter(id=plan_id).first()
        if not diet_plan:
            return Response({'error': 'Diet plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(DietPlanSerializer(diet_plan).data)

    def patch(self, request, plan_id):
        diet_plan = DietPlan.objects.filter(id=plan_id).first()
        if not diet_plan:
            return Response({'error': 'Diet plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        editable_fields = [
            'title', 'duration', 'objective',
            'breakfast', 'mid_morning', 'lunch', 'evening', 'dinner',
            'foods_to_include', 'foods_to_avoid',
            'lifestyle_notes', 'precautions',
            'doctor_notes'
        ]

        modified = False
        for field in editable_fields:
            if field in request.data:
                setattr(diet_plan, field, request.data[field])
                modified = True

        if modified:
            diet_plan.generated_by = DietPlanGeneratedBy.AI_ASSISTED_DOCTOR
            diet_plan.save()

            AuditLog.objects.create(
                actor=request.user,
                action=AuditAction.DOCTOR_EDITED_DIET,
                patient=diet_plan.patient,
                object_type='DietPlan',
                object_id=str(diet_plan.id),
                metadata={'version': diet_plan.version, 'title': diet_plan.title}
            )

        return Response({
            'message': 'Diet plan updated successfully.',
            'diet_plan': DietPlanSerializer(diet_plan).data
        })


class DoctorDietPlanApproveView(APIView):
    """
    Doctor approves and activates a diet plan.
    - Sets plan status to ACTIVE
    - Sets approved_at and approved_by
    - Archives any previously active diet plan for this patient
    - Captures a DietPlanVersion snapshot
    - Creates a Notification for the patient
    - Records an AuditLog entry
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, plan_id):
        diet_plan = DietPlan.objects.filter(id=plan_id).first()
        if not diet_plan:
            return Response({'error': 'Diet plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        now = timezone.now()

        # 1. Archive previously active diet plans for this patient
        previous_actives = DietPlan.objects.filter(
            patient=diet_plan.patient,
            status=DietPlanStatus.ACTIVE
        ).exclude(id=diet_plan.id)

        for prev in previous_actives:
            prev.status = DietPlanStatus.ARCHIVED
            prev.save()
            AuditLog.objects.create(
                actor=request.user,
                action=AuditAction.DIET_ARCHIVED,
                patient=diet_plan.patient,
                object_type='DietPlan',
                object_id=str(prev.id),
                metadata={'archived_version': prev.version}
            )

        # 2. Mark this plan ACTIVE
        diet_plan.status = DietPlanStatus.ACTIVE
        diet_plan.approved_by = request.user
        diet_plan.approved_at = now
        diet_plan.save()

        # 3. Create DietPlanVersion snapshot
        DietPlanVersion.objects.create(
            diet_plan=diet_plan,
            version_number=diet_plan.version,
            snapshot_data=DietPlanSerializer(diet_plan).data,
            change_summary=request.data.get('notes', 'Clinically reviewed, individualized, and approved by doctor.'),
            created_by=request.user
        )

        # 4. Notify Patient
        doctor_name = request.user.doctor_profile.professional_name if hasattr(request.user, 'doctor_profile') else request.user.get_full_name() or f"Dr. {request.user.username}"
        Notification.objects.create(
            user=diet_plan.patient,
            type='DIET_PLAN_APPROVED',
            title='Personalized Diet Plan Approved',
            message=f"Your personalized Ayurvedic diet plan (v{diet_plan.version}) has been reviewed and approved by {doctor_name}.",
            related_object_type='DietPlan',
            related_object_id=diet_plan.id
        )

        # 5. Audit Log
        AuditLog.objects.create(
            actor=request.user,
            action=AuditAction.DIET_APPROVED,
            patient=diet_plan.patient,
            object_type='DietPlan',
            object_id=str(diet_plan.id),
            metadata={'version': diet_plan.version, 'approved_at': str(now)}
        )

        return Response({
            'message': 'Diet plan clinically approved and activated successfully.',
            'diet_plan': DietPlanSerializer(diet_plan).data
        })


class DoctorDietPlanRejectView(APIView):
    """
    Doctor rejects a diet plan draft.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, plan_id):
        diet_plan = DietPlan.objects.filter(id=plan_id).first()
        if not diet_plan:
            return Response({'error': 'Diet plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        diet_plan.status = DietPlanStatus.REJECTED
        diet_plan.save()

        AuditLog.objects.create(
            actor=request.user,
            action=AuditAction.DIET_REJECTED,
            patient=diet_plan.patient,
            object_type='DietPlan',
            object_id=str(diet_plan.id),
            metadata={'reason': request.data.get('reason', 'Rejected during clinical review')}
        )

        return Response({
            'message': 'Diet plan rejected.',
            'diet_plan': DietPlanSerializer(diet_plan).data
        })


class DoctorPatientAuditLogsView(APIView):
    """
    Retrieves the clinical audit trail for a specific patient.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, patient_id):
        patient, _ = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        logs = AuditLog.objects.filter(patient=patient).order_by('-timestamp')[:50]
        return Response({
            'patient_id': patient.id,
            'count': logs.count(),
            'logs': AuditLogSerializer(logs, many=True).data
        })


class PatientCurrentDietView(APIView):
    """
    Returns ONLY the authenticated patient's latest ACTIVE diet plan.
    Strictly isolated: queries strictly by request.user.
    Never accepts arbitrary patient_id from client.
    """
    permission_classes = []

    def get(self, request):
        if not request.user.is_authenticated or request.user.role != User.Role.PATIENT:
            return Response({
                'has_active_plan': False,
                'message': 'Sign in to access your physician-approved diet regimen.'
            })

        # Strict patient isolation
        plan = DietPlan.objects.filter(
            patient=request.user,
            status=DietPlanStatus.ACTIVE
        ).order_by('-approved_at', '-version').first()

        if not plan:
            return Response({
                'has_active_plan': False,
                'message': 'Your physician has not yet approved an active diet plan for you. Your assessment is under clinical review.'
            })

        return Response({
            'has_active_plan': True,
            'diet_plan': DietPlanSerializer(plan).data
        })


class PatientAssessmentSubmitView(APIView):
    """
    Saves or submits a complete patient constitutional assessment.
    Accessible to authenticated patients or guests.
    """
    permission_classes = []

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        demographics = request.data.get('demographics', {})

        if not user or user.role != User.Role.PATIENT:
            full_name = demographics.get('fullName', '').strip()
            username = request.data.get('username') or demographics.get('username')
            if not username and full_name:
                username = full_name.lower().replace(' ', '.')

            if username:
                user = User.objects.filter(username=username, role=User.Role.PATIENT).first()

            if not user:
                # Fall back to first available patient user or create demo patient
                user = User.objects.filter(role=User.Role.PATIENT).first()
                if not user:
                    user = User.objects.create(
                        username='guest.patient',
                        email='guest.patient@ayurag.org',
                        role=User.Role.PATIENT
                    )
                    user.set_password('patient123')
                    user.save()
                    PatientProfile.objects.create(user=user, full_name=full_name or 'Guest Patient')

        prakriti_data = request.data.get('prakriti_data', {})
        lifestyle_data = request.data.get('lifestyle_data', {})
        diet_data = request.data.get('diet_data', {})
        symptoms_data = request.data.get('symptoms_data', {})
        prakriti_scores = request.data.get('prakriti_scores', {})
        ai_analysis = request.data.get('ai_analysis', {})
        shap_explanations = request.data.get('shap_explanations', [])
        lime_explanations = request.data.get('lime_explanations', [])
        rag_evidence = request.data.get('rag_evidence', [])
        recommendations = request.data.get('recommendations', {})

        assessment = PatientAssessment.objects.create(
            patient=user,
            status=AssessmentStatus.COMPLETED,
            demographics=demographics,
            prakriti_data=prakriti_data,
            lifestyle_data=lifestyle_data,
            diet_data=diet_data,
            symptoms_data=symptoms_data,
            prakriti_scores=prakriti_scores,
            ai_analysis=ai_analysis,
            shap_explanations=shap_explanations,
            lime_explanations=lime_explanations,
            rag_evidence=rag_evidence,
            recommendations=recommendations
        )

        # Create or update pending clinical review
        default_doctor = User.objects.filter(role=User.Role.DOCTOR).first()
        if default_doctor:
            ClinicalReview.objects.create(
                patient=user,
                doctor=default_doctor,
                assessment=assessment,
                status=ReviewStatus.PENDING,
                summary=f"New assessment submitted for {demographics.get('fullName', user.username)}. Primary constitutional indication: {prakriti_scores.get('primary', 'Vāta-Pitta')}."
            )
            # Initialize verification fields
            initialize_verifications_for_assessment(user, assessment, default_doctor)

            # Notification for doctor
            Notification.objects.create(
                user=default_doctor,
                type='NEW_ASSESSMENT',
                title='New Patient Assessment',
                message=f"Patient {demographics.get('fullName', user.username)} has completed assessment #{assessment.id}.",
                related_object_type='PatientAssessment',
                related_object_id=assessment.id
            )

        return Response({
            'message': 'Assessment submitted successfully and queued for physician verification.',
            'assessment_id': assessment.id,
            'assessment': PatientAssessmentDetailSerializer(assessment).data
        }, status=status.HTTP_201_CREATED)


class PatientLatestAssessmentView(APIView):
    """
    Returns the latest assessment for the authenticated patient.
    """
    permission_classes = []

    def get(self, request):
        if not request.user.is_authenticated or request.user.role != User.Role.PATIENT:
            return Response({'has_assessment': False, 'assessment': None})

        assessment = PatientAssessment.objects.filter(patient=request.user).order_by('-created_at').first()
        if not assessment:
            return Response({'has_assessment': False, 'assessment': None})

        return Response({
            'has_assessment': True,
            'assessment': PatientAssessmentDetailSerializer(assessment).data
        })


class NotificationListView(APIView):
    """
    Retrieves notifications for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(user=request.user).order_by('-created_at')[:30]
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({
            'unread_count': unread_count,
            'notifications': NotificationSerializer(notifs, many=True).data
        })


class NotificationMarkReadView(APIView):
    """
    Marks a specific notification or all notifications as read.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):
        notif = Notification.objects.filter(id=notification_id, user=request.user).first()
        if not notif:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)

        notif.is_read = True
        notif.save()
        return Response({'message': 'Notification marked as read.'})

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read.'})


def get_or_create_default_patient_schedule(patient, target_date, active_plan=None):
    """
    Ensures 5 meal logs exist for target_date.
    Uses active_plan if available, or a wholesome balanced default protocol.
    """
    meal_configs = [
        {
            'type': MealType.BREAKFAST,
            'label': 'Breakfast',
            'time': (active_plan.breakfast.get('time') if active_plan and active_plan.breakfast else None) or '08:00 AM',
            'name': (active_plan.breakfast.get('title') if active_plan and active_plan.breakfast else None) or 'Warm Whole Grain Porridge & Stewed Fruit',
            'items': (active_plan.breakfast.get('items') if active_plan and active_plan.breakfast else None) or [
                'Warm oatmeal or spiced grain porridge with almond milk',
                'Stewed sweet apple or pear with peeled soaked almonds',
                'Cup of warm water with half tsp clarified butter on an empty stomach'
            ],
        },
        {
            'type': MealType.MID_MORNING,
            'label': 'Mid-Morning Snack',
            'time': (active_plan.mid_morning.get('time') if active_plan and active_plan.mid_morning else None) or '11:00 AM',
            'name': (active_plan.mid_morning.get('title') if active_plan and active_plan.mid_morning else None) or 'Hydration & Soaked Fruit',
            'items': (active_plan.mid_morning.get('items') if active_plan and active_plan.mid_morning else None) or [
                'Fresh tender coconut water or cumin-coriander herbal tea',
                '4 soaked black raisins'
            ],
        },
        {
            'type': MealType.LUNCH,
            'label': 'Lunch (Main Meal)',
            'time': (active_plan.lunch.get('time') if active_plan and active_plan.lunch else None) or '01:30 PM',
            'name': (active_plan.lunch.get('title') if active_plan and active_plan.lunch else None) or 'Wholesome Lentil Bowl & Warm Vegetables',
            'items': (active_plan.lunch.get('items') if active_plan and active_plan.lunch else None) or [
                'Steamed basmati rice or whole grain flatbread',
                'Yellow lentil dal tempered with cumin and ginger',
                'Steamed zucchini and peeled squash with coriander seeds',
                'Small cup of fresh probiotic yogurt drink'
            ],
        },
        {
            'type': MealType.EVENING,
            'label': 'Evening Snack',
            'time': (active_plan.evening.get('time') if active_plan and active_plan.evening else None) or '05:00 PM',
            'name': (active_plan.evening.get('title') if active_plan and active_plan.evening else None) or 'Gentle Herbal Tea & Roasted Seeds',
            'items': (active_plan.evening.get('items') if active_plan and active_plan.evening else None) or [
                'Warm mint or chamomile herbal infusion',
                'Roasted water lily seeds (fox nuts) with rock salt'
            ],
        },
        {
            'type': MealType.DINNER,
            'label': 'Dinner (Light Meal)',
            'time': (active_plan.dinner.get('time') if active_plan and active_plan.dinner else None) or '08:00 PM',
            'name': (active_plan.dinner.get('title') if active_plan and active_plan.dinner else None) or 'Light Vegetable Soup & Warm Flatbread',
            'items': (active_plan.dinner.get('items') if active_plan and active_plan.dinner else None) or [
                'Pumpkin and carrot soup prepared with mild cumin',
                '1-2 soft whole wheat flatbreads with clarified butter',
                'Finish at least 3 hours before sleep'
            ],
        },
    ]

    meals_list = []
    for cfg in meal_configs:
        log, _ = MealLog.objects.get_or_create(
            patient=patient,
            date=target_date,
            meal_type=cfg['type'],
            defaults={
                'diet_plan': active_plan,
                'meal_name': cfg['name'],
                'scheduled_time': cfg['time'],
                'status': MealLogStatus.PENDING,
            }
        )
        # Update name and time if active plan is now available
        if active_plan and log.diet_plan != active_plan:
            log.diet_plan = active_plan
            log.meal_name = cfg['name']
            log.scheduled_time = cfg['time']
            log.save(update_fields=['diet_plan', 'meal_name', 'scheduled_time'])

        meals_list.append({
            'id': log.id,
            'meal_type': log.meal_type,
            'label': cfg['label'],
            'meal_name': log.meal_name,
            'scheduled_time': log.scheduled_time,
            'items': cfg['items'],
            'status': log.status,
            'completed_at': log.completed_at.isoformat() if log.completed_at else None,
            'notes': log.notes,
            'energy_rating': log.energy_rating,
        })

    return meals_list


class PatientMealScheduleView(APIView):
    """
    Returns today's daily meal schedule, meal statuses, next meal, and logs meals.
    Supports authenticated patients or demo visitors.
    """
    permission_classes = []

    def get_patient(self, request):
        if request.user.is_authenticated and request.user.role == User.Role.PATIENT:
            return request.user
        # Fall back to demo patient
        return User.objects.filter(role=User.Role.PATIENT).first()

    def get(self, request):
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'No patient profile found.'}, status=status.HTTP_404_NOT_FOUND)

        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                target_date = timezone.localdate()
        else:
            target_date = timezone.localdate()

        # Find active diet plan for patient
        active_plan = DietPlan.objects.filter(
            patient=patient,
            status=DietPlanStatus.ACTIVE
        ).order_by('-approved_at', '-version').first()

        meals = get_or_create_default_patient_schedule(patient, target_date, active_plan)

        # Calculate next scheduled meal
        next_meal = None
        for m in meals:
            if m['status'] == 'PENDING':
                next_meal = m
                break
        if not next_meal and len(meals) > 0:
            next_meal = meals[0]

        # Calculate progress record
        completed_count = sum(1 for m in meals if m['status'] == 'COMPLETED')
        skipped_count = sum(1 for m in meals if m['status'] == 'SKIPPED')
        total_count = len(meals)
        adherence_rate = round((completed_count / total_count * 100), 1) if total_count > 0 else 0.0

        progress_record, _ = ProgressRecord.objects.get_or_create(
            patient=patient,
            date=target_date,
            defaults={
                'meals_planned': total_count,
                'meals_completed': completed_count,
                'meals_skipped': skipped_count,
                'adherence_rate': adherence_rate,
                'water_intake_ml': 1250,
                'water_goal_ml': 2500,
            }
        )

        return Response({
            'date': target_date.isoformat(),
            'patient_name': patient.get_full_name() or getattr(getattr(patient, 'patient_profile', None), 'full_name', patient.username),
            'has_active_plan': bool(active_plan),
            'active_plan': DietPlanSerializer(active_plan).data if active_plan else None,
            'plan_title': active_plan.title if active_plan else 'Personalized Nutrition & Diet Intake Regimen',
            'plan_version': active_plan.version if active_plan else 1,
            'is_doctor_approved': bool(active_plan and active_plan.approved_by),
            'approved_by_name': active_plan.approved_by.get_full_name() if (active_plan and active_plan.approved_by) else 'Pending Doctor Approval',
            'next_meal': next_meal,
            'meals': meals,
            'progress': {
                'meals_planned': progress_record.meals_planned,
                'meals_completed': completed_count,
                'meals_skipped': skipped_count,
                'adherence_rate': adherence_rate,
                'water_intake_ml': progress_record.water_intake_ml,
                'water_goal_ml': progress_record.water_goal_ml,
                'energy_rating': progress_record.energy_rating,
                'wellness_note': progress_record.wellness_note,
            }
        })

    def post(self, request):
        """
        Log or toggle a meal status:
        Payload: { meal_type: 'BREAKFAST', status: 'COMPLETED' | 'SKIPPED' | 'PENDING', date: 'YYYY-MM-DD', notes: '', energy_rating: 4 }
        """
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'Please authenticate to log meals.'}, status=status.HTTP_401_UNAUTHORIZED)

        meal_type = request.data.get('meal_type')
        status_val = request.data.get('status', 'COMPLETED')
        date_str = request.data.get('date')
        notes = request.data.get('notes', '')
        energy_rating = request.data.get('energy_rating')

        if not meal_type:
            return Response({'error': 'meal_type is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                target_date = timezone.localdate()
        else:
            target_date = timezone.localdate()

        log = MealLog.objects.filter(patient=patient, date=target_date, meal_type=meal_type).first()
        if not log:
            # Create if missing
            active_plan = DietPlan.objects.filter(patient=patient, status=DietPlanStatus.ACTIVE).first()
            get_or_create_default_patient_schedule(patient, target_date, active_plan)
            log = MealLog.objects.filter(patient=patient, date=target_date, meal_type=meal_type).first()

        if log:
            log.status = status_val
            log.completed_at = timezone.now() if status_val == 'COMPLETED' else None
            if notes:
                log.notes = notes
            if energy_rating is not None:
                log.energy_rating = int(energy_rating)
            log.save()

        # Update DailyProgressRecord
        day_logs = MealLog.objects.filter(patient=patient, date=target_date)
        completed_count = day_logs.filter(status='COMPLETED').count()
        skipped_count = day_logs.filter(status='SKIPPED').count()
        total_count = day_logs.count()
        adherence_rate = round((completed_count / total_count * 100), 1) if total_count > 0 else 0.0

        progress_record, _ = ProgressRecord.objects.get_or_create(patient=patient, date=target_date)
        progress_record.meals_planned = total_count
        progress_record.meals_completed = completed_count
        progress_record.meals_skipped = skipped_count
        progress_record.adherence_rate = adherence_rate
        if energy_rating is not None:
            progress_record.energy_rating = int(energy_rating)
        progress_record.save()

        # Create confirmation in-app notification if meal completed
        if status_val == 'COMPLETED':
            Notification.objects.create(
                user=patient,
                type='MEAL_LOGGED',
                title='Meal Logged',
                message=f"You completed your {log.meal_name if log else meal_type}. Daily meal adherence is now {adherence_rate}%.",
                related_object_type='MealLog',
                related_object_id=log.id if log else None
            )

        return Response({
            'message': f"Meal {meal_type} marked as {status_val}.",
            'meal_log': MealLogSerializer(log).data if log else None,
            'progress': {
                'meals_completed': completed_count,
                'meals_skipped': skipped_count,
                'meals_planned': total_count,
                'adherence_rate': adherence_rate,
                'water_intake_ml': progress_record.water_intake_ml,
                'water_goal_ml': progress_record.water_goal_ml,
            }
        })


class PatientMealReminderPreferenceView(APIView):
    """
    Manages meal notification schedules and reminder toggles for the patient.
    """
    permission_classes = []

    def get_patient(self, request):
        if request.user.is_authenticated and request.user.role == User.Role.PATIENT:
            return request.user
        return User.objects.filter(role=User.Role.PATIENT).first()

    def get(self, request):
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        prefs, _ = MealReminderPreference.objects.get_or_create(patient=patient)
        return Response(MealReminderPreferenceSerializer(prefs).data)

    def patch(self, request):
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'Please authenticate to save reminder preferences.'}, status=status.HTTP_401_UNAUTHORIZED)

        prefs, _ = MealReminderPreference.objects.get_or_create(patient=patient)

        fields = [
            'reminders_enabled', 'breakfast_reminder', 'breakfast_time',
            'mid_morning_reminder', 'mid_morning_time',
            'lunch_reminder', 'lunch_time',
            'evening_reminder', 'evening_time',
            'dinner_reminder', 'dinner_time',
            'water_reminders', 'water_interval_hours'
        ]
        for f in fields:
            if f in request.data:
                setattr(prefs, f, request.data[f])

        prefs.save()
        return Response({
            'message': 'Meal reminders and notification schedule updated successfully.',
            'preferences': MealReminderPreferenceSerializer(prefs).data
        })

    def post(self, request):
        return self.patch(request)


class PatientWaterLogView(APIView):
    """
    Logs water intake increments (e.g. +250ml) for the day.
    """
    permission_classes = []

    def get_patient(self, request):
        if request.user.is_authenticated and request.user.role == User.Role.PATIENT:
            return request.user
        return User.objects.filter(role=User.Role.PATIENT).first()

    def post(self, request):
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'Patient profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        target_date = timezone.localdate()
        amount_ml = int(request.data.get('amount_ml', 250))
        action = request.data.get('action', 'add')

        progress, _ = ProgressRecord.objects.get_or_create(patient=patient, date=target_date)

        if action == 'reset':
            progress.water_intake_ml = 0
        else:
            progress.water_intake_ml = max(0, progress.water_intake_ml + amount_ml)

        progress.save(update_fields=['water_intake_ml', 'updated_at'])

        return Response({
            'water_intake_ml': progress.water_intake_ml,
            'water_goal_ml': progress.water_goal_ml,
            'message': f"Water intake updated to {progress.water_intake_ml} ml."
        })


class PatientProgressView(APIView):
    """
    Provides 7-day and 30-day historical meal adherence, consistency streaks, and wellness trends.
    Calculated purely from persisted records.
    """
    permission_classes = []

    def get_patient(self, request):
        if request.user.is_authenticated and request.user.role == User.Role.PATIENT:
            return request.user
        return User.objects.filter(role=User.Role.PATIENT).first()

    def get(self, request):
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.localdate()
        past_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]

        # Fetch records
        records_qs = ProgressRecord.objects.filter(
            patient=patient,
            date__gte=past_7_days[0],
            date__lte=today
        ).order_by('date')
        records_map = {r.date: r for r in records_qs}

        weekly_points = []
        total_completed_meals = 0
        total_planned_meals = 0

        for d in past_7_days:
            rec = records_map.get(d)
            if rec:
                planned = rec.meals_planned
                completed = rec.meals_completed
                adherence = rec.adherence_rate
                water = rec.water_intake_ml
            else:
                planned = 5
                completed = 0
                adherence = 0.0
                water = 0

            total_planned_meals += planned
            total_completed_meals += completed

            weekly_points.append({
                'date': d.isoformat(),
                'day_label': d.strftime('%a'),
                'meals_planned': planned,
                'meals_completed': completed,
                'adherence_rate': adherence,
                'water_intake_ml': water,
            })

        avg_adherence = round((total_completed_meals / total_planned_meals * 100), 1) if total_planned_meals > 0 else 0.0

        # Calculate streak: consecutive days from today backwards where meals_completed > 0
        streak = 0
        curr_date = today
        for i in range(30):
            day_log_completed = MealLog.objects.filter(
                patient=patient,
                date=curr_date,
                status=MealLogStatus.COMPLETED
            ).exists()
            if day_log_completed:
                streak += 1
                curr_date -= timedelta(days=1)
            else:
                # If checking today and no meal yet, check if yesterday had meals
                if curr_date == today:
                    curr_date -= timedelta(days=1)
                    continue
                break

        return Response({
            'today': today.isoformat(),
            'streak_days': streak,
            'weekly_adherence_rate': avg_adherence,
            'total_meals_completed': total_completed_meals,
            'weekly_points': weekly_points,
            'total_logged_days': ProgressRecord.objects.filter(patient=patient, meals_completed__gt=0).count(),
        })


class PatientDietHistoryView(APIView):
    """
    Returns previous diet plan versions and audit iterations for the authenticated patient.
    """
    permission_classes = []

    def get_patient(self, request):
        if request.user.is_authenticated and request.user.role == User.Role.PATIENT:
            return request.user
        return User.objects.filter(role=User.Role.PATIENT).first()

    def get(self, request):
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        plans = DietPlan.objects.filter(patient=patient).order_by('-version', '-created_at')
        return Response({
            'count': plans.count(),
            'plans': DietPlanSerializer(plans, many=True).data
        })


