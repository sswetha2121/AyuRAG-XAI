/**
 * AyuRAG-XAI Symptoms & Health Context Taxonomy & Configuration
 * 
 * Scalable data model for Phase 05.
 * Contains categorized symptoms, detail field enablement, and primary concern descriptors.
 * STRICTLY non-diagnostic clinical intake framing.
 */

export const SYMPTOM_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: 'Sparkles' },
  { id: 'Digestive', label: 'Digestive', icon: 'Utensils' },
  { id: 'Sleep', label: 'Sleep & Rest', icon: 'Moon' },
  { id: 'Energy', label: 'Energy & Vitality', icon: 'Zap' },
  { id: 'Stress & Mood', label: 'Stress & Mood', icon: 'Brain' },
  { id: 'Respiratory', label: 'Respiratory', icon: 'Wind' },
  { id: 'Skin', label: 'Skin & Hair', icon: 'Shield' },
  { id: 'Musculoskeletal', label: 'Joints & Muscles', icon: 'Activity' },
  { id: 'Head & Neurological', label: 'Head & Focus', icon: 'Compass' },
  { id: 'General Wellness', label: 'General Wellness', icon: 'Heart' }
];

export const SYMPTOM_TAXONOMY = [
  // 1. DIGESTIVE
  {
    id: 'bloating',
    name: 'Bloating & Abdominal Distension',
    category: 'Digestive',
    sanskritName: 'Ādhmāna',
    description: 'Feeling of abdominal fullness, gas, or tightness after eating.',
    tags: ['digestive', 'abdomen', 'gas', 'vata'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'acidity_heartburn',
    name: 'Acidity & Acid Reflux',
    category: 'Digestive',
    sanskritName: 'Amlapitta',
    description: 'Sour taste, burning chest or upper abdomen, especially after meals.',
    tags: ['digestive', 'acidity', 'pitta', 'heartburn'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'sluggish_digestion',
    name: 'Sluggish Digestion / Post-Meal Heaviness',
    category: 'Digestive',
    sanskritName: 'Alpāgni / Guruta',
    description: 'Food feels like it sits in the stomach for hours; lack of hunger.',
    tags: ['digestive', 'heaviness', 'kapha', 'sluggish'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'irregular_bowels',
    name: 'Irregular or Dry Bowel Elimination',
    category: 'Digestive',
    sanskritName: 'Vibandha',
    description: 'Infrequent, hard, or incomplete bowel movements.',
    tags: ['digestive', 'bowel', 'constipation', 'vata'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'loose_stools',
    name: 'Frequent or Loose Bowels',
    category: 'Digestive',
    sanskritName: 'Atisāra tendency',
    description: 'Urgent, loose, or burning bowel movements.',
    tags: ['digestive', 'pitta', 'loose'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 2. SLEEP
  {
    id: 'difficulty_falling_asleep',
    name: 'Difficulty Falling Asleep (Sleep Latency)',
    category: 'Sleep',
    sanskritName: 'Anidrā Initial',
    description: 'Racing mind, restless thoughts, taking more than 40 minutes to drift off.',
    tags: ['sleep', 'insomnia', 'vata', 'mind'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'night_awakenings',
    name: 'Frequent Night Awakenings',
    category: 'Sleep',
    sanskritName: 'Khaṇḍita Nidrā',
    description: 'Waking up at 2:00–4:00 AM with difficulty going back to sleep.',
    tags: ['sleep', 'broken', 'pitta', 'awakenings'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'unrefreshing_sleep',
    name: 'Unrefreshing Morning Sleep / Heaviness',
    category: 'Sleep',
    sanskritName: 'Tandrā',
    description: 'Sleeping 8+ hours but waking up feeling groggy, heavy, or exhausted.',
    tags: ['sleep', 'groggy', 'kapha', 'morning'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 3. ENERGY
  {
    id: 'afternoon_fatigue',
    name: 'Afternoon Energy Slump',
    category: 'Energy',
    sanskritName: 'Klama Midday',
    description: 'Sudden drop in mental stamina and physical energy between 2:00–5:00 PM.',
    tags: ['energy', 'fatigue', 'afternoon'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'chronic_low_energy',
    name: 'Persistent Low Energy / Fatigue',
    category: 'Energy',
    sanskritName: 'Daurbalya',
    description: 'General lack of physical endurance and vitality throughout the day.',
    tags: ['energy', 'exhaustion', 'vitality', 'ojas'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 4. STRESS & MOOD
  {
    id: 'mental_restlessness',
    name: 'Mental Restlessness & Overthinking',
    category: 'Stress & Mood',
    sanskritName: 'Citta Cañcalatā',
    description: 'Anxious thoughts, inability to mentally unwind, feeling hurried.',
    tags: ['stress', 'mind', 'anxiety', 'vata'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'irritability',
    name: 'Irritability & Short Temper',
    category: 'Stress & Mood',
    sanskritName: 'Krodha Tendency',
    description: 'Impatience, frustration, feeling easily triggered under pressure.',
    tags: ['stress', 'mood', 'pitta', 'temper'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'mental_fog',
    name: 'Mental Fog & Low Motivation',
    category: 'Stress & Mood',
    sanskritName: 'Avasāda / Moha',
    description: 'Sluggish thinking, inertia, difficulty initiating tasks.',
    tags: ['stress', 'fog', 'kapha', 'focus'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 5. RESPIRATORY
  {
    id: 'nasal_congestion',
    name: 'Morning Nasal Congestion / Sinus Heaviness',
    category: 'Respiratory',
    sanskritName: 'Pratiśyāya',
    description: 'Stuffy nose, excessive mucus upon waking, sinus pressure.',
    tags: ['respiratory', 'sinus', 'mucus', 'kapha'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'dry_cough',
    name: 'Dry Irritating Throat / Cough',
    category: 'Respiratory',
    sanskritName: 'Vātika Kāsa',
    description: 'Tickling dry sensation in throat without productive phlegm.',
    tags: ['respiratory', 'throat', 'dry', 'cough'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 6. SKIN & HAIR
  {
    id: 'skin_dryness',
    name: 'Excessive Skin Dryness & Flakiness',
    category: 'Skin',
    sanskritName: 'Rūkṣatā',
    description: 'Rough, parched skin, dullness, or chapped hands/lips.',
    tags: ['skin', 'dry', 'flaking', 'vata'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: false
  },
  {
    id: 'skin_breakouts',
    name: 'Skin Rashes, Acne or Warm Redness',
    category: 'Skin',
    sanskritName: 'Yauvana Piḍakā / Pitta Tvak',
    description: 'Inflamed blemishes, sensitive flushed skin, or itchy eruptions.',
    tags: ['skin', 'redness', 'acne', 'pitta'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'hair_shedding',
    name: 'Excessive Hair Shedding / Scalp Sensitivity',
    category: 'Skin',
    sanskritName: 'Khālitya Tendency',
    description: 'Notable hair thinning, warm tender scalp, or sudden shedding.',
    tags: ['skin', 'hair', 'scalp', 'pitta'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 7. MUSCULOSKELETAL
  {
    id: 'joint_stiffness',
    name: 'Morning Joint Stiffness & Popping',
    category: 'Musculoskeletal',
    sanskritName: 'Sandhigata Vāta Early',
    description: 'Cracking joints, stiffness upon first waking, relief with gentle warm movement.',
    tags: ['joints', 'stiffness', 'bones', 'vata'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'muscle_tension',
    name: 'Neck & Upper Shoulder Muscle Tightness',
    category: 'Musculoskeletal',
    sanskritName: 'Māṁsa Stambha',
    description: 'Knotted shoulders from sustained computer desk posture and tension.',
    tags: ['muscles', 'neck', 'shoulders', 'tension'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 8. HEAD & NEUROLOGICAL
  {
    id: 'tension_headache',
    name: 'Tension Headaches',
    category: 'Head & Neurological',
    sanskritName: 'Śiraḥ Śūla',
    description: 'Band-like pressure across temples or forehead after screens or stress.',
    tags: ['headache', 'tension', 'stress'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },
  {
    id: 'eye_strain',
    name: 'Digital Eye Strain & Dry Eyes',
    category: 'Head & Neurological',
    sanskritName: 'Netra Śoṣa',
    description: 'Gritty, tired, or burning eyes after prolonged computer/phone work.',
    tags: ['eyes', 'screens', 'dryness', 'pitta'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: true
  },

  // 9. GENERAL WELLNESS
  {
    id: 'cold_intolerance',
    name: 'Sensitivity to Cold / Cold Hands and Feet',
    category: 'General Wellness',
    sanskritName: 'Śīta Asahiṣṇutā',
    description: 'Always wearing extra layers; chilly extremities even in mild rooms.',
    tags: ['temperature', 'circulation', 'vata', 'cold'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: false
  },
  {
    id: 'heat_intolerance',
    name: 'Excessive Heat Sensitivity & Sweating',
    category: 'General Wellness',
    sanskritName: 'Uṣṇa Asahiṣṇutā',
    description: 'Easily overheated, profuse sweating, flushed face in warm settings.',
    tags: ['temperature', 'sweat', 'pitta', 'heat'],
    severityEnabled: true,
    frequencyEnabled: true,
    durationEnabled: true,
    impactEnabled: false
  }
];

export const PRIMARY_CONCERN_OPTIONS = [
  {
    id: 'digestion_agni',
    label: 'Digestion & Gut Comfort (Agni)',
    description: 'Relieving bloating, acidity, irregular transit, or post-meal sluggishness.',
    icon: 'Utensils'
  },
  {
    id: 'sleep_rest',
    label: 'Restful Sleep & Recovery (Nidra)',
    description: 'Falling asleep faster, deeper undisturbed sleep, waking up refreshed.',
    icon: 'Moon'
  },
  {
    id: 'energy_vitality',
    label: 'Sustained Energy & Stamina (Ojas)',
    description: 'Overcoming afternoon slumps, chronic fatigue, and cognitive drain.',
    icon: 'Zap'
  },
  {
    id: 'stress_calm',
    label: 'Stress Resilience & Mind Balance (Manas)',
    description: 'Reducing mental overwhelm, calming anxious tension, and improving focus.',
    icon: 'Brain'
  },
  {
    id: 'daily_routine',
    label: 'Circadian Routine Stability (Dinacharya)',
    description: 'Building disciplined morning habits, consistent bedtimes, and activity pacing.',
    icon: 'Clock'
  },
  {
    id: 'constitutional_balance',
    label: 'Overall Tridosha Balance (Swastha)',
    description: 'Holistic alignment across diet, lifestyle, and preventive longevity.',
    icon: 'Heart'
  }
];

export const SYMPTOM_DETAIL_CONFIGS = {
  severity: {
    label: 'Severity Level',
    options: [
      { id: 'mild', label: 'Mild', description: 'Noticeable but easily managed' },
      { id: 'moderate', label: 'Moderate', description: 'Noticeably affects comfort or focus' },
      { id: 'severe', label: 'Severe', description: 'Substantially disrupts daily routine' }
    ]
  },
  frequency: {
    label: 'Frequency',
    options: [
      { id: 'rarely', label: 'Rarely (1–2x/month)' },
      { id: 'sometimes', label: 'Sometimes (1–2x/week)' },
      { id: 'often', label: 'Frequently (3–5x/week)' },
      { id: 'daily', label: 'Daily / Constant' }
    ]
  },
  duration: {
    label: 'Duration',
    options: [
      { id: 'less_1_week', label: '< 1 week' },
      { id: '1_4_weeks', label: '1–4 weeks' },
      { id: '1_3_months', label: '1–3 months' },
      { id: 'longer', label: '3+ months (Chronic)' }
    ]
  },
  impact: {
    label: 'Everyday Impact',
    options: [
      { id: 'minimal', label: 'Minimal (Negligible)' },
      { id: 'moderate', label: 'Moderate (Interferes with tasks)' },
      { id: 'significant', label: 'Significant (Major daily disruption)' }
    ]
  }
};

export const CLINICAL_SAFETY_DISCLAIMER = {
  title: 'Clinical Assessment & Wellness Notice',
  message: 'This intake module records self-reported physiological and lifestyle context for personalized wellness analysis and explainable AI feature derivation. It does not provide medical diagnosis, clinical prognosis, or emergency triage. For persistent or acute symptoms, always consult a licensed healthcare practitioner.',
  urgentWarning: 'If you are experiencing severe, sudden, or acute medical symptoms (such as severe chest pain, shortness of breath, sudden numbness, or severe abdominal pain), please seek immediate medical evaluation at an emergency clinic.'
};
