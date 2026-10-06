import React, { useState, useEffect } from 'react';
import './Symptoms.css';
import { SYMPTOM_DETAIL_CONFIGS } from '../../data/symptomQuestions';
import { Button } from '../ui/Button';
import { Check, X, ShieldAlert } from 'lucide-react';

/**
 * AyuRAG-XAI SymptomDetailModal Component
 * Interactive detail panel for specifying severity, frequency, duration, and everyday impact.
 * Only displays fields supported by the symptom's definition.
 */
export const SymptomDetailModal = ({
  symptom,
  details = {},
  onSave,
  onClose,
  isOpen = true
}) => {
  if (!isOpen || !symptom) return null;

  const [localDetails, setLocalDetails] = useState({
    severity: details.severity || 'mild',
    frequency: details.frequency || 'sometimes',
    duration: details.duration || '1_4_weeks',
    impact: details.impact || 'minimal',
    notes: details.notes || ''
  });

  useEffect(() => {
    setLocalDetails({
      severity: details.severity || 'mild',
      frequency: details.frequency || 'sometimes',
      duration: details.duration || '1_4_weeks',
      impact: details.impact || 'minimal',
      notes: details.notes || ''
    });
  }, [symptom, details]);

  const handleUpdate = (field, value) => {
    setLocalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.(symptom.id, localDetails);
    onClose?.();
  };

  return (
    <div className="ayur-symptom-detail-backdrop" onClick={onClose}>
      <div
        className="ayur-symptom-detail-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="symptom-detail-title"
      >
        <div className="ayur-symptom-detail__header">
          <div>
            <div className="flex items-center gap-xs">
              <span className="ayur-detail-cat-badge">{symptom.category}</span>
            </div>
            <h3 id="symptom-detail-title" className="ayur-symptom-detail__title">
              {symptom.name}
            </h3>
            {symptom.description && (
              <p className="ayur-symptom-detail__desc">{symptom.description}</p>
            )}
          </div>
          <button
            type="button"
            className="ayur-detail-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ayur-symptom-detail__body">
          {/* 1. Severity Level */}
          {symptom.severityEnabled !== false && (
            <div className="ayur-detail-field-group">
              <label className="ayur-detail-field-label">
                {SYMPTOM_DETAIL_CONFIGS.severity.label}
              </label>
              <div className="ayur-detail-options-row">
                {SYMPTOM_DETAIL_CONFIGS.severity.options.map((opt) => {
                  const isSelected = localDetails.severity === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`ayur-detail-opt-pill ayur-detail-opt-pill--${opt.id} ${isSelected ? 'ayur-detail-opt-pill--active' : ''}`}
                      onClick={() => handleUpdate('severity', opt.id)}
                    >
                      <span className="font-semibold">{opt.label}</span>
                      {opt.description && (
                        <span className="text-2xs opacity-80 block">{opt.description}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Frequency */}
          {symptom.frequencyEnabled !== false && (
            <div className="ayur-detail-field-group">
              <label className="ayur-detail-field-label">
                {SYMPTOM_DETAIL_CONFIGS.frequency.label}
              </label>
              <div className="ayur-detail-options-row">
                {SYMPTOM_DETAIL_CONFIGS.frequency.options.map((opt) => {
                  const isSelected = localDetails.frequency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`ayur-detail-opt-pill ${isSelected ? 'ayur-detail-opt-pill--active' : ''}`}
                      onClick={() => handleUpdate('frequency', opt.id)}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Duration */}
          {symptom.durationEnabled !== false && (
            <div className="ayur-detail-field-group">
              <label className="ayur-detail-field-label">
                {SYMPTOM_DETAIL_CONFIGS.duration.label}
              </label>
              <div className="ayur-detail-options-row">
                {SYMPTOM_DETAIL_CONFIGS.duration.options.map((opt) => {
                  const isSelected = localDetails.duration === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`ayur-detail-opt-pill ${isSelected ? 'ayur-detail-opt-pill--active' : ''}`}
                      onClick={() => handleUpdate('duration', opt.id)}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Impact */}
          {symptom.impactEnabled !== false && (
            <div className="ayur-detail-field-group">
              <label className="ayur-detail-field-label">
                {SYMPTOM_DETAIL_CONFIGS.impact.label}
              </label>
              <div className="ayur-detail-options-row">
                {SYMPTOM_DETAIL_CONFIGS.impact.options.map((opt) => {
                  const isSelected = localDetails.impact === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`ayur-detail-opt-pill ${isSelected ? 'ayur-detail-opt-pill--active' : ''}`}
                      onClick={() => handleUpdate('impact', opt.id)}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Severe symptom clinical notice */}
          {localDetails.severity === 'severe' && (
            <div className="ayur-severe-symptom-notice">
              <ShieldAlert size={16} className="text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-secondary leading-normal">
                You indicated severe intensity for this symptom. If this is sudden, rapidly progressive, or accompanied by dizziness or severe pain, please consult a healthcare professional promptly.
              </p>
            </div>
          )}
        </div>

        <div className="ayur-symptom-detail__footer">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Check size={16} />} onClick={handleSave}>
            Save Details
          </Button>
        </div>
      </div>
    </div>
  );
};
