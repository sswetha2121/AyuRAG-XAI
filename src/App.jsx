import React, { useState, useEffect } from 'react';
import './App.css';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { AppShell } from './components/layout/AppShell';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { PersonalInfoPage } from './pages/PersonalInfoPage';
import { PrakritiAssessmentPage } from './pages/PrakritiAssessmentPage';
import { LifestyleAssessmentPage } from './pages/LifestyleAssessmentPage';
import { DietAssessmentPage } from './pages/DietAssessmentPage';
import { SymptomsAssessmentPage } from './pages/SymptomsAssessmentPage';
<<<<<<< HEAD
import { ReviewPage } from './pages/ReviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisLoadingModal } from './components/dashboard';
=======
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from './components/ui';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Brain,
  Lock,
  CheckCircle2,
  User,
  Activity,
  HeartPulse,
  Utensils,
  Stethoscope,
  RotateCcw
} from 'lucide-react';

/**
 * Workflow Placeholder for Remaining Phases (Review & Dashboard)
 */
const WorkflowPlaceholder = ({
  stepId,
  onNavigateStep,
  onOpenDesignSystem
}) => {
  const stepMeta = {
    'review': {
      title: '06. Clinical Input Review & Data Verification',
      desc: 'Comprehensive multi-domain summary aggregating Personal Info, Prakriti, Lifestyle, Diet, and Symptoms before XAI inference.',
      phase: 'Phase 5 Milestone',
      readyMsg: 'All primary clinical intake modules (Phases 01–05) are recorded and persisted. Review aggregation will synthesize these features.'
    },
    'dashboard': {
      title: '07. AI Decision Support & XAI Dashboard',
      desc: 'Explainable AI predictions with SHAP constitutional feature rankings, LIME local factors, and RAG-grounded classical Ayurvedic literature citations.',
      phase: 'Phase 6 Module',
      readyMsg: 'Explainable AI inference dashboard is the final milestone in the AyuRAG pipeline.'
    }
  }[stepId] || {
    title: 'Clinical Assessment Pipeline',
    desc: 'Assessment module in AyuRAG-XAI architecture.',
    phase: 'Assessment Pipeline',
    readyMsg: 'Clinical data intake pipeline.'
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
              <h4 className="text-h4">Phases 01–05 Data Recorded</h4>
              <p className="text-body text-muted max-width-md">
                {stepMeta.readyMsg}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-sm flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Stethoscope size={15} />}
              onClick={() => onNavigateStep('symptoms')}
            >
              Review Symptoms (Step 05)
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Utensils size={15} />}
              onClick={() => onNavigateStep('diet')}
            >
              Review Diet (Step 04)
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HeartPulse size={15} />}
              onClick={() => onNavigateStep('lifestyle')}
            >
              Review Lifestyle (Step 03)
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Activity size={15} />}
              onClick={() => onNavigateStep('prakriti')}
            >
              Prakriti (Step 02)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<User size={15} />}
              onClick={() => onNavigateStep('personal-info')}
            >
              Personal Info (Step 01)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Layers size={15} />}
              onClick={onOpenDesignSystem}
            >
              Design System Showcase
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
>>>>>>> 5b171fb (phase 3)

/**
 * Resume Banner Component
 */
const ResumeBanner = ({ onContinue, onStartOver }) => {
  return (
    <div className="ayur-resume-banner" role="status">
      <div className="flex items-center gap-sm">
        <Sparkles size={16} className="text-accent shrink-0" />
        <div className="flex flex-col">
          <span className="font-semibold text-primary text-sm">Welcome back</span>
          <span className="text-xs text-muted">
            Your previous assessment progress is saved securely on this device.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-xs shrink-0">
        <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={13} />} onClick={onStartOver}>
          Start Over
        </Button>
        <Button variant="primary" size="sm" rightIcon={<ArrowRight size={13} />} onClick={onContinue}>
          Continue Assessment
        </Button>
      </div>
    </div>
  );
};

function MainApp() {
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
<<<<<<< HEAD
    triggerAnalysisGeneration
  } = useAssessment();

  const [toasts, setToasts] = useState([]);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
=======
    hasSavedProgress,
    resetAllAssessments,
    personalInfo
  } = useAssessment();

  const [toasts, setToasts] = useState([]);
  const [showResumeBanner, setShowResumeBanner] = useState(() => hasSavedProgress && completedSteps.length > 0);
>>>>>>> 5b171fb (phase 3)

  const addToast = (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, ...toast }]);

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
<<<<<<< HEAD
          subtitle: 'Dinacharya, Circadian Pacing, Physical Activity & Sleep Architecture',
=======
          subtitle: 'Dinacharya Circadian Discipline, Sleep Quality & Stress Load',
