import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  Mail,
  Calendar,
  Users,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
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
    contactPhone: '',
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
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full legal or preferred name.';
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
      errors.confirmPassword = 'Please confirm your password.';
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
      onTriggerToast?.({
        type: 'warning',
        title: 'Form Validation',
        message: 'Please review the highlighted fields before submitting.',
      });
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        username: formData.username.trim() || formData.email.trim().split('@')[0],
        password: formData.password,
        age: Number(formData.age),
        gender: formData.gender,
        contactPhone: formData.contactPhone.trim(),
      };

      const user = await register(payload);

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
              fillOpacity="0.32"
            />
          </svg>
        </div>
      </div>

      <div className="ayur-auth-card ayur-auth-card--register">
        {/* Top Navigation */}
        <div className="ayur-auth-top-bar">
          <Link to="/signin" className="ayur-auth-back-link" title="Return to Role Selection">
            <ArrowLeft size={16} />
            <span>Role Selection</span>
          </Link>
          <span className="ayur-auth-tag">PATIENT ONBOARDING</span>
        </div>

        {/* Header */}
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
          <h1 className="ayur-auth-title">Create Patient Account</h1>
          <p className="ayur-auth-subtitle">
            Register to take your personalized constitutional assessment and receive your physician-reviewed care plan.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="ayur-auth-error-alert" role="alert">
            <AlertCircle size={18} className="shrink-0 text-error" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="ayur-auth-form" noValidate>
          {/* Section 1: Account Information */}
          <div className="ayur-form-section">
            <h2 className="ayur-form-section-title">Account Credentials</h2>
            <div className="ayur-form-grid-2">
              <FormField label="Full Name" htmlFor="reg-fullname" required error={fieldErrors.fullName}>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon"><User size={18} /></span>
                  <input
                    id="reg-fullname"
                    type="text"
                    className={`ayur-input ayur-input--has-icon ${fieldErrors.fullName ? 'ayur-input--error' : ''}`}
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Swetha Chowdary"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.fullName)}
                  />
                </div>
              </FormField>

              <FormField label="Email Address" htmlFor="reg-email" required error={fieldErrors.email}>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon"><Mail size={18} /></span>
                  <input
                    id="reg-email"
                    type="email"
                    className={`ayur-input ayur-input--has-icon ${fieldErrors.email ? 'ayur-input--error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. swetha@example.com"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                </div>
              </FormField>
            </div>
          </div>

          {/* Section 2: Personal Profile */}
          <div className="ayur-form-section">
            <h2 className="ayur-form-section-title">Constitutional Context</h2>
            <div className="ayur-form-grid-2">
              <FormField label="Age (Years)" htmlFor="reg-age" required error={fieldErrors.age}>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon"><Calendar size={18} /></span>
                  <input
                    id="reg-age"
                    type="number"
                    min="1"
                    max="120"
                    className={`ayur-input ayur-input--has-icon ${fieldErrors.age ? 'ayur-input--error' : ''}`}
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="e.g. 28"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.age)}
                  />
                </div>
              </FormField>

              <FormField label="Gender" htmlFor="reg-gender" required error={fieldErrors.gender}>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon"><Users size={18} /></span>
                  <select
                    id="reg-gender"
                    className="ayur-input ayur-input--has-icon"
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    required
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </FormField>
            </div>

            <FormField label="Contact Phone (Optional)" htmlFor="reg-phone">
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon"><Phone size={18} /></span>
                <input
                  id="reg-phone"
                  type="tel"
                  className="ayur-input ayur-input--has-icon"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </FormField>
          </div>
 
          {/* Section 3: Password Security */}
          <div className="ayur-form-section">
            <h2 className="ayur-form-section-title">Account Security</h2>
            <div className="ayur-form-grid-2">
              <FormField label="Password (Min. 8 chars)" htmlFor="reg-password" required error={fieldErrors.password}>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon"><Lock size={18} /></span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`ayur-input ayur-input--has-icon ayur-input--has-action ${fieldErrors.password ? 'ayur-input--error' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  <button
                    type="button"
                    className="ayur-input-action-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm Password" htmlFor="reg-confirm-password" required error={fieldErrors.confirmPassword}>
                <div className="ayur-input-wrap">
                  <span className="ayur-input-icon"><Lock size={18} /></span>
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`ayur-input ayur-input--has-icon ayur-input--has-action ${fieldErrors.confirmPassword ? 'ayur-input--error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  />
                  <button
                    type="button"
                    className="ayur-input-action-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormField>
            </div>
          </div>

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
            {isLoading ? 'Creating Your Account...' : 'Complete Registration & Continue'}
          </Button>
        </form>

        {/* Existing User Login Link */}
        <div className="ayur-auth-switch">
          <span>Already registered?</span>
          <Link to="/login" className="ayur-auth-switch-link">
            Sign In to Patient Portal →
          </Link>
        </div>

        {/* Confidentiality Footer */}
        <div className="ayur-auth-footer">
          <ShieldCheck size={15} className="text-secondary shrink-0" />
          <span>Your demographic and constitutional data is protected under medical privacy standards.</span>
        </div>
      </div>
    </div>
  );
};
