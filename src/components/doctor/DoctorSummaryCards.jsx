import React, { useState, useEffect } from 'react';
import './DoctorSummaryCards.css';
import {
  Users,
  Clock,
  Utensils,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Smooth numerical count-up component respecting prefers-reduced-motion
const CountUp = ({ end, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = typeof end === 'number' ? end : parseInt(end, 10);
    if (isNaN(target)) {
      setCount(end || 0);
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }

    let startTimestamp = null;
    let animId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animId = window.requestAnimationFrame(step);

    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [end, duration]);

  return <>{count}</>;
};

export const DoctorSummaryCards = ({
  metrics = {},
  isLoading = false,
  onNavigate
}) => {
  const pendingReviewsTotal =
    (metrics.pending_clinical_reviews || 0) + (metrics.unverified_assessments || 0);

  const cards = [
    {
      id: 'patient_count',
      title: 'Total Patients',
      value: metrics.total_patients ?? 0,
      caption: `${metrics.my_assigned_patients || 0} under your direct care`,
      badge: `${metrics.my_assigned_patients || 0} Assigned`,
      badgeType: 'neutral',
      icon: Users,
      route: '/doctor/patients',
      accentColor: 'forest',
      actionLabel: 'View Roster'
    },
    {
      id: 'pending_reviews',
      title: 'Pending Reviews',
      value: pendingReviewsTotal,
      caption: `${metrics.pending_clinical_reviews || 0} reviews • ${metrics.unverified_assessments || 0} verifications`,
      badge: pendingReviewsTotal > 0 ? 'Action Needed' : 'All Clear',
      badgeType: pendingReviewsTotal > 0 ? 'warning' : 'success',
      icon: Clock,
      route: '/doctor/reviews',
      accentColor: 'gold',
      actionLabel: 'Open Queue'
    },
    {
      id: 'active_diet_plans',
      title: 'Active Diet Plans',
      value: metrics.active_diet_plans ?? 0,
      caption: `${metrics.plans_awaiting_approval || 0} drafts awaiting approval`,
      badge: 'Published & Active',
      badgeType: 'success',
      icon: Utensils,
      route: '/doctor/diet-plans',
      accentColor: 'sage',
      actionLabel: 'Manage Regimens'
    },
    {
      id: 'unread_messages',
      title: 'Unread Messages',
      value: metrics.unread_messages ?? 0,
      caption: 'Direct clinical patient inquiries',
      badge: (metrics.unread_messages || 0) > 0 ? `${metrics.unread_messages} New Inquiries` : 'Up to Date',
      badgeType: (metrics.unread_messages || 0) > 0 ? 'alert' : 'neutral',
      icon: MessageSquare,
      route: '/doctor/messages',
      accentColor: 'charcoal',
      actionLabel: 'Open Messages'
    }
  ];

  const handleCardClick = (route) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <div className="ayur-summary-quad-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`ayur-summary-card ayur-summary-card--${card.accentColor} ayur-animate-card`}
            style={{ '--card-idx': idx }}
            onClick={() => handleCardClick(card.route)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(card.route);
              }
            }}
            aria-label={`${card.title}: ${card.value}, ${card.caption}`}
          >
            {/* Header: Title and Icon */}
            <div className="ayur-summary-card__header">
              <span className="ayur-summary-card__title">{card.title}</span>
              <div className="ayur-summary-card__icon-box">
                <Icon size={18} />
              </div>
            </div>

            {/* Body: Value and Caption */}
            <div className="ayur-summary-card__body">
              {isLoading ? (
                <div className="ayur-summary-card__skeleton" />
              ) : (
                <div className="ayur-summary-card__value">
                  <CountUp end={card.value} />
                </div>
              )}
              <p className="ayur-summary-card__caption">{card.caption}</p>
            </div>

            {/* Footer: Badge and Action Indicator */}
            <div className="ayur-summary-card__footer">
              <span className={`ayur-summary-card__badge ayur-badge--${card.badgeType}`}>
                {card.badge}
              </span>
              <span className="ayur-summary-card__action">
                <span>{card.actionLabel}</span>
                <ArrowRight size={13} className="ayur-action-arrow" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
