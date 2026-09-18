import React from 'react';
import './LifestyleCompletionCard.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../ui';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sun,
  Activity,
  Moon,
  Briefcase,
  HeartPulse,
  GlassWater,
  ShieldCheck,
  Award
} from 'lucide-react';

export const LifestyleCompletionCard = ({
  answers = {},
  questions = [],
  patientName = '',
  onReviewAnswers,
  onContinueToNextPhase,
  className = ''
}) => {
  return (
    <div className={`ayur-ls-completion ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-ls-completion-card">
        {/* Completion Header */}
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="success" variant="solid" size="md" icon={<CheckCircle2 size={13} />}>
                Step 03 Complete
              </Badge>
              <Badge color="accent" variant="subtle" size="md">
                Dinacharya Profile Recorded
              </Badge>
            </div>
            <span className="ayur-ls-completed-tag">
              10 of 10 Parameters Saved
            </span>
          </div>

          <CardTitle as="h2" className="ayur-ls-complete-title">
            Lifestyle Assessment <span className="ayur-complete-highlight">Successfully Completed</span>
          </CardTitle>

          <CardDescription className="ayur-ls-complete-desc">
            {patientName ? `Comprehensive daily rhythm profile calibrated for ${patientName}.` : 'Your everyday rhythm and routine patterns are now fully characterized.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Milestone Metrics Box */}
          <div className="ayur-ls-metrics-summary">
            <div className="ayur-ls-metric-item">
              <div className="ayur-ls-metric-icon">
                <Sun size={20} className="text-accent" />
              </div>
              <div className="ayur-ls-metric-info">
                <span className="ayur-ls-metric-label">Circadian Rhythm</span>
                <span className="ayur-ls-metric-val">Documented</span>
              </div>
            </div>

            <div className="ayur-ls-metric-item">
              <div className="ayur-ls-metric-icon">
                <Activity size={20} className="text-secondary" />
              </div>
              <div className="ayur-ls-metric-info">
                <span className="ayur-ls-metric-label">Vyāyāma Load</span>
                <span className="ayur-ls-metric-val">Indexed</span>
              </div>
            </div>

            <div className="ayur-ls-metric-item">
              <div className="ayur-ls-metric-icon">
                <Moon size={20} className="text-primary" />
              </div>
              <div className="ayur-ls-metric-info">
                <span className="ayur-ls-metric-label">Nidrā Quality</span>
                <span className="ayur-ls-metric-val">Evaluated</span>
              </div>
            </div>

            <div className="ayur-ls-metric-item">
              <div className="ayur-ls-metric-icon">
                <HeartPulse size={20} className="text-accent" />
              </div>
              <div className="ayur-ls-metric-info">
                <span className="ayur-ls-metric-label">Stress Coping</span>
                <span className="ayur-ls-metric-val">Mapped</span>
              </div>
            </div>
          </div>

          {/* Clinical Context Banner */}
          <div className="ayur-ls-complete-note">
            <div className="flex items-center gap-xs text-secondary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Integration with Clinical Knowledge Graph</span>
            </div>
            <p className="text-small text-muted mb-0">
              Personal Information (Step 1), Prakriti Baseline (Step 2), and Lifestyle Assessment (Step 3) are now synchronized in session storage. In the upcoming phases, dietary digestion (Agni) and current symptoms (Vikriti) will complete your clinical dossier.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <div className="ayur-ls-complete-actions">
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw size={16} />}
              onClick={onReviewAnswers}
            >
              Review / Edit Answers
            </Button>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={onContinueToNextPhase}
              className="ayur-ls-continue-btn"
            >
              Continue to Diet →
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
