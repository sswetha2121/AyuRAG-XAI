import React from 'react';
import './AssessmentSummary.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, ProgressBar } from '../ui';
import { Sparkles, ShieldCheck, CheckCircle2, User, Activity, Wind, Flame, Mountain } from 'lucide-react';

export const AssessmentSummary = ({
  totalQuestions = 10,
  answeredCount = 0,
  answers = {},
  questions = [],
  patientName = '',
  className = ''
}) => {
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  // Compute demonstration dosha counts from weights
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
  const vataPct = Math.round((vataScore / totalScore) * 100) || 33;
  const pittaPct = Math.round((pittaScore / totalScore) * 100) || 33;
  const kaphaPct = Math.round((kaphaScore / totalScore) * 100) || 34;

  return (
    <div className={`ayur-assessment-summary ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-summary-card">
        {/* Header */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge color="accent" variant="solid" size="sm" icon={<Sparkles size={11} />}>
              Assessment Pipeline
            </Badge>
            <span className="ayur-summary-step">Step 2 of 6</span>
          </div>

          <CardTitle as="h3" className="ayur-summary-title">
            Constitutional Progress
          </CardTitle>
          <CardDescription>
            {patientName ? `Evaluating baseline for ${patientName}` : 'Your responses are dynamically calibrated'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Box */}
          <div className="ayur-summary-metric-box">
            <div className="flex items-center justify-between text-caption mb-xs">
              <span className="font-semibold text-primary">Prakriti Questions</span>
              <span className="font-mono font-bold text-accent">{answeredCount} / {totalQuestions} ({percentage}%)</span>
            </div>
            <ProgressBar
              value={percentage}
              color={percentage === 100 ? 'success' : 'accent'}
              size="sm"
              showValue={false}
            />
            <div className="flex items-center gap-2xs text-micro text-muted mt-2xs">
              <CheckCircle2 size={12} className="text-success" />
              <span>Progress autosaved to session memory</span>
            </div>
          </div>

          {/* Dosha Distribution Demonstration */}
          <div className="ayur-summary-dosha-section">
            <div className="flex items-center justify-between mb-xs">
              <span className="ayur-summary-dosha-title">Tridosha Balance Distribution</span>
              <span className="ayur-demo-badge">Live Calibrating</span>
            </div>

            <div className="ayur-dosha-bars">
              {/* Vata */}
              <div className="ayur-dosha-bar-item">
                <div className="flex items-center justify-between text-caption">
                  <div className="flex items-center gap-xs">
                    <Wind size={13} className="text-secondary" />
                    <span className="font-medium">Vāta (Movement)</span>
                  </div>
                  <span className="font-mono font-semibold">{vataPct}%</span>
                </div>
                <ProgressBar value={vataPct} color="primary" size="sm" />
              </div>

              {/* Pitta */}
              <div className="ayur-dosha-bar-item">
                <div className="flex items-center justify-between text-caption">
                  <div className="flex items-center gap-xs">
                    <Flame size={13} className="text-accent" />
                    <span className="font-medium">Pitta (Metabolism)</span>
                  </div>
                  <span className="font-mono font-semibold">{pittaPct}%</span>
                </div>
                <ProgressBar value={pittaPct} color="accent" size="sm" />
              </div>

              {/* Kapha */}
              <div className="ayur-dosha-bar-item">
                <div className="flex items-center justify-between text-caption">
                  <div className="flex items-center gap-xs">
                    <Mountain size={13} className="text-primary" />
                    <span className="font-medium">Kapha (Structure)</span>
                  </div>
                  <span className="font-mono font-semibold">{kaphaPct}%</span>
                </div>
                <ProgressBar value={kaphaPct} color="gradient" size="sm" />
              </div>
            </div>
          </div>

          {/* Classical Grounding Note */}
          <div className="ayur-summary-insight">
            <div className="flex items-center gap-xs text-secondary font-semibold text-micro mb-2xs">
              <ShieldCheck size={13} />
              <span>Classical Reference</span>
            </div>
            <p className="text-micro text-muted">
              <em>"Śarīra prakṛtistu śukra-śoṇita-prakṛtibhī..."</em> — Prakriti is established at conception and reflects natural anatomical, physiological and mental equilibrium (Ashtanga Hridaya Sutrasthana 1.7).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
