import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LoginPage = ({ onLoginSuccess, onTriggerToast }) => {
  const { login, switchDemoPersona, isLoading } = useAuth();
  const [username, setUsername] = useState('dr.sharma');
  const [password, setPassword] = useState('doctor123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = await login(username, password);
      onTriggerToast?.({
        type: 'success',
        title: 'Authenticated',
        message: `Welcome back, ${user.name} (${user.role}).`,
      });
      onLoginSuccess?.(user);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid username or password.');
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
      onLoginSuccess?.(user);
    } catch (err) {
      setErrorMessage(err.message || `Failed to switch to ${role} demo.`);
    }
  };

  return (
    <div className="ayur-login-page">
      <div className="ayur-login-card">
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
          <p className="ayur-login-tagline">Clinical Decision Support & Assessment Gateway</p>
        </div>

        {errorMessage && (
          <div className="ayur-login-error">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="ayur-login-form">
          <div className="ayur-form-group">
            <label className="ayur-label">Username or Clinical Email</label>
            <div className="ayur-input-icon-box">
              <User size={16} className="ayur-input-icon" />
              <input
                type="text"
                className="ayur-input ayur-input--icon"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. dr.sharma or swetha.chowdary"
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
            Authenticate & Proceed
          </Button>
        </form>

        {/* Clinical Research One-Click Quick Persona Logins */}
        <div className="ayur-demo-personas">
          <span className="ayur-demo-label">Evaluator & Clinical Review Quick Access:</span>

          <div className="ayur-demo-buttons">
            <button
              type="button"
              className="ayur-demo-btn ayur-demo-btn--doctor"
              onClick={() => handleQuickDemo('DOCTOR')}
              disabled={isLoading}
            >
              <div className="ayur-demo-btn__icon">
                <Stethoscope size={16} />
              </div>
              <div className="ayur-demo-btn__text">
                <strong>Login as Doctor</strong>
                <span>Dr. A. Sharma (Kayachikitsa Lead)</span>
              </div>
            </button>

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
                <span>Swetha Chowdary (Prakriti Intake)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="ayur-login-footer">
          <ShieldCheck size={14} className="text-secondary" />
          <span>Role-based access enforced by backend server. Unauthorized access prohibited.</span>
        </div>
      </div>
    </div>
  );
};
