import React from 'react';
import './SymptomSummary.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../ui';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Target,
  Clock,
  HeartPulse
} from 'lucide-react';

export const SymptomSummary = ({
  selectedSymptoms = [],
  primaryConcern = '',
  patientName = '',
  className = ''
}) => {
  const count = selectedSymptoms.length;

  const severityCounts = {
    minimal: selectedSymptoms.filter((s) => s.severity === 'minimal').length,
    mild: selectedSymptoms.filter((s) => s.severity === 'mild').length,
    moderate: selectedSymptoms.filter((s) => s.severity === 'moderate').length,
    significant: selectedSymptoms.filter((s) => s.severity === 'significant').length
  };

  return (
    <div className={`ayur-symptom-summary ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-sym-summary-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge color="accent" variant="solid" size="sm" icon={<Sparkles size={11} />}>
              Health Context
            </Badge>
            <span className="ayur-sym-step-badge">Step 5 of 6</span>
          </div>

          <CardTitle as="h3" className="ayur-sym-title">
            Symptoms & Focus
          </CardTitle>
          <CardDescription>
            {patientName ? `Active considerations for ${patientName}` : 'Live manifestation mapping'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Primary Concern Highlight */}
          <div className="ayur-sym-concern-metric">
            <div className="flex items-center gap-xs mb-2xs">
              <Target size={14} className="text-accent" />
              <span className="font-semibold text-caption text-primary">Chief Focus</span>
            </div>
            <p className="ayur-sym-concern-val">
              {primaryConcern || 'General wellness & balance'}
            </p>
          </div>

          {/* Selected Symptoms Count */}
          <div className="ayur-sym-count-box">
            <div className="flex items-center justify-between text-caption mb-xs">
              <span className="font-semibold text-primary">Selected Symptoms</span>
              <span className="font-mono font-bold text-accent">{count} Recorded</span>
            </div>

            <div className="ayur-sym-severity-chips">
              <span className="ayur-sym-sev-tag ayur-sym-sev-tag--mild">
                Mild: {severityCounts.mild + severityCounts.minimal}
              </span>
              <span className="ayur-sym-sev-tag ayur-sym-sev-tag--mod">
                Moderate: {severityCounts.moderate}
              </span>
              {severityCounts.significant > 0 && (
                <span className="ayur-sym-sev-tag ayur-sym-sev-tag--sig">
                  Significant: {severityCounts.significant}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2xs text-micro text-muted mt-xs">
              <CheckCircle2 size={12} className="text-success" />
              <span>Autosaved in session storage</span>
            </div>
          </div>

          {/* List of active symptoms if any */}
          {count > 0 && (
            <div className="ayur-sym-active-list">
              <span className="ayur-sym-active-title">Recorded Items:</span>
              <ul className="ayur-sym-items-bullets">
                {selectedSymptoms.map((sym) => (
                  <li key={sym.id} className="ayur-sym-bullet-item">
                    <span className="font-medium text-primary">{sym.name}</span>
                    <span className="text-micro text-muted">({sym.frequency || 'sometimes'}, {sym.duration || 'recent'})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Non-Alarmist Health Safety Disclaimer */}
          <div className="ayur-sym-safety-notice">
            <div className="flex items-center gap-xs text-secondary font-semibold text-micro mb-2xs">
              <ShieldCheck size={14} />
              <span>Research & Educational Disclaimer</span>
            </div>
            <p className="text-micro text-muted mb-0">
              This assessment is intended for educational and research support purposes and does not replace professional clinical diagnosis, prescription, or emergency medical evaluation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
