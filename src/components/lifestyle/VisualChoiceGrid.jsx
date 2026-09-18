import React from 'react';
import './VisualChoiceGrid.css';
import {
  Armchair,
  Footprints,
  Flame,
  Zap,
  Laptop,
  Shuffle,
  MapPin,
  Activity,
  Clock,
  IceCream,
  GlassWater,
  Coffee,
  AlertCircle,
  Check,
  Sparkles
} from 'lucide-react';
import { Badge } from '../ui';

const ICON_MAP = {
  Armchair,
  Footprints,
  Flame,
  Zap,
  Laptop,
  Shuffle,
  MapPin,
  Activity,
  Clock,
  IceCream,
  GlassWater,
  Coffee,
  AlertCircle
};

export const VisualChoiceGrid = ({
  options = [],
  value,
  onChange,
  disabled = false,
  ariaLabel = 'Select option',
  columns = 2,
  className = ''
}) => {
  const handleKeyDown = (e, optVal) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(optVal);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`ayur-visual-grid ayur-visual-grid--cols-${columns} ${disabled ? 'ayur-visual-grid--disabled' : ''} ${className}`.trim()}
    >
      {options.map((opt) => {
        const IconComponent = opt.icon ? ICON_MAP[opt.icon] || Activity : null;
        const isSelected = value === opt.value || value === opt.id;

        return (
          <div
            key={opt.id || opt.value}
            role="radio"
            aria-checked={isSelected}
            tabIndex={disabled ? -1 : 0}
            className={`ayur-visual-card ${isSelected ? 'ayur-visual-card--selected' : ''}`}
            onClick={() => !disabled && onChange?.(opt.value || opt.id)}
            onKeyDown={(e) => handleKeyDown(e, opt.value || opt.id)}
          >
            <div className="ayur-visual-card__top">
              <div className="flex items-center gap-xs">
                {IconComponent && (
                  <div className="ayur-visual-card__icon-box">
                    <IconComponent size={18} />
                  </div>
                )}
                {opt.badge && (
                  <span className="ayur-visual-card__badge">{opt.badge}</span>
                )}
              </div>

              <div className="ayur-visual-card__radio-indicator">
                {isSelected ? (
                  <div className="ayur-visual-card__check">
                    <Check size={12} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="ayur-visual-card__empty-circle" />
                )}
              </div>
            </div>

            <div className="ayur-visual-card__body">
              <h3 className="ayur-visual-card__title">{opt.label}</h3>
              {opt.description && (
                <p className="ayur-visual-card__desc">{opt.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
