import React, { useState } from 'react';
import './DesignSystemPage.css';
import {
  Button,
  Toggle,
  Input,
  Select,
  Textarea,
  Checkbox,
  Radio,
  RadioGroup,
  SegmentedControl,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Stepper,
  ProgressBar,
  Spinner,
  Skeleton,
  Alert
} from '../components/ui';
import {
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Send,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  Activity,
  User,
  HeartPulse,
  Brain,
  Layers,
  Palette,
  Type,
  MousePointer,
  FormInput,
  Sliders,
  CreditCard,
  ListOrdered,
  Loader2,
  BellRing
} from 'lucide-react';

/**
 * Design Tokens Swatches Definition
 */
const COLOR_TOKENS = [
  {
    category: 'Primary Brand (Deep Forest Green)',
    colors: [
      { name: '--color-primary', hex: '#16382C', role: 'Main Brand, Headers, Primary Buttons' },
      { name: '--color-primary-hover', hex: '#0F271F', role: 'Primary Hover & Active states' },
      { name: '--color-primary-light', hex: '#EBF2EE', role: 'Primary Tint, Badges, Selected Backgrounds' },
      { name: '--color-primary-subtle', hex: '#F2F7F4', role: 'Subtle Backgrounds & Rows' }
    ]
  },
  {
    category: 'Secondary Brand (Sage Green)',
    colors: [
      { name: '--color-secondary', hex: '#5B8266', role: 'Secondary Accents, Classical Protocols' },
      { name: '--color-secondary-hover', hex: '#496B54', role: 'Secondary Active / Hover' },
      { name: '--color-secondary-light', hex: '#F0F5F2', role: 'Secondary Badges & Containers' }
    ]
  },
  {
    category: 'Ayurvedic Accent (Muted Gold)',
    colors: [
      { name: '--color-accent', hex: '#C5A059', role: 'AI & Prakriti Highlights, Badges, Stepper' },
      { name: '--color-accent-hover', hex: '#B28D44', role: 'Accent Button Hover' },
      { name: '--color-accent-light', hex: '#FAF4E8', role: 'Gold Card Backgrounds, Soft Glows' }
    ]
  },
  {
    category: 'Neutrals & Surfaces (Warm Ivory & Cream)',
    colors: [
      { name: '--color-bg', hex: '#FBF9F5', role: 'Main Canvas Background (Warm Ivory)' },
      { name: '--color-bg-alt', hex: '#F4F0E6', role: 'Secondary Surface / Disabled inputs' },
      { name: '--color-surface', hex: '#FFFFFF', role: 'Cards, Modals, White Surfaces' },
      { name: '--color-surface-muted', hex: '#F6F4ED', role: 'Table Headers, Code Blocks' },
      { name: '--color-border', hex: '#E3DDD3', role: 'Default Card & Input Borders' }
    ]
  },
  {
    category: 'Typography & Text Colors',
    colors: [
      { name: '--color-text-primary', hex: '#14201A', role: 'Deep Charcoal / High Contrast Headings' },
      { name: '--color-text-secondary', hex: '#3E4F47', role: 'Body Text & Form Labels' },
      { name: '--color-text-muted', hex: '#71807A', role: 'Subtitles, Captions, Help Text' },
      { name: '--color-text-placeholder', hex: '#9EABA5', role: 'Form Field Placeholders' }
    ]
  },
  {
    category: 'Clinical & Status Feedback',
    colors: [
      { name: '--color-success', hex: '#1D7A4F', role: 'Success Alerts, Completed Steps' },
      { name: '--color-warning', hex: '#C07D1E', role: 'Dosha Imbalance Warnings, Cautions' },
      { name: '--color-error', hex: '#B93838', role: 'Validation Errors, Critical Alerts' },
      { name: '--color-info', hex: '#246EB9', role: 'Clinical Reference Notes & RAG Knowledge' }
    ]
  }
];

