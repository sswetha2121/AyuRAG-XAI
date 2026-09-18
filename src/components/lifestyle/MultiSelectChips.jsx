import React from 'react';
import './MultiSelectChips.css';
import { Check, Plus } from 'lucide-react';

export const MultiSelectChips = ({
  options = [],
  selectedIds = [],
  onChange,
  disabled = false,
  ariaLabel = 'Select multiple options',
  className = ''
}) => {
  const handleToggle = (opt) => {
    if (disabled) return;
    const isCurrentlySelected = selectedIds.includes(opt.id);

    if (opt.isExclusive) {
      // If clicking exclusive option (e.g. "None"), toggle it exclusively
      if (isCurrentlySelected) {
        onChange?.([]);
      } else {
        onChange?.([opt.id]);
      }
    } else {
      // If clicking a non-exclusive option, remove any exclusive option
      let updated = isCurrentlySelected
        ? selectedIds.filter((id) => id !== opt.id)
        : [...selectedIds.filter((id) => {
            const matchedOpt = options.find((o) => o.id === id);
            return !matchedOpt?.isExclusive;
          }), opt.id];
      onChange?.(updated);
    }
  };

  const handleKeyDown = (e, opt) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle(opt);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`ayur-multi-chips-container ${disabled ? 'ayur-multi-chips-container--disabled' : ''} ${className}`.trim()}
    >
      <div className="ayur-multi-chips-grid">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              disabled={disabled}
              className={`ayur-chip ${isSelected ? 'ayur-chip--selected' : ''} ${opt.isExclusive ? 'ayur-chip--exclusive' : ''}`}
              onClick={() => handleToggle(opt)}
              onKeyDown={(e) => handleKeyDown(e, opt)}
            >
              <span className="ayur-chip__indicator">
                {isSelected ? (
                  <Check size={13} strokeWidth={2.5} className="ayur-chip__check-icon" />
                ) : (
                  <Plus size={13} strokeWidth={2} className="ayur-chip__plus-icon" />
                )}
              </span>
              <span className="ayur-chip__label">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="ayur-multi-chips__footer">
        <span className="text-micro text-muted">
          {selectedIds.length === 0
            ? 'Select one or more modalities that apply'
            : `${selectedIds.length} ${selectedIds.length === 1 ? 'practice' : 'practices'} selected`}
        </span>
      </div>
    </div>
  );
};
