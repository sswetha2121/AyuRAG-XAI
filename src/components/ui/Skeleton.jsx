import React from 'react';
import './Skeleton.css';

/**
 * AyuRAG-XAI Skeleton Loading Components
 * Variants: text, paragraph, circle/avatar, rect/card, button
 */
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  lines = 3,
  className = '',
  ...props
}) => {
  if (variant === 'paragraph') {
    return (
      <div className={`ayur-skeleton-paragraph ${className}`.trim()} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="ayur-skeleton ayur-skeleton--text"
            style={{
              width: i === lines - 1 ? '65%' : '100%',
              height: height || '14px'
            }}
          />
        ))}
      </div>
    );
  }

  const style = {
    width: width,
    height: height
  };

  return (
    <div
      className={`ayur-skeleton ayur-skeleton--${variant} ${className}`.trim()}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};
