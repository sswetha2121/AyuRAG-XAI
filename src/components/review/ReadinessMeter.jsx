import React from 'react';
import './ReadinessMeter.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, ProgressBar } from '../ui';
import { Sparkles, CheckCircle2, AlertCircle, ShieldCheck, Check } from 'lucide-react';

export const ReadinessMeter = ({
  readinessPct = 100,
  domainStatuses = [],
  className = ''
}) => {
  const isReady = readinessPct >= 90;

  return (
    <div className={`ayur-readiness-meter ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-readiness-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge color={isReady ? 'success' : 'warning'} variant="solid" size="sm" icon={<Sparkles size={11} />}>
              {isReady ? 'Ready for Analysis' : 'Attention Required'}
            </Badge>
            <span className="ayur-readiness-step-tag">Pre-Inference Review</span>
          </div>

          <CardTitle as="h3" className="ayur-readiness-title">
            Assessment Readiness
          </CardTitle>
          <CardDescription>
            Multi-domain clinical dataset validation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-readiness-pct-box">
            <div className="flex items-center justify-between text-caption mb-xs">
              <span className="font-semibold text-primary">Data Completeness</span>
              <span className="font-mono font-bold text-accent text-h4">{readinessPct}%</span>
            </div>

            <ProgressBar
              value={readinessPct}
              color={isReady ? 'success' : 'warning'}
              size="md"
              showValue={false}
            />

            <span className="text-micro text-muted mt-2xs block italic">
              *Note: Represents frontend profile completeness, not a clinical certainty metric.
            </span>
          </div>

          {/* 5-Domain Checklist */}
          <div className="ayur-readiness-checklist">
            <span className="ayur-readiness-list-title">Clinical Domain Verification:</span>
            <div className="ayur-readiness-items-list">
              {domainStatuses.map((domain, idx) => (
                <div key={idx} className="ayur-readiness-item">
                  <div className={`ayur-readiness-item-icon ${domain.isComplete ? 'ayur-readiness-item-icon--done' : 'ayur-readiness-item-icon--warn'}`}>
                    {domain.isComplete ? <Check size={12} strokeWidth={3} /> : <AlertCircle size={12} />}
                  </div>
                  <span className="ayur-readiness-item-name">{domain.name}</span>
                  <span className={`ayur-readiness-item-status ${domain.isComplete ? 'text-success' : 'text-warning'}`}>
                    {domain.isComplete ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
