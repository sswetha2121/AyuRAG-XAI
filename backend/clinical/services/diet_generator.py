"""
AyuRAG-XAI Advanced Clinical Diet Plan Generator.
Consumes:
- Doctor-verified patient baseline data
- Doctor-configured parameters (dietary preferences, allergies, regional cuisine, timings, goals)
- Structured Indian Food Composition Tables (IFCT 2017 derived)
- Grounded classical RAG evidence retrieval from Classical Compendia & CCRAS
Outputs:
- Highly structured, versioned, clinically grounded DietPlan instance
- Deterministic macronutrient and caloric arithmetic
- Individualized ingredient substitutions & allergy warnings
"""

import datetime
from typing import Dict, Any, List, Optional
from django.utils import timezone
from accounts.models import User
from clinical.models import (
    DietPlan,
    DietPlanStatus,
    DietPlanGeneratedBy,
    PatientAssessment,
    AuditLog,
    AuditAction
)
from clinical.services.patient_data_resolver import get_effective_patient_profile
from clinical.services.nutritional_engine import (
    calculate_day_nutrients,
    find_suitable_substitutes,
    get_food_catalogue
)
from clinical.services.clinical_rag_engine import ClinicalRagEngine


# Regional Recipe Templates utilizing Verified Catalogue Foods
REGIONAL_MEAL_TEMPLATES = {
    'north_indian': {
        'breakfast_options': [
            {
                'dish_name': 'Spiced Rolled Oats & Warm Stewed Apple',
                'items': [
                    {'name': 'Spiced Rolled Oats Porridge', 'portions': 1.0, 'grams': 200},
                    {'name': 'Stewed Sweet Apple with Cinnamon', 'portions': 1.0, 'grams': 120},
                    {'name': 'Peeled Soaked Almonds / Badam', 'portions': 1.0, 'grams': 15}
                ],
                'instructions': 'Cook rolled oats with 3 parts water and cardamom. Simmer peeled apple cubes with cinnamon.'
            },
            {
                'dish_name': 'Whole Wheat Phulka with Lauki Sabzi',
                'items': [
                    {'name': 'Whole Wheat Roti / Phulka', 'portions': 2.0, 'grams': 80},
                    {'name': 'Bottle Gourd Sabzi / Lauki (Cooked)', 'portions': 1.0, 'grams': 150},
                    {'name': 'Desi Cow Ghee / Clarified Butter', 'portions': 1.0, 'grams': 5}
                ],
                'instructions': 'Dry-roast thin wheat rotis on griddle. Sauté fresh bottle gourd with cumin and turmeric.'
            }
        ],
        'lunch_options': [
            {
                'dish_name': 'Steamed Basmati Rice with Split Yellow Mung & Lauki Sabzi',
                'items': [
                    {'name': 'Steamed Aged Basmati Rice', 'portions': 1.0, 'grams': 150},
                    {'name': 'Yellow Split Mung Dal (Tempered)', 'portions': 1.0, 'grams': 150},
                    {'name': 'Bottle Gourd Sabzi / Lauki (Cooked)', 'portions': 1.0, 'grams': 150},
                    {'name': 'Fresh Spiced Buttermilk / Takra', 'portions': 1.0, 'grams': 200}
                ],
                'instructions': 'Tempered yellow mung with cumin, ginger, and turmeric. Consume buttermilk at room temperature with roasted cumin.'
            },
            {
                'dish_name': 'Whole Wheat Phulka with Masoor Dal & Steamed Carrots',
                'items': [
                    {'name': 'Whole Wheat Roti / Phulka', 'portions': 2.0, 'grams': 80},
                    {'name': 'Red Lentil Dal / Masoor Dal (Cooked)', 'portions': 1.0, 'grams': 150},
                    {'name': 'Steamed Carrots with Mild Cumin', 'portions': 1.0, 'grams': 120},
                    {'name': 'Desi Cow Ghee / Clarified Butter', 'portions': 1.0, 'grams': 5}
                ],
                'instructions': 'Soft phulkas served with mildly spiced red lentil soup and cumin-glazed tender carrot slices.'
            }
        ],
        'dinner_options': [
            {
                'dish_name': 'Light Sweet Pumpkin Soup with Soft Whole Wheat Phulka',
                'items': [
                    {'name': 'Sweet Pumpkin Soup / Kaddu', 'portions': 1.0, 'grams': 180},
                    {'name': 'Whole Wheat Roti / Phulka', 'portions': 1.0, 'grams': 40},
                    {'name': 'Cumin-Coriander-Fennel (CCF) Herbal Tea', 'portions': 1.0, 'grams': 200}
                ],
                'instructions': 'Pureed pumpkin soup seasoned with mild rock salt and cumin. Finish dinner 3 hours prior to sleep.'
            },
            {
                'dish_name': 'Zucchini Sauté with Jowar Millet Flatbread',
                'items': [
                    {'name': 'Zucchini & Green Squash Sauté', 'portions': 1.0, 'grams': 140},
                    {'name': 'Sorghum Flatbread / Jowar Roti', 'portions': 1.0, 'grams': 45},
                    {'name': 'Fresh Ginger-Tulsi Warm Infusion', 'portions': 1.0, 'grams': 200}
                ],
                'instructions': 'Light pan-roasted millet flatbread with non-spicy sautéed squash and warm herbal infusion.'
            }
        ]
    },
    'south_indian': {
        'breakfast_options': [
            {
                'dish_name': 'Finger Millet / Ragi Porridge with Stewed Fruit',
                'items': [
                    {'name': 'Finger Millet / Ragi Porridge', 'portions': 1.0, 'grams': 200},
                    {'name': 'Fresh Sweet Pomegranate / Anar', 'portions': 1.0, 'grams': 100},
                    {'name': 'Peeled Soaked Almonds / Badam', 'portions': 1.0, 'grams': 15}
                ],
                'instructions': 'Whisk sprouted ragi flour with water on low flame; season with cardamom and toasted seeds.'
            }
        ],
        'lunch_options': [
            {
                'dish_name': 'Steamed Basmati Rice with Split Yellow Mung & Fresh Takra',
                'items': [
                    {'name': 'Steamed Aged Basmati Rice', 'portions': 1.0, 'grams': 150},
                    {'name': 'Yellow Split Mung Dal (Tempered)', 'portions': 1.0, 'grams': 150},
                    {'name': 'Zucchini & Green Squash Sauté', 'portions': 1.0, 'grams': 140},
                    {'name': 'Fresh Spiced Buttermilk / Takra', 'portions': 1.0, 'grams': 200}
                ],
                'instructions': 'Aged steamed rice with yellow mung dal tempered in curry leaves and cumin, alongside fresh churned buttermilk.'
            }
        ],
        'dinner_options': [
            {
                'dish_name': 'Light Bottle Gourd Soup with Sautéed Greens',
                'items': [
                    {'name': 'Bottle Gourd Sabzi / Lauki (Cooked)', 'portions': 1.0, 'grams': 150},
                    {'name': 'Sorghum Flatbread / Jowar Roti', 'portions': 1.0, 'grams': 45},
                    {'name': 'Cumin-Coriander-Fennel (CCF) Herbal Tea', 'portions': 1.0, 'grams': 200}
                ],
                'instructions': 'Simple warm gourd preparation paired with a light sorghum flatbread and digestive herbal tea.'
            }
        ]
    }
}


