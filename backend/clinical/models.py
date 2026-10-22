from django.db import models
from django.conf import settings
from django.utils import timezone

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
    PENDING_REVIEW = 'PENDING_REVIEW', 'Pending Review'
    PENDING_DOCTOR_APPROVAL = 'PENDING_DOCTOR_APPROVAL', 'Pending Doctor Approval'
    PUBLISHED = 'PUBLISHED', 'Published'
    ACTIVE = 'ACTIVE', 'Active (Prescribed)'
    SUPERSEDED = 'SUPERSEDED', 'Superseded'
    REJECTED = 'REJECTED', 'Rejected'
    ARCHIVED = 'ARCHIVED', 'Archived'

class DietPlanGeneratedBy(models.TextChoices):
    AI = 'AI', 'AI Generated'
    DOCTOR = 'DOCTOR', 'Doctor Authored'
    AI_ASSISTED_DOCTOR = 'AI_ASSISTED_DOCTOR', 'AI-Assisted Doctor Modified'

class PatientAssessment(models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessments')
    status = models.CharField(max_length=30, choices=AssessmentStatus.choices, default=AssessmentStatus.COMPLETED, db_index=True)
    
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
    
    status = models.CharField(max_length=20, choices=ReviewStatus.choices, default=ReviewStatus.PENDING, db_index=True)
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
        default=DietPlanStatus.DRAFT,
        db_index=True
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
    
    # Nutritional Calculations & Constraints
    nutritional_totals = models.JSONField(default=dict, blank=True)
    dietary_preference = models.CharField(max_length=50, default='VEGETARIAN', blank=True)
    allergens_excluded = models.JSONField(default=list, blank=True)
    regional_preference = models.CharField(max_length=100, blank=True, default='North Indian')
    hydration_guidance = models.TextField(blank=True, default='')
    daily_routine_guidance = models.TextField(blank=True, default='')

    # Physician Overrides & Provenance
    doctor_notes = models.TextField(blank=True)
    ai_reasoning = models.TextField(blank=True)
    knowledge_references = models.JSONField(default=list, blank=True)
    
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_diet_plans')
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_published(self):
        return self.status in [DietPlanStatus.PUBLISHED, DietPlanStatus.ACTIVE]

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
    is_read = models.BooleanField(default=False, db_index=True)
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
    DOCTOR_REVIEW_SAVED = 'DOCTOR_REVIEW_SAVED', 'Clinical Review Saved'
    DOCTOR_REVIEW_COMPLETED = 'DOCTOR_REVIEW_COMPLETED', 'Clinical Review Completed & Signed'
    CASE_ACCESSED = 'CASE_ACCESSED', 'Clinical Case Accessed'


class AuditLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_actions')
    action = models.CharField(max_length=100, choices=AuditAction.choices, db_index=True)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_audit_logs')
    object_type = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp}] {self.actor} - {self.action} on patient {self.patient_id}"


class MealType(models.TextChoices):
    BREAKFAST = 'BREAKFAST', 'Breakfast'
    MID_MORNING = 'MID_MORNING', 'Mid-Morning Snack'
    LUNCH = 'LUNCH', 'Lunch'
    EVENING = 'EVENING', 'Evening Snack'
    DINNER = 'DINNER', 'Dinner'


class MealLogStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    COMPLETED = 'COMPLETED', 'Completed'
    PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED', 'Partially Completed'
    SKIPPED = 'SKIPPED', 'Skipped'
    NOT_DONE = 'NOT_DONE', 'Not Yet Done'


class MealLog(models.Model):
    """
    Daily meal tracking record for a patient.
    Tracks whether scheduled meals were completed, partially completed, skipped, or not yet done.
    """
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='meal_logs')
    diet_plan = models.ForeignKey(DietPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='logged_meals')
    date = models.DateField()
    meal_type = models.CharField(max_length=30, choices=MealType.choices)
    meal_name = models.CharField(max_length=255)
    scheduled_time = models.CharField(max_length=50, default='08:00 AM')
    status = models.CharField(max_length=30, choices=MealLogStatus.choices, default=MealLogStatus.PENDING)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    skip_reason = models.CharField(max_length=255, blank=True, default='')
    symptom_notes = models.TextField(blank=True, default='')
    difficulty_reported = models.TextField(blank=True, default='')
    portion_consumed = models.CharField(max_length=50, blank=True, default='')
    energy_rating = models.IntegerField(null=True, blank=True) # 1 to 5
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'scheduled_time']
        unique_together = ('patient', 'date', 'meal_type')

    def __str__(self):
        return f"{self.patient.username} - {self.date} {self.meal_type} [{self.status}]"


