import React, { useState, useEffect } from 'react';
import './DoctorPatientProfilePage.css';
import { DoctorAIExplainability } from '../components/doctor/DoctorAIExplainability';
import { DoctorReviewNotesModal } from '../components/doctor/DoctorReviewNotesModal';
import { DoctorPatientVerification } from '../components/doctor/DoctorPatientVerification';
import { DoctorDietPlanEditor } from '../components/doctor/DoctorDietPlanEditor';
import { DoctorPatientAuditTrail } from '../components/doctor/DoctorPatientAuditTrail';
import { DoctorPatientBaseline } from '../components/doctor/DoctorPatientBaseline';
import { api } from '../services/api';
import {
  User,
  ArrowLeft,
  Calendar,
  Sparkles,
  HeartPulse,
  Utensils,
  Moon,
  AlertCircle,
  FileCheck,
  CheckSquare,
  ShieldCheck,
  Activity,
  Droplets,
  Flame,
  FileText,
  History,
  Layers
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorPatientProfilePage = ({
  patientId,
  onBack,
  onTriggerToast,
}) => {
  const [patientData, setPatientData] = useState(null);
  const [effectiveProfile, setEffectiveProfile] = useState(null);
  const [verificationStats, setVerificationStats] = useState({ total_fields: 0, verified: 0, corrected: 0, unverified: 0 });
  const [activeWorkflowTab, setActiveWorkflowTab] = useState('verification'); // 'verification' | 'diet' | 'xai' | 'assessment' | 'audit'
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);

  const cleanedId = String(patientId || '').replace(/^AYU-0*/i, '') || patientId;

  const fetchPatientDetail = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDoctorPatientDetail(cleanedId);
      setPatientData(data);
      // Record clinical case access
      api.recordPatientAuditLog(cleanedId, {
        action: 'CASE_ACCESSED',
        metadata: {
          view: 'clinical_profile',
          is_demo: data?.is_demo !== false,
          patient_name: data?.patient_name
        }
      }).catch(() => {});
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Patient Load Failed',
        message: err.message || 'Could not fetch patient clinical profile.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientDetail();
    }
  }, [patientId]);

  const handleSaveReview = async (reviewFormData) => {
    try {
      setIsSavingReview(true);
      const existingReview = patientData?.reviews?.[0];
      if (existingReview?.id) {
        await api.updateDoctorReview(existingReview.id, reviewFormData);
      } else {
        await api.createDoctorReview(reviewFormData);
      }

      onTriggerToast?.({
        type: 'success',
        title: 'Review Saved',
        message: `Clinical review for ${patientData?.patient_name} has been updated.`,
      });

      setIsReviewModalOpen(false);
      fetchPatientDetail();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Error',
        message: err.message || 'Could not save clinical review.',
      });
    } finally {
      setIsSavingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ayur-profile-loading">
        <div className="ayur-spinner-mini" />
        <span>Loading comprehensive patient clinical profile...</span>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="ayur-profile-error">
        <h3>Patient Not Found</h3>
        <p>The requested patient record could not be loaded.</p>
        <Button variant="outline" onClick={onBack} leftIcon={<ArrowLeft size={16} />}>
          Back to Cohort
        </Button>
      </div>
    );
  }

  const pScores = patientData.prakriti_scores || { vata: 40, pitta: 35, kapha: 25, primary: 'Movement & Metabolism' };
  const latestReview = patientData.reviews?.[0];

  return (
    <div className="ayur-patient-profile-page">
      {/* Top Navigation & Action Bar */}
      <div className="ayur-profile-action-bar">
        <button type="button" className="ayur-back-link" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Patient Registry</span>
        </button>

        <div className="flex items-center gap-sm">
          <Button
            variant="primary"
            onClick={() => setIsReviewModalOpen(true)}
            leftIcon={<CheckSquare size={16} />}
          >
            {latestReview?.status === 'COMPLETED' ? 'Update Clinical Review' : 'Conduct Clinical Review'}
          </Button>
        </div>
      </div>

      {/* 1. Patient Overview Header Card */}
      <div className="ayur-patient-hero-card">
        <div className="ayur-patient-hero__left">
          <div className="ayur-patient-avatar-large">
            {(patientData.patient_name || 'PT')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <h1 className="ayur-patient-hero__name">{patientData.patient_name}</h1>
              <span className="ayur-patient-id-badge">ID: AYU-{String(patientData.id).padStart(4, '0')}</span>
              {patientData.is_demo !== false && (
                <span className="ayur-demo-badge">DEMO PATIENT</span>
              )}
            </div>
            <p className="ayur-patient-hero__meta">
              <span>{patientData.patient_age} Years</span> • <span>{patientData.patient_gender}</span> •{' '}
              <span>Climate: {patientData.demographics?.climate || 'Tropical / Coastal'}</span> •{' '}
              <span>Location: {patientData.demographics?.location || 'Bangalore, India'}</span>
            </p>
          </div>
        </div>

        <div className="ayur-patient-hero__right">
          <div className="ayur-hero-stat">
            <span className="ayur-hero-stat__label">Assessment Status</span>
            <span className="ayur-hero-stat__val text-success">
              {patientData.status === 'COMPLETED' ? 'Completed (100%)' : 'In Progress'}
            </span>
          </div>

          <div className="ayur-hero-stat">
            <span className="ayur-hero-stat__label">Doctor Review</span>
            <span className={`ayur-hero-stat__val ${latestReview?.status === 'COMPLETED' ? 'text-success' : 'text-accent'}`}>
              {latestReview?.status || 'PENDING'}
            </span>
          </div>

          <div className="ayur-hero-stat">
            <span className="ayur-hero-stat__label">Assessment Date</span>
            <span className="ayur-hero-stat__val">
              {new Date(patientData.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Existing Doctor Review Banner if Present */}
      {latestReview && latestReview.summary && (
        <div className="ayur-review-banner">
          <div className="ayur-review-banner__header">
            <div className="flex items-center gap-xs">
              <FileCheck size={16} className="text-success" />
              <h4 className="ayur-review-banner__title">
                Physician Evaluation by {latestReview.doctor_name || 'Attending Physician'} [{latestReview.status}]
              </h4>
            </div>
            <span className="ayur-review-banner__date">
              Updated {new Date(latestReview.updated_at).toLocaleDateString()}
            </span>
          </div>
          <p className="ayur-review-banner__summary">{latestReview.summary}</p>
          {latestReview.observations && (
            <div className="ayur-review-banner__sub">
              <strong>Observations:</strong> {latestReview.observations}
            </div>
          )}
          {latestReview.recommendations && (
            <div className="ayur-review-banner__sub">
              <strong>Approved Regimen:</strong> {latestReview.recommendations}
            </div>
          )}
          {latestReview.follow_up_notes && (
            <div className="ayur-review-banner__sub">
              <strong>Follow-Up:</strong> {latestReview.follow_up_notes}
            </div>
          )}
        </div>
      )}

      {/* Workflow Navigation Tabs */}
      <div className="ayur-workflow-nav">
        <button
          type="button"
          className={`ayur-wnav-item ${activeWorkflowTab === 'verification' ? 'ayur-wnav-item--active' : ''}`}
          onClick={() => setActiveWorkflowTab('verification')}
        >
          <ShieldCheck size={17} />
          <span>1. Clinical Verification</span>
        </button>

        <button
          type="button"
          className={`ayur-wnav-item ${activeWorkflowTab === 'diet' ? 'ayur-wnav-item--active' : ''}`}
          onClick={() => setActiveWorkflowTab('diet')}
        >
          <Utensils size={17} />
          <span>2. Personalized Diet Plan & Rx</span>
        </button>

        <button
          type="button"
          className={`ayur-wnav-item ${activeWorkflowTab === 'xai' ? 'ayur-wnav-item--active' : ''}`}
          onClick={() => setActiveWorkflowTab('xai')}
        >
          <Sparkles size={17} />
          <span>3. XAI & RAG Evidence</span>
        </button>

        <button
          type="button"
          className={`ayur-wnav-item ${activeWorkflowTab === 'assessment' ? 'ayur-wnav-item--active' : ''}`}
          onClick={() => setActiveWorkflowTab('assessment')}
        >
          <Layers size={17} />
          <span>4. Baseline Assessment Data</span>
        </button>

        <button
          type="button"
          className={`ayur-wnav-item ${activeWorkflowTab === 'audit' ? 'ayur-wnav-item--active' : ''}`}
          onClick={() => setActiveWorkflowTab('audit')}
        >
          <History size={17} />
          <span>5. Audit Trail</span>
        </button>
      </div>

      {/* Tab 1: Clinical Verification Console */}
      {activeWorkflowTab === 'verification' && (
        <DoctorPatientVerification
          patientId={cleanedId}
          onProfileUpdated={setEffectiveProfile}
          onStatsUpdated={setVerificationStats}
          onTriggerToast={onTriggerToast}
        />
      )}

      {/* Tab 2: Diet Plan Generation & Clinical Editor */}
      {activeWorkflowTab === 'diet' && (
        <DoctorDietPlanEditor
          patientId={cleanedId}
          patientData={patientData}
          effectiveProfile={effectiveProfile}
          onTriggerToast={onTriggerToast}
        />
      )}

      {/* Tab 3: Explainable AI & Classical RAG Evidence */}
      {activeWorkflowTab === 'xai' && (
        <div className="ayur-xai-tab-wrapper">
          <div className="ayur-section-header">
            <div>
              <h2 className="ayur-section-title">Explainable AI Analysis & Knowledge Retrieval</h2>
              <p className="ayur-section-desc">
                Transparent algorithmic attributions and classical knowledge grounding
              </p>
            </div>
          </div>

          <DoctorAIExplainability
            aiAnalysis={patientData.ai_analysis}
            shapExplanations={patientData.shap_explanations}
            limeExplanations={patientData.lime_explanations}
            ragEvidence={patientData.rag_evidence}
            recommendations={patientData.recommendations}
          />
        </div>
      )}

      {/* Tab 4: Baseline Assessment Data */}
      {activeWorkflowTab === 'assessment' && (
        <DoctorPatientBaseline
          patientData={patientData}
          patientId={cleanedId}
          onSwitchToVerification={() => setActiveWorkflowTab('verification')}
        />
      )}

      {/* Tab 5: Clinical Audit Trail */}
      {activeWorkflowTab === 'audit' && (
        <DoctorPatientAuditTrail patientId={cleanedId} />
      )}

      {/* Review Notes Modal */}
      <DoctorReviewNotesModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        review={latestReview || {}}
        patientName={patientData.patient_name}
        assessmentId={patientData.id}
        unverifiedCount={verificationStats.unverified}
        onSaveReview={handleSaveReview}
        isSaving={isSavingReview}
      />
    </div>
  );
};
