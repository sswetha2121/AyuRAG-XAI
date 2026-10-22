import React, { useState, useEffect } from 'react';
import './DoctorReviewNotesModal.css';
import { X, CheckCircle, Clock, Stethoscope, AlertTriangle, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorReviewNotesModal = ({
  isOpen = false,
  onClose,
  review = {},
  patientName = '',
  assessmentId = null,
  unverifiedCount = 0,
  onSaveReview,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState({
    summary: '',
    observations: '',
    recommendations: '',
    follow_up_notes: '',
    status: 'IN_REVIEW',
  });

  const [confirmedSignoff, setConfirmedSignoff] = useState(false);
  const [validationError, setValidationError] = useState('');

  const isAlreadyCompleted = review?.status === 'COMPLETED';

  useEffect(() => {
    if (review) {
      setFormData({
        summary: review.summary || '',
        observations: review.observations || '',
        recommendations: review.recommendations || '',
        follow_up_notes: review.follow_up_notes || '',
        status: review.status || 'IN_REVIEW',
      });
      setConfirmedSignoff(review.status === 'COMPLETED');
      setValidationError('');
    }
  }, [review, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.summary.trim()) {
      setValidationError('Please provide a concise clinical review summary before saving.');
      return;
    }

    if (formData.status === 'COMPLETED' && !confirmedSignoff) {
      setValidationError('Please acknowledge the clinical sign-off confirmation below before completing this review.');
      return;
    }

    onSaveReview?.({
      ...formData,
      summary: formData.summary.trim(),
      observations: formData.observations.trim(),
      recommendations: formData.recommendations.trim(),
      follow_up_notes: formData.follow_up_notes.trim(),
      assessment_id: assessmentId,
    });
  };

  return (
    <div className="ayur-modal-backdrop" onClick={onClose}>
      <div
        className="ayur-modal-card ayur-review-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        {/* Header */}
        <div className="ayur-modal-header">
          <div className="flex items-center gap-sm">
            <div className="ayur-modal-icon-badge">
              <Stethoscope size={18} />
            </div>
            <div>
              <h3 id="review-modal-title" className="ayur-modal-title">
                {isAlreadyCompleted ? 'Update / Reopen Clinical Review' : 'Clinical Review & Physician Sign-Off'}
              </h3>
              <span className="ayur-modal-subtitle">
                Patient: <strong>{patientName || 'Patient Record'}</strong> • Assessment ID #{assessmentId}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="ayur-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="ayur-modal-form">
          <div className="ayur-review-alert">
            <AlertTriangle size={15} className="text-warning flex-shrink-0" />
            <p className="ayur-review-alert__text">
              Physician review notes are strictly recorded independently in the clinical audit registry.
              Algorithmic model predictions, SHAP, and RAG groundings are preserved immutably.
            </p>
          </div>

          {/* Validation Warning */}
          {validationError && (
            <div className="p-sm rounded-md bg-danger-subtle text-danger text-xs font-semibold border border-danger">
              {validationError}
            </div>
          )}

          {/* Review Status Selector */}
          <div className="ayur-form-group">
            <label className="ayur-label">Clinical Workflow Status *</label>
            <div className="ayur-status-selector">
              {[
                {
                  value: 'PENDING',
                  label: 'Pending Review',
                  desc: isAlreadyCompleted ? 'Locked: Completed reviews cannot revert to pending' : 'Awaiting comprehensive inspection',
                  disabled: isAlreadyCompleted,
                },
                {
                  value: 'IN_REVIEW',
                  label: isAlreadyCompleted ? 'Reopen for Review (In Progress)' : 'In Review',
                  desc: 'Active clinical evaluation & note editing in progress',
                  disabled: false,
                },
                {
                  value: 'COMPLETED',
                  label: 'Completed & Signed',
                  desc: 'Validated by attending physician with final sign-off',
                  disabled: false,
                },
              ].map((s) => (
                <label
                  key={s.value}
                  className={`ayur-status-option ${formData.status === s.value ? 'ayur-status-option--selected' : ''} ${s.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    disabled={s.disabled}
                    checked={formData.status === s.value}
                    onChange={(e) => {
                      setFormData({ ...formData, status: e.target.value });
                      setValidationError('');
                    }}
                  />
                  <div>
                    <span className="ayur-status-option__title">{s.label}</span>
                    <span className="ayur-status-option__desc">{s.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Warning if selecting COMPLETED but unverified fields exist */}
          {formData.status === 'COMPLETED' && unverifiedCount > 0 && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(197, 160, 89, 0.12)',
                border: '1px solid var(--color-accent)',
                fontSize: '12px',
                lineHeight: 1.5,
              }}
            >
              <div className="flex items-center gap-xs font-semibold text-accent mb-2xs">
                <AlertTriangle size={15} />
                <span>Notice: {unverifiedCount} Unverified Field(s) Pending</span>
              </div>
              <p className="m-0 text-text-secondary text-xs">
                This patient currently has {unverifiedCount} field(s) unverified in Clinical Verification (Tab 1).
                It is strongly recommended to verify or correct all fields prior to final sign-off.
              </p>
            </div>
          )}

          {/* Review Summary */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="review-summary">
              Review Summary *
            </label>
            <textarea
              id="review-summary"
              rows={2}
              className="ayur-textarea"
              placeholder="Concise clinical assessment overview (e.g. Concordant with metabolic sluggishness inference...)"
              value={formData.summary}
              onChange={(e) => {
                setFormData({ ...formData, summary: e.target.value });
                setValidationError('');
              }}
              required
            />
          </div>

          {/* Observations */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="review-obs">
              Clinical Observations & Pulse/Tongue Correlation
            </label>
            <textarea
              id="review-obs"
              rows={3}
              className="ayur-textarea"
              placeholder="Physician findings, tongue coating (Ama) notes, sleep architecture observations..."
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            />
          </div>

          {/* Recommendations Adjustments */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="review-recs">
              Physician Recommendations & Formulations
            </label>
            <textarea
              id="review-recs"
              rows={3}
              className="ayur-textarea"
              placeholder="Prescribed wholesome dietary adjustments, supportive herbs, and daily routine modifications..."
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
            />
          </div>

          {/* Follow-up Notes */}
          <div className="ayur-form-group">
            <label className="ayur-label" htmlFor="review-followup">
              Follow-Up & Monitoring Schedule
            </label>
            <input
              id="review-followup"
              type="text"
              className="ayur-input"
              placeholder="e.g. Follow-up consultation in 14 days for digestive reassessment."
              value={formData.follow_up_notes}
              onChange={(e) => setFormData({ ...formData, follow_up_notes: e.target.value })}
            />
          </div>

          {/* Confirmation Checkbox when marking COMPLETED */}
          {formData.status === 'COMPLETED' && (
            <div
              style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <label className="flex items-start gap-sm cursor-pointer m-0">
                <input
                  type="checkbox"
                  style={{ marginTop: '3px' }}
                  checked={confirmedSignoff}
                  onChange={(e) => {
                    setConfirmedSignoff(e.target.checked);
                    setValidationError('');
                  }}
                />
                <span className="text-xs text-text-primary leading-relaxed font-semibold">
                  I confirm that clinical assessment findings and patient constitutional parameters have been examined,
                  and I approve this case evaluation and personalized protocol.
                </span>
              </label>
            </div>
          )}

          {/* Footer Controls */}
          <div className="ayur-modal-footer">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSaving}
              leftIcon={formData.status === 'COMPLETED' ? <CheckCircle size={16} /> : <Save size={16} />}
            >
              {formData.status === 'COMPLETED'
                ? (isAlreadyCompleted ? 'Update Signed Review' : 'Finalize & Sign Review')
                : (isAlreadyCompleted ? 'Reopen for Review' : 'Save Review Notes')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
