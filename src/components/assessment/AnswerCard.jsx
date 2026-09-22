import React from 'react';
import './Assessment.css';
import { Check } from 'lucide-react';

/**
 * AyuRAG-XAI AnswerCard Component
 * Interactive selectable option card for single-select, multi-select, and binary questions.
 */
export const AnswerCard = ({
  id,
  label,
  description,
  selected = false,
  onClick,
  disabled = false,
  multiSelect = false,
  badge = null,
  icon = null,
  className = ''
}) => {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role={multiSelect ? 'checkbox' : 'radio'}
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      id={`answer-card-${id}`}
      className={`ayur-answer-card ${selected ? 'ayur-answer-card--selected' : ''} ${disabled ? 'ayur-answer-card--disabled' : ''} ${className}`.trim()}
      onClick={() => !disabled && onClick?.()}
      onKeyDown={handleKeyDown}
    >
      <div className="ayur-answer-card__selector">
        <span className={`ayur-answer-card__indicator ${multiSelect ? 'ayur-answer-card__indicator--square' : ''}`}>
          {selected && <Check size={13} strokeWidth={3} />}
        </span>
      </div>

      <div className="ayur-answer-card__content">
        <div className="ayur-answer-card__header">
          {icon && <span className="ayur-answer-card__icon">{icon}</span>}
          <span className="ayur-answer-card__label">{label}</span>
          {badge && <span className="ayur-answer-card__badge">{badge}</span>}
        </div>
        {description && (
          <p className="ayur-answer-card__desc">{description}</p>
        )}
      </div>
    </div>
  );
};
