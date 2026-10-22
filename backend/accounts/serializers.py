from rest_framework import serializers
from .models import User, DoctorProfile, PatientProfile

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = [
            'professional_name',
            'qualification',
            'specialization',
            'clinical_license',
            'experience_years',
            'clinic_institution',
            'approval_status',
            'approved_at',
            'rejection_reason',
            'created_at'
        ]
        read_only_fields = ['approval_status', 'approved_at', 'approved_by', 'rejection_reason', 'created_at']

class PatientProfileSerializer(serializers.ModelSerializer):
    patient_id = serializers.CharField(read_only=True)
    assigned_doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientProfile
        fields = ['patient_id', 'full_name', 'age', 'gender', 'contact_phone', 'assigned_doctor', 'assigned_doctor_name', 'created_at']

    def get_assigned_doctor_name(self, obj):
        if obj.assigned_doctor:
            if hasattr(obj.assigned_doctor, 'doctor_profile'):
                return obj.assigned_doctor.doctor_profile.professional_name
            return obj.assigned_doctor.get_full_name() or f"Dr. {obj.assigned_doctor.username}"
        return None

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'role', 'profile']

    def get_name(self, obj):
        if obj.role == User.Role.DOCTOR and hasattr(obj, 'doctor_profile'):
            return obj.doctor_profile.professional_name
        if hasattr(obj, 'patient_profile'):
            return obj.patient_profile.full_name
        return obj.get_full_name() or obj.username

    def get_profile(self, obj):
        if obj.role == User.Role.DOCTOR and hasattr(obj, 'doctor_profile'):
            return DoctorProfileSerializer(obj.doctor_profile).data
        if hasattr(obj, 'patient_profile'):
            return PatientProfileSerializer(obj.patient_profile).data
        return {}
