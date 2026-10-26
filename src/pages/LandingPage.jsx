import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Activity,
  Utensils,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Flame,
  Wind,
  Mountain,
  LogIn,
  Stethoscope,
  Sparkles,
  Info,
  BookOpen,
  Database,
  UserCheck,
  LineChart,
  Menu,
  X,
  Lock,
  Layers,
  Clock,
  AlertCircle,
  ChevronRight,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isDoctor } = useAuth();

  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active constitution tab for physiological factors section
  const [activeConstitutionTab, setActiveConstitutionTab] = useState('movement');

  // Active transparency layer tab for Section E
  const [activeEpistemicTab, setActiveEpistemicTab] = useState('samhita');

  // Preview card interactive mode
  const [previewTab, setPreviewTab] = useState('profile');

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const constitutionFactors = {
    movement: {
      id: 'movement',
      sanskrit: 'Movement Pattern',
      name: 'Movement & Kinetic Energy',
      element: 'Air & Space',
      principle: 'Governs circulation, nerve impulse conduction, respiratory rhythms, and cellular motility.',
      traits: 'Agile, creative, lighter build, quick digestion that fluctuates with environmental stress.',
      pathya: 'Warm, moist, grounding meals: slow-cooked stews, root vegetables, warm oats, sesame, and ghee.',
      apathya: 'Chilled drinks, raw dry salads, irregular dining intervals, and excessively astringent snacks.',
      color: '#2563EB',
      icon: Wind,
    },
    metabolism: {
      id: 'metabolism',
      sanskrit: 'Metabolism Pattern',
      name: 'Metabolic & Thermal Energy',
      element: 'Fire & Water',
      principle: 'Governs biochemical transformation, enzymatic digestion, cellular thermoregulation, and nutrient absorption.',
      traits: 'Focused, sharp cognition, medium athletic frame, robust appetite, sensitivity to heat.',
      pathya: 'Cooling, hydrating, naturally sweet foods: basmati rice, cucumbers, ghee, leafy greens, and coconut.',
      apathya: 'Pungent chili oils, deep-fried foods, excessive vinegars, mustard seeds, and missed meals.',
      color: '#D97706',
      icon: Flame,
    },
    structure: {
      id: 'structure',
      sanskrit: 'Structure Pattern',
      name: 'Structural & Cohesive Energy',
      element: 'Earth & Water',
      principle: 'Governs physical stamina, musculoskeletal architecture, joint lubrication, and immune resilience.',
      traits: 'Calm, steady endurance, sturdy skeletal frame, slower yet steady digestive capacity.',
      pathya: 'Light, warm, metabolism-stimulating meals: millets, quinoa, clear herbal broths, black pepper, and ginger.',
      apathya: 'Heavy sugary desserts, unctuous dairy creams, iced liquids, and late-night rich dinners.',
      color: '#059669',
      icon: Mountain,
    },
  };

  const activeFactor = constitutionFactors[activeConstitutionTab];
  const FactorIcon = activeFactor.icon;

  const epistemicLayers = {
    samhita: {
      title: 'Canonical Classical Epistemology',
      subtitle: 'Classical Medical Treatises',
      tag: 'Traditional Grounding',
      icon: BookOpen,
      badgeColor: '#123B2F',
      description:
        'Foundational constitutional definitions, balance interactions, and food-pairing principles are indexed directly from authentic classical compendia without generative drift.',
      sources: [
        'Charaka Samhita (Sutrasthana, Vimanasthana)',
        'Sushruta Samhita (Sharirasthana)',
        'Ashtanga Hridaya (Sutrasthana)',
      ],
      attributionMethod:
        'Exact semantic vector search over translated and verified Sanskrit verses with shloka-level attribution.',
    },
    nutrition: {
      title: 'Empirical Nutritional Indices',
      subtitle: 'Biochemical Food Composition Data',
      tag: 'Nutritional Science',
      icon: Utensils,
      badgeColor: '#C5A45D',
      description:
        'Classical food properties (Rasa, Guna, Virya, Vipaka) are cross-referenced with modern nutritional databases to guarantee caloric, glycemic, and micro-nutrient validity.',
      sources: [
        'Indian Food Composition Tables (IFCT 2017, ICMR-NIN)',
        'Validated Botanical Pharmacognosy Datasets',
        'Clinical Glycemic & Mineral Benchmarks',
      ],
      attributionMethod:
        'Deterministic nutritional modeling calculated against daily RDA requirements and constitutional tolerance.',
    },
    xai: {
      title: 'Explainable AI Attribution',
      subtitle: 'Mathematical Feature Attribution Models',
      tag: 'Transparent Inference',
      icon: Sparkles,
      badgeColor: '#2563EB',
      description:
        'Rather than operating as a black-box model, our pipeline explicitly quantifies which specific patient responses influenced the constitutional probabilities and dietary warnings.',
      sources: [
        'Kernel SHAP & LIME Feature Attribution Engines',
        'Multi-Domain Questionnaire Weight Matrices',
        'Deterministic Constraint Verification Filters',
      ],
      attributionMethod:
        'Visible percentage contribution values indicating exact driving factors behind constitutional scores.',
    },
    physician: {
      title: 'Human-in-the-Loop Clinical Judgment',
      subtitle: 'Licensed Ayurvedic Physician Oversight',
      tag: 'Medical Verification',
      icon: Stethoscope,
      badgeColor: '#059669',
      description:
        'AI outputs serve as decision support. Certified physicians inspect intake dossiers, adjust dietary plans for existing comorbidities, and sign off before care plan activation.',
      sources: [
        'Licensed Ayurvedic Physicians (BAMS / MD Ayur)',
        'Dedicated Physician Clinical Workspace',
        'Immutable Audit Log & Regimen Approval Workflow',
      ],
      attributionMethod:
        'Physician sign-off stamp with timestamped clinical notes and dosage adjustments.',
    },
  };

  const activeEpistemic = epistemicLayers[activeEpistemicTab];
  const EpistemicIcon = activeEpistemic.icon;

  return (
    <div className="ayur-landing">
      {/* ====================================================================
          1. NAVIGATION BAR (Compact, Accessible, Sticky, Mobile Drawer)
          ==================================================================== */}
      <header className="ayur-landing-nav" role="banner">
        <div className="ayur-container ayur-landing-nav__inner">
          {/* Brand Logo */}
          <Link to="/" className="ayur-landing-brand" aria-label="AyuRAG-XAI Home">
            <div className="ayur-landing-brand__icon">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="36" height="36" rx="10" fill="#123B2F" />
                <rect x="1.5" y="1.5" width="33" height="33" rx="8.5" stroke="#C5A45D" strokeOpacity="0.4" />
                {/* Botanical leaf geometry */}
                <path
                  d="M18 6C13 9.5 9.5 15 9.5 21.5C9.5 26.2 13.3 29.5 18 29.5C22.7 29.5 26.5 26.2 26.5 21.5C26.5 15 23 9.5 18 6Z"
                  fill="#A8BDA7"
                  fillOpacity="0.32"
                />
                <path d="M18 9V26.5" stroke="#C5A45D" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M18 15L23 12.5" stroke="#C5A45D" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M18 19L13 16.5" stroke="#C5A45D" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M18 23L22 21" stroke="#C5A45D" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="18" cy="8.5" r="2" fill="#F8F6F0" />
              </svg>
            </div>
            <div className="ayur-landing-brand__text">
              <span className="ayur-landing-brand__title">
                AyuRAG<span className="ayur-landing-brand__xai">XAI</span>
              </span>
              <span className="ayur-landing-brand__tag">Clinical Decision Support</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="ayur-landing-nav__links" aria-label="Main Navigation">
            <a
              href="#why-ayurag"
              onClick={(e) => scrollToSection(e, 'why-ayurag')}
              className="ayur-landing-nav__link"
            >
              Why AyuRAG-XAI
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="ayur-landing-nav__link"
            >
              How It Works
            </a>
            <a
              href="#capabilities"
              onClick={(e) => scrollToSection(e, 'capabilities')}
              className="ayur-landing-nav__link"
            >
              Capabilities
            </a>
            <a
              href="#evidence-transparency"
              onClick={(e) => scrollToSection(e, 'evidence-transparency')}
              className="ayur-landing-nav__link"
            >
              Evidence & RAG
            </a>
            <a
              href="#trust-safety"
              onClick={(e) => scrollToSection(e, 'trust-safety')}
              className="ayur-landing-nav__link"
            >
              Trust & Safety
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="ayur-landing-nav__actions">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(isDoctor ? '/doctor/dashboard' : '/dashboard')}
                rightIcon={<ArrowRight size={14} />}
                className="ayur-nav-cta"
              >
                {isDoctor ? 'Doctor Workspace' : 'My Dashboard'}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/signin')}
                leftIcon={<LogIn size={15} />}
                className="ayur-nav-signin"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="ayur-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`ayur-mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
          id="mobile-navigation"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="ayur-container ayur-mobile-drawer__content">
            <nav className="ayur-mobile-nav" aria-label="Mobile Navigation Links">
              <a
                href="#why-ayurag"
                onClick={(e) => scrollToSection(e, 'why-ayurag')}
                className="ayur-mobile-nav__link"
              >
                Why AyuRAG-XAI
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, 'how-it-works')}
                className="ayur-mobile-nav__link"
              >
                How It Works
              </a>
              <a
                href="#capabilities"
                onClick={(e) => scrollToSection(e, 'capabilities')}
                className="ayur-mobile-nav__link"
              >
                Key Capabilities
              </a>
              <a
                href="#evidence-transparency"
                onClick={(e) => scrollToSection(e, 'evidence-transparency')}
                className="ayur-mobile-nav__link"
              >
                Evidence & Transparency
              </a>
              <a
                href="#trust-safety"
                onClick={(e) => scrollToSection(e, 'trust-safety')}
                className="ayur-mobile-nav__link"
              >
                Trust & Safety
              </a>
            </nav>

            <div className="ayur-mobile-drawer__actions">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/assessment-overview');
                }}
                rightIcon={<ArrowRight size={16} />}
                className="w-full"
              >
                Start Your Assessment
              </Button>
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(isDoctor ? '/doctor/dashboard' : '/dashboard');
                  }}
                  className="w-full"
                >
                  {isDoctor ? 'Doctor Workspace' : 'Open Dashboard'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/signin');
                  }}
                  leftIcon={<LogIn size={16} />}
                  className="w-full"
                >
                  Sign In (Patient or Doctor)
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          SECTION A: HERO (Natural Botanical Atmosphere & AI Preview)
          ==================================================================== */}
      <section className="ayur-hero-section" id="hero" aria-labelledby="hero-heading">
        {/* Decorative Floating Botanical Background Shapes */}
        <div className="ayur-hero-botanical-bg" aria-hidden="true">
          <div className="botanical-shape shape-1">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 15C50 40 15 85 20 145C65 150 140 140 180 85C165 40 135 20 100 15Z"
                fill="#A8BDA7"
                fillOpacity="0.22"
              />
              <path d="M40 135C75 105 110 75 160 55" stroke="#C5A45D" strokeWidth="1.2" strokeOpacity="0.3" />
            </svg>
          </div>
          <div className="botanical-shape shape-2">
            <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="120" cy="120" r="100" stroke="#123B2F" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="6 6" />
              <path
                d="M120 40C85 65 60 105 65 160C105 165 160 145 185 105C170 65 150 45 120 40Z"
                fill="#E8DDC9"
                fillOpacity="0.3"
              />
            </svg>
          </div>
          <div className="botanical-shape shape-3">
            <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M80 10C50 30 25 65 30 110C65 115 120 100 135 65C125 35 105 20 80 10Z"
                fill="#123B2F"
                fillOpacity="0.04"
              />
            </svg>
          </div>
        </div>

        <div className="ayur-container ayur-hero-container">
          <div className="ayur-hero-grid">
            {/* Left Column: Editorial Value Proposition & Actions */}
            <div className="ayur-hero-text">
              <div className="ayur-hero-badge">
                <ShieldCheck size={14} className="ayur-hero-badge__icon" />
                <span>Clinical Decision Support • Grounded Clinical Knowledge Base</span>
              </div>

              <h1 id="hero-heading" className="ayur-hero-title">
                Personalized Ayurvedic Wellness,{' '}
                <span className="ayur-hero-title__accent">Informed by Clinical Evidence.</span>
              </h1>

              <p className="ayur-hero-description">
                Discover your baseline body constitution through structured clinical intake.
                Empowered by authentic classical retrieval, transparent factor attribution,
                and licensed physician oversight.
              </p>

              {/* Exact CTA requirements: Primary = Start Assessment, Secondary = Explore How It Works */}
              <div className="ayur-hero-cta-row">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/assessment-overview')}
                  rightIcon={<ArrowRight size={18} />}
                  className="ayur-hero-btn-primary"
                  id="hero-primary-cta"
                >
                  Start Your Assessment
                </Button>

                <button
                  type="button"
                  onClick={(e) => scrollToSection(e, 'how-it-works')}
                  className="ayur-hero-btn-secondary"
                  id="hero-secondary-cta"
                >
                  <ArrowDown size={16} className="ayur-btn-scroll-icon" />
                  <span>Explore How It Works</span>
                </button>
              </div>

              {/* Verified Trust Anchors */}
              <div className="ayur-hero-anchors">
                <div className="ayur-anchor-item">
                  <CheckCircle2 size={15} className="ayur-anchor-check" />
                  <span>Multi-domain constitutional intake (Body Profile, Digestion & Routine)</span>
                </div>
                <div className="ayur-anchor-item">
                  <CheckCircle2 size={15} className="ayur-anchor-check" />
                  <span>Zero-hallucination RAG with classical compendium citations</span>
                </div>
                <div className="ayur-anchor-item">
                  <CheckCircle2 size={15} className="ayur-anchor-check" />
                  <span>Attending physician oversight before active plan sign-off</span>
                </div>
              </div>
            </div>

            {/* Right Column: Refined AI Assessment Preview (Editorial Card) */}
            <div className="ayur-hero-preview-col">
              <div className="ayur-preview-card" role="region" aria-label="Constitutional Assessment Preview">
                {/* Card Top Banner */}
                <div className="ayur-preview-card__top">
                  <div className="ayur-preview-tag">
                    <span className="ayur-live-dot" aria-hidden="true" />
                    <span>Verified Protocol Preview</span>
                  </div>
                  <span className="ayur-physician-badge">
                    <Check size={12} className="ayur-check-icon" />
                    <span>Physician Sign-Off Ready</span>
                  </span>
                </div>

                {/* Preview Navigation Switcher */}
                <div className="ayur-preview-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={previewTab === 'profile'}
                    className={`ayur-preview-tab ${previewTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setPreviewTab('profile')}
                  >
                    Constitutional Ratio
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={previewTab === 'xai'}
                    className={`ayur-preview-tab ${previewTab === 'xai' ? 'active' : ''}`}
                    onClick={() => setPreviewTab('xai')}
                  >
                    Explainable Grounding
                  </button>
                </div>

                {previewTab === 'profile' ? (
                  <div className="ayur-preview-body">
                    {/* Primary Constitution Synthesis */}
                    <div className="ayur-preview-section">
                      <div className="ayur-preview-row">
                        <div>
                          <span className="ayur-preview-sublabel">Calculated Prakriti</span>
                          <h4 className="ayur-preview-highlight">Vata-Pitta (Movement & Metabolism)</h4>
                        </div>
                        <span className="ayur-balance-chip">Optimal Balance: 84%</span>
                      </div>

                      {/* Tridosha Distribution Ratio Bar */}
                      <div className="ayur-ratio-bar-wrap" aria-label="Constitutional distribution">
                        <div className="ayur-ratio-segment vata" style={{ width: '42%' }}>
                          <span>Movement 42%</span>
                        </div>
                        <div className="ayur-ratio-segment pitta" style={{ width: '36%' }}>
                          <span>Metabolism 36%</span>
                        </div>
                        <div className="ayur-ratio-segment kapha" style={{ width: '22%' }}>
                          <span>Structure 22%</span>
                        </div>
                      </div>
                      <div className="ayur-ratio-legend">
                        <span className="legend-item"><span className="dot vata" />Vata (Air & Ether)</span>
                        <span className="legend-item"><span className="dot pitta" />Pitta (Fire & Water)</span>
                        <span className="legend-item"><span className="dot kapha" />Kapha (Earth & Water)</span>
                      </div>
                    </div>

                    {/* Daily Nutrition Regimen Preview */}
                    <div className="ayur-preview-section">
                      <span className="ayur-preview-sublabel">Personalized Nutrition Directives</span>
                      <div className="ayur-diet-grid">
                        <div className="ayur-diet-box favor">
                          <span className="diet-tag favor-tag">✓ Favor</span>
                          <p>Warm cooked grains, stewed seasonal apples, cumin-ginger infusion, clarified butter (ghee).</p>
                        </div>
                        <div className="ayur-diet-box limit">
                          <span className="diet-tag limit-tag">✕ Limit</span>
                          <p>Chilled carbonated beverages, dry un-oiled salads, erratic late-evening dinners.</p>
                        </div>
                      </div>
                    </div>

                    {/* Grounded Citation */}
                    <div className="ayur-citation-pill">
                      <BookOpen size={13} className="citation-icon" />
                    </div>
                  </div>
                ) : (
                  <div className="ayur-preview-body">
                    {/* Explainability / XAI View */}
                    <div className="ayur-preview-section">
                      <span className="ayur-preview-sublabel">Top Contributing Intake Variables</span>
                      <div className="ayur-xai-factor-list">
                        <div className="ayur-xai-factor">
                          <div className="factor-header">
                            <span className="factor-name">Meal Regularity & Digestive Health</span>
                            <span className="factor-val text-vata">+38% attribution</span>
                          </div>
                          <div className="factor-progress">
                            <div className="factor-progress-fill" style={{ width: '76%', backgroundColor: 'var(--color-primary)' }} />
                          </div>
                        </div>

                        <div className="ayur-xai-factor">
                          <div className="factor-header">
                            <span className="factor-name">Sleep Architecture & Circadian Rhythm</span>
                            <span className="factor-val text-pitta">+26% attribution</span>
                          </div>
                          <div className="factor-progress">
                            <div className="factor-progress-fill" style={{ width: '52%', backgroundColor: '#D97706' }} />
                          </div>
                        </div>

                        <div className="ayur-xai-factor">
                          <div className="factor-header">
                            <span className="factor-name">Physical Morphology & Thermal Response</span>
                            <span className="factor-val text-kapha">+19% attribution</span>
                          </div>
                          <div className="factor-progress">
                            <div className="factor-progress-fill" style={{ width: '38%', backgroundColor: '#059669' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ayur-xai-source-box">
                      <div className="flex items-center gap-xs mb-2xs">
                        <Database size={13} className="text-primary" />
                        <span className="text-xs font-semibold text-primary">Canonical Index & Nutrition Dataset</span>
                      </div>
                      <p className="text-xs text-text-secondary m-0">
                        Cross-referenced against IFCT 2017 (Indian Food Composition Tables) for micronutrient adequacy.
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Note */}
                <div className="ayur-preview-footer">
                  <Info size={12} className="text-muted shrink-0" />
                  <span>Interactive preview represents real verified inference models in the clinical workspace.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION B: WHY AYURAG-XAI (Philosophy, Taxonomy & Foundations)
          ==================================================================== */}
      <section className="ayur-landing-section ayur-why-section reveal-on-scroll" id="why-ayurag" aria-labelledby="why-heading">
        <div className="ayur-container">
          <div className="ayur-landing-section-header">
            <span className="ayur-landing-section-tag">THE FOUNDATION</span>
            <h2 id="why-heading" className="ayur-landing-section-title">
              Where Classical Ayurvedic Wisdom Meets Transparent Machine Intelligence
            </h2>
            <p className="ayur-landing-section-subtitle">
              Ayurveda has characterized constitutional human individuality for over 3,000 years. AyuRAG-XAI
              operationalizes this clinical science into a verifiable decision-support system anchored in classical Sanskrit
              compendia and modern algorithmic transparency.
            </p>
          </div>

          {/* 4 Pillars of AyuRAG-XAI */}
          <div className="ayur-pillars-grid">
            <div className="ayur-pillar-card">
              <div className="pillar-icon-wrap">
                <BookOpen size={24} />
              </div>
              <span className="pillar-step-num">Pillar 01</span>
              <h3 className="pillar-title">Foundational Wellness Taxonomy</h3>
              <p className="pillar-desc">
                Rooted in authentic classical compendia (Charaka, Sushruta, and Vagbhata). Evaluates individual
                baseline constitution, current metabolic tendency, and digestive strength without
                simplistic reductionism.
              </p>
              <div className="pillar-footer">
                <span className="pillar-pill">Body Constitution & Digestive Health</span>
              </div>
            </div>

            <div className="ayur-pillar-card">
              <div className="pillar-icon-wrap">
                <Layers size={24} />
              </div>
              <span className="pillar-step-num">Pillar 02</span>
              <h3 className="pillar-title">Multi-Domain Clinical Intake</h3>
              <p className="pillar-desc">
                Replaces informal questionnaires with a standardized intake across 4 validated domains: physical
                morphology, digestive metabolism, chronobiological sleep patterns, and current symptomatic complaints.
              </p>
              <div className="pillar-footer">
                <span className="pillar-pill">Standardized Assessment</span>
              </div>
            </div>

            <div className="ayur-pillar-card">
              <div className="pillar-icon-wrap">
                <Database size={24} />
              </div>
              <span className="pillar-step-num">Pillar 03</span>
              <h3 className="pillar-title">Grounded Classical RAG</h3>
              <p className="pillar-desc">
                Recommendations are never generated blindly by black-box language models. Every dietary rule and
                herb-food synergy is retrieved directly from canonical texts and verified with IFCT 2017 nutritional indices.
              </p>
              <div className="pillar-footer">
                <span className="pillar-pill">Zero Hallucination Retrieval</span>
              </div>
            </div>

            <div className="ayur-pillar-card">
              <div className="pillar-icon-wrap">
                <Stethoscope size={24} />
              </div>
              <span className="pillar-step-num">Pillar 04</span>
              <h3 className="pillar-title">Explainability & Doctor Oversight</h3>
              <p className="pillar-desc">
                Transparent attribution scores reveal precisely which patient inputs triggered specific lifestyle
                recommendations. Attending physicians inspect, validate, and sign off before regimen activation.
              </p>
              <div className="pillar-footer">
                <span className="pillar-pill">Human-in-the-Loop Governance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION C: HOW IT WORKS (The 5-Step Clinical Sequence)
          ==================================================================== */}
      <section className="ayur-landing-section ayur-how-section reveal-on-scroll" id="how-it-works" aria-labelledby="how-heading">
        <div className="ayur-container">
          <div className="ayur-landing-section-header">
            <span className="ayur-landing-section-tag">THE SEQUENCE</span>
            <h2 id="how-heading" className="ayur-landing-section-title">
              How Your Evidence-Guided Wellness Plan is Built
            </h2>
            <p className="ayur-landing-section-subtitle">
              A transparent, rigorous journey from initial physiological intake to physician-verified daily nutrition and lifestyle protocols.
            </p>
          </div>

          <div className="ayur-sequence-container">
            {/* Step 1 */}
            <div className="ayur-sequence-card">
              <div className="sequence-badge-col">
                <span className="sequence-badge">01</span>
                <div className="sequence-connector-line" aria-hidden="true" />
              </div>
              <div className="sequence-content">
                <div className="sequence-header">
                  <h3 className="sequence-title">Complete Structured Intake</h3>
                  <span className="sequence-time-pill"><Clock size={12} /> 10 minutes</span>
                </div>
                <p className="sequence-body">
                  Respond to calibrated questions evaluating physical frame, metabolic speed (Agni), sleep architecture,
                  eating habits, and ambient climate adaptation.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="ayur-sequence-card">
              <div className="sequence-badge-col">
                <span className="sequence-badge">02</span>
                <div className="sequence-connector-line" aria-hidden="true" />
              </div>
              <div className="sequence-content">
                <div className="sequence-header">
                  <h3 className="sequence-title">Review Personalized Summary</h3>
                  <span className="sequence-time-pill"><Sparkles size={12} /> Instant Synthesis</span>
                </div>
                <p className="sequence-body">
                  Our inference model computes your primary and secondary constitutional balance (Vata, Pitta, Kapha)
                  and maps baseline metabolic tendencies.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="ayur-sequence-card">
              <div className="sequence-badge-col">
                <span className="sequence-badge">03</span>
                <div className="sequence-connector-line" aria-hidden="true" />
              </div>
              <div className="sequence-content">
                <div className="sequence-header">
                  <h3 className="sequence-title">Explore Relevant Evidence & Explanations</h3>
                  <span className="sequence-time-pill"><BookOpen size={12} /> Full Transparency</span>
                </div>
                <p className="sequence-body">
                  Inspect SHAP attribution graphs showing why each dietary suggestion was formulated, coupled with
                  classical Samhita citations and modern nutrient benchmarks.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="ayur-sequence-card">
              <div className="sequence-badge-col">
                <span className="sequence-badge">04</span>
                <div className="sequence-connector-line" aria-hidden="true" />
              </div>
              <div className="sequence-content">
                <div className="sequence-header">
                  <h3 className="sequence-title">Consult a Doctor Where Applicable</h3>
                  <span className="sequence-time-pill"><Stethoscope size={12} /> Clinical Portal</span>
                </div>
                <p className="sequence-body">
                  Your assessment dossier can be reviewed by licensed Ayurvedic physicians in the clinician workspace,
                  ensuring medical safety and contraindication checking.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="ayur-sequence-card">
              <div className="sequence-badge-col">
                <span className="sequence-badge">05</span>
              </div>
              <div className="sequence-content">
                <div className="sequence-header">
                  <h3 className="sequence-title">Follow a Clinician-Approved Plan</h3>
                  <span className="sequence-time-pill"><CheckCircle2 size={12} /> Active Regimen</span>
                </div>
                <p className="sequence-body">
                  Adopt a tailored daily routine featuring chronobiological meal timing, food compatibility
                  rules, and seasonal adjustments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          PHYSIOLOGICAL CONSTITUTION EXPLORER (Interactive Deep-Dive)
          ==================================================================== */}
      <section className="ayur-landing-section ayur-dosha-section reveal-on-scroll" id="body-factors" aria-labelledby="dosha-heading">
        <div className="ayur-container">
          <div className="ayur-landing-section-header">
            <span className="ayur-landing-section-tag">PHYSIOLOGY</span>
            <h2 id="dosha-heading" className="ayur-landing-section-title">
              The Three Functional Constitutional Energies
            </h2>
            <p className="ayur-landing-section-subtitle">
              Physiological profiling categorizes metabolic and physical functions into three primary constitutional energies.
              Understanding your unique proportion allows precision in diet and lifestyle.
            </p>
          </div>

          <div className="ayur-factors-tabs">
            {/* Tab Buttons */}
            <div className="ayur-factors-buttons" role="tablist" aria-label="Constitutional Energies">
              <button
                type="button"
                role="tab"
                aria-selected={activeConstitutionTab === 'movement'}
                className={`ayur-factor-btn ${activeConstitutionTab === 'movement' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('movement')}
              >
                <Wind size={16} />
                <span>Movement Pattern</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeConstitutionTab === 'metabolism'}
                className={`ayur-factor-btn ${activeConstitutionTab === 'metabolism' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('metabolism')}
              >
                <Flame size={16} />
                <span>Metabolism Pattern</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeConstitutionTab === 'structure'}
                className={`ayur-factor-btn ${activeConstitutionTab === 'structure' ? 'active' : ''}`}
                onClick={() => setActiveConstitutionTab('structure')}
              >
                <Mountain size={16} />
                <span>Structure Pattern</span>
              </button>
            </div>

            {/* Active Factor Display */}
            <div className="ayur-factor-panel" role="tabpanel" aria-label={activeFactor.name}>
              <div className="ayur-factor-panel__left">
                <div className="ayur-factor-icon-wrap" style={{ color: activeFactor.color }}>
                  <FactorIcon size={34} />
                </div>
                <div className="ayur-factor-sanskrit">{activeFactor.name}</div>
                <h3 className="ayur-factor-panel__title">{activeFactor.name}</h3>
                <span className="ayur-factor-elements">Elements: {activeFactor.element}</span>
                <p className="ayur-factor-principle">{activeFactor.principle}</p>
                <div className="ayur-factor-traits">
                  <strong>Clinical Profile:</strong> {activeFactor.traits}
                </div>
              </div>

              <div className="ayur-factor-panel__right">
                <div className="ayur-guidance-box favor-box">
                  <div className="guidance-header">
                    <CheckCircle2 size={15} className="text-success" />
                    <h4>Foods to Favor </h4>
                  </div>
                  <p>{activeFactor.pathya}</p>
                </div>

                <div className="ayur-guidance-box limit-box">
                  <div className="guidance-header">
                    <AlertCircle size={15} className="text-error" />
                    <h4>Foods to Moderate </h4>
                  </div>
                  <p>{activeFactor.apathya}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION D: KEY CAPABILITIES (Uniform Aligned Cards Grid)
          ==================================================================== */}
      <section className="ayur-landing-section ayur-capabilities-section reveal-on-scroll" id="capabilities" aria-labelledby="capabilities-heading">
        <div className="ayur-container">
          <div className="ayur-landing-section-header">
            <span className="ayur-landing-section-tag">CAPABILITIES</span>
            <h2 id="capabilities-heading" className="ayur-landing-section-title">
              Engineered for Clinical Credibility & Daily Practice
            </h2>
            <p className="ayur-landing-section-subtitle">
              Every feature of AyuRAG-XAI is designed with mathematical rigor, classical fidelity, and human oversight.
            </p>
          </div>

          <div className="ayur-capabilities-grid">
            {/* Card 1: Personalized Assessment */}
            <div className="ayur-cap-card">
              <div className="cap-card-top">
                <div className="cap-icon-wrap">
                  <UserCheck size={22} />
                </div>
                <span className="cap-status-pill active">Core Assessment</span>
              </div>
              <h3 className="cap-title">Personalized Assessment</h3>
              <p className="cap-description">
                Evaluates physical morphology, digestive health, circadian routines, and symptomatic concerns to
                compute accurate constitutional distributions.
              </p>
              <div className="cap-footer">
                <span className="cap-meta">4 Clinical Intake Domains</span>
              </div>
            </div>

            {/* Card 2: Explainable AI */}
            <div className="ayur-cap-card">
              <div className="cap-card-top">
                <div className="cap-icon-wrap">
                  <Sparkles size={22} />
                </div>
                <span className="cap-status-pill active">XAI Attribution</span>
              </div>
              <h3 className="cap-title">Explainable AI (XAI)</h3>
              <p className="cap-description">
                Replaces black-box uncertainty with transparent feature attributions. Dissects which specific answers drove
                the model’s constitutional scoring and warnings.
              </p>
              <div className="cap-footer">
                <span className="cap-meta">SHAP / LIME Factor Contributions</span>
              </div>
            </div>

            {/* Card 3: Evidence Retrieval through RAG */}
            <div className="ayur-cap-card">
              <div className="cap-card-top">
                <div className="cap-icon-wrap">
                  <Database size={22} />
                </div>
                <span className="cap-status-pill active">Classical RAG</span>
              </div>
              <h3 className="cap-title">Classical Evidence Retrieval</h3>
              <p className="cap-description">
                Directly extracts textual citations from ancient Ayurvedic compendia (Charaka, Sushruta Samhitas) combined
                with verified IFCT 2017 nutritional datasets.
              </p>
              <div className="cap-footer">
                <span className="cap-meta">Grounded Shloka References</span>
              </div>
            </div>

            {/* Card 4: Doctor-Reviewed Diet Plans */}
            <div className="ayur-cap-card">
              <div className="cap-card-top">
                <div className="cap-icon-wrap">
                  <Stethoscope size={22} />
                </div>
                <span className="cap-status-pill clinical">Doctor Portal</span>
              </div>
              <h3 className="cap-title">Doctor-Reviewed Diet Plans</h3>
              <p className="cap-description">
                Attending physicians access a dedicated workspace to audit AI reasoning, adjust recipes, account for
                comorbidities, and approve patient regimens.
              </p>
              <div className="cap-footer">
                <span className="cap-meta">Physician Sign-Off Registry</span>
              </div>
            </div>

            {/* Card 5: Patient Progress Monitoring */}
            <div className="ayur-cap-card">
              <div className="cap-card-top">
                <div className="cap-icon-wrap">
                  <LineChart size={22} />
                </div>
                <span className="cap-status-pill active">Monitoring</span>
              </div>
              <h3 className="cap-title">Patient Progress Monitoring</h3>
              <p className="cap-description">
                Structured longitudinal re-assessments allow patients and physicians to track constitutional balance,
                symptomatic resolution, and digestive stability over time.
              </p>
              <div className="cap-footer">
                <span className="cap-meta">Evolution & Adherence Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION E: EVIDENCE & TRANSPARENCY (Epistemic Matrix)
          ==================================================================== */}
      <section className="ayur-landing-section ayur-transparency-section reveal-on-scroll" id="evidence-transparency" aria-labelledby="transparency-heading">
        <div className="ayur-container">
          <div className="ayur-landing-section-header">
            <span className="ayur-landing-section-tag">RIGOR & PROVENANCE</span>
            <h2 id="transparency-heading" className="ayur-landing-section-title">
              Clear Boundaries Between Tradition, Science & Medical Judgment
            </h2>
            <p className="ayur-landing-section-subtitle">
              AyuRAG-XAI enforces strict epistemic separation. We clearly distinguish between classical Ayurvedic texts,
              nutritional research, machine learning attribution, and certified clinical expertise.
            </p>
          </div>

          <div className="ayur-epistemic-layout">
            {/* Left: Tab Selectors */}
            <div className="ayur-epistemic-nav" role="tablist" aria-label="Evidence Layers">
              <button
                type="button"
                role="tab"
                aria-selected={activeEpistemicTab === 'samhita'}
                className={`epistemic-tab-btn ${activeEpistemicTab === 'samhita' ? 'active' : ''}`}
                onClick={() => setActiveEpistemicTab('samhita')}
              >
                <div className="tab-indicator" />
                <BookOpen size={18} />
                <div className="text-left">
                  <span className="epistemic-btn-title">Traditional Knowledge</span>
                  <span className="epistemic-btn-sub">Classical Sanskrit Treatises</span>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeEpistemicTab === 'nutrition'}
                className={`epistemic-tab-btn ${activeEpistemicTab === 'nutrition' ? 'active' : ''}`}
                onClick={() => setActiveEpistemicTab('nutrition')}
              >
                <div className="tab-indicator" />
                <Utensils size={18} />
                <div className="text-left">
                  <span className="epistemic-btn-title">Nutritional Research</span>
                  <span className="epistemic-btn-sub">ICMR-NIN IFCT 2017 Dataset</span>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeEpistemicTab === 'xai'}
                className={`epistemic-tab-btn ${activeEpistemicTab === 'xai' ? 'active' : ''}`}
                onClick={() => setActiveEpistemicTab('xai')}
              >
                <div className="tab-indicator" />
                <Sparkles size={18} />
                <div className="text-left">
                  <span className="epistemic-btn-title">Generated Explanations</span>
                  <span className="epistemic-btn-sub">SHAP Mathematical Attribution</span>
                </div>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeEpistemicTab === 'physician'}
                className={`epistemic-tab-btn ${activeEpistemicTab === 'physician' ? 'active' : ''}`}
                onClick={() => setActiveEpistemicTab('physician')}
              >
                <div className="tab-indicator" />
                <Stethoscope size={18} />
                <div className="text-left">
                  <span className="epistemic-btn-title">Clinician Judgment</span>
                  <span className="epistemic-btn-sub">Independent Physician Review</span>
                </div>
              </button>
            </div>

            {/* Right: Detailed Epistemic Card */}
            <div className="ayur-epistemic-display" role="tabpanel" aria-label={activeEpistemic.title}>
              <div className="epistemic-display-header">
                <div className="flex items-center gap-sm">
                  <div className="epistemic-icon-badge" style={{ backgroundColor: activeEpistemic.badgeColor }}>
                    <EpistemicIcon size={20} color="#FFFFFF" />
                  </div>
                  <div>
                    <span className="epistemic-tag">{activeEpistemic.tag}</span>
                    <h3 className="epistemic-display-title">{activeEpistemic.title}</h3>
                  </div>
                </div>
              </div>

              <p className="epistemic-display-desc">{activeEpistemic.description}</p>

              <div className="epistemic-detail-block">
                <span className="epistemic-detail-label">Verified Grounding Sources:</span>
                <ul className="epistemic-sources-list">
                  {activeEpistemic.sources.map((src, idx) => (
                    <li key={idx} className="epistemic-source-item">
                      <CheckCircle2 size={14} className="text-success shrink-0" />
                      <span>{src}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="epistemic-attribution-box">
                <div className="flex items-center gap-xs mb-2xs">
                  <Info size={13} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">Inference Verification Method:</span>
                </div>
                <p className="text-xs text-text-secondary m-0">{activeEpistemic.attributionMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION F: TRUST & SAFETY (Clinical Boundaries & Disclaimers)
          ==================================================================== */}
      <section className="ayur-landing-section ayur-trust-section reveal-on-scroll" id="trust-safety" aria-labelledby="trust-heading">
        <div className="ayur-container">
          <div className="ayur-trust-card">
            <div className="trust-card-inner">
              <div className="trust-header-badge">
                <ShieldCheck size={16} />
                <span>CLINICAL GOVERNANCE & PATIENT SAFETY</span>
              </div>

              <h2 id="trust-heading" className="trust-title">
                Committed to Safety, Privacy & Explicit Clinical Boundaries
              </h2>

              <p className="trust-lead">
                AyuRAG-XAI is developed as a clinical decision-support and wellness assessment instrument.
                It assists patients in understanding their constitutional lifestyle needs while equipping physicians
                with evidence-grounded insights.
              </p>

              <div className="trust-columns">
                <div className="trust-col">
                  <div className="trust-col-icon">
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="trust-col-title">Not an Emergency Diagnostic Substitute</h3>
                  <p className="trust-col-text">
                    AyuRAG-XAI does not diagnose acute pathologies or prescribe emergency medical therapies.
                    Patients with serious symptoms, cardiac history, or active pharmaceutical prescriptions
                    must seek in-person medical care.
                  </p>
                </div>

                <div className="trust-col">
                  <div className="trust-col-icon">
                    <Stethoscope size={20} />
                  </div>
                  <h3 className="trust-col-title">Human-in-the-Loop Protocol</h3>
                  <p className="trust-col-text">
                    Recommendations generated by the system are structured for clinical review. Attending physicians
                    validate intake questionnaires, screen for contraindications, and confirm plan safety before active use.
                  </p>
                </div>

                <div className="trust-col">
                  <div className="trust-col-icon">
                    <Lock size={20} />
                  </div>
                  <h3 className="trust-col-title">Confidentiality & Role Segregation</h3>
                  <p className="trust-col-text">
                    Patient assessment data is protected with strict role-based authorization. Only authorized clinicians
                    assigned to review your dossier can inspect private health context notes and clinical history.
                  </p>
                </div>
              </div>

              <div className="trust-doctor-link-wrap">
                <Link to="/doctor-login" className="trust-doctor-link">
                  <span>Are you a licensed Ayurvedic physician? Access the Doctor Clinical Workspace</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION G: FINAL CTA (Single Clear Purposeful Action)
          ==================================================================== */}
      <section className="ayur-final-cta-section reveal-on-scroll" aria-labelledby="cta-heading">
        <div className="ayur-container">
          <div className="ayur-final-cta-card">
            <div className="cta-botanical-accent" aria-hidden="true" />
            <div className="cta-content">
              <span className="cta-badge">GET STARTED TODAY</span>
              <h2 id="cta-heading" className="cta-title">
                Ready to Understand Your Constitutional Blueprint?
              </h2>
              <p className="cta-subtitle">
                Complete the evidence-grounded constitutional assessment in 10 minutes.
                Receive tailored dietary guidelines, transparent attribution metrics, and physician review eligibility.
              </p>

              <div className="cta-action-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/assessment-overview')}
                  rightIcon={<ArrowRight size={18} />}
                  className="cta-btn-main"
                  id="final-primary-cta"
                >
                  Start Your Assessment
                </Button>
              </div>

              <div className="cta-subnotes">
                <span>Free multi-domain intake</span>
                <span className="dot">•</span>
                <span>Zero marketing registration required</span>
                <span className="dot">•</span>
                <span>Grounded classical references</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER (Organized Navigation, Portals & Disclaimer)
          ==================================================================== */}
      <footer className="ayur-landing-footer" role="contentinfo">
        <div className="ayur-container">
          <div className="ayur-footer-grid">
            {/* Col 1: Brand & Purpose */}
            <div className="ayur-footer-col brand-col">
              <div className="footer-brand">
                <div className="footer-brand-icon">
                  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="28" height="28" rx="8" fill="#123B2F" />
                    <path
                      d="M14 5C10 7.5 7.5 12 7.5 17C7.5 20.5 10.5 23 14 23C17.5 23 20.5 20.5 20.5 17C20.5 12 18 7.5 14 5Z"
                      fill="#A8BDA7"
                      fillOpacity="0.4"
                    />
                    <path d="M14 7V21" stroke="#C5A45D" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="footer-brand-name">
                  AyuRAG<span className="footer-xai">XAI</span>
                </span>
              </div>
              <p className="footer-mission">
                Explainable Retrieval-Augmented Personalized Ayurvedic Clinical Decision Support System. Grounded
                in authentic classical Sanskrit compendia, empirical nutrition science, and human physician oversight.
              </p>
              <div className="footer-palette-accent" aria-hidden="true">
                <span className="color-chip forest" title="Forest Green #123B2F" />
                <span className="color-chip sage" title="Sage #A8BDA7" />
                <span className="color-chip sand" title="Sand #E8DDC9" />
                <span className="color-chip ivory" title="Warm Ivory #F8F6F0" />
                <span className="color-chip gold" title="Muted Gold #C5A45D" />
              </div>
            </div>

            {/* Col 2: Patient Assessment */}
            <div className="ayur-footer-col">
              <h4 className="footer-heading">Assessment Flow</h4>
              <ul className="footer-link-list">
                <li>
                  <Link to="/assessment-overview">Start Assessment</Link>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#body-factors" onClick={(e) => scrollToSection(e, 'body-factors')}>
                    Constitutional Energies
                  </a>
                </li>
                <li>
                  <Link to="/signin">Patient Sign In</Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Clinical Workspace */}
            <div className="ayur-footer-col">
              <h4 className="footer-heading">Clinical Workspace</h4>
              <ul className="footer-link-list">
                <li>
                  <Link to="/doctor-login">Doctor Portal Access</Link>
                </li>
                <li>
                  <Link to="/doctor-register">Physician Registration</Link>
                </li>
                <li>
                  <a href="#capabilities" onClick={(e) => scrollToSection(e, 'capabilities')}>
                    Clinical Decision Support
                  </a>
                </li>
                <li>
                  <a href="#trust-safety" onClick={(e) => scrollToSection(e, 'trust-safety')}>
                    Governance & Protocol
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Grounding & Methodology */}
            <div className="ayur-footer-col">
              <h4 className="footer-heading">Evidence Grounding</h4>
              <ul className="footer-link-list">
                <li>
                  <a href="#evidence-transparency" onClick={(e) => scrollToSection(e, 'evidence-transparency')}>
                    Charaka & Sushruta Treatises
                  </a>
                </li>
                <li>
                  <a href="#evidence-transparency" onClick={(e) => scrollToSection(e, 'evidence-transparency')}>
                    IFCT 2017 Nutritional Index
                  </a>
                </li>
                <li>
                  <a href="#evidence-transparency" onClick={(e) => scrollToSection(e, 'evidence-transparency')}>
                    SHAP Factor Attribution
                  </a>
                </li>
                <li>
                  <a href="#trust-safety" onClick={(e) => scrollToSection(e, 'trust-safety')}>
                    Safety & Medical Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal & Medical Notice */}
          <div className="ayur-footer-bottom">
            <div className="footer-legal-copy">
              © {new Date().getFullYear()} AyuRAG-XAI Clinical Wellness Platform. All rights reserved.
            </div>
            <div className="footer-medical-notice">
              <strong>Medical Disclaimer:</strong> AyuRAG-XAI provides lifestyle and dietary wellness decision support
              based on Ayurvedic constitutional principles. It does not replace independent professional medical diagnosis,
              in-person physician consultation, or emergency healthcare intervention.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
