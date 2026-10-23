import React, { useState, useEffect } from 'react';
import './PatientMealTracker.css';
import { api } from '../../services/api';
import { PatientDifficultyModal } from '../patient/PatientDifficultyModal';
import {
  Utensils,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Droplets,
  Calendar,
  Flame,
  HeartPulse,
  Sparkles,
  RotateCcw,
  Bell,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui/Button';

export const PatientMealTracker = ({
  onTriggerToast,
  onOpenReminders,
  onMealStatusChanged
}) => {
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isUpdatingMeal, setIsUpdatingMeal] = useState(null);
  const [waterLoading, setWaterLoading] = useState(false);
  const [difficultyModalOpen, setDifficultyModalOpen] = useState(false);
  const [difficultyMealType, setDifficultyMealType] = useState('LUNCH');
  const [expandedSkipMeal, setExpandedSkipMeal] = useState(null);
  const [selectedSkipReason, setSelectedSkipReason] = useState('Lack of appetite (Aruchi)');

  const skipReasonOptions = [
    'Lack of appetite (Aruchi)',
    'Full from previous meal',
    'Heaviness or indigestion',
    'Travelling / Not accessible',
    'Symptom flare-up / Discomfort',
    'Clinician advised modification'
  ];

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const data = await api.getPatientMealSchedule();
      setScheduleData(data);
    } catch (err) {
      console.error('Error fetching meal schedule:', err);
      setFetchError(err.message || 'Could not retrieve today\'s meal schedule from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleToggleMeal = async (mealType, newStatus, extra = {}) => {
    if (isUpdatingMeal) return;

    // Save previous state for rollback
    const previousSchedule = scheduleData;

    try {
      setIsUpdatingMeal(mealType);

      // Optimistically update the UI
      setScheduleData((prev) => {
        if (!prev) return prev;
        const updatedMeals = (prev.meals || []).map((m) => {
          if (m.meal_type === mealType) {
            return {
              ...m,
              status: newStatus,
              skip_reason: extra.skip_reason || (newStatus === 'SKIPPED' ? selectedSkipReason : ''),
              portion_consumed: extra.portion_consumed || (newStatus === 'PARTIALLY_COMPLETED' ? '50%' : newStatus === 'COMPLETED' ? '100%' : '0%')
            };
          }
          return m;
        });

        const completedCount = updatedMeals.filter((m) => m.status === 'COMPLETED').length;
        const partialCount = updatedMeals.filter((m) => m.status === 'PARTIALLY_COMPLETED').length;
        const totalCount = updatedMeals.length;
        const newAdherence = totalCount > 0 ? Math.round(((completedCount + 0.5 * partialCount) / totalCount) * 100) : 0;

        return {
          ...prev,
          meals: updatedMeals,
          progress: {
            ...prev.progress,
            meals_completed: completedCount,
            meals_partially_completed: partialCount,
            adherence_rate: newAdherence,
          }
        };
      });

      const res = await api.logPatientMeal({
        meal_type: mealType,
        status: newStatus,
        portion_consumed: extra.portion_consumed || (newStatus === 'PARTIALLY_COMPLETED' ? '50%' : newStatus === 'COMPLETED' ? '100%' : '0%'),
        skip_reason: extra.skip_reason || (newStatus === 'SKIPPED' ? selectedSkipReason : ''),
        symptom_notes: extra.symptom_notes || '',
      });

      onTriggerToast?.({
        type: newStatus === 'COMPLETED' ? 'success' : newStatus === 'SKIPPED' ? 'warning' : 'info',
        title: newStatus === 'COMPLETED' ? 'Meal Logged' : newStatus === 'SKIPPED' ? 'Meal Skipped' : 'Status Updated',
        message: res.message || `Meal ${mealType} updated to ${newStatus.replace('_', ' ').toLowerCase()}.`,
      });

      setExpandedSkipMeal(null);
      // Notify parent to refresh any linked metrics
      onMealStatusChanged?.();
    } catch (err) {
      // Rollback on failure
      setScheduleData(previousSchedule);
      onTriggerToast?.({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update meal status on server. Please check your network.',
      });
    } finally {
      setIsUpdatingMeal(null);
    }
  };

  const handleAddWater = async (amountMl) => {
    try {
      setWaterLoading(true);
      const res = await api.logPatientWater(amountMl, 'add');
      setScheduleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: {
            ...prev.progress,
            water_intake_ml: res.water_intake_ml,
          },
        };
      });
      onTriggerToast?.({
        type: 'success',
        title: 'Water Logged',
        message: `Added ${amountMl} ml. Today's total: ${res.water_intake_ml} ml.`,
      });
      onMealStatusChanged?.();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Logging Error',
        message: err.message || 'Could not log water intake.',
      });
    } finally {
      setWaterLoading(false);
    }
  };

  const handleResetWater = async () => {
    try {
      setWaterLoading(true);
      const res = await api.logPatientWater(0, 'reset');
      setScheduleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: {
            ...prev.progress,
            water_intake_ml: 0,
          },
        };
      });
      onTriggerToast?.({
        type: 'info',
        title: 'Hydration Reset',
        message: 'Today\'s water intake counter has been reset.',
      });
      onMealStatusChanged?.();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Reset Failed',
        message: err.message || 'Could not reset water intake.',
      });
    } finally {
      setWaterLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ayur-tracker-skeleton-card" aria-busy="true" aria-live="polite">
        <div className="ayur-skeleton-pulse ayur-skel-title" />
        <div className="ayur-skeleton-pulse ayur-skel-banner" />
        <div className="ayur-skeleton-pulse ayur-skel-row" />
        <div className="ayur-skeleton-pulse ayur-skel-row" />
        <div className="ayur-skeleton-pulse ayur-skel-row" />
        <p className="ayur-skeleton-text">Loading today's personalized meal regimen from clinical records...</p>
      </div>
    );
  }

  if (fetchError && !scheduleData) {
    return (
      <div className="ayur-tracker-error-card" role="alert">
        <AlertCircle size={32} className="text-danger" />
        <div className="ayur-error-content">
          <h4 className="ayur-error-title">Unable to Load Meal Schedule</h4>
          <p className="ayur-error-desc">{fetchError}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSchedule}
          leftIcon={<RefreshCw size={14} />}
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  const meals = scheduleData?.meals || [];
  const nextMeal = scheduleData?.next_meal || meals.find((m) => m.status === 'PENDING') || meals[0];
  const progress = scheduleData?.progress || {};
  const isDoctorApproved = scheduleData?.is_doctor_approved;
  const approvedByName = scheduleData?.approved_by_name || 'Dr. Sharma';
  const planVersion = scheduleData?.plan_version || '1.0';

  const waterIntake = progress.water_intake_ml || 0;
  const waterGoal = progress.water_goal_ml || 2500;
  const waterPercent = Math.min(100, Math.round((waterIntake / waterGoal) * 100));

  const mealIcons = {
    BREAKFAST: Flame,
    MID_MORNING: Droplets,
    LUNCH: Utensils,
    EVENING: HeartPulse,
    DINNER: Clock,
  };

  return (
    <div className="ayur-meal-tracker">
      {/* 1. Next Scheduled Meal Spotlight Card */}
      {nextMeal && (
        <div className="ayur-next-meal-spotlight">
          <div className="ayur-next-meal-spotlight__main">
            <div className="ayur-next-meal-badge-row">
              <span className="ayur-next-indicator-pill">
                <span className="ayur-pulse-dot" />
                UPCOMING SCHEDULED MEAL
              </span>
              <span className="ayur-next-time-tag">
                <Clock size={13} />
                {nextMeal.scheduled_time || 'Next in Schedule'}
              </span>
            </div>

            <h3 className="ayur-next-meal-title">
              {nextMeal.label || nextMeal.meal_type}: {nextMeal.meal_name}
            </h3>

            {nextMeal.items && nextMeal.items.length > 0 && (
              <div className="ayur-next-meal-items-chips">
                {nextMeal.items.map((it, idx) => {
                  const label = typeof it === 'string' ? it : `${it?.name || it?.title || 'Item'}${it?.portion ? ` (${it.portion})` : ''}`;
                  return (
                    <span key={idx} className="ayur-item-chip">
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="ayur-next-meal-spotlight__cta">
            {nextMeal.status === 'COMPLETED' ? (
              <div className="ayur-status-pill status-completed">
                <CheckCircle2 size={16} />
                <span>Marked as Eaten</span>
              </div>
            ) : nextMeal.status === 'SKIPPED' ? (
              <div className="ayur-status-pill status-skipped">
                <XCircle size={16} />
                <span>Skipped</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                disabled={isUpdatingMeal === nextMeal.meal_type}
                onClick={() => handleToggleMeal(nextMeal.meal_type, 'COMPLETED')}
                leftIcon={isUpdatingMeal === nextMeal.meal_type ? <RefreshCw size={15} className="ayur-spin" /> : <CheckCircle2 size={16} />}
              >
                {isUpdatingMeal === nextMeal.meal_type ? 'Saving...' : 'Mark Meal Eaten (100%)'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 2. Hydration & Daily Water Counter */}
      <div className="ayur-hydration-card">
        <div className="ayur-hydration-header">
          <div className="flex items-center gap-xs">
            <div className="ayur-hydration-icon-wrap">
              <Droplets size={18} className="text-secondary" />
            </div>
            <div>
              <h4 className="ayur-hydration-title">Daily Hydration Protocol</h4>
              <p className="ayur-hydration-sub">Warm water intake balances digestion and enhances Agni metabolic fire.</p>
            </div>
          </div>
          <div className="ayur-hydration-metric">
            <strong>{waterIntake} ml</strong>
            <span>/ {waterGoal} ml ({waterPercent}%)</span>
          </div>
        </div>

        <div className="ayur-hydration-progress-track">
          <div
            className="ayur-hydration-progress-fill"
            style={{ width: `${waterPercent}%` }}
            role="progressbar"
            aria-valuenow={waterIntake}
            aria-valuemin="0"
            aria-valuemax={waterGoal}
          />
        </div>

        <div className="ayur-hydration-actions-row">
          <button
            type="button"
            className="ayur-water-quick-btn"
            disabled={waterLoading}
            onClick={() => handleAddWater(250)}
          >
            <Plus size={13} />
            <span>+250 ml (1 Warm Cup)</span>
          </button>
          <button
            type="button"
            className="ayur-water-quick-btn"
            disabled={waterLoading}
            onClick={() => handleAddWater(500)}
          >
            <Plus size={13} />
            <span>+500 ml (Bottle)</span>
          </button>
          {waterIntake > 0 && (
            <button
              type="button"
              className="ayur-water-reset-btn"
              disabled={waterLoading}
              onClick={handleResetWater}
              title="Reset today's water counter"
              aria-label="Reset water intake"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Detailed Today's Meal Checklist (5 Scheduled Meals) */}
      <div className="ayur-checklist-card">
        <div className="ayur-checklist-header">
          <div>
            <div className="flex items-center gap-xs">
              <Utensils size={18} className="text-primary" />
              <h3 className="ayur-checklist-title">Today's Meal Checklist</h3>
            </div>
            <p className="ayur-checklist-sub">
              Mark completion after meals. All records persist to your chart for physician monitoring.
            </p>
          </div>

          <div className="ayur-checklist-header-actions">
            <button
              type="button"
              className="ayur-checklist-report-btn"
              onClick={() => {
                setDifficultyMealType('LUNCH');
                setDifficultyModalOpen(true);
              }}
            >
              <AlertTriangle size={14} />
              <span>Report Discomfort / Symptoms</span>
            </button>

            {onOpenReminders && (
              <button
                type="button"
                className="ayur-checklist-remind-btn"
                onClick={onOpenReminders}
                title="Manage meal notification times"
              >
                <Bell size={14} />
                <span>Reminders</span>
              </button>
            )}
          </div>
        </div>

        {/* Doctor Verification Ribbon */}
        <div className="ayur-doctor-ribbon">
          <span className="ayur-ribbon-tag">
            <CheckCircle2 size={13} className="text-success" />
            {isDoctorApproved ? `Clinician Approved Regimen (v${planVersion})` : 'Pending Clinical Verification'}
          </span>
          <span className="ayur-ribbon-doc">
            Attending Lead: <strong>{approvedByName}</strong>
          </span>
        </div>

        {/* Meals Timeline */}
        <div className="ayur-timeline-list" role="list">
          {meals.map((meal) => {
            const Icon = mealIcons[meal.meal_type] || Utensils;
            const isCompleted = meal.status === 'COMPLETED';
            const isPartial = meal.status === 'PARTIALLY_COMPLETED';
            const isSkipped = meal.status === 'SKIPPED';
            const isPending = meal.status === 'PENDING' || meal.status === 'NOT_DONE';
            const isUpdating = isUpdatingMeal === meal.meal_type;
            const isSkipOpen = expandedSkipMeal === meal.meal_type;

            return (
              <div
                key={meal.id || meal.meal_type}
                className={`ayur-timeline-card ${isCompleted ? 'card--completed' : ''} ${isPartial ? 'card--partial' : ''} ${isSkipped ? 'card--skipped' : ''}`}
                role="listitem"
              >
                {/* Time & Icon Column */}
                <div className="ayur-timeline-meta">
                  <div className={`ayur-timeline-icon-wrap ${isCompleted ? 'icon--completed' : ''}`}>
                    <Icon size={18} />
                  </div>
                  <span className="ayur-timeline-time">{meal.scheduled_time || 'Scheduled'}</span>
                  <span className="ayur-timeline-label">{meal.label || meal.meal_type}</span>
                </div>

                {/* Content Column */}
                <div className="ayur-timeline-content">
                  <div className="ayur-timeline-title-row">
                    <h4 className="ayur-timeline-meal-name">{meal.meal_name}</h4>
                    {isCompleted && (
                      <span className="ayur-badge-status badge-success">
                        <CheckCircle2 size={13} /> Eaten (100%)
                      </span>
                    )}
                    {isPartial && (
                      <span className="ayur-badge-status badge-partial">
                        <Clock size={13} /> Partial (50%)
                      </span>
                    )}
                    {isSkipped && (
                      <span className="ayur-badge-status badge-skipped">
                        <XCircle size={13} /> Skipped {meal.skip_reason ? `(${meal.skip_reason})` : ''}
                      </span>
                    )}
                    {isPending && (
                      <span className="ayur-badge-status badge-pending">
                        <Clock size={13} /> Scheduled
                      </span>
                    )}
                  </div>

                  {/* Food items & Portion Breakdown */}
                  {meal.items && meal.items.length > 0 && (
                    <ul className="ayur-timeline-items-list">
                      {meal.items.map((it, idx) => {
                        const itemText = typeof it === 'string' ? it : `${it?.name || it?.title || 'Food item'}${it?.portion ? ` • ${it.portion}` : ''}`;
                        return (
                          <li key={idx} className="ayur-timeline-item-bullet">
                            <span className="bullet-dot">•</span>
                            <span>{itemText}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Action Controls per Meal */}
                  <div className="ayur-timeline-actions">
                    <button
                      type="button"
                      className={`ayur-action-btn ayur-btn-done ${isCompleted ? 'btn-active' : ''}`}
                      disabled={isUpdating}
                      onClick={() => handleToggleMeal(meal.meal_type, 'COMPLETED')}
                      title="Mark meal 100% completed"
                    >
                      <CheckCircle2 size={14} />
                      <span>{isCompleted ? 'Eaten ✓' : 'Mark Eaten'}</span>
                    </button>

                    <button
                      type="button"
                      className={`ayur-action-btn ayur-btn-partial ${isPartial ? 'btn-active' : ''}`}
                      disabled={isUpdating}
                      onClick={() => handleToggleMeal(meal.meal_type, 'PARTIALLY_COMPLETED', { portion_consumed: '50%' })}
                      title="Mark meal partially consumed (50%)"
                    >
                      <span>½ Partial (50%)</span>
                    </button>

                    <button
                      type="button"
                      className={`ayur-action-btn ayur-btn-skip ${isSkipped ? 'btn-active' : ''}`}
                      disabled={isUpdating}
                      onClick={() => setExpandedSkipMeal(isSkipOpen ? null : meal.meal_type)}
                      title="Report meal as skipped"
                    >
                      <XCircle size={14} />
                      <span>{isSkipped ? 'Skipped' : 'Skip Meal'}</span>
                      <ChevronDown size={13} className={`ayur-caret ${isSkipOpen ? 'caret-up' : ''}`} />
                    </button>

                    {(isCompleted || isPartial || isSkipped) && (
                      <button
                        type="button"
                        className="ayur-action-btn ayur-btn-reset"
                        disabled={isUpdating}
                        onClick={() => handleToggleMeal(meal.meal_type, 'PENDING')}
                        title="Reset this meal back to scheduled"
                      >
                        <RotateCcw size={12} />
                        <span>Reset</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="ayur-action-btn ayur-btn-discomfort"
                      onClick={() => {
                        setDifficultyMealType(meal.meal_type);
                        setDifficultyModalOpen(true);
                      }}
                      title="Report digestive discomfort or food issue with this meal"
                    >
                      <AlertTriangle size={12} />
                      <span>Report Discomfort</span>
                    </button>
                  </div>

                  {/* Inline Skip Reason Selector */}
                  {isSkipOpen && (
                    <div className="ayur-skip-reason-box">
                      <span className="ayur-skip-reason-label">Select reason for skipping {meal.label}:</span>
                      <div className="ayur-skip-chips">
                        {skipReasonOptions.map((reason, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            className={`ayur-skip-chip ${selectedSkipReason === reason ? 'chip-selected' : ''}`}
                            onClick={() => setSelectedSkipReason(reason)}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                      <div className="ayur-skip-confirm-row">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleToggleMeal(meal.meal_type, 'SKIPPED', { skip_reason: selectedSkipReason })}
                        >
                          Confirm Skip Record
                        </Button>
                        <button
                          type="button"
                          className="ayur-skip-cancel-link"
                          onClick={() => setExpandedSkipMeal(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Patient Difficulty / Symptom Report Modal */}
      <PatientDifficultyModal
        isOpen={difficultyModalOpen}
        onClose={() => setDifficultyModalOpen(false)}
        defaultMealType={difficultyMealType}
        onSuccess={() => {
          fetchSchedule();
          onMealStatusChanged?.();
        }}
        onTriggerToast={onTriggerToast}
      />
    </div>
  );
};
