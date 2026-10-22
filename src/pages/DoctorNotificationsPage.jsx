import React, { useState, useEffect } from 'react';
import './DoctorNotificationsPage.css';
import { api } from '../services/api';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  Activity,
  Sparkles,
  Utensils,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorNotificationsPage = ({
  onNavigateToPatient,
  onNavigateToReviews,
  onTriggerToast,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'UNREAD' | 'REVIEWS' | 'SYSTEM'

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Error',
        message: err.message || 'Could not load notifications.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      onTriggerToast?.({
        type: 'success',
        title: 'Marked as Read',
        message: 'Notification updated.',
      });
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not update notification.',
      });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      onTriggerToast?.({
        type: 'success',
        title: 'All Caught Up',
        message: 'All notifications marked as read.',
      });
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not mark all as read.',
      });
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'CLINICAL_REVIEW':
        return ClipboardCheck;
      case 'ASSESSMENT':
        return Activity;
      case 'DIET_PLAN':
      case 'DIET_PLAN_APPROVED':
        return Utensils;
      case 'SYSTEM':
      default:
        return Sparkles;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filterTab === 'UNREAD') return !notif.is_read;
    if (filterTab === 'REVIEWS') return notif.type === 'CLINICAL_REVIEW';
    if (filterTab === 'SYSTEM') return notif.type === 'SYSTEM';
    return true;
  });

  return (
    <div className="ayur-doctor-notifications-page">
      {/* Header */}
      <div className="ayur-notif-header">
        <div>
          <h1 className="ayur-notif-title">Clinical Notifications & Alerts</h1>
          <p className="ayur-notif-desc">
            Review requests, verification reminders, intake status updates, and decision support alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="small"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck size={14} />}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="ayur-notif-filter-bar">
        <div className="ayur-notif-tabs">
          <button
            type="button"
            className={`ayur-notif-tab ${filterTab === 'ALL' ? 'ayur-notif-tab--active' : ''}`}
            onClick={() => setFilterTab('ALL')}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            type="button"
            className={`ayur-notif-tab ${filterTab === 'UNREAD' ? 'ayur-notif-tab--active' : ''}`}
            onClick={() => setFilterTab('UNREAD')}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`ayur-notif-tab ${filterTab === 'REVIEWS' ? 'ayur-notif-tab--active' : ''}`}
            onClick={() => setFilterTab('REVIEWS')}
          >
            Reviews Queue
          </button>
          <button
            type="button"
            className={`ayur-notif-tab ${filterTab === 'SYSTEM' ? 'ayur-notif-tab--active' : ''}`}
            onClick={() => setFilterTab('SYSTEM')}
          >
            System Notices
          </button>
        </div>

        <span className="text-xs text-muted">
          Showing {filteredNotifications.length} of {notifications.length} alerts
        </span>
      </div>

      {/* List */}
      <div className="ayur-notif-list">
        {isLoading ? (
          <div className="ayur-notif-empty">
            <div className="ayur-spinner-mini" />
            <p>Loading clinical alerts...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="ayur-notif-empty">
            <CheckCircle2 size={32} className="text-secondary" />
            <h3>No Notifications</h3>
            <p>You have no alerts matching your filter criteria.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const Icon = getNotifIcon(notif.type);
            const timeAgo = notif.created_at
              ? new Date(notif.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={notif.id}
                className={`ayur-notif-card ${!notif.is_read ? 'ayur-notif-card--unread' : ''}`}
              >
                <div className="ayur-notif-icon-box">
                  <Icon size={18} />
                </div>

                <div className="ayur-notif-content">
                  <div className="ayur-notif-top">
                    <h4 className="ayur-notif-card-title">{notif.title}</h4>
                    <span className="ayur-notif-time">{timeAgo}</span>
                  </div>

                  <p className="ayur-notif-message">{notif.message}</p>

                  <div className="ayur-notif-actions">
                    {notif.related_object_type === 'PatientAssessment' && notif.related_object_id && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => onNavigateToPatient?.(notif.related_object_id)}
                        rightIcon={<ExternalLink size={12} />}
                      >
                        Inspect Patient Dossier
                      </Button>
                    )}

                    {notif.type === 'CLINICAL_REVIEW' && onNavigateToReviews && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={onNavigateToReviews}
                        rightIcon={<ExternalLink size={12} />}
                      >
                        Open Reviews Queue
                      </Button>
                    )}

                    {!notif.is_read && (
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleMarkRead(notif.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
