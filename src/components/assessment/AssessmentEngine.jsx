import React, { useState, useEffect } from 'react';
import './Assessment.css';
import { AssessmentProgress } from './AssessmentProgress';
import { AssessmentSection } from './AssessmentSection';
import { AssessmentSummary } from './AssessmentSummary';
import { Button } from '../ui/Button';
import {
  calculateAssessmentProgress,
  calculateSectionProgress,
  getVisibleQuestions,
  validateQuestionSchema
} from '../../utils/assessmentRules';
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * AyuRAG-XAI AssessmentEngine
 * Generic, data-driven assessment controller.
 * Handles conditional branching, section navigation, validation, live indicators, and progress.
 */
export const AssessmentEngine = ({
  sections = [],
  questions = [],
  answers = {},
  onAnswerChange,
  onComplete,
  onBack,
  onReset,
  domainName = 'Assessment',
  domainTitle = 'Assessment',
  headerMeta = {},
  indicators = [],
  patientName = '',
  guidanceMap = {},
  onTriggerToast
}) => {
  // 1. Dev-time schema validation
  useEffect(() => {
    if (import.meta.env?.DEV) {
      validateQuestionSchema(questions, domainName);
    }
  }, [questions, domainName]);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // 2. Dynamic progress calculation
  const overallProgress = calculateAssessmentProgress(questions, answers);
  const enrichedSections = calculateSectionProgress(sections, questions, answers);

  const currentSection = enrichedSections[activeSectionIndex] || enrichedSections[0];
  const currentSectionQuestions = questions.filter(
    (q) => q.section === currentSection?.id
  );

  // Clear validation error when answer changes
  const handleAnswerChange = (questionId, value) => {
    onAnswerChange(questionId, value);
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  // Validate required visible questions in the current section
  const validateCurrentSection = () => {
    const visibleInCurrent = getVisibleQuestions(currentSectionQuestions, answers);
    const errors = {};

    visibleInCurrent.forEach((q) => {
      if (q.required) {
        const val = answers[q.id];
        const isMissing =
          val === undefined ||
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.length === 0);

        if (isMissing) {
          errors[q.id] = 'This question requires an answer to proceed.';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate to Next Section or Complete
  const handleNext = () => {
    const isValid = validateCurrentSection();
    if (!isValid) {
      onTriggerToast?.({
        type: 'warning',
        title: 'Response Required',
        message: 'Please complete the required questions highlighted below.'
      });
      return;
    }

    if (activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last section completed
      onComplete?.();
    }
  };

  // Navigate Back
  const handlePrevious = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack?.();
    }
  };

  const handleJumpSection = (targetIndex) => {
    setActiveSectionIndex(targetIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetConfirm = () => {
    if (window.confirm(`Reset all ${domainName} responses?`)) {
      onReset?.();
      setActiveSectionIndex(0);
      setValidationErrors({});
    }
  };

  return (
    <div className="ayur-assessment-engine">
      {/* Header Banner */}
      <div className="ayur-assessment-header">
        <div className="ayur-assessment-header__meta">
          <span className="ayur-header-tag">Clinical Intake Module</span>
          <span className="ayur-header-domain font-serif">{domainTitle}</span>
        </div>

        <h1 className="ayur-assessment-header__title">
          {headerMeta.bannerTitle || `${domainTitle} Evaluation`}
        </h1>

        <p className="ayur-assessment-header__desc">
          {headerMeta.bannerSubtitle || 'Please answer the following questions to help map your current physiological baseline.'}
        </p>

        {headerMeta.contextualNote && (
          <div className="ayur-header-personal-note">
            <span className="ayur-header-personal-note__dot" />
            <span>{headerMeta.contextualNote}</span>
          </div>
        )}
      </div>

      {/* Dynamic Progress Tracker */}
      <AssessmentProgress
        sections={enrichedSections}
        activeSectionIndex={activeSectionIndex}
        onSelectSection={handleJumpSection}
        totalRelevant={overallProgress.totalRelevant}
        answeredCount={overallProgress.answeredCount}
        percent={overallProgress.percent}
        domainTitle={domainTitle}
      />

      {/* Main Two-Column Layout */}
      <div className="ayur-engine-layout">
        {/* Left Column: Active Section with dynamic questions */}
        <div className="ayur-engine-main-col">
          {currentSection && (
            <AssessmentSection
              section={currentSection}
              questions={currentSectionQuestions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              validationErrors={validationErrors}
              guidanceText={guidanceMap[currentSection.id]}
            />
          )}

          {/* Action Bar: Back / Reset / Next */}
          <div className="ayur-engine-actions">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={handlePrevious}
            >
              {activeSectionIndex === 0 ? 'Previous Phase' : 'Previous Section'}
            </Button>

            <div className="flex items-center gap-sm">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw size={14} />}
                onClick={handleResetConfirm}
                title={`Reset all ${domainName} questions`}
              >
                Reset
              </Button>

              <Button
                variant="primary"
                size="lg"
                rightIcon={activeSectionIndex === sections.length - 1 ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
                onClick={handleNext}
              >
                {activeSectionIndex === sections.length - 1
                  ? `Complete ${domainName}`
                  : 'Continue to Next Section'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Profile Summary & Signals */}
        <div className="ayur-engine-side-col">
          <AssessmentSummary
            title={`${domainName} Signals`}
            subtitle="Profile Indicators"
            indicators={indicators}
            sections={enrichedSections}
            patientName={patientName}
          />
        </div>
      </div>
    </div>
  );
};
