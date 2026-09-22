import React from 'react';
import { AnswerCard } from './AnswerCard';
import { ScaleInput } from './ScaleInput';
import { FrequencySelector } from './FrequencySelector';
import { TimeSelector } from './TimeSelector';
import { SliderInput } from './SliderInput';
import { MultiSelect } from './MultiSelect';
import { SearchSelect } from './SearchSelect';
import { SegmentedInput } from './SegmentedInput';
import { ChipsInput } from './ChipsInput';
import { Check, X } from 'lucide-react';

/**
 * AyuRAG-XAI QuestionRenderer
 * Dynamically selects and renders the correct interactive input based on question.type.
 */
export const QuestionRenderer = ({
  question,
  value,
  onChange,
  disabled = false
}) => {
  if (!question) return null;

  switch (question.type) {
    case 'single-select':
      return (
        <div className="ayur-options-stack" role="radiogroup" aria-label={question.question}>
          {question.options?.map((option) => (
            <AnswerCard
              key={option.id}
              id={`${question.id}-${option.id}`}
              label={option.label}
              description={option.description}
              selected={value === option.id}
              disabled={disabled}
              multiSelect={false}
              onClick={() => onChange(option.id)}
            />
          ))}
        </div>
      );

    case 'multi-select':
      return (
        <MultiSelect
          id={question.id}
          options={question.options}
          value={value || []}
          maxSelections={question.maxSelections}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'yes-no':
      return (
        <div className="ayur-binary-group" role="radiogroup" aria-label={question.question}>
          <AnswerCard
            id={`${question.id}-yes`}
            label="Yes"
            description="Affirmative"
            icon={<Check size={16} className="text-success" />}
            selected={value === 'yes'}
            disabled={disabled}
            onClick={() => onChange('yes')}
          />
          <AnswerCard
            id={`${question.id}-no`}
            label="No"
            description="Negative"
            icon={<X size={16} className="text-muted" />}
            selected={value === 'no'}
            disabled={disabled}
            onClick={() => onChange('no')}
          />
        </div>
      );

    case 'slider':
      return (
        <SliderInput
          id={question.id}
          value={value ?? question.defaultValue}
          onChange={onChange}
          min={question.min}
          max={question.max}
          step={question.step}
          unit={question.unit}
          ticks={question.ticks}
          disabled={disabled}
        />
      );

    case 'scale':
      return (
        <ScaleInput
          id={question.id}
          value={value ?? question.defaultValue}
          onChange={onChange}
          min={question.min}
          max={question.max}
          minLabel={question.minLabel}
          maxLabel={question.maxLabel}
          disabled={disabled}
        />
      );

    case 'frequency':
      return (
        <FrequencySelector
          id={question.id}
          options={question.options}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'time':
      return (
        <TimeSelector
          id={question.id}
          options={question.options}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'chips':
      return (
        <ChipsInput
          id={question.id}
          options={question.options}
          value={value || []}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'segmented-control':
      return (
        <SegmentedInput
          id={question.id}
          options={question.options}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'search-select':
      return (
        <SearchSelect
          id={question.id}
          options={question.options}
          value={value}
          onChange={onChange}
          placeholder={question.placeholder}
          disabled={disabled}
        />
      );

    case 'number':
      return (
        <div className="ayur-text-input-wrap">
          <input
            type="number"
            id={question.id}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={question.placeholder || 'Enter value'}
            disabled={disabled}
            className="ayur-native-input"
          />
        </div>
      );

    case 'text':
      return (
        <div className="ayur-text-input-wrap">
          <input
            type="text"
            id={question.id}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || 'Enter text'}
            disabled={disabled}
            className="ayur-native-input"
          />
        </div>
      );

    default:
      console.warn(`[QuestionRenderer] Unsupported question type: "${question.type}".`);
      return (
        <div className="ayur-unsupported-type-fallback">
          <span>Unsupported interaction type: {question.type}</span>
        </div>
      );
  }
};
