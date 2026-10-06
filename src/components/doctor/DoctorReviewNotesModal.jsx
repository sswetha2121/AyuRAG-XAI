import React, { useState, useEffect } from 'react';
import './DoctorReviewNotesModal.css';
import { X, CheckCircle, Clock, Stethoscope, AlertTriangle, Save } from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorReviewNotesModal = ({
  isOpen = false,
  onClose,
  review = {},
  patientName = '',
  assessmentId = null,
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

  useEffect(() => {
    if (review) {
      setFormData({
        summary: review.summary || '',
        observations: review.observations || '',
        recommendations: review.recommendations || '',
        follow_up_notes: review.follow_up_notes || '',
        status: review.status || 'IN_REVIEW',
      });
    }
  }, [review]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveReview?.({
      ...formData,
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
                Clinical Review & Physician Sign-Off
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

          {/* Review Status Selector */}
          <div className="ayur-form-group">
            <label className="ayur-label">Clinical Workflow Status *</label>
            <div className="ayur-status-selector">
              {[
                { value: 'PENDING', label: 'Pending Review', desc: 'Awaiting comprehensive inspection' },
                { value: 'IN_REVIEW', label: 'In Review', desc: 'Active clinical evaluation in progress' },
                { value: 'COMPLETED', label: 'Completed & Signed', desc: 'Validated by attending physician' },
              ].map((s) => (
                <label
                  key={s.value}
                  className={`ayur-status-option ${formData.status === s.value ? 'ayur-status-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    checked={formData.status === s.value}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  <div>
                    <span className="ayur-status-option__title">{s.label}</span>
                    <span className="ayur-status-option__desc">{s.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

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
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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

          {/* Footer Controls */}
          <div className="ayur-modal-footer">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSaving}
              leftIcon={<Save size={16} />}
            >
              {formData.status === 'COMPLETED' ? 'Finalize & Sign Review' : 'Save Review Notes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
