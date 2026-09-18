import React, { createContext, useContext, useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'ayurag_assessment_state_v1';

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

const AssessmentContext = createContext(null);

export const AssessmentProvider = ({ children }) => {
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

  const [currentStep, setCurrentStep] = useState('personal-info');
  
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

  // Autosave to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          personalInfo,
          prakritiAnswers,
          completedSteps
        })
      );
    } catch (e) {
      console.warn('Failed to save assessment state to localStorage:', e);
    }
  }, [personalInfo, prakritiAnswers, completedSteps]);

  const updatePersonalInfo = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMultiplePersonalInfo = (updates) => {
    setPersonalInfo((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const setPrakritiAnswer = (questionId, optionId) => {
    setPrakritiAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const resetPrakritiAnswers = () => {
    setPrakritiAnswers({});
    setCompletedSteps((prev) => prev.filter((s) => s !== 'prakriti'));
  };

  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  };

  const resetPersonalInfo = () => {
    setPersonalInfo(initialPersonalInfo);
    setCompletedSteps((prev) => prev.filter((s) => s !== 'personal-info'));
  };

  return (
    <AssessmentContext.Provider
      value={{
        personalInfo,
        updatePersonalInfo,
        updateMultiplePersonalInfo,
        resetPersonalInfo,
        prakritiAnswers,
        setPrakritiAnswer,
        resetPrakritiAnswers,
        currentStep,
        setCurrentStep,
        completedSteps,
        markStepCompleted
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
