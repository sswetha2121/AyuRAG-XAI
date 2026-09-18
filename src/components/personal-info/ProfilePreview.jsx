import React from 'react';
import './ProfilePreview.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, ProgressBar } from '../ui';
import { Sparkles, User, Activity, MapPin, Compass, ShieldCheck, Scale, Ruler, CheckCircle2 } from 'lucide-react';

export const ProfilePreview = ({ formData, className = '' }) => {
  const { fullName, age, gender, height, heightUnit, weight, weightUnit, location, climateZone, primaryGoal } = formData;

  // Calculate initials
  const getInitials = (name) => {
    if (!name || !name.trim()) return 'AY';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Conversational dynamic feedback
  const getDynamicGreeting = () => {
    if (!fullName && !age && !gender) {
      return {
        title: 'Your Ayurvedic profile is waiting to take shape.',
        desc: 'Fill in your personal baseline to initiate personalized clinical decision support.'
      };
    }
    if (fullName && !age) {
      const firstName = fullName.trim().split(' ')[0];
      return {
        title: `Welcome, ${firstName}.`,
        desc: 'Please share your age and physical measurements to continue.'
      };
    }
    if (fullName && age && gender) {
      return {
        title: `Profile active for ${fullName.trim().split(' ')[0]}.`,
        desc: 'Baseline parameters ready for constitutional Prakriti analysis.'
      };
    }
    return {
      title: 'Your profile is taking shape.',
      desc: 'Information is securely validated in local clinical session memory.'
    };
  };

  const greeting = getDynamicGreeting();

  // Climate zone display label
  const climateMap = {
    'tropical-coastal': 'Ānūpa (Tropical/Coastal)',
    'arid-dry': 'Jāṅgala (Arid/Dry)',
    'temperate': 'Sādhāraṇa (Temperate)',
    'cold-mountainous': 'Hima (Mountainous)'
  };

  // Gender display label
  const genderMap = {
    'female': 'Female',
    'male': 'Male',
    'other': 'Other (Individualized)',
    'prefer-not-to-say': 'Undisclosed'
  };

  // Calculate form completion percentage for step 1
  let completedFieldsCount = 0;
  if (fullName.trim()) completedFieldsCount++;
  if (age) completedFieldsCount++;
  if (gender) completedFieldsCount++;
  if (height) completedFieldsCount++;
  if (weight) completedFieldsCount++;
  const fieldPercentage = Math.round((completedFieldsCount / 5) * 100);

  return (
    <div className={`ayur-preview-wrapper ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-preview-card">
        {/* Card Header with Status */}
        <div className="ayur-preview-header">
          <div className="flex items-center justify-between">
            <Badge color="accent" variant="solid" size="sm" icon={<Sparkles size={11} />}>
              Live Patient Preview
            </Badge>
            <span className="ayur-preview-step-badge">Step 1 of 6</span>
          </div>

          <div className="ayur-preview-greeting">
            <h4 className="ayur-preview-greeting__title">{greeting.title}</h4>
            <p className="ayur-preview-greeting__desc">{greeting.desc}</p>
          </div>
        </div>

        {/* Patient Identity Badge */}
        <div className="ayur-preview-id-block">
          <div className="ayur-preview-avatar">
            <span>{getInitials(fullName)}</span>
          </div>

          <div className="ayur-preview-id-text">
            <h3 className="ayur-preview-name">
              {fullName.trim() || 'Anonymous Patient'}
            </h3>
            <span className="ayur-preview-sub">
              {gender ? genderMap[gender] : 'Gender pending'} • {age ? `${age} yrs` : 'Age pending'}
            </span>
          </div>
        </div>

        {/* Vitals Summary Grid */}
        <div className="ayur-preview-grid">
          <div className="ayur-preview-metric">
            <div className="ayur-metric-header">
              <Ruler size={13} className="text-muted" />
              <span>Height</span>
            </div>
            <span className={`ayur-metric-val ${height ? 'ayur-metric-val--active' : ''}`}>
              {height ? `${height} ${heightUnit}` : '—'}
            </span>
          </div>

          <div className="ayur-preview-metric">
            <div className="ayur-metric-header">
              <Scale size={13} className="text-muted" />
              <span>Weight</span>
            </div>
            <span className={`ayur-metric-val ${weight ? 'ayur-metric-val--active' : ''}`}>
              {weight ? `${weight} ${weightUnit}` : '—'}
            </span>
          </div>

          <div className="ayur-preview-metric">
            <div className="ayur-metric-header">
              <Compass size={13} className="text-muted" />
              <span>Climate (Desha)</span>
            </div>
            <span className="ayur-metric-val ayur-metric-val--active">
              {climateMap[climateZone] || 'Sādhāraṇa'}
            </span>
          </div>

          <div className="ayur-preview-metric">
            <div className="ayur-metric-header">
              <MapPin size={13} className="text-muted" />
              <span>Location</span>
            </div>
            <span className={`ayur-metric-val ${location ? 'ayur-metric-val--active' : ''}`}>
              {location || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Progress Tracker Widget */}
        <div className="ayur-preview-progress-box">
          <div className="flex items-center justify-between text-caption mb-xs">
            <span className="font-semibold text-primary">Onboarding Completion</span>
            <span className="font-mono font-bold text-accent">{fieldPercentage}%</span>
          </div>
          <ProgressBar
            value={fieldPercentage}
            color={fieldPercentage === 100 ? 'success' : 'accent'}
            size="sm"
            showValue={false}
          />
          <span className="ayur-preview-progress-sub">
            {fieldPercentage === 100 ? '✓ Ready to continue to Prakriti Assessment' : `${5 - completedFieldsCount} required fields remaining`}
          </span>
        </div>

        {/* Classical Ayurvedic Clinical Insight Note */}
        <div className="ayur-preview-insight">
          <div className="flex items-center gap-xs text-secondary font-semibold text-caption mb-2xs">
            <ShieldCheck size={14} />
            <span>Classical Ayurvedic Principle</span>
          </div>
          <p className="ayur-preview-insight__text">
            According to <em>Charaka Samhitā (Sutrasthana 1.55)</em>, individual baseline physical metrics (<em>Sharira Pramana</em>) and environmental climate (<em>Desha</em>) determine physiological resilience (<em>Bala</em>) before identifying biological dosha constitutional tendencies.
          </p>
        </div>
      </Card>
    </div>
  );
};
