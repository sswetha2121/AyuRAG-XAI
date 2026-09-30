import React, { useState } from 'react';
import './Sidebar.css';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  User,
  Settings,
  LogOut,
  Stethoscope,
  Activity
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { WORKFLOW_STEPS } from '../../constants/workflow';
import { DOCTOR_NAV_ITEMS, DOCTOR_UTILITY_ITEMS } from '../../constants/doctorNav';

/**
 * AyuRAG-XAI Reusable Sidebar Navigation
 * Supports both Patient Assessment Pipeline and Doctor Decision Support Workspace
 */
export const Sidebar = ({
  mode = 'patient', // 'patient' | 'doctor'
  activeStep = 'design-system',
  onSelectStep,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  completedSteps = [],
  progressPercent = 15,
  user = null,
  onLogout,
  className = ''
}) => {
  const [expandedMenus, setExpandedMenus] = useState({
    'doctor-patients': true,
    'doctor-ai-analysis': true,
  });

  const toggleSubmenu = (menuId, e) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const isDoctor = mode === 'doctor';

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
        <div className="ayur-sidebar__brand">
          <div className="ayur-brand-emblem" title="AyuRAG-XAI Decision Support">
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

        {/* Patient Pipeline Progress Card (Patient mode only) */}
        {!isDoctor && (
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
        )}

        {/* Doctor Active Session Card (Doctor mode only) */}
        {isDoctor && (
          <div className="ayur-sidebar__doctor-badge-card">
            <div className="flex items-center gap-xs">
              <Stethoscope size={15} className="text-accent flex-shrink-0" />
              <span className="ayur-doctor-badge-title">Clinical Workspace</span>
            </div>
            <span className="ayur-doctor-badge-role">Doctor Access</span>
          </div>
        )}

        {/* Navigation Section */}
        <div className="ayur-sidebar__nav-section">
          <span className="ayur-sidebar__section-label">
            {isDoctor ? 'Clinical Workflow' : 'Workflow Pipeline'}
          </span>

          <nav className="ayur-sidebar__nav">
            {/* DOCTOR NAVIGATION ITEMS */}
            {isDoctor ? (
              DOCTOR_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeStep === item.id || activeStep.startsWith(item.id);
                const hasSub = Boolean(item.subItems?.length);
                const isExpanded = expandedMenus[item.id];

                return (
                  <div key={item.id} className="ayur-nav-group-wrapper">
                    <button
                      type="button"
                      className={`ayur-nav-item ${isActive ? 'ayur-nav-item--active' : ''}`}
                      onClick={() => {
                        onSelectStep?.(item.id);
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

                      {item.badge && (
                        <span className={`ayur-nav-item__badge ${item.badgeVariant ? `ayur-nav-item__badge--${item.badgeVariant}` : ''}`}>
                          {item.badge}
                        </span>
                      )}

                      {hasSub && !isCollapsed && (
                        <span
                          className="ayur-nav-item__expand-arrow"
                          onClick={(e) => toggleSubmenu(item.id, e)}
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      )}
                    </button>

                    {/* Submenu items for Doctor */}
                    {hasSub && isExpanded && !isCollapsed && (
                      <div className="ayur-nav-subgroup">
                        {item.subItems.map((sub) => {
                          const isSubActive = activeStep === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              className={`ayur-nav-subitem ${isSubActive ? 'ayur-nav-subitem--active' : ''}`}
                              onClick={() => {
                                onSelectStep?.(sub.id);
                                if (window.innerWidth < 1024) onClose?.();
                              }}
                            >
                              <span>{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* PATIENT ASSESSMENT PIPELINE STEPS */
              WORKFLOW_STEPS.map((step) => {
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
                    title={isCollapsed ? `${step.number} ${step.label} (${step.sublabel})` : undefined}
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
              })
            )}
          </nav>
        </div>

        {/* Doctor Utility Actions (Settings, Logout) */}
        {isDoctor && (
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
        )}

        {/* Profile & Clinical Session Footer */}
        <div className="ayur-sidebar__footer">
          <div
            className="ayur-user-profile"
            title={
              isCollapsed
                ? isDoctor
                  ? `${user?.name || 'Dr. A. Sharma'} (Ayurvedic Clinical Lead)`
                  : 'Patient Session'
                : undefined
            }
          >
            <div className="ayur-user-avatar">
              <span>{isDoctor ? 'DR' : 'PT'}</span>
              <span className="ayur-user-status" />
            </div>
            <div className="ayur-user-info">
              <span className="ayur-user-name">
                {isDoctor ? user?.name || 'Dr. A. Sharma' : user?.name || 'Swetha Chowdary'}
              </span>
              <span className="ayur-user-role">
                {isDoctor ? 'Ayurvedic Clinical Lead' : 'Registered Patient'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
