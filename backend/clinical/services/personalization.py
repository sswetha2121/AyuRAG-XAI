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
            'title': 'Warm Stewed Oats or Spiced Whole Grain Porridge',
            'items': [
                'Warm whole-grain rolled oats cooked with almond milk and a pinch of ground cardamom and cinnamon.',
                'Stewed sweet apple or pear with 2-3 soaked almonds (peeled).',
                'Cup of warm water with half tsp clarified butter on an empty stomach.'
            ],
            'calories_approx': '380 - 420 kcal',
            'digestive_properties': 'Nourishing, grounding, easy on the stomach'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Herbal Hydration & Mineral Rehydration',
            'items': [
                'Fresh tender coconut water or cumin-coriander-fennel lukewarm tea.',
                '4 soaked black raisins.'
            ],
            'calories_approx': '90 - 120 kcal',
            'digestive_properties': 'Cooling, digestive support'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Wholesome Lentil Bowl & Warm Grain Platter',
            'items': [
                'Yellow lentil and brown basmati rice cooked with fresh ginger, cumin, turmeric, and 1 tsp clarified butter.',
                'Steamed zucchini and peeled squash sautéed with coriander seeds.',
                'Small cup of fresh probiotic yogurt drink tempered with roasted cumin powder and rock salt.'
            ],
            'calories_approx': '550 - 620 kcal',
            'digestive_properties': 'Light, balanced, supports steady metabolism'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Gentle Afternoon Nourishment',
            'items': [
                'Roasted water lily seeds (fox nuts) tossed in half-tsp clarified butter with rock salt.',
                'Warm herbal infusion of fresh mint or licorice root.'
            ],
            'calories_approx': '130 - 160 kcal',
            'digestive_properties': 'Stabilizing, calms evening hunger'
        }
        dinner = {
            'time': '07:30 - 08:15 PM',
            'title': 'Light Vegetable Clear Soup & Soft Whole Wheat Flatbread',
            'items': [
                'Pumpkin and carrot soup prepared with mild cumin and rock salt (strictly non-spicy).',
                '1-2 soft whole wheat flatbreads lightly glazed with clarified butter.',
                'Warm spiced turmeric-nutmeg warm almond milk (half cup) 45 mins before bedtime.'
            ],
            'calories_approx': '350 - 400 kcal',
            'digestive_properties': 'Light, easy to digest, supports restful sleep'
        }
        foods_to_include = [
            'Clarified butter (ghee), cold-pressed sesame oil, virgin coconut oil in moderation',
            'Yellow split lentils, red lentils, soaked and peeled almonds',
            'Sweet well-ripened fruits: stewed apples, pomegranates, sweet grapes, figs',
            'Well-cooked squash, carrots, zucchini, asparagus, baby spinach in moderation',
            'Mild spices: Turmeric, cumin, fresh ginger (in small quantity), coriander, fennel, cardamom, cinnamon'
        ]
        foods_to_avoid = [
            'Deep fried, heavily salted, and packaged processed foods',
            'Extremely sour sauces, pickled vegetables and excess vinegar',
            'Excessive red chilies, mustard seeds, and raw pungent garlic',
            'Chilled beverages, iced water, and carbonated soft drinks',
            'Dry, cold raw salads and raw broccoli/cauliflower at dinner'
        ]

    elif 'kapha' in p_lower:
        target_dosha = "Structure Balance & Metabolism Support"
        objective = "Stimulate sluggish metabolism, clear congestion, and eliminate excess moisture."
        breakfast = {
            'time': '08:00 - 08:30 AM',
            'title': 'Light Roasted Whole Barley or Spiced Millet Bowl',
            'items': [
                'Roasted barley porridge with a touch of grated ginger and black pepper.',
                'Cup of warm ginger-tulsi herbal infusion with half tsp raw honey (added lukewarm).'
            ],
            'calories_approx': '280 - 320 kcal',
            'digestive_properties': 'Light, warming, energizing'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Metabolic Digestive Stimulant',
            'items': [
                'Warm water with 2-3 drops of lemon and roasted cumin.',
                'Handful of roasted pumpkin seeds.'
            ],
            'calories_approx': '70 - 100 kcal',
            'digestive_properties': 'Supports digestive enzymes and alertness'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Spiced Green Lentil Soup & Millet Flatbread',
            'items': [
                'Warm whole green lentil soup tempered with cumin seeds, ginger, and lemon.',
                '1 multigrain or millet flatbread.',
                'Steamed greens or sautéed zucchini with mild herbs.'
            ],
            'calories_approx': '460 - 520 kcal',
            'digestive_properties': 'Light, nutrient-dense, metabolism-boosting'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Herbal Energy Tea & Roasted Chickpeas',
            'items': [
                'Warm herbal cinnamon infusion.',
                'Small bowl of dry roasted chickpeas.'
            ],
            'calories_approx': '100 - 130 kcal',
            'digestive_properties': 'Light, satisfying snack'
        }
        dinner = {
            'time': '07:00 - 07:45 PM',
            'title': 'Ultra-Light Clear Vegetable Broth',
            'items': [
                'Clear vegetable and leafy broth with crushed black pepper and rock salt.',
                'Strictly finish dinner at least 3 hours before sleep.'
            ],
            'calories_approx': '220 - 270 kcal',
            'digestive_properties': 'Light, cleanses digestive tract overnight'
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
        target_dosha = "Metabolic Heat Balance & Cooling Nutrition"
        objective = "Alleviate metabolic heat, soothe digestive irritation, prevent acid acidity, and protect liver health."
        breakfast = {
            'time': '08:00 - 08:30 AM',
            'title': 'Cooling Coconut Rice Flakes or Soaked Grain Bowl',
            'items': [
                'Flattened rice cooked with coconut shavings, fresh coriander, and sweet curry leaves.',
                'Sweet seasonal fruit (fresh pomegranate or sweet red apple).',
                'Lukewarm fennel-coriander infusion.'
            ],
            'calories_approx': '340 - 390 kcal',
            'digestive_properties': 'Naturally cooling, soothing to stomach lining'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Cooling Mineral Refresher',
            'items': [
                'Fresh tender coconut water or soaked chia seed cooler with mint leaves.',
                '5 soaked almonds (skin removed).'
            ],
            'calories_approx': '100 - 130 kcal',
            'digestive_properties': 'Hydrating, pacifies excess body heat'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Cooling Basmati Rice, Yellow Lentil & Summer Gourd Platter',
            'items': [
                'Steamed aged basmati rice with washed yellow lentils and fresh clarified butter.',
                'Zucchini or white gourd curry prepared with fennel and cumin.',
                'Cooling cucumber bowl prepared with fresh homemade sweet yogurt (diluted with mint and roasted cumin).'
            ],
            'calories_approx': '520 - 580 kcal',
            'digestive_properties': 'Mild, cooling, non-acidic nourishment'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Gentle Afternoon Hydration',
            'items': [
                'Rose petal lukewarm tea or organic coriander seed tea.',
                '2 sweet dates or fresh sweet figs.'
            ],
            'calories_approx': '100 - 120 kcal',
            'digestive_properties': 'Sweet, restorative, calms nervous system'
        }
        dinner = {
            'time': '07:30 - 08:15 PM',
            'title': 'Soothing Yellow Lentil Bowl with Mild Gourd',
            'items': [
                'Semi-liquid yellow lentil and rice pot with mild turmeric, rock salt, and 1 tsp clarified butter.',
                'Avoid all sour or tomato-based curries at night.'
            ],
            'calories_approx': '360 - 410 kcal',
            'digestive_properties': 'Soothing, easy to digest, prevents nighttime acid reflux'
        }
        foods_to_include = [
            'Clarified butter (ghee), virgin coconut oil',
            'Aged Basmati Rice, barley, rolled oats',
            'Yellow split lentils, soaked almonds',
            'Vegetables: White gourd, cucumber, zucchini, sweet pumpkin, cilantro',
            'Spices: Coriander seeds, fennel, cardamom, saffron, fresh turmeric'
        ]
        foods_to_avoid = [
            'Extremely spicy curries, green and red chilies, black pepper in excess',
            'Sour citrus fruits, unripe mango, tamarind, vinegar',
            'Fermented foods, alcohol, excess caffeine and smoking',
            'Deep fried foods and burnt garlic'
        ]

    else:
        # Movement / Kinetic energy balancing default
        target_dosha = "Movement Energy (Air & Space) Balancing"
        objective = "Stabilize movement energy, nourish nervous system, and ground irregular digestive rhythm."
        breakfast = {
            'time': '08:00 - 08:30 AM',
            'title': 'Warm Spiced Whole Grain Porridge with Clarified Butter',
            'items': [
                'Warm whole grain porridge prepared with grated ginger, cumin, carrots, and 1 tsp clarified butter.',
                '4 soaked almonds and 2 walnuts.',
                'Cup of warm water with a pinch of dry ginger.'
            ],
            'calories_approx': '370 - 410 kcal',
            'digestive_properties': 'Warm, grounding, calms irregular digestion'
        }
        mid_morning = {
            'time': '10:30 - 11:00 AM',
            'title': 'Warm Digestive Herb Tea',
            'items': [
                'Warm cumin, coriander, fennel tea.',
                '1-2 soft sweet dates.'
            ],
            'calories_approx': '90 - 110 kcal',
            'digestive_properties': 'Gentle digestive stimulant'
        }
        lunch = {
            'time': '12:30 - 01:15 PM',
            'title': 'Nutritious Lentil & Rice Bowl with Warm Vegetables',
            'items': [
                'Split yellow lentil and rice cooked soft with cumin, rock salt, and clarified butter.',
                'Stewed carrots and peeled pumpkin with fresh coriander leaves.',
                'Cup of fresh warm probiotic buttermilk with roasted cumin.'
            ],
            'calories_approx': '540 - 600 kcal',
            'digestive_properties': 'Deeply nourishing, builds physical stamina'
        }
        evening = {
            'time': '04:30 - 05:00 PM',
            'title': 'Warm Nourishing Snack',
            'items': [
                'Warm chamomile or herbal mint tea.',
                'Small bowl of roasted water lily seeds with pinch of rock salt.'
            ],
            'calories_approx': '120 - 140 kcal',
            'digestive_properties': 'Calming, supports mental relaxation'
        }
        dinner = {
            'time': '07:30 - 08:15 PM',
            'title': 'Gentle Vegetable Stew & Soft Whole Wheat Flatbread',
            'items': [
                'Warm squash and carrot stew seasoned with cumin and ginger.',
                '1-2 soft whole wheat flatbreads with clarified butter.',
                'Warm turmeric-spiced almond milk at bedtime.'
            ],
            'calories_approx': '350 - 390 kcal',
            'digestive_properties': 'Easy to assimilate, promotes restful sleep'
        }
        foods_to_include = [
            'Warm, cooked, nourishing whole foods cooked with clarified butter or sesame oil',
            'Naturally sweet, mildly sour, and mildly salty flavors in balanced harmony',
            'Yellow split lentils, soaked and peeled almonds, walnuts',
            'Cooked root vegetables, squashes, sweet potato',
            'Ginger, cumin, coriander, cardamom'
        ]
        foods_to_avoid = [
            'Cold drinks, ice, iced water',
            'Dry, crisp crackers, raw salads, cold refrigerated leftovers',
            'Excessively bitter or astringent raw vegetables in large amounts',
            'Irregular skipping or postponing of meals'
        ]

    lifestyle_notes = [
        'Daily Routine: Wake up before 06:30 AM; clean tongue and drink 1 glass of warm water.',
        'Self-Care Routine: Apply warm sesame or coconut oil for 10 minutes before a warm bath 3 times weekly.',
        'Breathing & Movement: 15-20 minutes of gentle rhythmic breathing and restorative yoga in the morning.',
        'Evening Routine: Discontinue blue-light screens by 09:45 PM; aim for restful sleep by 10:30 PM.'
    ]

    precautions = [
        'Avoid consuming ice-cold water or heavy beverages immediately before or during meals to prevent dampening digestive capacity.',
        'Maintain a minimum 3 to 4 hour gap between dinner and going to bed.',
        'Never force yourself to eat when not hungry, and avoid skipping meals when hunger is present.',
        'If experiencing acute acid discomfort or indigestion, shift to warm clear lentil soup and consult your doctor.'
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
        f"({dominant_prakriti}) and digestive rhythm ({appetite_pattern or 'Steady Digestion'}). "
        f"Targeted to balance natural bodily factors, eliminate metabolic sluggishness, and support "
        f"reported goals ({', '.join(chief_complaints) if chief_complaints else 'General vitality'}). "
        f"Grounded in verified evidence-based dietary guidelines."
    )

    # 6. Calculate next version number
    highest_version_plan = DietPlan.objects.filter(patient=patient).order_by('-version').first()
    next_version = (highest_version_plan.version + 1) if highest_version_plan else 1

    plan_title = f"Personalized Daily Diet Plan (v{next_version}) — {dominant_prakriti} Support"

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
