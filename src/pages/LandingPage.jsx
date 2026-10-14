import React, { useState } from 'react';
import './LandingPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Activity,
  HeartPulse,
  Utensils,
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  Wind,
  Mountain,
  LogIn,
  FileCheck,
  Stethoscope,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = ({ onTriggerToast }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor } = useAuth();

  const [activeConstitutionTab, setActiveConstitutionTab] = useState('movement');

  const constitutionFactors = {
    movement: {
      name: 'Movement Energy (Vāta)',
      principle: 'Governs circulation, nerve impulses, respiration, and cellular movement.',
      traits: 'Active, creative, lighter frame, quick digestion that varies with stress.',
      foodsToFavor: 'Warm, cooked, grounding meals (soups, steamed root vegetables, whole oats, ghee).',
      foodsToLimit: 'Cold drinks, dry salads, erratic meal times, and raw chilled snacks.',
      color: 'var(--color-vata)',
      icon: Wind,
    },
    metabolism: {
      name: 'Metabolic Energy (Pitta)',
      principle: 'Governs digestion, nutrient absorption, body temperature, and cellular energy.',
      traits: 'Focused, energetic, athletic build, strong appetite, sensitive to excess heat.',
      foodsToFavor: 'Cooling, hydrating, naturally sweet foods (cucumbers, basmati rice, mild leafy greens, melons).',
      foodsToLimit: 'Excess chili peppers, deep-fried snacks, vinegar, and heavy fermented foods.',
      color: 'var(--color-pitta)',
      icon: Flame,
    },
    structure: {
      name: 'Structure Energy (Kapha)',
      principle: 'Governs physical stamina, joint lubrication, immunity, and cellular structure.',
      traits: 'Calm, steady endurance, sturdy build, slower but regular digestion.',
      foodsToFavor: 'Light, warm, metabolism-stimulating grains (millets, quinoa, clear broths, fresh ginger).',
      foodsToLimit: 'Heavy sugary desserts, excess dairy, iced drinks, and large oily dinners.',
      color: 'var(--color-kapha)',
      icon: Mountain,
    },
  };

  const activeFactor = constitutionFactors[activeConstitutionTab];
  const FactorIcon = activeFactor.icon;

  return (
    <div className="ayur-landing">
      {/* 1. Navigation Bar */}
      <header className="ayur-landing-nav">
        <div className="ayur-container ayur-landing-nav__inner">
          <Link to="/" className="ayur-landing-brand" aria-label="AyuRAG-XAI Home">
            <div className="ayur-landing-brand__icon">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="9" fill="#16382C" />
                <rect x="1.5" y="1.5" width="33" height="33" rx="7.5" stroke="#C5A059" strokeOpacity="0.45" />
                <path
                  d="M18 6C13 9 9 14.5 9 21C9 25.5 12.5 29 18 29C23.5 29 27 25.5 27 21C27 14.5 23 9 18 6Z"
                  fill="#5B8266"
                  fillOpacity="0.45"
                />
                <path d="M18 9V26" stroke="#C5A059" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="14" cy="16" r="1.5" fill="#C5A059" />
                <circle cx="22" cy="15" r="1.5" fill="#C5A059" />
                <circle cx="18" cy="9" r="2" fill="#FAF4E8" />
              </svg>
            </div>
            <div className="ayur-landing-brand__text">
              <span className="ayur-landing-brand__title">
                AyuRAG<span className="ayur-landing-brand__xai">XAI</span>
              </span>
              <span className="ayur-landing-brand__tag">Clinical Wellness Platform</span>
            </div>
          </Link>

          <nav className="ayur-landing-nav__links" aria-label="Main Navigation">
            <a href="#how-it-works" className="ayur-landing-nav__link">How It Works</a>
            <a href="#what-we-offer" className="ayur-landing-nav__link">What We Offer</a>
            <a href="#body-factors" className="ayur-landing-nav__link">Body Factors</a>
            <a href="#clinical-review" className="ayur-landing-nav__link">Physician Review</a>
          </nav>

          <div className="ayur-landing-nav__actions">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(isDoctor ? '/doctor/dashboard' : '/dashboard')}
                rightIcon={<ArrowRight size={14} />}
              >
                {isDoctor ? 'Doctor Workspace' : 'My Dashboard'}
              </Button>
            ) : (
              <div className="flex items-center gap-xs">
                <Link to="/login" className="ayur-landing-signin-btn">
                  Sign In
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/assessment-overview')}
                  rightIcon={<ArrowRight size={14} />}
                >
                  Start Assessment
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="ayur-landing-hero">
        <div className="ayur-container">
          <div className="ayur-hero-grid">
            <div className="ayur-hero-content">
              <div className="ayur-hero-pill">
                <ShieldCheck size={14} className="text-secondary" />
                <span>Evidence-Informed Healthcare & Wellness</span>
              </div>

              <h1 className="ayur-hero-title">
                Personalized Ayurvedic Wellness, <br />
                <span className="ayur-hero-title__accent">Informed by Evidence.</span>
              </h1>

              <p className="ayur-hero-desc">
                Discover your natural body constitution through a guided 10-minute assessment. Receive clear, personalized nutrition and daily routine guidance reviewed by medical professionals.
              </p>

              <div className="ayur-hero-cta-group">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/assessment-overview')}
                  rightIcon={<ArrowRight size={18} />}
                  className="ayur-hero-cta-primary"
                >
                  Start Free Assessment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  leftIcon={<LogIn size={17} />}
                  className="ayur-hero-cta-secondary"
                >
                  Patient Sign In
                </Button>
              </div>

              <div className="ayur-hero-trust-list">
                <div className="flex items-center gap-xs text-xs text-muted">
                  <CheckCircle2 size={15} className="text-success shrink-0" />
                  <span>10-minute multi-domain constitutional assessment</span>
                </div>
                <div className="flex items-center gap-xs text-xs text-muted">
                  <CheckCircle2 size={15} className="text-success shrink-0" />
                  <span>Transparent explainable guidance with classical citations</span>
                </div>
                <div className="flex items-center gap-xs text-xs text-muted">
                  <CheckCircle2 size={15} className="text-success shrink-0" />
                  <span>Doctor oversight before active care plan activation</span>
                </div>
              </div>
            </div>

            {/* Purposeful Visual: Product Assessment & Guidance Preview Card */}
            <div className="ayur-hero-visual">
              <div className="ayur-hero-preview-card">
                <div className="ayur-preview-card__header">
                  <div className="flex items-center gap-xs">
                    <span className="ayur-preview-badge">Personalized Profile</span>
                    <span className="text-xs text-muted">AyuRAG-XAI Dossier</span>
                  </div>
                  <span className="ayur-preview-status">
                    <CheckCircle2 size={13} className="text-success" />
                    <span>Physician Reviewed</span>
                  </span>
                </div>

                {/* Constitutional Profile */}
                <div className="ayur-preview-block">
                  <div className="flex items-center justify-between mb-xs">
                    <span className="text-xs font-semibold text-text-primary">Constitution Type</span>
                    <span className="ayur-dosha-badge">Vāta-Pitta (Movement & Metabolism)</span>
                  </div>
                  <div className="ayur-preview-bar">
                    <div className="ayur-bar-seg vata" style={{ width: '42%' }}>Vāta 42%</div>
                    <div className="ayur-bar-seg pitta" style={{ width: '36%' }}>Pitta 36%</div>
                    <div className="ayur-bar-seg kapha" style={{ width: '22%' }}>Kapha 22%</div>
                  </div>
                </div>

                {/* Nutrition Guidance Preview */}
                <div className="ayur-preview-block">
                  <span className="text-xs font-semibold text-text-primary block mb-xs">Today's Regimen Highlights</span>
                  <div className="ayur-preview-diet-grid">
                    <div className="ayur-diet-item favor">
                      <span className="ayur-diet-tag">✓ Favor</span>
                      <p className="text-xs text-text-secondary m-0">Warm cooked grains, stewed fruits, steamed greens, cumin & ginger</p>
                    </div>
                    <div className="ayur-diet-item limit">
                      <span className="ayur-diet-tag avoid">✕ Limit</span>
                      <p className="text-xs text-text-secondary m-0">Iced drinks, dry raw snacks, late-night heavy meals</p>
                    </div>
                  </div>
                </div>

                {/* Explainable Attribution */}
                <div className="ayur-preview-xai">
                  <div className="flex items-center justify-between text-xs mb-2xs">
                    <span className="text-text-muted">Top Contributing Factor:</span>
                    <span className="font-semibold text-primary">Meal Regularity & Digestion (+34%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">Classical RAG Source:</span>
                    <span className="text-secondary font-medium">Charaka Samhita Sutrasthana 27</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="ayur-preview-start-link"
                  onClick={() => navigate('/assessment-overview')}
                >
                  <span>Begin Your Assessment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 1: What the Platform Offers */}
      <section id="what-we-offer" className="ayur-landing-section ayur-section-alt">
        <div className="ayur-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">CORE PLATFORM</span>
            <h2 className="ayur-section-title">A Cohesive Approach to Daily Health</h2>
            <p className="ayur-section-subtitle">
              We bridge time-tested Ayurvedic physiological principles with modern nutritional tracking and physician oversight.
            </p>
          </div>

          <div className="ayur-features-grid">
            <div className="ayur-feature-card">
              <div className="ayur-feature-icon">
                <Activity size={24} />
              </div>
              <h3 className="ayur-feature-title">Constitutional Profiling</h3>
              <p className="ayur-feature-desc">
                Evaluate your baseline metabolic balance across body frame, digestion, physical activity, and sleep patterns without rigid stereotypes.
              </p>
            </div>

            <div className="ayur-feature-card">
              <div className="ayur-feature-icon">
                <Utensils size={24} />
              </div>
              <h3 className="ayur-feature-title">Personalized Daily Nutrition</h3>
              <p className="ayur-feature-desc">
                Receive structured suggestions for breakfast, lunch, and dinner, complete with suggested timings, food qualities, and hydration tracking.
              </p>
            </div>

            <div className="ayur-feature-card">
              <div className="ayur-feature-icon">
                <ShieldCheck size={24} />
              </div>
              <h3 className="ayur-feature-title">Physician Clinical Oversight</h3>
              <p className="ayur-feature-desc">
                Licensed Ayurvedic doctors review patient-reported symptoms, verify intakes, and authorize care plans before active implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 2: How the Assessment Works */}
      <section id="how-it-works" className="ayur-landing-section">
        <div className="ayur-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">THE PROCESS</span>
            <h2 className="ayur-section-title">How Your Wellness Plan is Built</h2>
            <p className="ayur-section-subtitle">
              A clear, predictable three-step journey from initial intake to daily habit tracking.
            </p>
          </div>

          <div className="ayur-process-steps">
            <div className="ayur-process-step">
              <div className="ayur-step-badge">Step 01</div>
              <h3 className="ayur-step-heading">Complete Guided Intake</h3>
              <p className="ayur-step-body">
                Answer structured questions covering demographics, physical build, sleep, digestion, and current health concerns in plain English.
              </p>
            </div>

            <div className="ayur-process-step">
              <div className="ayur-step-badge">Step 02</div>
              <h3 className="ayur-step-heading">Explainable Synthesis</h3>
              <p className="ayur-step-body">
                Our inference engine drafts a personalized regimen with transparent factor attribution and grounded classical Samhita citations.
              </p>
            </div>

            <div className="ayur-process-step">
              <div className="ayur-step-badge">Step 03</div>
              <h3 className="ayur-step-heading">Physician Review & Daily Plan</h3>
              <p className="ayur-step-body">
                An attending doctor reviews your dossier and approves your daily meal timetable, which you track seamlessly on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 3: Understand Your Body Factors */}
      <section id="body-factors" className="ayur-landing-section ayur-section-alt">
        <div className="ayur-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">PHYSIOLOGY</span>
            <h2 className="ayur-section-title">The Three Constitutional Energies</h2>
            <p className="ayur-section-subtitle">
              Ayurveda identifies three fundamental functional energies that govern human physiology.
            </p>
          </div>

          <div className="ayur-factors-tabs">
            <div className="ayur-factors-buttons" role="tablist">
              <button
                type="button"
                className={`ayur-factor-btn ${activeConstitutionTab === 'movement' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('movement')}
              >
                <Wind size={16} />
                <span>Movement (Vāta)</span>
              </button>
              <button
                type="button"
                className={`ayur-factor-btn ${activeConstitutionTab === 'metabolism' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('metabolism')}
              >
                <Flame size={16} />
                <span>Metabolism (Pitta)</span>
              </button>
              <button
                type="button"
                className={`ayur-factor-btn ${activeConstitutionTab === 'structure' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('structure')}
              >
                <Mountain size={16} />
                <span>Structure (Kapha)</span>
              </button>
            </div>

            <div className="ayur-factor-panel">
              <div className="ayur-factor-panel__left">
                <div className="ayur-factor-icon-wrap" style={{ color: activeFactor.color }}>
                  <FactorIcon size={36} />
                </div>
                <h3 className="ayur-factor-panel__title">{activeFactor.name}</h3>
                <p className="text-sm text-text-secondary mb-xs">{activeFactor.principle}</p>
                <p className="text-xs text-text-muted leading-relaxed">{activeFactor.traits}</p>
              </div>

              <div className="ayur-factor-panel__right">
                <div className="ayur-guidance-box favor-box">
                  <h4 className="text-xs font-bold text-success uppercase tracking-wider mb-2xs">
                    Foods to Favor:
                  </h4>
                  <p className="text-sm text-text-secondary m-0">{activeFactor.foodsToFavor}</p>
                </div>
                <div className="ayur-guidance-box limit-box">
                  <h4 className="text-xs font-bold text-error uppercase tracking-wider mb-2xs">
                    Foods to Limit:
                  </h4>
                  <p className="text-sm text-text-secondary m-0">{activeFactor.foodsToLimit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 4: Physician Oversight & Evidence */}
      <section id="clinical-review" className="ayur-landing-section">
        <div className="ayur-container">
          <div className="ayur-doctor-split">
            <div className="ayur-doctor-content">
              <span className="ayur-section-tag">PROFESSIONAL WORKSPACE</span>
              <h2 className="ayur-section-title">Doctors in the Loop, by Design</h2>
              <p className="text-body leading-relaxed mb-md">
                We believe health recommendations must be anchored in verified medical expertise. AyuRAG-XAI provides attending physicians with a dedicated clinical decision-support console to inspect explainable model predictions, verify patient-reported symptoms, and adjust personalized dietary formulations.
              </p>
              <ul className="ayur-doctor-list">
                <li className="flex items-center gap-xs text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>Licensed doctors review and sign off on active patient regimens</span>
                </li>
                <li className="flex items-center gap-xs text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>Complete audit trail and version history for all dietary modifications</span>
                </li>
                <li className="flex items-center gap-xs text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>Transparent grounding in classical Ayurvedic compendia (Samhitas)</span>
                </li>
              </ul>
              <div className="mt-lg">
                <Link to="/doctor-login" className="ayur-doctor-link">
                  <span>Are you a licensed physician? Sign in to Doctor Workspace</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="ayur-doctor-card">
              <div className="ayur-doctor-card__emblem">
                <Stethoscope size={32} />
              </div>
              <h3 className="font-bold text-primary text-base mb-2xs">Physician Decision Support</h3>
              <p className="text-xs text-muted text-center max-w-xs mb-md">
                Review intake cohorts, adjust meal prescriptions, and approve patient dietary plans with full audit tracking.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/doctor-login')}
                leftIcon={<LogIn size={16} />}
              >
                Sign In as Doctor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call to Action Banner */}
      <section className="ayur-cta-section">
        <div className="ayur-container">
          <div className="ayur-cta-card">
            <h2 className="ayur-cta-title">Start Your Personalized Wellness Assessment</h2>
            <p className="ayur-cta-desc">
              Understand your constitution, meal timings, and daily lifestyle in 10 minutes.
            </p>
            <div className="ayur-cta-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/assessment-overview')}
                rightIcon={<ArrowRight size={18} />}
              >
                Start Free Assessment
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Patient Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Professional Clean Footer */}
      <footer className="ayur-landing-footer">
        <div className="ayur-container">
          <div className="ayur-footer-grid">
            <div className="ayur-footer-col">
              <div className="flex items-center gap-xs mb-xs">
                <span className="font-bold text-primary text-base">AyuRAG-XAI</span>
                <span className="text-xs text-secondary font-semibold">Clinical Wellness</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Personalized dietary and lifestyle wellness platform combining constitutional profiling, explainable decision support, and licensed physician oversight.
              </p>
            </div>

            <div className="ayur-footer-col">
              <h4 className="ayur-footer-heading">Patient Portal</h4>
              <Link to="/assessment-overview">Start Assessment</Link>
              <Link to="/login">Patient Sign In</Link>
              <Link to="/signup">Create Account</Link>
              <Link to="/dashboard">Meal Schedule</Link>
            </div>

            <div className="ayur-footer-col">
              <h4 className="ayur-footer-heading">Doctor Workspace</h4>
              <Link to="/doctor-login">Physician Sign In</Link>
              <Link to="/doctor-login">Clinical Reviews</Link>
              <Link to="/doctor-login">Patient Directory</Link>
            </div>

            <div className="ayur-footer-col">
              <h4 className="ayur-footer-heading">Privacy & Legal</h4>
              <span className="text-xs text-muted block mb-2xs">Patient Data Protected</span>
              <span className="text-xs text-muted block mb-2xs">Role-Based Medical Access</span>
              <span className="text-xs text-muted block">Educational & Wellness Support</span>
            </div>
          </div>

          <div className="ayur-footer-bottom">
            <span className="text-xs text-muted">
              © {new Date().getFullYear()} AyuRAG-XAI. All rights reserved.
            </span>
            <span className="text-xs text-muted">
              Medical Notice: Personalized diet and lifestyle recommendations support wellness and do not replace emergency medical diagnosis or treatment.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
