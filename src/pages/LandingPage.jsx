import React, { useState } from 'react';
import './LandingPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Activity,
  Utensils,
  ArrowRight,
  CheckCircle2,
  Flame,
  Wind,
  Mountain,
  LogIn,
  Stethoscope,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor } = useAuth();

  const [activeConstitutionTab, setActiveConstitutionTab] = useState('movement');

  const constitutionFactors = {
    movement: {
      name: 'Movement Energy',
      principle: 'Governs circulation, nerve impulses, respiration, and cellular mobility.',
      traits: 'Active, creative, lighter frame, quick digestion that varies with stress.',
      foodsToFavor: 'Warm, cooked, grounding meals (soups, steamed root vegetables, whole oats, ghee).',
      foodsToLimit: 'Cold drinks, dry salads, erratic meal times, and raw chilled snacks.',
      color: 'var(--color-vata)',
      icon: Wind,
    },
    metabolism: {
      name: 'Metabolic Energy',
      principle: 'Governs digestion, nutrient absorption, body temperature, and cellular energy.',
      traits: 'Focused, energetic, athletic build, strong appetite, sensitive to excess heat.',
      foodsToFavor: 'Cooling, hydrating, naturally sweet foods (cucumbers, basmati rice, mild leafy greens, melons).',
      foodsToLimit: 'Excess chili peppers, deep-fried snacks, vinegar, and heavy fermented foods.',
      color: 'var(--color-pitta)',
      icon: Flame,
    },
    structure: {
      name: 'Structural Energy',
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
      {/* 1. Simplified Navigation Bar */}
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
              <span className="ayur-landing-brand__tag">Clinical Wellness</span>
            </div>
          </Link>

          <nav className="ayur-landing-nav__links" aria-label="Main Navigation">
            <a href="#how-it-works" className="ayur-landing-nav__link">How It Works</a>
            <a href="#body-factors" className="ayur-landing-nav__link">Body Factors</a>
            <a href="#physician-review" className="ayur-landing-nav__link">Physician Review</a>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/signin')}
                leftIcon={<LogIn size={15} />}
                className="ayur-landing-nav-signin"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Clean Two-Column Layout */}
      <section className="ayur-landing-hero">
        <div className="ayur-container">
          <div className="ayur-hero-grid">
            {/* Left Column: Eyebrow, Strong Headline, Paragraph, Single Assessment CTA & Sign In */}
            <div className="ayur-hero-content">
              <div className="ayur-hero-eyebrow">
                <ShieldCheck size={14} className="text-secondary shrink-0" />
                <span>Clinical Wellness & Decision Support</span>
              </div>

              <h1 className="ayur-hero-title">
                Personalized Ayurvedic Wellness, <br />
                <span className="ayur-hero-title__accent">Informed by Clinical Evidence.</span>
              </h1>

              <p className="ayur-hero-desc">
                Discover your natural body constitution through an evidence-guided assessment. Receive clear nutrition and lifestyle recommendations reviewed by licensed medical professionals.
              </p>

              <div className="ayur-hero-cta-group">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/assessment-overview')}
                  rightIcon={<ArrowRight size={18} />}
                  className="ayur-hero-cta-primary"
                >
                  Start Your Assessment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/signin')}
                  leftIcon={<LogIn size={17} />}
                  className="ayur-hero-cta-secondary"
                >
                  Sign In
                </Button>
              </div>

              <div className="ayur-hero-trust-list">
                <div className="ayur-trust-item">
                  <CheckCircle2 size={15} className="text-success shrink-0" />
                  <span>10-minute multi-domain constitutional assessment</span>
                </div>
                <div className="ayur-trust-item">
                  <CheckCircle2 size={15} className="text-success shrink-0" />
                  <span>Transparent explainable guidance with classical citations</span>
                </div>
                <div className="ayur-trust-item">
                  <CheckCircle2 size={15} className="text-success shrink-0" />
                  <span>Physician oversight before active care plan activation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Polished Product Preview Panel (No Duplicate CTA Button) */}
            <div className="ayur-hero-preview-col">
              <div className="ayur-product-preview-card">
                <div className="ayur-preview-card__header">
                  <div className="ayur-preview-card__title-group">
                    <span className="ayur-preview-badge">Personalized Profile</span>
                    <span className="ayur-preview-sample-label">Sample Data • Illustrative Output</span>
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
                    <span className="ayur-dosha-badge">Movement & Metabolism Imbalance</span>
                  </div>
                  <div className="ayur-preview-bar">
                    <div className="ayur-bar-seg vata" style={{ width: '42%' }}>Movement 42%</div>
                    <div className="ayur-bar-seg pitta" style={{ width: '36%' }}>Metabolism 36%</div>
                    <div className="ayur-bar-seg kapha" style={{ width: '22%' }}>Structure 22%</div>
                  </div>
                </div>

                {/* Nutrition Guidance Preview */}
                <div className="ayur-preview-block">
                  <span className="text-xs font-semibold text-text-primary block mb-xs">Daily Regimen Highlights</span>
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

                <div className="ayur-preview-footer-note">
                  <Info size={12} className="text-muted shrink-0" />
                  <span>Interactive preview reflects verified outputs approved in the doctor console.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Compact "How It Works" Section: 3-Step Journey */}
      <section id="how-it-works" className="ayur-landing-section ayur-section-alt">
        <div className="ayur-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">THE PROCESS</span>
            <h2 className="ayur-section-title">How Your Wellness Plan is Built</h2>
            <p className="ayur-section-subtitle">
              A transparent, evidence-guided journey from initial assessment to physician-approved daily habits.
            </p>
          </div>

          <div className="ayur-process-steps">
            <div className="ayur-process-step">
              <div className="ayur-step-badge">Step 01</div>
              <h3 className="ayur-step-heading">Complete Guided Intake</h3>
              <p className="ayur-step-body">
                Answer structured multi-domain questions covering body frame, sleep quality, digestion, and daily energy in plain English.
              </p>
            </div>

            <div className="ayur-process-step">
              <div className="ayur-step-badge">Step 02</div>
              <h3 className="ayur-step-heading">Transparent AI Synthesis</h3>
              <p className="ayur-step-body">
                Our inference pipeline computes your constitutional profile with transparent factor attribution and grounded classical Samhita citations.
              </p>
            </div>

            <div className="ayur-process-step">
              <div className="ayur-step-badge">Step 03</div>
              <h3 className="ayur-step-heading">Physician Review & Regimen</h3>
              <p className="ayur-step-body">
                An attending doctor reviews your dossier, validates intake notes, and approves your personalized meal timetable and lifestyle habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Constitutional Physiology Section */}
      <section id="body-factors" className="ayur-landing-section">
        <div className="ayur-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">PHYSIOLOGY</span>
            <h2 className="ayur-section-title">The Three Constitutional Energies</h2>
            <p className="ayur-section-subtitle">
              Ayurveda identifies three fundamental functional energies that govern human physiology and metabolic balance.
            </p>
          </div>

          <div className="ayur-factors-tabs">
            <div className="ayur-factors-buttons" role="tablist" aria-label="Body Factors Tabs">
              <button
                type="button"
                className={`ayur-factor-btn ${activeConstitutionTab === 'movement' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('movement')}
              >
                <Wind size={16} />
                <span>Movement Energy</span>
              </button>
              <button
                type="button"
                className={`ayur-factor-btn ${activeConstitutionTab === 'metabolism' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('metabolism')}
              >
                <Flame size={16} />
                <span>Metabolic Energy</span>
              </button>
              <button
                type="button"
                className={`ayur-factor-btn ${activeConstitutionTab === 'structure' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('structure')}
              >
                <Mountain size={16} />
                <span>Structural Energy</span>
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

      {/* 5. Physician Oversight Section */}
      <section id="physician-review" className="ayur-landing-section ayur-section-alt">
        <div className="ayur-container">
          <div className="ayur-doctor-split">
            <div className="ayur-doctor-content">
              <span className="ayur-section-tag">CLINICAL GOVERNANCE</span>
              <h2 className="ayur-section-title">Doctors in the Loop, by Design</h2>
              <p className="text-body leading-relaxed mb-md">
                We believe health recommendations must be anchored in verified medical expertise. AyuRAG-XAI provides attending physicians with a dedicated clinical decision-support console to inspect explainable model predictions, verify patient symptoms, and adjust personalized dietary formulations.
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
                  <span>Licensed medical practitioner? Access Doctor Portal</span>
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
                Review intake cohorts, inspect SHAP factor attributions, and approve personalized dietary formulations with full audit tracking.
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

      {/* 6. Single Purposeful Call to Action Banner */}
      <section className="ayur-cta-section">
        <div className="ayur-container">
          <div className="ayur-cta-card">
            <h2 className="ayur-cta-title">Start Your Personalized Wellness Assessment</h2>
            <p className="ayur-cta-desc">
              Understand your natural constitution, optimal meal timings, and grounded daily habits in 10 minutes.
            </p>
            <div className="ayur-cta-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/assessment-overview')}
                rightIcon={<ArrowRight size={18} />}
              >
                Start Your Assessment
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/signin')}
                leftIcon={<LogIn size={16} />}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Professional Clean Footer */}
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
              <h4 className="ayur-footer-heading">Access & Portals</h4>
              <Link to="/signin">Sign In (Role Selection)</Link>
              <Link to="/login">Patient Sign In</Link>
              <Link to="/signup">Patient Registration</Link>
              <Link to="/doctor-login">Doctor Workspace</Link>
            </div>

            <div className="ayur-footer-col">
              <h4 className="ayur-footer-heading">Platform</h4>
              <a href="#how-it-works">How It Works</a>
              <a href="#body-factors">Constitutional Energies</a>
              <a href="#physician-review">Clinical Review</a>
              <Link to="/assessment-overview">Assessment Overview</Link>
            </div>

            <div className="ayur-footer-col">
              <h4 className="ayur-footer-heading">Privacy & Notice</h4>
              <span className="text-xs text-muted block mb-2xs">Role-Based Clinical Governance</span>
              <span className="text-xs text-muted block mb-2xs">Patient Confidentiality Protected</span>
              <span className="text-xs text-muted block">Grounded Classical Citations</span>
            </div>
          </div>

          <div className="ayur-footer-bottom">
            <span className="text-xs text-muted">
              © {new Date().getFullYear()} AyuRAG-XAI. All rights reserved.
            </span>
            <span className="text-xs text-muted">
              Clinical Notice: Recommendations are for dietary and lifestyle wellness and do not substitute acute emergency medical treatment.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
