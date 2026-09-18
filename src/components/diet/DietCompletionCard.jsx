import React from 'react';
import './DietCompletionCard.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '../ui';
import {
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Utensils,
  Flame,
  Clock,
  Salad,
  ShieldCheck
} from 'lucide-react';

export const DietCompletionCard = ({
  answers = {},
  patientName = '',
  onReviewAnswers,
  onContinueToNextPhase,
  className = ''
}) => {
  return (
    <div className={`ayur-dt-completion ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-dt-completion-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="success" variant="solid" size="md" icon={<CheckCircle2 size={13} />}>
                Step 04 Complete
              </Badge>
              <Badge color="accent" variant="subtle" size="md">
                Ahara & Agni Profile Recorded
              </Badge>
            </div>
            <span className="ayur-dt-completed-tag">
              10 of 10 Parameters Saved
            </span>
          </div>

          <CardTitle as="h2" className="ayur-dt-complete-title">
            Dietary Assessment <span className="ayur-complete-highlight">Successfully Completed</span>
          </CardTitle>

          <CardDescription className="ayur-dt-complete-desc">
            {patientName ? `Digestive fire (Agni) and meal rhythm documented for ${patientName}.` : 'Your dietary preferences and digestive tendencies are now registered.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-dt-metrics-summary">
            <div className="ayur-dt-metric-item">
              <div className="ayur-dt-metric-icon">
                <Clock size={20} className="text-primary" />
              </div>
              <div className="ayur-dt-metric-info">
                <span className="ayur-dt-metric-label">Meal Regularity</span>
                <span className="ayur-dt-metric-val">Documented</span>
              </div>
            </div>

            <div className="ayur-dt-metric-item">
              <div className="ayur-dt-metric-icon">
                <Flame size={20} className="text-accent" />
              </div>
              <div className="ayur-dt-metric-info">
                <span className="ayur-dt-metric-label">Agni Rhythm</span>
                <span className="ayur-dt-metric-val">Evaluated</span>
              </div>
            </div>

            <div className="ayur-dt-metric-item">
              <div className="ayur-dt-metric-icon">
                <Salad size={20} className="text-secondary" />
              </div>
              <div className="ayur-dt-metric-info">
                <span className="ayur-dt-metric-label">Dietary Pattern</span>
                <span className="ayur-dt-metric-val">Mapped</span>
              </div>
            </div>

            <div className="ayur-dt-metric-item">
              <div className="ayur-dt-metric-icon">
                <Utensils size={20} className="text-primary" />
              </div>
              <div className="ayur-dt-metric-info">
                <span className="ayur-dt-metric-label">Rasa Preferences</span>
                <span className="ayur-dt-metric-val">Recorded</span>
              </div>
            </div>
          </div>

          <div className="ayur-dt-complete-note">
            <div className="flex items-center gap-xs text-secondary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Next Milestone: Symptoms & Health Context</span>
            </div>
            <p className="text-small text-muted mb-0">
              Personal Information, Prakriti, Lifestyle, and Dietary profiles are securely saved. Step 5 will gather any active symptoms or specific concerns to contextualize explainable AI predictions.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <div className="ayur-dt-complete-actions">
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
              className="ayur-dt-continue-btn"
            >
              Continue to Symptoms →
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
