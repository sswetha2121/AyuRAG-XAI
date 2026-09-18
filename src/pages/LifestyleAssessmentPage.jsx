import React, { useState, useEffect } from 'react';
import './LifestyleAssessmentPage.css';
import { useAssessment } from '../context/AssessmentContext';
import { LIFESTYLE_QUESTIONS, LIFESTYLE_CATEGORIES } from '../data/lifestyleQuestions';
import {
  LifestyleIntro,
  LifestyleCategoryBar,
  LifestyleQuestionCard,
  LifestyleSummary,
  LifestyleCompletionCard
} from '../components/lifestyle';
import { QuestionNavigator } from '../components/prakriti/QuestionNavigator';
import { Button, Badge, ProgressBar } from '../components/ui';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, HelpCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LifestyleAssessmentPage = ({ onContinueToNextPhase, onTriggerToast }) => {
  const {
    personalInfo,
    lifestyleAnswers,
    setLifestyleAnswer,
    resetLifestyleAnswers,
    markStepCompleted,
    completedSteps
  } = useAssessment();

  const answeredCount = Object.keys(lifestyleAnswers).filter((k) => {
    const val = lifestyleAnswers[k];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Object.keys(val).length > 0;
    return true;
  }).length;

  const isAlreadyComplete = completedSteps.includes('lifestyle') && answeredCount === LIFESTYLE_QUESTIONS.length;

  const [hasStarted, setHasStarted] = useState(() => answeredCount > 0 || isAlreadyComplete);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(isAlreadyComplete);
  const [validationError, setValidationError] = useState('');

  const currentQuestion = LIFESTYLE_QUESTIONS[currentIndex];
  const currentValue = currentQuestion ? lifestyleAnswers[currentQuestion.id] : null;

  // Clear validation error on change
  useEffect(() => {
    setValidationError('');
  }, [currentIndex, currentValue]);

  // Handle answering
  const handleAnswerChange = (val) => {
    if (currentQuestion) {
      setLifestyleAnswer(currentQuestion.id, val);
      setValidationError('');
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setShowCompletion(false);
    setCurrentIndex(0);
  };

  // Validate answer completeness based on question type
  const isAnswerValid = (q, val) => {
    if (!val) return false;
    if (q.type === 'time-routine') {
      return Boolean(val.wake && val.bed);
    }
    if (q.type === 'sleep-duration-quality') {
      return Boolean(val.duration && val.quality);
    }
    if (q.type === 'multi-select-chips') {
      return Array.isArray(val) && val.length > 0;
    }
    return Boolean(val);
  };

  const handleNext = () => {
    if (!isAnswerValid(currentQuestion, currentValue)) {
      let msg = 'Please select an option to continue.';
      if (currentQuestion.type === 'time-routine') {
        msg = 'Please select both your typical waking hour and bedtime.';
      } else if (currentQuestion.type === 'sleep-duration-quality') {
        msg = 'Please select both your sleep duration and sleep quality.';
      } else if (currentQuestion.type === 'multi-select-chips') {
        msg = 'Please select at least one activity or "None at present".';
      }

      setValidationError(msg);
      onTriggerToast?.({
        type: 'warning',
        title: 'Response Required',
        message: msg
      });
      return;
    }

    if (currentIndex < LIFESTYLE_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      markStepCompleted('lifestyle');
      setShowCompletion(true);
      onTriggerToast?.({
        type: 'success',
        title: 'Lifestyle Assessment Complete',
        message: '10 of 10 Dinacharya parameters saved in session storage.'
      });
    }
  };

  const handleBack = () => {
    if (showCompletion) {
      setShowCompletion(false);
      setCurrentIndex(LIFESTYLE_QUESTIONS.length - 1);
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setHasStarted(false);
    }
  };

  const handleNavigatorJump = (index) => {
    setShowCompletion(false);
    setHasStarted(true);
    setCurrentIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId) => {
    const targetIdx = LIFESTYLE_QUESTIONS.findIndex((q) => q.categoryId === catId);
    if (targetIdx !== -1) {
      handleNavigatorJump(targetIdx);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Lifestyle assessment responses?')) {
      resetLifestyleAnswers();
      setCurrentIndex(0);
      setHasStarted(false);
      setShowCompletion(false);
      onTriggerToast?.({
        type: 'info',
        title: 'Assessment Reset',
        message: 'All Lifestyle question responses cleared.'
      });
    }
  };

  // Derive completed categories
  const completedCategoryIds = LIFESTYLE_CATEGORIES.filter((cat) => {
    const catQuestions = LIFESTYLE_QUESTIONS.filter((q) => q.categoryId === cat.id);
    return catQuestions.every((q) => isAnswerValid(q, lifestyleAnswers[q.id]));
  }).map((cat) => cat.id);

  const activeCategory = currentQuestion ? currentQuestion.categoryId : 'routine';
  const localProgressPct = Math.round(((currentIndex + 1) / LIFESTYLE_QUESTIONS.length) * 100);

  return (
    <div className="ayur-lifestyle-page">
      {/* 1. Global Assessment Progress Header */}
      <div className="ayur-ls-global-pipeline">
        <div className="ayur-ls-pipeline-track">
          <div className="ayur-ls-pipeline-step ayur-ls-pipeline-step--done">
            <span className="ayur-ls-pipeline-dot">✓</span>
            <span className="ayur-ls-pipeline-text">Personal Information</span>
          </div>
          <div className="ayur-ls-pipeline-line ayur-ls-pipeline-line--done" />
          <div className="ayur-ls-pipeline-step ayur-ls-pipeline-step--done">
            <span className="ayur-ls-pipeline-dot">✓</span>
            <span className="ayur-ls-pipeline-text">Prakriti</span>
          </div>
          <div className="ayur-ls-pipeline-line ayur-ls-pipeline-line--active" />
          <div className="ayur-ls-pipeline-step ayur-ls-pipeline-step--current">
            <span className="ayur-ls-pipeline-dot">●</span>
            <span className="ayur-ls-pipeline-text">Lifestyle</span>
          </div>
          <div className="ayur-ls-pipeline-line" />
          <div className="ayur-ls-pipeline-step">
            <span className="ayur-ls-pipeline-dot">○</span>
            <span className="ayur-ls-pipeline-text">Diet</span>
          </div>
          <div className="ayur-ls-pipeline-line" />
          <div className="ayur-ls-pipeline-step">
            <span className="ayur-ls-pipeline-dot">○</span>
            <span className="ayur-ls-pipeline-text">Symptoms</span>
          </div>
          <div className="ayur-ls-pipeline-line" />
          <div className="ayur-ls-pipeline-step">
            <span className="ayur-ls-pipeline-dot">○</span>
            <span className="ayur-ls-pipeline-text">Review</span>
          </div>
        </div>
      </div>

      {/* 2. Page Editorial Header */}
      <div className="ayur-lifestyle-header">
        <div className="ayur-lifestyle-header__meta">
          <div className="flex items-center gap-xs flex-wrap">
            <Badge color="accent" variant="subtle" size="md" icon={<Sparkles size={13} />}>
              STEP 3 OF 6
            </Badge>
            <Badge color="primary" variant="subtle" size="md">
              Lifestyle Assessment
            </Badge>
          </div>

          <div className="ayur-lifestyle-header__progress">
            <span className="text-caption text-muted font-medium">Pipeline Progress (Step 3/6)</span>
            <ProgressBar value={50} color="accent" size="sm" showValue />
          </div>
        </div>

        <h1 className="ayur-lifestyle-header__title">
          Understand your <span className="ayur-ls-title-accent">everyday rhythm</span>
        </h1>

        <p className="ayur-lifestyle-header__desc">
          Tell us about your daily routine, activity, sleep and habits so your personalized profile can reflect your lifestyle.
        </p>
      </div>

      {/* 3. Main Body */}
      {!hasStarted ? (
        /* Intro Screen */
        <LifestyleIntro onStart={handleStart} />
      ) : showCompletion ? (
        /* Completion Screen */
        <LifestyleCompletionCard
          answers={lifestyleAnswers}
          questions={LIFESTYLE_QUESTIONS}
          patientName={personalInfo.fullName}
          onReviewAnswers={() => {
            setShowCompletion(false);
            setCurrentIndex(0);
          }}
          onContinueToNextPhase={onContinueToNextPhase}
        />
      ) : (
        /* Progressive Question Flow */
        <div className="ayur-lifestyle-layout">
          {/* Main Question Column */}
          <div className="ayur-lifestyle-main-col">
            {/* Category Progress Bar */}
            <LifestyleCategoryBar
              activeCategoryId={activeCategory}
              completedCategoryIds={completedCategoryIds}
              onSelectCategory={handleSelectCategory}
            />

            {/* Local Question Navigation & Progress */}
            <div className="ayur-ls-nav-container">
              <div className="ayur-ls-local-progress-header">
                <div>
                  <span className="ayur-ls-local-title">Lifestyle Assessment</span>
                  <span className="ayur-ls-local-sub">
                    Question {currentIndex + 1} of {LIFESTYLE_QUESTIONS.length}
                  </span>
                </div>
                <span className="ayur-ls-pct-tag font-mono">{localProgressPct}%</span>
              </div>

              <ProgressBar
                value={localProgressPct}
                color="accent"
                size="sm"
                showValue={false}
                className="mb-sm"
              />

              <QuestionNavigator
                totalQuestions={LIFESTYLE_QUESTIONS.length}
                currentIndex={currentIndex}
                answers={lifestyleAnswers}
                questions={LIFESTYLE_QUESTIONS}
                onSelectIndex={handleNavigatorJump}
              />
            </div>

            {/* Dynamic Question Card */}
            <LifestyleQuestionCard
              questionData={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={LIFESTYLE_QUESTIONS.length}
              currentValue={currentValue}
              onAnswerChange={handleAnswerChange}
            />

            {/* Inline Validation Alert */}
            {validationError && (
              <div className="ayur-ls-val-error" role="alert">
                <span>{validationError}</span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="ayur-lifestyle-actions">
              <Button
                variant="outline"
                leftIcon={<ArrowLeft size={16} />}
                onClick={handleBack}
              >
                {currentIndex === 0 ? 'Back to Intro' : 'Previous Question'}
              </Button>

              <div className="flex items-center gap-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<RotateCcw size={14} />}
                  onClick={handleReset}
                  title="Reset all questions"
                >
                  Reset
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  disabled={!isAnswerValid(currentQuestion, currentValue)}
                  onClick={handleNext}
                >
                  {currentIndex === LIFESTYLE_QUESTIONS.length - 1 ? 'Complete Lifestyle Assessment' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>

          {/* Side Summary Column (Desktop Sticky) */}
          <div className="ayur-lifestyle-side-col">
            <LifestyleSummary
              totalQuestions={LIFESTYLE_QUESTIONS.length}
              answeredCount={answeredCount}
              answers={lifestyleAnswers}
              patientName={personalInfo.fullName}
            />
          </div>
        </div>
      )}
    </div>
  );
};
