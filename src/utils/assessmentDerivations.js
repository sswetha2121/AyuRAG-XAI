/**
 * AyuRAG-XAI Assessment Derivations & Signals Engine
 * Calculates non-diagnostic live profile indicators for Lifestyle and Diet,
 * and formats the normalized assessment payload ready for future ML/RAG integration.
 */

/**
 * Calculates live profile indicators for Lifestyle Assessment (Phase 03).
 * These are non-diagnostic signals indicating reported behavioral patterns.
 * 
 * @param {Object} answers - current lifestyle answers
 * @returns {Array} - Array of indicator objects { id, label, value (0-100), status, color, icon }
 */
export function calculateLifestyleIndicators(answers = {}) {
  // 1. Sleep Rhythm Signal (0-100)
  let sleepScore = 50;
  const duration = Number(answers['lifestyle_sleep_duration'] || 0);
  const quality = answers['lifestyle_sleep_quality'];
  const awakenings = answers['lifestyle_night_awakenings'];

  if (duration > 0) {
    if (duration >= 7 && duration <= 8.5) sleepScore += 25;
    else if (duration >= 6 && duration < 7) sleepScore += 10;
    else if (duration < 5.5) sleepScore -= 20;

    if (quality === 'deep_restful') sleepScore += 20;
    else if (quality === 'good') sleepScore += 10;
    else if (quality === 'fragmented') sleepScore -= 20;

    if (awakenings === 'rarely') sleepScore += 10;
    else if (awakenings === 'frequently') sleepScore -= 20;
  }
  sleepScore = Math.max(15, Math.min(95, sleepScore));

  let sleepStatus = 'Moderate';
  if (sleepScore >= 75) sleepStatus = 'Optimal & Restful';
  else if (sleepScore <= 40) sleepStatus = 'Needs Support';

  // 2. Physical Activity & Movement Signal (0-100)
  let activityScore = 45;
  const freq = answers['lifestyle_activity_freq'];
  const sedentary = Number(answers['lifestyle_sedentary_hours'] || 0);
  const intensity = answers['lifestyle_activity_intensity'];

  if (freq) {
    if (freq === 'daily' || freq === '5_plus') activityScore += 30;
    else if (freq === '3_4_weekly') activityScore += 20;
    else if (freq === '1_2_weekly') activityScore += 5;
    else if (freq === 'rarely') activityScore -= 20;

    if (sedentary > 0) {
      if (sedentary <= 5) activityScore += 15;
      else if (sedentary >= 9) activityScore -= 20;
    }

    if (intensity === 'moderate' || intensity === 'vigorous') activityScore += 10;
  }
  activityScore = Math.max(15, Math.min(95, activityScore));

  let activityStatus = 'Moderate';
  if (activityScore >= 70) activityStatus = 'Highly Active';
  else if (activityScore <= 35) activityStatus = 'Sedentary';

  // 3. Routine Consistency (Dinacharya Rhythm) (0-100)
  let routineScore = 50;
  const wakeReg = answers['lifestyle_wake_consistency'];
  const bedReg = answers['lifestyle_bedtime_consistency'];
  const overallReg = Number(answers['lifestyle_overall_routine_score'] || 0);

  if (wakeReg) {
    if (wakeReg === 'very_regular') routineScore += 20;
    else if (wakeReg === 'regular') routineScore += 10;
    else if (wakeReg === 'irregular') routineScore -= 20;
  }
  if (bedReg) {
    if (bedReg === 'very_regular') routineScore += 20;
    else if (bedReg === 'regular') routineScore += 10;
    else if (bedReg === 'irregular') routineScore -= 20;
  }
  if (overallReg > 0) {
    routineScore = Math.round((routineScore + overallReg * 10) / 2);
  }
  routineScore = Math.max(20, Math.min(95, routineScore));

  let routineStatus = 'Moderate Consistency';
  if (routineScore >= 75) routineStatus = 'High Regularity';
  else if (routineScore <= 45) routineStatus = 'Variable Rhythm';

  // 4. Perceived Stress Load (0-100) (Inverted: higher score = lower stress / better balance)
  let stressBalanceScore = 55;
  const stress = Number(answers['lifestyle_perceived_stress'] || 0);
  const stressFreq = answers['lifestyle_stress_frequency'];

  if (stress > 0) {
    stressBalanceScore = 100 - (stress * 9);
  }
  if (stressFreq === 'chronic_daily') stressBalanceScore -= 15;
  else if (stressFreq === 'rarely') stressBalanceScore += 15;

  stressBalanceScore = Math.max(15, Math.min(95, stressBalanceScore));

  let stressStatus = 'Moderate Load';
  if (stressBalanceScore >= 75) stressStatus = 'Low Stress Load';
  else if (stressBalanceScore <= 40) stressStatus = 'Elevated Load';

  // 5. Rest & Recovery Signal (0-100)
  let recoveryScore = 50;
  const recoveryDays = answers['lifestyle_recovery_practice'];
  const breaks = answers['lifestyle_screen_breaks'];

  if (recoveryDays === 'regularly') recoveryScore += 25;
  else if (recoveryDays === 'sometimes') recoveryScore += 10;
  else if (recoveryDays === 'rarely') recoveryScore -= 15;

  if (breaks === 'frequent') recoveryScore += 20;
  else if (breaks === 'rare') recoveryScore -= 15;

  recoveryScore = Math.max(20, Math.min(95, recoveryScore));

  let recoveryStatus = 'Moderate';
  if (recoveryScore >= 70) recoveryStatus = 'Well Restored';
  else if (recoveryScore <= 40) recoveryStatus = 'Depleted';

  return [
    {
      id: 'sleep',
      label: 'Sleep Rhythm (Nidra)',
      value: sleepScore,
      status: sleepStatus,
      domain: 'Sleep',
      description: 'Based on reported duration, sleep quality, and night wakefulness'
    },
    {
      id: 'activity',
      label: 'Physical Activity (Vyayama)',
      value: activityScore,
      status: activityStatus,
      domain: 'Activity',
      description: 'Movement frequency, intensity, and sedentary counterbalance'
    },
    {
      id: 'routine',
      label: 'Routine Consistency (Dinacharya)',
      value: routineScore,
      status: routineStatus,
      domain: 'Rhythm',
      description: 'Wake, sleep, and overall daily schedule regularity'
    },
    {
      id: 'stress',
      label: 'Stress Balance (Manas)',
      value: stressBalanceScore,
      status: stressStatus,
      domain: 'Stress',
      description: 'Self-reported tension levels and coping equilibrium'
    },
    {
      id: 'recovery',
      label: 'Rest & Restoration',
      value: recoveryScore,
      status: recoveryStatus,
      domain: 'Recovery',
      description: 'Dedicated downtime, relaxation practices, and screen pauses'
    }
  ];
}

