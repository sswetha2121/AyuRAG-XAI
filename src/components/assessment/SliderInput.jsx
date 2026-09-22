import React from 'react';
import './Assessment.css';

/**
 * AyuRAG-XAI SliderInput Component
 * Visual numeric range slider with active fill, value readout, and ticks.
 */
export const SliderInput = ({
  id,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  unit = '',
  ticks = [],
  disabled = false
}) => {
  const currentValue = value !== undefined && value !== null ? Number(value) : min;
  const percentage = Math.max(0, Math.min(100, ((currentValue - min) / (max - min)) * 100));

  return (
    <div className="ayur-slider-input" id={`slider-${id}`}>
      <div className="ayur-slider-input__header">
        <span className="ayur-slider-input__value-pill">
          <strong>{currentValue}</strong> {unit}
        </span>
      </div>

      <div className="ayur-slider-input__track-wrapper">
        <div
          className="ayur-slider-input__fill"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ayur-range-slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-valuetext={`${currentValue} ${unit}`}
        />
      </div>

      {ticks && ticks.length > 0 && (
        <div className="ayur-slider-input__ticks">
          {ticks.map((tick) => (
            <span
              key={tick.value}
              className={`ayur-slider-tick ${currentValue === tick.value ? 'ayur-slider-tick--active' : ''}`}
              onClick={() => !disabled && onChange(tick.value)}
            >
              {tick.label || tick.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
