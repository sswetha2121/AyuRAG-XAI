import React from 'react';
import './Header.css';
import { Menu, Bell, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

/**
 * AyuRAG-XAI Reusable Top Header
 */
export const Header = ({
  title = 'Design System Showcase',
  subtitle = 'Production-grade component library & design tokens for AyuRAG-XAI',
  onMenuClick,
  className = ''
}) => {
  return (
    <header className={`ayur-header ${className}`.trim()} aria-label="Page Header">
      <div className="ayur-header__left">
        <button
          type="button"
          className="ayur-header__menu-btn"
          onClick={onMenuClick}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="ayur-header__title-group">
          <h1 className="ayur-header__title">{title}</h1>
          {subtitle && <p className="ayur-header__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="ayur-header__right">
        {/* Status Pill Badge */}
        <div className="ayur-header__status-badge">
          <Badge color="accent" variant="subtle" size="md" dot>
            Phase 1 • Foundation
          </Badge>
        </div>

        {/* Clinical Protocol Indicator */}
        <div className="ayur-header__protocol">
          <ShieldCheck size={16} className="text-secondary" />
          <span className="ayur-header__protocol-text">CCRAS / Classical Protocol</span>
        </div>

        {/* Action Foundations */}
        <div className="ayur-header__actions">
          <button
            type="button"
            className="ayur-header__icon-btn"
            aria-label="Notifications"
            title="System Notifications"
          >
            <Bell size={18} />
            <span className="ayur-header__badge-dot" />
          </button>

          <button
            type="button"
            className="ayur-header__icon-btn"
            aria-label="Settings"
            title="Application Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="ayur-header__profile" title="Lead Clinical Investigator">
          <div className="ayur-header__avatar">
            <span>DS</span>
          </div>
        </div>
      </div>
    </header>
  );
};
