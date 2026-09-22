import React from 'react';
import './Symptoms.css';
import { PRIMARY_CONCERN_OPTIONS } from '../../data/symptomQuestions';
import { Utensils, Moon, Zap, Brain, Clock, Heart, CheckCircle2 } from 'lucide-react';

const ICON_MAP = {
  Utensils: Utensils,
  Moon: Moon,
  Zap: Zap,
  Brain: Brain,
  Clock: Clock,
  Heart: Heart
};

/**
 * AyuRAG-XAI PrimaryConcernSelector Component
 * Allows user to choose their chief complaint or primary wellness goal.
 */
export const PrimaryConcernSelector = ({
  selectedConcern,
  onSelectConcern,
  className = ''
}) => {
  return (
    <div className={`ayur-primary-concern-section ${className}`.trim()}>
      <div className="ayur-concern-header">
        <span className="ayur-concern-badge">Primary Focus</span>
        <h3 className="ayur-concern-title">
          What would you most like to understand about your profile?
        </h3>
        <p className="ayur-concern-desc">
          Selecting a primary area helps our explainable AI system prioritize relevant feature contributions and clinical literature links.
        </p>
      </div>

      <div className="ayur-concern-grid" role="radiogroup" aria-label="Primary Concern">
        {PRIMARY_CONCERN_OPTIONS.map((item) => {
          const isSelected = selectedConcern === item.id;
          const Icon = ICON_MAP[item.icon] || Heart;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`ayur-concern-card ${isSelected ? 'ayur-concern-card--selected' : ''}`}
              onClick={() => onSelectConcern(item.id)}
            >
              <div className="ayur-concern-card__icon">
                <Icon size={20} />
              </div>
              <div className="ayur-concern-card__content">
                <span className="ayur-concern-card__label">{item.label}</span>
                <span className="ayur-concern-card__desc">{item.description}</span>
              </div>
              <div className="ayur-concern-card__checkbox">
                {isSelected ? (
                  <CheckCircle2 size={18} className="text-accent" />
                ) : (
                  <span className="ayur-concern-card__circle" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
