/**
 * AyuRAG-XAI Structured Lifestyle Assessment Question Data (Dinacharya)
 * Data-driven parameters capturing daily routines, sleep architecture,
 * physical activity, workplace ergonomics, stress dynamics, and hydration.
 */

export const LIFESTYLE_CATEGORIES = [
  {
    id: 'routine',
    number: '01',
    name: 'Daily Routine',
    sanskritName: 'Dinacharya',
    description: 'Circadian rhythm, wake-up schedule, and meal timing consistency.',
    icon: 'Sun'
  },
  {
    id: 'activity',
    number: '02',
    name: 'Physical Activity',
    sanskritName: 'Vyāyāma',
    description: 'Baseline daily movement, workout styles, and physical exertion.',
    icon: 'Activity'
  },
  {
    id: 'sleep',
    number: '03',
    name: 'Sleep & Rest',
    sanskritName: 'Nidrā',
    description: 'Sleep duration, restorative depth, and sleep environment quality.',
    icon: 'Moon'
  },
  {
    id: 'work',
    number: '04',
    name: 'Work / Study Patterns',
    sanskritName: 'Karma & Indriya',
    description: 'Postural dynamics, screen exposure, and movement break frequency.',
    icon: 'Briefcase'
  },
  {
    id: 'stress',
    number: '05',
    name: 'Stress & Wellbeing',
    sanskritName: 'Mānasa & Śānti',
    description: 'Cognitive load, mental pace, and natural decompression methods.',
    icon: 'HeartPulse'
  },
  {
    id: 'habits',
    number: '06',
    name: 'Daily Habits & Hydration',
    sanskritName: 'Abhyāsa & Jala',
    description: 'Fluid intake habits, water temperature, and everyday micro-routines.',
    icon: 'GlassWater'
  }
];

export const LIFESTYLE_SECTIONS = [
  {
    id: 'routine',
    title: 'Daily Routine',
    sanskrit: 'Dinacharya',
    description: 'Circadian rhythm stability, morning habits, and waking schedule.'
  },
  {
    id: 'sleep',
    title: 'Sleep & Rest',
    sanskrit: 'Nidrā',
    description: 'Duration, sleep quality, nocturnal awakenings, and bedtime habits.'
  },
  {
    id: 'activity',
    title: 'Physical Activity',
    sanskrit: 'Vyāyāma',
    description: 'Movement frequency, exercise intensity, and sedentary counterbalance.'
  },
  {
    id: 'work',
    title: 'Work & Study Environment',
    sanskrit: 'Kārya',
    description: 'Daily mental exertion, sitting posture, and work hours structure.'
  },
  {
    id: 'stress',
    title: 'Stress & Mental Balance',
    sanskrit: 'Mānasika',
    description: 'Perceived stress levels, common triggers, and coping tendencies.'
  },
  {
    id: 'screens',
    title: 'Screen & Digital Exposure',
    sanskrit: 'Indriya Saṅga',
    description: 'Daily visual display exposure and evening wind-down boundaries.'
  },
  {
    id: 'habits',
    title: 'Daily Habits',
    sanskrit: 'Sātmya',
    description: 'Beverage preferences, caffeine timing, and afternoon rest habits.'
  },
  {
    id: 'recovery',
    title: 'Rest & Restoration',
    sanskrit: 'Viśrāma',
    description: 'Mental breaks, leisure engagement, and relaxation practices.'
  },
  {
    id: 'consistency',
    title: 'Rhythm Consistency',
    sanskrit: 'Niyama',
    description: 'Self-rated overall stability across weekdays and weekends.'
  }
];

