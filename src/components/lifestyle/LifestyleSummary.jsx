import React from 'react';
import './LifestyleSummary.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, ProgressBar } from '../ui';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Sun,
  Moon,
  Briefcase,
  HeartPulse,
  GlassWater,
  Clock
} from 'lucide-react';

export const LifestyleSummary = ({
  totalQuestions = 10,
  answeredCount = 0,
  answers = {},
  patientName = '',
  className = ''
}) => {
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  // Derive human-readable labels from answers
  const formatRoutine = () => {
    const q1 = answers.lifestyle_q1_routine_consistency;
    if (!q1) return 'Not answered yet';
    if (q1 === 'very-consistent' || q1 === 'opt_q1_daily') return 'Highly Consistent';
    if (q1 === 'usually' || q1 === 'opt_q1_usually') return 'Usually Consistent';
    if (q1 === 'sometimes' || q1 === 'opt_q1_sometimes') return 'Sometimes Consistent';
    if (q1 === 'rarely' || q1 === 'opt_q1_rarely') return 'Rarely Consistent';
    return 'Recorded';
  };

  const formatActivity = () => {
    const q3 = answers.lifestyle_q3_activity_level;
    if (!q3) return 'Not answered yet';
    if (q3 === 'sedentary' || q3 === 'opt_act_sedentary') return 'Mostly Sedentary';
    if (q3 === 'lightly-active' || q3 === 'opt_act_light') return 'Lightly Active';
    if (q3 === 'moderately-active' || q3 === 'opt_act_moderate') return 'Moderately Active';
    if (q3 === 'highly-active' || q3 === 'opt_act_high') return 'Highly Active';
    return 'Recorded';
  };

  const formatSleep = () => {
    const q5 = answers.lifestyle_q5_sleep_duration_quality;
    if (!q5 || (!q5.duration && !q5.quality)) return 'Not answered yet';
    const dur = q5.duration ? `${q5.duration} hrs` : '';
    const qual = q5.quality ? `${q5.quality.replace('-', ' ')} quality` : '';
    if (dur && qual) return `${dur} • ${qual}`;
    return dur || qual || 'Recorded';
  };

  const formatSleepTiming = () => {
    const q2 = answers.lifestyle_q2_sleep_wake_timing;
    if (!q2 || (!q2.wake && !q2.bed)) return 'Not answered yet';
    const wakeMap = {
      wake_early: '05:00-06:00',
      wake_standard: '06:00-07:00',
      wake_mid: '07:00-08:30',
      wake_late: '08:30+'
    };
    const bedMap = {
      bed_early: '21:30-22:30',
      bed_standard: '22:30-23:30',
      bed_midnight: '23:30-01:00',
      bed_late: '01:00+'
    };
    const wake = wakeMap[q2.wake] || q2.wake || '';
    const bed = bedMap[q2.bed] || q2.bed || '';
    if (wake && bed) return `Wake: ${wake} | Bed: ${bed}`;
    if (wake) return `Wake: ${wake}`;
    if (bed) return `Bed: ${bed}`;
    return 'Recorded';
  };

  const formatWork = () => {
    const q6 = answers.lifestyle_q6_work_pattern;
    if (!q6) return 'Not answered yet';
    if (q6 === 'desk-based' || q6 === 'opt_work_desk') return 'Desk-Based';
    if (q6 === 'mixed-activity' || q6 === 'opt_work_mixed') return 'Mixed Activity';
    if (q6 === 'field-based' || q6 === 'opt_work_field') return 'Field / On-Site';
    if (q6 === 'physically-demanding' || q6 === 'opt_work_physical') return 'Physically Demanding';
    if (q6 === 'variable-shift' || q6 === 'opt_work_shift') return 'Shift / Irregular';
    return 'Recorded';
  };

  const formatStress = () => {
    const q8 = answers.lifestyle_q8_stress_frequency;
    if (!q8) return 'Not answered yet';
    if (q8 === 'rarely' || q8 === 'opt_stress_rarely') return 'Rarely Stressed';
    if (q8 === 'sometimes' || q8 === 'opt_stress_sometimes') return 'Sometimes';
    if (q8 === 'often' || q8 === 'opt_stress_often') return 'Often';
    if (q8 === 'very-often' || q8 === 'opt_stress_very_often') return 'Very Often';
    return 'Recorded';
  };

  const formatHydration = () => {
    const q10 = answers.lifestyle_q10_hydration_habit;
    if (!q10) return 'Not answered yet';
    if (q10 === 'chilled-iced' || q10 === 'opt_hydra_cold') return 'Chilled / Iced';
    if (q10 === 'room-temp-moderate' || q10 === 'opt_hydra_room') return 'Room Temp (1.5-2L)';
    if (q10 === 'warm-herbal-2l' || q10 === 'opt_hydra_warm') return 'Warm Water / Herbal (2L+)';
    if (q10 === 'minimal-irregular' || q10 === 'opt_hydra_low') return 'Minimal / Irregular';
    return 'Recorded';
  };

  // Dynamic feedback copy based on progress
  const getFeedbackMessage = () => {
    if (answeredCount === 0) {
      return 'Your daily rhythm will appear here.';
    }
    if (answeredCount <= 3) {
      return 'Your lifestyle profile is taking shape.';
    }
    if (answeredCount <= 7) {
      return 'Capturing detailed Dinacharya habits and circadian pacing.';
    }
    return 'Your lifestyle rhythm has been comprehensively profiled.';
  };

  return (
    <div className={`ayur-lifestyle-summary ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-ls-summary-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge color="accent" variant="solid" size="sm" icon={<Sparkles size={11} />}>
              Lifestyle Profile
            </Badge>
            <span className="ayur-ls-step-badge">Step 3 of 6</span>
          </div>

          <CardTitle as="h3" className="ayur-ls-title">
            Your Lifestyle Profile
          </CardTitle>
          <CardDescription>
            {patientName ? `Dinacharya profile for ${patientName}` : 'Real-time circadian and routine parameters'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Tracker */}
          <div className="ayur-ls-metric-box">
            <div className="flex items-center justify-between text-caption mb-xs">
              <span className="font-semibold text-primary">Lifestyle Assessment</span>
              <span className="font-mono font-bold text-accent">
                {answeredCount} / {totalQuestions} ({percentage}%)
              </span>
            </div>
            <ProgressBar
              value={percentage}
              color={percentage === 100 ? 'success' : 'accent'}
              size="sm"
              showValue={false}
            />
            <div className="flex items-center justify-between text-micro text-muted mt-2xs">
              <span className="text-secondary italic">{getFeedbackMessage()}</span>
              <div className="flex items-center gap-2xs">
                <CheckCircle2 size={12} className="text-success" />
                <span>Autosaved</span>
              </div>
            </div>
          </div>

          {/* Profile Overview Parameters */}
          <div className="ayur-ls-params-list">
            {/* Daily Routine */}
            <div className="ayur-ls-param-row">
              <div className="ayur-ls-param-label">
                <Sun size={13} className="text-accent" />
                <span>Daily Routine</span>
              </div>
              <span className={`ayur-ls-param-val ${formatRoutine() === 'Not answered yet' ? 'ayur-ls-param-val--empty' : ''}`}>
                {formatRoutine()}
              </span>
            </div>

            {/* Sleep Timing */}
            <div className="ayur-ls-param-row">
              <div className="ayur-ls-param-label">
                <Clock size={13} className="text-primary" />
                <span>Wake / Bed Rhythm</span>
              </div>
              <span className={`ayur-ls-param-val ${formatSleepTiming() === 'Not answered yet' ? 'ayur-ls-param-val--empty' : ''}`}>
                {formatSleepTiming()}
              </span>
            </div>

            {/* Activity Level */}
            <div className="ayur-ls-param-row">
              <div className="ayur-ls-param-label">
                <Activity size={13} className="text-secondary" />
                <span>Activity Level</span>
              </div>
              <span className={`ayur-ls-param-val ${formatActivity() === 'Not answered yet' ? 'ayur-ls-param-val--empty' : ''}`}>
                {formatActivity()}
              </span>
            </div>

            {/* Sleep Hours & Rest */}
            <div className="ayur-ls-param-row">
              <div className="ayur-ls-param-label">
                <Moon size={13} className="text-primary" />
                <span>Sleep & Quality</span>
              </div>
              <span className={`ayur-ls-param-val ${formatSleep() === 'Not answered yet' ? 'ayur-ls-param-val--empty' : ''}`}>
                {formatSleep()}
              </span>
            </div>

            {/* Work Pattern */}
            <div className="ayur-ls-param-row">
              <div className="ayur-ls-param-label">
                <Briefcase size={13} className="text-secondary" />
                <span>Work / Study</span>
              </div>
              <span className={`ayur-ls-param-val ${formatWork() === 'Not answered yet' ? 'ayur-ls-param-val--empty' : ''}`}>
                {formatWork()}
              </span>
            </div>

            {/* Stress */}
            <div className="ayur-ls-param-row">
              <div className="ayur-ls-param-label">
                <HeartPulse size={13} className="text-accent" />
                <span>Mental Stress</span>
              </div>
              <span className={`ayur-ls-param-val ${formatStress() === 'Not answered yet' ? 'ayur-ls-param-val--empty' : ''}`}>
                {formatStress()}
              </span>
            </div>

            {/* Hydration */}
            <div className="ayur-ls-param-row">
              <div className="ayur-ls-param-label">
                <GlassWater size={13} className="text-primary" />
                <span>Hydration Habit</span>
              </div>
              <span className={`ayur-ls-param-val ${formatHydration() === 'Not answered yet' ? 'ayur-ls-param-val--empty' : ''}`}>
                {formatHydration()}
              </span>
            </div>
          </div>

          {/* Classical Grounding Footer */}
          <div className="ayur-ls-classical-box">
            <div className="flex items-center gap-xs text-secondary font-semibold text-micro mb-2xs">
              <ShieldCheck size={13} />
              <span>Classical Dinacharya Foundation</span>
            </div>
            <p className="text-micro text-muted">
              <em>"Dinacaryāṁ sadā vartet..."</em> — Regular adherence to daily rhythm, proper exercise (Vyāyāma), and adequate sleep (Nidrā) sustains tissue vitality and prevents dosha vitiation (Charaka Samhita Sutrasthana 5).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
