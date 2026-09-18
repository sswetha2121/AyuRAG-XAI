/**
 * AyuRAG-XAI Structured Symptoms & Health Context Data
 * Clinical category mapping, symptom taxonomy, severity & frequency scales.
 * Educational and demonstration context only; non-diagnostic.
 */

export const SYMPTOM_CATEGORIES = [
  { id: 'all', label: 'All Symptoms', icon: 'Sparkles' },
  { id: 'digestive', label: 'Digestive & Metabolism', sanskrit: 'Agni & Koṣṭha', icon: 'Flame' },
  { id: 'sleep', label: 'Sleep & Circadian', sanskrit: 'Nidrā & Kāla', icon: 'Moon' },
  { id: 'energy', label: 'Energy & Vitality', sanskrit: 'Bala & Ojas', icon: 'Zap' },
  { id: 'skin', label: 'Skin & Complexion', sanskrit: 'Tvak & Keśa', icon: 'Sparkles' },
  { id: 'respiratory', label: 'Respiratory & Sinus', sanskrit: 'Prāṇavaha', icon: 'Wind' },
  { id: 'musculoskeletal', label: 'Joints & Muscle Tension', sanskrit: 'Sandhi & Māṁsa', icon: 'Activity' },
  { id: 'mental', label: 'Mental Pace & Stress', sanskrit: 'Mānasa & Śānti', icon: 'HeartPulse' },
  { id: 'general', label: 'General Wellbeing', sanskrit: 'Sāmānya Svāsthya', icon: 'Compass' }
];

export const SYMPTOM_CATALOG = [
  // Digestive & Metabolism
  {
    id: 'sym_bloating',
    name: 'Abdominal Bloating / Distension',
    category: 'digestive',
    sanskritName: 'Ādhmāna',
    description: 'Feeling tight, full of air or gas after meals',
    keywords: ['bloating', 'gas', 'distension', 'stomach', 'digestion']
  },
  {
    id: 'sym_acidity',
    name: 'Acid Reflux / Heartburn',
    category: 'digestive',
    sanskritName: 'Amlapitta',
    description: 'Warm burning sensation in throat or upper chest',
    keywords: ['acidity', 'heartburn', 'reflux', 'gerd', 'sour']
  },
  {
    id: 'sym_constipation',
    name: 'Sluggish / Dry Bowel Transit',
    category: 'digestive',
    sanskritName: 'Vibandha',
    description: 'Hard stools, infrequent elimination, or incomplete feeling',
    keywords: ['constipation', 'dry', 'sluggish', 'bowel', 'transit']
  },
  {
    id: 'sym_loose_stools',
    name: 'Loose Stools / Fast Transit',
    category: 'digestive',
    sanskritName: 'Atisāra Tendency',
    description: 'Frequent or loose bowel movements shortly after eating',
    keywords: ['loose', 'diarrhea', 'fast', 'urgency', 'stomach']
  },
  {
    id: 'sym_irregular_appetite',
    name: 'Erratic / Unpredictable Hunger',
    category: 'digestive',
    sanskritName: 'Viṣamāgni',
    description: 'Fluctuating hunger levels with sudden loss or sudden surges',
    keywords: ['appetite', 'hunger', 'irregular', 'skipping', 'fasting']
  },

  // Sleep & Circadian
  {
    id: 'sym_sleep_onset',
    name: 'Difficulty Falling Asleep',
    category: 'sleep',
    sanskritName: 'Anidrā (Onset)',
    description: 'Tossing and turning with a racing mind for over 30 minutes',
    keywords: ['sleep', 'insomnia', 'falling asleep', 'night', 'bedtime']
  },
  {
    id: 'sym_sleep_interrupted',
    name: 'Frequent Mid-Night Waking',
    category: 'sleep',
    sanskritName: 'Khaṇḍita Nidrā',
    description: 'Waking up around 02:00–04:00 AM and struggling to fall back asleep',
    keywords: ['waking', 'broken sleep', 'night', 'interrupted', 'nightmare']
  },
  {
    id: 'sym_morning_grogginess',
    name: 'Morning Grogginess / Heavy Waking',
    category: 'sleep',
    sanskritName: 'Tandrā',
    description: 'Feeling unrefreshed, sluggish, and heavy upon waking in the morning',
    keywords: ['grogginess', 'tired morning', 'fatigue', 'sluggish', 'drowsy']
  },
  {
    id: 'sym_daytime_lethargy',
    name: 'Daytime Sleepiness / Afternoon Slump',
    category: 'sleep',
    sanskritName: 'Alasya',
    description: 'Sudden drop in alertness and heavy eyelids between 14:00 and 16:00',
    keywords: ['afternoon crash', 'drowsy', 'sleepy', 'slump', 'nap']
  },

  // Energy & Vitality
  {
    id: 'sym_chronic_fatigue',
    name: 'Low Physical Stamina / Early Fatigue',
    category: 'energy',
    sanskritName: 'Klama & Balakṣaya',
    description: 'Expending energy quickly with prolonged recovery time needed',
    keywords: ['fatigue', 'tired', 'stamina', 'energy', 'exhaustion']
  },
  {
    id: 'sym_brain_fog',
    name: 'Mental Fog / Concentration Difficulty',
    category: 'energy',
    sanskritName: 'Mano Māndya',
    description: 'Difficulty sustaining focus, slower recall, or mental haze',
    keywords: ['brain fog', 'focus', 'memory', 'concentration', 'clarity']
  },
  {
    id: 'sym_dizziness_lightheaded',
    name: 'Occasional Lightheadedness on Standing',
    category: 'energy',
    sanskritName: 'Bhrama',
    description: 'Brief dizziness when standing up quickly or after skipping food',
    keywords: ['dizzy', 'lightheaded', 'postural', 'faint']
  },

  // Skin & Complexion
  {
    id: 'sym_dry_skin',
    name: 'Dry, Flaky or Rough Skin',
    category: 'skin',
    sanskritName: 'Rūkṣa Tvak',
    description: 'Skin prone to chapping, dullness, or cold-weather irritation',
    keywords: ['dry skin', 'flaky', 'rough', 'itchy', 'cracked']
  },
  {
    id: 'sym_acne_redness',
    name: 'Inflammatory Skin Breakouts / Redness',
    category: 'skin',
    sanskritName: 'Yauvana Piḍakā',
    description: 'Warm, sensitive skin with reddish flare-ups or acne',
    keywords: ['acne', 'redness', 'pimples', 'rash', 'inflammation', 'heat']
  },
  {
    id: 'sym_hair_thinning',
    name: 'Excess Hair Shedding / Scalp Dryness',
    category: 'skin',
    sanskritName: 'Khālitya',
    description: 'Noticeable hair loss, brittle strands, or flaky scalp',
    keywords: ['hair loss', 'shedding', 'scalp', 'dandruff', 'hair fall']
  },

  // Respiratory & Sinus
  {
    id: 'sym_sinus_congestion',
    name: 'Morning Nasal / Sinus Congestion',
    category: 'respiratory',
    sanskritName: 'Pratiśyāya',
    description: 'Stuffiness, mucus buildup, or pressure around eyes/forehead',
    keywords: ['sinus', 'congestion', 'nose', 'phlegm', 'allergy']
  },
  {
    id: 'sym_throat_dryness',
    name: 'Throat Dryness / Irritation',
    category: 'respiratory',
    sanskritName: 'Kaṇṭha Śoṣa',
    description: 'Dry, scratchy throat especially upon waking or in air conditioning',
    keywords: ['throat', 'dry throat', 'cough', 'scratchy']
  },

  // Musculoskeletal & Joints
  {
    id: 'sym_joint_stiffness',
    name: 'Morning Joint Stiffness / Cracking Joints',
    category: 'musculoskeletal',
    sanskritName: 'Sandhi Stabdhata',
    description: 'Joints feel tight or creaky for the first 15–30 minutes after waking',
    keywords: ['joints', 'stiffness', 'cracking', 'knees', 'fingers']
  },
  {
    id: 'sym_back_neck_strain',
    name: 'Neck, Shoulder & Lower Back Tension',
    category: 'musculoskeletal',
    sanskritName: 'Grīvā & Kaṭi Graha',
    description: 'Postural tightness from extended desk sitting and laptop work',
    keywords: ['neck', 'back', 'shoulders', 'posture', 'desk', 'pain']
  },

  // Mental Pace & Stress
  {
    id: 'sym_restless_worry',
    name: 'Nervous Restlessness / Racing Thoughts',
    category: 'mental',
    sanskritName: 'Citta Cañcalatā',
    description: 'Difficulty relaxing, constant mental checklists, or worry',
    keywords: ['anxiety', 'worry', 'restless', 'racing mind', 'overthinking']
  },
  {
    id: 'sym_irritability_urgency',
    name: 'Time Pressure & Quick Irritability',
    category: 'mental',
    sanskritName: 'Krodha & Tvarā',
    description: 'Low tolerance for delays, feeling rushed, quick to frustration',
    keywords: ['irritability', 'anger', 'rushed', 'impatient', 'stress']
  },

  // General Wellbeing
  {
    id: 'sym_cold_intolerance',
    name: 'Cold Hands, Feet & Temperature Sensitivity',
    category: 'general',
    sanskritName: 'Śīta Asahatva',
    description: 'Easily chilled; needs layers even in moderate temperatures',
    keywords: ['cold', 'hands', 'feet', 'circulation', 'chilled']
  },
  {
    id: 'sym_heat_intolerance',
    name: 'Heat Intolerance & Excess Sweating',
    category: 'general',
    sanskritName: 'Uṣṇa Asahatva',
    description: 'Easily overheated, sweat profusely, intolerant of humid heat',
    keywords: ['heat', 'sweat', 'hot', 'sun', 'flushed']
  }
];

