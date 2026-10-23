import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = ({ onLoginSuccess, onTriggerToast }) => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Please enter your username or email address.';
    }
    if (!password) {
      errors.password = 'Please enter your password.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const user = await login(username.trim(), password);
      onTriggerToast?.({
        type: 'success',
        title: 'Sign In Successful',
        message: `Welcome back, ${user.name || user.username}.`,
      });

      if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        onLoginSuccess?.(user);
        navigate('/dashboard');
      }
    } catch (err) {
      // Map error into understandable feedback
      if (err.status === 401) {
        setErrorMessage('Invalid username/email or password. Please verify your credentials and try again.');
      } else if (err.status === 403) {
        setErrorMessage(err.message || 'Access denied. Account is awaiting verification or unauthorized.');
      } else if (err.status === 503 || err.status === 504) {
        setErrorMessage('The clinical backend service is currently unreachable. Please ensure the Django API server is active.');
      } else {
        setErrorMessage(err.message || 'Authentication error. Please check your network connection.');
      }
    }
  };

  return (
    <div className="ayur-auth-page">
      {/* Botanical Decorative Background Shapes */}
      <div className="ayur-auth-botanical-bg" aria-hidden="true">
        <div className="botanical-shape shape-1">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 15C50 40 15 85 20 145C65 150 140 140 180 85C165 40 135 20 100 15Z"
              fill="#A8BDA7"
              fillOpacity="0.24"
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
              fillOpacity="0.32"
            />
          </svg>
        </div>
      </div>

      <div className="ayur-auth-card">
        {/* Top Navigation Bar with links back to Role Selection & Home */}
        <div className="ayur-auth-top-bar">
          <Link to="/signin" className="ayur-auth-back-link" title="Change your sign-in role">
            <ArrowLeft size={16} />
            <span>Role Selection</span>
          </Link>
          <span className="ayur-auth-tag">PATIENT PORTAL</span>
        </div>

        {/* Brand Header */}
        <div className="ayur-auth-header">
          <div className="ayur-auth-emblem">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="36" height="36" rx="9" fill="#123B2F" />
              <rect x="1.5" y="1.5" width="33" height="33" rx="7.5" stroke="#C5A45D" strokeOpacity="0.45" />
              <path
                d="M18 6C13 9 9 14.5 9 21C9 25.5 12.5 29 18 29C23.5 29 27 25.5 27 21C27 14.5 23 9 18 6Z"
                fill="#A8BDA7"
                fillOpacity="0.35"
              />
              <path d="M18 9V26" stroke="#C5A45D" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="18" cy="8.5" r="2" fill="#F8F6F0" />
            </svg>
          </div>

          <h1 className="ayur-auth-title">Patient Sign In</h1>
          <p className="ayur-auth-subtitle">
            Access your personalized constitutional profile, grounded dietary timetable, and progress records.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="ayur-auth-error-alert" role="alert">
            <AlertCircle size={18} className="shrink-0 text-error" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="ayur-auth-form" noValidate>
          <FormField
            label="Username or Email Address"
            htmlFor="auth-username"
            required
            error={fieldErrors.username}
          >
            <div className="ayur-input-wrap">
              <span className="ayur-input-icon">
                <User size={18} />
              </span>
              <input
                id="auth-username"
                type="text"
                className={`ayur-input ayur-input--has-icon ${fieldErrors.username ? 'ayur-input--error' : ''}`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: '' }));
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. your.email@example.com"
                autoComplete="username"
                required
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.username)}
              />
            </div>
          </FormField>

          <FormField
            label="Password"
            htmlFor="auth-password"
            required
            error={fieldErrors.password}
          >
            <div className="ayur-input-wrap">
              <span className="ayur-input-icon">
                <Lock size={18} />
              </span>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className={`ayur-input ayur-input--has-icon ayur-input--has-action ${fieldErrors.password ? 'ayur-input--error' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.password)}
              />
              <button
                type="button"
                className="ayur-input-action-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            rightIcon={<ArrowRight size={18} />}
            className="ayur-auth-submit-btn"
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In as Patient'}
          </Button>
        </form>

        {/* Registration Redirection */}
        <div className="ayur-auth-switch">
          <span>New to AyuRAG-XAI?</span>
          <Link to="/signup" className="ayur-auth-switch-link">
            Create a Patient Account →
          </Link>
        </div>

        {/* Doctor Portal Callout */}
        <div className="ayur-auth-doc-box">
          <Stethoscope size={20} className="text-secondary shrink-0" />
          <div className="flex-1 text-left">
            <span className="font-semibold text-xs text-primary block">Are you a Medical Doctor?</span>
            <span className="text-xs text-muted block">Access the clinical review workspace</span>
          </div>
          <Link to="/doctor-login" className="ayur-auth-doc-link">
            Doctor Login →
          </Link>
        </div>

        {/* Security Footer */}
        <div className="ayur-auth-footer">
          <ShieldCheck size={15} className="text-secondary shrink-0" />
          <span>Patient records are confidential and isolated under role-based authorization.</span>
        </div>
      </div>
    </div>
  );
};
