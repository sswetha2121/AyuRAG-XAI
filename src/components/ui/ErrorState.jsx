import React from 'react';
import './ErrorState.css';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

/**
 * AyuRAG-XAI Standardized Error State Component
 */
export const ErrorState = ({
  title = 'Something Went Wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
  retryText = 'Retry Request',
  className = '',
}) => {
  return (
    <div className={`ayur-error-state ${className}`.trim()} role="alert">
      <div className="ayur-error-state__icon">
        <AlertCircle size={32} />
      </div>
      <h3 className="ayur-error-state__title">{title}</h3>
      {message && <p className="ayur-error-state__message">{message}</p>}
      {onRetry && (
        <div className="ayur-error-state__action">
          <Button
            variant="outline"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw size={15} />}
          >
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
};
