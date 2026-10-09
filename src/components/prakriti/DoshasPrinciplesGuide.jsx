import React, { useState } from 'react';
import './DoshasPrinciplesGuide.css';
import {
  Wind,
  Flame,
  Mountain,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Sun,
  Moon,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  BookOpen,
  Info
} from 'lucide-react';
import { Badge, Button } from '../ui';

export const DOSHAS_INFO = [
  {
    id: 'vata',
    sanskritName: 'Vāta (वात)',
    englishName: 'Movement & Kinetic Principle',
    tagline: 'The Master Governor of all Motion & Nerve Signals',
    metaphor: 'Like the wind — light, cool, dry, quick, and always in motion',
    elements: 'Air (Vāyu) + Space/Ether (Ākāśa)',
    themeColor: '#2563EB',
    colorClass: 'ayur-guide-dosha--vata',
    icon: Wind,
    plainEnglishDesc:
      'Vata is the energy of movement. In your body, it powers every single action that moves: breathing into your lungs, your heartbeat pulsing through veins, nerve impulses traveling to your brain, and food moving through your digestive tract.',
    governsList: [
      'Breathing rate and lung expansion',
      'Heartbeats, circulation, and blood flow',
      'Nerve impulses, thoughts, and cognitive reflexes',
      'Muscle movement, blinking, and joint mobility',
      'Elimination and cellular waste removal'
    ],
    inBalance: {
      title: 'When Vata is in Healthy Balance',
      traits: [
        'Vibrant energy, agility, and enthusiasm',
        'Quick grasp of new concepts and imaginative creativity',
        'Flexible, light physical body',
        'Naturally expressive, joyful, and spontaneous',
        'Sound, restorative sleep and regular digestion'
      ]
    },
    imbalance: {
      title: 'Signs Vata is Out of Balance (Excess Vata)',
      symptoms: [
        'Dry skin, chapped lips, or brittle nails',
        'Erratic appetite, bloating, gas, or constipation',
        'Feeling restless, racing thoughts, or mild anxiety',
        'Difficulty falling asleep or waking up at 3:00 AM',
        'Cold hands and feet, sensitivity to chilly winds'
      ]
    },
    balancingLifestyle: [
      {
        icon: Utensils,
        title: 'Dietary Strategy',
        desc: 'Enjoy warm, freshly cooked, grounding foods with healthy fats (ghee, olive oil, soups, stews, warm spiced milk). Minimize cold raw salads or icy beverages.'
      },
      {
        icon: Sun,
        title: 'Daily Rhythm',
        desc: 'Stick to steady meal times and sleep by 10:00 PM. Vata thrives on consistent routines, calming breathwork (Pranayama), and warm baths.'
      }
    ],
    realLifeExample: 'If you are someone who thinks quickly, talks with excitement, naturally has a slender build, and feels uncomfortable in drafty air conditioning, your Vata principle is naturally prominent!'
  },
  {
    id: 'pitta',
    sanskritName: 'Pitta (पित्त)',
    englishName: 'Metabolic & Transformation Principle',
    tagline: 'The Internal Furnace of Digestion, Heat & Intellect',
    metaphor: 'Like the sun and digestive fire — warm, sharp, bright, and transformative',
    elements: 'Fire (Tejas) + Water (Jala)',
    themeColor: '#EA580C',
    colorClass: 'ayur-guide-dosha--pitta',
    icon: Flame,
    plainEnglishDesc:
      'Pitta is the energy of transformation and digestion. It controls how your body transforms fuel into energy — breaking down meals into nutrients, converting sunlight into vitamin D, and transforming complex information into sharp ideas.',
    governsList: [
      'Digestion (Agni) and nutrient absorption',
      'Metabolic heat, body temperature, and sweating',
      'Liver and enzymatic function',
      'Vision, eye brightness, and visual acuity',
      'Intellect, focus, decision-making, and ambition'
    ],
    inBalance: {
      title: 'When Pitta is in Healthy Balance',
      traits: [
        'Sharp intellect, clear articulate communication',
        'Strong, reliable digestion and hearty appetite',
        'Warm, radiant complexion and glowing skin',
        'Courageous leadership, organized mind, and focus',
        'Warm body temperature and steady stamina'
      ]
    },
    imbalance: {
      title: 'Signs Pitta is Out of Balance (Excess Pitta)',
      symptoms: [
        'Heartburn, acidity, acid reflux, or sour stomach',
        'Skin irritation, red rashes, acne, or flushing',
        'Irritability, impatience, anger, or feeling overly critical',
        'Overheating, profuse sweating, or extreme thirst',
        'Inflammatory discomfort in joints or eyes'
      ]
    },
    balancingLifestyle: [
      {
        icon: Utensils,
        title: 'Dietary Strategy',
        desc: 'Choose sweet, cooling, and mild foods like cucumbers, melons, cilantro, mint, leafy greens, and coconut water. Avoid excess chili, vinegar, fried foods, and alcohol.'
      },
      {
        icon: Sun,
        title: 'Daily Rhythm',
        desc: 'Avoid working through lunch. Take evening walks in moonlight or nature, practice cooling breathwork (Sheetali), and allow time for play without competition.'
      }
    ],
    realLifeExample: 'If you have a medium athletic build, easily digest almost any meal, can get "hangry" if food is delayed, and love taking charge of projects, your Pitta principle is high!'
  },
  {
    id: 'kapha',
    sanskritName: 'Kapha (कफ)',
    englishName: 'Structural & Cohesive Principle',
    tagline: 'The Sturdy Foundation of Strength, Stability & Immunity',
    metaphor: 'Like the fertile earth & soothing water — solid, lubricating, and peaceful',
    elements: 'Water (Jala) + Earth (Pṛthvī)',
    themeColor: '#059669',
    colorClass: 'ayur-guide-dosha--kapha',
    icon: Mountain,
    plainEnglishDesc:
      'Kapha is the physical architect and protector of your body. It provides the physical substance: building muscle tissue, lubricating joints with synovial fluid, shielding organs with protective mucous membranes, and giving deep mental calm.',
    governsList: [
      'Skeletal structure, muscle mass, and bodily tissues',
      'Joint lubrication and smooth bodily movements',
      'Cellular hydration and natural fluid retention',
      'Immune defense and physical resilience (Ojas)',
      'Emotional stability, empathy, patience, and memory'
    ],
    inBalance: {
      title: 'When Kapha is in Healthy Balance',
      traits: [
        'Exceptional physical stamina and endurance',
        'Deep, restful, uninterrupted sleep',
        'Calm, compassionate, loving, and grounded demeanor',
        'Strong immunity, thick lustrous hair, and healthy joints',
        'Excellent long-term memory and unwavering loyalty'
      ]
    },
    imbalance: {
      title: 'Signs Kapha is Out of Balance (Excess Kapha)',
      symptoms: [
        'Sluggish digestion, feeling heavy or sleepy after meals',
        'Difficulty waking up in the morning or sleeping > 9 hours',
        'Congestion, excess mucus, or water retention',
        'Unexplained weight gain or slow metabolism',
        'Lethargy, brain fog, or resistance to change and movement'
      ]
    },
    balancingLifestyle: [
      {
        icon: Utensils,
        title: 'Dietary Strategy',
        desc: 'Favor warm, light, spicy, and dry foods (ginger tea, pepper, legumes, steamed veggies, light grains). Limit heavy creamy cheeses, ice cream, and oily pastries.'
      },
      {
        icon: Sun,
        title: 'Daily Rhythm',
        desc: 'Wake up early before sunrise (by 6:00 AM). Engage in vigorous daily cardio or brisk walking, and seek out new stimulating learning experiences.'
      }
    ],
    realLifeExample: 'If you have a broad or sturdy frame, large peaceful eyes, don’t get easily rattled during a crisis, and love a good long sleep, your Kapha principle is naturally strong!'
  }
];

