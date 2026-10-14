import React from 'react';
import './XaiFeatureImportance.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, ProgressBar } from '../ui';
import { Brain, Sparkles, TrendingUp, TrendingDown, HelpCircle, ShieldCheck } from 'lucide-react';

export const XaiFeatureImportance = ({
  features = [],
  className = ''
}) => {
  return (
    <div className={`ayur-xai-card-wrap ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-xai-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" size="sm" icon={<Brain size={12} />}>
                Explainable AI (XAI)
              </Badge>
              <Badge color="primary" variant="subtle" size="sm">
                Rule-Based Attribution
              </Badge>
            </div>
            <span className="ayur-demo-badge">Clinical Rule Scoring</span>
          </div>

          <CardTitle as="h2" className="ayur-xai-title">
            Why this profile? <span className="ayur-xai-highlight">Feature Contribution Analysis</span>
          </CardTitle>

          <CardDescription className="ayur-xai-desc">
            Multi-domain clinical scoring factors detailing how your specific physiological, dietary, and lifestyle responses contributed to your constitutional evaluation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-xai-features-list">
            {features.map((feat, idx) => {
              const isPositive = feat.direction === 'positive';
              const featKey = feat.id || `feat-${idx}`;

              return (
                <div key={featKey} className="ayur-xai-feature-row">
                  <div className="ayur-xai-feat-header">
                    <div className="flex items-center gap-xs flex-wrap">
                      <span className="ayur-xai-feat-name">{feat.name || feat.feature}</span>
                      <span className="ayur-xai-feat-cat">{feat.category || feat.domain}</span>
                      <span className={`ayur-xai-impact-badge ayur-xai-impact-badge--${(feat.impact || 'medium').toLowerCase()}`}>
                        {feat.impact || 'Rule'} Impact
                      </span>
                    </div>

                    <div className="flex items-center gap-2xs">
                      {isPositive ? (
                        <TrendingUp size={14} className="text-accent" />
                      ) : (
                        <TrendingDown size={14} className="text-secondary" />
                      )}
                      <span className="ayur-xai-feat-pct font-mono">
                        {isPositive ? `+${feat.contributionPct}%` : `-${feat.contributionPct}%`}
                      </span>
                    </div>
                  </div>

                  <div className="ayur-xai-bar-wrap">
                    <ProgressBar
                      value={Math.min(100, (feat.contributionPct || 20) * 3)}
                      color={isPositive ? 'accent' : 'secondary'}
                      size="sm"
                      showValue={false}
                    />
                  </div>

                  <p className="ayur-xai-feat-explanation">{feat.explanation}</p>
                </div>
              );
            })}
          </div>

          {/* Model Architecture Note */}
          <div className="ayur-xai-note">
            <div className="flex items-center gap-xs text-secondary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Deterministic Clinical Scoring Rationale</span>
            </div>
            <p className="text-small text-muted mb-0">
              Feature contributions are calculated deterministically from validated Ayurvedic diagnostic weighting matrices (CCRAS-aligned). Each finding's impact reflects its point allocation to your constitutional baseline.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
