/**
 * AyuRAG-XAI Structured Dietary Assessment Question Data (Ahara & Agni)
 * Captures meal timings, Agni digestive capacity, rasa preferences,
 * mindful eating habits, and post-meal comfort.
 */

export const DIET_CATEGORIES = [
  {
    id: 'meal_timing',
    number: '01',
    name: 'Meal Timing',
    sanskritName: 'Ahara Kāla',
    description: 'Daily meal schedule, timing consistency, and late-night habits.',
    icon: 'Clock'
  },
  {
    id: 'appetite',
    number: '02',
    name: 'Appetite Rhythm',
    sanskritName: 'Kṣudhā & Agni',
    description: 'Natural hunger intensity, digestion speed, and metabolic consistency.',
    icon: 'Flame'
  },
  {
    id: 'preferences',
    number: '03',
    name: 'Taste & Thermal Preferences',
    sanskritName: 'Ṣaḍ Rasa & Uṣṇa',
    description: 'Primary taste inclinations, spices, and food temperature habits.',
    icon: 'Utensils'
  },
  {
    id: 'pattern',
    number: '04',
    name: 'Dietary Pattern',
    sanskritName: 'Ahara Varga',
    description: 'Primary dietary style, food group balance, and plant-based ratios.',
    icon: 'Salad'
  },
  {
    id: 'habits',
    number: '05',
    name: 'Eating Habits & Pacing',
    sanskritName: 'Ahara Vidhi',
    description: 'Mindfulness during eating, chewing speed, and screen distractions.',
    icon: 'Coffee'
  },
  {
    id: 'hydration',
    number: '06',
    name: 'Hydration & Meal Fluids',
    sanskritName: 'Jala Pāna Vidhi',
    description: 'Water intake relative to meal timing and beverage temperatures.',
    icon: 'GlassWater'
  },
  {
    id: 'digestive_context',
    number: '07',
    name: 'Digestive Context',
    sanskritName: 'Koṣṭha & Pariṇāma',
    description: 'Post-meal lightness, transit comfort, and metabolic demonstration signals.',
    icon: 'HeartPulse'
  }
];

export const DIET_SECTIONS = [
  {
    id: 'timing',
    title: 'Meal Timing',
    sanskrit: 'Kāla',
    description: 'Circadian timing of meals and regularity across the day.'
  },
  {
    id: 'appetite',
    title: 'Appetite & Hunger',
    sanskrit: 'Agni',
    description: 'Digestive fire capacity, hunger signals, and between-meal cravings.'
  },
  {
    id: 'pattern',
    title: 'Dietary Pattern',
    sanskrit: 'Āhāra Prakāra',
    description: 'Primary nutritional framework and staple protein sources.'
  },
  {
    id: 'preferences',
    title: 'Taste Preferences',
    sanskrit: 'Ṣaḍ Rasa',
    description: 'Natural inclination toward sweet, salty, spicy, sour, bitter, or astringent tastes.'
  },
  {
    id: 'hydration',
    title: 'Hydration & Fluids',
    sanskrit: 'Jala Pāna',
    description: 'Daily water intake, fluid temperature, and beverage choices.'
  },
  {
    id: 'habits',
    title: 'Eating Behavior',
    sanskrit: 'Āhāra Vidhi',
    description: 'Chewing speed, meal environment, late-night habits, and skipped meals.'
  },
  {
    id: 'digestive',
    title: 'Digestive Experience',
    sanskrit: 'Pācana',
    description: 'Reported post-meal comfort, bloating, lightness, and transit regularity.'
  },
  {
    id: 'environment',
    title: 'Meal Environment',
    sanskrit: 'Deśa & Bhāva',
    description: 'Emotional calm, screen presence, and dining atmosphere.'
  },
  {
    id: 'freshness',
    title: 'Food Freshness & Quality',
    sanskrit: 'Prāṇa & Guṇa',
    description: 'Freshly cooked home meals versus reheated or packaged foods.'
  },
  {
    id: 'seasonal',
    title: 'Seasonal Adaptation',
    sanskrit: 'Ṛtucaryā Āhāra',
    description: 'Tendency to naturally shift diet according to seasonal weather.'
  }
];

