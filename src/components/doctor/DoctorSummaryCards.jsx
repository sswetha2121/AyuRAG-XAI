import React from 'react';
import './DoctorSummaryCards.css';
import {
  Users,
  Clock,
  CheckCircle2,
  BrainCircuit,
  CalendarClock,
  ShieldAlert,
  Utensils,
  FileCheck2,
  Sparkles
} from 'lucide-react';

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
      title: 'Pending Reviews',
      value: metrics.pending_clinical_reviews ?? 'Data unavailable',
      subtitle: 'Awaiting clinical notes',
      icon: Clock,
      color: 'gold',
      badge: metrics.pending_clinical_reviews > 0 ? 'Review Needed' : 'Up to date',
      highlight: metrics.pending_clinical_reviews > 0,
    },
    {
      id: 'unverified_assessments',
      title: 'Unverified Assessments',
      value: metrics.unverified_assessments ?? 'Data unavailable',
      subtitle: 'Patient reports pending check',
      icon: ShieldAlert,
      color: 'warm',
      badge: metrics.unverified_assessments > 0 ? 'Verification Needed' : 'All Verified',
      highlight: metrics.unverified_assessments > 0,
    },
    {
      id: 'plans_awaiting_approval',
      title: 'Plans Awaiting Approval',
      value: metrics.plans_awaiting_approval ?? 'Data unavailable',
      subtitle: 'Doctor sign-off pending',
      icon: FileCheck2,
      color: 'teal',
      badge: metrics.plans_awaiting_approval > 0 ? 'Action Required' : '0 Pending',
      highlight: metrics.plans_awaiting_approval > 0,
    },
    {
      id: 'draft_diet_plans',
      title: 'Draft Diet Plans',
      value: metrics.draft_diet_plans ?? 'Data unavailable',
      subtitle: 'In synthesis or editing',
      icon: Utensils,
      color: 'sage',
      badge: 'Work in Progress',
    },
    {
      id: 'active_diet_plans',
      title: 'Active Diet Plans',
      value: metrics.active_diet_plans ?? 'Data unavailable',
      subtitle: 'Live patient protocols',
      icon: CheckCircle2,
      color: 'forest',
      badge: 'Doctor Approved',
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
