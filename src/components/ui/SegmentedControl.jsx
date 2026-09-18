import React from 'react';
import './SegmentedControl.css';

/**
 * AyuRAG-XAI Reusable Segmented Control
 */
export const SegmentedControl = ({
  options = [],
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  disabled = false,
  label = '',
  name = 'segmented-control',
  className = '',
  ...props
}) => {
  return (
    <div className={`ayur-segmented-wrapper ${fullWidth ? 'ayur-segmented-wrapper--full' : ''} ${className}`.trim()}>
      {label && <span className="ayur-form-label">{label}</span>}
      <div
        role="radiogroup"
        aria-label={label || 'Selection'}
        className={`ayur-segmented ayur-segmented--${size} ${disabled ? 'ayur-segmented--disabled' : ''}`}
        {...props}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const isOptionDisabled = disabled || option.disabled;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isOptionDisabled}
              className={`ayur-segmented__item ${isSelected ? 'ayur-segmented__item--selected' : ''}`}
              onClick={() => !isOptionDisabled && onChange?.(option.value)}
            >
              {option.icon && <span className="ayur-segmented__icon">{option.icon}</span>}
              <span className="ayur-segmented__label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
