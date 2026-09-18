import React from 'react';
import './DietSummary.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, ProgressBar } from '../ui';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Flame,
  Utensils,
  Salad,
  Coffee,
  HeartPulse,
  GlassWater
} from 'lucide-react';

export const DietSummary = ({
  totalQuestions = 10,
  answeredCount = 0,
  answers = {},
  patientName = '',
  className = ''
}) => {
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  const formatRegularity = () => {
    const q1 = answers.diet_q1_meal_regularity;
    if (!q1) return 'Not answered yet';
    if (q1 === 'very-consistent') return 'Highly Consistent';
    if (q1 === 'usually') return 'Usually Regular';
    if (q1 === 'sometimes') return 'Sometimes';
    if (q1 === 'rarely') return 'Erratic / Variable';
    return 'Recorded';
  };

  const formatPeakMeal = () => {
    const q2 = answers.diet_q2_meal_timings;
    if (!q2) return 'Not answered yet';
    if (q2 === 'lunch-peak') return 'Midday Solar Peak';
    if (q2 === 'dinner-peak') return 'Late Evening Dinner';
    if (q2 === 'morning-peak') return 'Heavy Morning';
    if (q2 === 'continuous-grazing') return 'Frequent Snacking';
    return 'Recorded';
  };

  const formatAgni = () => {
    const q3 = answers.diet_q3_appetite_nature;
    if (!q3) return 'Not answered yet';
    if (q3 === 'sama-agni') return 'Steady (Sama Agni)';
    if (q3 === 'tikshna-agni') return 'Sharp (Tīkṣṇa Agni)';
    if (q3 === 'vishama-agni') return 'Variable (Viṣama Agni)';
    if (q3 === 'manda-agni') return 'Sluggish (Manda Agni)';
    return 'Recorded';
  };

  const formatPattern = () => {
    const q4 = answers.diet_q4_dietary_pattern;
    if (!q4) return 'Not answered yet';
    if (q4 === 'lacto-vegetarian') return 'Lacto-Vegetarian';
    if (q4 === 'pure-vegan') return 'Plant-Based / Vegan';
    if (q4 === 'mixed-omnivore') return 'Mixed / Omnivore';
    if (q4 === 'pescatarian') return 'Pescatarian';
    return 'Recorded';
  };

  const formatTastes = () => {
    const q5 = answers.diet_q5_taste_preferences;
    if (!q5 || !Array.isArray(q5) || q5.length === 0) return 'Not answered yet';
    return `${q5.length} tastes preferred`;
  };

  const formatComfort = () => {
    const q10 = answers.diet_q10_digestive_comfort;
    if (!q10) return 'Not answered yet';
    if (q10 === 'light-energized') return 'Light & Energized';
    if (q10 === 'bloating-gas-tendency') return 'Prone to Bloating';
    if (q10 === 'heat-acidity-reflux') return 'Warm / Acidic';
    if (q10 === 'heavy-drowsy-sluggish') return 'Sluggish / Heavy';
    return 'Recorded';
  };

  return (
    <div className={`ayur-diet-summary ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-dt-summary-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge color="accent" variant="solid" size="sm" icon={<Sparkles size={11} />}>
              Dietary Profile
            </Badge>
            <span className="ayur-dt-step-badge">Step 4 of 6</span>
          </div>

          <CardTitle as="h3" className="ayur-dt-title">
            Your Dietary Profile
          </CardTitle>
          <CardDescription>
            {patientName ? `Ahara & Agni baseline for ${patientName}` : 'Real-time digestive and nutritional patterns'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Tracker */}
          <div className="ayur-dt-metric-box">
            <div className="flex items-center justify-between text-caption mb-xs">
              <span className="font-semibold text-primary">Dietary Assessment</span>
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
              <span className="text-secondary italic">
                {answeredCount === 0
                  ? 'Your dietary habits will appear here.'
                  : answeredCount <= 4
                  ? 'Capturing meal rhythm and Agni pattern.'
                  : 'Dietary habits comprehensively mapped.'}
              </span>
              <div className="flex items-center gap-2xs">
                <CheckCircle2 size={12} className="text-success" />
                <span>Autosaved</span>
              </div>
            </div>
          </div>

          {/* Parameters List */}
          <div className="ayur-dt-params-list">
            <div className="ayur-dt-param-row">
              <div className="ayur-dt-param-label">
                <Clock size={13} className="text-primary" />
                <span>Meal Timing</span>
              </div>
              <span className={`ayur-dt-param-val ${formatRegularity() === 'Not answered yet' ? 'ayur-dt-param-val--empty' : ''}`}>
                {formatRegularity()}
              </span>
            </div>

            <div className="ayur-dt-param-row">
              <div className="ayur-dt-param-label">
                <Utensils size={13} className="text-accent" />
                <span>Peak Meal</span>
              </div>
              <span className={`ayur-dt-param-val ${formatPeakMeal() === 'Not answered yet' ? 'ayur-dt-param-val--empty' : ''}`}>
                {formatPeakMeal()}
              </span>
            </div>

            <div className="ayur-dt-param-row">
              <div className="ayur-dt-param-label">
                <Flame size={13} className="text-accent" />
                <span>Agni Rhythm</span>
              </div>
              <span className={`ayur-dt-param-val ${formatAgni() === 'Not answered yet' ? 'ayur-dt-param-val--empty' : ''}`}>
                {formatAgni()}
              </span>
            </div>

            <div className="ayur-dt-param-row">
              <div className="ayur-dt-param-label">
                <Salad size={13} className="text-secondary" />
                <span>Dietary Style</span>
              </div>
              <span className={`ayur-dt-param-val ${formatPattern() === 'Not answered yet' ? 'ayur-dt-param-val--empty' : ''}`}>
                {formatPattern()}
              </span>
            </div>

            <div className="ayur-dt-param-row">
              <div className="ayur-dt-param-label">
                <Coffee size={13} className="text-primary" />
                <span>Taste Profile</span>
              </div>
              <span className={`ayur-dt-param-val ${formatTastes() === 'Not answered yet' ? 'ayur-dt-param-val--empty' : ''}`}>
                {formatTastes()}
              </span>
            </div>

            <div className="ayur-dt-param-row">
              <div className="ayur-dt-param-label">
                <HeartPulse size={13} className="text-secondary" />
                <span>Post-Meal Comfort</span>
              </div>
              <span className={`ayur-dt-param-val ${formatComfort() === 'Not answered yet' ? 'ayur-dt-param-val--empty' : ''}`}>
                {formatComfort()}
              </span>
            </div>
          </div>

          {/* Educational Signal Disclaimer Box */}
          <div className="ayur-dt-signal-box">
            <div className="flex items-center justify-between mb-2xs">
              <span className="ayur-demo-badge">Demonstration assessment signal</span>
              <ShieldCheck size={13} className="text-secondary" />
            </div>
            <p className="text-micro text-muted mb-0">
              In classical Ayurveda, <em>Ahara</em> (food) is considered supreme medicine (Mahābhaiṣajya). Inputs provide educational context for decision-support and do not establish a formal clinical diagnosis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
