import React from 'react';
import './Toast.css';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const toastIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info
};

/**
 * AyuRAG-XAI Toast Notification Item
 */
export const Toast = ({
  id,
  type = 'info',
  title,
  message,
  onClose,
  className = ''
}) => {
  const IconComponent = toastIcons[type] || Info;

  return (
    <div
      role="status"
      className={`ayur-toast ayur-toast--${type} ${className}`.trim()}
    >
      <div className="ayur-toast__icon" aria-hidden="true">
        <IconComponent size={18} />
      </div>

      <div className="ayur-toast__body">
        {title && <h5 className="ayur-toast__title">{title}</h5>}
        {message && <p className="ayur-toast__message">{message}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={() => onClose(id)}
          className="ayur-toast__close"
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

/**
 * AyuRAG-XAI Toast Container
 */
export const ToastContainer = ({ toasts = [], onClose, position = 'bottom-right' }) => {
  if (toasts.length === 0) return null;

  return (
    <div className={`ayur-toast-container ayur-toast-container--${position}`} aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
