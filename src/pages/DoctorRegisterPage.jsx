import React, { useState } from 'react';
import './DoctorRegisterPage.css';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  Lock,
  User,
  Mail,
  FileCheck,
  Building2,
  GraduationCap,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Link, useNavigate } from 'react-router-dom';

const SPECIALIZATIONS = [
  'Kayachikitsa (Internal Medicine)',
  'Panchakarma & Constitutional Therapy',
  'Shalya Tantra (Surgical & Para-surgical)',
  'Shalakya Tantra (ENT & Ophthalmology)',
  'Prasuti & Stri Roga (Obstetrics & Gynecology)',
  'Kaumarbhritya (Pediatrics)',
  'Swasthavritta & Yoga (Preventive Medicine)',
  'General Ayurvedic Clinical Practice'
];

export const DoctorRegisterPage = ({ onTriggerToast }) => {
  const { doctorRegister, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    clinicalLicense: '',
    specialization: 'Kayachikitsa (Internal Medicine)',
    clinicInstitution: '',
    qualification: 'BAMS, MD (Ayurveda)',
    experienceYears: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredDoctor, setRegisteredDoctor] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const errors = {};

    // 1. Full name
    if (!formData.fullName.trim()) {
      errors.fullName = 'Physician full name is required.';
    }

    // 2. Email
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errors.email = 'Professional email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        errors.email = 'Please enter a valid professional email address.';
      }
    }

    // 3. Medical registration / license number
    if (!formData.clinicalLicense.trim()) {
      errors.clinicalLicense = 'Medical registration or state council license number is required.';
    }

    // 4. Password validation (minimum 8 characters)
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    // 5. Confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // 6. Experience years
    if (formData.experienceYears && (isNaN(Number(formData.experienceYears)) || Number(formData.experienceYears) < 0 || Number(formData.experienceYears) > 70)) {
      errors.experienceYears = 'Enter valid years of practice (0-70).';
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
        title: 'Validation Incomplete',
        message: 'Please resolve the highlighted form fields before submitting.',
      });
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        clinicalLicense: formData.clinicalLicense.trim(),
        specialization: formData.specialization,
        clinicInstitution: formData.clinicInstitution.trim(),
        qualification: formData.qualification.trim(),
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : 0,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const response = await doctorRegister(payload);
      setRegisteredDoctor(response.doctor);
      setIsSuccess(true);

      onTriggerToast?.({
        type: 'success',
        title: 'Registration Received',
        message: 'Credentials submitted for clinical administrative review.',
      });
    } catch (err) {
      setServerError(err.message || 'Physician registration failed. Please verify your details.');
    }
  };

  // Success Confirmation View
  if (isSuccess && registeredDoctor) {
    return (
      <div className="ayur-doctor-register-page">
        <div className="ayur-auth-botanical-bg" aria-hidden="true">
          <div className="botanical-shape shape-1" />
          <div className="botanical-shape shape-2" />
        </div>

        <div className="ayur-dreg-card ayur-dreg-success-card">
          <div className="ayur-dreg-success-icon-wrap">
            <CheckCircle2 size={40} className="text-success" />
          </div>

          <span className="ayur-dreg-status-pill pending">
            <Clock size={12} />
            <span>Pending Administrative Verification</span>
          </span>

          <h1 className="ayur-dreg-title">Registration Submitted</h1>
          <p className="ayur-dreg-subtitle mb-md">
            Thank you, {registeredDoctor.name}. Your clinical credentials have been recorded and are pending review by medical administration.
          </p>

          <div className="ayur-dreg-summary-box">
            <div className="ayur-dreg-summary-row">
              <span className="summary-label">Physician Name</span>
              <span className="summary-val font-semibold">{registeredDoctor.name}</span>
            </div>
            <div className="ayur-dreg-summary-row">
              <span className="summary-label">Professional Email</span>
              <span className="summary-val">{registeredDoctor.email}</span>
            </div>
            <div className="ayur-dreg-summary-row">
              <span className="summary-label">Clinical License</span>
              <span className="summary-val font-mono">{registeredDoctor.clinical_license}</span>
            </div>
            <div className="ayur-dreg-summary-row">
              <span className="summary-label">Specialization</span>
              <span className="summary-val">{registeredDoctor.specialization}</span>
            </div>
            <div className="ayur-dreg-summary-row">
              <span className="summary-label">Approval Status</span>
              <span className="summary-val text-amber-700 font-semibold">Awaiting Verification</span>
            </div>
          </div>

          <div className="ayur-dreg-info-notice">
            <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary m-0 leading-relaxed">
              In accordance with clinical governance standards, full access to patient intake dossiers and decision-support algorithms requires manual verification of your AYUSH registration. You will be able to sign in once approved.
            </p>
          </div>

          <div className="ayur-dreg-actions">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate('/doctor-login', { state: { email: registeredDoctor.email, fromRegistration: true } })}
              rightIcon={<ArrowRight size={16} />}
            >
              Go to Doctor Login
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => navigate('/')}
            >
              Return to Landing Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ayur-doctor-register-page">
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

      <div className="ayur-dreg-card">
        {/* Top Navigation */}
        <div className="ayur-dreg-top-bar">
          <Link to="/doctor-login" className="ayur-dreg-back-link" title="Return to Doctor Login">
            <ArrowLeft size={16} />
            <span>Doctor Login</span>
          </Link>
          <span className="ayur-dreg-tag">DOCTOR ONBOARDING</span>
        </div>

        {/* Header */}
        <div className="ayur-dreg-header">
          <div className="ayur-dreg-emblem">
            <Stethoscope size={28} className="text-primary" />
          </div>
          <h1 className="ayur-dreg-title">Doctor Account Registration</h1>
          <p className="ayur-dreg-subtitle">
            Register as a licensed Ayurvedic practitioner to access explainable clinical assessments and patient management.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="ayur-dreg-error-alert" role="alert">
            <AlertCircle size={18} className="shrink-0 text-error" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Doctor Registration Form */}
        <form onSubmit={handleSubmit} className="ayur-dreg-form" noValidate>
          {/* Section 1: Professional Identity */}
          <div className="ayur-dreg-section">
            <h2 className="ayur-dreg-section-title">Professional Identity</h2>
            <div className="ayur-dreg-grid-2">
              <FormField label="Full Name & Title" htmlFor="doc-fullname" required error={fieldErrors.fullName}>
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><User size={18} /></span>
                  <input
                    id="doc-fullname"
                    type="text"
                    className={`ayur-dreg-input ${fieldErrors.fullName ? 'ayur-input--error' : ''}`}
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Dr. Swetha"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.fullName)}
                  />
                </div>
              </FormField>

              <FormField label="Professional Email" htmlFor="doc-email" required error={fieldErrors.email}>
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><Mail size={18} /></span>
                  <input
                    id="doc-email"
                    type="email"
                    className={`ayur-dreg-input ${fieldErrors.email ? 'ayur-input--error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g dr.swetha@ayuRAG.org"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                </div>
              </FormField>
            </div>
          </div>

          {/* Section 2: Clinical Credentials */}
          <div className="ayur-dreg-section">
            <h2 className="ayur-dreg-section-title">Clinical Credentials</h2>
            <div className="ayur-dreg-grid-2">
              <FormField label="Medical Registration / License No." htmlFor="doc-license" required error={fieldErrors.clinicalLicense}>
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><FileCheck size={18} /></span>
                  <input
                    id="doc-license"
                    type="text"
                    className={`ayur-dreg-input ${fieldErrors.clinicalLicense ? 'ayur-input--error' : ''}`}
                    value={formData.clinicalLicense}
                    onChange={(e) => handleChange('clinicalLicense', e.target.value)}
                    placeholder="e.g. AYUSH-KA-2026-9012"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.clinicalLicense)}
                  />
                </div>
              </FormField>

              <FormField label="Primary Specialization" htmlFor="doc-specialization" required>
                <div className="ayur-dreg-input-wrap">
                  <select
                    id="doc-specialization"
                    className="ayur-dreg-input ayur-dreg-select"
                    value={formData.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                  >
                    {SPECIALIZATIONS.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </FormField>
            </div>

            <div className="ayur-dreg-grid-3">
              <FormField label="Clinic / Institution" htmlFor="doc-clinic">
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><Building2 size={16} /></span>
                  <input
                    id="doc-clinic"
                    type="text"
                    className="ayur-dreg-input"
                    value={formData.clinicInstitution}
                    onChange={(e) => handleChange('clinicInstitution', e.target.value)}
                    placeholder="e.g.AIMS"
                  />
                </div>
              </FormField>

              <FormField label="Qualifications" htmlFor="doc-qualifications">
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><GraduationCap size={16} /></span>
                  <input
                    id="doc-qualifications"
                    type="text"
                    className="ayur-dreg-input"
                    value={formData.qualification}
                    onChange={(e) => handleChange('qualification', e.target.value)}
                    placeholder="BAMS, MD (Ayurveda)"
                  />
                </div>
              </FormField>

              <FormField label="Experience (Yrs)" htmlFor="doc-experience" error={fieldErrors.experienceYears}>
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><Clock size={16} /></span>
                  <input
                    id="doc-experience"
                    type="number"
                    min="0"
                    max="70"
                    className={`ayur-dreg-input ${fieldErrors.experienceYears ? 'ayur-input--error' : ''}`}
                    value={formData.experienceYears}
                    onChange={(e) => handleChange('experienceYears', e.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>
              </FormField>
            </div>
          </div>

          {/* Section 3: Password Security */}
          <div className="ayur-dreg-section">
            <h2 className="ayur-dreg-section-title">Workspace Security</h2>
            <div className="ayur-dreg-grid-2">
              <FormField label="Password (Min. 8 chars)" htmlFor="doc-password" required error={fieldErrors.password}>
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><Lock size={18} /></span>
                  <input
                    id="doc-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`ayur-dreg-input ayur-input--has-action ${fieldErrors.password ? 'ayur-input--error' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Create password"
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  <button
                    type="button"
                    className="ayur-dreg-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm Password" htmlFor="doc-confirm-password" required error={fieldErrors.confirmPassword}>
                <div className="ayur-dreg-input-wrap">
                  <span className="ayur-dreg-input-icon"><Lock size={18} /></span>
                  <input
                    id="doc-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`ayur-dreg-input ayur-input--has-action ${fieldErrors.confirmPassword ? 'ayur-input--error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  />
                  <button
                    type="button"
                    className="ayur-dreg-toggle-btn"
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
            className="ayur-dreg-submit-btn"
          >
            {isLoading ? 'Submitting Credentials for Review...' : 'Submit Registration for Verification'}
          </Button>
        </form>

        {/* Existing Doctor Login */}
        <div className="ayur-dreg-switch">
          <span>Already registered as a physician?</span>
          <Link to="/doctor-login" className="ayur-dreg-switch-link">
            Sign In to Doctor Workspace →
          </Link>
        </div>

        {/* Security Policy Notice */}
        <div className="ayur-dreg-footer">
          <ShieldCheck size={15} className="text-secondary shrink-0" />
          <span>Institutional security policy: Accounts are activated following regulatory credential review by medical administration.</span>
        </div>
      </div>
    </div>
  );
};
