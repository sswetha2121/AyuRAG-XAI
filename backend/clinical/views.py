from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta
from accounts.models import User, DoctorProfile, PatientProfile
from accounts.permissions import IsDoctorUser, IsPatientUser
from .models import (
    PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus,
    PatientVerification, VerificationStatus,
    DietPlan, DietPlanStatus, DietPlanGeneratedBy, DietPlanVersion,
    Notification, AuditLog, AuditAction,
    MealLog, MealReminderPreference, ProgressRecord, MealType, MealLogStatus,
    DoctorPatientAssignment, PatientDoctorMessage, PatientDietDifficultyReport
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
    ProgressRecordSerializer,
    DoctorPatientAssignmentSerializer,
    PatientDoctorMessageSerializer,
    PatientDietDifficultyReportSerializer
)
from .services.patient_data_resolver import (
    get_effective_patient_profile,
    initialize_verifications_for_assessment,
    ASSESSMENT_FIELDS
)
from .services.personalization import generate_personalized_diet
from .services.nutritional_engine import (
    get_food_catalogue,
    find_suitable_substitutes,
    calculate_day_nutrients,
    calculate_meal_nutrients
)
from .services.diet_generator import generate_comprehensive_diet_plan
from .services.ai_model_service import AyuRagAiModelService
from .services.clinical_rag_engine import ClinicalRagEngine
from .services.vector_store import AyuVectorStore

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
        active_diet_plans = DietPlan.objects.filter(status__in=[DietPlanStatus.ACTIVE, DietPlanStatus.PUBLISHED]).count()
        unread_messages = PatientDoctorMessage.objects.filter(recipient=request.user, is_read=False).count()
        my_assigned_patients = DoctorPatientAssignment.objects.filter(doctor=request.user, is_active=True).count()

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
            status__in=[DietPlanStatus.ACTIVE, DietPlanStatus.PUBLISHED]
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
                'my_assigned_patients': my_assigned_patients,
                'pending_clinical_reviews': pending_reviews,
                'completed_assessments': completed_assessments,
                'unverified_assessments': unverified_assessments_count,
                'draft_diet_plans': draft_diet_plans,
                'plans_awaiting_approval': plans_awaiting_approval,
                'active_diet_plans': active_diet_plans,
                'unread_messages': unread_messages,
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
    Enforces doctor-patient assignment scope while allowing doctors to discover
    and assign new patients to their care.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        search_query = request.query_params.get('search', '').strip()
        status_filter = request.query_params.get('status', '').strip()
        prakriti_filter = request.query_params.get('prakriti', '').strip()
        review_filter = request.query_params.get('review_status', '').strip()
        scope = request.query_params.get('scope', '').strip() # 'assigned', 'unassigned', 'all'
        sort_by = request.query_params.get('sort', '-created_at').strip()

        qs = PatientAssessment.objects.select_related('patient', 'patient__patient_profile').prefetch_related('reviews')

        # Scope filter
        my_assigned_p_ids = list(DoctorPatientAssignment.objects.filter(
            doctor=request.user, is_active=True
        ).values_list('patient_id', flat=True))
        profile_assigned_ids = list(User.objects.filter(
            patient_profile__assigned_doctor=request.user
        ).values_list('id', flat=True))
        all_my_patient_ids = set(my_assigned_p_ids + profile_assigned_ids)

        if scope == 'assigned':
            qs = qs.filter(patient_id__in=all_my_patient_ids)
        elif scope == 'unassigned':
            assigned_anyone_ids = list(DoctorPatientAssignment.objects.filter(is_active=True).values_list('patient_id', flat=True))
            assigned_profile_ids = list(User.objects.filter(patient_profile__assigned_doctor__isnull=False).values_list('id', flat=True))
            all_assigned = set(assigned_anyone_ids + assigned_profile_ids)
            qs = qs.exclude(patient_id__in=all_assigned)
        elif not scope:
            # Default: show assigned patients if any exist; else show all so doctor can onboard
            if all_my_patient_ids:
                qs = qs.filter(patient_id__in=all_my_patient_ids)

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
        results = serializer.data

        # Enrich with real assignment status
        for item in results:
            p_id = item.get('patient')
            item['is_assigned_to_me'] = p_id in all_my_patient_ids
            # Find assigned doctor
            p_user = User.objects.filter(id=p_id).select_related('patient_profile__assigned_doctor').first()
            if p_user and hasattr(p_user, 'patient_profile') and p_user.patient_profile.assigned_doctor:
                doc = p_user.patient_profile.assigned_doctor
                item['assigned_doctor_id'] = doc.id
                item['assigned_doctor_name'] = getattr(getattr(doc, 'doctor_profile', None), 'professional_name', f"Dr. {doc.username}")
            else:
                item['assigned_doctor_id'] = None
                item['assigned_doctor_name'] = None

        return Response({
            'count': len(results),
            'total_my_assigned': len(all_my_patient_ids),
            'patients': results
        })


class DoctorPatientDetailView(APIView):
    """
    Complete patient profile with Prakriti, Lifestyle, Diet, Symptoms,
    ML analysis, SHAP, LIME, RAG classical evidence, and Recommendations.
    Supports either assessment ID or patient user ID.
    Enforces authorization check for clinical care.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, pk):
        assessment = PatientAssessment.objects.select_related('patient', 'patient__patient_profile').prefetch_related('reviews').filter(pk=pk).first()
        if not assessment:
            assessment = PatientAssessment.objects.select_related('patient', 'patient__patient_profile').prefetch_related('reviews').filter(patient_id=pk).order_by('-created_at').first()

        if not assessment:
            return Response({'error': 'Patient assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientAssessmentDetailSerializer(assessment)
        data = serializer.data

        # Add assignment information
        patient = assessment.patient
        is_assigned = (
            DoctorPatientAssignment.objects.filter(doctor=request.user, patient=patient, is_active=True).exists() or
            (hasattr(patient, 'patient_profile') and patient.patient_profile.assigned_doctor_id == request.user.id)
        )
        data['is_assigned_to_me'] = is_assigned
        if hasattr(patient, 'patient_profile') and patient.patient_profile.assigned_doctor:
            doc = patient.patient_profile.assigned_doctor
            data['assigned_doctor_id'] = doc.id
            data['assigned_doctor_name'] = getattr(getattr(doc, 'doctor_profile', None), 'professional_name', f"Dr. {doc.username}")
        else:
            data['assigned_doctor_id'] = None
            data['assigned_doctor_name'] = None

        return Response(data)


class DoctorPatientAssignView(APIView):
    """
    Secure assignment workflow for a doctor to assign a patient to their clinical care roster.
    Accessible ONLY to approved doctors.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, patient_id):
        patient, _ = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        doctor = request.user
        doctor_name = getattr(getattr(doctor, 'doctor_profile', None), 'professional_name', f"Dr. {doctor.username}")

        assignment, created = DoctorPatientAssignment.objects.get_or_create(
            doctor=doctor,
            patient=patient,
            defaults={'is_active': True, 'notes': request.data.get('notes', 'Assigned via clinical portal.')}
        )
        if not created and not assignment.is_active:
            assignment.is_active = True
            assignment.save(update_fields=['is_active'])

        # Update patient profile
        if hasattr(patient, 'patient_profile'):
            patient.patient_profile.assigned_doctor = doctor
            patient.patient_profile.save(update_fields=['assigned_doctor'])

        # Audit log
        AuditLog.objects.create(
            actor=doctor,
            action=AuditAction.CASE_ACCESSED,
            patient=patient,
            object_type='DoctorPatientAssignment',
            object_id=str(assignment.id),
            metadata={'event': 'Doctor assigned patient to clinical care roster', 'doctor': doctor.username}
        )

        # Notify patient
        Notification.objects.create(
            user=patient,
            type='DOCTOR_ASSIGNED',
            title='Physician Assigned to Your Care',
            message=f"{doctor_name} has accepted you into their clinical care roster.",
            related_object_type='DoctorPatientAssignment',
            related_object_id=assignment.id
        )

        return Response({
            'message': f"Patient '{patient.username}' successfully assigned to {doctor_name}.",
            'assignment': DoctorPatientAssignmentSerializer(assignment).data
        }, status=status.HTTP_200_OK)


