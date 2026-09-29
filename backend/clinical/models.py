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

class VerificationStatus(models.TextChoices):
    UNVERIFIED = 'UNVERIFIED', 'Unverified'
    VERIFIED = 'VERIFIED', 'Verified by Doctor'
    CORRECTED = 'CORRECTED', 'Corrected by Doctor'

class DietPlanStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PENDING_DOCTOR_APPROVAL = 'PENDING_DOCTOR_APPROVAL', 'Pending Doctor Approval'
    ACTIVE = 'ACTIVE', 'Active (Prescribed)'
    REJECTED = 'REJECTED', 'Rejected'
    ARCHIVED = 'ARCHIVED', 'Archived'

class DietPlanGeneratedBy(models.TextChoices):
    AI = 'AI', 'AI Generated'
    DOCTOR = 'DOCTOR', 'Doctor Authored'
    AI_ASSISTED_DOCTOR = 'AI_ASSISTED_DOCTOR', 'AI-Assisted Doctor Modified'

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
    ai_analysis = models.JSONField(default=dict, blank=True) # { prediction: "...", confidence: 0.88, model_name: "..." }
    shap_explanations = models.JSONField(default=list, blank=True)
    lime_explanations = models.JSONField(default=list, blank=True)
    rag_evidence = models.JSONField(default=list, blank=True)
    recommendations = models.JSONField(default=dict, blank=True)
    
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


class PatientVerification(models.Model):
    """
    Verification layer that preserves both:
    1. Patient-Reported Value
    2. Doctor-Verified or Corrected Value
    without overwriting the original patient submission.
    """
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='verifications')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conducted_verifications')
    assessment = models.ForeignKey(PatientAssessment, on_delete=models.CASCADE, related_name='field_verifications', null=True, blank=True)
    
    category = models.CharField(max_length=50) # 'personal', 'prakriti', 'lifestyle', 'diet', 'symptoms'
    field_name = models.CharField(max_length=100) # e.g. 'sleep_duration', 'dominant_prakriti', 'appetite', 'stress_level'
    field_label = models.CharField(max_length=150, blank=True)
    
    patient_value = models.JSONField(default=dict, blank=True, null=True)
    verified_value = models.JSONField(default=dict, blank=True, null=True)
    
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.UNVERIFIED
    )
    doctor_note = models.TextField(blank=True)
    
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'field_name']
        unique_together = ('patient', 'assessment', 'field_name')

    def __str__(self):
        return f"{self.field_name} [{self.verification_status}] for {self.patient.username}"


class DietPlan(models.Model):
    """
    Versioned personalized Ayurvedic diet plan.
    Cannot be directly activated by a patient; requires authorized doctor approval.
    """
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diet_plans')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_diet_plans')
    assessment = models.ForeignKey(PatientAssessment, on_delete=models.SET_NULL, null=True, blank=True, related_name='diet_plans')
    
    version = models.IntegerField(default=1)
    title = models.CharField(max_length=255, default='Personalized Ayurvedic Pathya Ahara Protocol')
    duration = models.CharField(max_length=100, default='14 Days Pacing Cycle')
    objective = models.TextField(blank=True)
    
    generated_by = models.CharField(
        max_length=30,
        choices=DietPlanGeneratedBy.choices,
        default=DietPlanGeneratedBy.AI
    )
    status = models.CharField(
        max_length=30,
        choices=DietPlanStatus.choices,
        default=DietPlanStatus.DRAFT
    )
    
    # Structured Meals
    breakfast = models.JSONField(default=dict, blank=True) # { time: "08:00 AM", items: [...], notes: "..." }
    mid_morning = models.JSONField(default=dict, blank=True) # { time: "11:00 AM", items: [...], notes: "..." }
    lunch = models.JSONField(default=dict, blank=True) # { time: "01:30 PM", items: [...], notes: "..." }
    evening = models.JSONField(default=dict, blank=True) # { time: "05:00 PM", items: [...], notes: "..." }
    dinner = models.JSONField(default=dict, blank=True) # { time: "08:00 PM", items: [...], notes: "..." }
    
    # Guidelines & Lists
    foods_to_include = models.JSONField(default=list, blank=True)
    foods_to_avoid = models.JSONField(default=list, blank=True)
    lifestyle_notes = models.JSONField(default=list, blank=True)
    precautions = models.JSONField(default=list, blank=True)
    
    # Physician Overrides & Provenance
    doctor_notes = models.TextField(blank=True)
    ai_reasoning = models.TextField(blank=True)
    knowledge_references = models.JSONField(default=list, blank=True)
    
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_diet_plans')
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-version', '-created_at']

    def __str__(self):
        return f"DietPlan v{self.version} [{self.status}] for {self.patient.username}"


class DietPlanVersion(models.Model):
    """
    Complete audit snapshot of previous diet plan iterations.
    """
    diet_plan = models.ForeignKey(DietPlan, on_delete=models.CASCADE, related_name='version_history')
    version_number = models.IntegerField()
    snapshot_data = models.JSONField(default=dict)
    change_summary = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-version_number']

    def __str__(self):
        return f"Snapshot v{self.version_number} of Plan #{self.diet_plan_id}"


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=60, default='GENERAL')
    title = models.CharField(max_length=255)
    message = models.TextField()
    related_object_type = models.CharField(max_length=100, blank=True)
    related_object_id = models.IntegerField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"


class AuditAction(models.TextChoices):
    DOCTOR_VERIFIED_FIELD = 'DOCTOR_VERIFIED_FIELD', 'Doctor Verified Field'
    DOCTOR_CORRECTED_FIELD = 'DOCTOR_CORRECTED_FIELD', 'Doctor Corrected Field'
    AI_DIET_GENERATED = 'AI_DIET_GENERATED', 'AI Diet Generated'
    DOCTOR_EDITED_DIET = 'DOCTOR_EDITED_DIET', 'Doctor Edited Diet'
    DIET_APPROVED = 'DIET_APPROVED', 'Diet Plan Approved'
    DIET_REJECTED = 'DIET_REJECTED', 'Diet Plan Rejected'
    DIET_ARCHIVED = 'DIET_ARCHIVED', 'Diet Plan Archived'


class AuditLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_actions')
    action = models.CharField(max_length=100, choices=AuditAction.choices)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_audit_logs')
    object_type = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.actor} - {self.action} on patient {self.patient_id}"
