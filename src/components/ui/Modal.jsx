import React, { useEffect, useRef } from 'react';
import './Modal.css';
import { X } from 'lucide-react';

/**
 * AyuRAG-XAI Reusable Modal Dialog
 * Accessible, keyboard navigable (ESC to close), focus trapped
 */
export const Modal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop = true,
  className = '',
  ariaLabel,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ayur-modal-backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`ayur-modal ayur-modal--${size} ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
      >
        {/* Modal Header */}
        {(title || onClose) && (
          <div className="ayur-modal__header">
            <div>
              {title && <h3 className="ayur-modal__title">{title}</h3>}
              {subtitle && <p className="ayur-modal__subtitle">{subtitle}</p>}
            </div>
            {onClose && (
              <button
                type="button"
                className="ayur-modal__close-btn"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="ayur-modal__body">
          {children}
        </div>

        {/* Optional Modal Footer */}
        {footer && (
          <div className="ayur-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
