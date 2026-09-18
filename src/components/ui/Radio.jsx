import React, { forwardRef, createContext, useContext } from 'react';
import './Radio.css';

const RadioGroupContext = createContext(null);

/**
 * AyuRAG-XAI Accessible Radio Component
 */
export const Radio = forwardRef(({
  label,
  description,
  value,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  error = false,
  className = '',
  ...props
}, ref) => {
  const group = useContext(RadioGroupContext);
  const isChecked = group ? group.value === value : checked;
  const isDisabled = group ? group.disabled || disabled : disabled;
  const isError = group ? group.error || error : error;
  const groupName = group ? group.name : name;

  const generatedId = id || `ayur-radio-${Math.random().toString(36).substring(2, 9)}`;

  const handleChange = (e) => {
    if (group) {
      group.onChange?.(value);
    } else {
      onChange?.(e);
    }
  };

  return (
    <label
      htmlFor={generatedId}
      className={`ayur-radio-wrapper ${isDisabled ? 'ayur-radio--disabled' : ''} ${isError ? 'ayur-radio--error' : ''} ${className}`.trim()}
    >
      <input
        ref={ref}
        type="radio"
        id={generatedId}
        name={groupName}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={handleChange}
        className="sr-only"
        aria-describedby={description ? `${generatedId}-desc` : undefined}
        {...props}
      />

      <span className={`ayur-radio-circle ${isChecked ? 'ayur-radio-circle--checked' : ''}`} aria-hidden="true">
        <span className="ayur-radio-dot" />
      </span>

      {(label || description) && (
        <span className="ayur-radio-content">
          {label && <span className="ayur-radio-label">{label}</span>}
          {description && (
            <span id={`${generatedId}-desc`} className="ayur-radio-description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

Radio.displayName = 'Radio';

/**
 * AyuRAG-XAI RadioGroup Container Component
 */
export const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  helperText,
  orientation = 'vertical',
  children,
  className = '',
  ...props
}) => {
  const hasError = error || Boolean(errorMessage);

  return (
    <div
      role="radiogroup"
      aria-labelledby={label ? `${name}-label` : undefined}
      className={`ayur-radio-group ayur-radio-group--${orientation} ${className}`.trim()}
      {...props}
    >
      {label && (
        <span id={`${name}-label`} className="ayur-form-label">
          {label}
        </span>
      )}

      <RadioGroupContext.Provider value={{ name, value, onChange, disabled, error: hasError }}>
        <div className="ayur-radio-group__options">{children}</div>
      </RadioGroupContext.Provider>

      {hasError && errorMessage && (
        <p className="ayur-form-message ayur-form-message--error" role="alert">
          {errorMessage}
        </p>
      )}

      {!hasError && helperText && (
        <p className="ayur-form-message ayur-form-message--helper">{helperText}</p>
      )}
    </div>
  );
};