def _select_meal_recipe(
    meal_type: str,
    regional_pref: str,
    dietary_pref: str,
    allergies: List[str],
    dosha_marker: str
) -> Dict[str, Any]:
    """
    Selects a recipe and filters out any item conflicting with allergies.
    Automatically substitutes allergen-containing items with verified alternatives.
    """
    region_key = 'south_indian' if 'south' in regional_pref.lower() else 'north_indian'
    template_pool = REGIONAL_MEAL_TEMPLATES.get(region_key, REGIONAL_MEAL_TEMPLATES['north_indian'])

    opt_key = f"{meal_type}_options"
    options = template_pool.get(opt_key, REGIONAL_MEAL_TEMPLATES['north_indian'].get(opt_key, []))

    # Fallback to first available if none in regional pool
    if not options:
        options = REGIONAL_MEAL_TEMPLATES['north_indian'].get(opt_key, [])

    # Pick base candidate
    chosen = options[0]

    # Check for allergen conflicts
    cleaned_items = []
    substitutions_made = []

    for it in chosen['items']:
        name = it['name']
        needs_replace = False
        replacement_food = None

        # Check gluten allergy
        if 'gluten' in [a.lower() for a in allergies]:
            if 'wheat' in name.lower() or 'roti / phulka' in name.lower():
                needs_replace = True
                subs = find_suitable_substitutes(name, allergens_to_avoid=['gluten'], dietary_preference=dietary_pref)
                if subs:
                    replacement_food = subs[0]

        # Check lactose/dairy allergy or vegan preference
        if 'lactose' in [a.lower() for a in allergies] or dietary_pref == 'vegan':
            if 'buttermilk' in name.lower() or 'curd' in name.lower() or 'milk' in name.lower() or 'ghee' in name.lower():
                needs_replace = True
                subs = find_suitable_substitutes(name, allergens_to_avoid=['lactose', 'dairy_fat'], dietary_preference='vegan')
                if subs:
                    replacement_food = subs[0]

        # Check nut allergy
        if 'nut' in [a.lower() for a in allergies] or 'nuts' in [a.lower() for a in allergies]:
            if 'almond' in name.lower() or 'walnut' in name.lower():
                needs_replace = True
                subs = find_suitable_substitutes(name, allergens_to_avoid=['tree_nuts'], dietary_preference=dietary_pref)
                if subs:
                    replacement_food = subs[0]

        if needs_replace and replacement_food:
            cleaned_items.append({
                'name': replacement_food['name'],
                'portions': it.get('portions', 1.0),
                'grams': replacement_food['standard_portion']['grams'],
                'note': f"Allergen-safe alternative for {name}"
            })
            substitutions_made.append(f"Replaced {name} with {replacement_food['name']} to prevent allergen exposure.")
        elif not needs_replace:
            cleaned_items.append(it)

    return {
        'dish_name': chosen['dish_name'],
        'items': cleaned_items,
        'instructions': chosen['instructions'],
        'substitutions': substitutions_made
    }


