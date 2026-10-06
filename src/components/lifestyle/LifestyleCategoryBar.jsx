import React, { useRef, useEffect } from 'react';
import './LifestyleCategoryBar.css';
import { Sun, Activity, Moon, Briefcase, HeartPulse, GlassWater, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className={`ayur-lifestyle-cat-bar-wrapper ${className}`.trim()} role="navigation" aria-label="Lifestyle Categories">
      <button
        type="button"
        className="ayur-cat-scroll-btn ayur-cat-scroll-btn--left"
        onClick={() => handleScroll('left')}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="ayur-lifestyle-cat-bar" ref={scrollContainerRef}>
        <div className="ayur-lifestyle-cat-track">
          {LIFESTYLE_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Sun;
            const isActive = cat.id === activeCategoryId;
            const isCompleted = completedCategoryIds.includes(cat.id);

            return (
              <button
                key={cat.id}
                ref={isActive ? activeBtnRef : null}
                type="button"
                className={`ayur-cat-step ${isActive ? 'ayur-cat-step--active' : ''} ${isCompleted ? 'ayur-cat-step--completed' : ''}`}
                onClick={() => onSelectCategory?.(cat.id)}
                aria-current={isActive ? 'step' : undefined}
                title={cat.name}
              >
                <div className="ayur-cat-step__badge">
                  {isCompleted && !isActive ? (
                    <Check size={11} strokeWidth={3} className="ayur-cat-step__check" />
                  ) : (
                    <span className="ayur-cat-step__num">{cat.number}</span>
                  )}
                  <Icon size={13} className="ayur-cat-step__icon" />
                </div>
                <div className="ayur-cat-step__text">
                  <span className="ayur-cat-step__name">{cat.name}</span>
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
