import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { generatePersonalizedAnalysis } from '../data/mockAnalysis';
import { deriveUserProfile } from '../utils/personalization';
import { exportAssessmentPayload } from '../utils/assessmentDerivations';

const STORAGE_KEY = 'ayurag_assessment_state_v1';
const LEGACY_STORAGE_KEY = 'ayurag_assessment_v1';

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

export const AssessmentProvider = ({ children }) => {
  // 1. Personal Information State
  const [personalInfo, setPersonalInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return { ...initialPersonalInfo, ...(data.personalInfo || {}) };
      }
    } catch (e) {
      console.warn('Failed to load personalInfo from localStorage:', e);
    }
    return initialPersonalInfo;
  });

  // 2. Prakriti Answers State
  const [prakritiAnswers, setPrakritiAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return data.prakritiAnswers || {};
      }
    } catch (e) {
      // ignore
    }
    return {};
  });

  // 3. Lifestyle Answers State
  const [lifestyleAnswers, setLifestyleAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return data.lifestyleAnswers || {};
      }
    } catch (e) {
      // ignore
    }
    return {};
  });

  // 4. Dietary Answers State
  const [dietAnswers, setDietAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return data.dietAnswers || {};
      }
    } catch (e) {
      // ignore
    }
    return {};
  });

  // 5. Symptom Answers State
  const [symptomAnswers, setSymptomAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        if (data.symptomAnswers) {
          if (Array.isArray(data.symptomAnswers.selectedSymptoms)) {
            return { ...initialSymptomAnswers, ...data.symptomAnswers };
          }
          // If stored as an object { symId: details }
          const keys = Object.keys(data.symptomAnswers);
          const selected = keys.map((k) => ({ id: k, ...(data.symptomAnswers[k] || {}) }));
          return {
            selectedSymptoms: selected,
            primaryConcern: data.primaryConcern || '',
            additionalNotes: ''
          };
        }
      }
    } catch (e) {
      // ignore
    }
    return initialSymptomAnswers;
  });

  // 6. Review Consent State
  const [reviewConsent, setReviewConsent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return Boolean(data.reviewConsent);
      }
    } catch (e) {
      // ignore
    }
    return false;
  });

  // 7. Analysis Result State
  const [analysisResult, setAnalysisResult] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return data.analysisResult || null;
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Current Active Workflow Step
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return data.currentStep || 'personal-info';
      }
    } catch (e) {
      // ignore
    }
    return 'personal-info';
  });

  // Completed Steps Array
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const data = parsed.data || parsed;
        return data.completedSteps || [];
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Autosave to localStorage on state change
  useEffect(() => {
    try {
      const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        personalInfo,
        prakritiAnswers,
        lifestyleAnswers,
        dietAnswers,
        symptomAnswers,
        primaryConcern: symptomAnswers.primaryConcern,
        reviewConsent,
        analysisResult,
        currentStep,
        completedSteps
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('[AssessmentContext] Failed to persist state:', e);
    }
  }, [
    personalInfo,
    prakritiAnswers,
    lifestyleAnswers,
    dietAnswers,
    symptomAnswers,
    reviewConsent,
    analysisResult,
    currentStep,
    completedSteps
  ]);

  // Personal Info Helpers
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

  // Prakriti Helpers
  const setPrakritiAnswer = (questionId, optionId) => {
    setPrakritiAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const resetPrakritiAnswers = () => {
    setPrakritiAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'prakriti'));
  };

  // Lifestyle Helpers
  const setLifestyleAnswer = (questionId, value) => {
    setLifestyleAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const setMultipleLifestyleAnswers = (answersMap) => {
    setLifestyleAnswers((prev) => ({ ...prev, ...answersMap }));
  };

  const resetLifestyleAnswers = () => {
    setLifestyleAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'lifestyle'));
  };

  // Diet Helpers
  const setDietAnswer = (questionId, value) => {
    setDietAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const setMultipleDietAnswers = (answersMap) => {
    setDietAnswers((prev) => ({ ...prev, ...answersMap }));
  };

  const resetDietAnswers = () => {
    setDietAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'diet'));
  };

  // Symptom Helpers
  const addSymptom = (symptom) => {
    setSymptomAnswers((prev) => {
      const exists = (prev.selectedSymptoms || []).some((s) => s.id === symptom.id);
      if (exists) return prev;
      return {
        ...prev,
        selectedSymptoms: [
          ...(prev.selectedSymptoms || []),
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
      selectedSymptoms: (prev.selectedSymptoms || []).filter((s) => s.id !== symptomId)
    }));
  };

  const updateSymptomDetail = (symptomId, field, value) => {
    setSymptomAnswers((prev) => ({
      ...prev,
      selectedSymptoms: (prev.selectedSymptoms || []).map((s) =>
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

  const setSymptomAnswer = (symptomId, details) => {
    setSymptomAnswers((prev) => {
      const existing = (prev.selectedSymptoms || []).find((s) => s.id === symptomId);
      if (existing) {
        return {
          ...prev,
          selectedSymptoms: prev.selectedSymptoms.map((s) =>
            s.id === symptomId ? { ...s, ...details } : s
          )
        };
      }
      return {
        ...prev,
        selectedSymptoms: [...(prev.selectedSymptoms || []), { id: symptomId, ...details }]
      };
    });
  };

  const removeSymptomAnswer = (symptomId) => {
    removeSymptom(symptomId);
  };

  const resetSymptomAnswers = () => {
    setSymptomAnswers(initialSymptomAnswers);
    setCompletedSteps((prev) => prev.filter((s) => s !== 'symptoms'));
  };

  // Step Completion
  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  };

  // Real-Time Analysis Generation
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

  // Reset entire assessment
  const resetAllAssessments = () => {
    setPersonalInfo(initialPersonalInfo);
    setPrakritiAnswers({});
    setLifestyleAnswers({});
    setDietAnswers({});
    setSymptomAnswers(initialSymptomAnswers);
    setReviewConsent(false);
    setAnalysisResult(null);
    setCompletedSteps([]);
    setCurrentStep('personal-info');
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const resetAllAssessment = resetAllAssessments;

  // Check saved progress
  const hasSavedProgress =
    Boolean(personalInfo.fullName) ||
    Object.keys(prakritiAnswers).length > 0 ||
    Object.keys(lifestyleAnswers).length > 0 ||
    Object.keys(dietAnswers).length > 0 ||
    (symptomAnswers.selectedSymptoms && symptomAnswers.selectedSymptoms.length > 0);

  // Derived user profile
  const derivedProfile = useMemo(() => {
    try {
      return deriveUserProfile({
        personalInfo,
        prakritiAnswers,
        lifestyleAnswers,
        dietAnswers,
        symptomAnswers,
        primaryConcern: symptomAnswers.primaryConcern
      });
    } catch (e) {
      return null;
    }
  }, [personalInfo, prakritiAnswers, lifestyleAnswers, dietAnswers, symptomAnswers]);

  // ML/RAG export payload
  const getExportPayload = () => {
    try {
      return exportAssessmentPayload({
        personalInfo,
        prakritiAnswers,
        lifestyleAnswers,
        dietAnswers,
        symptomAnswers,
        primaryConcern: symptomAnswers.primaryConcern,
        completedSteps
      });
    } catch (e) {
      return null;
    }
  };

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
        addSymptom,
        removeSymptom,
        updateSymptomDetail,
        setPrimaryConcern,
        setAdditionalNotes,
        setSymptomAnswer,
        removeSymptomAnswer,
        resetSymptomAnswers,
        primaryConcern: symptomAnswers.primaryConcern,

        // Flow & Navigation
        currentStep,
        setCurrentStep,
        completedSteps,
        markStepCompleted,

        // Review & Analysis
        reviewConsent,
        setReviewConsent,
        analysisResult,
        setAnalysisResult,
        triggerAnalysisGeneration,

        // Resilience & Derivations
        resetAllAssessment,
        resetAllAssessments,
        loadDemoPreset,
        hasSavedProgress,
        derivedProfile,
        getExportPayload
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