export const DIET_QUESTIONS = [
  // 1. Meal Regularity
  {
    id: 'diet_q1_meal_regularity',
    category: 'Meal Timing',
    categoryId: 'meal_timing',
    sanskritTerm: 'Kāla Bhojana',
    type: 'frequency',
    question: 'How consistent are your daily meal timings?',
    description: 'Reflect on whether breakfast, lunch, and dinner occur at predictable times each day.',
    hint: 'Consistent meal hours stabilize Samana Vata and kindle steady Pachaka Pitta (digestive enzymes).',
    options: [
      {
        id: 'opt_diet_reg_rarely',
        value: 'rarely',
        label: 'Rarely Consistent (Erratic)',
        description: 'Frequent skipped meals, late-night dinners, and eating at random hours'
      },
      {
        id: 'opt_diet_reg_sometimes',
        value: 'sometimes',
        label: 'Sometimes Consistent',
        description: 'Consistent on workdays, but highly variable on weekends or travel'
      },
      {
        id: 'opt_diet_reg_usually',
        value: 'usually',
        label: 'Usually Consistent',
        description: 'Regular schedule within a 30–45 minute window most days'
      },
      {
        id: 'opt_diet_reg_daily',
        value: 'very-consistent',
        label: 'Highly Consistent',
        description: 'Fixed meal times daily aligned with natural circadian hunger peaks'
      }
    ]
  },

  // 2. Primary Meal Windows
  {
    id: 'diet_q2_meal_timings',
    category: 'Meal Timing',
    categoryId: 'meal_timing',
    sanskritTerm: 'Bhojana Kāla Pacing',
    type: 'visual-cards',
    question: 'When is your largest and most substantial meal of the day?',
    description: 'In Ayurveda, the digestive fire (Agni) peaks at solar noon (Pitta time 12:00–14:00).',
    hint: 'Aligning your heaviest food intake with peak solar hours maximizes metabolic transformation.',
    options: [
      {
        id: 'opt_meal_midday',
        value: 'lunch-peak',
        label: 'Midday Lunch (12:00 – 14:00)',
        description: 'Substantial, balanced lunch when digestive fire is naturally strongest',
        icon: 'Sun',
        badge: 'Classical Alignment'
      },
      {
        id: 'opt_meal_evening',
        value: 'dinner-peak',
        label: 'Late Evening Dinner (20:00+)',
        description: 'Main heavy meal after work or study, often close to bedtime',
        icon: 'Moon',
        badge: 'Kapha Pacing'
      },
      {
        id: 'opt_meal_breakfast',
        value: 'morning-peak',
        label: 'Heavy Morning Breakfast',
        description: 'Hearty morning meal followed by lighter eating through the afternoon',
        icon: 'Sunrise',
        badge: 'Early Fuel'
      },
      {
        id: 'opt_meal_grazing',
        value: 'continuous-grazing',
        label: 'Frequent Snacking / Small Meals',
        description: 'Multiple light meals or continuous snacks rather than one main meal',
        icon: 'Coffee',
        badge: 'Fragmented Agni'
      }
    ]
  },

  // 3. Natural Appetite Nature (Agni)
  {
    id: 'diet_q3_appetite_nature',
    category: 'Appetite Rhythm',
    categoryId: 'appetite',
    sanskritTerm: 'Agni Lakṣaṇa',
    type: 'visual-cards',
    question: 'How would you characterize your natural hunger and appetite rhythm?',
    description: 'Demonstration assessment signal reflecting your baseline digestive capacity.',
    hint: 'Sama Agni represents balanced digestion, Tikshna is sharp/fast, Vishama is erratic, Manda is slow.',
    options: [
      {
        id: 'opt_agni_balanced',
        value: 'sama-agni',
        label: 'Steady & Predictable (Sama Agni)',
        description: 'Healthy hunger every 4–5 hours; digests easily without discomfort',
        icon: 'Flame',
        badge: 'Balanced Agni'
      },
      {
        id: 'opt_agni_intense',
        value: 'tikshna-agni',
        label: 'Sharp & Intense (Tīkṣṇa Agni)',
        description: 'Can eat large amounts; gets irritable or acidic if food is delayed',
        icon: 'Zap',
        badge: 'Pitta Dominant'
      },
      {
        id: 'opt_agni_variable',
        value: 'vishama-agni',
        label: 'Variable & Unpredictable (Viṣama Agni)',
        description: 'Sometimes starving, sometimes has zero appetite; easily bloated',
        icon: 'Wind',
        badge: 'Vata Dominant'
      },
      {
        id: 'opt_agni_sluggish',
        value: 'manda-agni',
        label: 'Slow & Sluggish (Manda Agni)',
        description: 'Rarely feels ravenous; feels heavy for hours after a modest meal',
        icon: 'Mountain',
        badge: 'Kapha Dominant'
      }
    ]
  },

  // 4. Primary Dietary Pattern
  {
    id: 'diet_q4_dietary_pattern',
    category: 'Dietary Pattern',
    categoryId: 'pattern',
    sanskritTerm: 'Ahara Varga',
    type: 'visual-cards',
    question: 'What best describes your general dietary preference?',
    description: 'Helps personalize nutritional recommendations and macro-nutrient balance.',
    hint: 'Ayurveda values wholesome, fresh, whole foods tailored to constitutional needs.',
    options: [
      {
        id: 'opt_diet_lacto_veg',
        value: 'lacto-vegetarian',
        label: 'Lacto-Vegetarian',
        description: 'Plant foods, grains, legumes, fruits, vegetables, plus dairy products (milk, ghee, paneer)',
        icon: 'Salad',
        badge: 'Traditional Sattvic'
      },
      {
        id: 'opt_diet_vegan',
        value: 'pure-vegan',
        label: 'Plant-Based / Vegan',
        description: 'Strictly plant-derived foods, seeds, grains, pulses, and plant milks with zero dairy',
        icon: 'Sparkles',
        badge: '100% Plant'
      },
      {
        id: 'opt_diet_omnivore',
        value: 'mixed-omnivore',
        label: 'Mixed / Flexitarian (Omnivore)',
        description: 'Combination of plant foods, dairy, poultry, fish, or eggs as regular staples',
        icon: 'Utensils',
        badge: 'Mixed Diet'
      },
      {
        id: 'opt_diet_pescatarian',
        value: 'pescatarian',
        label: 'Pescatarian / Mediterranean',
        description: 'Primarily plant-based diet enriched with fish, seafood, olive oil, and vegetables',
        icon: 'Activity',
        badge: 'Seafood & Plant'
      }
    ]
  },

  // 5. Taste / Rasa Preferences (Multi-select)
  {
    id: 'diet_q5_taste_preferences',
    category: 'Taste & Thermal Preferences',
    categoryId: 'preferences',
    sanskritTerm: 'Ṣaḍ Rasa Sātmyatā',
    type: 'multi-select-chips',
    question: 'Which taste profiles do you naturally crave or enjoy most frequently?',
    description: 'Select up to 3 predominant tastes (Rasa) in your everyday meals.',
    hint: 'The six tastes (Sweet, Sour, Salty, Pungent, Bitter, Astringent) influence doshic balance.',
    options: [
      { id: 'sweet', label: 'Sweet (Madhura - Grains, Fruits, Dairy)', category: 'rasa' },
      { id: 'sour', label: 'Sour (Amla - Citrus, Ferments, Yogurt)', category: 'rasa' },
      { id: 'salty', label: 'Salty (Lavaṇa - Mineral Salt, Savory)', category: 'rasa' },
      { id: 'pungent', label: 'Pungent / Spicy (Kaṭu - Peppers, Ginger, Mustard)', category: 'rasa' },
      { id: 'bitter', label: 'Bitter (Tikta - Greens, Dark Chocolate, Turmeric)', category: 'rasa' },
      { id: 'astringent', label: 'Astringent (Kaṣāya - Beans, Pomegranate, Green Tea)', category: 'rasa' },
      { id: 'balanced_rasa', label: 'Balanced mix of all six tastes', isExclusive: true }
    ]
  },

  // 6. Food Temperature Preference
  {
    id: 'diet_q6_food_temperature',
    category: 'Taste & Thermal Preferences',
    categoryId: 'preferences',
    sanskritTerm: 'Uṣṇa & Śīta Guṇa',
    type: 'visual-cards',
    question: 'What is your natural preference regarding food temperature and preparation?',
    description: 'Warm, cooked foods support enzymatic digestion and reduce digestive strain.',
    hint: 'Warm foods (Ushna) sustain gastric fire, while excess cold/raw foods can dampen Agni.',
    options: [
      {
        id: 'opt_temp_warm',
        value: 'warm-freshly-cooked',
        label: 'Warm & Freshly Cooked Meals',
        description: 'Prefer steaming soups, warm curries, cooked grains, and warm teas',
        icon: 'Flame',
        badge: 'Kindles Agni'
      },
      {
        id: 'opt_temp_room',
        value: 'room-temperature',
        label: 'Room-Temperature / Mixed Foods',
        description: 'Comfortable with room-temperature dishes, sandwiches, and mild salads',
        icon: 'Coffee',
        badge: 'Moderate'
      },
      {
        id: 'opt_temp_cold',
        value: 'cold-raw-salads',
        label: 'Chilled / Raw Salads & Smoothies',
        description: 'Frequently enjoy iced bowls, cold raw salads, refrigerated snacks, and iced drinks',
        icon: 'IceCream',
        badge: 'Cooling Property'
      }
    ]
  },

  // 7. Eating Speed & Chewing Pacing
  {
    id: 'diet_q7_eating_speed',
    category: 'Eating Habits & Pacing',
    categoryId: 'habits',
    sanskritTerm: 'Bhojana Vegam',
    type: 'segmented-choice',
    question: 'How quickly do you usually finish a main meal?',
    description: 'Eating too quickly prevents adequate salivary amylase mixing; eating too slowly delays digestion.',
    hint: 'Optimal meal duration is around 15–20 minutes with thorough chewing in a peaceful posture.',
    options: [
      {
        id: 'opt_spd_fast',
        value: 'rushed-under-10',
        label: 'Fast & Rushed (< 10 min)',
        description: 'Swallow quickly with minimal chewing, often while in a hurry'
      },
      {
        id: 'opt_spd_moderate',
        value: 'moderate-15-20',
        label: 'Moderate Pacing (15–20 min)',
        description: 'Chew food adequately, pause between bites, finish comfortably'
      },
      {
        id: 'opt_spd_slow',
        value: 'leisurely-25-plus',
        label: 'Slow & Leisurely (25+ min)',
        description: 'Take long pauses, socialize, or eat slowly over extended periods'
      }
    ]
  },

  // 8. Distracted Eating (Tanmana Bhunjita)
  {
    id: 'diet_q8_distracted_eating',
    category: 'Eating Habits & Pacing',
    categoryId: 'habits',
    sanskritTerm: 'Tanmanā Bhuñjīta',
    type: 'frequency',
    question: 'How often do you watch screens, work, or scroll your phone while eating?',
    description: 'Classical Ayurveda advises mindful sensory presence (Tanmanā) during meals for optimal assimilation.',
    hint: 'Sensory distraction impairs autonomic parasympathetic digestion signals.',
    options: [
      {
        id: 'opt_dist_rarely',
        value: 'rarely',
        label: 'Rarely (Eat Mindfully)',
        description: 'Focus fully on the sensory experience, aroma, and taste of food without devices'
      },
      {
        id: 'opt_dist_sometimes',
        value: 'sometimes',
        label: 'Sometimes (Casual Media)',
        description: 'Occasionally glance at phone or TV during casual meals'
      },
      {
        id: 'opt_dist_often',
        value: 'often',
        label: 'Often (Screen with Most Meals)',
        description: 'Regularly stream shows, browse feeds, or work through lunch and dinner'
      },
      {
        id: 'opt_dist_always',
        value: 'always',
        label: 'Always (Multitasking Continuously)',
        description: 'Never eat without a screen, active work spreadsheet, or phone in hand'
      }
    ]
  },

  // 9. Fluids with Meals
  {
    id: 'diet_q9_fluid_with_meals',
    category: 'Hydration & Meal Fluids',
    categoryId: 'hydration',
    sanskritTerm: 'Anupāna Vidhi',
    type: 'visual-cards',
    question: 'What is your typical beverage habit during and immediately after meals?',
    description: 'Proper fluid pairing (Anupana) lubricates digestion without diluting digestive juices.',
    hint: 'Sipping small amounts of warm water during meals aids digestion, whereas large cold drinks quench Agni.',
    options: [
      {
        id: 'opt_anupana_sip_warm',
        value: 'sip-warm-small',
        label: 'Small Sips of Warm Water / Tea',
        description: 'Sip half a glass of warm water or digestive tea during the meal',
        icon: 'Coffee',
        badge: 'Classical Anupana'
      },
      {
        id: 'opt_anupana_cold_large',
        value: 'large-cold-drinks',
        label: 'Large Glasses of Chilled Drinks',
        description: 'Drink large cold glasses of water, soda, or iced beverage during/after food',
        icon: 'GlassWater',
        badge: 'Dampens Agni'
      },
      {
        id: 'opt_anupana_after',
        value: 'drink-only-after',
        label: 'Drink Only 30–60 Min After Meals',
        description: 'Eat solid food dry, then drink water after digestion has begun',
        icon: 'Clock',
        badge: 'Separated Fluids'
      },
      {
        id: 'opt_anupana_dairy',
        value: 'buttermilk-lassi',
        label: 'Digestive Buttermilk (Takra) / Herbal Tea',
        description: 'Enjoy probiotic spiced buttermilk or cumin-coriander herbal infusion',
        icon: 'Sparkles',
        badge: 'Agni Enhancer'
      }
    ]
  },

  // 10. Post-Meal Digestive Comfort (Koshta Context)
  {
    id: 'diet_q10_digestive_comfort',
    category: 'Digestive Context',
    categoryId: 'digestive_context',
    sanskritTerm: 'Jīrṇa Lakṣaṇa',
    type: 'visual-cards',
    question: 'How does your stomach and energy generally feel 1 to 2 hours after a typical meal?',
    description: 'Demonstration assessment signal reflecting metabolic comfort and food assimilation.',
    hint: 'Post-meal lightness and renewed alertness signify complete and wholesome digestion (Sama Pachana).',
    options: [
      {
        id: 'opt_comf_light',
        value: 'light-energized',
        label: 'Light, Energized & Clear',
        description: 'Feels satisfied with steady physical energy and no heaviness or sluggishness',
        icon: 'Sparkles',
        badge: 'Optimal Digestion'
      },
      {
        id: 'opt_comf_bloated',
        value: 'bloating-gas-tendency',
        label: 'Bloated, Distended, or Gassy',
        description: 'Prone to abdominal tightness, air buildup, or dry transit after eating',
        icon: 'Wind',
        badge: 'Vata Signal'
      },
      {
        id: 'opt_comf_acidic',
        value: 'heat-acidity-reflux',
        label: 'Warm, Acidic, or Occasional Heartburn',
        description: 'Prone to acid surge, burning sensation in upper chest, or excess thirst',
        icon: 'Flame',
        badge: 'Pitta Signal'
      },
      {
        id: 'opt_comf_sluggish',
        value: 'heavy-drowsy-sluggish',
        label: 'Heavy, Drowsy, or Mental Fog',
        description: 'Experiences post-meal crash, intense need to nap, or lingering fullness',
        icon: 'Mountain',
        badge: 'Kapha Signal'
      }
    ]
  }
];

