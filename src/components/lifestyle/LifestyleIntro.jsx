import React from 'react';
import './LifestyleIntro.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../ui';
import {
  Sun,
  Activity,
  Moon,
  Briefcase,
  HeartPulse,
  GlassWater,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  Clock
} from 'lucide-react';
import { LIFESTYLE_CATEGORIES } from '../../data/lifestyleQuestions';

const ICON_MAP = {
  Sun,
  Activity,
  Moon,
  Briefcase,
  HeartPulse,
  GlassWater
};

export const LifestyleIntro = ({ onStart, className = '' }) => {
  return (
    <div className={`ayur-lifestyle-intro ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-ls-intro-card">
        {/* Intro Header */}
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" size="md" icon={<Sparkles size={13} />}>
                Step 03 of 06
              </Badge>
              <Badge color="primary" variant="subtle" size="md">
                Dinacharya & Lifestyle Analysis
              </Badge>
            </div>
            <span className="ayur-ls-est-badge">
              <Clock size={13} />
              <span>Est. 3–4 Minutes</span>
            </span>
          </div>

          <CardTitle as="h2" className="ayur-ls-intro-title">
            Let's understand your <span className="ayur-title-highlight">daily rhythm</span>
          </CardTitle>

          <CardDescription className="ayur-ls-intro-desc">
            Your routine, activity, sleep and everyday habits provide essential physiological context for accurate Ayurvedic personalization and explainable intelligence.
          </CardDescription>
        </CardHeader>

        {/* Visual Category Overview Grid */}
        <CardContent>
          <div className="ayur-ls-category-preview-grid">
            {LIFESTYLE_CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Sun;

              return (
                <div key={cat.id} className="ayur-ls-cat-preview-card">
                  <div className="ayur-ls-cat-preview-top">
                    <div className="ayur-ls-cat-icon-box">
                      <Icon size={20} />
                    </div>
                    <span className="ayur-ls-cat-number">{cat.number}</span>
                  </div>

                  <h3 className="ayur-ls-cat-preview-name">{cat.name}</h3>
                  <span className="ayur-ls-cat-preview-sanskrit">{cat.sanskritName}</span>
                  <p className="ayur-ls-cat-preview-desc">{cat.description}</p>
                </div>
              );
            })}
          </div>

          {/* Educational Note */}
          <div className="ayur-ls-intro-note">
            <div className="flex items-center gap-xs text-secondary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Ayurvedic Clinical Rationale</span>
            </div>
            <p className="text-small text-muted mb-0">
              In classical Ayurveda, <em>Dinacharya</em> (daily regimen) directly modulates the constitutional doshas (Vāta, Pitta, and Kapha). Understanding your circadian rhythms enables AyuRAG-XAI to calibrate precise, non-prescriptive behavioral insights.
            </p>
          </div>
        </CardContent>

        {/* Footer Action */}
        <CardFooter>
          <div className="ayur-ls-intro-actions">
            <div className="ayur-ls-intro-meta text-small text-muted">
              <span>10 data-driven parameters • Interactive custom controls • Live profile updates</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={onStart}
              className="ayur-ls-start-btn"
            >
              Begin Lifestyle Assessment →
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
