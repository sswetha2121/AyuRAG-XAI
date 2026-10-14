import React from 'react';
import './Header.css';
import { Menu, PanelLeft, PanelLeftClose, Bell, ShieldCheck, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

/**
 * AyuRAG-XAI Reusable Top Header
 */
export const Header = ({
  title = 'AyuRAG-XAI',
  subtitle = 'Personalized Healthcare & Wellness Platform',
  onMenuClick,
  isCollapsed = false,
  onToggleCollapse,
  user = null,
  onLogout,
  unreadCount = 0,
  onOpenNotifications,
  onOpenProfile,
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
    ? 'DR'
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
              Clinical Decision Support
            </Badge>
          ) : (
            <Badge color="secondary" variant="subtle" size="md" dot>
              Patient Portal
            </Badge>
          )}
        </div>

        {/* Evidence Indicator */}
        <div className="ayur-header__protocol">
          <ShieldCheck size={16} className="text-secondary shrink-0" />
          <span className="ayur-header__protocol-text">Evidence-Informed</span>
        </div>

        {/* Action Foundations */}
        <div className="ayur-header__actions">
          <button
            type="button"
            className="ayur-header__icon-btn"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            title="Notifications & Alerts"
            onClick={onOpenNotifications}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="ayur-header__badge-dot" />}
          </button>
        </div>

        {/* Profile Avatar */}
        <div
          className="ayur-header__profile"
          title={user ? `${user.name} (${user.role})` : 'User Profile'}
          onClick={onOpenProfile || onLogout}
          tabIndex={0}
          role="button"
          aria-label="User Profile"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              (onOpenProfile || onLogout)?.();
            }
          }}
        >
          <div className="ayur-header__avatar">
            <span>{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
