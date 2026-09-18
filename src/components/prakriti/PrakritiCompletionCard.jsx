import React from 'react';
import './PrakritiCompletionCard.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, ProgressBar } from '../ui';
import { CheckCircle2, Sparkles, ArrowRight, RotateCcw, ShieldCheck, Layers, Wind, Flame, Mountain } from 'lucide-react';

export const PrakritiCompletionCard = ({
  answers = {},
  questions = [],
  patientName = '',
  onReviewAnswers,
  onContinueToNextPhase,
  className = ''
}) => {
  // Compute dosha distribution
  let vataScore = 0;
  let pittaScore = 0;
  let kaphaScore = 0;

  questions.forEach((q) => {
    const selectedOptionId = answers[q.id];
    if (selectedOptionId) {
      const opt = q.options.find((o) => o.id === selectedOptionId);
      if (opt?.weights) {
        vataScore += opt.weights.vata || 0;
        pittaScore += opt.weights.pitta || 0;
        kaphaScore += opt.weights.kapha || 0;
      }
    }
  });

  const totalScore = vataScore + pittaScore + kaphaScore || 1;
  const vataPct = Math.round((vataScore / totalScore) * 100);
  const pittaPct = Math.round((pittaScore / totalScore) * 100);
  const kaphaPct = Math.round((kaphaScore / totalScore) * 100);

  return (
    <div className={`ayur-prakriti-completion ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-completion-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <Badge color="success" variant="solid" icon={<CheckCircle2 size={13} />}>
              Step 02 Complete
            </Badge>
            <Badge color="primary" variant="subtle">
              10 / 10 Responses Recorded
            </Badge>
          </div>

          <CardTitle as="h2" className="ayur-completion-title">
            Prakriti Assessment <span className="ayur-completion-accent">Baseline Recorded</span>
          </CardTitle>

          <CardDescription className="ayur-completion-desc">
            {patientName ? `Excellent progress, ${patientName}. ` : 'Excellent progress. '}
            Your physical and physiological constitutional responses have been structured and saved in session memory for multi-modal XAI analysis.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-completion-summary-grid">
            {/* Vata Distribution Box */}
            <div className="ayur-completion-dosha-box ayur-completion-dosha--vata">
              <div className="flex items-center gap-xs mb-xs">
                <Wind size={16} className="text-secondary" />
                <span className="font-semibold text-body">Vāta Energy</span>
              </div>
              <span className="ayur-completion-pct">{vataPct}%</span>
              <span className="text-caption text-muted">Movement & Variability</span>
              <ProgressBar value={vataPct} color="primary" size="sm" className="mt-xs" />
            </div>

            {/* Pitta Distribution Box */}
            <div className="ayur-completion-dosha-box ayur-completion-dosha--pitta">
              <div className="flex items-center gap-xs mb-xs">
                <Flame size={16} className="text-accent" />
                <span className="font-semibold text-body">Pitta Energy</span>
              </div>
              <span className="ayur-completion-pct">{pittaPct}%</span>
              <span className="text-caption text-muted">Metabolism & Transformation</span>
              <ProgressBar value={pittaPct} color="accent" size="sm" className="mt-xs" />
            </div>

            {/* Kapha Distribution Box */}
            <div className="ayur-completion-dosha-box ayur-completion-dosha--kapha">
              <div className="flex items-center gap-xs mb-xs">
                <Mountain size={16} className="text-primary" />
                <span className="font-semibold text-body">Kapha Energy</span>
              </div>
              <span className="ayur-completion-pct">{kaphaPct}%</span>
              <span className="text-caption text-muted">Structure & Cohesion</span>
              <ProgressBar value={kaphaPct} color="gradient" size="sm" className="mt-xs" />
            </div>
          </div>

          <div className="ayur-completion-protocol-note">
            <ShieldCheck size={18} className="text-secondary flex-shrink-0" />
            <div className="flex flex-col gap-2xs">
              <span className="font-semibold text-small text-primary">Next Phase Preparation</span>
              <p className="text-caption text-secondary">
                Prakriti represents biological baseline tendencies. In <strong>Phase 4</strong>, the system evaluates current lifestyle habits (<em>Dinacharya</em>) and dietary patterns (<em>Ahara</em>) to distinguish natural balance from active symptoms.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="ayur-completion-footer">
          <div className="flex items-center justify-between w-full flex-wrap gap-md">
            <Button
              variant="outline"
              leftIcon={<RotateCcw size={15} />}
              onClick={onReviewAnswers}
            >
              Review / Edit Answers
            </Button>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={onContinueToNextPhase}
            >
              Continue to Lifestyle Assessment →
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
