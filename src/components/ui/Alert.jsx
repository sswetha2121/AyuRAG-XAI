import React, { useState } from 'react';
import './Alert.css';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const alertIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info
};

/**
 * AyuRAG-XAI Reusable Alert Component
 * Variants: success, warning, error, info
 */
export const Alert = ({
  variant = 'info',
  title,
  children,
  icon: CustomIcon,
  dismissible = false,
  onDismiss,
  action,
  className = '',
  ...props
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const IconComponent = CustomIcon || alertIcons[variant] || Info;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={`ayur-alert ayur-alert--${variant} ${className}`.trim()}
      {...props}
    >
      <div className="ayur-alert__icon" aria-hidden="true">
        <IconComponent size={20} />
      </div>

      <div className="ayur-alert__body">
        {title && <h4 className="ayur-alert__title">{title}</h4>}
        {children && <div className="ayur-alert__content">{children}</div>}
        {action && <div className="ayur-alert__action">{action}</div>}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="ayur-alert__dismiss"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
