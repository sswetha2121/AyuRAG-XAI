import React, { useState } from 'react';
import './Sidebar.css';
import {
  ChevronRight,
  ChevronLeft,
  X,
  User,
  LogOut,
  Stethoscope,
  Activity,
  LayoutDashboard,
  Utensils,
  HeartPulse,
  Bell,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProgressBar } from '../ui/ProgressBar';
import { WORKFLOW_STEPS, PATIENT_PORTAL_NAV_ITEMS, PATIENT_UTILITY_ITEMS } from '../../constants/workflow';
import { DOCTOR_NAV_ITEMS, DOCTOR_UTILITY_ITEMS } from '../../constants/doctorNav';
import { useAssessment } from '../../context/AssessmentContext';

/**
 * AyuRAG-XAI Unified Responsive Application Sidebar
 * Handles separate role-specific navigation for Patient and Doctor workspaces.
 */
export const Sidebar = ({
  mode = 'patient', // 'patient' | 'doctor'
  activeStep = 'overview',
  onSelectStep,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  progressPercent = 15,
  user = null,
  onLogout,
  onOpenNotifications,
  unreadNotificationCount = 0,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  let assessmentContext = null;
  try {
    assessmentContext = useAssessment();
  } catch (e) {
    // Outside assessment provider
  }
  const patientFullName = assessmentContext?.personalInfo?.fullName;
  const completedSteps = assessmentContext?.completedSteps || [];

  const isDoctor = mode === 'doctor';
  const isAssessmentFlow = [
    'personal-info',
    'prakriti',
    'lifestyle',
    'diet',
    'symptoms',
    'review'
  ].includes(activeStep);

  const displayName = isDoctor
    ? user?.name || 'Attending Physician'
    : user?.name || patientFullName || 'Patient';

  const displayRole = isDoctor
    ? 'Ayurvedic Clinical Lead'
    : (user ? 'Registered Patient' : 'Intake Assessment');

  const currentStepNumber = isAssessmentFlow
    ? WORKFLOW_STEPS.findIndex((s) => s.id === activeStep) + 1
    : 0;

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
        className={`ayur-sidebar ${isOpen ? 'ayur-sidebar--open' : ''} ${isCollapsed ? 'ayur-sidebar--collapsed' : ''} ${className}`.trim()}
        aria-label="Application Navigation"
      >
        {/* Brand Area */}
        <div
          className="ayur-sidebar__brand cursor-pointer"
          onClick={() => navigate('/')}
          title="Return to AyuRAG-XAI Home"
        >
          <div className="ayur-brand-emblem" title="AyuRAG-XAI">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#16382C" />
              <rect x="1.5" y="1.5" width="33" height="33" rx="7.5" stroke="#C5A059" strokeOpacity="0.45" />
              <path
                d="M18 6C13 9 9 14.5 9 21C9 25.5 12.5 29 18 29C23.5 29 27 25.5 27 21C27 14.5 23 9 18 6Z"
                fill="#5B8266"
                fillOpacity="0.45"
              />
              <path d="M18 9V26" stroke="#C5A059" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="14" cy="16" r="1.5" fill="#C5A059" />
              <circle cx="22" cy="15" r="1.5" fill="#C5A059" />
              <circle cx="18" cy="9" r="2" fill="#FAF4E8" />
            </svg>
          </div>

          <div className="ayur-brand-info">
            <div className="ayur-brand-title">
              <span>AyuRAG</span>
              <span className="ayur-brand-title__xai">XAI</span>
            </div>
            <span className="ayur-brand-tagline">
              {isDoctor ? 'Clinical Workspace' : 'Personalized Wellness'}
            </span>
          </div>

          {/* Desktop Sidebar Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              className="ayur-sidebar__collapse-btn"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          )}

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

        {/* 1. DOCTOR MODE */}
        {isDoctor && (
          <>
            <div className="ayur-sidebar__doctor-badge-card">
              <div className="flex items-center gap-xs">
                <Stethoscope size={15} className="text-secondary flex-shrink-0" />
                <span className="ayur-doctor-badge-title">Clinical Decision Support</span>
              </div>
              <span className="ayur-doctor-badge-role">Physician Access</span>
            </div>

            <div className="ayur-sidebar__nav-section">
              <span className="ayur-sidebar__section-label">Doctor Workspace</span>
              <nav className="ayur-sidebar__nav">
                {DOCTOR_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeStep === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`ayur-nav-item ${isActive ? 'ayur-nav-item--active' : ''}`}
                      onClick={() => {
                        if (item.id === 'doctor-notifications') {
                          onOpenNotifications?.();
                        } else {
                          onSelectStep?.(item.id);
                        }
                        if (window.innerWidth < 1024) onClose?.();
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      title={isCollapsed ? `${item.label} (${item.sublabel})` : undefined}
                    >
                      <div className="ayur-nav-item__prefix">
                        <span className="ayur-nav-item__icon-wrapper">
                          <Icon size={17} />
                        </span>
                      </div>

                      <div className="ayur-nav-item__label-group">
                        <span className="ayur-nav-item__label">{item.label}</span>
                        {item.sublabel && (
                          <span className="ayur-nav-item__sublabel">{item.sublabel}</span>
                        )}
                      </div>

                      {item.id === 'doctor-notifications' && unreadNotificationCount > 0 && (
                        <span className="ayur-nav-item__badge ayur-nav-item__badge--warning">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Doctor Utility Actions */}
            <div className="ayur-sidebar__utility-section">
              {DOCTOR_UTILITY_ITEMS.map((uItem) => {
                const Icon = uItem.icon;
                return (
                  <button
                    key={uItem.id}
                    type="button"
                    className={`ayur-nav-item ayur-nav-item--utility ${uItem.isDanger ? 'ayur-nav-item--danger' : ''}`}
                    onClick={() => {
                      if (uItem.id === 'logout') {
                        onLogout?.();
                      } else {
                        onSelectStep?.(uItem.id);
                      }
                    }}
                    title={isCollapsed ? uItem.label : undefined}
                  >
                    <div className="ayur-nav-item__prefix">
                      <span className="ayur-nav-item__icon-wrapper">
                        <Icon size={16} />
                      </span>
                    </div>
                    <div className="ayur-nav-item__label-group">
                      <span className="ayur-nav-item__label">{uItem.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 2. PATIENT ASSESSMENT FLOW MODE */}
        {!isDoctor && isAssessmentFlow && (
          <>
            <div className="ayur-sidebar__progress-card">
              <div className="ayur-progress-card__meta">
                <div className="flex items-center gap-xs">
                  <Sparkles size={14} className="text-accent" />
                  <span className="ayur-progress-card__title">Intake Progress</span>
                </div>
                <span className="ayur-progress-card__badge">Step {currentStepNumber}/6</span>
              </div>
              <ProgressBar
                value={progressPercent}
                size="sm"
                color="accent"
                showValue={false}
              />
              <div className="ayur-progress-card__footer">
                <span>Completed</span>
                <span>{completedSteps.length} of 6 steps</span>
              </div>
            </div>

            <div className="ayur-sidebar__nav-section">
              <span className="ayur-sidebar__section-label">Assessment Steps</span>
              <nav className="ayur-sidebar__nav">
                {WORKFLOW_STEPS.map((step) => {
                  const Icon = step.icon;
                  const isActive = activeStep === step.id;
                  const isDone = completedSteps.includes(step.id);

                  return (
                    <button
                      key={step.id}
                      type="button"
                      className={`ayur-nav-item ${isActive ? 'ayur-nav-item--active' : ''} ${isDone ? 'ayur-nav-item--completed' : ''}`}
                      onClick={() => {
                        onSelectStep?.(step.id);
                        if (window.innerWidth < 1024) onClose?.();
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      title={isCollapsed ? `${step.number} ${step.label}` : undefined}
                    >
                      <div className="ayur-nav-item__prefix">
                        <span className="ayur-nav-item__number">{step.number}</span>
                        <span className="ayur-nav-item__icon-wrapper">
                          {isDone ? (
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

                      {isDone && (
                        <span className="ayur-nav-item__badge-done">Done</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Exit Assessment link */}
            <div className="ayur-sidebar__utility-section">
              <button
                type="button"
                className="ayur-nav-item ayur-nav-item--utility"
                onClick={() => {
                  onSelectStep?.('dashboard');
                  navigate('/dashboard');
                }}
              >
                <div className="ayur-nav-item__prefix">
                  <span className="ayur-nav-item__icon-wrapper">
                    <ArrowLeft size={16} />
                  </span>
                </div>
                <div className="ayur-nav-item__label-group">
                  <span className="ayur-nav-item__label">Exit to Dashboard</span>
                </div>
              </button>
            </div>
          </>
        )}

        {/* 3. PATIENT PORTAL (DASHBOARD) MODE */}
        {!isDoctor && !isAssessmentFlow && (
          <>
            <div className="ayur-sidebar__nav-section">
              <span className="ayur-sidebar__section-label">Patient Navigation</span>
              <nav className="ayur-sidebar__nav">
                {PATIENT_PORTAL_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeStep === item.id || (activeStep === 'dashboard' && item.id === 'dashboard-overview');

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`ayur-nav-item ${isActive ? 'ayur-nav-item--active' : ''}`}
                      onClick={() => {
                        if (item.id === 'patient-notifications') {
                          onOpenNotifications?.();
                        } else if (item.id === 'my-assessment') {
                          navigate('/assessment-overview');
                        } else {
                          onSelectStep?.(item.id, item.tab);
                        }
                        if (window.innerWidth < 1024) onClose?.();
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      title={isCollapsed ? `${item.label} (${item.sublabel})` : undefined}
                    >
                      <div className="ayur-nav-item__prefix">
                        <span className="ayur-nav-item__icon-wrapper">
                          <Icon size={17} />
                        </span>
                      </div>

                      <div className="ayur-nav-item__label-group">
                        <span className="ayur-nav-item__label">{item.label}</span>
                        {item.sublabel && (
                          <span className="ayur-nav-item__sublabel">{item.sublabel}</span>
                        )}
                      </div>

                      {item.id === 'patient-notifications' && unreadNotificationCount > 0 && (
                        <span className="ayur-nav-item__badge ayur-nav-item__badge--warning">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Patient Utility Actions */}
            <div className="ayur-sidebar__utility-section">
              {PATIENT_UTILITY_ITEMS.map((uItem) => {
                const Icon = uItem.icon;
                return (
                  <button
                    key={uItem.id}
                    type="button"
                    className={`ayur-nav-item ayur-nav-item--utility ${uItem.isDanger ? 'ayur-nav-item--danger' : ''}`}
                    onClick={() => {
                      if (uItem.id === 'logout') {
                        onLogout?.();
                      } else {
                        onSelectStep?.(uItem.id);
                      }
                    }}
                    title={isCollapsed ? uItem.label : undefined}
                  >
                    <div className="ayur-nav-item__prefix">
                      <span className="ayur-nav-item__icon-wrapper">
                        <Icon size={16} />
                      </span>
                    </div>
                    <div className="ayur-nav-item__label-group">
                      <span className="ayur-nav-item__label">{uItem.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* User Session Footer */}
        <div className="ayur-sidebar__footer">
          <div
            className="ayur-user-profile"
            title={
              isCollapsed
                ? `${displayName} (${displayRole})`
                : undefined
            }
          >
            <div className="ayur-user-avatar">
              <span>{isDoctor ? 'DR' : 'PT'}</span>
              <span className="ayur-user-status" />
            </div>
            <div className="ayur-user-info">
              <span className="ayur-user-name">
                {displayName}
              </span>
              <span className="ayur-user-role">
                {displayRole}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
