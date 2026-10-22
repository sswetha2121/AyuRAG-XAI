import React, { useState, useEffect } from 'react';
import './DoctorMonitoringView.css';
import { api } from '../../services/api';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Filter,
  MessageSquare,
  ShieldCheck,
  Utensils,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  RefreshCw,
  Send
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorMonitoringView = ({ onNavigateToPatient, onOpenDietPlan, onTriggerToast }) => {
  const [monitoringData, setMonitoringData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [adherenceFilter, setAdherenceFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [reviewingReportId, setReviewingReportId] = useState(null);
  const [doctorReviewNote, setDoctorReviewNote] = useState({});

  const fetchMonitoring = async () => {
    try {
      setIsRefreshing(true);
      const params = {};
      if (adherenceFilter !== 'ALL') params.adherence_status = adherenceFilter;
      if (difficultyFilter === 'WITH_DIFFICULTIES') params.has_difficulties = 'true';

      const data = await api.getDoctorMonitoring(params);
      setMonitoringData(data);
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Monitoring Sync Failed',
        message: err.message || 'Could not load patient monitoring records.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, [adherenceFilter, difficultyFilter]);

  const handleReviewDifficulty = async (reportId) => {
    try {
      setReviewingReportId(reportId);
      const note = doctorReviewNote[reportId] || 'Acknowledged and reviewed by attending physician.';
      await api.reviewDifficultyReport(reportId, note);
      onTriggerToast?.({
        type: 'success',
        title: 'Report Reviewed',
        message: 'Patient-reported difficulty marked as reviewed with your clinical note.',
      });
      fetchMonitoring();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Review Action Failed',
        message: err.message || 'Could not review difficulty report.',
      });
    } finally {
      setReviewingReportId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="ayur-monitoring-loading">
        <div className="ayur-spinner-mini" />
        <span>Loading clinical monitoring & adherence telemetry...</span>
      </div>
    );
  }

  const summary = monitoringData?.summary || {
    total_assigned_patients: 0,
    patients_with_active_plans: 0,
    today_meals_completed: 0,
    today_meals_partially_completed: 0,
    today_meals_skipped: 0,
    unreviewed_difficulties: 0,
  };

  const patientRecords = monitoringData?.patient_monitoring || [];

  return (
    <div className="ayur-monitoring-container">
      {/* 1. Header & Sync Bar */}
      <div className="ayur-mon-header">
        <div>
          <div className="flex items-center gap-xs mb-xs">
            <span className="ayur-mon-pill">PHASE 5 CLINICAL MONITORING</span>
            <span className="ayur-mon-pill ayur-mon-pill--live">LIVE ADHERENCE TELEMETRY</span>
          </div>
          <h2 className="ayur-mon-title">Patient Diet Monitoring & Adherence Telemetry</h2>
          <p className="ayur-mon-desc">
            Real-time observational tracking of meal completions, skipped reasons, symptom difficulties, and 7-day adherence trends.
          </p>
        </div>

        <button
          type="button"
          className="ayur-mon-refresh-btn"
          onClick={fetchMonitoring}
          disabled={isRefreshing}
          title="Sync live patient records"
        >
          <RefreshCw size={14} className={isRefreshing ? 'ayur-spin' : ''} />
          <span>Sync Telemetry</span>
        </button>
      </div>

      {/* 2. Non-Curative Regulatory Disclaimer */}
      <div className="ayur-mon-disclaimer-card">
        <AlertCircle size={18} className="text-accent flex-shrink-0" />
        <span>
          <strong>Clinical Caution & Guardrails:</strong> Self-reported adherence and checklist completion
          represent observational patient habit compliance. They do not constitute objective proof of clinical improvement,
          biochemical cure, or disease resolution. Meals prior to their scheduled time window are categorized as "Pending",
          not "Missed".
        </span>
      </div>

      {/* 3. Summary Metric Cards */}
      <div className="ayur-mon-summary-grid">
        <div className="ayur-mon-stat-card">
          <div className="ayur-mstat-top">
            <span className="ayur-mstat-label">Assigned Patients Monitored</span>
            <Activity size={16} className="text-primary" />
          </div>
          <div className="ayur-mstat-val">{summary.total_assigned_patients}</div>
          <div className="ayur-mstat-sub">
            {summary.patients_with_active_plans} with published active diet plans
          </div>
        </div>

        <div className="ayur-mon-stat-card">
          <div className="ayur-mstat-top">
            <span className="ayur-mstat-label">Today's Meal Completions</span>
            <CheckCircle2 size={16} className="text-success" />
          </div>
          <div className="ayur-mstat-val text-success">
            {summary.today_meals_completed}
            <span className="text-xs text-muted font-normal ml-xs">
              (+{summary.today_meals_partially_completed} partial)
            </span>
          </div>
          <div className="ayur-mstat-sub">
            {summary.today_meals_skipped} skipped today across cohort
          </div>
        </div>

        <div className="ayur-mon-stat-card">
          <div className="ayur-mstat-top">
            <span className="ayur-mstat-label">Active Symptoms / Difficulties</span>
            <AlertTriangle size={16} className="text-warning" />
          </div>
          <div className={`ayur-mstat-val ${summary.unreviewed_difficulties > 0 ? 'text-warning' : 'text-primary'}`}>
            {summary.unreviewed_difficulties}
          </div>
          <div className="ayur-mstat-sub">
            {summary.unreviewed_difficulties > 0 ? 'Requires clinician review & notes' : 'All reports verified'}
          </div>
        </div>
      </div>

      {/* 4. Filter Controls */}
      <div className="ayur-mon-filter-bar">
        <div className="flex items-center gap-xs text-xs font-semibold uppercase text-muted">
          <Filter size={14} />
          <span>Cohort Filters:</span>
        </div>

        <div className="flex items-center gap-xs flex-wrap">
          <button
            type="button"
            className={`ayur-mfilter-chip ${adherenceFilter === 'ALL' ? 'ayur-mfilter-chip--active' : ''}`}
            onClick={() => setAdherenceFilter('ALL')}
          >
            All Adherence ({patientRecords.length})
          </button>
          <button
            type="button"
            className={`ayur-mfilter-chip ${adherenceFilter === 'GOOD' ? 'ayur-mfilter-chip--active' : ''}`}
            onClick={() => setAdherenceFilter('GOOD')}
          >
            High Adherence (≥ 70%)
          </button>
          <button
            type="button"
            className={`ayur-mfilter-chip ${adherenceFilter === 'LOW' ? 'ayur-mfilter-chip--active' : ''}`}
            onClick={() => setAdherenceFilter('LOW')}
          >
            Needs Attention (&lt; 70%)
          </button>
          <button
            type="button"
            className={`ayur-mfilter-chip ${difficultyFilter === 'WITH_DIFFICULTIES' ? 'ayur-mfilter-chip--active' : ''}`}
            onClick={() =>
              setDifficultyFilter(difficultyFilter === 'WITH_DIFFICULTIES' ? 'ALL' : 'WITH_DIFFICULTIES')
            }
          >
            Reports Difficulties Only
          </button>
        </div>
      </div>

      {/* 5. Patient Monitoring Records List */}
      <div className="ayur-mon-patients-stack">
        {patientRecords.length === 0 ? (
          <div className="ayur-mon-empty">
            <Info size={24} className="text-muted" />
            <span>No patient records matching your active monitoring filters.</span>
          </div>
        ) : (
          patientRecords.map((pt) => {
            const plan = pt.active_plan;
            const today = pt.today_summary || {};
            const trend = pt.weekly_adherence_trend || [];
            const difficulties = pt.recent_difficulty_reports || [];

            return (
              <div key={pt.patient_id} className="ayur-mon-patient-card">
                {/* Patient Banner */}
                <div className="ayur-mpat-header">
                  <div className="ayur-mpat-header__left">
                    <div className="ayur-mpat-avatar">
                      {(pt.patient_name || 'PT')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-xs flex-wrap">
                        <h3 className="ayur-mpat-name">{pt.patient_name}</h3>
                        <span className="ayur-mpat-id">ID: {pt.formatted_patient_id || `AYU-${String(pt.patient_id).padStart(4, '0')}`}</span>
                        <span className="ayur-mpat-constitution">{pt.constitution || 'Movement & Metabolism'}</span>
                      </div>
                      <div className="ayur-mpat-meta">
                        <span>Age: {pt.age} yrs</span> • <span>Gender: {pt.gender}</span> •{' '}
                        <span>Last Telemetry Activity: {pt.last_activity ? new Date(pt.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ayur-mpat-header__right">
                    <div className="ayur-adherence-badge-wrap">
                      <span className="text-micro text-muted font-bold uppercase">7-Day Adherence</span>
                      <span className={`ayur-adherence-rate ${pt.weekly_average_adherence >= 70 ? 'text-success' : 'text-warning'}`}>
                        {pt.weekly_average_adherence || 0}%
                      </span>
                    </div>

                    <div className="flex items-center gap-xs">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onNavigateToPatient?.(pt.patient_id)}
                      >
                        Clinical Chart
                      </Button>
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => onOpenDietPlan?.(pt.patient_id) || (window.location.href = '/doctor/diet-plans')}
                        leftIcon={<Utensils size={13} />}
                      >
                        Diet Plan
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Plan Metadata */}
                <div className="ayur-mpat-plan-strip">
                  {plan ? (
                    <div className="flex items-center justify-between flex-wrap gap-xs w-full">
                      <div className="flex items-center gap-xs">
                        <span className="ayur-mplan-chip">ACTIVE PROTOCOL v{plan.version}</span>
                        <span className="text-xs font-semibold text-text-primary">{plan.title}</span>
                      </div>
                      <span className="text-xs text-muted">
                        Published on {new Date(plan.effective_date || plan.published_at).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted italic">
                      No published diet plan active. (Draft creation pending)
                    </div>
                  )}
                </div>

                {/* Today's Meals Breakdown */}
                <div className="ayur-mpat-meals-grid">
                  <div className="ayur-mmeal-slot">
                    <span className="ayur-mslot-label">Breakfast</span>
                    <span className={`ayur-mslot-pill ayur-mslot-pill--${(today.breakfast?.status || 'pending').toLowerCase()}`}>
                      {today.breakfast?.status === 'COMPLETED'
                        ? '✓ Completed'
                        : today.breakfast?.status === 'PARTIALLY_COMPLETED'
                        ? '◑ Partial'
                        : today.breakfast?.status === 'SKIPPED'
                        ? '✕ Skipped'
                        : '○ Pending'}
                    </span>
                    {today.breakfast?.skip_reason && (
                      <span className="ayur-mslot-reason" title={today.breakfast.skip_reason}>
                        Reason: {today.breakfast.skip_reason}
                      </span>
                    )}
                  </div>

                  <div className="ayur-mmeal-slot">
                    <span className="ayur-mslot-label">Lunch (Main)</span>
                    <span className={`ayur-mslot-pill ayur-mslot-pill--${(today.lunch?.status || 'pending').toLowerCase()}`}>
                      {today.lunch?.status === 'COMPLETED'
                        ? '✓ Completed'
                        : today.lunch?.status === 'PARTIALLY_COMPLETED'
                        ? '◑ Partial'
                        : today.lunch?.status === 'SKIPPED'
                        ? '✕ Skipped'
                        : '○ Pending'}
                    </span>
                    {today.lunch?.skip_reason && (
                      <span className="ayur-mslot-reason" title={today.lunch.skip_reason}>
                        Reason: {today.lunch.skip_reason}
                      </span>
                    )}
                  </div>

                  <div className="ayur-mmeal-slot">
                    <span className="ayur-mslot-label">Dinner (Light)</span>
                    <span className={`ayur-mslot-pill ayur-mslot-pill--${(today.dinner?.status || 'pending').toLowerCase()}`}>
                      {today.dinner?.status === 'COMPLETED'
                        ? '✓ Completed'
                        : today.dinner?.status === 'PARTIALLY_COMPLETED'
                        ? '◑ Partial'
                        : today.dinner?.status === 'SKIPPED'
                        ? '✕ Skipped'
                        : '○ Pending'}
                    </span>
                    {today.dinner?.skip_reason && (
                      <span className="ayur-mslot-reason" title={today.dinner.skip_reason}>
                        Reason: {today.dinner.skip_reason}
                      </span>
                    )}
                  </div>

                  <div className="ayur-mmeal-slot">
                    <span className="ayur-mslot-label">Water Intake</span>
                    <span className="font-semibold text-xs text-primary">
                      {today.water_intake_ml || 0} / 2500 ml
                    </span>
                  </div>
                </div>

                {/* 7-Day Adherence Visual Trend */}
                {trend.length > 0 && (
                  <div className="ayur-mpat-trend-section">
                    <span className="text-micro font-bold text-muted uppercase block mb-xs">
                      Past 7 Days Adherence Progression:
                    </span>
                    <div className="ayur-trend-bars-row">
                      {trend.map((day, dIdx) => (
                        <div key={dIdx} className="ayur-trend-col">
                          <div className="ayur-tbar-wrap">
                            <div
                              className={`ayur-tbar-fill ${day.adherence_rate >= 70 ? 'ayur-tbar-fill--green' : 'ayur-tbar-fill--amber'}`}
                              style={{ height: `${Math.max(10, day.adherence_rate)}%` }}
                              title={`${day.date}: ${day.adherence_rate}% adherence`}
                            />
                          </div>
                          <span className="ayur-tbar-day">
                            {new Date(day.date).toLocaleDateString([], { weekday: 'narrow' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patient-Reported Difficulty & Symptoms (Phase 5 requirement) */}
                {difficulties.length > 0 && (
                  <div className="ayur-mpat-difficulties-card">
                    <div className="flex items-center gap-xs mb-xs">
                      <AlertTriangle size={15} className="text-warning" />
                      <span className="text-xs font-bold text-text-primary">
                        Patient-Reported Dietary Difficulties & Symptoms:
                      </span>
                    </div>

                    <div className="flex flex-col gap-xs">
                      {difficulties.map((diff) => {
                        const isReviewed = diff.is_reviewed;
                        return (
                          <div
                            key={diff.id}
                            className={`ayur-diff-item ${isReviewed ? 'ayur-diff-item--reviewed' : 'ayur-diff-item--unreviewed'}`}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-xs">
                              <div className="flex items-center gap-xs">
                                <span className={`ayur-severity-badge ayur-severity-badge--${(diff.severity || 'mild').toLowerCase()}`}>
                                  {diff.severity} SEVERITY
                                </span>
                                <span className="font-semibold text-xs">
                                  {diff.meal_type ? `Meal: ${diff.meal_type}` : 'General Digestion'}
                                </span>
                              </div>
                              <span className="text-micro text-muted">
                                {new Date(diff.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>

                            <p className="ayur-diff-symptoms">
                              <strong>Symptoms:</strong> {diff.symptoms}
                            </p>
                            {diff.notes && (
                              <p className="ayur-diff-notes">
                                <strong>Patient Notes:</strong> {diff.notes}
                              </p>
                            )}

                            {isReviewed ? (
                              <div className="ayur-diff-reviewed-stamp">
                                ✓ Reviewed by {diff.reviewed_by_name || 'Physician'} with note: "{diff.doctor_notes || 'Reviewed'}"
                              </div>
                            ) : (
                              <div className="ayur-diff-review-action">
                                <input
                                  type="text"
                                  className="ayur-diff-note-input"
                                  placeholder="Enter clinical review / adjustment note..."
                                  value={doctorReviewNote[diff.id] || ''}
                                  onChange={(e) =>
                                    setDoctorReviewNote({ ...doctorReviewNote, [diff.id]: e.target.value })
                                  }
                                />
                                <Button
                                  variant="primary"
                                  size="xs"
                                  onClick={() => handleReviewDifficulty(diff.id)}
                                  disabled={reviewingReportId === diff.id}
                                >
                                  {reviewingReportId === diff.id ? 'Marking...' : 'Mark Reviewed'}
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
