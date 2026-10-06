import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = ({ initialMode = 'signin', onLoginSuccess, onTriggerToast }) => {
  const { login, register, switchDemoPersona, isLoading } = useAuth();
  const navigate = useNavigate();

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState(initialMode);

  // Sign In Fields (No hardcoded default prefill)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up Fields
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'Female',
    contactPhone: '',
    location: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = await login(username, password);
      onTriggerToast?.({
        type: 'success',
        title: 'Authenticated',
        message: `Welcome back, ${user.name || user.username}.`,
      });
      if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        onLoginSuccess?.(user);
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid username or password.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (signUpForm.password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    try {
      const user = await register({
        fullName: signUpForm.fullName,
        email: signUpForm.email,
        username: signUpForm.username || signUpForm.email.split('@')[0],
        password: signUpForm.password,
        age: signUpForm.age,
        gender: signUpForm.gender,
        contactPhone: signUpForm.contactPhone,
        location: signUpForm.location,
      });

      onTriggerToast?.({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to AyuRAG-XAI, ${user.name || user.username}!`,
      });

      onLoginSuccess?.(user);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    }
  };

  const handleQuickDemo = async (role) => {
    setErrorMessage('');
    try {
      const user = await switchDemoPersona(role);
      onTriggerToast?.({
        type: 'info',
        title: `${role} Session Active`,
        message: `Logged in as demo ${role.toLowerCase()}: ${user.name}.`,
      });
      if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        onLoginSuccess?.(user);
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.message || `Failed to switch to ${role} demo.`);
    }
  };

  return (
    <div className="ayur-login-page">
      <div className={`ayur-login-card ${authMode === 'signup' ? 'ayur-login-card--wide' : ''}`}>
        {/* Brand Header */}
        <div className="ayur-login-brand">
          <div className="ayur-login-emblem">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="9" fill="#16382C" />
              <rect x="1.5" y="1.5" width="33" height="33" rx="7.5" stroke="#C5A059" strokeOpacity="0.4" />
              <path
                d="M18 6C13 9 9 14.5 9 21C9 25.5 12.5 29 18 29C23.5 29 27 25.5 27 21C27 14.5 23 9 18 6Z"
                fill="#5B8266"
                fillOpacity="0.4"
              />
              <path d="M18 9V26" stroke="#C5A059" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="14" cy="16" r="1.5" fill="#C5A059" />
              <circle cx="22" cy="15" r="1.5" fill="#C5A059" />
              <circle cx="18" cy="9" r="2" fill="#FAF4E8" />
            </svg>
          </div>
          <h1 className="ayur-login-title">AyuRAG<span className="text-accent">XAI</span></h1>
          <p className="ayur-login-tagline">
            {authMode === 'signin'
              ? 'Patient Assessment & Clinical Gateway'
              : 'New Patient Intake Registration'}
          </p>
        </div>

        {/* Tab Toggle between Sign In and Sign Up */}
        <div className="ayur-auth-mode-tabs">
          <button
            type="button"
            className={`ayur-amode-tab ${authMode === 'signin' ? 'ayur-amode-tab--active' : ''}`}
            onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`ayur-amode-tab ${authMode === 'signup' ? 'ayur-amode-tab--active' : ''}`}
            onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
          >
            Create Account (Sign Up)
          </button>
        </div>

        {errorMessage && (
          <div className="ayur-login-error">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE 1: SIGN IN FORM */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="ayur-login-form">
            <div className="ayur-form-group">
              <label className="ayur-label">Username or Registered Email</label>
              <div className="ayur-input-icon-box">
                <User size={16} className="ayur-input-icon" />
                <input
                  type="text"
                  className="ayur-input ayur-input--icon"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  required
                />
              </div>
            </div>

            <div className="ayur-form-group">
              <label className="ayur-label">Password</label>
              <div className="ayur-input-icon-box">
                <Lock size={16} className="ayur-input-icon" />
                <input
                  type="password"
                  className="ayur-input ayur-input--icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-full mt-sm"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Sign In to Patient Portal
            </Button>
          </form>
        )}

        {/* MODE 2: SIGN UP FORM WITH ALL INTAKE FIELDS */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="ayur-login-form">
            <div className="ayur-form-row-2">
              <div className="ayur-form-group">
                <label className="ayur-label">Full Name *</label>
                <div className="ayur-input-icon-box">
                  <User size={16} className="ayur-input-icon" />
                  <input
                    type="text"
                    className="ayur-input ayur-input--icon"
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">Email Address *</label>
                <div className="ayur-input-icon-box">
                  <Mail size={16} className="ayur-input-icon" />
                  <input
                    type="email"
                    className="ayur-input ayur-input--icon"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="ayur-form-row-2">
              <div className="ayur-form-group">
                <label className="ayur-label">Preferred Username (Optional)</label>
                <div className="ayur-input-icon-box">
                  <User size={16} className="ayur-input-icon" />
                  <input
                    type="text"
                    className="ayur-input ayur-input--icon"
                    value={signUpForm.username}
                    onChange={(e) => setSignUpForm({ ...signUpForm, username: e.target.value })}
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">Contact Phone</label>
                <div className="ayur-input-icon-box">
                  <Phone size={16} className="ayur-input-icon" />
                  <input
                    type="tel"
                    className="ayur-input ayur-input--icon"
                    value={signUpForm.contactPhone}
                    onChange={(e) => setSignUpForm({ ...signUpForm, contactPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="ayur-form-row-3">
              <div className="ayur-form-group">
                <label className="ayur-label">Age (Years) *</label>
                <input
                  type="number"
                  className="ayur-input"
                  min="1"
                  max="120"
                  value={signUpForm.age}
                  onChange={(e) => setSignUpForm({ ...signUpForm, age: e.target.value })}
                  placeholder="28"
                  required
                />
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">Gender *</label>
                <select
                  className="ayur-input"
                  value={signUpForm.gender}
                  onChange={(e) => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">City / Location</label>
                <input
                  type="text"
                  className="ayur-input"
                  value={signUpForm.location}
                  onChange={(e) => setSignUpForm({ ...signUpForm, location: e.target.value })}
                  placeholder="Bangalore, India"
                />
              </div>
            </div>

            <div className="ayur-form-row-2">
              <div className="ayur-form-group">
                <label className="ayur-label">Password * (Min 4 chars)</label>
                <div className="ayur-input-icon-box">
                  <Lock size={16} className="ayur-input-icon" />
                  <input
                    type="password"
                    className="ayur-input ayur-input--icon"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">Confirm Password *</label>
                <div className="ayur-input-icon-box">
                  <Lock size={16} className="ayur-input-icon" />
                  <input
                    type="password"
                    className="ayur-input ayur-input--icon"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-full mt-sm"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Register & Start Intake Assessment
            </Button>
          </form>
        )}

        {/* Dedicated Link to Doctor Portal */}
        <div className="ayur-doctor-portal-callout">
          <div className="flex items-center gap-xs">
            <Stethoscope size={18} className="text-secondary shrink-0" />
            <div>
              <span className="font-semibold text-xs text-primary block">Are you a Licensed Ayurvedic Doctor?</span>
              <span className="text-xs text-muted block">Access the clinical review workspace & diet plan console</span>
            </div>
          </div>
          <Link to="/doctor-login" className="ayur-doc-link-btn">
            Doctor Portal Login →
          </Link>
        </div>

        {/* Quick Demo Login Option */}
        <div className="ayur-demo-personas">
          <span className="ayur-demo-label">Quick Patient Testing Access:</span>
          <button
            type="button"
            className="ayur-demo-btn ayur-demo-btn--patient"
            onClick={() => handleQuickDemo('PATIENT')}
            disabled={isLoading}
          >
            <div className="ayur-demo-btn__icon">
              <User size={16} />
            </div>
            <div className="ayur-demo-btn__text">
              <strong>Login as Patient</strong>
              <span>Verified Patient Persona (Constitutional Intake)</span>
            </div>
          </button>
        </div>

        {/* Security Notice & Back to Home */}
        <div className="ayur-login-footer">
          <div className="flex items-center gap-xs justify-center mb-xs">
            <ShieldCheck size={14} className="text-secondary" />
            <span>Clinical data secured with patient isolation & Django authorization.</span>
          </div>
          <div className="text-center mt-xs">
            <Link to="/" className="text-xs text-secondary hover:underline font-medium">
              ← Return to AyuRAG-XAI Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
