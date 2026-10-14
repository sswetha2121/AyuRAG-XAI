import React from 'react';
import './FormField.css';

/**
 * AyuRAG-XAI Reusable FormField Wrapper
 */
export const FormField = ({
  label,
  htmlFor,
  required = false,
  helperText,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`ayur-form-field ${error ? 'ayur-form-field--error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={htmlFor} className="ayur-form-label">
          <span>{label}</span>
          {required && <span className="ayur-form-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="ayur-form-control-wrap">
        {children}
      </div>
      {error ? (
        <span className="ayur-form-error" role="alert">{error}</span>
      ) : helperText ? (
        <span className="ayur-form-helper">{helperText}</span>
      ) : null}
    </div>
  );
};
