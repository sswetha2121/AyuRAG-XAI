import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { useAssessment } from '../context/AssessmentContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  DashboardHeader,
  DashboardNavTabs,
  TridoshaCard,
  XaiFeatureImportance,
  RecommendationsGrid,
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
  Clock,
  Calendar,
  Utensils,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DashboardPage = ({
  onStartAssessment,
  onReevaluate,
  onTriggerToast
}) => {
  const {
    analysisResult,
    triggerAnalysisGeneration,
    loadDemoPreset,
    personalInfo
  } = useAssessment();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [hasFetchedAssessment, setHasFetchedAssessment] = useState(false);

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

  // Effective constitutional profile from analysisResult, or latestAssessment, or default
  const constitutionType =
    analysisResult?.tridoshaProfile?.constitutionType ||
    latestAssessment?.prakriti_scores?.primary ||
    'Balanced';

  const tridoshaProfile = analysisResult?.tridoshaProfile || {
    constitutionType: constitutionType,
    breakdown: {
      vata: latestAssessment?.prakriti_scores?.vata || 38,
      pitta: latestAssessment?.prakriti_scores?.pitta || 36,
      kapha: latestAssessment?.prakriti_scores?.kapha || 26,
    },
    primaryDosha: constitutionType,
    secondaryDosha: 'Metabolic & Movement Factors',
    summary: 'Your body constitution assessment reflects individual metabolic and movement tendencies.',
  };

  const xaiFeatures = analysisResult?.xaiFeatures || latestAssessment?.shap_explanations || [
    { feature: 'Meal Timing Regularity', importance: 0.38, direction: 'positive', description: 'Consistent meal hours stabilize digestive metabolism.' },
    { feature: 'Warm Food Preference', importance: 0.29, direction: 'positive', description: 'Nourishing warm foods support comfortable digestion.' },
    { feature: 'Sleep Duration & Timing', importance: 0.22, direction: 'positive', description: 'Regular rest schedule supports metabolic rhythm.' }
  ];

  const evidenceCitations = analysisResult?.evidenceCitations || latestAssessment?.rag_evidence || [];
  const recommendations = analysisResult?.recommendations || latestAssessment?.recommendations || {
    diet: ['Eat freshly prepared, warm meals', 'Include whole grains and yellow lentils', 'Avoid iced cold drinks with meals'],
    lifestyle: ['Maintain regular waking hours by 06:30 AM', 'Practice 15 minutes of calm breathing', 'Finish dinner 3 hours before sleep']
  };

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
            Track your meals, what you should eat, and stay on schedule with doctor-approved nutrition
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
            Update Assessment
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <DashboardNavTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
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
            <TridoshaCard tridoshaProfile={tridoshaProfile} />

            {/* Digestive Metabolism */}
            <DigestiveAgniCard />

            {/* Explainable AI Factors */}
            <XaiFeatureImportance features={xaiFeatures} />

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
            <TridoshaCard tridoshaProfile={tridoshaProfile} />
            <DigestiveAgniCard />
            <XaiFeatureImportance features={xaiFeatures} />
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

      {/* Reminders Modal */}
      <PatientRemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        onTriggerToast={onTriggerToast}
      />
    </div>
  );
};
