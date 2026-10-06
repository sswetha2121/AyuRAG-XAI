/**
 * AyuRAG-XAI Personalization Layer
 * Derives non-diagnostic profile features and generates dynamic, responsive UI microcopy.
 * Designed for future ML/RAG integration without hardcoding rigid page-level condition trees.
 */

/**
 * Computes Tridosha dominant baseline from Prakriti answers if available.
 * 
 * @param {Object} prakritiAnswers - { questionId: optionId }
 * @returns {Object} - { dominantDosha, scores: { vata, pitta, kapha } }
 */
export function deriveDoshaSummary(prakritiAnswers = {}) {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  const keys = Object.keys(prakritiAnswers);

  if (keys.length === 0) {
    return { dominantDosha: null, secondaryDosha: null, scores, isAvailable: false };
  }

  // Each option ID in prakriti contains dosha weighting:
  // opt_X_1: Vata, opt_X_2: Pitta, opt_X_3: Kapha
  Object.values(prakritiAnswers).forEach(optId => {
    if (typeof optId === 'string') {
      if (optId.endsWith('_1')) scores.vata += 3;
      else if (optId.endsWith('_2')) scores.pitta += 3;
      else if (optId.endsWith('_3')) scores.kapha += 3;
    }
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const dominantDosha = sorted[0][1] > 0 ? sorted[0][0] : null;
  const secondaryDosha = sorted[1][1] > 0 ? sorted[1][0] : null;

  return {
    dominantDosha,
    secondaryDosha,
    scores,
    isAvailable: keys.length >= 5
  };
}

/**
 * Derives normalized user profile features across all assessment modules.
 * Note: These are profile indicators for feature engineering, NOT medical diagnoses.
 */
export function deriveUserProfile({
  personalInfo = {},
  prakritiAnswers = {},
  lifestyleAnswers = {},
  dietAnswers = {},
  symptomAnswers = {},
  primaryConcern = null
} = {}) {
  const dosha = deriveDoshaSummary(prakritiAnswers);

  // 1. Sleep Pattern Derivation
  let sleepPattern = 'unassessed';
  const sleepDuration = Number(lifestyleAnswers['lifestyle_sleep_duration'] || 0);
  const sleepQuality = lifestyleAnswers['lifestyle_sleep_quality'];
  const nightAwakenings = lifestyleAnswers['lifestyle_night_awakenings'];

  if (sleepDuration > 0) {
    if (sleepDuration >= 7 && (sleepQuality === 'deep_restful' || sleepQuality === 'good') && nightAwakenings === 'rarely') {
      sleepPattern = 'restful_regular';
    } else if (sleepDuration < 6 || nightAwakenings === 'frequently' || sleepQuality === 'fragmented') {
      sleepPattern = 'irregular_fragmented';
    } else {
      sleepPattern = 'moderate_variable';
    }
  }

  // 2. Physical Activity Level
  let activityLevel = 'unassessed';
  const activityFreq = lifestyleAnswers['lifestyle_activity_freq'];
  const sedentaryHours = Number(lifestyleAnswers['lifestyle_sedentary_hours'] || 0);

  if (activityFreq) {
    if (['5_plus', 'daily'].includes(activityFreq) && sedentaryHours <= 6) {
      activityLevel = 'high_active';
    } else if (['3_4_weekly', '1_2_weekly'].includes(activityFreq)) {
      activityLevel = 'moderate_active';
    } else if (activityFreq === 'rarely' || sedentaryHours >= 8) {
      activityLevel = 'mostly_sedentary';
    }
  }

  // 3. Routine Consistency (Dinacharya Rhythm)
  let routineConsistency = 'unassessed';
  const wakeConsistency = lifestyleAnswers['lifestyle_wake_consistency'];
  const bedConsistency = lifestyleAnswers['lifestyle_bedtime_consistency'];
  const routineScore = Number(lifestyleAnswers['lifestyle_overall_routine_score'] || 0);

  if (wakeConsistency && bedConsistency) {
    if ((wakeConsistency === 'very_regular' || wakeConsistency === 'regular') &&
        (bedConsistency === 'very_regular' || bedConsistency === 'regular')) {
      routineConsistency = 'high_regularity';
    } else if (wakeConsistency === 'irregular' || bedConsistency === 'irregular' || (routineScore > 0 && routineScore <= 4)) {
      routineConsistency = 'variable_irregular';
    } else {
      routineConsistency = 'moderate_regularity';
    }
  }

  // 4. Stress Load Indicator
  let stressPattern = 'unassessed';
  const stressLevel = Number(lifestyleAnswers['lifestyle_perceived_stress'] || 0);
  const stressFreq = lifestyleAnswers['lifestyle_stress_frequency'];

  if (stressLevel > 0 || stressFreq) {
    if (stressLevel >= 7 || stressFreq === 'chronic_daily') {
      stressPattern = 'elevated_load';
    } else if (stressLevel >= 4 || stressFreq === 'frequent') {
      stressPattern = 'moderate_load';
    } else {
      stressPattern = 'low_manageable';
    }
  }

  // 5. Dietary Pattern & Meal Regularity
  let dietaryPattern = dietAnswers['diet_pattern'] || 'unassessed';
  let mealRegularity = 'unassessed';
  const mealTimingReg = dietAnswers['diet_meal_timing_regularity'];
  const lateNightEating = dietAnswers['diet_late_night_eating'];

  if (mealTimingReg) {
    if (['consistent_fixed', 'mostly_regular'].includes(mealTimingReg) && lateNightEating === 'rarely') {
      mealRegularity = 'regular';
    } else if (['irregular', 'highly_erratic'].includes(mealTimingReg) || lateNightEating === 'frequent') {
      mealRegularity = 'irregular_erratic';
    } else {
      mealRegularity = 'moderate';
    }
  }

  // 6. Hydration Pattern
  let hydrationPattern = 'unassessed';
  const waterIntake = dietAnswers['diet_water_intake'];
  if (waterIntake) {
    if (['2_3_liters', 'more_3_liters'].includes(waterIntake)) {
      hydrationPattern = 'optimal';
    } else if (waterIntake === 'less_1_liter') {
      hydrationPattern = 'low';
    } else {
      hydrationPattern = 'moderate';
    }
  }

  // 7. Digestive Context (Agni Signal)
  let digestiveContext = 'unassessed';
  const appetiteConsistency = dietAnswers['diet_appetite_consistency'];
  const postMealDiscomfort = dietAnswers['diet_digestive_discomfort'];
  const bloatingFreq = dietAnswers['diet_bloating_freq'];

  if (appetiteConsistency || postMealDiscomfort) {
    if (postMealDiscomfort === 'no' && appetiteConsistency === 'regular_sharp') {
      digestiveContext = 'balanced_agni';
    } else if (postMealDiscomfort === 'yes' || ['often', 'daily'].includes(bloatingFreq)) {
      digestiveContext = 'sensitive_irregular';
    } else {
      digestiveContext = 'variable';
    }
  }

  // 8. Symptom Priority & Complexity
  const symptomList = Object.keys(symptomAnswers);
  const severeSymptoms = Object.entries(symptomAnswers).filter(
    ([, details]) => details?.severity === 'severe' || details?.impact === 'significant'
  ).map(([id]) => id);

  const symptomPriority = severeSymptoms.length > 0
    ? 'priority_attention'
    : symptomList.length > 0
    ? 'standard_monitoring'
    : 'unspecified';

  // 9. Overall Assessment Completeness
  const moduleStatus = {
    personalInfo: Boolean(personalInfo.fullName && personalInfo.age),
    prakriti: Object.keys(prakritiAnswers).length >= 8,
    lifestyle: Object.keys(lifestyleAnswers).length >= 6,
    diet: Object.keys(dietAnswers).length >= 6,
    symptoms: Boolean(primaryConcern || symptomList.length > 0)
  };

  const completedModulesCount = Object.values(moduleStatus).filter(Boolean).length;
  const assessmentCompleteness = Math.round((completedModulesCount / 5) * 100);

  return {
    demographics: {
      name: personalInfo.fullName || 'User',
      age: personalInfo.age || null,
      gender: personalInfo.gender || null,
      climateZone: personalInfo.climateZone || null,
      primaryGoal: personalInfo.primaryGoal || null
    },
    prakriti: {
      dominantDosha: dosha.dominantDosha,
      secondaryDosha: dosha.secondaryDosha,
      scores: dosha.scores,
      isAvailable: dosha.isAvailable
    },
    lifestyle: {
      sleepPattern,
      activityLevel,
      routineConsistency,
      stressPattern,
      rawCount: Object.keys(lifestyleAnswers).length
    },
    diet: {
      dietaryPattern,
      mealRegularity,
      hydrationPattern,
      digestiveContext,
      rawCount: Object.keys(dietAnswers).length
    },
    symptoms: {
      totalReported: symptomList.length,
      severeCount: severeSymptoms.length,
      primaryConcern: primaryConcern || null,
      priority: symptomPriority
    },
    derivedFeatures: {
      sleepPattern,
      activityLevel,
      routineConsistency,
      stressPattern,
      dietaryPattern,
      mealRegularity,
      hydrationPattern,
      digestiveContext,
      symptomPriority,
      assessmentCompleteness
    },
    moduleStatus
  };
}

/**
 * Generates personalized UI banner and contextual microcopy for Lifestyle Assessment (Phase 03).
 */
export function getLifestyleMicrocopy({ prakritiAnswers = {}, personalInfo = {} } = {}) {
  const dosha = deriveDoshaSummary(prakritiAnswers);
  const name = personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : null;

  let bannerTitle = name ? `Welcome to your Lifestyle Intake, ${name}` : 'Lifestyle Assessment (Daily Routine)';
  let bannerSubtitle = "Let's understand how your daily routine, sleep rhythm, and activity shape your physiological baseline.";
  let contextualNote = null;

  if (dosha.dominantDosha === 'vata') {
    bannerSubtitle = "Movement baseline observed: Routine consistency, grounding sleep habits, and paced activity are central to your daily rhythm.";
    contextualNote = "Your responses in the Body Constitution assessment showed light, mobile qualities. Tracking daily sleep and schedule regularity helps capture your stability signals.";
  } else if (dosha.dominantDosha === 'pitta') {
    bannerSubtitle = "Metabolic baseline observed: Work intensity, midday rhythm, and balanced stress coping play key roles in your constitutional equilibrium.";
    contextualNote = "Your Body Constitution responses indicated purposeful, warm dynamics. Observing rest intervals and work pace helps contextualize heat and stress management.";
  } else if (dosha.dominantDosha === 'kapha') {
    bannerSubtitle = "Structural baseline observed: Stimulating morning wake times, steady physical movement, and active habits foster optimal vitality.";
    contextualNote = "Your Body Constitution responses highlighted sturdy, grounded traits. Morning wake times and movement patterns are particularly informative here.";
  }

  return {
    bannerTitle,
    bannerSubtitle,
    contextualNote,
    sectionGuidance: {
      routine: "Your daily rhythm is the foundation of Dinacharya (classical Ayurvedic circadian discipline).",
      sleep: "Sleep duration and depth offer key insight into nervous system recovery (Nidra).",
      activity: "Physical exercise (Vyayama) supports metabolic Agni and tissue vitality.",
      stress: "Cognitive load and stress patterns interact directly with mind-body balance (Manas)."
    }
  };
}

/**
 * Generates personalized UI microcopy for Dietary Assessment (Phase 04).
 * Cross-references Lifestyle and Prakriti signals to tailor prompts.
 */
export function getDietMicrocopy({ prakritiAnswers = {}, lifestyleAnswers = {}, personalInfo = {} } = {}) {
  const dosha = deriveDoshaSummary(prakritiAnswers);
  const bedConsistency = lifestyleAnswers['lifestyle_bedtime_consistency'];
  const stressLevel = Number(lifestyleAnswers['lifestyle_perceived_stress'] || 0);

  let bannerSubtitle = "Let's explore your meal rhythms, digestive capacity (Agni), and nutritional habits.";
  let contextualHint = null;

  if (bedConsistency === 'irregular' || bedConsistency === 'variable') {
    contextualHint = "Your lifestyle responses noted variable sleep timing. We'll examine whether your meal times follow a similar adaptive rhythm.";
  } else if (stressLevel >= 7) {
    contextualHint = "Elevated stress was reported in your lifestyle intake. Eating environment and mindful meal pacing will be particularly relevant.";
  } else if (dosha.dominantDosha) {
    contextualHint = `Your ${dosha.dominantDosha.toUpperCase()} constitutional baseline has been linked. We'll observe how your appetite and digestive experience align with it.`;
  }

  return {
    bannerTitle: "Dietary Assessment & Agni Rhythm",
    bannerSubtitle,
    contextualHint,
    digestiveNotice: "All digestive questions collect your reported experience for nutritional personalization. These questions are non-diagnostic."
  };
}

/**
 * Generates personalized UI microcopy for Symptoms Assessment (Phase 05).
 * Cross-references prior digestive, sleep, or stress inputs to recommend relevant symptom tags.
 */
export function getSymptomsMicrocopy({ dietAnswers = {}, lifestyleAnswers = {} } = {}) {
  const suggestedCategories = ['General Wellness'];
  let personalizedMessage = "Select any health context or symptoms you are experiencing to guide future personalized analysis.";

  const hasDigestiveDiscomfort = dietAnswers['diet_digestive_discomfort'] === 'yes';
  const sleepIssues = lifestyleAnswers['lifestyle_sleep_quality'] === 'fragmented' || 
                      lifestyleAnswers['lifestyle_night_awakenings'] === 'frequently';
  const stressHigh = Number(lifestyleAnswers['lifestyle_perceived_stress'] || 0) >= 6;

  if (hasDigestiveDiscomfort) {
    suggestedCategories.push('Digestive');
    personalizedMessage = "Based on your reported digestive context in Phase 04, digestive symptoms have been prioritized below.";
  }
  if (sleepIssues) {
    suggestedCategories.push('Sleep');
  }
  if (stressHigh) {
    suggestedCategories.push('Stress & Mood');
  }

  return {
    bannerTitle: "Symptoms & Health Context Intake",
    bannerSubtitle: "A structured health-context intake to capture your current complaints and priority wellness areas.",
    personalizedMessage,
    suggestedCategories: Array.from(new Set(suggestedCategories))
  };
}
