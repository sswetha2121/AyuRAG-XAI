import React from 'react';
import './DietCategoryBar.css';
import { Clock, Flame, Utensils, Salad, Coffee, GlassWater, HeartPulse, Check } from 'lucide-react';
import { DIET_CATEGORIES } from '../../data/dietQuestions';

const ICON_MAP = {
  Clock,
  Flame,
  Utensils,
  Salad,
  Coffee,
  GlassWater,
  HeartPulse
};

export const DietCategoryBar = ({
  activeCategoryId,
  completedCategoryIds = [],
  onSelectCategory,
  className = ''
}) => {
  return (
    <div className={`ayur-diet-cat-bar ${className}`.trim()} role="navigation" aria-label="Dietary Categories">
      <div className="ayur-diet-cat-track">
        {DIET_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Utensils;
          const isActive = cat.id === activeCategoryId;
          const isCompleted = completedCategoryIds.includes(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              className={`ayur-diet-cat-step ${isActive ? 'ayur-diet-cat-step--active' : ''} ${isCompleted ? 'ayur-diet-cat-step--completed' : ''}`}
              onClick={() => onSelectCategory?.(cat.id)}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="ayur-diet-cat-step__badge">
                {isCompleted && !isActive ? (
                  <Check size={12} strokeWidth={3} className="ayur-diet-cat-step__check" />
                ) : (
                  <span className="ayur-diet-cat-step__num">{cat.number}</span>
                )}
                <Icon size={14} className="ayur-diet-cat-step__icon" />
              </div>
              <div className="ayur-diet-cat-step__text">
                <span className="ayur-diet-cat-step__name">{cat.name}</span>
                <span className="ayur-diet-cat-step__sanskrit">{cat.sanskritName}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
