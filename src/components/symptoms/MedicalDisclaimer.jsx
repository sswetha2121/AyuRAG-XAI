import React from 'react';
import './Symptoms.css';
import { CLINICAL_SAFETY_DISCLAIMER } from '../../data/symptomQuestions';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

/**
 * AyuRAG-XAI MedicalDisclaimer Component
 * Accessible, balanced clinical safety notice.
 */
export const MedicalDisclaimer = ({ className = '' }) => {
  return (
    <div className={`ayur-medical-disclaimer ${className}`.trim()} role="note">
      <div className="ayur-medical-disclaimer__header">
        <ShieldCheck size={18} className="text-secondary shrink-0" />
        <h4 className="ayur-medical-disclaimer__title">
          {CLINICAL_SAFETY_DISCLAIMER.title}
        </h4>
      </div>
      <p className="ayur-medical-disclaimer__text">
        {CLINICAL_SAFETY_DISCLAIMER.message}
      </p>
      <div className="ayur-medical-disclaimer__urgent">
        <AlertTriangle size={14} className="text-warning shrink-0 mt-0.5" />
        <span>{CLINICAL_SAFETY_DISCLAIMER.urgentWarning}</span>
      </div>
    </div>
  );
};
