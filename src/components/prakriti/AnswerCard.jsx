import React from 'react';
import './AnswerCard.css';
import { DoshaBadge } from './DoshaBadge';
import { Check } from 'lucide-react';

export const AnswerCard = ({
  option,
  isSelected = false,
  onSelect,
  disabled = false,
  className = ''
}) => {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect?.(option.id);
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={disabled ? -1 : 0}
      className={`ayur-answer-card ${isSelected ? 'ayur-answer-card--selected' : ''} ${disabled ? 'ayur-answer-card--disabled' : ''} ${className}`.trim()}
      onClick={() => !disabled && onSelect?.(option.id)}
      onKeyDown={handleKeyDown}
    >
      {/* Radio Circle */}
      <div className="ayur-answer-card__radio-indicator" aria-hidden="true">
        {isSelected ? (
          <div className="ayur-answer-card__check-circle">
            <Check size={12} strokeWidth={3} />
          </div>
        ) : (
          <div className="ayur-answer-card__empty-circle" />
        )}
      </div>

      {/* Answer Content */}
      <div className="ayur-answer-card__body">
        <div className="ayur-answer-card__header">
          <h4 className="ayur-answer-card__label">{option.label}</h4>
          {option.dosha && (
            <DoshaBadge dosha={option.dosha} size="sm" />
          )}
        </div>
        <p className="ayur-answer-card__desc">{option.description}</p>
      </div>
    </div>
  );
};
