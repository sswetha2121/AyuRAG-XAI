import React from 'react';
import './Assessment.css';
import { ConditionalQuestion } from './ConditionalQuestion';
import { Sparkles } from 'lucide-react';

/**
 * AyuRAG-XAI AssessmentSection Component
 * Renders a complete section container with personalized contextual guidance
 * and all questions assigned to this section.
 */
export const AssessmentSection = ({
  section,
  questions = [],
  answers = {},
  onAnswerChange,
  validationErrors = {},
  guidanceText = null
}) => {
  if (!section) return null;

  return (
    <div className="ayur-assessment-section" id={`section-${section.id}`}>
      {/* Section Header */}
      <div className="ayur-assessment-section__header">
        <h2 className="ayur-assessment-section__title">{section.title}</h2>
        {section.description && (
          <p className="ayur-assessment-section__desc">{section.description}</p>
        )}

        {/* Personalized contextual hint */}
        {guidanceText && (
          <div className="ayur-section-guidance-callout">
            <Sparkles size={14} className="text-accent shrink-0" />
            <span>{guidanceText}</span>
          </div>
        )}
      </div>

      {/* Questions Stack */}
      <div className="ayur-section-questions-stack">
        {questions.map((question, index) => (
          <ConditionalQuestion
            key={question.id}
            question={question}
            answers={answers}
            value={answers[question.id]}
            onChange={(val) => onAnswerChange(question.id, val)}
            validationError={validationErrors[question.id]}
            questionNumber={index + 1}
            totalQuestions={questions.length}
          />
        ))}
      </div>
    </div>
  );
};
