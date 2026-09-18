import React, { useState } from 'react';
import './PersonalInfoPage.css';
import { useAssessment } from '../context/AssessmentContext';
import { PersonalInfoForm, ProfilePreview } from '../components/personal-info';
import { Button, Badge, ProgressBar } from '../components/ui';
import { ArrowRight, Sparkles, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PersonalInfoPage = ({ onContinue, onTriggerToast }) => {
  const { personalInfo, updatePersonalInfo, resetPersonalInfo, markStepCompleted } = useAssessment();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // 1. Full Name
    if (!personalInfo.fullName || !personalInfo.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (personalInfo.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    // 2. Age
    if (!personalInfo.age) {
      newErrors.age = 'Please enter your age.';
    } else {
      const ageNum = Number(personalInfo.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = 'Please enter a valid age between 1 and 120.';
      }
    }

    // 3. Gender
    if (!personalInfo.gender) {
      newErrors.gender = 'Please select a gender option.';
    }

    // 4. Height
    if (!personalInfo.height) {
      newErrors.height = 'Please enter your height.';
    } else {
      const hNum = Number(personalInfo.height);
      if (isNaN(hNum) || hNum <= 0) {
        newErrors.height = 'Please enter a valid positive height.';
      }
    }

    // 5. Weight
    if (!personalInfo.weight) {
      newErrors.weight = 'Please enter your weight.';
    } else {
      const wNum = Number(personalInfo.weight);
      if (isNaN(wNum) || wNum <= 0) {
        newErrors.weight = 'Please enter a valid positive weight.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    updatePersonalInfo(field, value);
    // Clear error on change if existing
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all personal information fields?')) {
      resetPersonalInfo();
      setErrors({});
      onTriggerToast?.({
        type: 'info',
        title: 'Form Reset',
        message: 'Personal profile fields have been cleared.'
      });
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const isValid = validateForm();

    if (!isValid) {
      onTriggerToast?.({
        type: 'error',
        title: 'Validation Error',
        message: 'Please complete all required fields with valid parameters.'
      });
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.ayur-form-field--error, .ayur-gender-selector--error');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      markStepCompleted('personal-info');
      onTriggerToast?.({
        type: 'success',
        title: 'Profile Baseline Saved',
        message: 'Personal information recorded successfully in session.'
      });
      onContinue?.();
    }, 600);
  };

  return (
    <div className="ayur-pi-page">
      {/* Screen Header Banner */}
      <div className="ayur-pi-header">
        <div className="ayur-pi-header__meta">
          <div className="flex items-center gap-xs">
            <Badge color="accent" variant="subtle" size="md" icon={<Sparkles size={13} />}>
              Step 01 of 06
            </Badge>
            <Badge color="primary" variant="subtle" size="md">
              Baseline Demographics
            </Badge>
          </div>
          <div className="ayur-pi-header__progress">
            <span className="text-caption text-muted font-medium">Pipeline Progress</span>
            <ProgressBar value={17} color="accent" size="sm" showValue />
          </div>
        </div>

        <h1 className="ayur-pi-header__title">
          Let's build your <span className="ayur-pi-title-accent">Ayurvedic profile</span>
        </h1>

        <p className="ayur-pi-header__desc">
          Tell us a little about yourself. This baseline information helps AyuRAG-XAI calibrate your physiological constitution and environmental context.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="ayur-pi-layout">
        {/* Left Column: Form */}
        <div className="ayur-pi-form-col">
          <PersonalInfoForm
            formData={personalInfo}
            onChange={handleFieldChange}
            errors={errors}
            disabled={isSubmitting}
          />

          {/* Action Buttons */}
          <div className="ayur-pi-actions">
            <Button
              variant="ghost"
              leftIcon={<RotateCcw size={15} />}
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Save & Continue
            </Button>
          </div>
        </div>

        {/* Right Column: Live Dynamic Preview */}
        <div className="ayur-pi-preview-col">
          <ProfilePreview formData={personalInfo} />
        </div>
      </div>
    </div>
  );
};
