import React, { useState } from 'react';
import './DoctorLoginPage.css';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const DoctorLoginPage = ({ onTriggerToast }) => {
  const { doctorLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialUsername = location.state?.username || location.state?.email || '';
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [registrationNotice, setRegistrationNotice] = useState(Boolean(location.state?.fromRegistration));

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Please enter your medical registration number, email, or username.';
    }
    if (!password) {
      errors.password = 'Please enter your password.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setRegistrationNotice(false);

    if (!validateForm()) {
      return;
    }

    try {
      const user = await doctorLogin(username.trim(), password);
      onTriggerToast?.({
        type: 'success',
        title: 'Physician Authorized',
        message: `Welcome, ${user.name || 'Doctor'}. Clinical workspace unlocked.`,
      });
      navigate('/doctor/dashboard');
    } catch (err) {
      // Map error into understandable feedback
      if (err.data?.approval_status === 'PENDING' || (err.message && err.message.toLowerCase().includes('awaiting administrative verification'))) {
        setErrorMessage('Your doctor account is awaiting administrative verification. You will be able to access the clinical portal once your credentials have been verified by an administrator.');
      } else if (err.data?.approval_status === 'REJECTED' || (err.message && err.message.toLowerCase().includes('not approved'))) {
        setErrorMessage(err.message || 'Your clinical account registration was not approved. Please contact clinical administration.');
      } else if (err.status === 401) {
        setErrorMessage('Invalid physician credentials or password. Please verify your registration number and password.');
      } else if (err.status === 403) {
        setErrorMessage(err.message || 'Access Denied: This portal is restricted to authorized physicians only.');
      } else if (err.status === 503 || err.status === 504) {
        setErrorMessage('The clinical backend server is currently unreachable. Please ensure the Django API server is active.');
      } else {
        setErrorMessage(err.message || 'Physician authentication failed. Please check your network connection.');
      }
    }
  };

  return (
    <div className="ayur-doctor-login-page">
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

      <div className="ayur-dlogin-card">
        {/* Top Navigation */}
        <div className="ayur-dlogin-top-bar">
          <Link to="/signin" className="ayur-dlogin-back-link" title="Return to Role Selection">
            <ArrowLeft size={16} />
            <span>Role Selection</span>
          </Link>
          <span className="ayur-dlogin-tag">DOCTOR PORTAL</span>
        </div>

        {/* Medical Header */}
        <div className="ayur-dlogin-header">
          <div className="ayur-dlogin-emblem">
            <Stethoscope size={28} className="text-primary" />
          </div>
          <h1 className="ayur-dlogin-title">Physician Decision Workspace</h1>
          <p className="ayur-dlogin-subtitle">
            Secure clinical decision support portal for patient intake review, SHAP attribution auditing, and dietary plan sign-off.
          </p>
        </div>

        {/* Registration Notice Banner */}
        {registrationNotice && !errorMessage && (
          <div className="ayur-dlogin-pending-alert" role="status">
            <Clock size={18} className="shrink-0 text-amber-700 mt-0.5" />
            <div className="flex flex-col gap-1 text-left w-full">
              <span className="font-semibold text-amber-900 text-xs">Application Submitted</span>
              <span className="text-xs text-amber-800 leading-relaxed">
                Your medical registration is awaiting administrative verification before clinical access is unlocked.
              </span>
            </div>
          </div>
        )}

        {/* Error or Status Alert */}
        {errorMessage && (
          <div
            className={
              errorMessage.toLowerCase().includes('awaiting administrative verification')
                ? 'ayur-dlogin-pending-alert'
                : 'ayur-dlogin-error'
            }
            role="alert"
          >
            {errorMessage.toLowerCase().includes('awaiting administrative verification') ? (
              <Clock size={18} className="shrink-0 text-amber-700 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
            )}
            <div className="flex flex-col gap-1 text-left w-full">
              <span className="font-semibold text-xs">
                {errorMessage.toLowerCase().includes('awaiting administrative verification')
                  ? 'Verification Required'
                  : 'Authentication Notice'}
              </span>
              <span className="text-xs leading-relaxed">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Doctor Login Form */}
        <form onSubmit={handleDoctorSubmit} className="ayur-dlogin-form" noValidate>
          <FormField
            label="License No., Email or Username"
            htmlFor="doctor-username"
            required
            error={fieldErrors.username}
          >
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <User size={18} />
              </span>
              <input
                id="doctor-username"
                type="text"
                className={`ayur-dlogin-input ${fieldErrors.username ? 'ayur-input--error' : ''}`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: '' }));
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. AYUSH-DEL-2018-4421 or dr.sharma@ayurag.org"
                autoComplete="username"
                required
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.username)}
              />
            </div>
          </FormField>

          <FormField
            label="Password"
            htmlFor="doctor-password"
            required
            error={fieldErrors.password}
          >
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <Lock size={18} />
              </span>
              <input
                id="doctor-password"
                type={showPassword ? 'text' : 'password'}
                className={`ayur-dlogin-input ayur-input--has-action ${fieldErrors.password ? 'ayur-input--error' : ''}`}
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
                className="ayur-dlogin-toggle-btn"
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
            className="ayur-dlogin-submit-btn"
          >
            {isLoading ? 'Verifying Clinical Credentials...' : 'Sign In to Doctor Workspace'}
          </Button>
        </form>

        {/* Doctor Registration Redirection */}
        <div className="ayur-dlogin-switch">
          <span>New physician?</span>
          <Link to="/doctor-register" className="ayur-dlogin-switch-link">
            Register Medical Credentials →
          </Link>
        </div>

        {/* Patient Portal Switch */}
        <div className="ayur-dlogin-patient-box">
          <User size={18} className="text-secondary shrink-0" />
          <div className="flex-1 text-left">
            <span className="font-semibold text-xs text-primary block">Looking for Patient Portal?</span>
            <span className="text-xs text-muted block">Access your personalized constitutional wellness plan</span>
          </div>
          <Link to="/login" className="ayur-dlogin-patient-link">
            Patient Login →
          </Link>
        </div>

        {/* Clinical Disclaimer Footer */}
        <div className="ayur-dlogin-footer">
          <ShieldCheck size={15} className="text-secondary shrink-0" />
          <span>Access strictly restricted to licensed AYUSH / medical professionals under clinical audit logs.</span>
        </div>
      </div>
    </div>
  );
};
