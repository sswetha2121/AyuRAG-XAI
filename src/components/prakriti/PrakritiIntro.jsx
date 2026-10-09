import React, { useState } from 'react';
import './PrakritiIntro.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../ui';
import { Wind, Flame, Mountain, Sparkles, ArrowRight, ShieldCheck, HelpCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { DoshasPrinciplesGuide } from './DoshasPrinciplesGuide';

const DOSHA_CARDS = [
  {
    name: 'Vāta • Movement Energy',
    sanskrit: 'Vāta (वात)',
    elements: 'Air + Space (Ether)',
    principles: 'Breathing, Heartbeat, Nerve Signals, Circulation & Motion',
    qualities: 'Dry, Light, Cool, Mobile, Nimble & Quick',
    icon: Wind,
    colorClass: 'ayur-intro-dosha--vata',
    balanceTip: 'Thrives on warm cooked foods, routine, and grounding rest.'
  },
  {
    name: 'Pitta • Metabolic Energy',
    sanskrit: 'Pitta (पित्त)',
    elements: 'Fire + Water',
    principles: 'Digestion, Metabolism, Body Heat, Vision & Sharp Intellect',
    qualities: 'Hot, Sharp, Light, Penetrating & Focused',
    icon: Flame,
    colorClass: 'ayur-intro-dosha--pitta',
    balanceTip: 'Thrives on cooling foods, hydration, and moderate pacing.'
  },
  {
    name: 'Kapha • Structural Energy',
    sanskrit: 'Kapha (कफ)',
    elements: 'Water + Earth',
    principles: 'Body Frame, Joint Lubrication, Tissues & Immune Resilience',
    qualities: 'Heavy, Solid, Steady, Cool, Calm & Enduring',
    icon: Mountain,
    colorClass: 'ayur-intro-dosha--kapha',
    balanceTip: 'Thrives on light spicy foods, morning waking, and daily exercise.'
  }
];

export const PrakritiIntro = ({ onStart, onOpenInfo, className = '' }) => {
  const [showFullGuide, setShowFullGuide] = useState(false);

  return (
    <div className={`ayur-prakriti-intro ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-intro-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" icon={<Sparkles size={12} />}>
                Step 02 of 06
              </Badge>
              <Badge color="primary" variant="subtle">
                Body Constitution Assessment
              </Badge>
            </div>
            <div className="flex items-center gap-xs">
              <Button
                variant={showFullGuide ? 'secondary' : 'outline'}
                size="sm"
                leftIcon={<BookOpen size={14} />}
                rightIcon={showFullGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                onClick={() => setShowFullGuide(!showFullGuide)}
              >
                {showFullGuide ? 'Hide Doshas Guide' : 'Beginner Guide to 3 Doshas'}
              </Button>

              {onOpenInfo && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<HelpCircle size={14} />}
                  onClick={onOpenInfo}
                >
                  Quick FAQ
                </Button>
              )}
            </div>
          </div>

          <CardTitle as="h2" className="ayur-intro-title">
            Understanding Your <span className="ayur-intro-title-accent">Constitutional Blueprint</span>
          </CardTitle>

          <CardDescription className="ayur-intro-desc">
            In Ayurvedic medicine, your <strong>Body Constitution (Prakriti)</strong> is your lifelong biological fingerprint. It is shaped by three foundational energies known as <strong>Doshas (Principles)</strong>: <strong>Vāta</strong> (Movement), <strong>Pitta</strong> (Metabolism), and <strong>Kapha</strong> (Structure). Everyone is born with all three in a unique ratio!
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Quick Summary Dosha Cards */}
          <div className="ayur-intro-dosha-grid">
            {DOSHA_CARDS.map((dosha) => {
              const Icon = dosha.icon;
              return (
                <div key={dosha.name} className={`ayur-intro-dosha-card ${dosha.colorClass}`}>
                  <div className="ayur-intro-dosha-header">
                    <div className="ayur-intro-dosha-icon">
                      <Icon size={18} />
                    </div>
                    <div className="ayur-intro-dosha-names">
                      <h4 className="ayur-intro-dosha-name">{dosha.name}</h4>
                      <span className="ayur-intro-dosha-elements">{dosha.elements}</span>
                    </div>
                  </div>

                  <div className="ayur-intro-dosha-body">
                    <div className="ayur-intro-dosha-row">
                      <span className="ayur-intro-label">Governs:</span>
                      <span className="ayur-intro-val">{dosha.principles}</span>
                    </div>
                    <div className="ayur-intro-dosha-row">
                      <span className="ayur-intro-label">Key Traits:</span>
                      <span className="ayur-intro-val">{dosha.qualities}</span>
                    </div>
                    <div className="ayur-intro-dosha-row">
                      <span className="ayur-intro-label">Simple Balance:</span>
                      <span className="ayur-intro-val text-accent font-medium">{dosha.balanceTip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Expandable Deep-Dive Section for Beginners */}
          {showFullGuide && (
            <div className="ayur-intro-expanded-guide mt-lg pt-md" style={{ borderTop: '1px solid var(--color-border)' }}>
              <DoshasPrinciplesGuide mode="compact" />
            </div>
          )}

          <div className="ayur-intro-clinical-note mt-md">
            <ShieldCheck size={16} className="text-secondary flex-shrink-0" />
            <p className="text-caption text-secondary">
              This assessment consists of <strong>10 structured questions</strong> exploring your physical build, digestion, sleep, and natural tendencies over the long term. Choose whichever option reflects your natural self best.
            </p>
          </div>
        </CardContent>

        <CardFooter className="ayur-intro-footer">
          <div className="flex items-center justify-between w-full flex-wrap gap-md">
            <span className="text-small text-muted">
              Estimated duration: ~3 minutes • Progress is saved automatically
            </span>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={onStart}
            >
              Begin Prakriti Assessment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
