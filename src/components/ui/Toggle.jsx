import React from 'react';
import './Toggle.css';

/**
 * AyuRAG-XAI Reusable Accessible Toggle Switch
 * States: OFF, ON, HOVER, FOCUS, DISABLED
 * Accessibility: role="switch", aria-checked, keyboard navigable (Space / Enter)
 */
export const Toggle = ({
  checked = false,
  onChange,
  label = '',
  description = '',
  disabled = false,
  size = 'md',
  id,
  name,
  className = '',
  ...props
}) => {
  const generatedId = id || `ayur-toggle-${Math.random().toString(36).substring(2, 9)}`;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <label
      htmlFor={generatedId}
      className={`ayur-toggle-wrapper ayur-toggle--${size} ${disabled ? 'ayur-toggle--disabled' : ''} ${className}`.trim()}
    >
      <input
        type="checkbox"
        id={generatedId}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${generatedId}-desc` : undefined}
        {...props}
      />
      <span
        className={`ayur-toggle-switch ${checked ? 'ayur-toggle-switch--checked' : ''}`}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        aria-hidden="true"
      >
        <span className="ayur-toggle-thumb">
          {checked && (
            <svg className="ayur-toggle-thumb__icon" viewBox="0 0 12 12" fill="none">
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>

      {(label || description) && (
        <span className="ayur-toggle-text">
          {label && <span className="ayur-toggle-label">{label}</span>}
          {description && (
            <span id={`${generatedId}-desc`} className="ayur-toggle-description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};
