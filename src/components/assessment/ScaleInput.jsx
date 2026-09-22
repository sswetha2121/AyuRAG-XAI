import React from 'react';
import './Assessment.css';

/**
 * AyuRAG-XAI ScaleInput Component
 * Accessible numerical rating scale (e.g., 1-10 perceived stress, routine score).
 */
export const ScaleInput = ({
  id,
  value,
  onChange,
  min = 1,
  max = 10,
  minLabel = '',
  maxLabel = '',
  disabled = false
}) => {
  const steps = [];
  for (let i = min; i <= max; i++) {
    steps.push(i);
  }

  const handleKeyDown = (e, step) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(max, (value || min) + 1);
      onChange(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(min, (value || min) - 1);
      onChange(prev);
    }
  };

  return (
    <div className="ayur-scale-input" id={`scale-${id}`}>
      <div className="ayur-scale-input__track" role="radiogroup" aria-label="Scale input">
        {steps.map((step) => {
          const isSelected = value === step;
          return (
            <button
              key={step}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Rating ${step} of ${max}`}
              disabled={disabled}
              className={`ayur-scale-step ${isSelected ? 'ayur-scale-step--active' : ''}`}
              onClick={() => onChange(step)}
              onKeyDown={(e) => handleKeyDown(e, step)}
            >
              {step}
            </button>
          );
        })}
      </div>

      {(minLabel || maxLabel) && (
        <div className="ayur-scale-input__labels">
          <span className="ayur-scale-label ayur-scale-label--min">{minLabel}</span>
          <span className="ayur-scale-label ayur-scale-label--max">{maxLabel}</span>
        </div>
      )}
    </div>
  );
};
