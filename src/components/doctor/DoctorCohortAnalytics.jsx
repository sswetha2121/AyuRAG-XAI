import React, { useMemo } from 'react';
import './DoctorCohortAnalytics.css';
import {
  PieChart,
  ShieldCheck,
  BrainCircuit,
  Activity,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const DoctorCohortAnalytics = ({
  patients = [],
  metrics = {},
  isLoading = false
}) => {
  // Aggregate real Prakriti distribution from actual recent_patients
  const prakritiStats = useMemo(() => {
    if (!patients || patients.length === 0) {
      return {
        vata: { count: 0, pct: 0, label: 'Vāta Dominant', color: '#8FA396' },
        pitta: { count: 0, pct: 0, label: 'Pitta Dominant', color: '#C5A059' },
        kapha: { count: 0, pct: 0, label: 'Kapha Dominant', color: '#123B2F' },
        dual: { count: 0, pct: 0, label: 'Dual / Balanced', color: '#52796F' },
        total: 0
      };
    }

    let vataCount = 0;
    let pittaCount = 0;
    let kaphaCount = 0;
    let dualCount = 0;

    patients.forEach((p) => {
      const prak = (p.primary_prakriti || '').toLowerCase();
      if (prak.includes('dual') || prak.includes('balanced') || prak.includes('tri')) {
        dualCount++;
      } else if (prak.includes('vata') && prak.includes('pitta')) {
        dualCount++;
      } else if (prak.includes('vata') && prak.includes('kapha')) {
        dualCount++;
      } else if (prak.includes('pitta') && prak.includes('kapha')) {
        dualCount++;
      } else if (prak.includes('vata') || prak.includes('movement')) {
        vataCount++;
      } else if (prak.includes('pitta') || prak.includes('metabolism')) {
        pittaCount++;
      } else if (prak.includes('kapha') || prak.includes('structure')) {
        kaphaCount++;
      } else {
        dualCount++;
      }
    });

    const total = patients.length;
    return {
      vata: {
        count: vataCount,
        pct: total ? Math.round((vataCount / total) * 100) : 0,
        label: 'Vāta Dominant',
        color: '#8FA396'
      },
      pitta: {
        count: pittaCount,
        pct: total ? Math.round((pittaCount / total) * 100) : 0,
        label: 'Pitta Dominant',
        color: '#C5A059'
      },
      kapha: {
        count: kaphaCount,
        pct: total ? Math.round((kaphaCount / total) * 100) : 0,
        label: 'Kapha Dominant',
        color: '#123B2F'
      },
      dual: {
        count: dualCount,
        pct: total ? Math.round((dualCount / total) * 100) : 0,
        label: 'Dual / Tridoshic',
        color: '#52796F'
      },
      total
    };
  }, [patients]);

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate SVG stroke dashes
  const slices = useMemo(() => {
    const list = [
      { key: 'vata', ...prakritiStats.vata },
      { key: 'pitta', ...prakritiStats.pitta },
      { key: 'kapha', ...prakritiStats.kapha },
      { key: 'dual', ...prakritiStats.dual },
    ].filter((s) => s.count > 0);

    let currentOffset = 0;
    return list.map((slice) => {
      const sliceLength = (slice.pct / 100) * circumference;
      const strokeDasharray = `${sliceLength} ${circumference - sliceLength}`;
      const strokeDashoffset = -currentOffset;
      currentOffset += sliceLength;
      return {
        ...slice,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, [prakritiStats, circumference]);

  const verifiedAssessments = Math.max(0, (metrics.completed_assessments || 0) - (metrics.unverified_assessments || 0));
  const verificationRate = metrics.completed_assessments
    ? Math.round((verifiedAssessments / metrics.completed_assessments) * 100)
    : 100;

  const planActivationRate = metrics.total_patients
    ? Math.min(100, Math.round(((metrics.active_diet_plans || 0) / metrics.total_patients) * 100))
    : 0;

  if (isLoading) {
    return (
      <div className="ayur-analytics-row ayur-analytics-skeleton">
        <div className="ayur-analytics-skeleton-card" />
        <div className="ayur-analytics-skeleton-card" />
      </div>
    );
  }

  return (
    <div className="ayur-analytics-row">
      {/* 1. Prakriti Cohort Distribution (Real Data Donut) */}
      <div className="ayur-analytics-card">
        <div className="ayur-analytics-card__header">
          <div className="flex items-center gap-xs">
            <div className="ayur-analytics-icon-badge">
              <PieChart size={16} />
            </div>
            <div>
              <h3 className="ayur-analytics-card__title">Cohort Constitutional Profiles</h3>
              <p className="ayur-analytics-card__subtitle">Prakriti distribution across {prakritiStats.total} evaluated patients</p>
            </div>
          </div>
          <span className="ayur-ai-grounded-pill">
            <Sparkles size={12} />
            ML Inferred
          </span>
        </div>

        <div className="ayur-prakriti-chart-wrap">
          {/* SVG Donut */}
          <div className="ayur-prakriti-donut-container">
            <svg className="ayur-prakriti-donut-svg" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="ayur-donut-bg-track"
              />
              {slices.map((slice) => (
                <circle
                  key={slice.key}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="14"
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="ayur-donut-segment"
                />
              ))}
            </svg>
            <div className="ayur-donut-center-metric">
              <span className="ayur-donut-metric-val">{prakritiStats.total}</span>
              <span className="ayur-donut-metric-lbl">Cohorts</span>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="ayur-prakriti-legend">
            {[
              { ...prakritiStats.vata, key: 'vata' },
              { ...prakritiStats.pitta, key: 'pitta' },
              { ...prakritiStats.kapha, key: 'kapha' },
              { ...prakritiStats.dual, key: 'dual' },
            ].map((item) => (
              <div key={item.key} className="ayur-legend-item">
                <div className="flex items-center gap-xs">
                  <span className="ayur-legend-dot" style={{ backgroundColor: item.color }} />
                  <span className="ayur-legend-label">{item.label}</span>
                </div>
                <div className="flex items-center gap-xs">
                  <span className="ayur-legend-count">{item.count} pts</span>
                  <span className="ayur-legend-pct">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Clinical Verification & Regimen Quality Indicators */}
      <div className="ayur-analytics-card">
        <div className="ayur-analytics-card__header">
          <div className="flex items-center gap-xs">
            <div className="ayur-analytics-icon-badge ayur-analytics-icon-badge--gold">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 className="ayur-analytics-card__title">Clinical Assurance & Regimen Health</h3>
              <p className="ayur-analytics-card__subtitle">Physician verification rate and published protocol coverage</p>
            </div>
          </div>
          <span className="ayur-health-pill">
            <Activity size={12} />
            Live Telemetry
          </span>
        </div>

        <div className="ayur-health-bars-grid">
          {/* Bar 1: Assessment Verification Rate */}
          <div className="ayur-health-bar-item">
            <div className="ayur-hbar-header">
              <div className="flex items-center gap-xs">
                <CheckCircle2 size={14} className="text-success" />
                <span className="ayur-hbar-title">Clinical Verification Rate</span>
              </div>
              <span className="ayur-hbar-value">{verificationRate}%</span>
            </div>
            <div className="ayur-hbar-track">
              <div
                className="ayur-hbar-fill ayur-hbar-fill--success"
                style={{ width: `${verificationRate}%` }}
              />
            </div>
            <p className="ayur-hbar-caption">
              {verifiedAssessments} of {metrics.completed_assessments || 0} completed intake assessments physician-verified
            </p>
          </div>

          {/* Bar 2: Active Diet Regimen Coverage */}
          <div className="ayur-health-bar-item">
            <div className="ayur-hbar-header">
              <div className="flex items-center gap-xs">
                <FileCheck size={14} className="text-secondary" />
                <span className="ayur-hbar-title">Diet Regimen Activation Coverage</span>
              </div>
              <span className="ayur-hbar-value">{planActivationRate}%</span>
            </div>
            <div className="ayur-hbar-track">
              <div
                className="ayur-hbar-fill ayur-hbar-fill--forest"
                style={{ width: `${planActivationRate}%` }}
              />
            </div>
            <p className="ayur-hbar-caption">
              {metrics.active_diet_plans || 0} active doctor-approved diet plans across {metrics.total_patients || 0} cohort patients
            </p>
          </div>

          {/* Knowledge Base Grounding Summary Pill */}
          <div className="ayur-rag-assurance-strip">
            <div className="flex items-center gap-xs">
              <BrainCircuit size={15} className="text-primary shrink-0" />
              <span className="ayur-rag-strip-text">
                RAG Clinical Indices: <strong>CCRAS Guidelines, IFCT 2017 & Charaka Saṃhitā</strong> synchronized and active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
