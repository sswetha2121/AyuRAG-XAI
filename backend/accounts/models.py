from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        PATIENT = 'PATIENT', 'Patient'
        DOCTOR = 'DOCTOR', 'Doctor'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.PATIENT)
    email = models.EmailField(unique=True)

    def is_doctor(self):
        return self.role == self.Role.DOCTOR

    def is_patient(self):
        return self.role == self.Role.PATIENT

    def __str__(self):
        return f"{self.username} [{self.role}]"


class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    professional_name = models.CharField(max_length=255)
    qualification = models.CharField(max_length=255, default='BAMS, MD (Ayurveda)')
    specialization = models.CharField(max_length=255, default='Kayachikitsa (Ayurvedic Internal Medicine)')
    clinical_license = models.CharField(max_length=100, default='AYUSH-DEL-2018-4421')
    experience_years = models.IntegerField(default=12)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.professional_name} ({self.specialization})"


class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    full_name = models.CharField(max_length=255)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=50, blank=True)
    contact_phone = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} (Age: {self.age})"
