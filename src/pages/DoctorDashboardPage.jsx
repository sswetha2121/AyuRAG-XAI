import React, { useState, useEffect } from 'react';
import './DoctorDashboardPage.css';
import { DoctorSummaryCards } from '../components/doctor/DoctorSummaryCards';
import { DoctorPatientTable } from '../components/doctor/DoctorPatientTable';
import { DoctorReviewNotesModal } from '../components/doctor/DoctorReviewNotesModal';
import { api } from '../services/api';
import {
  Calendar,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorDashboardPage = ({
  user,
  onNavigateToPatient,
  onNavigateToReviews,
  onNavigateToReports,
  onTriggerToast,
}) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReviewPatient, setSelectedReviewPatient] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);

  const fetchDashboard = async () => {
    try {
      setIsRefreshing(true);
      const data = await api.getDoctorDashboard();
      setDashboardData(data);
    } catch (err) {
      onTriggerToast?.({
        type: 'warning',
        title: 'Notice',
        message: 'Could not connect to live clinical backend. Operating in offline/cached mode.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const doctorName = dashboardData?.doctor?.name || user?.name || 'Dr. A. Sharma';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleOpenReview = (patientId, reviewId) => {
    const patientObj = dashboardData?.recent_patients?.find((p) => p.id === patientId);
    setSelectedReviewPatient(patientObj || { id: patientId, patient_name: 'Patient' });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (reviewFormData) => {
    try {
      setIsSavingReview(true);
      if (selectedReviewPatient?.latest_review_id) {
        await api.updateDoctorReview(selectedReviewPatient.latest_review_id, reviewFormData);
      } else {
        await api.createDoctorReview(reviewFormData);
      }

      onTriggerToast?.({
        type: 'success',
        title: 'Review Saved',
        message: `Clinical review for ${selectedReviewPatient?.patient_name} has been updated.`,
      });

      setIsReviewModalOpen(false);
      fetchDashboard();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save clinical review.',
      });
    } finally {
      setIsSavingReview(false);
    }
  };

  return (
    <div className="ayur-doctor-dashboard">
      {/* Clinical Greeting Header */}
      <div className="ayur-doc-header">
        <div className="ayur-doc-header__left">
          <div className="flex items-center gap-xs mb-xs">
            <span className="ayur-doc-status-indicator" />
            <span className="ayur-doc-subtitle">Clinical Decision Support Overview</span>
          </div>
          <h1 className="ayur-doc-greeting">
            Good morning, {doctorName}
          </h1>
          <p className="ayur-doc-meta">
            {dashboardData?.doctor?.qualification || 'BAMS, MD (Ayurveda)'} •{' '}
            {dashboardData?.doctor?.specialization || 'Kayachikitsa (Internal Medicine)'} • License:{' '}
            {dashboardData?.doctor?.license || 'AYUSH-DEL-2018-8492'}
          </p>
        </div>

        <div className="ayur-doc-header__right">
          <div className="ayur-doc-date-badge">
            <Calendar size={15} />
            <span>{currentDate}</span>
          </div>

          <button
            type="button"
            className="ayur-doc-refresh-btn"
            onClick={fetchDashboard}
            disabled={isRefreshing}
            title="Refresh clinical dashboard data"
          >
            <RefreshCw size={15} className={isRefreshing ? 'ayur-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <DoctorSummaryCards
        metrics={dashboardData?.metrics}
        isLoading={isLoading}
      />

      {/* Urgent Clinical Action Queue */}
      {dashboardData?.metrics?.pending_clinical_reviews > 0 && (
        <div className="ayur-action-callout">
          <div className="ayur-action-callout__content">
            <div className="ayur-action-callout__icon">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="ayur-action-callout__title">
                {dashboardData.metrics.pending_clinical_reviews} Patient Assessments Awaiting Review
              </h4>
              <p className="ayur-action-callout__desc">
                High-priority patient constitutional assessments with completed AI/ML inferences requiring physician sign-off.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateToReviews?.()}
            rightIcon={<ArrowRight size={14} />}
          >
            Open Review Queue
          </Button>
        </div>
      )}

      {/* Main Section Header */}
      <div className="ayur-section-header">
        <div>
          <h2 className="ayur-section-title">Patient Cohort & Assessment Registry</h2>
          <p className="ayur-section-desc">
            Filter, inspect AI inference metrics, and conduct clinical reviews
          </p>
        </div>
      </div>

      {/* Patient Table */}
      <DoctorPatientTable
        patients={dashboardData?.recent_patients || []}
        isLoading={isLoading}
        onViewPatient={(patientId) => onNavigateToPatient?.(patientId)}
        onReviewPatient={handleOpenReview}
        onOpenAssessment={(patientId) => onNavigateToPatient?.(patientId)}
      />

      {/* Doctor Review Notes Modal */}
      <DoctorReviewNotesModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        review={selectedReviewPatient?.reviews?.[0] || {}}
        patientName={selectedReviewPatient?.patient_name}
        assessmentId={selectedReviewPatient?.id}
        onSaveReview={handleSaveReview}
        isSaving={isSavingReview}
      />
    </div>
  );
};
