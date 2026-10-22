import React, { useState, useMemo } from 'react';
import './DoctorPatientTable.css';
import { api } from '../../services/api';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Eye,
  CheckSquare,
  Sparkles,
  User,
  FileText,
  UserPlus,
  Utensils,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DoctorPatientTable = ({
  patients = [],
  isLoading = false,
  onViewPatient,
  onReviewPatient,
  onOpenAssessment,
  onOpenDietPlan,
  onRefreshCohort,
  onTriggerToast,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL'); // 'ALL' | 'ASSIGNED_TO_ME' | 'UNASSIGNED'
  const [prakritiFilter, setPrakritiFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reviewFilter, setReviewFilter] = useState('ALL');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [assigningId, setAssigningId] = useState(null);
  const pageSize = 8;

  const handleAssignPatient = async (pt) => {
    const ptId = pt.patient || pt.id;
    try {
      setAssigningId(ptId);
      const res = await api.assignDoctorPatient(ptId);
      onTriggerToast?.({
        type: 'success',
        title: 'Patient Assigned',
        message: `${pt.patient_name || 'Patient'} is now officially assigned to your clinical care.`,
      });
      onRefreshCohort?.();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Assignment Failed',
        message: err.message || 'Could not assign patient to your care.',
      });
    } finally {
      setAssigningId(null);
    }
  };

  // Filter & Search Logic
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search
      const searchMatch = !searchQuery || (
        patient.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.primary_symptoms?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        patient.primary_prakriti?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Scope Filter (Assigned to Me vs Unassigned vs All)
      let scopeMatch = true;
      if (scopeFilter === 'ASSIGNED_TO_ME') {
        scopeMatch = Boolean(patient.is_assigned_to_me);
      } else if (scopeFilter === 'UNASSIGNED') {
        scopeMatch = !patient.is_assigned_to_me && !patient.assigned_doctor_name;
      }


      // Constitution Filter
      let prakritiMatch = prakritiFilter === 'ALL';
      if (!prakritiMatch && patient.primary_prakriti) {
        const pLower = patient.primary_prakriti.toLowerCase();
        if (prakritiFilter === 'vata') {
          prakritiMatch = pLower.includes('vata') || pLower.includes('movement');
        } else if (prakritiFilter === 'pitta') {
          prakritiMatch = pLower.includes('pitta') || pLower.includes('metabolism');
        } else if (prakritiFilter === 'kapha') {
          prakritiMatch = pLower.includes('kapha') || pLower.includes('structure');
        } else {
          prakritiMatch = pLower.includes(prakritiFilter.toLowerCase());
        }
      }

      // Assessment Status Filter
      const statusMatch = statusFilter === 'ALL' || patient.status === statusFilter;

      // Review Status Filter
      const reviewMatch = reviewFilter === 'ALL' || patient.review_status === reviewFilter;

      return searchMatch && prakritiMatch && statusMatch && reviewMatch;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'patient_name') {
        aVal = a.patient_name || '';
        bVal = b.patient_name || '';
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (sortField === 'created_at') {
        aVal = new Date(a.created_at || 0).getTime();
        bVal = new Date(b.created_at || 0).getTime();
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [patients, searchQuery, prakritiFilter, statusFilter, reviewFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPrakritiBadgeColor = (prakriti = '') => {
    const p = prakriti.toLowerCase();
    if (p.includes('vata') || p.includes('movement')) return 'accent'; // Muted gold / Earthy
    if (p.includes('pitta') || p.includes('metabolism')) return 'warning'; // Solar warm
    if (p.includes('kapha') || p.includes('structure')) return 'secondary'; // Sage green
    return 'default';
  };

  const getReviewStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="ayur-status-pill ayur-status-pill--success">Completed</span>;
      case 'IN_REVIEW':
        return <span className="ayur-status-pill ayur-status-pill--info">In Review</span>;
      case 'PENDING':
      default:
        return <span className="ayur-status-pill ayur-status-pill--warning">Pending</span>;
    }
  };

  return (
    <div className={`ayur-patient-table-card ${className}`.trim()}>
      {/* Scope Filter Tabs */}
      <div className="ayur-table-scope-bar">
        <button
          type="button"
          className={`ayur-scope-btn ${scopeFilter === 'ALL' ? 'ayur-scope-btn--active' : ''}`}
          onClick={() => {
            setScopeFilter('ALL');
            setCurrentPage(1);
          }}
        >
          All Cohort ({patients.length})
        </button>
        <button
          type="button"
          className={`ayur-scope-btn ${scopeFilter === 'ASSIGNED_TO_ME' ? 'ayur-scope-btn--active' : ''}`}
          onClick={() => {
            setScopeFilter('ASSIGNED_TO_ME');
            setCurrentPage(1);
          }}
        >
          Assigned to You ({patients.filter((p) => p.is_assigned_to_me).length})
        </button>
        <button
          type="button"
          className={`ayur-scope-btn ${scopeFilter === 'UNASSIGNED' ? 'ayur-scope-btn--active' : ''}`}
          onClick={() => {
            setScopeFilter('UNASSIGNED');
            setCurrentPage(1);
          }}
        >
          Unassigned ({patients.filter((p) => !p.is_assigned_to_me && !p.assigned_doctor_name).length})
        </button>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="ayur-table-controls">
        <div className="ayur-table-search">
          <Search size={16} className="ayur-table-search__icon" />
          <input
            type="text"
            className="ayur-table-search__input"
            placeholder="Search patient, symptom, or constitution..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="ayur-table-search__clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="ayur-table-filters">
          {/* Constitution Filter */}
          <div className="ayur-filter-select-wrapper">
            <span className="ayur-filter-label">Constitution:</span>
            <select
              className="ayur-filter-select"
              value={prakritiFilter}
              onChange={(e) => {
                setPrakritiFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Constitutions</option>
              <option value="vata">Movement Dominant</option>
              <option value="pitta">Metabolism Dominant</option>
              <option value="kapha">Structure Dominant</option>
            </select>
          </div>

          {/* Review Status Filter */}
          <div className="ayur-filter-select-wrapper">
            <span className="ayur-filter-label">Review:</span>
            <select
              className="ayur-filter-select"
              value={reviewFilter}
              onChange={(e) => {
                setReviewFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Reviews</option>
              <option value="PENDING">Pending Review</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Assessment Status Filter */}
          <div className="ayur-filter-select-wrapper">
            <span className="ayur-filter-label">Assessment:</span>
            <select
              className="ayur-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll Isolation */}
      <div className="ayur-table-wrapper">
        <table className="ayur-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('patient_name')} className="ayur-th--sortable">
                <div className="flex items-center gap-xs">
                  <span>Patient</span>
                  <ArrowUpDown size={13} />
                </div>
              </th>
              <th>Care Assignment</th>
              <th>Age / Sex</th>
              <th>Assessment Status</th>
              <th>Constitution</th>
              <th onClick={() => toggleSort('created_at')} className="ayur-th--sortable">
                <div className="flex items-center gap-xs">
                  <span>Last Assessment</span>
                  <ArrowUpDown size={13} />
                </div>
              </th>
              <th>Chief Symptoms</th>
              <th>AI Analysis</th>
              <th>Review Status</th>
              <th className="ayur-th--actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" className="ayur-table-empty">
                  <div className="ayur-table-loading">
                    <div className="ayur-spinner-mini" />
                    <span>Loading patient clinical cohort...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedPatients.length === 0 ? (
              <tr>
                <td colSpan="10" className="ayur-table-empty">
                  <span>No patient records matching your filter criteria.</span>
                </td>
              </tr>
            ) : (
              paginatedPatients.map((pt) => {
                const initials = (pt.patient_name || 'PT')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                const formattedDate = pt.created_at
                  ? new Date(pt.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent';

                return (
                  <tr key={pt.id} className="ayur-tr">
                    {/* Patient Info */}
                    <td>
                      <div className="ayur-patient-cell">
                        <div className="ayur-patient-avatar">{initials}</div>
                        <div className="ayur-patient-meta">
                          <span className="ayur-patient-name">{pt.patient_name}</span>
                          <div className="flex items-center gap-xs">
                            <span className="ayur-patient-id">ID: AYU-{String(pt.id).padStart(4, '0')}</span>
                            {pt.is_demo !== false && (
                              <span className="ayur-demo-badge">DEMO DATA</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Care Assignment */}
                    <td>
                      {pt.is_assigned_to_me ? (
                        <span className="ayur-assign-pill ayur-assign-pill--me">
                          ✓ In Your Care
                        </span>
                      ) : pt.assigned_doctor_name ? (
                        <span className="ayur-assign-pill ayur-assign-pill--other">
                          {pt.assigned_doctor_name}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="ayur-btn-assign-mini"
                          onClick={() => handleAssignPatient(pt)}
                          disabled={assigningId === (pt.patient || pt.id)}
                          title="Assign patient to your clinical care"
                        >
                          <UserPlus size={12} />
                          <span>
                            {assigningId === (pt.patient || pt.id) ? 'Assigning...' : '+ Assign to Me'}
                          </span>
                        </button>
                      )}
                    </td>

                    {/* Age & Sex */}
                    <td>
                      <div className="ayur-cell-sub">
                        <span>{pt.patient_age} yrs</span>
                        <span className="text-muted">{pt.patient_gender}</span>
                      </div>
                    </td>

                    {/* Assessment Status */}
                    <td>
                      <span className={`ayur-status-dot ${pt.status === 'COMPLETED' ? 'ayur-status-dot--green' : 'ayur-status-dot--amber'}`}>
                        {pt.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                      </span>
                    </td>

                    {/* Constitution */}
                    <td>
                      <span className={`ayur-dosha-chip ayur-dosha-chip--${getPrakritiBadgeColor(pt.primary_prakriti)}`}>
                        {pt.primary_prakriti || 'Movement & Metabolism'}
                      </span>
                    </td>

                    {/* Last Assessment */}
                    <td>
                      <span className="ayur-cell-date">{formattedDate}</span>
                    </td>

                    {/* Symptoms */}
                    <td>
                      <div className="ayur-symptoms-pills">
                        {pt.primary_symptoms?.slice(0, 2).map((sym, sIdx) => (
                          <span key={sIdx} className="ayur-symptom-tag" title={sym}>
                            {sym}
                          </span>
                        ))}
                        {pt.primary_symptoms?.length > 2 && (
                          <span className="ayur-symptom-more">+{pt.primary_symptoms.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* AI Analysis Status */}
                    <td>
                      <div className="flex items-center gap-xs">
                        <Sparkles size={14} className="text-accent" />
                        <span className="ayur-cell-ai">{pt.ai_analysis?.confidence ? `${Math.round(pt.ai_analysis.confidence * 100)}% Conf.` : 'Generated'}</span>
                      </div>
                    </td>

                    {/* Review Status */}
                    <td>
                      {getReviewStatusBadge(pt.review_status)}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="ayur-action-btn-group">
                        <button
                          type="button"
                          className="ayur-btn-action"
                          onClick={() => onViewPatient?.(pt.id)}
                          title="View complete patient clinical profile"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          className="ayur-btn-action ayur-btn-action--review"
                          onClick={() => onReviewPatient?.(pt.id, pt.latest_review_id)}
                          title="Open clinical review form"
                        >
                          <CheckSquare size={14} />
                          <span>Review</span>
                        </button>

                        <button
                          type="button"
                          className="ayur-btn-action ayur-btn-action--diet"
                          onClick={() => onOpenDietPlan ? onOpenDietPlan(pt.patient || pt.id) : (window.location.href = '/doctor/diet-plans')}
                          title="Open personalized diet plan"
                        >
                          <Utensils size={14} />
                          <span>Diet Plan</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="ayur-table-pagination">
        <span className="ayur-pagination-info">
          Showing {filteredPatients.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, filteredPatients.length)} of {filteredPatients.length} patients
        </span>

        <div className="ayur-pagination-buttons">
          <button
            type="button"
            className="ayur-page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="ayur-page-number">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="ayur-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
