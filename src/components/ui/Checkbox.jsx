import React, { forwardRef } from 'react';
import './Checkbox.css';
import { Check, Minus } from 'lucide-react';

/**
 * AyuRAG-XAI Accessible Checkbox Component
 */
export const Checkbox = forwardRef(({
  label,
  description,
  id,
  name,
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}, ref) => {
  const generatedId = id || `ayur-checkbox-${Math.random().toString(36).substring(2, 9)}`;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.({ target: { checked: !checked, name } });
    }
  };

  return (
    <label
      htmlFor={generatedId}
      className={`ayur-checkbox-wrapper ${disabled ? 'ayur-checkbox--disabled' : ''} ${error ? 'ayur-checkbox--error' : ''} ${className}`.trim()}
    >
      <input
        ref={ref}
        type="checkbox"
        id={generatedId}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
        aria-describedby={description ? `${generatedId}-desc` : undefined}
        {...props}
      />
      
      <span
        className={`ayur-checkbox-box ${checked ? 'ayur-checkbox-box--checked' : ''} ${indeterminate ? 'ayur-checkbox-box--indeterminate' : ''}`}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        aria-hidden="true"
      >
        {checked && !indeterminate && <Check size={14} strokeWidth={3} className="ayur-checkbox-icon" />}
        {indeterminate && <Minus size={14} strokeWidth={3} className="ayur-checkbox-icon" />}
      </span>

      {(label || description) && (
        <span className="ayur-checkbox-content">
          {label && <span className="ayur-checkbox-label">{label}</span>}
          {description && (
            <span id={`${generatedId}-desc`} className="ayur-checkbox-description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
