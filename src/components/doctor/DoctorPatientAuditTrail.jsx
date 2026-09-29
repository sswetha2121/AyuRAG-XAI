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
      default:
        return { label: action.replace(/_/g, ' '), icon: History, color: 'text-primary' };
    }
  };

  return (
    <div className="ayur-audit-container">
      <div className="ayur-audit-header">
        <div className="flex items-center gap-xs">
          <History size={18} className="text-secondary" />
          <h3 className="font-serif font-bold text-primary">Immutable Clinical Audit Trail</h3>
        </div>
        <span className="text-xs text-muted">{logs.length} Logged Events</span>
      </div>

      <div className="ayur-audit-list">
        {logs.map((log) => {
          const badge = getActionBadge(log.action);
          const Icon = badge.icon;

          return (
            <div key={log.id} className="ayur-audit-row">
              <div className="ayur-audit-time">
                <Clock size={13} className="text-muted" />
                <span>{new Date(log.timestamp).toLocaleString()}</span>
              </div>

              <div className="ayur-audit-badge">
                <Icon size={14} className={badge.color} />
                <span className="font-semibold text-xs">{badge.label}</span>
              </div>

              <div className="ayur-audit-actor">
                <User size={13} className="text-muted" />
                <span>{log.actor_name || 'System / AI'}</span>
              </div>

              <div className="ayur-audit-meta">
                {log.metadata && Object.keys(log.metadata).length > 0 ? (
                  <code>{JSON.stringify(log.metadata)}</code>
                ) : (
                  <span className="text-muted">No additional metadata</span>
                )}
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
