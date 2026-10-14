import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useAssessment } from '../context/AssessmentContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  DashboardNavTabs,
  TridoshaCard,
  XaiFeatureImportance,
  EvidenceSection,
  DailyRoutineTimetable,
  DigestiveAgniCard,
  EmptyAssessmentState,
  PatientActiveDietCard,
  PatientMealTracker,
  PatientRemindersModal,
  PatientProgressTracker
} from '../components/dashboard';
import {
  Bell,
  Calendar,
  Sparkles,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DashboardPage = ({
  initialTab = 'overview',
  activeTab: propActiveTab,
  onTabChange,
  onStartAssessment,
  onReevaluate,
  onTriggerToast
}) => {
  const {
    analysisResult,
    loadDemoPreset,
    personalInfo
  } = useAssessment();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(propActiveTab || initialTab);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [hasFetchedAssessment, setHasFetchedAssessment] = useState(false);

  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Fetch persisted assessment if user is logged in
  useEffect(() => {
    let isMounted = true;
    api.getPatientLatestAssessment()
      .then((res) => {
        if (isMounted) {
          if (res?.has_assessment && res.assessment) {
            setLatestAssessment(res.assessment);
          }
          setHasFetchedAssessment(true);
        }
      })
      .catch(() => {
        if (isMounted) setHasFetchedAssessment(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const patientName = user?.name || personalInfo?.fullName || latestAssessment?.demographics?.fullName || 'Patient';
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const hasAssessmentData = Boolean(analysisResult || latestAssessment);

  const constitutionType =
    analysisResult?.tridoshaProfile?.constitutionType ||
    latestAssessment?.prakriti_scores?.primary ||
    'Balanced';

  const agniPattern =
    analysisResult?.digestiveAgni?.state ||
    'Viṣamāgni (Variable Digestive Fire)';

  const tridoshaProfile = analysisResult?.tridoshaProfile || (latestAssessment?.prakriti_scores ? {
    constitutionType: constitutionType,
    breakdown: {
      vata: latestAssessment.prakriti_scores.vata || 33,
      pitta: latestAssessment.prakriti_scores.pitta || 33,
      kapha: latestAssessment.prakriti_scores.kapha || 34,
    },
    primaryDosha: constitutionType,
    secondaryDosha: 'Clinical Assessment Record',
    summary: 'Your body constitution assessment reflects individual metabolic and movement tendencies recorded in your clinical chart.',
  } : null);

  const xaiFeatures = analysisResult?.xaiFeatures || latestAssessment?.shap_explanations || [];
  const evidenceCitations = analysisResult?.evidenceCitations || latestAssessment?.rag_evidence || [];

  const dailyRoutineTimetable = analysisResult?.dailyRoutineTimetable || [
    { time: '06:30 AM', activity: 'Wake Up & Warm Water', category: 'Morning Cleansing' },
    { time: '08:00 AM', activity: 'Wholesome Warm Breakfast', category: 'Meal Schedule' },
    { time: '11:00 AM', activity: 'Mid-Morning Hydration', category: 'Hydration' },
    { time: '01:30 PM', activity: 'Main Lunch Meal', category: 'Meal Schedule' },
    { time: '05:00 PM', activity: 'Evening Herbal Tea', category: 'Refreshment' },
    { time: '08:00 PM', activity: 'Light Evening Dinner', category: 'Meal Schedule' },
    { time: '10:30 PM', activity: 'Restful Night Sleep', category: 'Recovery' }
  ];

  return (
    <div className="ayur-dashboard-page">
      {/* 1. Dashboard Top Header */}
      <div className="ayur-dash-welcome-banner">
        <div className="ayur-dash-welcome-left">
          <div className="ayur-dash-date-chip">
            <Calendar size={14} />
            <span>{currentDateFormatted}</span>
          </div>
          <h2 className="ayur-dash-welcome-title">Welcome back, {patientName}</h2>
          <p className="ayur-dash-welcome-subtitle">
            {hasAssessmentData
              ? `Your personalized nutrition and daily routine is calibrated for your ${constitutionType} profile.`
              : 'Complete your initial 10-minute assessment to unlock personalized doctor-reviewed wellness recommendations.'}
          </p>
        </div>

        <div className="ayur-dash-welcome-actions">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsRemindersModalOpen(true)}
            leftIcon={<Bell size={16} />}
          >
            Meal Reminders
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onStartAssessment || (() => window.location.href = '/assessment-overview')}
            leftIcon={<Sparkles size={16} />}
          >
            {hasAssessmentData ? 'Update Assessment' : 'Start Assessment'}
          </Button>
        </div>
      </div>

      {/* Demo Warning Banner */}
      {analysisResult?.isDemo && (
        <div className="ayur-demo-banner">
          <AlertCircle size={20} className="shrink-0 text-warning" />
          <div>
            <strong>Demonstration Profile Active:</strong> {analysisResult.demoNotice || 'This is an offline synthesized demonstration profile. It is isolated from live clinical records.'}
          </div>
        </div>
      )}

      {/* When no assessment exists and loading is finished, present explicit Empty State */}
      {!hasAssessmentData && hasFetchedAssessment ? (
        <EmptyAssessmentState
          onStartAssessment={onStartAssessment || (() => window.location.href = '/assessment-overview')}
          onLoadDemo={loadDemoPreset}
        />
      ) : (
        <>
          {/* 2. Navigation Tabs */}
          <DashboardNavTabs
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />

          {/* 3. Tab Contents */}
          <div className="ayur-dash-tab-content">
            {activeTab === 'overview' && (
              <div className="ayur-dash-overview-stack">
                {/* Daily Meal Tracker: Next meal, today's schedule, what to eat, water */}
                <PatientMealTracker
                  onTriggerToast={onTriggerToast}
                  onOpenReminders={() => setIsRemindersModalOpen(true)}
                />

                {/* Active Approved Diet Plan */}
                <PatientActiveDietCard />

                {/* Weekly Progress Overview */}
                <PatientProgressTracker onTriggerToast={onTriggerToast} />

                {/* Body Constitution Overview */}
                {tridoshaProfile && <TridoshaCard tridoshaProfile={tridoshaProfile} />}

                {/* Digestive Metabolism */}
                <DigestiveAgniCard agniPattern={agniPattern} />

                {/* Explainable AI Factors */}
                {xaiFeatures.length > 0 && <XaiFeatureImportance features={xaiFeatures} />}

                {/* Daily Timetable */}
                <DailyRoutineTimetable timetable={dailyRoutineTimetable} />
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="ayur-dash-tab-pane">
                <PatientMealTracker
                  onTriggerToast={onTriggerToast}
                  onOpenReminders={() => setIsRemindersModalOpen(true)}
                />
              </div>
            )}

            {activeTab === 'diet' && (
              <div className="ayur-dash-tab-pane">
                <PatientActiveDietCard />
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="ayur-dash-tab-pane">
                <PatientProgressTracker onTriggerToast={onTriggerToast} />
              </div>
            )}

            {activeTab === 'constitution' && (
              <div className="ayur-dash-tab-pane">
                {tridoshaProfile && <TridoshaCard tridoshaProfile={tridoshaProfile} />}
                <DigestiveAgniCard agniPattern={agniPattern} />
                {xaiFeatures.length > 0 && <XaiFeatureImportance features={xaiFeatures} />}
              </div>
            )}

            {activeTab === 'routine' && (
              <div className="ayur-dash-tab-pane">
                <DailyRoutineTimetable timetable={dailyRoutineTimetable} />
              </div>
            )}

            {activeTab === 'evidence' && (
              <div className="ayur-dash-tab-pane">
                <EvidenceSection citations={evidenceCitations} />
              </div>
            )}
          </div>
        </>
      )}

      {/* Reminders Modal */}
      <PatientRemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        onTriggerToast={onTriggerToast}
      />
    </div>
  );
};
