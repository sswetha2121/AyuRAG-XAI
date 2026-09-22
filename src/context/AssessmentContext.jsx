<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
import { generatePersonalizedAnalysis } from '../data/mockAnalysis';
=======
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { deriveUserProfile } from '../utils/personalization';
import { exportAssessmentPayload } from '../utils/assessmentDerivations';
>>>>>>> 5b171fb (phase 3)

const STORAGE_KEY = 'ayurag_assessment_v1';
const LEGACY_STORAGE_KEY = 'ayurag_assessment_state_v1';

const initialPersonalInfo = {
  fullName: '',
  age: '',
  gender: '',
  height: '',
  heightUnit: 'cm', // 'cm' | 'ft-in'
  weight: '',
  weightUnit: 'kg', // 'kg' | 'lb'
  location: '',
  climateZone: 'tropical-coastal',
  primaryGoal: 'digestion-agni'
};

const initialSymptomAnswers = {
  selectedSymptoms: [],
  primaryConcern: '',
  additionalNotes: ''
};

const AssessmentContext = createContext(null);

/**
 * Loads stored data with schema version check and legacy fallback.
 */
function loadInitialState() {
  try {
    // 1. Try modern versioned key
    const modern = localStorage.getItem(STORAGE_KEY);
    if (modern) {
      const parsed = JSON.parse(modern);
      if (parsed && parsed.data) {
        return {
          personalInfo: { ...initialPersonalInfo, ...(parsed.data.personalInfo || {}) },
          prakritiAnswers: parsed.data.prakritiAnswers || {},
          lifestyleAnswers: parsed.data.lifestyleAnswers || {},
          dietAnswers: parsed.data.dietAnswers || {},
          symptomAnswers: parsed.data.symptomAnswers || {},
          primaryConcern: parsed.data.primaryConcern || null,
          completedSteps: parsed.data.completedSteps || []
        };
      }
    }

    // 2. Legacy fallback migration
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      return {
        personalInfo: { ...initialPersonalInfo, ...(parsed.personalInfo || {}) },
        prakritiAnswers: parsed.prakritiAnswers || {},
        lifestyleAnswers: {},
        dietAnswers: {},
        symptomAnswers: {},
        primaryConcern: null,
        completedSteps: parsed.completedSteps || []
      };
    }
  } catch (e) {
    console.warn('[AssessmentContext] Error reading saved state from localStorage:', e);
  }

  return {
    personalInfo: initialPersonalInfo,
    prakritiAnswers: {},
    lifestyleAnswers: {},
    dietAnswers: {},
    symptomAnswers: {},
    primaryConcern: null,
    completedSteps: []
  };
}

export const AssessmentProvider = ({ children }) => {
<<<<<<< HEAD
  // 1. Personal Information State
  const [personalInfo, setPersonalInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialPersonalInfo, ...(parsed.personalInfo || {}) };
      }
    } catch (e) {
      console.warn('Failed to load assessment state from localStorage:', e);
    }
    return initialPersonalInfo;
  });

  // 2. Prakriti Answers State
  const [prakritiAnswers, setPrakritiAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.prakritiAnswers || {};
      }
    } catch (e) {
      // ignore
    }
    return {};
  });

  // 3. Lifestyle Answers State
  const [lifestyleAnswers, setLifestyleAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.lifestyleAnswers || {};
      }
    } catch (e) {
      // ignore
    }
    return {};
  });

  // 4. Dietary Answers State
  const [dietAnswers, setDietAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.dietAnswers || {};
      }
    } catch (e) {
      // ignore
    }
    return {};
  });

  // 5. Symptom Answers State
  const [symptomAnswers, setSymptomAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialSymptomAnswers, ...(parsed.symptomAnswers || {}) };
      }
    } catch (e) {
      // ignore
    }
    return initialSymptomAnswers;
  });

  // 6. Review Consent State
  const [reviewConsent, setReviewConsent] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.reviewConsent);
      }
    } catch (e) {
      // ignore
    }
    return false;
  });

  // 7. Analysis Result State
  const [analysisResult, setAnalysisResult] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.analysisResult || null;
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Current Active Workflow Step
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentStep || 'personal-info';
      }
    } catch (e) {
      // ignore
    }
    return 'personal-info';
  });

  // Completed Steps Array
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedSteps || [];
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Autosave to localStorage on any state change
=======
  const initial = useMemo(() => loadInitialState(), []);

  const [personalInfo, setPersonalInfo] = useState(initial.personalInfo);
  const [prakritiAnswers, setPrakritiAnswers] = useState(initial.prakritiAnswers);
  const [lifestyleAnswers, setLifestyleAnswers] = useState(initial.lifestyleAnswers);
  const [dietAnswers, setDietAnswers] = useState(initial.dietAnswers);
  const [symptomAnswers, setSymptomAnswers] = useState(initial.symptomAnswers);
  const [primaryConcern, setPrimaryConcern] = useState(initial.primaryConcern);
  const [completedSteps, setCompletedSteps] = useState(initial.completedSteps);
  const [currentStep, setCurrentStep] = useState('personal-info');

  // Autosave to versioned localStorage
