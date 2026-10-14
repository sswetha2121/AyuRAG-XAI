import React from 'react';
import './EmptyState.css';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

/**
 * AyuRAG-XAI Reusable EmptyState Component
 */
export const EmptyState = ({
  icon = null,
  title = 'No Data Available',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  const IconComponent = icon || Inbox;

  return (
    <div className={`ayur-empty-state ${className}`.trim()}>
      <div className="ayur-empty-state__icon">
        {typeof IconComponent === 'function' ? <IconComponent size={32} /> : IconComponent}
      </div>
      <h3 className="ayur-empty-state__title">{title}</h3>
      {description && <p className="ayur-empty-state__description">{description}</p>}
      {actionLabel && onAction && (
        <div className="ayur-empty-state__action">
          <Button
            variant="primary"
            size="md"
            onClick={onAction}
            rightIcon={actionIcon}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
