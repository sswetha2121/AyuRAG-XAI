import React, { useState } from 'react';
import './LandingPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Activity,
  HeartPulse,
  Stethoscope,
  Utensils,
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  Wind,
  Mountain,
  LogIn,
  UserPlus,
  TrendingUp,
  FileCheck,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = ({ onTriggerToast }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor } = useAuth();

  const [activeConstitutionTab, setActiveConstitutionTab] = useState('movement');

  // Constitution Profiles in Simple English
  const constitutionTypes = {
    movement: {
      title: 'Movement Energy (Air & Space)',
      characteristics: 'Naturally slender, active, fast-moving, quick digestion that can vary with stress.',
      bestFoods: 'Warm, grounding, nourishing cooked grains, root vegetables, healthy fats, and regular meal times.',
      foodsToAvoid: 'Cold drinks, dry crackers, raw salads at dinner, and erratic meal skipping.',
      color: '#3B82F6',
      icon: Wind,
    },
    metabolism: {
      title: 'Metabolic Energy (Fire & Water)',
      characteristics: 'Moderate athletic build, sharp appetite, high body heat, rapid digestion.',
      bestFoods: 'Cooling, soothing, hydrating foods like sweet fruits, cucumbers, basmati rice, and mild herbs.',
      foodsToAvoid: 'Extremely spicy curries, deep-fried snacks, excess vinegar, and fermented pickles.',
      color: '#EA580C',
      icon: Flame,
    },
    structure: {
      title: 'Structure Energy (Earth & Water)',
      characteristics: 'Sturdy, broad frame, steady physical endurance, slower digestion.',
      bestFoods: 'Light, warm, metabolism-stimulating whole grains (millets, barley), clear broths, and ginger.',
      foodsToAvoid: 'Heavy sweets, excess dairy, iced milkshakes, and large oily dinners.',
      color: '#059669',
      icon: Mountain,
    },
  };

  const activeProfile = constitutionTypes[activeConstitutionTab];
  const ProfileIcon = activeProfile.icon;

  return (
    <div className="ayur-landing">
      {/* 1. Global Navigation Bar */}
      <header className="ayur-landing-nav">
        <div className="ayur-landing-container ayur-landing-nav__inner">
          {/* Brand Logo */}
          <Link to="/" className="ayur-landing-brand" aria-label="AyuRAG-XAI Home">
            <div className="ayur-landing-brand__icon">
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
                <circle cx="18" cy="9" r="2" fill="#FAF4E8" />
              </svg>
            </div>
            <div className="ayur-landing-brand__text">
              <span className="ayur-landing-brand__title">
                AyuRAG<span className="ayur-landing-brand__xai">XAI</span>
              </span>
              <span className="ayur-landing-brand__tag">Personalized Diet & Wellness</span>
            </div>
          </Link>

          {/* Unified Public Navigation Links */}
          <nav className="ayur-landing-nav__links">
            <Link to="/" className="ayur-landing-nav__link ayur-landing-nav__link--active">
              Home
            </Link>
            <Link to="/assessment-overview" className="ayur-landing-nav__link">
              Start Assessment
            </Link>
            <Link to="/login" className="ayur-landing-nav__link">
              Patient Login
            </Link>
            <Link to="/doctor-login" className="ayur-landing-nav__link">
              Doctor Login
            </Link>
            <Link to="/signup" className="ayur-landing-nav__link ayur-nav-signup-link">
              Sign Up
            </Link>
          </nav>

          {/* Authenticated Action or Quick Buttons */}
          <div className="ayur-landing-nav__actions">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(isDoctor ? '/doctor/dashboard' : '/dashboard')}
              >
                {isDoctor ? 'Doctor Dashboard →' : 'My Dashboard →'}
              </Button>
            ) : (
              <div className="flex items-center gap-xs">
                <Link to="/login" className="ayur-landing-auth-btn">
                  <LogIn size={15} />
                  <span>Login</span>
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
        <div className="ayur-landing-container">
          <div className="ayur-landing-hero__grid">
            {/* Left Content */}
            <div className="ayur-landing-hero__content">
              <div className="ayur-hero-badge">
                <ShieldCheck size={15} className="text-secondary" />
                <span>Doctor-Reviewed Personalized Nutrition</span>
              </div>

              <h1 className="ayur-hero-headline">
                Your Daily Diet, <br />
                <span className="ayur-hero-headline__accent">Personalized for You.</span>
              </h1>

              <p className="ayur-hero-subtext">
                Understand your food habits, get a personalized diet plan reviewed by a doctor, track your progress, and build healthier daily routines.
              </p>

              <div className="ayur-hero-cta-group">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/assessment-overview')}
                  rightIcon={<ArrowRight size={18} />}
                  className="ayur-hero-primary-btn"
                >
                  Start Assessment
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  leftIcon={<LogIn size={18} />}
                  className="ayur-hero-secondary-btn"
                >
                  Patient Login
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="ayur-hero-trust">
                <div className="flex items-center gap-xs text-xs text-muted">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>No generic diets • Individualized body constitution profiling</span>
                </div>
                <div className="flex items-center gap-xs text-xs text-muted">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <span>Doctor approval required before plan activation</span>
                </div>
              </div>
            </div>

            {/* Right Clinical Intelligence Showcase Visual */}
            <div className="ayur-landing-hero__visual">
              <div className="ayur-hero-preview-card ayur-hero-clinical-card">
                {/* Header Badge */}
                <div className="ayur-hcard-header">
                  <div className="flex items-center gap-xs">
                    <span className="ayur-doctor-badge">
                      <ShieldCheck size={14} /> Clinical Intelligence
                    </span>
                    <span className="ayur-version-badge">Evidence-Based</span>
                  </div>
                  <span className="text-xs text-muted flex items-center gap-2xs">
                    <Sparkles size={12} className="text-secondary" /> Care Model
                  </span>
                </div>

                {/* 1. Constitution Analysis Preview */}
                <div className="ayur-hcard-care-block">
                  <div className="flex items-center justify-between mb-xs">
                    <div className="flex items-center gap-xs">
                      <Activity size={16} className="text-primary" />
                      <span className="text-xs font-bold text-primary">Individual Constitution (Prakriti)</span>
                    </div>
                    <span className="ayur-tridosha-pill">Vāta-Pitta Profile</span>
                  </div>
                  <div className="ayur-dosha-strip">
                    <div className="ayur-dstrip-seg vata" style={{ width: '40%' }}>Vāta 40%</div>
                    <div className="ayur-dstrip-seg pitta" style={{ width: '35%' }}>Pitta 35%</div>
                    <div className="ayur-dstrip-seg kapha" style={{ width: '25%' }}>Kapha 25%</div>
                  </div>
                </div>

                {/* 2. Explainable AI Feature Drivers */}
                <div className="ayur-hcard-care-block">
                  <div className="flex items-center justify-between mb-xs">
                    <div className="flex items-center gap-xs">
                      <Sparkles size={15} className="text-secondary" />
                      <span className="text-xs font-bold text-primary">Explainable AI Attribution (SHAP)</span>
                    </div>
                    <span className="text-2xs text-muted font-semibold">Top Positive Drivers</span>
                  </div>

                  <div className="ayur-hcard-xai-list">
                    <div className="ayur-hcard-xai-item">
                      <span className="text-xs text-text-primary">Meal Regularity & Timings</span>
                      <span className="ayur-xai-score-pill">+38% Impact</span>
                    </div>
                    <div className="ayur-hcard-xai-item">
                      <span className="text-xs text-text-primary">Warm, Digestible Nourishment</span>
                      <span className="ayur-xai-score-pill">+29% Impact</span>
                    </div>
                  </div>
                </div>

                {/* 3. Doctor Verification Guarantee */}
                <div className="ayur-hcard-doctor-seal">
                  <div className="ayur-hcard-seal-icon">
                    <Stethoscope size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="ayur-hcard-seal-title">Doctor-in-the-Loop Validation</h4>
                    <p className="ayur-hcard-seal-desc">
                      Every regimen is independently reviewed & authorized by a licensed physician before activation.
                    </p>
                  </div>
                </div>

                {/* 4. Action Link */}
                <button
                  type="button"
                  className="ayur-hcard-start-btn"
                  onClick={() => navigate('/assessment-overview')}
                >
                  <span>Start 10-Min Assessment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three-Step Process: Assess, Review, Track */}
      <section className="ayur-landing-section ayur-steps-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">HOW IT WORKS</span>
            <h2 className="ayur-section-title">A Simple 3-Step Journey to Healthier Eating</h2>
            <p className="ayur-section-subtitle">
              We connect accurate body assessment with real doctor validation so you always know what to eat.
            </p>
          </div>

          <div className="ayur-steps-grid">
            {/* Step 1 */}
            <div className="ayur-step-card">
              <div className="ayur-step-number">01</div>
              <div className="ayur-step-icon">
                <Activity size={24} className="text-primary" />
              </div>
              <h3 className="ayur-step-title">Assess</h3>
              <p className="ayur-step-desc">
                Complete a guided 10-minute assessment covering your body build, eating habits, energy patterns, and daily health goals in plain English.
              </p>
            </div>

            {/* Step 2 */}
            <div className="ayur-step-card">
              <div className="ayur-step-number">02</div>
              <div className="ayur-step-icon">
                <Stethoscope size={24} className="text-primary" />
              </div>
              <h3 className="ayur-step-title">Review</h3>
              <p className="ayur-step-desc">
                Our evidence-based system formulates a personalized diet plan draft, which is carefully checked and approved by a licensed doctor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="ayur-step-card">
              <div className="ayur-step-number">03</div>
              <div className="ayur-step-icon">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <h3 className="ayur-step-title">Track</h3>
              <p className="ayur-step-desc">
                Follow your daily meal schedule on your patient dashboard, get meal-time alerts, check off meals, track hydration, and watch your progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="ayur-landing-section ayur-benefits-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">KEY BENEFITS</span>
            <h2 className="ayur-section-title">Designed for Real Daily Life, Not Rigid Fads</h2>
            <p className="ayur-section-subtitle">
              Personalized healthcare means understanding your body's natural needs and eating at times that support healthy digestion.
            </p>
          </div>

          <div className="ayur-benefits-grid">
            <div className="ayur-benefit-card">
              <div className="ayur-bicon ayur-bicon--green">
                <ShieldCheck size={24} />
              </div>
              <h3 className="ayur-benefit-title">Doctor-Approved Nutrition</h3>
              <p className="ayur-benefit-desc">
                No computer algorithm prescribes your diet without clinical verification. Every active plan is signed off by a qualified medical practitioner.
              </p>
            </div>

            <div className="ayur-benefit-card">
              <div className="ayur-bicon ayur-bicon--gold">
                <Clock size={24} />
              </div>
              <h3 className="ayur-benefit-title">What to Eat & When to Eat</h3>
              <p className="ayur-benefit-desc">
                Structured meals for Breakfast, Mid-Morning, Lunch, Afternoon, and Dinner with clear suggested times and portion guidelines.
              </p>
            </div>

            <div className="ayur-benefit-card">
              <div className="ayur-bicon ayur-bicon--blue">
                <Droplets size={24} />
              </div>
              <h3 className="ayur-benefit-title">Hydration & Meal Reminders</h3>
              <p className="ayur-benefit-desc">
                Configure personalized reminder alerts so you receive gentle notifications ahead of every meal and maintain optimal water intake.
              </p>
            </div>

            <div className="ayur-benefit-card">
              <div className="ayur-bicon ayur-bicon--purple">
                <TrendingUp size={24} />
              </div>
              <h3 className="ayur-benefit-title">Persisted Progress Tracking</h3>
              <p className="ayur-benefit-desc">
                Monitor your daily meal adherence, weekly consistency streak, and physical wellness without fake or simulated metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Body Constitution Explorer in Simple English */}
      <section className="ayur-landing-section ayur-constitution-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header">
            <span className="ayur-section-tag">UNDERSTAND YOUR BODY</span>
            <h2 className="ayur-section-title">3 Natural Body Constitution Factors</h2>
            <p className="ayur-section-subtitle">
              Everyone has a unique physiological baseline. Discover how your body functions and what foods bring you balance.
            </p>
          </div>

          <div className="ayur-constitution-tabs-wrap">
            <div className="ayur-ctabs-header">
              <button
                type="button"
                className={`ayur-ctab-btn ${activeConstitutionTab === 'movement' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('movement')}
              >
                <Wind size={16} />
                <span>Movement (Air & Space)</span>
              </button>

              <button
                type="button"
                className={`ayur-ctab-btn ${activeConstitutionTab === 'metabolism' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('metabolism')}
              >
                <Flame size={16} />
                <span>Metabolism (Fire & Water)</span>
              </button>

              <button
                type="button"
                className={`ayur-ctab-btn ${activeConstitutionTab === 'structure' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('structure')}
              >
                <Mountain size={16} />
                <span>Structure (Earth & Water)</span>
              </button>
            </div>

            <div className="ayur-ctab-card">
              <div className="ayur-ctab-card__left">
                <div className="ayur-cicon-circle" style={{ backgroundColor: `${activeProfile.color}15`, color: activeProfile.color }}>
                  <ProfileIcon size={32} />
                </div>
                <h3 className="ayur-cprofile-title">{activeProfile.title}</h3>
                <p className="ayur-cprofile-desc">{activeProfile.characteristics}</p>
              </div>

              <div className="ayur-ctab-card__right">
                <div className="ayur-cfood-box include-box">
                  <h4 className="text-success text-sm font-bold flex items-center gap-xs">
                    ✓ Foods to Favor:
                  </h4>
                  <p className="text-sm text-secondary">{activeProfile.bestFoods}</p>
                </div>

                <div className="ayur-cfood-box avoid-box">
                  <h4 className="text-danger text-sm font-bold flex items-center gap-xs">
                    ✕ Foods to Limit:
                  </h4>
                  <p className="text-sm text-secondary">{activeProfile.foodsToAvoid}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Doctor Review & Clinical Oversight */}
      <section className="ayur-landing-section ayur-doctor-section">
        <div className="ayur-landing-container">
          <div className="ayur-doctor-split">
            <div className="ayur-doctor-text">
              <span className="ayur-section-tag">PHYSICIAN SUPERVISION</span>
              <h2 className="ayur-doctor-heading">AI Recommendations, Verified by Doctors</h2>
              <p className="ayur-doctor-p">
                We believe technology should empower clinicians, not replace them. Our Explainable AI synthesizes classical evidence and computes nutritional drafts, while attending doctors verify individual patient symptoms, adjust recipes, and authorize the final diet plan.
              </p>
              <ul className="ayur-doctor-features-list">
                <li>
                  <CheckCircle2 size={18} className="text-success shrink-0" />
                  <span>Licensed physicians review patient-reported data vs verified clinical observations</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-success shrink-0" />
                  <span>Full version history: all diet plan iterations and updates are archived</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className="text-success shrink-0" />
                  <span>Strict patient data isolation and role-based medical security</span>
                </li>
              </ul>
              <div className="pt-sm">
                <Link to="/doctor-login" className="ayur-doc-portal-link">
                  Are you a clinical physician? Go to Doctor Portal →
                </Link>
              </div>
            </div>

            <div className="ayur-doctor-badge-card">
              <div className="ayur-doctor-emblem">
                <Stethoscope size={36} className="text-secondary" />
              </div>
              <h3 className="font-serif font-bold text-lg text-primary">Physician Decision Gateway</h3>
              <p className="text-xs text-muted text-center max-width-md">
                Direct clinical access for doctors to evaluate intake cohorts, verify symptoms, and approve individualized diet regimens.
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

      {/* 7. Bottom CTA Banner */}
      <section className="ayur-cta-section">
        <div className="ayur-landing-container">
          <div className="ayur-cta-card">
            <h2 className="ayur-cta-title">Ready to Personalize Your Daily Nutrition?</h2>
            <p className="ayur-cta-subtitle">
              Start your free body constitution assessment today or sign in to track your meals and schedule.
            </p>
            <div className="ayur-cta-btn-row">
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
        <div className="ayur-landing-container">
          <div className="ayur-footer-top">
            <div className="ayur-footer-brand-col">
              <div className="flex items-center gap-xs">
                <span className="font-bold text-primary text-base">AyuRAG-XAI</span>
                <span className="text-xs text-secondary font-semibold">Clinical Wellness</span>
              </div>
              <p className="text-xs text-muted mt-xs max-width-md">
                Personalized dietary formulation and daily meal habit tracker supported by explainable AI and clinical doctor approval.
              </p>
            </div>

            <div className="ayur-footer-links-grid">
              <div className="ayur-footer-col">
                <strong className="ayur-footer-col-title">Navigation</strong>
                <Link to="/">Home</Link>
                <Link to="/assessment-overview">Start Assessment</Link>
                <Link to="/login">Patient Login</Link>
                <Link to="/signup">Create Account</Link>
              </div>

              <div className="ayur-footer-col">
                <strong className="ayur-footer-col-title">Clinical</strong>
                <Link to="/doctor-login">Doctor Login</Link>
                <Link to="/doctor-login">Physician Gateway</Link>
                <Link to="/assessment-overview">Clinical Guidelines</Link>
              </div>

              <div className="ayur-footer-col">
                <strong className="ayur-footer-col-title">Platform</strong>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Notice: All patient records are encrypted and protected under role-based access control.'); }}>Privacy Policy</a>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms: AyuRAG-XAI provides lifestyle and dietary recommendations reviewed by licensed medical professionals.'); }}>Terms of Service</a>
                <a href="#support" onClick={(e) => { e.preventDefault(); alert('Support: Contact clinical support at support@ayurag.org'); }}>Patient Support</a>
              </div>
            </div>
          </div>

          <div className="ayur-footer-bottom">
            <span className="text-xs text-muted">
              © {new Date().getFullYear()} AyuRAG-XAI. All rights reserved.
            </span>
            <span className="text-xs text-muted">
              Medical Notice: Personalized diet recommendations are designed for nutritional wellness and do not replace emergency medical care.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
