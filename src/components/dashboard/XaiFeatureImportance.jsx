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
                SHAP / Feature Attribution
              </Badge>
            </div>
            <span className="ayur-demo-badge">Demonstration explanation signal</span>
          </div>

          <CardTitle as="h2" className="ayur-xai-title">
            Why this profile? <span className="ayur-xai-highlight">Feature Contribution Analysis</span>
          </CardTitle>

          <CardDescription className="ayur-xai-desc">
            Explainable AI factors highlighting how specific lifestyle, dietary, and constitutional inputs contributed to your personalized model predictions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-xai-features-list">
            {features.map((feat) => {
              const isPositive = feat.direction === 'positive';

              return (
                <div key={feat.id} className="ayur-xai-feature-row">
                  <div className="ayur-xai-feat-header">
                    <div className="flex items-center gap-xs flex-wrap">
                      <span className="ayur-xai-feat-name">{feat.name}</span>
                      <span className="ayur-xai-feat-cat">{feat.category}</span>
                      <span className={`ayur-xai-impact-badge ayur-xai-impact-badge--${feat.impact.toLowerCase()}`}>
                        {feat.impact} Impact
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
                      value={feat.contributionPct * 3.5}
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
              <span>XAI Mathematical Interpretability Rationale</span>
            </div>
            <p className="text-small text-muted mb-0">
              Feature attributions mirror cooperative game-theoretic Shapley values (SHAP) and Local Interpretable Model-agnostic Explanations (LIME). This ensures clinical transparency, eliminating black-box AI opacity in healthcare decision support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
