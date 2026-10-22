import React, { useState, useEffect } from 'react';
import './DoctorPatientBaseline.css';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Calendar,
  Layers,
  Activity,
  Moon,
  Utensils,
  HeartPulse,
  AlertTriangle,
  FileText,
  User,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorPatientBaseline = ({
  patientData,
  patientId,
  onSwitchToVerification,
}) => {
  const [viewMode, setViewMode] = useState('submission'); // 'submission' | 'comparison'
  const [verifications, setVerifications] = useState([]);
  const [stats, setStats] = useState({ total_fields: 0, verified: 0, corrected: 0, unverified: 0 });
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(false);
  const [comparisonCategory, setComparisonCategory] = useState('all');

  useEffect(() => {
    if (patientId) {
      setIsLoadingVerifications(true);
      api.getPatientVerifications(patientId)
        .then((res) => {
          setVerifications(res.verifications || []);
          if (res.stats) setStats(res.stats);
        })
        .catch(() => {})
        .finally(() => setIsLoadingVerifications(false));
    }
  }, [patientId]);

  if (!patientData) {
    return null;
  }

  const pScores = patientData.prakriti_scores || { vata: 40, pitta: 35, kapha: 25, primary: 'Movement & Metabolism' };
  const demographics = patientData.demographics || {};
  const lifestyle = patientData.lifestyle_data || {};
  const diet = patientData.diet_data || {};
  const symptoms = patientData.symptoms_data || {};
  const contraindications = patientData.recommendations?.contraindications || [];

  const submissionDate = patientData.created_at
    ? new Date(patientData.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Recorded on Intake';

  const filteredVerifications = verifications.filter((v) => {
    if (comparisonCategory === 'all') return true;
    return v.category?.toLowerCase() === comparisonCategory.toLowerCase();
  });

  const formatVal = (val) => {
    if (val === null || val === undefined) return '—';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className="ayur-baseline-container">
      {/* 1. Assessment Header & Mode Switcher */}
      <div className="ayur-baseline-header-card">
        <div>
          <h2 className="ayur-baseline-header-title">Baseline Assessment Data Record</h2>
          <div className="ayur-baseline-header-meta">
            <span className="ayur-baseline-pill ayur-baseline-pill--immutable">
              <ShieldCheck size={13} />
              Original Patient Intake (Immutable Ground Truth)
            </span>
            <span className="ayur-baseline-pill ayur-baseline-pill--date">
              <Calendar size={13} />
              Submitted: {submissionDate}
            </span>
            <span className="text-muted">Assessment #{patientData.id}</span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="ayur-baseline-view-switcher">
          <button
            type="button"
            className={`ayur-baseline-view-btn ${viewMode === 'submission' ? 'ayur-baseline-view-btn--active' : ''}`}
            onClick={() => setViewMode('submission')}
          >
            <FileText size={14} />
            <span>Original Questionnaire</span>
          </button>

          <button
            type="button"
            className={`ayur-baseline-view-btn ${viewMode === 'comparison' ? 'ayur-baseline-view-btn--active' : ''}`}
            onClick={() => setViewMode('comparison')}
          >
            <Layers size={14} />
            <span>Original vs Corrected ({stats.corrected || 0} Corrected)</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: ORIGINAL BASELINE QUESTIONNAIRE SUBMISSION */}
      {viewMode === 'submission' && (
        <>
          {/* Body Constitution Section */}
          <div className="ayur-baseline-card">
            <div className="ayur-baseline-card__header">
              <div className="flex items-center gap-xs">
                <Activity size={18} className="text-secondary" />
                <h3 className="ayur-baseline-card__title">Patient-Reported Body Constitution</h3>
              </div>
              <span className="ayur-prakriti-chip">{pScores.primary || 'Movement & Metabolism'}</span>
            </div>

            <div className="ayur-baseline-prakriti-grid">
              {/* Movement */}
              <div className="ayur-baseline-dosha-box">
                <div className="ayur-baseline-dosha-header">
                  <span className="ayur-baseline-dosha-name">Movement Energy (Air & Space)</span>
                  <span className="ayur-baseline-dosha-score">{pScores.vata || 40}%</span>
                </div>
                <div className="ayur-baseline-dosha-track">
                  <div
                    className="ayur-baseline-dosha-fill ayur-baseline-dosha-fill--vata"
                    style={{ width: `${pScores.vata || 40}%` }}
                  />
                </div>
                <span className="ayur-baseline-dosha-desc">
                  Kinetic regulation, neural impulse transmission, dryness, variability
                </span>
              </div>

              {/* Metabolism */}
              <div className="ayur-baseline-dosha-box">
                <div className="ayur-baseline-dosha-header">
                  <span className="ayur-baseline-dosha-name">Metabolic Energy (Fire & Water)</span>
                  <span className="ayur-baseline-dosha-score">{pScores.pitta || 35}%</span>
                </div>
                <div className="ayur-baseline-dosha-track">
                  <div
                    className="ayur-baseline-dosha-fill ayur-baseline-dosha-fill--pitta"
                    style={{ width: `${pScores.pitta || 35}%` }}
                  />
                </div>
                <span className="ayur-baseline-dosha-desc">
                  Thermoregulation, biochemical transformations, enzymatic digestion, acuity
                </span>
              </div>

              {/* Structure */}
              <div className="ayur-baseline-dosha-box">
                <div className="ayur-baseline-dosha-header">
                  <span className="ayur-baseline-dosha-name">Structural Energy (Earth & Water)</span>
                  <span className="ayur-baseline-dosha-score">{pScores.kapha || 25}%</span>
                </div>
                <div className="ayur-baseline-dosha-track">
                  <div
                    className="ayur-baseline-dosha-fill ayur-baseline-dosha-fill--kapha"
                    style={{ width: `${pScores.kapha || 25}%` }}
                  />
                </div>
                <span className="ayur-baseline-dosha-desc">
                  Anatomical cohesion, mucosal lubrication, physical endurance, stability
                </span>
              </div>
            </div>
          </div>

          {/* 3-Column Lifestyle, Diet & Symptoms Matrix */}
          <div className="ayur-baseline-grid-3">
            {/* Lifestyle & Diurnal Pacing */}
            <div className="ayur-baseline-card">
              <div className="ayur-baseline-card__header">
                <h4 className="ayur-baseline-card__title">
                  <Moon size={16} className="text-secondary" />
                  Lifestyle & Daily Routine
                </h4>
              </div>
              <ul className="ayur-baseline-item-list">
                <li>
                  <span className="ayur-item-label">Sleep Duration:</span>
                  <span className="ayur-item-val">{lifestyle.sleepDuration || '6-7 hours'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Sleep Quality:</span>
                  <span className="ayur-item-val">{lifestyle.sleepQuality || 'Disturbed / Frequent Awakenings'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Activity Level:</span>
                  <span className="ayur-item-val">{lifestyle.activityLevel || 'Sedentary'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Stress Level:</span>
                  <span className="ayur-item-val">{lifestyle.stressLevel || 'High (Mental Strain)'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Circadian Alignment:</span>
                  <span className="ayur-item-val">{lifestyle.circadianAlignment || 'Irregular sleep-wake schedule'}</span>
                </li>
              </ul>
            </div>

            {/* Diet & Digestion Patterns */}
            <div className="ayur-baseline-card">
              <div className="ayur-baseline-card__header">
                <h4 className="ayur-baseline-card__title">
                  <Utensils size={16} className="text-secondary" />
                  Dietary Patterns & Digestion
                </h4>
              </div>
              <ul className="ayur-baseline-item-list">
                <li>
                  <span className="ayur-item-label">Appetite:</span>
                  <span className="ayur-item-val">{diet.appetitePattern || 'Variable / Irregular Digestion'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Meal Frequency:</span>
                  <span className="ayur-item-val">{diet.mealFrequency || '2-3 meals daily'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Daily Hydration:</span>
                  <span className="ayur-item-val">{diet.hydration || '1.8L Daily'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Dominant Tastes:</span>
                  <span className="ayur-item-val">{diet.predominantTaste || 'Pungent, Salty, Bitter'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Digestive Symptoms:</span>
                  <span className="ayur-item-val">{diet.digestionIssues || 'Postprandial bloating, dryness'}</span>
                </li>
              </ul>
            </div>

            {/* Symptoms & Clinical Context */}
            <div className="ayur-baseline-card">
              <div className="ayur-baseline-card__header">
                <h4 className="ayur-baseline-card__title">
                  <HeartPulse size={16} className="text-secondary" />
                  Reported Symptoms & Chronicity
                </h4>
              </div>

              <div className="ayur-baseline-symptom-tags">
                {(symptoms.chiefComplaints || ['Digestive Sluggishness', 'Disturbed Sleep', 'Mild Gas & Bloating']).map(
                  (sym, idx) => (
                    <span key={idx} className="ayur-baseline-symptom-pill">
                      {sym}
                    </span>
                  )
                )}
              </div>

              <ul className="ayur-baseline-item-list">
                <li>
                  <span className="ayur-item-label">Severity Level:</span>
                  <span className="ayur-item-val">{symptoms.severity || 'Moderate'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Chronicity:</span>
                  <span className="ayur-item-val">{symptoms.chronicity || '3 to 6 months'}</span>
                </li>
                <li>
                  <span className="ayur-item-label">Aggravating Factors:</span>
                  <span className="ayur-item-val">{symptoms.aggravatingFactors || 'Cold weather, irregular meals'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contraindications & Clinical Flags */}
          {contraindications.length > 0 && (
            <div className="ayur-baseline-contraindication-banner">
              <AlertTriangle size={18} className="text-warning flex-shrink-0" />
              <div>
                <div className="ayur-baseline-contraindication-title">Reported Medical History & Contraindications</div>
                <p className="ayur-baseline-contraindication-text">
                  {contraindications.join(' • ')}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: ORIGINAL VS CORRECTED COMPARISON TABLE */}
      {viewMode === 'comparison' && (
        <div className="ayur-comparison-wrapper">
          {/* Notice & stats */}
          <div className="ayur-comparison-notice">
            <p className="ayur-comparison-notice-text">
              <strong>Ground-Truth Audit Comparison:</strong> Compare patient-reported intake directly against doctor-verified values. Original entries are preserved indefinitely.
            </p>

            <div className="ayur-comparison-stats-bar">
              <span className="ayur-comparison-stat-chip ayur-comparison-stat-chip--verified">
                {stats.verified} Confirmed
              </span>
              <span className="ayur-comparison-stat-chip ayur-comparison-stat-chip--corrected">
                {stats.corrected} Corrected
              </span>
              <span className="ayur-comparison-stat-chip ayur-comparison-stat-chip--unverified">
                {stats.unverified} Unverified
              </span>

              {onSwitchToVerification && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={onSwitchToVerification}
                  rightIcon={<ArrowRight size={13} />}
                >
                  Edit Verifications
                </Button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="ayur-table-filters mb-xs">
            <div className="ayur-filter-select-wrapper">
              <span className="ayur-filter-label">Filter Category:</span>
              <select
                className="ayur-filter-select"
                value={comparisonCategory}
                onChange={(e) => setComparisonCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="personal">Personal Demographics</option>
                <option value="prakriti">Body Constitution</option>
                <option value="lifestyle">Lifestyle & Routine</option>
                <option value="diet">Diet & Digestion</option>
                <option value="symptoms">Symptoms & Chronicity</option>
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <table className="ayur-comparison-table">
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Clinical Field</th>
                <th style={{ width: '25%' }}>Original Patient Submission</th>
                <th style={{ width: '25%' }}>Doctor-Verified / Corrected</th>
                <th style={{ width: '14%' }}>Status</th>
                <th style={{ width: '18%' }}>Physician Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerifications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-lg text-muted">
                    {isLoadingVerifications
                      ? 'Loading verification comparison data...'
                      : 'No verification entries available for this category.'}
                  </td>
                </tr>
              ) : (
                filteredVerifications.map((item) => {
                  const isCorrected = item.verification_status === 'CORRECTED';
                  const isVerified = item.verification_status === 'VERIFIED';

                  return (
                    <tr key={item.id}>
                      {/* Field */}
                      <td>
                        <strong className="text-primary">{item.field_label || item.field_name}</strong>
                        <div className="text-xs text-muted capitalize">{item.category}</div>
                      </td>

                      {/* Original Value */}
                      <td>
                        <span className="ayur-val-patient">{formatVal(item.patient_value)}</span>
                      </td>

                      {/* Doctor Verified / Corrected */}
                      <td>
                        {isCorrected ? (
                          <span className="ayur-val-corrected">{formatVal(item.verified_value)}</span>
                        ) : isVerified ? (
                          <span className="ayur-val-verified">{formatVal(item.patient_value)}</span>
                        ) : (
                          <span className="text-muted italic">Pending Clinical Review</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        {isCorrected && (
                          <span className="ayur-status-pill ayur-status-pill--info flex items-center gap-xs">
                            <Edit3 size={11} />
                            Corrected
                          </span>
                        )}
                        {isVerified && (
                          <span className="ayur-status-pill ayur-status-pill--success flex items-center gap-xs">
                            <CheckCircle2 size={11} />
                            Verified
                          </span>
                        )}
                        {!isCorrected && !isVerified && (
                          <span className="ayur-status-pill ayur-status-pill--warning flex items-center gap-xs">
                            <Clock size={11} />
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* Notes */}
                      <td>
                        {item.doctor_note ? (
                          <span className="text-xs text-secondary">{item.doctor_note}</span>
                        ) : (
                          <span className="text-muted text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
