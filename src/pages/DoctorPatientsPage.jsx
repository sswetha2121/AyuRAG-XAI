import React, { useState, useEffect } from 'react';
import { DoctorPatientTable } from '../components/doctor/DoctorPatientTable';
import { DoctorReviewNotesModal } from '../components/doctor/DoctorReviewNotesModal';
import { api } from '../services/api';
import { Users, UserPlus, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorPatientsPage = ({
  onNavigateToPatient,
  onTriggerToast,
}) => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReviewPatient, setSelectedReviewPatient] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);

  const fetchPatients = async () => {
    try {
      setIsRefreshing(true);
      const data = await api.getDoctorPatients();
      setPatients(data.patients || []);
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Cohort Load Failed',
        message: err.message || 'Could not load patient registry.',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenReview = (patientId, reviewId) => {
    const patientObj = patients.find((p) => p.id === patientId);
    setSelectedReviewPatient(patientObj || { id: patientId, patient_name: 'Patient' });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (formData) => {
    try {
      setIsSavingReview(true);
      if (selectedReviewPatient?.latest_review_id) {
        await api.updateDoctorReview(selectedReviewPatient.latest_review_id, formData);
      } else {
        await api.createDoctorReview(formData);
      }

      onTriggerToast?.({
        type: 'success',
        title: 'Review Saved',
        message: `Clinical review recorded for ${selectedReviewPatient?.patient_name}.`,
      });

      setIsReviewModalOpen(false);
      fetchPatients();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save review.',
      });
    } finally {
      setIsSavingReview(false);
    }
  };

  return (
    <div className="ayur-doctor-patients-page flex flex-col gap-lg">
      <div className="ayur-reviews-header">
        <div className="flex items-center justify-between flex-wrap gap-md">
          <div>
            <h1 className="ayur-reviews-title">Patient Intake & Assessment Cohort</h1>
            <p className="ayur-reviews-desc">
              Manage patient clinical profiles, constitutional baseline evaluations, and diagnostic records
            </p>
          </div>

          <button
            type="button"
            className="ayur-doc-refresh-btn"
            onClick={fetchPatients}
            disabled={isRefreshing}
            title="Refresh cohort records"
          >
            <RefreshCw size={15} className={isRefreshing ? 'ayur-spin' : ''} />
            <span>Sync Registry</span>
          </button>
        </div>
      </div>

      <DoctorPatientTable
        patients={patients}
        isLoading={isLoading}
        onViewPatient={(patientId) => onNavigateToPatient?.(patientId)}
        onReviewPatient={handleOpenReview}
        onOpenAssessment={(patientId) => onNavigateToPatient?.(patientId)}
      />

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