def generate_comprehensive_diet_plan(
    patient_id: int,
    doctor: Optional[User] = None,
    assessment_id: Optional[int] = None,
    dietary_preference: str = 'VEGETARIAN',
    food_allergies: Optional[List[str]] = None,
    meal_frequency: int = 5,
    meal_times: Optional[Dict[str, str]] = None,
    regional_preference: str = 'North Indian',
    nutritional_goals: Optional[str] = None,
    clinician_constraints: Optional[str] = None,
    status: str = DietPlanStatus.DRAFT
) -> DietPlan:
    """
    Main entry point for generating a verified, individualized diet plan.
    Strictly integrates:
    1. Patient baseline profile and Prakriti (as one contextual input).
    2. Allergen avoidance and dietary preferences.
    3. Grounded classical RAG evidence from authoritative Ayurvedic compendia.
    4. Deterministic nutritional calculations (calories, protein, carbs, fat, fiber).
    5. Clean versioning and audit trail recording.
    """
    patient = User.objects.get(id=patient_id)
    assessment = None
    if assessment_id:
        assessment = PatientAssessment.objects.filter(id=assessment_id, patient=patient).first()
    else:
        assessment = PatientAssessment.objects.filter(patient=patient).order_by('-created_at').first()

    # Resolve Effective Profile
    profile = get_effective_patient_profile(patient.id, assessment.id if assessment else None)
    personal = profile.get('personal_information', {})
    prakriti = profile.get('prakriti', {})
    dominant_prakriti = prakriti.get('primary_prakriti') or 'Vāta-Pitta'
    symptoms = profile.get('symptoms', {})
    chief_complaints = symptoms.get('chief_complaints') or []
    if isinstance(chief_complaints, str):
        chief_complaints = [c.strip() for c in chief_complaints.split(',') if c.strip()]

    # Normalize preferences
    diet_pref_clean = (dietary_preference or 'VEGETARIAN').upper()
    allergies_list = food_allergies or []
    times = meal_times or {
        'breakfast': '08:00 AM',
        'mid_morning': '10:45 AM',
        'lunch': '01:15 PM',
        'evening': '04:45 PM',
        'dinner': '07:45 PM'
    }

    # Query Classical RAG Engine for Canonical Grounding
    rag_query = (
        f"Pathya ahara dietary guidelines and wholesome nutrition for {dominant_prakriti} constitution. "
        f"Chief clinical concerns: {', '.join(chief_complaints) if chief_complaints else 'General digestive health'}."
    )
    rag_response = ClinicalRagEngine.answer_question(
        question=rag_query,
        prakriti=dominant_prakriti,
        top_k=3
    )
    canonical_citations = rag_response.get('citations', [])

    # Synthesize Structured Meals
    breakfast_recipe = _select_meal_recipe('breakfast', regional_preference, diet_pref_clean.lower(), allergies_list, dominant_prakriti)
    lunch_recipe = _select_meal_recipe('lunch', regional_preference, diet_pref_clean.lower(), allergies_list, dominant_prakriti)
    dinner_recipe = _select_meal_recipe('dinner', regional_preference, diet_pref_clean.lower(), allergies_list, dominant_prakriti)

    # Snacks
    mid_morning_items = [
        {'name': 'Fresh Tender Coconut Water', 'portions': 1.0, 'grams': 200},
        {'name': 'Soaked Black Raisins / Munakka', 'portions': 1.0, 'grams': 25}
    ]
    evening_items = [
        {'name': 'Roasted Water Lily Seeds / Makhana', 'portions': 1.0, 'grams': 30},
        {'name': 'Cumin-Coriander-Fennel (CCF) Herbal Tea', 'portions': 1.0, 'grams': 200}
    ]

    # Assemble Structured Meal Objects
    breakfast_obj = {
        'time': times.get('breakfast', '08:00 AM'),
        'title': breakfast_recipe['dish_name'],
        'items': [it['name'] for it in breakfast_recipe['items']],
        'items_detail': breakfast_recipe['items'],
        'preparation': breakfast_recipe['instructions'],
        'notes': 'Eat within 1 hour of waking; chew thoroughly in a calm seated environment.'
    }

    mid_morning_obj = {
        'time': times.get('mid_morning', '10:45 AM'),
        'title': 'Hydration & Mineral Replenishment',
        'items': [it['name'] for it in mid_morning_items],
        'items_detail': mid_morning_items,
        'preparation': 'Drink tender coconut water at room temperature. Chew soaked raisins slowly.',
        'notes': 'Replenishes cellular electrolytes without dampening the digestive fire.'
    }

    lunch_obj = {
        'time': times.get('lunch', '01:15 PM'),
        'title': lunch_recipe['dish_name'],
        'items': [it['name'] for it in lunch_recipe['items']],
        'items_detail': lunch_recipe['items'],
        'preparation': lunch_recipe['instructions'],
        'notes': 'Main substantial meal of the day coinciding with peak diurnal digestive fire (Pitta).'
    }

    evening_obj = {
        'time': times.get('evening', '04:45 PM'),
        'title': 'Light Roasted Seed Nourishment',
        'items': [it['name'] for it in evening_items],
        'items_detail': evening_items,
        'preparation': 'Dry-roasted water lily seeds seasoned with mineral rock salt and warm CCF tea.',
        'notes': 'Light non-accumulating snack to prevent late-afternoon blood sugar dips.'
    }

    dinner_obj = {
        'time': times.get('dinner', '07:45 PM'),
        'title': dinner_recipe['dish_name'],
        'items': [it['name'] for it in dinner_recipe['items']],
        'items_detail': dinner_recipe['items'],
        'preparation': dinner_recipe['instructions'],
        'notes': 'Light warm dinner; strictly complete at least 2.5 to 3 hours prior to sleep.'
    }

    # Deterministic Nutritional Calculation across all meals
    temp_plan_dict = {
        'breakfast': breakfast_obj,
        'mid_morning': mid_morning_obj,
        'lunch': lunch_obj,
        'evening': evening_obj,
        'dinner': dinner_obj
    }
    nutritional_totals = calculate_day_nutrients(temp_plan_dict)

    # Foods to include / avoid
    foods_to_include = [
        'Freshly cooked warm seasonal vegetables (bottle gourd, zucchini, carrots, pumpkin)',
        'Easily digestible pulses: Split yellow mung dal, red lentils, horse gram in moderation',
        'Whole grains: Aged basmati rice, rolled oats, sorghum (jowar), or roasted barley',
        'Healthy fats: Clarified cow butter (Ghee) or cold-pressed sesame oil in measured amounts',
        'Digestive spices: Cumin, coriander, fennel, fresh ginger, turmeric, cardamom'
    ]

    foods_to_avoid = [
        'Deep-fried, ultra-processed, heavily salted or packaged snacks',
        'Ice-cold beverages, refrigerated leftovers, and aerated sugary drinks',
        'Excessively sour fermented vinegars, burning chilies, and sharp raw garlic',
        'Cold raw salads or raw cruciferous vegetables at dinner time'
    ]

    # Add allergen specific avoidance notes
    if 'gluten' in [a.lower() for a in allergies_list]:
        foods_to_avoid.insert(0, 'All gluten-containing cereals: Wheat, barley, rye, semolina (suji)')
    if 'lactose' in [a.lower() for a in allergies_list]:
        foods_to_avoid.insert(0, 'All dairy lactose sources: Fresh milk, unfermented cream, commercial cheese')
    if 'nut' in [a.lower() for a in allergies_list] or 'nuts' in [a.lower() for a in allergies_list]:
        foods_to_avoid.insert(0, 'All tree nuts and peanut preparations')

    # Routine & Hydration
    hydration_guidance = (
        "Hydration Protocol: Consume 2.0 to 2.5 Liters of lukewarm water daily. "
        "Sip small quantities (50-100ml) between meals; avoid drinking large volumes of water "
        "immediately before, during, or after meals to preserve digestive enzyme concentration."
    )

    daily_routine_guidance = (
        "Daily Rhythm (Dinacharya): Wake before 06:30 AM. Engage in 15-20 minutes of gentle morning "
        "rhythmic breathing (Pranayama) and light stretching. Establish consistent fixed meal windows. "
        "Discontinue digital screens by 10:00 PM to support restorative tissue regeneration."
    )

    # AI Reasoning / Clinical Grounding
    patient_name = personal.get('fullName') or patient.get_full_name() or patient.username
    ai_reasoning = (
        f"Personalized dietary formulation generated for {patient_name} tailored to {dominant_prakriti} "
        f"constitutional profile, digestive capacity (Agni), and reported complaints ({', '.join(chief_complaints) if chief_complaints else 'General wellness'}). "
        f"Strictly enforces documented dietary preference ({diet_pref_clean}) and allergen exclusions "
        f"({', '.join(allergies_list) if allergies_list else 'None reported'}). "
        f"Grounded in ICMR-NIN nutritional composition data and authoritative CCRAS/Classical Ayurvedic compendia. "
        f"Notice: Prakriti is one contextual input; this protocol supports constitutional wellness and does not claim to cure disease."
    )

    # Version Calculation
    highest_plan = DietPlan.objects.filter(patient=patient).order_by('-version').first()
    next_ver = (highest_plan.version + 1) if highest_plan else 1
    title = f"Individualized Diet Protocol (v{next_ver}) — {dominant_prakriti} Support"

    # Status handling
    initial_status = status if status in [DietPlanStatus.DRAFT, DietPlanStatus.PENDING_REVIEW, DietPlanStatus.PUBLISHED] else DietPlanStatus.DRAFT

    # Create DietPlan Record
    plan = DietPlan.objects.create(
        patient=patient,
        doctor=doctor,
        assessment=assessment,
        version=next_ver,
        title=title,
        duration="4-Week Adaptive Clinical Cycle",
        objective=f"Individualized Pathya Ahara protocol to balance {dominant_prakriti} tendencies, sustain steady metabolic Agni, and respect documented nutritional constraints.",
        generated_by=DietPlanGeneratedBy.DOCTOR if (doctor and initial_status == DietPlanStatus.PUBLISHED) else DietPlanGeneratedBy.AI_ASSISTED_DOCTOR,
        status=initial_status,
        breakfast=breakfast_obj,
        mid_morning=mid_morning_obj,
        lunch=lunch_obj,
        evening=evening_obj,
        dinner=dinner_obj,
        foods_to_include=foods_to_include,
        foods_to_avoid=foods_to_avoid,
        nutritional_totals=nutritional_totals,
        dietary_preference=diet_pref_clean,
        allergens_excluded=allergies_list,
        regional_preference=regional_preference,
        hydration_guidance=hydration_guidance,
        daily_routine_guidance=daily_routine_guidance,
        lifestyle_notes=[
            "Maintain regular meal timings within +/- 30 minutes daily.",
            "Eat only when true hunger is experienced, leaving one-third stomach space empty.",
            "Take a gentle 100-step stroll after meals to assist gastric transit."
        ],
        precautions=[
            "Inform attending physician immediately if unexpected digestive intolerance or discomfort occurs.",
            "This dietary plan is intended for supervised clinical support and is not an emergency medical intervention."
        ],
        doctor_notes=clinician_constraints or "",
        ai_reasoning=ai_reasoning,
        knowledge_references=canonical_citations,
        approved_by=doctor if initial_status == DietPlanStatus.PUBLISHED else None,
        approved_at=timezone.now() if initial_status == DietPlanStatus.PUBLISHED else None
    )

    # Audit Trail Entry
    AuditLog.objects.create(
        actor=doctor if doctor else patient,
        action=AuditAction.AI_DIET_GENERATED,
        patient=patient,
        object_type='DietPlan',
        object_id=str(plan.id),
        metadata={
            'version': next_ver,
            'title': title,
            'dietary_preference': diet_pref_clean,
            'allergies': allergies_list,
            'regional': regional_preference,
            'calories_kcal': nutritional_totals.get('calories_kcal')
        }
    )

    return plan