class MealReminderPreference(models.Model):
    """
    Patient-configured notification and reminder schedule for meals and hydration.
    """
    patient = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reminder_preferences')
    reminders_enabled = models.BooleanField(default=True)
    breakfast_reminder = models.BooleanField(default=True)
    breakfast_time = models.CharField(max_length=20, default='07:45 AM')
    mid_morning_reminder = models.BooleanField(default=True)
    mid_morning_time = models.CharField(max_length=20, default='10:45 AM')
    lunch_reminder = models.BooleanField(default=True)
    lunch_time = models.CharField(max_length=20, default='01:15 PM')
    evening_reminder = models.BooleanField(default=True)
    evening_time = models.CharField(max_length=20, default='04:45 PM')
    dinner_reminder = models.BooleanField(default=True)
    dinner_time = models.CharField(max_length=20, default='07:30 PM')
    water_reminders = models.BooleanField(default=True)
    water_interval_hours = models.IntegerField(default=2)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reminders for {self.patient.username} (enabled={self.reminders_enabled})"


class ProgressRecord(models.Model):
    """
    Daily aggregated adherence, water intake, and wellness summary for a patient.
    """
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_records')
    date = models.DateField()
    meals_planned = models.IntegerField(default=5)
    meals_completed = models.IntegerField(default=0)
    meals_partially_completed = models.IntegerField(default=0)
    meals_skipped = models.IntegerField(default=0)
    water_intake_ml = models.IntegerField(default=0)
    water_goal_ml = models.IntegerField(default=2500)
    adherence_rate = models.FloatField(default=0.0) # Percentage 0-100
    energy_rating = models.IntegerField(null=True, blank=True) # 1 to 5
    wellness_note = models.TextField(blank=True)
    reported_difficulties = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('patient', 'date')

    def __str__(self):
        return f"{self.patient.username} - {self.date} Progress ({self.adherence_rate}%)"


class DoctorPatientAssignment(models.Model):
    """
    Authorized clinical relationship linking an attending physician to a patient.
    Governs data access, clinical monitoring, care plan publishing, and messaging.
    """
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_assignments')
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, db_index=True)
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-assigned_at']
        unique_together = ('doctor', 'patient')

    def __str__(self):
        return f"Dr. {self.doctor.username} -> {self.patient.username} (Active: {self.is_active})"


class PatientDoctorMessage(models.Model):
    """
    Authenticated, persistent communications between an assigned doctor and patient.
    Includes clinical disclaimer notice that messaging is not for emergency triage.
    """
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_messages')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username} [{self.created_at}]"


class PatientDietDifficultyReport(models.Model):
    """
    Patient-reported difficulty, side effect, or adverse symptom following dietary advice.
    Alerts the attending physician on the monitoring dashboard.
    """
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diet_difficulty_reports')
    diet_plan = models.ForeignKey(DietPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='difficulty_reports')
    date = models.DateField(default=timezone.localdate)
    meal_type = models.CharField(max_length=30, blank=True, default='')
    difficulty_description = models.TextField()
    symptoms = models.TextField(blank=True, default='')
    severity = models.CharField(max_length=30, default='MILD') # MILD, MODERATE, SEVERE
    reviewed_by_doctor = models.BooleanField(default=False, db_index=True)
    doctor_response = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Difficulty report by {self.patient.username} on {self.date} ({self.severity})"


