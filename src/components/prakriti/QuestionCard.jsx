import React from 'react';
import './QuestionCard.css';
import { AnswerCard } from './AnswerCard';
import { Badge } from '../ui';
import { Compass } from 'lucide-react';

export const QuestionCard = ({
  questionData,
  currentIndex = 0,
  totalQuestions = 10,
  selectedOptionId,
  onSelectOption,
  disabled = false,
  className = ''
}) => {
  if (!questionData) return null;

  return (
    <div className={`ayur-question-container ${className}`.trim()}>
      {/* Category & Step Header */}
      <div className="ayur-question-header">
        <div className="flex items-center gap-xs flex-wrap">
          <Badge color="primary" variant="subtle" size="sm">
            Question {String(currentIndex + 1).padStart(2, '0')} of {String(totalQuestions).padStart(2, '0')}
          </Badge>
          <Badge color="accent" variant="subtle" size="sm" icon={<Compass size={11} />}>
            {questionData.category}
          </Badge>
          {questionData.sanskritTerm && (
            <span className="ayur-sanskrit-tag">{questionData.sanskritTerm}</span>
          )}
        </div>

        <h2 className="ayur-question-title">{questionData.question}</h2>

        {questionData.description && (
          <p className="ayur-question-desc">{questionData.description}</p>
        )}
      </div>

      {/* Answer Cards List */}
      <div
        role="radiogroup"
        aria-label={questionData.question}
        className="ayur-answers-list"
      >
        {questionData.options.map((option) => (
          <AnswerCard
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            onSelect={onSelectOption}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
