import React from 'react';
import './ConsentCheckbox.css';
import { ShieldAlert, Check } from 'lucide-react';

export const ConsentCheckbox = ({
  checked = false,
  onChange,
  className = ''
}) => {
  return (
    <div
      className={`ayur-consent-box ${checked ? 'ayur-consent-box--checked' : ''} ${className}`.trim()}
      onClick={() => onChange?.(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange?.(!checked);
        }
      }}
    >
      <div className="ayur-consent-check-indicator" aria-hidden="true">
        {checked ? <Check size={14} strokeWidth={3} /> : null}
      </div>

      <div className="ayur-consent-body">
        <span className="ayur-consent-title">
          Clinical Acknowledgement & Educational Consent
        </span>
        <p className="ayur-consent-text">
          I understand that AyuRAG-XAI provides personalized educational, constitutional, and research-oriented clinical decision-support insights and does not replace formal physician evaluation, diagnosis, or emergency healthcare services.
        </p>
      </div>
    </div>
  );
};
