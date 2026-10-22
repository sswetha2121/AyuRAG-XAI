import os
import csv
import json
import logging
from django.core.management.base import BaseCommand, CommandError
from clinical.models import FoodItem

logger = logging.getLogger(__name__)

# Common Development Seed Dataset (clearly labeled as DEV_SEED, never claimed to be official IFCT)
DEV_SEED_FOODS = [
    {
        "food_id": "DEV_KHICHDI_01",
        "name": "Classic Moong Dal Khichdi with Ghee",
        "regional_names": {"hindi": "Moong Dal Khichdi", "sanskrit": "Kṛśarā"},
        "category": "cereals_millets",
        "state": "cooked",
        "standard_portion_unit": "katori (bowl)",
        "standard_portion_grams": 200.0,
        "standard_portion_desc": "1 medium katori cooked khichdi",
        "energy_kcal": 210.0,
        "protein_g": 6.8,
        "carbohydrates_g": 36.4,
        "fat_g": 4.2,
        "dietary_fiber_g": 3.1,
        "micronutrients": {"calcium_mg": 28.0, "iron_mg": 1.4, "potassium_mg": 160.0},
        "dietary_tags": ["vegetarian", "gluten_free"],
        "allergens": ["dairy"],
        "dosha_affinity": {"vata": "pacifies", "pitta": "pacifies", "kapha": "neutral_in_moderation"},
        "rasa": ["sweet", "mildly astringent"],
        "preparation_method": "Equal parts aged rice and yellow split moong dal cooked soft with cumin, turmeric, and 1 tsp cow ghee.",
        "data_source": "AyuRAG Development Seed Dataset (Common Indian Foods)",
        "provenance": "Internal Development Seed - Traditional Ayurvedic Tridoshic Regimen (Charaka Samhita Chikitsa 15)",
        "verification_status": "DEV_SEED",
        "is_dev_seed": True
    },
    {
        "food_id": "DEV_UPMA_01",
        "name": "Vegetable Semolina Upma",
        "regional_names": {"hindi": "Sooji Upma", "tamil": "Rava Upma"},
        "category": "cereals_millets",
        "state": "cooked",
        "standard_portion_unit": "katori (bowl)",
        "standard_portion_grams": 160.0,
        "standard_portion_desc": "1 katori cooked vegetable upma",
        "energy_kcal": 192.0,
        "protein_g": 4.5,
        "carbohydrates_g": 32.0,
        "fat_g": 5.2,
        "dietary_fiber_g": 2.4,
        "micronutrients": {"calcium_mg": 18.0, "iron_mg": 1.1},
        "dietary_tags": ["vegetarian", "vegan"],
        "allergens": ["gluten"],
        "dosha_affinity": {"vata": "pacifies", "pitta": "neutral", "kapha": "increases_if_excess"},
        "rasa": ["sweet", "salty"],
        "preparation_method": "Roasted durum semolina cooked with mustard seeds, curry leaves, ginger, carrots, and peas.",
        "data_source": "AyuRAG Development Seed Dataset (Common Indian Foods)",
        "provenance": "Internal Development Seed - Breakfast Clinical Assessment Metric",
        "verification_status": "DEV_SEED",
        "is_dev_seed": True
    },
    {
        "food_id": "DEV_PALAK_SOUP_01",
        "name": "Warm Spiced Spinach Soup",
        "regional_names": {"hindi": "Palak Shorba", "tamil": "Pasalai Keerai Soup"},
        "category": "vegetables",
        "state": "cooked",
        "standard_portion_unit": "cup",
        "standard_portion_grams": 180.0,
        "standard_portion_desc": "1 cup pureed warm spinach soup",
        "energy_kcal": 58.0,
        "protein_g": 3.2,
        "carbohydrates_g": 6.8,
        "fat_g": 1.8,
        "dietary_fiber_g": 2.6,
        "micronutrients": {"calcium_mg": 120.0, "iron_mg": 2.4, "vitamin_a_ug": 450.0},
        "dietary_tags": ["vegetarian", "vegan", "gluten_free", "dairy_free"],
        "allergens": [],
        "dosha_affinity": {"vata": "neutral", "pitta": "pacifies", "kapha": "pacifies"},
        "rasa": ["astringent", "bitter", "sweet"],
        "preparation_method": "Blanched fresh tender spinach simmered with cumin, black pepper, and rock salt.",
        "data_source": "AyuRAG Development Seed Dataset (Common Indian Foods)",
        "provenance": "Internal Development Seed - Light Evening Meal Assessment",
        "verification_status": "DEV_SEED",
        "is_dev_seed": True
    },
    {
        "food_id": "DEV_MASALA_CHAI_01",
        "name": "Ayurvedic Tulsi Ginger Infusion (Caffeine-Free)",
        "regional_names": {"hindi": "Tulsi Adrak Kashayam", "sanskrit": "Tulasi Sunthi Toya"},
        "category": "beverages_digestives",
        "state": "infused",
        "standard_portion_unit": "cup",
        "standard_portion_grams": 150.0,
        "standard_portion_desc": "1 cup strained herbal infusion",
        "energy_kcal": 14.0,
        "protein_g": 0.2,
        "carbohydrates_g": 3.1,
        "fat_g": 0.0,
        "dietary_fiber_g": 0.0,
        "micronutrients": {"potassium_mg": 45.0},
        "dietary_tags": ["vegetarian", "vegan", "gluten_free", "dairy_free"],
        "allergens": [],
        "dosha_affinity": {"vata": "pacifies", "pitta": "neutral_in_moderation", "kapha": "pacifies"},
        "rasa": ["pungent", "bitter"],
        "preparation_method": "Fresh holy basil leaves (Tulsi) and crushed dry ginger simmered in water for 5 mins.",
        "data_source": "AyuRAG Development Seed Dataset (Common Indian Foods)",
        "provenance": "Internal Development Seed - Agni Deepana Beverage",
        "verification_status": "DEV_SEED",
        "is_dev_seed": True
    },
    {
        "food_id": "DEV_ROASTED_CHANA_01",
        "name": "Dry Roasted Bengal Gram (Chana)",
        "regional_names": {"hindi": "Bhuna Chana", "tamil": "Pottu Kadalai"},
        "category": "pulses_legumes",
        "state": "cooked",
        "standard_portion_unit": "handful",
        "standard_portion_grams": 40.0,
        "standard_portion_desc": "1 medium handful (approx. 40g)",
        "energy_kcal": 148.0,
        "protein_g": 7.6,
        "carbohydrates_g": 23.2,
        "fat_g": 2.2,
        "dietary_fiber_g": 5.4,
        "micronutrients": {"iron_mg": 2.1, "calcium_mg": 24.0},
        "dietary_tags": ["vegetarian", "vegan", "gluten_free", "dairy_free"],
        "allergens": [],
        "dosha_affinity": {"vata": "increases_if_excess", "pitta": "pacifies", "kapha": "pacifies"},
        "rasa": ["astringent", "sweet"],
        "preparation_method": "Sand-roasted whole Bengal gram with skin.",
        "data_source": "AyuRAG Development Seed Dataset (Common Indian Foods)",
        "provenance": "Internal Development Seed - High Fiber Snack Metric",
        "verification_status": "DEV_SEED",
        "is_dev_seed": True
    }
]