export const LIFESTYLE_QUESTIONS = [
  // 1. Daily Routine: Consistency
  {
    id: 'lifestyle_q1_routine_consistency',
    category: 'Daily Routine',
    categoryId: 'routine',
    sanskritTerm: 'Nitya Kāla Krama',
    type: 'frequency',
    question: 'How consistent is your daily schedule and meal timing?',
    description: 'Think about whether you wake, eat meals, and wind down around the same hours every day.',
    hint: 'Regularity in meal times and wake hours stabilizes Agni (metabolic fire) and pacifies Vata.',
    options: [
      {
        id: 'opt_q1_rarely',
        value: 'rarely',
        label: 'Rarely Consistent',
        description: 'Erratic wake times, skipped meals, and unpredictable bedtime schedule'
      },
      {
        id: 'opt_q1_sometimes',
        value: 'sometimes',
        label: 'Sometimes Consistent',
        description: 'Varies substantially between weekdays and weekends'
      },
      {
        id: 'opt_q1_usually',
        value: 'usually',
        label: 'Usually Consistent',
        description: 'General rhythm with minor daily fluctuations of within 1 hour'
      },
      {
        id: 'opt_q1_daily',
        value: 'very-consistent',
        label: 'Highly Consistent',
        description: 'Strict, predictable routine with meals and sleep at fixed hours'
      }
    ]
  },

  // 2. Daily Routine: Sleep & Wake Timings
  {
    id: 'lifestyle_q2_sleep_wake_timing',
    category: 'Daily Routine',
    categoryId: 'routine',
    sanskritTerm: 'Brāhma Muhūrta & Śayana',
    type: 'time-routine',
    question: 'What are your typical waking and bedtime hours?',
    description: 'Ayurvedic Dinacharya emphasizes alignment with natural solar and circadian cycles.',
    hint: 'Waking before or near sunrise aligns with energetic Vata time (02:00–06:00), promoting mental clarity.',
    wakePresets: [
      { id: 'wake_early', time: '05:00 - 06:00', label: 'Brahma Muhurta (Early Dawn)', period: 'morning' },
      { id: 'wake_standard', time: '06:00 - 07:00', label: 'Sunrise / Standard Morning', period: 'morning' },
      { id: 'wake_mid', time: '07:00 - 08:30', label: 'Mid-Morning Waking', period: 'day' },
      { id: 'wake_late', time: '08:30+', label: 'Late Morning Waking', period: 'day' }
    ],
    bedPresets: [
      { id: 'bed_early', time: '21:30 - 22:30', label: 'Early Night (Kapha Period)', period: 'evening' },
      { id: 'bed_standard', time: '22:30 - 23:30', label: 'Late Evening', period: 'night' },
      { id: 'bed_midnight', time: '23:30 - 01:00', label: 'Midnight / Post-Midnight', period: 'night' },
      { id: 'bed_late', time: '01:00+', label: 'Late Night / Night Owl', period: 'night' }
    ]
  },

  // 3. Physical Activity: General Activity Level
  {
    id: 'lifestyle_q3_activity_level',
    category: 'Physical Activity',
    categoryId: 'activity',
    sanskritTerm: 'Vyāyāma Mātrā',
    type: 'visual-cards',
    question: 'How active are you on a typical day?',
    description: 'Think about your usual baseline rather than an unusually busy or restful day.',
    hint: 'Vyayama should be practiced up to half of one’s capacity (Balardha) for optimal vitality.',
    options: [
      {
        id: 'opt_act_sedentary',
        value: 'sedentary',
        label: 'Mostly Sedentary',
        description: 'Desk or study based, sitting for most of the waking hours with minimal exertion',
        icon: 'Armchair',
        badge: 'Low Output'
      },
      {
        id: 'opt_act_light',
        value: 'lightly-active',
        label: 'Lightly Active',
        description: 'Incidental walking, household chores, or light leisurely strolls daily',
        icon: 'Footprints',
        badge: 'Moderate Daily Steps'
      },
      {
        id: 'opt_act_moderate',
        value: 'moderately-active',
        label: 'Moderately Active',
        description: 'Regular intentional exercise, brisk walks, yoga or gym sessions 3–5 days a week',
        icon: 'Flame',
        badge: 'Active Lifestyle'
      },
      {
        id: 'opt_act_high',
        value: 'highly-active',
        label: 'Highly Active',
        description: 'Physically demanding occupation, rigorous athletic training, or daily heavy workouts',
        icon: 'Zap',
        badge: 'Intense Energy'
      }
    ]
  },

  // 4. Physical Activity: Exercise Modalities (Multi-select)
  {
    id: 'lifestyle_q4_exercise_modalities',
    category: 'Physical Activity',
    categoryId: 'activity',
    sanskritTerm: 'Vyāyāma Prakāra',
    type: 'multi-select-chips',
    question: 'Which activities or movement practices do you regularly engage in?',
    description: 'Select all modalities that are part of your regular weekly routine.',
    hint: 'Different dosha types thrive with distinct forms of movement (e.g. Asanas for Vata, Strength for Kapha).',
    options: [
      { id: 'walk', label: 'Brisk Walking', category: 'cardio' },
      { id: 'yoga', label: 'Yoga & Asanas', category: 'mind-body' },
      { id: 'gym', label: 'Gym & Strength Training', category: 'strength' },
      { id: 'running', label: 'Running / Jogging', category: 'cardio' },
      { id: 'swimming', label: 'Swimming', category: 'endurance' },
      { id: 'cycling', label: 'Cycling & Sports', category: 'cardio' },
      { id: 'pranayama', label: 'Pranayama & Breathwork', category: 'mind-body' },
      { id: 'pilates', label: 'Pilates / Core Fitness', category: 'strength' },
      { id: 'martial_arts', label: 'Martial Arts / Combat', category: 'agility' },
      { id: 'none', label: 'None at present', isExclusive: true }
    ]
  },

  // 5. Sleep: Sleep Duration & Quality
  {
    id: 'lifestyle_q5_sleep_duration_quality',
    category: 'Sleep & Rest',
    categoryId: 'sleep',
    sanskritTerm: 'Nidrā Guṇa & Parimāṇa',
    type: 'sleep-duration-quality',
    question: 'How many hours do you usually sleep, and how restorative is it?',
    description: 'Sleep is one of the three foundational pillars (Trayopastambha) of Ayurvedic vitality.',
    hint: 'Sound sleep allows Ojas (immune essence) to replenish and dhatus (body tissues) to repair.',
    durationOptions: [
      { id: 'dur_lt5', value: '< 5', label: '< 5 hrs', subtext: 'Insufficient' },
      { id: 'dur_5_6', value: '5–6', label: '5–6 hrs', subtext: 'Short' },
      { id: 'dur_6_7', value: '6–7', label: '6–7 hrs', subtext: 'Moderate' },
      { id: 'dur_7_8', value: '7–8', label: '7–8 hrs', subtext: 'Optimal' },
      { id: 'dur_gt8', value: '8+', label: '8+ hrs', subtext: 'Extended' }
    ],
    qualityOptions: [
      { id: 'qual_poor', value: 'poor', label: 'Poor', description: 'Restless, interrupted, hard to fall asleep, wake up exhausted' },
      { id: 'qual_fair', value: 'fair', label: 'Fair', description: 'Light sleep, occasional mid-night waking, moderate morning energy' },
      { id: 'qual_good', value: 'good', label: 'Good', description: 'Mostly uninterrupted, fall asleep easily, feel refreshed' },
      { id: 'qual_very_good', value: 'very-good', label: 'Very Good', description: 'Deep, sound, peaceful sleep, wake up energized and alert' }
    ]
  },

  // 6. Work / Study: Workplace Posture & Environment
  {
    id: 'lifestyle_q6_work_pattern',
    category: 'Work / Study Patterns',
    categoryId: 'work',
    sanskritTerm: 'Kārya Svarūpa',
    type: 'visual-cards',
    question: 'What best describes your primary daily work or study environment?',
    description: 'Helps evaluate structural postural load, ergonomic stress, and cognitive pacing.',
    hint: 'Long static postures can aggravate Vata in the lumbar and joint regions.',
    options: [
      {
        id: 'opt_work_desk',
        value: 'desk-based',
        label: 'Desk-Based (Computer / Study)',
        description: 'Prolonged sitting at workstation, laptop, or desk throughout most of the working day',
        icon: 'Laptop',
        badge: 'Sedentary Posture'
      },
      {
        id: 'opt_work_mixed',
        value: 'mixed-activity',
        label: 'Mixed Activity (Desk + Movement)',
        description: 'Combination of sitting, standing, walking around, and engaging in collaborative tasks',
        icon: 'Shuffle',
        badge: 'Balanced Posture'
      },
      {
        id: 'opt_work_field',
        value: 'field-based',
        label: 'Field / On-Site / Travel',
        description: 'Active on-site visits, frequent commuting, client presentations, or outdoor activities',
        icon: 'MapPin',
        badge: 'Dynamic Environment'
      },
      {
        id: 'opt_work_physical',
        value: 'physically-demanding',
        label: 'Physically Demanding Labor',
        description: 'Standing on feet for long shifts, lifting, manual tasks, or clinical healthcare floor work',
        icon: 'Activity',
        badge: 'High Musculoskeletal Load'
      },
      {
        id: 'opt_work_shift',
        value: 'variable-shift',
        label: 'Variable / Rotational Shift Work',
        description: 'Irregular hours, night shifts, on-call duties, or frequent time-zone travel',
        icon: 'Clock',
        badge: 'Circadian Strain'
      }
    ]
  },

  // 7. Work / Study: Screen Time & Movement Breaks
  {
    id: 'lifestyle_q7_screen_breaks',
    category: 'Work / Study Patterns',
    categoryId: 'work',
    sanskritTerm: 'Indriya Viśrānti',
    type: 'segmented-choice',
    question: 'How frequently do you take intentional breaks away from screens and sitting?',
    description: 'Pauses to rest the eyes (Netra) and stretch limbs support micro-circulation and sensory balance.',
    hint: 'Excess screen radiation increases Pitta in the eyes (Alochaka Pitta) and aggravates Vata.',
    options: [
      {
        id: 'opt_break_rarely',
        value: 'rarely',
        label: 'Rarely',
        description: 'Sit and stare at screens continuously for 3+ hours without stepping away'
      },
      {
        id: 'opt_break_sometimes',
        value: 'sometimes',
        label: 'Sometimes',
        description: 'Take a break only when feeling noticeable eye strain or muscle fatigue'
      },
      {
        id: 'opt_break_often',
        value: 'often',
        label: 'Often (Every 60–90 min)',
        description: 'Periodically stand up, look into the distance, hydrate, and stretch'
      },
      {
        id: 'opt_break_regularly',
        value: 'regularly',
        label: 'Regularly (Every 30–45 min)',
        description: 'Conscious micro-breaks with eye palming, neck rolls, and postural realignment'
      }
    ]
  },

  // 8. Stress & Wellbeing: Mental Stress Frequency
  {
    id: 'lifestyle_q8_stress_frequency',
    category: 'Stress & Wellbeing',
    categoryId: 'stress',
    sanskritTerm: 'Mānasa Tāpa & Vega',
    type: 'frequency',
    question: 'How often do you feel mentally rushed, overloaded, or stressed during a typical week?',
    description: 'Reflect on your typical cognitive pressure and emotional load without judgment.',
    hint: 'Mental stress (Rajasik overload) dries out bodily tissues and disrupts digestive fire.',
    options: [
      {
        id: 'opt_stress_rarely',
        value: 'rarely',
        label: 'Rarely (Calm & Balanced)',
        description: 'Generally feel unhurried, composed, and able to manage unexpected tasks with ease'
      },
      {
        id: 'opt_stress_sometimes',
        value: 'sometimes',
        label: 'Sometimes (Manageable Peaks)',
        description: 'Occasional stressful episodes around tight deadlines or demanding situations'
      },
      {
        id: 'opt_stress_often',
        value: 'often',
        label: 'Often (Frequent Demands)',
        description: 'Regular feelings of time scarcity, high mental pressure, or recurring tension'
      },
      {
        id: 'opt_stress_very_often',
        value: 'very-often',
        label: 'Very Often (Persistent Load)',
        description: 'Chronic multi-tasking, constant rushing, or prolonged cognitive exhaustion'
      }
    ]
  },

  // 9. Stress & Wellbeing: Unwinding & Decompression Practices (Multi-select)
  {
    id: 'lifestyle_q9_relaxation_methods',
    category: 'Stress & Wellbeing',
    categoryId: 'stress',
    sanskritTerm: 'Śānti Upāya',
    type: 'multi-select-chips',
    question: 'How do you typically unwind and restore mental clarity when feeling overloaded?',
    description: 'Select your primary restorative coping strategies.',
    hint: 'Sattvic practices (nature, meditation, gentle music) calm the nervous system (Majja Dhatu).',
    options: [
      { id: 'meditation', label: 'Meditation & Breathwork', category: 'sattvic' },
      { id: 'nature', label: 'Nature & Outdoor Walks', category: 'sattvic' },
      { id: 'reading', label: 'Reading & Calming Music', category: 'leisure' },
      { id: 'social', label: 'Time with Family & Friends', category: 'social' },
      { id: 'workout', label: 'Physical Exercise / Sports', category: 'active' },
      { id: 'digital', label: 'Movies / Social Media / Games', category: 'digital' },
      { id: 'quiet_rest', label: 'Quiet Solitude / Napping', category: 'rest' },
      { id: 'none_stress', label: 'No specific unwinding habit', isExclusive: true }
    ]
  },

  // 10. Daily Habits & Hydration: Fluid Intake & Water Temperature
  {
    id: 'lifestyle_q10_hydration_habit',
    category: 'Daily Habits & Hydration',
    categoryId: 'habits',
    sanskritTerm: 'Jala Pāna Vidhi',
    type: 'visual-cards',
    question: 'What is your typical daily fluid intake and water temperature preference?',
    description: 'In Ayurveda, water temperature and hydration rhythm directly influence Agni (digestive fire).',
    hint: 'Warm or room-temperature water (Ushnodaka) kindles digestive fire without generating Ama (toxins).',
    options: [
      {
        id: 'opt_hydra_cold',
        value: 'chilled-iced',
        label: 'Chilled / Iced Beverages',
        description: 'Prefer cold refrigerated water or iced drinks throughout the day',
        icon: 'IceCream',
        badge: 'Cools Agni'
      },
      {
        id: 'opt_hydra_room',
        value: 'room-temp-moderate',
        label: 'Room-Temperature Water (1.5–2 Liters)',
        description: 'Drink plain room-temperature water steadily throughout the day when thirsty',
        icon: 'GlassWater',
        badge: 'Balanced'
      },
      {
        id: 'opt_hydra_warm',
        value: 'warm-herbal-2l',
        label: 'Warm Water & Herbal Infusions (2+ Liters)',
        description: 'Regularly sip warm water, hot lemon water, or herbal teas between meals',
        icon: 'Coffee',
        badge: 'Ignites Agni'
      },
      {
        id: 'opt_hydra_low',
        value: 'minimal-irregular',
        label: 'Minimal / Irregular Fluid Intake',
        description: 'Often forget to drink fluids; mostly drink only during large meals',
        icon: 'AlertCircle',
        badge: 'Dryness Risk'
      }
    ]
  }
];

