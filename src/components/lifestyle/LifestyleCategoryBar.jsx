import React from 'react';
import './LifestyleCategoryBar.css';
import { Sun, Activity, Moon, Briefcase, HeartPulse, GlassWater, Check } from 'lucide-react';
import { LIFESTYLE_CATEGORIES } from '../../data/lifestyleQuestions';

const ICON_MAP = {
  Sun,
  Activity,
  Moon,
  Briefcase,
  HeartPulse,
  GlassWater
};

export const LifestyleCategoryBar = ({
  activeCategoryId,
  completedCategoryIds = [],
  onSelectCategory,
  className = ''
}) => {
  return (
    <div className={`ayur-lifestyle-cat-bar ${className}`.trim()} role="navigation" aria-label="Lifestyle Categories">
      <div className="ayur-lifestyle-cat-track">
        {LIFESTYLE_CATEGORIES.map((cat, idx) => {
          const Icon = ICON_MAP[cat.icon] || Sun;
          const isActive = cat.id === activeCategoryId;
          const isCompleted = completedCategoryIds.includes(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              className={`ayur-cat-step ${isActive ? 'ayur-cat-step--active' : ''} ${isCompleted ? 'ayur-cat-step--completed' : ''}`}
              onClick={() => onSelectCategory?.(cat.id)}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="ayur-cat-step__badge">
                {isCompleted && !isActive ? (
                  <Check size={12} strokeWidth={3} className="ayur-cat-step__check" />
                ) : (
                  <span className="ayur-cat-step__num">{cat.number}</span>
                )}
                <Icon size={14} className="ayur-cat-step__icon" />
              </div>
              <div className="ayur-cat-step__text">
                <span className="ayur-cat-step__name">{cat.name}</span>
                <span className="ayur-cat-step__sanskrit">{cat.sanskritName}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
