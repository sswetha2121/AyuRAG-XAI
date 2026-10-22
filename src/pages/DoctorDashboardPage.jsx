import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboardPage.css';
import { DoctorSummaryCards } from '../components/doctor/DoctorSummaryCards';
import { DoctorCohortAnalytics } from '../components/doctor/DoctorCohortAnalytics';
import { DoctorPatientTable } from '../components/doctor/DoctorPatientTable';
import { DoctorReviewNotesModal } from '../components/doctor/DoctorReviewNotesModal';
import { DoctorMonitoringView } from '../components/doctor/DoctorMonitoringView';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Utensils,
  Activity,
  PlusCircle,
  BrainCircuit,
  MessageSquare,
  FileCheck2
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorDashboardPage = ({
  user,
  onNavigateToPatient,
  onNavigateToReviews,
  onNavigateToReports,
  onTriggerToast,
}) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'monitoring'
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
        title: 'Connection Notice',
        message: 'Could not connect to live clinical backend. Operating in offline mode.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const doctorName = dashboardData?.doctor?.name || user?.name || 'Attending Physician';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePatientClick = (patientId) => {
    if (onNavigateToPatient) {
      onNavigateToPatient(patientId);
    } else {
      navigate(`/doctor/patients/${patientId}`);
    }
  };

  const handleOpenReview = (patientId, reviewId) => {
    const patientObj = dashboardData?.recent_patients?.find((p) => (p.patient || p.id) === patientId);
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

  const handleSummaryNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="ayur-doctor-dashboard">
      {/* 1. Header / Clinical Hero Banner */}
      <header className="ayur-doc-header">
        <div className="ayur-doc-header__left">
          <div className="flex items-center gap-xs mb-xs flex-wrap">
            <span className="ayur-doc-status-indicator" title="Clinical Decision Support Service Active" />
            <span className="ayur-doc-subtitle">Clinical Decision Support Overview</span>
            <span className="ayur-ai-live-tag">
              <Sparkles size={11} />
              <span>AyuRAG Grounded</span>
            </span>
          </div>

          <h1 className="ayur-doc-greeting">
            Good morning, {doctorName}
          </h1>

          <p className="ayur-doc-meta">
            {dashboardData?.doctor?.qualification || 'BAMS, MD (Ayurveda)'} •{' '}
            {dashboardData?.doctor?.specialization || 'Kayachikitsa (Internal Medicine)'} • License:{' '}
            <span className="font-mono text-text-primary font-semibold">{dashboardData?.doctor?.license || 'AYUSH-2026-DEL-891'}</span>
          </p>
        </div>

        <div className="ayur-doc-header__right">
          <div className="ayur-doc-date-badge">
            <Calendar size={14} className="text-secondary" />
            <span>{currentDate}</span>
          </div>

          <button
            type="button"
            className="ayur-doc-refresh-btn"
            onClick={fetchDashboard}
            disabled={isRefreshing}
            title="Sync clinical metrics and telemetry"
            aria-label="Sync clinical metrics"
          >
            <RefreshCw size={14} className={isRefreshing ? 'ayur-spin' : ''} />
            <span>Sync</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/doctor/diet-plans')}
            leftIcon={<PlusCircle size={15} />}
          >
            Generate Diet Plan
          </Button>
        </div>
      </header>

      {/* 2. Overview vs Live Telemetry Segmented Switch */}
      <div className="ayur-subtab-bar">
        <button
          type="button"
          className={`ayur-subtab-btn ${activeSubTab === 'overview' ? 'ayur-subtab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          <span>Diagnostic Overview & Queues</span>
        </button>
        <button
          type="button"
          className={`ayur-subtab-btn ${activeSubTab === 'monitoring' ? 'ayur-subtab-btn--active' : ''}`}
          onClick={() => setActiveSubTab('monitoring')}
        >
          <Activity size={14} />
          <span>Live Patient Diet Monitoring & Adherence</span>
        </button>
      </div>

      {activeSubTab === 'monitoring' ? (
        <DoctorMonitoringView
          onNavigateToPatient={handlePatientClick}
          onOpenDietPlan={() => navigate('/doctor/diet-plans')}
          onTriggerToast={onTriggerToast}
        />
      ) : (
        <>
          {/* 3. Four Aligned Summary Cards */}
          <DoctorSummaryCards
            metrics={dashboardData?.metrics}
            isLoading={isLoading}
            onNavigate={handleSummaryNavigate}
          />

          {/* 4. Urgent Clinical Action Banner (if pending reviews exist) */}
          {(dashboardData?.metrics?.pending_clinical_reviews > 0 || dashboardData?.metrics?.unverified_assessments > 0) && (
            <div className="ayur-action-callout">
              <div className="ayur-action-callout__content">
                <div className="ayur-action-callout__icon">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="ayur-action-callout__title">
                    {(dashboardData?.metrics?.pending_clinical_reviews || 0) + (dashboardData?.metrics?.unverified_assessments || 0)} Patient Cases Require Clinical Attention
                  </h4>
                  <p className="ayur-action-callout__desc">
                    {dashboardData?.metrics?.pending_clinical_reviews || 0} reviews pending sign-off and {dashboardData?.metrics?.unverified_assessments || 0} baseline intake assessments requiring physician field verification.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigateToReviews ? onNavigateToReviews() : navigate('/doctor/reviews')}
                rightIcon={<ArrowRight size={14} />}
              >
                Open Review Queue
              </Button>
            </div>
          )}

          {/* 5. Real Data Analytics (Prakriti Distribution & Clinical Health Bars) */}
          <DoctorCohortAnalytics
            patients={dashboardData?.recent_patients || []}
            metrics={dashboardData?.metrics || {}}
            isLoading={isLoading}
          />

          {/* 6. Clinical Action Queues (3 Aligned Cards) */}
          <section className="ayur-workflow-queues-section" aria-labelledby="action-queues-title">
            <div className="ayur-section-header">
              <div>
                <h2 id="action-queues-title" className="ayur-section-title">Clinical Action Queues</h2>
                <p className="ayur-section-desc">
                  Patients requiring verification, diet plans awaiting approval, and recently activated regimens
                </p>
              </div>
            </div>

            <div className="ayur-wqueues-grid">
              {/* Queue 1: Patients Requiring Verification */}
              <div className="ayur-wqueue-card">
                <div className="ayur-wqueue-card__header">
                  <div className="flex items-center gap-xs">
                    <ShieldCheck size={18} className="text-warning shrink-0" />
                    <h3 className="ayur-wqueue-title">Patients Requiring Verification</h3>
                  </div>
                  <span className="ayur-wqueue-badge ayur-wqueue-badge--warning">
                    {dashboardData?.patients_requiring_verification?.length || 0}
                  </span>
                </div>

                <div className="ayur-wqueue-list">
                  {(dashboardData?.patients_requiring_verification || []).map((pt) => (
                    <div key={pt.id} className="ayur-wqueue-item">
                      <div className="ayur-witem-left">
                        <span className="ayur-witem-name">{pt.patient_name}</span>
                        <span className="ayur-witem-sub">
                          {pt.primary_prakriti || 'Assessment Completed'} • Age {pt.patient_age}
                        </span>
                      </div>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handlePatientClick(pt.patient || pt.id)}
                      >
                        Verify
                      </Button>
                    </div>
                  ))}
                  {(!dashboardData?.patients_requiring_verification || dashboardData.patients_requiring_verification.length === 0) && (
                    <p className="ayur-wqueue-empty">All submitted patient assessments are fully verified.</p>
                  )}
                </div>
              </div>

              {/* Queue 2: Plans Awaiting Approval */}
              <div className="ayur-wqueue-card">
                <div className="ayur-wqueue-card__header">
                  <div className="flex items-center gap-xs">
                    <Utensils size={18} className="text-secondary shrink-0" />
                    <h3 className="ayur-wqueue-title">Plans Awaiting Approval</h3>
                  </div>
                  <span className="ayur-wqueue-badge ayur-wqueue-badge--accent">
                    {dashboardData?.plans_awaiting_approval_queue?.length || 0}
                  </span>
                </div>

                <div className="ayur-wqueue-list">
                  {(dashboardData?.plans_awaiting_approval_queue || []).map((pl) => (
                    <div key={pl.id} className="ayur-wqueue-item">
                      <div className="ayur-witem-left">
                        <span className="ayur-witem-name">{pl.patient_name}</span>
                        <span className="ayur-witem-sub">
                          v{pl.version} • {pl.status} • {pl.generated_by || 'AI-Assisted'}
                        </span>
                      </div>
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={() => navigate('/doctor/diet-plans')}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                  {(!dashboardData?.plans_awaiting_approval_queue || dashboardData.plans_awaiting_approval_queue.length === 0) && (
                    <p className="ayur-wqueue-empty">No pending diet plans waiting for approval.</p>
                  )}
                </div>
              </div>

              {/* Queue 3: Recently Activated Regimens */}
              <div className="ayur-wqueue-card">
                <div className="ayur-wqueue-card__header">
                  <div className="flex items-center gap-xs">
                    <CheckCircle2 size={18} className="text-success shrink-0" />
                    <h3 className="ayur-wqueue-title">Recently Activated Regimens</h3>
                  </div>
                  <span className="ayur-wqueue-badge ayur-wqueue-badge--success">
                    {dashboardData?.recent_active_diet_plans?.length || 0}
                  </span>
                </div>

                <div className="ayur-wqueue-list">
                  {(dashboardData?.recent_active_diet_plans || []).map((pl) => (
                    <div key={pl.id} className="ayur-wqueue-item">
                      <div className="ayur-witem-left">
                        <span className="ayur-witem-name">{pl.patient_name}</span>
                        <span className="ayur-witem-sub">
                          v{pl.version} • {pl.approved_at ? `Approved ${new Date(pl.approved_at).toLocaleDateString()}` : 'Active'}
                        </span>
                      </div>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handlePatientClick(pl.patient)}
                      >
                        Inspect
                      </Button>
                    </div>
                  ))}
                  {(!dashboardData?.recent_active_diet_plans || dashboardData.recent_active_diet_plans.length === 0) && (
                    <p className="ayur-wqueue-empty">No active regimens activated yet.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 7. Patient Review Queue & Cohort Registry Table */}
          <section className="ayur-registry-section" aria-labelledby="cohort-registry-title">
            <div className="ayur-section-header">
              <div>
                <h2 id="cohort-registry-title" className="ayur-section-title">Patient Cohort & Assessment Registry</h2>
                <p className="ayur-section-desc">
                  Filter, inspect AI inference metrics, and conduct clinical reviews across your patient roster
                </p>
              </div>
            </div>

            <DoctorPatientTable
              patients={dashboardData?.recent_patients || []}
              isLoading={isLoading}
              onViewPatient={handlePatientClick}
              onReviewPatient={handleOpenReview}
              onOpenAssessment={handlePatientClick}
              onOpenDietPlan={() => navigate('/doctor/diet-plans')}
              onRefreshCohort={fetchDashboard}
              onTriggerToast={onTriggerToast}
            />
          </section>
        </>
      )}

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
