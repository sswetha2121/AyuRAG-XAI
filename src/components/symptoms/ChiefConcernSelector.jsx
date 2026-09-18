import React, { useState } from 'react';
import './ChiefConcernSelector.css';
import { Target, Sparkles, Edit3 } from 'lucide-react';
import { CHIEF_CONCERN_PRESETS } from '../../data/symptomData';

export const ChiefConcernSelector = ({
  primaryConcern = '',
  onSelectConcern,
  additionalNotes = '',
  onNotesChange,
  className = ''
}) => {
  const [isCustom, setIsCustom] = useState(
    Boolean(primaryConcern && !CHIEF_CONCERN_PRESETS.includes(primaryConcern))
  );

  return (
    <div className={`ayur-chief-concern-box ${className}`.trim()}>
      <div className="ayur-chief-concern-header">
        <div className="flex items-center gap-xs">
          <Target size={18} className="text-accent" />
          <h3 className="ayur-chief-concern-title">Primary Clinical Focus / Chief Concern</h3>
        </div>
        <span className="text-micro text-muted">Directs recommendation weighting</span>
      </div>

      <p className="ayur-chief-concern-desc">
        What is the main physiological or lifestyle concern you would like the AI explainability assessment to prioritize?
      </p>

      {/* Preset Chips */}
      <div className="ayur-concern-presets-grid">
        {CHIEF_CONCERN_PRESETS.map((preset, idx) => {
          const isSelected = primaryConcern === preset && !isCustom;

          return (
            <button
              key={idx}
              type="button"
              className={`ayur-concern-preset-btn ${isSelected ? 'ayur-concern-preset-btn--selected' : ''}`}
              onClick={() => {
                setIsCustom(false);
                onSelectConcern?.(preset);
              }}
            >
              <span>{preset}</span>
            </button>
          );
        })}

        <button
          type="button"
          className={`ayur-concern-preset-btn ayur-concern-preset-btn--custom ${isCustom ? 'ayur-concern-preset-btn--selected' : ''}`}
          onClick={() => setIsCustom(true)}
        >
          <Edit3 size={13} />
          <span>Write custom primary concern...</span>
        </button>
      </div>

      {/* Custom Textarea if selected */}
      {isCustom && (
        <div className="ayur-concern-custom-wrap">
          <input
            type="text"
            value={primaryConcern}
            onChange={(e) => onSelectConcern?.(e.target.value)}
            placeholder="Type your primary concern (e.g., Post-meal acid reflux and morning fatigue)..."
            className="ayur-concern-custom-input"
          />
        </div>
      )}

      {/* Additional Optional Clinical Notes */}
      <div className="ayur-concern-notes-wrap">
        <label htmlFor="additional-symptom-notes" className="ayur-concern-notes-label">
          Additional Context / Health Notes (Optional):
        </label>
        <textarea
          id="additional-symptom-notes"
          value={additionalNotes}
          onChange={(e) => onNotesChange?.(e.target.value)}
          placeholder="Add any specific circumstances, seasonal triggers, or physician instructions..."
          rows={2}
          className="ayur-concern-notes-input"
        />
      </div>
    </div>
  );
};
