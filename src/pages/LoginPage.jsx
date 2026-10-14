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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      const user = await login(username.trim(), password);
      onTriggerToast?.({
        type: 'success',
        title: 'Signed In',
        message: `Welcome back, ${user.name || user.username}.`,
      });

      if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        onLoginSuccess?.(user);
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid username or password. Please verify your credentials.');
    }
  };

  return (
    <div className="ayur-auth-page">
      <div className="ayur-auth-card">
        {/* Back Link */}
        <div className="ayur-auth-top-bar">
          <Link to="/" className="ayur-auth-back-link" title="Return to Home">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span className="ayur-auth-tag">PATIENT PORTAL</span>
        </div>

        {/* Brand Header */}
        <div className="ayur-auth-header">
          <div className="ayur-auth-emblem">
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

          <h1 className="ayur-auth-title">Patient Sign In</h1>
          <p className="ayur-auth-subtitle">
            Access your personalized meal timetable, wellness recommendations, and progress records.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="ayur-auth-error-alert" role="alert">
            <AlertCircle size={17} className="shrink-0 text-error" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="ayur-auth-form" noValidate>
          <FormField label="Username or Email" htmlFor="auth-username" required>
            <div className="ayur-input-wrap">
              <span className="ayur-input-icon">
                <User size={17} />
              </span>
              <input
                id="auth-username"
                type="text"
                className="ayur-input ayur-input--has-icon"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter username or email"
                autoComplete="username"
                required
              />
            </div>
          </FormField>

          <FormField label="Password" htmlFor="auth-password" required>
            <div className="ayur-input-wrap">
              <span className="ayur-input-icon">
                <Lock size={17} />
              </span>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className="ayur-input ayur-input--has-icon ayur-input--has-action"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="ayur-input-action-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <Button
            variant="primary"
            size="md"
            type="submit"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight size={16} />}
            className="mt-xs"
          >
            Sign In to Patient Portal
          </Button>
        </form>

        {/* Registration Redirection */}
        <div className="ayur-auth-switch">
          <span>New to AyuRAG-XAI?</span>
          <Link to="/signup" className="ayur-auth-switch-link">
            Create an Account →
          </Link>
        </div>

        {/* Doctor Portal Callout */}
        <div className="ayur-auth-doc-box">
          <Stethoscope size={18} className="text-secondary shrink-0" />
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
          <ShieldCheck size={14} className="text-secondary shrink-0" />
          <span>Patient data is isolated and protected under role-based authorization.</span>
        </div>
      </div>
    </div>
  );
};
