import React, { useState, useEffect } from 'react';
import './PatientMealTracker.css';
import { api } from '../../services/api';
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
  ChevronRight,
  RotateCcw,
  Bell
} from 'lucide-react';
import { Button } from '../ui/Button';

export const PatientMealTracker = ({ onTriggerToast, onOpenReminders }) => {
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingMeal, setIsUpdatingMeal] = useState(null);
  const [waterLoading, setWaterLoading] = useState(false);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const data = await api.getPatientMealSchedule();
      setScheduleData(data);
    } catch (err) {
      console.error('Error fetching meal schedule:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleToggleMeal = async (mealType, newStatus) => {
    try {
      setIsUpdatingMeal(mealType);
      const res = await api.logPatientMeal({
        meal_type: mealType,
        status: newStatus,
      });

      onTriggerToast?.({
        type: newStatus === 'COMPLETED' ? 'success' : 'info',
        title: newStatus === 'COMPLETED' ? 'Meal Logged' : 'Status Updated',
        message: res.message || `Meal status changed to ${newStatus.toLowerCase()}.`,
      });

      // Refresh schedule
      await fetchSchedule();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update meal status.',
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
        message: `Added ${amountMl} ml of water. Total today: ${res.water_intake_ml} ml.`,
      });
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Error',
        message: err.message || 'Could not log water.',
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
    } catch (err) {
      // ignore
    } finally {
      setWaterLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ayur-tracker-loading">
        <div className="ayur-spinner-mini" />
        <span>Loading today's personalized meal schedule & reminders...</span>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="ayur-tracker-empty">
        <AlertCircle size={28} className="text-muted" />
        <p>No meal schedule found for today. Please submit or review your assessment.</p>
      </div>
    );
  }

  const {
    date,
    meals = [],
    next_meal,
    progress = {},
    is_doctor_approved,
    approved_by_name,
    plan_title,
    plan_version
  } = scheduleData;

  const totalMeals = meals.length;
  const completedMeals = progress.meals_completed || 0;
  const adherencePercent = progress.adherence_rate || (totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0);
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
      {/* 1. Next Meal Spotlight Alert */}
      {next_meal && (
        <div className="ayur-next-meal-banner">
          <div className="ayur-next-meal-left">
            <div className="ayur-next-meal-badge">
              <Clock size={14} />
              <span>NEXT SCHEDULED MEAL</span>
            </div>
            <h3 className="ayur-next-meal-title">
              {next_meal.label} • {next_meal.scheduled_time}
            </h3>
            <p className="ayur-next-meal-desc">
              <strong>What to eat:</strong> {next_meal.meal_name}
            </p>
            {next_meal.items && next_meal.items.length > 0 && (
              <div className="ayur-next-meal-items">
                {next_meal.items.slice(0, 2).map((item, idx) => (
                  <span key={idx} className="ayur-next-item-chip">
                    • {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="ayur-next-meal-actions">
            {next_meal.status === 'COMPLETED' ? (
              <div className="ayur-meal-completed-pill">
                <CheckCircle2 size={18} />
                <span>Eaten & Logged</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => handleToggleMeal(next_meal.meal_type, 'COMPLETED')}
                loading={isUpdatingMeal === next_meal.meal_type}
                leftIcon={<CheckCircle2 size={16} />}
              >
                Mark as Eaten
              </Button>
            )}
            {onOpenReminders && (
              <button
                type="button"
                className="ayur-tracker-reminder-btn"
                onClick={onOpenReminders}
                title="Configure Meal Reminders"
              >
                <Bell size={14} />
                <span>Reminders</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Daily Summary Grid (Completion Rate & Water Intake) */}
      <div className="ayur-tracker-metrics-grid">
        {/* Meal Completion Rate */}
        <div className="ayur-metric-card">
          <div className="ayur-metric-card__header">
            <span className="ayur-metric-title">Today's Meal Completion</span>
            <span className="ayur-metric-badge">{completedMeals} of {totalMeals} Meals</span>
          </div>
          <div className="ayur-metric-progress-wrap">
            <div className="ayur-metric-progress-bar">
              <div
                className="ayur-metric-progress-fill"
                style={{ width: `${adherencePercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-muted mt-xs">
              <span>{adherencePercent}% Adherence</span>
              <span>{totalMeals - completedMeals} meals remaining</span>
            </div>
          </div>
        </div>

        {/* Water Intake Tracker */}
        <div className="ayur-metric-card">
          <div className="ayur-metric-card__header">
            <span className="ayur-metric-title">Daily Hydration</span>
            <span className="ayur-metric-badge">{waterIntake} / {waterGoal} ml</span>
          </div>
          <div className="ayur-metric-progress-wrap">
            <div className="ayur-metric-progress-bar ayur-water-progress-bar">
              <div
                className="ayur-water-progress-fill"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <div className="ayur-water-actions">
              <button
                type="button"
                className="ayur-water-add-btn"
                onClick={() => handleAddWater(250)}
                disabled={waterLoading}
              >
                +250 ml (1 Cup)
              </button>
              <button
                type="button"
                className="ayur-water-add-btn"
                onClick={() => handleAddWater(500)}
                disabled={waterLoading}
              >
                +500 ml (Bottle)
              </button>
              {waterIntake > 0 && (
                <button
                  type="button"
                  className="ayur-water-reset-btn"
                  onClick={handleResetWater}
                  disabled={waterLoading}
                  title="Reset today's water"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Today's Meal Timeline */}
      <div className="ayur-tracker-schedule-section">
        <div className="ayur-tracker-section-header">
          <div>
            <h3 className="ayur-tracker-heading">Today's Meal Schedule</h3>
            <p className="ayur-tracker-subheading">
              Track what to eat and mark meals as completed throughout your day
            </p>
          </div>
          <div className="ayur-plan-origin-pill">
            {is_doctor_approved ? (
              <span className="text-success font-semibold flex items-center gap-xs">
                <CheckCircle2 size={14} /> Doctor Approved Plan (v{plan_version})
              </span>
            ) : (
              <span className="text-muted flex items-center gap-xs">
                <Clock size={14} /> Clinical Review in Progress
              </span>
            )}
          </div>
        </div>

        <div className="ayur-tracker-meals-list">
          {meals.map((meal) => {
            const Icon = mealIcons[meal.meal_type] || Utensils;
            const isCompleted = meal.status === 'COMPLETED';
            const isSkipped = meal.status === 'SKIPPED';
            const isPending = meal.status === 'PENDING';
            const isUpdating = isUpdatingMeal === meal.meal_type;

            return (
              <div
                key={meal.id || meal.meal_type}
                className={`ayur-meal-timeline-card ${isCompleted ? 'ayur-meal--completed' : ''} ${isSkipped ? 'ayur-meal--skipped' : ''}`}
              >
                {/* Left Time Column */}
                <div className="ayur-meal-time-col">
                  <div className="ayur-meal-time-badge">
                    <Icon size={16} />
                  </div>
                  <span className="ayur-meal-scheduled-time">{meal.scheduled_time}</span>
                  <span className="ayur-meal-type-label">{meal.label}</span>
                </div>

                {/* Center Content Column */}
                <div className="ayur-meal-content-col">
                  <div className="flex items-center gap-sm flex-wrap">
                    <h4 className="ayur-meal-card-title">{meal.meal_name}</h4>
                    {isCompleted && (
                      <span className="ayur-meal-status-pill status-completed">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    )}
                    {isSkipped && (
                      <span className="ayur-meal-status-pill status-skipped">
                        <XCircle size={13} /> Skipped
                      </span>
                    )}
                    {isPending && (
                      <span className="ayur-meal-status-pill status-pending">
                        <Clock size={13} /> Scheduled
                      </span>
                    )}
                  </div>

                  {meal.items && meal.items.length > 0 && (
                    <ul className="ayur-meal-items-bullet-list">
                      {meal.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Right Action Column */}
                <div className="ayur-meal-action-col">
                  {isCompleted ? (
                    <button
                      type="button"
                      className="ayur-meal-revert-btn"
                      onClick={() => handleToggleMeal(meal.meal_type, 'PENDING')}
                      disabled={isUpdating}
                      title="Undo completed status"
                    >
                      <RotateCcw size={14} />
                      <span>Undo</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-xs">
                      <Button
                        variant={isPending ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleMeal(meal.meal_type, 'COMPLETED')}
                        loading={isUpdating}
                        leftIcon={<CheckCircle2 size={14} />}
                      >
                        Eat
                      </Button>
                      <button
                        type="button"
                        className="ayur-meal-skip-btn"
                        onClick={() => handleToggleMeal(meal.meal_type, isSkipped ? 'PENDING' : 'SKIPPED')}
                        disabled={isUpdating}
                        title={isSkipped ? 'Undo skip' : 'Skip this meal'}
                      >
                        {isSkipped ? 'Undo' : 'Skip'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
