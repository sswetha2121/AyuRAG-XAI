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
  EyeOff
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
  const [registrationNotice, setRegistrationNotice] = useState(Boolean(location.state?.fromRegistration));

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setRegistrationNotice(false);

    if (!username.trim() || !password) {
      setErrorMessage('Please enter your physician username and password.');
      return;
    }

    try {
      const user = await doctorLogin(username.trim(), password);
      onTriggerToast?.({
        type: 'success',
        title: 'Doctor Authorized',
        message: `Welcome, ${user.name || 'Doctor'}. Clinical workspace unlocked.`,
      });
      navigate('/doctor/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid physician credentials or unauthorized clinical account.');
    }
  };

  return (
    <div className="ayur-doctor-login-page">
      <div className="ayur-dlogin-card">
        {/* Top Back Navigation Link */}
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
            <Stethoscope size={28} className="text-secondary" />
          </div>
          <h1 className="ayur-dlogin-title">Doctor Workspace Login</h1>
          <p className="ayur-dlogin-subtitle">
            Secure clinical decision support portal for patient evaluation, symptom verification, and care plan authorization.
          </p>
        </div>

        {/* Registration Notice Banner */}
        {registrationNotice && !errorMessage && (
          <div className="ayur-dlogin-pending-alert" role="status">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-700" />
            <div className="flex flex-col gap-1 text-left w-full">
              <span className="font-semibold text-amber-900">Registration Received</span>
              <span className="text-xs text-amber-800">
                Your credentials have been submitted and are awaiting administrative verification.
              </span>
              <div className="ayur-dlogin-dev-hint">
                <span className="text-muted block text-xs">For local testing, approve this account via:</span>
                <code className="ayur-dlogin-code">
                  python manage.py approve_doctor {username || 'your-email'}
                </code>
              </div>
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
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-left w-full">
              <span className="font-semibold">
                {errorMessage.toLowerCase().includes('awaiting administrative verification')
                  ? 'Verification Required'
                  : 'Authentication Notice'}
              </span>
              <span>{errorMessage}</span>
              {errorMessage.toLowerCase().includes('awaiting administrative verification') && (
                <div className="ayur-dlogin-dev-hint">
                  <span className="text-muted block text-xs">To approve this account for local testing:</span>
                  <code className="ayur-dlogin-code">
                    python manage.py approve_doctor {username.trim() || 'physician-email'}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doctor Login Form */}
        <form onSubmit={handleDoctorSubmit} className="ayur-dlogin-form" noValidate>
          <FormField label="Physician Username or Email" htmlFor="doctor-username" required>
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <User size={16} />
              </span>
              <input
                id="doctor-username"
                type="text"
                className="ayur-dlogin-input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. dr.swetha"
                autoComplete="username"
                required
              />
            </div>
          </FormField>

          <FormField label="Physician Password" htmlFor="doctor-password" required>
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <Lock size={16} />
              </span>
              <input
                id="doctor-password"
                type={showPassword ? 'text' : 'password'}
                className="ayur-dlogin-input ayur-dlogin-input--has-toggle"
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
                className="ayur-dlogin-toggle-pw"
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
            disabled={isLoading}
            rightIcon={<ArrowRight size={16} />}
            className="ayur-dlogin-submit-btn"
          >
            Sign In to Doctor Workspace
          </Button>
        </form>

        {/* Doctor Registration Link */}
        <div className="ayur-dlogin-register-link">
          <span>New doctor?</span>
          <Link to="/doctor-register" className="ayur-dlink ayur-dlink--highlight">
            Register your account →
          </Link>
        </div>

        {/* Patient Redirection */}
        <div className="ayur-dlogin-patient-link">
          <span>Are you a patient?</span>
          <Link to="/login" className="ayur-dlink">
            Go to Patient Sign In →
          </Link>
        </div>

        {/* Security Note */}
        <div className="ayur-dlogin-footer">
          <ShieldCheck size={14} className="text-secondary shrink-0" />
          <span>
            Authorized clinical credentials required. All patient reviews, symptom verifications, and approved regimens are audit-logged.
          </span>
        </div>
      </div>
    </div>
  );
};