class FoodItem(models.Model):
    """
    Standardized clinical food item record based on ICMR-NIN IFCT 2017 standards
    and classical Ayurvedic Pathya-Apathya clinical classifications.
    Provides verified portion sizes, macro/micronutrients, and dietary attributes.
    """
    class Category(models.TextChoices):
        CEREALS_MILLETS = 'cereals_millets', 'Cereals & Millets'
        PULSES_LEGUMES = 'pulses_legumes', 'Pulses & Legumes'
        VEGETABLES = 'vegetables', 'Vegetables'
        FRUITS = 'fruits', 'Fruits'
        DAIRY_ALTERNATIVES = 'dairy_alternatives', 'Dairy & Milks'
        HEALTHY_FATS = 'healthy_fats', 'Healthy Fats & Oils'
        NUTS_SEEDS = 'nuts_seeds', 'Nuts & Seeds'
        BEVERAGES_DIGESTIVES = 'beverages_digestives', 'Herbal Beverages & Digestives'

    food_id = models.CharField(max_length=64, unique=True, db_index=True)
    name = models.CharField(max_length=255, db_index=True)
    regional_names = models.JSONField(default=dict, blank=True)
    category = models.CharField(max_length=64, db_index=True, choices=Category.choices)
    state = models.CharField(max_length=32, default='cooked')  # cooked / raw / infused
    serving_basis = models.CharField(max_length=64, default='per 100g')
    standard_portion_unit = models.CharField(max_length=64, default='serving')
    standard_portion_grams = models.FloatField(default=100.0)
    standard_portion_desc = models.CharField(max_length=255, blank=True, default='')

    # Macronutrients per 100g (nullable to preserve unknown values without fabricating)
    energy_kcal = models.FloatField(null=True, blank=True)
    protein_g = models.FloatField(null=True, blank=True)
    carbohydrates_g = models.FloatField(null=True, blank=True)
    fat_g = models.FloatField(null=True, blank=True)
    dietary_fiber_g = models.FloatField(null=True, blank=True)

    # Micronutrients per 100g
    micronutrients = models.JSONField(default=dict, blank=True)

    # Dietary & Clinical Tags
    dietary_tags = models.JSONField(default=list, blank=True)
    allergens = models.JSONField(default=list, blank=True)
    dosha_affinity = models.JSONField(default=dict, blank=True)
    rasa = models.JSONField(default=list, blank=True)
    preparation_method = models.TextField(blank=True, default='')

    # Provenance & Verification
    data_source = models.CharField(max_length=255, default='Indian Food Composition Tables (IFCT 2017, ICMR-NIN)')
    provenance = models.CharField(max_length=255, default='ICMR-NIN IFCT 2017')
    verification_status = models.CharField(max_length=32, default='VERIFIED')  # VERIFIED, DEV_SEED, UNVERIFIED_CUSTOM
    is_dev_seed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Food Item'
        verbose_name_plural = 'Food Items'

    def __str__(self):
        return f"{self.name} ({self.food_id})"

    def calculate_nutrients_for_grams(self, grams: float):
        factor = grams / 100.0
        return {
            'calories_kcal': round(self.energy_kcal * factor, 1) if self.energy_kcal is not None else None,
            'protein_g': round(self.protein_g * factor, 1) if self.protein_g is not None else None,
            'carbohydrates_g': round(self.carbohydrates_g * factor, 1) if self.carbohydrates_g is not None else None,
            'fat_g': round(self.fat_g * factor, 1) if self.fat_g is not None else None,
            'fiber_g': round(self.dietary_fiber_g * factor, 1) if self.dietary_fiber_g is not None else None,
        }

    def to_catalogue_dict(self):
        std_grams = self.standard_portion_grams or 100.0
        nut_portion = self.calculate_nutrients_for_grams(std_grams)
        return {
            'food_id': self.food_id,
            'name': self.name,
            'regional_names': self.regional_names or {},
            'category': self.category,
            'state': self.state,
            'portion_grams': std_grams,
            'standard_portion_desc': self.standard_portion_desc or f"{std_grams}g ({self.standard_portion_unit})",
            'standard_portion': {
                'unit': self.standard_portion_unit,
                'grams': std_grams,
                'description': self.standard_portion_desc or f"{std_grams}g"
            },
            'nutrients_per_100g': {
                'energy_kcal': self.energy_kcal,
                'protein_g': self.protein_g,
                'carbohydrates_g': self.carbohydrates_g,
                'fat_g': self.fat_g,
                'dietary_fiber_g': self.dietary_fiber_g,
            },
            'nutrients_per_portion': nut_portion,
            'micronutrients_per_100g': self.micronutrients or {},
            'dietary_tags': self.dietary_tags or [],
            'allergens': self.allergens or [],
            'preparation_method': self.preparation_method,
            'dosha_affinity': self.dosha_affinity or {},
            'rasa': self.rasa or [],
            'source': self.data_source,
            'source_citation': self.data_source,
            'provenance': self.provenance,
            'verification_status': self.verification_status,
            'is_dev_seed': self.is_dev_seed,
        }

