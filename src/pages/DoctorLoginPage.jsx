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
import { Link, useNavigate } from 'react-router-dom';

export const DoctorLoginPage = ({ onTriggerToast }) => {
  const { doctorLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

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
          <Link to="/" className="ayur-dlogin-back-link" title="Return to Home">
            <ArrowLeft size={16} />
            <span>Home</span>
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
            Secure clinical decision support portal for patient evaluation, symptom verification, and diet plan approval.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="ayur-dlogin-error" role="alert">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Doctor Login Form */}
        <form onSubmit={handleDoctorSubmit} className="ayur-dlogin-form" noValidate>
          <FormField label="Physician Username or Email" htmlFor="doctor-username" required>
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <User size={17} />
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
                placeholder="e.g. dr.sharma"
                autoComplete="username"
                required
              />
            </div>
          </FormField>

          <FormField label="Physician Password" htmlFor="doctor-password" required>
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <Lock size={17} />
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
            rightIcon={<ArrowRight size={16} />}
            className="ayur-dlogin-submit-btn"
          >
            Sign In to Doctor Workspace
          </Button>
        </form>

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
            Authorized physician credentials required. All clinical reviews, symptom verifications, and approved regimens are audit-logged.
          </span>
        </div>
      </div>
    </div>
  );
};
