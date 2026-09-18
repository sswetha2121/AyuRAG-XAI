import React, { useState } from 'react';
import './App.css';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { AppShell } from './components/layout/AppShell';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { PersonalInfoPage } from './pages/PersonalInfoPage';
import { PrakritiAssessmentPage } from './pages/PrakritiAssessmentPage';
import { LifestyleAssessmentPage } from './pages/LifestyleAssessmentPage';
import { DietAssessmentPage } from './pages/DietAssessmentPage';
import { SymptomsAssessmentPage } from './pages/SymptomsAssessmentPage';
import { ReviewPage } from './pages/ReviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisLoadingModal } from './components/dashboard';

function MainApp() {
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    triggerAnalysisGeneration
  } = useAssessment();

  const [toasts, setToasts] = useState([]);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  const addToast = (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, ...toast }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Header Title & Subtitle Mapping
  const getHeaderInfo = () => {
    switch (currentStep) {
      case 'design-system':
        return {
          title: 'Design System & Component Library',
          subtitle: 'AyuRAG-XAI Production-Ready Frontend Tokens & Architecture',
          breadcrumbs: ['Design System Showcase']
        };
      case 'personal-info':
        return {
          title: 'Step 01: Personal Information',
          subtitle: 'Baseline Demographics & Physiological Measurements',
          breadcrumbs: ['Assessment Pipeline', '01 Personal Information']
        };
      case 'prakriti':
        return {
          title: 'Step 02: Prakriti Assessment',
          subtitle: 'Tridosha Constitutional Baseline Evaluation (Vāta • Pitta • Kapha)',
          breadcrumbs: ['Assessment Pipeline', '02 Prakriti Assessment']
        };
      case 'lifestyle':
        return {
          title: 'Step 03: Lifestyle Assessment',
          subtitle: 'Dinacharya, Circadian Pacing, Physical Activity & Sleep Architecture',
          breadcrumbs: ['Assessment Pipeline', '03 Lifestyle Assessment']
        };
      case 'diet':
        return {
          title: 'Step 04: Dietary Assessment',
          subtitle: 'Ahara Habits, Agni Digestive Capacity & Taste Profile',
          breadcrumbs: ['Assessment Pipeline', '04 Dietary Assessment']
        };
      case 'symptoms':
        return {
          title: 'Step 05: Symptoms & Health Context',
          subtitle: 'Clinical Manifestation Mapping & Chief Concern Prioritization',
          breadcrumbs: ['Assessment Pipeline', '05 Symptoms Context']
        };
      case 'review':
        return {
          title: 'Step 06: Clinical Review & Validation',
          subtitle: 'Pre-Inference Multi-Domain Data Verification & Consent',
          breadcrumbs: ['Assessment Pipeline', '06 Clinical Review']
        };
      case 'dashboard':
        return {
          title: 'Step 07: AI Decision Support & XAI Dashboard',
          subtitle: 'Explainable AI Predictions, RAG Citations & Personalized Protocols',
          breadcrumbs: ['Assessment Pipeline', '07 AI Decision Dashboard']
        };
      default:
        return {
          title: 'AyuRAG-XAI Clinical Platform',
          subtitle: 'Ayurvedic Clinical Decision Support System',
          breadcrumbs: ['Assessment Pipeline', currentStep]
        };
    }
  };

  const { title, subtitle, breadcrumbs } = getHeaderInfo();

  // Calculate overall assessment progress percentage (0 - 100%)
  const progressPercent = currentStep === 'design-system' || currentStep === 'dashboard'
    ? 100
    : completedSteps.length > 0
    ? Math.round((completedSteps.length / 6) * 100)
    : 16;

  // Handle Triggering the Analysis Pipeline
  const handleStartAnalysisGeneration = () => {
    setIsGeneratingAnalysis(true);
  };

  const handleAnalysisCompleted = () => {
    setIsGeneratingAnalysis(false);
    triggerAnalysisGeneration();
    setCurrentStep('dashboard');
    addToast({
      type: 'success',
      title: 'Inference Complete',
      message: 'Personalized profile and explainable AI insights generated successfully.'
    });
  };

  return (
    <AppShell
      activeStep={currentStep}
      onSelectStep={setCurrentStep}
      headerTitle={title}
      headerSubtitle={subtitle}
      breadcrumbs={breadcrumbs}
      toasts={toasts}
      onCloseToast={removeToast}
      progressPercent={progressPercent}
    >
      {/* Loading Modal for AI Analysis Generation */}
      <AnalysisLoadingModal
        isOpen={isGeneratingAnalysis}
        onComplete={handleAnalysisCompleted}
      />

      {currentStep === 'design-system' ? (
        <DesignSystemPage onTriggerToast={addToast} />
      ) : currentStep === 'personal-info' ? (
        <PersonalInfoPage
          onContinue={() => setCurrentStep('prakriti')}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'prakriti' ? (
        <PrakritiAssessmentPage
          onContinueToNextPhase={() => {
            addToast({
              type: 'info',
              title: 'Prakriti Assessment Saved',
              message: 'Proceeding to Step 03: Lifestyle Assessment (Dinacharya).'
            });
            setCurrentStep('lifestyle');
          }}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'lifestyle' ? (
        <LifestyleAssessmentPage
          onContinueToNextPhase={() => {
            addToast({
              type: 'info',
              title: 'Lifestyle Assessment Saved',
              message: 'Proceeding to Step 04: Dietary Assessment (Ahara & Agni).'
            });
            setCurrentStep('diet');
          }}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'diet' ? (
        <DietAssessmentPage
          onContinueToNextPhase={() => {
            addToast({
              type: 'info',
              title: 'Dietary Assessment Saved',
              message: 'Proceeding to Step 05: Symptoms & Health Context.'
            });
            setCurrentStep('symptoms');
          }}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'symptoms' ? (
        <SymptomsAssessmentPage
          onContinueToNextPhase={() => {
            addToast({
              type: 'info',
              title: 'Health Context Saved',
              message: 'Proceeding to Step 06: Clinical Review & Validation.'
            });
            setCurrentStep('review');
          }}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'review' ? (
        <ReviewPage
          onEditStep={(stepId) => setCurrentStep(stepId)}
          onGenerateAnalysis={handleStartAnalysisGeneration}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'dashboard' ? (
        <DashboardPage
          onStartAssessment={() => setCurrentStep('personal-info')}
          onReevaluate={() => setCurrentStep('review')}
          onTriggerToast={addToast}
        />
      ) : null}
    </AppShell>
  );
}

export default function App() {
  return (
    <AssessmentProvider>
      <MainApp />
    </AssessmentProvider>
  );
}
