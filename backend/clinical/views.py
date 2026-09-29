from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from accounts.models import User, DoctorProfile, PatientProfile
from accounts.permissions import IsDoctorUser
from .models import (
    PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus,
    PatientVerification, VerificationStatus,
    DietPlan, DietPlanStatus, DietPlanGeneratedBy, DietPlanVersion,
    Notification, AuditLog, AuditAction
)
from .serializers import (
    PatientAssessmentSummarySerializer,
    PatientAssessmentDetailSerializer,
    ClinicalReviewSerializer,
    PatientVerificationSerializer,
    DietPlanSerializer,
    DietPlanVersionSerializer,
    NotificationSerializer,
    AuditLogSerializer
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


class DoctorPatientVerificationView(APIView):
    """
    Retrieves all clinical verification fields for a patient's latest assessment,
    as well as the effective patient profile (Single Source of Truth).
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, patient_id):
        patient = User.objects.filter(id=patient_id, role=User.Role.PATIENT).first()
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-submitted_at').first()
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
        patient = User.objects.filter(id=patient_id, role=User.Role.PATIENT).first()
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        field_name = request.data.get('field_name')
        action_type = request.data.get('action') # 'VERIFY' or 'CORRECT'
        verified_val = request.data.get('verified_value')
        doctor_note = request.data.get('doctor_note', '')

        if not field_name:
            return Response({'error': 'field_name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-submitted_at').first()
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
        patient = User.objects.filter(id=patient_id, role=User.Role.PATIENT).first()
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-submitted_at').first()
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
        patient = User.objects.filter(id=patient_id, role=User.Role.PATIENT).first()
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-submitted_at').first()
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
        patient = User.objects.filter(id=patient_id, role=User.Role.PATIENT).first()
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
        patient = User.objects.filter(id=patient_id, role=User.Role.PATIENT).first()
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
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

