"""
Patient Data Resolver Service.
Single Source of Truth for resolving patient clinical data.
Strictly prioritizes Doctor Verified / Corrected values over Patient-Reported values.
"""

from clinical.models import PatientAssessment, PatientVerification, VerificationStatus
from accounts.models import User

# Standard Assessment Fields mapped to categories and default extractors
ASSESSMENT_FIELDS = [
    # Personal Information
    {'category': 'personal', 'field_name': 'fullName', 'label': 'Full Name', 'default': ''},
    {'category': 'personal', 'field_name': 'age', 'label': 'Age (Years)', 'default': None},
    {'category': 'personal', 'field_name': 'gender', 'label': 'Gender', 'default': ''},
    {'category': 'personal', 'field_name': 'height', 'label': 'Height (cm)', 'default': None},
    {'category': 'personal', 'field_name': 'weight', 'label': 'Weight (kg)', 'default': None},
    {'category': 'personal', 'field_name': 'climate', 'label': 'Climate / Desha', 'default': ''},
    {'category': 'personal', 'field_name': 'location', 'label': 'Location', 'default': ''},

    # Prakriti
    {'category': 'prakriti', 'field_name': 'primary_prakriti', 'label': 'Dominant Dosha Constitution', 'default': 'Vāta-Pitta'},
    {'category': 'prakriti', 'field_name': 'vata_score', 'label': 'Vāta Percentage (%)', 'default': 0},
    {'category': 'prakriti', 'field_name': 'pitta_score', 'label': 'Pitta Percentage (%)', 'default': 0},
    {'category': 'prakriti', 'field_name': 'kapha_score', 'label': 'Kapha Percentage (%)', 'default': 0},

    # Lifestyle
    {'category': 'lifestyle', 'field_name': 'sleep_duration', 'label': 'Sleep Duration (Nidrā)', 'default': ''},
    {'category': 'lifestyle', 'field_name': 'sleep_quality', 'label': 'Sleep Quality & Latency', 'default': ''},
    {'category': 'lifestyle', 'field_name': 'activity_level', 'label': 'Physical Exercise / Vyāyāma', 'default': ''},
    {'category': 'lifestyle', 'field_name': 'stress_level', 'label': 'Mental Stress / Mānasika Chinta', 'default': ''},
    {'category': 'lifestyle', 'field_name': 'circadian_alignment', 'label': 'Daily Routine (Dinacharya Pacing)', 'default': ''},

    # Diet
    {'category': 'diet', 'field_name': 'appetite_pattern', 'label': 'Digestive Fire Rhythm (Agni)', 'default': ''},
    {'category': 'diet', 'field_name': 'meal_frequency', 'label': 'Daily Meal Frequency', 'default': ''},
    {'category': 'diet', 'field_name': 'hydration', 'label': 'Daily Hydration Intake', 'default': ''},
    {'category': 'diet', 'field_name': 'predominant_taste', 'label': 'Predominant Rasa Intake', 'default': ''},

    # Symptoms
    {'category': 'symptoms', 'field_name': 'chief_complaints', 'label': 'Chief Clinical Complaints', 'default': []},
    {'category': 'symptoms', 'field_name': 'symptom_severity', 'label': 'Symptom Severity (Tīvratā)', 'default': ''},
    {'category': 'symptoms', 'field_name': 'chronicity', 'label': 'Duration / Chronicity (Kāla)', 'default': ''},
]

def extract_patient_reported_value(assessment, field_name):
    """
    Extracts the original patient-reported value from the assessment JSON fields.
    """
    if not assessment:
        return None

    demog = assessment.demographics or {}
    prak = assessment.prakriti_scores or {}
    life = assessment.lifestyle_data or {}
    diet = assessment.diet_data or {}
    symp = assessment.symptoms_data or {}

    mapping = {
        'fullName': demog.get('fullName'),
        'age': demog.get('age'),
        'gender': demog.get('gender'),
        'height': demog.get('height'),
        'weight': demog.get('weight'),
        'climate': demog.get('climate'),
        'location': demog.get('location'),
        'primary_prakriti': prak.get('primary') or assessment.prakriti_data.get('primary'),
        'vata_score': prak.get('vata'),
        'pitta_score': prak.get('pitta'),
        'kapha_score': prak.get('kapha'),
        'sleep_duration': life.get('sleepDuration'),
        'sleep_quality': life.get('sleepQuality'),
        'activity_level': life.get('activityLevel'),
        'stress_level': life.get('stressLevel'),
        'circadian_alignment': life.get('circadianAlignment'),
        'appetite_pattern': diet.get('appetitePattern'),
        'meal_frequency': diet.get('mealFrequency'),
        'hydration': diet.get('hydration'),
        'predominant_taste': diet.get('predominantTaste'),
        'chief_complaints': symp.get('chiefComplaints') or symp.get('selectedSymptoms', []),
        'symptom_severity': symp.get('severity'),
        'chronicity': symp.get('chronicity'),
    }
    return mapping.get(field_name)


