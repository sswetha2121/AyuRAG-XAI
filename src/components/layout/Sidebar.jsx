import React from 'react';
import './Sidebar.css';
import { Sparkles, ChevronRight, X } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { WORKFLOW_STEPS } from '../../constants/workflow';

/**
 * AyuRAG-XAI Reusable Sidebar Navigation
 */
export const Sidebar = ({
  activeStep = 'design-system',
  onSelectStep,
  isOpen = false,
  onClose,
  completedSteps = [],
  progressPercent = 15,
  className = ''
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="ayur-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`ayur-sidebar ${isOpen ? 'ayur-sidebar--open' : ''} ${className}`.trim()}
        aria-label="Application Navigation"
      >
        {/* Brand Area */}
        <div className="ayur-sidebar__brand">
          <div className="ayur-brand-emblem">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#16382C" />
              <rect x="1.5" y="1.5" width="33" height="33" rx="7.5" stroke="#C5A059" strokeOpacity="0.4" />
              <path
                d="M18 6C13 9 9 14.5 9 21C9 25.5 12.5 29 18 29C23.5 29 27 25.5 27 21C27 14.5 23 9 18 6Z"
                fill="#5B8266"
                fillOpacity="0.4"
              />
              <path
                d="M18 8C13.5 11 10.5 15.5 10.5 20.5C10.5 24.5 13.5 27.5 18 27.5C22.5 27.5 25.5 24.5 25.5 20.5C25.5 15.5 22.5 11 18 8Z"
                stroke="#7D9D85"
                strokeWidth="1.2"
              />
              <path d="M18 9V26" stroke="#C5A059" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="14" cy="16" r="1.5" fill="#C5A059" />
              <circle cx="22" cy="15" r="1.5" fill="#C5A059" />
              <circle cx="14" cy="23" r="1.5" fill="#C5A059" />
              <circle cx="18" cy="9" r="2" fill="#FAF4E8" />
            </svg>
          </div>

          <div className="ayur-brand-info">
            <div className="ayur-brand-title">
              <span>AyuRAG</span>
              <span className="ayur-brand-title__xai">XAI</span>
            </div>
            <span className="ayur-brand-tagline">Clinical Decision Support</span>
          </div>

          {onClose && (
            <button
              type="button"
              className="ayur-sidebar__close-btn"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Assessment Progress Summary Widget */}
        <div className="ayur-sidebar__progress-card">
          <div className="ayur-progress-card__meta">
            <div className="flex items-center gap-xs">
              <Sparkles size={14} className="text-accent" />
              <span className="ayur-progress-card__title">Phase 2 Onboarding</span>
            </div>
            <span className="ayur-progress-card__badge">Step 1/6</span>
          </div>
          <ProgressBar
            value={progressPercent}
            size="sm"
            color="accent"
            showValue={false}
          />
          <div className="ayur-progress-card__footer">
            <span>Assessment Pipeline</span>
            <span>{completedSteps.length}/6 Completed</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="ayur-sidebar__nav-section">
          <span className="ayur-sidebar__section-label">Workflow Pipeline</span>
          <nav className="ayur-sidebar__nav">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isCompleted = completedSteps.includes(step.id);

              return (
                <button
                  key={step.id}
                  type="button"
                  className={`ayur-nav-item ${isActive ? 'ayur-nav-item--active' : ''} ${isCompleted ? 'ayur-nav-item--completed' : ''} ${step.isDevelopment ? 'ayur-nav-item--dev' : ''}`}
                  onClick={() => {
                    onSelectStep?.(step.id);
                    if (window.innerWidth < 1024) onClose?.();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="ayur-nav-item__prefix">
                    <span className="ayur-nav-item__number">{step.number}</span>
                    <span className="ayur-nav-item__icon-wrapper">
                      {isCompleted && !step.isDevelopment ? (
                        <span className="ayur-nav-check">✓</span>
                      ) : (
                        <Icon size={17} />
                      )}
                    </span>
                  </div>

                  <div className="ayur-nav-item__label-group">
                    <span className="ayur-nav-item__label">{step.label}</span>
                    <span className="ayur-nav-item__sublabel">{step.sublabel}</span>
                  </div>

                  {isCompleted && !step.isDevelopment && (
                    <span className="ayur-nav-item__badge-done">Done</span>
                  )}

                  {step.isDevelopment && (
                    <span className="ayur-nav-item__badge">Dev</span>
                  )}

                  <ChevronRight size={14} className="ayur-nav-item__chevron" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile & Clinical Session Footer */}
        <div className="ayur-sidebar__footer">
          <div className="ayur-user-profile">
            <div className="ayur-user-avatar">
              <span>DR</span>
              <span className="ayur-user-status" />
            </div>
            <div className="ayur-user-info">
              <span className="ayur-user-name">Dr. A. Sharma</span>
              <span className="ayur-user-role">Ayurvedic Clinical Lead</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
