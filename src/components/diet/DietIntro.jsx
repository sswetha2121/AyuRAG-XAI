import React from 'react';
import './DietIntro.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../ui';
import {
  Clock,
  Flame,
  Utensils,
  Salad,
  Coffee,
  GlassWater,
  HeartPulse,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { DIET_CATEGORIES } from '../../data/dietQuestions';

const ICON_MAP = {
  Clock,
  Flame,
  Utensils,
  Salad,
  Coffee,
  GlassWater,
  HeartPulse
};

export const DietIntro = ({ onStart, className = '' }) => {
  return (
    <div className={`ayur-diet-intro ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-dt-intro-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" size="md" icon={<Sparkles size={13} />}>
                Step 04 of 06
              </Badge>
              <Badge color="primary" variant="subtle" size="md">
                Dietary & Digestive Evaluation
              </Badge>
            </div>
            <span className="ayur-dt-est-badge">
              <Clock size={13} />
              <span>Est. 3 Minutes</span>
            </span>
          </div>

          <CardTitle as="h2" className="ayur-dt-intro-title">
            Understand your <span className="ayur-title-highlight">relationship with food</span>
          </CardTitle>

          <CardDescription className="ayur-dt-intro-desc">
            Explore your meal rhythms, appetite patterns, sensory taste preferences, and post-meal comfort to build a holistic digestive profile.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-dt-category-preview-grid">
            {DIET_CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Utensils;

              return (
                <div key={cat.id} className="ayur-dt-cat-preview-card">
                  <div className="ayur-dt-cat-preview-top">
                    <div className="ayur-dt-cat-icon-box">
                      <Icon size={18} />
                    </div>
                    <span className="ayur-dt-cat-number">{cat.number}</span>
                  </div>

                  <h3 className="ayur-dt-cat-preview-name">{cat.name}</h3>
                  <p className="ayur-dt-cat-preview-desc">{cat.description}</p>
                </div>
              );
            })}
          </div>

          <div className="ayur-dt-intro-note">
            <div className="flex items-center gap-xs text-secondary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Digestive Metabolism & Vitality Principle</span>
            </div>
            <p className="text-small text-muted mb-0">
              Digestive capacity determines how effectively cellular tissues are nourished and sustained. Responses are calibrated as educational baseline signals.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <div className="ayur-dt-intro-actions">
            <span className="text-small text-muted">
              10 structured questions • Interactive taste matrix • Live profile calibration
            </span>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={onStart}
              className="ayur-dt-start-btn"
            >
              Begin Dietary Assessment →
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
