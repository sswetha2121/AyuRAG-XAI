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
      setRegisteredDoctor(response.doctor || {
        name: payload.fullName,
        email: payload.email,
        clinical_license: payload.clinicalLicense,
        specialization: payload.specialization
      });
      setIsSuccess(true);

      onTriggerToast?.({
        type: 'success',
        title: 'Registration Submitted',
        message: 'Your physician credentials have been submitted for verification.',
      });
    } catch (err) {
      setServerError(err.message || 'Doctor registration failed. Please review your credentials.');
      onTriggerToast?.({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Failed to submit registration.',
      });
    }
  };

  // SUCCESS STATE VIEW
  if (isSuccess) {
    const docIdentifier = registeredDoctor?.username || registeredDoctor?.email || formData.email;
    return (
      <div className="ayur-dreg-page">
        <div className="ayur-dreg-card ayur-dreg-success-card">
          <div className="ayur-dreg-success-emblem">
            <CheckCircle2 size={36} className="text-secondary" />
          </div>

          <h1 className="ayur-dreg-success-title">Registration submitted successfully</h1>
          <p className="ayur-dreg-success-subtitle">
            Your doctor account is awaiting verification. You will be able to access the Doctor Portal after your account is approved.
          </p>

          {registeredDoctor && (
            <div className="ayur-dreg-summary-box">
              <div className="ayur-dreg-summary-row">
                <span className="ayur-dreg-summary-label">Physician Name:</span>
                <span className="ayur-dreg-summary-val">{registeredDoctor.name}</span>
              </div>
              {registeredDoctor.username && (
                <div className="ayur-dreg-summary-row">
                  <span className="ayur-dreg-summary-label">Username:</span>
                  <span className="ayur-dreg-summary-val font-mono">@{registeredDoctor.username}</span>
                </div>
              )}
              <div className="ayur-dreg-summary-row">
                <span className="ayur-dreg-summary-label">Professional Email:</span>
                <span className="ayur-dreg-summary-val">{registeredDoctor.email}</span>
              </div>
              <div className="ayur-dreg-summary-row">
                <span className="ayur-dreg-summary-label">Council License:</span>
                <span className="ayur-dreg-summary-val font-mono">{registeredDoctor.clinical_license}</span>
              </div>
              <div className="ayur-dreg-summary-row">
                <span className="ayur-dreg-summary-label">Specialization:</span>
                <span className="ayur-dreg-summary-val">{registeredDoctor.specialization}</span>
              </div>
              <div className="ayur-dreg-summary-row">
                <span className="ayur-dreg-summary-label">Account Status:</span>
                <span className="ayur-dreg-status-pill">Pending Administrative Verification</span>
              </div>
            </div>
          )}

          {/* Local Development & Admin Approval Notice */}
          <div className="ayur-dreg-dev-approval-box">
            <div className="ayur-dreg-dev-header">
              <span className="ayur-dreg-dev-tag">Administrator / Dev Verification</span>
            </div>
            <p className="ayur-dreg-dev-desc">
              For local testing and administrative approval, run the backend management command:
            </p>
            <div className="ayur-dreg-cmd-wrap">
              <code className="ayur-dreg-cmd-code">
                python manage.py approve_doctor {docIdentifier}
              </code>
            </div>
            <span className="ayur-dreg-dev-admin-link">
              Or approve in <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noreferrer">Django Admin (/admin/)</a> using staff credentials.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="ayur-dreg-actions-row">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate('/doctor-login', {
                state: {
                  username: docIdentifier,
                  email: registeredDoctor?.email || formData.email,
                  fromRegistration: true
                }
              })}
              rightIcon={<ArrowRight size={16} />}
              className="ayur-dreg-back-btn"
            >
              Proceed to Doctor Login
            </Button>

            <button
              type="button"
              className="ayur-dreg-secondary-btn"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
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
              }}
            >
              Register another physician account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM VIEW
  return (
    <div className="ayur-dreg-page">
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
            <Stethoscope size={28} className="text-secondary" />
          </div>
          <h1 className="ayur-dreg-title">Doctor Account Registration</h1>
          <p className="ayur-dreg-subtitle">
            Register as a licensed Ayurvedic practitioner to access explainable clinical assessments and patient management.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="ayur-dreg-server-error" role="alert">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="ayur-dreg-form" noValidate>
          {/* Full Name & Email */}
          <div className="ayur-dreg-grid">
            <FormField
              label="Full Name & Title"
              htmlFor="doc-fullname"
              required
              error={fieldErrors.fullName}
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <User size={16} />
                </span>
                <input
                  id="doc-fullname"
                  type="text"
                  className={`ayur-dreg-input ${fieldErrors.fullName ? 'ayur-dreg-input--error' : ''}`}
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="e.g. Dr. Swetha"
                  autoComplete="name"
                  required
                />
              </div>
            </FormField>

            <FormField
              label="Professional Email"
              htmlFor="doc-email"
              required
              error={fieldErrors.email}
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  id="doc-email"
                  type="email"
                  className={`ayur-dreg-input ${fieldErrors.email ? 'ayur-dreg-input--error' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="e.g. dr.swetha@ayurhospital.org"
                  autoComplete="email"
                  required
                />
              </div>
            </FormField>
          </div>

          {/* Clinical License & Specialization */}
          <div className="ayur-dreg-grid">
            <FormField
              label="Medical Registration / License No."
              htmlFor="doc-license"
              required
              error={fieldErrors.clinicalLicense}
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <FileCheck size={16} />
                </span>
                <input
                  id="doc-license"
                  type="text"
                  className={`ayur-dreg-input ${fieldErrors.clinicalLicense ? 'ayur-dreg-input--error' : ''}`}
                  value={formData.clinicalLicense}
                  onChange={(e) => handleChange('clinicalLicense', e.target.value)}
                  placeholder="e.g. AYUSH-KA-2026-9012"
                  required
                />
              </div>
            </FormField>

            <FormField
              label="Primary Specialization"
              htmlFor="doc-specialization"
            >
              <div className="ayur-dreg-input-wrap">
                <select
                  id="doc-specialization"
                  className="ayur-dreg-input ayur-dreg-select"
                  value={formData.specialization}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>
          </div>

          {/* Institution, Qualification & Experience */}
          <div className="ayur-dreg-grid-3">
            <FormField
              label="Clinic / Institution"
              htmlFor="doc-institution"
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <Building2 size={16} />
                </span>
                <input
                  id="doc-institution"
                  type="text"
                  className="ayur-dreg-input"
                  value={formData.clinicInstitution}
                  onChange={(e) => handleChange('clinicInstitution', e.target.value)}
                  placeholder="e.g. All India Institute of Ayurveda"
                />
              </div>
            </FormField>

            <FormField
              label="Qualifications"
              htmlFor="doc-qualification"
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <GraduationCap size={16} />
                </span>
                <input
                  id="doc-qualification"
                  type="text"
                  className="ayur-dreg-input"
                  value={formData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  placeholder="e.g. BAMS, MD (Ayurveda)"
                />
              </div>
            </FormField>

            <FormField
              label="Experience (Yrs)"
              htmlFor="doc-experience"
              error={fieldErrors.experienceYears}
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <Clock size={16} />
                </span>
                <input
                  id="doc-experience"
                  type="number"
                  min="0"
                  max="70"
                  className={`ayur-dreg-input ${fieldErrors.experienceYears ? 'ayur-dreg-input--error' : ''}`}
                  value={formData.experienceYears}
                  onChange={(e) => handleChange('experienceYears', e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
            </FormField>
          </div>

          {/* Password & Confirm Password */}
          <div className="ayur-dreg-grid">
            <FormField
              label="Password (min. 8 characters)"
              htmlFor="doc-password"
              required
              error={fieldErrors.password}
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  id="doc-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`ayur-dreg-input ayur-dreg-input--has-toggle ${fieldErrors.password ? 'ayur-dreg-input--error' : ''}`}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="ayur-dreg-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <FormField
              label="Confirm Password"
              htmlFor="doc-confirm-password"
              required
              error={fieldErrors.confirmPassword}
            >
              <div className="ayur-dreg-input-wrap">
                <span className="ayur-dreg-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  id="doc-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`ayur-dreg-input ayur-dreg-input--has-toggle ${fieldErrors.confirmPassword ? 'ayur-dreg-input--error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="ayur-dreg-toggle-pw"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>
          </div>

          <Button
            variant="primary"
            size="md"
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            rightIcon={<ArrowRight size={16} />}
            className="ayur-dreg-submit-btn"
          >
            Submit Registration for Verification
          </Button>
        </form>

        {/* Existing Doctor Login Link */}
        <div className="ayur-dreg-footer-link">
          <span>Already registered as a physician?</span>
          <Link to="/doctor-login" className="ayur-dlink">
            Sign In to Doctor Workspace →
          </Link>
        </div>

        {/* Verification & Audit Disclaimer */}
        <div className="ayur-dreg-footer">
          <ShieldCheck size={14} className="text-secondary shrink-0" />
          <span>
            Institutional security policy: Accounts are activated following regulatory credential review by medical administration.
          </span>
        </div>
      </div>
    </div>
  );
};
