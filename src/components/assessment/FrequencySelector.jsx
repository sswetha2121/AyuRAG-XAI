import React from 'react';
import './Assessment.css';
import { Calendar, Repeat, CheckCircle2 } from 'lucide-react';

/**
 * AyuRAG-XAI FrequencySelector Component
 * Grid of frequency cadence options with clear descriptions.
 */
export const FrequencySelector = ({
  id,
  options = [],
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="ayur-frequency-grid" role="radiogroup" id={`freq-group-${id}`}>
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            className={`ayur-freq-card ${isSelected ? 'ayur-freq-card--selected' : ''}`}
            onClick={() => onChange(option.id)}
          >
            <div className="ayur-freq-card__header">
              <span className="ayur-freq-card__icon">
                {isSelected ? <CheckCircle2 size={16} /> : <Repeat size={16} />}
              </span>
              <span className="ayur-freq-card__label">{option.label}</span>
            </div>
            {option.description && (
              <span className="ayur-freq-card__desc">{option.description}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
