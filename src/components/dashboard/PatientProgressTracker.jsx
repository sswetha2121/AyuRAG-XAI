import React, { useState, useEffect } from 'react';
import './PatientProgressTracker.css';
import { api } from '../../services/api';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Droplets,
  Activity,
  AlertCircle
} from 'lucide-react';

export const PatientProgressTracker = ({ onTriggerToast }) => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getPatientProgress()
      .then((data) => {
        if (isMounted) {
          setProgressData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching progress:', err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="ayur-progress-loading">
        <div className="ayur-spinner-mini" />
        <span>Calculating historical adherence and meal trends...</span>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="ayur-progress-empty">
        <AlertCircle size={28} className="text-muted" />
        <p>No historical progress records available yet. Start logging meals to see your progress.</p>
      </div>
    );
  }

  const {
    streak_days = 0,
    weekly_adherence_rate = 0,
    total_meals_completed = 0,
    weekly_points = [],
    total_logged_days = 0
  } = progressData;

  return (
    <div className="ayur-progress-section">
      {/* 1. Header Overview Cards */}
      <div className="ayur-progress-stats-grid">
        {/* Streak Card */}
        <div className="ayur-pstat-card">
          <div className="ayur-pstat-icon ayur-pstat-icon--fire">
            <Flame size={22} />
          </div>
          <div className="ayur-pstat-content">
            <span className="ayur-pstat-label">Daily Streak</span>
            <strong className="ayur-pstat-value">{streak_days} Days</strong>
            <span className="ayur-pstat-desc">Consecutive meal logs</span>
          </div>
        </div>

        {/* Weekly Adherence */}
        <div className="ayur-pstat-card">
          <div className="ayur-pstat-icon ayur-pstat-icon--chart">
            <TrendingUp size={22} />
          </div>
          <div className="ayur-pstat-content">
            <span className="ayur-pstat-label">Weekly Adherence</span>
            <strong className="ayur-pstat-value">{weekly_adherence_rate}%</strong>
            <span className="ayur-pstat-desc">Target: 80%+ adherence</span>
          </div>
        </div>

        {/* Total Meals Logged */}
        <div className="ayur-pstat-card">
          <div className="ayur-pstat-icon ayur-pstat-icon--meals">
            <CheckCircle2 size={22} />
          </div>
          <div className="ayur-pstat-content">
            <span className="ayur-pstat-label">Total Meals Eaten</span>
            <strong className="ayur-pstat-value">{total_meals_completed}</strong>
            <span className="ayur-pstat-desc">Across past 7 days</span>
          </div>
        </div>

        {/* Active Days */}
        <div className="ayur-pstat-card">
          <div className="ayur-pstat-icon ayur-pstat-icon--days">
            <Calendar size={22} />
          </div>
          <div className="ayur-pstat-content">
            <span className="ayur-pstat-label">Recorded Days</span>
            <strong className="ayur-pstat-value">{total_logged_days}</strong>
            <span className="ayur-pstat-desc">In your health journal</span>
          </div>
        </div>
      </div>

      {/* 2. Past 7-Days Adherence Bar Chart */}
      <div className="ayur-chart-card">
        <div className="ayur-chart-card__header">
          <div>
            <h3 className="ayur-chart-heading">7-Day Meal Consistency</h3>
            <p className="ayur-chart-subheading">
              Meal completion rate calculated from your persisted daily records
            </p>
          </div>
          <div className="ayur-chart-legend">
            <span className="legend-dot" />
            <span className="text-xs text-muted">Daily Completion %</span>
          </div>
        </div>

        <div className="ayur-bars-container">
          {weekly_points.map((pt, idx) => {
            const heightPercent = Math.max(8, pt.adherence_rate);
            const isHigh = pt.adherence_rate >= 80;
            const isMid = pt.adherence_rate >= 40 && pt.adherence_rate < 80;

            return (
              <div key={idx} className="ayur-bar-col">
                <span className="ayur-bar-val">{pt.adherence_rate}%</span>
                <div className="ayur-bar-track">
                  <div
                    className={`ayur-bar-fill ${isHigh ? 'bar-high' : isMid ? 'bar-mid' : 'bar-low'}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="ayur-bar-day">{pt.day_label}</span>
                <span className="ayur-bar-detail">{pt.meals_completed}/{pt.meals_planned}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Day-by-Day Table */}
      <div className="ayur-history-table-card">
        <h4 className="ayur-table-title">Recent Daily Adherence Log</h4>
        <div className="ayur-table-responsive">
          <table className="ayur-htable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meals Completed</th>
                <th>Meals Planned</th>
                <th>Adherence Rate</th>
                <th>Water Intake</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {weekly_points.slice().reverse().map((row, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-primary">{row.date} ({row.day_label})</td>
                  <td>{row.meals_completed}</td>
                  <td>{row.meals_planned}</td>
                  <td>
                    <span className="font-bold text-primary">{row.adherence_rate}%</span>
                  </td>
                  <td>{row.water_intake_ml || 0} ml</td>
                  <td>
                    {row.adherence_rate >= 80 ? (
                      <span className="ayur-tag-success">Optimal</span>
                    ) : row.adherence_rate >= 40 ? (
                      <span className="ayur-tag-warning">Moderate</span>
                    ) : row.meals_completed > 0 ? (
                      <span className="ayur-tag-low">In Progress</span>
                    ) : (
                      <span className="ayur-tag-muted">No Meals Logged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
