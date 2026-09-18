import React, { useState, useEffect } from 'react';
import './DietAssessmentPage.css';
import { useAssessment } from '../context/AssessmentContext';
import { DIET_QUESTIONS, DIET_CATEGORIES } from '../data/dietQuestions';
import {
  DietIntro,
  DietCategoryBar,
  DietQuestionCard,
  DietSummary,
  DietCompletionCard
} from '../components/diet';
import { QuestionNavigator } from '../components/prakriti/QuestionNavigator';
import { Button, Badge, ProgressBar } from '../components/ui';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';

export const DietAssessmentPage = ({ onContinueToNextPhase, onTriggerToast }) => {
  const {
    personalInfo,
    dietAnswers,
    setDietAnswer,
    resetDietAnswers,
    markStepCompleted,
    completedSteps
  } = useAssessment();

  const answeredCount = Object.keys(dietAnswers).filter((k) => {
    const val = dietAnswers[k];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }).length;

  const isAlreadyComplete = completedSteps.includes('diet') && answeredCount === DIET_QUESTIONS.length;

  const [hasStarted, setHasStarted] = useState(() => answeredCount > 0 || isAlreadyComplete);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(isAlreadyComplete);
  const [validationError, setValidationError] = useState('');

  const currentQuestion = DIET_QUESTIONS[currentIndex];
  const currentValue = currentQuestion ? dietAnswers[currentQuestion.id] : null;

  useEffect(() => {
    setValidationError('');
  }, [currentIndex, currentValue]);

  const handleAnswerChange = (val) => {
    if (currentQuestion) {
      setDietAnswer(currentQuestion.id, val);
      setValidationError('');
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setShowCompletion(false);
    setCurrentIndex(0);
  };

  const isAnswerValid = (q, val) => {
    if (!val) return false;
    if (q.type === 'multi-select-chips') {
      return Array.isArray(val) && val.length > 0;
    }
    return Boolean(val);
  };

  const handleNext = () => {
    if (!isAnswerValid(currentQuestion, currentValue)) {
      const msg = 'Please select an option to continue.';
      setValidationError(msg);
      onTriggerToast?.({
        type: 'warning',
        title: 'Response Required',
        message: msg
      });
      return;
    }

    if (currentIndex < DIET_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      markStepCompleted('diet');
      setShowCompletion(true);
      onTriggerToast?.({
        type: 'success',
        title: 'Dietary Assessment Complete',
        message: '10 of 10 Ahara parameters saved in session storage.'
      });
    }
  };

  const handleBack = () => {
    if (showCompletion) {
      setShowCompletion(false);
      setCurrentIndex(DIET_QUESTIONS.length - 1);
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
    const targetIdx = DIET_QUESTIONS.findIndex((q) => q.categoryId === catId);
    if (targetIdx !== -1) {
      handleNavigatorJump(targetIdx);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all Dietary assessment responses?')) {
      resetDietAnswers();
      setCurrentIndex(0);
      setHasStarted(false);
      setShowCompletion(false);
      onTriggerToast?.({
        type: 'info',
        title: 'Assessment Reset',
        message: 'All Dietary question responses cleared.'
      });
    }
  };

  const completedCategoryIds = DIET_CATEGORIES.filter((cat) => {
    const catQuestions = DIET_QUESTIONS.filter((q) => q.categoryId === cat.id);
    return catQuestions.every((q) => isAnswerValid(q, dietAnswers[q.id]));
  }).map((cat) => cat.id);

  const activeCategory = currentQuestion ? currentQuestion.categoryId : 'meal_timing';
  const localProgressPct = Math.round(((currentIndex + 1) / DIET_QUESTIONS.length) * 100);

  return (
    <div className="ayur-diet-page">
      {/* 1. Global Pipeline Progress Header */}
      <div className="ayur-dt-global-pipeline">
        <div className="ayur-dt-pipeline-track">
          <div className="ayur-dt-pipeline-step ayur-dt-pipeline-step--done">
            <span className="ayur-dt-pipeline-dot">✓</span>
            <span className="ayur-dt-pipeline-text">Personal Information</span>
          </div>
          <div className="ayur-dt-pipeline-line ayur-dt-pipeline-line--done" />
          <div className="ayur-dt-pipeline-step ayur-dt-pipeline-step--done">
            <span className="ayur-dt-pipeline-dot">✓</span>
            <span className="ayur-dt-pipeline-text">Prakriti</span>
          </div>
          <div className="ayur-dt-pipeline-line ayur-dt-pipeline-line--done" />
          <div className="ayur-dt-pipeline-step ayur-dt-pipeline-step--done">
            <span className="ayur-dt-pipeline-dot">✓</span>
            <span className="ayur-dt-pipeline-text">Lifestyle</span>
          </div>
          <div className="ayur-dt-pipeline-line ayur-dt-pipeline-line--active" />
          <div className="ayur-dt-pipeline-step ayur-dt-pipeline-step--current">
            <span className="ayur-dt-pipeline-dot">●</span>
            <span className="ayur-dt-pipeline-text">Diet</span>
          </div>
          <div className="ayur-dt-pipeline-line" />
          <div className="ayur-dt-pipeline-step">
            <span className="ayur-dt-pipeline-dot">○</span>
            <span className="ayur-dt-pipeline-text">Symptoms</span>
          </div>
          <div className="ayur-dt-pipeline-line" />
          <div className="ayur-dt-pipeline-step">
            <span className="ayur-dt-pipeline-dot">○</span>
            <span className="ayur-dt-pipeline-text">Review</span>
          </div>
        </div>
      </div>

      {/* 2. Editorial Header */}
      <div className="ayur-diet-header">
        <div className="ayur-diet-header__meta">
          <div className="flex items-center gap-xs flex-wrap">
            <Badge color="accent" variant="subtle" size="md" icon={<Sparkles size={13} />}>
              STEP 4 OF 6
            </Badge>
            <Badge color="primary" variant="subtle" size="md">
              Dietary Assessment
            </Badge>
          </div>

          <div className="ayur-diet-header__progress">
            <span className="text-caption text-muted font-medium">Pipeline Progress (Step 4/6)</span>
            <ProgressBar value={66} color="accent" size="sm" showValue />
          </div>
        </div>

        <h1 className="ayur-diet-header__title">
          Understand your <span className="ayur-dt-title-accent">relationship with food</span>
        </h1>

        <p className="ayur-diet-header__desc">
          Tell us about your meal rhythms, appetite patterns, sensory taste preferences, and post-meal comfort to build your personalized digestive profile.
        </p>
      </div>

      {/* 3. Main Content Flow */}
      {!hasStarted ? (
        <DietIntro onStart={handleStart} />
      ) : showCompletion ? (
        <DietCompletionCard
          answers={dietAnswers}
          patientName={personalInfo.fullName}
          onReviewAnswers={() => {
            setShowCompletion(false);
            setCurrentIndex(0);
          }}
          onContinueToNextPhase={onContinueToNextPhase}
        />
      ) : (
        <div className="ayur-diet-layout">
          {/* Main Question Column */}
          <div className="ayur-diet-main-col">
            <DietCategoryBar
              activeCategoryId={activeCategory}
              completedCategoryIds={completedCategoryIds}
              onSelectCategory={handleSelectCategory}
            />

            <div className="ayur-dt-nav-container">
              <div className="ayur-dt-local-progress-header">
                <div>
                  <span className="ayur-dt-local-title">Dietary Assessment</span>
                  <span className="ayur-dt-local-sub">
                    Question {currentIndex + 1} of {DIET_QUESTIONS.length}
                  </span>
                </div>
                <span className="ayur-dt-pct-tag font-mono">{localProgressPct}%</span>
              </div>

              <ProgressBar
                value={localProgressPct}
                color="accent"
                size="sm"
                showValue={false}
                className="mb-sm"
              />

              <QuestionNavigator
                totalQuestions={DIET_QUESTIONS.length}
                currentIndex={currentIndex}
                answers={dietAnswers}
                questions={DIET_QUESTIONS}
                onSelectIndex={handleNavigatorJump}
              />
            </div>

            <DietQuestionCard
              questionData={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={DIET_QUESTIONS.length}
              currentValue={currentValue}
              onAnswerChange={handleAnswerChange}
            />

            {validationError && (
              <div className="ayur-dt-val-error" role="alert">
                <span>{validationError}</span>
              </div>
            )}

            <div className="ayur-diet-actions">
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
                  {currentIndex === DIET_QUESTIONS.length - 1 ? 'Complete Dietary Assessment' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>

          {/* Side Summary Column */}
          <div className="ayur-diet-side-col">
            <DietSummary
              totalQuestions={DIET_QUESTIONS.length}
              answeredCount={answeredCount}
              answers={dietAnswers}
              patientName={personalInfo.fullName}
            />
          </div>
        </div>
      )}
    </div>
  );
};
