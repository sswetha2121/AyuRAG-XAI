import React from 'react';
import './QuestionNavigator.css';
import { Check } from 'lucide-react';

export const QuestionNavigator = ({
  totalQuestions = 10,
  currentIndex = 0,
  answers = {},
  questions = [],
  onSelectIndex,
  className = ''
}) => {
  return (
    <nav
      aria-label="Question Navigation"
      className={`ayur-question-navigator ${className}`.trim()}
    >
      <div className="ayur-navigator-track">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const qId = questions[idx]?.id;
          const isAnswered = Boolean(qId && answers[qId]);
          const isCurrent = idx === currentIndex;

          let statusClass = 'upcoming';
          if (isAnswered) statusClass = 'answered';
          if (isCurrent) statusClass = 'current';

          return (
            <button
              key={idx}
              type="button"
              className={`ayur-nav-dot ayur-nav-dot--${statusClass}`}
              onClick={() => onSelectIndex?.(idx)}
              aria-label={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}${isCurrent ? ' (Current)' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isAnswered && !isCurrent ? (
                <Check size={11} strokeWidth={3} className="ayur-nav-dot__check" />
              ) : (
                <span>{String(idx + 1).padStart(2, '0')}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
