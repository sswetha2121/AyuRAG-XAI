import React from 'react';
import './AssessmentOverviewPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAssessment } from '../context/AssessmentContext';
import { Button } from '../components/ui/Button';
import {
  User,
  Activity,
  HeartPulse,
  Utensils,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
  FileText,
  HelpCircle,
  LogIn,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

export const AssessmentOverviewPage = ({ onTriggerToast }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { setCurrentStep, completedSteps, resetAllAssessment } = useAssessment();

  const handleStartAssessment = () => {
    setCurrentStep('personal-info');
    navigate('/assessment');
  };

  const handleResetAndStart = () => {
    if (window.confirm('Start a fresh new assessment? This will reset any saved progress.')) {
      resetAllAssessment?.();
      setCurrentStep('personal-info');
      navigate('/assessment');
    }
  };

  const assessmentPhases = [
    {
      step: '01',
      title: 'Personal Information & Measurements',
      description: 'Foundational demographics, height, weight, and climate zone to calibrate your baseline metabolic rate.',
      icon: User,
      duration: '1-2 min',
      color: '#16382C'
    },
    {
      step: '02',
      title: 'Body Constitution Assessment',
      description: 'Ten structured physiological questions evaluating your natural physical frame, skin, hair, digestion, and cold/heat tolerance.',
      icon: Activity,
      duration: '3 min',
      color: '#3B82F6'
    },
    {
      step: '03',
      title: 'Daily Lifestyle & Routines',
      description: 'Analysis of your daily wake hours, circadian regularity, physical activity, screen time, and sleep quality.',
      icon: HeartPulse,
      duration: '2 min',
      color: '#5B8266'
    },
    {
      step: '04',
      title: 'Dietary Habits & Digestion',
      description: 'Evaluation of meal timings, appetite patterns, food temperature preferences, and digestive comfort.',
      icon: Utensils,
      duration: '2 min',
      color: '#C5A059'
    },
    {
      step: '05',
      title: 'Current Health & Symptoms',
      description: 'Interactive catalog to note any active concerns such as bloating, acidity, fatigue, joint stiffness, or sleep latency.',
      icon: Stethoscope,
      duration: '2 min',
      color: '#EA580C'
    }
  ];

  const hasExistingProgress = completedSteps && completedSteps.length > 0;

  return (
    <div className="ayur-overview-page">
      {/* Top Header Navigation */}
      <header className="ayur-overview-header">
        <div className="ayur-overview-container ayur-overview-header__inner">
          <Link to="/" className="ayur-overview-brand">
            <div className="ayur-overview-brand__icon">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="9" fill="#16382C" />
                <rect x="1.5" y="1.5" width="33" height="33" rx="7.5" stroke="#C5A059" strokeOpacity="0.45" />
                <path
                  d="M18 6C13 9 9 14.5 9 21C9 25.5 12.5 29 18 29C23.5 29 27 25.5 27 21C27 14.5 23 9 18 6Z"
                  fill="#5B8266"
                  fillOpacity="0.5"
                />
                <path d="M18 9V26" stroke="#C5A059" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="14" cy="16" r="1.5" fill="#C5A059" />
                <circle cx="22" cy="15" r="1.5" fill="#C5A059" />
                <circle cx="14" cy="23" r="1.5" fill="#C5A059" />
                <circle cx="18" cy="9" r="2" fill="#FAF4E8" />
              </svg>
            </div>
            <div className="ayur-overview-brand__text">
              <span className="ayur-overview-brand__title">
                AyuRAG<span className="ayur-overview-brand__xai">XAI</span>
              </span>
              <span className="ayur-overview-brand__tag">Clinical Decision Support</span>
            </div>
          </Link>

          <div className="ayur-overview-header__user">
            {isAuthenticated ? (
              <div className="flex items-center gap-sm">
                <div className="ayur-overview-user-badge">
                  <div className="ayur-overview-user-avatar">
                    {(user?.name || user?.username || 'U')[0].toUpperCase()}
                  </div>
                  <div className="ayur-overview-user-meta">
                    <span className="ayur-overview-user-name">{user?.name || user?.username || 'Patient'}</span>
                    <span className="ayur-overview-user-role">Verified Patient</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="ayur-overview-signout-btn"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                <LogIn size={14} className="mr-xs" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <section className="ayur-overview-hero">
        <div className="ayur-overview-container">
          <div className="ayur-overview-hero__card">
            <div className="ayur-overview-hero__badge">
              <Sparkles size={14} className="text-accent" />
              <span>Patient Clinical Assessment Intake</span>
            </div>

            <h1 className="ayur-overview-hero__title">
              Welcome to Your <span className="ayur-overview-gradient">Comprehensive Health Assessment</span>
            </h1>

            <p className="ayur-overview-hero__desc">
              Hello{user?.name ? `, ${user.name}` : ''}! You are about to initiate your personalized health and body constitution assessment.
              This clinical evaluation maps your natural physiological blueprint, daily habits, and active health context using explainable artificial intelligence grounded in classical medical literature.
            </p>

            <div className="ayur-overview-stats-row">
              <div className="ayur-overview-stat-pill">
                <Clock size={16} className="text-accent" />
                <span><strong>8-10 Minutes</strong> Estimated Duration</span>
              </div>
              <div className="ayur-overview-stat-pill">
                <ShieldCheck size={16} className="text-secondary" />
                <span><strong>Private & Secure</strong> Encrypted Clinical Session</span>
              </div>
              <div className="ayur-overview-stat-pill">
                <FileText size={16} className="text-primary" />
                <span><strong>5 In-Depth Modules</strong> Comprehensive Analysis</span>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="ayur-overview-hero__cta-group">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartAssessment}
                className="ayur-overview-start-btn"
                rightIcon={<ArrowRight size={20} />}
              >
                {hasExistingProgress ? 'Continue Assessment' : 'Start Assessment'}
              </Button>

              {hasExistingProgress && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleResetAndStart}
                  className="ayur-overview-reset-btn"
                  leftIcon={<RotateCcw size={16} />}
                >
                  Start Fresh
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/')}
                className="ayur-overview-back-btn"
                leftIcon={<ArrowLeft size={16} />}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Modules Roadmap */}
      <section className="ayur-overview-phases-section">
        <div className="ayur-overview-container">
          <div className="ayur-overview-section-header">
            <h2 className="ayur-overview-section-title">What You Will Be Assessed On</h2>
            <p className="ayur-overview-section-subtitle">
              The intake pipeline consists of five carefully structured modules designed to provide actionable insight for you and your attending physician.
            </p>
          </div>

          <div className="ayur-overview-grid">
            {assessmentPhases.map((phase) => {
              const Icon = phase.icon;
              return (
                <div key={phase.step} className="ayur-overview-card">
                  <div className="ayur-overview-card__header">
                    <span className="ayur-overview-step-pill">Phase {phase.step}</span>
                    <span className="ayur-overview-duration">{phase.duration}</span>
                  </div>

                  <div className="ayur-overview-card__icon-box">
                    <Icon size={24} style={{ color: phase.color }} />
                  </div>

                  <h3 className="ayur-overview-card__title">{phase.title}</h3>
                  <p className="ayur-overview-card__desc">{phase.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Preparation Guidelines */}
      <section className="ayur-overview-guidelines">
        <div className="ayur-overview-container">
          <div className="ayur-guidelines-box">
            <div className="ayur-guidelines-header">
              <ShieldCheck size={22} className="text-secondary" />
              <h3 className="ayur-guidelines-title">Helpful Guidelines for Best Results</h3>
            </div>

            <div className="ayur-guidelines-grid">
              <div className="ayur-guideline-item">
                <CheckCircle2 size={18} className="text-secondary" />
                <div>
                  <strong>Answer Based on Long-Term Baseline</strong>
                  <p>When answering constitutional questions, consider your natural tendencies over the past 6 to 12 months rather than just the past few days.</p>
                </div>
              </div>

              <div className="ayur-guideline-item">
                <CheckCircle2 size={18} className="text-secondary" />
                <div>
                  <strong>No Prior Medical Knowledge Needed</strong>
                  <p>All questions are presented in simple, clear everyday English with intuitive descriptions and real-life examples.</p>
                </div>
              </div>

              <div className="ayur-guideline-item">
                <CheckCircle2 size={18} className="text-secondary" />
                <div>
                  <strong>Automatic Progress Saving</strong>
                  <p>Your answers are saved automatically at every step. You can pause anytime and resume right where you left off.</p>
                </div>
              </div>

              <div className="ayur-guideline-item">
                <CheckCircle2 size={18} className="text-secondary" />
                <div>
                  <strong>Explainable AI Report at the End</strong>
                  <p>Upon review, you will receive an interactive dashboard detailing your body constitution breakdown, key drivers, and personalized routines.</p>
                </div>
              </div>
            </div>

            {/* Bottom Start Assessment Trigger */}
            <div className="ayur-guidelines-footer">
              <span>Ready to begin? Your answers will help generate your individualized wellness profile.</span>
              <Button
                variant="primary"
                size="md"
                onClick={handleStartAssessment}
                rightIcon={<ArrowRight size={16} />}
                className="ayur-overview-start-btn"
              >
                Start Assessment Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
