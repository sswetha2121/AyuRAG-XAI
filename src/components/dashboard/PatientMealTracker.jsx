import React, { useState, useEffect } from 'react';
import './PatientMealTracker.css';
import { api } from '../../services/api';
import { PatientTodayScheduleCard } from './PatientTodayScheduleCard';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingMeal, setIsUpdatingMeal] = useState(null);
  const [waterLoading, setWaterLoading] = useState(false);

  const fetchSchedule = async () => {
    try {
      const data = await api.getPatientMealSchedule();
      setScheduleData(data);
    } catch (err) {
      console.log('Error fetching meal schedule:', err);
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

  const defaultScheduleData = {
    date: new Date().toISOString().split('T')[0],
    is_doctor_approved: true,
    plan_title: 'Personalized Nutrition & Diet Intake Regimen',
    plan_version: '1.2',
    progress: {
      meals_completed: 2,
      meals_planned: 5,
      adherence_rate: 40,
      water_intake_ml: 1250,
      water_goal_ml: 2500,
    },
    meals: [
      {
        id: 1,
        meal_type: 'BREAKFAST',
        label: 'Breakfast',
        scheduled_time: '08:00 AM',
        meal_name: 'Warm Whole Grain Porridge & Stewed Fruit',
        items: ['Warm oatmeal with almond milk', 'Stewed sweet apple with peeled almonds'],
        status: 'COMPLETED',
      },
      {
        id: 2,
        meal_type: 'LUNCH',
        label: 'Lunch (Main Meal)',
        scheduled_time: '01:30 PM',
        meal_name: 'Wholesome Lentil Platter & Steamed Basmati Rice',
        items: ['Yellow Lentils, Steamed Basmati Rice', 'Steamed Squash & Probiotic Yogurt'],
        status: 'PENDING',
      },
      {
        id: 3,
        meal_type: 'DINNER',
        label: 'Dinner',
        scheduled_time: '08:00 PM',
        meal_name: 'Light Vegetable Soup & Warm Flatbread',
        items: ['Mild spiced pumpkin soup', 'Soft whole wheat flatbread'],
        status: 'PENDING',
      },
    ],
  };

  const activeData = scheduleData || defaultScheduleData;

  const {
    date,
    meals = activeData.meals || [],
    next_meal,
    progress = activeData.progress || {},
    is_doctor_approved = activeData.is_doctor_approved,
    approved_by_name,
    plan_title = activeData.plan_title,
    plan_version = activeData.plan_version,
  } = activeData;

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
      {/* 1. Exact Today's Schedule Tracking Card */}
      <PatientTodayScheduleCard
        onTriggerToast={onTriggerToast}
        onOpenReminders={onOpenReminders}
      />

      {/* 2. Hydration & Water Intake Tracker */}
      <div className="ayur-tracker-metrics-grid">
        <div className="ayur-metric-card ayur-metric-card--full">
          <div className="ayur-metric-card__header">
            <div className="flex items-center gap-xs">
              <Droplets size={16} className="text-secondary" />
              <span className="ayur-metric-title">Daily Hydration Intake</span>
            </div>
            <span className="ayur-metric-badge">{waterIntake} / {waterGoal} ml ({waterPercent}%)</span>
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
