import React from 'react';
import './Assessment.css';

/**
 * AyuRAG-XAI SegmentedInput Component
 * Horizontal segmented button group for mutually exclusive options.
 */
export const SegmentedInput = ({
  id,
  options = [],
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="ayur-segmented-input" role="radiogroup" id={`segmented-${id}`}>
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            className={`ayur-segmented-opt ${isSelected ? 'ayur-segmented-opt--active' : ''}`}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
