import React, { useState } from 'react';
import './AppShell.css';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AyuRAG-XAI Reusable Application Shell Layout
 */
export const AppShell = ({
  children,
  activeStep = 'design-system',
  onSelectStep,
  headerTitle,
  headerSubtitle,
  breadcrumbs = [],
  toasts = [],
  onCloseToast,
  progressPercent = 15,
  mode = 'patient',
  user = null,
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('ayur_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ayur_sidebar_collapsed', next ? 'true' : 'false');
      } catch {
        // ignore localStorage errors
      }
      return next;
    });
  };

  return (
    <div className="ayur-app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        mode={mode}
        activeStep={activeStep}
        onSelectStep={onSelectStep}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        progressPercent={progressPercent}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Layout Area */}
      <div className={`ayur-main-wrapper ${isCollapsed ? 'ayur-main-wrapper--collapsed' : ''}`}>
        <Header
          title={headerTitle || 'Design System Showcase'}
          subtitle={headerSubtitle || 'Phase 1 Reusable Components & Design Tokens'}
          onMenuClick={() => setSidebarOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          user={user}
          onLogout={onLogout}
        />

        {/* Optional Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <div className="ayur-breadcrumbs-bar">
            <div className="ayur-container">
              <nav aria-label="Breadcrumb" className="ayur-breadcrumbs">
                <ol className="ayur-breadcrumbs__list">
                  <li className="ayur-breadcrumbs__item">
                    <Link to="/" className="ayur-breadcrumbs__home-link flex items-center gap-xs">
                      <span className="ayur-breadcrumbs__home">
                        <Home size={13} />
                      </span>
                      <span className="ayur-breadcrumbs__text">AyuRAG-XAI</span>
                    </Link>
                  </li>
                  {breadcrumbs.map((crumb, idx) => (
                    <li key={idx} className="ayur-breadcrumbs__item">
                      <ChevronRight size={13} className="ayur-breadcrumbs__sep" />
                      <span className={`ayur-breadcrumbs__text ${idx === breadcrumbs.length - 1 ? 'ayur-breadcrumbs__text--current' : ''}`}>
                        {crumb}
                      </span>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="ayur-main-content">
          <div className="ayur-container">
            {children}
          </div>
        </main>
      </div>

      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onClose={onCloseToast} />
    </div>
  );
};
