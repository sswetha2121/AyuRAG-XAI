import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { AppShell } from './components/layout/AppShell';
import { api } from './services/api';

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
import { DoctorNotificationsPage } from './pages/DoctorNotificationsPage';
import { DoctorDietPlansPage } from './pages/DoctorDietPlansPage';
import { DoctorMessagesPage } from './pages/DoctorMessagesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DoctorLoginPage } from './pages/DoctorLoginPage';
import { DoctorRegisterPage } from './pages/DoctorRegisterPage';
import { SignInSelectionPage } from './pages/SignInSelectionPage';
import { LandingPage } from './pages/LandingPage';
import { AssessmentOverviewPage } from './pages/AssessmentOverviewPage';

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
    return <Navigate to="/doctor-login" state={{ from: location }} replace />;
  }

  if (role !== 'DOCTOR') {
    onTriggerToast?.({
      type: 'warning',
      title: 'Physician Access Required',
      message: 'Doctor portal is restricted to authorized clinical staff. Redirected to your patient dashboard.',
    });
    return <Navigate to="/dashboard" replace />;
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
    if (path.startsWith('/doctor/diet-plans')) return 'doctor-diet-plans';
    if (path.startsWith('/doctor/reviews')) return 'doctor-reviews';
    if (path.startsWith('/doctor/messages')) return 'doctor-messages';
    if (path.startsWith('/doctor/reports')) return 'doctor-reports';
    if (path.startsWith('/doctor/notifications')) return 'doctor-notifications';
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
    if (path.startsWith('/doctor/diet-plans')) {
      return {
        title: 'Personalized Clinical Diet Generation & Protocols',
        subtitle: 'Deterministic nutritional modeling, IFCT 2017 calculations, and classical Ayurvedic RAG evidence',
        breadcrumbs: ['Doctor Workspace', 'Diet Plans'],
      };
    }
    if (path.startsWith('/doctor/reviews')) {
      return {
        title: 'Clinical Review & Validation Queue',
        subtitle: 'Independent physician review of completed patient assessments',
        breadcrumbs: ['Doctor Workspace', 'Clinical Reviews'],
      };
    }
    if (path.startsWith('/doctor/messages')) {
      return {
        title: 'Patient–Doctor Clinical Consultation',
        subtitle: 'Direct authenticated patient inquiries, progress guidance, and non-emergency communication',
        breadcrumbs: ['Doctor Workspace', 'Messages'],
      };
    }
    if (path.startsWith('/doctor/reports')) {
      return {
        title: 'Clinical Assessment Reports & Audit Registry',
        subtitle: 'Standardized multi-domain Ayurvedic dossiers & physician signatures',
        breadcrumbs: ['Doctor Workspace', 'Reports & Audit'],
      };
    }
    if (path.startsWith('/doctor/notifications')) {
      return {
        title: 'Clinical Notifications & Alerts',
        subtitle: 'Review Reminders, Assessment Updates & Decision Support Notices',
        breadcrumbs: ['Doctor Workspace', 'Notifications'],
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
        navigate('/doctor/patients');
        break;
      case 'doctor-diet-plans':
        navigate('/doctor/diet-plans');
        break;
      case 'doctor-reviews':
        navigate('/doctor/reviews');
        break;
      case 'doctor-messages':
        navigate('/doctor/messages');
        break;
      case 'doctor-reports':
        navigate('/doctor/reports');
        break;
      case 'doctor-notifications':
        navigate('/doctor/notifications');
        break;
      case 'doctor-profile':
        onTriggerToast?.({
          type: 'info',
          title: 'Physician Profile',
          message: `${user?.name || 'Attending Physician'} • Ayurvedic Clinical Lead`,
        });
        break;
      case 'logout':
        handleLogout();
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
    navigate('/doctor-login');
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
      onTriggerToast={onTriggerToast}
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
          path="diet-plans"
          element={<DoctorDietPlansPage onTriggerToast={onTriggerToast} />}
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
          path="messages"
          element={<DoctorMessagesPage onTriggerToast={onTriggerToast} />}
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
        <Route
          path="notifications"
          element={
            <DoctorNotificationsPage
              onNavigateToPatient={(id) => navigate(`/doctor/patients/${id}`)}
              onNavigateToReviews={() => navigate('/doctor/reviews')}
              onTriggerToast={onTriggerToast}
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
function PatientAssessmentShell({ onTriggerToast, toasts, removeToast, initialStep }) {
  const { user, isDoctor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    triggerAnalysisGeneration,
    retryAnalysisGeneration,
    clearInferenceError,
    inferenceStatus,
    inferenceError,
    submittedAssessmentId,
    setSubmittedAssessmentId,
    personalInfo,
    prakritiAnswers,
    lifestyleAnswers,
    dietAnswers,
    symptomAnswers,
  } = useAssessment();

  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('overview');

  React.useEffect(() => {
    if (initialStep) {
      setCurrentStep(initialStep);
    } else if (location.pathname === '/dashboard') {
      setCurrentStep('dashboard');
    }
  }, [initialStep, location.pathname, setCurrentStep]);

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
          title: 'Step 02: Body Constitution Assessment',
          subtitle: 'Baseline Physiological Evaluation (Movement, Metabolism & Structure Factors)',
          breadcrumbs: ['Assessment Pipeline', '02 Body Constitution'],
        };
      case 'lifestyle':
        return {
          title: 'Step 03: Lifestyle Assessment',
          subtitle: 'Daily Routines, Physical Activity, Work Schedule & Sleep Habits',
          breadcrumbs: ['Assessment Pipeline', '03 Lifestyle Habits'],
        };
      case 'diet':
        return {
          title: 'Step 04: Dietary Assessment',
          subtitle: 'Eating Habits, Meal Timings, Digestion & Taste Preferences',
          breadcrumbs: ['Assessment Pipeline', '04 Dietary Habits'],
        };
      case 'symptoms':
        return {
          title: 'Step 05: Symptoms & Health Context',
          subtitle: 'Health Goals, Digestive Manifestations & Chief Concerns',
          breadcrumbs: ['Assessment Pipeline', '05 Symptoms Context'],
        };
      case 'review':
        return {
          title: 'Step 06: Clinical Review & Verification',
          subtitle: 'Pre-Inference Multi-Domain Data Verification & Patient Consent',
          breadcrumbs: ['Assessment Pipeline', '06 Review & Verification'],
        };
      case 'dashboard':
        return {
          title: 'Patient Diet & Wellness Dashboard',
          subtitle: 'Daily Meal Schedule, Personalized Nutrition, Hydration & Habit Tracking',
          breadcrumbs: ['Patient Portal', 'My Dashboard'],
        };
      default:
        return {
          title: 'AyuRAG-XAI Personalized Health Platform',
          subtitle: 'Personalized Nutrition & Wellness Platform',
          breadcrumbs: ['Patient Portal', currentStep],
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

  const handleSelectPatientStep = (stepId, tab) => {
    if (['dashboard-overview', 'overview'].includes(stepId)) {
      setCurrentStep('dashboard');
      setDashboardTab(tab || 'overview');
      navigate('/dashboard');
    } else if (['wellness-plan', 'my-diet-plan'].includes(stepId)) {
      setCurrentStep('dashboard');
      setDashboardTab(tab || 'diet');
      navigate('/dashboard');
    } else if (['daily-checklist'].includes(stepId)) {
      setCurrentStep('dashboard');
      setDashboardTab(tab || 'schedule');
      navigate('/dashboard');
    } else if (['progress'].includes(stepId)) {
      setCurrentStep('dashboard');
      setDashboardTab(tab || 'progress');
      navigate('/dashboard');
    } else if (['chat-doctor', 'chat'].includes(stepId)) {
      setCurrentStep('dashboard');
      setDashboardTab(tab || 'chat');
      navigate('/dashboard');
    } else if (stepId === 'my-assessment') {
      navigate('/assessment-overview');
    } else if (stepId === 'patient-profile') {
      onTriggerToast?.({
        type: 'info',
        title: 'Patient Profile',
        message: `${user?.name || personalInfo?.fullName || 'Patient'} • Active Intake Profile (ID: AYU-${String(user?.id || 1).padStart(4, '0')})`,
      });
    } else if (stepId === 'logout') {
      handleLogout();
    } else {
      setCurrentStep(stepId);
    }
  };

  const handleStartAnalysisGeneration = async () => {
    if (isGeneratingAnalysis && inferenceStatus === 'loading') {
      return;
    }
    setIsGeneratingAnalysis(true);
    try {
      const computed = await triggerAnalysisGeneration();

      if (user && user.role === 'PATIENT') {
        try {
          const submitRes = await api.submitPatientAssessment({
            assessment_id: submittedAssessmentId || undefined,
            username: user?.username,
            demographics: {
              fullName: personalInfo.fullName || user?.name || user?.username,
              age: personalInfo.age,
              gender: personalInfo.gender,
              height: `${personalInfo.height} ${personalInfo.heightUnit}`,
              weight: `${personalInfo.weight} ${personalInfo.weightUnit}`,
              location: personalInfo.location,
              climate: personalInfo.climateZone,
              primaryGoal: personalInfo.primaryGoal,
            },
            prakriti_data: prakritiAnswers,
            lifestyle_data: lifestyleAnswers,
            diet_data: dietAnswers,
            symptoms_data: symptomAnswers,
            prakriti_scores: {
              vata: computed?.tridoshaProfile?.breakdown?.vata || 40,
              pitta: computed?.tridoshaProfile?.breakdown?.pitta || 35,
              kapha: computed?.tridoshaProfile?.breakdown?.kapha || 25,
              primary: computed?.tridoshaProfile?.constitutionType || 'Movement & Metabolism',
            },
            ai_analysis: {
              prediction: `${computed?.tridoshaProfile?.constitutionType || 'Movement & Metabolism'} Assessment`,
              confidence: computed?.aiMetrics?.confidence || 0.89,
              model_name: 'AyuRAG Clinical Multi-Task Classifier v2.1',
            },
            shap_explanations: computed?.xaiFeatures || [],
            rag_evidence: computed?.evidenceCitations || [],
            recommendations: computed?.recommendations || {},
          });
          if (submitRes?.assessment_id) {
            setSubmittedAssessmentId(submitRes.assessment_id);
          }
          onTriggerToast?.({
            type: 'success',
            title: 'Assessment Recorded',
            message: 'Your constitutional profile has been saved to your clinical chart and queued for physician review.',
          });
        } catch (submitErr) {
          console.error('Patient assessment submission sync error:', submitErr);
          onTriggerToast?.({
            type: 'warning',
            title: 'Assessment Synchronization Pending',
            message: submitErr.message || 'Analysis preview generated, but saving to patient chart failed. You can retry from your dashboard.',
          });
        }
      } else if (user && user.role === 'DOCTOR') {
        onTriggerToast?.({
          type: 'info',
          title: 'Physician Simulation Mode',
          message: 'Clinical AI inference generated successfully in Physician Preview mode.',
        });
      } else {
        onTriggerToast?.({
          type: 'info',
          title: 'Guest Preview Mode',
          message: 'Analysis generated as a preview. Please Sign In or Register to permanently link this assessment to your patient medical chart.',
        });
      }

      setTimeout(() => {
        setIsGeneratingAnalysis(false);
        setCurrentStep('dashboard');
      }, 500);
    } catch (err) {
      console.error('Inference pipeline error:', err);
      onTriggerToast?.({
        type: 'danger',
        title: 'Inference Failed',
        message: err.message || 'Clinical decision support backend could not complete analysis.',
      });
    }
  };

  const handleRetryAnalysis = () => {
    handleStartAnalysisGeneration();
  };

  const handleCloseAnalysisModal = () => {
    setIsGeneratingAnalysis(false);
    clearInferenceError();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppShell
      mode="patient"
      activeStep={currentStep}
      onSelectStep={handleSelectPatientStep}
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
        status={inferenceStatus === 'idle' ? 'loading' : inferenceStatus}
        error={inferenceError}
        onRetry={handleRetryAnalysis}
        onClose={handleCloseAnalysisModal}
      />

      {/* Patient Assessment Top Navigation & Auth Status Bar */}
      {currentStep !== 'dashboard' && currentStep !== 'design-system' && (
        <div className="ayur-assessment-nav-bar flex items-center justify-between mb-md px-xs">
          <Link to="/" className="ayur-assessment-back-btn" title="Back to Home" aria-label="Back to Home">
            <ArrowLeft size={18} />
          </Link>
          {!user && (
            <div className="flex items-center gap-sm text-xs text-muted">
              <span>Want to link your assessment to a profile?</span>
              <Link to="/login" className="text-secondary font-semibold hover:underline">
                Sign In or Register →
              </Link>
            </div>
          )}
        </div>
      )}

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
              title: 'Constitution Assessment Saved',
              message: 'Proceeding to Step 03: Lifestyle Assessment (Daily Routine).',
            });
            setCurrentStep('lifestyle');
          }}
          onBackToPreviousPhase={() => setCurrentStep('personal-info')}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'lifestyle' ? (
        <LifestyleAssessmentPage
          onContinueToNextPhase={() => {
            onTriggerToast({
              type: 'info',
              title: 'Lifestyle Assessment Saved',
              message: 'Proceeding to Step 04: Dietary Assessment (Eating Habits & Digestion).',
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
          isGeneratingAnalysis={isGeneratingAnalysis}
          onTriggerToast={onTriggerToast}
        />
      ) : currentStep === 'dashboard' ? (
        <DashboardPage
          activeTab={dashboardTab}
          onTabChange={setDashboardTab}
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
      {/* 1. Landing Page (First page opened by user at root /) */}
      <Route
        path="/"
        element={<LandingPage onTriggerToast={addToast} />}
      />

      {/* 2. Patient Dashboard (Direct Access) */}
      <Route
        path="/dashboard"
        element={
          <PatientAssessmentShell
            onTriggerToast={addToast}
            toasts={toasts}
            removeToast={removeToast}
            initialStep="dashboard"
          />
        }
      />

      {/* 3. Patient Assessment Overview & Flow */}
      <Route
        path="/assessment-overview"
        element={<AssessmentOverviewPage onTriggerToast={addToast} />}
      />
      <Route
        path="/assessment/*"
        element={
          <PatientAssessmentShell
            onTriggerToast={addToast}
            toasts={toasts}
            removeToast={removeToast}
          />
        }
      />
      <Route
        path="/intake"
        element={<Navigate to="/assessment-overview" replace />}
      />

      {/* 4. Role Selection & Authentication Entry */}
      <Route
        path="/signin"
        element={<SignInSelectionPage onTriggerToast={addToast} />}
      />
      <Route
        path="/select-role"
        element={<SignInSelectionPage onTriggerToast={addToast} />}
      />

      {/* 5. Patient Authentication - Separate dedicated Login and Register pages */}
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={(user) => {
              if (user.role === 'DOCTOR') {
                navigate('/doctor/dashboard');
              } else {
                navigate('/dashboard');
              }
            }}
            onTriggerToast={addToast}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <RegisterPage
            onLoginSuccess={(user) => {
              if (user.role === 'DOCTOR') {
                navigate('/doctor/dashboard');
              } else {
                navigate('/assessment-overview');
              }
            }}
            onTriggerToast={addToast}
          />
        }
      />

      {/* 5. Dedicated Doctor Clinical Portal Login & Registration */}
      <Route
        path="/doctor-login"
        element={<DoctorLoginPage onTriggerToast={addToast} />}
      />
      <Route
        path="/doctor/login"
        element={<DoctorLoginPage onTriggerToast={addToast} />}
      />
      <Route
        path="/doctor-register"
        element={<DoctorRegisterPage onTriggerToast={addToast} />}
      />
      <Route
        path="/doctor/register"
        element={<DoctorRegisterPage onTriggerToast={addToast} />}
      />

      {/* 6. Protected Doctor Clinical Dashboard */}
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

      {/* Fallback to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