class Command(BaseCommand):
    help = "Imports, validates, and seeds the Clinical Indian Food Catalogue (IFCT 2017 & Dev Seed)."

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Path to a local CSV or JSON file containing food catalogue entries.'
        )
        parser.add_argument(
            '--seed-verified',
            action='store_true',
            default=False,
            help='Seeds the official ICMR-NIN IFCT 2017 dataset from build_food_catalogue.py.'
        )
        parser.add_argument(
            '--seed-dev',
            action='store_true',
            default=False,
            help='Seeds clearly labelled development-only common Indian foods.'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            default=False,
            help='Clears existing food items before importing (use cautiously).'
        )

    def handle(self, *args, **options):
        file_path = options.get('file')
        seed_verified = options.get('seed_verified')
        seed_dev = options.get('seed_dev')
        clear_first = options.get('clear')

        # If no explicit flags are passed, default to seeding both verified IFCT and dev dataset
        if not file_path and not seed_verified and not seed_dev:
            seed_verified = True
            seed_dev = True

        if clear_first:
            count = FoodItem.objects.count()
            FoodItem.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Cleared {count} existing FoodItem records."))

        imported_count = 0
        updated_count = 0

        # 1. Seed Verified IFCT Records
        if seed_verified:
            from clinical.data.build_food_catalogue import FOOD_CATALOGUE
            self.stdout.write(f"Importing {len(FOOD_CATALOGUE)} verified IFCT 2017 records...")
            for item in FOOD_CATALOGUE:
                created, updated = self._upsert_food_dict(item, is_dev=False)
                if created:
                    imported_count += 1
                elif updated:
                    updated_count += 1

        # 2. Seed Dev Seed Foods
        if seed_dev:
            self.stdout.write(f"Importing {len(DEV_SEED_FOODS)} clearly labelled development seed records...")
            for item in DEV_SEED_FOODS:
                created, updated = self._upsert_food_dict(item, is_dev=True)
                if created:
                    imported_count += 1
                elif updated:
                    updated_count += 1

        # 3. Import from user-provided file (CSV or JSON)
        if file_path:
            if not os.path.exists(file_path):
                raise CommandError(f"Provided dataset file does not exist: {file_path}")

            self.stdout.write(f"Parsing custom dataset from: {file_path}")
            if file_path.lower().endswith('.csv'):
                f_imported, f_updated = self._import_csv(file_path)
            elif file_path.lower().endswith('.json'):
                f_imported, f_updated = self._import_json(file_path)
            else:
                raise CommandError("Unsupported file format. Please provide a .csv or .json file.")
            imported_count += f_imported
            updated_count += f_updated

        # 4. Sync Database to food_catalogue.json cache
        self._sync_to_json_cache()

        total = FoodItem.objects.count()
        self.stdout.write(self.style.SUCCESS(
            f"Successfully synced Food Catalogue: {imported_count} created, {updated_count} updated. "
            f"Total database catalogue items: {total}"
        ))

    def _upsert_food_dict(self, item: dict, is_dev: bool = False):
        food_id = str(item.get("food_id") or "").strip()
        name = str(item.get("name") or "").strip()
        if not food_id or not name:
            return False, False

        category = str(item.get("category") or "cereals_millets").strip().lower()
        # Normalize category to canonical choices
        cat_map = {
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
        canonical_category = cat_map.get(category, "cereals_millets")

        std_portion = item.get("standard_portion") or {}
        portion_grams = item.get("portion_grams") or item.get("standard_portion_grams") or std_portion.get("grams") or 100.0
        portion_unit = item.get("standard_portion_unit") or std_portion.get("unit") or "serving"
        portion_desc = item.get("standard_portion_desc") or std_portion.get("description") or f"{portion_grams}g"

        nut_100g = item.get("nutrients_per_100g") or {}

        def _safe_float(val):
            if val is None or val == "" or str(val).strip().lower() in ["na", "none", "-", "null", "unknown"]:
                return None
            try:
                return float(val)
            except (ValueError, TypeError):
                return None

        energy_kcal = _safe_float(nut_100g.get("energy_kcal") if "energy_kcal" in nut_100g else item.get("energy_kcal", item.get("calories")))
        protein_g = _safe_float(nut_100g.get("protein_g") if "protein_g" in nut_100g else item.get("protein_g", item.get("protein")))
        carbohydrates_g = _safe_float(nut_100g.get("carbohydrates_g") if "carbohydrates_g" in nut_100g else item.get("carbohydrates_g", item.get("carbs")))
        fat_g = _safe_float(nut_100g.get("fat_g") if "fat_g" in nut_100g else item.get("fat_g", item.get("fat")))
        dietary_fiber_g = _safe_float(nut_100g.get("dietary_fiber_g") if "dietary_fiber_g" in nut_100g else item.get("dietary_fiber_g", item.get("fiber")))

        source = item.get("source") or item.get("data_source") or (
            "AyuRAG Development Seed Dataset (Common Indian Foods)" if is_dev else "Indian Food Composition Tables (IFCT 2017, ICMR-NIN)"
        )
        provenance = item.get("provenance") or ("Development Seed Dataset" if is_dev else "ICMR-NIN IFCT 2017")
        verif_status = "DEV_SEED" if is_dev else item.get("verification_status", "VERIFIED")

        obj, created = FoodItem.objects.update_or_create(
            food_id=food_id,
            defaults={
                "name": name,
                "regional_names": item.get("regional_names") or {},
                "category": canonical_category,
                "state": item.get("state") or "cooked",
                "serving_basis": item.get("serving_basis") or "per 100g",
                "standard_portion_unit": portion_unit,
                "standard_portion_grams": float(portion_grams),
                "standard_portion_desc": str(portion_desc),
                "energy_kcal": energy_kcal,
                "protein_g": protein_g,
                "carbohydrates_g": carbohydrates_g,
                "fat_g": fat_g,
                "dietary_fiber_g": dietary_fiber_g,
                "micronutrients": item.get("micronutrients_per_100g") or item.get("micronutrients") or {},
                "dietary_tags": item.get("dietary_tags") or [],
                "allergens": item.get("allergens") or [],
                "dosha_affinity": item.get("dosha_affinity") or {},
                "rasa": item.get("rasa") or [],
                "preparation_method": item.get("preparation_method") or "",
                "data_source": source,
                "provenance": provenance,
                "verification_status": verif_status,
                "is_dev_seed": is_dev or item.get("is_dev_seed", False),
            }
        )
        return created, not created

    def _import_json(self, file_path: str):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            raise CommandError("JSON file must contain an array of food item objects.")

        imported = 0
        updated = 0
        for idx, item in enumerate(data):
            if not isinstance(item, dict):
                continue
            if not item.get("name"):
                self.stdout.write(self.style.WARNING(f"Skipping record #{idx}: missing required 'name' field."))
                continue
            created, was_updated = self._upsert_food_dict(item, is_dev=item.get("is_dev_seed", False))
            if created:
                imported += 1
            elif was_updated:
                updated += 1
        return imported, updated

    def _import_csv(self, file_path: str):
        imported = 0
        updated = 0
        with open(file_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            headers = [h.lower().strip() for h in (reader.fieldnames or [])]
            if "name" not in headers:
                raise CommandError(f"CSV file is missing mandatory 'name' column. Found headers: {headers}")

            for idx, row in enumerate(reader):
                name = row.get("name") or row.get("Name")
                if not name:
                    continue
                food_id = row.get("food_id") or row.get("id") or f"CSV_{idx+1:04d}"
                category = row.get("category") or "cereals_millets"

                item = {
                    "food_id": food_id,
                    "name": name,
                    "category": category,
                    "state": row.get("state", "cooked"),
                    "portion_grams": row.get("portion_grams") or row.get("grams") or 100,
                    "standard_portion_unit": row.get("portion_unit") or "serving",
                    "standard_portion_desc": row.get("portion_desc") or "",
                    "energy_kcal": row.get("energy_kcal") or row.get("calories"),
                    "protein_g": row.get("protein_g") or row.get("protein"),
                    "carbohydrates_g": row.get("carbohydrates_g") or row.get("carbs"),
                    "fat_g": row.get("fat_g") or row.get("fat"),
                    "dietary_fiber_g": row.get("dietary_fiber_g") or row.get("fiber"),
                    "source": row.get("source") or "User Imported Dataset",
                    "provenance": row.get("provenance") or "Local CSV Import",
                    "verification_status": "LOCAL_IMPORT",
                    "is_dev_seed": False
                }
                created, was_updated = self._upsert_food_dict(item, is_dev=False)
                if created:
                    imported += 1
                elif was_updated:
                    updated += 1
        return imported, updated

    def _sync_to_json_cache(self):
        target_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "data",
            "food_catalogue.json"
        )
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        items = [f.to_catalogue_dict() for f in FoodItem.objects.all().order_by("category", "name")]
        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        self.stdout.write(f"Synced {len(items)} items to JSON catalogue cache at {target_path}")