export const DesignSystemPage = ({ onTriggerToast }) => {
  // Live State for Interactive Demos
  const [btnLoading, setBtnLoading] = useState(false);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(true);
  
  const [inputText, setInputText] = useState('Pitta-Vata imbalance assessment');
  const [inputSearch, setInputSearch] = useState('Ashwagandha Rasayana');
  const [selectDosha, setSelectDosha] = useState('pitta');
  const [textareaNotes, setTextareaNotes] = useState('Patient reports mild digestive sluggishness (Manda Agni) after evening meals and disturbed sleep patterns.');
  
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [chk3, setChk3] = useState(false);
  const [radioDosha, setRadioDosha] = useState('vata-pitta');
  const [segmentedDosha, setSegmentedDosha] = useState('pitta');
  const [segmentedSeverity, setSegmentedSeverity] = useState('moderate');
  
  const [selectedCard, setSelectedCard] = useState('card-2');
  const [currentStepperStep, setCurrentStepperStep] = useState(2);
  const [progressVal, setProgressVal] = useState(65);

  const simulateLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      onTriggerToast?.({
        type: 'success',
        title: 'Action Completed',
        message: 'Simulated asynchronous AI operation completed successfully.'
      });
    }, 1800);
  };

  const copyToken = (name) => {
    navigator.clipboard?.writeText(name);
    onTriggerToast?.({
      type: 'info',
      title: 'Token Copied',
      message: `Copied ${name} to clipboard.`
    });
  };

  const stepperSteps = [
    { number: '01', title: 'Personal Info', subtitle: 'Vitals & Demographics' },
    { number: '02', title: 'Prakriti', subtitle: 'Constitution (V-P-K)' },
    { number: '03', title: 'Lifestyle', subtitle: 'Dinacharya habits' },
    { number: '04', title: 'Dietary', subtitle: 'Ahara analysis' },
    { number: '05', title: 'Symptoms', subtitle: 'Vikriti markers' },
    { number: '06', title: 'Review', subtitle: 'Clinical verification' },
    { number: '07', title: 'Dashboard', subtitle: 'RAG + XAI Decision' }
  ];

  return (
    <div className="ds-page">
      {/* Hero Banner */}
      <section className="ds-hero">
        <div className="ds-hero__content">
          <div className="flex items-center gap-xs">
            <Badge color="accent" variant="subtle" size="md" icon={<Sparkles size={13} />}>
              Phase 1 Engineering Foundation
            </Badge>
            <Badge color="primary" variant="subtle" size="md">
              AyuRAG-XAI Design System
            </Badge>
          </div>

          <h1 className="ds-hero__title">
            Ayurvedic Health-Tech <span className="ds-hero__title-accent">Design System</span>
          </h1>

          <p className="ds-hero__subtitle">
            A production-ready foundation harmonizing classical Ayurvedic aesthetics with modern healthcare SaaS and explainable AI transparency.
          </p>

          <div className="ds-hero__meta">
            <div className="ds-meta-item">
              <span className="ds-meta-label">Design Language</span>
              <span className="ds-meta-value">Forest Green • Sage • Warm Ivory • Gold</span>
            </div>
            <div className="ds-meta-item">
              <span className="ds-meta-label">Typography</span>
              <span className="ds-meta-value">Plus Jakarta Sans & Cormorant</span>
            </div>
            <div className="ds-meta-item">
              <span className="ds-meta-label">Component System</span>
              <span className="ds-meta-value">16 Reusable UI Modules</span>
            </div>
            <div className="ds-meta-item">
              <span className="ds-meta-label">Status</span>
              <span className="ds-meta-value ds-meta-value--ready">Phase 1 Complete</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Quick Jump */}
      <div className="ds-quick-nav">
        <a href="#colors" className="ds-quick-nav__link">
          <Palette size={14} /> Colors
        </a>
        <a href="#typography" className="ds-quick-nav__link">
          <Type size={14} /> Typography
        </a>
        <a href="#buttons" className="ds-quick-nav__link">
          <MousePointer size={14} /> Buttons
        </a>
        <a href="#forms" className="ds-quick-nav__link">
          <FormInput size={14} /> Form Controls
        </a>
        <a href="#toggles" className="ds-quick-nav__link">
          <Sliders size={14} /> Toggles & Choices
        </a>
        <a href="#cards" className="ds-quick-nav__link">
          <CreditCard size={14} /> Cards
        </a>
        <a href="#progress" className="ds-quick-nav__link">
          <ListOrdered size={14} /> Progress & Steppers
        </a>
        <a href="#loading" className="ds-quick-nav__link">
          <Loader2 size={14} /> Loading & Skeletons
        </a>
        <a href="#feedback" className="ds-quick-nav__link">
          <BellRing size={14} /> Alerts & Feedback
        </a>
      </div>

      {/* ====================================================================
          1. COLOR TOKENS
          ==================================================================== */}
      <section id="colors" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">01</span>
            <h2 className="ds-section__title">Color Palette & Design Tokens</h2>
          </div>
          <p className="ds-section__desc">
            Tailored Ayurvedic palette avoiding plain red/green/blue. Click any swatch to copy the token variable.
          </p>
        </div>

        <div className="ds-color-groups">
          {COLOR_TOKENS.map((group, gIdx) => (
            <div key={gIdx} className="ds-color-group">
              <h3 className="ds-color-group__title">{group.category}</h3>
              <div className="ds-swatches-grid">
                {group.colors.map((c, cIdx) => (
                  <div
                    key={cIdx}
                    className="ds-swatch"
                    onClick={() => copyToken(`var(${c.name})`)}
                    title="Click to copy CSS token"
                  >
                    <div
                      className="ds-swatch__preview"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="ds-swatch__hex">{c.hex}</span>
                    </div>
                    <div className="ds-swatch__info">
                      <span className="ds-swatch__token">{c.name}</span>
                      <span className="ds-swatch__role">{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          2. TYPOGRAPHY
          ==================================================================== */}
      <section id="typography" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">02</span>
            <h2 className="ds-section__title">Typography Hierarchy</h2>
          </div>
          <p className="ds-section__desc">
            Clean, comfortable line heights, readable body text, and consistent heading weights.
          </p>
        </div>

        <Card className="ds-type-card">
          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Display (Sans)</span>
              <span className="ds-type-spec">36px / Bold / -0.03em</span>
            </div>
            <div className="text-display">Explainable Ayurvedic Decision Intelligence</div>
          </div>

          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Display (Serif Accent)</span>
              <span className="ds-type-spec">42px / Cormorant / 600</span>
            </div>
            <div className="text-display-serif">Prakriti Analysis & Retrieval-Augmented Generation</div>
          </div>

          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Heading 1 (H1)</span>
              <span className="ds-type-spec">30px / Bold / -0.025em</span>
            </div>
            <div className="text-h1">Personalized Clinical Assessment Protocol</div>
          </div>

          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Heading 2 (H2)</span>
              <span className="ds-type-spec">24px / Bold / -0.02em</span>
            </div>
            <div className="text-h2">Tridosha Balance & Agni Evaluation</div>
          </div>

          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Heading 3 (H3)</span>
              <span className="ds-type-spec">20px / Semibold / -0.015em</span>
            </div>
            <div className="text-h3">Local SHAP & LIME Feature Importance Engine</div>
          </div>

          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Body Large</span>
              <span className="ds-type-spec">17px / Regular / 1.65</span>
            </div>
            <div className="text-body-lg">
              Ayurveda emphasizes individual constitution (Prakriti) and current metabolic state (Agni) to guide bespoke therapeutic interventions and lifestyle regimens.
            </div>
          </div>

          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Body Regular</span>
              <span className="ds-type-spec">15px / Regular / 1.5</span>
            </div>
            <div className="text-body">
              The retrieval pipeline accesses canonical Ayurvedic samhitās (Charaka, Sushruta, Ashtanga Hridaya) to ground all clinical recommendations with verified traditional sources.
            </div>
          </div>

          <div className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">Label & Caption</span>
              <span className="ds-type-spec">13px / Uppercase & 12px / Muted</span>
            </div>
            <div className="flex flex-col gap-xs">
              <span className="text-label">Dosha Profile Metric • Vata Imbalance</span>
              <span className="text-caption">Model confidence score calibrated via cross-validation against CCRAS gold standards.</span>
            </div>
          </div>
        </Card>
      </section>

      {/* ====================================================================
          3. BUTTON SYSTEM
          ==================================================================== */}
      <section id="buttons" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">03</span>
            <h2 className="ds-section__title">Button System & Action States</h2>
          </div>
          <p className="ds-section__desc">
            Variants: Primary, Secondary, Outline, Ghost, Accent (Gold), Danger, and Icon buttons across all sizes and states.
          </p>
        </div>

        <div className="ds-grid ds-grid--2">
          {/* Button Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Visual styles tailored for clear clinical hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ds-btn-matrix">
                <div className="ds-btn-row">
                  <span className="ds-row-label">Primary</span>
                  <Button variant="primary" leftIcon={<Sparkles size={16} />}>
                    Start Assessment
                  </Button>
                  <Button variant="primary" rightIcon={<Send size={16} />}>
                    Analyze
                  </Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Secondary</span>
                  <Button variant="secondary">Save & Continue</Button>
                  <Button variant="secondary" leftIcon={<Eye size={16} />}>
                    View Explanation
                  </Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Accent Gold</span>
                  <Button variant="accent" leftIcon={<Sparkles size={16} />}>
                    AI Recommendations
                  </Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Outline</span>
                  <Button variant="outline">Back to Step</Button>
                  <Button variant="outline" leftIcon={<Download size={16} />}>
                    Export Report
                  </Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Ghost</span>
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="ghost" leftIcon={<RefreshCw size={16} />}>
                    Reset Form
                  </Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Danger</span>
                  <Button variant="danger" leftIcon={<Trash2 size={16} />}>
                    Delete Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sizes, States & Interactive Loading */}
          <Card>
            <CardHeader>
              <CardTitle>Sizes, States & Micro-Interactions</CardTitle>
              <CardDescription>Smooth focus rings, disabled states, and animated loading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ds-btn-matrix">
                <div className="ds-btn-row">
                  <span className="ds-row-label">Sizes</span>
                  <Button variant="primary" size="sm">Small (34px)</Button>
                  <Button variant="primary" size="md">Medium (42px)</Button>
                  <Button variant="primary" size="lg">Large (50px)</Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Disabled</span>
                  <Button variant="primary" disabled>Primary Disabled</Button>
                  <Button variant="outline" disabled>Outline Disabled</Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Loading Demo</span>
                  <Button
                    variant="primary"
                    loading={btnLoading}
                    onClick={simulateLoading}
                    leftIcon={<RefreshCw size={16} />}
                  >
                    {btnLoading ? 'Analyzing...' : 'Click to Trigger Loading'}
                  </Button>
                  <Button variant="secondary" loading={true}>Processing</Button>
                </div>

                <div className="ds-btn-row">
                  <span className="ds-row-label">Icon Buttons</span>
                  <Button variant="icon" size="sm" ariaLabel="Refresh">
                    <RefreshCw size={15} />
                  </Button>
                  <Button variant="icon" size="md" ariaLabel="Search">
                    <Search size={18} />
                  </Button>
                  <Button variant="icon" size="lg" ariaLabel="Download">
                    <Download size={20} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ====================================================================
          4. FORM CONTROL SYSTEM
          ==================================================================== */}
      <section id="forms" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">04</span>
            <h2 className="ds-section__title">Form Control System</h2>
          </div>
          <p className="ds-section__desc">
            Accessible inputs with labels, helper text, inline validation, search clear triggers, and custom dropdowns.
          </p>
        </div>

        <div className="ds-grid ds-grid--2">
          <Card>
            <CardHeader>
              <CardTitle>Text, Number & Search Inputs</CardTitle>
              <CardDescription>Supports default, filled, error, and clearable states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-md">
                <Input
                  label="Chief Clinical Concern"
                  placeholder="e.g. Chronic digestive sluggishness"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  helperText="Enter primary symptom or clinical objective"
                  required
                />

                <Input
                  isSearch
                  label="Ayurvedic Herb & Knowledge Search"
                  placeholder="Search herbs, classical formulations, samhitā..."
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  onClear={() => setInputSearch('')}
                  helperText="Search indexed classical texts (RAG corpus)"
                />

                <Input
                  label="Patient Age"
                  type="number"
                  placeholder="e.g. 34"
                  defaultValue="34"
                  helperText="Demographic baseline for Agni scoring"
                />

                <Input
                  label="Validation Error State Example"
                  defaultValue="Invalid Dosha metric"
                  errorMessage="Dosha score must sum to 100% across Vata, Pitta, and Kapha."
                  error
                />

                <Input
                  label="Disabled Input Field"
                  defaultValue="CCRAS-ID-2026-9812 (System Generated)"
                  disabled
                  helperText="Read-only clinical session identifier"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select, Textarea & Multi-line</CardTitle>
              <CardDescription>Custom dropdowns and character-counted multiline fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-md">
                <Select
                  label="Dominant Prakriti Category"
                  value={selectDosha}
                  onChange={(e) => setSelectDosha(e.target.value)}
                  options={[
                    { value: 'vata', label: 'Vata Dominant (Air + Ether)' },
                    { value: 'pitta', label: 'Pitta Dominant (Fire + Water)' },
                    { value: 'kapha', label: 'Kapha Dominant (Water + Earth)' },
                    { value: 'vata-pitta', label: 'Vata-Pitta Dual Constitution' },
                    { value: 'pitta-kapha', label: 'Pitta-Kapha Dual Constitution' },
                    { value: 'sama', label: 'Sama Prakriti (Tridoshic Balanced)' }
                  ]}
                  helperText="Standardized Prakriti diagnostic category"
                  required
                />

                <Select
                  label="Digestive Capacity (Agni State)"
                  placeholder="Select Agni state..."
                  options={[
                    { value: 'sama', label: 'Sama Agni (Balanced Metabolism)' },
                    { value: 'vishama', label: 'Vishama Agni (Irregular / Vata)' },
                    { value: 'tikshna', label: 'Tikshna Agni (Hyperactive / Pitta)' },
                    { value: 'manda', label: 'Manda Agni (Sluggish / Kapha)' }
                  ]}
                  helperText="Crucial for dietary recommendation engine"
                />

                <Textarea
                  label="Clinical Observations & Notes"
                  placeholder="Record pulse findings (Nadi), tongue signs (Jihva), or sleep routine..."
                  value={textareaNotes}
                  onChange={(e) => setTextareaNotes(e.target.value)}
                  rows={4}
                  maxLength={300}
                  showCount
                  helperText="Freeform doctor observation notes for semantic RAG retrieval"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ====================================================================
          5. TOGGLES & CHOICES
          ==================================================================== */}
      <section id="toggles" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">05</span>
            <h2 className="ds-section__title">Toggles, Radios & Segmented Controls</h2>
          </div>
          <p className="ds-section__desc">
            Smooth, accessible switches and radio groups with keyboard interaction support (Space/Enter).
          </p>
        </div>

        <div className="ds-grid ds-grid--3">
          {/* Toggles */}
          <Card>
            <CardHeader>
              <CardTitle>Accessible Toggles</CardTitle>
              <CardDescription>Role="switch", custom SVG thumb icons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-md">
                <Toggle
                  label="SHAP Feature Explanations"
                  description="Display global & local feature impact bars"
                  checked={toggle1}
                  onChange={setToggle1}
                />
                <Toggle
                  label="LIME Perturbation Analysis"
                  description="Highlight localized prediction confidence"
                  checked={toggle2}
                  onChange={setToggle2}
                />
                <Toggle
                  label="Classical Citation Links"
                  description="Reference Charaka Samhitā verses"
                  checked={toggle3}
                  onChange={setToggle3}
                />
                <Toggle
                  label="Disabled Toggle (Off)"
                  description="Feature locked during assessment"
                  checked={false}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Checkboxes */}
          <Card>
            <CardHeader>
              <CardTitle>Checkboxes</CardTitle>
              <CardDescription>Custom animated check & indeterminate states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-md">
                <Checkbox
                  label="Include Seasonal Ritu Sandhi Factors"
                  description="Adjust recommendations for transition seasons"
                  checked={chk1}
                  onChange={(e) => setChk1(e.target.checked)}
                />
                <Checkbox
                  label="Strict Ahara Compatibility (Viruddha Ahara)"
                  description="Flag incompatible food combinations"
                  checked={chk2}
                  onChange={(e) => setChk2(e.target.checked)}
                />
                <Checkbox
                  label="Indeterminate Diagnostic Flag"
                  description="Requires secondary physician review"
                  indeterminate={true}
                  checked={false}
                  onChange={() => {}}
                />
                <Checkbox
                  label="Disabled Verification Check"
                  description="Read-only compliance verification"
                  checked={true}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Radio Group & Segmented */}
          <Card>
            <CardHeader>
              <CardTitle>Radios & Segmented Controls</CardTitle>
              <CardDescription>Multi-choice assessment switches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-lg">
                <RadioGroup
                  label="Primary Bio-Energy Imbalance"
                  name="dosha-imbalance"
                  value={radioDosha}
                  onChange={setRadioDosha}
                  helperText="Determined by symptom aggregation"
                >
                  <Radio
                    value="vata-pitta"
                    label="Vata-Pitta Imbalance"
                    description="Dryness, anxiety, hyperacidity"
                  />
                  <Radio
                    value="pitta-kapha"
                    label="Pitta-Kapha Imbalance"
                    description="Inflammation, sluggishness, congestion"
                  />
                  <Radio
                    value="kapha-vata"
                    label="Kapha-Vata Imbalance"
                    description="Heaviness, circulation issues"
                  />
                </RadioGroup>

                <div className="flex flex-col gap-xs">
                  <span className="ayur-form-label">Symptom Severity Segment</span>
                  <SegmentedControl
                    fullWidth
                    value={segmentedSeverity}
                    onChange={setSegmentedSeverity}
                    options={[
                      { value: 'mild', label: 'Mild' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'severe', label: 'Severe' }
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ====================================================================
          6. CARD SYSTEM
          ==================================================================== */}
      <section id="cards" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">06</span>
            <h2 className="ds-section__title">Card System Architecture</h2>
          </div>
          <p className="ds-section__desc">
            Six card variants: Standard, Interactive, Selectable, Highlighted (Ayurvedic Gold), Progress, and Info.
          </p>
        </div>

        <div className="ds-grid ds-grid--3">
          {/* 1. Standard Card */}
          <Card variant="standard">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge color="primary" variant="subtle">Standard</Badge>
                <span className="text-caption">Samhitā 1.2</span>
              </div>
              <CardTitle>Ahara (Dietary) Protocol</CardTitle>
              <CardDescription>Canonical nutritional guidelines based on Agni</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body">
                Warm, freshly cooked meals with appropriate spices (cumin, coriander, fennel) support balanced digestive fire without provoking Pitta.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">Read Source</Button>
            </CardFooter>
          </Card>

          {/* 2. Interactive Card (Hover Lift) */}
          <Card
            variant="interactive"
            onClick={() => onTriggerToast?.({ type: 'info', title: 'Card Clicked', message: 'Interactive card clicked' })}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge color="secondary" variant="subtle">Interactive</Badge>
                <Eye size={16} className="text-muted" />
              </div>
              <CardTitle>Vihara (Lifestyle) Regimen</CardTitle>
              <CardDescription>Hover to test subtle elevation & lift</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body">
                Early morning awakening (Brahma Muhurta), gentle Abhyanga oil massage, and mindful pranayama to pacify aggravated Vata dosha.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Explore Regimen</Button>
            </CardFooter>
          </Card>

          {/* 3. Highlighted Card (Ayurvedic Gold) */}
          <Card variant="highlighted">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge color="accent" variant="solid">AI Explainability</Badge>
                <Brain size={16} className="text-accent" />
              </div>
              <CardTitle>SHAP Feature Importance</CardTitle>
              <CardDescription>Top predictive features for recommendation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-xs">
                <div className="flex justify-between text-small">
                  <span>Prakriti Vata Proportion</span>
                  <span className="text-accent font-semibold">+0.42 SHAP</span>
                </div>
                <ProgressBar value={84} color="accent" size="sm" />
                <div className="flex justify-between text-small">
                  <span>Manda Agni Severity</span>
                  <span className="text-accent font-semibold">+0.28 SHAP</span>
                </div>
                <ProgressBar value={56} color="accent" size="sm" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="accent" size="sm">View SHAP Matrix</Button>
            </CardFooter>
          </Card>

          {/* 4. Selectable Card 1 */}
          <Card
            variant="selectable"
            selected={selectedCard === 'card-1'}
            onClick={() => setSelectedCard('card-1')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge color={selectedCard === 'card-1' ? 'primary' : 'neutral'} variant="subtle">
                  {selectedCard === 'card-1' ? 'Selected' : 'Selectable'}
                </Badge>
                {selectedCard === 'card-1' && <CheckCircle size={18} className="text-primary" />}
              </div>
              <CardTitle>Vata Balancing Plan</CardTitle>
              <CardDescription>Warm, grounding, nourishing therapies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-small">
                Emphasizes sweet, sour, and salty tastes with warm sesame oil applications.
              </p>
            </CardContent>
          </Card>

          {/* 5. Selectable Card 2 */}
          <Card
            variant="selectable"
            selected={selectedCard === 'card-2'}
            onClick={() => setSelectedCard('card-2')}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge color={selectedCard === 'card-2' ? 'primary' : 'neutral'} variant="subtle">
                  {selectedCard === 'card-2' ? 'Selected' : 'Selectable'}
                </Badge>
                {selectedCard === 'card-2' && <CheckCircle size={18} className="text-primary" />}
              </div>
              <CardTitle>Pitta Soothing Plan</CardTitle>
              <CardDescription>Cooling, pacifying, non-inflammatory foods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-small">
                Emphasizes sweet, bitter, and astringent tastes with ghee and cooling herbs.
              </p>
            </CardContent>
          </Card>

          {/* 6. Info Card */}
          <Card variant="info">
            <CardHeader>
              <div className="flex items-center gap-xs">
                <Info size={18} className="text-info" />
                <CardTitle>RAG Knowledge Grounding</CardTitle>
              </div>
              <CardDescription>Retrieval verification against peer corpus</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-small">
                Every AI output in AyuRAG-XAI is cited with exact Sanskrit shloka references and modern clinical evaluation scores.
              </p>
            </CardContent>
            <CardFooter>
              <Badge color="info" variant="subtle">98.4% Confidence</Badge>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* ====================================================================
          7. PROGRESS & STEPPER SYSTEM
          ==================================================================== */}
      <section id="progress" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">07</span>
            <h2 className="ds-section__title">Progress & Stepper System</h2>
          </div>
          <p className="ds-section__desc">
            Horizontal and vertical step tracking with Completed (✓), Current (●), Upcoming (○), and Disabled states.
          </p>
        </div>

        <div className="flex flex-col gap-lg">
          {/* Horizontal Stepper Demo */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Assessment Pipeline Stepper (Horizontal)</CardTitle>
                <div className="flex items-center gap-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentStepperStep <= 0}
                    onClick={() => setCurrentStepperStep((prev) => Math.max(0, prev - 1))}
                  >
                    Previous Step
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={currentStepperStep >= stepperSteps.length - 1}
                    onClick={() => setCurrentStepperStep((prev) => Math.min(stepperSteps.length - 1, prev + 1))}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
              <CardDescription>Click next/prev or steps directly to test completed checkmarks and current states</CardDescription>
            </CardHeader>
            <CardContent>
              <Stepper
                steps={stepperSteps}
                currentStep={currentStepperStep}
                onStepClick={setCurrentStepperStep}
                orientation="horizontal"
              />
            </CardContent>
          </Card>

          {/* Progress Bars Matrix */}
          <div className="ds-grid ds-grid--2">
            <Card>
              <CardHeader>
                <CardTitle>Progress Bars & Sizing</CardTitle>
                <CardDescription>Colorways, values, and percentage indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-md">
                  <ProgressBar
                    label="Overall Assessment Completeness"
                    value={progressVal}
                    showValue
                    color="primary"
                    size="md"
                  />
                  <ProgressBar
                    label="Ayurvedic Gold Accent Progress"
                    value={progressVal}
                    showValue
                    color="accent"
                    size="sm"
                  />
                  <ProgressBar
                    label="Multi-gradient Pipeline Bar"
                    value={progressVal}
                    showValue
                    color="gradient"
                    size="lg"
                  />
                  <div className="flex gap-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProgressVal((p) => Math.max(10, p - 15))}
                    >
                      -15%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProgressVal((p) => Math.min(100, p + 15))}
                    >
                      +15%
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indeterminate & Badges</CardTitle>
                <CardDescription>Non-blocking continuous processing and status tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-md">
                  <ProgressBar
                    label="RAG Vector Embedding Search in Progress"
                    indeterminate
                    color="primary"
                    size="md"
                  />

                  <div className="flex flex-col gap-xs mt-sm">
                    <span className="ayur-form-label">Status Badges Matrix</span>
                    <div className="flex flex-wrap gap-xs">
                      <Badge color="primary" variant="subtle" dot>Primary Active</Badge>
                      <Badge color="accent" variant="subtle" dot>Ayurvedic Gold</Badge>
                      <Badge color="success" variant="subtle" dot>Success Verified</Badge>
                      <Badge color="warning" variant="subtle" dot>Pitta Imbalance</Badge>
                      <Badge color="error" variant="subtle" dot>High Severity</Badge>
                      <Badge color="info" variant="subtle" dot>CCRAS Protocol</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. LOADING & SKELETON STATES
          ==================================================================== */}
      <section id="loading" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">08</span>
            <h2 className="ds-section__title">Loading System & Skeletons</h2>
          </div>
          <p className="ds-section__desc">
            No plain "Loading..." text. Smooth shimmers, spinners, and structured skeleton placeholders.
          </p>
        </div>

        <div className="ds-grid ds-grid--2">
          {/* Spinners */}
          <Card>
            <CardHeader>
              <CardTitle>Circular Spinners</CardTitle>
              <CardDescription>Sizes (sm, md, lg, xl) and brand colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around p-md bg-surface-muted rounded-md">
                <Spinner size="sm" color="primary" />
                <Spinner size="md" color="gold" />
                <Spinner size="lg" color="sage" />
                <Spinner size="xl" color="primary" />
              </div>
            </CardContent>
          </Card>

          {/* Skeletons */}
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Placeholder Shimmers</CardTitle>
              <CardDescription>Simulates asynchronous patient data fetching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-md">
                <div className="flex items-center gap-md">
                  <Skeleton variant="avatar" />
                  <div className="flex flex-col gap-xs flex-1">
                    <Skeleton variant="text" width="60%" height="16px" />
                    <Skeleton variant="text" width="40%" height="12px" />
                  </div>
                </div>
                <Skeleton variant="paragraph" lines={3} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ====================================================================
          9. FEEDBACK & ALERTS
          ==================================================================== */}
      <section id="feedback" className="ds-section">
        <div className="ds-section__header">
          <div className="flex items-center gap-xs">
            <span className="ds-section__num">09</span>
            <h2 className="ds-section__title">Feedback & Notification System</h2>
          </div>
          <p className="ds-section__desc">
            Dismissible contextual alerts and interactive toast notifications.
          </p>
        </div>

        <div className="flex flex-col gap-md">
          <Alert
            variant="success"
            title="Prakriti Classification Grounded"
            dismissible
          >
            The patient's dual Prakriti (Pitta-Vata) was verified with 94.2% agreement across classical symptom clusters.
          </Alert>

          <Alert
            variant="warning"
            title="Dosha Aggravation Warning"
            dismissible
          >
            Severe Pitta symptoms detected. Spicy, acidic foods (Katu, Amla) must be strictly avoided during Sharad Ritu.
          </Alert>

          <Alert
            variant="error"
            title="Incompatible Food Combination Flagged (Viruddha Ahara)"
            dismissible
          >
            Milk combined with sour fruits creates toxic byproduct (Ama) according to Charaka Samhitā Sutrasthana 26.
          </Alert>

          <Alert
            variant="info"
            title="Retrieval-Augmented Generation Grounding"
            dismissible
          >
            3 canonical classical passages retrieved from Ashtanga Hridaya (Chikitsasthana Chapter 4) for this protocol.
          </Alert>

          {/* Toast Notification Triggers */}
          <Card className="mt-md">
            <CardHeader>
              <CardTitle>Interactive Toast Notification Triggers</CardTitle>
              <CardDescription>Test floating toast notifications in the bottom right</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTriggerToast?.({
                    type: 'success',
                    title: 'Clinical Assessment Saved',
                    message: 'Patient profile and vitals saved to local session state.'
                  })}
                >
                  Trigger Success Toast
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTriggerToast?.({
                    type: 'warning',
                    title: 'Incomplete Questionnaire',
                    message: '3 symptom markers require confirmation before AI analysis.'
                  })}
                >
                  Trigger Warning Toast
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTriggerToast?.({
                    type: 'error',
                    title: 'Model Validation Alert',
                    message: 'SHAP score matrix failed boundary check.'
                  })}
                >
                  Trigger Error Toast
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTriggerToast?.({
                    type: 'info',
                    title: 'Knowledge Base Synced',
                    message: 'Retrieved latest Ayurvedic herbal pharmacopoeia vector index.'
                  })}
                >
                  Trigger Info Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
