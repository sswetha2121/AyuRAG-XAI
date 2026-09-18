import React from 'react';
import './DashboardNavTabs.css';
import {
  LayoutDashboard,
  Activity,
  Brain,
  Sparkles,
  Clock,
  BookOpen
} from 'lucide-react';

export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'constitution', label: 'Tridosha Constitution', icon: Activity },
  { id: 'explainability', label: 'Explainable AI (XAI)', icon: Brain },
  { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
  { id: 'routine', label: 'Daily Timetable', icon: Clock },
  { id: 'evidence', label: 'Evidence & RAG', icon: BookOpen }
];

export const DashboardNavTabs = ({
  activeTab = 'overview',
  onSelectTab,
  className = ''
}) => {
  return (
    <div className={`ayur-dash-tabs-bar ${className}`.trim()} role="tablist" aria-label="Dashboard views">
      <div className="ayur-dash-tabs-track">
        {DASHBOARD_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`ayur-dash-tab-btn ${isActive ? 'ayur-dash-tab-btn--active' : ''}`}
              onClick={() => onSelectTab?.(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
