import React from 'react';
import './StatusBadge.css';
import { CheckCircle2, Clock, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';

/**
 * AyuRAG-XAI Standardized Semantic Status Badge
 */
export const StatusBadge = ({
  status = 'PENDING',
  label,
  size = 'md', // 'sm' | 'md'
  showIcon = true,
  className = '',
}) => {
  const normalized = (status || '').toUpperCase().replace(/[-\s]/g, '_');

  const getConfig = () => {
    switch (normalized) {
      case 'COMPLETED':
      case 'APPROVED':
      case 'ACTIVE':
      case 'VERIFIED':
        return {
          variant: 'success',
          text: label || (normalized === 'COMPLETED' ? 'Completed' : normalized === 'APPROVED' ? 'Approved' : 'Active'),
          icon: CheckCircle2,
        };
      case 'IN_PROGRESS':
      case 'IN_REVIEW':
        return {
          variant: 'info',
          text: label || (normalized === 'IN_REVIEW' ? 'In Review' : 'In Progress'),
          icon: Clock,
        };
      case 'REJECTED':
      case 'FAILED':
      case 'NEEDS_ATTENTION':
        return {
          variant: 'error',
          text: label || (normalized === 'REJECTED' ? 'Needs Revision' : 'Needs Attention'),
          icon: XCircle,
        };
      case 'PENDING':
      case 'PENDING_REVIEW':
      default:
        return {
          variant: 'warning',
          text: label || 'Pending Review',
          icon: AlertCircle,
        };
    }
  };

  const { variant, text, icon: Icon } = getConfig();

  return (
    <span className={`ayur-status-badge ayur-status-badge--${variant} ayur-status-badge--${size} ${className}`.trim()}>
      {showIcon && <Icon size={size === 'sm' ? 12 : 14} className="ayur-status-badge__icon" />}
      <span className="ayur-status-badge__text">{text}</span>
    </span>
  );
};
