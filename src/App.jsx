import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { AppShell } from './components/layout/AppShell';

// Assessment & Patient Pages
import { DesignSystemPage } from './pages/DesignSystemPage';
import { PersonalInfoPage } from './pages/PersonalInfoPage';
import { PrakritiAssessmentPage } from './pages/PrakritiAssessmentPage';
import { LifestyleAssessmentPage } from './pages/LifestyleAssessmentPage';
import { DietAssessmentPage } from './pages/DietAssessmentPage';
import { SymptomsAssessmentPage } from './pages/SymptomsAssessmentPage';
import { ReviewPage } from './pages/ReviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisLoadingModal } from './components/dashboard';

// Doctor Pages
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { DoctorPatientsPage } from './pages/DoctorPatientsPage';
import { DoctorPatientProfilePage } from './pages/DoctorPatientProfilePage';
import { DoctorReviewsPage } from './pages/DoctorReviewsPage';
import { DoctorReportsPage } from './pages/DoctorReportsPage';
import { LoginPage } from './pages/LoginPage';

// Protected Route Guard for Doctor
function DoctorProtectedRoute({ children, onTriggerToast }) {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="ayur-loading-screen">
        <div className="ayur-spinner-mini" />
        <span>Verifying clinical authorization...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'DOCTOR') {
    onTriggerToast?.({
      type: 'warning',
      title: 'Access Restricted',
      message: 'Doctor Dashboard is accessible ONLY to authenticated DOCTOR accounts.',
    });
    return <Navigate to="/" replace />;
  }

  return children;
}

