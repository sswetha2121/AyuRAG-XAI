import React, { useState, useEffect } from 'react';
import './DoctorPatientAuditTrail.css';
import { api } from '../../services/api';
import {
  History,
  ShieldCheck,
  Edit3,
  Sparkles,
  FileCheck,
  Archive,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';

export const DoctorPatientAuditTrail = ({ patientId }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      api.getPatientAuditLogs(patientId)
        .then((res) => setLogs(res.logs || []))
        .catch(() => setLogs([]))
        .finally(() => setIsLoading(false));
    }
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="ayur-audit-loading">
        <div className="ayur-spinner-mini" />
        <span>Loading clinical audit history...</span>
      </div>
    );
  }

  const getActionBadge = (action) => {
    switch (action) {
      case 'DOCTOR_VERIFIED_FIELD':
        return { label: 'Verified Field', icon: ShieldCheck, color: 'text-success' };
      case 'DOCTOR_CORRECTED_FIELD':
        return { label: 'Corrected Field', icon: Edit3, color: 'text-indigo' };
      case 'AI_DIET_GENERATED':
        return { label: 'AI Diet Generated', icon: Sparkles, color: 'text-secondary' };
      case 'DOCTOR_EDITED_DIET':
        return { label: 'Diet Modified', icon: Edit3, color: 'text-warning' };
      case 'DIET_APPROVED':
        return { label: 'Diet Approved & Activated', icon: FileCheck, color: 'text-success' };
      case 'DIET_ARCHIVED':
        return { label: 'Previous Plan Archived', icon: Archive, color: 'text-muted' };
      case 'DIET_REJECTED':
        return { label: 'Diet Plan Rejected', icon: AlertCircle, color: 'text-error' };
      case 'DOCTOR_REVIEW_SAVED':
        return { label: 'Clinical Review Saved', icon: FileCheck, color: 'text-primary' };
      case 'DOCTOR_REVIEW_COMPLETED':
        return { label: 'Review Completed & Signed Off', icon: ShieldCheck, color: 'text-success' };
      case 'CASE_ACCESSED':
        return { label: 'Patient Record Accessed', icon: User, color: 'text-secondary' };
      default:
        return { label: action.replace(/_/g, ' '), icon: History, color: 'text-primary' };
    }
  };

  const renderMetadata = (meta) => {
    if (!meta || Object.keys(meta).length === 0) {
      return <span className="text-muted">No additional metadata</span>;
    }

    // Special formatted cases
    if (meta.old_value !== undefined && meta.new_value !== undefined) {
      return (
        <div className="ayur-audit-meta-formatted">
          <span className="font-medium text-primary">{meta.field_name || 'Field'}:</span>
          <span className="ayur-audit-diff">
            <span className="ayur-audit-diff-old">{String(meta.old_value)}</span>
            <span>&rarr;</span>
            <span className="ayur-audit-diff-new">{String(meta.new_value)}</span>
          </span>
          {meta.doctor_note && <span className="text-muted italic">({meta.doctor_note})</span>}
        </div>
      );
    }

    if (meta.review_status) {
      return (
        <div className="ayur-audit-meta-formatted">
          <span>Status changed to: <strong>{meta.review_status}</strong></span>
          {meta.summary && <span className="text-muted italic"> - {meta.summary.substring(0, 60)}...</span>}
        </div>
      );
    }

    if (meta.version) {
      return (
        <div className="ayur-audit-meta-formatted">
          <span>Plan Version: <strong>v{meta.version}</strong></span>
          {meta.title && <span className="text-muted">({meta.title})</span>}
        </div>
      );
    }

    if (meta.reason) {
      return (
        <div className="ayur-audit-meta-formatted">
          <span>Reason: <em>{meta.reason}</em></span>
        </div>
      );
    }

    return <code>{JSON.stringify(meta)}</code>;
  };

  return (
    <div className="ayur-audit-container">
      <div className="ayur-audit-header">
        <div className="flex items-center gap-xs">
          <History size={18} className="text-secondary" />
          <h3 className="font-serif font-bold text-primary">Immutable Clinical Audit Trail</h3>
        </div>
        <div className="flex items-center gap-xs">
          <span className="text-xs text-muted">{logs.length} Logged Events</span>
        </div>
      </div>

      <div className="ayur-audit-list">
        {logs.map((log) => {
          const badge = getActionBadge(log.action);
          const Icon = badge.icon;
          const isDemo = log.metadata?.is_demo === true;

          return (
            <div key={log.id} className="ayur-audit-row">
              <div className="ayur-audit-time">
                <Clock size={13} className="text-muted" />
                <span>{new Date(log.timestamp).toLocaleString()}</span>
              </div>

              <div className="ayur-audit-badge">
                <Icon size={14} className={badge.color} />
                <span className="font-semibold text-xs">{badge.label}</span>
                {isDemo && (
                  <span className="ayur-audit-demo-pill" title="Prepopulated demo audit entry">DEMO</span>
                )}
              </div>

              <div className="ayur-audit-actor">
                <User size={13} className="text-muted" />
                <span>{log.actor_name || 'System / AI'}</span>
              </div>

              <div className="ayur-audit-meta">
                {renderMetadata(log.metadata)}
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="ayur-audit-empty">
            <AlertCircle size={20} className="text-muted" />
            <p className="text-sm text-muted">No audit events recorded for this patient yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
