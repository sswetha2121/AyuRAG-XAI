import React, { forwardRef } from 'react';
import './Textarea.css';

/**
 * AyuRAG-XAI Reusable Textarea Component
 */
export const Textarea = forwardRef(({
  label,
  id,
  name,
  value,
  defaultValue,
  onChange,
  placeholder,
  helperText,
  errorMessage,
  error = false,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  className = '',
  ...props
}, ref) => {
  const generatedId = id || `ayur-textarea-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = error || Boolean(errorMessage);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`ayur-textarea-field ${disabled ? 'ayur-textarea-field--disabled' : ''} ${hasError ? 'ayur-textarea-field--error' : ''} ${className}`.trim()}>
      <div className="ayur-textarea-header">
        {label && (
          <label htmlFor={generatedId} className="ayur-form-label">
            {label}
            {required && <span className="ayur-form-label__required" aria-hidden="true">*</span>}
          </label>
        )}
        {showCount && maxLength && (
          <span className="ayur-textarea-count" aria-live="polite">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={generatedId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${generatedId}-error`
            : helperText
            ? `${generatedId}-helper`
            : undefined
        }
        className="ayur-textarea"
        {...props}
      />

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

Textarea.displayName = 'Textarea';
