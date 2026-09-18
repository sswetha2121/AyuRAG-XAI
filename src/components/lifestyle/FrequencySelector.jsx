import React from 'react';
import './FrequencySelector.css';
import { Check } from 'lucide-react';

export const FrequencySelector = ({
  options = [],
  value,
  onChange,
  disabled = false,
  ariaLabel = 'Select frequency',
  className = ''
}) => {
  const handleKeyDown = (e, optValue) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(optValue);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`ayur-freq-selector ${disabled ? 'ayur-freq-selector--disabled' : ''} ${className}`.trim()}
    >
      <div className="ayur-freq-selector__grid">
        {options.map((opt, idx) => {
          const isSelected = value === opt.value || value === opt.id;

          return (
            <div
              key={opt.id || opt.value || idx}
              role="radio"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              className={`ayur-freq-card ${isSelected ? 'ayur-freq-card--selected' : ''}`}
              onClick={() => !disabled && onChange?.(opt.value || opt.id)}
              onKeyDown={(e) => handleKeyDown(e, opt.value || opt.id)}
            >
              <div className="ayur-freq-card__indicator">
                {isSelected ? (
                  <div className="ayur-freq-card__check">
                    <Check size={12} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="ayur-freq-card__dot" />
                )}
              </div>

              <div className="ayur-freq-card__content">
                <span className="ayur-freq-card__label">{opt.label}</span>
                {opt.description && (
                  <p className="ayur-freq-card__desc">{opt.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
