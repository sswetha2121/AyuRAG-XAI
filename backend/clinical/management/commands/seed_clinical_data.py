import datetime
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import DoctorProfile, PatientProfile
from clinical.models import PatientAssessment, ClinicalReview, ReviewStatus, AssessmentStatus

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds realistic Ayurvedic clinical data, doctors, patients, assessments, XAI and RAG evidence'

    def handle(self, *args, **options):
        self.stdout.write('Seeding clinical accounts and assessment data...')

        # 1. Create Doctors
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
                'professional_name': 'Dr. A. Sharma',
                'qualification': 'BAMS, MD (Ayurveda - Kayachikitsa)',
                'specialization': 'Kayachikitsa (Internal Medicine) & Prakriti Diagnostics',
                'clinical_license': 'AYUSH-DEL-2018-8492',
                'experience_years': 14
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
                'professional_name': 'Dr. V. Menon',
                'qualification': 'BAMS, Fellowship in Panchakarma (Kerala)',
                'specialization': 'Panchakarma & Constitutional Medicine',
                'clinical_license': 'AYUSH-KER-2015-3211',
                'experience_years': 18
            }
        )

        # 2. Patients & Detailed Clinical Assessments
        patients_data = [
            {
                'username': 'swetha.chowdary',
                'name': 'Swetha Chowdary',
                'email': 'swetha.chowdary@example.com',
                'age': 24,
                'gender': 'Female',
                'prakriti_primary': 'Vāta-Pitta',
                'prakriti_scores': {'vata': 48, 'pitta': 34, 'kapha': 18, 'primary': 'Vāta-Pitta'},
                'chief_symptoms': ['Agnimandya (Weak Digestion)', 'Nidranasha (Sleep Onset Latency)', 'Adhmana (Abdominal Bloating)'],
                'review_status': ReviewStatus.PENDING,
                'ai_analysis': {
                    'prediction': 'Vāta-Pitta Agnimandya with Nidranasha',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.892,
                    'entropy_score': 0.18,
                    'inference_timestamp': '2026-09-28T09:30:00Z'
                },
                'shap_explanations': [
                    {'feature': 'Irregular Sleep Duration (<6 hrs)', 'contribution': 0.36, 'direction': 'positive'},
                    {'feature': 'Cold/Dry Dietary Intake', 'contribution': 0.28, 'direction': 'positive'},
                    {'feature': 'High Mental Stress (Chinta)', 'contribution': 0.22, 'direction': 'positive'},
                    {'feature': 'Skipping Breakfast (Vishamashana)', 'contribution': 0.19, 'direction': 'positive'},
                    {'feature': 'Regular Warm Water Intake', 'contribution': -0.14, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Sleep onset latency > 45 mins', 'weight': 0.34, 'type': 'positive'},
                    {'feature': 'Bloating within 1hr post-prandial', 'weight': 0.29, 'type': 'positive'},
                    {'feature': 'Irregular appetite cycle', 'weight': 0.21, 'type': 'positive'},
                    {'feature': 'Absence of chronic illness history', 'weight': -0.12, 'type': 'negative'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Charaka Samhitā, Sūtrasthāna Ch. 12, Śloka 11',
                        'passage': 'Vāyoḥ rūkṣa-śīta-laghu-sūkṣma-cala-viśada-kharāḥ guṇāḥ. When Vāta is aggravated by cold and dry ahara, agni becomes vishama (irregular).',
                        'relevance_score': 0.942,
                        'domain': 'Pathophysiology of Agni'
                    },
                    {
                        'source': 'Aṣṭāṅga Hṛdayam, Sūtrasthāna Ch. 7 (Annarakṣāvidhi)',
                        'passage': 'Nidrāyattam sukhaṁ duḥkhaṁ puṣṭiḥ kārśyaṁ balābalam. Wholesome sleep maintains vitality and normal agni rhythm.',
                        'relevance_score': 0.887,
                        'domain': 'Dinacharya & Nidra'
                    }
                ],
                'recommendations': {
                    'ahara': [
                        'Warm, unctuous (Snigdha), freshly cooked soups (Yusha) with pinch of ginger and rock salt.',
                        'Avoid dry cereals, chilled beverages, and raw salads at dinner.'
                    ],
                    'vihara': [
                        'Padabhyanga (warm sesame oil massage on feet) before bedtime.',
                        'Establish fixed circadian sleep schedule by 22:30.'
                    ],
                    'classical_formulations': [
                        'Hingwashtak Churna (1g with first morsel of warm ghee before lunch)',
                        'Saraswatarishta (15ml with equal warm water post-dinner)'
                    ]
                }
            },
            {
                'username': 'rajesh.nair',
                'name': 'Rajesh Nair',
                'email': 'rajesh.nair@example.com',
                'age': 42,
                'gender': 'Male',
                'prakriti_primary': 'Pitta-Kapha',
                'prakriti_scores': {'vata': 20, 'pitta': 52, 'kapha': 28, 'primary': 'Pitta-Kapha'},
                'chief_symptoms': ['Amlapitta (Hyperacidity & Heartburn)', 'Daha (Burning Sensation in Epigastrium)', 'Klama (Post-prandial Fatigue)'],
                'review_status': ReviewStatus.IN_REVIEW,
                'ai_analysis': {
                    'prediction': 'Urdhwaga Amlapitta (Vidagdha Agni)',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.915,
                    'entropy_score': 0.12,
                    'inference_timestamp': '2026-09-27T14:15:00Z'
                },
                'shap_explanations': [
                    {'feature': 'Pungent & Fermented Food Frequency', 'contribution': 0.41, 'direction': 'positive'},
                    {'feature': 'High Occupational Screen/Stress Exposure', 'contribution': 0.25, 'direction': 'positive'},
                    {'feature': 'Delayed Night Dinner (>21:30)', 'contribution': 0.21, 'direction': 'positive'},
                    {'feature': 'Moderate Physical Activity', 'contribution': -0.15, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Sour eructation after spicy meals', 'weight': 0.38, 'type': 'positive'},
                    {'feature': 'Epigastric warmth relieved by cold milk', 'weight': 0.31, 'type': 'positive'},
                    {'feature': 'Normal bowel evacuation frequency', 'weight': -0.10, 'type': 'negative'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Mādhava Nidāna, Amlapitta Nidāna, Verse 1-3',
                        'passage': 'Atyamla-tīkṣṇa-vidāhi-guru-pitta-prakopa-kāriṇāṁ... excess sour, sharp, burning foods vitiate Pitta, leading to acidic digestion.',
                        'relevance_score': 0.961,
                        'domain': 'Etiology of Amlapitta'
                    }
                ],
                'recommendations': {
                    'ahara': [
                        'Tikta-Kashaya (bitter-astringent) pacifying foods; pomegranate, tender coconut water.',
                        'Completely avoid fermented batter, chilies, vinegar, and deep-fried savories.'
                    ],
                    'vihara': [
                        'Avoid direct midday sun exposure; engage in cooling Shitali Pranayama.'
                    ],
                    'classical_formulations': [
                        'Avipattikar Churna (3g with warm water at bedtime)',
                        'Kamadudha Rasa (Mukta Yukta) 125mg twice daily before meals'
                    ]
                }
            },
            {
                'username': 'priya.sharma',
                'name': 'Priya Sharma',
                'email': 'priya.sharma@example.com',
                'age': 31,
                'gender': 'Female',
                'prakriti_primary': 'Kapha-Vāta',
                'prakriti_scores': {'vata': 35, 'pitta': 15, 'kapha': 50, 'primary': 'Kapha-Vāta'},
                'chief_symptoms': ['Gaurava (Heaviness in Body)', 'Tandra (Excessive Daytime Somnolence)', 'Manda Agni (Sluggish Metabolism)'],
                'review_status': ReviewStatus.COMPLETED,
                'ai_analysis': {
                    'prediction': 'Kaphavrita Samana Vayu with Mandaagni',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.874,
                    'entropy_score': 0.15,
                    'inference_timestamp': '2026-09-25T11:00:00Z'
                },
                'shap_explanations': [
                    {'feature': 'Sedentary Desk Work (>8 hrs)', 'contribution': 0.38, 'direction': 'positive'},
                    {'feature': 'Daytime Sleeping (Divasvapna)', 'contribution': 0.29, 'direction': 'positive'},
                    {'feature': 'Heavy Dairy / Sweet Intake', 'contribution': 0.22, 'direction': 'positive'},
                    {'feature': 'Warm Water Preference', 'contribution': -0.16, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Morning sluggishness lasting >2 hrs', 'weight': 0.35, 'type': 'positive'},
                    {'feature': 'Digestive transit time > 24 hrs', 'weight': 0.28, 'type': 'positive'},
                    {'feature': 'Adequate hydration', 'weight': -0.11, 'type': 'negative'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Sushruta Samhitā, Sūtrasthāna Ch. 15, Verse 19',
                        'passage': 'Mande agnau dīpanam ca śamanam karma hi hitam. In sluggish agni, deepana (appetite stimulants) and langhana (lightness therapies) are wholesome.',
                        'relevance_score': 0.925,
                        'domain': 'Metabolic Stimulation'
                    }
                ],
                'recommendations': {
                    'ahara': [
                        'Laghu (light), Ushna (warm) foods; barley (Yava), mung dal khichdi with roasted cumin and black pepper.'
                    ],
                    'vihara': [
                        'Strictly avoid daytime napping (Divasvapna); 45 minutes brisk walking in early morning.'
                    ],
                    'classical_formulations': [
                        'Trikatu Churna (500mg with honey before meals)',
                        'Varunadi Kashayam (15ml with 45ml boiled cooled water morning on empty stomach)'
                    ]
                }
            },
            {
                'username': 'amit.patel',
                'name': 'Amit Patel',
                'email': 'amit.patel@example.com',
                'age': 50,
                'gender': 'Male',
                'prakriti_primary': 'Vāta dominant',
                'prakriti_scores': {'vata': 58, 'pitta': 24, 'kapha': 18, 'primary': 'Vāta dominant'},
                'chief_symptoms': ['Vibandha (Chronic Constipation)', 'Sandhishula (Joint Aches on Movement)', 'Chinta (Mental Restlessness)'],
                'review_status': ReviewStatus.PENDING,
                'ai_analysis': {
                    'prediction': 'Apana Vata Dushti with Sandhigata Vata tendencies',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.931,
                    'entropy_score': 0.11,
                    'inference_timestamp': '2026-09-28T08:15:00Z'
                },
                'shap_explanations': [
                    {'feature': 'Low dietary fiber & hydration', 'contribution': 0.39, 'direction': 'positive'},
                    {'feature': 'Advanced age bracket (>50 Vata stage)', 'contribution': 0.27, 'direction': 'positive'},
                    {'feature': 'High frequency travel', 'contribution': 0.21, 'direction': 'positive'},
                    {'feature': 'Non-smoking status', 'contribution': -0.13, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Stool consistency type 1-2 Bristol', 'weight': 0.41, 'type': 'positive'},
                    {'feature': 'Bilateral knee crepitus with dryness', 'weight': 0.27, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Charaka Samhitā, Cikitsāsthāna Ch. 28, Verse 32',
                        'passage': 'Vāte snehana-svedādayaḥ... For aggravated Vāta, oleation (internal and external Snehana) is supreme.',
                        'relevance_score': 0.954,
                        'domain': 'Vata Chikitsa'
                    }
                ],
                'recommendations': {
                    'ahara': ['Warm milk with 1 tsp Cow Ghee at night', 'Soaked Munakka (black raisins) in the morning'],
                    'vihara': ['Full body Abhyanga with Mahanarayana Taila', 'Gentle Sukshma Vyayama for joints'],
                    'classical_formulations': ['Triphala Churna with warm water', 'Yogaraj Guggulu (2 tabs twice daily)']
                }
            },
            {
                'username': 'ananya.iyer',
                'name': 'Ananya Iyer',
                'email': 'ananya.iyer@example.com',
                'age': 29,
                'gender': 'Female',
                'prakriti_primary': 'Pitta dominant',
                'prakriti_scores': {'vata': 22, 'pitta': 60, 'kapha': 18, 'primary': 'Pitta dominant'},
                'chief_symptoms': ['Shirashula (Migraine & Temporal Throbbing)', 'Ushnata (Heat Intolerance)', 'Krodha (Irritability under Stress)'],
                'review_status': ReviewStatus.COMPLETED,
                'ai_analysis': {
                    'prediction': 'Pitta-Vata Shirashula (Ardhavabhedaka)',
                    'model_name': 'AyuRAG Clinical Multi-Task Classifier v2.1',
                    'confidence': 0.884,
                    'entropy_score': 0.16,
                    'inference_timestamp': '2026-09-24T16:45:00Z'
                },
                'shap_explanations': [
                    {'feature': 'Excess Screen Glare & Sleep Deficit', 'contribution': 0.37, 'direction': 'positive'},
                    {'feature': 'Spicy Fast Food Consumption', 'contribution': 0.28, 'direction': 'positive'},
                    {'feature': 'Emotional Frustration', 'contribution': 0.19, 'direction': 'positive'},
                    {'feature': 'Regular Morning Hydration', 'contribution': -0.15, 'direction': 'negative'},
                ],
                'lime_explanations': [
                    {'feature': 'Unilateral throbbing exacerbated by sunlight', 'weight': 0.36, 'type': 'positive'},
                    {'feature': 'Relief through darkness and cold compress', 'weight': 0.29, 'type': 'positive'}
                ],
                'rag_evidence': [
                    {
                        'source': 'Charaka Samhitā, Siddhisthāna Ch. 9, Verse 74',
                        'passage': 'Pittena pittasya śiraḥ-śūle kṣīra-ghṛtābhyāṁ tarpayet... In Pitta headache, cooling ghee nasal drops (Nasya) and milk therapies are therapeutic.',
                        'relevance_score': 0.938,
                        'domain': 'Shiro Roga Chikitsa'
                    }
                ],
                'recommendations': {
                    'ahara': ['Sweet, bitter, and astringent foods', 'Pomegranate, mint tea, soaked almonds'],
                    'vihara': ['Marma therapy for Shanka marma', 'Chandra Bhedana Pranayama before bed'],
                    'classical_formulations': ['Pathyadi Kadha (15ml twice daily)', 'Shirashuladi Vajra Rasa (1 tab with warm water)']
                }
            }
        ]

        for p_data in patients_data:
            user, _ = User.objects.get_or_create(
                username=p_data['username'],
                defaults={
                    'email': p_data['email'],
                    'role': User.Role.PATIENT,
                }
            )
            user.set_password('patient123')
            user.role = User.Role.PATIENT
            user.save()

            PatientProfile.objects.update_or_create(
                user=user,
                defaults={
                    'full_name': p_data['name'],
                    'age': p_data['age'],
                    'gender': p_data['gender'],
                    'contact_phone': '+91-98765-43210'
                }
            )

            # Create Assessment
            asm, _ = PatientAssessment.objects.update_or_create(
                patient=user,
                defaults={
                    'status': AssessmentStatus.COMPLETED,
                    'demographics': {
                        'fullName': p_data['name'],
                        'age': p_data['age'],
                        'gender': p_data['gender'],
                        'height': 168 if p_data['gender'] == 'Female' else 176,
                        'weight': 58 if p_data['gender'] == 'Female' else 74,
                        'climate': 'tropical-coastal',
                        'location': 'Bangalore, India'
                    },
                    'prakriti_scores': p_data['prakriti_scores'],
                    'prakriti_data': {
                        'primary': p_data['prakriti_primary'],
                        'vata': p_data['prakriti_scores']['vata'],
                        'pitta': p_data['prakriti_scores']['pitta'],
                        'kapha': p_data['prakriti_scores']['kapha'],
                    },
                    'lifestyle_data': {
                        'sleepDuration': '6-7 hours',
                        'sleepQuality': 'Interrupted',
                        'activityLevel': 'Moderate',
                        'stressLevel': 'High',
                        'circadianAlignment': 'Moderate'
                    },
                    'diet_data': {
                        'appetitePattern': 'Irregular (Vishama Agni)',
                        'mealFrequency': '2-3 meals daily',
                        'hydration': '1.8L daily',
                        'predominantTaste': 'Katu (Pungent) & Tikta (Bitter)'
                    },
                    'symptoms_data': {
                        'chiefComplaints': p_data['chief_symptoms'],
                        'severity': 'Moderate to High',
                        'chronicity': '3 to 6 months',
                        'aggravatingFactors': 'Mental stress, irregular dining hours'
                    },
                    'ai_analysis': p_data['ai_analysis'],
                    'shap_explanations': p_data['shap_explanations'],
                    'lime_explanations': p_data['lime_explanations'],
                    'rag_evidence': p_data['rag_evidence'],
                    'recommendations': p_data['recommendations'],
                }
            )

            # Create Clinical Review
            review_notes = {
                ReviewStatus.PENDING: {
                    'summary': '',
                    'observations': '',
                    'recommendations': '',
                    'follow_up': ''
                },
                ReviewStatus.IN_REVIEW: {
                    'summary': f'Preliminary review conducted for {p_data["name"]}. AI pattern indicates {p_data["ai_analysis"]["prediction"]}. Patient exhibits classic metabolic dysregulation.',
                    'observations': 'Tongue examination (Jihva Pariksha) recommended. Pitta-pacifying diet initiated. Validating SHAP contribution for dietary timings.',
                    'recommendations': 'Continue warm decoctions; eliminate sour/fermented foods for 14 days.',
                    'follow_up': 'Follow-up consultation in 10 days for Agni reassessment.'
                },
                ReviewStatus.COMPLETED: {
                    'summary': f'Clinical evaluation finalized by Dr. A. Sharma. Concordant with AI inference ({p_data["ai_analysis"]["prediction"]}). Classical therapeutic regimen approved.',
                    'observations': 'Dhatu nutrition status adequate. Symptoms correlated with seasonal Sandhi transition (Ritu Sandhi).',
                    'recommendations': 'Classical pathya diet plan approved with Dinacharya adherence checklist.',
                    'follow_up': 'Review in 3 weeks. Routine clinical follow-up scheduled.'
                }
            }

            status_val = p_data['review_status']
            note = review_notes[status_val]

            ClinicalReview.objects.update_or_create(
                assessment=asm,
                patient=user,
                defaults={
                    'doctor': dr_sharma,
                    'status': status_val,
                    'summary': note['summary'],
                    'observations': note['observations'],
                    'recommendations': note['recommendations'],
                    'follow_up_notes': note['follow_up']
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded 2 doctors, 5 patient clinical assessments, and reviews!'))