export const DoshasPrinciplesGuide = ({
  mode = 'full', // 'full' or 'compact'
  title = 'Understanding the 3 Doshas (Governing Principles)',
  subtitle = 'A simple, intuitive guide to the three biological forces that make up your physical constitution and mindset.',
  showAction = false,
  onStartAssessment
}) => {
  const [activeTab, setActiveTab] = useState('vata');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'comparison'

  const currentDosha = DOSHAS_INFO.find((d) => d.id === activeTab) || DOSHAS_INFO[0];
  const CurrentIcon = currentDosha.icon;

  return (
    <section className={`ayur-doshas-guide-section ${mode === 'compact' ? 'ayur-doshas-guide--compact' : ''}`}>
      <div className="ayur-doshas-guide-container">
        {/* Section Header */}
        <div className="ayur-doshas-guide-header">
          <div className="ayur-guide-tag">
            <Sparkles size={14} className="text-accent" />
            <span>AYURVEDIC FUNDAMENTALS EXPLAINED</span>
          </div>

          <h2 className="ayur-guide-title">{title}</h2>
          <p className="ayur-guide-subtitle">{subtitle}</p>

          {/* Core Concept Banner */}
          <div className="ayur-guide-concept-banner">
            <div className="ayur-guide-concept-icon">
              <BookOpen size={24} />
            </div>
            <div className="ayur-guide-concept-text">
              <h4>What exactly is a "Dosha" or "Principle"?</h4>
              <p>
                In classical healthcare, the word <strong>Dosha</strong> refers to the <strong>three fundamental bio-energetic principles</strong> that exist in nature and within every human being: <strong>Vāta (Movement)</strong>, <strong>Pitta (Metabolism & Transformation)</strong>, and <strong>Kapha (Structure & Stability)</strong>.
              </p>
              <div className="ayur-guide-concept-highlight">
                <CheckCircle2 size={16} className="text-secondary flex-shrink-0" />
                <span>
                  <strong>The Key Rule:</strong> You are not just one single dosha! Every person has all three. Your unique combination established at birth is called your <strong>Prakriti</strong> (Baseline Constitution). Knowing your dominant dosha is the secret to choosing the right food, sleep habits, and exercise for your body.
                </span>
              </div>
            </div>
          </div>

          {/* View Mode Toggle: Interactive Cards vs Side-by-Side Table */}
          <div className="ayur-guide-view-toggle">
            <button
              type="button"
              className={`ayur-toggle-tab ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <Layers size={14} />
              <span>Interactive Dosha Profiles</span>
            </button>
            <button
              type="button"
              className={`ayur-toggle-tab ${viewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setViewMode('comparison')}
            >
              <Compass size={14} />
              <span>Side-by-Side Comparison Table</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: Interactive Profiles with Dosha Switcher */}
        {viewMode === 'cards' && (
          <div className="ayur-guide-profiles-wrapper">
            {/* 3 Dosha Selector Tabs */}
            <div className="ayur-dosha-tabs-nav" role="tablist">
              {DOSHAS_INFO.map((dosha) => {
                const Icon = dosha.icon;
                const isSelected = activeTab === dosha.id;
                return (
                  <button
                    key={dosha.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`ayur-dosha-tab-btn ${dosha.colorClass} ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveTab(dosha.id)}
                  >
                    <div className="ayur-dosha-tab-icon">
                      <Icon size={20} />
                    </div>
                    <div className="ayur-dosha-tab-meta">
                      <span className="ayur-dosha-tab-sanskrit">{dosha.sanskritName}</span>
                      <span className="ayur-dosha-tab-english">{dosha.englishName.split('&')[0].trim()}</span>
                    </div>
                    <span className="ayur-dosha-tab-elements">{dosha.elements.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Dosha Detailed Showcase Card */}
            <div className={`ayur-dosha-detail-panel ${currentDosha.colorClass}`}>
              {/* Panel Top Hero */}
              <div className="ayur-panel-hero">
                <div className="ayur-panel-hero__left">
                  <div className="ayur-panel-icon-wrap">
                    <CurrentIcon size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-xs flex-wrap mb-2xs">
                      <h3 className="ayur-panel-title">{currentDosha.sanskritName}</h3>
                      <Badge color="accent" variant="subtle" size="sm">
                        {currentDosha.elements}
                      </Badge>
                    </div>
                    <span className="ayur-panel-tagline">{currentDosha.tagline}</span>
                  </div>
                </div>

                <div className="ayur-panel-metaphor-box">
                  <span className="ayur-metaphor-label">Natural Metaphor:</span>
                  <p className="ayur-metaphor-text">"{currentDosha.metaphor}"</p>
                </div>
              </div>

              {/* Plain English Explanation */}
              <div className="ayur-panel-plain-english">
                <div className="flex items-center gap-xs text-primary font-semibold text-small mb-2xs">
                  <HelpCircle size={16} />
                  <span>In Plain English: What is this principle?</span>
                </div>
                <p>{currentDosha.plainEnglishDesc}</p>
              </div>

              {/* Real World Example Banner */}
              <div className="ayur-panel-example-banner">
                <Sparkles size={16} className="text-accent flex-shrink-0" />
                <p>
                  <strong>Real-World Example:</strong> {currentDosha.realLifeExample}
                </p>
              </div>

              {/* Grid: What It Governs & In Balance vs Imbalance */}
              <div className="ayur-panel-content-grid">
                {/* Column 1: What it regulates */}
                <div className="ayur-panel-card ayur-panel-governs">
                  <h4 className="ayur-card-subheading">
                    <Layers size={16} className="text-secondary" />
                    <span>What {currentDosha.sanskritName.split(' ')[0]} Controls in Your Body</span>
                  </h4>
                  <ul className="ayur-check-list">
                    {currentDosha.governsList.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={15} className="text-secondary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: In Balance vs Out of Balance */}
                <div className="ayur-panel-card ayur-panel-balance-states">
                  <div className="ayur-balance-block">
                    <h5 className="ayur-state-heading text-success">
                      <CheckCircle2 size={15} />
                      <span>{currentDosha.inBalance.title}</span>
                    </h5>
                    <ul className="ayur-bullet-list">
                      {currentDosha.inBalance.traits.map((trait, idx) => (
                        <li key={idx}>{trait}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="ayur-imbalance-block">
                    <h5 className="ayur-state-heading text-warning">
                      <AlertCircle size={15} />
                      <span>{currentDosha.imbalance.title}</span>
                    </h5>
                    <ul className="ayur-bullet-list warning">
                      {currentDosha.imbalance.symptoms.map((symptom, idx) => (
                        <li key={idx}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom: Lifestyle & Dietary Balancing Tips */}
              <div className="ayur-panel-balancing-row">
                <h4 className="ayur-card-subheading mb-sm">
                  <Sun size={16} className="text-accent" />
                  <span>How to Keep {currentDosha.sanskritName.split(' ')[0]} in Harmony</span>
                </h4>
                <div className="ayur-tips-grid">
                  {currentDosha.balancingLifestyle.map((tip, idx) => {
                    const TipIcon = tip.icon;
                    return (
                      <div key={idx} className="ayur-tip-card">
                        <div className="ayur-tip-icon">
                          <TipIcon size={18} />
                        </div>
                        <div>
                          <strong className="ayur-tip-title">{tip.title}</strong>
                          <p className="ayur-tip-desc">{tip.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Side-by-Side Comparison Table */}
        {viewMode === 'comparison' && (
          <div className="ayur-guide-table-wrapper">
            <div className="ayur-comparison-table-scroll">
              <table className="ayur-doshas-comparison-table">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th className="th-vata">
                      <div className="flex items-center gap-2xs justify-center">
                        <Wind size={16} />
                        <span>VĀTA (Movement)</span>
                      </div>
                    </th>
                    <th className="th-pitta">
                      <div className="flex items-center gap-2xs justify-center">
                        <Flame size={16} />
                        <span>PITTA (Metabolism)</span>
                      </div>
                    </th>
                    <th className="th-kapha">
                      <div className="flex items-center gap-2xs justify-center">
                        <Mountain size={16} />
                        <span>KAPHA (Structure)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-label">Natural Elements</td>
                    <td>Air + Space (Ether)</td>
                    <td>Fire + Water</td>
                    <td>Water + Earth</td>
                  </tr>
                  <tr>
                    <td className="td-label">Master Function</td>
                    <td>Bodily motion, nerve signals, respiration</td>
                    <td>Digestion, cellular heat, metabolism</td>
                    <td>Tissue mass, lubrication, immunity</td>
                  </tr>
                  <tr>
                    <td className="td-label">Physical Build</td>
                    <td>Naturally slender, lean, prominent joints</td>
                    <td>Medium frame, athletic, moderate muscle</td>
                    <td>Solid, broad, sturdy, natural stamina</td>
                  </tr>
                  <tr>
                    <td className="td-label">Digestion & Appetite</td>
                    <td>Variable (sometimes hungry, sometimes not)</td>
                    <td>Intense, rapid, strong thirst</td>
                    <td>Slow, steady, can easily skip meals</td>
                  </tr>
                  <tr>
                    <td className="td-label">Sleep Pattern</td>
                    <td>Light, interrupted, tends to dream vividly</td>
                    <td>Moderate (6-7 hrs), falls asleep readily</td>
                    <td>Deep, heavy, enjoys 8+ hours of sleep</td>
                  </tr>
                  <tr>
                    <td className="td-label">Mind Under Stress</td>
                    <td>Worry, racing thoughts, restlessness</td>
                    <td>Impatience, frustration, irritability</td>
                    <td>Withdrawal, stubbornness, procrastination</td>
                  </tr>
                  <tr>
                    <td className="td-label">Signs of Imbalance</td>
                    <td>Dry skin, gas, constipation, insomnia</td>
                    <td>Acidity, rashes, heartburn, overheating</td>
                    <td>Weight gain, sluggishness, congestion</td>
                  </tr>
                  <tr>
                    <td className="td-label">Ideal Dietary Style</td>
                    <td>Warm, moist, grounding soups, root vegetables</td>
                    <td>Cooling, fresh salads, mint, sweet fruits</td>
                    <td>Light, spicy, warm teas, steamed greens</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Why this matters in AyuRAG-XAI */}
        <div className="ayur-guide-xai-card">
          <div className="ayur-guide-xai-icon">
            <Shield size={24} className="text-secondary" />
          </div>
          <div className="ayur-guide-xai-text">
            <h4>Why We Measure This in AyuRAG-XAI</h4>
            <p>
              Your answers to our 10 constitutional questions reveal your precise personal ratio (e.g., 42% Vata, 36% Pitta, 22% Kapha). 
              Our Explainable AI (XAI) engine links these scores to classical clinical literature, enabling licensed physicians to recommend 
              custom daily routines, targeted kitchen spices, and circadian habits designed specifically for your individual biological rhythm.
            </p>
          </div>
          {showAction && onStartAssessment && (
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={16} />}
              onClick={onStartAssessment}
              className="ayur-guide-cta-btn"
            >
              Start Body Assessment
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
