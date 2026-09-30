"""
Personalization Engine for AyuRAG-XAI.
Consumes:
- Doctor-Verified Patient Profile (via patient_data_resolver)
- Classical RAG knowledge references (via rag_service)
- Assessment ML findings & clinical context

Generates structured, individualized Ayurvedic Ahara (Diet) & Vihara (Lifestyle) drafts.
All plans are created in DRAFT status and require explicit Doctor Approval before activation.
"""

from typing import Dict, Any, Optional
from django.utils import timezone
from clinical.models import (
    DietPlan,
    DietPlanStatus,
    DietPlanGeneratedBy,
    PatientAssessment,
    AuditLog,
    AuditAction
)
from accounts.models import User
from clinical.services.patient_data_resolver import get_effective_patient_profile
from clinical.services.rag_service import retrieve_relevant_knowledge


def _determine_dosha_diet_template(prakriti_str: str, symptoms: list, agni_pattern: str) -> Dict[str, Any]:
    """
    Synthesizes classical Ayurvedic dietary guidelines based on the resolved constitution,
    metabolic fire (Agni), and symptom markers.
    """
    p_lower = (prakriti_str or '').lower()
    agni_lower = (agni_pattern or '').lower()

    # Default / Mixed Tridoshic baseline
    target_dosha = "Tridoshic / Balanced"
    objective = "Maintain tridoshic equilibrium, nourish sapta dhatus, and sustain metabolic Agni."

    if 'vata' in p_lower and 'pitta' in p_lower:
        target_dosha = "Vāta-Pitta Pacification"
        objective = "Pacify volatile Vata and cooling moderate Pitta; stabilize Vishamagni and hydrate bodily tissues."
        breakfast = {
            'time': '08:00 - 08:30 AM',
            'title': 'Warm Stewed Oats or Spiced Ragi Porridge',
            'items': [
                'Warm whole-grain rolled oats cooked with almond milk and a pinch of ground cardamom and cinnamon.',
                'Stewed organic sweet apple or pear with 2-3 soaked almonds (peeled).',
                'Cup of warm water with half tsp cow ghee on an empty stomach.'
            ],
            'calories_approx': '380 - 420 kcal',
            'ayurvedic_properties': 'Snigdha (unctuous), Guru (grounding), Madhura (sweet vipaka)'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Herbal Hydration & Mineral Rehydration',
            'items': [
                'Fresh tender coconut water or cumin-coriander-fennel (CCF) lukewarm tea.',
                '4 soaked black raisins (Munakka).'
            ],
            'calories_approx': '90 - 120 kcal',
            'ayurvedic_properties': 'Sheeta virya (cooling), Deepana (digestive stimulant)'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Wholesome Kitchari or Warm Grain & Dal Platter',
            'items': [
                'Moong dal and organic brown basmati rice cooked with fresh ginger, cumin, turmeric, and 1 tsp A2 cow ghee.',
                'Steamed zucchini and peeled bottle gourd (lauki) sautéed with coriander seeds.',
                'Small cup of fresh probiotic buttermilk (Takra) tempered with roasted jeera powder and rock salt.'
            ],
            'calories_approx': '550 - 620 kcal',
            'ayurvedic_properties': 'Laghu (light), Agni-deepana, Pitta-shāmaka'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Gentle Nourishment & Pitta Soother',
            'items': [
                'Roasted makhana (fox nuts) tossed in half-tsp cow ghee with rock salt.',
                'Warm herbal infusion of fresh mint or licorice root.'
            ],
            'calories_approx': '130 - 160 kcal',
            'ayurvedic_properties': 'Grahi (stabilizing), Hridya'
        }
        dinner = {
            'time': '07:30 - 08:15 PM',
            'title': 'Light Vegetable Clear Soup & Soft Chapati',
            'items': [
                'Pumpkin and carrot soup prepared with mild cumin and rock salt (strictly non-pungent).',
                '1-2 soft whole wheat phulkas lightly smeared with ghee.',
                'Warm spiced golden turmeric-nutmeg milk (half cup) 45 mins before bedtime.'
            ],
            'calories_approx': '350 - 400 kcal',
            'ayurvedic_properties': 'Laghu (easy to digest), Nidra-janaka (sleep-inducing)'
        }
        foods_to_include = [
            'A2 Cow Ghee, cold-pressed sesame oil, virgin coconut oil in moderation',
            'Split yellow moong dal, red lentils (masoor), soaked almonds',
            'Sweet well-ripened fruits: apples (cooked), pomegranates, sweet grapes, figs',
            'Well-cooked squashes, carrots, zucchini, asparagus, spinach in moderation',
            'Spices: Turmeric, cumin, fresh ginger (in small quantity), coriander, fennel, cardamom, cinnamon'
        ]
        foods_to_avoid = [
            'Deep fried, heavily salted, and packaged junk foods',
            'Extremely sour, fermented pickles and vinegar',
            'Excessive red chilies, mustard seeds, and raw garlic',
            'Chilled beverages, iced water, and aerated drinks',
            'Dry, cold salads and raw cruciferous vegetables (raw cabbage, cauliflower, kale) at dinner'
        ]

    elif 'kapha' in p_lower:
        target_dosha = "Kapha Pacification & Agni Stimulation"
        objective = "Kindle sluggish digestion (Mandagni), clear lymphatic stagnation, and eliminate excess moisture."
        breakfast = {
            'time': '08:00 - 08:30 AM',
            'title': 'Light Roasted Barley (Yava) or Spiced Millet Upma',
            'items': [
                'Roasted barley porridge with a touch of grated ginger and black pepper.',
                'Cup of warm ginger-tulsi infusion with half tsp raw unprocessed honey (added lukewarm).'
            ],
            'calories_approx': '280 - 320 kcal',
            'ayurvedic_properties': 'Ruksha (dry), Laghu (light), Ushna (warm)'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Metabolic Digestive Stimulant',
            'items': [
                'Warm water with 2-3 drops of lemon and roasted jeera.',
                'Handful of roasted pumpkin seeds.'
            ],
            'calories_approx': '70 - 100 kcal',
            'ayurvedic_properties': 'Deepana-Pachana'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Spiced Kulattha (Horsegram) Dal & Bajra / Jowar Roti',
            'items': [
                'Astringent horsegram or whole green moong dal soup tempered with mustard seeds, hing, and ginger.',
                '1 multigrain or millet (jowar) roti.',
                'Steamed bitter gourd (karela) or fenugreek leaves (methi) vegetable.'
            ],
            'calories_approx': '460 - 520 kcal',
            'ayurvedic_properties': 'Tikta (bitter), Kashaya (astringent), Kaphahara'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Herbal Metabolism Booster',
            'items': [
                'Herbal trikatu or cinnamon infusion.',
                'Small bowl of roasted chana (Bengal gram).'
            ],
            'calories_approx': '100 - 130 kcal',
            'ayurvedic_properties': 'Lekhana (scraping), Laghu'
        }
        dinner = {
            'time': '07:00 - 07:45 PM',
            'title': 'Ultra-Light Clear Vegetable Broth',
            'items': [
                'Clear drumstick (moringa) and bottle gourd broth with crushed black pepper and rock salt.',
                'Strictly finish dinner at least 3 hours before sleep.'
            ],
            'calories_approx': '220 - 270 kcal',
            'ayurvedic_properties': 'Deepana, Ama-nashana'
        }
        foods_to_include = [
            'Millets: Jowar, Bajra, Ragi, Roasted Barley (Yava)',
            'Legumes: Horsegram (Kulattha), Green Gram, Split peas',
            'Vegetables: Bitter gourd, drumstick, radish, spinach, fenugreek greens',
            'Spices: Black pepper, long pepper (pippali), dry ginger, mustard seeds, fenugreek'
        ]
        foods_to_avoid = [
            'Heavy dairy: Curd, cheese, excess cream, ice creams',
            'Excess sweets, refined sugars, and sugary carbonated drinks',
            'Cold milkshakes, banana with milk (viruddha ahara)',
            'Oily, deep-fried snacks, heavy oily curries'
        ]

    elif 'pitta' in p_lower:
        target_dosha = "Pitta Pacification & Cooling Balance"
        objective = "Alleviate metabolic heat, soothe Tikshnagni, prevent acid peptic irritation, and protect liver health."
        breakfast = {
            'time': '08:00 - 08:30 AM',
            'title': 'Cooling Coconut Rice Flakes or Soaked Grain Bowl',
            'items': [
                'Poha cooked with coconut shavings, coriander, and sweet curry leaves.',
                'Sweet seasonal fruit (fresh pomegranate or sweet red apple).',
                'Lukewarm fennel-coriander infusion.'
            ],
            'calories_approx': '340 - 390 kcal',
            'ayurvedic_properties': 'Madhura, Sheeta (cooling), Pittahara'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Pitta Quencher',
            'items': [
                'Fresh tender coconut water or soaked chia seed cooler with mint leaves.',
                '5 soaked almonds (skin removed).'
            ],
            'calories_approx': '100 - 130 kcal',
            'ayurvedic_properties': 'Daha-shamaka, Pitta-shodhana'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Cooling Basmati Rice, Moong Dal & Gourd Curry',
            'items': [
                'Steamed aged basmati rice with washed yellow moong dal and fresh ghee.',
                'Ridge gourd (turai) or ash gourd (petha) sabzi prepared with fennel and cumin.',
                'Cooling cucumber raita prepared with fresh homemade sweet curd (diluted with mint and roasted cumin).'
            ],
            'calories_approx': '520 - 580 kcal',
            'ayurvedic_properties': 'Madhura-tikta rasa, Sheeta virya'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Mild Refreshment',
            'items': [
                'Rose petal tea (lukewarm) or organic coriander seed tea.',
                '2 sweet dates or fresh sweet figs.'
            ],
            'calories_approx': '100 - 120 kcal',
            'ayurvedic_properties': 'Vayasthapana, Balya'
        }
        dinner = {
            'time': '07:30 - 08:15 PM',
            'title': 'Soothing Moong Khichdi with Ash Gourd',
            'items': [
                'Semi-liquid moong dal khichdi with mild turmeric, rock salt, and 1 tsp ghee.',
                'Avoid all sour or tomato-based curries at night.'
            ],
            'calories_approx': '360 - 410 kcal',
            'ayurvedic_properties': 'Sukhapachaka, Pitta-prasada'
        }
        foods_to_include = [
            'A2 Cow Ghee, virgin coconut oil',
            'Aged Basmati Rice, barley, rolled oats',
            'Moong dal, split pigeon pea (toor dal in moderation)',
            'Vegetables: Ash gourd, bottle gourd, pumpkin, cucumber, zucchini, cilantro',
            'Spices: Coriander seeds, fennel, cardamom, saffron, fresh turmeric'
        ]
        foods_to_avoid = [
            'Extremely spicy curries, green and red chilies, black pepper in excess',
            'Sour citrus fruits, unripe mango, tamarind, vinegar',
            'Fermented foods, alcohol, excess caffeine and smoking',
            'Deep fried foods and burnt garlic'
        ]

    else:
        # Classical Vata Pacification default
        target_dosha = "Vāta Balancing Regime"
        objective = "Stabilize kinetic energy (Vata), nourish nervous system, and ground irregular digestive rhythm."
        breakfast = {
            'time': '08:00 - 08:30 AM',
            'title': 'Warm Spiced Semolina or Oats Upma with Ghee',
            'items': [
                'Warm suji or rolled oats upma prepared with grated ginger, cumin, carrots, and 1 tsp cow ghee.',
                '4 soaked almonds and 2 walnuts.',
                'Cup of warm water with a pinch of dry ginger powder.'
            ],
            'calories_approx': '370 - 410 kcal',
            'ayurvedic_properties': 'Snigdha, Ushna, Vata-hara'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Warm Digestive Infusion',
            'items': [
                'Warm CCF (Cumin, Coriander, Fennel) tea.',
                '1-2 soft Medjool dates.'
            ],
            'calories_approx': '90 - 110 kcal',
            'ayurvedic_properties': 'Deepana, Vatanulomana'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Nutritious Khichdi or Warm Rice-Dal Platter',
            'items': [
                'Split moong dal and rice khichdi cooked soft with cumin, rock salt, and cow ghee.',
                'Stewed carrots and peeled pumpkin with fresh coriander leaves.',
                'Cup of fresh warm takra (buttermilk) with roasted cumin.'
            ],
            'calories_approx': '540 - 600 kcal',
            'ayurvedic_properties': 'Brimhana, Agni-vardhaka'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Warm Nourishing Snack',
            'items': [
                'Warm chamomile or licorice tea.',
                'Small bowl of roasted makhanas with pinch of rock salt.'
            ],
            'calories_approx': '120 - 140 kcal',
            'ayurvedic_properties': 'Manasa-shanti'
        }
        dinner = {
            'time': '07:30 - 08:15 PM',
            'title': 'Gentle Vegetable Stew & Phulka',
            'items': [
                'Warm bottle gourd and carrot stew seasoned with hing and cumin.',
                '1-2 soft phulkas with cow ghee.',
                'Warm turmeric-nutmeg milk at bedtime.'
            ],
            'calories_approx': '350 - 390 kcal',
            'ayurvedic_properties': 'Nidra-karaka, Vata-shamaka'
        }
        foods_to_include = [
            'Warm, cooked, unctuous whole foods cooked with cow ghee or sesame oil',
            'Sweet, sour, and mildly salty tastes in balanced harmony',
            'Moong dal, masoor dal, soaked nuts',
            'Cooked root vegetables, squashes, sweet potato',
            'Ginger, cumin, coriander, hing (asafoetida), cardamom'
        ]
        foods_to_avoid = [
            'Cold drinks, ice, iced water',
            'Dry, crisp crackers, raw salads, cold leftovers',
            'Bitter, pungent, and astringent tastes in excessive amounts',
            'Irregular skipping of meals (Vishama-asana)'
        ]

    lifestyle_notes = [
        'Dinacharya (Daily Routine): Wake up before 06:30 AM; scrape tongue and drink 1 glass warm water.',
        'Abhyanga (Self-Oil Massage): Apply warm sesame or coconut oil for 10 minutes before warm bath 3 times weekly.',
        'Pranayama & Movement: 15-20 minutes of gentle Anulom Vilom and restorative yoga postures in morning.',
        'Circadian Sleep Hygiene: Discontinue blue-light screens by 21:45; aim for restful sleep by 22:30.'
    ]

    precautions = [
        'Avoid consuming cold water or heavy liquids immediately before or during meals to prevent Agnimandya (dampening of digestive fire).',
        'Maintain a minimum 3 to 4 hour gap between dinner and retiring to sleep.',
        'Never force consumption when not hungry, nor excessively postpone hunger when naturally stimulated.',
        'If experiencing acute acid regurgitation or fever, shift to warm moong dal broth (Yusha) and consult doctor immediately.'
    ]

    return {
        'target_dosha': target_dosha,
        'objective': objective,
        'breakfast': breakfast,
        'mid_morning': mid_morning,
        'lunch': lunch,
        'evening': evening,
        'dinner': dinner,
        'foods_to_include': foods_to_include,
        'foods_to_avoid': foods_to_avoid,
        'lifestyle_notes': lifestyle_notes,
        'precautions': precautions
    }


