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
