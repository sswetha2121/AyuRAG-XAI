import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone
from accounts.models import DoctorProfile, PatientProfile
from clinical.models import (
    PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus,
    PatientVerification, VerificationStatus,
    DietPlan, DietPlanStatus, DietPlanGeneratedBy, DietPlanVersion,
    Notification, AuditLog, AuditAction,
    MealLog, MealReminderPreference, ProgressRecord, MealType, MealLogStatus,
    DoctorPatientAssignment, PatientDoctorMessage, PatientDietDifficultyReport
)
from clinical.services.patient_data_resolver import (
    initialize_verifications_for_assessment,
    ASSESSMENT_FIELDS
)
from clinical.services.nutritional_engine import calculate_day_nutrients

User = get_user_model()

class Command(BaseCommand):
    help = 'Idempotently seeds comprehensive realistic Ayurvedic clinical demo patients, assessments, verifications, care plans, audit logs, and notifications.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force seeding even in non-development environments'
        )

    def handle(self, *args, **options):
        # Production Safety Guard
        if getattr(settings, 'IS_PRODUCTION', False) and not options.get('force'):
            self.stdout.write(self.style.ERROR('Refusing to seed demo data in production environment without --force flag.'))
            return

        self.stdout.write(self.style.NOTICE('Starting AyuRAG-XAI clinical demo data seeding...'))

        now = timezone.now()

        # ---------------------------------------------------------------------
        # 1. Doctors Seeding (Idempotent)
        # ---------------------------------------------------------------------
        dr_sharma, _ = User.objects.get_or_create(
            username='dr.sharma',
            defaults={
                'email': 'dr.sharma@ayurag.org',
                'first_name': 'Abhinav',
                'last_name': 'Sharma',
                'role': User.Role.DOCTOR,
                'is_staff': True,
            }
        )
        dr_sharma.set_password('doctor123')
        dr_sharma.role = User.Role.DOCTOR
        dr_sharma.save()

        DoctorProfile.objects.update_or_create(
            user=dr_sharma,
            defaults={
                'professional_name': 'Dr. Abhinav Sharma',
                'qualification': 'BAMS, MD (Internal Medicine)',
                'specialization': 'Internal Medicine & Constitutional Analysis',
                'clinical_license': 'AYUSH-DEL-2018-8492',
                'experience_years': 14,
                'clinic_institution': 'AyuRAG Clinical Decision Support Center, New Delhi',
                'approval_status': DoctorProfile.ApprovalStatus.APPROVED,
                'approved_at': now - datetime.timedelta(days=180),
            }
        )

        dr_menon, _ = User.objects.get_or_create(
            username='dr.menon',
            defaults={
                'email': 'dr.menon@ayurag.org',
                'first_name': 'Vasudevan',
                'last_name': 'Menon',
                'role': User.Role.DOCTOR,
                'is_staff': True,
            }
        )
        dr_menon.set_password('doctor123')
        dr_menon.role = User.Role.DOCTOR
        dr_menon.save()

        DoctorProfile.objects.update_or_create(
            user=dr_menon,
            defaults={
                'professional_name': 'Dr. Vasudevan Menon',
                'qualification': 'BAMS, Fellowship in Detoxification & Rejuvenation Therapies',
                'specialization': 'Detoxification Therapies & Constitutional Medicine',
                'clinical_license': 'AYUSH-KER-2015-3211',
                'experience_years': 18,
                'clinic_institution': 'Ayurvedic Constitutional Health Institute, Kochi',
                'approval_status': DoctorProfile.ApprovalStatus.APPROVED,
                'approved_at': now - datetime.timedelta(days=210),
            }
        )

        self.stdout.write(f'  [OK] Doctors verified: Dr. Abhinav Sharma, Dr. Vasudevan Menon')

        # ---------------------------------------------------------------------
        # 2. 10 Comprehensive Fictional Demo Patient Profiles
        # ---------------------------------------------------------------------
        demo_patients = [
            {
                'username': 'demo.swetha.chowdary',
                'aliases': ['swetha.chowdary'],
                'full_name': 'Swetha Chowdary (DEMO DATA)',
                'display_name': 'Swetha Chowdary',
                'email': 'swetha.chowdary@example.com',
                'age': 24,
                'gender': 'Female',
                'location': 'Bangalore, Karnataka',
                'climate': 'Tropical Savanna / Moderate Elevation',
                'height': 165,
                'weight': 56,
                'primary_prakriti': 'Movement & Metabolism',
                'prakriti_scores': {'vata': 48, 'pitta': 34, 'kapha': 18, 'primary': 'Movement & Metabolism'},
                'chief_symptoms': [
                    'Weak Digestion with Post-Prandial Heaviness',
                    'Sleep Onset Latency > 45 mins',
                    'Lower Abdominal Bloating'
                ],
                'chronicity': '4 months',
                'severity': 'Moderate to High',
                'medical_history': 'Seasonal allergic rhinitis; no prior surgical interventions or chronic comorbidities.',
                'contraindications': [
                    'Strictly avoid cold, dry, moisture-depleted breakfast cereals.',
                    'Contraindicated for intense purgation due to sensitive constitutional threshold.'
                ],
                'lifestyle': {
                    'sleepDuration': '6-7 hours',
                    'sleepQuality': 'Interrupted by rumination & latency',
                    'activityLevel': 'Moderate (light evening yoga)',
                    'stressLevel': 'High (Mental Strain from work deadlines)',
                    'circadianAlignment': 'Irregular dinner hours (>21:45)'
                },
                'diet': {
                    'appetitePattern': 'Irregular (Variable Digestion)',
                    'mealFrequency': '2-3 meals daily, skipping breakfast twice a week',
                    'hydration': '1.8L daily (mostly room temperature or iced teas)',
                    'predominantTaste': 'Pungent & Bitter'
                },
                'ai_analysis': {
                    'prediction': 'Movement & Metabolism Digestive Imbalance with Sleep Disruption',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.892,
                    'entropy_score': 0.18,
                    'inference_timestamp': (now - datetime.timedelta(days=2)).isoformat(),
                    'limitations': 'Deterministic decision support algorithm. Rule attribution is derived from patient questionnaire baseline responses.'
                },
                'shap_explanations': [
                    {'feature': 'Irregular Sleep Duration (<6.5 hrs)', 'contribution': 0.36, 'direction': 'positive'},
                    {'feature': 'Cold/Dry Dietary Intake Frequency', 'contribution': 0.28, 'direction': 'positive'},
                    {'feature': 'High Occupational Stress', 'contribution': 0.22, 'direction': 'positive'},
                    {'feature': 'Skipping Breakfast', 'contribution': 0.19, 'direction': 'positive'},
                    {'feature': 'Regular Warm Water Intake Habit', 'contribution': -0.14, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Sleep onset latency > 45 mins', 'weight': 0.34, 'type': 'positive'},
                    {'feature': 'Bloating within 1hr post-prandial', 'weight': 0.29, 'type': 'positive'},
                    {'feature': 'Irregular appetite cycle', 'weight': 0.21, 'type': 'positive'},
                    {'feature': 'Absence of chronic metabolic history', 'weight': -0.12, 'type': 'negative'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Internal Medicine Treatise, Ch. 12)',
                        'passage': 'Movement energy possesses dry, cool, light, subtle, and mobile properties. When disturbed by cold and dry food, digestion becomes irregular and fluctuating.',
                        'relevance_score': 0.942,
                        'domain': 'Pathophysiology of Digestive Function & Energy Imbalance'
                    },
                    {
                        'source': 'Classical Compendium (Daily Living & Restorative Physiology)',
                        'passage': 'Wholesome restorative sleep maintains vitality, tissue integrity, and autonomic metabolic stability.',
                        'relevance_score': 0.887,
                        'domain': 'Daily Routine & Sleep Physiology'
                    }
                ],
                'recommendations': {
                    'ahara': [
                        'Warm, lightly seasoned, freshly cooked lentil soups (split mung bean) with a pinch of ginger and rock salt.',
                        'Avoid dry cereals, chilled beverages, and raw salads at dinner.'
                    ],
                    'vihara': [
                        'Warm sesame oil foot massage before bedtime.',
                        'Establish fixed circadian sleep schedule by 22:30.'
                    ],
                    'classical_formulations': [
                        'Warm digestive herbal powder blend (1g with warm clarified butter before lunch)',
                        'Restorative herbal infusion (15ml with equal warm water post-dinner)'
                    ]
                },
                'review_status': ReviewStatus.IN_REVIEW,
                'review_details': {
                    'doctor': dr_sharma,
                    'summary': 'Clinical evaluation in progress for Swetha Chowdary. Presentation consistent with Movement & Metabolism digestive weakness. Corrected sleep duration based on detailed clinical intake.',
                    'observations': 'Tongue exhibits mild digestive coating over posterior third. Pulse rapid and slightly variable. Stress-induced sleep latency is a key aggravating driver.',
                    'recommendations': 'Prescribed Recommended Diet protocol v1 with warm digestive cumin-fennel decoctions. Eliminate raw evening salads for 14 days.',
                    'follow_up': 'Review in 10 days for digestive consistency and sleep onset latency check.'
                },
                'corrections': {
                    'sleep_duration': {
                        'verified_val': '6 hours (with 1 hr daytime nap)',
                        'note': 'Corrected during clinical intake: patient sleeps 5 hours at night and compensates with 1 hour afternoon nap.'
                    }
                },
                'verified_fields': ['fullName', 'age', 'gender', 'primary_prakriti', 'appetite_pattern', 'chief_complaints', 'hydration'],
                'has_active_diet': True,
            },
            {
                'username': 'demo.rajesh.nair',
                'aliases': ['rajesh.nair'],
                'full_name': 'Rajesh Nair (DEMO DATA)',
                'display_name': 'Rajesh Nair',
                'email': 'rajesh.nair@example.com',
                'age': 42,
                'gender': 'Male',
                'location': 'Kochi, Kerala',
                'climate': 'Tropical Humid Coastal Plain',
                'height': 174,
                'weight': 78,
                'primary_prakriti': 'Metabolism & Structure',
                'prakriti_scores': {'vata': 20, 'pitta': 52, 'kapha': 28, 'primary': 'Metabolism & Structure'},
                'chief_symptoms': [
                    'Hyperacidity & Sour Acid Reflux',
                    'Epigastric Burning Sensation',
                    'Post-prandial Lethargy & Heaviness'
                ],
                'chronicity': '6 months',
                'severity': 'Moderate',
                'medical_history': 'History of occasional dyspepsia; non-diabetic; normal blood pressure.',
                'contraindications': [
                    'Strict avoidance of fermented batter, vinegars, deep-fried items, and excessively pungent chilies.',
                    'Contraindicated for excessively heating digestive tonics.'
                ],
                'lifestyle': {
                    'sleepDuration': '6 hours',
                    'sleepQuality': 'Restless due to nocturnal heartburn',
                    'activityLevel': 'Sedentary corporate workstation',
                    'stressLevel': 'High occupational workload',
                    'circadianAlignment': 'Delayed dinner schedule (>21:30)'
                },
                'diet': {
                    'appetitePattern': 'Sharp / Excessive (Fast Metabolism)',
                    'mealFrequency': '3 meals + late evening heavy snacks',
                    'hydration': '2.2L daily',
                    'predominantTaste': 'Sour, Salty & Pungent'
                },
                'ai_analysis': {
                    'prediction': 'Metabolic Acid Reflux with Burning Digestion',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.915,
                    'entropy_score': 0.12,
                    'inference_timestamp': (now - datetime.timedelta(days=3)).isoformat(),
                    'limitations': 'Model inference based on standard clinical questionnaire inputs.'
                },
                'shap_explanations': [
                    {'feature': 'Pungent & Fermented Food Frequency', 'contribution': 0.41, 'direction': 'positive'},
                    {'feature': 'Delayed Night Dinner (>21:30)', 'contribution': 0.25, 'direction': 'positive'},
                    {'feature': 'High Occupational Stress Exposure', 'contribution': 0.21, 'direction': 'positive'},
                    {'feature': 'Adequate Total Water Intake', 'contribution': -0.15, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Sour eructation after spicy meals', 'weight': 0.38, 'type': 'positive'},
                    {'feature': 'Epigastric warmth relieved by cold milk', 'weight': 0.31, 'type': 'positive'},
                    {'feature': 'Normal bowel evacuation frequency', 'weight': -0.10, 'type': 'negative'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Clinical Compendium (Diagnostic Treatise on Acidity, Ch. 1)',
                        'passage': 'Excess sour, sharp, burning foods increase metabolic heat, leading to acidic digestion and reflux.',
                        'relevance_score': 0.961,
                        'domain': 'Etiology & Symptomatology of Acid Dyspepsia'
                    }
                ],
                'recommendations': {
                    'ahara': [
                        'Bitter and astringent pacifying foods; sweet pomegranate, tender coconut water.',
                        'Completely avoid fermented batter, chilies, vinegar, and deep-fried savories.'
                    ],
                    'vihara': [
                        'Avoid direct midday sun exposure; engage in cooling breathing exercises.'
                    ],
                    'classical_formulations': [
                        'Digestive soothing herbal formula (3g with warm water at bedtime)',
                        'Cooling mineral-herbal compound (125mg twice daily before meals)'
                    ]
                },
                'review_status': ReviewStatus.PENDING,
                'review_details': {
                    'doctor': dr_menon,
                    'summary': '',
                    'observations': '',
                    'recommendations': '',
                    'follow_up': ''
                },
                'corrections': {},
                'verified_fields': ['fullName', 'age', 'gender'],
                'has_active_diet': False,
            },
            {
                'username': 'demo.priya.sharma',
                'aliases': ['priya.sharma'],
                'full_name': 'Priya Sharma (DEMO DATA)',
                'display_name': 'Priya Sharma',
                'email': 'priya.sharma@example.com',
                'age': 31,
                'gender': 'Female',
                'location': 'Jaipur, Rajasthan',
                'climate': 'Semi-Arid Desert Plain',
                'height': 162,
                'weight': 68,
                'primary_prakriti': 'Structure & Movement',
                'prakriti_scores': {'vata': 35, 'pitta': 15, 'kapha': 50, 'primary': 'Structure & Movement'},
                'chief_symptoms': [
                    'Heaviness across Limbs & Body',
                    'Excessive Daytime Somnolence',
                    'Sluggish Digestive Function & Delayed Transit'
                ],
                'chronicity': '8 months',
                'severity': 'Moderate',
                'medical_history': 'Borderline TSH elevation (5.2 μIU/mL) on recent screening; no prescription thyroid therapy started.',
                'contraindications': [
                    'Contraindicated for daytime sleeping and heavy curd or dairy consumption.',
                    'Avoid sweet, excessively cold, and oily foods.'
                ],
                'lifestyle': {
                    'sleepDuration': '8-9 hours',
                    'sleepQuality': 'Heavy but unrefreshing sleep with afternoon nap',
                    'activityLevel': 'Sedentary work environment',
                    'stressLevel': 'Moderate',
                    'circadianAlignment': 'Delayed morning waking (>08:00)'
                },
                'diet': {
                    'appetitePattern': 'Sluggish / Delayed (Slow Digestion)',
                    'mealFrequency': '2 heavy meals daily with sweet snacks',
                    'hydration': '1.5L daily',
                    'predominantTaste': 'Sweet & Oily'
                },
                'ai_analysis': {
                    'prediction': 'Structural Energy Dominance with Sluggish Digestion',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.874,
                    'entropy_score': 0.15,
                    'inference_timestamp': (now - datetime.timedelta(days=5)).isoformat(),
                    'limitations': 'Rule-based metabolic attribution. Clinical correlation recommended for thyroid status.'
                },
                'shap_explanations': [
                    {'feature': 'Sedentary Desk Work (>8 hrs)', 'contribution': 0.38, 'direction': 'positive'},
                    {'feature': 'Daytime Sleeping', 'contribution': 0.29, 'direction': 'positive'},
                    {'feature': 'Heavy Dairy / Sweet Intake', 'contribution': 0.22, 'direction': 'positive'},
                    {'feature': 'Preference for Warm Drinks', 'contribution': -0.16, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Morning sluggishness lasting >2 hrs', 'weight': 0.35, 'type': 'positive'},
                    {'feature': 'Digestive transit time > 24 hrs', 'weight': 0.28, 'type': 'positive'},
                    {'feature': 'Adequate hydration', 'weight': -0.11, 'type': 'negative'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Therapeutic Principles, Ch. 15)',
                        'passage': 'In sluggish digestion, light digestive stimulants and lightness-promoting dietary therapies are wholesome.',
                        'relevance_score': 0.925,
                        'domain': 'Metabolic Stimulation & Digestive Fire Balancing'
                    }
                ],
                'recommendations': {
                    'ahara': [
                        'Light, warm foods; barley, split mung bean porridge with roasted cumin and black pepper.'
                    ],
                    'vihara': [
                        'Strictly avoid daytime napping; 45 minutes brisk walking in early morning.'
                    ],
                    'classical_formulations': [
                        'Warm three-spice digestive blend (500mg with honey before meals)',
                        'Metabolic clearing herbal decoction (15ml with warm water morning on empty stomach)'
                    ]
                },
                'review_status': ReviewStatus.COMPLETED,
                'review_details': {
                    'doctor': dr_sharma,
                    'summary': 'Clinical assessment fully evaluated and validated. Presentation confirms classic structural-dominant metabolic dampening with sluggish digestion. Prescribed targeted lightness-promoting protocol.',
                    'observations': 'Tongue shows thick white coating indicating incomplete digestion. Palpation reveals periorbital fullness. Patient agreed to eliminate daytime naps immediately.',
                    'recommendations': 'Active Recommended Diet plan approved with barley base. Morning brisk walk scheduled for 40 mins.',
                    'follow_up': 'Comprehensive follow-up consultation in 3 weeks. Digestive function and metabolic vitality reassessment.'
                },
                'corrections': {},
                'verified_fields': [f['field_name'] for f in ASSESSMENT_FIELDS], # Fully verified
                'has_active_diet': True,
            },
            {
                'username': 'demo.amit.patel',
                'aliases': ['amit.patel'],
                'full_name': 'Amit Patel (DEMO DATA)',
                'display_name': 'Amit Patel',
                'email': 'amit.patel@example.com',
                'age': 50,
                'gender': 'Male',
                'location': 'Ahmedabad, Gujarat',
                'climate': 'Dry Sub-Tropical Inland',
                'height': 170,
                'weight': 64,
                'primary_prakriti': 'Movement Dominant',
                'prakriti_scores': {'vata': 58, 'pitta': 24, 'kapha': 18, 'primary': 'Movement Dominant'},
                'chief_symptoms': [
                    'Chronic Hard Stool Constipation',
                    'Bilateral Knee Stiffness on Movement',
                    'Mental Restlessness & Anxious Rumination'
                ],
                'chronicity': '1 year',
                'severity': 'Moderate to High',
                'medical_history': 'Mild lumbar spondylosis L4-L5 on scan; no history of hypertension or cardiac disease.',
                'contraindications': [
                    'Contraindicated for dry fasting and cold wind exposure.',
                    'Avoid rough astringent lentils without adequate healthy fats or clarified butter.'
                ],
                'lifestyle': {
                    'sleepDuration': '5-6 hours',
                    'sleepQuality': 'Fragmented with early morning awakening (04:30)',
                    'activityLevel': 'Light morning walking (20 mins)',
                    'stressLevel': 'High business management stress',
                    'circadianAlignment': 'Variable daily routine'
                },
                'diet': {
                    'appetitePattern': 'Variable & Dry (Irregular Digestion)',
                    'mealFrequency': '2 light dry meals daily',
                    'hydration': '1.4L daily (inadequate)',
                    'predominantTaste': 'Astringent & Pungent'
                },
                'ai_analysis': {
                    'prediction': 'Movement Energy Vitiation with Joint Dryness Tendencies',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.931,
                    'entropy_score': 0.11,
                    'inference_timestamp': (now - datetime.timedelta(days=4)).isoformat(),
                    'limitations': 'Decision support output. Clinical joint examination required for structural assessment.'
                },
                'shap_explanations': [
                    {'feature': 'Low dietary fiber & hydration', 'contribution': 0.39, 'direction': 'positive'},
                    {'feature': 'Advanced age bracket (>50 Vata stage)', 'contribution': 0.27, 'direction': 'positive'},
                    {'feature': 'High frequency business travel', 'contribution': 0.21, 'direction': 'positive'},
                    {'feature': 'Non-smoking status', 'contribution': -0.13, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Stool consistency type 1-2 Bristol', 'weight': 0.41, 'type': 'positive'},
                    {'feature': 'Bilateral knee crepitus with dryness', 'weight': 0.27, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Internal Medicine, Musculoskeletal Care, Ch. 28)',
                        'passage': 'For aggravated movement energy, internal and external lubrication with nourishing warm oils is the supreme therapy to pacify roughness and dryness.',
                        'relevance_score': 0.954,
                        'domain': 'Management of Movement-Related Imbalances'
                    }
                ],
                'recommendations': {
                    'ahara': ['Warm milk with 1 tsp clarified butter (Ghee) at night', 'Soaked black raisins in the morning'],
                    'vihara': ['Full body warm herbal oil massage', 'Gentle joint mobility exercises'],
                    'classical_formulations': ['Three-fruit digestive regulator powder with warm water', 'Joint-soothing herbal resin compound (2 tabs twice daily)']
                },
                'review_status': ReviewStatus.PENDING,
                'review_details': {
                    'doctor': dr_sharma,
                    'summary': '',
                    'observations': '',
                    'recommendations': '',
                    'follow_up': ''
                },
                'corrections': {},
                'verified_fields': ['fullName', 'age', 'gender', 'primary_prakriti'],
                'has_active_diet': False,
            },
            {
                'username': 'demo.ananya.iyer',
                'aliases': ['ananya.iyer'],
                'full_name': 'Ananya Iyer (DEMO DATA)',
                'display_name': 'Ananya Iyer',
                'email': 'ananya.iyer@example.com',
                'age': 29,
                'gender': 'Female',
                'location': 'Chennai, Tamil Nadu',
                'climate': 'Hot Humid Coastal Plain',
                'height': 167,
                'weight': 55,
                'primary_prakriti': 'Metabolism Dominant',
                'prakriti_scores': {'vata': 22, 'pitta': 60, 'kapha': 18, 'primary': 'Metabolism Dominant'},
                'chief_symptoms': [
                    'Unilateral Temporal Throbbing Migraine',
                    'Generalized Heat Intolerance & Flushing',
                    'Heightened Irritability under Screen Stress'
                ],
                'chronicity': '5 months',
                'severity': 'Moderate to High',
                'medical_history': 'Recurrent migraine triggered by sunlight exposure; normal neurological examination.',
                'contraindications': [
                    'Strict avoidance of direct midday sun, screen glare without filters, and fermented foods.',
                    'Avoid pungent spices (chilies, black pepper, mustard).'
                ],
                'lifestyle': {
                    'sleepDuration': '6 hours',
                    'sleepQuality': 'Interrupted by heat and screen stimulation',
                    'activityLevel': 'Yoga twice weekly',
                    'stressLevel': 'High creative agency stress',
                    'circadianAlignment': 'Moderate'
                },
                'diet': {
                    'appetitePattern': 'High / Sharp (Fast Metabolism)',
                    'mealFrequency': 'Skips breakfast, heavy lunch and dinner',
                    'hydration': '2.5L daily',
                    'predominantTaste': 'Pungent & Sour'
                },
                'ai_analysis': {
                    'prediction': 'Metabolism-Related Unilateral Headache Pattern',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.884,
                    'entropy_score': 0.16,
                    'inference_timestamp': (now - datetime.timedelta(days=6)).isoformat(),
                    'limitations': 'Rule-based neurovascular assessment. Not intended for acute thunderclap headache evaluation.'
                },
                'shap_explanations': [
                    {'feature': 'Excess Screen Glare & Sleep Deficit', 'contribution': 0.37, 'direction': 'positive'},
                    {'feature': 'Spicy Fast Food Consumption', 'contribution': 0.28, 'direction': 'positive'},
                    {'feature': 'Emotional Frustration / Stress', 'contribution': 0.19, 'direction': 'positive'},
                    {'feature': 'Regular Morning Hydration', 'contribution': -0.15, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Unilateral throbbing exacerbated by sunlight', 'weight': 0.36, 'type': 'positive'},
                    {'feature': 'Relief through darkness and cold compress', 'weight': 0.29, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Neurological Health Chapter)',
                        'passage': 'In metabolic headaches, cooling clarified butter nasal drops and soothing milk therapies soothe inflamed vascular channels.',
                        'relevance_score': 0.938,
                        'domain': 'Headache & Sensory Wellness'
                    }
                ],
                'recommendations': {
                    'ahara': ['Sweet, bitter, and astringent foods', 'Pomegranate, mint tea, soaked almonds'],
                    'vihara': ['Gentle pressure on temple points', 'Cooling breathing exercises before bed'],
                    'classical_formulations': ['Soothing botanical decoction for head tension (15ml twice daily)', 'Vascular-soothing mineral-herbal formula (1 tab with warm water)']
                },
                'review_status': ReviewStatus.COMPLETED,
                'review_details': {
                    'doctor': dr_menon,
                    'summary': 'Clinical dossier finalized and verified by Dr. Vasudevan Menon. Findings consistent with metabolic tension headache. Prescribed cooling nasal lubrication drops and recommended diet regimen.',
                    'observations': 'Conjunctival injection during attack. Metabolic constitution aggravated by coastal humidity and prolonged monitor glare.',
                    'recommendations': 'Cooling diet approved. Screen filter mandated and temple pressure point massage demonstrated.',
                    'follow_up': 'Review in 4 weeks for migraine recurrence frequency assessment.'
                },
                'corrections': {},
                'verified_fields': [f['field_name'] for f in ASSESSMENT_FIELDS],
                'has_active_diet': True,
            },
            {
                'username': 'demo.vikram.sen',
                'aliases': [],
                'full_name': 'Vikramaditya Sen (DEMO DATA)',
                'display_name': 'Vikramaditya Sen',
                'email': 'vikram.sen@example.com',
                'age': 36,
                'gender': 'Male',
                'location': 'Kolkata, West Bengal',
                'climate': 'Humid Subtropical Gangetic Plain',
                'height': 178,
                'weight': 89,
                'primary_prakriti': 'Structure Dominant',
                'prakriti_scores': {'vata': 15, 'pitta': 25, 'kapha': 60, 'primary': 'Structure Dominant'},
                'chief_symptoms': [
                    'Excess Weight with Central Adiposity',
                    'Profound Lethargy & Lack of Physical Drive',
                    'Oily Facial Complexion with Morning Heaviness'
                ],
                'chronicity': '1.5 years',
                'severity': 'Moderate',
                'medical_history': 'Dyslipidemia on annual checkup; pre-diabetic HbA1c 5.9%; non-hypertensive.',
                'contraindications': [
                    'Strict avoidance of heavy oily sweets, ice creams, and afternoon sleeping.',
                    'Avoid cold dairy and heavy refined flour preparations.'
                ],
                'lifestyle': {
                    'sleepDuration': '8.5 hours',
                    'sleepQuality': 'Heavy snoring and morning grogginess',
                    'activityLevel': 'Sedentary software developer (desk >9 hrs)',
                    'stressLevel': 'Moderate',
                    'circadianAlignment': 'Delayed morning schedule'
                },
                'diet': {
                    'appetitePattern': 'Sluggish & Constant (Slow Digestion)',
                    'mealFrequency': '3 meals + evening confectionery',
                    'hydration': '1.6L daily',
                    'predominantTaste': 'Sweet & Salty'
                },
                'ai_analysis': {
                    'prediction': 'Metabolic Congestion with Sluggish Digestive Function',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.902,
                    'entropy_score': 0.13,
                    'inference_timestamp': (now - datetime.timedelta(days=7)).isoformat(),
                    'limitations': 'Predictive metabolic staging. Requires lipid profile and endocrine monitoring.'
                },
                'shap_explanations': [
                    {'feature': 'Sedentary Desk Hours (>9 hrs)', 'contribution': 0.42, 'direction': 'positive'},
                    {'feature': 'High Sugar & Dairy Frequency', 'contribution': 0.31, 'direction': 'positive'},
                    {'feature': 'Heavy Night Dinners', 'contribution': 0.22, 'direction': 'positive'},
                    {'feature': 'Non-smoker status', 'contribution': -0.10, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Body Mass Index > 28', 'weight': 0.38, 'type': 'positive'},
                    {'feature': 'Morning sluggishness > 90 mins', 'weight': 0.29, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Medical Compendium, Section on Physical Harmony, Ch. 21',
                        'passage': 'In excessive corpulence, wholesome non-accumulating foods like roasted barley and light grains are recommended to promote vitality.',
                        'relevance_score': 0.948,
                        'domain': 'Metabolic Management & Body Composition'
                    }
                ],
                'recommendations': {
                    'ahara': ['Barley flatbreads, roasted legumes, hot lemon-honey water early morning', 'Herbal tri-fruit water rinse'],
                    'vihara': ['Dry herbal powder friction massage before bathing', 'Graduated brisk walking 45 mins'],
                    'classical_formulations': ['Metabolic herbal resin tablets (2 tabs twice daily)', 'Purified iron and herbal botanical tonic (15ml with warm water post-lunch)']
                },
                'review_status': ReviewStatus.IN_REVIEW,
                'review_details': {
                    'doctor': dr_sharma,
                    'summary': 'Clinical review initiated for Vikramaditya Sen. Correlating structural metabolic sluggishness with lipid markers. Awaiting complete field verification before finalizing diet regimen.',
                    'observations': 'Abdominal circumference 96cm. Tongue pale and heavily coated. Patient motivated to begin supervised morning exercise.',
                    'recommendations': 'Initial metabolism-stimulating dietary guidelines provided. Eliminate bakery items.',
                    'follow_up': 'Review in 14 days after lipid panel follow-up.'
                },
                'corrections': {},
                'verified_fields': ['fullName', 'age', 'gender', 'primary_prakriti', 'appetite_pattern'],
                'has_active_diet': False,
            },
            {
                'username': 'demo.meera.deshmukh',
                'aliases': [],
                'full_name': 'Meera Deshmukh (DEMO DATA)',
                'display_name': 'Meera Deshmukh',
                'email': 'meera.deshmukh@example.com',
                'age': 47,
                'gender': 'Female',
                'location': 'Pune, Maharashtra',
                'climate': 'Elevated Semi-Arid Plateau',
                'height': 160,
                'weight': 62,
                'primary_prakriti': 'Movement & Structure',
                'prakriti_scores': {'vata': 46, 'pitta': 18, 'kapha': 36, 'primary': 'Movement & Structure'},
                'chief_symptoms': [
                    'Cervical Spine Stiffness with Restricted Rotation',
                    'Dull Aching Lower Back Discomfort',
                    'Mild Intermittent Tremor in Left Fingers upon Fatigue'
                ],
                'chronicity': '9 months',
                'severity': 'Moderate',
                'medical_history': 'Straightening of cervical lordosis on X-ray; mild osteopenia noted on DEXA scan.',
                'contraindications': [
                    'Avoid exposure to direct cold air conditioning drafts on neck and shoulders.',
                    'Avoid cold water head baths and excessive dry fasting.'
                ],
                'lifestyle': {
                    'sleepDuration': '6 hours',
                    'sleepQuality': 'Interrupted by neck stiffness upon turning in bed',
                    'activityLevel': 'Moderate household work + desk accounting',
                    'stressLevel': 'Moderate to High',
                    'circadianAlignment': 'Moderate'
                },
                'diet': {
                    'appetitePattern': 'Variable (Fluctuating Digestion)',
                    'mealFrequency': '3 meals daily, prefers freshly cooked hot items',
                    'hydration': '1.7L daily',
                    'predominantTaste': 'Bitter & Salty'
                },
                'ai_analysis': {
                    'prediction': 'Movement Energy Depletion with Cervical Musculoskeletal Strain',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.918,
                    'entropy_score': 0.12,
                    'inference_timestamp': (now - datetime.timedelta(days=8)).isoformat(),
                    'limitations': 'Decision support tool. Correlation with neuro-musculoskeletal exam required.'
                },
                'shap_explanations': [
                    {'feature': 'Age bracket 45-50 (Natural tissue vulnerability phase)', 'contribution': 0.35, 'direction': 'positive'},
                    {'feature': 'Ergonomic neck posture strain', 'contribution': 0.29, 'direction': 'positive'},
                    {'feature': 'Cold weather symptom aggravation', 'contribution': 0.22, 'direction': 'positive'},
                    {'feature': 'Regular intake of warm cow milk', 'contribution': -0.14, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Cervical rotation restricted <45 degrees', 'weight': 0.39, 'type': 'positive'},
                    {'feature': 'Pain relieved by warm fomentation', 'weight': 0.28, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Internal Medicine, Musculoskeletal Disorders, Ch. 21)',
                        'passage': 'In cervical stiffness, gentle warm oil application, herbal steam compresses, and medicated nasal lubrication are the principal restorative therapies.',
                        'relevance_score': 0.952,
                        'domain': 'Neuromusculoskeletal Care & Rehabilitation'
                    }
                ],
                'recommendations': {
                    'ahara': ['Warm nourishing soups with garlic and sesame', 'Almond milk with a pinch of nutmeg at bedtime'],
                    'vihara': ['Gentle neck mobility exercises', 'Local warm herbal compress application'],
                    'classical_formulations': ['Joint-nourishing herbal resin formula (2 tabs twice daily)', 'Nourishing herbal nasal drops (2 drops in each nostril)']
                },
                'review_status': ReviewStatus.PENDING,
                'review_details': {
                    'doctor': dr_menon,
                    'summary': '',
                    'observations': '',
                    'recommendations': '',
                    'follow_up': ''
                },
                'corrections': {},
                'verified_fields': ['fullName', 'age', 'gender', 'primary_prakriti'],
                'has_active_diet': False,
            },
            {
                'username': 'demo.rohan.kulkarni',
                'aliases': [],
                'full_name': 'Rohan Kulkarni (DEMO DATA)',
                'display_name': 'Rohan Kulkarni',
                'email': 'rohan.kulkarni@example.com',
                'age': 26,
                'gender': 'Male',
                'location': 'Mumbai, Maharashtra',
                'climate': 'Humid Coastal Tropical Sea-Level',
                'height': 175,
                'weight': 70,
                'primary_prakriti': 'Metabolism & Movement',
                'prakriti_scores': {'vata': 32, 'pitta': 54, 'kapha': 14, 'primary': 'Metabolism & Movement'},
                'chief_symptoms': [
                    'Nosebleed Tendencies upon Heat Exposure',
                    'Burning Sensation on Tongue & Oral Mucosa',
                    'Unquenchable Thirst with Excessive Perspiration'
                ],
                'chronicity': '3 months',
                'severity': 'Moderate',
                'medical_history': 'History of heat exhaustion during intensive gym training; normal liver and kidney profiles.',
                'contraindications': [
                    'Strict avoidance of synthetic thermogenic fat burners, pre-workouts, and red chilies.',
                    'Contraindicated for intense heavy sun workouts without cooling hydration.'
                ],
                'lifestyle': {
                    'sleepDuration': '6 hours',
                    'sleepQuality': 'Sweating at night, wakes up thirsty',
                    'activityLevel': 'High intensity gym weight-lifting (5x weekly)',
                    'stressLevel': 'Moderate performance stress',
                    'circadianAlignment': 'Moderate'
                },
                'diet': {
                    'appetitePattern': 'Voracious / Burning (Excessive Metabolism)',
                    'mealFrequency': '4-5 protein meals daily with whey & spicy chicken',
                    'hydration': '3.0L daily',
                    'predominantTaste': 'Pungent & Salty'
                },
                'ai_analysis': {
                    'prediction': 'Excess Heat and Metabolic Hyperactivity with Blood Heat',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.941,
                    'entropy_score': 0.09,
                    'inference_timestamp': (now - datetime.timedelta(days=9)).isoformat(),
                    'limitations': 'Algorithmic decision support. Epistaxis requires monitoring of platelet and coagulation metrics.'
                },
                'shap_explanations': [
                    {'feature': 'Thermogenic Supplements & Pre-workout', 'contribution': 0.44, 'direction': 'positive'},
                    {'feature': 'Spicy High-Protein Food Frequency', 'contribution': 0.32, 'direction': 'positive'},
                    {'feature': 'Midday Sun Workout Exposure', 'contribution': 0.19, 'direction': 'positive'},
                    {'feature': 'High Total Water Intake', 'contribution': -0.16, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Oral burning relieved by cold milk', 'weight': 0.37, 'type': 'positive'},
                    {'feature': 'Nasal bleeding during peak heat', 'weight': 0.34, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Disorders of Internal Heat, Ch. 45)',
                        'passage': 'In conditions of excessive heat, all cooling regimens, tender coconut water, sweet cooling fruits, and gentle nourishment are imperative.',
                        'relevance_score': 0.966,
                        'domain': 'Therapeutics of Excess Heat & Circulatory Balance'
                    }
                ],
                'recommendations': {
                    'ahara': ['Tender coconut water, sweet pomegranate, cooked barley water', 'Avoid all energy drinks and pungent spices'],
                    'vihara': ['Avoid hot saunas and midday sun training', 'Practice cooling breathing exercises for 15 mins daily'],
                    'classical_formulations': ['Cooling vetiver root botanical elixir (15ml with equal water post-meals)', 'Purified coral calcium powder (250mg with honey twice daily)']
                },
                'review_status': ReviewStatus.IN_REVIEW,
                'review_details': {
                    'doctor': dr_sharma,
                    'summary': 'Clinical evaluation in progress. Patient instructed to immediately discontinue synthetic thermogenic supplements. Heat-pacifying cooling regimen introduced.',
                    'observations': 'Sclera mildly injected. Pulse sharp and bounding. No mucosal ulcerations noted.',
                    'recommendations': 'Immediate transition to coconut water, barley groats, and cooling fruits.',
                    'follow_up': 'Review in 7 days for oral burning and hydration stabilization.'
                },
                'corrections': {},
                'verified_fields': ['fullName', 'age', 'gender', 'primary_prakriti', 'chief_complaints'],
                'has_active_diet': False,
            },            {
                'username': 'demo.sunita.sundaram',
                'aliases': [],
                'full_name': 'Sunita Sundaram (DEMO DATA)',
                'display_name': 'Sunita Sundaram',
                'email': 'sunita.sundaram@example.com',
                'age': 54,
                'gender': 'Female',
                'location': 'Madurai, Tamil Nadu',
                'climate': 'Tropical Inland High Heat',
                'height': 158,
                'weight': 59,
                'primary_prakriti': 'Balanced (All Three Energies Balanced)',
                'prakriti_scores': {'vata': 34, 'pitta': 35, 'kapha': 31, 'primary': 'Balanced'},
                'chief_symptoms': [
                    'Sharp Cutting Anorectal Discomfort Post-Evacuation',
                    'Taste Disturbance with Loss of Appetite',
                    'Dry Hard Bowel Evacuation Cycles'
                ],
                'chronicity': '7 months',
                'severity': 'Moderate to High',
                'medical_history': 'History of chronic sluggish bowel evacuation; non-diabetic; normal lipid profile.',
                'contraindications': [
                    'Strict avoidance of harsh stimulant laxatives that cause mucosal tearing.',
                    'Avoid moisture-depleted dry food and heavy astringent pulses.'
                ],
                'lifestyle': {
                    'sleepDuration': '7 hours',
                    'sleepQuality': 'Good, restful circadian rhythm',
                    'activityLevel': 'Morning temple walks and garden tending',
                    'stressLevel': 'Low to Moderate',
                    'circadianAlignment': 'Well-aligned circadian habit'
                },
                'diet': {
                    'appetitePattern': 'Moderate / Low (Sluggish Elimination)',
                    'mealFrequency': '3 simple home-cooked meals',
                    'hydration': '1.9L daily',
                    'predominantTaste': 'Astringent & Sweet'
                },
                'ai_analysis': {
                    'prediction': 'Lower Bowel Mucosal Irritation with Dryness-Induced Obstruction',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.895,
                    'entropy_score': 0.14,
                    'inference_timestamp': (now - datetime.timedelta(days=10)).isoformat(),
                    'limitations': 'Clinical decision support model. Anorectal visualization required to assess fissure healing.'
                },
                'shap_explanations': [
                    {'feature': 'Low Dietary Moisture (Healthy fats deficit)', 'contribution': 0.38, 'direction': 'positive'},
                    {'feature': 'Hard Stool Transit Pressure', 'contribution': 0.31, 'direction': 'positive'},
                    {'feature': 'Age-related downward elimination imbalance', 'contribution': 0.22, 'direction': 'positive'},
                    {'feature': 'Consistent Early Morning Walking', 'contribution': -0.15, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Burning pain lasting >1hr post defecation', 'weight': 0.40, 'type': 'positive'},
                    {'feature': 'Absence of active systemic bleeding', 'weight': -0.12, 'type': 'negative'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Colorectal Care, Ch. 14)',
                        'passage': 'In sharp anorectal irritation, clarified butter medicated with licorice and warm herbal sitz baths alleviate mucosal irritation and promote gentle healing.',
                        'relevance_score': 0.945,
                        'domain': 'Anorectal Health & Mucosal Care'
                    }
                ],
                'recommendations': {
                    'ahara': ['Warm rice gruel with 1 tsp clarified butter', 'Soaked black raisins and stewed figs in morning'],
                    'vihara': ['Warm herbal sitz bath for 15 mins post-evacuation'],
                    'classical_formulations': ['Soothing botanical wound-healing oil local application', 'Herbal digestive bowel-toning formulation (20ml with warm water at bedtime)']
                },
                'review_status': ReviewStatus.COMPLETED,
                'review_details': {
                    'doctor': dr_menon,
                    'summary': 'Clinical case reviewed and validated. Clinical evaluation of acute-on-chronic anorectal irritation with dryness. Prescribed nourishing recommended diet and healing herbal oil regimen.',
                    'observations': 'Mucosal tear shows clean granulating edges. Bowel lubricating regimen initiated.',
                    'recommendations': 'Warm sitz bath twice daily. Strict avoidance of rough dry biscuits.',
                    'follow_up': 'Review in 2 weeks for fissure epithelialization verification.'
                },
                'corrections': {},
                'verified_fields': [f['field_name'] for f in ASSESSMENT_FIELDS],
                'has_active_diet': True,
            },
            {
                'username': 'demo.arvind.joshi',
                'aliases': [],
                'full_name': 'Arvind Joshi (DEMO DATA)',
                'display_name': 'Arvind Joshi',
                'email': 'arvind.joshi@example.com',
                'age': 38,
                'gender': 'Male',
                'location': 'New Delhi, NCR',
                'climate': 'Composite Semi-Arid with High Particulate Smog',
                'height': 172,
                'weight': 73,
                'primary_prakriti': 'Movement & Metabolism',
                'prakriti_scores': {'vata': 44, 'pitta': 40, 'kapha': 16, 'primary': 'Movement & Metabolism'},
                'chief_symptoms': [
                    'Dry Irritative Cough with Throat Tickling',
                    'Exertional Breathlessness in Winter Smog AQI >300',
                    'Chronic Nasal Dryness & Morning Sneezing'
                ],
                'chronicity': '4 months',
                'severity': 'Moderate',
                'medical_history': 'Post-viral bronchial hyperreactivity; seasonal winter aggravation; non-asthmatic on spirometry.',
                'contraindications': [
                    'Strict avoidance of chilled drinks, ice water, and direct exposure to early morning smog without mask.',
                    'Avoid cold dairy and curd at night.'
                ],
                'lifestyle': {
                    'sleepDuration': '6.5 hours',
                    'sleepQuality': 'Disturbed by midnight coughing spasms',
                    'activityLevel': 'Moderate urban commute (metro + walking)',
                    'stressLevel': 'High corporate financial consulting stress',
                    'circadianAlignment': 'Irregular'
                },
                'diet': {
                    'appetitePattern': 'Moderate / Fluctuating',
                    'mealFrequency': '2-3 meals, often dining late',
                    'hydration': '2.0L daily',
                    'predominantTaste': 'Pungent & Sour'
                },
                'ai_analysis': {
                    'prediction': 'Respiratory Channel Sensitivity with Cold-Dry Cough Pattern',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.912,
                    'entropy_score': 0.13,
                    'inference_timestamp': (now - datetime.timedelta(days=1)).isoformat(),
                    'limitations': 'Decision support staging. Excludes acute infective pneumonitis.'
                },
                'shap_explanations': [
                    {'feature': 'Urban environmental smog exposure (AQI>250)', 'contribution': 0.41, 'direction': 'positive'},
                    {'feature': 'Cold refrigerated beverage consumption', 'contribution': 0.28, 'direction': 'positive'},
                    {'feature': 'Late evening dining habit', 'contribution': 0.18, 'direction': 'positive'},
                    {'feature': 'Non-smoker status', 'contribution': -0.12, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Cough spasms provoked by cold air', 'weight': 0.38, 'type': 'positive'},
                    {'feature': 'Relief through warm ginger water', 'weight': 0.31, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Classical Compendium (Respiratory Wellness, Ch. 18)',
                        'passage': 'When dry irritative cough involves mucosal congestion, warm soothing decoctions with ginger, long pepper, and honey soothe respiratory channels.',
                        'relevance_score': 0.957,
                        'domain': 'Respiratory Health & Bronchial Wellness'
                    }
                ],
                'recommendations': {
                    'ahara': ['Warm barley soup with ginger and rock salt', 'Warm golden turmeric milk with a pinch of black pepper'],
                    'vihara': ['Steam inhalation with holy basil and mint drops', 'Daily herbal nasal lubrication drops (2 drops) before outdoor commute'],
                    'classical_formulations': ['Soothing herbal respiratory powder (2g with honey twice daily)', 'Warm bronchial herbal decoction (20ml warm twice daily)']
                },
                'review_status': ReviewStatus.PENDING,
                'review_details': {
                    'doctor': dr_sharma,
                    'summary': '',
                    'observations': '',
                    'recommendations': '',
                    'follow_up': ''
                },
                'corrections': {},
                'verified_fields': ['fullName', 'age', 'gender', 'primary_prakriti'],
                'has_active_diet': False,
            }
        ]

        # ---------------------------------------------------------------------
        # 3. Process Each Patient Idempotently
        # ---------------------------------------------------------------------
        for p_data in demo_patients:
            # Check primary username and any aliases
            user = User.objects.filter(username=p_data['username']).first()
            if not user and p_data.get('aliases'):
                user = User.objects.filter(username__in=p_data['aliases']).first()

            if not user:
                user = User.objects.create(
                    username=p_data['username'],
                    email=p_data['email'],
                    role=User.Role.PATIENT,
                    first_name=p_data['display_name'].split()[0],
                    last_name=' '.join(p_data['display_name'].split()[1:])
                )
                user.set_password('patient123')
                user.save()
            else:
                user.email = p_data['email']
                user.role = User.Role.PATIENT
                user.first_name = p_data['display_name'].split()[0]
                user.last_name = ' '.join(p_data['display_name'].split()[1:])
                user.save()

            # Update or Create Patient Profile
            PatientProfile.objects.update_or_create(
                user=user,
                defaults={
                    'full_name': p_data['full_name'],
                    'age': p_data['age'],
                    'gender': p_data['gender'],
                    'contact_phone': '+91-98765-00100'
                }
            )

            # Update or Create Assessment
            asm = PatientAssessment.objects.filter(patient=user).order_by('-created_at').first()
            assessment_defaults = {
                'status': AssessmentStatus.COMPLETED,
                'demographics': {
                    'fullName': p_data['full_name'],
                    'displayName': p_data['display_name'],
                    'age': p_data['age'],
                    'gender': p_data['gender'],
                    'height': p_data['height'],
                    'weight': p_data['weight'],
                    'location': p_data['location'],
                    'climate': p_data['climate'],
                    'medicalHistory': p_data['medical_history'],
                    'contraindications': p_data['contraindications'],
                    'isDemoData': True,
                },
                'prakriti_scores': p_data['prakriti_scores'],
                'prakriti_data': {
                    'primary': p_data['primary_prakriti'],
                    'vata': p_data['prakriti_scores']['vata'],
                    'pitta': p_data['prakriti_scores']['pitta'],
                    'kapha': p_data['prakriti_scores']['kapha'],
                },
                'lifestyle_data': p_data['lifestyle'],
                'diet_data': p_data['diet'],
                'symptoms_data': {
                    'chiefComplaints': p_data['chief_symptoms'],
                    'severity': p_data['severity'],
                    'chronicity': p_data['chronicity'],
                    'medicalHistory': p_data['medical_history'],
                    'contraindications': p_data['contraindications'],
                },
                'ai_analysis': p_data['ai_analysis'],
                'shap_explanations': p_data['shap_explanations'],
                'lime_explanations': p_data['lime_explanations'],
                'rag_evidence': p_data['rag_evidence'],
                'recommendations': p_data['recommendations'],
            }

            if asm:
                for k, v in assessment_defaults.items():
                    setattr(asm, k, v)
                asm.save()
            else:
                asm = PatientAssessment.objects.create(patient=user, **assessment_defaults)

            # -----------------------------------------------------------------
            # Clinical Review
            # -----------------------------------------------------------------
            rev_info = p_data['review_details']
            review = ClinicalReview.objects.filter(assessment=asm, patient=user).first()
            review_defaults = {
                'doctor': rev_info.get('doctor', dr_sharma),
                'status': p_data['review_status'],
                'summary': rev_info.get('summary', ''),
                'observations': rev_info.get('observations', ''),
                'recommendations': rev_info.get('recommendations', ''),
                'follow_up_notes': rev_info.get('follow_up', ''),
            }

            if review:
                for k, v in review_defaults.items():
                    setattr(review, k, v)
                review.save()
            else:
                review = ClinicalReview.objects.create(assessment=asm, patient=user, **review_defaults)

            # -----------------------------------------------------------------
            # Clinical Verifications Initialization
            # -----------------------------------------------------------------
            initialize_verifications_for_assessment(user, asm, dr_sharma)

            # Apply Verified Fields
            if p_data.get('verified_fields'):
                PatientVerification.objects.filter(
                    patient=user,
                    assessment=asm,
                    field_name__in=p_data['verified_fields']
                ).exclude(verification_status=VerificationStatus.CORRECTED).update(
                    verification_status=VerificationStatus.VERIFIED,
                    verified_at=now - datetime.timedelta(days=1),
                    doctor=dr_sharma
                )

            # Apply Specific Corrections
            for field_name, corr in p_data.get('corrections', {}).items():
                verif = PatientVerification.objects.filter(patient=user, assessment=asm, field_name=field_name).first()
                if verif:
                    verif.verification_status = VerificationStatus.CORRECTED
                    verif.verified_value = corr['verified_val']
                    verif.doctor_note = corr['note']
                    verif.verified_at = now - datetime.timedelta(hours=18)
                    verif.doctor = dr_sharma
                    verif.save()

            # -----------------------------------------------------------------
            # Personalized Diet Plans
            # -----------------------------------------------------------------
            plan = DietPlan.objects.filter(patient=user, assessment=asm).first()
            if not plan:
                plan = DietPlan.objects.filter(patient=user).first()

            plan_status = DietPlanStatus.PUBLISHED if p_data['has_active_diet'] else (
                DietPlanStatus.PENDING_REVIEW if p_data['review_status'] == ReviewStatus.IN_REVIEW else DietPlanStatus.DRAFT
            )

            diet_defaults = {
                'title': f'Personalized Nutrition Protocol for {p_data["display_name"]} (DEMO DATA)',
                'duration': '14 Days Circadian Pacing Cycle',
                'objective': f'Balance {p_data["primary_prakriti"]} constitution, harmonize digestive rhythm, and soothe {p_data["chief_symptoms"][0]}.',
                'generated_by': DietPlanGeneratedBy.AI_ASSISTED_DOCTOR if p_data['has_active_diet'] else DietPlanGeneratedBy.AI,
                'status': plan_status,
                'breakfast': {
                    'time': '08:00 AM',
                    'title': 'Warm Light Soup / Cooked Groats',
                    'items': [
                        'Warm split yellow mung bean soup with ginger and rock salt',
                        'Steamed red rice cakes with fresh mint-coriander cooling chutney',
                        'Warm herbal digestive tea (Cumin + Coriander + Fennel infusion)'
                    ],
                    'notes': 'Eat in a tranquil seated environment without digital screen distraction.'
                },
                'mid_morning': {
                    'time': '11:00 AM',
                    'title': 'Hydration & Digestive Balance',
                    'items': [
                        'Fresh sweet pomegranate juice (cooling and soothing)',
                        '4 Soaked and peeled almonds (nourishing)'
                    ],
                    'notes': 'Maintain 2-hour separation from breakfast.'
                },
                'lunch': {
                    'time': '01:30 PM',
                    'title': 'Principal Meal (Main Digestion Peak)',
                    'items': [
                        'Steamed aged organic rice with 1 tsp clarified butter (Ghee)',
                        'Split yellow mung bean soup seasoned with roasted cumin and curry leaves',
                        'Cooked seasonal vegetables: Bottle gourd and Ridge gourd',
                        'Fresh spiced buttermilk with roasted cumin powder'
                    ],
                    'notes': 'Chew thoroughly; fill stomach to 50% solid, 25% liquid, leaving 25% for comfortable digestion.'
                },
                'evening': {
                    'time': '05:00 PM',
                    'title': 'Sun-Setting Herbals & Light Energy',
                    'items': [
                        'Roasted lotus seeds (foxnuts) with a pinch of turmeric and rock salt',
                        'Warm infusion of digestive tea (Cumin, Coriander, Fennel)'
                    ],
                    'notes': 'Light nourishment before evening meditation or walk.'
                },
                'dinner': {
                    'time': '08:00 PM',
                    'title': 'Light Restorative Dinner',
                    'items': [
                        'Warm barley vegetable soup with carrots and bottle gourd',
                        'Light split mung bean and rice porridge seasoned with clarified butter and cumin'
                    ],
                    'notes': 'Must be completed at least 2.5 hours before retiring to bed.'
                },
                'foods_to_include': [
                    'Warm, freshly cooked meals with clarified butter (Ghee) in moderate amounts',
                    'Split yellow mung beans, red rice, barley, and quinoa',
                    'Sweet, juicy fruits: pomegranates, stewed apples, soaked raisins, tender coconut water',
                    'Digestive spices: Cumin, coriander, fennel, ginger, turmeric, cardamom'
                ],
                'foods_to_avoid': [
                    'Ice-cold drinks, refrigerated leftovers, and aerated sodas',
                    'Heavy, deep-fried fast foods, refined white flour, and artificial preservatives',
                    'Excessively sour pickles, sharp vinegars, and burning hot chilies',
                    'Raw dry salads and cold cruciferous vegetables at dinner'
                ],
                'lifestyle_notes': [
                    'Establish regular wake-up and bedtime pacing to reinforce circadian stability.',
                    'Perform gentle warm sesame oil body massage at least twice weekly.',
                    'Take a 100-step leisurely stroll post-dinner before resting.'
                ],
                'precautions': [
                    'This dietary protocol is a personalized clinical decision-support demonstration.',
                    'Inform attending physician of any unexpected digestive intolerance or symptom shift.'
                ],
                'doctor_notes': 'Clinically validated for patient constitution. Patient instructed to avoid ice water with meals.' if p_data['has_active_diet'] else 'Pending final physician verification of metabolic markers.',
                'ai_reasoning': f'Synthesized from {p_data["primary_prakriti"]} constitutional profile and clinical guidelines.',
                'knowledge_references': [ev['source'] for ev in p_data['rag_evidence']],
                'approved_by': dr_sharma if p_data['has_active_diet'] else None,
                'approved_at': (now - datetime.timedelta(days=1)) if p_data['has_active_diet'] else None,
            }

            # Compute deterministic nutritional totals
            plan_meals_dict = {
                'breakfast': diet_defaults['breakfast'],
                'mid_morning': diet_defaults['mid_morning'],
                'lunch': diet_defaults['lunch'],
                'evening': diet_defaults['evening'],
                'dinner': diet_defaults['dinner']
            }
            diet_defaults['nutritional_totals'] = calculate_day_nutrients(plan_meals_dict)

            if plan:
                for k, v in diet_defaults.items():
                    setattr(plan, k, v)
                plan.save()
            else:
                plan = DietPlan.objects.create(patient=user, doctor=dr_sharma, assessment=asm, **diet_defaults)

            # Version snapshot if active
            if p_data['has_active_diet']:
                DietPlanVersion.objects.get_or_create(
                    diet_plan=plan,
                    version_number=plan.version,
                    defaults={
                        'snapshot_data': {'title': plan.title, 'version': plan.version, 'status': plan.status, 'nutritional_totals': diet_defaults['nutritional_totals']},
                        'change_summary': 'Initial personalized clinical regimen clinically verified and approved by Dr. Abhinav Sharma.',
                        'created_by': dr_sharma
                    }
                )

            # -----------------------------------------------------------------
            # Audit Trail Events (Idempotent per Patient)
            # -----------------------------------------------------------------
            # 1. Intake creation audit
            AuditLog.objects.get_or_create(
                patient=user,
                action=AuditAction.AI_DIET_GENERATED,
                object_type='PatientAssessment',
                object_id=str(asm.id),
                defaults={
                    'actor': dr_sharma,
                    'metadata': {
                        'is_demo_data': True,
                        'event': 'Baseline clinical assessment recorded',
                        'prakriti': p_data['primary_prakriti']
                    }
                }
            )

            # 2. Field corrections audit
            if p_data.get('corrections'):
                for f_name, c_data in p_data['corrections'].items():
                    AuditLog.objects.get_or_create(
                        patient=user,
                        action=AuditAction.DOCTOR_CORRECTED_FIELD,
                        object_type='PatientVerification',
                        object_id=f'{asm.id}_{f_name}',
                        defaults={
                            'actor': dr_sharma,
                            'metadata': {
                                'is_demo_data': True,
                                'field': f_name,
                                'corrected_value': c_data['verified_val'],
                                'note': c_data['note']
                            }
                        }
                    )

            # 3. Active diet approval audit
            if p_data['has_active_diet']:
                AuditLog.objects.get_or_create(
                    patient=user,
                    action=AuditAction.DIET_APPROVED,
                    object_type='DietPlan',
                    object_id=str(plan.id),
                    defaults={
                        'actor': dr_sharma,
                        'metadata': {
                            'is_demo_data': True,
                            'version': plan.version,
                            'title': plan.title
                        }
                    }
                )

            # 4. Review signed audit
            if p_data['review_status'] == ReviewStatus.COMPLETED:
                AuditLog.objects.get_or_create(
                    patient=user,
                    action=AuditAction.DOCTOR_REVIEW_COMPLETED,
                    object_type='ClinicalReview',
                    object_id=str(review.id),
                    defaults={
                        'actor': dr_sharma,
                        'metadata': {
                            'is_demo_data': True,
                            'status': 'COMPLETED',
                            'summary': review.summary[:80]
                        }
                    }
                )

            msg = f'  [OK] Patient seeded: {p_data["display_name"]} [{p_data["primary_prakriti"]}] - Review: {p_data["review_status"]}'
            self.stdout.write(msg.encode('ascii', 'replace').decode('ascii'))


        # ---------------------------------------------------------------------
        # 4. Doctor-Patient Assignments & Active Clinical Care Rosters
        # ---------------------------------------------------------------------
        self.stdout.write(self.style.NOTICE('Seeding Doctor-Patient Assignments & Clinical Roster...'))

        assigned_pairs = [
            ('swetha.chowdary', dr_sharma),
            ('rajesh.nair', dr_sharma),
            ('priya.sharma', dr_sharma),
            ('vikram.aditya', dr_sharma),
            ('kavita.patel', dr_menon),
        ]
        # ananya.iyer is deliberately kept UNASSIGNED for testing doctor assignment workflow!

        for username, doctor in assigned_pairs:
            p_user = User.objects.filter(username=username).first()
            if p_user:
                assignment, _ = DoctorPatientAssignment.objects.get_or_create(
                    doctor=doctor,
                    patient=p_user,
                    defaults={'is_active': True, 'notes': 'Assigned for ongoing clinical constitutional diet monitoring.'}
                )
                if not assignment.is_active:
                    assignment.is_active = True
                    assignment.save(update_fields=['is_active'])

                if hasattr(p_user, 'patient_profile'):
                    p_user.patient_profile.assigned_doctor = doctor
                    p_user.patient_profile.save(update_fields=['assigned_doctor'])

        # Ensure ananya.iyer is unassigned
        ananya = User.objects.filter(username='ananya.iyer').first()
        if ananya and hasattr(ananya, 'patient_profile'):
            ananya.patient_profile.assigned_doctor = None
            ananya.patient_profile.save(update_fields=['assigned_doctor'])
            DoctorPatientAssignment.objects.filter(patient=ananya).update(is_active=False)

        # ---------------------------------------------------------------------
        # 5. Daily Meal Logs & Adherence Progress (for Swetha Chowdary)
        # ---------------------------------------------------------------------
        swetha = User.objects.filter(username='swetha.chowdary').first()
        if swetha:
            today = timezone.localdate()
            swetha_plan = DietPlan.objects.filter(patient=swetha, status=DietPlanStatus.PUBLISHED).first()

            # Seed past 6 days historical progress
            for days_ago in range(6, 0, -1):
                past_d = today - datetime.timedelta(days=days_ago)
                planned = 5
                completed = 4 if days_ago % 2 == 0 else 5
                skipped = 1 if days_ago % 2 == 0 else 0
                adh = round((completed / planned * 100), 1)

                ProgressRecord.objects.update_or_create(
                    patient=swetha,
                    date=past_d,
                    defaults={
                        'meals_planned': planned,
                        'meals_completed': completed,
                        'meals_partially_completed': 0,
                        'meals_skipped': skipped,
                        'adherence_rate': adh,
                        'water_intake_ml': 2250 if completed == 5 else 1750,
                        'water_goal_ml': 2500,
                        'reported_difficulties': False,
                    }
                )

            # Today's Meal Logs
            today_logs_data = [
                {
                    'meal_type': MealType.BREAKFAST,
                    'meal_name': 'Spiced Rolled Oats & Warm Stewed Apple',
                    'scheduled_time': '08:00 AM',
                    'status': MealLogStatus.COMPLETED,
                    'completed_at': now - datetime.timedelta(hours=4),
                    'notes': 'Prepared with pinch of cardamom. Digestive fire felt steady and warm.',
                    'energy_rating': 4,
                },
                {
                    'meal_type': MealType.MID_MORNING,
                    'meal_name': 'Hydration & Mineral Replenishment',
                    'scheduled_time': '11:00 AM',
                    'status': MealLogStatus.COMPLETED,
                    'completed_at': now - datetime.timedelta(hours=2),
                    'notes': 'Fresh coconut water at room temperature. Very refreshing.',
                    'energy_rating': 5,
                },
                {
                    'meal_type': MealType.LUNCH,
                    'meal_name': 'Principal Meal (Main Digestion Peak)',
                    'scheduled_time': '01:30 PM',
                    'status': MealLogStatus.PARTIALLY_COMPLETED,
                    'completed_at': now - datetime.timedelta(minutes=45),
                    'notes': 'Had mung dal soup and buttermilk; ate half portion of steamed rice.',
                    'portion_consumed': '60%',
                    'energy_rating': 3,
                },
                {
                    'meal_type': MealType.EVENING,
                    'meal_name': 'Digestive Herbal Tea & Roasted Seeds',
                    'scheduled_time': '05:00 PM',
                    'status': MealLogStatus.SKIPPED,
                    'skip_reason': 'Work conference meeting travel; unable to brew fresh CCF tea',
                    'symptom_notes': 'Slight abdominal bloating and fullness',
                    'difficulty_reported': True,
                    'notes': 'Skipped scheduled snack',
                },
                {
                    'meal_type': MealType.DINNER,
                    'meal_name': 'Light Restorative Dinner',
                    'scheduled_time': '08:00 PM',
                    'status': MealLogStatus.PENDING,
                    'notes': 'Planned for 08:00 PM',
                },
            ]

            for ml in today_logs_data:
                MealLog.objects.update_or_create(
                    patient=swetha,
                    date=today,
                    meal_type=ml['meal_type'],
                    defaults={
                        'diet_plan': swetha_plan,
                        'meal_name': ml['meal_name'],
                        'scheduled_time': ml['scheduled_time'],
                        'status': ml['status'],
                        'completed_at': ml.get('completed_at'),
                        'notes': ml.get('notes', ''),
                        'skip_reason': ml.get('skip_reason', ''),
                        'symptom_notes': ml.get('symptom_notes', ''),
                        'difficulty_reported': ml.get('difficulty_reported', False),
                        'portion_consumed': ml.get('portion_consumed', ''),
                        'energy_rating': ml.get('energy_rating'),
                    }
                )

            # Today's Progress Record
            ProgressRecord.objects.update_or_create(
                patient=swetha,
                date=today,
                defaults={
                    'meals_planned': 5,
                    'meals_completed': 2,
                    'meals_partially_completed': 1,
                    'meals_skipped': 1,
                    'adherence_rate': 50.0,
                    'water_intake_ml': 1500,
                    'water_goal_ml': 2500,
                    'reported_difficulties': True,
                    'energy_rating': 4,
                }
            )

            # Patient Diet Difficulty Report
            PatientDietDifficultyReport.objects.update_or_create(
                patient=swetha,
                meal_type=MealType.EVENING,
                created_at__date=today,
                defaults={
                    'diet_plan': swetha_plan,
                    'difficulty_description': 'Work conference schedule; could not prepare warm herbal tea',
                    'symptoms': 'Mild abdominal distension and heaviness in late afternoon',
                    'severity': 'MILD',
                    'reviewed_by_doctor': False,
                }
            )

        # ---------------------------------------------------------------------
        # 6. Persistent Authenticated Messaging (Swetha <-> Dr. Sharma)
        # ---------------------------------------------------------------------
        if swetha and dr_sharma:
            # 1. Message from Swetha (Read)
            PatientDoctorMessage.objects.get_or_create(
                sender=swetha,
                recipient=dr_sharma,
                doctor=dr_sharma,
                patient=swetha,
                content='Good morning Dr. Sharma, I started the v1 diet plan today. The warm rolled oats porridge was very comfortable on my digestion.',
                defaults={
                    'is_read': True,
                    'read_at': now - datetime.timedelta(hours=2, minutes=30),
                    'created_at': now - datetime.timedelta(hours=3),
                }
            )

            # 2. Reply from Dr. Sharma (Read)
            PatientDoctorMessage.objects.get_or_create(
                sender=dr_sharma,
                recipient=swetha,
                doctor=dr_sharma,
                patient=swetha,
                content='Good morning Swetha. Glad to hear your Agni is responding well. Remember to keep sipping lukewarm water between meals and avoid refrigerated beverages.',
                defaults={
                    'is_read': True,
                    'read_at': now - datetime.timedelta(hours=1, minutes=45),
                    'created_at': now - datetime.timedelta(hours=2),
                }
            )

            # 3. New Question from Swetha (Unread for Doctor to inspect!)
            PatientDoctorMessage.objects.get_or_create(
                sender=swetha,
                recipient=dr_sharma,
                doctor=dr_sharma,
                patient=swetha,
                content='Doctor, I had to travel for an afternoon meeting and skipped the evening CCF tea. I feel slight bloating right now. Should I take cumin water before dinner?',
                defaults={
                    'is_read': False,
                    'created_at': now - datetime.timedelta(minutes=25),
                }
            )

        # ---------------------------------------------------------------------
        # 7. In-App Notifications
        # ---------------------------------------------------------------------
        doctor_notifications = [
            {
                'title': 'New Message from Patient: Swetha Chowdary',
                'message': 'Swetha Chowdary: "Doctor, I had to travel for an afternoon meeting and skipped the evening CCF tea..."',
                'type': 'NEW_MESSAGE',
                'related_object_type': 'PatientDoctorMessage',
            },
            {
                'title': 'Dietary Difficulty Reported (MILD)',
                'message': 'Patient Swetha Chowdary reported difficulty with Evening Snack: Work conference schedule; could not prepare warm herbal tea',
                'type': 'PATIENT_DIFFICULTY',
                'related_object_type': 'PatientDietDifficultyReport',
            },
            {
                'title': 'Diet Plan Awaiting Physician Approval: Rajesh Nair',
                'message': 'A draft personalized nutrition protocol has been generated for Rajesh Nair. Please review and approve.',
                'type': 'INFO',
                'related_object_type': 'DietPlan',
            },
            {
                'title': 'Evidence-Based Clinical Knowledge Base Grounded',
                'message': 'Classical medical retrieval-augmented knowledge indices re-indexed with authentic Charaka, Sushruta, and CCRAS compendia.',
                'type': 'GENERAL',
                'related_object_type': 'System',
            }
        ]

        for notif in doctor_notifications:
            existing_notif = Notification.objects.filter(user=dr_sharma, title=notif['title']).first()
            if not existing_notif:
                Notification.objects.create(
                    user=dr_sharma,
                    title=notif['title'],
                    type=notif['type'],
                    message=notif['message'],
                    related_object_type=notif['related_object_type'],
                    is_read=False,
                )

        self.stdout.write(self.style.SUCCESS(
            '\n========================================================================\n'
            '  AyuRAG-XAI Clinical Decision Support Demo Accounts & Credentials\n'
            '========================================================================\n'
            '  DOCTOR ACCOUNTS:\n'
            '    - Username: dr.sharma      | Password: doctor123  (Assigned: Swetha, Rajesh, Priya)\n'
            '    - Username: dr.menon       | Password: doctor123  (Assigned: Kavita Patel)\n'
            '\n'
            '  PATIENT ACCOUNTS:\n'
            '    - Username: swetha.chowdary | Password: patient123 (Published Plan v1, Active Logs, Unread Msg)\n'
            '    - Username: rajesh.nair     | Password: patient123 (Draft Plan Pending Review)\n'
            '    - Username: priya.sharma    | Password: patient123 (Published Plan v1)\n'
            '    - Username: ananya.iyer     | Password: patient123 (UNASSIGNED - Test Doctor Assign Workflow)\n'
            '========================================================================\n'
        ))