/**
 * Calculates live profile indicators for Dietary Assessment (Phase 04).
 * Reflects reported eating patterns, Agni rhythm, and meal regularity.
 * 
 * @param {Object} answers - current diet answers
 * @returns {Array} - Array of indicator objects
 */
export function calculateDietIndicators(answers = {}) {
  // 1. Agni / Digestive Regularity Signal (0-100)
  let agniScore = 55;
  const appetite = answers['diet_appetite_consistency'];
  const discomfort = answers['diet_digestive_discomfort'];
  const bloating = answers['diet_bloating_freq'];

  if (appetite === 'regular_sharp') agniScore += 25;
  else if (appetite === 'moderate_steady') agniScore += 15;
  else if (appetite === 'variable_erratic') agniScore -= 20;
  else if (appetite === 'sluggish_low') agniScore -= 15;

  if (discomfort === 'no') agniScore += 15;
  else if (discomfort === 'yes') agniScore -= 20;

  if (bloating === 'rarely') agniScore += 10;
  else if (bloating === 'often' || bloating === 'daily') agniScore -= 15;

  agniScore = Math.max(15, Math.min(95, agniScore));

  let agniStatus = 'Variable Agni';
  if (agniScore >= 75) agniStatus = 'Balanced Rhythm (Sama Agni)';
  else if (agniScore <= 45) agniStatus = 'Sensitive / Irregular';

  // 2. Meal Timing Regularity (0-100)
  let mealTimingScore = 50;
  const regularity = answers['diet_meal_timing_regularity'];
  const lateNight = answers['diet_late_night_eating'];
  const speed = answers['diet_eating_speed'];

  if (regularity === 'consistent_fixed') mealTimingScore += 30;
  else if (regularity === 'mostly_regular') mealTimingScore += 15;
  else if (regularity === 'irregular') mealTimingScore -= 20;

  if (lateNight === 'rarely' || lateNight === 'never') mealTimingScore += 15;
  else if (lateNight === 'often') mealTimingScore -= 20;

  if (speed === 'moderate_paced') mealTimingScore += 10;
  else if (speed === 'very_fast') mealTimingScore -= 15;

  mealTimingScore = Math.max(15, Math.min(95, mealTimingScore));

  let mealStatus = 'Moderate Regularity';
  if (mealTimingScore >= 75) mealStatus = 'Consistent Timings';
  else if (mealTimingScore <= 40) mealStatus = 'Erratic Timings';

  // 3. Hydration Balance (0-100)
  let hydrationScore = 50;
  const intake = answers['diet_water_intake'];
  const temp = answers['diet_water_temperature'];

  if (intake === '2_3_liters') hydrationScore += 30;
  else if (intake === 'more_3_liters') hydrationScore += 25;
  else if (intake === '1_2_liters') hydrationScore += 10;
  else if (intake === 'less_1_liter') hydrationScore -= 25;

  if (temp === 'warm' || temp === 'room_temp') hydrationScore += 15;
  else if (temp === 'ice_cold') hydrationScore -= 10;

  hydrationScore = Math.max(20, Math.min(95, hydrationScore));

  let hydrationStatus = 'Adequate';
  if (hydrationScore >= 75) hydrationStatus = 'Optimal Hydration';
  else if (hydrationScore <= 40) hydrationStatus = 'Suboptimal Intake';

  // 4. Mindful Eating & Environment (0-100)
  let mindfulScore = 50;
  const distracted = answers['diet_distracted_eating'];
  const skipped = answers['diet_skipped_meals'];

  if (distracted === 'rarely') mindfulScore += 25;
  else if (distracted === 'sometimes') mindfulScore += 5;
  else if (distracted === 'frequently') mindfulScore -= 20;

  if (skipped === 'rarely') mindfulScore += 20;
  else if (skipped === 'frequently') mindfulScore -= 20;

  mindfulScore = Math.max(20, Math.min(95, mindfulScore));

  let mindfulStatus = 'Moderate Mindfulness';
  if (mindfulScore >= 70) mindfulStatus = 'High Mindful Presence';
  else if (mindfulScore <= 40) mindfulStatus = 'Distracted / Hurried';

  return [
    {
      id: 'agni',
      label: 'Digestive Rhythm (Agni)',
      value: agniScore,
      status: agniStatus,
      domain: 'Agni',
      description: 'Appetite sharpness, post-meal lightness, and transit ease'
    },
    {
      id: 'meal_timing',
      label: 'Meal Timing Regularity',
      value: mealTimingScore,
      status: mealStatus,
      domain: 'Ahara',
      description: 'Pacing of breakfast, lunch, and dinner with circadian alignment'
    },
    {
      id: 'hydration',
      label: 'Hydration Harmony (Jala)',
      value: hydrationScore,
      status: hydrationStatus,
      domain: 'Hydration',
      description: 'Daily fluid intake volume, beverage preferences, and temperature'
    },
    {
      id: 'mindful_eating',
      label: 'Mindful Eating Environment',
      value: mindfulScore,
      status: mindfulStatus,
      domain: 'Ahara Guṇa',
      description: 'Undivided focus, eating speed, and meal schedule stability'
    }
  ];
}

