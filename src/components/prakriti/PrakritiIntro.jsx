import React from 'react';
import './PrakritiIntro.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../ui';
import { Wind, Flame, Mountain, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

const DOSHA_CARDS = [
  {
    name: 'Vāta',
    elements: 'Air + Ether (Vāyu + Ākāśa)',
    principles: 'Movement, Respiration, Circulation & Variability',
    qualities: 'Dry, Light, Cool, Rough, Mobile & Clear',
    icon: Wind,
    colorClass: 'ayur-intro-dosha--vata'
  },
  {
    name: 'Pitta',
    elements: 'Fire + Water (Agni + Jala)',
    principles: 'Transformation, Digestion, Metabolism & Intellect',
    qualities: 'Hot, Sharp, Light, Liquid, Oily & Penetrating',
    icon: Flame,
    colorClass: 'ayur-intro-dosha--pitta'
  },
  {
    name: 'Kapha',
    elements: 'Water + Earth (Jala + Pṛthvī)',
    principles: 'Structure, Cohesion, Lubrication & Stability',
    qualities: 'Heavy, Slow, Cool, Oily, Smooth, Dense & Stable',
    icon: Mountain,
    colorClass: 'ayur-intro-dosha--kapha'
  }
];

export const PrakritiIntro = ({ onStart, onOpenInfo, className = '' }) => {
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
                Prakriti Assessment
              </Badge>
            </div>
            {onOpenInfo && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<HelpCircle size={14} />}
                onClick={onOpenInfo}
              >
                What is Prakriti?
              </Button>
            )}
          </div>

          <CardTitle as="h2" className="ayur-intro-title">
            Understanding Your <span className="ayur-intro-title-accent">Constitutional Blueprint</span>
          </CardTitle>

          <CardDescription className="ayur-intro-desc">
            In Ayurvedic science, <strong>Prakriti</strong> represents your unique baseline genetic and physiological constitution determined at conception. It comprises three dynamic biological energies (Tridoshas) that govern mind and body.
          </CardDescription>
        </CardHeader>

        <CardContent>
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
                  </div>
                </div>
              );
            })}
          </div>

          <div className="ayur-intro-clinical-note">
            <ShieldCheck size={16} className="text-secondary flex-shrink-0" />
            <p className="text-caption text-secondary">
              This interactive assessment consists of <strong>10 structured questions</strong> exploring your physical build, digestion, sleep, and emotional patterns.
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
