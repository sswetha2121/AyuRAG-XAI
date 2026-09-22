import React, { useState } from 'react';
import './Assessment.css';
import { Activity, ShieldCheck, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

/**
 * AyuRAG-XAI AssessmentSummary Component
 * Live responsive side-panel displaying real-time profile indicators,
 * completion status, and clinical safety labels.
 */
export const AssessmentSummary = ({
  title = 'Live Profile Indicators',
  subtitle = 'Assessment Signals',
  indicators = [],
  sections = [],
  patientName = '',
  className = ''
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <div className={`ayur-live-profile-panel ${className}`.trim()}>
      {/* Panel Header */}
      <div className="ayur-profile-panel__header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <span className="ayur-profile-pulse-dot" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {subtitle}
            </span>
          </div>
          <span className="ayur-profile-badge-live">Real-time</span>
        </div>
        <h4 className="ayur-profile-panel__title">{title}</h4>
        {patientName && (
          <p className="text-xs text-muted">Profile: <strong className="text-primary">{patientName}</strong></p>
        )}

        {/* Mobile toggle button */}
        <button
          type="button"
          className="ayur-profile-mobile-toggle lg:hidden"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          aria-expanded={isMobileExpanded}
        >
          <span>{isMobileExpanded ? 'Collapse Signals' : 'View Live Signals'}</span>
          {isMobileExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Collapsible Content on mobile, always visible on desktop */}
      <div className={`ayur-profile-panel__content ${isMobileExpanded ? 'ayur-profile-panel__content--open' : ''}`}>
        {/* Indicators List */}
        <div className="ayur-indicators-list">
          {indicators.map((ind) => (
            <div key={ind.id} className="ayur-indicator-row">
              <div className="flex items-center justify-between text-xs mb-2xs">
                <span className="font-medium text-primary">{ind.label}</span>
                <span className="ayur-indicator-status-tag">{ind.status}</span>
              </div>
              <div className="ayur-indicator-meter-wrap">
                <div
                  className="ayur-indicator-meter-bar"
                  style={{ width: `${ind.value}%` }}
                />
              </div>
              {ind.description && (
                <span className="ayur-indicator-desc">{ind.description}</span>
              )}
            </div>
          ))}
        </div>

        {/* Section Checklist */}
        {sections && sections.length > 0 && (
          <div className="ayur-panel-section-checklist">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted mb-xs block">
              Module Sections
            </span>
            <div className="ayur-checklist-items">
              {sections.map((sec, idx) => (
                <div key={sec.id} className="flex items-center justify-between text-xs py-1">
                  <span className="text-secondary truncate pr-2">
                    {idx + 1}. {sec.title}
                  </span>
                  {sec.isComplete ? (
                    <span className="text-success flex items-center gap-2xs shrink-0 font-medium">
                      <CheckCircle2 size={12} /> Done
                    </span>
                  ) : (
                    <span className="text-muted shrink-0 font-mono">
                      {sec.answeredQuestions || 0}/{sec.totalQuestions || 0}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Disclaimer Callout */}
        <div className="ayur-profile-panel__disclaimer">
          <ShieldCheck size={14} className="text-muted shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            These signals represent dynamic profile indicators derived from your self-reported inputs. They are <strong>non-diagnostic</strong> and prepare features for explainable AI reasoning.
          </p>
        </div>
      </div>
    </div>
  );
};
