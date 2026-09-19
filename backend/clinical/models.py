from django.db import models
from django.conf import settings

class AssessmentStatus(models.TextChoices):
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    COMPLETED = 'COMPLETED', 'Completed'
    UNDER_REVIEW = 'UNDER_REVIEW', 'Under Clinical Review'
    VALIDATED = 'VALIDATED', 'Validated by Doctor'

class ReviewStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending Review'
    IN_REVIEW = 'IN_REVIEW', 'In Review'
    COMPLETED = 'COMPLETED', 'Completed'

class PatientAssessment(models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessments')
    status = models.CharField(max_length=30, choices=AssessmentStatus.choices, default=AssessmentStatus.COMPLETED)
    
    # Baseline demographics snapshot
    demographics = models.JSONField(default=dict, blank=True)
    
    # 5 Assessment modules
    prakriti_data = models.JSONField(default=dict, blank=True)
    lifestyle_data = models.JSONField(default=dict, blank=True)
    diet_data = models.JSONField(default=dict, blank=True)
    symptoms_data = models.JSONField(default=dict, blank=True)
    
    # Computed scores
    prakriti_scores = models.JSONField(default=dict, blank=True) # { vata: 42, pitta: 36, kapha: 22, primary: "Vata-Pitta" }
    
    # AI/ML Inference and Explainability
    ai_analysis = models.JSONField(default=dict, blank=True) # { prediction: "Vata Vyadhi (Agni Mandya)", confidence: 0.88, model_name: "XGBoost Classifier v2.1" }
    shap_explanations = models.JSONField(default=list, blank=True) # [{ feature: "Irregular Sleep", contribution: 0.35, direction: "positive" }, ...]
    lime_explanations = models.JSONField(default=list, blank=True) # [{ feature: "Appetite Irregularity", weight: 0.28, type: "positive" }, ...]
    rag_evidence = models.JSONField(default=list, blank=True) # [{ source: "Charaka Samhita Sutrasthana 12.11", passage: "...", relevance_score: 0.94 }, ...]
    recommendations = models.JSONField(default=dict, blank=True) # { lifestyle: [...], ahara: [...], herbs: [...], precautions: [...] }
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Assessment #{self.id} for {self.patient.username} ({self.status})"


class ClinicalReview(models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_clinical_reviews')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conducted_clinical_reviews')
    assessment = models.ForeignKey(PatientAssessment, on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=ReviewStatus.choices, default=ReviewStatus.PENDING)
    summary = models.TextField(blank=True)
    observations = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    follow_up_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Review #{self.id} [{self.status}] for {self.patient.username} by Dr. {self.doctor.username}"