export const LIFESTYLE_DETAILED_QUESTIONS = [
  // SECTION 1: DAILY ROUTINE
  {
    id: 'lifestyle_wake_time',
    section: 'routine',
    category: 'Daily Routine',
    type: 'time',
    question: 'What time do you usually wake up on weekdays?',
    description: 'Select the hour bracket that best describes your regular morning wake-up.',
    required: true,
    options: [
      { id: 'before_6am', label: 'Before 6:00 AM', description: 'Early Brahma Muhurta / Vata dawn' },
      { id: '6am_7am', label: '6:00 AM – 7:00 AM', description: 'Sunup window / Balanced wakefulness' },
      { id: '7am_8am', label: '7:00 AM – 8:00 AM', description: 'Mid morning' },
      { id: 'after_8am', label: 'After 8:00 AM', description: 'Late morning rise' }
    ],
    tags: ['circadian', 'routine', 'wake-up'],
    relevance: { prakriti: ['vata', 'pitta', 'kapha'] }
  },
  {
    id: 'lifestyle_wake_consistency',
    section: 'routine',
    category: 'Daily Routine',
    type: 'segmented-control',
    question: 'How consistent is your morning wake-up time?',
    description: 'Comparing typical weekdays against weekends or free days.',
    required: true,
    options: [
      { id: 'very_regular', label: 'Very Regular (±30 min)' },
      { id: 'regular', label: 'Mostly Regular (±1 hr)' },
      { id: 'variable', label: 'Variable (±2 hrs)' },
      { id: 'irregular', label: 'Erratic / Shifts frequently' }
    ],
    tags: ['routine', 'consistency']
  },
  {
    id: 'lifestyle_morning_routine_habits',
    section: 'routine',
    category: 'Daily Routine',
    type: 'chips',
    question: 'Which of the following are part of your regular morning routine?',
    description: 'Select all practices you naturally do within your first hour awake.',
    required: false,
    options: [
      { id: 'warm_water', label: 'Warm water or herbal tea' },
      { id: 'tongue_cleaning', label: 'Tongue scraping / Oral hygiene' },
      { id: 'movement_stretch', label: 'Gentle stretching / Yoga' },
      { id: 'meditation', label: 'Meditation or quiet breathwork' },
      { id: 'direct_phone', label: 'Checking phone / notifications immediately' },
      { id: 'caffeine_first', label: 'Coffee or tea first thing' },
      { id: 'outdoor_light', label: 'Stepping outside into sunlight' }
    ],
    tags: ['dinacharya', 'habits']
  },

  // SECTION 2: SLEEP
  {
    id: 'lifestyle_sleep_duration',
    section: 'sleep',
    category: 'Sleep',
    type: 'slider',
    question: 'How many hours of sleep do you typically get per night?',
    description: 'Drag the slider to your average nightly sleep duration.',
    required: true,
    min: 4,
    max: 11,
    step: 0.5,
    unit: 'hours',
    defaultValue: 7,
    ticks: [
      { value: 4, label: '<5h' },
      { value: 6, label: '6h' },
      { value: 8, label: '8h' },
      { value: 10, label: '10h+' }
    ],
    tags: ['sleep', 'duration']
  },
  {
    id: 'lifestyle_bedtime_consistency',
    section: 'sleep',
    category: 'Sleep',
    type: 'single-select',
    question: 'What time do you usually go to bed?',
    description: 'Your typical lights-out time on standard work/study days.',
    required: true,
    options: [
      { id: 'before_10pm', label: 'Before 10:00 PM', description: 'Early Kapha window / Deep restoration' },
      { id: '10pm_11pm', label: '10:00 PM – 11:00 PM', description: 'Optimal circadian wind-down' },
      { id: '11pm_12am', label: '11:00 PM – Midnight', description: 'Late wind-down' },
      { id: 'after_12am', label: 'Past Midnight', description: 'Pitta nocturnal activity phase' }
    ],
    tags: ['sleep', 'bedtime']
  },
  {
    id: 'lifestyle_sleep_quality',
    section: 'sleep',
    category: 'Sleep',
    type: 'single-select',
    question: 'How would you describe your overall sleep quality?',
    description: 'How restorative and continuous your sleep feels over a normal week.',
    required: true,
    options: [
      { id: 'deep_restful', label: 'Deep & Restful', description: 'Wake up refreshed with clear mental energy' },
      { id: 'good', label: 'Fairly Good', description: 'Occasional light nights but mostly sufficient' },
      { id: 'light_restless', label: 'Light & Easily Disturbed', description: 'Sensitive to noise, temperature, or mild restlessness' },
      { id: 'fragmented', label: 'Fragmented & Fatiguing', description: 'Frequent awakenings, wake up feeling unrefreshed' }
    ],
    tags: ['sleep', 'quality']
  },
  {
    id: 'lifestyle_night_awakenings',
    section: 'sleep',
    category: 'Sleep',
    type: 'frequency',
    question: 'How often do you wake up during the middle of the night?',
    description: 'Excluding waking up for an intentional morning alarm.',
    required: true,
    options: [
      { id: 'rarely', label: 'Rarely / Never', description: 'Sleep through the night continuously' },
      { id: '1_2_weekly', label: '1–2 times a week', description: 'Occasional awakenings' },
      { id: 'sometimes', label: '3–4 times a week', description: 'Moderate interruption' },
      { id: 'frequently', label: 'Almost every night', description: 'Consistent nocturnal disruptions' }
    ],
    tags: ['sleep', 'awakenings']
  },

  // SECTION 3: PHYSICAL ACTIVITY
  {
    id: 'lifestyle_activity_freq',
    section: 'activity',
    category: 'Physical Activity',
    type: 'frequency',
    question: 'How frequently do you engage in intentional exercise or brisk movement?',
    description: 'Includes walking, running, gym workouts, yoga, cycling, sports, or heavy yard work.',
    required: true,
    options: [
      { id: 'daily', label: 'Daily (6–7 days/wk)', description: 'Consistent daily physical discipline' },
      { id: '3_4_weekly', label: '3–5 times per week', description: 'Moderate regular regimen' },
      { id: '1_2_weekly', label: '1–2 times per week', description: 'Intermittent or weekend exercise' },
      { id: 'rarely', label: 'Rarely or Never', description: 'Predominantly sedentary lifestyle' }
    ],
    tags: ['activity', 'exercise']
  },
  {
    id: 'lifestyle_activity_intensity',
    section: 'activity',
    category: 'Physical Activity',
    type: 'segmented-control',
    question: 'What is the typical intensity of your physical movement?',
    description: 'Ayurveda generally recommends exercising up to half of one’s capacity (Ardha Shakti).',
    required: false,
    conditions: [
      { questionId: 'lifestyle_activity_freq', operator: 'notEquals', value: 'rarely' }
    ],
    options: [
      { id: 'light', label: 'Light (Gentle strolls, easy stretching)' },
      { id: 'moderate', label: 'Moderate (Brisk walk, steady yoga, light sweat)' },
      { id: 'vigorous', label: 'High / Heavy (Cardio, HIIT, heavy weights)' }
    ],
    tags: ['activity', 'intensity']
  },
  {
    id: 'lifestyle_sedentary_hours',
    section: 'activity',
    category: 'Physical Activity',
    type: 'slider',
    question: 'Approximately how many hours per day do you spend seated?',
    description: 'Desk work, commuting, studying, and couch screen time combined.',
    required: true,
    min: 2,
    max: 14,
    step: 1,
    unit: 'hours/day',
    defaultValue: 7,
    ticks: [
      { value: 2, label: '2h' },
      { value: 6, label: '6h' },
      { value: 9, label: '9h' },
      { value: 12, label: '12h+' }
    ],
    tags: ['sedentary', 'posture']
  },

  // SECTION 4: WORK / STUDY
  {
    id: 'lifestyle_work_type',
    section: 'work',
    category: 'Work / Study',
    type: 'single-select',
    question: 'Which environment best characterizes your primary daily occupation?',
    description: 'Provides insight into physical posture and cognitive stamina requirements.',
    required: true,
    options: [
      { id: 'desk_computer', label: 'Desk & Computer-Bound', description: 'Intensive digital screen work with continuous sitting' },
      { id: 'standing_active', label: 'Standing / On Your Feet', description: 'Retail, healthcare, teaching, or continuous light mobility' },
      { id: 'physical_labor', label: 'Manual or Field Work', description: 'High physical output throughout the workday' },
      { id: 'flexible_hybrid', label: 'Hybrid / Mixed Movement', description: 'Alternating between desk work, walking, and diverse tasks' }
    ],
    tags: ['work', 'occupation']
  },
  {
    id: 'lifestyle_work_breaks',
    section: 'work',
    category: 'Work / Study',
    type: 'segmented-control',
    question: 'Do you take regular brief pauses during your work/study day?',
    description: 'Standing up, stepping away from tasks, stretching, or resting eyes.',
    required: true,
    options: [
      { id: 'every_hour', label: 'Hourly pauses' },
      { id: 'midday_only', label: 'Only at lunch' },
      { id: 'rarely', label: 'Rarely / Long uninterrupted blocks' }
    ],
    tags: ['work', 'breaks']
  },

  // SECTION 5: STRESS
  {
    id: 'lifestyle_perceived_stress',
    section: 'stress',
    category: 'Stress & Mental Balance',
    type: 'scale',
    question: 'How would you rate your typical perceived stress level over the past month?',
    description: 'Rate on a scale from 1 (Calm & unburdened) to 10 (Overwhelming / Chronic tension).',
    required: true,
    min: 1,
    max: 10,
    minLabel: '1 — Calm & Grounded',
    maxLabel: '10 — Severe Tension',
    defaultValue: 5,
    tags: ['stress', 'manas']
  },
  {
    id: 'lifestyle_stress_frequency',
    section: 'stress',
    category: 'Stress & Mental Balance',
    type: 'single-select',
    question: 'How frequently do you feel mentally overwhelmed or rushed?',
    description: 'Helps characterize Vāta/Pitta nervous system acceleration.',
    required: true,
    options: [
      { id: 'rarely', label: 'Rarely', description: 'Generally centered and at ease' },
      { id: 'situational', label: 'Situationally', description: 'Only during specific deadlines or acute life events' },
      { id: 'frequent', label: 'Frequent (Several days a week)', description: 'Recurrent rush or tension throughout normal days' },
      { id: 'chronic_daily', label: 'Daily / Constant', description: 'Persistent feeling of tension or mental overload' }
    ],
    tags: ['stress', 'frequency']
  },
  {
    id: 'lifestyle_stress_triggers',
    section: 'stress',
    category: 'Stress & Mental Balance',
    type: 'chips',
    question: 'What are your most common everyday stress contributors?',
    description: 'Select any that apply to your current period.',
    required: false,
    options: [
      { id: 'work_deadlines', label: 'Work / Academic deadlines' },
      { id: 'irregular_hours', label: 'Irregular hours / Lack of time' },
      { id: 'family_social', label: 'Family & social commitments' },
      { id: 'sleep_deprivation', label: 'Sleep debt / Fatigue' },
      { id: 'digital_overload', label: 'Constant emails / Notifications' },
      { id: 'health_worries', label: 'Health or body concerns' }
    ],
    tags: ['stress', 'triggers']
  },

  // SECTION 6: SCREEN TIME
  {
    id: 'lifestyle_daily_screen_hours',
    section: 'screens',
    category: 'Screen & Digital Exposure',
    type: 'slider',
    question: 'What is your total daily digital screen exposure?',
    description: 'Combining computers, smartphones, tablets, and television.',
    required: true,
    min: 2,
    max: 16,
    step: 1,
    unit: 'hours/day',
    defaultValue: 7,
    ticks: [
      { value: 2, label: '2h' },
      { value: 6, label: '6h' },
      { value: 10, label: '10h' },
      { value: 14, label: '14h+' }
    ],
    tags: ['screens', 'digital']
  },
  {
    id: 'lifestyle_late_night_screens',
    section: 'screens',
    category: 'Screen & Digital Exposure',
    type: 'yes-no',
    question: 'Do you routinely look at screens within 30–60 minutes of sleep?',
    description: 'Night blue-spectrum exposure influences melatonin release and Pitta-ocular strain.',
    required: true,
    tags: ['screens', 'night']
  },

  // SECTION 7: HABITS
  {
    id: 'lifestyle_caffeine_cups',
    section: 'habits',
    category: 'Daily Habits',
    type: 'single-select',
    question: 'How many cups of caffeinated beverages (coffee, tea, energy drinks) do you drink daily?',
    description: 'Helps evaluate digestive stimulation and central nervous system arousal.',
    required: true,
    options: [
      { id: 'none', label: 'None / Decaffeinated', description: 'Zero caffeine consumption' },
      { id: '1_cup', label: '1 cup per day', description: 'Light moderate intake, usually morning' },
      { id: '2_3_cups', label: '2–3 cups per day', description: 'Daily reliance throughout morning/afternoon' },
      { id: '4_plus', label: '4 or more cups', description: 'High daily stimulant consumption' }
    ],
    tags: ['habits', 'caffeine']
  },
  {
    id: 'lifestyle_afternoon_naps',
    section: 'habits',
    category: 'Daily Habits',
    type: 'single-select',
    question: 'Do you take daytime naps (Divāsvapna)?',
    description: 'Classical Ayurveda observes that daytime naps can increase Kapha and heaviness, except in summer or high exertion.',
    required: true,
    options: [
      { id: 'never', label: 'Never / Rarely', description: 'Stay awake all day' },
      { id: 'short_power_nap', label: 'Power nap (15–20 minutes)', description: 'Brief restorative pause' },
      { id: 'long_nap', label: 'Long nap (45+ minutes)', description: 'Prolonged sleep in afternoon' }
    ],
    tags: ['habits', 'naps']
  },

  // SECTION 8: REST & RECOVERY
  {
    id: 'lifestyle_recovery_practice',
    section: 'recovery',
    category: 'Rest & Restoration',
    type: 'single-select',
    question: 'How regularly do you engage in intentional relaxation or mindfulness?',
    description: 'E.g., nature walks, Pranayama, reading, creative hobbies, or restful solitude.',
    required: true,
    options: [
      { id: 'regularly', label: 'Regularly (4+ days/week)', description: 'Dedicated daily or weekly renewal practice' },
      { id: 'sometimes', label: 'Occasionally (1–2 days/week)', description: 'When schedule permits' },
      { id: 'rarely', label: 'Rarely or Never', description: 'Downtime is usually occupied with screens or errands' }
    ],
    tags: ['recovery', 'rest']
  },

  // SECTION 9: ROUTINE CONSISTENCY
  {
    id: 'lifestyle_overall_routine_score',
    section: 'consistency',
    category: 'Rhythm Consistency',
    type: 'scale',
    question: 'On a scale of 1 to 10, how consistent is your overall lifestyle rhythm?',
    description: '1 = Unpredictable daily timing, 10 = Predictable, disciplined routine (Sātmya).',
    required: true,
    min: 1,
    max: 10,
    minLabel: '1 — Highly Erratic',
    maxLabel: '10 — Clockwork Routine',
    defaultValue: 6,
    tags: ['consistency', 'dinacharya']
  }
];
