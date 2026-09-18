import React from 'react';
import './GenderSelector.css';
import { User, Sparkles, Heart } from 'lucide-react';

const GENDER_OPTIONS = [
  {
    value: 'female',
    label: 'Female',
    description: 'Pitta-Kapha hormonal rhythm baselines'
  },
  {
    value: 'male',
    label: 'Male',
    description: 'Metabolic & tissue (Dhatu) baselines'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Tridoshic individualized constitution'
  },
  {
    value: 'prefer-not-to-say',
    label: 'Prefer not to say',
    description: 'Standardized universal parameters'
  }
];

export const GenderSelector = ({
  value,
  onChange,
  error = false,
  errorMessage,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`ayur-gender-selector ${error ? 'ayur-gender-selector--error' : ''} ${className}`.trim()}>
      <div className="ayur-form-label">
        <span>Gender Identification</span>
        <span className="ayur-form-label__required">*</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Gender Selection"
        className="ayur-gender-grid"
      >
        {GENDER_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <div
              key={option.value}
              role="radio"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              className={`ayur-gender-card ${isSelected ? 'ayur-gender-card--selected' : ''} ${disabled ? 'ayur-gender-card--disabled' : ''}`}
              onClick={() => !disabled && onChange?.(option.value)}
              onKeyDown={(e) => {
                if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
                  e.preventDefault();
                  onChange?.(option.value);
                }
              }}
            >
              <div className="ayur-gender-card__radio-circle" aria-hidden="true">
                <div className="ayur-gender-card__radio-dot" />
              </div>

              <div className="ayur-gender-card__info">
                <span className="ayur-gender-card__label">{option.label}</span>
                <span className="ayur-gender-card__desc">{option.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {error && errorMessage && (
        <p className="ayur-form-message ayur-form-message--error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
