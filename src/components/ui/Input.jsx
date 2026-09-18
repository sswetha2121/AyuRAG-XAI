import React, { forwardRef } from 'react';
import './Input.css';
import { X, Search } from 'lucide-react';

/**
 * AyuRAG-XAI Accessible Input Component
 * Supports: text, number, email, search, password, etc.
 * Features: label, helperText, errorMessage, leftIcon, rightIcon, clearable, states
 */
export const Input = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onClear,
  placeholder,
  helperText,
  errorMessage,
  error = false,
  disabled = false,
  required = false,
  leftIcon = null,
  rightIcon = null,
  isSearch = false,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const generatedId = id || `ayur-input-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = error || Boolean(errorMessage);

  const finalLeftIcon = isSearch && !leftIcon ? <Search size={18} /> : leftIcon;
  const showClear = (isSearch || onClear) && Boolean(value) && !disabled;

  return (
    <div className={`ayur-form-field ayur-form-field--${size} ${disabled ? 'ayur-form-field--disabled' : ''} ${hasError ? 'ayur-form-field--error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={generatedId} className="ayur-form-label">
          {label}
          {required && <span className="ayur-form-label__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="ayur-input-container">
        {finalLeftIcon && (
          <span className="ayur-input__icon ayur-input__icon--left" aria-hidden="true">
            {finalLeftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={generatedId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
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
          className={`ayur-input ${finalLeftIcon ? 'ayur-input--has-left-icon' : ''} ${rightIcon || showClear ? 'ayur-input--has-right-icon' : ''}`}
          {...props}
        />

        {showClear && (
          <button
            type="button"
            className="ayur-input__clear-btn"
            onClick={onClear}
            aria-label="Clear input"
            tabIndex={-1}
          >
            <X size={14} />
          </button>
        )}

        {rightIcon && !showClear && (
          <span className="ayur-input__icon ayur-input__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
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

Input.displayName = 'Input';
