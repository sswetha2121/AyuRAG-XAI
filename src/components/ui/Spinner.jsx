
import React from 'react';
import './Spinner.css';

/**
 * AyuRAG-XAI Spinner Component
 * Sizes: sm (16px), md (24px), lg (36px), xl (48px)
 * Colors: primary (forest), gold, sage, white, current
 */
export const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  label = 'Loading...',
  ...props
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={`ayur-spinner ayur-spinner--${size} ayur-spinner--${color} ${className}`.trim()}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="ayur-spinner__track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="ayur-spinner__head"
          d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5911 2.37039 15.096 3.03197 16.428"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};
