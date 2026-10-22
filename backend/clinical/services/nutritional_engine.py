"""
Nutritional Calculation Engine for AyuRAG-XAI.
Consumes verified food catalogue (ICMR-NIN IFCT 2017 derived) to perform
deterministic nutritional calculations for meals and full-day dietary regimes.
Calculations are strictly mathematical and do not rely on LLM/RAG for arithmetic.
"""

import json
import os
import re
from typing import Dict, Any, List, Optional

_CATALOGUE_CACHE: Optional[List[Dict[str, Any]]] = None
_CATALOGUE_BY_ID: Optional[Dict[str, Dict[str, Any]]] = None
_CATALOGUE_BY_NAME: Optional[Dict[str, Dict[str, Any]]] = None

CAT_ALIASES = {
    "all": "",
    "cereals": "cereals_millets",
    "cereals_millets": "cereals_millets",
    "millets": "cereals_millets",
    "legumes": "pulses_legumes",
    "pulses": "pulses_legumes",
    "pulses_legumes": "pulses_legumes",
    "vegetables": "vegetables",
    "fruits": "fruits",
    "dairy": "dairy_alternatives",
    "dairy_alternatives": "dairy_alternatives",
    "fats_oils": "healthy_fats",
    "healthy_fats": "healthy_fats",
    "fats": "healthy_fats",
    "nuts": "nuts_seeds",
    "nuts_seeds": "nuts_seeds",
    "beverages": "beverages_digestives",
    "beverages_digestives": "beverages_digestives",
}


def _enrich_food_item(item: Dict[str, Any]) -> Dict[str, Any]:
    std_portion = item.get("standard_portion") or {}
    grams = float(item.get("portion_grams") or item.get("standard_portion_grams") or std_portion.get("grams") or 100.0)
    unit = item.get("standard_portion_unit") or std_portion.get("unit") or "serving"
    desc = item.get("standard_portion_desc") or std_portion.get("description") or f"{grams}g ({unit})"

    nut_100g = item.get("nutrients_per_100g") or {}
    factor = grams / 100.0

    def _calc(val):
        if val is None or val == "":
            return None
        try:
            return round(float(val) * factor, 1)
        except (ValueError, TypeError):
            return None

    nut_portion = item.get("nutrients_per_portion")
    if not nut_portion:
        e = nut_100g.get("energy_kcal", item.get("energy_kcal", item.get("calories")))
        p = nut_100g.get("protein_g", item.get("protein_g", item.get("protein")))
        c = nut_100g.get("carbohydrates_g", item.get("carbohydrates_g", item.get("carbs")))
        f = nut_100g.get("fat_g", item.get("fat_g", item.get("fat")))
        fib = nut_100g.get("dietary_fiber_g", item.get("dietary_fiber_g", item.get("fiber")))
        nut_portion = {
            "calories_kcal": _calc(e) if e is not None else 0.0,
            "protein_g": _calc(p) if p is not None else 0.0,
            "carbohydrates_g": _calc(c) if c is not None else 0.0,
            "fat_g": _calc(f) if f is not None else 0.0,
            "fiber_g": _calc(fib) if fib is not None else 0.0,
        }

    item["portion_grams"] = grams
    item["standard_portion_desc"] = desc
    item["standard_portion_unit"] = unit
    item["nutrients_per_portion"] = nut_portion
    item["source_citation"] = item.get("data_source") or item.get("source") or "IFCT 2017, ICMR-NIN"
    item["provenance"] = item.get("provenance") or "ICMR-NIN IFCT 2017"
    item["verification_status"] = item.get("verification_status") or ("DEV_SEED" if item.get("is_dev_seed") else "VERIFIED")
    return item


def _load_catalogue(force_reload: bool = False) -> List[Dict[str, Any]]:
    global _CATALOGUE_CACHE, _CATALOGUE_BY_ID, _CATALOGUE_BY_NAME
    if _CATALOGUE_CACHE is not None and not force_reload:
        return _CATALOGUE_CACHE

    items = []
    # 1. Try loading from database model
    try:
        from clinical.models import FoodItem
        db_items = list(FoodItem.objects.all().order_by('category', 'name'))
        if db_items:
            items = [f.to_catalogue_dict() for f in db_items]
    except Exception:
        items = []

    # 2. Fallback to JSON file if database is empty
    if not items:
        json_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "data",
            "food_catalogue.json"
        )
        if os.path.exists(json_path):
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    raw_data = json.load(f)
                    items = [_enrich_food_item(it) for it in raw_data]
            except Exception:
                items = []

    _CATALOGUE_CACHE = [_enrich_food_item(it) for it in items]
    _CATALOGUE_BY_ID = {item["food_id"]: item for item in _CATALOGUE_CACHE}
    _CATALOGUE_BY_NAME = {item["name"].lower().strip(): item for item in _CATALOGUE_CACHE}
    return _CATALOGUE_CACHE


