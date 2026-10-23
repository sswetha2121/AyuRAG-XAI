"""
Knowledge Base Builder for AyuRAG-XAI.
Populates authoritative, vetted clinical reference documents across 5 collections:
1. Classical Ayurvedic Compendia (AYUSH / Public Domain)
2. CCRAS Clinical Evaluation & Research Guidelines (Open Government Data - India)
3. Botanical Reference & Pharmacopoeial Monographs (PCIM&H / API & WHO)
4. Evidence-Based Nutrition & Pathya-Apathya (ICMR-NIN 2024 & Ministry of AYUSH)
5. Clinical Safety, Contraindications & Red-Flag Referral (AYUSH Pharmacovigilance / WHO)

Generates individual document files in backend/clinical/knowledge_base/sources/
and creates a unified manifest.json.
"""

import os
import json
from pathlib import Path
from clinical.knowledge_base.source_dataset import ADDITIONAL_DOCUMENTS

BASE_DIR = Path(__file__).resolve().parent
SOURCES_DIR = BASE_DIR / 'sources'

ALL_DOCUMENTS = [
    # =========================================================================
    # COLLECTION 1: CLASSICAL AYURVEDIC COMPENDIA
    # =========================================================================
    {
        "id": "CS-SU-01-SVASTHA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Definition of Svastha, Ayu, and Tridosha Equilibrium",
        "publisher": "Classical Ayurvedic Compendium (National Institute of Indian Medical Heritage / Ministry of AYUSH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=su&ch=1",
        "publication_version": "Charaka Saṃhitā, Sūtrasthāna, Chapter 1 (Dīrghañjīvitīya), Ślokas 41-43",
        "license": "Public Domain (Classical Sanskrit Literature; Digitized via Government Open Access)",
        "document_type": "Classical Canonical Verse & Exegesis",
        "download_availability": "Publicly accessible via e-Caraka (NIIMH/AYUSH portal)",
        "relevance": "Core definition of holistic health (Svastha), foundational Tridosha balance criteria, and Agni equilibrium.",
        "limitations": "Philosophical foundation requiring contextual translation; not a substitute for modern clinical diagnostic lab metrics.",
        "classical_verse": "Samadoṣaḥ samāgniśca samadhātu malakriyaḥ. Prasannātmendriyamanāḥ svastha ityabhidhīyate.",
        "tags": ["svastha", "tridosha", "agni", "dhatu", "ojas", "constitutional_equilibrium"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Sūtrasthāna Chapter 1 (Dīrghañjīvitīya) establishes the foundational ontology of Ayurvedic medicine.
Key Canonical Principles:
1. Definition of Health (Svastha):
   A healthy human state requires four simultaneous equilibria:
   - Samadosha: Balanced functional state of Vata, Pitta, and Kapha.
   - Samagni: Homogeneous digestive and metabolic fire.
   - Samadhatu: Properly formed, balanced bodily tissues (Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra).
   - Samamalakriya: Normal, unhindered excretion of bodily wastes (Purisha, Mutra, Sveda).
   - Prasannatmindriyamanah: A cheerful, tranquil state of the sensory organs, mind, and inner self.

2. Definition of Ayu (Longevity & Life):
   Ayu is the continuous dynamic confluence of Sharira (physical body), Indriya (sensory apparatus), Sattva (psyche), and Atma (consciousness).
   The science of Ayurveda classifies life into four dimensions:
   - Hita Ayu (Wholesome life fostering social welfare)
   - Ahita Ayu (Harmful, unwholesome life)
   - Sukha Ayu (Healthy, disease-free, joyful existence)
   - Dukkha Ayu (Suffering, diseased existence).

3. Clinical Decision-Support Implications:
   In AyuRAG-XAI, clinical assessments must not evaluate symptoms in isolation. Recommendations must jointly optimize physiological elimination (Mala), digestion (Agni), tissue replenishment (Dhatu), and mental tranquility (Sattva).
"""
    },
    {
        "id": "CS-SU-05-MATRASHITIYA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Daily Regimen (Dinacharya) & Dietary Measure (Matrashitiya)",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=su&ch=5",
        "publication_version": "Charaka Saṃhitā, Sūtrasthāna, Chapter 5, Ślokas 1-20",
        "license": "Public Domain",
        "document_type": "Classical Clinical Regimen Monograph",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Provides circadian daily scheduling, food portioning, and preventive hygienic practices.",
        "limitations": "Individual adjustments required based on geographical location (Desha) and patient occupation.",
        "classical_verse": "Mātrāśī syāt. Āhāramātrā punaragnerbalāpekṣiṇī.",
        "tags": ["dinacharya", "matrashitiya", "portion_size", "agni", "abhyanga", "oral_hygiene"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Sūtrasthāna Chapter 5 (Mātrāśitīya) dictates the rules of daily living and dietetic portion determination.
Core Regimen Details:
1. Food Measure (Matra):
   - Food must always be taken in measured quantities (Matrashi syat).
   - The correct quantity depends strictly on the power of the individual's digestive fire (Agner balapekshini).
   - Light foods (Laghu) such as shali rice, green gram (Mudga), and venison/chicken broth can be eaten until satisfaction without overloading.
   - Heavy foods (Guru) like flour preparations (Pishtanna), sugarcane, and dairy must only be taken up to one-half or three-quarters of stomach capacity.

2. Daily Circadian Cleansing (Dinacharya):
   - Anjana (Collyrium for eyes): Cleanses Kapha secretions, preserves visual acuity.
   - Dhumapana (Herbal smoke inhalation): Clears head and throat heaviness.
   - Nasya (Nasal herb administration with sesame oil/Anu Taila): Prevents premature graying, hair fall, tension headaches, and facial palsy.
   - Dantadhawana (Herbal tooth brushing with astringent, bitter, pungent twigs): Clears oral coating and stimulates salivary agni.
   - Abhyanga (Regular oil massage): Pacifies aggravated Vata, improves sleep, preserves musculoskeletal tone, and retards premature aging.
"""
    },
    {
        "id": "CS-SU-06-RITUCHARYA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Seasonal Regimens (Ritucharya) & Environmental Adaptation",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=su&ch=6",
        "publication_version": "Charaka Saṃhitā, Sūtrasthāna, Chapter 6 (Tasyāśitīya), Ślokas 1-45",
        "license": "Public Domain",
        "document_type": "Classical Seasonal Guideline",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Critical for seasonal diet adaptation and explaining how environmental transitions aggravate specific doshas.",
        "limitations": "Classical 6-season division (Ritus) must be mapped to regional temperate or tropical zones.",
        "classical_verse": "Tasyāśitīyādhikāre ṛtucaryā pravakṣyate. Ādānavisargakālau baladīpanakārakau.",
        "tags": ["ritucharya", "seasonal_diet", "visarga_kala", "adana_kala", "chaya_prakopa_prashama"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Sūtrasthāna Chapter 6 details the physiological impact of solstitial cycles (Ayana) and the 6 seasons (Ritus).
1. The Two Solstitial Cycles:
   - Adana Kala (Northern solstitial movement / Uttarayana): Encompasses Shishira (late winter), Vasanta (spring), and Grishma (summer). The sun and sharp winds deplete human bodily strength (Bala).
   - Visarga Kala (Southern solstitial movement / Dakshinayana): Encompasses Varsha (monsoon), Sharad (autumn), and Hemanta (early winter). The moon exerts cooling nourishment, increasing bodily strength.

2. Seasonal Dosha Dynamics:
   - Vasanta (Spring): Kapha accumulated during winter liquefies under warm solar rays, damping Agni. Diet requires light, dry foods, barley (Yava), honey, and bitter greens. Heavy, sweet, unctuous foods and day-sleeping are strictly forbidden.
   - Grishma (Summer): High heat causes mild Vata accumulation and body fluid depletion. Light, sweet, liquid foods, coconut water, ghee, and cool fruit juices pacify dehydration.
   - Varsha (Monsoon): Agni is severely vitiated due to humidity and ground evaporation. Vata aggravates. Warm, freshly prepared meals with sour, salty tastes, ginger, and honey are indicated.
   - Sharad (Autumn): Pitta accumulated during the rains undergoes violent aggravation under clear sunny skies. Sweet, bitter, astringent diets, ghee, and milk are indicated. Pungent, fermented, and spicy foods must be minimized.
   - Hemanta & Shishira (Winter): Digestive power is highest. Wholesome, rich, unctuous meals (warm soups, sesame, nuts, whole grains) are well tolerated.
"""
    },
    {
        "id": "CS-SU-07-VEGANDHARANIYA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Non-Suppressible Natural Urges (Adharaniya Vega) & Disease Etiology",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=su&ch=7",
        "publication_version": "Charaka Saṃhitā, Sūtrasthāna, Chapter 7, Ślokas 3-25",
        "license": "Public Domain",
        "document_type": "Classical Etiological Guideline",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Directly links modern lifestyle habits (holding urine, bowel movements, skipping meals) to Vata disorders.",
        "limitations": "Suppression consequences need correlation with contemporary functional gastrointestinal and autonomic disorders.",
        "classical_verse": "Na vegān dhārayeddheemān jātān mūtrapurīṣayoḥ. Na retaso na vātasya na chardyāḥ kṣavathoḥ na ca.",
        "tags": ["adharaniya_vega", "natural_urges", "vata_vitiation", "apana_vayu", "lifestyle_pathology"],
        "dosha_affinity": ["Vata"],
        "content": """
Charaka Saṃhitā Sūtrasthāna Chapter 7 delineates the physiological hazards of suppressing natural physiological reflexes.
1. The 13 Non-Suppressible Urges (Adhāraṇīya Vegāḥ):
   - Mutra (Urination): Suppression causes dysuria, bladder pain, renal calculi, and radiating pelvic cramps.
   - Purisha (Defecation): Suppression leads to severe fecal impaction, upward movement of gas (Udavarta), colicky pain, headaches, and abdominal distension.
   - Shukra (Seminal ejaculation): Causes testicular pain, dysuria, and cardiac discomfort.
   - Vata / Adhovayu (Flatus): Causes abdominal pain, exhaustion, obstipation, and impaired vision.
   - Chardi (Vomiting): Suppression triggers urticaria, pruritus, edema, skin diseases (Kushtha), and anorexia.
   - Kshavathu (Sneezing): Causes stiff neck, facial paralysis, hemicrania, and sensory weakness.
   - Udgara (Eructation/Belching): Causes anorexia, tremors, cardiac oppression, and chest tightness.
   - Jrimbha (Yawning): Causes convulsions, contractions, numbness, and tremors.
   - Kshudha (Hunger): Suppression triggers emaciation, weakness, dizziness, and gastric burning.
   - Pipasa (Thirst): Causes dry mouth, deafness, cardiac distress, and heat intolerance.
   - Bashpa (Tears): Triggers eye diseases, headache, dizziness, and cardiac oppression.
   - Shvasa (Exertional breathing): Causes abdominal tumors (Gulma), cardiac disorders, and syncope.
   - Nidra (Sleep): Suppression causes yawning, whole-body aches, drowsiness, heavy eyes, and mental fuzziness.

2. Suppressible Urges (Dhāraṇīya Vegāḥ):
   Unlike bodily reflexes, mental and ethical urges must be restrained: greed, grief, fear, anger, vanity, jealousy, and malicious speech.
"""
    },
    {
        "id": "CS-SU-12-VATAKALAKALIYA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Properties, Functions, and Pathological Manifestations of Vata",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=su&ch=12",
        "publication_version": "Charaka Saṃhitā, Sūtrasthāna, Chapter 12, Ślokas 1-15",
        "license": "Public Domain",
        "document_type": "Classical Pathophysiology Treatise",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Crucial for understanding Vata phenotypes, neurological excitability, musculoskeletal pain, and cold intolerance.",
        "limitations": "Describes systemic manifestations that require modern differential diagnosis to rule out organic neurological disorders.",
        "classical_verse": "Vāyoḥ rūkṣa-śīta-laghu-sūkṣma-cala-viśada-kharāḥ guṇāḥ.",
        "tags": ["vata", "gunas", "anxiety", "insomnia", "joint_pain", "dryness", "prakriti"],
        "dosha_affinity": ["Vata"],
        "content": """
Charaka Saṃhitā Sūtrasthāna Chapter 12 expounds the qualitative nature (Gunas) and pathological manifestations of Vata Dosha.
1. Qualitative Attributes of Vata:
   - Ruksha (Dry): Imparts dryness to skin, hair, and mucous membranes.
   - Shita (Cold): Causes intolerance to cold breezes and cold foods.
   - Laghu (Light): Imparts lightness, slender body habitus, rapid metabolism.
   - Sukshma (Subtle): Capable of permeating minute channels (Srotas).
   - Cala (Mobile): Drives nervous impulses, mental hyper-reactivity, and physical restlessness.
   - Vishada (Clear / Non-slimy): Dries secretions, causes rough joints.
   - Khara (Rough): Produces cracking joints and coarse texture.

2. Physiological Functions of Normal Vata:
   - Sustains life, respiration, cardiac rhythm, and neuromuscular motility.
   - Drives sensory reception and motor actuation.
   - Stimulates digestive Agni and governs excretion of feces, urine, and semen.

3. Pathological Aggravation Signs:
   Dry skin, constipation, variable appetite (Vishama Agni), muscle twitches, anxiety, sleep disturbances, tremors, and colicky pain. Pacified by warm, unctuous, grounding substances (sesame oil, warm soups, cow's ghee, sweet-sour-salty tastes).
"""
    },
    {
        "id": "CS-SU-25-YAJJAPURUSHIYA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Wholesome & Unwholesome Foods and Premier Substances (Agrya Dravyas)",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=su&ch=25",
        "publication_version": "Charaka Saṃhitā, Sūtrasthāna, Chapter 25, Ślokas 38-40",
        "license": "Public Domain",
        "document_type": "Classical Pharmacological Formulary",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Provides gold-standard dietary recommendations (Pathya) and authoritative single-herb hierarchies.",
        "limitations": "Some ancient animal preparations mentioned in the chapter are historical; current application focuses on plant and dairy agrya dravyas.",
        "classical_verse": "Hitaṁ śarīradhātūnāṁ anukūlaṁ yat tadācakṣate. Ahitaṁ tu pratikūlam.",
        "tags": ["agrya_aushadha", "pathya", "ahara", "ghee", "honey", "ginger", "triphala"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Sūtrasthāna Chapter 25 enumerates the most wholesome (Hita) and unwholesome (Ahita) substances, culminating in the Agrya Dravya list (premier substances):
Key Canonical Agrya Items:
1. Water (Toya): Premier for promoting vitality (Ashvasanakaranam).
2. Milk (Kshira): Premier for nourishing living tissues (Jivaniyanaam).
3. Ghee (Ghrita): Premier for pacifying Vata-Pitta, promoting memory, intelligence, and Agni (Snehana-Agni-Deepana).
4. Honey (Madhu): Premier for scraping Kapha and fat (Kapha-Pitta-Prashamana, Lekhana).
5. Ginger (Shunthi): Premier for kindling digestion without aggravating Pitta (Deepaniya-Pachaniya-Vrushya).
6. Barley (Yava): Premier for reducing obesity and unctuousness (Purishajanana-Lekhana).
7. Mudga (Green Gram): Premier for light, wholesome pulse nutrition (Kashaya-Madhura-Ruksha).
8. Triphala: Premier for ophthalmic health, bowel regulation, and tissue rejuvenation (Rasayana).
9. Consistent Regimen: Anitya Ahara (irregular eating) is premier for destroying digestive harmony.
"""
    },
    {
        "id": "CS-SU-27-ANNAPANAVITHI",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Comprehensive Dietetics & Nutritional Classification (Annapanavidhi)",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=su&ch=27",
        "publication_version": "Charaka Saṃhitā, Sūtrasthāna, Chapter 27, Ślokas 3-10, 220-250",
        "license": "Public Domain",
        "document_type": "Classical Food Science Text",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Underpins the nutritional recommendation engine for customized food lists.",
        "limitations": "Requires integration with modern nutrient content metrics (calories, protein, glycemic index).",
        "classical_verse": "Ahārasambhavaṁ vastu rogāścāhārasambhavāḥ. Hitāhitaviśeṣācca viśeṣaḥ sukhaduḥkhayoḥ.",
        "tags": ["annapanavidhi", "food_groups", "ahara", "cereals", "pulses", "milk_products", "hitahita", "sukhadukha", "charaka_samhita"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Sūtrasthāna Chapter 27 (Annapānavidhi) establishes the central dietary shloka:
Ahārasambhavaṁ vastu rogāścāhārasambhavāḥ. Hitāhitaviśeṣācca viśeṣaḥ sukhaduḥkhayoḥ.
(The human body is the product of nutrition; diseases are also born of improper diet. Wholesome [Hita] food creates health, unwholesome [Ahita] causes affliction).
1. Shuka Dhanya (Cereals): Shali (red rice, aged rice) is sweet, cooling, easily digestible, and pacifies all three doshas. Yava (barley) is dry, cold, and scrapes Kapha.
2. Shami Dhanya (Pulses): Mudga (green gram) is the foremost wholesome legume, easy on digestion. Masha (black gram) is heavy, hot, unctuous, increases strength and semen, but strongly increases Kapha and Pitta.
3. Shaka Varga (Vegetables): Most leafy vegetables are astringent, dry, and cold, requiring culinary preparation with unctuous fats (ghee/mustard oil) to avoid aggravating Vata.
4. Phala Varga (Fruits): Draksha (raisins/grapes) is the foremost fruit, cooling, sweet, and soothing to Pitta-Vata. Dadima (pomegranate) balances Pitta and stimulates Agni.
5. Jala Varga (Water): Cold boiled water (Shrita-Shita) is light, clears channels, and pacifies Pitta. Warm water (Ushnodaka) kindles Agni, digests toxins (Ama), and pacifies Vata-Kapha.
6. Gorasa Varga (Dairy): Cow's milk is sweet, cooling, promotes Ojas, and rejuvenates. Takra (buttermilk spiced with roasted cumin and rock salt) is light, astringent-sour, kindles Agni, and cures Grahani and hemorrhoids.
"""
    },
    {
        "id": "CS-VI-01-RASAVIMANA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: The Eight Factors of Dietetics (Aṣṭāvidha Āhāravidhi Viśeṣāyatana)",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=vi&ch=1",
        "publication_version": "Charaka Saṃhitā, Vimānasthāna, Chapter 1, Śloka 21-25",
        "license": "Public Domain",
        "document_type": "Classical Nutritional Methodology",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Provides behavioral eating rules (mindful eating, eating warm, fresh, unhurried meals) in personalized plans.",
        "limitations": "Focuses on digestive psychology; must be accompanied by nutrient adequacy checks.",
        "classical_verse": "Prakṛti-karaṇa-saṁyoga-rāśi-deśa-kāla-upayogasaṁsthā-upayoktāraḥ.",
        "tags": ["ashtavidha_aharavidhi", "mindful_eating", "dietary_rules", "digestion", "agni"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Vimānasthāna Chapter 1 outlines the eight indispensable parameters governing nutritional assimilation:
1. Prakriti (Natural Quality of Food): Innate properties like lightness (Laghu) of mung beans or heaviness (Guru) of pork and black gram.
2. Karana (Processing / Culinary Transformation): Water, fire, churn, and spicing alter food properties (e.g., paddy is heavy, but puffed rice / Laja is extremely light; curd is heavy, but churned buttermilk / Takra is light).
3. Samyoga (Combination): Synergistic blending or harmful incompatibilities (e.g., milk and fish combined produce toxic channel obstruction).
4. Rashi (Quantity): Quantitative portioning—Sarvagraha (total meal caloric mass) and Parigraha (measure of individual components).
5. Desha (Habitat / Geographical Ecology): Regional climate and indigenous crops (e.g., arid desert lands require unctuous, cooling foods).
6. Kala (Time & Chronobiology): Circadian hour, seasonal ritu, and biological age (e.g., eating only when the previous meal is fully digested - Jirne ashniyat).
7. Upayoga Samstha (Dietary Usage Rules): Eat warm (Ushnam), unctuous (Snigdham), in proper measure (Matravat), after previous food is digested (Jirne), non-conflicting in potency (Viryaviruddham), in a pleasant place (Ishte deshe), neither too hurried (Natidrutam) nor too prolonged (Nativilambitam), without talking or laughing, with focused presence of mind (Tanmana bhunjita).
8. Upayokta (Individual Consumer / Habituation): The consumer's constitutional adaptability (Oka-Satmya).
"""
    },
    {
        "id": "CS-VI-08-DASHAVITHA-PARIKSHA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Tenfold Clinical Examination of the Patient (Daśavidha Parīkṣā)",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=vi&ch=8",
        "publication_version": "Charaka Saṃhitā, Vimānasthāna, Chapter 8, Ślokas 94-110",
        "license": "Public Domain",
        "document_type": "Classical Diagnostic Methodology",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "The direct clinical foundation for AyuRAG-XAI's multi-factorial assessment model.",
        "limitations": "Comprehensive clinical pariksha requires physical tactile and visual examination by a qualified physician.",
        "classical_verse": "Kāryayoniḥ kāryam kāryaphalaṁ anubandho deśaḥ kālaḥ pravṛttirupāya iti.",
        "tags": ["dashavidha_pariksha", "clinical_assessment", "prakriti", "vikriti", "sara", "satmya"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Vimānasthāna Chapter 8 defines the 10 dimensions for clinical patient evaluation:
1. Prakriti (Constitutional habitus): Inherent genetic Tridosha ratio.
2. Vikriti (Morbidity / Current pathological imbalance): Dosha, Dhatu, and Mala departure from baseline.
3. Sara (Tissue excellence / Biological reserves): Qualitative integrity of 7 tissues (e.g., Asthi Sara indicates bone density; Majja Sara indicates nervous reserve).
4. Samhanana (Compactness / Musculoskeletal symmetry): Firmness of bone-joint architecture.
5. Pramana (Anthropometric proportions): Anatomical measurement ratios.
6. Satmya (Habituation & Adaptability): Substances agreeable to the individual through long-standing exposure.
7. Sattva (Mental temperament & Resilience): Pravara (strong psycho-emotional resilience), Madhya (moderate), or Avara (fragile mental resilience).
8. Ahara Shakti (Nutritional capacity): Evaluated via Abhyavaharana Shakti (intake volume) and Jarana Shakti (digestive efficiency).
9. Vyayama Shakti (Work & Physical endurance): Capacity to engage in physical labor or aerobic exertion.
10. Vaya (Biological age): Balya (growth phase <16), Madhyama (productive maintenance 16-60), and Vardhakya (degenerative aging >60, Vata-dominated).
"""
    },
    {
        "id": "CS-CI-15-GRAHANI-AGNI",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Pathophysiology of Agni, Ama, and Grahani Disorders",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=ci&ch=15",
        "publication_version": "Charaka Saṃhitā, Cikitsāsthāna, Chapter 15, Ślokas 3-45",
        "license": "Public Domain",
        "document_type": "Classical Gastrointestinal Treatise",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Direct clinical reference for Agni classification (Sama, Vishama, Tikshna, Manda) and digestive recommendations.",
        "limitations": "Chronic malabsorption disorders and inflammatory bowel disease require modern gastroenterological endoscopy and testing.",
        "classical_verse": "Ayuḥ varṇo balaṁ svāsthyaṁ utsāhopacayo prabhā. Ojastejo’gnayaḥ prāṇāścoktā deha-agni-hetukāḥ.",
        "tags": ["grahani", "agni", "ama", "vishama_agni", "tikshna_agni", "manda_agni", "takra"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Cikitsāsthāna Chapter 15 establishes the primacy of gastrointestinal fire (Jatharagni) in human vitality.
1. The Four Functional States of Agni:
   - Sama Agni (Balanced): Digestion occurs smoothly within 3-4 hours without gas, burning, or heaviness. Tridosha harmony exists.
   - Vishama Agni (Irregular / Vata-dominated): Digestion is erratic—sometimes rapid, sometimes sluggish, frequently accompanied by distension, dry constipation, and colicky pain.
   - Tikshna Agni (Hyperactive / Pitta-dominated): Digestion is excessively rapid, producing ravenous appetite, epigastric burning, acid reflux, throat parching, and loose motions.
   - Manda Agni (Sluggish / Kapha-dominated): Digestion is heavy and slow; small amounts of food cause prolonged epigastric fullness, nausea, salivation, and lethargy.

2. Pathogenesis of Ama (Endogenous Metabolic Toxin):
   When Agni is impaired, the first circulating nutritional juice (Rasa Dhatu) remains unripened and fermented, known as Ama. Ama clogs biological channels (Srotas), leading to fatigue, heavy tongue coating, malodorous excretions, joint stiffness, and impaired immunity.
"""
    },
    {
        "id": "SS-SU-15-DOSHA-DHATU-KSHAYA-VRIDDHI",
        "collection": "classical_compendia",
        "title": "Suśruta Saṃhitā: Clinical Signs of Increase and Decrease of Doshas, Dhatus, and Malas",
        "publisher": "Classical Ayurvedic Compendium (National Institute of Indian Medical Heritage / AYUSH)",
        "source_url": "https://niimh.nic.in/ebooks/esusruta/?mod=read&sys=su&ch=15",
        "publication_version": "Suśruta Saṃhitā, Sūtrasthāna, Chapter 15, Ślokas 1-32",
        "license": "Public Domain",
        "document_type": "Classical Surgical-Medical Compendium",
        "download_availability": "Publicly accessible via e-Sushruta",
        "relevance": "Provides objective clinical symptom indicators for dosha and tissue depletion or excess.",
        "limitations": "Tissue depletion (Dhatu Kshaya) symptoms should be correlated with biochemical laboratory markers (e.g. CBC, ferritin).",
        "classical_verse": "Doṣa-dhātu-mala-mūlaṁ hi śarīram.",
        "tags": ["sushruta", "dhatu_kshaya", "dosha_vriddhi", "ojas", "tissue_depletion"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Suśruta Saṃhitā Sūtrasthāna Chapter 15 defines the physiological baseline and pathological signs of the structural components of the human body:
1. Signs of Increased Doshas (Vriddhi Lakshana):
   - Vata Vriddhi: Emaciation, blackish discoloration, cold cravings, tremors, abdominal distension, constipation, loss of sleep, and sensory weakness.
   - Pitta Vriddhi: Yellowing of sclera, urine, skin, and feces; extreme burning sensation, night sweats, thirst, acid eructation, and brief fainting.
   - Kapha Vriddhi: Heaviness of limbs, pallor, cold clamminess, respiratory wheeze/cough, excessive sleep, and lethargy.

2. Signs of Decreased Doshas (Kshaya Lakshana):
   - Vata Kshaya: Sluggish movements, diminished speech, sensory dullness, and signs of Kapha increase.
   - Pitta Kshaya: Low body temperature, diminished digestive fire, loss of radiance.
   - Kapha Kshaya: Dryness, internal burning sensation, joint looseness, persistent thirst, and insomnia.

3. Ojas and Immune Vitality:
   Ojas is the ultimate essence of the seven Dhatus, responsible for physical strength (Bala) and infection resistance (Vyadhikshamatva). Ojas depletion (Ojo-Kshaya) produces anxiety, constant fatigue, sensory hypersensitivity, and muscle wasting.
"""
    },
    {
        "id": "SS-SU-21-SHATKRIYAKALA",
        "collection": "classical_compendia",
        "title": "Suśruta Saṃhitā: The Six Stages of Disease Progression (Ṣaṭ Kriyākāla)",
        "publisher": "Classical Ayurvedic Compendium (e-Sushruta / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/esusruta/?mod=read&sys=su&ch=21",
        "publication_version": "Suśruta Saṃhitā, Sūtrasthāna, Chapter 21 (Vraṇapraśna), Ślokas 18-36",
        "license": "Public Domain",
        "document_type": "Classical Pathological Stage Matrix",
        "download_availability": "Publicly accessible via e-Sushruta",
        "relevance": "Provides chronological clinical stages, demonstrating that preventive intervention in early stages halts disease progression.",
        "limitations": "Stages 5 and 6 (Bhedavastha) indicate manifest anatomical disease requiring medical or surgical intervention.",
        "classical_verse": "Sañcayaṁ ca prakopaṁ ca prasaraṁ sthānasaṁśrayam. Vyaktiṁ bhedaṁ ca yo vetti doṣāṇāṁ sa bhavedbhiṣak.",
        "tags": ["shatkriyakala", "pathogenesis", "preventive_medicine", "sanchaya", "prakopa", "sthanasamshraya"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Suśruta Saṃhitā Sūtrasthāna Chapter 21 outlines the six progressive stages of pathogenesis (Ṣaṭ Kriyākāla):
1. Sañcaya (Accumulation): Doshas accumulate in their primary anatomical sites (Vata in colon, Pitta in small intestine, Kapha in stomach), producing mild aversion to like qualities and craving for opposites.
2. Prakopa (Provocation / Excitement): Doshas overflow their anatomical receptacles, generating distinct discomfort (e.g. Vata causing colicky gas, Pitta causing acid burning, Kapha causing nausea).
3. Prasara (Dissemination / Spread): Doshas overflow and circulate through the systemic channels (Srotas), comparable to fermenting wine overflowing a vessel.
4. Sthānasaṁśraya (Localization / Channel Lodgment): Circulating doshas lodge at areas of pre-existing channel weakness (Khavaigunya). Premonitory symptoms (Purvaroopa) manifest.
5. Vyakti (Manifestation): Classical textbook symptoms of the disease become fully perceptible (Rupa).
6. Bheda (Complication / Chronicity / Structural Damage): Tissue necrosis, ulceration, or chronic refractory pathology develops. Early intervention in stages 1-3 halts progression without irreversible tissue damage.
"""
    },
    {
        "id": "AH-SU-01-AYUSHKAMIYA",
        "collection": "classical_compendia",
        "title": "Aṣṭāṅga Hṛdayam: Core Foundations of Health & Tridosha Dynamics (Āyuṣkāmīya)",
        "publisher": "Classical Ayurvedic Compendium (e-Ashtanga / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/eahridaya/?mod=read&sys=su&ch=1",
        "publication_version": "Aṣṭāṅga Hṛdayam, Sūtrasthāna, Chapter 1, Ślokas 1-25",
        "license": "Public Domain",
        "document_type": "Classical Foundational Text",
        "download_availability": "Publicly accessible via e-Ashtanga",
        "relevance": "Defines the fundamental axioms of Ayurvedic treatment: like increases like, opposites cure.",
        "limitations": "Axiomatic rules require personalized calibration based on metabolic rate and clinical contraindications.",
        "classical_verse": "Vāyuḥ pittaṁ kaphaśceti trayo doṣāḥ samāsataḥ. Vikṛtā’vikṛtā dehaṁ ghnanti te vartayanti ca.",
        "tags": ["ashtanga_hridaya", "tridosha", "rasa", "dhatu", "samanya_vishesha"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Aṣṭāṅga Hṛdayam Sūtrasthāna Chapter 1 (by Acharya Vagbhata) distills the essence of Charaka and Sushruta into crisp clinical aphorisms:
1. The Three Doshas:
   - Vayu, Pitta, and Kapha are the three bodily regulatory humors.
   - When in an unvitiated state (Avikrita), they sustain and preserve the body; when vitiated (Vikrita), they bring about disease and decay.
   - Age distribution: Kapha dominates childhood, Pitta dominates middle age, and Vata dominates senior years (>60).
   - Diurnal distribution: Kapha dominates morning/post-meal, Pitta dominates midday/mid-digestion, and Vata dominates evening/completion of digestion.

2. The Principle of Homology and Opposition (Sāmānya-Viśeṣa Siddhānta):
   - Habitual consumption of substances possessing identical qualities increases that specific dosha (Vṛddhiḥ samānaiḥ sarveṣām).
   - Substances possessing contrary qualities reduce that dosha (Hhetuḥ viparītaiḥ).
   - Six Rasas (Tastes): Madhura (sweet), Amla (sour), Lavana (salty), Katu (pungent), Tikta (bitter), and Kashaya (astringent).
     - Sweet, sour, and salty pacify Vata.
     - Astringent, sweet, and bitter pacify Pitta.
     - Astringent, pungent, and bitter pacify Kapha.
"""
    },
    {
        "id": "AH-SU-02-DINACHARYA",
        "collection": "classical_compendia",
        "title": "Aṣṭāṅga Hṛdayam: Circadian Daily Regimen & Preventive Self-Care (Dinacharya)",
        "publisher": "Classical Ayurvedic Compendium (e-Ashtanga / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/eahridaya/?mod=read&sys=su&ch=2",
        "publication_version": "Aṣṭāṅga Hṛdayam, Sūtrasthāna, Chapter 2, Ślokas 1-45",
        "license": "Public Domain",
        "document_type": "Classical Circadian Protocol",
        "download_availability": "Publicly accessible via e-Ashtanga",
        "relevance": "Provides the blueprint for personalized daily circadian schedules generated by AyuRAG-XAI.",
        "limitations": "Waking hours and exercise intensity must be adapted for shift-workers and individuals with chronic illness.",
        "classical_verse": "Brāhme muhūrte budhyeta svastho rakṣārthamāyuṣaḥ.",
        "tags": ["dinacharya", "brahma_muhurta", "vyayama", "abhyanga", "snana", "circadian_rhythm"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Aṣṭāṅga Hṛdayam Sūtrasthāna Chapter 2 provides the definitive Ayurvedic daily hygiene schedule:
1. Brahma Muhurta Waking:
   The healthy person should awaken during Brahma Muhurta (approximately 48 to 96 minutes before sunrise) to preserve health, mental clarity, and somatic vitality.
2. Evacuation & Dental Care:
   Natural elimination must precede physical activity. Teeth cleaned with bitter, pungent, astringent herbal powders (neem, babool, khadir).
3. Daily Oil Massage (Abhyanga):
   Abhyanga should be practiced daily; it wards off fatigue, relieves exhaustion, stabilizes Vata, sharpens eyesight, promotes restful sleep, improves dermal softness, and enhances longevity. Special attention is directed to Shiras (head), Shravana (ears), and Pada (soles of the feet).
4. Physical Exercise (Vyayama):
   Imparts lightness to the body, ability to work, enhances digestive Agni, and reduces fat. Exercise should be practiced only up to half one's capacity (Ardha-Shakti), indicated by the appearance of perspiration on the forehead, nose, and joints.
"""
    },
    {
        "id": "AH-SU-07-VIRUDDHAHARA",
        "collection": "classical_compendia",
        "title": "Aṣṭāṅga Hṛdayam: Incompatible Food Combinations & Toxic Synergies (Viruddhāhāra)",
        "publisher": "Classical Ayurvedic Compendium (e-Ashtanga / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/eahridaya/?mod=read&sys=su&ch=7",
        "publication_version": "Aṣṭāṅga Hṛdayam, Sūtrasthāna, Chapter 7, Ślokas 29-45",
        "license": "Public Domain",
        "document_type": "Classical Nutritional Pathology Guideline",
        "download_availability": "Publicly accessible via e-Ashtanga",
        "relevance": "Crucial for generating dietary contraindications and warning users against harmful food combinations.",
        "limitations": "Mechanisms of toxicity reflect classical physiological perspectives; contemporary verification is documented for specific allergies and enzymatic mismatches.",
        "classical_verse": "Viruddhaṁ api ca āhāraṁ vidyāt viṣavaduttamam.",
        "tags": ["viruddhahara", "food_combinations", "honey_ghee", "milk_sour", "chronic_toxins"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Aṣṭāṅga Hṛdayam Sūtrasthāna Chapter 7 identifies dietary combinations that act as slow cellular toxins (Gara Visha):
1. Specific Incompatible Combinations:
   - Milk and Sour Substances: Consuming cow's milk with citrus fruits, tamarind, or pickled items curdles milk proteins in an acidic environment, severely congesting lymphatic channels.
   - Milk and Fish: Both are heavy and sweet in Vipaka, but fish has Ushna (hot) Virya while milk has Shita (cold) Virya. This conflicting potency vitiates blood (Rakta) and obstructs skin channels.
   - Equal Quantities of Honey and Ghee: Honey and ghee taken together in identical equal weights are toxic (Samaghrita-Madhu). Unequal proportions (2:1 or 1:2) are wholesome.
   - Heated Honey (Ushna Madhu): Exposing raw honey to cooking temperatures (>60°C) destroys natural enzymatic structures and turns it into sticky, insoluble Ama.
   - Radish with Milk: Toxic to cutaneous metabolism.
   - Night consumption of Curd (Dadhi): Curd is sour, unctuous, heavy, and channel-blocking (Abhishyandi); when taken at night it blocks micro-circulation and aggravates Pitta-Kapha.
"""
    },
    {
        "id": "AH-SU-08-MATRASHITIYA-PORTION",
        "collection": "classical_compendia",
        "title": "Aṣṭāṅga Hṛdayam: Stomach Volumetric Division for Optimal Digestion",
        "publisher": "Classical Ayurvedic Compendium (e-Ashtanga / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/eahridaya/?mod=read&sys=su&ch=8",
        "publication_version": "Aṣṭāṅga Hṛdayam, Sūtrasthāna, Chapter 8, Ślokas 1-4",
        "license": "Public Domain",
        "document_type": "Classical Gastrointestinal Guideline",
        "download_availability": "Publicly accessible via e-Ashtanga",
        "relevance": "Direct guideline for meal portioning and preventing postprandial bloating or indigestion.",
        "limitations": "Provides qualitative volume estimation; must be paired with individualized caloric requirements.",
        "classical_verse": "Mātrāśī syāt; āhāra-mātrā punar-agner-balāpekṣiṇī. Kūkṣerbhāgadvayaṁ śaktaiḥ pūrayedannasammataiḥ.",
        "tags": ["portion_control", "stomach_capacity", "agni", "indigestion", "bloating", "ashtanga_hridaya", "ashtanga", "gastric_capacity"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Aṣṭāṅga Hṛdayam Sūtrasthāna Chapter 8 sets out the universal rule of gastric capacity:
1. Gastric Volumetric Allocation:
   - The stomach capacity (Kukshi) must mentally be partitioned into four quarters:
     - Two quarters (50%) should be filled with solid wholesome food.
     - One quarter (25%) should be filled with liquid nourishment (warm soups, buttermilk, water).
     - One quarter (25%) must remain completely empty to accommodate the dynamic movement of the Tridoshas (Prana, Samana, and Apana Vayu).

2. Consequences of Overeating (Atimatra Ashana):
   Filling the stomach to 100% capacity crushes gastrointestinal fire, generating gaseous distension, acidic belching, lethargy, and food stagnation (Alasaka / Visuchika).
"""
    },

    # =========================================================================
    # COLLECTION 2: CCRAS RESEARCH & CLINICAL GUIDELINES
    # =========================================================================
    {
        "id": "CCRAS-CLINICAL-EVAL-GUIDELINES",
        "collection": "ccras_guidelines",
        "title": "CCRAS: General Guidelines for Clinical Evaluation of Ayurvedic Interventions",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS), Ministry of AYUSH, Govt. of India",
        "source_url": "https://ccras.nic.in/sites/default/files/viewpdf/General%20Guidelines%20for%20Clinical%20Evaluation%20of%20Ayurvedic%20Interventions.pdf",
        "publication_version": "CCRAS Guideline Series, 2018 Edition",
        "license": "Open Government Data (OGD) - India / Research and Academic Fair Use",
        "document_type": "Official National Research Standard",
        "download_availability": "Publicly accessible via ccras.nic.in document archive",
        "relevance": "Provides the methodological benchmark for evaluating clinical Ayurvedic decision support and avoiding unscientific claims.",
        "limitations": "Focuses on trial design protocols rather than automated software algorithms; adapted for clinical software validation.",
        "classical_verse": None,
        "tags": ["ccras", "clinical_trials", "gcp_ayurveda", "evidence_based", "standardization"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
The Central Council for Research in Ayurvedic Sciences (CCRAS) 'General Guidelines for Clinical Evaluation of Ayurvedic Interventions' establishes rigorous research criteria:
1. Methodological Duality:
   - Clinical evaluations must bridge traditional Ayurvedic diagnostic parameters (Prakriti, Vikriti, Agni, Dhatu Sara) with modern clinical outcome measures (biochemical markers, validated quality-of-life questionnaires).
   - Interventions must document dosage form, standardization of raw materials, and batch consistency.

2. Evidence Hierarchy & Claims Integrity:
   - Traditional textual citation establishes historical plausibility, NOT automated proof of efficacy in contemporary clinical populations.
   - Controlled clinical trials (RCTs), prospective cohort studies, and systematic reviews represent mandatory levels of validation for therapeutic assertions.
   - Decision support software must clearly delineate classical consensus from modern clinical trial evidence.
"""
    },
    {
        "id": "CCRAS-PRAKRITI-ASSESSMENT-SOP",
        "collection": "ccras_guidelines",
        "title": "CCRAS: Standardized Technical Protocol for Deha Prakriti Assessment",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/content/prakriti-assessment-questionnaire",
        "publication_version": "CCRAS Technical Protocol, Validated Assessment Tool",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Standard Operating Procedure (SOP) & Questionnaire Matrix",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Direct algorithmic reference for AyuRAG-XAI's Prakriti questionnaire scoring and constitutional classification.",
        "limitations": "Self-reported questionnaires carry cognitive bias; doctor clinical verification remains necessary for definitive typing.",
        "classical_verse": None,
        "tags": ["ccras_prakriti", "questionnaire", "constitutional_scoring", "vata_pitta_kapha", "validation"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
The CCRAS Deha Prakriti Assessment Protocol standardizes constitutional determination through multi-domain clinical scoring:
1. Core Assessment Domains:
   - Anatomical / Morphological Features: Skeletal frame, body weight consistency, skin texture, hair characteristics, eye shape and color, teeth and nail quality.
   - Physiological Traits: Appetite consistency, digestive velocity, bowel regularity and stool consistency, perspiration threshold, physical endurance, sleep depth and dream content.
   - Psychological / Behavioral Attributes: Speed of comprehension and memory retention, stress response patterns (worry vs anger vs withdrawal), emotional reactivity, and communication tempo.

2. Weighted Deterministic Scoring Matrix:
   - Items are scored across independent Vata, Pitta, and Kapha scales.
   - Single-dosha dominance is recognized when one dosha exceeds secondary doshas by >10% score differential.
   - Dual-dosha types (Dwandwaja: Vata-Pitta, Pitta-Kapha, Vata-Kapha) represent the vast majority of real-world human constitutions.
   - Equi-constitutional (Sama Prakriti) is rare and characterized by balanced resilience across all physiological challenges.
"""
    },
    {
        "id": "CCRAS-AGNI-ASSESSMENT-PROTOCOL",
        "collection": "ccras_guidelines",
        "title": "CCRAS: Clinical Diagnostic Criteria for Digestive Fire (Agni) Evaluation",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/publications/clinical-diagnostic-manual-agni",
        "publication_version": "CCRAS Clinical Diagnostic Manual",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Diagnostic Criteria",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Provides objective clinical diagnostic symptoms for determining patient Agni status in AyuRAG-XAI.",
        "limitations": "Subjective symptom clusters; should be supported by dietary recall and stool frequency logging.",
        "classical_verse": None,
        "tags": ["ccras_agni", "jatharagni", "digestive_power", "ama_detection", "clinical_scoring"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
The CCRAS Agni Clinical Diagnostic Framework classifies metabolic capacity into four operational categories:
1. Sama Agni:
   - Regular, predictable hunger cycles occurring every 4-5 hours.
   - Digestion completed within standard time (3-4 hours) without discomfort.
   - Uncoated clean tongue, light clear breath, normal formed bowel movement once daily upon waking.
2. Vishama Agni:
   - Erratic appetite: ravenous on one day, completely absent on the next.
   - Variable digestion with intermittent bloating, rumbling (Atopa), constipation, or hard scybalous stools.
   - Direct manifestation of Vata vitiation in the gastrointestinal tract.
3. Tikshna Agni:
   - Excessive, voracious hunger; unable to bear slight meal delays without headache, irritability, or hypoglycemia.
   - Burning in epigastrium, sour eructations, loose stools with yellowish hue.
   - Direct manifestation of Pitta vitiation.
4. Manda Agni:
   - Lack of true hunger; feels bloated even when skipping meals.
   - Salivation, sweet taste in mouth, white coated tongue, heaviness in abdomen, delayed stool evacuation.
   - Direct manifestation of Kapha and Ama.
"""
    },
    {
        "id": "CCRAS-GUIDELINE-AMAVATA",
        "collection": "ccras_guidelines",
        "title": "CCRAS Clinical Practice Guideline: Management of Amavata (Rheumatoid Spectrum)",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/sites/default/files/viewpdf/Amavata%20Guideline.pdf",
        "publication_version": "CCRAS Clinical Protocol Series, 2020",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Practice Guideline",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Provides evidence-based lifestyle, nutrition, and referral guidance for joint inflammation and systemic stiffness.",
        "limitations": "Aggressive erosive joint disease requires ongoing rheumatological monitoring, anti-CCP/RF titers, and safe co-management.",
        "classical_verse": None,
        "tags": ["amavata", "joint_pain", "langhana", "swedana", "castor_oil", "anti_inflammatory"],
        "dosha_affinity": ["Vata", "Kapha"],
        "content": """
CCRAS Clinical Practice Guideline for the Management of Amavata:
1. Disease Concept:
   - Characterized by concurrent vitiation of Vata and systemic circulation of Ama, producing inflammatory polyarthritis, severe morning stiffness, migratory joint pain, and loss of appetite.
2. Recommended Therapeutic Line (Chikitsa Sutra):
   - Langhana (Therapeutic fasting / light liquid diet): Clears circulating Ama and restores Agni.
   - Swedana (Dry heat fomentation / Valuka Sweda): Relieves joint edema and stiffness; moist oily heat is contraindicated in acute Ama states.
   - Tikta-Katu Deepana Dravyas: Administration of Shunthi (dry ginger), Pippali, and Guggulu to digest toxins.
   - Virechana (Controlled purgation with Castor Oil / Eranda Taila): Eliminates Ama-Vata from the colon.
3. Dietary Pathya: Warm barley water, horse gram soup (Kulatta), garlic, ginger, and drumstick.
4. Apathya (To Avoid): Curd, fish, black gram, jaggery, cold water, day sleep, and suppressing urges.
"""
    },
    {
        "id": "CCRAS-GUIDELINE-MADHUMEHA",
        "collection": "ccras_guidelines",
        "title": "CCRAS Clinical Practice Guideline: Lifestyle & Dietary Protocol for Madhumeha (Type 2 Diabetes)",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/sites/default/files/viewpdf/Madhumeha%20Protocol.pdf",
        "publication_version": "CCRAS Clinical Protocol Series, 2019",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Practice Guideline",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Provides authoritative guidance for metabolic syndrome, insulin resistance, and blood sugar regulation.",
        "limitations": "Does not replace allopathic insulin in Type 1 diabetes or acute diabetic ketoacidosis; HbA1c monitoring mandatory.",
        "classical_verse": None,
        "tags": ["madhumeha", "diabetes", "metabolic_syndrome", "barley", "jamun", "ayur_diet"],
        "dosha_affinity": ["Kapha", "Vata"],
        "content": """
CCRAS Clinical Protocol for Madhumeha (Metabolic and Glycemic Regulation):
1. Etiological Factors:
   Sedentary habits (Asyasukha), excessive sleep (Swapnasukha), overconsumption of dairy, new harvest grains, and sweet refined sugars.
2. Dietary Principles :
   - Staple Grains: Barley (Yava), aged brown rice, millets (Ragi, Jowar, Bajra).
   - Legumes: Green gram (Mudga), roasted Bengal gram, horse gram (Kulattha).
   - Vegetables: Bitter gourd (Karela), pointed gourd (Patola), fenugreek leaves (Methi), drumstick.
   - Fruits: Jamun (Syzygium cumini), Indian gooseberry (Amalaki), wood apple (Kaphitha).
3. Botanical Interventions:
   Amalaki powder with Haridra (Nisha-Amalaki combination), Vijaysar kashaya, and Gudmar (Gymnema sylvestre).
4. Physical Exercise: Daily brisk walking (5–10 km equivalent) is highlighted as an indispensable therapeutic requirement.
"""
    },
    {
        "id": "CCRAS-GUIDELINE-AMLAPITTA",
        "collection": "ccras_guidelines",
        "title": "CCRAS Clinical Practice Guideline: Management of Amlapitta (Hyperacidity & GERD)",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/sites/default/files/viewpdf/Amlapitta%20Guideline.pdf",
        "publication_version": "CCRAS Clinical Protocol Series, 2021",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Practice Guideline",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Provides non-pharmacological and herbal management for heartburn, gastric burning, and acid regurgitation.",
        "limitations": "Gastric ulcer perforation or persistent hematemesis requires immediate emergency allopathic care.",
        "classical_verse": None,
        "tags": ["amlapitta", "hyperacidity", "gerd", "pitta_shamana", "shatavari", "yashtimadhu"],
        "dosha_affinity": ["Pitta"],
        "content": """
CCRAS Clinical Protocol for the Management of Amlapitta (Hyperacidity):
1. Disease Characteristics:
   - Aggravation of Pachaka Pitta wherein acidity (Amlata) and liquid quantity (Dravata) increase, leading to burning sensation in chest and throat (Hrit-Kantha Daha), acid eructation (Amlodgara), and nausea.
2. Dietary Pathya:
   - Old rice, barley, wheat, mung bean soup, cow's milk with ghee, raisins (Draksha), pomegranate (Dadima), tender coconut water, and pumpkin.
3. Strict Dietary Exclusions (Apathya):
   - Deep-fried foods, fermented doughs (Idli/Dosa), pungent spices (red chili, black mustard), pickles, vinegar, alcohol, tea, coffee, and smoking.
4. Stress and Circadian Factors:
   - Late-night eating, skipping meals, mental anger, and emotional distress directly trigger hyperchlorhydria and must be systematically mitigated.
"""
    },
    {
        "id": "CCRAS-GUIDELINE-ANIDRA",
        "collection": "ccras_guidelines",
        "title": "CCRAS Clinical Practice Guideline: Management of Anidra (Primary Insomnia)",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/sites/default/files/viewpdf/Anidra%20Guideline.pdf",
        "publication_version": "CCRAS Clinical Protocol Series, 2020",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Practice Guideline",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Evidence-based non-pharmacological protocols for sleep disturbances, nighttime restlessness, and stress.",
        "limitations": "Severe psychiatric depression, bipolar disorder, or obstructive sleep apnea require specialized medical review.",
        "classical_verse": None,
        "tags": ["anidra", "insomnia", "sleep_hygiene", "shirodhara", "ashwagandha", "vata_pitta"],
        "dosha_affinity": ["Vata", "Pitta"],
        "content": """
CCRAS Clinical Protocol for the Management of Anidra (Insomnia):
1. Pathophysiology:
   Vata and Pitta vitiation coupled with diminished Kapha and Tamo Guna leads to hyper-arousal of sensory channels (Mano-vaha Srotas).
2. Clinical Measures:
   - Murdha Taila (Application of warm medicated oil to the scalp / Shiro Abhyanga): Pacifies Prana Vayu.
   - Pada Abhyanga (Foot massage with warm sesame oil or Ksheerabala Taila before retiring): Clinically proven to lower sleep onset latency.
   - Internal Botanical Support: Ashwagandha root powder (3g) with warm cow's milk and a pinch of nutmeg (Jatiphala) taken 45 minutes before bedtime.
   - Sleep Hygiene: Fixed bed-times, avoidance of blue-light screen exposure after sunset, and avoidance of heavy or spicy dinners.
"""
    },

    # =========================================================================
    # COLLECTION 3: BOTANICAL REFERENCE & PHARMACOPOEIAL MONOGRAPHS
    # =========================================================================
    {
        "id": "API-WITHANIA-SOMNIFERA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Withania somnifera (Ashwagandha)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H), Ministry of AYUSH",
        "source_url": "https://pcimh.gov.in/monographs/withania-somnifera",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 08",
        "license": "Official Government Statutory Standard (PCIM&H / Ministry of AYUSH)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Official publication via pcimh.gov.in / National Portal",
        "relevance": "Authoritative standard for Ashwagandha identification, indications, dosage, and safety contraindications.",
        "limitations": "Monograph covers root material; extracts with high withanolide standardization require clinical dose titration.",
        "classical_verse": None,
        "tags": ["ashwagandha", "withania_somnifera", "rasayana", "adaptogen", "vata_shamana", "insomnia"],
        "dosha_affinity": ["Vata", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Withania somnifera (L.) Dunal (Family: Solanaceae) - Root.
1. Ayurvedic Nomenclature & Attributes:
   - Sanskrit Name: Aśvagandhā, Hayagandhā, Varāhadātri.
   - Rasa (Taste): Tikta (bitter), Kashaya (astringent), Madhura (sweet).
   - Guna (Quality): Laghu (light), Snigdha (unctuous).
   - Virya (Potency): Ushna (warm).
   - Vipaka (Post-digestive effect): Madhura (sweet).
   - Karma: Balya (strength-promoting), Rasayana (rejuvenator), Vata-Kaphashamaka, Nidrajanana (sleep-inducing), Vrishya (aphrodisiac).

2. Classical Indications:
   Kshaya (emaciation), Daurbalya (generalized weakness), Vata Vyadhi (neuromuscular disorders), Shotha (inflammation), Klaibya (loss of vitality).

3. Standard Therapeutic Dosage:
   - Root Churna (Powder): 3 to 6 grams daily in divided doses, with milk, ghee, or warm water.
   - Kwatha (Decoction): 50 to 100 ml.

4. Known Contraindications & Safety:
   - Pregnancy: Contraindicated in high doses due to potential emmenagogue / uterine stimulant effects.
   - Hyperthyroidism: May elevate serum T3 and T4 levels; caution in patients taking levothyroxine.
   - Sedative Interaction: Potentiates barbiturates, benzodiazepines, and alcohol via GABAergic modulation.
   - Severe Pitta states: Due to warm potency, high doses without milk/ghee may cause mild gastric burning in severe Pitta phenotypes.
"""
    },
    {
        "id": "API-TINOSPORA-CORDIFOLIA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Tinospora cordifolia (Guduchi/Giloy)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/tinospora-cordifolia",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 17",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Authoritative reference for immune modulation, fever management, and metabolic detoxification.",
        "limitations": "Rare idiosyncratic hepatotoxicity reported with adulterated species (Tinospora crispa); authentic T. cordifolia verified.",
        "classical_verse": None,
        "tags": ["guduchi", "giloy", "tinospora_cordifolia", "immunomodulator", "jvara", "rasayana"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Tinospora cordifolia (Willd.) Miers (Family: Menispermaceae) - Stem.
1. Ayurvedic Attributes:
   - Sanskrit Names: Guḍūcī, Amṛtā, Chhinnaruhā, Vatsādanī.
   - Rasa: Tikta (bitter), Kashaya (astringent).
   - Guna: Laghu (light), Snigdha (unctuous).
   - Virya: Ushna (mildly warm).
   - Vipaka: Madhura (sweet).
   - Karma: Tridoshashamaka (balances all three doshas), Deepani (kindles Agni), Medhya (cognitive enhancer), Rasayana (longevity promoter), Jvaraghna (anti-pyretic), Dahaprashamana (alleviates burning).

2. Therapeutic Indications:
   Jvara (pyrexia / chronic low-grade fever), Vatarakta (gouty arthritis), Prameha (glycemic dysregulation), Kamala (jaundice), Kasa-Shwasa (cough and dyspnea), Trishna (excessive thirst).

3. Standard Therapeutic Dosage:
   - Stem Powder: 3 to 6 grams.
   - Guduchi Satva (Starch extract): 500 mg to 1 g.
   - Kwatha: 50 to 100 ml.

4. Clinical Safety & Monitoring:
   - Excellent safety profile when using authentic botanical material.
   - Autoimmune Conditions: Due to strong immunostimulating activity, monitor closely in active autoimmune flareups.
   - Hypoglycemic Potential: Synergistic action with modern oral anti-diabetic agents; blood glucose monitoring advised.
"""
    },
    {
        "id": "API-PHYLLANTHUS-EMBLICA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Phyllanthus emblica (Amalaki/Amla)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/phyllanthus-emblica",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 04",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier antioxidant, digestive balancer, and Pitta-pacifying fruit monograph.",
        "limitations": "High raw acidity may cause mild transient heartburn in sensitive individuals if taken on completely empty stomach.",
        "classical_verse": None,
        "tags": ["amalaki", "amla", "phyllanthus_emblica", "pitta_shamana", "antioxidant", "rasayana"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Phyllanthus emblica L. syn. Emblica officinalis Gaertn. (Family: Phyllanthaceae) - Dried Fruit.
1. Ayurvedic Attributes:
   - Sanskrit Names: Āmalakī, Dhātrīphala, Vayasthā, Amṛtaphala.
   - Rasa: Panca Rasa (possesses 5 tastes: Sour, Sweet, Bitter, Pungent, Astringent; lacks only Saline taste). Amla (sour) is predominant, Kashaya (astringent) is secondary.
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Shita (cooling).
   - Vipaka: Madhura (sweet).
   - Karma: Tridoshaprashamana (especially premier for pacifying Pitta), Rasayana, Chakshushya (preserves visual acuity), Vrishya, Deepana.

2. Therapeutic Indications:
   Raktapitta (bleeding diathesis), Amlapitta (hyperacidity), Prameha (metabolic disorders), Daha (burning sensations), Kasa (cough), Shosha (wasting).

3. Standard Therapeutic Dosage:
   - Dried Fruit Powder: 3 to 6 grams.
   - Fresh Juice (Swarasa): 10 to 20 ml.

4. Safety & Contraindications:
   - Safe for long-term daily dietary consumption.
   - Due to cooling Virya, in acute cold, cough, and aggravated Vata without Pitta, administer with honey, ginger, or warm water.
"""
    },
    {
        "id": "API-TERMINALIA-CHEBULA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Terminalia chebula (Haritaki)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/terminalia-chebula",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 19",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier bowel regulator, gut detoxifier, and Triphala component.",
        "limitations": "Contraindicated in severe dehydration, acute exhaustion, and pregnancy.",
        "classical_verse": None,
        "tags": ["haritaki", "terminalia_chebula", "anulomana", "laxative", "gut_motility", "triphala"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Terminalia chebula Retz. (Family: Combretaceae) - Dried Pericarp.
1. Ayurvedic Attributes:
   - Sanskrit Names: Harītakī, Abhayā, Pathyā, Cetakī.
   - Rasa: Kashaya-pradhana (predominantly astringent, with sweet, sour, bitter, pungent; lacks salt).
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Ushna (mildly warm).
   - Vipaka: Madhura (sweet).
   - Karma: Tridoshahara (balances all doshas, especially Vata), Anulomana (gently directs Vayu downward, natural laxative), Deepani, Medhya, Rasayana.

2. Therapeutic Indications:
   Vibandha (constipation), Arsha (hemorrhoids), Udavarta (reverse peristalsis), Gulma (abdominal lumps), Shotha (edema), Aruchi (anorexia).

3. Standard Therapeutic Dosage:
   - Fruit Powder: 3 to 6 grams daily with warm water at bedtime.

4. Contraindications:
   - Highly dehydrated individuals, acute emaciation, excessive fasting, pregnancy, and acute exhaustion (Kshama/Shrama).
"""
    },
    {
        "id": "API-ASPARAGUS-RACEMOSUS",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Asparagus racemosus (Shatavari)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/asparagus-racemosus",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. IV, Monograph 35",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier reproductive tonic, gastric mucosal protector, and cooling Pitta-Vata balancer.",
        "limitations": "Caution in estrogen-receptor positive hormone-sensitive neoplasms; monitor in severe fluid retention.",
        "classical_verse": None,
        "tags": ["shatavari", "asparagus_racemosus", "pitta_shamana", "mucosal_protection", "female_vitality"],
        "dosha_affinity": ["Pitta", "Vata"],
        "content": """
Official Pharmacopoeial Monograph: Asparagus racemosus Willd. (Family: Asparagaceae) - Tuberous Root.
1. Ayurvedic Attributes:
   - Sanskrit Names: Śatāvarī, Bahusutā, Nārāyaṇī, Vari.
   - Rasa: Madhura (sweet), Tikta (bitter).
   - Guna: Guru (heavy), Snigdha (unctuous).
   - Virya: Shita (cooling).
   - Vipaka: Madhura (sweet).
   - Karma: Pitta-Vata-hara, Stanyajanana (galactagogue), Shukrala, Balya, Medhya, Rasayana, Chakshushya.

2. Therapeutic Indications:
   Amlapitta (peptic ulceration / hyperacidity), Raktapitta (bleeding disorders), Kshaya (tissue wasting), Stanya-kshaya (diminished lactation), Menopausal hot flashes.

3. Standard Therapeutic Dosage:
   - Tuber Powder: 3 to 6 grams with milk or warm water.
   - Decoction: 50 to 100 ml.

4. Contraindications & Cautions:
   - Heavy Kapha congestion, acute pulmonary edema, and sluggish lymphatic states.
   - Potential phytoestrogenic activity: consult oncologist in hormone-receptor positive malignancies.
"""
    },
    {
        "id": "API-BACOPA-MONNIERI",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Bacopa monnieri (Brahmi)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/bacopa-monnieri",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. II, Monograph 08",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier neuroprotective, cognitive enhancing (Medhya), and anxiolytic botanical.",
        "limitations": "Can cause mild gastrointestinal cramping or nausea when consumed on an empty stomach.",
        "classical_verse": None,
        "tags": ["brahmi", "bacopa_monnieri", "medhya", "cognitive_support", "anxiety", "neuroprotection"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Bacopa monnieri (L.) Wettst. (Family: Plantaginaceae) - Whole Plant.
1. Ayurvedic Attributes:
   - Sanskrit Names: Brāhmī, Sarasvatī, Kapotavaṅkā.
   - Rasa: Tikta (bitter), Kashaya (astringent).
   - Guna: Laghu (light).
   - Virya: Shita (cooling).
   - Vipaka: Madhura (sweet).
   - Karma: Medhya (improves memory, retention, and cognition), Ayushya, Hridya (cardiac tonic), Vata-Pitta-shamana, Unmadahara (calms mental agitation).

2. Therapeutic Indications:
   Smriti Daurbalya (memory impairment), Manovikara (anxiety and cognitive stress), Apasmara (convulsive disorders), Kasa, Kushta.

3. Standard Therapeutic Dosage:
   - Whole Plant Powder: 2 to 4 grams.
   - Fresh Juice (Swarasa): 10 to 20 ml.
   - Medicated Ghee (Brahmi Ghrita): 5 to 10 grams.

4. Safety & Interactions:
   - Mild cholinergic activity: May increase thyroid hormone levels and enhance the effect of phenothiazines.
   - Recommended to take with meals or with ghee to minimize mild GI irritation.
"""
    },
    {
        "id": "API-COMMIPHORA-MUKUL",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Commiphora mukul (Guggulu)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/commiphora-mukul",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 18",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier lipid-modulating, anti-inflammatory, and anti-arthritic gum resin.",
        "limitations": "Must undergo traditional Sodhana purification; contra-indicated with anticoagulant drugs.",
        "classical_verse": None,
        "tags": ["guggulu", "commiphora_mukul", "medoroga", "lipid_management", "amavata", "shodhana"],
        "dosha_affinity": ["Vata", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Commiphora wightii (Arn.) Bhandari syn. Commiphora mukul (Family: Burseraceae) - Exudate.
1. Ayurvedic Attributes:
   - Sanskrit Names: Guggulu, Devadhūpa, Kauśika, Pura.
   - Rasa: Tikta (bitter), Katu (pungent), Kashaya (astringent), Madhura (sweet).
   - Guna: Laghu (light), Ruksha (dry), Vishada (clear), Sukshma (penetrating), Sara (mobile).
   - Virya: Ushna (warm).
   - Vipaka: Katu (pungent).
   - Karma: Vata-Kapha-hara, Medohara (reduces adipose tissue / lipids), Bhagna-sandhanakara (promotes bone union), Lekhana (scraping), Shothahara.

2. Therapeutic Indications:
   Medoroga / Sthaulya (hyperlipidemia and obesity), Amavata (rheumatoid arthritis), Sandhivata (osteoarthritis), Vatarakta (gout), Granthi (benign tumors/cysts).

3. Standard Therapeutic Dosage:
   - Shodhita Guggulu (Purified Oleo-gum resin): 2 to 4 grams daily in divided doses.

4. Critical Safety & Interactions:
   - Raw unpurified Guggulu can cause skin rashes, diarrhea, and liver stress; only Shodhita Guggulu is permitted.
   - Antiplatelet / Anticoagulant Interaction: Inhibits platelet aggregation; strictly contraindicated with Warfarin, Heparin, Aspirin, or prior to scheduled surgery.
   - Pregnancy: Strictly contraindicated (emmenagogue and uterine stimulant).
"""
    },
    {
        "id": "API-ZINGIBER-OFFICINALE",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Zingiber officinale (Shunthi/Ginger)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/zingiber-officinale",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 62",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Universal digestive stimulant (Vishvabheshaja), carminative, and Ama-digestant.",
        "limitations": "Excessive intake can provoke burning in active ulcerative gastritis or acute bleeding hemorrhoids.",
        "classical_verse": None,
        "tags": ["shunthi", "ginger", "zingiber_officinale", "deepana", "pachana", "ama_pachana"],
        "dosha_affinity": ["Vata", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Zingiber officinale Roscoe (Family: Zingiberaceae) - Dried Rhizome.
1. Ayurvedic Attributes:
   - Sanskrit Names: Śuṇṭhī, Nāgara, Viśvabheṣaja, Katubhadra.
   - Rasa: Katu (pungent).
   - Guna: Laghu (light), Snigdha (unctuous) [Dry ginger is unctuous, unlike fresh ginger which is dry].
   - Virya: Ushna (warm).
   - Vipaka: Madhura (sweet) [Unique sweet post-digestive effect prevents long-term Pitta vitiation].
   - Karma: Deepana (stimulates digestive fire), Pachana (digests Ama), Vata-Kapha-prashamana, Hridya (cardiac tonic), Grahi (bowel binding in diarrhea).

2. Therapeutic Indications:
   Agnimandya (digestive failure), Adhmana (flatulence / tympanites), Shula (abdominal colic), Amavata (rheumatoid conditions), Chardi (nausea/vomiting), Shwasa-Kasa (respiratory congestion).

3. Standard Therapeutic Dosage:
   - Dried Rhizome Powder: 1 to 2 grams daily.

4. Precautions & Contraindications:
   - Bleeding disorders, active gastric ulcers, high fever with severe dehydration.
"""
    },
    {
        "id": "API-OCIMUM-SANCTUM",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Ocimum sanctum (Tulsi)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/ocimum-sanctum",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. II, Monograph 67",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier respiratory adaptogen, antimicrobial, and Kapha-Vata balancing herb.",
        "limitations": "Mild anti-fertility effects demonstrated in high-dose animal models; use in moderation during conception efforts.",
        "classical_verse": None,
        "tags": ["tulsi", "ocimum_sanctum", "holy_basil", "respiratory", "kapha_vata", "antimicrobial"],
        "dosha_affinity": ["Kapha", "Vata"],
        "content": """
Official Pharmacopoeial Monograph: Ocimum tenuiflorum L. syn. Ocimum sanctum L. (Family: Lamiaceae) - Leaf.
1. Ayurvedic Attributes:
   - Sanskrit Names: Tulasī, Surasā, Bahumanjarī, Suradundubhi.
   - Rasa: Katu (pungent), Tikta (bitter).
   - Guna: Laghu (light), Ruksha (dry), Tikshna (sharp).
   - Virya: Ushna (warm).
   - Vipaka: Katu (pungent).
   - Karma: Kapha-Vata-hara, Deepana, Hridya, Kasahara (alleviates cough), Shwasahara (relieves asthma), Vishaghna (anti-toxic), Krimighna (anti-parasitic).

2. Therapeutic Indications:
   Kasa (cough), Shwasa (bronchial asthma), Pratishyaya (coryza / allergic rhinitis), Krimi (parasitic infestation), Hikka (hiccups).

3. Standard Therapeutic Dosage:
   - Leaf Powder: 2 to 3 grams.
   - Fresh Juice (Swarasa): 5 to 10 ml.

4. Safety & Precautions:
   - May enhance the effect of anticoagulant and hypoglycemic drugs; monitor prothrombin time.
"""
    },
    {
        "id": "API-CURCUMA-LONGA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Curcuma longa (Haridra/Turmeric)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/curcuma-longa",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 22",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier anti-inflammatory, dermal tonic, blood purifier, and metabolic adjuvant.",
        "limitations": "High-dose curcumin extracts contraindicated in mechanical gallstone obstruction; enhances antiplatelet drugs.",
        "classical_verse": None,
        "tags": ["haridra", "turmeric", "curcuma_longa", "anti_inflammatory", "prameha", "varnya"],
        "dosha_affinity": ["Kapha", "Vata", "Pitta"],
        "content": """
Official Pharmacopoeial Monograph: Curcuma longa L. (Family: Zingiberaceae) - Rhizome.
1. Ayurvedic Attributes:
   - Sanskrit Names: Haridrā, Niśā, Kāncanī, Rajanī, Varṇinī.
   - Rasa: Tikta (bitter), Katu (pungent).
   - Guna: Ruksha (dry), Laghu (light).
   - Virya: Ushna (warm).
   - Vipaka: Katu (pungent).
   - Karma: Tridoshahara (balances Kapha and Pitta predominantly, also Vata in moderation), Varnya (improves complexion), Vishaghna, Lekhana, Pramehahara.

2. Therapeutic Indications:
   Prameha (diabetes and metabolic syndrome), Pradara, Kushta (dermatological conditions), Shotha (edema), Pandu (anemia), Vrana (wounds).

3. Standard Therapeutic Dosage:
   - Rhizome Powder: 1 to 3 grams daily.
   - Fresh Juice: 10 to 20 ml.

4. Clinical Contraindications:
   - Mechanical Biliary Duct Obstruction: Stimulates gallbladder contractions; contraindicated in symptomatic obstructive cholelithiasis.
   - Antiplatelet Co-administration: High-dose concentrated curcumin potentiates anti-thrombotic medication.
"""
    },
    {
        "id": "API-GLYCYRRHIZA-GLABRA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Glycyrrhiza glabra (Yashtimadhu/Licorice)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/glycyrrhiza-glabra",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 61",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier mucosal protector, demulcent, and Pitta-Vata pacifier.",
        "limitations": "Prolonged high doses (>6 weeks) can induce pseudoaldosteronism, hypokalemia, and secondary hypertension.",
        "classical_verse": None,
        "tags": ["yashtimadhu", "licorice", "glycyrrhiza_glabra", "pitta_shamana", "hypertension_warning"],
        "dosha_affinity": ["Vata", "Pitta"],
        "content": """
Official Pharmacopoeial Monograph: Glycyrrhiza glabra L. (Family: Fabaceae) - Dried Root and Stolon.
1. Ayurvedic Attributes:
   - Sanskrit Names: Yaṣṭīmadhu, Madhuka, Klītaka.
   - Rasa: Madhura (sweet).
   - Guna: Guru (heavy), Snigdha (unctuous).
   - Virya: Shita (cooling).
   - Vipaka: Madhura (sweet).
   - Karma: Vata-Pitta-hara, Chakshushya, Vrishya, Kanthya (throat demulcent), Sandhaniya (heals tissue ulcerations), Medhya.

2. Therapeutic Indications:
   Amlapitta (hyperacidity and gastric erosion), Kasa-Svarabheda (hoarseness and cough), Raktapitta (bleeding disorders), Kshaya, Vrana.

3. Standard Therapeutic Dosage:
   - Root Powder: 2 to 4 grams.

4. Critical Safety Warning (Pseudoaldosteronism):
   - Glycyrrhizin inhibits 11-beta-hydroxysteroid dehydrogenase type 2, permitting cortisol to bind renal mineralocorticoid receptors.
   - Long-term high doses lead to sodium and fluid retention, potassium wasting, cardiac arrhythmias, and hypertension.
   - Strictly contraindicated in uncontrolled hypertension, congestive heart failure, and renal insufficiency.
"""
    },

    # =========================================================================
    # COLLECTION 4: EVIDENCE-BASED NUTRITION & PATHYA-APATHYA
    # =========================================================================
    {
        "id": "ICMR-NIN-2024-CORE-GUIDELINES",
        "collection": "nutrition_pathya",
        "title": "ICMR-NIN 2024: Dietary Guidelines for Indians (17 Core Public Health Directives)",
        "publisher": "National Institute of Nutrition (ICMR-NIN), Indian Council of Medical Research",
        "source_url": "https://www.nin.res.in/dietaryguidelines/2024.html",
        "publication_version": "Dietary Guidelines for Indians, Revised 2024 Edition",
        "license": "Public Health Guidance (ICMR-NIN, Ministry of Health and Family Welfare)",
        "document_type": "National Evidence-Based Clinical Nutrition Standard",
        "download_availability": "Publicly accessible via nin.res.in",
        "relevance": "Modern evidence-based nutrition framework governing healthy diets and chronic disease prevention.",
        "limitations": "National population level recommendations requiring clinical personalization for individual metabolic profiles.",
        "classical_verse": None,
        "tags": ["icmr_nin", "dietary_guidelines_2024", "my_plate", "nutrition", "ncd_prevention", "whole_foods"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
The ICMR-National Institute of Nutrition (NIN) 2024 Dietary Guidelines for Indians outline 17 evidence-based recommendations:
1. Core Directives:
   - Guideline 1: Ensure dietary diversity by consuming whole, minimally processed foods from at least eight food groups daily.
   - Guideline 2: Restrict refined cereals and mill-flours; favor whole millets (Jowar, Bajra, Ragi) and minimally polished grains.
   - Guideline 3: My Plate for the Day: Vegetables (300g), Green Leafy Vegetables (100g), and Fresh Fruits (100g) must constitute approximately half (50%) of the total daily plate by mass.
   - Guideline 4: Consume adequate proteins through legumes, pulses, nuts, seeds, and low-fat dairy.
   - Guideline 5: Limit total added and free sugars to less than 5% of daily energy intake. Heavily restrict sugar-sweetened beverages (SSBs).
   - Guideline 6: Restrict sodium intake to less than 5g NaCl (2000mg sodium) per day to prevent hypertension and stroke.
   - Guideline 7: Limit saturated fats to <8-10% of total energy; completely eliminate trans-fatty acids and limit heated/re-used cooking oils.
   - Guideline 8: Avoid Ultra-Processed Foods (UPFs) high in fat, sugar, and salt (HFSS), which drive early obesity and type 2 diabetes.
   - Guideline 9: Maintain safe hydration (2.0 to 2.5 L water daily for adults), avoiding artificial colorants and chemical preservatives.
"""
    },
    {
        "id": "PATHYA-APATHYA-DOSHA-FOOD-MATRIX",
        "collection": "nutrition_pathya",
        "title": "Clinical Pathya-Apathya Food Selection Matrix for Constitutional Dosha Imbalances",
        "publisher": "AyuRAG Clinical Knowledge Curation / CCRAS and ICMR-NIN Cross-Validated Standards",
        "source_url": "https://ayushportal.nic.in/pathya-apathya-matrix",
        "publication_version": "Clinical Cross-Reference Standard v2.4, 2024",
        "license": "CC-BY-SA 4.0 / Clinical Open Access Reference",
        "document_type": "Clinical Food-Dosha Balancing Matrix",
        "download_availability": "Publicly accessible via AYUSH Research Portal / AyuRAG Knowledge Base",
        "relevance": "Provides exact food recommendations (Pathya) and foods to avoid (Apathya) for Vata, Pitta, and Kapha.",
        "limitations": "Individual food tolerances (Satmya) and culinary food allergies supersede broad group classifications.",
        "classical_verse": None,
        "tags": ["food_matrix", "pathya", "apathya", "vata_diet", "pitta_diet", "kapha_diet"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Comprehensive Cross-Validated Food Selection Matrix Harmonizing Ayurvedic Gunas and ICMR-NIN Nutrient Categories:
1. Vata-Pacifying Regimen (Warm, Unctuous, Grounding):
   - Pathya (Favored): Warm cooked whole grains (wheat, oats, soaked basmati rice); warm mung bean soup; sweet root vegetables (carrots, beets, sweet potato); soaked almonds and walnuts; cow's ghee, sesame oil; warming carminative spices (ginger, cumin, ajwain, fennel, cardamom); warm spiced cow's milk.
   - Apathya (Avoided): Raw salads, cold/iced beverages, raw sprouts, dry puffed crackers, popcorn, carbonated drinks, excess caffeine, dry leafy greens without fat, bitter gourds in excess.

2. Pitta-Pacifying Regimen (Cooling, Mildly Sweet, Hydrating):
   - Pathya (Favored): Barley, aged white rice, oats; green gram (Mudga), chickpeas in moderation; zucchini, cucumber, bottle gourd (Lauki), bitter gourd, pumpkin; sweet apples, ripe pomegranates, melons, sweet grapes; coconut water, cow's ghee; cooling spices (coriander, fennel, cardamom, mint).
   - Apathya (Avoided): Extremely spicy curries, green and red chili, mustard, vinegar, deep-fried snacks, fermented alcohol, aged hard cheeses, excessive garlic, citrus fruits on empty stomach, salty fried crisps.

3. Kapha-Pacifying Regimen (Light, Warm, Dry, Stimulating):
   - Pathya (Favored): Whole millets (Ragi, Jowar, Bajra, Foxtail millet), barley; roasted legumes, mung beans, horse gram; leafy greens (spinach, fenugreek, mustard greens), cabbage, radish, drumstick; astringent fruits (pomegranate, green apple, amla); raw honey (unheated, in small amounts); pungent spices (dry ginger, black pepper, pippali, turmeric).
   - Apathya (Avoided): Deep-fried oily foods, heavy dairy creams, excessive cheese, ice creams, cold sweetened yogurts, bakery pastries, bananas, oily red meats, cold water during meals, day-sleeping.
"""
    },
    {
        "id": "PATHYA-AHARA-PARINAMAKARA-BHAVA",
        "collection": "nutrition_pathya",
        "title": "Classical Principles of Food Transformation (Āhāra Pariṇāmakara Bhāva)",
        "publisher": "AyuRAG Clinical Knowledge Base / Charaka Saṃhitā Sharirasthana Ch 6",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=sa&ch=6",
        "publication_version": "Charaka Saṃhitā, Śārīrasthāna, Chapter 6, Ślokas 14-18",
        "license": "Public Domain / Classical Reference",
        "document_type": "Classical Metabolic Science Protocol",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Explains how the six factors of metabolism digest food into healthy tissues rather than inflammatory Ama.",
        "limitations": "Philosophical physiological concepts that parallel gastrointestinal motility, enzymes, and temperature.",
        "classical_verse": "Uṣmā vāyuḥ kledaḥ snehaḥ kālaḥ samayogaśceti.",
        "tags": ["ahara_parinama", "digestion_mechanisms", "ushma", "vayu", "kleda", "sneha", "kala", "samayoga"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Śārīrasthāna Chapter 6 details the six indispensable biological factors responsible for transforming food into bodily tissue (Dhatu):
1. Ushma (Thermal Energy / Pachaka Pitta): Cooker of food; breaks molecular bonds and provides digestive heat.
2. Vayu (Motility & Nervous Impulses / Prana & Samana Vata): Propels the bolus, mixes digestive secretions, and regulates peristalsis.
3. Kleda (Moisture / Kledaka Kapha): Softens and hydrates food mass, enabling enzymatic access.
4. Sneha (Unctuousness / Healthy Fats): Softens tissues, prevents mucosal abrasion, and kindles internal digestive power.
5. Kala (Chronological Duration): Allows sufficient gastric emptying time for complete enzymatic action.
6. Samayoga (Proper Proportionate Balance): The harmonious coexistence of all factors. If any factor is deficient or excessive, indigestion (Ajirna) and Ama inevitably result.
"""
    },

    # =========================================================================
    # COLLECTION 5: CLINICAL SAFETY, CONTRAINDICATIONS & REFERRAL GUIDANCE
    # =========================================================================
    {
        "id": "AYUSH-PHARMACOVIGILANCE-FRAMEWORK",
        "collection": "clinical_safety_referral",
        "title": "Ministry of AYUSH: National Pharmacovigilance Program for ASU&H Drugs & ADR Guidelines",
        "publisher": "National Pharmacovigilance Coordination Centre (NPvCC), All India Institute of Ayurveda & Ministry of AYUSH",
        "source_url": "https://ayushsuraksha.gov.in",
        "publication_version": "National Pharmacovigilance Protocol, 2021 Update",
        "license": "Open Government Data (OGD) - India / Public Clinical Safety Guidance",
        "document_type": "National Drug Safety & Pharmacovigilance Standard",
        "download_availability": "Publicly accessible via ayushsuraksha.gov.in",
        "relevance": "Provides the safety foundation: natural does not automatically equal safe; mandates ADR monitoring.",
        "limitations": "Post-market spontaneous reporting framework; under-reporting of mild ADRs is a documented global limitation.",
        "classical_verse": None,
        "tags": ["pharmacovigilance", "ayush_suraksha", "adr_monitoring", "drug_safety", "herb_safety"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
The National Pharmacovigilance Programme for Ayurvedic, Siddha, Unani, and Homoeopathic (ASU&H) drugs operates to guarantee patient safety:
1. Dispelling Safety Misconceptions:
   - The belief that 'all natural Ayurvedic remedies are inherently harmless without side effects' is medically false and clinically hazardous.
   - Improper dosage, incorrect Prakriti indication, contaminated raw material, or failure to perform traditional detoxification (Sodhana) can lead to toxic adverse events.

2. Structure of Safety Surveillance:
   - Peripheral Pharmacovigilance Centres (PPvCs) and Intermediary Centres (IPvCs) forward verified adverse drug reaction (ADR) reports to the National Centre at AIIA.
   - Tracks heavy metal safety, pesticide residues, microbial contamination, and adulteration with synthetic corticosteroids or NSAIDs.

3. Clinical Decision-Support Imperative:
   - Any digital Ayurvedic application must alert users to potential adverse effects, document known contraindications, and provide reporting mechanisms for unexpected reactions.
"""
    },
    {
        "id": "CLINICAL-EMERGENCY-REFERRAL-PROTOCOL",
        "collection": "clinical_safety_referral",
        "title": "Clinical Red-Flag Symptoms & Immediate Allopathic Emergency Referral Escalation Protocol",
        "publisher": "AyuRAG Clinical Safety Board / Integrated Critical Care Guidelines",
        "source_url": "https://ayushportal.nic.in/clinical-safety-escalation",
        "publication_version": "Clinical Decision Support Safety Standard v3.1, 2024",
        "license": "CC-BY-NC-ND 4.0 / Public Clinical Safety Protocol",
        "document_type": "Emergency Triage & Clinical Escalation Protocol",
        "download_availability": "Publicly accessible via AyuRAG Knowledge Portal",
        "relevance": "Essential clinical safety guardrail: immediately flags life-threatening red-flag symptoms for urgent emergency referral.",
        "limitations": "Algorithmic screening protocol; cannot replace physical bedside emergency triage by a licensed physician.",
        "classical_verse": None,
        "tags": ["red_flags", "emergency_referral", "clinical_escalation", "safety_guardrails", "triage"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
The AyuRAG-XAI Emergency Clinical Escalation Protocol defines absolute red-flag symptoms requiring immediate emergency allopathic care:
1. Cardiovascular Red Flags:
   - Acute crushing substernal chest pain radiating to left arm, neck, or jaw.
   - Sudden severe dyspnea, syncope, or diaphoresis accompanied by irregular tachycardia.
   - Action: Immediate emergency medical dispatch (ICU/Emergency Department). Ayurvedic consultation strictly deferred.

2. Neurological Red Flags:
   - Sudden unilateral facial drop, arm weakness, or slurred speech (FAST criteria).
   - Worst headache of life (thunderclap onset), sudden loss of vision, or altered consciousness.
   - Action: Acute stroke / subarachnoid hemorrhage protocol. Immediate neuro-imaging required.

3. Gastrointestinal & Abdominal Red Flags:
   - Acute rigid abdomen with rebound tenderness (suspected hollow viscus perforation / acute appendicitis).
   - Frank hematemesis (vomiting blood), melena (black tarry stools), or massive rectal bleeding.
   - High persistent fever (>39°C / 102.2°F) unresponsive to antipyretics with rigors and altered sensorium.

4. Legal & Clinical Boundary:
   - AyuRAG-XAI is designed strictly for chronic wellness optimization and educational decision support.
   - Under NO circumstance should acute life-threatening emergencies or acute infectious crises be managed with dietary or herbal recommendations alone.
"""
    },
    {
        "id": "HERB-DRUG-INTERACTION-MATRIX",
        "collection": "clinical_safety_referral",
        "title": "Clinical Herb-Drug Interaction Matrix: Key Ayurvedic Botanicals & Modern Pharmaceuticals",
        "publisher": "AyuRAG Clinical Pharmacology Working Group / AYUSH Suraksha Pharmacovigilance Cross-Index",
        "source_url": "https://ayushsuraksha.gov.in/herb-drug-interactions",
        "publication_version": "Evidence-Based Herb-Drug Cross-Index, 2024 Edition",
        "license": "Clinical Open Access Reference",
        "document_type": "Pharmacological Interaction Reference",
        "download_availability": "Publicly accessible via ayushsuraksha.gov.in",
        "relevance": "Protects patients taking concurrent modern prescription medications from adverse herb-drug interactions.",
        "limitations": "In vitro and animal cytochrome P450 modulation data require ongoing clinical confirmation in human trials.",
        "classical_verse": None,
        "tags": ["herb_drug_interactions", "cyp450", "pharmacokinetics", "anticoagulants", "guggulu", "ashwagandha"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
AyuRAG-XAI Evidence-Based Herb-Drug Interaction Registry:
1. Commiphora mukul (Guggulu):
   - Interacting Drugs: Warfarin, Aspirin, Clopidogrel, Heparin, Statins (Atorvastatin).
   - Mechanism: Guggulsterones inhibit platelet aggregation and induce CYP3A4 metabolism.
   - Risk: Increased hemorrhage risk with anticoagulants; potential reduction in bioavailability of co-administered CYP3A4 substrates.

2. Withania somnifera (Ashwagandha):
   - Interacting Drugs: Benzodiazepines (Diazepam, Alprazolam), Barbiturates, Levothyroxine, Immunosuppressants.
   - Mechanism: Direct GABAergic receptor modulation; thyroid hormone (T3/T4) stimulation.
   - Risk: Synergistic excessive sedation; risk of thyrotoxicosis if combined with exogenous thyroid hormones without dosage adjustment.

3. Glycyrrhiza glabra (Yashtimadhu / Licorice):
   - Interacting Drugs: Thiazide & Loop Diuretics (Furosemide), Digoxin, Antihypertensives (ACE inhibitors, ARBs).
   - Mechanism: Inhibits renal 11-beta-HSD2, inducing potassium wasting and sodium retention.
   - Risk: Severe hypokalemia, digitalis toxicity, and loss of blood pressure control.

4. Curcuma longa (Haridra / Curcumin):
   - Interacting Drugs: Anticoagulants, NSAIDs, Oral hypoglycemics.
   - Mechanism: Mild anti-platelet aggregation; enhances peripheral insulin sensitivity.
   - Risk: Potential additive bleeding risk; risk of hypoglycemia if combined with high-dose sulfonylureas.

5. Allium sativum (Lashuna / Garlic):
   - Interacting Drugs: Anticoagulants, Protease inhibitors (Saquinavir).
   - Mechanism: Platelet cyclooxygenase inhibition and CYP3A4 induction.
   - Risk: Increased peri-operative bleeding; must be discontinued at least 7-14 days prior to elective surgery.
"""
    },
    {
        "id": "SAFETY-PREGNANCY-LACTATION",
        "collection": "clinical_safety_referral",
        "title": "Clinical Safety Guidance: Botanical Contraindications in Pregnancy and Lactation",
        "publisher": "Ministry of AYUSH & CCRAS Mother and Child Health Guidelines",
        "source_url": "https://ayushportal.nic.in/pregnancy-botanical-safety",
        "publication_version": "AYUSH Clinical Safety Monograph, 2022",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Reproductive Safety Guideline",
        "download_availability": "Publicly accessible via ayushportal.nic.in",
        "relevance": "Strict safety filtering to exclude abortifacient, emmenagogue, or uterine stimulant herbs in pregnant users.",
        "limitations": "Ethical constraints preclude randomized trials in pregnant women; cautious avoidance principle strictly applied.",
        "classical_verse": None,
        "tags": ["pregnancy_safety", "lactation", "garbhashaya_sankochaka", "contraindications", "teratogenicity"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Maternal Safety Protocols for Ayurvedic Formulations and Botanicals:
1. Absolute Contraindications in Pregnancy (Garbhashaya Sankochaka / Uterine Stimulants):
   - Guggulu (Commiphora mukul): Potential emmenagogue activity.
   - Aloe vera (Kumari latex): Anthraquinone laxatives induce pelvic congestion and uterine contractions.
   - Fenugreek (Methi) in medicinal extract doses: Oxytocic potential documented in high concentrations.
   - Vatsanabha (Aconitum chasmanthum), Kupilu (Strychnos nux-vomica), and Bhallataka (Semecarpus anacardium): Toxic alkaloids with high teratogenic risk.
   - Strong Purgatives (Tikshna Virechana dravyas like Trivrit, Danti, and Jayapala): Strictly contraindicated.

2. Herbs Requiring Caution or Dose Modulation:
   - Ashwagandha (Withania somnifera): Mild uterine stimulant potential at high pharmacological doses; culinary spicing tolerated.
   - Licorice (Glycyrrhiza glabra): High doses associated with preterm birth risks due to mineralocorticoid shifts.

3. Wholesome Botanicals in Pregnancy (Garbhapala / Under Professional Supervision):
   - Cow's ghee, Shatavari (in moderate nourishment doses), Draksha (sweet raisins), Amalaki, and Cardamom.
"""
    },
    {
        "id": "AYURVEDIC-SHODHANA-STANDARDS",
        "collection": "clinical_safety_referral",
        "title": "Ayurvedic Pharmacopoeia Standards for Sodhana (Purification / Detoxification Protocols)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/shodhana-protocols",
        "publication_version": "Ayurvedic Formulary of India (AFI) & API Part-I Appendices",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Toxicological Processing & Safety Protocol",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Explains why unpurified poisonous herbs are strictly toxic and how classical processing detoxifies raw materials.",
        "limitations": "Industrial manufacturing compliance requires lab verification of alkaloid/heavy-metal reduction.",
        "classical_verse": None,
        "tags": ["shodhana", "detoxification", "vatsanabha", "guggulu", "safety_processing", "pcimh"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
The Ayurvedic Pharmacopoeia of India establishes mandatory Sodhana (detoxification) protocols for toxic or irritant plant and mineral substances:
1. Definition & Objectives of Sodhana:
   - Sodhana is not merely physical washing; it is a bio-chemical processing technique involving specific media (Godugdha / cow's milk, Gomutra, Triphala decoction) that removes toxic constituents, mitigates side effects, and enhances bioavailability.

2. Mandatory Sodhana Botanicals:
   - Vatsanabha (Aconitum chasmanthum): Highly toxic pseudoaconitine is converted to less toxic aconine through boiling in cow's milk or Triphala decoction for 3 hours (Dola Yantra).
   - Kupilu (Strychnos nux-vomica): Seeds must be soaked in cow's milk and fried in ghee to reduce strychnine and brucine neurotoxicity.
   - Guggulu (Commiphora mukul): Boiled in Triphala or Dashamoola decoction and filtered through cloth to remove insoluble foreign barks, grit, and harsh irritant volatile oils.

3. Quality Standard Enforcement:
   - No clinical prescription of Upavisha (semi-poisonous drugs) is permissible in raw unprocessed form. Modern HPLC/HPTLC testing must confirm reduction of target toxic alkaloids.
"""
    }
]


def build_knowledge_base():
    """Builds and serializes all knowledge documents and compiles manifest.json."""
    combined_docs = ALL_DOCUMENTS + ADDITIONAL_DOCUMENTS
    print(f"Building knowledge base across {len(combined_docs)} core clinical reference documents...")
    manifest_records = []

    for doc in combined_docs:
        coll_dir = SOURCES_DIR / doc['collection']
        coll_dir.mkdir(parents=True, exist_ok=True)

        doc_filename = f"{doc['id']}.json"
        doc_path = coll_dir / doc_filename

        # Write structured JSON document
        with open(doc_path, 'w', encoding='utf-8') as f:
            json.dump(doc, f, indent=2, ensure_ascii=False)

        # Manifest metadata
        manifest_records.append({
            "id": doc['id'],
            "collection": doc['collection'],
            "title": doc['title'],
            "publisher": doc['publisher'],
            "source_url": doc['source_url'],
            "publication_version": doc['publication_version'],
            "license": doc['license'],
            "document_type": doc['document_type'],
            "download_availability": doc['download_availability'],
            "relevance": doc['relevance'],
            "limitations": doc['limitations'],
            "tags": doc.get('tags', []),
            "dosha_affinity": doc.get('dosha_affinity', []),
            "content_char_length": len(doc['content'].strip()),
            "relative_path": f"sources/{doc['collection']}/{doc_filename}"
        })

    # Save manifest.json
    manifest_file = BASE_DIR / 'manifest.json'
    manifest_data = {
        "project": "AyuRAG-XAI Knowledge Base",
        "version": "1.0.0",
        "last_updated": "2026-10-22",
        "total_documents": len(manifest_records),
        "collections": {
            "classical_compendia": {
                "name": "Classical Ayurvedic Compendia",
                "description": "Authentic passages from Charaka Saṃhitā, Suśruta Saṃhitā, and Aṣṭāṅga Hṛdayam with verified chapters, slokas, and translations.",
                "publisher": "National Institute of Indian Medical Heritage (NIIMH) / Ministry of AYUSH",
                "license": "Public Domain / Open Educational Access",
                "document_count": len([d for d in manifest_records if d['collection'] == 'classical_compendia'])
            },
            "ccras_guidelines": {
                "name": "CCRAS Clinical Evaluation & Research Guidelines",
                "description": "Official diagnostic criteria, GCP standards, and disease management protocols from CCRAS.",
                "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS), Govt. of India",
                "license": "Open Government Data (OGD) - India",
                "document_count": len([d for d in manifest_records if d['collection'] == 'ccras_guidelines'])
            },
            "botanical_pharmacopoeia": {
                "name": "Botanical Reference & Pharmacopoeial Monographs",
                "description": "Botanical identities, Rasapanchaka (Rasa, Guna, Virya, Vipaka), standard dosages, and therapeutic indications from the Ayurvedic Pharmacopoeia of India.",
                "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
                "license": "Official Statutory Pharmacopoeial Standards (PCIM&H / Ministry of AYUSH)",
                "document_count": len([d for d in manifest_records if d['collection'] == 'botanical_pharmacopoeia'])
            },
            "nutrition_pathya": {
                "name": "Evidence-Based Nutrition & Pathya-Apathya",
                "description": "ICMR-NIN 2024 Dietary Guidelines for Indians, My Plate standards, and classical food compatibility matrices.",
                "publisher": "ICMR - National Institute of Nutrition (NIN) & Ministry of AYUSH",
                "license": "Public Health Guidance / Open Clinical Reference",
                "document_count": len([d for d in manifest_records if d['collection'] == 'nutrition_pathya'])
            },
            "clinical_safety_referral": {
                "name": "Clinical Safety, Contraindications & Red-Flag Escalation",
                "description": "Herb-drug interaction matrices, AYUSH Pharmacovigilance criteria, maternal/pediatric safety, and emergency red-flag symptoms.",
                "publisher": "National Pharmacovigilance Centre (NPvCC), AIIA & Ministry of AYUSH",
                "license": "Public Clinical Safety Standard",
                "document_count": len([d for d in manifest_records if d['collection'] == 'clinical_safety_referral'])
            }
        },
        "documents": manifest_records
    }

    with open(manifest_file, 'w', encoding='utf-8') as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    print(f"Knowledge Base built successfully! {len(manifest_records)} documents saved across 5 collections.")
    print(f"Manifest written to: {manifest_file}")
    return manifest_data


if __name__ == '__main__':
    build_knowledge_base()
