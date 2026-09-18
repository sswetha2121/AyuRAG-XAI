import React from 'react';
import './TimeRoutineSelector.css';
import { Sunrise, Moon, Clock, Check, Sparkles, Sun, Sunset } from 'lucide-react';

export const TimeRoutineSelector = ({
  wakePresets = [],
  bedPresets = [],
  value = {},
  onChange,
  disabled = false,
  className = ''
}) => {
  const selectedWake = value.wake || '';
  const selectedBed = value.bed || '';

  const handleSelectWake = (wakeId) => {
    if (disabled) return;
    onChange?.({
      ...value,
      wake: wakeId
    });
  };

  const handleSelectBed = (bedId) => {
    if (disabled) return;
    onChange?.({
      ...value,
      bed: bedId
    });
  };

  return (
    <div className={`ayur-time-routine-selector ${className}`.trim()}>
      {/* 1. Daily Rhythm Visualization */}
      <div className="ayur-daily-rhythm-banner" aria-hidden="true">
        <div className="ayur-rhythm-quadrant">
          <div className="ayur-rhythm-item ayur-rhythm-item--morning">
            <div className="ayur-rhythm-icon-wrap">
              <Sunrise size={16} />
            </div>
            <div className="ayur-rhythm-meta">
              <span className="ayur-rhythm-label">Morning (Brahma)</span>
              <span className="ayur-rhythm-time">04:30 – 07:00</span>
            </div>
          </div>

          <div className="ayur-rhythm-item ayur-rhythm-item--day">
            <div className="ayur-rhythm-icon-wrap">
              <Sun size={16} />
            </div>
            <div className="ayur-rhythm-meta">
              <span className="ayur-rhythm-label">Active Day (Pitta)</span>
              <span className="ayur-rhythm-time">10:00 – 14:00</span>
            </div>
          </div>

          <div className="ayur-rhythm-item ayur-rhythm-item--evening">
            <div className="ayur-rhythm-icon-wrap">
              <Sunset size={16} />
            </div>
            <div className="ayur-rhythm-meta">
              <span className="ayur-rhythm-label">Evening (Sandhya)</span>
              <span className="ayur-rhythm-time">18:00 – 21:30</span>
            </div>
          </div>

          <div className="ayur-rhythm-item ayur-rhythm-item--night">
            <div className="ayur-rhythm-icon-wrap">
              <Moon size={16} />
            </div>
            <div className="ayur-rhythm-meta">
              <span className="ayur-rhythm-label">Deep Night (Nidra)</span>
              <span className="ayur-rhythm-time">22:00 – 06:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ayur-time-sections-grid">
        {/* Wake-up Time Section */}
        <div className="ayur-time-section-card">
          <div className="ayur-time-section-header">
            <div className="ayur-time-icon ayur-time-icon--wake">
              <Sunrise size={18} />
            </div>
            <div>
              <h3 className="ayur-time-section-title">Typical Waking Hour</h3>
              <span className="ayur-time-section-sub">When do you usually leave bed in the morning?</span>
            </div>
          </div>

          <div role="radiogroup" aria-label="Typical waking hour" className="ayur-time-presets-list">
            {wakePresets.map((item) => {
              const isSelected = selectedWake === item.id || selectedWake === item.time;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={disabled}
                  className={`ayur-time-preset-btn ${isSelected ? 'ayur-time-preset-btn--selected' : ''}`}
                  onClick={() => handleSelectWake(item.id)}
                >
                  <div className="ayur-time-preset-left">
                    <span className="ayur-time-preset-val">{item.time}</span>
                    <span className="ayur-time-preset-lbl">{item.label}</span>
                  </div>
                  <div className="ayur-time-preset-check">
                    {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bedtime Section */}
        <div className="ayur-time-section-card">
          <div className="ayur-time-section-header">
            <div className="ayur-time-icon ayur-time-icon--bed">
              <Moon size={18} />
            </div>
            <div>
              <h3 className="ayur-time-section-title">Typical Bedtime</h3>
              <span className="ayur-time-section-sub">When do you typically sleep at night?</span>
            </div>
          </div>

          <div role="radiogroup" aria-label="Typical bedtime" className="ayur-time-presets-list">
            {bedPresets.map((item) => {
              const isSelected = selectedBed === item.id || selectedBed === item.time;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={disabled}
                  className={`ayur-time-preset-btn ${isSelected ? 'ayur-time-preset-btn--selected' : ''}`}
                  onClick={() => handleSelectBed(item.id)}
                >
                  <div className="ayur-time-preset-left">
                    <span className="ayur-time-preset-val">{item.time}</span>
                    <span className="ayur-time-preset-lbl">{item.label}</span>
                  </div>
                  <div className="ayur-time-preset-check">
                    {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
