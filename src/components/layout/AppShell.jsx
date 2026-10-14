import React, { useState, useEffect } from 'react';
import './AppShell.css';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChevronRight, Home, Bell, CheckCircle2, AlertCircle, Clock, Check, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

/**
 * AyuRAG-XAI Reusable Application Shell Layout
 */
export const AppShell = ({
  children,
  activeStep = 'overview',
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

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setIsLoadingNotifications(true);
      const res = await api.getNotifications();
      setNotifications(res?.notifications || []);
    } catch (err) {
      // ignore if unauthenticated or offline
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ayur_sidebar_collapsed', next ? 'true' : 'false');
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isDoctor = mode === 'doctor';

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
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadNotificationCount={unreadCount}
      />

      {/* Main Layout Area */}
      <div className={`ayur-main-wrapper ${isCollapsed ? 'ayur-main-wrapper--collapsed' : ''}`}>
        <Header
          title={headerTitle || (isDoctor ? 'Doctor Decision Support' : 'Patient Diet & Wellness')}
          subtitle={headerSubtitle || (isDoctor ? 'Clinical Workflow & Diagnostic Records' : 'Daily Meal Schedule & Nutritional Guidance')}
          onMenuClick={() => setSidebarOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          user={user}
          onLogout={onLogout}
          unreadCount={unreadCount}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
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

      {/* Interactive Notifications Modal */}
      <Modal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications & Alerts"
        subtitle={isDoctor ? 'Clinical Review & Care Plan Updates' : 'Meal Timetable & Health Alerts'}
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            {unreadCount > 0 ? (
              <button
                type="button"
                className="text-xs text-secondary font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            ) : <span />}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationsOpen(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="ayur-notif-modal-list flex flex-col gap-sm">
          {isLoadingNotifications ? (
            <div className="py-lg text-center text-sm text-muted">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="py-xl text-center flex flex-col items-center">
              <Bell size={28} className="text-muted mb-xs" />
              <p className="text-sm text-text-primary font-semibold">No New Notifications</p>
              <p className="text-xs text-muted max-w-xs mt-2xs">
                You are all caught up! You will be alerted when care plans or reviews require your attention.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`ayur-notif-item flex items-start gap-md p-md rounded-md border ${
                  notif.is_read
                    ? 'bg-surface border-border-subtle opacity-80'
                    : 'bg-primary-subtle border-secondary'
                }`}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: notif.is_read ? 'var(--color-border-subtle)' : 'var(--color-secondary-light)',
                  backgroundColor: notif.is_read ? 'var(--color-surface)' : 'var(--color-bg-subtle)'
                }}
              >
                <div className="shrink-0 mt-2xs">
                  {notif.type === 'SUCCESS' || notif.title?.includes('Approved') ? (
                    <CheckCircle2 size={18} className="text-success" />
                  ) : notif.type === 'WARNING' || notif.title?.includes('Pending') ? (
                    <AlertCircle size={18} className="text-warning" />
                  ) : (
                    <Clock size={18} className="text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-xs mb-2xs">
                    <h4 className="text-sm font-semibold text-text-primary m-0">{notif.title}</h4>
                    <span className="text-xs text-muted">
                      {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary m-0 leading-relaxed">{notif.message}</p>
                </div>
                {!notif.is_read && (
                  <button
                    type="button"
                    title="Mark as read"
                    className="shrink-0 text-xs text-muted hover:text-primary bg-transparent border-0 cursor-pointer p-xs"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Profile & Account Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={isDoctor ? 'Attending Physician Profile' : 'Patient Profile'}
        subtitle="Account Details & Access Role"
        size="sm"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setProfileModalOpen(false);
                onLogout?.();
              }}
            >
              Sign Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProfileModalOpen(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-md py-xs">
          <div className="flex items-center gap-md">
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FAF4E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              {isDoctor ? 'DR' : 'PT'}
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary m-0">
                {user?.name || (isDoctor ? 'Dr. Sharma, MD' : 'Active Patient')}
              </h3>
              <p className="text-xs text-muted m-0">
                Username: @{user?.username || (isDoctor ? 'dr.sharma' : 'patient')}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)'
                }}
              >
                {isDoctor ? 'Ayurvedic Clinical Lead' : 'Registered Patient'}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: '13px',
              lineHeight: 1.6
            }}
          >
            <div className="flex items-center gap-xs text-secondary font-semibold mb-xs">
              <ShieldCheck size={16} />
              <span>Authorization & Security</span>
            </div>
            <p className="text-muted text-xs m-0">
              {isDoctor
                ? 'Physician workspace authorized for intake evaluation, patient symptom verification, and care plan prescription.'
                : 'Patient account with individual data isolation and doctor-reviewed wellness recommendations.'}
            </p>
          </div>
        </div>
      </Modal>

      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onClose={onCloseToast} />
    </div>
  );
};
