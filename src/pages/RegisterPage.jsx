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
    location: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120) {
      setErrorMessage('Please enter a valid age between 1 and 120.');
      return;
    }

    if (formData.password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      const user = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        username: formData.username.trim() || formData.email.split('@')[0],
        password: formData.password,
        age: formData.age,
        gender: formData.gender,
        location: formData.location.trim(),
      });

      onTriggerToast?.({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to AyuRAG-XAI, ${user.name || user.username}!`,
      });

      onLoginSuccess?.(user);
      navigate('/assessment-overview');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please review your details.');
    }
  };

  return (
    <div className="ayur-auth-page">
      <div className="ayur-auth-card ayur-auth-card--wide">
        {/* Back Link */}
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
            Register to take your personalized constitutional assessment and track your daily nutrition.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="ayur-auth-error-alert" role="alert">
            <AlertCircle size={17} className="shrink-0 text-error" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="ayur-auth-form" noValidate>
          <div className="ayur-form-grid-2">
            <FormField label="Full Name" htmlFor="reg-fullname" required>
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <User size={17} />
                </span>
                <input
                  id="reg-fullname"
                  type="text"
                  className="ayur-input ayur-input--has-icon"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                />
              </div>
            </FormField>

            <FormField label="Email Address" htmlFor="reg-email" required>
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <Mail size={17} />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  className="ayur-input ayur-input--has-icon"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </FormField>
          </div>

          <div className="ayur-form-grid-3">
            <FormField label="Age (Years)" htmlFor="reg-age" required>
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <Calendar size={17} />
                </span>
                <input
                  id="reg-age"
                  type="number"
                  min="1"
                  max="120"
                  className="ayur-input ayur-input--has-icon"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  placeholder="28"
                  required
                />
              </div>
            </FormField>

            <FormField label="Gender" htmlFor="reg-gender" required>
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <Users size={17} />
                </span>
                <select
                  id="reg-gender"
                  className="ayur-input ayur-input--has-icon ayur-select"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </FormField>

            <FormField label="City / Region" htmlFor="reg-location">
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <MapPin size={17} />
                </span>
                <input
                  id="reg-location"
                  type="text"
                  className="ayur-input ayur-input--has-icon"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Bangalore, India"
                />
              </div>
            </FormField>
          </div>

          <div className="ayur-form-grid-2">
            <FormField label="Password (Min 4 chars)" htmlFor="reg-password" required>
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <Lock size={17} />
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ayur-input ayur-input--has-icon ayur-input--has-action"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
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

            <FormField label="Confirm Password" htmlFor="reg-confirm-password" required>
              <div className="ayur-input-wrap">
                <span className="ayur-input-icon">
                  <Lock size={17} />
                </span>
                <input
                  id="reg-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ayur-input ayur-input--has-icon"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </FormField>
          </div>

          <Button
            variant="primary"
            size="md"
            type="submit"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight size={16} />}
            className="mt-sm"
          >
            Register & Continue to Assessment
          </Button>
        </form>

        {/* Sign In Redirection */}
        <div className="ayur-auth-switch">
          <span>Already have an account?</span>
          <Link to="/login" className="ayur-auth-switch-link">
            Sign In Here →
          </Link>
        </div>

        {/* Security Footer */}
        <div className="ayur-auth-footer">
          <ShieldCheck size={14} className="text-secondary shrink-0" />
          <span>Your physiological data is strictly encrypted and used solely for your wellness guidance.</span>
        </div>
      </div>
    </div>
  );
};
