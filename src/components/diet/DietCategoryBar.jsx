import React, { useRef, useEffect } from 'react';
import './DietCategoryBar.css';
import { Clock, Flame, Utensils, Salad, Coffee, GlassWater, HeartPulse, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollContainerRef = useRef(null);
  const activeBtnRef = useRef(null);

  // Auto-scroll active item into view
  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeCategoryId]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`ayur-diet-cat-bar-wrapper ${className}`.trim()} role="navigation" aria-label="Dietary Categories">
      <button
        type="button"
        className="ayur-cat-scroll-btn ayur-cat-scroll-btn--left"
        onClick={() => handleScroll('left')}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="ayur-diet-cat-bar" ref={scrollContainerRef}>
        <div className="ayur-diet-cat-track">
          {DIET_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Utensils;
            const isActive = cat.id === activeCategoryId;
            const isCompleted = completedCategoryIds.includes(cat.id);

            return (
              <button
                key={cat.id}
                ref={isActive ? activeBtnRef : null}
                type="button"
                className={`ayur-diet-cat-step ${isActive ? 'ayur-diet-cat-step--active' : ''} ${isCompleted ? 'ayur-diet-cat-step--completed' : ''}`}
                onClick={() => onSelectCategory?.(cat.id)}
                aria-current={isActive ? 'step' : undefined}
                title={`${cat.name} (${cat.sanskritName})`}
              >
                <div className="ayur-diet-cat-step__badge">
                  {isCompleted && !isActive ? (
                    <Check size={11} strokeWidth={3} className="ayur-diet-cat-step__check" />
                  ) : (
                    <span className="ayur-diet-cat-step__num">{cat.number}</span>
                  )}
                  <Icon size={13} className="ayur-diet-cat-step__icon" />
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

      <button
        type="button"
        className="ayur-cat-scroll-btn ayur-cat-scroll-btn--right"
        onClick={() => handleScroll('right')}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