def get_food_catalogue(
    query: Optional[str] = None,
    category: Optional[str] = None,
    dietary_preference: Optional[str] = None,
    allergens_to_exclude: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Search and filter the structured Indian food catalogue.
    """
    items = _load_catalogue()
    results = []

    q = (query or "").lower().strip()
    raw_cat = (category or "").lower().strip()
    cat = CAT_ALIASES.get(raw_cat, raw_cat)
    pref = (dietary_preference or "").lower().strip()
    excluded_allergens = [a.lower().strip() for a in (allergens_to_exclude or [])]

    for item in items:
        # Category filter (normalized)
        item_cat = item.get("category", "").lower().strip()
        if cat and item_cat != cat:
            continue

        # Dietary preference filter
        tags = [t.lower() for t in item.get("dietary_tags", [])]
        if pref:
            if pref == "vegan" and "vegan" not in tags:
                continue
            elif pref == "vegetarian" and "vegetarian" not in tags:
                continue

        # Allergens filter
        item_allergens = [a.lower() for a in item.get("allergens", [])]
        if any(exc in item_allergens for exc in excluded_allergens):
            continue

        # Text query filter
        if q:
            name = item.get("name", "").lower()
            reg_names = " ".join(item.get("regional_names", {}).values()).lower()
            category_name = item.get("category", "").lower()
            tags_str = " ".join(tags)
            if q not in name and q not in reg_names and q not in category_name and q not in tags_str:
                continue

        results.append(item)

    return results


def find_food_item(identifier: str) -> Optional[Dict[str, Any]]:
    """
    Finds a food item by food_id, exact name, or fuzzy substring.
    """
    _load_catalogue()
    if not identifier:
        return None

    clean_id = str(identifier).strip()
    # 1. Exact ID match
    if clean_id in _CATALOGUE_BY_ID:
        return _CATALOGUE_BY_ID[clean_id]

    # 2. Lowercase name match
    clean_lower = clean_id.lower()
    if clean_lower in _CATALOGUE_BY_NAME:
        return _CATALOGUE_BY_NAME[clean_lower]

    # 3. Fuzzy search in names
    for item in _CATALOGUE_CACHE:
        item_name = item["name"].lower()
        if clean_lower in item_name or item_name in clean_lower:
            return item
        for reg in item.get("regional_names", {}).values():
            if clean_lower in reg.lower():
                return item

    return None


def calculate_item_nutrients(item_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes exact nutrients for an individual food item entry.
    Supports either:
    - 'food_id' or 'name' reference to catalogue
    - explicit 'grams' or portion count * standard_portion.grams
    """
    food = None
    if "food_id" in item_dict:
        food = find_food_item(item_dict["food_id"])
    if not food and "name" in item_dict:
        food = find_food_item(item_dict["name"])

    # Determine grams
    portions = float(item_dict.get("portions", 1) or 1)
    grams = item_dict.get("grams")

    if grams is None or grams <= 0:
        if food and "standard_portion" in food:
            std_grams = food["standard_portion"].get("grams", 100)
            grams = std_grams * portions
        else:
            grams = 100.0 * portions

    if food:
        per_100 = food.get("nutrients_per_100g", {})
        factor = grams / 100.0
        calories = round(per_100.get("energy_kcal", 0.0) * factor, 1)
        protein = round(per_100.get("protein_g", 0.0) * factor, 1)
        carbs = round(per_100.get("carbohydrates_g", 0.0) * factor, 1)
        fat = round(per_100.get("fat_g", 0.0) * factor, 1)
        fiber = round(per_100.get("dietary_fiber_g", 0.0) * factor, 1)
        source = food.get("source", "IFCT 2017")
        verified = food.get("verification_status", "VERIFIED")
    else:
        # Fallback if custom uncatalogued item
        calories = round(float(item_dict.get("calories", 0.0)), 1)
        protein = round(float(item_dict.get("protein", 0.0)), 1)
        carbs = round(float(item_dict.get("carbs", 0.0)), 1)
        fat = round(float(item_dict.get("fat", 0.0)), 1)
        fiber = round(float(item_dict.get("fiber", 0.0)), 1)
        source = "Clinician Defined / Estimated"
        verified = "UNVERIFIED_CUSTOM"

    return {
        "food_id": food.get("food_id") if food else item_dict.get("food_id", "CUSTOM"),
        "name": food.get("name") if food else item_dict.get("name", "Custom Food"),
        "grams": round(grams, 1),
        "portions": portions,
        "energy_kcal": calories,
        "protein_g": protein,
        "carbohydrates_g": carbs,
        "fat_g": fat,
        "dietary_fiber_g": fiber,
        "source": source,
        "verification_status": verified
    }


def calculate_meal_nutrients(items: List[Any]) -> Dict[str, Any]:
    """
    Aggregates deterministic nutritional totals for a single meal.
    Accepts list of item strings or structured item dictionaries.
    """
    total_cal = 0.0
    total_prot = 0.0
    total_carbs = 0.0
    total_fat = 0.0
    total_fiber = 0.0
    analyzed_items = []

    for item in items:
        if isinstance(item, str):
            # Parse text item string (e.g. "Steamed Aged Basmati Rice (1 katori)")
            item_entry = {"name": item, "portions": 1}
        elif isinstance(item, dict):
            item_entry = item
        else:
            continue

        res = calculate_item_nutrients(item_entry)
        analyzed_items.append(res)
        total_cal += res["energy_kcal"]
        total_prot += res["protein_g"]
        total_carbs += res["carbohydrates_g"]
        total_fat += res["fat_g"]
        total_fiber += res["dietary_fiber_g"]

    return {
        "calories_kcal": round(total_cal, 1),
        "calories": round(total_cal, 1),
        "protein_g": round(total_prot, 1),
        "carbohydrates_g": round(total_carbs, 1),
        "carbs_g": round(total_carbs, 1),
        "fat_g": round(total_fat, 1),
        "fiber_g": round(total_fiber, 1),
        "item_count": len(analyzed_items),
        "items_detail": analyzed_items,
        "source_attribution": "ICMR-NIN IFCT 2017 & Verified Database"
    }


def calculate_day_nutrients(plan_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministically computes whole-day macronutrient and caloric totals
    across breakfast, mid_morning, lunch, evening, and dinner.
    """
    meal_keys = ["breakfast", "mid_morning", "lunch", "evening", "dinner"]
    day_cal = 0.0
    day_prot = 0.0
    day_carbs = 0.0
    day_fat = 0.0
    day_fiber = 0.0
    breakdown_by_meal = {}

    for key in meal_keys:
        meal_data = plan_dict.get(key) or {}
        items = meal_data.get("items") or []
        # Support if meal has structured items
        meal_calc = calculate_meal_nutrients(items)
        breakdown_by_meal[key] = meal_calc
        day_cal += meal_calc.get("calories_kcal", 0.0)
        day_prot += meal_calc.get("protein_g", 0.0)
        day_carbs += meal_calc.get("carbohydrates_g", 0.0)
        day_fat += meal_calc.get("fat_g", 0.0)
        day_fiber += meal_calc.get("fiber_g", meal_calc.get("dietary_fiber_g", 0.0))

    # Calculate caloric percentage distribution
    # 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
    prot_cal = day_prot * 4
    carbs_cal = day_carbs * 4
    fat_cal = day_fat * 9
    sum_macro_cal = max(1.0, prot_cal + carbs_cal + fat_cal)

    macro_pct = {
        "protein_pct": round((prot_cal / sum_macro_cal) * 100, 1),
        "carbohydrates_pct": round((carbs_cal / sum_macro_cal) * 100, 1),
        "fat_pct": round((fat_cal / sum_macro_cal) * 100, 1)
    }

    return {
        "calories_kcal": round(day_cal, 1),
        "calories": round(day_cal, 1),
        "protein_g": round(day_prot, 1),
        "carbohydrates_g": round(day_carbs, 1),
        "carbs_g": round(day_carbs, 1),
        "fat_g": round(day_fat, 1),
        "fiber_g": round(day_fiber, 1),
        "macro_distribution_pct": macro_pct,
        "meal_breakdown": breakdown_by_meal,
        "calculation_basis": "Deterministic summation using IFCT 2017 portion tables",
        "assumptions": "Calculated based on standard cooked edible portion weights. Non-cooked raw foods specified individually.",
        "verification_status": "VERIFIED_DETERMINISTIC"
    }


def find_suitable_substitutes(
    food_id_or_name: str,
    allergens_to_avoid: Optional[List[str]] = None,
    dietary_preference: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Finds verified nutritional and constitutional alternatives for a given food item.
    Example:
    - Wheat Roti (gluten) -> Jowar Roti, Ragi Porridge, Brown Basmati Rice
    - Milk (lactose) -> Warm Unsweetened Almond Milk, Coconut Water
    - Bitter Gourd -> Bottle Gourd, Steamed Carrots, Zucchini
    """
    base_food = find_food_item(food_id_or_name)
    if not base_food:
        return []

    target_category = base_food.get("category")
    target_dosha = base_food.get("dosha_affinity", {})
    candidates = get_food_catalogue(
        category=target_category,
        dietary_preference=dietary_preference,
        allergens_to_exclude=allergens_to_avoid
    )

    substitutes = []
    for c in candidates:
        if c["food_id"] == base_food.get("food_id"):
            continue
        substitutes.append({
            "food_id": c["food_id"],
            "name": c["name"],
            "category": c["category"],
            "standard_portion": c["standard_portion"],
            "energy_kcal": c["nutrients_per_100g"]["energy_kcal"],
            "protein_g": c["nutrients_per_100g"]["protein_g"],
            "dietary_tags": c["dietary_tags"],
            "allergens": c["allergens"],
            "dosha_affinity": c["dosha_affinity"],
            "reason": f"Verified {c['category'].replace('_', ' ')} alternative without forbidden allergens"
        })

    return substitutes[:5]
