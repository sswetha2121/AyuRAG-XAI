import React from 'react';
import './Card.css';

/**
 * AyuRAG-XAI Card Component
 * Variants: standard, interactive, selectable, highlighted, progress, info
 */
export const Card = ({
  children,
  variant = 'standard',
  selected = false,
  onClick,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const isClickable = Boolean(onClick) || variant === 'interactive' || variant === 'selectable';

  return (
    <Component
      className={`ayur-card ayur-card--${variant} ${selected ? 'ayur-card--selected' : ''} ${isClickable ? 'ayur-card--clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      tabIndex={isClickable ? 0 : undefined}
      role={variant === 'selectable' ? 'checkbox' : undefined}
      aria-checked={variant === 'selectable' ? selected : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`ayur-card__header ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, as: Component = 'h3', className = '', ...props }) => (
  <Component className={`ayur-card__title ${className}`.trim()} {...props}>
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`ayur-card__description ${className}`.trim()} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`ayur-card__content ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`ayur-card__footer ${className}`.trim()} {...props}>
    {children}
  </div>
);
