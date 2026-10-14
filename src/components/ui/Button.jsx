import React from 'react';
import './Button.css';
import { Spinner } from './Spinner';

/**
 * AyuRAG-XAI Reusable Button Component
 * Supports: primary, secondary, outline, ghost, danger, accent, icon
 * Sizes: sm, md, lg
 * States: default, hover, active, focus, disabled, loading
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  className = '',
  onClick,
  ariaLabel,
  ...props
}) => {
  const isBusy = loading || isLoading;

  return (
    <button
      type={type}
      className={`ayur-btn ayur-btn--${variant} ayur-btn--${size} ${fullWidth ? 'ayur-btn--full' : ''} ${isBusy ? 'ayur-btn--loading' : ''} ${className}`.trim()}
      disabled={disabled || isBusy}
      onClick={onClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={isBusy}
      {...props}
    >
      {isBusy ? (
        <>
          <Spinner
            size="sm"
            color={variant === 'primary' || variant === 'danger' ? 'white' : 'primary'}
            className="ayur-btn__spinner"
          />
          <span className="ayur-btn__content ayur-btn__content--hidden">{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="ayur-btn__icon ayur-btn__icon--left">{leftIcon}</span>}
          {children && <span className="ayur-btn__content">{children}</span>}
          {rightIcon && <span className="ayur-btn__icon ayur-btn__icon--right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
