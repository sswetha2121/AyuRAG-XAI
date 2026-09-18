import React, { useState } from 'react';
import './ReviewSectionCard.css';
import { CheckCircle2, AlertCircle, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge, Button } from '../ui';

export const ReviewSectionCard = ({
  stepNumber = '01',
  title = '',
  status = 'complete', // 'complete' | 'needs-attention' | 'incomplete'
  summaryItems = [],
  onEdit,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return (
          <Badge color="success" variant="solid" size="sm" icon={<CheckCircle2 size={12} />}>
            Complete
          </Badge>
        );
      case 'needs-attention':
        return (
          <Badge color="warning" variant="solid" size="sm" icon={<AlertCircle size={12} />}>
            Needs Attention
          </Badge>
        );
      case 'incomplete':
      default:
        return (
          <Badge color="neutral" variant="subtle" size="sm">
            Incomplete
          </Badge>
        );
    }
  };

  return (
    <div className={`ayur-review-section-card ${className}`.trim()}>
      <div className="ayur-review-section-header">
        <div className="flex items-center gap-sm flex-wrap">
          <span className="ayur-review-step-num">{stepNumber}</span>
          <h3 className="ayur-review-sec-title">{title}</h3>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-xs">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit3 size={14} />}
            onClick={onEdit}
            className="ayur-review-edit-btn"
          >
            Edit
          </Button>

          <button
            type="button"
            className="ayur-review-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="ayur-review-section-body">
          <div className="ayur-review-fields-grid">
            {summaryItems.map((item, idx) => (
              <div key={idx} className="ayur-review-field-item">
                <span className="ayur-review-field-label">{item.label}</span>
                <span className={`ayur-review-field-val ${!item.value || item.value === 'Not provided' ? 'ayur-review-field-val--empty' : ''}`}>
                  {item.value || 'Not provided'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
