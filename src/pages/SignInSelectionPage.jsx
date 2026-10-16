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
  CheckCircle2
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
      title: 'Patient',
      badge: 'Personalized Care',
      icon: User,
      description: 'Access your assessments and personalized wellness plan.',
      actionLabel: 'Continue as Patient',
      onClick: () => navigate('/login'),
      featured: true,
      footnote: 'Have an account or ready to sign in',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      badge: 'Physician Workspace',
      icon: Stethoscope,
      description: 'Review authorized patient assessments and care plans.',
      actionLabel: 'Continue as Doctor',
      onClick: () => navigate('/doctor-login'),
      featured: false,
      footnote: 'Requires verified clinical credentials',
    },
    {
      id: 'normal-user',
      title: 'Normal User',
      badge: 'Public & Guest Access',
      icon: Compass,
      description: 'Access general platform information and features available without a patient or doctor account.',
      actionLabel: 'Continue as Normal User',
      onClick: handleNormalUserContinue,
      featured: false,
      footnote: 'No credentials required to explore',
    },
  ];

  return (
    <div className="ayur-role-page">
      <div className="ayur-role-container">
        {/* Navigation Bar */}
        <div className="ayur-role-top-nav">
          <Link to="/" className="ayur-role-back-link" title="Return to Home">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <span className="ayur-role-portal-tag">AyuRAG-XAI Access</span>
        </div>

        {/* Header */}
        <div className="ayur-role-header">
          <div className="ayur-role-emblem">
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
          <h1 className="ayur-role-title">Sign In to AyuRAG-XAI</h1>
          <p className="ayur-role-subtitle">
            Choose your role to access your personalized wellness plan, physician decision workspace, or explore platform features.
          </p>
        </div>

        {/* 3-Column Role Options */}
        <div className="ayur-role-grid">
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
                  <div className="ayur-role-icon-box">
                    <IconComponent size={22} className="ayur-role-icon" />
                  </div>
                  <span className="ayur-role-badge">{role.badge}</span>
                </div>

                <div className="ayur-role-card__body">
                  <h2 className="ayur-role-card__title">{role.title}</h2>
                  <p className="ayur-role-card__desc">{role.description}</p>
                </div>

                <div className="ayur-role-card__footer">
                  <button
                    type="button"
                    className="ayur-role-action-btn"
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

        {/* Registration Redirection */}
        <div className="ayur-role-bottom-box">
          <div className="ayur-role-register-hint">
            <span>First time using AyuRAG-XAI?</span>
            <Link to="/signup" className="ayur-role-register-link">
              Create a Patient Account →
            </Link>
          </div>

          <div className="ayur-role-security-note">
            <ShieldCheck size={14} className="text-secondary shrink-0" />
            <span>Role-based clinical governance ensures patient privacy and restricted doctor authorization.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
