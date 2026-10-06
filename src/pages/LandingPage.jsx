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
      name: 'Vāta (vāyu + ākāsha)',
      element: 'Air & Ether',
      principle: 'Kinetic Principle • Movement & Neural Transmission',
      qualities: ['Light (Laghu)', 'Cold (Śīta)', 'Dry (Rūkṣa)', 'Subtle (Sūkṣma)', 'Mobile (Cala)'],
      agniType: 'Viṣama Agni (Variable, Erratic Digestion)',
      color: '#3B82F6',
      badgeBg: 'rgba(59, 130, 246, 0.12)',
      badgeBorder: 'rgba(59, 130, 246, 0.28)',
      icon: Wind,
      topFeatures: [
        { label: 'Irregular Meal & Sleep Timing', impact: '+34%', type: 'primary' },
        { label: 'Dry Skin & Cold Sensitivity', impact: '+28%', type: 'secondary' },
        { label: 'Variable Agni & Bloating Tendency', impact: '+22%', type: 'tertiary' }
      ],
      samhitaQuote: 'तत्र रूक्षो लघुः शीतो खरः सूक्ष्मश्चलोऽनिलः । (Caraka Saṃhitā, Sūtrasthāna 1.59)',
      samhitaRef: 'Caraka Saṃhitā • Sūtrasthāna Ch. 1, Verse 59',
      pacifying: 'Warm, unctuous (Snigdha), grounding foods with sweet, sour, and salty rasas; regular Dinacharya routine.'
    },
    pitta: {
      name: 'Pitta (tejas + jala)',
      element: 'Fire & Water',
      principle: 'Transformative Principle • Digestion, Heat & Cognition',
      qualities: ['Hot (Uṣṇa)', 'Sharp (Tīkṣṇa)', 'Light (Laghu)', 'Slightly Oily (Sasneha)', 'Spreading (Sara)'],
      agniType: 'Tīkṣṇa Agni (Intense, Hyperactive Digestion)',
      color: '#EA580C',
      badgeBg: 'rgba(234, 88, 12, 0.12)',
      badgeBorder: 'rgba(234, 88, 12, 0.28)',
      icon: Flame,
      topFeatures: [
        { label: 'High Heat Sensitivity & Flushed Skin', impact: '+36%', type: 'primary' },
        { label: 'Intense Appetite & Rapid Digestion', impact: '+29%', type: 'secondary' },
        { label: 'Spicy/Acidic Diet Affinity', impact: '+21%', type: 'tertiary' }
      ],
      samhitaQuote: 'पित्तं सस्नेहमुष्णं च तीक्ष्णं द्रवमम्लं सरं कटु । (Aṣṭāṅga Hṛdayam, Sūtrasthāna 1.11)',
      samhitaRef: 'Aṣṭāṅga Hṛdayam • Sūtrasthāna Ch. 1, Verse 11',
      pacifying: 'Cooling, moderately dry foods with sweet, bitter, and astringent rasas; hydration, mind relaxation.'
    },
    kapha: {
      name: 'Kapha (jala + pṛthvī)',
      element: 'Water & Earth',
      principle: 'Cohesive Principle • Biological Structure, Stability & Immunity',
      qualities: ['Heavy (Guru)', 'Cold (Śīta)', 'Soft (Mṛdu)', 'Oily (Snigdha)', 'Stable (Sthira)'],
      agniType: 'Manda Agni (Slow, Sluggish Digestion)',
      color: '#059669',
      badgeBg: 'rgba(5, 150, 105, 0.12)',
      badgeBorder: 'rgba(5, 150, 105, 0.28)',
      icon: Droplets,
      topFeatures: [
        { label: 'Heavy/Sluggish Digestion After Meals', impact: '+35%', type: 'primary' },
        { label: 'Deep Extended Sleep (> 8 hrs)', impact: '+27%', type: 'secondary' },
        { label: 'Dense Musculoskeletal Frame', impact: '+24%', type: 'tertiary' }
      ],
      samhitaQuote: 'स्निग्धः शीतो गुरुर्मन्दः श्लक्ष्णो मृत्स्नः स्थिरः कफः । (Caraka Saṃhitā, Sūtrasthāna 1.61)',
      samhitaRef: 'Caraka Saṃhitā • Sūtrasthāna Ch. 1, Verse 61',
      pacifying: 'Warm, light, invigorating foods with pungent, bitter, and astringent rasas; vigorous daily physical activity.'
    }
  };

  const currentDosha = doshaData[activeDosha];
  const CurrentDoshaIcon = currentDosha.icon;

  // FAQ Items
  const faqItems = [
    {
      q: 'What is AyuRAG-XAI and how does it combine Ayurveda with AI?',
      a: 'AyuRAG-XAI is an Explainable Retrieval-Augmented Clinical Decision Support System. It blends classical Ayurvedic diagnostic frameworks (Prakriti constitutional analysis, Dinacharya circadian rhythms, Ahara dietary factors, and Agni metabolic states) with modern transparent machine learning. Predictions are explained mathematically through SHAP and LIME feature attributions and grounded in classical Ayurvedic literature (Caraka Saṃhitā, Suśruta Saṃhitā, Aṣṭāṅga Hṛdayam).'
    },
    {
      q: 'How does Explainable AI (XAI) eliminate the "black-box" dilemma?',
      a: 'Conventional machine learning models output predictions without explaining why. AyuRAG-XAI calculates exact positive and negative SHAP/LIME feature importances for every single question answered. Both the patient and attending physicians can see precisely which physiological parameters (e.g. irregular meal timing, cold food intake, sleep quality) triggered specific constitutional or metabolic scores.'
    },
    {
      q: 'What classical texts are indexed in the RAG knowledge retrieval engine?',
      a: 'Our semantic vector retrieval engine indexes peer-verified verses and commentaries from the Brihat Trayi: Caraka Saṃhitā (Internal Medicine & Kayachikitsa), Suśruta Saṃhitā (Anatomical & Surgical Insights), and Aṣṭāṅga Hṛdayam. Every recommended herbal formulation, dietary recommendation, or lifestyle intervention includes verifiable classical citations.'
    },
    {
      q: 'Can licensed doctors review and modify patient assessments?',
      a: 'Yes. AyuRAG-XAI includes a dedicated Physician CDS Workspace. Doctors can access patient profiles, verify or correct individual reported symptoms, adjust constitutional weights, create customized dietary protocols with calorie and rasa targets, and sign standardized clinical reports.'
    },
    {
      q: 'Do I need a prior medical diagnosis to start the assessment?',
      a: 'No prior diagnosis is required. The assessment begins with basic physiological demographics, moves through constitutional body signs, daily habits, and current health concerns. Anyone looking to optimize their lifestyle or explore their Ayurvedic baseline can complete it in approximately 8 to 12 minutes.'
    },
    {
      q: 'How is patient personal and health data protected?',
      a: 'All session data is protected under strict role-based access control and patient isolation boundaries. Clinical audit trails record every physician verification, and patient data is never shared with third parties or unverified services.'
    }
  ];

  const handleStartAssessment = () => {
    navigate('/assessment');
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
              AyuRAG-XAI v2.1 • Explainable Clinical Decision Support & Classical Samhitā RAG
            </span>
          </div>
          <div className="ayur-announcement-links">
            <Link to="/doctor-login" className="ayur-announcement-link">
              Physician Gateway →
            </Link>
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
            <a href="#dosha-explorer" className="ayur-landing-nav__link">Dosha Explorer</a>
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
                  onClick={() => navigate(isDoctor ? '/doctor/dashboard' : '/assessment')}
                >
                  {isDoctor ? 'Doctor Workspace' : 'Continue Intake'}
                </Button>
              </div>
            ) : (
              <>
                <Link to="/doctor-login" className="ayur-landing-doc-btn">
                  <Stethoscope size={15} />
                  <span>Doctor Portal</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGoToAuth('signin')}
                  className="ayur-landing-login-btn"
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartAssessment}
                  className="ayur-landing-cta-btn"
                >
                  <span>Start Assessment</span>
                  <ArrowRight size={15} />
                </Button>
              </>
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
                Discover your baseline Prakriti (Vāta • Pitta • Kapha), pinpoint metabolic Agni imbalances,
                and receive doctor-validated lifestyle and dietary protocols backed by mathematical feature
                attributions (SHAP/LIME) and classical Samhitā literature citations.
              </p>

              {/* Action Buttons */}
              <div className="ayur-landing-hero__cta-group">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartAssessment}
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

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/doctor-login')}
                  className="ayur-hero-doctor-btn"
                  leftIcon={<Stethoscope size={18} />}
                >
                  Doctor CDS Portal
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
                  <span>Grounded in Caraka, Suśruta & Vagbhata</span>
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
                  <Badge color="accent" variant="subtle" size="sm">
                    Live Demo
                  </Badge>
                </div>

                {/* Dosha Selector Tabs */}
                <div className="ayur-dosha-tabs">
                  <button
                    type="button"
                    className={`ayur-dosha-tab ${activeDosha === 'vata' ? 'ayur-dosha-tab--active vata' : ''}`}
                    onClick={() => setActiveDosha('vata')}
                  >
                    <Wind size={15} />
                    <span>Vāta</span>
                  </button>
                  <button
                    type="button"
                    className={`ayur-dosha-tab ${activeDosha === 'pitta' ? 'ayur-dosha-tab--active pitta' : ''}`}
                    onClick={() => setActiveDosha('pitta')}
                  >
                    <Flame size={15} />
                    <span>Pitta</span>
                  </button>
                  <button
                    type="button"
                    className={`ayur-dosha-tab ${activeDosha === 'kapha' ? 'ayur-dosha-tab--active kapha' : ''}`}
                    onClick={() => setActiveDosha('kapha')}
                  >
                    <Droplets size={15} />
                    <span>Kapha</span>
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
                    <span className="ayur-active-dosha-label">Constitutional Gunas:</span>
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
              <span className="ayur-metric-label">Classical Shlokas Grounded</span>
              <p className="ayur-metric-desc">Indexed Sanskrit verses from Caraka, Suśruta, and Aṣṭāṅga Hṛdayam</p>
            </div>
            <div className="ayur-metric-card">
              <span className="ayur-metric-number">7-Phase</span>
              <span className="ayur-metric-label">Comprehensive Pipeline</span>
              <p className="ayur-metric-desc">Demographics, Prakriti, Dinacharya, Ahara, Symptoms, and Physician Validation</p>
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
                Evaluates baseline constitutional genetics (Prakriti), daily circadian rhythm pacing (Dinacharya),
                digestive fire stability (Agni), and prioritized clinical manifestations.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Vāta, Pitta, Kapha constitutional proportions</li>
                <li>Meal timing & Ahara digestive habits</li>
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
                Vectorized Sanskrit literature embedding with instant semantic retrieval across
                authoritative Samhitā treatises. Every health recommendation cites its original stanza.
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Caraka Saṃhitā (Internal Medicine)</li>
                <li>Suśruta Saṃhitā (Constitutional Anatomy)</li>
                <li>Aṣṭāṅga Hṛdayam (Therapeutic Syntheses)</li>
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
                adjust dosha weights, and digitally sign therapeutic assessment dossiers.
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
              <h3 className="ayur-pillar-title">Algorithmic Ahara & Dinacharya Plans</h3>
              <p className="ayur-pillar-desc">
                Precision dietary protocols structured around individual Agni capacity, the six Ayurvedic
                tastes (Shad Rasa), and seasonal circadian rhythm balancing (Ritucharya).
              </p>
              <ul className="ayur-pillar-bullets">
                <li>Contraindicated food pairing alerts (Viruddha Ahara)</li>
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

      {/* 6. Interactive Dosha Diagnostic Explorer */}
      <section id="dosha-explorer" className="ayur-explorer-section">
        <div className="ayur-landing-container">
          <div className="ayur-section-header text-center">
            <div className="ayur-section-tag">
              <Wind size={14} className="text-secondary" />
              <span>TRIDOSHA ARCHETYPES</span>
            </div>
            <h2 className="ayur-section-title">The Three Pillars of Ayurvedic Physiology</h2>
            <p className="ayur-section-subtitle">
              Ayurveda identifies three fundamental energetic principles governing all physiological,
              psychological, and metabolic processes in the human organism.
            </p>
          </div>

          <div className="ayur-dosha-cards-grid">
            {/* Vata Card */}
            <div className="ayur-dosha-detail-card vata">
              <div className="ayur-dosha-card-icon-wrap vata">
                <Wind size={28} />
              </div>
              <div className="ayur-dosha-card-tag">Kinetic Principle</div>
              <h3 className="ayur-dosha-card-title">Vāta Dosha</h3>
              <span className="ayur-dosha-card-elements">Ether (Ākāsha) + Air (Vāyu)</span>
              <p className="ayur-dosha-card-desc">
                The master dosha regulating bodily motion, nerve impulse propagation, respiratory pacing,
                circulatory flow, and sensory perception.
              </p>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Signs of Imbalance:</span>
                <span className="ayur-dosha-card-value">
                  Dry skin, variable digestion (Vishama Agni), irregular sleep, cold hands/feet, nervous fatigue.
                </span>
              </div>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Nutritional Strategy:</span>
                <span className="ayur-dosha-card-value">
                  Warm, oily (Snigdha), grounding foods; sweet, sour, salty rasas; ginger, ghee, sesame oil.
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-sm"
                onClick={handleStartAssessment}
              >
                Assess Vāta Tendency →
              </Button>
            </div>

            {/* Pitta Card */}
            <div className="ayur-dosha-detail-card pitta">
              <div className="ayur-dosha-card-icon-wrap pitta">
                <Flame size={28} />
              </div>
              <div className="ayur-dosha-card-tag">Transformative Principle</div>
              <h3 className="ayur-dosha-card-title">Pitta Dosha</h3>
              <span className="ayur-dosha-card-elements">Fire (Tejas) + Water (Jala)</span>
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
                  Cooling, moderately dry foods; sweet, bitter, astringent rasas; coriander, coconut, cucumber.
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-sm"
                onClick={handleStartAssessment}
              >
                Assess Pitta Tendency →
              </Button>
            </div>

            {/* Kapha Card */}
            <div className="ayur-dosha-detail-card kapha">
              <div className="ayur-dosha-card-icon-wrap kapha">
                <Droplets size={28} />
              </div>
              <div className="ayur-dosha-card-tag">Cohesive Principle</div>
              <h3 className="ayur-dosha-card-title">Kapha Dosha</h3>
              <span className="ayur-dosha-card-elements">Water (Jala) + Earth (Pṛthvī)</span>
              <p className="ayur-dosha-card-desc">
                Provides anatomical structural stability, biological lubrication of joints and tissues,
                immune resilience (Ojas), and psychological calm.
              </p>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Signs of Imbalance:</span>
                <span className="ayur-dosha-card-value">
                  Sluggish digestion (Manda Agni), morning lethargy, fluid retention, weight gain, congestion.
                </span>
              </div>

              <div className="ayur-dosha-card-section">
                <span className="ayur-dosha-card-label">Nutritional Strategy:</span>
                <span className="ayur-dosha-card-value">
                  Warm, light, stimulating foods; pungent, bitter, astringent rasas; black pepper, barley, honey.
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-sm"
                onClick={handleStartAssessment}
              >
                Assess Kapha Tendency →
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
                  Input foundational age, sex, BMI, and geographical climate zone (Desha), which
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
                  Complete questions evaluating physical build, sleep depth, digestive fire (Agni),
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
                  and retrieves relevant Samhitā citations.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="ayur-pipe-step">
              <div className="ayur-pipe-step__number">04</div>
              <div className="ayur-pipe-step__content">
                <h4 className="ayur-pipe-step__title">Doctor Validation & Protocol</h4>
                <p className="ayur-pipe-step__desc">
                  Attending physicians verify findings, calibrate dosha balance, and release a customized
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
                Clinical Decision Support for Ayurvedic Practitioners
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
                    <span>Searchable patient records, prakriti breakdown & intake dates.</span>
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
                    Vāta-Pitta (78% Primary)
                  </Badge>
                </div>

                <div className="ayur-mdd-metrics">
                  <div className="ayur-mdd-metric">
                    <span>Agni State</span>
                    <strong>Viṣama Agni</strong>
                  </div>
                  <div className="ayur-mdd-metric">
                    <span>Attribution Concordance</span>
                    <strong>94.2%</strong>
                  </div>
                  <div className="ayur-mdd-metric">
                    <span>Literature Grounding</span>
                    <strong>Caraka Sūtra 1.59</strong>
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
                Patient Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/doctor-login')}
                leftIcon={<Stethoscope size={18} />}
                className="ayur-bottom-doctor-btn"
              >
                Doctor Portal
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
                Grounded Ayurvedic artificial intelligence combining classical Samhitā literature
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
                <li><a href="#dosha-explorer">Vāta Movement Principle</a></li>
                <li><a href="#dosha-explorer">Pitta Metabolic Principle</a></li>
                <li><a href="#dosha-explorer">Kapha Structural Principle</a></li>
                <li><a href="#features">Agni Digestive Evaluation</a></li>
              </ul>
            </div>

            <div className="ayur-footer-links-col">
              <h5 className="ayur-footer-col-title">Classical Corpus</h5>
              <ul className="ayur-footer-links">
                <li><a href="#features">Caraka Saṃhitā Sūtra</a></li>
                <li><a href="#features">Suśruta Saṃhitā Śarīra</a></li>
                <li><a href="#features">Aṣṭāṅga Hṛdayam</a></li>
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