>>>>>>> 5b171fb (phase 3)
          breadcrumbs: ['Assessment Pipeline', '03 Lifestyle Assessment']
        };
      case 'diet':
        return {
          title: 'Step 04: Dietary Assessment',
<<<<<<< HEAD
          subtitle: 'Ahara Habits, Agni Digestive Capacity & Taste Profile',
=======
          subtitle: 'Ahara Habits, Digestive Capacity (Agni) & Taste Preferences',
>>>>>>> 5b171fb (phase 3)
          breadcrumbs: ['Assessment Pipeline', '04 Dietary Assessment']
        };
      case 'symptoms':
        return {
          title: 'Step 05: Symptoms & Health Context',
<<<<<<< HEAD
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
=======
          subtitle: 'Structured Chief Complaint Intake & Priority Wellness Focus',
          breadcrumbs: ['Assessment Pipeline', '05 Symptoms Intake']
        };
      case 'review':
        return {
          title: 'Step 06: Clinical Input Review',
          subtitle: 'Multi-Domain Clinical Synthesis & Pre-Inference Verification',
          breadcrumbs: ['Assessment Pipeline', '06 Clinical Review']
        };
      default:
        return {
          title: `Workflow: ${currentStep.replace('-', ' ').toUpperCase()}`,
          subtitle: 'Ayurvedic Clinical Decision Support Pipeline',
          breadcrumbs: ['Assessment Pipeline', currentStep.replace('-', ' ')]
>>>>>>> 5b171fb (phase 3)
        };
    }
  };

  const { title, subtitle, breadcrumbs } = getHeaderInfo();

<<<<<<< HEAD
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
=======
  // Dynamic pipeline progress across 6 core clinical steps
  const totalPipelineSteps = 6;
  const progressPercent =
    currentStep === 'design-system'
      ? 100
      : Math.min(100, Math.round((completedSteps.length / totalPipelineSteps) * 100));

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to reset all saved assessment progress and start over?')) {
      resetAllAssessments();
      setShowResumeBanner(false);
      addToast({
        type: 'info',
        title: 'Assessment Cleared',
        message: 'All local assessment data has been reset.'
      });
    }
  };

  const handleResumeContinue = () => {
    setShowResumeBanner(false);
    // Jump to the latest incomplete step
    const stepsInOrder = ['personal-info', 'prakriti', 'lifestyle', 'diet', 'symptoms', 'review'];
    const nextStep = stepsInOrder.find((s) => !completedSteps.includes(s)) || 'review';
    setCurrentStep(nextStep);
>>>>>>> 5b171fb (phase 3)
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
<<<<<<< HEAD
      {/* Loading Modal for AI Analysis Generation */}
      <AnalysisLoadingModal
        isOpen={isGeneratingAnalysis}
        onComplete={handleAnalysisCompleted}
      />
=======
      {/* Resume Assessment Banner */}
      {showResumeBanner && currentStep === 'personal-info' && (
        <ResumeBanner
          onContinue={handleResumeContinue}
          onStartOver={handleStartOver}
        />
      )}
>>>>>>> 5b171fb (phase 3)

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
<<<<<<< HEAD
              message: 'Proceeding to Step 03: Lifestyle Assessment (Dinacharya).'
=======
              message: 'Phase 02 completed. Proceeding to Lifestyle Assessment (Phase 03).'
>>>>>>> 5b171fb (phase 3)
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
<<<<<<< HEAD
              message: 'Proceeding to Step 04: Dietary Assessment (Ahara & Agni).'
            });
            setCurrentStep('diet');
          }}
          onTriggerToast={addToast}
=======
              message: 'Phase 03 completed. Proceeding to Dietary Assessment (Phase 04).'
            });
            setCurrentStep('diet');
          }}
          onBackToPreviousPhase={() => setCurrentStep('prakriti')}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'diet' ? (
        <DietAssessmentPage
          onContinueToNextPhase={() => {
            addToast({
              type: 'info',
              title: 'Dietary Assessment Saved',
              message: 'Phase 04 completed. Proceeding to Symptoms Intake (Phase 05).'
            });
            setCurrentStep('symptoms');
          }}
          onBackToPreviousPhase={() => setCurrentStep('lifestyle')}
          onTriggerToast={addToast}
        />
      ) : currentStep === 'symptoms' ? (
        <SymptomsAssessmentPage
          onContinueToNextPhase={() => {
            addToast({
              type: 'success',
              title: 'Health Context Recorded',
              message: 'Phase 05 completed. Proceeding to Clinical Review.'
            });
            setCurrentStep('review');
          }}
          onBackToPreviousPhase={() => setCurrentStep('diet')}
          onTriggerToast={addToast}
        />
      ) : (
        <WorkflowPlaceholder
          stepId={currentStep}
          onNavigateStep={(step) => setCurrentStep(step)}
          onOpenDesignSystem={() => setCurrentStep('design-system')}
>>>>>>> 5b171fb (phase 3)
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
