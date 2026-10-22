import React, { useState } from 'react';
import './PatientDifficultyModal.css';
import { api } from '../../services/api';
import {
  AlertTriangle,
  X,
  Send,
  HeartPulse,
  Info,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/Button';

export const PatientDifficultyModal = ({
  isOpen,
  onClose,
  defaultMealType = 'lunch',
  onSuccess,
  onTriggerToast
}) => {
  const [mealType, setMealType] = useState(defaultMealType);
  const [severity, setSeverity] = useState('MILD');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const symptomOptions = [
    'Bloating / Distention',
    'Acid Reflux / Heartburn',
    'Heavy Feeling in Stomach',
    'Nausea / Discomfort',
    'Loss of Appetite (Aruchi)',
    'Sluggish Digestion (Mandagni)',
    'Cramping / Discomfort',
    'Headache / Drowsiness',
  ];

  const toggleSymptom = (sym) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const symptomsList = [...selectedSymptoms];
    if (customSymptom.trim()) symptomsList.push(customSymptom.trim());

    if (symptomsList.length === 0 && !notes.trim()) {
      onTriggerToast?.({
        type: 'warning',
        title: 'Information Required',
        message: 'Please select or describe at least one symptom or note for your doctor.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        meal_type: mealType,
        symptoms: symptomsList.join(', ') || 'Digestive discomfort reported',
        severity: severity,
        notes: notes.trim(),
      };

      await api.reportPatientDifficulty(payload);

      onTriggerToast?.({
        type: 'success',
        title: 'Report Shared with Doctor',
        message: 'Your symptoms have been logged to your clinical chart and queued for physician review.',
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Submission Failed',
        message: err.message || 'Could not record difficulty report.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ayur-diff-modal-backdrop" onClick={onClose}>
      <div
        className="ayur-diff-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="ayur-diff-modal-header">
          <div className="flex items-center gap-xs">
            <div className="ayur-diff-icon-box">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="ayur-diff-title">Report Diet Difficulty or Symptoms</h3>
              <p className="ayur-diff-sub">
                Notify your attending physician about digestive reactions or difficulty following your diet.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ayur-diff-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ayur-diff-form">
          {/* Meal Selection & Severity */}
          <div className="ayur-diff-row">
            <div className="ayur-diff-field">
              <label>Associated Meal Schedule:</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="ayur-diff-select"
              >
                <option value="breakfast">Breakfast</option>
                <option value="mid_morning">Mid-Morning Snack</option>
                <option value="lunch">Lunch (Main Meal)</option>
                <option value="evening">Evening Snack</option>
                <option value="dinner">Dinner</option>
                <option value="general">General / Between Meals</option>
              </select>
            </div>

            <div className="ayur-diff-field">
              <label>Symptom Severity:</label>
              <div className="flex items-center gap-xs">
                {['MILD', 'MODERATE', 'SEVERE'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`ayur-sev-btn ayur-sev-btn--${s.toLowerCase()} ${severity === s ? 'ayur-sev-btn--active' : ''}`}
                    onClick={() => setSeverity(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Common Symptoms Checklist */}
          <div className="ayur-diff-section">
            <label className="ayur-diff-label">Select Observable Manifestations:</label>
            <div className="ayur-symptoms-chips-grid">
              {symptomOptions.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    className={`ayur-sym-chip ${isSelected ? 'ayur-sym-chip--selected' : ''}`}
                    onClick={() => toggleSymptom(sym)}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{sym}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Symptoms Input */}
          <div className="ayur-diff-field">
            <label>Additional Specific Symptoms (Optional):</label>
            <input
              type="text"
              placeholder="e.g. Mild headache 30 mins after meal, excessive thirst..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              className="ayur-diff-input"
            />
          </div>

          {/* Notes / Dietary Feedback */}
          <div className="ayur-diff-field">
            <label>Notes & Difficulties Following the Plan:</label>
            <textarea
              rows={3}
              placeholder="Explain any food taste preferences, preparation difficulties, or lack of ingredients..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="ayur-diff-textarea"
            />
          </div>

          {/* Non-emergency notice */}
          <div className="ayur-diff-notice">
            <ShieldAlert size={15} className="text-accent flex-shrink-0" />
            <span>
              If you are having severe abdominal pain, chest pain, or breathing difficulty,
              please seek immediate hospital emergency care.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="ayur-diff-footer">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSubmitting}
              leftIcon={<Send size={15} />}
            >
              {isSubmitting ? 'Recording...' : 'Submit Report to Doctor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
