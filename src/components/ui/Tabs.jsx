import React from 'react';
import './Tabs.css';

/**
 * AyuRAG-XAI Reusable Tabs Component
 */
export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pills', // 'pills' | 'underline' | 'boxed'
  className = '',
}) => {
  return (
    <div className={`ayur-tabs ayur-tabs--${variant} ${className}`.trim()} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ayur-tab-btn ${isActive ? 'ayur-tab-btn--active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <span className="ayur-tab-btn__icon">{typeof Icon === 'function' ? <Icon size={16} /> : Icon}</span>}
            <span className="ayur-tab-btn__label">{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span className={`ayur-tab-btn__badge ${isActive ? 'ayur-tab-btn__badge--active' : ''}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