export const SEVERITY_OPTIONS = [
  { id: 'minimal', label: 'Minimal', description: 'Barely noticeable, does not interfere with daily life' },
  { id: 'mild', label: 'Mild', description: 'Noticeable occasionally, minor inconvenience' },
  { id: 'moderate', label: 'Moderate', description: 'Frequent impact on daily energy, comfort or focus' },
  { id: 'significant', label: 'Significant', description: 'Substantial discomfort requiring active attention' }
];

export const FREQUENCY_OPTIONS = [
  { id: 'rarely', label: 'Rarely', description: 'Once or twice a month' },
  { id: 'sometimes', label: 'Sometimes', description: '1–2 times a week' },
  { id: 'often', label: 'Often', description: '3–5 days a week' },
  { id: 'very-often', label: 'Very Often', description: 'Daily or almost constantly' }
];

export const DURATION_OPTIONS = [
  { id: 'recent', label: 'Recent (< 2 weeks)' },
  { id: 'several-weeks', label: 'Several Weeks (1–2 months)' },
  { id: 'several-months', label: 'Several Months (3–6 months)' },
  { id: 'long-standing', label: 'Long-Standing (6+ months)' }
];

export const CHIEF_CONCERN_PRESETS = [
  'Digestive comfort & meal timing regularity',
  'Sleep quality & morning energy restoration',
  'Chronic daily stress & mental clarity',
  'Energy consistency & afternoon fatigue',
  'Skin health & natural doshic balance',
  'Postural tension & physical endurance',
  'General holistic wellness & preventative health'
];
