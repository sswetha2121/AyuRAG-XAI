import React from 'react';
import './DoctorSummaryCards.css';
import { Users, Clock, CheckCircle2, BrainCircuit, CalendarClock, AlertCircle } from 'lucide-react';

export const DoctorSummaryCards = ({ metrics = {}, isLoading = false }) => {
  const cards = [
    {
      id: 'total_patients',
      title: 'Total Patients',
      value: metrics.total_patients ?? 'Data unavailable',
      subtitle: 'Registered clinical cohort',
      icon: Users,
      color: 'forest',
      badge: 'Active Cohort',
    },
    {
      id: 'pending_reviews',
      title: 'Pending Clinical Reviews',
      value: metrics.pending_clinical_reviews ?? 'Data unavailable',
      subtitle: 'Awaiting physician sign-off',
      icon: Clock,
      color: 'gold',
      badge: metrics.pending_clinical_reviews > 0 ? 'Action Required' : 'Up to date',
      highlight: metrics.pending_clinical_reviews > 0,
    },
    {
      id: 'completed_assessments',
      title: 'Completed Assessments',
      value: metrics.completed_assessments ?? 'Data unavailable',
      subtitle: '5-phase multi-domain validated',
      icon: CheckCircle2,
      color: 'sage',
      badge: '100% Ingested',
    },
    {
      id: 'ai_assisted_analyses',
      title: 'AI-Assisted Analyses',
      value: metrics.ai_assisted_analyses ?? 'Data unavailable',
      subtitle: 'ML + SHAP + RAG grounded',
      icon: BrainCircuit,
      color: 'teal',
      badge: 'XAI Ready',
    },
    {
      id: 'follow_ups_due',
      title: 'Follow-ups Due',
      value: metrics.follow_ups_due ?? 'Data unavailable',
      subtitle: 'Within next 7–14 days',
      icon: CalendarClock,
      color: 'warm',
      badge: 'Scheduled',
    },
  ];

  return (
    <div className="ayur-summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`ayur-summary-card ayur-summary-card--${card.color} ${card.highlight ? 'ayur-summary-card--highlight' : ''}`}
          >
            <div className="ayur-summary-card__header">
              <span className="ayur-summary-card__title">{card.title}</span>
              <div className="ayur-summary-card__icon-box">
                <Icon size={19} />
              </div>
            </div>

            <div className="ayur-summary-card__body">
              {isLoading ? (
                <div className="ayur-summary-skeleton" />
              ) : (
                <div className="ayur-summary-card__value">
                  {card.value}
                </div>
              )}
              <span className="ayur-summary-card__subtitle">{card.subtitle}</span>
            </div>

            <div className="ayur-summary-card__footer">
              <span className="ayur-summary-card__badge">{card.badge}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
