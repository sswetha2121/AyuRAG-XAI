import React, { useState, useMemo } from 'react';
import './DoctorPatientTable.css';
import { Search, Filter, ArrowUpDown, ChevronRight, Eye, CheckSquare, Sparkles, User, FileText } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DoctorPatientTable = ({
  patients = [],
  isLoading = false,
  onViewPatient,
  onReviewPatient,
  onOpenAssessment,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prakritiFilter, setPrakritiFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reviewFilter, setReviewFilter] = useState('ALL');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter & Search Logic
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search
      const searchMatch = !searchQuery || (
        patient.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.primary_symptoms?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        patient.primary_prakriti?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Prakriti Filter
      const prakritiMatch = prakritiFilter === 'ALL' || patient.primary_prakriti?.toLowerCase().includes(prakritiFilter.toLowerCase());

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
    if (p.includes('vata')) return 'accent'; // Muted gold / Earthy
    if (p.includes('pitta')) return 'warning'; // Solar warm
    if (p.includes('kapha')) return 'secondary'; // Sage green
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
      {/* Controls Bar: Search & Filters */}
      <div className="ayur-table-controls">
        <div className="ayur-table-search">
          <Search size={16} className="ayur-table-search__icon" />
          <input
            type="text"
            className="ayur-table-search__input"
            placeholder="Search patient, symptom, or dosha..."
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
          {/* Prakriti Filter */}
          <div className="ayur-filter-select-wrapper">
            <span className="ayur-filter-label">Prakriti:</span>
            <select
              className="ayur-filter-select"
              value={prakritiFilter}
              onChange={(e) => {
                setPrakritiFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Doshas</option>
              <option value="vata">Vāta Dominant</option>
              <option value="pitta">Pitta Dominant</option>
              <option value="kapha">Kapha Dominant</option>
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
              <th>Age / Sex</th>
              <th>Assessment Status</th>
              <th>Prakriti</th>
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
                <td colSpan="9" className="ayur-table-empty">
                  <div className="ayur-table-loading">
                    <div className="ayur-spinner-mini" />
                    <span>Loading patient clinical cohort...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedPatients.length === 0 ? (
              <tr>
                <td colSpan="9" className="ayur-table-empty">
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
                          <span className="ayur-patient-id">ID: AYU-{String(pt.id).padStart(4, '0')}</span>
                        </div>
                      </div>
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

                    {/* Prakriti */}
                    <td>
                      <span className={`ayur-dosha-chip ayur-dosha-chip--${getPrakritiBadgeColor(pt.primary_prakriti)}`}>
                        {pt.primary_prakriti || 'Vāta-Pitta'}
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
