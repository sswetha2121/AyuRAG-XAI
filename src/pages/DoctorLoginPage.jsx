import React, { useState } from 'react';
import './DoctorLoginPage.css';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export const DoctorLoginPage = ({ onTriggerToast }) => {
  const { doctorLogin, switchDemoPersona, isLoading } = useAuth();
  const navigate = useNavigate();

  // No hardcoded default credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = await doctorLogin(username, password);
      onTriggerToast?.({
        type: 'success',
        title: 'Physician Authorized',
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
        title: 'Physician Authorized',
        message: `Welcome, ${user.name || doctorUsername}. Clinical workspace unlocked.`,
      });
      navigate('/doctor/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Quick login failed.');
    }
  };

  return (
    <div className="ayur-doctor-login-page">
      <div className="ayur-dlogin-card">
        {/* Medical Badge Header */}
        <div className="ayur-dlogin-header">
          <div className="ayur-dlogin-emblem">
            <Stethoscope size={28} className="text-secondary" />
          </div>
          <span className="ayur-dlogin-chip">
            <Award size={13} />
            CLINICAL PORTAL
          </span>
          <h1 className="ayur-dlogin-title">Physician Access Gateway</h1>
          <p className="ayur-dlogin-subtitle">
            AyuRAG-XAI Clinical Decision Support System & Diet Formulation Console
          </p>
        </div>

        {errorMessage && (
          <div className="ayur-dlogin-error">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Doctor Login Form */}
        <form onSubmit={handleDoctorSubmit} className="ayur-dlogin-form">
          <div className="ayur-form-group">
            <label className="ayur-label">Physician Username or Clinical Email</label>
            <div className="ayur-input-icon-box">
              <User size={16} className="ayur-input-icon" />
              <input
                type="text"
                className="ayur-input ayur-input--icon"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter clinical ID or medical email"
                required
              />
            </div>
          </div>

          <div className="ayur-form-group">
            <label className="ayur-label">Physician Password</label>
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
            className="w-full mt-xs"
            loading={isLoading}
            rightIcon={<ArrowRight size={16} />}
          >
            Authenticate & Open Clinical Dashboard
          </Button>
        </form>

        {/* Quick Access for Verified Staff */}
        <div className="ayur-dlogin-quick-section">
          <span className="ayur-dquick-label">Authorized Clinical Roles (Demo Profiles):</span>

          <div className="ayur-dquick-grid">
            <button
              type="button"
              className="ayur-dquick-btn"
              onClick={() => handleDoctorQuickSelect('dr.sharma')}
              disabled={isLoading}
            >
              <div className="ayur-dquick-avatar">KC</div>
              <div className="ayur-dquick-info">
                <strong>Kayachikitsa Lead</strong>
                <span>Internal Medicine & Agni Specialist</span>
              </div>
            </button>

            <button
              type="button"
              className="ayur-dquick-btn"
              onClick={() => handleDoctorQuickSelect('dr.menon')}
              disabled={isLoading}
            >
              <div className="ayur-dquick-avatar">PK</div>
              <div className="ayur-dquick-info">
                <strong>Panchakarma Lead</strong>
                <span>Detoxification & Constitutional Specialist</span>
              </div>
            </button>
          </div>
        </div>

        {/* Return to Patient Portal & Landing */}
        <div className="ayur-dlogin-patient-link">
          <span>Are you a patient seeking consultation?</span>
          <Link to="/login" className="ayur-dlink">
            Go to Patient Sign In / Registration →
          </Link>
        </div>

        <div className="text-center mt-sm">
          <Link to="/" className="text-xs text-secondary hover:underline font-medium">
            ← Return to AyuRAG-XAI Landing Page
          </Link>
        </div>

        {/* Clinical Disclaimer */}
        <div className="ayur-dlogin-footer">
          <ShieldCheck size={14} className="text-secondary" />
          <span>
            Strict clinical access: All doctor verification and diet activation events are recorded in the immutable audit trail.
          </span>
        </div>
      </div>
    </div>
  );
};
