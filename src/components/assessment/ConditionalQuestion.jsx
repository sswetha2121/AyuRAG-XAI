import React from 'react';
import { isQuestionVisible } from '../../utils/assessmentRules';
import { AssessmentQuestion } from './AssessmentQuestion';

/**
 * AyuRAG-XAI ConditionalQuestion Component
 * Evaluates visibility rules against current answers before rendering.
 */
export const ConditionalQuestion = ({
  question,
  answers = {},
  value,
  onChange,
  validationError,
  questionNumber,
  totalQuestions,
  disabled = false
}) => {
  const visible = isQuestionVisible(question, answers);

  if (!visible) return null;

  return (
    <div className="ayur-conditional-wrapper">
      <AssessmentQuestion
        question={question}
        value={value}
        onChange={onChange}
        validationError={validationError}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        disabled={disabled}
      />
    </div>
  );
};
