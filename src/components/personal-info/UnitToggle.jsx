import React from 'react';
import './UnitToggle.css';

export const UnitToggle = ({
  options = [],
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`ayur-unit-toggle ${disabled ? 'ayur-unit-toggle--disabled' : ''} ${className}`.trim()}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            className={`ayur-unit-toggle__btn ${isSelected ? 'ayur-unit-toggle__btn--active' : ''}`}
            onClick={() => !disabled && onChange?.(opt.value)}
            disabled={disabled}
            aria-pressed={isSelected}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
