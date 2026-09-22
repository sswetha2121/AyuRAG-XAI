import React from 'react';
import './Assessment.css';
import { ProgressBar } from '../ui/ProgressBar';
import { Check } from 'lucide-react';

/**
 * AyuRAG-XAI AssessmentProgress Component
 * Visualizes dynamic progress across visible questions and sections.
 */
export const AssessmentProgress = ({
  sections = [],
  activeSectionIndex = 0,
  onSelectSection,
  totalRelevant = 0,
  answeredCount = 0,
  percent = 0,
  domainTitle = 'Assessment'
}) => {
  return (
    <div className="ayur-assessment-progress-wrapper">
      {/* Top Bar: Progress percentage & count */}
      <div className="ayur-progress-bar-block">
        <div className="flex items-center justify-between text-xs mb-2xs">
          <span className="font-semibold text-primary">
            {domainTitle} Progress
          </span>
          <span className="font-mono text-muted">
            {answeredCount} of {totalRelevant} Answered ({percent}%)
          </span>
        </div>
        <ProgressBar value={percent} color="accent" size="sm" />
      </div>

      {/* Section Trackers */}
      {sections.length > 1 && (
        <div className="ayur-section-tabs" role="tablist" aria-label="Assessment Sections">
          {sections.map((sec, idx) => {
            const isActive = idx === activeSectionIndex;
            const isCompleted = sec.isComplete;

            return (
              <button
                key={sec.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`ayur-section-tab ${isActive ? 'ayur-section-tab--active' : ''} ${isCompleted ? 'ayur-section-tab--completed' : ''}`}
                onClick={() => onSelectSection?.(idx)}
              >
                <span className="ayur-section-tab__bullet">
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : idx + 1}
                </span>
                <span className="ayur-section-tab__title">{sec.title}</span>
                {sec.answeredQuestions !== undefined && (
                  <span className="ayur-section-tab__count">
                    {sec.answeredQuestions}/{sec.totalQuestions}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
