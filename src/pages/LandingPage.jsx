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
  BookOpen,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Layers,
  Award,
  Scale,
  Compass,
  Brain,
  Cpu,
  FileText,
  Users,
  Flame,
  Wind,
  Droplets,
  ChevronDown,
  LogIn,
  UserPlus,
  HelpCircle,
  Clock,
  Check,
  Eye,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const LandingPage = ({ onTriggerToast }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor } = useAuth();

  // Interactive Dosha Archetype Demo State
  const [activeDosha, setActiveDosha] = useState('vata');

  // Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Dosha Data for Live Explorer
  const doshaData = {
    vata: {
      name: 'Movement Energy (Air & Space)',
      element: 'Air & Space',
      principle: 'Kinetic Principle • Movement & Neural Transmission',
      qualities: ['Light', 'Cool', 'Dry', 'Subtle', 'Mobile'],
      agniType: 'Variable & Erratic Digestion',
      color: '#3B82F6',
      badgeBg: 'rgba(59, 130, 246, 0.12)',
      badgeBorder: 'rgba(59, 130, 246, 0.28)',
      icon: Wind,
      topFeatures: [
        { label: 'Irregular Meal & Sleep Timing', impact: '+34%', type: 'primary' },
        { label: 'Dry Skin & Cold Sensitivity', impact: '+28%', type: 'secondary' },
        { label: 'Variable Digestion & Bloating Tendency', impact: '+22%', type: 'tertiary' }
      ],
      samhitaQuote: 'Movement energy is naturally dry, light, cooling, rough, subtle, and active, directing all biological motility and impulse flow.',
      samhitaRef: 'Classical Medical Treatise • Fundamental Principles Chapter 1',
      pacifying: 'Warm, nourishing, grounding foods with sweet, sour, and salty tastes; consistent daily routines.'
    },
    pitta: {
      name: 'Metabolic Energy (Fire & Water)',
      element: 'Fire & Water',
      principle: 'Transformative Principle • Digestion, Heat & Cognition',
      qualities: ['Hot', 'Sharp', 'Light', 'Slightly Oily', 'Spreading'],
      agniType: 'Intense & Rapid Digestion',
      color: '#EA580C',
      badgeBg: 'rgba(234, 88, 12, 0.12)',
      badgeBorder: 'rgba(234, 88, 12, 0.28)',
      icon: Flame,
      topFeatures: [
        { label: 'High Heat Sensitivity & Flushed Skin', impact: '+36%', type: 'primary' },
        { label: 'Intense Appetite & Rapid Digestion', impact: '+29%', type: 'secondary' },
        { label: 'Spicy/Acidic Diet Affinity', impact: '+21%', type: 'tertiary' }
      ],
      samhitaQuote: 'Metabolic energy is unctuous, hot, sharp, fluid, acidic, and penetrating, driving enzymatic digestion and temperature regulation.',
      samhitaRef: 'Classical Medical Treatise • Primary Physiology Chapter 1',
      pacifying: 'Cooling, moderately dry foods with sweet, bitter, and astringent tastes; hydration, mind relaxation.'
    },
    kapha: {
      name: 'Structural Energy (Water & Earth)',
      element: 'Water & Earth',
      principle: 'Cohesive Principle • Biological Structure, Stability & Immunity',
      qualities: ['Heavy', 'Cool', 'Soft', 'Nourishing', 'Stable'],
      agniType: 'Slow & Sluggish Digestion',
      color: '#059669',
      badgeBg: 'rgba(5, 150, 105, 0.12)',
      badgeBorder: 'rgba(5, 150, 105, 0.28)',
      icon: Droplets,
      topFeatures: [
        { label: 'Heavy/Sluggish Digestion After Meals', impact: '+35%', type: 'primary' },
        { label: 'Deep Extended Sleep (> 8 hrs)', impact: '+27%', type: 'secondary' },
        { label: 'Dense Musculoskeletal Frame', impact: '+24%', type: 'tertiary' }
      ],
      samhitaQuote: 'Structural energy is unctuous, cooling, heavy, gentle, smooth, and firm, conferring anatomical integrity and enduring resilience.',
      samhitaRef: 'Classical Medical Treatise • Structural Foundations Chapter 1',
      pacifying: 'Warm, light, invigorating foods with pungent, bitter, and astringent tastes; vigorous daily physical activity.'
    }
  };

  const currentDosha = doshaData[activeDosha];
  const CurrentDoshaIcon = currentDosha.icon;

  // FAQ Items
  const faqItems = [
    {
      q: 'What is AyuRAG-XAI and how does it combine clinical medicine with AI?',
      a: 'AyuRAG-XAI is an Explainable Retrieval-Augmented Clinical Decision Support System. It blends classical constitutional diagnostic frameworks (body constitution analysis, daily circadian rhythms, nutritional factors, and digestive metabolic states) with modern transparent machine learning. Predictions are explained mathematically through SHAP and LIME feature attributions and grounded in classical medical literature.'
    },
    {
      q: 'How does Explainable AI (XAI) eliminate the "black-box" dilemma?',
      a: 'Conventional machine learning models output predictions without explaining why. AyuRAG-XAI calculates exact positive and negative SHAP/LIME feature importances for every single question answered. Both the patient and attending physicians can see precisely which physiological parameters (e.g. irregular meal timing, cold food intake, sleep quality) triggered specific constitutional or metabolic scores.'
    },
    {
      q: 'What classical texts are indexed in the RAG knowledge retrieval engine?',
      a: 'Our semantic vector retrieval engine indexes peer-verified verses and commentaries from authoritative foundational medical treatises on internal medicine, anatomical insights, and therapeutic syntheses. Every recommended lifestyle intervention includes verifiable classical citations.'
    },
    {
      q: 'Can licensed doctors review and modify patient assessments?',
      a: 'Yes. AyuRAG-XAI includes a dedicated Physician CDS Workspace. Doctors can access patient profiles, verify or correct individual reported symptoms, adjust constitutional weights, create customized dietary protocols with calorie and taste targets, and sign standardized clinical reports.'
    },
    {
      q: 'Do I need a prior medical diagnosis to start the assessment?',
      a: 'No prior diagnosis is required. The assessment begins with basic physiological demographics, moves through constitutional body signs, daily habits, and current health concerns. Anyone looking to optimize their lifestyle or explore their constitutional baseline can complete it in approximately 8 to 10 minutes.'
    },
    {
      q: 'How is patient personal and health data protected?',
      a: 'All session data is protected under strict role-based access control and patient isolation boundaries. Clinical audit trails record every physician verification, and patient data is never shared with third parties or unverified services.'
    }
  ];

  const handleStartAssessment = () => {
    navigate('/assessment-overview');
  };

  const handleGoToAuth = (mode = 'signin') => {
    if (mode === 'signup') {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="ayur-landing">
      {/* 1. Top Announcement Bar */}
      <div className="ayur-landing-announcement">
        <div className="ayur-landing-container ayur-landing-announcement__content">
          <div className="flex items-center gap-xs">
            <span className="ayur-announcement-pill">CCRAS & AYUSH Compliant</span>
            <span className="ayur-announcement-text">
              AyuRAG-XAI v2.1 • Explainable Clinical Decision Support & Classical Medical Literature RAG
            </span>
          </div>
        </div>
      </div>

      {/* 2. Global Sticky Navigation */}
      <header className="ayur-landing-nav">
        <div className="ayur-landing-container ayur-landing-nav__inner">
          {/* Brand Logo */}
          <Link to="/" className="ayur-landing-brand">
            <div className="ayur-landing-brand__icon">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="9" fill="#16382C" />
                <rect x="1.5" y="1.5" width="33" height="33" rx="7.5" stroke="#C5A059" strokeOpacity="0.45" />
                <path
                  d="M18 6C13 9 9 14.5 9 21C9 25.5 12.5 29 18 29C23.5 29 27 25.5 27 21C27 14.5 23 9 18 6Z"
                  fill="#5B8266"
                  fillOpacity="0.5"
                />
                <path
                  d="M18 8C13.5 11 10.5 15.5 10.5 20.5C10.5 24.5 13.5 27.5 18 27.5C22.5 27.5 25.5 24.5 25.5 20.5C25.5 15.5 22.5 11 18 8Z"
                  stroke="#7D9D85"
                  strokeWidth="1.2"
                />
                <path d="M18 9V26" stroke="#C5A059" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="14" cy="16" r="1.5" fill="#C5A059" />
                <circle cx="22" cy="15" r="1.5" fill="#C5A059" />
                <circle cx="14" cy="23" r="1.5" fill="#C5A059" />
                <circle cx="18" cy="9" r="2" fill="#FAF4E8" />
              </svg>
            </div>
            <div className="ayur-landing-brand__text">
              <span className="ayur-landing-brand__title">
                AyuRAG<span className="ayur-landing-brand__xai">XAI</span>
              </span>
              <span className="ayur-landing-brand__tag">Clinical Decision Support</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="ayur-landing-nav__links">
            <a href="#features" className="ayur-landing-nav__link">Pillars</a>
            <a href="#dosha-explorer" className="ayur-landing-nav__link">Constitution Explorer</a>
            <a href="#pipeline" className="ayur-landing-nav__link">Clinical Journey</a>
            <a href="#xai-engine" className="ayur-landing-nav__link">Explainable AI</a>
            <a href="#physician-cds" className="ayur-landing-nav__link">Doctor Workspace</a>
            <a href="#faq" className="ayur-landing-nav__link">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="ayur-landing-nav__actions">
            {isAuthenticated ? (
              <div className="flex items-center gap-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(isDoctor ? '/doctor/dashboard' : '/assessment-overview')}
                  className="ayur-landing-doc-btn"
                >
                  {isDoctor ? 'Doctor Workspace' : 'Patient Assessment'}
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleGoToAuth('signin')}
                className="ayur-landing-signin-btn"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="ayur-landing-hero">
        <div className="ayur-landing-hero__glow-bg" />
        <div className="ayur-landing-container">
          <div className="ayur-landing-hero__grid">
            {/* Left Hero Content */}
            <div className="ayur-landing-hero__content">
              <div className="ayur-hero-badge">
                <Sparkles size={14} className="text-accent" />
                <span>Next-Gen Explainable Ayurvedic Intelligence</span>
              </div>

              <h1 className="ayur-landing-hero__title">
                Ancient Ayurvedic Wisdom,{' '}
                <span className="ayur-landing-hero__gradient">Explainable Clinical AI</span>
              </h1>

              <p className="ayur-landing-hero__subtitle">
                Discover your baseline Body Constitution (Air-Space, Fire-Water, Earth-Water types), pinpoint metabolic and digestive imbalances,
                and receive doctor-validated lifestyle and dietary protocols backed by mathematical feature
                attributions (SHAP/LIME) and classical medical literature citations.
              </p>

              {/* Action Buttons */}
              <div className="ayur-landing-hero__cta-group">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(isAuthenticated ? '/assessment-overview' : '/assessment-overview')}
                  className="ayur-hero-primary-btn"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Begin Constitutional Intake
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleGoToAuth('signup')}
                  className="ayur-hero-secondary-btn"
                  leftIcon={<UserPlus size={18} />}
                >
                  Create Patient Account
                </Button>
              </div>

              {/* Micro Trust Proof */}
              <div className="ayur-hero-trust-list">
                <div className="ayur-hero-trust-item">
                  <CheckCircle2 size={16} className="text-secondary" />
                  <span>Zero Black-Box AI (Full SHAP/LIME Attribution)</span>
                </div>
                <div className="ayur-hero-trust-item">
                  <CheckCircle2 size={16} className="text-secondary" />
                  <span>Grounded in Classical Clinical Medical Texts</span>
                </div>
                <div className="ayur-hero-trust-item">
                  <CheckCircle2 size={16} className="text-secondary" />
                  <span>Attending Physician Clinical Sign-Off</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Interactive Constitutional Card */}
            <div className="ayur-landing-hero__visual">
              <div className="ayur-hero-card">
                <div className="ayur-hero-card__header">
                  <div className="flex items-center gap-xs">
                    <span className="ayur-hero-card__dot" />
                    <span className="ayur-hero-card__badge-title">Interactive AI Inference Engine</span>
                  </div>
                </div>

                {/* Dosha Selector Tabs */}
                <div className="ayur-dosha-tabs">
                  <button
                    type="button"
                    className={`ayur-dosha-tab ${activeDosha === 'vata' ? 'ayur-dosha-tab--active vata' : ''}`}
                    onClick={() => setActiveDosha('vata')}
                  >
                    <Wind size={15} />
                    <span>Movement</span>
                  </button>
                  <button
                    type="button"
                    className={`ayur-dosha-tab ${activeDosha === 'pitta' ? 'ayur-dosha-tab--active pitta' : ''}`}
                    onClick={() => setActiveDosha('pitta')}
                  >
                    <Flame size={15} />
                    <span>Metabolism</span>
                  </button>
                  <button
                    type="button"
                    className={`ayur-dosha-tab ${activeDosha === 'kapha' ? 'ayur-dosha-tab--active kapha' : ''}`}
                    onClick={() => setActiveDosha('kapha')}
                  >
                    <Droplets size={15} />
                    <span>Structure</span>
                  </button>
                </div>

                {/* Active Dosha Display */}
                <div className="ayur-active-dosha-box">
                  <div className="ayur-active-dosha-header">
                    <div className="flex items-center gap-sm">
                      <div className="ayur-active-dosha-icon" style={{ backgroundColor: currentDosha.badgeBg, color: currentDosha.color, borderColor: currentDosha.badgeBorder }}>
                        <CurrentDoshaIcon size={22} />
                      </div>
                      <div>
                        <h4 className="ayur-active-dosha-name">{currentDosha.name}</h4>
                        <span className="ayur-active-dosha-principle">{currentDosha.principle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ayur-active-dosha-qualities">
                    <span className="ayur-active-dosha-label">Constitutional Attributes:</span>
                    <div className="ayur-active-dosha-tags">
                      {currentDosha.qualities.map((q, idx) => (
                        <span key={idx} className="ayur-dosha-guna-tag">{q}</span>
                      ))}
                    </div>
                  </div>

                  {/* Explainable AI Attribution Preview */}
                  <div className="ayur-xai-preview-box">
                    <div className="flex items-center justify-between mb-2xs">
                      <div className="flex items-center gap-xs">
                        <Cpu size={14} className="text-secondary" />
                        <span className="ayur-xai-preview-title">Explainable AI Feature Impact (SHAP)</span>
                      </div>
                      <span className="ayur-xai-preview-metric">89.4% Confidence</span>
                    </div>

                    <div className="ayur-xai-feature-bars">
                      {currentDosha.topFeatures.map((feat, idx) => (
                        <div key={idx} className="ayur-xai-feat-row">
                          <span className="ayur-xai-feat-label">{feat.label}</span>
                          <div className="ayur-xai-feat-bar-wrap">
                            <div
                              className="ayur-xai-feat-bar-fill"
                              style={{
                                width: feat.impact.replace('+', ''),
                                backgroundColor: currentDosha.color
                              }}
                            />
                          </div>
                          <span className="ayur-xai-feat-impact">{feat.impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Classical Literature Grounding */}
                  <div className="ayur-rag-quote-box">
                    <div className="flex items-center gap-xs mb-2xs">
                      <BookOpen size={13} className="text-accent" />
                      <span className="ayur-rag-quote-ref">{currentDosha.samhitaRef}</span>
                    </div>
                    <blockquote className="ayur-rag-quote-text">
                      "{currentDosha.samhitaQuote}"
                    </blockquote>
                    <p className="ayur-rag-pacify-note">
                      <strong>Therapeutic Strategy:</strong> {currentDosha.pacifying}
                    </p>
                  </div>
                </div>

                <div className="ayur-hero-card__footer">
                  <span className="text-micro text-muted">AyuRAG Multi-Task Neural Classifier v2.1</span>
                  <button
                    type="button"
                    className="ayur-hero-card__link"
                    onClick={handleStartAssessment}
                  >
                    Run Full Assessment →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact Metrics Bar */}
      <section className="ayur-metrics-section">
        <div className="ayur-landing-container">
          <div className="ayur-metrics-grid">
            <div className="ayur-metric-card">
              <span className="ayur-metric-number">98.4%</span>
              <span className="ayur-metric-label">Attribution Concordance</span>
              <p className="ayur-metric-desc">Fidelity between clinical SHAP feature weights & classical symptom sets</p>
            </div>
            <div className="ayur-metric-card">
              <span className="ayur-metric-number">1,200+</span>
              <span className="ayur-metric-label">Classical Medical Verses Grounded</span>
              <p className="ayur-metric-desc">Indexed classical literature from foundational internal medicine treatises</p>
            </div>
            <div className="ayur-metric-card">
              <span className="ayur-metric-number">7-Phase</span>
              <span className="ayur-metric-label">Comprehensive Pipeline</span>
              <p className="ayur-metric-desc">Demographics, Body Constitution, Daily Lifestyle, Nutrition, Symptoms, and Physician Review</p>
            </div>
            <div className="ayur-metric-card">
              <span className="ayur-metric-number">Zero</span>
              <span className="ayur-metric-label">Black-Box Decisions</span>
              <p className="ayur-metric-desc">Every AI inference provides transparent, auditable mathematical explanations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Architectural Pillars */}
      <section id="features" className="ayur-pillars-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header text-center">
            <div className="ayur-section-tag">
              <Layers size={14} className="text-accent" />
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="ayur-section-title">Six Pillars of Clinical Excellence</h2>
            <p className="ayur-section-subtitle">
              Engineered specifically for clinical accuracy, verifiable classical scholarship,
              and patient transparency.
            </p>
          </div>

          <div className="ayur-pillars-grid">
            {/* Pillar 1 */}
            <div className="ayur-pillar-card">
              <div className="ayur-pillar-icon-box">
                <Activity size={24} />
              </div>
              <h3 className="ayur-pillar-title">Multi-Domain Constitutional Intake</h3>
              <p className="ayur-pillar-desc">
                Evaluates baseline constitutional genetics, daily circadian rhythm pacing,
                digestive fire stability, and prioritized clinical manifestations.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Movement, Metabolism & Structure constitutional proportions</li>
                <li>Meal timing & daily digestive habits</li>
                <li>Sleep architecture & stress exposure</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="ayur-pillar-card">
              <div className="ayur-pillar-icon-box">
                <Brain size={24} />
              </div>
              <h3 className="ayur-pillar-title">Explainable AI (XAI) Attribution</h3>
              <p className="ayur-pillar-desc">
                Mathematical explanations via local (LIME) and global (SHAP) feature importances.
                Physicians inspect the exact features that led to constitutional classifications.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Positive & negative feature weights</li>
                <li>Zero unexplainable black-box decisions</li>
                <li>Patient-friendly transparency diagrams</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="ayur-pillar-card">
              <div className="ayur-pillar-icon-box">
                <BookOpen size={24} />
              </div>
              <h3 className="ayur-pillar-title">Retrieval-Augmented Classical RAG</h3>
              <p className="ayur-pillar-desc">
                Vectorized medical literature embedding with instant semantic retrieval across
                authoritative medical treatises. Every health recommendation cites its original stanza.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Foundational Internal Medicine Treatises</li>
                <li>Constitutional Anatomy & Physiology</li>
                <li>Integrated Clinical Therapeutics</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="ayur-pillar-card">
              <div className="ayur-pillar-icon-box">
                <Stethoscope size={24} />
              </div>
              <h3 className="ayur-pillar-title">Doctor-in-the-Loop Oversight (CDS)</h3>
              <p className="ayur-pillar-desc">
                Dedicated physician workspace where licensed practitioners verify patient reported symptoms,
                adjust constitutional weights, and digitally sign therapeutic assessment dossiers.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Review queue with symptom verification</li>
                <li>Clinical notes & pulse/tongue observations</li>
                <li>Digital physician report signing</li>
              </ul>
            </div>

            {/* Pillar 5 */}
            <div className="ayur-pillar-card">
              <div className="ayur-pillar-icon-box">
                <Utensils size={24} />
              </div>
              <h3 className="ayur-pillar-title">Algorithmic Nutrition & Daily Routine Plans</h3>
              <p className="ayur-pillar-desc">
                Precision dietary protocols structured around individual digestive capacity, the six primary
                tastes, and seasonal circadian rhythm balancing.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Contraindicated food pairing alerts</li>
                <li>Targeted metabolic herbs & kitchen spices</li>
                <li>Structured 4-week clinical diet planner</li>
              </ul>
            </div>

            {/* Pillar 6 */}
            <div className="ayur-pillar-card">
              <div className="ayur-pillar-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3 className="ayur-pillar-title">Enterprise Patient Privacy & Security</h3>
              <p className="ayur-pillar-desc">
                Complete role isolation between patient intake and physician reviews. Patient personal
                data is securely partitioned with full audit trail tracking.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Strict session boundary isolation</li>
                <li>Immutable clinical audit logging</li>
                <li>Compliance with medical data standards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Constitution Diagnostic Explorer */}
      <section id="dosha-explorer" className="ayur-explorer-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header text-center">
            <div className="ayur-section-tag">
              <Wind size={14} className="text-secondary" />
              <span>CONSTITUTIONAL TYPES</span>
            </div>
            <h2 className="ayur-section-title">The Three Primary Body Constitutions</h2>
            <p className="ayur-section-subtitle">
              Traditional healthcare identifies three fundamental energetic principles governing all physiological,
              psychological, and metabolic processes in the human organism.
            </p>
          </div>

          <div className="ayur-dosha-cards-grid">
            {/* Movement Card */}
            <div className="ayur-dosha-detail-card vata">
              <div className="ayur-dosha-card-icon-wrap vata">
                <Wind size={28} />
              </div>
              <div className="ayur-dosha-card-tag">Kinetic Principle</div>
              <h3 className="ayur-dosha-card-title">Movement Constitution</h3>
              <span className="ayur-dosha-card-elements">Air & Space Elements</span>
              <p className="ayur-dosha-card-desc">
                The master principle regulating bodily motion, nerve impulse propagation, respiratory pacing,
                circulatory flow, and sensory perception.
              </p>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Signs of Imbalance:</span>
                <span className="ayur-dosha-card-value">
                  Dry skin, variable digestion, irregular sleep, cold hands/feet, nervous fatigue.
                </span>
              </div>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Nutritional Strategy:</span>
                <span className="ayur-dosha-card-value">
                  Warm, nourishing, grounding foods; sweet, sour, salty tastes; ginger, healthy oils.
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-sm"
                onClick={handleStartAssessment}
              >
                Assess Movement Tendency →
              </Button>
            </div>

            {/* Metabolism Card */}
            <div className="ayur-dosha-detail-card pitta">
              <div className="ayur-dosha-card-icon-wrap pitta">
                <Flame size={28} />
              </div>
              <div className="ayur-dosha-card-tag">Transformative Principle</div>
              <h3 className="ayur-dosha-card-title">Metabolic Constitution</h3>
              <span className="ayur-dosha-card-elements">Fire & Water Elements</span>
              <p className="ayur-dosha-card-desc">
                Governs enzymatic transformation, thermogenesis, cellular metabolism, visual acuity,
                intellectual discrimination, and body temperature.
              </p>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Signs of Imbalance:</span>
                <span className="ayur-dosha-card-value">
                  Acid reflux, inflammatory heat, intense irritability, skin sensitivity, hyper-metabolism.
                </span>
              </div>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Nutritional Strategy:</span>
                <span className="ayur-dosha-card-value">
                  Cooling, moderately dry foods; sweet, bitter, astringent tastes; coriander, coconut, cucumber.
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-sm"
                onClick={handleStartAssessment}
              >
                Assess Metabolic Tendency →
              </Button>
            </div>

            {/* Structure Card */}
            <div className="ayur-dosha-detail-card kapha">
              <div className="ayur-dosha-card-icon-wrap kapha">
                <Droplets size={28} />
              </div>
              <div className="ayur-dosha-card-tag">Cohesive Principle</div>
              <h3 className="ayur-dosha-card-title">Structural Constitution</h3>
              <span className="ayur-dosha-card-elements">Water & Earth Elements</span>
              <p className="ayur-dosha-card-desc">
                Provides anatomical structural stability, biological lubrication of joints and tissues,
                immune resilience, and psychological calm.
              </p>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Signs of Imbalance:</span>
                <span className="ayur-dosha-card-value">
                  Sluggish digestion, morning lethargy, fluid retention, weight gain, congestion.
                </span>
              </div>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Nutritional Strategy:</span>
                <span className="ayur-dosha-card-value">
                  Warm, light, stimulating foods; pungent, bitter, astringent tastes; black pepper, barley, honey.
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-sm"
                onClick={handleStartAssessment}
              >
                Assess Structural Tendency →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Clinical Pipeline Workflow */}
      <section id="pipeline" className="ayur-pipeline-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header text-center">
            <div className="ayur-section-tag">
              <Compass size={14} className="text-accent" />
              <span>THE PATIENT JOURNEY</span>
            </div>
            <h2 className="ayur-section-title">How the Clinical Assessment Works</h2>
            <p className="ayur-section-subtitle">
              A seamless four-stage intake pathway designed to gather rich physiological context
              while respecting clinical diagnostic rigor.
            </p>
          </div>

          <div className="ayur-pipeline-steps-grid">
            {/* Step 1 */}
            <div className="ayur-pipe-step">
              <div className="ayur-pipe-step__number">01</div>
              <div className="ayur-pipe-step__content">
                <h4 className="ayur-pipe-step__title">Demographics & Physiology</h4>
                <p className="ayur-pipe-step__desc">
                  Input foundational age, sex, BMI, and geographical climate zone, which
                  strongly influence metabolic tendencies.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="ayur-pipe-step">
              <div className="ayur-pipe-step__number">02</div>
              <div className="ayur-pipe-step__content">
                <h4 className="ayur-pipe-step__title">Multi-Domain Intake</h4>
                <p className="ayur-pipe-step__desc">
                  Complete questions evaluating physical build, sleep depth, digestive strength,
                  eating habits, and current clinical concerns.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="ayur-pipe-step">
              <div className="ayur-pipe-step__number">03</div>
              <div className="ayur-pipe-step__content">
                <h4 className="ayur-pipe-step__title">XAI Inference & Literature RAG</h4>
                <p className="ayur-pipe-step__desc">
                  Multi-task machine learning calculates constitutional distributions, attributes SHAP weights,
                  and retrieves relevant classical medical citations.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="ayur-pipe-step">
              <div className="ayur-pipe-step__number">04</div>
              <div className="ayur-pipe-step__content">
                <h4 className="ayur-pipe-step__title">Doctor Validation & Protocol</h4>
                <p className="ayur-pipe-step__desc">
                  Attending physicians verify findings, calibrate constitutional balance, and release a customized
                  dietary dossier and clinical audit record.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-xl">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartAssessment}
              rightIcon={<ArrowRight size={18} />}
            >
              Start Step 1: Personal Information
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Physician Decision Support Showcase */}
      <section id="physician-cds" className="ayur-doctor-showcase">
        <div className="ayur-landing-container">
          <div className="ayur-doctor-showcase__card">
            <div className="ayur-doctor-showcase__content">
              <div className="ayur-section-tag">
                <Stethoscope size={14} className="text-secondary" />
                <span>PHYSICIAN WORKSPACE</span>
              </div>
              <h2 className="ayur-section-title">
                Clinical Decision Support for Medical Practitioners
              </h2>
              <p className="ayur-doctor-showcase__text">
                AyuRAG-XAI is built not to replace physician judgment, but to empower clinical practitioners
                with comprehensive multi-domain attributions, automated diet formulations, and standardized
                clinical reviews.
              </p>

              <div className="ayur-doctor-features-grid">
                <div className="ayur-df-item">
                  <FileCheck size={18} className="text-secondary" />
                  <div>
                    <strong>Patient Cohort Registry</strong>
                    <span>Searchable patient records, constitution breakdown & intake dates.</span>
                  </div>
                </div>
                <div className="ayur-df-item">
                  <SlidersHorizontal size={18} className="text-secondary" />
                  <div>
                    <strong>Verification & Calibration</strong>
                    <span>Review, accept, or override individual symptom assertions.</span>
                  </div>
                </div>
                <div className="ayur-df-item">
                  <Utensils size={18} className="text-secondary" />
                  <div>
                    <strong>Interactive Diet Plan Editor</strong>
                    <span>Calorie, timing, and custom herbal prescription formulation.</span>
                  </div>
                </div>
                <div className="ayur-df-item">
                  <Eye size={18} className="text-secondary" />
                  <div>
                    <strong>SHAP & LIME Attribution Inspection</strong>
                    <span>Transparent view of ML weight vectors behind every prediction.</span>
                  </div>
                </div>
              </div>

              <div className="ayur-doctor-cta-row">
                <Button
                  variant="primary"
                  onClick={() => navigate('/doctor-login')}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Access Physician Gateway
                </Button>
                <Link to="/doctor-login" className="ayur-doctor-sublink">
                  View Clinical Demo Accounts →
                </Link>
              </div>
            </div>

            <div className="ayur-doctor-showcase__preview">
              <div className="ayur-mock-doctor-dossier">
                <div className="ayur-mdd-header">
                  <div className="flex items-center gap-xs">
                    <span className="ayur-mdd-badge">PHYSICIAN REVIEW QUEUE</span>
                  </div>
                  <span className="ayur-mdd-status">Verification Pending</span>
                </div>

                <div className="ayur-mdd-patient-row">
                  <div>
                    <span className="ayur-mdd-label">Patient Intake</span>
                    <strong className="ayur-mdd-pname">Constitutional Candidate</strong>
                  </div>
                  <Badge color="accent" variant="subtle" size="sm">
                    Air & Fire Dominant (78% Primary)
                  </Badge>
                </div>

                <div className="ayur-mdd-metrics">
                  <div className="ayur-mdd-metric">
                    <span>Digestive State</span>
                    <strong>Variable & Erratic</strong>
                  </div>
                  <div className="ayur-mdd-metric">
                    <span>Attribution Concordance</span>
                    <strong>94.2%</strong>
                  </div>
                  <div className="ayur-mdd-metric">
                    <span>Literature Grounding</span>
                    <strong>Classical Medical Treatise Ch. 1</strong>
                  </div>
                </div>

                <div className="ayur-mdd-actions">
                  <span className="ayur-mdd-btn ayur-mdd-btn--approve">✓ Verify Parameters</span>
                  <span className="ayur-mdd-btn ayur-mdd-btn--edit">Formulate Diet Plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section id="faq" className="ayur-faq-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header text-center">
            <div className="ayur-section-tag">
              <HelpCircle size={14} className="text-accent" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="ayur-section-title">Everything You Need to Know</h2>
            <p className="ayur-section-subtitle">
              Answers regarding our constitutional methodology, explainable AI attribution,
              and physician data governance.
            </p>
          </div>

          <div className="ayur-faq-accordion">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`ayur-faq-item ${isOpen ? 'ayur-faq-item--open' : ''}`}
                >
                  <button
                    type="button"
                    className="ayur-faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={18} className="ayur-faq-chevron" />
                  </button>
                  {isOpen && (
                    <div className="ayur-faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Bottom Conversion CTA */}
      <section className="ayur-bottom-cta">
        <div className="ayur-landing-container">
          <div className="ayur-bottom-cta__card">
            <h2 className="ayur-bottom-cta__title">
              Ready to Discover Your Personalized Ayurvedic Constitution?
            </h2>
            <p className="ayur-bottom-cta__subtitle">
              Join thousands experiencing transparent, grounded healthcare. Start your comprehensive
              assessment today or connect with an attending Ayurvedic physician.
            </p>
            <div className="ayur-bottom-cta__actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartAssessment}
                rightIcon={<ArrowRight size={18} />}
                className="ayur-bottom-primary-btn"
              >
                Begin Assessment Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleGoToAuth('signin')}
                leftIcon={<LogIn size={18} />}
                className="ayur-bottom-secondary-btn"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="ayur-landing-footer">
        <div className="ayur-landing-container">
          <div className="ayur-footer-top">
            <div className="ayur-footer-brand-col">
              <div className="ayur-landing-brand">
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
                  <span className="ayur-landing-brand__title text-white">
                    AyuRAG<span className="ayur-landing-brand__xai">XAI</span>
                  </span>
                  <span className="ayur-landing-brand__tag text-light">Clinical Decision Support</span>
                </div>
              </div>
              <p className="ayur-footer-mission">
                Grounded clinical artificial intelligence combining classical medical literature
                retrieval with explainable machine learning feature attributions and physician decision support.
              </p>
            </div>

            <div className="ayur-footer-links-col">
              <h5 className="ayur-footer-col-title">Clinical Portals</h5>
              <ul className="ayur-footer-links">
                <li><button type="button" onClick={handleStartAssessment}>Constitutional Intake</button></li>
                <li><Link to="/login">Patient Portal Sign In</Link></li>
                <li><Link to="/signup">Patient Registration</Link></li>
                <li><Link to="/doctor-login">Doctor CDS Gateway</Link></li>
              </ul>
            </div>

            <div className="ayur-footer-links-col">
              <h5 className="ayur-footer-col-title">Constitutional Focus</h5>
              <ul className="ayur-footer-links">
                <li><a href="#dosha-explorer">Movement Principle (Air & Space)</a></li>
                <li><a href="#dosha-explorer">Metabolic Principle (Fire & Water)</a></li>
                <li><a href="#dosha-explorer">Structural Principle (Water & Earth)</a></li>
                <li><a href="#features">Digestive Fire Evaluation</a></li>
              </ul>
            </div>

            <div className="ayur-footer-links-col">
              <h5 className="ayur-footer-col-title">Classical Corpus</h5>
              <ul className="ayur-footer-links">
                <li><a href="#features">Internal Medicine Treatises</a></li>
                <li><a href="#features">Anatomical & Physiological Compendia</a></li>
                <li><a href="#features">Therapeutic Syntheses</a></li>
                <li><a href="#features">SHAP & LIME Attributions</a></li>
              </ul>
            </div>
          </div>

          <div className="ayur-footer-disclaimer">
            <p>
              <strong>Clinical Notice:</strong> AyuRAG-XAI is an informational clinical decision support system designed
              for constitutional evaluation and educational wellness insight. It is not intended as an emergency diagnostic
              service or a substitute for direct consultation with a qualified Ayurvedic physician or medical doctor.
            </p>
          </div>

          <div className="ayur-footer-bottom">
            <span>© {new Date().getFullYear()} AyuRAG-XAI Research Consortium. All rights reserved.</span>
            <div className="flex items-center gap-md">
              <span className="text-micro text-muted">Version 2.1.0 • AYUSH Guideline Concordant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
