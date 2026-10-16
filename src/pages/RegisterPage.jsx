import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  Mail,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage = ({ onLoginSuccess, onTriggerToast }) => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    age: '',
    gender: 'Female',
    location: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const errors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }

    // Email format validation
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    // Age validation
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.age = 'Enter a valid age (1-120).';
    }

    // Gender validation
    if (!formData.gender) {
      errors.gender = 'Please select a gender.';
    }

    // Password validation (enforcing backend >= 8 chars)
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    try {
      const user = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        username: formData.username.trim() || formData.email.trim().split('@')[0],
        password: formData.password,
        age: formData.age,
        gender: formData.gender,
        location: formData.location.trim(),
      });

      onTriggerToast?.({
        type: 'success',
        title: 'Account Registered',
        message: `Welcome to AyuRAG-XAI, ${user.name || user.username}!`,
      });

      onLoginSuccess?.(user);
      navigate('/assessment-overview');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your information and try again.');
    }
  };

  return (
    <div className="ayur-auth-page">
      <div className="ayur-auth-card ayur-auth-card--register">
        {/* Top Navigation */}
        <div className="ayur-auth-top-bar">
          <Link to="/" className="ayur-auth-back-link" title="Return to Home">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span className="ayur-auth-tag">PATIENT REGISTRATION</span>
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

          <h1 className="ayur-auth-title">Create Patient Account</h1>
          <p className="ayur-auth-subtitle">
            Register to take your personalized constitutional assessment and track your physician-reviewed nutrition plan.
          </p>
        </div>

        {/* Global Server Error Alert */}
        {serverError && (
          <div className="ayur-auth-error-alert" role="alert">
            <AlertCircle size={17} className="shrink-0 text-error" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="ayur-auth-form" noValidate>
          {/* Group 1: Account Information */}
          <div className="ayur-form-section">
            <div className="ayur-form-section__header">
              <span className="ayur-form-section__title">Account Information</span>
            </div>
            <div className="ayur-form-grid-2">
              <div className="ayur-form-field">
                <label htmlFor="reg-fullname" className="ayur-label">
                  Full Name <span className="ayur-required-mark" aria-hidden="true">*</span>
                </label>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon">
                    <User size={16} />
                  </span>
                  <input
                    id="reg-fullname"
                    type="text"
                    className={`ayur-input ayur-input--has-icon ${fieldErrors.fullName ? 'ayur-input--error' : ''}`}
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>
                {fieldErrors.fullName && (
                  <span className="ayur-field-error" role="alert">{fieldErrors.fullName}</span>
                )}
              </div>

              <div className="ayur-form-field">
                <label htmlFor="reg-email" className="ayur-label">
                  Email Address <span className="ayur-required-mark" aria-hidden="true">*</span>
                </label>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon">
                    <Mail size={16} />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    className={`ayur-input ayur-input--has-icon ${fieldErrors.email ? 'ayur-input--error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <span className="ayur-field-error" role="alert">{fieldErrors.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Group 2: Personal Details */}
          <div className="ayur-form-section">
            <div className="ayur-form-section__header">
              <span className="ayur-form-section__title">Personal Details</span>
            </div>
            <div className="ayur-form-grid-2">
              <div className="ayur-form-field">
                <label htmlFor="reg-age" className="ayur-label">
                  Age (Years) <span className="ayur-required-mark" aria-hidden="true">*</span>
                </label>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon">
                    <Calendar size={16} />
                  </span>
                  <input
                    id="reg-age"
                    type="number"
                    min="1"
                    max="120"
                    className={`ayur-input ayur-input--has-icon ${fieldErrors.age ? 'ayur-input--error' : ''}`}
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="Years (e.g. 28)"
                    required
                  />
                </div>
                {fieldErrors.age && (
                  <span className="ayur-field-error" role="alert">{fieldErrors.age}</span>
                )}
              </div>

              <div className="ayur-form-field">
                <label htmlFor="reg-gender" className="ayur-label">
                  Gender <span className="ayur-required-mark" aria-hidden="true">*</span>
                </label>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon">
                    <Users size={16} />
                  </span>
                  <select
                    id="reg-gender"
                    className="ayur-input ayur-input--has-icon ayur-select"
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    required
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="ayur-form-field mt-xs">
              <label htmlFor="reg-location" className="ayur-label">
                City / Region <span className="ayur-optional-mark">(Optional)</span>
              </label>
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <MapPin size={16} />
                </span>
                <input
                  id="reg-location"
                  type="text"
                  className="ayur-input ayur-input--has-icon"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Security */}
          <div className="ayur-form-section">
            <div className="ayur-form-section__header">
              <span className="ayur-form-section__title">Security</span>
            </div>
            <div className="ayur-form-grid-2">
              <div className="ayur-form-field">
                <label htmlFor="reg-password" className="ayur-label">
                  Password <span className="ayur-required-mark" aria-hidden="true">*</span>
                  <span className="ayur-label-hint">(Min. 8 characters)</span>
                </label>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`ayur-input ayur-input--has-icon ayur-input--has-action ${fieldErrors.password ? 'ayur-input--error' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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
                {fieldErrors.password && (
                  <span className="ayur-field-error" role="alert">{fieldErrors.password}</span>
                )}
              </div>

              <div className="ayur-form-field">
                <label htmlFor="reg-confirm-password" className="ayur-label">
                  Confirm Password <span className="ayur-required-mark" aria-hidden="true">*</span>
                </label>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`ayur-input ayur-input--has-icon ayur-input--has-action ${fieldErrors.confirmPassword ? 'ayur-input--error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="ayur-input-action-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="ayur-field-error" role="alert">{fieldErrors.confirmPassword}</span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            rightIcon={<ArrowRight size={16} />}
            className="mt-xs"
          >
            Create Account & Continue
          </Button>
        </form>

        {/* Sign In Redirection */}
        <div className="ayur-auth-switch">
          <span>Already registered?</span>
          <Link to="/login" className="ayur-auth-switch-link">
            Sign In to Patient Portal →
          </Link>
        </div>

        {/* Security & Privacy Notice (Accurate, no false encryption claims) */}
        <div className="ayur-auth-footer">
          <ShieldCheck size={14} className="text-secondary shrink-0" />
          <span>Your information is protected under role-based clinical access control and used solely for personalized wellness guidance.</span>
        </div>
      </div>
    </div>
  );
};
