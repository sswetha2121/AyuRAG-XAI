from rest_framework import serializers
from .models import (
    PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus,
    PatientVerification, DietPlan, DietPlanVersion, Notification, AuditLog
)
from accounts.models import User, PatientProfile, DoctorProfile

class ClinicalReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = ClinicalReview
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'assessment', 'status', 'summary', 'observations',
            'recommendations', 'follow_up_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient', 'doctor', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        if hasattr(obj.patient, 'patient_profile'):
            return obj.patient.patient_profile.full_name
        return obj.patient.get_full_name() or obj.patient.username

    def get_doctor_name(self, obj):
        if hasattr(obj.doctor, 'doctor_profile'):
            return obj.doctor.doctor_profile.professional_name
        return obj.doctor.get_full_name() or f"Dr. {obj.doctor.username}"


class PatientAssessmentSummarySerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()
    patient_gender = serializers.SerializerMethodField()
    review_status = serializers.SerializerMethodField()
    latest_review_id = serializers.SerializerMethodField()
    primary_prakriti = serializers.SerializerMethodField()
    primary_symptoms = serializers.SerializerMethodField()

    class Meta:
        model = PatientAssessment
        fields = [
            'id', 'patient', 'patient_name', 'patient_age', 'patient_gender',
            'status', 'review_status', 'latest_review_id', 'primary_prakriti',
            'prakriti_scores', 'primary_symptoms', 'ai_analysis',
            'created_at', 'updated_at'
        ]

    def get_patient_name(self, obj):
        if hasattr(obj.patient, 'patient_profile'):
            return obj.patient.patient_profile.full_name
        return obj.demographics.get('fullName') or obj.patient.username

    def get_patient_age(self, obj):
        if hasattr(obj.patient, 'patient_profile') and obj.patient.patient_profile.age:
            return obj.patient.patient_profile.age
        return obj.demographics.get('age', 28)

    def get_patient_gender(self, obj):
        if hasattr(obj.patient, 'patient_profile') and obj.patient.patient_profile.gender:
            return obj.patient.patient_profile.gender
        return obj.demographics.get('gender', 'Unspecified')

    def get_review_status(self, obj):
        latest = obj.reviews.order_by('-updated_at').first()
        return latest.status if latest else ReviewStatus.PENDING

    def get_latest_review_id(self, obj):
        latest = obj.reviews.order_by('-updated_at').first()
        return latest.id if latest else None

    def get_primary_prakriti(self, obj):
        return obj.prakriti_scores.get('primary', 'Vāta-Pitta')

    def get_primary_symptoms(self, obj):
        symptoms = obj.symptoms_data.get('chiefComplaints', [])
        if not symptoms and 'selectedSymptoms' in obj.symptoms_data:
            symptoms = obj.symptoms_data['selectedSymptoms']
        if isinstance(symptoms, list):
            return symptoms[:3]
        return ["Digestive Agnimandya", "Sleep Disturbance"]


class PatientAssessmentDetailSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()
    patient_gender = serializers.SerializerMethodField()
    reviews = ClinicalReviewSerializer(many=True, read_only=True)

    class Meta:
        model = PatientAssessment
        fields = [
            'id', 'patient', 'patient_name', 'patient_age', 'patient_gender',
            'status', 'demographics', 'prakriti_data', 'lifestyle_data',
            'diet_data', 'symptoms_data', 'prakriti_scores',
            'ai_analysis', 'shap_explanations', 'lime_explanations',
            'rag_evidence', 'recommendations', 'reviews',
            'created_at', 'updated_at'
        ]

    def get_patient_name(self, obj):
        if hasattr(obj.patient, 'patient_profile'):
            return obj.patient.patient_profile.full_name
        return obj.demographics.get('fullName') or obj.patient.username

    def get_patient_age(self, obj):
        if hasattr(obj.patient, 'patient_profile') and obj.patient.patient_profile.age:
            return obj.patient.patient_profile.age
        return obj.demographics.get('age', 28)

    def get_patient_gender(self, obj):
        if hasattr(obj.patient, 'patient_profile') and obj.patient.patient_profile.gender:
            return obj.patient.patient_profile.gender
        return obj.demographics.get('gender', 'Unspecified')


class PatientVerificationSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientVerification
        fields = [
            'id', 'patient', 'doctor', 'doctor_name', 'assessment',
            'category', 'field_name', 'field_label',
            'patient_value', 'verified_value', 'verification_status',
            'doctor_note', 'verified_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient', 'doctor', 'doctor_name', 'created_at', 'updated_at']

    def get_doctor_name(self, obj):
        if hasattr(obj.doctor, 'doctor_profile') and obj.doctor.doctor_profile.professional_name:
            return obj.doctor.doctor_profile.professional_name
        return obj.doctor.get_full_name() or f"Dr. {obj.doctor.username}"


class DietPlanVersionSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = DietPlanVersion
        fields = [
            'id', 'diet_plan', 'version_number', 'snapshot_data',
            'change_summary', 'created_by', 'created_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'diet_plan', 'created_at']

    def get_created_by_name(self, obj):
        if not obj.created_by:
            return "System / AI"
        if hasattr(obj.created_by, 'doctor_profile'):
            return obj.created_by.doctor_profile.professional_name
        return obj.created_by.get_full_name() or obj.created_by.username


class DietPlanSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    version_history = DietPlanVersionSerializer(many=True, read_only=True)

    class Meta:
        model = DietPlan
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'assessment', 'version', 'title', 'duration', 'objective',
            'generated_by', 'status',
            'breakfast', 'mid_morning', 'lunch', 'evening', 'dinner',
            'foods_to_include', 'foods_to_avoid',
            'lifestyle_notes', 'precautions',
            'doctor_notes', 'ai_reasoning', 'knowledge_references',
            'approved_by', 'approved_by_name', 'approved_at',
            'version_history', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient', 'doctor', 'approved_by', 'approved_at', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        if hasattr(obj.patient, 'patient_profile'):
            return obj.patient.patient_profile.full_name
        return obj.patient.get_full_name() or obj.patient.username

    def get_doctor_name(self, obj):
        if not obj.doctor:
            return "AyuRAG Engine"
        if hasattr(obj.doctor, 'doctor_profile'):
            return obj.doctor.doctor_profile.professional_name
        return obj.doctor.get_full_name() or f"Dr. {obj.doctor.username}"

    def get_approved_by_name(self, obj):
        if not obj.approved_by:
            return None
        if hasattr(obj.approved_by, 'doctor_profile'):
            return obj.approved_by.doctor_profile.professional_name
        return obj.approved_by.get_full_name() or f"Dr. {obj.approved_by.username}"


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'type', 'title', 'message',
            'related_object_type', 'related_object_id',
            'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id', 'actor', 'actor_name', 'action', 'patient',
            'object_type', 'object_id', 'metadata', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']

    def get_actor_name(self, obj):
        if not obj.actor:
            return "System"
        return obj.actor.get_full_name() or obj.actor.username