def initialize_verifications_for_assessment(*args, **kwargs):
    """
    Ensures that every defined clinical field has a corresponding PatientVerification record.
    Supports initialize_verifications_for_assessment(assessment, doctor)
    or initialize_verifications_for_assessment(patient, assessment, doctor).
    """
    assessment = None
    doctor = None

    if len(args) == 3:
        # (patient, assessment, doctor)
        _, assessment, doctor = args
    elif len(args) == 2:
        # (assessment, doctor)
        assessment, doctor = args
    elif len(args) == 1:
        assessment = args[0]

    assessment = kwargs.get('assessment', assessment)
    doctor = kwargs.get('doctor', doctor)

    if not assessment:
        return []

    if not doctor and hasattr(assessment, 'patient'):
        # Fallback to any doctor or first user
        doctor = User.objects.filter(role=User.Role.DOCTOR).first() or assessment.patient

    created_or_found = []
    for defn in ASSESSMENT_FIELDS:
        fname = defn['field_name']
        patient_val = extract_patient_reported_value(assessment, fname)
        
        verification, created = PatientVerification.objects.get_or_create(
            patient=assessment.patient,
            assessment=assessment,
            field_name=fname,
            defaults={
                'doctor': doctor,
                'category': defn['category'],
                'field_label': defn['label'],
                'patient_value': patient_val if patient_val is not None else defn['default'],
                'verified_value': None,
                'verification_status': VerificationStatus.UNVERIFIED,
                'doctor_note': '',
            }
        )
        created_or_found.append(verification)

    return created_or_found


def get_effective_patient_profile(patient_id, assessment_id=None):
    """
    Resolves the single source of truth for the patient.
    Priority:
    1. DOCTOR VERIFIED / CORRECTED VALUE
    2. PATIENT REPORTED VALUE
    3. NULL / DEFAULT
    """
    try:
        patient = User.objects.get(pk=patient_id)
    except User.DoesNotExist:
        return None

    # Get latest assessment if not specified
    if assessment_id:
        assessment = PatientAssessment.objects.filter(pk=assessment_id, patient=patient).first()
    else:
        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-created_at').first()

    verifications = {}
    if assessment:
        qs = PatientVerification.objects.filter(patient=patient, assessment=assessment)
        for v in qs:
            verifications[v.field_name] = v

    # Resolve each field
    field_details = []
    effective_data = {
        'personal': {},
        'prakriti': {},
        'lifestyle': {},
        'diet': {},
        'symptoms': {},
    }

    verified_count = 0
    corrected_count = 0
    unverified_count = 0

    for defn in ASSESSMENT_FIELDS:
        fname = defn['field_name']
        category = defn['category']
        label = defn['label']
        patient_raw = extract_patient_reported_value(assessment, fname) if assessment else None

        v_obj = verifications.get(fname)
        
        if v_obj and v_obj.verification_status == VerificationStatus.CORRECTED:
            effective_val = v_obj.verified_value
            status = 'CORRECTED'
            doctor_note = v_obj.doctor_note
            verified_at = v_obj.verified_at
            doctor_name = v_obj.doctor.get_full_name() or v_obj.doctor.username
            corrected_count += 1
        elif v_obj and v_obj.verification_status == VerificationStatus.VERIFIED:
            effective_val = v_obj.verified_value if v_obj.verified_value is not None else patient_raw
            status = 'VERIFIED'
            doctor_note = v_obj.doctor_note
            verified_at = v_obj.verified_at
            doctor_name = v_obj.doctor.get_full_name() or v_obj.doctor.username
            verified_count += 1
        else:
            effective_val = patient_raw if patient_raw is not None else defn['default']
            status = 'UNVERIFIED'
            doctor_note = ''
            verified_at = None
            doctor_name = None
            unverified_count += 1

        effective_data[category][fname] = effective_val

        field_details.append({
            'field_name': fname,
            'field_label': label,
            'category': category,
            'patient_reported': patient_raw,
            'doctor_verified': v_obj.verified_value if v_obj else None,
            'effective_value': effective_val,
            'status': status,
            'doctor_note': doctor_note,
            'verified_at': verified_at,
            'doctor_name': doctor_name,
            'verification_id': v_obj.id if v_obj else None,
        })

    return {
        'patient_id': patient.id,
        'patient_username': patient.username,
        'assessment_id': assessment.id if assessment else None,
        'assessment_status': assessment.status if assessment else 'NONE',
        'effective_profile': effective_data,
        'field_details': field_details,
        'verification_summary': {
            'total_fields': len(ASSESSMENT_FIELDS),
            'verified_count': verified_count,
            'corrected_count': corrected_count,
            'unverified_count': unverified_count,
            'is_fully_verified': unverified_count == 0,
            'verification_percentage': round(((verified_count + corrected_count) / max(len(ASSESSMENT_FIELDS), 1)) * 100),
        }
    }
