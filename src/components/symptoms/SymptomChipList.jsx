import React from 'react';
import './Symptoms.css';
import { SYMPTOM_TAXONOMY } from '../../data/symptomQuestions';
import { X, Edit2, Sliders } from 'lucide-react';

/**
 * AyuRAG-XAI SymptomChipList Component
 * Displays currently selected symptom items with severity/frequency badges and remove button.
 */
export const SymptomChipList = ({
  symptomAnswers = {},
  onRemoveSymptom,
  onSelectForEdit,
  activeEditId = null,
  className = ''
}) => {
  const entries = Object.entries(symptomAnswers);

  if (entries.length === 0) {
    return (
      <div className={`ayur-symptom-chip-list-empty ${className}`.trim()}>
        <Sliders size={20} className="text-muted opacity-50 mb-xs" />
        <span className="text-sm text-muted">No symptoms currently selected.</span>
        <span className="text-xs text-muted">Search or choose from the categories below to record health context.</span>
      </div>
    );
  }

  return (
    <div className={`ayur-symptom-chip-list ${className}`.trim()}>
      <div className="flex items-center justify-between mb-xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Selected Health Context ({entries.length})
        </span>
        <span className="text-xs text-muted">Click any symptom to edit details</span>
      </div>

      <div className="ayur-chip-items-wrap">
        {entries.map(([id, details]) => {
          const symptomDef = SYMPTOM_TAXONOMY.find((s) => s.id === id);
          const name = symptomDef ? symptomDef.name : id;
          const isBeingEdited = activeEditId === id;

          return (
            <div
              key={id}
              className={`ayur-symptom-active-chip ${isBeingEdited ? 'ayur-symptom-active-chip--editing' : ''}`}
            >
              <button
                type="button"
                className="ayur-symptom-chip-main"
                onClick={() => onSelectForEdit?.(id)}
                title="Edit symptom details"
              >
                <span className="ayur-symptom-chip-name">{name}</span>
                {details?.severity && (
                  <span className={`ayur-severity-badge ayur-severity-badge--${details.severity}`}>
                    {details.severity}
                  </span>
                )}
                {details?.frequency && (
                  <span className="ayur-freq-micro-badge">{details.frequency}</span>
                )}
                <Edit2 size={12} className="ayur-chip-edit-icon" />
              </button>

              <button
                type="button"
                className="ayur-symptom-chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSymptom?.(id);
                }}
                aria-label={`Remove ${name}`}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