// Doctor Workspace Shell Wrapper
function DoctorWorkspaceShell({ onTriggerToast, toasts, removeToast }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Determine active doctor step from URL path
  const getActiveStep = () => {
    if (path.includes('/doctor/patients/')) return 'doctor-patients';
    if (path.startsWith('/doctor/patients')) return 'doctor-patients';
    if (path.startsWith('/doctor/reviews')) return 'doctor-reviews';
    if (path.startsWith('/doctor/reports')) return 'doctor-reports';
    if (path.startsWith('/doctor/ai-analysis')) return 'doctor-ai-analysis';
    if (path.startsWith('/doctor/recommendations')) return 'doctor-recommendations';
    if (path.startsWith('/doctor/knowledge-base')) return 'doctor-knowledge-base';
    return 'doctor-dashboard';
  };

  const getHeaderInfo = () => {
    if (path.includes('/doctor/patients/')) {
      return {
        title: 'Clinical Patient Profile & AI Attribution',
        subtitle: 'Prakriti, multi-domain lifestyle, SHAP/LIME, and classical RAG knowledge',
        breadcrumbs: ['Doctor Workspace', 'Patients', 'Profile'],
      };
    }
    if (path.startsWith('/doctor/patients')) {
      return {
        title: 'Patient Intake & Assessment Cohort',
        subtitle: 'Searchable registry of patient constitutional profiles & diagnostic records',
        breadcrumbs: ['Doctor Workspace', 'Patients Cohort'],
      };
    }
    if (path.startsWith('/doctor/reviews')) {
      return {
        title: 'Clinical Review & Validation Queue',
        subtitle: 'Independent physician review of completed patient assessments',
        breadcrumbs: ['Doctor Workspace', 'Clinical Reviews'],
      };
    }
    if (path.startsWith('/doctor/reports')) {
      return {
        title: 'Clinical Assessment Reports & Audit Registry',
        subtitle: 'Standardized multi-domain Ayurvedic dossiers & physician signatures',
        breadcrumbs: ['Doctor Workspace', 'Reports & Audit'],
      };
    }
    return {
      title: 'Doctor Decision Support Dashboard',
      subtitle: 'Clinical Overview, Diagnostic Queue & Cohort Metrics',
      breadcrumbs: ['Doctor Workspace', 'Dashboard'],
    };
  };

  const { title, subtitle, breadcrumbs } = getHeaderInfo();

  const handleSelectDoctorStep = (stepId) => {
    switch (stepId) {
      case 'doctor-dashboard':
        navigate('/doctor/dashboard');
        break;
      case 'doctor-patients':
      case 'all-patients':
      case 'active-assessments':
      case 'completed-assessments':
        navigate('/doctor/patients');
        break;
      case 'doctor-reviews':
        navigate('/doctor/reviews');
        break;
      case 'doctor-reports':
        navigate('/doctor/reports');
        break;
      case 'doctor-ai-analysis':
      case 'ai-ml-analysis':
      case 'ai-shap':
      case 'ai-lime':
      case 'ai-rag-evidence':
        navigate('/doctor/patients/1'); // Open lead patient analysis
        break;
      case 'doctor-recommendations':
      case 'doctor-knowledge-base':
        navigate('/doctor/reports');
        break;
      case 'doctor-profile':
      case 'doctor-settings':
        onTriggerToast?.({
          type: 'info',
          title: 'Physician Profile',
          message: `${user?.name || 'Dr. A. Sharma'} • Ayurvedic Clinical Lead`,
        });
        break;
      default:
        navigate('/doctor/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    onTriggerToast?.({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out.',
    });
    navigate('/login');
  };

  return (
    <AppShell
      mode="doctor"
      activeStep={getActiveStep()}
      onSelectStep={handleSelectDoctorStep}
      headerTitle={title}
      headerSubtitle={subtitle}
      breadcrumbs={breadcrumbs}
      toasts={toasts}
      onCloseToast={removeToast}
      progressPercent={100}
      user={user}
      onLogout={handleLogout}
    >
      <Routes>
        <Route
          path="dashboard"
          element={
            <DoctorDashboardPage
              user={user}
              onNavigateToPatient={(id) => navigate(`/doctor/patients/${id}`)}
              onNavigateToReviews={() => navigate('/doctor/reviews')}
              onNavigateToReports={() => navigate('/doctor/reports')}
              onTriggerToast={onTriggerToast}
            />
          }
        />
        <Route
          path="patients"
          element={
            <DoctorPatientsPage
              onNavigateToPatient={(id) => navigate(`/doctor/patients/${id}`)}
              onTriggerToast={onTriggerToast}
            />
          }
        />
        <Route
          path="patients/:patientId"
          element={<DoctorPatientProfileWrapper onTriggerToast={onTriggerToast} />}
        />
        <Route
          path="reviews"
          element={
            <DoctorReviewsPage
              onNavigateToPatient={(id) => navigate(`/doctor/patients/${id}`)}
              onTriggerToast={onTriggerToast}
            />
          }
        />
        <Route
          path="reports"
          element={
            <DoctorReportsPage
              onTriggerToast={onTriggerToast}
              onNavigateToPatient={(id) => navigate(`/doctor/patients/${id}`)}
            />
          }
        />
        <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}

function DoctorPatientProfileWrapper({ onTriggerToast }) {
  const { patientId } = useParams();
  const navigate = useNavigate();

  return (
    <DoctorPatientProfilePage
      patientId={patientId}
      onBack={() => navigate('/doctor/patients')}
      onTriggerToast={onTriggerToast}
    />
  );
}

// Patient Assessment Pipeline Flow
function PatientAssessmentShell({ onTriggerToast, toasts, removeToast }) {
  const { user, isDoctor, logout } = useAuth();
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    triggerAnalysisGeneration,
  } = useAssessment();

  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  // Header Title & Subtitle Mapping
  const getHeaderInfo = () => {
    switch (currentStep) {
      case 'design-system':
        return {
          title: 'Design System & Component Library',
          subtitle: 'AyuRAG-XAI Production-Ready Frontend Tokens & Architecture',
          breadcrumbs: ['Design System Showcase'],
        };
      case 'personal-info':
        return {
          title: 'Step 01: Personal Information',
          subtitle: 'Baseline Demographics & Physiological Measurements',
          breadcrumbs: ['Assessment Pipeline', '01 Personal Information'],
        };
      case 'prakriti':
        return {
          title: 'Step 02: Prakriti Assessment',
          subtitle: 'Tridosha Constitutional Baseline Evaluation (Vāta • Pitta • Kapha)',
          breadcrumbs: ['Assessment Pipeline', '02 Prakriti Assessment'],
        };
      case 'lifestyle':
        return {
          title: 'Step 03: Lifestyle Assessment',
          subtitle: 'Dinacharya, Circadian Pacing, Physical Activity & Sleep Architecture',
          breadcrumbs: ['Assessment Pipeline', '03 Lifestyle Assessment'],
        };
      case 'diet':
        return {
          title: 'Step 04: Dietary Assessment',
          subtitle: 'Ahara Habits, Agni Digestive Capacity & Taste Profile',
          breadcrumbs: ['Assessment Pipeline', '04 Dietary Assessment'],
        };
      case 'symptoms':
        return {
          title: 'Step 05: Symptoms & Health Context',
          subtitle: 'Clinical Manifestation Mapping & Chief Concern Prioritization',
          breadcrumbs: ['Assessment Pipeline', '05 Symptoms Context'],
        };
      case 'review':
        return {
          title: 'Step 06: Clinical Review & Validation',
          subtitle: 'Pre-Inference Multi-Domain Data Verification & Consent',
          breadcrumbs: ['Assessment Pipeline', '06 Clinical Review'],
        };
      case 'dashboard':
        return {
          title: 'Step 07: AI Decision Support & XAI Dashboard',
          subtitle: 'Explainable AI Predictions, RAG Citations & Personalized Protocols',
          breadcrumbs: ['Assessment Pipeline', '07 AI Decision Dashboard'],
        };
      default:
        return {
          title: 'AyuRAG-XAI Clinical Platform',
          subtitle: 'Ayurvedic Clinical Decision Support System',
          breadcrumbs: ['Assessment Pipeline', currentStep],
        };
    }
  };

  const { title, subtitle, breadcrumbs } = getHeaderInfo();

  const progressPercent =
    currentStep === 'design-system' || currentStep === 'dashboard'
      ? 100
      : completedSteps.length > 0
      ? Math.round((completedSteps.length / 6) * 100)
      : 16;

  const handleStartAnalysisGeneration = () => {
    setIsGeneratingAnalysis(true);
  };

  const handleAnalysisCompleted = () => {
    setIsGeneratingAnalysis(false);
    triggerAnalysisGeneration();
    setCurrentStep('dashboard');
    onTriggerToast({
      type: 'success',
      title: 'Inference Complete',
      message: 'Personalized profile and explainable AI insights generated successfully.',
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppShell
      mode="patient"
      activeStep={currentStep}
      onSelectStep={setCurrentStep}
      headerTitle={title}
      headerSubtitle={subtitle}
      breadcrumbs={breadcrumbs}
      toasts={toasts}
      onCloseToast={removeToast}
      progressPercent={progressPercent}
      user={user}
      onLogout={handleLogout}
    >
      {/* If Doctor is visiting patient portal, show quick banner to return to Doctor CDS */}
      {isDoctor && (
        <div className="ayur-doctor-portal-banner">
          <div className="flex items-center gap-xs">
            <span className="ayur-portal-badge">Attending Physician Mode</span>
            <span>You are viewing the Patient Assessment Intake Flow.</span>
          </div>
          <button
            type="button"
            className="ayur-portal-link"
            onClick={() => navigate('/doctor/dashboard')}
          >
            Return to Doctor Dashboard →
          </button>
        </div>
      )}

      {/* Loading Modal for AI Analysis Generation */}
      <AnalysisLoadingModal
        isOpen={isGeneratingAnalysis}
        onComplete={handleAnalysisCompleted}
      />

      {currentStep === 'design-system' ? (
        <DesignSystemPage onTriggerToast={onTriggerToast} />
      ) : currentStep === 'personal-info' ? (
        <PersonalInfoPage
          onContinue={() => setCurrentStep('prakriti')}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'prakriti' ? (
        <PrakritiAssessmentPage
          onContinueToNextPhase={() => {
            onTriggerToast({
              type: 'info',
              title: 'Prakriti Assessment Saved',
              message: 'Proceeding to Step 03: Lifestyle Assessment (Dinacharya).',
            });
            setCurrentStep('lifestyle');
          }}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'lifestyle' ? (
        <LifestyleAssessmentPage
          onContinueToNextPhase={() => {
            onTriggerToast({
              type: 'info',
              title: 'Lifestyle Assessment Saved',
              message: 'Proceeding to Step 04: Dietary Assessment (Ahara & Agni).',
            });
            setCurrentStep('diet');
          }}
          onBackToPreviousPhase={() => setCurrentStep('prakriti')}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'diet' ? (
        <DietAssessmentPage
          onContinueToNextPhase={() => {
            onTriggerToast({
              type: 'info',
              title: 'Dietary Assessment Saved',
              message: 'Proceeding to Step 05: Symptoms & Health Context.',
            });
            setCurrentStep('symptoms');
          }}
          onBackToPreviousPhase={() => setCurrentStep('lifestyle')}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'symptoms' ? (
        <SymptomsAssessmentPage
          onContinueToNextPhase={() => {
            onTriggerToast({
              type: 'info',
              title: 'Health Context Saved',
              message: 'Proceeding to Step 06: Clinical Review & Validation.',
            });
            setCurrentStep('review');
          }}
          onBackToPreviousPhase={() => setCurrentStep('diet')}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'review' ? (
        <ReviewPage
          onEditStep={(stepId) => setCurrentStep(stepId)}
          onGenerateAnalysis={handleStartAnalysisGeneration}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'dashboard' ? (
        <DashboardPage
          onStartAssessment={() => setCurrentStep('personal-info')}
          onReevaluate={() => setCurrentStep('review')}
          onTriggerToast={onTriggerToast}
        />
      ) : null}
    </AppShell>
  );
}

function MainApp() {
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

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

  return (
    <Routes>
      {/* Login Gateway */}
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={(user) => {
              if (user.role === 'DOCTOR') {
                navigate('/doctor/dashboard');
              } else {
                navigate('/');
              }
            }}
            onTriggerToast={addToast}
          />
        }
      />

      {/* Protected Doctor Clinical Dashboard */}
      <Route
        path="/doctor/*"
        element={
          <DoctorProtectedRoute onTriggerToast={addToast}>
            <DoctorWorkspaceShell
              onTriggerToast={addToast}
              toasts={toasts}
              removeToast={removeToast}
            />
          </DoctorProtectedRoute>
        }
      />

      {/* Patient Assessment & Workflow Routes */}
      <Route
        path="/*"
        element={
          <PatientAssessmentShell
            onTriggerToast={addToast}
            toasts={toasts}
            removeToast={removeToast}
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssessmentProvider>
          <MainApp />
        </AssessmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
