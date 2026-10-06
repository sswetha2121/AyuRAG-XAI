import React, { useState, useEffect } from 'react';
import './DoctorPatientVerification.css';
import { api } from '../../services/api';
import {
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Clock,
  AlertTriangle,
  User,
  Activity,
  Moon,
  Utensils,
  HeartPulse,
  Save,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorPatientVerification = ({
  patientId,
  onProfileUpdated,
  onTriggerToast,
}) => {
  const [verifications, setVerifications] = useState([]);
  const [stats, setStats] = useState({ total_fields: 0, verified: 0, corrected: 0, unverified: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Correction modal / inline state
  const [correctingField, setCorrectingField] = useState(null);
  const [correctedValue, setCorrectedValue] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVerifications = async () => {
    try {
      setIsLoading(true);
      const data = await api.getPatientVerifications(patientId);
      setVerifications(data.verifications || []);
      setStats(data.stats || { total_fields: 0, verified: 0, corrected: 0, unverified: 0 });
      if (onProfileUpdated && data.effective_profile) {
        onProfileUpdated(data.effective_profile);
      }
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Verification Load Failed',
        message: err.message || 'Could not load patient verification records.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchVerifications();
    }
  }, [patientId]);

  const handleVerify = async (fieldName) => {
    try {
      const res = await api.verifyPatientField(patientId, {
        field_name: fieldName,
        action: 'VERIFY',
      });

      onTriggerToast?.({
        type: 'success',
        title: 'Field Verified',
        message: res.message || 'Field confirmed with patient-reported value.',
      });

      fetchVerifications();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Verification Failed',
        message: err.message || 'Could not verify field.',
      });
    }
  };

  const handleOpenCorrect = (item) => {
    setCorrectingField(item);
    const initialVal = item.verification_status === 'CORRECTED' && item.verified_value !== null
      ? (typeof item.verified_value === 'object' ? JSON.stringify(item.verified_value) : String(item.verified_value))
      : (typeof item.patient_value === 'object' ? JSON.stringify(item.patient_value) : String(item.patient_value || ''));
    setCorrectedValue(initialVal);
    setDoctorNote(item.doctor_note || '');
  };

  const handleSubmitCorrection = async (e) => {
    e.preventDefault();
    if (!correctingField) return;

    try {
      setIsSubmitting(true);
      let parsedVal = correctedValue;
      if (typeof correctingField.patient_value === 'number') {
        parsedVal = Number(correctedValue);
      } else if (Array.isArray(correctingField.patient_value)) {
        parsedVal = correctedValue.split(',').map((s) => s.trim()).filter(Boolean);
      }

      const res = await api.verifyPatientField(patientId, {
        field_name: correctingField.field_name,
        action: 'CORRECT',
        verified_value: parsedVal,
        doctor_note: doctorNote,
      });

      onTriggerToast?.({
        type: 'success',
        title: 'Clinical Correction Saved',
        message: res.message || 'Physician corrected value recorded.',
      });

      setCorrectingField(null);
      fetchVerifications();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Correction Error',
        message: err.message || 'Could not save corrected value.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAll = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.verifyAllFields(patientId);
      onTriggerToast?.({
        type: 'success',
        title: 'All Fields Verified',
        message: res.message || 'All unverified fields marked as confirmed.',
      });
      fetchVerifications();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Verification Error',
        message: err.message || 'Could not complete batch verification.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Fields', icon: ShieldCheck, count: stats.total_fields },
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'prakriti', label: 'Body Constitution', icon: Activity },
    { id: 'lifestyle', label: 'Lifestyle & Daily Routine', icon: Moon },
    { id: 'diet', label: 'Diet & Digestion', icon: Utensils },
    { id: 'symptoms', label: 'Symptoms & Chronicity', icon: HeartPulse },
  ];

  const filteredVerifications = activeCategory === 'all'
    ? verifications
    : verifications.filter((v) => v.category === activeCategory);

  const formatValue = (val) => {
    if (val === null || val === undefined || val === '') return <span className="ayur-val-null">Not Specified</span>;
    if (Array.isArray(val)) return val.length ? val.join(', ') : <span className="ayur-val-null">None</span>;
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  if (isLoading) {
    return (
      <div className="ayur-verification-loading">
        <div className="ayur-spinner-mini" />
        <span>Loading clinical verification workspace...</span>
      </div>
    );
  }

  const reviewPercent = stats.total_fields > 0
    ? Math.round(((stats.verified + stats.corrected) / stats.total_fields) * 100)
    : 0;

  return (
    <div className="ayur-verification-container">
      {/* Header & Progress Banner */}
      <div className="ayur-verification-header">
        <div className="ayur-verification-header__left">
          <div className="ayur-verification-icon-wrap">
            <ShieldCheck size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="ayur-verification-title">Clinical Verification Console</h2>
            <p className="ayur-verification-subtitle">
              Verify or correct patient-reported parameters before AI diet synthesis. Preserves original submissions.
            </p>
          </div>
        </div>

        <div className="ayur-verification-header__right">
          <div className="ayur-verification-progress-card">
            <div className="flex items-center justify-between mb-xs">
              <span className="ayur-vprog-label">Clinical Verification Progress</span>
              <span className="ayur-vprog-percent">{reviewPercent}%</span>
            </div>
            <div className="ayur-vprog-track">
              <div
                className="ayur-vprog-fill"
                style={{ width: `${reviewPercent}%` }}
              />
            </div>
            <div className="ayur-vprog-stats">
              <span className="badge-stat text-success">✓ {stats.verified} Verified</span>
              <span className="badge-stat text-secondary">✎ {stats.corrected} Corrected</span>
              <span className="badge-stat text-warning">● {stats.unverified} Unverified</span>
            </div>
          </div>

          {stats.unverified > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerifyAll}
              disabled={isSubmitting}
              leftIcon={<CheckCircle2 size={16} />}
            >
              Verify All Unverified ({stats.unverified})
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="ayur-verification-tabs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = cat.id === 'all'
            ? stats.total_fields
            : verifications.filter((v) => v.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              className={`ayur-vtab ${activeCategory === cat.id ? 'ayur-vtab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
              <span className="ayur-vtab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Verification Fields Grid */}
      <div className="ayur-vfields-grid">
        {filteredVerifications.map((field) => {
          const isVerified = field.verification_status === 'VERIFIED';
          const isCorrected = field.verification_status === 'CORRECTED';
          const isUnverified = field.verification_status === 'UNVERIFIED';

          return (
            <div
              key={field.id || field.field_name}
              className={`ayur-vfield-card ${isCorrected ? 'ayur-vfield-card--corrected' : ''} ${isVerified ? 'ayur-vfield-card--verified' : ''}`}
            >
              <div className="ayur-vfield-card__header">
                <span className="ayur-vfield-label">{field.field_label || field.field_name}</span>
                <span className={`ayur-vstatus-badge ayur-vstatus-badge--${field.verification_status.toLowerCase()}`}>
                  {isVerified && '✓ DOCTOR VERIFIED'}
                  {isCorrected && '✎ DOCTOR CORRECTED'}
                  {isUnverified && '● UNVERIFIED'}
                </span>
              </div>

              <div className="ayur-vfield-comparison">
                {/* Patient Reported Box */}
                <div className="ayur-vbox ayur-vbox--patient">
                  <span className="ayur-vbox__tag">PATIENT REPORTED</span>
                  <div className="ayur-vbox__content">
                    {formatValue(field.patient_value)}
                  </div>
                </div>

                {/* Doctor Verified / Corrected Box */}
                <div className={`ayur-vbox ayur-vbox--doctor ${isCorrected ? 'ayur-vbox--corrected-highlight' : ''}`}>
                  <span className="ayur-vbox__tag">
                    {isCorrected ? 'DOCTOR CORRECTED (ACTIVE)' : 'DOCTOR VERIFIED'}
                  </span>
                  <div className="ayur-vbox__content">
                    {isUnverified ? (
                      <span className="text-muted italic">Pending physician verification</span>
                    ) : (
                      formatValue(field.verified_value)
                    )}
                  </div>
                </div>
              </div>

              {/* Physician Note & Metadata */}
              {(field.doctor_note || field.verified_at) && (
                <div className="ayur-vfield-meta">
                  {field.doctor_note && (
                    <div className="ayur-vfield-note">
                      <Info size={14} className="text-secondary shrink-0" />
                      <span><strong>Doctor Note:</strong> {field.doctor_note}</span>
                    </div>
                  )}
                  {field.verified_at && (
                    <div className="ayur-vfield-timestamp">
                      <Clock size={12} />
                      <span>
                        Verified by {field.doctor_name || 'Physician'} on{' '}
                        {new Date(field.verified_at).toLocaleDateString()} at{' '}
                        {new Date(field.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="ayur-vfield-actions">
                <Button
                  size="sm"
                  variant={isVerified ? 'primary' : 'outline'}
                  onClick={() => handleVerify(field.field_name)}
                  leftIcon={<CheckCircle2 size={14} />}
                >
                  {isVerified ? 'Verified' : 'Verify'}
                </Button>
                <Button
                  size="sm"
                  variant={isCorrected ? 'primary' : 'ghost'}
                  onClick={() => handleOpenCorrect(field)}
                  leftIcon={<Edit3 size={14} />}
                >
                  {isCorrected ? 'Edit Correction' : 'Correct'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Correction Modal */}
      {correctingField && (
        <div className="ayur-correction-modal-overlay">
          <div className="ayur-correction-modal">
            <div className="ayur-cmodal-header">
              <div className="flex items-center gap-xs">
                <Edit3 size={18} className="text-secondary" />
                <h3 className="ayur-cmodal-title">
                  Correct Field: {correctingField.field_label || correctingField.field_name}
                </h3>
              </div>
              <button
                type="button"
                className="ayur-modal-close"
                onClick={() => setCorrectingField(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCorrection} className="ayur-cmodal-body">
              <div className="ayur-cmodal-reference">
                <span className="text-xs text-muted font-semibold uppercase">Patient Reported Value:</span>
                <p className="ayur-ref-val">{formatValue(correctingField.patient_value)}</p>
                <small className="text-muted">
                  The original patient submission will remain intact for clinical audit integrity.
                </small>
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">Physician Verified Value *</label>
                <input
                  type="text"
                  className="ayur-input"
                  value={correctedValue}
                  onChange={(e) => setCorrectedValue(e.target.value)}
                  placeholder="Enter clinically adjusted value..."
                  required
                />
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">Clinical Rationale / Doctor Note (Optional)</label>
                <textarea
                  className="ayur-textarea"
                  rows={3}
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                  placeholder="E.g., Adjusted based on clinical interview: patient sleeps 6 hours with 1 hr daytime sleep..."
                />
              </div>

              <div className="ayur-cmodal-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCorrectingField(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  leftIcon={<Save size={16} />}
                >
                  {isSubmitting ? 'Saving...' : 'Save Clinical Correction'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
