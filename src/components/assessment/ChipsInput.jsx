import React from 'react';
import './Assessment.css';
import { Check, Plus } from 'lucide-react';

/**
 * AyuRAG-XAI ChipsInput Component
 * Tag/chip pill selector supporting multiple tags.
 */
export const ChipsInput = ({
  id,
  options = [],
  value = [],
  onChange,
  disabled = false
}) => {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleToggle = (optId) => {
    if (disabled) return;
    if (selectedValues.includes(optId)) {
      onChange(selectedValues.filter((v) => v !== optId));
    } else {
      onChange([...selectedValues, optId]);
    }
  };

  return (
    <div className="ayur-chips-group" id={`chips-${id}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            disabled={disabled}
            className={`ayur-chip ${isSelected ? 'ayur-chip--active' : ''}`}
            onClick={() => handleToggle(option.id)}
          >
            <span className="ayur-chip__icon">
              {isSelected ? <Check size={12} strokeWidth={3} /> : <Plus size={12} />}
            </span>
            <span className="ayur-chip__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
