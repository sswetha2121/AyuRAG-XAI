import React from 'react';
import './SymptomCategoryFilter.css';
import {
  Sparkles,
  Flame,
  Moon,
  Zap,
  Wind,
  Activity,
  HeartPulse,
  Compass
} from 'lucide-react';
import { SYMPTOM_CATEGORIES } from '../../data/symptomData';

const ICON_MAP = {
  Sparkles,
  Flame,
  Moon,
  Zap,
  Wind,
  Activity,
  HeartPulse,
  Compass
};

export const SymptomCategoryFilter = ({
  activeCategory = 'all',
  onSelectCategory,
  categoryCounts = {},
  className = ''
}) => {
  return (
    <div className={`ayur-symptom-filter ${className}`.trim()} role="tablist" aria-label="Filter symptoms by category">
      <div className="ayur-symptom-filter__track">
        {SYMPTOM_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Sparkles;
          const isActive = cat.id === activeCategory;
          const count = categoryCounts[cat.id];

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`ayur-filter-pill ${isActive ? 'ayur-filter-pill--active' : ''}`}
              onClick={() => onSelectCategory?.(cat.id)}
            >
              <Icon size={14} className="ayur-filter-pill__icon" />
              <span>{cat.label}</span>
              {typeof count === 'number' && count > 0 && (
                <span className="ayur-filter-pill__count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
