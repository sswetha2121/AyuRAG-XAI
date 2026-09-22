import React from 'react';
import './Assessment.css';
import { Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

/**
 * AyuRAG-XAI TimeSelector Component
 * Circadian time slot selector with visual clock indicators.
 */
export const TimeSelector = ({
  id,
  options = [],
  value,
  onChange,
  disabled = false
}) => {
  const getTimeIcon = (optionId) => {
    if (optionId.includes('before_6') || optionId.includes('morning')) return <Sunrise size={18} />;
    if (optionId.includes('6am') || optionId.includes('7am')) return <Sun size={18} />;
    if (optionId.includes('10pm') || optionId.includes('night') || optionId.includes('bed')) return <Moon size={18} />;
    return <Clock size={18} />;
  };

  return (
    <div className="ayur-time-grid" role="radiogroup" id={`time-group-${id}`}>
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            className={`ayur-time-card ${isSelected ? 'ayur-time-card--selected' : ''}`}
            onClick={() => onChange(option.id)}
          >
            <div className="ayur-time-card__icon-wrap">
              {getTimeIcon(option.id)}
            </div>
            <div className="ayur-time-card__content">
              <span className="ayur-time-card__label">{option.label}</span>
              {option.description && (
                <span className="ayur-time-card__desc">{option.description}</span>
              )}
            </div>
            <span className="ayur-time-card__radio-bullet">
              {isSelected && <span className="ayur-time-card__radio-inner" />}
            </span>
          </button>
        );
      })}
    </div>
  );
};
