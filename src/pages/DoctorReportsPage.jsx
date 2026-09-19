import React, { useState, useEffect } from 'react';
import './DoctorReportsPage.css';
import { api } from '../services/api';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorReportsPage = ({
  onTriggerToast,
  onNavigateToPatient,
}) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDoctorReports();
      setReports(data.reports || []);
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Reports Failed',
        message: err.message || 'Could not fetch clinical reports dataset.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrintReport = (report) => {
    window.print();
  };

  const handleExportJson = (report) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AyuRAG_Clinical_Report_${report.patient_name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onTriggerToast?.({
      type: 'success',
      title: 'Report Exported',
      message: `Clinical summary JSON generated for ${report.patient_name}.`,
    });
  };

  const filteredReports = reports.filter((rep) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      rep.patient_name?.toLowerCase().includes(q) ||
      rep.primary_prakriti?.toLowerCase().includes(q) ||
      rep.ai_prediction?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="ayur-doctor-reports-page">
      {/* Header */}
      <div className="ayur-reports-header">
        <div>
          <h1 className="ayur-reports-title">Clinical Assessment Reports & Audit Registry</h1>
          <p className="ayur-reports-desc">
            Standardized multi-domain Ayurvedic clinical dossiers, XAI attribution records, and physician review signatures
          </p>
        </div>

        <div className="ayur-reports-meta-chip">
          <ShieldCheck size={16} className="text-secondary" />
          <span>CCRAS Validated Architecture</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="ayur-reports-bar">
        <div className="ayur-reports-search">
          <Search size={15} className="ayur-search-icon" />
          <input
            type="text"
            className="ayur-search-input"
            placeholder="Search by patient, prakriti, or AI prediction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ayur-reports-count">
          Showing {filteredReports.length} Clinical Dossiers
        </div>
      </div>

      {/* Reports List */}
      <div className="ayur-reports-list">
        {isLoading ? (
          <div className="ayur-reports-loading">
            <div className="ayur-spinner-mini" />
            <span>Compiling clinical summaries...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="ayur-reports-empty">
            <FileBarChart size={32} className="text-muted mb-sm" />
            <h3>No Reports Found</h3>
            <p>No assessment records match your search query.</p>
          </div>
        ) : (
          filteredReports.map((rep) => (
            <div key={rep.assessment_id} className="ayur-report-card">
              <div className="ayur-report-card__header">
                <div>
                  <div className="flex items-center gap-sm mb-xs">
                    <h3 className="ayur-report-patient-name">{rep.patient_name}</h3>
                    <span className="ayur-report-demog">
                      {rep.age} yrs • {rep.gender}
                    </span>
                    <span className="ayur-report-prakriti-tag">
                      {rep.primary_prakriti}
                    </span>
                  </div>
                  <span className="ayur-report-date">
                    Assessment Recorded: {rep.assessment_date}
                  </span>
                </div>

                <div className="flex items-center gap-xs">
                  <span className={`ayur-report-status-pill ayur-report-status-pill--${rep.review_status.toLowerCase()}`}>
                    {rep.review_status === 'COMPLETED' ? 'Physician Validated' : 'Pending Review'}
                  </span>
                </div>
              </div>

              <div className="ayur-report-card__body">
                <div className="ayur-report-grid-3">
                  <div className="ayur-report-block">
                    <span className="ayur-report-label">AI / ML Inference</span>
                    <strong className="ayur-report-val">{rep.ai_prediction}</strong>
                    <span className="ayur-report-subval">{Math.round(rep.confidence * 100)}% Confidence</span>
                  </div>

                  <div className="ayur-report-block">
                    <span className="ayur-report-label">Physician Review Summary</span>
                    <p className="ayur-report-val ayur-report-val--text">{rep.review_summary}</p>
                    {rep.reviewed_by && (
                      <span className="ayur-report-subval">Reviewer: {rep.reviewed_by}</span>
                    )}
                  </div>

                  <div className="ayur-report-block">
                    <span className="ayur-report-label">Classical Samhita Citations</span>
                    <ul className="ayur-report-citations">
                      {rep.evidence_citations?.map((cit, cIdx) => (
                        <li key={cIdx}>{cit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="ayur-report-card__footer">
                <div className="flex items-center gap-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToPatient?.(rep.assessment_id)}
                    leftIcon={<ExternalLink size={13} />}
                  >
                    Inspect Full Assessment
                  </Button>
                </div>

                <div className="flex items-center gap-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportJson(rep)}
                    leftIcon={<Download size={13} />}
                  >
                    Export JSON
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePrintReport(rep)}
                    leftIcon={<Printer size={13} />}
                  >
                    Print Summary
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
