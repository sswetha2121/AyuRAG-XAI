import React from 'react';
import './Assessment.css';
import { QuestionRenderer } from './QuestionRenderer';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * AyuRAG-XAI AssessmentQuestion Component
 * Card container wrapping question metadata, title, input renderer, and validation hints.
 */
export const AssessmentQuestion = ({
  question,
  value,
  onChange,
  validationError,
  questionNumber,
  totalQuestions,
  disabled = false
}) => {
  if (!question) return null;

  const isAnswered = value !== undefined && value !== null && value !== '' &&
    (!Array.isArray(value) || value.length > 0);

  return (
    <div
      className={`ayur-assessment-question-card ${isAnswered ? 'ayur-assessment-question-card--answered' : ''} ${validationError ? 'ayur-assessment-question-card--error' : ''}`}
      id={`question-card-${question.id}`}
    >
      <div className="ayur-assessment-question__header">
        <div className="flex items-center gap-xs flex-wrap">
          {questionNumber && (
            <span className="ayur-question-number-pill">
              {questionNumber} {totalQuestions ? `of ${totalQuestions}` : ''}
            </span>
          )}
          {question.category && (
            <span className="ayur-question-category-tag">
              {question.category}
            </span>
          )}
          {question.required && (
            <span className="ayur-question-required-star" title="Required field">*</span>
          )}
        </div>

        {isAnswered && (
          <span className="ayur-question-status-badge" title="Response recorded">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-xs text-success font-medium">Recorded</span>
          </span>
        )}
      </div>

      <div className="ayur-assessment-question__body">
        <h3 className="ayur-assessment-question__title">{question.question}</h3>
        {question.description && (
          <p className="ayur-assessment-question__desc">{question.description}</p>
        )}
      </div>

      <div className="ayur-assessment-question__input-area">
        <QuestionRenderer
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

      {validationError && (
        <div className="ayur-question-error-box" role="alert">
          <AlertCircle size={15} />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
