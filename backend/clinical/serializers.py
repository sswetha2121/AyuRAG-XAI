from rest_framework import serializers
from .models import PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus
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
