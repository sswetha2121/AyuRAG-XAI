import React, { useState } from 'react';
import './AppShell.css';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { ChevronRight, Home } from 'lucide-react';

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
  progressPercent = 15
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ayur-app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        activeStep={activeStep}
        onSelectStep={onSelectStep}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        progressPercent={progressPercent}
      />

      {/* Main Layout Area */}
      <div className="ayur-main-wrapper">
        <Header
          title={headerTitle || 'Design System Showcase'}
          subtitle={headerSubtitle || 'Phase 1 Reusable Components & Design Tokens'}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Optional Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <div className="ayur-breadcrumbs-bar">
            <div className="ayur-container">
              <nav aria-label="Breadcrumb" className="ayur-breadcrumbs">
                <ol className="ayur-breadcrumbs__list">
                  <li className="ayur-breadcrumbs__item">
                    <span className="ayur-breadcrumbs__home">
                      <Home size={13} />
                    </span>
                    <span className="ayur-breadcrumbs__text">AyuRAG-XAI</span>
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
