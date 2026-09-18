import React from 'react';
import './SleepQualitySelector.css';
import { Moon, Check, Sparkles, Battery, BatteryCharging, Zap } from 'lucide-react';

export const SleepQualitySelector = ({
  durationOptions = [],
  qualityOptions = [],
  value = {},
  onChange,
  disabled = false,
  className = ''
}) => {
  const selectedDuration = value.duration || '';
  const selectedQuality = value.quality || '';

  const handleSelectDuration = (durVal) => {
    if (disabled) return;
    onChange?.({
      ...value,
      duration: durVal
    });
  };

  const handleSelectQuality = (qualVal) => {
    if (disabled) return;
    onChange?.({
      ...value,
      quality: qualVal
    });
  };

  return (
    <div className={`ayur-sleep-selector ${className}`.trim()}>
      {/* 1. Sleep Duration Slider / Segmented */}
      <div className="ayur-sleep-section">
        <div className="ayur-sleep-section-header">
          <div className="flex items-center gap-xs">
            <Moon size={16} className="text-primary" />
            <h3 className="ayur-sleep-subtitle">1. Typical Nightly Sleep Duration</h3>
          </div>
          {selectedDuration && (
            <span className="ayur-sleep-current-tag">
              Selected: <strong>{selectedDuration} hrs</strong>
            </span>
          )}
        </div>

        <div role="radiogroup" aria-label="Sleep duration in hours" className="ayur-sleep-duration-segments">
          {durationOptions.map((item) => {
            const isSelected = selectedDuration === item.value || selectedDuration === item.id;

            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                className={`ayur-sleep-duration-btn ${isSelected ? 'ayur-sleep-duration-btn--selected' : ''}`}
                onClick={() => handleSelectDuration(item.value)}
              >
                <span className="ayur-sleep-dur-label">{item.label}</span>
                <span className="ayur-sleep-dur-sub">{item.subtext}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Sleep Restorative Quality Cards */}
      <div className="ayur-sleep-section">
        <div className="ayur-sleep-section-header">
          <div className="flex items-center gap-xs">
            <Sparkles size={16} className="text-accent" />
            <h3 className="ayur-sleep-subtitle">2. Perceived Restorative Quality (Nidrā Guṇa)</h3>
          </div>
          {selectedQuality && (
            <span className="ayur-sleep-current-tag">
              Rating: <strong>{selectedQuality}</strong>
            </span>
          )}
        </div>

        <div role="radiogroup" aria-label="Perceived sleep quality" className="ayur-sleep-quality-grid">
          {qualityOptions.map((item) => {
            const isSelected = selectedQuality === item.value || selectedQuality === item.id;

            return (
              <div
                key={item.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={disabled ? -1 : 0}
                className={`ayur-quality-card ${isSelected ? 'ayur-quality-card--selected' : ''}`}
                onClick={() => !disabled && handleSelectQuality(item.value)}
                onKeyDown={(e) => {
                  if (disabled) return;
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleSelectQuality(item.value);
                  }
                }}
              >
                <div className="ayur-quality-card__top">
                  <span className="ayur-quality-card__label">{item.label}</span>
                  <div className="ayur-quality-card__check">
                    {isSelected ? <Check size={12} strokeWidth={3} /> : null}
                  </div>
                </div>
                <p className="ayur-quality-card__desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