>>>>>>> 5b171fb (phase 3)
  useEffect(() => {
    try {
      const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        data: {
          personalInfo,
          prakritiAnswers,
          lifestyleAnswers,
          dietAnswers,
          symptomAnswers,
<<<<<<< HEAD
          reviewConsent,
          analysisResult,
          currentStep,
=======
          primaryConcern,
>>>>>>> 5b171fb (phase 3)
          completedSteps
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('[AssessmentContext] Failed to persist assessment state:', e);
    }
  }, [
    personalInfo,
    prakritiAnswers,
    lifestyleAnswers,
    dietAnswers,
    symptomAnswers,
<<<<<<< HEAD
    reviewConsent,
    analysisResult,
    currentStep,
    completedSteps
  ]);

  // Personal Info Helpers
=======
    primaryConcern,
    completedSteps
  ]);

  // Personal Info handlers
>>>>>>> 5b171fb (phase 3)
  const updatePersonalInfo = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateMultiplePersonalInfo = (updates) => {
    setPersonalInfo((prev) => ({ ...prev, ...updates }));
  };

  const resetPersonalInfo = () => {
    setPersonalInfo(initialPersonalInfo);
    setCompletedSteps((prev) => prev.filter((s) => s !== 'personal-info'));
  };

<<<<<<< HEAD
  // Prakriti Helpers
=======
  // Prakriti handlers
>>>>>>> 5b171fb (phase 3)
  const setPrakritiAnswer = (questionId, optionId) => {
    setPrakritiAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const resetPrakritiAnswers = () => {
    setPrakritiAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'prakriti'));
  };

<<<<<<< HEAD
  // Lifestyle Helpers
=======
  // Lifestyle handlers (Phase 03)
>>>>>>> 5b171fb (phase 3)
  const setLifestyleAnswer = (questionId, value) => {
    setLifestyleAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

<<<<<<< HEAD
=======
  const setMultipleLifestyleAnswers = (answersMap) => {
    setLifestyleAnswers((prev) => ({ ...prev, ...answersMap }));
  };

>>>>>>> 5b171fb (phase 3)
  const resetLifestyleAnswers = () => {
    setLifestyleAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'lifestyle'));
  };

<<<<<<< HEAD
  // Diet Helpers
=======
  // Diet handlers (Phase 04)
>>>>>>> 5b171fb (phase 3)
  const setDietAnswer = (questionId, value) => {
    setDietAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

<<<<<<< HEAD
=======
  const setMultipleDietAnswers = (answersMap) => {
    setDietAnswers((prev) => ({ ...prev, ...answersMap }));
  };

>>>>>>> 5b171fb (phase 3)
  const resetDietAnswers = () => {
    setDietAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'diet'));
  };

<<<<<<< HEAD
  // Symptom Helpers
  const addSymptom = (symptom) => {
    setSymptomAnswers((prev) => {
      const exists = prev.selectedSymptoms.some((s) => s.id === symptom.id);
      if (exists) return prev;
      return {
        ...prev,
        selectedSymptoms: [
          ...prev.selectedSymptoms,
          {
            ...symptom,
            severity: 'mild',
            frequency: 'sometimes',
            duration: 'several-weeks'
          }
        ]
      };
    });
  };

  const removeSymptom = (symptomId) => {
    setSymptomAnswers((prev) => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.filter((s) => s.id !== symptomId)
    }));
  };

  const updateSymptomDetail = (symptomId, field, value) => {
    setSymptomAnswers((prev) => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.map((s) =>
        s.id === symptomId ? { ...s, [field]: value } : s
      )
    }));
  };

  const setPrimaryConcern = (concern) => {
    setSymptomAnswers((prev) => ({ ...prev, primaryConcern: concern }));
  };

  const setAdditionalNotes = (notes) => {
    setSymptomAnswers((prev) => ({ ...prev, additionalNotes: notes }));
  };

  const resetSymptomAnswers = () => {
    setSymptomAnswers(initialSymptomAnswers);
    setCompletedSteps((prev) => prev.filter((s) => s !== 'symptoms'));
  };

  // General Workflow Step Helpers
