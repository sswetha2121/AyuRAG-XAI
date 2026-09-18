import React from 'react';
import './Stepper.css';
import { Check } from 'lucide-react';

/**
 * AyuRAG-XAI Reusable Stepper Component
 * Supports Horizontal & Vertical orientations
 * States: completed (✓), current (●), upcoming (○), disabled
 */
export const Stepper = ({
  steps = [],
  currentStep = 0,
  onStepClick,
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  return (
    <nav
      aria-label="Assessment Progress"
      className={`ayur-stepper ayur-stepper--${orientation} ${className}`.trim()}
      {...props}
    >
      <ol className="ayur-stepper__list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep && !step.disabled;
          const isDisabled = step.disabled || (index > currentStep && !onStepClick);
          const isClickable = Boolean(onStepClick) && !isDisabled;

          let statusClass = 'upcoming';
          if (isCompleted) statusClass = 'completed';
          if (isCurrent) statusClass = 'current';
          if (isDisabled) statusClass = 'disabled';

          return (
            <li
              key={step.id || index}
              className={`ayur-step ayur-step--${statusClass} ${isClickable ? 'ayur-step--clickable' : ''}`}
            >
              <div
                className="ayur-step__button"
                onClick={() => isClickable && onStepClick?.(index)}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div className="ayur-step__indicator">
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} className="ayur-step__check" />
                  ) : (
                    <span className="ayur-step__number">{step.number || String(index + 1).padStart(2, '0')}</span>
                  )}
                </div>

                <div className="ayur-step__content">
                  <span className="ayur-step__title">{step.title}</span>
                  {step.subtitle && <span className="ayur-step__subtitle">{step.subtitle}</span>}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`ayur-step__connector ${isCompleted ? 'ayur-step__connector--completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
