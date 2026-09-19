import React from 'react';
import './Header.css';
import { Menu, PanelLeft, PanelLeftClose, Bell, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

/**
 * AyuRAG-XAI Reusable Top Header
 */
export const Header = ({
  title = 'Design System Showcase',
  subtitle = 'Production-grade component library & design tokens for AyuRAG-XAI',
  onMenuClick,
  isCollapsed = false,
  onToggleCollapse,
  user = null,
  onLogout,
  className = ''
}) => {
  const isDoctor = user?.role === 'DOCTOR';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : isDoctor
    ? 'DS'
    : 'PT';

  return (
    <header className={`ayur-header ${className}`.trim()} aria-label="Page Header">
      <div className="ayur-header__left">
        {/* Mobile Drawer Trigger (screens < 1024px) */}
        <button
          type="button"
          className="ayur-header__menu-btn"
          onClick={onMenuClick}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Sidebar Collapse / Expand Trigger (screens >= 1024px) */}
        {onToggleCollapse && (
          <button
            type="button"
            className="ayur-header__collapse-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
            title={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
          >
            {isCollapsed ? <PanelLeft size={19} /> : <PanelLeftClose size={19} />}
          </button>
        )}

        <div className="ayur-header__title-group">
          <h1 className="ayur-header__title">{title}</h1>
          {subtitle && <p className="ayur-header__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="ayur-header__right">
        {/* Status Pill Badge */}
        <div className="ayur-header__status-badge">
          {isDoctor ? (
            <Badge color="accent" variant="subtle" size="md" dot>
              Clinical Decision Support (CDS)
            </Badge>
          ) : (
            <Badge color="secondary" variant="subtle" size="md" dot>
              Patient Assessment Pipeline
            </Badge>
          )}
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
        <div
          className="ayur-header__profile"
          title={user ? `${user.name} (${user.role})` : 'Clinical User Profile'}
          onClick={onLogout}
        >
          <div className="ayur-header__avatar">
            <span>{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

