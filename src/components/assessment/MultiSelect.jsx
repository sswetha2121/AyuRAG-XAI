import React from 'react';
import './Assessment.css';
import { AnswerCard } from './AnswerCard';

/**
 * AyuRAG-XAI MultiSelect Component
 * Multi-option question input with optional maxSelections limit.
 */
export const MultiSelect = ({
  id,
  options = [],
  value = [],
  onChange,
  maxSelections = null,
  disabled = false
}) => {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleToggle = (optionId) => {
    if (selectedValues.includes(optionId)) {
      onChange(selectedValues.filter((v) => v !== optionId));
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        // If at limit, replace oldest or block
        return;
      }
      onChange([...selectedValues, optionId]);
    }
  };

  return (
    <div className="ayur-multiselect-group" id={`multiselect-${id}`}>
      {maxSelections && (
        <div className="ayur-multiselect__hint">
          <span>Select up to {maxSelections} options ({selectedValues.length}/{maxSelections} selected)</span>
        </div>
      )}

      <div className="ayur-options-stack">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.id);
          const isAtLimit = maxSelections && selectedValues.length >= maxSelections && !isSelected;

          return (
            <AnswerCard
              key={option.id}
              id={`${id}-${option.id}`}
              label={option.label}
              description={option.description}
              selected={isSelected}
              disabled={disabled || isAtLimit}
              multiSelect={true}
              onClick={() => handleToggle(option.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