export const DIET_DETAILED_QUESTIONS = [
  // SECTION 1: MEAL TIMING
  {
    id: 'diet_meal_timing_regularity',
    section: 'timing',
    category: 'Meal Timing',
    type: 'segmented-control',
    question: 'How consistent are your daily meal timings?',
    description: 'Comparing when you eat breakfast, lunch, and dinner day to day.',
    required: true,
    options: [
      { id: 'consistent_fixed', label: 'Consistent (Fixed hours ±30m)' },
      { id: 'mostly_regular', label: 'Mostly Regular (±1 hr)' },
      { id: 'variable', label: 'Variable (Shifts with work)' },
      { id: 'irregular', label: 'Erratic / Spontaneous' }
    ],
    tags: ['timing', 'circadian']
  },
  {
    id: 'diet_primary_meal',
    section: 'timing',
    category: 'Meal Timing',
    type: 'single-select',
    question: 'Which is your largest and most substantial meal of the day?',
    description: 'Ayurveda advises that midday lunch corresponds with peak Pitta and digestive strength.',
    required: true,
    options: [
      { id: 'breakfast', label: 'Breakfast', description: 'Substantial morning meal, lighter thereafter' },
      { id: 'midday_lunch', label: 'Midday Lunch (12:00 – 2:00 PM)', description: 'Peak circadian Agni window' },
      { id: 'dinner', label: 'Evening Dinner', description: 'Largest meal eaten after the workday ends' },
      { id: 'equal_grazing', label: 'Continuous Grazing / Equal portions', description: 'Multiple smaller snacks throughout the day' }
    ],
    tags: ['timing', 'agni']
  },
  {
    id: 'diet_late_night_eating',
    section: 'timing',
    category: 'Meal Timing',
    type: 'single-select',
    question: 'How often do you eat meals or substantial snacks late at night (after 9:00 PM)?',
    description: 'Eating close to bedtime can burden nighttime digestive clearance.',
    required: true,
    options: [
      { id: 'rarely', label: 'Rarely / Never', description: 'Dinner finished by 7:30–8:30 PM' },
      { id: 'sometimes', label: '1–2 times weekly', description: 'Occasional social or work dinners' },
      { id: 'often', label: 'Frequently (3+ nights/wk)', description: 'Habitual late evening dining' }
    ],
    tags: ['timing', 'late-night']
  },
  // CONDITIONAL: Late night reason
  {
    id: 'diet_late_night_reason',
    section: 'timing',
    category: 'Meal Timing',
    type: 'chips',
    question: 'What commonly leads to late-night eating?',
    description: 'Understanding the underlying habit pattern.',
    required: false,
    conditions: [
      { questionId: 'diet_late_night_eating', operator: 'notEquals', value: 'rarely' }
    ],
    options: [
      { id: 'work_hours', label: 'Late work / commute finish' },
      { id: 'late_hunger', label: 'True intense hunger before bed' },
      { id: 'screen_snacking', label: 'Snacking while watching TV/phone' },
      { id: 'stress_craving', label: 'Stress or comfort unwind' }
    ],
    tags: ['timing', 'habits']
  },

  // SECTION 2: APPETITE (AGNI)
  {
    id: 'diet_appetite_consistency',
    section: 'appetite',
    category: 'Appetite & Hunger',
    type: 'single-select',
    question: 'How would you describe your natural hunger and appetite pattern?',
    description: 'Helps evaluate classical Agni types (Tikshna, Manda, Vishama, or Sama).',
    required: true,
    options: [
      { id: 'regular_sharp', label: 'Sharp & Predictable (Tīkṣṇāgni tendency)', description: 'Strong hunger at fixed times; irritable if meal is delayed' },
      { id: 'moderate_steady', label: 'Balanced & Steady (Samāgni)', description: 'Pleasant appetite that is satisfied easily without heaviness' },
      { id: 'variable_erratic', label: 'Variable & Erratic (Viṣamāgni tendency)', description: 'Very hungry one day, completely uninterested the next' },
      { id: 'sluggish_low', label: 'Low or Sluggish (Mandāgni tendency)', description: 'Rarely feel sharp hunger; easily feels full or heavy after small bites' }
    ],
    tags: ['agni', 'appetite']
  },
  {
    id: 'diet_skipped_meals',
    section: 'appetite',
    category: 'Appetite & Hunger',
    type: 'single-select',
    question: 'Do you routinely skip meals during the week?',
    description: 'Skipping meals when hungry can provoke Vāta and Pitta.',
    required: true,
    options: [
      { id: 'rarely', label: 'Rarely / Never', description: 'Eat at predictable daily times' },
      { id: 'intentional_fasting', label: 'Yes, intentional intermittent fasting', description: 'Structured 16:8 or similar scheduled fasting' },
      { id: 'unintentional_busy', label: 'Yes, unintentionally due to busy schedule', description: 'Forgetting to eat or lacking time to pause' }
    ],
    tags: ['appetite', 'fasting']
  },

  // SECTION 3: DIETARY PATTERN
  {
    id: 'diet_pattern',
    section: 'pattern',
    category: 'Dietary Pattern',
    type: 'single-select',
    question: 'What primary dietary framework do you follow?',
    description: 'Establishes nutritional baseline and metabolic context.',
    required: true,
    options: [
      { id: 'vegetarian', label: 'Vegetarian (Lacto-Ovo or Lacto)', description: 'Plant-based with dairy' },
      { id: 'vegan', label: 'Vegan (Strictly plant-based)', description: 'Exclusively plant-based, no animal products' },
      { id: 'mixed_omnivore', label: 'Mixed / Flexitarian', description: 'Includes poultry, fish, or meat occasionally' },
      { id: 'other', label: 'Specific Therapeutic / Other', description: 'Gluten-free, ketogenic, or physician-directed' }
    ],
    tags: ['diet', 'framework']
  },
  // CONDITIONAL: Vegetarian Protein Preference
  {
    id: 'diet_vegetarian_protein_pref',
    section: 'pattern',
    category: 'Dietary Pattern',
    type: 'chips',
    question: 'What are your primary vegetarian protein sources?',
    description: 'Select the sources you consume multiple times per week.',
    required: false,
    conditions: [
      { questionId: 'diet_pattern', operator: 'includes', value: 'veg' }
    ],
    options: [
      { id: 'lentils_dal', label: 'Moong / Dal / Lentils' },
      { id: 'paneer_dairy', label: 'Paneer / Cottage cheese' },
      { id: 'legumes_chana', label: 'Chickpeas / Rajma / Beans' },
      { id: 'tofu_soy', label: 'Tofu / Soy products' },
      { id: 'nuts_seeds', label: 'Almonds / Walnuts / Seeds' },
      { id: 'protein_shakes', label: 'Plant protein powders' }
    ],
    tags: ['diet', 'protein']
  },

  // SECTION 4: FOOD PREFERENCES (RASA)
  {
    id: 'diet_craved_tastes',
    section: 'preferences',
    category: 'Taste Preferences',
    type: 'multi-select',
    question: 'Which tastes (Rasas) are you naturally drawn to craving most often?',
    description: 'Select up to 3 tastes that most satisfy your palate.',
    required: true,
    maxSelections: 3,
    options: [
      { id: 'sweet', label: 'Sweet (Madhura)', description: 'Grains, root vegetables, dairy, natural sweets' },
      { id: 'spicy', label: 'Pungent / Spicy (Kaṭu)', description: 'Chili, ginger, black pepper, pungent spices' },
      { id: 'salty', label: 'Salty (Lavaṇa)', description: 'Sea salt, savory roasted snacks, chips' },
      { id: 'sour', label: 'Sour (Amla)', description: 'Citrus, yogurt, tamarind, fermented foods' },
      { id: 'bitter', label: 'Bitter (Tikta)', description: 'Leafy greens, dark coffee, turmeric, bitter gourd' },
      { id: 'astringent', label: 'Astringent (Kaṣāya)', description: 'Pomegranate, beans, lentils, green tea' }
    ],
    tags: ['rasa', 'tastes']
  },

  // SECTION 5: HYDRATION
  {
    id: 'diet_water_intake',
    section: 'hydration',
    category: 'Hydration & Fluids',
    type: 'single-select',
    question: 'How much plain water do you typically drink per day?',
    description: 'Excluding caffeinated or sugary beverages.',
    required: true,
    options: [
      { id: 'less_1_liter', label: 'Less than 1 liter (Under 4 glasses)', description: 'Frequently forget to drink' },
      { id: '1_2_liters', label: '1 to 2 liters (4–8 glasses)', description: 'Moderate baseline hydration' },
      { id: '2_3_liters', label: '2 to 3 liters (8–12 glasses)', description: 'Optimal active hydration' },
      { id: 'more_3_liters', label: 'More than 3 liters (12+ glasses)', description: 'High fluid volume' }
    ],
    tags: ['hydration', 'fluids']
  },
  // CONDITIONAL: Low hydration substitute
  {
    id: 'diet_low_hydration_substitute',
    section: 'hydration',
    category: 'Hydration & Fluids',
    type: 'chips',
    question: 'When you are thirsty, what do you usually reach for instead of plain water?',
    description: 'Helps evaluate fluid quality and Pitta/Kapha triggers.',
    required: false,
    conditions: [
      { questionId: 'diet_water_intake', operator: 'equals', value: 'less_1_liter' }
    ],
    options: [
      { id: 'chai_coffee', label: 'Chai or coffee' },
      { id: 'carbonated_soda', label: 'Carbonated soda / Energy drinks' },
      { id: 'fruit_juice', label: 'Packaged fruit juice' },
      { id: 'herbal_tea', label: 'Warm herbal infusions' }
    ],
    tags: ['hydration', 'substitutes']
  },
  {
    id: 'diet_water_temperature',
    section: 'hydration',
    category: 'Hydration & Fluids',
    type: 'segmented-control',
    question: 'What temperature of drinking water do you instinctively prefer?',
    description: 'Ayurveda notes that ice-cold water diminishes gastric digestive fire (Agni).',
    required: true,
    options: [
      { id: 'ice_cold', label: 'Ice cold / Chilled' },
      { id: 'room_temp', label: 'Room temperature' },
      { id: 'warm', label: 'Warm / Hot water' }
    ],
    tags: ['hydration', 'temperature']
  },

  // SECTION 6: EATING HABITS
  {
    id: 'diet_eating_speed',
    section: 'habits',
    category: 'Eating Behavior',
    type: 'single-select',
    question: 'At what pace do you typically finish a standard meal?',
    description: 'Chewing speed influences mechanical breakdown and satiety signaling.',
    required: true,
    options: [
      { id: 'very_fast', label: 'Fast (Under 10 minutes)', description: 'Swallow quickly, eat on the go' },
      { id: 'moderate_paced', label: 'Moderate (15–25 minutes)', description: 'Chew well, comfortable pacing' },
      { id: 'slow_relaxed', label: 'Slow & Leisurely (30+ minutes)', description: 'Takes time with each bite' }
    ],
    tags: ['habits', 'speed']
  },
  {
    id: 'diet_distracted_eating',
    section: 'habits',
    category: 'Eating Behavior',
    type: 'frequency',
    question: 'How often do you eat meals while looking at a phone, laptop, or TV?',
    description: 'Mindful presence allows sensory appraisal of tastes and fullness signals.',
    required: true,
    options: [
      { id: 'frequently', label: 'Almost every meal', description: 'Screens are an automatic meal companion' },
      { id: 'sometimes', label: 'Sometimes (3–5 meals/wk)', description: 'Occasionally when dining alone' },
      { id: 'rarely', label: 'Rarely / Never', description: 'Eat at a table with full presence' }
    ],
    tags: ['habits', 'mindfulness']
  },

  // SECTION 7: DIGESTIVE CONTEXT
  {
    id: 'diet_digestive_discomfort',
    section: 'digestive',
    category: 'Digestive Experience',
    type: 'yes-no',
    question: 'Do you routinely experience post-meal digestive discomfort?',
    description: 'E.g., bloating, acidity, prolonged heaviness, or erratic transit.',
    required: true,
    tags: ['digestive', 'experience']
  },
  // CONDITIONAL FOLLOW-UPS: Only when digestive_discomfort == 'yes'
  {
    id: 'diet_bloating_freq',
    section: 'digestive',
    category: 'Digestive Experience',
    type: 'frequency',
    question: 'How frequently do you feel abdominal bloating or distension after meals?',
    description: 'Common indicator of impaired Vāta movement in the GI tract (Apāna Vāta).',
    required: false,
    conditions: [
      { questionId: 'diet_digestive_discomfort', operator: 'equals', value: 'yes' }
    ],
    options: [
      { id: 'rarely', label: 'Rarely / Mildly' },
      { id: 'sometimes', label: '1–2 times a week' },
      { id: 'often', label: 'Most days after lunch or dinner' },
      { id: 'daily', label: 'Almost after every meal' }
    ],
    tags: ['digestive', 'bloating']
  },
  {
    id: 'diet_heaviness_after_meals',
    section: 'digestive',
    category: 'Digestive Experience',
    type: 'segmented-control',
    question: 'Do you feel heavy, sluggish, or foggy for hours after eating?',
    description: 'Classical sign of slow digestion or Ama accumulation.',
    required: false,
    conditions: [
      { questionId: 'diet_digestive_discomfort', operator: 'equals', value: 'yes' }
    ],
    options: [
      { id: 'rarely', label: 'No, feel energized' },
      { id: 'sometimes', label: 'Only after rich meals' },
      { id: 'frequently', label: 'Yes, routinely feel weighed down' }
    ],
    tags: ['digestive', 'heaviness']
  },
  {
    id: 'diet_acidity_freq',
    section: 'digestive',
    category: 'Digestive Experience',
    type: 'segmented-control',
    question: 'Do you experience heartburn or sour regurgitation (Amlapitta tendency)?',
    description: 'Reflects elevated Pitta heat in the digestive tract.',
    required: false,
    conditions: [
      { questionId: 'diet_digestive_discomfort', operator: 'equals', value: 'yes' }
    ],
    options: [
      { id: 'rarely', label: 'Rarely / Never' },
      { id: 'spicy_only', label: 'Only with deep-fried / spicy foods' },
      { id: 'frequent', label: 'Frequently / Several times a week' }
    ],
    tags: ['digestive', 'acidity']
  },
  {
    id: 'diet_bowel_regularity',
    section: 'digestive',
    category: 'Digestive Experience',
    type: 'single-select',
    question: 'How regular is your morning bowel elimination (Koṣṭha tendency)?',
    description: 'Provides critical context on metabolic transit time and colon health.',
    required: false,
    conditions: [
      { questionId: 'diet_digestive_discomfort', operator: 'equals', value: 'yes' }
    ],
    options: [
      { id: 'regular_once_daily', label: 'Regular & Complete (Daily upon waking)', description: 'Effortless morning evacuation' },
      { id: 'sluggish_infrequent', label: 'Sluggish / Dry (Tendency to skip days)', description: 'Hard, dry, or irregular transit (Krura Kostha)' },
      { id: 'loose_frequent', label: 'Frequent / Soft (2+ times daily)', description: 'Quick transit, loose stools (Mrudu Kostha)' }
    ],
    tags: ['digestive', 'elimination']
  },

  // SECTION 8: MEAL ENVIRONMENT
  {
    id: 'diet_meal_environment',
    section: 'environment',
    category: 'Meal Environment',
    type: 'single-select',
    question: 'In what atmosphere do you usually consume your meals?',
    description: 'Mental state directly influences enzymatic secretion and vagal tone.',
    required: true,
    options: [
      { id: 'calm_seated', label: 'Calm & Seated with family or mindful quiet', description: 'Peaceful setting dedicated to eating' },
      { id: 'work_desk', label: 'At Work Desk or during meetings', description: 'Multitasking while eating' },
      { id: 'in_transit', label: 'In transit / Walking / In car', description: 'Hurried, eating on the move' }
    ],
    tags: ['environment', 'mindfulness']
  },

  // SECTION 9: FOOD FRESHNESS
  {
    id: 'diet_fresh_vs_packaged',
    section: 'freshness',
    category: 'Food Freshness & Quality',
    type: 'segmented-control',
    question: 'How much of your daily food is freshly cooked from whole ingredients?',
    description: 'Ayurveda prioritizes high Prāṇa food cooked within hours of consumption.',
    required: true,
    options: [
      { id: 'mostly_fresh', label: 'Mostly Fresh (>80% home cooked)' },
      { id: 'half_and_half', label: 'About 50% Fresh / 50% Takeout or Frozen' },
      { id: 'mostly_convenience', label: 'Predominantly Packaged / Instant / Takeout' }
    ],
    tags: ['freshness', 'prana']
  },

  // SECTION 10: SEASONAL AWARENESS
  {
    id: 'diet_seasonal_awareness',
    section: 'seasonal',
    category: 'Seasonal Adaptation',
    type: 'yes-no',
    question: 'Do you naturally adapt your food choices with seasonal weather changes (Ṛtucaryā)?',
    description: 'E.g., warming soups and spices in winter; cooling melons and salads in summer.',
    required: true,
    tags: ['seasonal', 'ritucharya']
  }
];
