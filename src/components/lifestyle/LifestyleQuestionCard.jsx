import React from 'react';
import './LifestyleQuestionCard.css';
import { Badge } from '../ui';
import { Compass, Lightbulb, Sparkles } from 'lucide-react';
import { FrequencySelector } from './FrequencySelector';
import { MultiSelectChips } from './MultiSelectChips';
import { TimeRoutineSelector } from './TimeRoutineSelector';
import { SleepQualitySelector } from './SleepQualitySelector';
import { VisualChoiceGrid } from './VisualChoiceGrid';

export const LifestyleQuestionCard = ({
  questionData,
  currentIndex = 0,
  totalQuestions = 10,
  currentValue,
  onAnswerChange,
  disabled = false,
  className = ''
}) => {
  if (!questionData) return null;

  const renderInputControl = () => {
    switch (questionData.type) {
      case 'frequency':
        return (
          <FrequencySelector
            options={questionData.options}
            value={currentValue}
            onChange={(val) => onAnswerChange?.(val)}
            disabled={disabled}
            ariaLabel={questionData.question}
          />
        );

      case 'time-routine':
        return (
          <TimeRoutineSelector
            wakePresets={questionData.wakePresets}
            bedPresets={questionData.bedPresets}
            value={currentValue || {}}
            onChange={(val) => onAnswerChange?.(val)}
            disabled={disabled}
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

      case 'sleep-duration-quality':
        return (
          <SleepQualitySelector
            durationOptions={questionData.durationOptions}
            qualityOptions={questionData.qualityOptions}
            value={currentValue || {}}
            onChange={(val) => onAnswerChange?.(val)}
            disabled={disabled}
          />
        );

      case 'visual-cards':
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

      default:
        return null;
    }
  };

  return (
    <div className={`ayur-lifestyle-q-card ${className}`.trim()}>
      {/* Header Info */}
      <div className="ayur-lifestyle-q-header">
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

        <h2 className="ayur-lifestyle-q-title">{questionData.question}</h2>

        {questionData.description && (
          <p className="ayur-lifestyle-q-desc">{questionData.description}</p>
        )}
      </div>

      {/* Dynamic Interaction Control */}
      <div className="ayur-lifestyle-q-body">
        {renderInputControl()}
      </div>

      {/* Classical Ayurvedic Clinical Grounding Hint */}
      {questionData.hint && (
        <div className="ayur-lifestyle-q-hint">
          <div className="ayur-hint-icon-wrap">
            <Lightbulb size={14} />
          </div>
          <div className="ayur-hint-text">
            <span className="ayur-hint-title">Classical Ayurvedic Insight:</span> {questionData.hint}
          </div>
        </div>
      )}
    </div>
  );
};
