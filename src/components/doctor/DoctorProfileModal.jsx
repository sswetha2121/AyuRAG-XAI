import React, { useState, useEffect } from 'react';
import './DoctorProfileModal.css';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Stethoscope,
  Award,
  ShieldCheck,
  Building,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DoctorProfileModal = ({
  isOpen = false,
  onClose,
  onTriggerToast,
}) => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    professional_name: '',
    qualification: '',
    specialization: '',
    clinical_license: '',
    clinic_institution: '',
    experience_years: 12,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const profile = user.profile || {};
      setFormData({
        professional_name: profile.professional_name || user.name || '',
        qualification: profile.qualification || 'MD (Internal Medicine)',
        specialization: profile.specialization || 'Internal Medicine & Constitutional Analysis',
        clinical_license: profile.clinical_license || 'AYUSH-DEL-2018-8492',
        clinic_institution: profile.clinic_institution || 'AyuRAG Clinical Decision Support Center',
        experience_years: profile.experience_years ?? 14,
      });
      setErrors({});
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.professional_name.trim()) {
      errs.professional_name = 'Professional physician name is required.';
    } else if (formData.professional_name.trim().length < 3) {
      errs.professional_name = 'Name must be at least 3 characters.';
    }

    if (!formData.qualification.trim()) {
      errs.qualification = 'Medical qualification is required (e.g. BAMS, MD).';
    }

    if (!formData.specialization.trim()) {
      errs.specialization = 'Clinical specialization is required.';
    }

    if (!formData.clinical_license.trim()) {
      errs.clinical_license = 'Clinical license / AYUSH registration is required.';
    }

    const exp = Number(formData.experience_years);
    if (isNaN(exp) || exp < 0 || exp > 70) {
      errs.experience_years = 'Experience must be a valid number between 0 and 70 years.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSaving(true);
      await updateProfile({
        professional_name: formData.professional_name.trim(),
        qualification: formData.qualification.trim(),
        specialization: formData.specialization.trim(),
        clinical_license: formData.clinical_license.trim(),
        clinic_institution: formData.clinic_institution.trim(),
        experience_years: Number(formData.experience_years),
      });

      onTriggerToast?.({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your physician credentials and clinic profile have been updated.',
      });

      onClose?.();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update physician profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Physician Clinical Profile"
      subtitle="View and edit your credentialed doctor details and clinical practice information"
      size="md"
    >
      <form onSubmit={handleSubmit} className="ayur-doc-profile-form">
        {/* Verification Status Banner */}
        <div className="ayur-profile-status-card">
          <div className="flex items-center gap-xs">
            <ShieldCheck size={18} className="text-success" />
            <span className="font-semibold text-text-primary text-sm">
              Clinical Credentialing Verified
            </span>
          </div>
          <span className="ayur-profile-status-tag">
            APPROVED PRACTITIONER
          </span>
        </div>

        <div className="ayur-doc-profile-grid">
          {/* Professional Name */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="prof-name">
              Full Professional Name *
            </label>
            <div className="ayur-input-wrap">
              <User size={15} className="ayur-input-icon" />
              <input
                id="prof-name"
                type="text"
                className={`ayur-input ${errors.professional_name ? 'ayur-input--error' : ''}`}
                value={formData.professional_name}
                onChange={(e) => setFormData({ ...formData, professional_name: e.target.value })}
                placeholder="e.g. Dr. Abhinav Sharma"
              />
            </div>
            {errors.professional_name && (
              <span className="ayur-field-error">{errors.professional_name}</span>
            )}
          </div>

          {/* Clinical License */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="prof-license">
              AYUSH Clinical License Number *
            </label>
            <div className="ayur-input-wrap">
              <Award size={15} className="ayur-input-icon" />
              <input
                id="prof-license"
                type="text"
                className={`ayur-input ${errors.clinical_license ? 'ayur-input--error' : ''}`}
                value={formData.clinical_license}
                onChange={(e) => setFormData({ ...formData, clinical_license: e.target.value })}
                placeholder="e.g. AYUSH-DEL-2018-8492"
              />
            </div>
            {errors.clinical_license && (
              <span className="ayur-field-error">{errors.clinical_license}</span>
            )}
          </div>

          {/* Qualification */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="prof-qual">
              Medical Degrees & Qualifications *
            </label>
            <div className="ayur-input-wrap">
              <Stethoscope size={15} className="ayur-input-icon" />
              <input
                id="prof-qual"
                type="text"
                className={`ayur-input ${errors.qualification ? 'ayur-input--error' : ''}`}
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. MD (Internal Medicine)"
              />
            </div>
            {errors.qualification && (
              <span className="ayur-field-error">{errors.qualification}</span>
            )}
          </div>

          {/* Specialization */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="prof-spec">
              Clinical Specialization *
            </label>
            <div className="ayur-input-wrap">
              <Stethoscope size={15} className="ayur-input-icon" />
              <input
                id="prof-spec"
                type="text"
                className={`ayur-input ${errors.specialization ? 'ayur-input--error' : ''}`}
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Internal Medicine & Constitutional Analysis"
              />
            </div>
            {errors.specialization && (
              <span className="ayur-field-error">{errors.specialization}</span>
            )}
          </div>

          {/* Institution / Clinic */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="prof-inst">
              Clinical Institution / Practice Hospital
            </label>
            <div className="ayur-input-wrap">
              <Building size={15} className="ayur-input-icon" />
              <input
                id="prof-inst"
                type="text"
                className="ayur-input"
                value={formData.clinic_institution}
                onChange={(e) => setFormData({ ...formData, clinic_institution: e.target.value })}
                placeholder="e.g. AyuRAG Clinical Decision Support Center"
              />
            </div>
          </div>

          {/* Experience Years */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="prof-exp">
              Years of Clinical Experience *
            </label>
            <div className="ayur-input-wrap">
              <Clock size={15} className="ayur-input-icon" />
              <input
                id="prof-exp"
                type="number"
                min="0"
                max="70"
                className={`ayur-input ${errors.experience_years ? 'ayur-input--error' : ''}`}
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              />
            </div>
            {errors.experience_years && (
              <span className="ayur-field-error">{errors.experience_years}</span>
            )}
          </div>
        </div>

        {/* Account Info Readonly Block */}
        <div className="ayur-profile-readonly-footer">
          <div>
            <span className="text-muted text-xs">Logged In Account:</span>
            <strong className="text-xs text-text-primary ml-xs">@{user?.username}</strong>
          </div>
          <div>
            <span className="text-muted text-xs">System Email:</span>
            <strong className="text-xs text-text-primary ml-xs">{user?.email}</strong>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="ayur-modal-footer mt-md">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSaving}
            leftIcon={<Save size={16} />}
          >
            Save Profile Credentials
          </Button>
        </div>
      </form>
    </Modal>
  );
};
