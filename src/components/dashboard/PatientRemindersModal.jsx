import React, { useState, useEffect } from 'react';
import './PatientRemindersModal.css';
import { api } from '../../services/api';
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  Droplets,
  ShieldCheck,
  Save,
  Volume2
} from 'lucide-react';
import { Button } from '../ui/Button';

export const PatientRemindersModal = ({ isOpen, onClose, onTriggerToast }) => {
  const [preferences, setPreferences] = useState({
    reminders_enabled: true,
    breakfast_reminder: true,
    breakfast_time: '07:45 AM',
    mid_morning_reminder: true,
    mid_morning_time: '10:45 AM',
    lunch_reminder: true,
    lunch_time: '01:15 PM',
    evening_reminder: true,
    evening_time: '04:45 PM',
    dinner_reminder: true,
    dinner_time: '07:30 PM',
    water_reminders: true,
    water_interval_hours: 2,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [browserPermission, setBrowserPermission] = useState('default');

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setBrowserPermission(Notification.permission);
      }
      setIsLoading(true);
      api.getPatientReminders()
        .then((data) => {
          if (data && data.id) {
            setPreferences(data);
          }
        })
        .catch((err) => {
          console.error('Error fetching reminders:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (field) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangeTime = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRequestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setBrowserPermission(permission);
        if (permission === 'granted') {
          onTriggerToast?.({
            type: 'success',
            title: 'Notifications Enabled',
            message: 'Browser meal reminders have been approved.',
          });
          new Notification('AyuRAG Diet Reminder', {
            body: 'Meal reminders are now active! You will be notified when it is time to eat.',
            icon: '/favicon.ico',
          });
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.updatePatientReminders(preferences);
      onTriggerToast?.({
        type: 'success',
        title: 'Reminders Saved',
        message: 'Your daily meal notification schedule has been updated.',
      });
      onClose();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Error',
        message: err.message || 'Could not update reminder preferences.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ayur-modal-backdrop" onClick={onClose}>
      <div className="ayur-reminders-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ayur-rmodal-header">
          <div className="flex items-center gap-sm">
            <div className="ayur-rmodal-icon">
              <Bell size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="ayur-rmodal-title">Daily Meal Schedule Reminders</h3>
              <p className="ayur-rmodal-subtitle">
                Set notifications so you know exactly what time to eat each meal
              </p>
            </div>
          </div>
          <button type="button" className="ayur-rmodal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="ayur-rmodal-body">
          {/* Master Toggle */}
          <div className="ayur-rmaster-toggle-row">
            <div>
              <strong className="text-primary text-sm block">Enable All Meal Reminders</strong>
              <span className="text-xs text-muted">Receive in-app alerts when it is time for your next meal</span>
            </div>
            <label className="ayur-switch">
              <input
                type="checkbox"
                checked={preferences.reminders_enabled}
                onChange={() => handleToggle('reminders_enabled')}
              />
              <span className="ayur-slider round"></span>
            </label>
          </div>

          {/* Browser Notification Banner */}
          {browserPermission !== 'granted' && (
            <div className="ayur-browser-perm-box">
              <Volume2 size={18} className="text-secondary shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-semibold block text-primary">Browser Push Alerts</span>
                <span className="text-xs text-muted">Allow your browser to notify you when the app is open in background</span>
              </div>
              <button
                type="button"
                className="ayur-perm-btn"
                onClick={handleRequestBrowserPermission}
              >
                Allow
              </button>
            </div>
          )}

          {/* Per-Meal Reminder Timings */}
          <div className={`ayur-meal-times-list ${!preferences.reminders_enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Breakfast */}
            <div className="ayur-rtime-row">
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="chk-breakfast"
                  checked={preferences.breakfast_reminder}
                  onChange={() => handleToggle('breakfast_reminder')}
                />
                <label htmlFor="chk-breakfast" className="text-sm font-semibold text-primary">
                  Breakfast Reminder
                </label>
              </div>
              <input
                type="text"
                className="ayur-rtime-input"
                value={preferences.breakfast_time}
                onChange={(e) => handleChangeTime('breakfast_time', e.target.value)}
                placeholder="07:45 AM"
              />
            </div>

            {/* Mid-Morning Snack */}
            <div className="ayur-rtime-row">
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="chk-mid-morning"
                  checked={preferences.mid_morning_reminder}
                  onChange={() => handleToggle('mid_morning_reminder')}
                />
                <label htmlFor="chk-mid-morning" className="text-sm font-semibold text-primary">
                  Mid-Morning Snack
                </label>
              </div>
              <input
                type="text"
                className="ayur-rtime-input"
                value={preferences.mid_morning_time}
                onChange={(e) => handleChangeTime('mid_morning_time', e.target.value)}
                placeholder="10:45 AM"
              />
            </div>

            {/* Lunch */}
            <div className="ayur-rtime-row">
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="chk-lunch"
                  checked={preferences.lunch_reminder}
                  onChange={() => handleToggle('lunch_reminder')}
                />
                <label htmlFor="chk-lunch" className="text-sm font-semibold text-primary">
                  Lunch (Main Meal)
                </label>
              </div>
              <input
                type="text"
                className="ayur-rtime-input"
                value={preferences.lunch_time}
                onChange={(e) => handleChangeTime('lunch_time', e.target.value)}
                placeholder="01:15 PM"
              />
            </div>

            {/* Evening Snack */}
            <div className="ayur-rtime-row">
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="chk-evening"
                  checked={preferences.evening_reminder}
                  onChange={() => handleToggle('evening_reminder')}
                />
                <label htmlFor="chk-evening" className="text-sm font-semibold text-primary">
                  Evening Snack
                </label>
              </div>
              <input
                type="text"
                className="ayur-rtime-input"
                value={preferences.evening_time}
                onChange={(e) => handleChangeTime('evening_time', e.target.value)}
                placeholder="04:45 PM"
              />
            </div>

            {/* Dinner */}
            <div className="ayur-rtime-row">
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="chk-dinner"
                  checked={preferences.dinner_reminder}
                  onChange={() => handleToggle('dinner_reminder')}
                />
                <label htmlFor="chk-dinner" className="text-sm font-semibold text-primary">
                  Dinner (Light Meal)
                </label>
              </div>
              <input
                type="text"
                className="ayur-rtime-input"
                value={preferences.dinner_time}
                onChange={(e) => handleChangeTime('dinner_time', e.target.value)}
                placeholder="07:30 PM"
              />
            </div>

            {/* Water Interval */}
            <div className="ayur-rtime-row">
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  id="chk-water"
                  checked={preferences.water_reminders}
                  onChange={() => handleToggle('water_reminders')}
                />
                <label htmlFor="chk-water" className="text-sm font-semibold text-primary">
                  Hydration Reminders
                </label>
              </div>
              <div className="flex items-center gap-xs">
                <span className="text-xs text-muted">Every</span>
                <select
                  className="ayur-rtime-select"
                  value={preferences.water_interval_hours}
                  onChange={(e) => handleChangeTime('water_interval_hours', parseInt(e.target.value))}
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="ayur-rmodal-footer">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={isSaving}
              leftIcon={<Save size={16} />}
            >
              Save Reminder Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