=======
  // Symptoms handlers (Phase 05)
  const setSymptomAnswer = (symptomId, details) => {
    setSymptomAnswers((prev) => ({ ...prev, [symptomId]: details }));
  };

  const removeSymptomAnswer = (symptomId) => {
    setSymptomAnswers((prev) => {
      const next = { ...prev };
      delete next[symptomId];
      return next;
    });
  };

  const resetSymptomAnswers = () => {
    setSymptomAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'symptoms'));
  };

  // Step completion helper
>>>>>>> 5b171fb (phase 3)
  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  };

<<<<<<< HEAD
  // Generate Real-Time Personalized Analysis Result
  const triggerAnalysisGeneration = () => {
    const computed = generatePersonalizedAnalysis({
      personalInfo,
      prakritiAnswers,
      lifestyleAnswers,
      dietAnswers,
      symptomAnswers
    });
    setAnalysisResult(computed);
    markStepCompleted('review');
    markStepCompleted('dashboard');
    return computed;
  };

  // Complete Assessment Reset
  const resetAllAssessment = () => {
=======
  // Reset entire assessment across all phases with confirmation
  const resetAllAssessments = () => {
>>>>>>> 5b171fb (phase 3)
    setPersonalInfo(initialPersonalInfo);
    setPrakritiAnswers({});
    setLifestyleAnswers({});
    setDietAnswers({});
<<<<<<< HEAD
    setSymptomAnswers(initialSymptomAnswers);
    setReviewConsent(false);
    setAnalysisResult(null);
    setCompletedSteps([]);
    setCurrentStep('personal-info');
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
=======
    setSymptomAnswers({});
    setPrimaryConcern(null);
    setCompletedSteps([]);
    setCurrentStep('personal-info');
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
>>>>>>> 5b171fb (phase 3)
    } catch (e) {
      // ignore
    }
  };

