import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, Info, HelpCircle } from 'lucide-react';

/**
 * AyuRAG-XAI Reusable Confirmation Dialog
 * For consequential clinical/data actions
 */
export const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // 'primary' | 'danger' | 'warning'
  isLoading = false,
  icon = null,
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'danger':
        return <AlertTriangle size={24} className="text-error" />;
      case 'warning':
        return <AlertCircle size={24} className="text-warning" />;
      default:
        return <Info size={24} className="text-primary" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-md py-xs">
        <div className="shrink-0 mt-xs">{getIcon()}</div>
        <div className="flex-1 text-sm text-secondary leading-relaxed">
          {message}
        </div>
      </div>
    </Modal>
  );
};
