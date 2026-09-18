import React, { useState } from 'react';
import './App.css';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { AppShell } from './components/layout/AppShell';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { PersonalInfoPage } from './pages/PersonalInfoPage';
import { PrakritiAssessmentPage } from './pages/PrakritiAssessmentPage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from './components/ui';
import { Sparkles, ArrowRight, ShieldCheck, Layers, Brain, Lock, CheckCircle2, User, Activity } from 'lucide-react';

/**
 * Placeholder View for Future Workflow Steps (Phase 4+)
 */
const WorkflowPlaceholder = ({ stepId, onBackToPrakriti, onBackToPersonalInfo, onOpenDesignSystem }) => {
  const stepMeta = {
    'lifestyle': {
      title: '03. Lifestyle Assessment (Dinacharya)',
      desc: 'Daily routine, sleep patterns (Nidra), physical activity (Vyayama), and stress levels.',
      phase: 'Phase 4 Module',
      readyMsg: 'Prakriti baseline has been recorded. The Lifestyle Assessment (Dinacharya) module is scheduled for Phase 4.'
    },
    'diet': {
      title: '04. Dietary Habits & Agni Assessment',
      desc: 'Digestive capacity evaluation, meal timings, rasa preferences, and Viruddha Ahara screening.',
      phase: 'Phase 4 Module',
      readyMsg: 'Dietary habits module will activate in subsequent phases.'
    },
    'symptoms': {
      title: '05. Symptoms & Vikriti Identification',
      desc: 'Chief complaints, pathological dosha aggravation, and chronicity mapping.',
      phase: 'Phase 5 Module',
      readyMsg: 'Symptom analysis will activate in subsequent phases.'
    },
    'review': {
      title: '06. Clinical Input Review & Validation',
      desc: 'Comprehensive multi-domain summary with physician sign-off before ML inference.',
      phase: 'Phase 5 Module',
      readyMsg: 'Review step will aggregate all prior assessment data.'
    },
    'dashboard': {
      title: '07. AI Decision Support & XAI Dashboard',
      desc: 'Explainable AI predictions with SHAP feature rankings, LIME local factors, and RAG-grounded recommendations.',
      phase: 'Phase 6 Module',
      readyMsg: 'Explainable AI inference dashboard is the final milestone.'
    }
  }[stepId] || {
    title: 'Future Clinical Module',
    desc: 'This module is scheduled for implementation in upcoming phases.',
    phase: 'Future Phase',
    readyMsg: 'Under scheduled development.'
  };

  return (
    <div className="ayur-placeholder-view">
      <Card variant="highlighted" className="ayur-placeholder-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge color="accent" variant="solid" icon={<Lock size={12} />}>
              {stepMeta.phase}
            </Badge>
            <Badge color="primary" variant="subtle">AyuRAG-XAI Pipeline</Badge>
          </div>
          <CardTitle as="h2">{stepMeta.title}</CardTitle>
          <CardDescription>{stepMeta.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="ayur-placeholder-box">
            <Brain size={48} className="text-secondary opacity-75" />
            <div className="flex flex-col items-center text-center gap-xs">
              <h4 className="text-h4">Phase 3 Completed Successfully</h4>
              <p className="text-body text-muted max-width-md">
                {stepMeta.readyMsg}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-sm flex-wrap">
            <Button variant="outline" leftIcon={<Activity size={16} />} onClick={onBackToPrakriti}>
              Review Prakriti Assessment (Step 2)
            </Button>
            <Button variant="ghost" leftIcon={<User size={16} />} onClick={onBackToPersonalInfo}>
              Edit Personal Info (Step 1)
            </Button>
            <Button variant="ghost" leftIcon={<Layers size={16} />} onClick={onOpenDesignSystem}>
              Design System Showcase
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

function MainApp() {
  const { currentStep, setCurrentStep, completedSteps } = useAssessment();
  const [toasts, setToasts] = useState([]);

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
    if (currentStep === 'design-system') {
      return {
        title: 'Design System & Component Library',
        subtitle: 'AyuRAG-XAI Production-Ready Frontend Tokens & Architecture',
        breadcrumbs: ['Design System Showcase']
      };
    }
    if (currentStep === 'personal-info') {
      return {
        title: 'Step 01: Personal Information',
        subtitle: 'Baseline Demographics & Physiological Measurements',
        breadcrumbs: ['Assessment Pipeline', '01 Personal Information']
      };
    }
    if (currentStep === 'prakriti') {
      return {
        title: 'Step 02: Prakriti Assessment',
        subtitle: 'Tridosha Constitutional Baseline Evaluation (Vāta • Pitta • Kapha)',
        breadcrumbs: ['Assessment Pipeline', '02 Prakriti Assessment']
      };
    }
    return {
      title: `Workflow: ${currentStep.replace('-', ' ').toUpperCase()}`,
      subtitle: 'Ayurvedic Clinical Decision Support Pipeline',
      breadcrumbs: ['Assessment Pipeline', currentStep.replace('-', ' ')]
    };
  };

  const { title, subtitle, breadcrumbs } = getHeaderInfo();

  // Calculate overall assessment progress
  const progressPercent = currentStep === 'design-system'
    ? 100
    : completedSteps.length > 0
    ? Math.round((completedSteps.length / 6) * 100)
    : 33;

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
              message: 'Phase 3 completed. Lifestyle Assessment is scheduled for Phase 4.'
            });
            setCurrentStep('lifestyle');
          }}
          onTriggerToast={addToast}
        />
      ) : (
        <WorkflowPlaceholder
          stepId={currentStep}
          onBackToPrakriti={() => setCurrentStep('prakriti')}
          onBackToPersonalInfo={() => setCurrentStep('personal-info')}
          onOpenDesignSystem={() => setCurrentStep('design-system')}
        />
      )}
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
