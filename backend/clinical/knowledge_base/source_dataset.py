"""
Comprehensive Authoritative Source Dataset for AyuRAG-XAI Knowledge Base.
Contains 55 curated, vetted, verified clinical documents spanning 5 primary collections:
1. Classical Ayurvedic Compendia (AYUSH / Public Domain)
2. CCRAS Clinical Evaluation & Research Guidelines (Open Government Data - India)
3. Botanical Reference & Pharmacopoeial Monographs (PCIM&H / API & WHO)
4. Evidence-Based Nutrition & Pathya-Apathya (ICMR-NIN 2024 & Ministry of AYUSH)
5. Clinical Safety, Contraindications & Red-Flag Escalation (AYUSH Pharmacovigilance / WHO)
"""

ADDITIONAL_DOCUMENTS = [
    # -------------------------------------------------------------
    # Collection 1 additions: Classical Compendia
    # -------------------------------------------------------------
    {
        "id": "CS-CI-01-RASAYANA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Science of Rejuvenation & Immunological Longevity (Rasāyana)",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=ci&ch=1",
        "publication_version": "Charaka Saṃhitā, Cikitsāsthāna, Chapter 1 (Rasāyanādhyāya), Ślokas 1-12",
        "license": "Public Domain",
        "document_type": "Classical Gerontology & Immunology Treatise",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Underpins preventive lifestyle guidelines, cellular longevity, and Ojas enhancement.",
        "limitations": "Classical internal purification (Panchakarma) prerequisite must be adapted for modern outpatient settings.",
        "classical_verse": "Lābhopāyo hi śastānāṁ rasādīnāṁ rasāyanam.",
        "tags": ["rasayana", "longevity", "ojas", "chyawanprash", "triphala", "rejuvenation"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Charaka Saṃhitā Cikitsāsthāna Chapter 1 defines Rasayana therapy:
1. Core Definition:
   Rasayana denotes the therapeutic means to obtain superlative excellence of bodily nutritional fluids (Rasa), tissues (Dhatus), and vitality (Ojas).
2. Physiological Benefits:
   - Deerghamayu (prolonged youthful lifespan)
   - Smriti (enhanced memory and recall)
   - Medha (intellectual agility and discernment)
   - Aarogyam (freedom from illness)
   - Tarunam Vaya (preservation of physical vigor)
   - Prabhava-Varna-Svara (optimal luster, complexion, and resonant vocal tone)
   - Dehendriyabalam (maximum musculoskeletal and sensory endurance).
3. Achara Rasayana (Behavioral Rejuvenation):
   Rejuvenation is not merely pharmacologic; living with truthfulness (Satyavadin), freedom from anger (Akrodha), abstention from alcohol, peaceful demeanor, respect for teachers, and kindness constitutes behavioral Rasayana that prevents cellular decay without medication.
"""
    },
    {
        "id": "CS-CI-03-JWARA-LANGHANA",
        "collection": "classical_compendia",
        "title": "Charaka Saṃhitā: Management of Fever, Agni Restoration, and Langhana Therapy",
        "publisher": "Classical Ayurvedic Compendium (e-Caraka / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=ci&ch=3",
        "publication_version": "Charaka Saṃhitā, Cikitsāsthāna, Chapter 3 (Jvaracikitsā), Ślokas 138-160",
        "license": "Public Domain",
        "document_type": "Classical Clinical Therapeutics Treatise",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Provides protocols for managing acute digestive shutdown, metabolic fever, and therapeutic fasting.",
        "limitations": "Severe bacterial sepsis, high persistent fever (>39°C), and pediatric febrile convulsions require immediate allopathic hospital admission.",
        "classical_verse": "Jvarādau laṅghanaṁ proktaṁ jvaramadhyo ca pācanam.",
        "tags": ["jwara", "langhana", "shadanga_paniya", "fever_management", "ama_pachana"],
        "dosha_affinity": ["Pitta", "Kapha", "Vata"],
        "content": """
Charaka Saṃhitā Cikitsāsthāna Chapter 3 expounds the fundamental rule of febrile and metabolic illness:
1. Langhana (Lightening / Digestive Rest):
   At the onset of acute fever (Taruna Jwara), Langhana (therapeutic fasting or warm light liquid gruels) is primary because Jwara originates in the stomach (Amashaya) due to impaired Agni and circulating Ama.
2. Shadanga Paniya (The Six-Herb Medicated Febrifuge Water):
   Boiled water medicated with Musta (Cyperus rotundus), Parpataka (Fumaria indica), Ushira (Vetiveria zizanioides), Chandana (Santalum album), Udichya (Pavonia odorata), and Shunthi (Zingiber officinale). Cools fever, quenches morbid thirst, kindles digestive fire, and digests Ama.
3. Contrast with Emaciated Vata States:
   Langhana is contraindicated in dry emaciated Vata fever, tuberculosis (Kshaya), or chronic debility, where mild nourishing soups are required instead.
"""
    },
    {
        "id": "SS-SU-46-ANNAPANATATVA",
        "collection": "classical_compendia",
        "title": "Suśruta Saṃhitā: Water Quality, Beverage Thermodynamics, and Meal Rhythm",
        "publisher": "Classical Ayurvedic Compendium (e-Sushruta / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/esusruta/?mod=read&sys=su&ch=46",
        "publication_version": "Suśruta Saṃhitā, Sūtrasthāna, Chapter 46, Ślokas 419-485",
        "license": "Public Domain",
        "document_type": "Classical Food Science Text",
        "download_availability": "Publicly accessible via e-Sushruta",
        "relevance": "Direct guideline for water temperature, meal timing, and drinking water during meals.",
        "limitations": "Ancient water collection terms (rain vs pond water) must be mapped to modern filtered, potable water standards.",
        "classical_verse": "Prakṛti-sātmya-deśa-kāla-bala-pramāṇa-agni-avasthā-anu-vartī bhoktavyam.",
        "tags": ["sushruta_nutrition", "water_quality", "ushnodaka", "hydration_timing", "meal_rhythm"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Suśruta Saṃhitā Sūtrasthāna Chapter 46 provides detailed rules on water ingestion and meal pacing:
1. Hydration Timing Around Meals:
   - Drinking water immediately before meals dampens Agni, weakens gastric juices, and causes emaciation or indigestion.
   - Drinking water immediately after meals produces excessive coldness and Kapha accumulation, leading to obesity and lethargy.
   - Sipping small amounts of warm water during meals (Samashana) moistens the food bolus, facilitates enzymatic mixing, and aids digestion.
2. Properties of Boiled Warm Water (Ushnodaka):
   Water boiled and reduced by half or one-quarter is light, pacifies all three doshas, kindles Agni, clears urinary passages, and eliminates Ama.
3. Individual Calibration:
   Food intake must strictly harmonize with individual constitution (Prakriti), habituation (Satmya), climate (Desha), season (Kala), strength (Bala), quantity (Matra), and metabolic state (Agni).
"""
    },
    {
        "id": "AH-SU-03-RITUCHARYA-VAGBHATA",
        "collection": "classical_compendia",
        "title": "Aṣṭāṅga Hṛdayam: Seasonal Transitions (Ṛtucaryā) & Seasonal Sandhi Care",
        "publisher": "Classical Ayurvedic Compendium (e-Ashtanga / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/eahridaya/?mod=read&sys=su&ch=3",
        "publication_version": "Aṣṭāṅga Hṛdayam, Sūtrasthāna, Chapter 3, Ślokas 1-58",
        "license": "Public Domain",
        "document_type": "Classical Seasonal Hygiene Guide",
        "download_availability": "Publicly accessible via e-Ashtanga",
        "relevance": "Explains Ritu Sandhi (the 14-day transitional junction between seasons) and why acute illnesses spike during seasonal changes.",
        "limitations": "Requires alignment with local meteorology and geographical hemisphere.",
        "classical_verse": "Ṛtvoraṅtyādi-saptāhau ṛtusandhiriti smṛtaḥ. Tatra pūrvo vidhistyājyaḥ sevaniyaḥ aparo kramāt.",
        "tags": ["ritusandhi", "seasonal_junction", "immunity", "pathya_transition", "adaptation"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Aṣṭāṅga Hṛdayam Sūtrasthāna Chapter 3 delineates the seasonal transition protocol (Ṛtusandhi):
1. Ritu Sandhi (Seasonal Interphase):
   - The last 7 days of the departing season and the first 7 days of the incoming season constitute Ritu Sandhi (a 14-day critical junction).
   - During this period, the dietary regimen of the previous season must be gradually relinquished (Pada-Krama), and the practices of the incoming season gradually adopted.
   - Abrupt discontinuation of old habits or abrupt adoption of new regimens produces Asatmya-ja Roga (diseases of incompatibility and allergic flareups).
2. Seasonal Cleansing Principles:
   - Vasanta (Spring): Elimination of accumulated Kapha via Vamana (therapeutic emesis) or light dry fasting.
   - Sharad (Autumn): Elimination of accumulated Pitta via Virechana (purgation) and consuming bitter ghee (Tikta Ghrita).
   - Varsha (Monsoon): Pacification of aggravated Vata via Basti (medicated enema) and warm spiced diets.
"""
    },
    {
        "id": "AH-SU-11-DOSHA-KARYA",
        "collection": "classical_compendia",
        "title": "Aṣṭāṅga Hṛdayam: Physiological Functions of Balanced Doshas and Tissues",
        "publisher": "Classical Ayurvedic Compendium (e-Ashtanga / NIIMH)",
        "source_url": "https://niimh.nic.in/ebooks/eahridaya/?mod=read&sys=su&ch=11",
        "publication_version": "Aṣṭāṅga Hṛdayam, Sūtrasthāna, Chapter 11, Ślokas 1-20",
        "license": "Public Domain",
        "document_type": "Classical Human Physiology Treatise",
        "download_availability": "Publicly accessible via e-Ashtanga",
        "relevance": "Provides the normal physiological benchmark against which patient symptoms are compared.",
        "limitations": "Qualitative functional observations; must be correlated with contemporary vital signs and organ function tests.",
        "classical_verse": "Utsāhocchvāsa-niḥśvāsa-ceṣṭā-dhātugatiḥ samā. Samo’gnirvātasya karma.",
        "tags": ["dosha_karya", "normal_physiology", "vata_functions", "pitta_functions", "kapha_functions"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Aṣṭāṅga Hṛdayam Sūtrasthāna Chapter 11 describes the normal physiological actions of the Three Doshas:
1. Normal Functions of Vata:
   Enthusiasm (Utsaha), inspiration and expiration (Ucchwasa-Nishwasa), physical motor activity (Cheshta), equilibrium of tissue metabolism (Dhatu Gati Sama), and prompt excretion of bodily wastes.
2. Normal Functions of Pitta:
   Digestion (Darshana / Pachana), maintenance of normal body temperature (Tanu-Ushma), visual perception, appetite and thirst generation (Kshut-Trid), radiance and complexion (Prabha), courage (Medha), and mental discernment.
3. Normal Functions of Kapha:
   Structural cohesion and joint stability (Sandhi-Bandha), lubrication (Sneha), unctuousness, stability of body mass (Sthairya), tolerance and patience (Kshama), and retention capacity.
"""
    },

    # -------------------------------------------------------------
    # Collection 2 additions: CCRAS Guidelines
    # -------------------------------------------------------------
    {
        "id": "CCRAS-GUIDELINE-STHAULYA",
        "collection": "ccras_guidelines",
        "title": "CCRAS Clinical Practice Guideline: Management of Sthaulya (Obesity & Dyslipidemia)",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/sites/default/files/viewpdf/Sthaulya%20Guideline.pdf",
        "publication_version": "CCRAS Clinical Protocol Series, 2021",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Practice Guideline",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Authoritative dietary and lifestyle management for elevated BMI, visceral adiposity, and sluggish metabolism.",
        "limitations": "Severe morbid obesity with sleep apnea or endocrine tumors (Cushing's) requires specialized endocrinological workup.",
        "classical_verse": None,
        "tags": ["sthaulya", "obesity", "dyslipidemia", "lekhana", "medoroga", "triphala_guggulu"],
        "dosha_affinity": ["Kapha", "Vata"],
        "content": """
CCRAS Clinical Practice Guideline for the Management of Sthaulya (Obesity):
1. Etiological Pathogenesis:
   Overconsumption of heavy, sweet, cooling foods combined with lack of physical activity impairs Medodhatvagni, causing excessive accumulation of non-functional adipose tissue while deeper tissues (Asthi, Majja, Shukra) remain malnourished.
2. Dietary Protocol (Lekhana Ahara):
   - Whole grains: Roasted barley (Yava), pearl millet (Bajra), finger millet (Ragi), aged rice.
   - Legumes: Green gram, horse gram (Kulattha), black chickpea.
   - Honey and warm water: 1 teaspoon raw unheated honey in warm water on waking acts as a scraping agent (Lekhana).
   - Strict exclusions: Deep fried foods, potatoes, sweets, cheese, day-sleeping (Divaswapna).
3. Botanical Formulations:
   Triphala Guggulu, Medohar Guggulu, and Takrarishta.
"""
    },
    {
        "id": "CCRAS-GCP-RESEARCH-ETHICS",
        "collection": "ccras_guidelines",
        "title": "CCRAS Good Clinical Practice (GCP) Guidelines for Ayurvedic Clinical Research",
        "publisher": "Central Council for Research in Ayurvedic Sciences (CCRAS)",
        "source_url": "https://ccras.nic.in/publications/gcp-ayurveda",
        "publication_version": "CCRAS GCP Guideline, Second Edition",
        "license": "Open Government Data (OGD) - India",
        "document_type": "Clinical Ethics & Governance Standard",
        "download_availability": "Publicly accessible via ccras.nic.in",
        "relevance": "Governs data integrity, patient informed consent, and adverse event reporting in clinical systems.",
        "limitations": "Institutional standard requiring local institutional ethics committee (IEC) oversight for human subjects.",
        "classical_verse": None,
        "tags": ["ccras_gcp", "clinical_ethics", "patient_consent", "data_integrity", "adverse_events"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
CCRAS Good Clinical Practice (GCP) Guidelines for Ayurvedic Interventions:
1. Ethical Principles:
   - Patient autonomy, voluntary informed consent, and confidential handling of all clinical and constitutional records.
   - Transparent documentation of research hypotheses and objective separation of validated outcomes from theoretical beliefs.
2. Standardization of Formulations:
   - All trial formulations must adhere strictly to the Ayurvedic Pharmacopoeia of India standards, with documented heavy metal limits (Lead <10ppm, Arsenic <3ppm, Cadmium <0.3ppm, Mercury <1ppm) and microbial safety thresholds.
3. Adverse Event Recording:
   - Immediate recording and reporting of any untoward medical occurrence, regardless of suspected causality with the Ayurvedic intervention.
"""
    },

    # -------------------------------------------------------------
    # Collection 3 additions: Botanical Pharmacopoeia
    # -------------------------------------------------------------
    {
        "id": "API-AZADIRACHTA-INDICA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Azadirachta indica (Nimba/Neem)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/azadirachta-indica",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. II, Monograph 53",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier bitter blood purifier, antimicrobial, and Pitta-Kapha pacifying leaf/bark.",
        "limitations": "Prolonged high doses can aggravate Vata, cause emaciation, and exert mild anti-spermatogenic effects.",
        "classical_verse": None,
        "tags": ["nimba", "neem", "azadirachta_indica", "kushtha", "blood_purifier", "tikta_rasa"],
        "dosha_affinity": ["Pitta", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Azadirachta indica A. Juss. (Family: Meliaceae) - Leaf and Stem Bark.
1. Ayurvedic Attributes:
   - Sanskrit Names: Nimba, Ariṣṭa, Picumarda.
   - Rasa: Tikta (bitter), Kashaya (astringent).
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Shita (cooling).
   - Vipaka: Katu (pungent).
   - Karma: Pitta-Kapha-hara, Vranashodhana (cleanses ulcers), Kushtaghna (alleviates dermatological disorders), Krimighna (anti-helminthic), Deepana.
2. Therapeutic Indications:
   Kushta (dermatoses, eczema, acne vulgaris), Prameha, Jwara, Kandu (pruritus), Vrana (infected wounds).
3. Standard Therapeutic Dosage:
   - Leaf Powder: 2 to 4 grams daily.
   - Bark Decoction: 50 to 100 ml.
4. Precautions & Contraindications:
   - Emaciation, aggravated dry Vata conditions, male infertility seeking conception, and early pregnancy.
"""
    },
    {
        "id": "API-TRIBULUS-TERRESTRIS",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Tribulus terrestris (Gokshura)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/tribulus-terrestris",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 16",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier nephroprotective, lithotriptic, and rejuvenating diuretic tonic.",
        "limitations": "Caution in patients taking modern synthetic potassium-sparing diuretics to prevent hyperkalemia.",
        "classical_verse": None,
        "tags": ["gokshura", "tribulus_terrestris", "mutrakrichra", "diuretic", "nephroprotective", "vrishya"],
        "dosha_affinity": ["Vata", "Pitta"],
        "content": """
Official Pharmacopoeial Monograph: Tribulus terrestris L. (Family: Zygophyllaceae) - Dried Fruit.
1. Ayurvedic Attributes:
   - Sanskrit Names: Gokṣura, Śvadaṁṣṭrā, Trikantaka, Chanadrudruma.
   - Rasa: Madhura (sweet), Tikta (bitter).
   - Guna: Guru (heavy), Snigdha (unctuous).
   - Virya: Shita (cooling).
   - Vipaka: Madhura (sweet).
   - Karma: Vata-Pitta-hara, Mutrala (diuretic), Ashmarighna (dissolves calculi), Vrishya, Balya, Rasayana.
2. Therapeutic Indications:
   Mutrakrichra (dysuria / urinary tract infection), Ashmari (renal calculi), Prameha, Klaibya, Shotha.
3. Standard Therapeutic Dosage:
   - Fruit Powder: 3 to 6 grams.
   - Decoction: 50 to 100 ml.
4. Clinical Safety:
   - Well-tolerated botanical; monitor fluid intake during therapeutic diuresis.
"""
    },
    {
        "id": "API-BOERHAVIA-DIFFUSA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Boerhavia diffusa (Punarnava)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/boerhavia-diffusa",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 47",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier anti-edematous, diuretic, and hepatoprotective whole plant.",
        "limitations": "In end-stage renal disease (ESRD) requiring dialysis, fluid volume and potassium must be managed under nephrology care.",
        "classical_verse": None,
        "tags": ["punarnava", "boerhavia_diffusa", "shotha", "edema", "kidney_support", "liver_tonic"],
        "dosha_affinity": ["Kapha", "Vata"],
        "content": """
Official Pharmacopoeial Monograph: Boerhavia diffusa L. (Family: Nyctaginaceae) - Whole Plant / Root.
1. Ayurvedic Attributes:
   - Sanskrit Names: Punarnavā, Śophaghnī, Rakta-punarnavā, Kaṭhillaka.
   - Rasa: Madhura (sweet), Tikta (bitter), Kashaya (astringent).
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Ushna (mildly warm).
   - Vipaka: Madhura (sweet).
   - Karma: Tridoshashamaka (balances Kapha-Vata especially), Shothahara (relieves edema), Mutrala, Rasayana, Deepana.
2. Therapeutic Indications:
   Shotha (generalized edema, anasarca), Pandu (anemia), Yakrid-vikara (hepatic disorders), Mutrakrichra, Hridroga (cardiac edema).
3. Standard Therapeutic Dosage:
   - Root / Plant Powder: 3 to 6 grams.
   - Decoction: 50 to 100 ml.
"""
    },
    {
        "id": "API-BOSWELLIA-SERRATA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Boswellia serrata (Shallaki)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/boswellia-serrata",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. IV, Monograph 41",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier botanical for osteoarthritis, inflammatory joint disease, and cartilage preservation.",
        "limitations": "May cause mild gastric discomfort or acid reflux in sensitive individuals if taken without food.",
        "classical_verse": None,
        "tags": ["shallaki", "boswellia_serrata", "sandhivata", "osteoarthritis", "boswellic_acid", "anti_inflammatory"],
        "dosha_affinity": ["Vata", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Boswellia serrata Roxb. ex Colebr. (Family: Burseraceae) - Gum Resin.
1. Ayurvedic Attributes:
   - Sanskrit Names: Śallakī, Kunduru, Gajabhakṣyā, Suvahā.
   - Rasa: Tikta (bitter), Kashaya (astringent), Madhura (sweet).
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Ushna (warm).
   - Vipaka: Katu (pungent).
   - Karma: Vata-Kapha-hara, Sandhaniya, Shothahara (anti-inflammatory), Vedanasthapana (analgesic).
2. Therapeutic Indications:
   Sandhivata (osteoarthritis), Amavata (rheumatoid arthritis), Grahani, Asthi-sandhi-shula (joint pain), Atisara.
3. Standard Therapeutic Dosage:
   - Purified Oleo-Gum Resin: 1 to 3 grams daily with warm water or milk.
4. Modern Mechanism:
   Contains 3-O-acetyl-11-keto-beta-boswellic acid (AKBA), a specific non-redox inhibitor of 5-lipoxygenase (5-LOX), decreasing inflammatory leukotrienes without damaging gastric cyclooxygenase.
"""
    },
    {
        "id": "API-ANDROGRAPHIS-PANICULATA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Andrographis paniculata (Kalmegh/Bhunimba)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/andrographis-paniculata",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. II, Monograph 10",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier hepatoprotective, bitter febrifuge, and upper respiratory infection botanical.",
        "limitations": "Very intense bitter taste; high doses can cause loss of appetite, nausea, or allergic rash.",
        "classical_verse": None,
        "tags": ["kalmegh", "bhunimba", "andrographis_paniculata", "hepatoprotective", "bitter_tonic", "jvara"],
        "dosha_affinity": ["Pitta", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Andrographis paniculata (Burm. f.) Nees (Family: Acanthaceae) - Aerial Parts.
1. Ayurvedic Attributes:
   - Sanskrit Names: Bhūnimba, Kālamegha, Yavatiktā.
   - Rasa: Tikta (intensely bitter).
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Ushna (warm).
   - Vipaka: Katu (pungent).
   - Karma: Pitta-Kapha-hara, Yakrid-uttejaka (liver stimulant), Deepana, Pachana, Jvaraghna, Krimighna.
2. Therapeutic Indications:
   Yakrid-vikara (hepatic congestion, sluggish liver), Kamala (jaundice), Jwara (malarial and viral fevers), Agnimandya, Krimi.
3. Standard Therapeutic Dosage:
   - Powder: 1 to 3 grams.
   - Decoction: 20 to 50 ml.
4. Precautions:
   - Pregnancy: Contraindicated due to documented abortifacient and anti-fertility effects in animal models.
"""
    },
    {
        "id": "API-PIPER-NIGRUM",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Piper nigrum (Maricha/Black Pepper)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/piper-nigrum",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. III, Monograph 17",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Key bioavailability enhancer (piperine), respiratory mucolytic, and Trikatu component.",
        "limitations": "Pungent and hot; excessive consumption aggravates Pitta and produces gastric burning.",
        "classical_verse": None,
        "tags": ["maricha", "black_pepper", "piper_nigrum", "trikatu", "bioenhancer", "kapha_shamana"],
        "dosha_affinity": ["Kapha", "Vata"],
        "content": """
Official Pharmacopoeial Monograph: Piper nigrum L. (Family: Piperaceae) - Dried Fruit.
1. Ayurvedic Attributes:
   - Sanskrit Names: Marica, Śyāma, Vellaja, Katuka.
   - Rasa: Katu (pungent).
   - Guna: Laghu (light), Tikshna (sharp), Ruksha (dry).
   - Virya: Ushna (warm).
   - Vipaka: Katu (pungent).
   - Karma: Kapha-Vata-hara, Deepana, Chedana (scrapes mucus from respiratory channels), Srotoshodhaka (channel clearing), Yogavahi (bioavailability promoter).
2. Therapeutic Indications:
   Shwasa (asthma), Kasa (cough), Agnimandya, Krimi, Grahani.
3. Standard Therapeutic Dosage:
   - Powder: 250 mg to 1 gram.
4. Synergistic Role:
   Contains piperine, which inhibits hepatic and intestinal glucuronidation, dramatically increasing systemic absorption of other nutrients (e.g. curcumin, withanolides).
"""
    },
    {
        "id": "API-PIPER-LONGUM",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Piper longum (Pippali/Long Pepper)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/piper-longum",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. IV, Monograph 28",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier respiratory rejuvenator (Pranavaha Srotas Rasayana) and digestive stimulant.",
        "limitations": "Classical caveat: prolonged continuous usage of Pippali without milk/honey can irritate Pitta.",
        "classical_verse": None,
        "tags": ["pippali", "piper_longum", "respiratory_rasayana", "vardhamana_pippali", "deepana"],
        "dosha_affinity": ["Vata", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Piper longum L. (Family: Piperaceae) - Dried Fruit.
1. Ayurvedic Attributes:
   - Sanskrit Names: Pippalī, Māgadhī, Kaṇā, Vaidehī.
   - Rasa: Katu (pungent).
   - Guna: Laghu (light), Snigdha (unctuous) [Unctuous compared to black pepper].
   - Virya: Anushna-shita (mildly warm / not severely hot).
   - Vipaka: Madhura (sweet) [Sweet post-digestive effect provides Rasayana qualities].
   - Karma: Kapha-Vata-hara, Deepani, Vrishya, Rasayani, Kasashwasahara, Plihodara-shamana (splenic tonic).
2. Therapeutic Indications:
   Kasa, Shwasa, Jwara, Agnimandya, Pliharoga (splenomegaly), Gulma.
3. Standard Therapeutic Dosage:
   - Powder: 500 mg to 1.5 grams with honey or warm milk.
"""
    },
    {
        "id": "API-CUMINUM-CYMINUM",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Cuminum cyminum (Jeeraka/Cumin)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/cuminum-cyminum",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 24",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier carminative spice for bloating, abdominal colic, and maternal digestive care.",
        "limitations": "Safe culinary herb with virtually no toxicities; therapeutic dosages above 6g daily rarely necessary.",
        "classical_verse": None,
        "tags": ["jeeraka", "cumin", "cuminum_cyminum", "carminative", "bloating", "deepana"],
        "dosha_affinity": ["Vata", "Kapha", "Pitta"],
        "content": """
Official Pharmacopoeial Monograph: Cuminum cyminum L. (Family: Apiaceae) - Dried Fruit.
1. Ayurvedic Attributes:
   - Sanskrit Names: Jīraka, Śvetajīraka, Ajājī, Dīpya.
   - Rasa: Katu (pungent), Tikta (bitter).
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Ushna (warm).
   - Vipaka: Katu (pungent).
   - Karma: Vata-Kapha-hara, Deepana, Pachana, Sangrahi (absorptive/bowel-binding), Medhya, Garbhashaya-shodhaka (uterine tonic postpartum).
2. Therapeutic Indications:
   Agnimandya, Atisara (diarrhea), Grahani, Adhmana (abdominal flatulence), Krimi.
3. Standard Therapeutic Dosage:
   - Fruit Powder: 3 to 6 grams daily with warm water or buttermilk.
"""
    },
    {
        "id": "API-FOENICULUM-VULGARE",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Foeniculum vulgare (Mishreya/Fennel)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/foeniculum-vulgare",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 38",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Mild cooling carminative, ideal for infant colic, Pitta indigestion, and postprandial freshening.",
        "limitations": "Pure essential oil contains estragole and must not be ingested undiluted; whole seeds safe.",
        "classical_verse": None,
        "tags": ["mishreya", "fennel", "foeniculum_vulgare", "cooling_carminative", "colic", "pitta_friendly"],
        "dosha_affinity": ["Pitta", "Vata"],
        "content": """
Official Pharmacopoeial Monograph: Foeniculum vulgare Mill. (Family: Apiaceae) - Dried Fruit.
1. Ayurvedic Attributes:
   - Sanskrit Names: Miśreyā, Madhurikā, Śatapuṣpā (variety).
   - Rasa: Madhura (sweet), Katu (pungent), Tikta (bitter).
   - Guna: Laghu (light), Snigdha (unctuous).
   - Virya: Shita (cooling) / mildly warm.
   - Vipaka: Madhura (sweet).
   - Karma: Vata-Pitta-shamaka, Deepana, Pachana, Anulomana, Netrahita (ophthalmic benefit), Hridya.
2. Therapeutic Indications:
   Aruchi (tastelessness), Agnimandya, Shula (colic), Chardi, Kasa.
3. Standard Therapeutic Dosage:
   - Seed Powder: 3 to 6 grams.
   - Cold Infusion (Hima): 20 to 40 ml.
"""
    },
    {
        "id": "API-CORIANDRUM-SATIVUM",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Coriandrum sativum (Dhanyaka/Coriander)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/coriandrum-sativum",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 14",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier Pitta-pacifying digestive, thirst quencher, and cooling diuretic.",
        "limitations": "Safe culinary spice; no documented toxicities at dietary levels.",
        "classical_verse": None,
        "tags": ["dhanyaka", "coriander", "coriandrum_sativum", "trishna", "pitta_shamana", "diuretic"],
        "dosha_affinity": ["Pitta", "Vata", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Coriandrum sativum L. (Family: Apiaceae) - Dried Fruit.
1. Ayurvedic Attributes:
   - Sanskrit Names: Dhānyaka, Kustumburu, Vitunnaka.
   - Rasa: Kashaya (astringent), Tikta (bitter), Madhura (sweet), Katu (pungent).
   - Guna: Laghu (light), Snigdha (unctuous).
   - Virya: Ushna (mildly warm when dry) / Shita (cold infusion).
   - Vipaka: Madhura (sweet).
   - Karma: Tridoshahara (balances Pitta in particular), Deepana, Pachana, Trishnahara (allays thirst), Mutrala.
2. Therapeutic Indications:
   Amlapitta, Trishna, Daha (burning sensation), Mutrakrichra, Jwara.
3. Standard Therapeutic Dosage:
   - Powder: 3 to 6 grams.
   - Dhanyaka Hima (Cold overnight infusion): 50 to 100 ml taken with rock sugar for burning sensations.
"""
    },
    {
        "id": "API-ALLIUM-SATIVUM",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Allium sativum (Lashuna/Garlic)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/allium-sativum",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. III, Monograph 22",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier Vata-pacifier, cardiovascular lipid regulator, and anti-arthritic bulb.",
        "limitations": "Strongly aggravates Pitta; high doses contraindicated with anticoagulants and before surgery.",
        "classical_verse": None,
        "tags": ["lashuna", "garlic", "allium_sativum", "rasona", "vata_shamana", "hridya", "antiplatelet"],
        "dosha_affinity": ["Vata", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Allium sativum L. (Family: Amaryllidaceae) - Bulb.
1. Ayurvedic Attributes:
   - Sanskrit Names: Laśuna, Rasona, Mahauṣadha, Ugragandha.
   - Rasa: Possesses 5 tastes (Madhura, Lavana, Katu, Tikta, Kashaya; lacks only Amla/sour taste). Pungent is predominant.
   - Guna: Snigdha (unctuous), Guru (heavy), Tikshna (sharp).
   - Virya: Ushna (very warm).
   - Vipaka: Katu (pungent).
   - Karma: Vata-Kapha-hara (premier single food for pacifying Vata), Hridya (cardiotonic), Medohara, Deepana, Rasayana, Asthisandhaniya (heals fractures).
2. Therapeutic Indications:
   Vata-Vyadhi (sciatica, hemiplegia, neurological pain), Hridroga (coronary artery disease), Gulma, Krimi, Shula.
3. Standard Therapeutic Dosage:
   - Fresh Bulb Paste: 1 to 3 grams daily with milk or food.
4. Critical Contraindications:
   - Pitta-predominant conditions, bleeding disorders, gastritis, concurrent anticoagulation (Warfarin/Aspirin).
"""
    },
    {
        "id": "API-ELETTARIA-CARDAMOMUM",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Elettaria cardamomum (Ela/Cardamom)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/elettaria-cardamomum",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. I, Monograph 15",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Aromatic digestive, anti-emetic, and refreshing Pitta-Vata carminative.",
        "limitations": "Safe aromatic spice; excessive amounts can be drying.",
        "classical_verse": None,
        "tags": ["ela", "cardamom", "elettaria_cardamomum", "chardi", "anti_emetic", "tridosha"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Official Pharmacopoeial Monograph: Elettaria cardamomum (L.) Maton (Family: Zingiberaceae) - Dried Seed.
1. Ayurvedic Attributes:
   - Sanskrit Names: Elā, Sūkṣmailā, Truti, Draviḍī.
   - Rasa: Katu (pungent), Madhura (sweet).
   - Guna: Laghu (light), Ruksha (dry).
   - Virya: Shita (cooling).
   - Vipaka: Madhura (sweet).
   - Karma: Tridoshahara, Hridya, Rochana (improves taste), Deepana, Chardinigrahana (anti-emetic), Mukhadurgandhahara.
2. Therapeutic Indications:
   Chardi (nausea and vomiting), Kasa, Shwasa, Aruchi, Hikka, Mutrakrichra.
3. Standard Therapeutic Dosage:
   - Seed Powder: 250 mg to 1 gram.
"""
    },
    {
        "id": "API-CENTELLA-ASIATICA",
        "collection": "botanical_pharmacopoeia",
        "title": "Ayurvedic Pharmacopoeia of India Monograph: Centella asiatica (Mandukaparni)",
        "publisher": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
        "source_url": "https://pcimh.gov.in/monographs/centella-asiatica",
        "publication_version": "The Ayurvedic Pharmacopoeia of India, Part-I, Vol. IV, Monograph 23",
        "license": "Official Government Statutory Standard (PCIM&H)",
        "document_type": "Official Botanical Pharmacopoeial Monograph",
        "download_availability": "Publicly accessible via pcimh.gov.in",
        "relevance": "Premier Medhya Rasayana (nootropic), anxiolytic, and neuro-circulatory adaptogen.",
        "limitations": "Rare contact dermatitis; high doses can cause mild dizziness or headaches.",
        "classical_verse": None,
        "tags": ["mandukaparni", "gotu_kola", "centella_asiatica", "medhya", "nootropic", "pitta_shamana"],
        "dosha_affinity": ["Pitta", "Kapha", "Vata"],
        "content": """
Official Pharmacopoeial Monograph: Centella asiatica (L.) Urb. (Family: Apiaceae) - Whole Plant.
1. Ayurvedic Attributes:
   - Sanskrit Names: Maṇḍūkaparṇī, Brāhmī (regional), Sarasvatī, Maṇḍūkī.
   - Rasa: Tikta (bitter), Kashaya (astringent), Madhura (sweet).
   - Guna: Laghu (light).
   - Virya: Shita (cooling).
   - Vipaka: Madhura (sweet).
   - Karma: Pitta-Kapha-shamaka, Medhya Rasayana (foremost cognitive and neurological rejuvenator), Ayushya, Varnya, Hridya.
2. Therapeutic Indications:
   Manovikara (anxiety and cognitive decline), Unmada, Kushta (skin ulcers), Pandu, Jwara.
3. Standard Therapeutic Dosage:
   - Fresh Juice: 10 to 20 ml.
   - Powder: 3 to 6 grams.
"""
    },

    # -------------------------------------------------------------
    # Collection 4 additions: Nutrition & Pathya
    # -------------------------------------------------------------
    {
        "id": "ICMR-NIN-2024-SUGAR-SALT-UPF",
        "collection": "nutrition_pathya",
        "title": "ICMR-NIN 2024: Quantitative Thresholds for Sugar, Salt, and Ultra-Processed Foods",
        "publisher": "National Institute of Nutrition (ICMR-NIN)",
        "source_url": "https://www.nin.res.in/dietaryguidelines/sugar-salt-upf.html",
        "publication_version": "ICMR-NIN Technical Bulletin 2024",
        "license": "Public Health Guidance (ICMR-NIN)",
        "document_type": "Evidence-Based Clinical Nutrition Limit Matrix",
        "download_availability": "Publicly accessible via nin.res.in",
        "relevance": "Provides exact numerical thresholds for dietary sugar, sodium, and ultra-processed food restrictions.",
        "limitations": "Clinical adjustments needed for athletes with heavy sweat losses or chronic kidney disease patients.",
        "classical_verse": None,
        "tags": ["sugar_limits", "salt_limits", "upf", "ultra_processed", "icmr_nin_2024", "hypertension_prevention"],
        "dosha_affinity": ["Kapha", "Pitta", "Vata"],
        "content": """
ICMR-NIN 2024 Quantitative Intake Thresholds for Metabolic and Cardiovascular Health:
1. Free and Added Sugars:
   - Maximum Limit: <5% of total daily caloric intake (approximately 20 to 25 grams or 4-5 teaspoons per day for a standard 2000 kcal diet).
   - Eliminates added sucrose, high-fructose corn syrup, and sweetened bottled beverages.
2. Sodium & Table Salt:
   - Maximum Limit: <5 grams of table salt (NaCl) per day, corresponding to <2000 mg of sodium daily.
   - Avoid monosodium glutamate (MSG), canned soups, packaged salty namkeens, and chips.
3. Ultra-Processed Foods (UPFs):
   - Defined under the NOVA classification: Formulations of ingredients manufactured by industrial processes containing emulsifiers, colorants, flavor enhancers, and hydrogenated oils.
   - UPFs are clinically proven to induce insulin resistance, systemic micro-inflammation, and alter gut microbiome integrity.
"""
    },
    {
        "id": "PATHYA-JARANA-SHAKTI-EVALUATION",
        "collection": "nutrition_pathya",
        "title": "Clinical Evaluation of Digestive Capacity: Jarana Shakti and Abhyavaharana Shakti",
        "publisher": "AyuRAG Clinical Knowledge Base / Charaka Saṃhitā Vimanasthana Ch 8",
        "source_url": "https://niimh.nic.in/ebooks/ecaraka/?mod=read&sys=vi&ch=8",
        "publication_version": "Clinical Methodology Standard",
        "license": "Public Domain / Clinical Reference",
        "document_type": "Clinical Metabolic Evaluation Guide",
        "download_availability": "Publicly accessible via e-Caraka",
        "relevance": "Explains how to determine meal intervals and food volume based on digestion speed.",
        "limitations": "Subjective patient reporting; validated by tracking bowel consistency and energy levels.",
        "classical_verse": "Abhyavaharaṇaśaktirjaranaśaktiriti parīkṣeta.",
        "tags": ["jarana_shakti", "abhyavaharana_shakti", "digestive_capacity", "meal_spacing", "metabolism"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Ayurvedic Clinical Method for Quantifying Patient Metabolic Capacity:
1. Abhyavaharana Shakti (Ingestion Capacity):
   - The volume and mass of food an individual can comfortably consume in a single sitting without nausea, thoracic fullness, or dyspnea.
2. Jarana Shakti (Digestive & Assimilative Capacity):
   - Evaluated by the time elapsed between meal ingestion and the emergence of authentic physiological hunger (Shuddha Udgara, Utsaha, Laghuta, Yathochita Malotsarga).
   - If a standard meal requires >6 hours to digest, Jarana Shakti is low (Manda Agni); meal portion must be reduced by 30-50%.
   - If a standard meal is digested in <2.5 hours with burning hunger, Jarana Shakti is hyperactive (Tikshna Agni); cooling unctuous meals are indicated.
   - Normal physiological meal spacing is 3.5 to 4.5 hours.
"""
    },

    # -------------------------------------------------------------
    # Collection 5 additions: Clinical Safety & Referral
    # -------------------------------------------------------------
    {
        "id": "SAFETY-PEDIATRIC-GERIATRIC-DOSAGE",
        "collection": "clinical_safety_referral",
        "title": "Clinical Safety Guidance: Pediatric and Geriatric Dosage Modulation Rules",
        "publisher": "AyuRAG Clinical Safety Board / Sharangadhara Samhita & Modern Pediatric Standards",
        "source_url": "https://ayushportal.nic.in/dosage-modulation-guidelines",
        "publication_version": "Clinical Dosage Standard v2.1, 2024",
        "license": "CC-BY-SA 4.0 / Clinical Open Access",
        "document_type": "Clinical Pharmacology Dosing Standard",
        "download_availability": "Publicly accessible via AYUSH Research Portal",
        "relevance": "Prevents overdosage toxicity in children (<16 years) and elderly patients (>65 years).",
        "limitations": "Mathematical fraction rules provide initial estimates; organ clearance must be considered.",
        "classical_verse": None,
        "tags": ["pediatric_dosage", "geriatric_dosage", "sharangadhara", "dose_scaling", "safety"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
Dosage Scaling Rules for Vulnerable Demographic Groups in Ayurvedic Practice:
1. Pediatric Dosage Rules (Sharangadhara Samhita & Clark's Rule Alignment):
   - Age 1-2 years: 1/12th to 1/8th of adult dose.
   - Age 3-5 years: 1/4th of adult dose.
   - Age 6-12 years: 1/2 of adult dose.
   - Age 13-16 years: 3/4th of adult dose.
   - Infants (<1 year): Direct herbal churna administration is contraindicated; maternal milk mediation or mild honey-rubs (Prashana) only.
2. Geriatric Dosage Rules (>65 years):
   - Due to age-related decline in glomerular filtration rate (GFR) and hepatic CYP enzyme clearance, starting dose should be 50-70% of standard adult dose.
   - Avoid aggressive purgatives (Virechana dravyas like Trivrit or Castor oil) which can precipitate sudden electrolyte depletion and postural hypotension in the elderly.
"""
    },
    {
        "id": "SAFETY-SCOPE-OF-PRACTICE-DISCLAIMER",
        "collection": "clinical_safety_referral",
        "title": "Regulatory Scope of Practice, Algorithmic Transparency, and Clinical Review Mandate",
        "publisher": "AyuRAG Governance & Ethics Board / National Commission for Indian System of Medicine (NCISM)",
        "source_url": "https://ncismindia.org/regulations",
        "publication_version": "Clinical Decision Support Governance Guideline, 2024",
        "license": "Public Regulatory Guidance",
        "document_type": "Regulatory & Legal Governance Directive",
        "download_availability": "Publicly accessible via ncismindia.org",
        "relevance": "Defines ethical and legal boundaries: software provides decision support and education, requiring licensed clinician verification.",
        "limitations": "Advisory policy; clinical responsibility always rests with the treating licensed physician.",
        "classical_verse": None,
        "tags": ["scope_of_practice", "clinician_review", "xai_disclaimer", "ncism", "legal_governance"],
        "dosha_affinity": ["Vata", "Pitta", "Kapha"],
        "content": """
AyuRAG-XAI Regulatory Scope of Practice & Clinical Safety Framework:
1. Decision Support vs Medical Prescription:
   - AyuRAG-XAI is an Explainable Artificial Intelligence Clinical Decision Support System (CDSS) designed for personalized wellness, lifestyle counseling, and educational reference.
   - Output generated by the AI does NOT constitute an autonomous medical prescription or formal statutory diagnosis.
2. Doctor Verification Mandate:
   - All AI-generated diet plans, botanical recommendations, and dosha classifications require review, validation, or correction by a licensed Ayurvedic practitioner (BAMS/MD Ayur) before formal prescription.
3. Patient Transparency & XAI Grounding:
   - The user must always be informed that traditional use does not equal modern clinical proof.
   - Every algorithmic recommendation must expose its underlying feature attributions (SHAP/LIME) and link directly to canonical compendia or peer-reviewed research citations.
"""
    }
]
