import React from 'react';
import './Badge.css';

/**
 * AyuRAG-XAI Badge / Tag Component
 * Variants: subtle, solid, outline
 * Colors: primary, secondary, accent (gold), success, warning, error, info, neutral
 * Sizes: sm, md
 */
export const Badge = ({
  children,
  variant = 'subtle',
  color = 'primary',
  size = 'md',
  dot = false,
  icon = null,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`ayur-badge ayur-badge--${variant} ayur-badge--${color} ayur-badge--${size} ${className}`.trim()}
      {...props}
    >
      {dot && <span className="ayur-badge__dot" aria-hidden="true" />}
      {icon && <span className="ayur-badge__icon" aria-hidden="true">{icon}</span>}
      <span className="ayur-badge__text">{children}</span>
    </span>
  );
};
