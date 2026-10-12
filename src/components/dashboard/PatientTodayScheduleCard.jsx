import React, { useState, useEffect } from 'react';
import './PatientTodayScheduleCard.css';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Clock,
  Utensils,
  CheckCircle2,
  Bell,
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const PatientTodayScheduleCard = ({
  onTriggerToast,
  onOpenReminders
}) => {
  // Default fallback data matching the doctor-approved regimen
  const defaultSchedule = {
    is_doctor_approved: true,
    plan_version: '1.2',
    reminder_time: '01:15 PM',
    next_meal: {
      meal_type: 'LUNCH',
      label: 'Lunch (Main Meal)',
      scheduled_time: '01:30 PM',
      meal_name: 'Yellow Lentils, Steamed Basmati Rice, Squash & Probiotic Yogurt',
      status: 'PENDING',
    },
    meals: [
      {
        id: 1,
        meal_type: 'BREAKFAST',
        label: 'Breakfast',
        scheduled_time: '08:00 AM',
        meal_name: 'Warm Whole Grain Porridge',
        status: 'COMPLETED',
      },
      {
        id: 2,
        meal_type: 'LUNCH',
        label: 'Lunch',
        scheduled_time: '01:30 PM',
        meal_name: 'Wholesome Lentil Platter',
        status: 'PENDING',
      },
      {
        id: 3,
        meal_type: 'DINNER',
        label: 'Dinner',
        scheduled_time: '08:00 PM',
        meal_name: 'Light Vegetable Soup',
        status: 'PENDING',
      },
    ],
    progress: {
      meals_completed: 2,
      meals_planned: 5,
      adherence_rate: 40,
    },
  };

  const [scheduleData, setScheduleData] = useState(defaultSchedule);
  const [loadingMealType, setLoadingMealType] = useState(null);

  // Fetch real patient schedule from backend API
  const fetchSchedule = async () => {
    try {
      const data = await api.getPatientMealSchedule();
      if (data && data.meals && data.meals.length > 0) {
        setScheduleData(data);
      }
    } catch (err) {
      // Gracefully maintain default schedule for demo/offline
      console.log('Using default schedule data for meal tracker:', err.message);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const {
    is_doctor_approved = true,
    plan_version = '1.2',
    next_meal,
    meals = [],
    progress = {},
    reminder_time = '01:15 PM'
  } = scheduleData;

  // Calculate adherence progress
  const totalMeals = meals.length > 0 ? meals.length : (progress.meals_planned || 5);
  const completedMeals = meals.filter((m) => m.status === 'COMPLETED').length || progress.meals_completed || 2;
  const adherencePercent = Math.round((completedMeals / totalMeals) * 100);

  // Find next meal if not explicitly set
  const currentNextMeal =
    next_meal ||
    meals.find((m) => m.status === 'PENDING') ||
    meals[0] ||
    defaultSchedule.next_meal;

  // Toggle meal status (Eaten / Pending)
  const handleToggleMeal = async (mealType, currentStatus) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    setLoadingMealType(mealType);

    // Optimistically update UI
    setScheduleData((prev) => {
      const updatedMeals = (prev.meals || []).map((m) =>
        m.meal_type === mealType ? { ...m, status: newStatus } : m
      );

      const newCompleted = updatedMeals.filter((m) => m.status === 'COMPLETED').length;
      const newTotal = updatedMeals.length;
      const newAdherence = Math.round((newCompleted / newTotal) * 100);

      const nextPending = updatedMeals.find((m) => m.status === 'PENDING');

      return {
        ...prev,
        meals: updatedMeals,
        next_meal: nextPending || prev.next_meal,
        progress: {
          ...prev.progress,
          meals_completed: newCompleted,
          meals_planned: newTotal,
          adherence_rate: newAdherence,
        },
      };
    });

    try {
      const res = await api.logPatientMeal({
        meal_type: mealType,
        status: newStatus,
      });

      onTriggerToast?.({
        type: newStatus === 'COMPLETED' ? 'success' : 'info',
        title: newStatus === 'COMPLETED' ? 'Meal Logged' : 'Status Updated',
        message:
          newStatus === 'COMPLETED'
            ? `Marked as eaten! Daily meal adherence is now ${Math.round(((completedMeals + (currentStatus === 'COMPLETED' ? -1 : 1)) / totalMeals) * 100)}%.`
            : 'Meal reverted to scheduled status.',
      });
    } catch (err) {
      // In offline/demo mode, toast still confirms local tracking
      onTriggerToast?.({
        type: 'success',
        title: newStatus === 'COMPLETED' ? 'Meal Logged' : 'Status Updated',
        message: `Meal status updated to ${newStatus === 'COMPLETED' ? 'eaten' : 'scheduled'}.`,
      });
    } finally {
      setLoadingMealType(null);
    }
  };

  return (
    <div className="ayur-today-schedule-card">
      {/* 1. Header Badges */}
      <div className="ayur-hcard-header">
        <div className="flex items-center gap-xs">
          <span className="ayur-doctor-badge">
            <ShieldCheck size={14} /> {is_doctor_approved ? 'Doctor Approved' : 'Review in Progress'}
          </span>
          <span className="ayur-version-badge">Active Plan v{plan_version}</span>
        </div>
        <span className="ayur-hcard-today-label">
          <Clock size={12} /> Today's Schedule
        </span>
      </div>

      {/* 2. Next Meal Highlight Spotlight Box */}
      {currentNextMeal && (
        <div className="ayur-hcard-meal-spotlight">
          <div className="ayur-hcard-icon-box">
            <Utensils size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <span className="ayur-hcard-spotlight-tag">NEXT SCHEDULED MEAL</span>
            <h3 className="ayur-hcard-meal-title">
              {currentNextMeal.label || 'Lunch (Main Meal)'} • {currentNextMeal.scheduled_time || '01:30 PM'}
            </h3>
            <p className="ayur-hcard-meal-text">
              {currentNextMeal.meal_name ||
                (currentNextMeal.items && currentNextMeal.items.join(', ')) ||
                'Yellow Lentils, Steamed Basmati Rice, Squash & Probiotic Yogurt'}
            </p>
          </div>
        </div>
      )}

      {/* 3. Checklist Items */}
      <div className="ayur-hcard-checklist">
        {meals.map((meal) => {
          const isDone = meal.status === 'COMPLETED';
          const isActive = !isDone && currentNextMeal?.meal_type === meal.meal_type;
          const isPending = !isDone && !isActive;
          const isLoading = loadingMealType === meal.meal_type;

          return (
            <div
              key={meal.id || meal.meal_type}
              className={`ayur-hcard-check-item ${isDone ? 'item-done' : ''} ${isActive ? 'item-active' : ''}`}
            >
              <div className="flex items-center gap-xs flex-1">
                {isDone ? (
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                ) : isActive ? (
                  <Clock size={16} className="text-warning shrink-0" />
                ) : (
                  <Clock size={16} className="text-muted shrink-0" />
                )}

                <span
                  className={`text-xs ${isActive ? 'font-semibold text-primary' : isDone ? 'text-text-primary' : 'text-muted'}`}
                >
                  {meal.scheduled_time} • {meal.meal_name}
                </span>
              </div>

              <div className="flex items-center gap-xs">
                {isDone ? (
                  <button
                    type="button"
                    className="ayur-check-done-tag"
                    onClick={() => handleToggleMeal(meal.meal_type, 'COMPLETED')}
                    title="Click to undo"
                  >
                    Eaten
                  </button>
                ) : isActive ? (
                  <button
                    type="button"
                    className={`ayur-hcard-eat-btn ${isLoading ? 'loading' : ''}`}
                    onClick={() => handleToggleMeal(meal.meal_type, 'PENDING')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Mark Eaten'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ayur-check-pending-tag hover:text-primary transition-colors cursor-pointer"
                    onClick={() => handleToggleMeal(meal.meal_type, 'PENDING')}
                    title="Click to log early"
                  >
                    Scheduled
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Daily Adherence Progress Bar */}
      <div className="ayur-hcard-progress">
        <div className="flex justify-between text-xs font-semibold text-primary mb-2xs">
          <span>Daily Meal Adherence</span>
          <span>
            {adherencePercent}% ({completedMeals}/{totalMeals})
          </span>
        </div>
        <div className="ayur-hcard-pbar">
          <div
            className="ayur-hcard-pfill"
            style={{ width: `${adherencePercent}%` }}
          />
        </div>
      </div>

      {/* 5. Reminders Banner */}
      <div
        className="ayur-hcard-reminder-note"
        onClick={onOpenReminders}
        role="button"
        tabIndex={0}
        title="Configure Meal Reminders"
      >
        <Clock size={13} className="text-secondary shrink-0" />
        <span className="flex-1">
          Meal Reminder scheduled for {reminder_time} (15 mins before eating)
        </span>
        {onOpenReminders && (
          <span className="ayur-hcard-reminder-chip">
            <Bell size={11} /> Settings
          </span>
        )}
      </div>
    </div>
  );
};
