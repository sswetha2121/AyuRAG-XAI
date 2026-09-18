import React, { useState } from 'react';
import './ReviewPage.css';
import { useAssessment } from '../context/AssessmentContext';
import {
  ReviewSectionCard,
  ReadinessMeter,
  ConsentCheckbox
} from '../components/review';
import { Button, Badge, ProgressBar } from '../components/ui';
import { ArrowLeft, ArrowRight, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

export const ReviewPage = ({
  onEditStep,
  onGenerateAnalysis,
  onTriggerToast
}) => {
  const {
    personalInfo,
    prakritiAnswers,
    lifestyleAnswers,
    dietAnswers,
    symptomAnswers,
    reviewConsent,
    setReviewConsent,
    markStepCompleted
  } = useAssessment();

  // Determine section completeness
  const isPersonalComplete = Boolean(personalInfo.fullName && personalInfo.age && personalInfo.gender);
  const prakritiCount = Object.keys(prakritiAnswers).length;
  const isPrakritiComplete = prakritiCount >= 8;
  const lifestyleCount = Object.keys(lifestyleAnswers).length;
  const isLifestyleComplete = lifestyleCount >= 8;
  const dietCount = Object.keys(dietAnswers).length;
  const isDietComplete = dietCount >= 8;
  const isSymptomsComplete = true; // Optional context, always valid

  const domainStatuses = [
    { name: '01 Personal Demographics', isComplete: isPersonalComplete },
    { name: '02 Prakriti Constitution', isComplete: isPrakritiComplete },
    { name: '03 Dinacharya & Routine', isComplete: isLifestyleComplete },
    { name: '04 Ahara & Digestive Rhythm', isComplete: isDietComplete },
    { name: '05 Symptoms & Health Focus', isComplete: isSymptomsComplete }
  ];

  const completedCount = domainStatuses.filter((d) => d.isComplete).length;
  const readinessPct = Math.round((completedCount / 5) * 100);

  const handleTriggerAnalysis = () => {
    if (!reviewConsent) {
      onTriggerToast?.({
        type: 'warning',
        title: 'Consent Required',
        message: 'Please review and acknowledge the educational disclaimer to proceed.'
      });
      return;
    }

    markStepCompleted('review');
    onGenerateAnalysis?.();
  };

  return (
    <div className="ayur-review-page">
      {/* 1. Global Pipeline Progress Header */}
      <div className="ayur-rv-global-pipeline">
        <div className="ayur-rv-pipeline-track">
          <div className="ayur-rv-pipeline-step ayur-rv-pipeline-step--done">
            <span className="ayur-rv-pipeline-dot">✓</span>
            <span className="ayur-rv-pipeline-text">Personal Information</span>
          </div>
          <div className="ayur-rv-pipeline-line ayur-rv-pipeline-line--done" />
          <div className="ayur-rv-pipeline-step ayur-rv-pipeline-step--done">
            <span className="ayur-rv-pipeline-dot">✓</span>
            <span className="ayur-rv-pipeline-text">Prakriti</span>
          </div>
          <div className="ayur-rv-pipeline-line ayur-rv-pipeline-line--done" />
          <div className="ayur-rv-pipeline-step ayur-rv-pipeline-step--done">
            <span className="ayur-rv-pipeline-dot">✓</span>
            <span className="ayur-rv-pipeline-text">Lifestyle</span>
          </div>
          <div className="ayur-rv-pipeline-line ayur-rv-pipeline-line--done" />
          <div className="ayur-rv-pipeline-step ayur-rv-pipeline-step--done">
            <span className="ayur-rv-pipeline-dot">✓</span>
            <span className="ayur-rv-pipeline-text">Diet</span>
          </div>
          <div className="ayur-rv-pipeline-line ayur-rv-pipeline-line--done" />
          <div className="ayur-rv-pipeline-step ayur-rv-pipeline-step--done">
            <span className="ayur-rv-pipeline-dot">✓</span>
            <span className="ayur-rv-pipeline-text">Symptoms</span>
          </div>
          <div className="ayur-rv-pipeline-line ayur-rv-pipeline-line--active" />
          <div className="ayur-rv-pipeline-step ayur-rv-pipeline-step--current">
            <span className="ayur-rv-pipeline-dot">●</span>
            <span className="ayur-rv-pipeline-text">Review</span>
          </div>
        </div>
      </div>

      {/* 2. Editorial Header */}
      <div className="ayur-review-header">
        <div className="ayur-review-header__meta">
          <div className="flex items-center gap-xs flex-wrap">
            <Badge color="accent" variant="subtle" size="md" icon={<Sparkles size={13} />}>
              STEP 6 OF 6
            </Badge>
            <Badge color="primary" variant="subtle" size="md">
              Pre-Analysis Clinical Review
            </Badge>
          </div>

          <div className="ayur-review-header__progress">
            <span className="text-caption text-muted font-medium">Pipeline Progress (Step 6/6)</span>
            <ProgressBar value={100} color="success" size="sm" showValue />
          </div>
        </div>

        <h1 className="ayur-review-header__title">
          Review your <span className="ayur-rv-title-accent">assessment data</span>
        </h1>

        <p className="ayur-review-header__desc">
          Review your recorded physiological parameters and lifestyle characteristics before triggering the explainable AI inference engine.
        </p>
      </div>

      {/* 3. Main 2-Column Grid */}
      <div className="ayur-review-layout">
        {/* Left Column: 5 Review Section Cards */}
        <div className="ayur-review-main-col">
          {/* 01 Personal Info */}
          <ReviewSectionCard
            stepNumber="01"
            title="Personal Demographics & Vitals"
            status={isPersonalComplete ? 'complete' : 'needs-attention'}
            summaryItems={[
              { label: 'Patient Name', value: personalInfo.fullName },
              { label: 'Age / Gender', value: `${personalInfo.age || '—'} yrs • ${personalInfo.gender || '—'}` },
              { label: 'Height / Weight', value: `${personalInfo.height || '—'} ${personalInfo.heightUnit} • ${personalInfo.weight || '—'} ${personalInfo.weightUnit}` },
              { label: 'Location / Climate', value: `${personalInfo.location || '—'} (${personalInfo.climateZone})` },
              { label: 'Primary Wellness Goal', value: personalInfo.primaryGoal }
            ]}
            onEdit={() => onEditStep?.('personal-info')}
          />

          {/* 02 Prakriti */}
          <ReviewSectionCard
            stepNumber="02"
            title="Prakriti Constitutional Assessment"
            status={isPrakritiComplete ? 'complete' : 'needs-attention'}
            summaryItems={[
              { label: 'Constitutional Scope', value: 'Physical Frame, Digestion, Sleep & Mind' },
              { label: 'Questions Answered', value: `${prakritiCount} of 10 Parameters Recorded` },
              { label: 'Assessment Mode', value: 'Tridosha Tri-Factor Evaluation (V-P-K)' }
            ]}
            onEdit={() => onEditStep?.('prakriti')}
          />

          {/* 03 Lifestyle */}
          <ReviewSectionCard
            stepNumber="03"
            title="Lifestyle Assessment (Dinacharya)"
            status={isLifestyleComplete ? 'complete' : 'needs-attention'}
            summaryItems={[
              { label: 'Daily Schedule', value: lifestyleAnswers.lifestyle_q1_routine_consistency || 'Not recorded' },
              { label: 'Activity Level', value: lifestyleAnswers.lifestyle_q3_activity_level || 'Not recorded' },
              { label: 'Sleep Window', value: lifestyleAnswers.lifestyle_q5_sleep_duration_quality ? `${lifestyleAnswers.lifestyle_q5_sleep_duration_quality.duration} hrs (${lifestyleAnswers.lifestyle_q5_sleep_duration_quality.quality})` : 'Not recorded' },
              { label: 'Work Pacing', value: lifestyleAnswers.lifestyle_q6_work_pattern || 'Not recorded' },
              { label: 'Hydration Habit', value: lifestyleAnswers.lifestyle_q10_hydration_habit || 'Not recorded' }
            ]}
            onEdit={() => onEditStep?.('lifestyle')}
          />

          {/* 04 Dietary */}
          <ReviewSectionCard
            stepNumber="04"
            title="Dietary Assessment (Ahara & Agni)"
            status={isDietComplete ? 'complete' : 'needs-attention'}
            summaryItems={[
              { label: 'Meal Regularity', value: dietAnswers.diet_q1_meal_regularity || 'Not recorded' },
              { label: 'Peak Meal Time', value: dietAnswers.diet_q2_meal_timings || 'Not recorded' },
              { label: 'Agni Rhythm', value: dietAnswers.diet_q3_appetite_nature || 'Not recorded' },
              { label: 'Dietary Style', value: dietAnswers.diet_q4_dietary_pattern || 'Not recorded' },
              { label: 'Post-Meal Comfort', value: dietAnswers.diet_q10_digestive_comfort || 'Not recorded' }
            ]}
            onEdit={() => onEditStep?.('diet')}
          />

          {/* 05 Symptoms */}
          <ReviewSectionCard
            stepNumber="05"
            title="Symptoms & Health Context"
            status={isSymptomsComplete ? 'complete' : 'complete'}
            summaryItems={[
              { label: 'Chief Concern', value: symptomAnswers.primaryConcern || 'General health & balance' },
              { label: 'Recorded Symptoms', value: `${(symptomAnswers.selectedSymptoms || []).length} symptoms selected` },
              { label: 'Clinical Notes', value: symptomAnswers.additionalNotes || 'None specified' }
            ]}
            onEdit={() => onEditStep?.('symptoms')}
          />

          {/* Consent Checkbox */}
          <ConsentCheckbox
            checked={reviewConsent}
            onChange={setReviewConsent}
          />

          {/* Final Action Bar */}
          <div className="ayur-review-actions">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => onEditStep?.('symptoms')}
            >
              Back to Symptoms
            </Button>

            <Button
              variant="primary"
              size="lg"
              rightIcon={<Sparkles size={18} />}
              disabled={!reviewConsent || readinessPct < 60}
              onClick={handleTriggerAnalysis}
              className="ayur-review-analyze-btn"
            >
              Generate Personalized Analysis →
            </Button>
          </div>
        </div>

        {/* Right Column: Readiness Meter */}
        <div className="ayur-review-side-col">
          <ReadinessMeter
            readinessPct={readinessPct}
            domainStatuses={domainStatuses}
          />
        </div>
      </div>
    </div>
  );
};
