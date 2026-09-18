import React, { useState, useEffect } from 'react';
import './PrakritiAssessmentPage.css';
import { useAssessment } from '../context/AssessmentContext';
import { PRAKRITI_QUESTIONS } from '../data/prakritiQuestions';
import {
  PrakritiIntro,
  QuestionCard,
  QuestionNavigator,
  AssessmentSummary,
  PrakritiCompletionCard,
  InfoModal
} from '../components/prakriti';
import { Button, Badge, ProgressBar } from '../components/ui';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

export const PrakritiAssessmentPage = ({ onContinueToNextPhase, onTriggerToast }) => {
  const { personalInfo, prakritiAnswers, setPrakritiAnswer, resetPrakritiAnswers, markStepCompleted, completedSteps } = useAssessment();
  
  const answeredCount = Object.keys(prakritiAnswers).length;
  const isAlreadyComplete = completedSteps.includes('prakriti') && answeredCount === PRAKRITI_QUESTIONS.length;

  const [hasStarted, setHasStarted] = useState(() => answeredCount > 0 || isAlreadyComplete);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(isAlreadyComplete);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const currentQuestion = PRAKRITI_QUESTIONS[currentIndex];
  const selectedOptionId = currentQuestion ? prakritiAnswers[currentQuestion.id] : null;

  // Clear validation error when question or option changes
  useEffect(() => {
    setValidationError('');
  }, [currentIndex, selectedOptionId]);

  const handleSelectOption = (optionId) => {
    if (currentQuestion) {
      setPrakritiAnswer(currentQuestion.id, optionId);
      setValidationError('');
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    setShowCompletion(false);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (!selectedOptionId) {
      setValidationError('Please select an option to continue.');
      onTriggerToast?.({
        type: 'warning',
        title: 'Selection Required',
        message: 'Please choose the option that best reflects your natural tendency.'
      });
      return;
    }

    if (currentIndex < PRAKRITI_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed all questions
      markStepCompleted('prakriti');
      setShowCompletion(true);
      onTriggerToast?.({
        type: 'success',
        title: 'Prakriti Assessment Complete',
        message: '10 of 10 constitutional parameters saved in session memory.'
      });
    }
  };

  const handleBack = () => {
    if (showCompletion) {
      setShowCompletion(false);
      setCurrentIndex(PRAKRITI_QUESTIONS.length - 1);
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

  const handleReset = () => {
    if (window.confirm('Reset all Prakriti assessment responses?')) {
      resetPrakritiAnswers();
      setCurrentIndex(0);
      setHasStarted(false);
      setShowCompletion(false);
      onTriggerToast?.({
        type: 'info',
        title: 'Assessment Reset',
        message: 'All Prakriti question responses cleared.'
      });
    }
  };

  const questionProgressPct = Math.round(((currentIndex + 1) / PRAKRITI_QUESTIONS.length) * 100);

  return (
    <div className="ayur-prakriti-page">
      {/* Educational Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />

      {/* Header Banner */}
      <div className="ayur-prakriti-header">
        <div className="ayur-prakriti-header__meta">
          <div className="flex items-center gap-xs flex-wrap">
            <Badge color="accent" variant="subtle" size="md" icon={<Sparkles size={13} />}>
              Step 02 of 06
            </Badge>
            <Badge color="primary" variant="subtle" size="md">
              Prakriti Assessment
            </Badge>
            <button
              type="button"
              className="ayur-help-btn"
              onClick={() => setShowInfoModal(true)}
              aria-label="What is Prakriti?"
            >
              <HelpCircle size={14} />
              <span>What is Prakriti?</span>
            </button>
          </div>

          <div className="ayur-prakriti-header__progress">
            <span className="text-caption text-muted font-medium">Pipeline Progress</span>
            <ProgressBar value={33} color="accent" size="sm" showValue />
          </div>
        </div>

        <h1 className="ayur-prakriti-header__title">
          Discover your <span className="ayur-prakriti-title-accent">natural constitution</span>
        </h1>

        <p className="ayur-prakriti-header__desc">
          Answer a few questions about your natural characteristics and everyday tendencies. Your responses will help build your personalized Ayurvedic profile.
        </p>
      </div>

      {/* Main Content Area */}
      {!hasStarted ? (
        /* 1. Introduction Screen */
        <PrakritiIntro
          onStart={handleStart}
          onOpenInfo={() => setShowInfoModal(true)}
        />
      ) : showCompletion ? (
        /* 2. Completion Summary Screen */
        <PrakritiCompletionCard
          answers={prakritiAnswers}
          questions={PRAKRITI_QUESTIONS}
          patientName={personalInfo.fullName}
          onReviewAnswers={() => {
            setShowCompletion(false);
            setCurrentIndex(0);
          }}
          onContinueToNextPhase={onContinueToNextPhase}
        />
      ) : (
        /* 3. Progressive Question Flow */
        <div className="ayur-prakriti-layout">
          {/* Left Column: Active Question + Navigator + Actions */}
          <div className="ayur-prakriti-main-col">
            {/* Question Navigator */}
            <div className="ayur-nav-container">
              <div className="flex items-center justify-between text-caption mb-xs">
                <span className="font-semibold text-primary">Question Progress</span>
                <span className="font-mono text-muted">{answeredCount} of {PRAKRITI_QUESTIONS.length} Answered</span>
              </div>
              <QuestionNavigator
                totalQuestions={PRAKRITI_QUESTIONS.length}
                currentIndex={currentIndex}
                answers={prakritiAnswers}
                questions={PRAKRITI_QUESTIONS}
                onSelectIndex={handleNavigatorJump}
              />
            </div>

            {/* Question Card */}
            <QuestionCard
              questionData={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={PRAKRITI_QUESTIONS.length}
              selectedOptionId={selectedOptionId}
              onSelectOption={handleSelectOption}
            />

            {/* Validation Message */}
            {validationError && (
              <div className="ayur-question-val-error" role="alert">
                <span>{validationError}</span>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="ayur-prakriti-actions">
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
                  disabled={!selectedOptionId}
                  onClick={handleNext}
                >
                  {currentIndex === PRAKRITI_QUESTIONS.length - 1 ? 'Complete Prakriti Assessment' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Summary & Dosha Distribution */}
          <div className="ayur-prakriti-side-col">
            <AssessmentSummary
              totalQuestions={PRAKRITI_QUESTIONS.length}
              answeredCount={answeredCount}
              answers={prakritiAnswers}
              questions={PRAKRITI_QUESTIONS}
              patientName={personalInfo.fullName}
            />
          </div>
        </div>
      )}
    </div>
  );
};
