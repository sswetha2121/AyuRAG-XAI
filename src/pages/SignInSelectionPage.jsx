import React from 'react';
import './SignInSelectionPage.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Stethoscope,
  Compass,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileCheck
} from 'lucide-react';

export const SignInSelectionPage = ({ onTriggerToast }) => {
  const navigate = useNavigate();

  const handleNormalUserContinue = () => {
    onTriggerToast?.({
      type: 'info',
      title: 'Continuing as Guest',
      message: 'You are browsing public platform information and the assessment overview. Register or sign in anytime to save your records.',
    });
    navigate('/assessment-overview');
  };

  const roles = [
    {
      id: 'patient',
      title: 'Patient Portal',
      badge: 'Personalized Care',
      badgeType: 'patient',
      icon: User,
      description: 'Access your constitutional profile, grounded nutrition plan, and track your daily wellness routine.',
      actionLabel: 'Sign In as Patient',
      onClick: () => navigate('/login'),
      featured: true,
      footnote: 'For individuals seeking evidence-based Ayurvedic guidance',
      meta: ['Personalized Prakriti', 'Dietary Timetable', 'Doctor Consultations']
    },
    {
      id: 'doctor',
      title: 'Doctor Portal',
      badge: 'Clinical Workspace',
      badgeType: 'doctor',
      icon: Stethoscope,
      description: 'Clinical decision support workspace for reviewing patient dossiers, SHAP attributions, and signing off regimens.',
      actionLabel: 'Sign In as Doctor',
      onClick: () => navigate('/doctor-login'),
      featured: false,
      footnote: 'Restricted to licensed practitioners (requires verification)',
      meta: ['Intake Cohort Registry', 'XAI Factor Attribution', 'Regimen Authorization']
    },
    {
      id: 'normal-user',
      title: 'Public Explorer',
      badge: 'Guest Access',
      badgeType: 'guest',
      icon: Compass,
      description: 'Explore platform methodology, classical Samhita sources, and constitutional assessment overview without an account.',
      actionLabel: 'Explore as Guest',
      onClick: handleNormalUserContinue,
      featured: false,
      footnote: 'No credentials needed to explore platform features',
      meta: ['Methodology & Principles', 'Assessment Overview', 'No Login Required']
    },
  ];

  return (
    <div className="ayur-role-page">
      {/* Botanical Decorative Background Shapes */}
      <div className="ayur-auth-botanical-bg" aria-hidden="true">
        <div className="botanical-shape shape-1">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 15C50 40 15 85 20 145C65 150 140 140 180 85C165 40 135 20 100 15Z"
              fill="#A8BDA7"
              fillOpacity="0.25"
            />
            <path d="M40 135C75 105 110 75 160 55" stroke="#C5A45D" strokeWidth="1.2" strokeOpacity="0.3" />
          </svg>
        </div>
        <div className="botanical-shape shape-2">
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="120" cy="120" r="100" stroke="#123B2F" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="6 6" />
            <path
              d="M120 40C85 65 60 105 65 160C105 165 160 145 185 105C170 65 150 45 120 40Z"
              fill="#E8DDC9"
              fillOpacity="0.35"
            />
          </svg>
        </div>
      </div>

      <div className="ayur-role-container">
        {/* Navigation Bar */}
        <div className="ayur-role-top-nav">
          <Link to="/" className="ayur-role-back-link" title="Return to Home">
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </Link>
          <span className="ayur-role-portal-tag">AyuRAG-XAI Access Gateway</span>
        </div>

        {/* Header */}
        <div className="ayur-role-header">
          <div className="ayur-role-emblem">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="40" height="40" rx="10" fill="#123B2F" />
              <rect x="1.5" y="1.5" width="37" height="37" rx="8.5" stroke="#C5A45D" strokeOpacity="0.4" />
              <path
                d="M20 7C14.5 11 10.5 17 10.5 24C10.5 29 14.8 32.5 20 32.5C25.2 32.5 29.5 29 29.5 24C29.5 17 25.5 11 20 7Z"
                fill="#A8BDA7"
                fillOpacity="0.35"
              />
              <path d="M20 10V29" stroke="#C5A45D" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="20" cy="9.5" r="2" fill="#F8F6F0" />
            </svg>
          </div>
          <h1 className="ayur-role-title">Choose Your Access Portal</h1>
          <p className="ayur-role-subtitle">
            Select your role to access your personalized wellness plan, physician decision workspace, or explore public platform capabilities.
          </p>
        </div>

        {/* 3-Column Role Options */}
        <div className="ayur-role-grid" role="group" aria-label="Role selection options">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <div
                key={role.id}
                className={`ayur-role-card ${role.featured ? 'ayur-role-card--featured' : ''}`}
                onClick={role.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    role.onClick();
                  }
                }}
                aria-label={role.actionLabel}
              >
                <div className="ayur-role-card__top">
                  <div className={`ayur-role-icon-box ${role.badgeType}`}>
                    <IconComponent size={24} className="ayur-role-icon" />
                  </div>
                  <span className={`ayur-role-badge ${role.badgeType}`}>{role.badge}</span>
                </div>

                <div className="ayur-role-card__body">
                  <h2 className="ayur-role-card__title">{role.title}</h2>
                  <p className="ayur-role-card__desc">{role.description}</p>

                  <ul className="ayur-role-meta-list">
                    {role.meta.map((item, idx) => (
                      <li key={idx} className="ayur-role-meta-item">
                        <CheckCircle2 size={13} className="text-secondary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ayur-role-card__footer">
                  <button
                    type="button"
                    className={`ayur-role-action-btn ${role.featured ? 'primary' : 'outline'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      role.onClick();
                    }}
                  >
                    <span>{role.actionLabel}</span>
                    <ArrowRight size={16} className="ayur-role-arrow" />
                  </button>
                  <span className="ayur-role-footnote">{role.footnote}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Redirection & Security Assurance */}
        <div className="ayur-role-bottom-box">
          <div className="ayur-role-register-hint">
            <span>First time using AyuRAG-XAI?</span>
            <Link to="/signup" className="ayur-role-register-link">
              Create a Patient Account →
            </Link>
            <span className="text-muted text-xs">•</span>
            <Link to="/doctor-register" className="ayur-role-register-link">
              Register as Doctor →
            </Link>
          </div>

          <div className="ayur-role-security-note">
            <ShieldCheck size={16} className="text-primary shrink-0" />
            <span>
              Role-based clinical governance ensures patient privacy and restricted doctor authorization.
              Selecting a role navigates to the dedicated credential gateway; backend authorization enforces all permissions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
