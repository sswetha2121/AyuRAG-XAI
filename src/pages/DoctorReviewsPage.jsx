import React, { useState, useEffect } from 'react';
import './DoctorReviewsPage.css';
import { DoctorReviewNotesModal } from '../components/doctor/DoctorReviewNotesModal';
import { api } from '../services/api';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  CheckSquare,
  Search,
  Filter,
  ArrowRight,
  User,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorReviewsPage = ({
  onNavigateToPatient,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'IN_REVIEW' | 'COMPLETED'
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDoctorReviews(activeTab === 'ALL' ? '' : activeTab);
      setReviews(data.reviews || []);
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Reviews Load Error',
        message: err.message || 'Could not load clinical reviews queue.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const handleOpenEditReview = (reviewObj) => {
    setSelectedReview(reviewObj);
    setIsModalOpen(true);
  };

  const handleSaveReview = async (formData) => {
    try {
      setIsSaving(true);
      if (selectedReview?.id) {
        await api.updateDoctorReview(selectedReview.id, formData);
      } else {
        await api.createDoctorReview(formData);
      }

      onTriggerToast?.({
        type: 'success',
        title: 'Review Saved',
        message: `Clinical review notes recorded successfully.`,
      });

      setIsModalOpen(false);
      fetchReviews();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Save Error',
        message: err.message || 'Failed to save clinical review.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredReviews = reviews.filter((rev) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      rev.patient_name?.toLowerCase().includes(q) ||
      rev.summary?.toLowerCase().includes(q) ||
      rev.observations?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="ayur-rev-badge ayur-rev-badge--success">Completed</span>;
      case 'IN_REVIEW':
        return <span className="ayur-rev-badge ayur-rev-badge--info">In Review</span>;
      case 'PENDING':
      default:
        return <span className="ayur-rev-badge ayur-rev-badge--warning">Pending Review</span>;
    }
  };

  return (
    <div className="ayur-doctor-reviews-page">
      {/* Header */}
      <div className="ayur-reviews-header">
        <div>
          <h1 className="ayur-reviews-title">Clinical Review & Validation Queue</h1>
          <p className="ayur-reviews-desc">
            Independent physician evaluation of ML predictions, RAG knowledge groundings, and personalized protocols
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="ayur-reviews-tabs-bar">
        <div className="ayur-reviews-tabs">
          {[
            { id: 'ALL', label: 'All Reviews' },
            { id: 'PENDING', label: 'Pending Reviews' },
            { id: 'IN_REVIEW', label: 'In Progress' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`ayur-reviews-tab ${activeTab === tab.id ? 'ayur-reviews-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="ayur-reviews-search">
          <Search size={15} className="ayur-search-icon" />
          <input
            type="text"
            className="ayur-search-input"
            placeholder="Search patient or observations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews Queue Cards */}
      <div className="ayur-reviews-grid">
        {isLoading ? (
          <div className="ayur-reviews-empty">
            <div className="ayur-spinner-mini" />
            <span>Loading reviews queue...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="ayur-reviews-empty">
            <CheckCircle2 size={32} className="text-secondary mb-sm" />
            <h3>No Reviews in This Queue</h3>
            <p>All clinical assessments in this category have been processed or none match criteria.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="ayur-review-item-card">
              <div className="ayur-review-item__header">
                <div className="flex items-center gap-sm">
                  <div className="ayur-rev-avatar">
                    {(rev.patient_name || 'PT')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="ayur-rev-patient-name">{rev.patient_name}</h3>
                    <span className="ayur-rev-asm-id">Assessment ID #{rev.assessment}</span>
                  </div>
                </div>

                <div className="flex items-center gap-xs">
                  {getStatusBadge(rev.status)}
                </div>
              </div>

              <div className="ayur-review-item__body">
                {rev.summary ? (
                  <p className="ayur-rev-summary-text">{rev.summary}</p>
                ) : (
                  <p className="ayur-rev-summary-placeholder">
                    No preliminary notes yet. Open review form to record clinical impression.
                  </p>
                )}

                {rev.observations && (
                  <div className="ayur-rev-sub-note">
                    <strong>Observations:</strong> {rev.observations}
                  </div>
                )}

                {rev.recommendations && (
                  <div className="ayur-rev-sub-note">
                    <strong>Adjustments:</strong> {rev.recommendations}
                  </div>
                )}
              </div>

              <div className="ayur-review-item__footer">
                <span className="ayur-rev-date">
                  Updated: {new Date(rev.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>

                <div className="flex items-center gap-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToPatient?.(rev.assessment)}
                    leftIcon={<Eye size={14} />}
                  >
                    Inspect Profile
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenEditReview(rev)}
                    leftIcon={<CheckSquare size={14} />}
                  >
                    Edit Review
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <DoctorReviewNotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        review={selectedReview || {}}
        patientName={selectedReview?.patient_name}
        assessmentId={selectedReview?.assessment}
        onSaveReview={handleSaveReview}
        isSaving={isSaving}
      />
    </div>
  );
};
