import React from 'react';
import './ProgressBar.css';

/**
 * AyuRAG-XAI Progress Bar Component
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  label = '',
  showValue = false,
  size = 'md',
  color = 'primary',
  indeterminate = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`ayur-progress-container ayur-progress--${size} ${className}`.trim()} {...props}>
      {(label || showValue) && (
        <div className="ayur-progress__header">
          {label && <span className="ayur-progress__label">{label}</span>}
          {showValue && !indeterminate && (
            <span className="ayur-progress__value">{percentage}%</span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
        className={`ayur-progress-track ${indeterminate ? 'ayur-progress-track--indeterminate' : ''}`}
      >
        <div
          className={`ayur-progress-fill ayur-progress-fill--${color}`}
          style={{ width: indeterminate ? undefined : `${percentage}%` }}
        />
      </div>
    </div>
  );
};
