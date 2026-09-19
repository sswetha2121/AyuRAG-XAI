from rest_framework import serializers
from .models import User, DoctorProfile, PatientProfile

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ['professional_name', 'qualification', 'specialization', 'clinical_license', 'experience_years', 'created_at']

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['full_name', 'age', 'gender', 'contact_phone', 'created_at']

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
