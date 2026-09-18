import React, { forwardRef } from 'react';
import './Select.css';
import { ChevronDown } from 'lucide-react';

/**
 * AyuRAG-XAI Reusable Select Component
 */
export const Select = forwardRef(({
  label,
  id,
  name,
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  helperText,
  errorMessage,
  error = false,
  disabled = false,
  required = false,
  size = 'md',
  className = '',
  children,
  ...props
}, ref) => {
  const generatedId = id || `ayur-select-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = error || Boolean(errorMessage);

  return (
    <div className={`ayur-select-field ayur-select-field--${size} ${disabled ? 'ayur-select-field--disabled' : ''} ${hasError ? 'ayur-select-field--error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={generatedId} className="ayur-form-label">
          {label}
          {required && <span className="ayur-form-label__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="ayur-select-container">
        <select
          ref={ref}
          id={generatedId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${generatedId}-error`
              : helperText
              ? `${generatedId}-helper`
              : undefined
          }
          className="ayur-select"
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <span className="ayur-select__chevron" aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </div>

      {hasError && errorMessage && (
        <p id={`${generatedId}-error`} className="ayur-form-message ayur-form-message--error" role="alert">
          {errorMessage}
        </p>
      )}

      {!hasError && helperText && (
        <p id={`${generatedId}-helper`} className="ayur-form-message ayur-form-message--helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
