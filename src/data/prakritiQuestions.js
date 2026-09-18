/**
 * AyuRAG-XAI Structured Prakriti Question Data
 * Data-driven constitutional assessment parameters based on canonical Ayurvedic domains.
 * Note: Weights are frontend demonstration parameters for interactive preview.
 */

export const PRAKRITI_QUESTIONS = [
  {
    id: 'prakriti_q1',
    category: 'Physical Frame & Body Build',
    sanskritTerm: 'Śarīra Pramāṇa',
    question: 'How would you describe your natural physical frame and bone structure?',
    description: 'Consider your baseline frame throughout adult life, independent of temporary weight shifts.',
    options: [
      {
        id: 'opt_1_1',
        label: 'Slender, Lean & Light-Boned',
        description: 'Narrow shoulders/hips, prominent joints, tends to stay thin easily',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_1_2',
        label: 'Medium, Symmetrical & Athletic',
        description: 'Moderate bone frame, good muscle tone, maintains weight with moderate effort',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_1_3',
        label: 'Broad, Solid & Sturdy',
        description: 'Dense bone structure, wide shoulders/hips, gains weight easily and holds it',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q2',
    category: 'Skin Texture & Temperature',
    sanskritTerm: 'Sparśa & Tvak',
    question: 'What is the natural tendency of your skin texture and temperature?',
    description: 'Observe your skin without artificial moisturizers or seasonal extremes.',
    options: [
      {
        id: 'opt_2_1',
        label: 'Dry, Thin & Cool to Touch',
        description: 'Prone to roughness, chapping, or dullness; rarely perspires heavily',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_2_2',
        label: 'Warm, Sensitive & Rosy',
        description: 'Prone to redness, freckles, rashes, or inflammation; perspires easily',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_2_3',
        label: 'Thick, Soft, Moist & Cool',
        description: 'Naturally hydrated, smooth and resilient; rarely develops cracks or redness',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q3',
    category: 'Hair Quality & Texture',
    sanskritTerm: 'Keśa Guṇa',
    question: 'How would you characterize your natural hair texture and scalp?',
    description: 'Focus on natural tendencies before styling or chemical treatments.',
    options: [
      {
        id: 'opt_3_1',
        label: 'Dry, Curly/Wavy & Fine',
        description: 'Prone to split ends, tangles, or dry scalp with lighter strands',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_3_2',
        label: 'Straight, Fine & Silky',
        description: 'Prone to early graying, thinning, or oily scalp with warm undertones',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_3_3',
        label: 'Thick, Lustrous & Abundant',
        description: 'Heavy, strong roots, naturally wavy or straight with deep natural sheen',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q4',
    category: 'Appetite & Hunger Pattern',
    sanskritTerm: 'Kṣudhā',
    question: 'How consistent is your natural appetite and hunger rhythm?',
    description: 'Consider how you feel if a meal is delayed or skipped.',
    options: [
      {
        id: 'opt_4_1',
        label: 'Irregular & Variable (Viṣama)',
        description: 'Sometimes very hungry, other times forgets to eat; snacks unpredictably',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_4_2',
        label: 'Intense & Sharp (Tīkṣṇa)',
        description: 'Cannot tolerate skipping meals; becomes irritable or dizzy if food is delayed',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_4_3',
        label: 'Steady & Moderate (Manda)',
        description: 'Can comfortably skip a meal; prefers light breakfast; steady appetite',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q5',
    category: 'Digestion & Bowel Tendency',
    sanskritTerm: 'Koṣṭha & Agni',
    question: 'How does your digestive system typically respond to varied foods?',
    description: 'Reflects the metabolic fire (Agni) and intestinal tract tendencies.',
    options: [
      {
        id: 'opt_5_1',
        label: 'Variable Digestion (Viṣama Agni)',
        description: 'Prone to gas, bloating, constipation, or dryness with changes in diet',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_5_2',
        label: 'Fast & High-Metabolism (Tīkṣṇa Agni)',
        description: 'Quick transit time; prone to loose stools, heartburn, or acidity with spice',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_5_3',
        label: 'Slow & Steady (Manda Agni)',
        description: 'Slow digestive transit; feels heavy or sluggish after rich meals',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q6',
    category: 'Physical Energy & Activity Style',
    sanskritTerm: 'Vyāyāma & Bala',
    question: 'How do you describe your typical energy rhythm and exercise pace?',
    description: 'How your body handles sustained physical movement and stamina.',
    options: [
      {
        id: 'opt_6_1',
        label: 'Quick Bursts of Energy (Fatigues Quickly)',
        description: 'Enthusiastic in short sprints; expends energy fast and needs rest to recover',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_6_2',
        label: 'Moderate, Focused & Competitive',
        description: 'Good sustained stamina; enjoys purposeful, challenging physical pursuits',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_6_3',
        label: 'High Endurance & Slow Warm-Up',
        description: 'Slow to start but possesses great stamina, steady strength, and resistance to fatigue',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q7',
    category: 'Sleep Pattern & Dreams',
    sanskritTerm: 'Nidrā',
    question: 'What is your typical sleep duration and quality?',
    description: 'Observe your natural sleep tendencies during restful, non-stressful periods.',
    options: [
      {
        id: 'opt_7_1',
        label: 'Light, Interrupted (5–6 Hours)',
        description: 'Wakes up easily with sound; active, flying, or rapid dreams; difficulty falling asleep',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_7_2',
        label: 'Moderate & Sound (6–7 Hours)',
        description: 'Falls asleep quickly; vivid, colorful dreams; feels refreshed upon waking',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_7_3',
        label: 'Deep, Heavy & Long (8+ Hours)',
        description: 'Hard to wake up in the morning; calm, slow, romantic, or watery dreams',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q8',
    category: 'Climate & Temperature Preference',
    sanskritTerm: 'Śīta / Uṣṇa Sātmyatā',
    question: 'Which weather or climate conditions do you find most uncomfortable?',
    description: 'Indicates how your biological humors respond to temperature and humidity.',
    options: [
      {
        id: 'opt_8_1',
        label: 'Dislikes Cold, Dry & Windy Weather',
        description: 'Prefers warm sunshine, cozy layers, and humid environments',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_8_2',
        label: 'Dislikes Hot, Humid & Sunny Weather',
        description: 'Prefers cool breeze, air conditioning, shade, and cold drinks',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_8_3',
        label: 'Dislikes Cold, Damp & Cloudy Weather',
        description: 'Prefers warm, dry weather and active sunlight to feel energized',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q9',
    category: 'Cognitive Style & Learning Pace',
    sanskritTerm: 'Medhā & Smṛti',
    question: 'How do you naturally grasp new concepts and recall information?',
    description: 'Ayurveda categorizes mental processing speed and memory retention styles.',
    options: [
      {
        id: 'opt_9_1',
        label: 'Quick to Learn, Quick to Forget',
        description: 'Rapid comprehension, highly creative and intuitive, short-term memory dominant',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_9_2',
        label: 'Sharp, Logical & Precise',
        description: 'Methodical analysis, critical thinking, strong memory for organized facts',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_9_3',
        label: 'Slow to Grasp, Never Forgets',
        description: 'Takes time to assimilate new ideas, but once learned retains information long-term',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  },
  {
    id: 'prakriti_q10',
    category: 'Stress & Emotional Tendency',
    sanskritTerm: 'Mānasika Prakṛti',
    question: 'Under sudden stress or pressure, what is your initial emotional tendency?',
    description: 'The primary psychological response pattern to unexpected life changes.',
    options: [
      {
        id: 'opt_10_1',
        label: 'Worry, Restlessness & Overthinking',
        description: 'Mind races, feels anxious or indecisive, tendency to withdraw or second-guess',
        dosha: 'Vata',
        weights: { vata: 3, pitta: 0, kapha: 0 }
      },
      {
        id: 'opt_10_2',
        label: 'Impatience, Frustration & Take-Charge',
        description: 'Direct response, can be critical or irritable, focuses on immediate solutions',
        dosha: 'Pitta',
        weights: { vata: 0, pitta: 3, kapha: 0 }
      },
      {
        id: 'opt_10_3',
        label: 'Calm, Resistant to Change & Avoidant',
        description: 'Slow to react, remains outwardly composed, may internalize or delay confrontation',
        dosha: 'Kapha',
        weights: { vata: 0, pitta: 0, kapha: 3 }
      }
    ]
  }
];
