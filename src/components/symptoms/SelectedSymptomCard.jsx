import React from 'react';
import './SelectedSymptomCard.css';
import { X, Activity, Clock, Flame } from 'lucide-react';
import { SEVERITY_OPTIONS, FREQUENCY_OPTIONS, DURATION_OPTIONS } from '../../data/symptomData';

export const SelectedSymptomCard = ({
  symptom,
  onUpdateDetail,
  onRemove,
  className = ''
}) => {
  return (
    <div className={`ayur-selected-sym-card ${className}`.trim()}>
      <div className="ayur-selected-sym-header">
        <div className="flex items-center gap-xs flex-wrap">
          <span className="ayur-selected-sym-cat">{symptom.category}</span>
          <h4 className="ayur-selected-sym-name">{symptom.name}</h4>
          {symptom.sanskritName && (
            <span className="ayur-selected-sym-sanskrit">({symptom.sanskritName})</span>
          )}
        </div>

        <button
          type="button"
          className="ayur-selected-sym-remove"
          onClick={() => onRemove?.(symptom.id)}
          aria-label={`Remove ${symptom.name}`}
        >
          <X size={16} />
        </button>
      </div>

      <div className="ayur-selected-sym-controls-grid">
        {/* Severity Scale */}
        <div className="ayur-sym-control-group">
          <span className="ayur-sym-control-label">Severity Level:</span>
          <div className="ayur-sym-segments">
            {SEVERITY_OPTIONS.map((sev) => {
              const isSelected = symptom.severity === sev.id;

              return (
                <button
                  key={sev.id}
                  type="button"
                  className={`ayur-sym-segment-btn ${isSelected ? 'ayur-sym-segment-btn--active' : ''}`}
                  onClick={() => onUpdateDetail?.(symptom.id, 'severity', sev.id)}
                  title={sev.description}
                >
                  {sev.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency Scale */}
        <div className="ayur-sym-control-group">
          <span className="ayur-sym-control-label">Occurrence Frequency:</span>
          <div className="ayur-sym-segments">
            {FREQUENCY_OPTIONS.map((freq) => {
              const isSelected = symptom.frequency === freq.id;

              return (
                <button
                  key={freq.id}
                  type="button"
                  className={`ayur-sym-segment-btn ${isSelected ? 'ayur-sym-segment-btn--active' : ''}`}
                  onClick={() => onUpdateDetail?.(symptom.id, 'frequency', freq.id)}
                  title={freq.description}
                >
                  {freq.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Scale */}
        <div className="ayur-sym-control-group">
          <span className="ayur-sym-control-label">Chronicity / Duration:</span>
          <div className="ayur-sym-segments">
            {DURATION_OPTIONS.map((dur) => {
              const isSelected = symptom.duration === dur.id;

              return (
                <button
                  key={dur.id}
                  type="button"
                  className={`ayur-sym-segment-btn ${isSelected ? 'ayur-sym-segment-btn--active' : ''}`}
                  onClick={() => onUpdateDetail?.(symptom.id, 'duration', dur.id)}
                >
                  {dur.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
