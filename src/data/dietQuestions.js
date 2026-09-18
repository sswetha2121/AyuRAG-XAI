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