/**
 * Produces a standardized, serializable payload for future ML/RAG processing.
 * Does not make API calls or perform speculative diagnosis; encapsulates
 * all clinical intake domains into a structured knowledge graph-ready format.
 */
export function exportAssessmentPayload({
  personalInfo = {},
  prakritiAnswers = {},
  lifestyleAnswers = {},
  dietAnswers = {},
  symptomAnswers = {},
  primaryConcern = null,
  completedSteps = [],
  metadata = {}
} = {}) {
  const lifestyleSignals = calculateLifestyleIndicators(lifestyleAnswers);
  const dietSignals = calculateDietIndicators(dietAnswers);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    user: {
      fullName: personalInfo.fullName || 'Anonymous',
      age: personalInfo.age ? Number(personalInfo.age) : null,
      gender: personalInfo.gender || null,
      height: personalInfo.height ? { value: Number(personalInfo.height), unit: personalInfo.heightUnit || 'cm' } : null,
      weight: personalInfo.weight ? { value: Number(personalInfo.weight), unit: personalInfo.weightUnit || 'kg' } : null,
      climateZone: personalInfo.climateZone || null,
      primaryGoal: personalInfo.primaryGoal || null
    },
    assessments: {
      prakriti: {
        completed: completedSteps.includes('prakriti'),
        answersCount: Object.keys(prakritiAnswers).length,
        rawAnswers: prakritiAnswers
      },
      lifestyle: {
        completed: completedSteps.includes('lifestyle'),
        answersCount: Object.keys(lifestyleAnswers).length,
        rawAnswers: lifestyleAnswers,
        derivedSignals: lifestyleSignals.reduce((acc, sig) => {
          acc[sig.id] = { score: sig.value, status: sig.status };
          return acc;
        }, {})
      },
      diet: {
        completed: completedSteps.includes('diet'),
        answersCount: Object.keys(dietAnswers).length,
        rawAnswers: dietAnswers,
        derivedSignals: dietSignals.reduce((acc, sig) => {
          acc[sig.id] = { score: sig.value, status: sig.status };
          return acc;
        }, {})
      },
      symptoms: {
        completed: completedSteps.includes('symptoms'),
        totalReported: Object.keys(symptomAnswers).length,
        primaryConcern: primaryConcern,
        reportedList: Object.entries(symptomAnswers).map(([id, details]) => ({
          symptomId: id,
          severity: details.severity || 'mild',
          frequency: details.frequency || 'rarely',
          duration: details.duration || 'short',
          impact: details.impact || 'minimal'
        }))
      }
    },
    pipelineState: {
      completedSteps,
      isFullyAssessed: ['personal-info', 'prakriti', 'lifestyle', 'diet', 'symptoms'].every(s => completedSteps.includes(s))
    },
    disclaimer: 'Data recorded for personalized Ayurvedic wellness and feature derivation. Non-diagnostic.'
  };
}