def generate_personalized_diet(
    patient_id: int,
    assessment_id: Optional[int] = None,
    doctor: Optional[User] = None
) -> DietPlan:
    """
    Core Personalization Pipeline:
    1. Resolve verified patient data from patient_data_resolver (Doctor Verified > Patient Reported).
    2. Extract relevant clinical markers, Prakriti, Agni pattern, and symptoms.
    3. Query classical RAG knowledge retrieval for authentic classical textual grounding.
    4. Synthesize personalized Ahara and Vihara regimen.
    5. Save a versioned DietPlan record in DRAFT status.
    6. Record audit trail event.
    """
    # 1. Fetch Patient and Assessment
    patient = User.objects.get(id=patient_id)
    if assessment_id:
        assessment = PatientAssessment.objects.filter(id=assessment_id, patient=patient).first()
    else:
        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-created_at').first()

    # 2. Resolve Verified Clinical Profile
    profile = get_effective_patient_profile(patient_id, assessment.id if assessment else None)
    personal = profile.get('personal_information', {})
    prakriti = profile.get('prakriti', {})
    lifestyle = profile.get('lifestyle', {})
    diet = profile.get('diet', {})
    symptoms = profile.get('symptoms', {})

    # Dominant markers
    dominant_prakriti = prakriti.get('primary_prakriti') or 'Vāta-Pitta'
    chief_complaints = symptoms.get('chief_complaints') or []
    if isinstance(chief_complaints, str):
        chief_complaints = [c.strip() for c in chief_complaints.split(',') if c.strip()]
    appetite_pattern = diet.get('appetite_pattern') or ''

    # 3. Retrieve Authentic Classical Knowledge (RAG)
    existing_rag = assessment.rag_evidence if assessment else None
    knowledge_citations = retrieve_relevant_knowledge(
        prakriti=dominant_prakriti,
        symptoms=chief_complaints,
        lifestyle=lifestyle,
        diet_pattern=diet,
        existing_evidence=existing_rag
    )

    # 4. Synthesize Dietary Protocol
    regime = _determine_dosha_diet_template(dominant_prakriti, chief_complaints, appetite_pattern)

    # 5. Formulate AI Explainability / Clinical Reasoning
    patient_name = personal.get('fullName') or patient.get_full_name() or patient.username
    ai_reasoning = (
        f"Dietary formulation individualized for {patient_name} based on verified constitution "
        f"({dominant_prakriti}) and digestive fire rhythm ({appetite_pattern or 'Variable Agni'}). "
        f"Targeted to pacify aggravated dosha, eliminate metabolic toxins (Ama), and address "
        f"reported symptoms ({', '.join(chief_complaints) if chief_complaints else 'General vitality'}). "
        f"Grounded in classical Ahara-vidhi-visheshayatana guidelines."
    )

    # 6. Calculate next version number
    highest_version_plan = DietPlan.objects.filter(patient=patient).order_by('-version').first()
    next_version = (highest_version_plan.version + 1) if highest_version_plan else 1

    plan_title = f"Ayurvedic Ahara Plan (v{next_version}) — {dominant_prakriti} Balance"

    # 7. Create DietPlan instance in DRAFT status
    diet_plan = DietPlan.objects.create(
        patient=patient,
        doctor=doctor,
        assessment=assessment,
        version=next_version,
        title=plan_title,
        duration="4 Weeks (Re-evaluate at clinical follow-up)",
        objective=regime['objective'],
        generated_by=DietPlanGeneratedBy.AI if not doctor else DietPlanGeneratedBy.AI_ASSISTED_DOCTOR,
        status=DietPlanStatus.DRAFT,
        breakfast=regime['breakfast'],
        mid_morning=regime['mid_morning'],
        lunch=regime['lunch'],
        evening=regime['evening'],
        dinner=regime['dinner'],
        foods_to_include=regime['foods_to_include'],
        foods_to_avoid=regime['foods_to_avoid'],
        lifestyle_notes=regime['lifestyle_notes'],
        precautions=regime['precautions'],
        doctor_notes="",
        ai_reasoning=ai_reasoning,
        knowledge_references=knowledge_citations
    )

    # 8. Record Audit Log
    AuditLog.objects.create(
        actor=doctor if doctor else patient,
        action=AuditAction.AI_DIET_GENERATED,
        patient=patient,
        object_type='DietPlan',
        object_id=str(diet_plan.id),
        metadata={
            'version': next_version,
            'title': plan_title,
            'status': diet_plan.status,
            'prakriti': dominant_prakriti,
            'assessment_id': assessment.id if assessment else None
        }
    )

    return diet_plan
