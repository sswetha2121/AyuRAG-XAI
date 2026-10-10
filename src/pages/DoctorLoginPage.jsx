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
      setErrorMessage('Please enter both physician username and password.');
      return;
    }

    try {
      const user = await doctorLogin(username.trim(), password);
      onTriggerToast?.({
        type: 'success',
        title: 'Doctor Signed In',
        message: `Welcome, ${user.name || 'Doctor'}. Clinical workspace unlocked.`,
      });
      navigate('/doctor/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid physician credentials or unauthorized account.');
    }
  };

  const handleDoctorQuickSelect = async (doctorUsername) => {
    setErrorMessage('');
    setUsername(doctorUsername);
    setPassword('doctor123');
    try {
      const user = await doctorLogin(doctorUsername, 'doctor123');
      onTriggerToast?.({
        type: 'success',
        title: 'Doctor Authorized',
        message: `Welcome, ${user.name || doctorUsername}. Clinical dashboard opened.`,
      });
      navigate('/doctor/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Quick login failed.');
    }
  };

  return (
    <div className="ayur-doctor-login-page">
      <div className="ayur-dlogin-card">
        {/* Top Back Navigation Link */}
        <div className="ayur-dlogin-top-bar">
          <Link to="/" className="ayur-dlogin-back-link" title="Return to Home">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <span className="ayur-dlogin-tag">DOCTOR PORTAL</span>
        </div>

        {/* Medical Header */}
        <div className="ayur-dlogin-header">
          <div className="ayur-dlogin-emblem">
            <Stethoscope size={28} className="text-secondary" />
          </div>
          <h1 className="ayur-dlogin-title">Doctor Portal Login</h1>
          <p className="ayur-dlogin-subtitle">
            Secure clinical workspace for patient verification and diet plan approval
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="ayur-dlogin-error" role="alert">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Doctor Login Form with Perfectly Aligned Fields */}
        <form onSubmit={handleDoctorSubmit} className="ayur-dlogin-form" noValidate>
          {/* Username Field */}
          <div className="ayur-dlogin-field">
            <label htmlFor="doctor-username" className="ayur-dlogin-label">
              Doctor Username or Email
            </label>
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <User size={18} />
              </span>
              <input
                id="doctor-username"
                type="text"
                className="ayur-dlogin-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. dr.sharma"
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div className="ayur-dlogin-field">
            <div className="ayur-dlogin-label-row">
              <label htmlFor="doctor-password" className="ayur-dlogin-label">
                Doctor Password
              </label>
            </div>
            <div className="ayur-dlogin-input-wrap">
              <span className="ayur-dlogin-input-icon">
                <Lock size={18} />
              </span>
              <input
                id="doctor-password"
                type={showPassword ? 'text' : 'password'}
                className="ayur-dlogin-input ayur-dlogin-input--has-toggle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-full ayur-dlogin-submit-btn"
            loading={isLoading}
            rightIcon={<ArrowRight size={16} />}
          >
            Sign In to Doctor Dashboard
          </Button>
        </form>

        {/* Demo Quick Access */}
        <div className="ayur-dlogin-quick-section">
          <span className="ayur-dquick-label">Sample Doctor Profile (Click to Fill & Sign In):</span>
          <button
            type="button"
            className="ayur-dquick-btn"
            onClick={() => handleDoctorQuickSelect('dr.sharma')}
            disabled={isLoading}
          >
            <div className="ayur-dquick-avatar">DR</div>
            <div className="ayur-dquick-info">
              <strong>Dr. Sharma, MD</strong>
              <span>Clinical Medicine & Personalized Diet Specialist</span>
            </div>
            <span className="ayur-dquick-badge">Sign In →</span>
          </button>
        </div>

        {/* Patient Redirection */}
        <div className="ayur-dlogin-patient-link">
          <span>Are you a patient?</span>
          <Link to="/login" className="ayur-dlink">
            Go to Patient Login / Sign Up →
          </Link>
        </div>

        {/* Security Note */}
        <div className="ayur-dlogin-footer">
          <ShieldCheck size={14} className="text-secondary shrink-0" />
          <span>
            Authorized doctor access only. All patient evaluations and approved diet plans are securely logged.
          </span>
        </div>
      </div>
    </div>
  );
};