class DoctorPatientUnassignView(APIView):
    """
    Unassigns a patient from the authenticated doctor's active care roster.
    Accessible ONLY to approved doctors.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, patient_id):
        patient, _ = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        assignment = DoctorPatientAssignment.objects.filter(
            doctor=request.user,
            patient=patient,
            is_active=True
        ).first()

        if assignment:
            assignment.is_active = False
            assignment.save(update_fields=['is_active'])

        if hasattr(patient, 'patient_profile') and patient.patient_profile.assigned_doctor == request.user:
            patient.patient_profile.assigned_doctor = None
            patient.patient_profile.save(update_fields=['assigned_doctor'])

        return Response({'message': f"Patient '{patient.username}' unassigned from active care roster."})


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
            patient_id = request.data.get('patient_id')
            if patient_id:
                asm = PatientAssessment.objects.filter(patient_id=patient_id).order_by('-created_at').first()
                if asm:
                    assessment_id = asm.id

        if not assessment_id:
            return Response({'error': 'assessment_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assessment = PatientAssessment.objects.get(pk=assessment_id)
        except PatientAssessment.DoesNotExist:
            return Response({'error': 'Assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Update existing review if already present to prevent duplicate records
        review = ClinicalReview.objects.filter(assessment=assessment).first()
        is_new_review = review is None
        requested_status = request.data.get('status')
        if requested_status and requested_status not in ReviewStatus.values:
            return Response({'error': f"Invalid review status: '{requested_status}'."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            if review:
                if review.status == ReviewStatus.COMPLETED and requested_status == ReviewStatus.PENDING:
                    return Response({'error': 'Invalid state transition: Cannot revert a completed review to pending.'}, status=status.HTTP_400_BAD_REQUEST)

                review.doctor = request.user
                if requested_status:
                    review.status = requested_status
                if 'summary' in request.data:
                    review.summary = request.data['summary']
                if 'observations' in request.data:
                    review.observations = request.data['observations']
                if 'recommendations' in request.data:
                    review.recommendations = request.data['recommendations']
                if 'follow_up_notes' in request.data:
                    review.follow_up_notes = request.data['follow_up_notes']
                review.save()
            else:
                review = ClinicalReview.objects.create(
                    patient=assessment.patient,
                    doctor=request.user,
                    assessment=assessment,
                    status=requested_status or ReviewStatus.IN_REVIEW,
                    summary=request.data.get('summary', ''),
                    observations=request.data.get('observations', ''),
                    recommendations=request.data.get('recommendations', ''),
                    follow_up_notes=request.data.get('follow_up_notes', '')
                )

            if review.status == ReviewStatus.COMPLETED:
                assessment.status = AssessmentStatus.VALIDATED
                assessment.save(update_fields=['status', 'updated_at'])
                doctor_name = request.user.doctor_profile.professional_name if hasattr(request.user, 'doctor_profile') else f"Dr. {request.user.username}"
                Notification.objects.create(
                    user=review.patient,
                    type='CLINICAL_REVIEW_COMPLETED',
                    title='Clinical Assessment Validated',
                    message=f"{doctor_name} has completed the clinical review and validated your assessment #{assessment.id}.",
                    related_object_type='ClinicalReview',
                    related_object_id=review.id
                )

            action_type = AuditAction.DOCTOR_REVIEW_COMPLETED if review.status == ReviewStatus.COMPLETED else AuditAction.DOCTOR_REVIEW_SAVED
            AuditLog.objects.create(
                actor=request.user,
                action=action_type,
                patient=review.patient,
                object_type='ClinicalReview',
                object_id=str(review.id),
                metadata={
                    'status': review.status,
                    'summary': review.summary[:120] if review.summary else '',
                    'assessment_id': assessment.id
                }
            )

        return Response(ClinicalReviewSerializer(review).data, status=status.HTTP_201_CREATED if is_new_review else status.HTTP_200_OK)



class DoctorReviewDetailView(APIView):
    """
    Get or update doctor review notes.
    Doctor notes are strictly isolated and stored separately from ML/SHAP/LIME outputs.
    Enforces valid workflow state transitions.
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
            review = ClinicalReview.objects.select_related('assessment', 'patient').get(pk=pk)
        except ClinicalReview.DoesNotExist:
            return Response({'error': 'Clinical review not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status and new_status not in ReviewStatus.values:
            return Response({'error': f"Invalid review status: '{new_status}'."}, status=status.HTTP_400_BAD_REQUEST)

        if review.status == ReviewStatus.COMPLETED and new_status == ReviewStatus.PENDING:
            return Response({'error': 'Invalid state transition: Cannot revert a completed review to pending.'}, status=status.HTTP_400_BAD_REQUEST)

        was_completed = review.status == ReviewStatus.COMPLETED

        with transaction.atomic():
            allowed_fields = ['summary', 'observations', 'recommendations', 'follow_up_notes', 'status']
            for field in allowed_fields:
                if field in request.data:
                    setattr(review, field, request.data[field])

            review.doctor = request.user
            review.save()

            if review.status == ReviewStatus.COMPLETED:
                if review.assessment:
                    review.assessment.status = AssessmentStatus.VALIDATED
                    review.assessment.save(update_fields=['status', 'updated_at'])

                if not was_completed:
                    doctor_name = request.user.doctor_profile.professional_name if hasattr(request.user, 'doctor_profile') else f"Dr. {request.user.username}"
                    Notification.objects.create(
                        user=review.patient,
                        type='CLINICAL_REVIEW_COMPLETED',
                        title='Clinical Assessment Validated',
                        message=f"{doctor_name} has completed the clinical review and validated your assessment #{review.assessment_id}.",
                        related_object_type='ClinicalReview',
                        related_object_id=review.id
                    )

            action_type = AuditAction.DOCTOR_REVIEW_COMPLETED if review.status == ReviewStatus.COMPLETED else AuditAction.DOCTOR_REVIEW_SAVED
            AuditLog.objects.create(
                actor=request.user,
                action=action_type,
                patient=review.patient,
                object_type='ClinicalReview',
                object_id=str(review.id),
                metadata={
                    'status': review.status,
                    'summary': review.summary[:120] if review.summary else '',
                    'assessment_id': review.assessment_id
                }
            )

        return Response({
            'message': 'Clinical review notes updated successfully.',
            'review': ClinicalReviewSerializer(review).data,
            'status': review.status
        })


    def put(self, request, pk):
        return self.patch(request, pk)


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
            'generated_at': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
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


class DoctorFoodCatalogueView(APIView):
    """
    Searchable, filterable catalogue of authentic Indian foods (IFCT 2017 derived)
    with standard portion sizes, macro/micronutrients, and dietary/allergen tags.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        query = request.query_params.get('search', '').strip()
        category = request.query_params.get('category', '').strip()
        preference = (request.query_params.get('preference') or request.query_params.get('dietary_preference') or '').strip()
        raw_allergens = request.query_params.getlist('exclude_allergen') or request.query_params.get('exclude_allergen', '').split(',')
        exclude_allergens = [a.strip() for a in raw_allergens if a.strip()]

        items = get_food_catalogue(
            query=query,
            category=category,
            dietary_preference=preference,
            allergens_to_exclude=exclude_allergens
        )
        total_items = get_food_catalogue()
        return Response({
            'count': len(items),
            'total': len(total_items),
            'items': items,
            'foods': items,
        })


class DoctorFoodSubstitutesView(APIView):
    """
    Retrieves verified substitutes for a given food item based on allergen or preference constraints.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        food_id = request.query_params.get('food_id', '').strip()
        raw_allergens = request.query_params.get('allergens', '').split(',')
        allergens = [a.strip() for a in raw_allergens if a.strip()]
        preference = request.query_params.get('preference', '').strip()

        subs = find_suitable_substitutes(food_id, allergens_to_avoid=allergens, dietary_preference=preference)
        return Response({
            'food_id': food_id,
            'substitutes': subs
        })


class DoctorDietGenerateView(APIView):
    """
    Generates a personalized, structured Ayurvedic Diet Plan (DRAFT) based on
    doctor-configured inputs (age, preferences, allergies, regional cuisine, meal times),
    patient baseline, IFCT 2017 food catalogue, and classical RAG references.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, patient_id):
        patient, assessment = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        dietary_preference = request.data.get('dietary_preference', 'VEGETARIAN')
        food_allergies = request.data.get('food_allergies') or request.data.get('allergies', [])
        if isinstance(food_allergies, str):
            food_allergies = [a.strip() for a in food_allergies.split(',') if a.strip()]

        meal_frequency = int(request.data.get('meal_frequency', 5))
        meal_times = request.data.get('meal_times', {})
        regional_preference = request.data.get('regional_preference', 'North Indian')
        nutritional_goals = request.data.get('nutritional_goals', '')
        clinician_constraints = request.data.get('clinician_constraints') or request.data.get('notes', '')

        try:
            diet_plan = generate_comprehensive_diet_plan(
                patient_id=patient.id,
                doctor=request.user,
                assessment_id=assessment.id if assessment else None,
                dietary_preference=dietary_preference,
                food_allergies=food_allergies,
                meal_frequency=meal_frequency,
                meal_times=meal_times,
                regional_preference=regional_preference,
                nutritional_goals=nutritional_goals,
                clinician_constraints=clinician_constraints,
                status=DietPlanStatus.DRAFT
            )
            return Response({
                'message': 'Personalized diet plan draft generated with verified nutritional arithmetic and RAG evidence.',
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
    ingredients, portion sizes, foods to include/avoid, lifestyle guidance, and notes.
    Automatically recalculates nutritional totals on every update.
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
            'doctor_notes', 'dietary_preference', 'regional_preference',
            'hydration_guidance', 'daily_routine_guidance', 'status'
        ]

        modified = False
        for field in editable_fields:
            if field in request.data:
                setattr(diet_plan, field, request.data[field])
                modified = True

        if modified:
            # Deterministic recalculation of nutritional totals
            plan_meals_dict = {
                'breakfast': diet_plan.breakfast or {},
                'mid_morning': diet_plan.mid_morning or {},
                'lunch': diet_plan.lunch or {},
                'evening': diet_plan.evening or {},
                'dinner': diet_plan.dinner or {}
            }
            diet_plan.nutritional_totals = calculate_day_nutrients(plan_meals_dict)
            diet_plan.generated_by = DietPlanGeneratedBy.AI_ASSISTED_DOCTOR
            diet_plan.save()

            AuditLog.objects.create(
                actor=request.user,
                action=AuditAction.DOCTOR_EDITED_DIET,
                patient=diet_plan.patient,
                object_type='DietPlan',
                object_id=str(diet_plan.id),
                metadata={'version': diet_plan.version, 'title': diet_plan.title, 'status': diet_plan.status}
            )

        return Response({
            'message': 'Diet plan updated and nutritional totals recalculated successfully.',
            'diet_plan': DietPlanSerializer(diet_plan).data
        })


class DoctorDietPlanRecalculateView(APIView):
    """
    Explicitly recalculates nutritional totals for a diet plan from its meal items.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, plan_id):
        diet_plan = DietPlan.objects.filter(id=plan_id).first()
        if not diet_plan:
            return Response({'error': 'Diet plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Allow updating meals directly from request body if passed
        updated_fields = ['nutritional_totals', 'updated_at']
        meals_payload = request.data.get('meals') or request.data
        if isinstance(meals_payload, dict):
            for m_key in ['breakfast', 'mid_morning', 'lunch', 'evening', 'dinner']:
                if m_key in meals_payload and isinstance(meals_payload[m_key], dict):
                    setattr(diet_plan, m_key, meals_payload[m_key])
                    updated_fields.append(m_key)

        plan_meals_dict = {
            'breakfast': diet_plan.breakfast or {},
            'mid_morning': diet_plan.mid_morning or {},
            'lunch': diet_plan.lunch or {},
            'evening': diet_plan.evening or {},
            'dinner': diet_plan.dinner or {}
        }
        diet_plan.nutritional_totals = calculate_day_nutrients(plan_meals_dict)
        diet_plan.save(update_fields=list(set(updated_fields)))

        return Response({
            'message': 'Nutritional totals recalculated deterministically.',
            'nutritional_totals': diet_plan.nutritional_totals,
            'diet_plan': DietPlanSerializer(diet_plan).data
        })


class DoctorDietPlanApproveView(APIView):
    """
    Doctor approves and publishes a diet plan.
    - Sets plan status to PUBLISHED (and ACTIVE)
    - Sets approved_at and approved_by
    - Marks any previously active diet plan for this patient as SUPERSEDED (and ARCHIVED)
    - Captures a DietPlanVersion snapshot
    - Creates a Notification for the patient
    - Records an AuditLog entry
    Enforces valid state transitions and atomic consistency.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, plan_id):
        diet_plan = DietPlan.objects.filter(id=plan_id).first()
        if not diet_plan:
            return Response({'error': 'Diet plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        if diet_plan.status in [DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]:
            return Response({'error': 'Diet plan is already active and published.'}, status=status.HTTP_400_BAD_REQUEST)

        if diet_plan.status in [DietPlanStatus.SUPERSEDED, DietPlanStatus.ARCHIVED, DietPlanStatus.REJECTED]:
            return Response({'error': f"Cannot publish an {diet_plan.status.lower()} diet plan. Please create a draft or revise."}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()

        with transaction.atomic():
            # 1. Supersede previously active plans for this patient
            previous_actives = DietPlan.objects.filter(
                patient=diet_plan.patient,
                status__in=[DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]
            ).exclude(id=diet_plan.id)

            for prev in previous_actives:
                prev.status = DietPlanStatus.SUPERSEDED
                prev.save()
                AuditLog.objects.create(
                    actor=request.user,
                    action=AuditAction.DIET_ARCHIVED,
                    patient=diet_plan.patient,
                    object_type='DietPlan',
                    object_id=str(prev.id),
                    metadata={'superseded_version': prev.version}
                )

            # 2. Mark this plan ACTIVE / PUBLISHED
            diet_plan.status = request.data.get('status') or DietPlanStatus.ACTIVE
            diet_plan.approved_by = request.user
            diet_plan.approved_at = now

            # Ensure nutritional totals are up to date
            plan_meals_dict = {
                'breakfast': diet_plan.breakfast or {},
                'mid_morning': diet_plan.mid_morning or {},
                'lunch': diet_plan.lunch or {},
                'evening': diet_plan.evening or {},
                'dinner': diet_plan.dinner or {}
            }
            diet_plan.nutritional_totals = calculate_day_nutrients(plan_meals_dict)
            diet_plan.save()

            # 3. Create DietPlanVersion snapshot
            DietPlanVersion.objects.create(
                diet_plan=diet_plan,
                version_number=diet_plan.version,
                snapshot_data=DietPlanSerializer(diet_plan).data,
                change_summary=request.data.get('notes', 'Clinically reviewed, individualized, and published by physician.'),
                created_by=request.user
            )

            # 4. Notify Patient
            doctor_name = request.user.doctor_profile.professional_name if hasattr(request.user, 'doctor_profile') else request.user.get_full_name() or f"Dr. {request.user.username}"
            Notification.objects.create(
                user=diet_plan.patient,
                type='DIET_PLAN_APPROVED',
                title='Personalized Diet Plan Approved & Published',
                message=f"Your personalized Ayurvedic diet plan (v{diet_plan.version}) has been reviewed and published by {doctor_name}. It is now active on your dashboard.",
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
                metadata={'version': diet_plan.version, 'approved_at': str(now), 'status': 'PUBLISHED'}
            )

        return Response({
            'message': 'Diet plan clinically approved and published successfully.',
            'diet_plan': DietPlanSerializer(diet_plan).data
        })


class DoctorDietPlanSupersedeView(APIView):
    """
    Allows a doctor to pause or supersede a published diet plan.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def post(self, request, plan_id):
        diet_plan = DietPlan.objects.filter(id=plan_id).first()
        if not diet_plan:
            return Response({'error': 'Diet plan not found.'}, status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get('reason', 'Paused or superseded by attending physician.')
        diet_plan.status = DietPlanStatus.SUPERSEDED
        diet_plan.save(update_fields=['status', 'updated_at'])

        AuditLog.objects.create(
            actor=request.user,
            action=AuditAction.DIET_ARCHIVED,
            patient=diet_plan.patient,
            object_type='DietPlan',
            object_id=str(diet_plan.id),
            metadata={'reason': reason, 'version': diet_plan.version}
        )

        return Response({
            'message': 'Diet plan marked as superseded.',
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

        if diet_plan.status in [DietPlanStatus.ACTIVE, DietPlanStatus.PUBLISHED, DietPlanStatus.ARCHIVED, DietPlanStatus.SUPERSEDED]:
            return Response({'error': f"Cannot reject an active or published diet plan."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
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

        if diet_plan.status in [DietPlanStatus.ACTIVE, DietPlanStatus.ARCHIVED]:
            return Response({'error': f"Cannot reject an {diet_plan.status.lower()} diet plan."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
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

    def post(self, request, patient_id):
        patient, assessment = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action', AuditAction.CASE_ACCESSED)
        metadata = request.data.get('metadata', {})
        log = AuditLog.objects.create(
            actor=request.user,
            action=action,
            patient=patient,
            object_type='PatientAssessment',
            object_id=str(assessment.id) if assessment else str(patient.id),
            metadata=metadata
        )
        return Response({
            'message': 'Audit event logged.',
            'log': AuditLogSerializer(log).data
        }, status=status.HTTP_201_CREATED)


class PatientCurrentDietView(APIView):
    """
    Returns ONLY the authenticated patient's latest ACTIVE diet plan.
    Strictly isolated: queries strictly by request.user.
    Never accepts arbitrary patient_id from client.
    """
    permission_classes = [IsPatientUser]

    def get(self, request):
        # Strict patient isolation
        plan = DietPlan.objects.filter(
            patient=request.user,
            status__in=[DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]
        ).order_by('-approved_at', '-created_at', '-version').first()

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
    Accessible ONLY to authenticated patients.
    Supports drafts, atomic saves, and safe inference failure handling.
    """
    permission_classes = [IsPatientUser]

    def post(self, request):
        user = request.user
        demographics = request.data.get('demographics', {})
        prakriti_data = request.data.get('prakriti_data', {})
        lifestyle_data = request.data.get('lifestyle_data', {})
        diet_data = request.data.get('diet_data', {})
        symptoms_data = request.data.get('symptoms_data', {})
        prakriti_scores = request.data.get('prakriti_scores', {})
        rag_evidence = request.data.get('rag_evidence', [])

        is_draft = bool(request.data.get('is_draft', False) or request.data.get('status') == AssessmentStatus.IN_PROGRESS)

        assessment_id = request.data.get('assessment_id')
        assessment = None
        if assessment_id:
            assessment = PatientAssessment.objects.filter(id=assessment_id, patient=user).first()
            if not assessment and PatientAssessment.objects.filter(id=assessment_id).exists():
                return Response(
                    {'error': "Permission denied: Cannot modify another patient's assessment record."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Draft flow: save inputs with IN_PROGRESS status without running inference or notifying doctor
        if is_draft:
            with transaction.atomic():
                if assessment:
                    assessment.demographics = demographics
                    assessment.prakriti_data = prakriti_data
                    assessment.lifestyle_data = lifestyle_data
                    assessment.diet_data = diet_data
                    assessment.symptoms_data = symptoms_data
                    assessment.status = AssessmentStatus.IN_PROGRESS
                    assessment.save()
                else:
                    assessment = PatientAssessment.objects.create(
                        patient=user,
                        status=AssessmentStatus.IN_PROGRESS,
                        demographics=demographics,
                        prakriti_data=prakriti_data,
                        lifestyle_data=lifestyle_data,
                        diet_data=diet_data,
                        symptoms_data=symptoms_data,
                    )
            return Response({
                'message': 'Draft assessment saved successfully.',
                'assessment_id': assessment.id,
                'assessment': PatientAssessmentDetailSerializer(assessment).data
            }, status=status.HTTP_201_CREATED if not assessment_id else status.HTTP_200_OK)

        # Submission flow:
        # Step 1: Atomic persist of raw patient input data with IN_PROGRESS status
        with transaction.atomic():
            if assessment:
                assessment.demographics = demographics
                assessment.prakriti_data = prakriti_data
                assessment.lifestyle_data = lifestyle_data
                assessment.diet_data = diet_data
                assessment.symptoms_data = symptoms_data
                assessment.status = AssessmentStatus.IN_PROGRESS
                assessment.save()
            else:
                assessment = PatientAssessment.objects.create(
                    patient=user,
                    status=AssessmentStatus.IN_PROGRESS,
                    demographics=demographics,
                    prakriti_data=prakriti_data,
                    lifestyle_data=lifestyle_data,
                    diet_data=diet_data,
                    symptoms_data=symptoms_data,
                )

        # Step 2: Execute AI Model Service inference
        inference_input = {
            'demographics': demographics,
            'prakriti_data': prakriti_data,
            'lifestyle_data': lifestyle_data,
            'diet_data': diet_data,
            'symptoms_data': symptoms_data,
            'rag_evidence': rag_evidence,
        }

        try:
            inference_result = AyuRagAiModelService.run_inference(inference_input)
            inference_failed = False
        except Exception as exc:
            inference_failed = True
            inference_error = str(exc)

        # Step 3: Handle inference failure gracefully (preserve assessment, return 202)
        if inference_failed:
            assessment.ai_analysis = {
                'inference_status': 'FAILED',
                'error': inference_error,
            }
            assessment.status = AssessmentStatus.IN_PROGRESS
            assessment.save(update_fields=['ai_analysis', 'status', 'updated_at'])
            return Response({
                'status': 'INFERENCE_FAILED',
                'message': 'Assessment received and preserved, but automated inference encountered an error.',
                'error': inference_error,
                'can_retry': True,
                'assessment_id': assessment.id,
                'assessment': PatientAssessmentDetailSerializer(assessment).data
            }, status=status.HTTP_202_ACCEPTED)

        # Step 4: Extract scores and analysis
        tridosha = inference_result.get('tridoshaProfile', {})
        breakdown = tridosha.get('breakdown', {})
        scores = {
            'primary': tridosha.get('primaryDosha', 'Vāta'),
            'secondary': tridosha.get('secondaryDosha', 'Pitta'),
            'constitution': tridosha.get('constitutionType', 'Vāta-Pitta'),
            'breakdown': breakdown,
            'vata': breakdown.get('vata', 0),
            'pitta': breakdown.get('pitta', 0),
            'kapha': breakdown.get('kapha', 0),
        }
        analysis_payload = {
            'prediction': inference_result.get('aiMetrics', {}).get('prediction', f"{scores['constitution']} Constitutional Balance"),
            'confidence': inference_result.get('aiMetrics', {}).get('confidence', 0.85),
            'digestiveAgni': inference_result.get('digestiveAgni', {}),
            'aiMetrics': inference_result.get('aiMetrics', {}),
            'tridoshaProfile': tridosha,
        }

        with transaction.atomic():
            assessment.prakriti_scores = scores
            assessment.ai_analysis = analysis_payload
            assessment.shap_explanations = inference_result.get('shapExplanations') or inference_result.get('xaiFeatures') or []
            assessment.lime_explanations = inference_result.get('limeExplanations') or inference_result.get('limeFeatures') or []
            assessment.rag_evidence = inference_result.get('ragEvidence') or inference_result.get('evidenceCitations') or rag_evidence or []
            assessment.recommendations = inference_result.get('recommendations', {})
            assessment.status = AssessmentStatus.COMPLETED
            assessment.save()

            default_doctor = User.objects.filter(role=User.Role.DOCTOR).first()
            if default_doctor:
                review, created = ClinicalReview.objects.get_or_create(
                    patient=user,
                    assessment=assessment,
                    defaults={
                        'doctor': default_doctor,
                        'status': ReviewStatus.PENDING,
                        'summary': f"New assessment submitted for {demographics.get('fullName', user.username)}. Primary constitutional indication: {scores.get('primary', 'Vāta-Pitta')}."
                    }
                )
                initialize_verifications_for_assessment(user, assessment, default_doctor)
                if created:
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
        }, status=status.HTTP_201_CREATED if not assessment_id else status.HTTP_200_OK)


class PatientAssessmentDetailView(APIView):
    """
    Retrieve an individual patient assessment by primary key.
    Enforces authorization:
    - Patients may only access their own assessment.
    - Doctors may access patient assessments.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            assessment = PatientAssessment.objects.select_related('patient').get(pk=pk)
        except PatientAssessment.DoesNotExist:
            return Response({'error': 'Assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.role == User.Role.PATIENT and assessment.patient != user:
            return Response(
                {'error': "Permission denied: Cannot view another patient's assessment."},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(PatientAssessmentDetailSerializer(assessment).data)


class PatientAssessmentRetryView(APIView):
    """
    Retries AI inference for an existing assessment where inference previously failed or was incomplete.
    Idempotent: updates the existing record without creating duplicate assessments.
    """
    permission_classes = [IsPatientUser]

    def post(self, request, pk):
        user = request.user
        try:
            assessment = PatientAssessment.objects.get(pk=pk)
        except PatientAssessment.DoesNotExist:
            return Response({'error': 'Assessment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if assessment.patient != user:
            return Response(
                {'error': "Permission denied: Cannot retry analysis for another patient's assessment."},
                status=status.HTTP_403_FORBIDDEN
            )

        if assessment.status == AssessmentStatus.VALIDATED:
            return Response(
                {'error': 'Assessment has already been clinically validated by physician.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        inference_input = {
            'demographics': assessment.demographics or {},
            'prakriti_data': assessment.prakriti_data or {},
            'lifestyle_data': assessment.lifestyle_data or {},
            'diet_data': assessment.diet_data or {},
            'symptoms_data': assessment.symptoms_data or {},
            'rag_evidence': assessment.rag_evidence or [],
        }

        try:
            inference_result = AyuRagAiModelService.run_inference(inference_input)
        except Exception as exc:
            assessment.ai_analysis = {
                'inference_status': 'FAILED',
                'error': str(exc),
            }
            assessment.save(update_fields=['ai_analysis', 'updated_at'])
            return Response({
                'status': 'INFERENCE_FAILED',
                'message': 'AI inference retry failed.',
                'error': str(exc),
                'can_retry': True,
                'assessment_id': assessment.id,
                'assessment': PatientAssessmentDetailSerializer(assessment).data
            }, status=status.HTTP_202_ACCEPTED)

        # On success
        tridosha = inference_result.get('tridoshaProfile', {})
        breakdown = tridosha.get('breakdown', {})
        scores = {
            'primary': tridosha.get('primaryDosha', 'Vāta'),
            'secondary': tridosha.get('secondaryDosha', 'Pitta'),
            'constitution': tridosha.get('constitutionType', 'Vāta-Pitta'),
            'breakdown': breakdown,
            'vata': breakdown.get('vata', 0),
            'pitta': breakdown.get('pitta', 0),
            'kapha': breakdown.get('kapha', 0),
        }
        analysis_payload = {
            'prediction': inference_result.get('aiMetrics', {}).get('prediction', f"{scores['constitution']} Constitutional Balance"),
            'confidence': inference_result.get('aiMetrics', {}).get('confidence', 0.85),
            'digestiveAgni': inference_result.get('digestiveAgni', {}),
            'aiMetrics': inference_result.get('aiMetrics', {}),
            'tridoshaProfile': tridosha,
        }

        with transaction.atomic():
            assessment.prakriti_scores = scores
            assessment.ai_analysis = analysis_payload
            assessment.shap_explanations = inference_result.get('shapExplanations') or inference_result.get('xaiFeatures') or []
            assessment.lime_explanations = inference_result.get('limeExplanations') or inference_result.get('limeFeatures') or []
            assessment.rag_evidence = inference_result.get('ragEvidence') or inference_result.get('evidenceCitations') or []
            assessment.recommendations = inference_result.get('recommendations', {})
            assessment.status = AssessmentStatus.COMPLETED
            assessment.save()

            default_doctor = User.objects.filter(role=User.Role.DOCTOR).first()
            if default_doctor:
                review, created = ClinicalReview.objects.get_or_create(
                    patient=user,
                    assessment=assessment,
                    defaults={
                        'doctor': default_doctor,
                        'status': ReviewStatus.PENDING,
                        'summary': f"Assessment #{assessment.id} analyzed on retry for {assessment.demographics.get('fullName', user.username)}."
                    }
                )
                initialize_verifications_for_assessment(user, assessment, default_doctor)
                if created:
                    Notification.objects.create(
                        user=default_doctor,
                        type='NEW_ASSESSMENT',
                        title='New Patient Assessment',
                        message=f"Patient {assessment.demographics.get('fullName', user.username)} has completed assessment #{assessment.id}.",
                        related_object_type='PatientAssessment',
                        related_object_id=assessment.id
                    )

        return Response({
            'message': 'AI inference succeeded and assessment updated successfully.',
            'assessment_id': assessment.id,
            'assessment': PatientAssessmentDetailSerializer(assessment).data
        }, status=status.HTTP_200_OK)


class ClinicalAiInferenceView(APIView):
    """
    Dedicated Explainable AI Inference Endpoint.
    Accepts patient assessment questionnaire payload and returns:
    - Multi-Task Prakriti classification & dosha probabilities
    - Agni metabolic state
    - SHAP Shapley feature attributions
    - LIME local interpretable surrogate weights
    - Authentic RAG classical citations
    - Tailored nutrition and lifestyle recommendations
    """
    permission_classes = []

    def post(self, request):
        try:
            result = AyuRagAiModelService.run_inference(request.data)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'AI Model Inference failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ClinicalRagQueryView(APIView):
    """
    Dedicated RAG Knowledge-Base Retrieval and Grounded Clinical Q&A API.
    Provides:
    - Grounded canonical citations with verified metadata
    - Explicit separation of Retrieved Evidence and Clinical AI Interpretation
    - Emergency red-flag symptom triage
    - Insufficient evidence handling
    - Retrieval debug metadata (execution time, top score)
    """
    permission_classes = []

    def post(self, request):
        question = request.data.get('question') or request.data.get('query') or ''
        prakriti = request.data.get('prakriti') or ''
        collection = request.data.get('collection') or None
        top_k = int(request.data.get('top_k', 4))

        if not question.strip():
            return Response(
                {'error': 'A non-empty question or query string is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        answer = ClinicalRagEngine.answer_question(
            question=question,
            prakriti=prakriti,
            top_k=top_k,
            collection_filter=collection
        )
        return Response(answer, status=status.HTTP_200_OK)

    def get(self, request):
        question = request.query_params.get('q') or request.query_params.get('query') or ''
        prakriti = request.query_params.get('prakriti') or ''
        collection = request.query_params.get('collection') or None

        if not question.strip():
            return Response(
                {'error': 'Query parameter q is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        answer = ClinicalRagEngine.answer_question(
            question=question,
            prakriti=prakriti,
            collection_filter=collection
        )
        return Response(answer, status=status.HTTP_200_OK)


class ClinicalRagStatsView(APIView):
    """Returns vector database status, collections, and indexed document counts."""
    permission_classes = []

    def get(self, request):
        store = AyuVectorStore()
        stats = store.get_stats()
        return Response(stats, status=status.HTTP_200_OK)


class PatientLatestAssessmentView(APIView):
    """
    Returns the latest assessment for the authenticated patient.
    """
    permission_classes = [IsPatientUser]

    def get(self, request):
        assessment = PatientAssessment.objects.filter(patient=request.user).order_by('-created_at').first()
        if not assessment:
            return Response({'has_assessment': False, 'assessment': None})

        return Response({
            'has_assessment': True,
            'assessment': PatientAssessmentDetailSerializer(assessment).data
        })


class PatientAssessmentHistoryView(APIView):
    """
    Returns historical assessments for the authenticated patient.
    """
    permission_classes = [IsPatientUser]

    def get(self, request):
        assessments = PatientAssessment.objects.filter(patient=request.user).order_by('-created_at')
        return Response({
            'count': assessments.count(),
            'assessments': PatientAssessmentSummarySerializer(assessments, many=True).data
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
    Enriches with dish name, portion, items_detail, preparation instructions, and scheduled time.
    """
    def _extract_meal_data(meal_dict, default_name, default_items, default_time, default_prep):
        if not meal_dict:
            return {
                'title': default_name,
                'items': default_items,
                'items_detail': [{'name': it, 'portions': 1.0, 'grams': 100} for it in default_items],
                'time': default_time,
                'preparation': default_prep,
                'notes': ''
            }
        title = meal_dict.get('dish_name') or meal_dict.get('title') or default_name
        raw_items = meal_dict.get('items') or default_items
        clean_items = []
        for it in raw_items:
            if isinstance(it, dict):
                clean_items.append(it.get('name') or it.get('title') or str(it))
            elif isinstance(it, str):
                clean_items.append(it)
            else:
                clean_items.append(str(it))
        items = clean_items

        raw_items_detail = meal_dict.get('items_detail')
        if raw_items_detail and isinstance(raw_items_detail, list):
            items_detail = raw_items_detail
        else:
            items_detail = [
                {'name': it if isinstance(it, str) else it.get('name', 'Item'), 'portions': 1.0, 'grams': 100}
                for it in raw_items
            ]
        time_val = meal_dict.get('time') or default_time
        prep = meal_dict.get('preparation') or meal_dict.get('instructions') or default_prep
        notes = meal_dict.get('notes') or ''
        return {
            'title': title,
            'items': items,
            'items_detail': items_detail,
            'time': time_val,
            'preparation': prep,
            'notes': notes
        }

    b_data = _extract_meal_data(
        active_plan.breakfast if active_plan else None,
        'Warm Whole Grain Porridge & Stewed Fruit',
        ['Spiced oatmeal porridge', 'Stewed sweet apple with cinnamon', 'Peeled soaked almonds'],
        '08:00 AM',
        'Cook rolled oats in warm water with cardamom. Serve with warm stewed apples and peeled almonds.'
    )
    mm_data = _extract_meal_data(
        active_plan.mid_morning if active_plan else None,
        'Hydration & Mineral Replenishment',
        ['Fresh tender coconut water', '4 soaked black raisins'],
        '11:00 AM',
        'Consume fresh coconut water at room temperature. Chew soaked raisins slowly.'
    )
    l_data = _extract_meal_data(
        active_plan.lunch if active_plan else None,
        'Wholesome Lentil Bowl & Warm Vegetables',
        ['Steamed aged basmati rice', 'Yellow split mung dal tempered with cumin', 'Bottle gourd sabzi (Lauki)', 'Fresh spiced buttermilk'],
        '01:30 PM',
        'Consume warm tempered mung dal with basmati rice and cooked gourd sabzi. Finish with light buttermilk.'
    )
    e_data = _extract_meal_data(
        active_plan.evening if active_plan else None,
        'Gentle Herbal Tea & Roasted Seeds',
        ['Cumin-Coriander-Fennel (CCF) Herbal Tea', 'Roasted water lily seeds (Makhana)'],
        '05:00 PM',
        'Boil cumin, coriander, and fennel seeds in water. Enjoy with lightly roasted fox nuts.'
    )
    d_data = _extract_meal_data(
        active_plan.dinner if active_plan else None,
        'Light Vegetable Soup & Warm Flatbread',
        ['Pumpkin and carrot soup with cumin', '1-2 soft whole wheat phulkas with ghee'],
        '08:00 PM',
        'Warm, freshly pureed soup with soft phulkas. Finish at least 2.5 to 3 hours prior to sleeping.'
    )

    meal_configs = [
        {'type': MealType.BREAKFAST, 'label': 'Breakfast', **b_data},
        {'type': MealType.MID_MORNING, 'label': 'Mid-Morning Snack', **mm_data},
        {'type': MealType.LUNCH, 'label': 'Lunch (Main Meal)', **l_data},
        {'type': MealType.EVENING, 'label': 'Evening Snack', **e_data},
        {'type': MealType.DINNER, 'label': 'Dinner (Light Meal)', **d_data},
    ]

    meals_list = []
    for cfg in meal_configs:
        log, _ = MealLog.objects.get_or_create(
            patient=patient,
            date=target_date,
            meal_type=cfg['type'],
            defaults={
                'diet_plan': active_plan,
                'meal_name': cfg['title'],
                'scheduled_time': cfg['time'],
                'status': MealLogStatus.PENDING,
            }
        )
        if active_plan and log.diet_plan != active_plan:
            log.diet_plan = active_plan
            log.meal_name = cfg['title']
            log.scheduled_time = cfg['time']
            log.save(update_fields=['diet_plan', 'meal_name', 'scheduled_time'])

        meals_list.append({
            'id': log.id,
            'meal_type': log.meal_type,
            'label': cfg['label'],
            'meal_name': log.meal_name,
            'scheduled_time': log.scheduled_time,
            'items': cfg['items'],
            'items_detail': cfg['items_detail'],
            'preparation': cfg['preparation'],
            'notes_guidance': cfg['notes'],
            'status': log.status,
            'completed_at': log.completed_at.isoformat() if log.completed_at else None,
            'notes': log.notes,
            'skip_reason': log.skip_reason,
            'symptom_notes': log.symptom_notes,
            'difficulty_reported': log.difficulty_reported,
            'portion_consumed': log.portion_consumed,
            'energy_rating': log.energy_rating,
        })

    return meals_list


class PatientMealScheduleView(APIView):
    """
    Returns today's daily meal schedule, meal statuses, next meal, and logs meals.
    Strictly isolated to authenticated patients.
    Supports COMPLETED, PARTIALLY_COMPLETED, SKIPPED, NOT_DONE states,
    skip reasons, symptom notes, and portion consumed.
    """
    permission_classes = [IsPatientUser]

    def get_patient(self, request):
        return request.user

    def get(self, request):
        patient = self.get_patient(request)

        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                target_date = timezone.localdate()
        else:
            target_date = timezone.localdate()

        # Find active published diet plan for patient
        active_plan = DietPlan.objects.filter(
            patient=patient,
            status__in=[DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]
        ).order_by('-approved_at', '-created_at', '-version').first()

        meals = get_or_create_default_patient_schedule(patient, target_date, active_plan)

        # Calculate next scheduled meal
        next_meal = None
        for m in meals:
            if m['status'] in ['PENDING', 'NOT_DONE']:
                next_meal = m
                break
        if not next_meal and len(meals) > 0:
            next_meal = meals[0]

        # Calculate counts
        completed_count = sum(1 for m in meals if m['status'] == 'COMPLETED')
        partially_count = sum(1 for m in meals if m['status'] == 'PARTIALLY_COMPLETED')
        skipped_count = sum(1 for m in meals if m['status'] == 'SKIPPED')
        total_count = len(meals)
        adherence_rate = round(((completed_count + 0.5 * partially_count) / total_count * 100), 1) if total_count > 0 else 0.0

        progress_record, _ = ProgressRecord.objects.get_or_create(
            patient=patient,
            date=target_date,
            defaults={
                'meals_planned': total_count,
                'meals_completed': completed_count,
                'meals_partially_completed': partially_count,
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
            'published_date': active_plan.approved_at.isoformat() if (active_plan and active_plan.approved_at) else (active_plan.created_at.isoformat() if active_plan else None),
            'is_doctor_approved': bool(active_plan and (active_plan.approved_by or active_plan.status == DietPlanStatus.PUBLISHED)),
            'approved_by_name': active_plan.approved_by.get_full_name() if (active_plan and active_plan.approved_by) else ('Attending Physician' if active_plan and active_plan.status == DietPlanStatus.PUBLISHED else 'Pending Doctor Approval'),
            'next_meal': next_meal,
            'meals': meals,
            'progress': {
                'meals_planned': total_count,
                'meals_completed': completed_count,
                'meals_partially_completed': partially_count,
                'meals_skipped': skipped_count,
                'adherence_rate': adherence_rate,
                'water_intake_ml': progress_record.water_intake_ml,
                'water_goal_ml': progress_record.water_goal_ml,
                'energy_rating': progress_record.energy_rating,
                'wellness_note': progress_record.wellness_note,
                'reported_difficulties': progress_record.reported_difficulties,
            }
        })

    def post(self, request):
        """
        Log or toggle a meal status:
        Payload: {
            meal_type: 'BREAKFAST',
            status: 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'SKIPPED' | 'NOT_DONE' | 'PENDING',
            date: 'YYYY-MM-DD',
            notes: '',
            skip_reason: '',
            symptom_notes: '',
            portion_consumed: '50%',
            energy_rating: 4
        }
        """
        patient = self.get_patient(request)
        if not patient:
            return Response({'error': 'Please authenticate to log meals.'}, status=status.HTTP_401_UNAUTHORIZED)

        meal_type = request.data.get('meal_type')
        status_val = request.data.get('status', 'COMPLETED')
        date_str = request.data.get('date')
        notes = request.data.get('notes', '')
        skip_reason = request.data.get('skip_reason', '')
        symptom_notes = request.data.get('symptom_notes', '')
        portion_consumed = request.data.get('portion_consumed', '')
        energy_rating = request.data.get('energy_rating')

        if not meal_type:
            return Response({'error': 'meal_type is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Normalize status
        valid_statuses = [
            MealLogStatus.COMPLETED,
            MealLogStatus.PARTIALLY_COMPLETED,
            MealLogStatus.SKIPPED,
            MealLogStatus.PENDING,
            MealLogStatus.NOT_DONE
        ]
        if status_val not in valid_statuses:
            status_val = MealLogStatus.COMPLETED

        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                target_date = timezone.localdate()
        else:
            target_date = timezone.localdate()

        log = MealLog.objects.filter(patient=patient, date=target_date, meal_type=meal_type).first()
        if not log:
            active_plan = DietPlan.objects.filter(
                patient=patient,
                status__in=[DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]
            ).order_by('-approved_at', '-created_at', '-version').first()
            get_or_create_default_patient_schedule(patient, target_date, active_plan)
            log = MealLog.objects.filter(patient=patient, date=target_date, meal_type=meal_type).first()

        difficulty_flag = bool(skip_reason or symptom_notes or request.data.get('difficulty_reported'))

        if log:
            log.status = status_val
            log.completed_at = timezone.now() if status_val in ['COMPLETED', 'PARTIALLY_COMPLETED'] else None
            if notes is not None:
                log.notes = notes
            if skip_reason is not None:
                log.skip_reason = skip_reason
            if symptom_notes is not None:
                log.symptom_notes = symptom_notes
            if portion_consumed:
                log.portion_consumed = str(portion_consumed)
            if energy_rating is not None:
                log.energy_rating = int(energy_rating)
            log.difficulty_reported = difficulty_flag
            log.save()

        # Update Daily Progress Record
        day_logs = MealLog.objects.filter(patient=patient, date=target_date)
        completed_count = day_logs.filter(status='COMPLETED').count()
        partially_count = day_logs.filter(status='PARTIALLY_COMPLETED').count()
        skipped_count = day_logs.filter(status='SKIPPED').count()
        total_count = day_logs.count()
        adherence_rate = round(((completed_count + 0.5 * partially_count) / total_count * 100), 1) if total_count > 0 else 0.0

        has_difficulties = day_logs.filter(difficulty_reported=True).exists() or difficulty_flag

        progress_record, _ = ProgressRecord.objects.get_or_create(patient=patient, date=target_date)
        progress_record.meals_planned = total_count
        progress_record.meals_completed = completed_count
        progress_record.meals_partially_completed = partially_count
        progress_record.meals_skipped = skipped_count
        progress_record.adherence_rate = adherence_rate
        progress_record.reported_difficulties = has_difficulties
        if energy_rating is not None:
            progress_record.energy_rating = int(energy_rating)
        progress_record.save()

        # Record symptom report if difficulty noted
        if difficulty_flag and (symptom_notes or skip_reason):
            PatientDietDifficultyReport.objects.create(
                patient=patient,
                diet_plan=log.diet_plan if log else None,
                meal_type=meal_type,
                difficulty_description=skip_reason or notes or 'Reported via meal checklist',
                symptoms=symptom_notes or 'Meal skipped or partially completed with noted difficulty',
                severity='MODERATE' if status_val == 'SKIPPED' else 'MILD'
            )

            # Notify assigned doctor if any
            assigned_doc = getattr(getattr(patient, 'patient_profile', None), 'assigned_doctor', None)
            if not assigned_doc:
                assignment = DoctorPatientAssignment.objects.filter(patient=patient, is_active=True).first()
                if assignment:
                    assigned_doc = assignment.doctor

            if assigned_doc:
                Notification.objects.create(
                    user=assigned_doc,
                    type='PATIENT_DIFFICULTY',
                    title='Patient Dietary Difficulty Reported',
                    message=f"Patient {patient.get_full_name() or patient.username} reported difficulty with {meal_type}: {skip_reason or symptom_notes}",
                    related_object_type='MealLog',
                    related_object_id=log.id if log else None
                )

        # In-app notification for patient confirmation
        if status_val in ['COMPLETED', 'PARTIALLY_COMPLETED']:
            Notification.objects.create(
                user=patient,
                type='MEAL_LOGGED',
                title='Meal Logged',
                message=f"You updated your {log.meal_name if log else meal_type} ({status_val}). Daily meal adherence is now {adherence_rate}%.",
                related_object_type='MealLog',
                related_object_id=log.id if log else None
            )

        return Response({
            'message': f"Meal {meal_type} marked as {status_val}.",
            'meal_log': MealLogSerializer(log).data if log else None,
            'progress': {
                'meals_completed': completed_count,
                'meals_partially_completed': partially_count,
                'meals_skipped': skipped_count,
                'meals_planned': total_count,
                'adherence_rate': adherence_rate,
                'reported_difficulties': has_difficulties,
                'water_intake_ml': progress_record.water_intake_ml,
                'water_goal_ml': progress_record.water_goal_ml,
            }
        })


class PatientMealReminderPreferenceView(APIView):
    """
    Manages meal notification schedules and reminder toggles for the patient.
    """
    permission_classes = [IsPatientUser]

    def get_patient(self, request):
        return request.user

    def get(self, request):
        patient = self.get_patient(request)

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
    permission_classes = [IsPatientUser]

    def get_patient(self, request):
        return request.user

    def post(self, request):
        patient = self.get_patient(request)

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
    permission_classes = [IsPatientUser]

    def get_patient(self, request):
        return request.user

    def get(self, request):
        patient = self.get_patient(request)

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
    permission_classes = [IsPatientUser]

    def get_patient(self, request):
        return request.user

    def get(self, request):
        patient = self.get_patient(request)

        plans = DietPlan.objects.filter(patient=patient).order_by('-version', '-created_at')
        return Response({
            'count': plans.count(),
            'plans': DietPlanSerializer(plans, many=True).data
        })


class PatientDietReportDifficultyView(APIView):
    """
    Allows an authenticated patient to report symptoms, discomfort, or difficulty
    following their published diet plan or specific meal.
    Persists to database, alerts assigned doctor, and logs audit record.
    """
    permission_classes = [IsPatientUser]

    def post(self, request):
        patient = request.user
        meal_type = request.data.get('meal_type', MealType.BREAKFAST)
        raw_desc = request.data.get('difficulty_description') or request.data.get('description', '')
        if isinstance(raw_desc, (list, tuple)):
            difficulty_description = ', '.join(str(x) for x in raw_desc).strip()
        else:
            difficulty_description = str(raw_desc or '').strip()

        raw_sym = request.data.get('symptoms', '')
        if isinstance(raw_sym, (list, tuple)):
            symptoms = ', '.join(str(s) for s in raw_sym).strip()
        else:
            symptoms = str(raw_sym or '').strip()

        severity = str(request.data.get('severity', 'MILD')).upper()
        if severity not in ['MILD', 'MODERATE', 'SEVERE']:
            severity = 'MILD'

        if not difficulty_description and not symptoms:
            return Response(
                {'error': 'Please provide a description of the difficulty or symptoms experienced.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Associate with current active published diet plan if any
        active_plan = DietPlan.objects.filter(
            patient=patient,
            status__in=[DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]
        ).order_by('-approved_at', '-created_at', '-version').first()

        report = PatientDietDifficultyReport.objects.create(
            patient=patient,
            diet_plan=active_plan,
            meal_type=meal_type,
            difficulty_description=difficulty_description,
            symptoms=symptoms,
            severity=severity
        )

        # Update ProgressRecord flag for today
        today = timezone.localdate()
        prog, _ = ProgressRecord.objects.get_or_create(patient=patient, date=today)
        prog.reported_difficulties = True
        prog.save(update_fields=['reported_difficulties', 'updated_at'])

        # Notify assigned doctor
        assigned_doc = getattr(getattr(patient, 'patient_profile', None), 'assigned_doctor', None)
        if not assigned_doc:
            assignment = DoctorPatientAssignment.objects.filter(patient=patient, is_active=True).first()
            if assignment:
                assigned_doc = assignment.doctor

        patient_name = patient.get_full_name() or getattr(getattr(patient, 'patient_profile', None), 'full_name', patient.username)

        if assigned_doc:
            Notification.objects.create(
                user=assigned_doc,
                type='PATIENT_DIFFICULTY',
                title=f'Dietary Difficulty Reported ({severity})',
                message=f"Patient {patient_name} reported difficulty with {meal_type}: {difficulty_description[:100]}",
                related_object_type='PatientDietDifficultyReport',
                related_object_id=report.id
            )

        AuditLog.objects.create(
            actor=patient,
            action=AuditAction.CASE_ACCESSED,
            patient=patient,
            object_type='PatientDietDifficultyReport',
            object_id=str(report.id),
            metadata={'severity': severity, 'meal_type': meal_type}
        )

        return Response({
            'message': 'Your feedback has been recorded and your physician has been notified.',
            'report': PatientDietDifficultyReportSerializer(report).data
        }, status=status.HTTP_201_CREATED)


class DoctorMonitoringDashboardView(APIView):
    """
    Doctor Clinical Monitoring Dashboard.
    Provides real-time clinical monitoring of assigned patients:
    - Active diet plan & publication status
    - Today's meal completion summary (completed, partial, skipped, pending)
    - 7-day adherence trends
    - Patient-reported difficulties & symptom notes
    - Unread message count
    - Last patient activity timestamp
    - Multi-criteria filtering (search, adherence status, date)
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request):
        today = timezone.localdate()
        date_str = request.query_params.get('date', '').strip()
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                target_date = today
        else:
            target_date = today

        adherence_filter = request.query_params.get('adherence_status', 'all').strip()
        search_query = request.query_params.get('search', '').strip().lower()
        scope = request.query_params.get('scope', 'assigned').strip()

        # Find patients in doctor's care
        my_assigned_p_ids = list(DoctorPatientAssignment.objects.filter(
            doctor=request.user, is_active=True
        ).values_list('patient_id', flat=True))
        profile_assigned_ids = list(User.objects.filter(
            patient_profile__assigned_doctor=request.user
        ).values_list('id', flat=True))
        my_patient_ids = set(my_assigned_p_ids + profile_assigned_ids)

        if scope == 'all':
            # Include all patient users
            patient_users = User.objects.filter(role=User.Role.PATIENT).select_related('patient_profile')
        else:
            if my_patient_ids:
                patient_users = User.objects.filter(id__in=my_patient_ids, role=User.Role.PATIENT).select_related('patient_profile')
            else:
                # Fallback to all patients if doctor has none assigned yet
                patient_users = User.objects.filter(role=User.Role.PATIENT).select_related('patient_profile')

        patient_records = []
        total_meals_logged_today = 0
        total_adherence_sum = 0
        patients_with_alerts = 0
        total_unread_messages = 0

        # Pre-fetch past 7 days dates
        past_7_days = [target_date - timedelta(days=i) for i in range(6, -1, -1)]

        for p_user in patient_users:
            profile = getattr(p_user, 'patient_profile', None)
            full_name = (profile.full_name if profile else '') or p_user.get_full_name() or p_user.username
            patient_id_display = profile.patient_id if profile else f"AYU-{p_user.id:04d}"

            # Filter search
            if search_query:
                match = (
                    search_query in p_user.username.lower() or
                    search_query in full_name.lower() or
                    search_query in patient_id_display.lower()
                )
                if not match:
                    continue

            # Assessment & Prakriti
            latest_assessment = PatientAssessment.objects.filter(patient=p_user).order_by('-created_at').first()
            prakriti_scores = latest_assessment.prakriti_scores if latest_assessment else {}
            dominant_prakriti = prakriti_scores.get('primary', 'Vāta-Pitta') if prakriti_scores else 'Vāta-Pitta'
            chief_complaints = latest_assessment.symptoms_data if latest_assessment else []
            age = (latest_assessment.demographics.get('age') if (latest_assessment and latest_assessment.demographics) else (profile.age if profile else 28)) or 28
            gender = (latest_assessment.demographics.get('gender') if (latest_assessment and latest_assessment.demographics) else (profile.gender if profile else 'Unspecified')) or 'Unspecified'

            # Active published diet plan
            active_plan = DietPlan.objects.filter(
                patient=p_user,
                status__in=[DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]
            ).order_by('-approved_at', '-created_at', '-version').first()

            plan_info = None
            if active_plan:
                pub_date = active_plan.approved_at or active_plan.created_at
                plan_info = {
                    'id': active_plan.id,
                    'title': active_plan.title,
                    'version': active_plan.version,
                    'status': active_plan.status,
                    'published_at': pub_date.isoformat() if pub_date else None,
                    'duration': active_plan.duration,
                    'dietary_preference': active_plan.dietary_preference,
                    'nutritional_totals': active_plan.nutritional_totals or {},
                    'approved_by_me': active_plan.approved_by_id == request.user.id,
                }

            # Today's Meal Logs
            day_logs = MealLog.objects.filter(patient=p_user, date=target_date)
            meals_breakdown = []
            if day_logs.exists():
                for log in day_logs:
                    meals_breakdown.append({
                        'id': log.id,
                        'meal_type': log.meal_type,
                        'meal_name': log.meal_name,
                        'scheduled_time': log.scheduled_time,
                        'status': log.status,
                        'completed_at': log.completed_at.isoformat() if log.completed_at else None,
                        'notes': log.notes,
                        'skip_reason': log.skip_reason,
                        'symptom_notes': log.symptom_notes,
                        'difficulty_reported': log.difficulty_reported,
                        'portion_consumed': log.portion_consumed,
                    })
            else:
                # If logs not yet initialized for today, fetch default schedule
                default_meals = get_or_create_default_patient_schedule(p_user, target_date, active_plan)
                meals_breakdown = default_meals

            completed_cnt = sum(1 for m in meals_breakdown if m['status'] == 'COMPLETED')
            partial_cnt = sum(1 for m in meals_breakdown if m['status'] == 'PARTIALLY_COMPLETED')
            skipped_cnt = sum(1 for m in meals_breakdown if m['status'] == 'SKIPPED')
            total_planned = len(meals_breakdown)
            pending_cnt = max(0, total_planned - (completed_cnt + partial_cnt + skipped_cnt))

            adherence_rate = round(((completed_cnt + 0.5 * partial_cnt) / total_planned * 100), 1) if total_planned > 0 else 0.0

            total_meals_logged_today += (completed_cnt + partial_cnt + skipped_cnt)
            total_adherence_sum += adherence_rate

            # Water and Progress
            progress_rec = ProgressRecord.objects.filter(patient=p_user, date=target_date).first()
            water_ml = progress_rec.water_intake_ml if progress_rec else 0
            water_goal = progress_rec.water_goal_ml if progress_rec else 2500

            # 7-day Weekly Trend
            weekly_points = []
            week_records = {r.date: r for r in ProgressRecord.objects.filter(
                patient=p_user, date__gte=past_7_days[0], date__lte=target_date
            )}
            for d in past_7_days:
                rec = week_records.get(d)
                if rec:
                    weekly_points.append({
                        'date': d.isoformat(),
                        'day_label': d.strftime('%a'),
                        'planned': rec.meals_planned,
                        'completed': rec.meals_completed,
                        'adherence': rec.adherence_rate,
                    })
                else:
                    weekly_points.append({
                        'date': d.isoformat(),
                        'day_label': d.strftime('%a'),
                        'planned': 5,
                        'completed': 0,
                        'adherence': 0.0,
                    })

            # Reported difficulties & symptoms
            difficulties_qs = PatientDietDifficultyReport.objects.filter(
                patient=p_user
            ).order_by('-created_at')
            unreviewed_difficulties = difficulties_qs.filter(reviewed_by_doctor=False).count()
            recent_difficulties = PatientDietDifficultyReportSerializer(difficulties_qs[:3], many=True).data

            # Unread messages
            unread_msgs = PatientDoctorMessage.objects.filter(
                sender=p_user,
                recipient=request.user,
                is_read=False
            ).count()
            total_unread_messages += unread_msgs

            # Last activity
            latest_meal = MealLog.objects.filter(patient=p_user, completed_at__isnull=False).order_by('-completed_at').first()
            latest_diff = difficulties_qs.first()
            latest_msg = PatientDoctorMessage.objects.filter(sender=p_user).order_by('-created_at').first()

            timestamps = []
            if latest_meal and latest_meal.completed_at:
                timestamps.append(latest_meal.completed_at)
            if latest_diff:
                timestamps.append(latest_diff.created_at)
            if latest_msg:
                timestamps.append(latest_msg.created_at)

            last_activity = max(timestamps).isoformat() if timestamps else None

            # Adherence status category
            if unreviewed_difficulties > 0 or adherence_rate < 50.0:
                status_cat = 'alert'
                patients_with_alerts += 1
            elif adherence_rate >= 80.0:
                status_cat = 'high'
            else:
                status_cat = 'medium'

            # Filter by adherence status
            if adherence_filter != 'all' and adherence_filter != status_cat:
                continue

            is_assigned = p_user.id in my_patient_ids

            patient_records.append({
                'patient_id': p_user.id,
                'patient_uid': patient_id_display,
                'username': p_user.username,
                'full_name': full_name,
                'age': age,
                'gender': gender,
                'dominant_prakriti': dominant_prakriti,
                'chief_complaints': chief_complaints,
                'is_assigned_to_me': is_assigned,
                'assigned_doctor_name': getattr(getattr(profile, 'assigned_doctor', None), 'get_full_name', lambda: None)() or (f"Dr. {profile.assigned_doctor.username}" if (profile and profile.assigned_doctor) else None),
                'active_plan': plan_info,
                'today_summary': {
                    'date': target_date.isoformat(),
                    'meals_planned': total_planned,
                    'meals_completed': completed_cnt,
                    'meals_partially_completed': partial_cnt,
                    'meals_skipped': skipped_cnt,
                    'meals_pending': pending_cnt,
                    'adherence_rate': adherence_rate,
                    'water_intake_ml': water_ml,
                    'water_goal_ml': water_goal,
                    'meals_breakdown': meals_breakdown,
                },
                'weekly_adherence_trend': weekly_points,
                'unreviewed_difficulties_count': unreviewed_difficulties,
                'recent_difficulties': recent_difficulties,
                'unread_messages_count': unread_msgs,
                'last_activity': last_activity,
                'adherence_category': status_cat,
            })

        count_patients = len(patient_records)
        avg_adherence = round((total_adherence_sum / count_patients), 1) if count_patients > 0 else 0.0

        return Response({
            'date': target_date.isoformat(),
            'scope': scope,
            'summary_metrics': {
                'total_monitored_patients': count_patients,
                'total_meals_logged_today': total_meals_logged_today,
                'average_patient_adherence': avg_adherence,
                'patients_with_alerts': patients_with_alerts,
                'total_unread_messages': total_unread_messages,
            },
            'patients': patient_records,
            'clinical_notice': (
                "Notice: Meal adherence tracking provides behavioral compliance context. "
                "Adherence does not imply or establish proof of clinical cure or complete symptom eradication."
            )
        })


class DoctorMonitoringPatientDetailView(APIView):
    """
    Detailed monitoring history and clinical audit view for a specific patient.
    Accessible ONLY to authenticated users with role DOCTOR.
    """
    permission_classes = [IsDoctorUser]

    def get(self, request, patient_id):
        patient, assessment = resolve_patient_and_assessment(patient_id)
        if not patient:
            return Response({'error': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.localdate()
        past_14_days = [today - timedelta(days=i) for i in range(13, -1, -1)]

        # 14-day history records
        progress_qs = ProgressRecord.objects.filter(
            patient=patient,
            date__gte=past_14_days[0],
            date__lte=today
        ).order_by('date')
        records_map = {r.date: r for r in progress_qs}

        history_14_days = []
        for d in past_14_days:
            rec = records_map.get(d)
            if rec:
                history_14_days.append({
                    'date': d.isoformat(),
                    'day_label': d.strftime('%a, %d %b'),
                    'planned': rec.meals_planned,
                    'completed': rec.meals_completed,
                    'partially_completed': getattr(rec, 'meals_partially_completed', 0),
                    'skipped': rec.meals_skipped,
                    'adherence': rec.adherence_rate,
                    'water': rec.water_intake_ml,
                    'had_difficulties': rec.reported_difficulties,
                })
            else:
                history_14_days.append({
                    'date': d.isoformat(),
                    'day_label': d.strftime('%a, %d %b'),
                    'planned': 5,
                    'completed': 0,
                    'partially_completed': 0,
                    'skipped': 0,
                    'adherence': 0.0,
                    'water': 0,
                    'had_difficulties': False,
                })

        # All plans history
        all_plans = DietPlan.objects.filter(patient=patient).order_by('-version', '-created_at')
        active_plan = all_plans.filter(status__in=[DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]).first()

        # All difficulties reported
        difficulties = PatientDietDifficultyReport.objects.filter(patient=patient).order_by('-created_at')

        # Recent conversation messages
        messages = PatientDoctorMessage.objects.filter(
            Q(sender=patient, recipient=request.user) | Q(sender=request.user, recipient=patient)
        ).order_by('-created_at')[:20]

        profile = getattr(patient, 'patient_profile', None)

        return Response({
            'patient': {
                'id': patient.id,
                'uid': profile.patient_id if profile else f"AYU-{patient.id:04d}",
                'username': patient.username,
                'full_name': (profile.full_name if profile else '') or patient.get_full_name() or patient.username,
                'age': profile.age if profile else 28,
                'gender': profile.gender if profile else 'Unspecified',
                'prakriti': assessment.prakriti_scores if assessment else {},
                'complaints': assessment.symptoms_data if assessment else [],
            },
            'active_plan': DietPlanSerializer(active_plan).data if active_plan else None,
            'all_plans': DietPlanSerializer(all_plans, many=True).data,
            'fourteen_day_history': history_14_days,
            'reported_difficulties': PatientDietDifficultyReportSerializer(difficulties, many=True).data,
            'recent_messages': PatientDoctorMessageSerializer(messages, many=True).data,
        })


class DoctorDifficultyReportReviewView(APIView):
    """
    Allows a doctor to mark a patient-reported difficulty/symptom as clinically reviewed.
    """
    permission_classes = [IsDoctorUser]

    def patch(self, request, report_id):
        report = PatientDietDifficultyReport.objects.filter(id=report_id).first()
        if not report:
            return Response({'error': 'Report not found.'}, status=status.HTTP_404_NOT_FOUND)

        report.reviewed_by_doctor = True
        report.reviewed_at = timezone.now()
        report.doctor_notes = request.data.get('notes', 'Reviewed during clinical patient monitoring.')
        report.save()

        return Response({
            'message': 'Report marked as clinically reviewed.',
            'report': PatientDietDifficultyReportSerializer(report).data
        })


class MessagingConversationsView(APIView):
    """
    Returns list of conversation threads for the authenticated user.
    If DOCTOR: lists assigned patients and patients with message history.
    If PATIENT: lists assigned doctor thread.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        conversations = []

        if user.role == User.Role.DOCTOR:
            # Patients assigned or messaged
            my_assigned_p_ids = list(DoctorPatientAssignment.objects.filter(
                doctor=user, is_active=True
            ).values_list('patient_id', flat=True))
            profile_assigned_ids = list(User.objects.filter(
                patient_profile__assigned_doctor=user
            ).values_list('id', flat=True))
            messaged_p_ids = list(PatientDoctorMessage.objects.filter(
                Q(sender=user) | Q(recipient=user)
            ).values_list('sender_id', 'recipient_id'))
            all_messaged_ids = set()
            for s, r in messaged_p_ids:
                all_messaged_ids.add(s)
                all_messaged_ids.add(r)
            all_messaged_ids.discard(user.id)

            combined_patient_ids = set(my_assigned_p_ids + profile_assigned_ids + list(all_messaged_ids))
            patient_users = User.objects.filter(id__in=combined_patient_ids, role=User.Role.PATIENT).select_related('patient_profile')

            for p in patient_users:
                profile = getattr(p, 'patient_profile', None)
                p_name = (profile.full_name if profile else '') or p.get_full_name() or p.username
                last_msg = PatientDoctorMessage.objects.filter(
                    Q(sender=user, recipient=p) | Q(sender=p, recipient=user)
                ).order_by('-created_at').first()
                unread_cnt = PatientDoctorMessage.objects.filter(
                    sender=p, recipient=user, is_read=False
                ).count()

                conversations.append({
                    'participant_id': p.id,
                    'participant_name': p_name,
                    'participant_uid': profile.patient_id if profile else f"AYU-{p.id:04d}",
                    'participant_role': 'PATIENT',
                    'last_message': last_msg.content if last_msg else 'Conversation initiated.',
                    'last_message_time': last_msg.created_at.isoformat() if last_msg else None,
                    'is_last_message_from_me': (last_msg.sender_id == user.id) if last_msg else False,
                    'unread_count': unread_cnt,
                    'is_assigned': (p.id in my_assigned_p_ids or (profile and profile.assigned_doctor_id == user.id)),
                })

        else:
            # Patient: conversation with assigned doctor
            assigned_doc = getattr(getattr(user, 'patient_profile', None), 'assigned_doctor', None)
            if not assigned_doc:
                assignment = DoctorPatientAssignment.objects.filter(patient=user, is_active=True).first()
                if assignment:
                    assigned_doc = assignment.doctor

            # Also check any doctors messaged
            doc_ids = set()
            if assigned_doc:
                doc_ids.add(assigned_doc.id)
            messaged_doc_ids = list(PatientDoctorMessage.objects.filter(
                Q(sender=user) | Q(recipient=user)
            ).values_list('sender_id', 'recipient_id'))
            for s, r in messaged_doc_ids:
                doc_ids.add(s)
                doc_ids.add(r)
            doc_ids.discard(user.id)

            doctors = User.objects.filter(id__in=doc_ids, role=User.Role.DOCTOR).select_related('doctor_profile')
            for d in doctors:
                doc_profile = getattr(d, 'doctor_profile', None)
                d_name = (doc_profile.professional_name if doc_profile else '') or d.get_full_name() or f"Dr. {d.username}"
                last_msg = PatientDoctorMessage.objects.filter(
                    Q(sender=user, recipient=d) | Q(sender=d, recipient=user)
                ).order_by('-created_at').first()
                unread_cnt = PatientDoctorMessage.objects.filter(
                    sender=d, recipient=user, is_read=False
                ).count()

                conversations.append({
                    'participant_id': d.id,
                    'participant_name': d_name,
                    'participant_role': 'DOCTOR',
                    'specialization': doc_profile.specialization if doc_profile else 'Ayurvedic Clinical Medicine',
                    'last_message': last_msg.content if last_msg else 'Connected with doctor.',
                    'last_message_time': last_msg.created_at.isoformat() if last_msg else None,
                    'is_last_message_from_me': (last_msg.sender_id == user.id) if last_msg else False,
                    'unread_count': unread_cnt,
                })

        return Response({
            'count': len(conversations),
            'conversations': conversations
        })


class MessagingThreadView(APIView):
    """
    Returns complete chronological message thread between authenticated user and other participant.
    Automatically marks incoming messages as read.
    Displays non-emergency clinical disclaimer.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        curr_user = request.user
        other_user = User.objects.filter(id=user_id).first()
        if not other_user:
            return Response({'error': 'Recipient user not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Strict authorization: Patients cannot access other patients' conversations
        if curr_user.role == User.Role.PATIENT and other_user.role == User.Role.PATIENT:
            return Response(
                {'error': 'Unauthorized: Patient-to-patient direct messaging is not permitted. You may only communicate with authorized clinical practitioners.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Mark incoming messages as read
        unread_qs = PatientDoctorMessage.objects.filter(
            sender=other_user,
            recipient=curr_user,
            is_read=False
        )
        if unread_qs.exists():
            unread_qs.update(is_read=True, read_at=timezone.now())

        # Retrieve thread
        messages = PatientDoctorMessage.objects.filter(
            Q(sender=curr_user, recipient=other_user) |
            Q(sender=other_user, recipient=curr_user)
        ).order_by('created_at')

        # Other user details
        other_profile_name = None
        if other_user.role == User.Role.DOCTOR and hasattr(other_user, 'doctor_profile'):
            other_profile_name = other_user.doctor_profile.professional_name
        elif other_user.role == User.Role.PATIENT and hasattr(other_user, 'patient_profile'):
            other_profile_name = other_user.patient_profile.full_name
        other_name = other_profile_name or other_user.get_full_name() or other_user.username

        return Response({
            'participant': {
                'id': other_user.id,
                'name': other_name,
                'role': other_user.role,
            },
            'count': messages.count(),
            'messages': PatientDoctorMessageSerializer(messages, many=True).data,
            'emergency_disclaimer': (
                "Notice: AyuRAG-XAI messaging is intended for non-urgent clinical communication and dietary guidance. "
                "This platform is NOT an emergency service. In case of acute medical distress or severe allergic reactions, "
                "immediately call your local emergency medical service or visit the nearest emergency center."
            )
        })


class MessagingSendView(APIView):
    """
    Sends an authenticated, persistent message between patient and doctor.
    Validates relationship and emits in-app notification.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        sender = request.user
        recipient_id = request.data.get('recipient_id')
        content = request.data.get('content', '').strip()

        if not recipient_id:
            return Response({'error': 'recipient_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not content:
            return Response({'error': 'Message content cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(content) > 3000:
            return Response({'error': 'Message exceeds maximum length of 3000 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        recipient = User.objects.filter(id=recipient_id).first()
        if not recipient:
            return Response({'error': 'Recipient user not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Cross-role verification
        if sender.role == User.Role.PATIENT:
            if recipient.role == User.Role.PATIENT:
                return Response(
                    {'error': 'Unauthorized: Patient-to-patient direct messaging is not permitted.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            doctor = recipient
            patient = sender
        else:
            doctor = sender
            patient = recipient

        message = PatientDoctorMessage.objects.create(
            sender=sender,
            recipient=recipient,
            doctor=doctor,
            patient=patient,
            content=content
        )

        sender_name = sender.get_full_name() or sender.username
        if sender.role == User.Role.DOCTOR and hasattr(sender, 'doctor_profile'):
            sender_name = sender.doctor_profile.professional_name or sender_name

        # Create notification for recipient
        Notification.objects.create(
            user=recipient,
            type='NEW_MESSAGE',
            title=f'New Message from {sender_name}',
            message=content[:100] + ('...' if len(content) > 100 else ''),
            related_object_type='PatientDoctorMessage',
            related_object_id=message.id
        )

        return Response({
            'message': 'Message sent successfully.',
            'message_data': PatientDoctorMessageSerializer(message).data
        }, status=status.HTTP_201_CREATED)



