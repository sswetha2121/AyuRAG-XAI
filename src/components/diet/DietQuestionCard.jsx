import React from 'react';
import './DietQuestionCard.css';
import { Badge } from '../ui';
import { Compass, Lightbulb, Utensils } from 'lucide-react';
import { FrequencySelector } from '../lifestyle/FrequencySelector';
import { MultiSelectChips } from '../lifestyle/MultiSelectChips';
import { VisualChoiceGrid } from '../lifestyle/VisualChoiceGrid';

export const DietQuestionCard = ({
  questionData,
  currentIndex = 0,
  totalQuestions = 10,
  currentValue,
  onAnswerChange,
  disabled = false,
  className = ''
}) => {
  if (!questionData) return null;

  const renderControl = () => {
    switch (questionData.type) {
      case 'frequency':
      case 'segmented-choice':
        return (
          <FrequencySelector
            options={questionData.options}
            value={currentValue}
            onChange={(val) => onAnswerChange?.(val)}
            disabled={disabled}
            ariaLabel={questionData.question}
          />
        );

      case 'multi-select-chips':
        return (
          <MultiSelectChips
            options={questionData.options}
            selectedIds={Array.isArray(currentValue) ? currentValue : []}
            onChange={(val) => onAnswerChange?.(val)}
            disabled={disabled}
            ariaLabel={questionData.question}
          />
        );

      case 'visual-cards':
      default:
        return (
          <VisualChoiceGrid
            options={questionData.options}
            value={currentValue}
            onChange={(val) => onAnswerChange?.(val)}
            disabled={disabled}
            ariaLabel={questionData.question}
            columns={2}
          />
        );
    }
  };

  return (
    <div className={`ayur-diet-q-card ${className}`.trim()}>
      {/* Question Header */}
      <div className="ayur-diet-q-header">
        <div className="flex items-center gap-xs flex-wrap">
          <Badge color="primary" variant="subtle" size="sm">
            Question {String(currentIndex + 1).padStart(2, '0')} of {String(totalQuestions).padStart(2, '0')}
          </Badge>
          <Badge color="accent" variant="subtle" size="sm" icon={<Utensils size={11} />}>
            {questionData.category}
          </Badge>
          {questionData.sanskritTerm && (
            <span className="ayur-sanskrit-tag">{questionData.sanskritTerm}</span>
          )}
        </div>

        <h2 className="ayur-diet-q-title">{questionData.question}</h2>

        {questionData.description && (
          <p className="ayur-diet-q-desc">{questionData.description}</p>
        )}
      </div>

      {/* Dynamic Control Body */}
      <div className="ayur-diet-q-body">
        {renderControl()}
      </div>

      {/* Classical Insight Hint */}
      {questionData.hint && (
        <div className="ayur-diet-q-hint">
          <div className="ayur-diet-hint-icon">
            <Lightbulb size={14} />
          </div>
          <div className="ayur-diet-hint-text">
            <span className="font-semibold text-primary">Ayurvedic Ahara Principle:</span> {questionData.hint}
          </div>
        </div>
      )}
    </div>
  );
};