<<<<<<< HEAD
  // 1-Click Realistic Preset for Demonstration & Testing
  const loadDemoPreset = () => {
    setPersonalInfo({
      fullName: 'Aarav Mehta',
      age: '28',
      gender: 'male',
      height: '178',
      heightUnit: 'cm',
      weight: '72',
      weightUnit: 'kg',
      location: 'Bangalore, India',
      climateZone: 'tropical-coastal',
      primaryGoal: 'digestion-agni'
    });

    setPrakritiAnswers({
      prakriti_q1: 'opt_1_1', // Slender, Lean (Vata)
      prakriti_q2: 'opt_2_2', // Warm Sensitive (Pitta)
      prakriti_q3: 'opt_3_1', // Fine/dry (Vata)
      prakriti_q4: 'opt_4_1', // Variable hunger (Vata)
      prakriti_q5: 'opt_5_1', // Variable digestion (Vata)
      prakriti_q6: 'opt_6_2', // Focused athletic (Pitta)
      prakriti_q7: 'opt_7_1', // Light interrupted (Vata)
      prakriti_q8: 'opt_8_1', // Dislikes cold/dry (Vata)
      prakriti_q9: 'opt_9_2', // Sharp logical (Pitta)
      prakriti_q10: 'opt_10_1' // Worry/restlessness (Vata)
    });

    setLifestyleAnswers({
      lifestyle_q1_routine_consistency: 'sometimes',
      lifestyle_q2_sleep_wake_timing: { wake: 'wake_mid', bed: 'bed_midnight' },
      lifestyle_q3_activity_level: 'moderately-active',
      lifestyle_q4_exercise_modalities: ['walk', 'yoga', 'gym'],
      lifestyle_q5_sleep_duration_quality: { duration: '6–7', quality: 'fair' },
      lifestyle_q6_work_pattern: 'desk-based',
      lifestyle_q7_screen_breaks: 'sometimes',
      lifestyle_q8_stress_frequency: 'often',
      lifestyle_q9_relaxation_methods: ['nature', 'music', 'meditation'],
      lifestyle_q10_hydration_habit: 'room-temp-moderate'
    });

    setDietAnswers({
      diet_q1_meal_regularity: 'sometimes',
      diet_q2_meal_timings: 'lunch-peak',
      diet_q3_appetite_nature: 'vishama-agni',
      diet_q4_dietary_pattern: 'lacto-vegetarian',
      diet_q5_taste_preferences: ['sweet', 'pungent', 'salty'],
      diet_q6_food_temperature: 'warm-freshly-cooked',
      diet_q7_eating_speed: 'moderate-15-20',
      diet_q8_distracted_eating: 'often',
      diet_q9_fluid_with_meals: 'sip-warm-small',
      diet_q10_digestive_comfort: 'bloating-gas-tendency'
    });

    setSymptomAnswers({
      selectedSymptoms: [
        {
          id: 'sym_bloating',
          name: 'Abdominal Bloating / Distension',
          category: 'digestive',
          sanskritName: 'Ādhmāna',
          description: 'Feeling tight, full of air or gas after meals',
          severity: 'moderate',
          frequency: 'often',
          duration: 'several-months'
        },
        {
          id: 'sym_sleep_onset',
          name: 'Difficulty Falling Asleep',
          category: 'sleep',
          sanskritName: 'Anidrā (Onset)',
          description: 'Tossing and turning with a racing mind for over 30 minutes',
          severity: 'mild',
          frequency: 'sometimes',
          duration: 'several-weeks'
        },
        {
          id: 'sym_back_neck_strain',
          name: 'Neck, Shoulder & Lower Back Tension',
          category: 'musculoskeletal',
          sanskritName: 'Grīvā & Kaṭi Graha',
          description: 'Postural tightness from extended desk sitting and laptop work',
          severity: 'moderate',
          frequency: 'often',
          duration: 'several-months'
        }
      ],
      primaryConcern: 'Digestive comfort & meal timing regularity',
      additionalNotes: 'Noticeable afternoon bloating when working through lunch.'
    });

    setReviewConsent(true);
    setCompletedSteps(['personal-info', 'prakriti', 'lifestyle', 'diet', 'symptoms', 'review', 'dashboard']);
    const demoAnalysis = generatePersonalizedAnalysis({
      personalInfo: { fullName: 'Aarav Mehta', age: '28', gender: 'male' },
      prakritiAnswers: { prakriti_q1: 'opt_1_1' },
      lifestyleAnswers: { lifestyle_q1_routine_consistency: 'sometimes' },
      dietAnswers: { diet_q1_meal_regularity: 'sometimes' },
      symptomAnswers: { selectedSymptoms: [{ id: 'sym_bloating' }] }
    });
    setAnalysisResult(demoAnalysis);
    setCurrentStep('dashboard');
=======
  // Check if there is saved progress to resume
  const hasSavedProgress =
    Boolean(personalInfo.fullName) ||
    Object.keys(prakritiAnswers).length > 0 ||
    Object.keys(lifestyleAnswers).length > 0 ||
    Object.keys(dietAnswers).length > 0 ||
    Object.keys(symptomAnswers).length > 0;

  // Derived user profile (non-diagnostic)
  const derivedProfile = useMemo(() => {
    return deriveUserProfile({
      personalInfo,
      prakritiAnswers,
      lifestyleAnswers,
      dietAnswers,
      symptomAnswers,
      primaryConcern
    });
  }, [
    personalInfo,
    prakritiAnswers,
    lifestyleAnswers,
    dietAnswers,
    symptomAnswers,
    primaryConcern
  ]);

  // Normalized ML/RAG export payload
  const getExportPayload = () => {
    return exportAssessmentPayload({
      personalInfo,
      prakritiAnswers,
      lifestyleAnswers,
      dietAnswers,
      symptomAnswers,
      primaryConcern,
      completedSteps
    });
>>>>>>> 5b171fb (phase 3)
  };

  return (
    <AssessmentContext.Provider
      value={{
        // Personal Info
        personalInfo,
        updatePersonalInfo,
        updateMultiplePersonalInfo,
        resetPersonalInfo,

        // Prakriti
        prakritiAnswers,
        setPrakritiAnswer,
        resetPrakritiAnswers,
<<<<<<< HEAD
        lifestyleAnswers,
        setLifestyleAnswer,
        resetLifestyleAnswers,
        dietAnswers,
        setDietAnswer,
        resetDietAnswers,
        symptomAnswers,
        addSymptom,
        removeSymptom,
        updateSymptomDetail,
        setPrimaryConcern,
        setAdditionalNotes,
        resetSymptomAnswers,
        reviewConsent,
        setReviewConsent,
        analysisResult,
        setAnalysisResult,
        triggerAnalysisGeneration,
=======

        // Lifestyle
        lifestyleAnswers,
        setLifestyleAnswer,
        setMultipleLifestyleAnswers,
        resetLifestyleAnswers,

        // Diet
        dietAnswers,
        setDietAnswer,
        setMultipleDietAnswers,
        resetDietAnswers,

        // Symptoms
        symptomAnswers,
        setSymptomAnswer,
        removeSymptomAnswer,
        resetSymptomAnswers,
        primaryConcern,
        setPrimaryConcern,

        // Flow & Navigation
>>>>>>> 5b171fb (phase 3)
        currentStep,
        setCurrentStep,
        completedSteps,
        markStepCompleted,
<<<<<<< HEAD
        resetAllAssessment,
        loadDemoPreset
=======

        // Resilience & Derivations
        resetAllAssessments,
        hasSavedProgress,
        derivedProfile,
        getExportPayload
>>>>>>> 5b171fb (phase 3)
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
