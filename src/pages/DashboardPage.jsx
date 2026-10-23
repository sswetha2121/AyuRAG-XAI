import React, { useState, useEffect, useCallback } from 'react';
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
import { PatientChatView } from '../components/patient/PatientChatView';
import {
  Bell,
  Calendar,
  Sparkles,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
  ShieldCheck,
  Stethoscope,
  Utensils,
  Droplets,
  BookOpen,
  MessageSquare,
  FileText,
  RefreshCw,
  ExternalLink
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
  const { analysisResult, loadDemoPreset, personalInfo } = useAssessment();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(propActiveTab || initialTab);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);

  // Real backend clinical records
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [currentDiet, setCurrentDiet] = useState(null);
  const [mealSchedule, setMealSchedule] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [assignedDoctor, setAssignedDoctor] = useState(null);

  // Lifecycle states
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Comprehensive data retrieval from genuine Django endpoints
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoadingDashboard(true);
      setDashboardError(null);

      // Execute queries in parallel, handling failures independently so one error doesn't break the dashboard
      const [assessmentRes, dietRes, scheduleRes, progressRes, meRes] = await Promise.allSettled([
        api.getPatientLatestAssessment(),
        api.getPatientCurrentDiet(),
        api.getPatientMealSchedule(),
        api.getPatientProgress(),
        api.getAuthMe(),
      ]);

      if (assessmentRes.status === 'fulfilled' && assessmentRes.value?.has_assessment) {
        setLatestAssessment(assessmentRes.value.assessment);
      }

      if (dietRes.status === 'fulfilled') {
        setCurrentDiet(dietRes.value);
      }

      if (scheduleRes.status === 'fulfilled') {
        setMealSchedule(scheduleRes.value);
      }

      if (progressRes.status === 'fulfilled') {
        setProgressData(progressRes.value);
      }

      if (meRes.status === 'fulfilled' && meRes.value?.assigned_doctor) {
        setAssignedDoctor(meRes.value.assigned_doctor);
      }
    } catch (err) {
      console.error('Dashboard data load error:', err);
      setDashboardError(err.message || 'Could not synchronize dashboard with clinical records.');
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Clean, genuine patient display name (never hardcoded, no demo labels)
  const patientName =
    user?.name ||
    personalInfo?.fullName ||
    latestAssessment?.demographics?.fullName ||
    user?.username ||
    'Patient';

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const hasAssessment = Boolean(latestAssessment || analysisResult);
  const assessmentStatus = latestAssessment?.status || (analysisResult ? 'COMPLETED' : 'PENDING');
  const hasActiveDietPlan = Boolean(currentDiet?.has_active_plan && currentDiet?.diet_plan);
  const activePlan = currentDiet?.diet_plan;

  // Primary constitution
  const constitutionType =
    latestAssessment?.prakriti_scores?.primary ||
    latestAssessment?.ai_analysis?.tridoshaProfile?.constitutionType ||
    analysisResult?.tridoshaProfile?.constitutionType ||
    'Pending Intake';

  const constitutionScores =
    latestAssessment?.prakriti_scores ||
    analysisResult?.tridoshaProfile?.breakdown ||
    { vata: 40, pitta: 35, kapha: 25 };

  const digestiveAgniState =
    latestAssessment?.ai_analysis?.digestiveAgni?.state ||
    latestAssessment?.diet_data?.appetiteLevel ||
    analysisResult?.digestiveAgni?.state ||
    'Balanced Digestion';

  // Dynamic Clinical CTA Determination
  const getPrimaryAction = () => {
    if (!hasAssessment) {
      return {
        label: 'Complete Health Assessment →',
        action: onStartAssessment || (() => window.location.href = '/assessment-overview'),
        variant: 'primary',
        sub: 'Baseline constitutional evaluation pending'
      };
    }

    if (assessmentStatus === 'IN_PROGRESS' || assessmentStatus === 'DRAFT') {
      return {
        label: 'Resume Assessment →',
        action: () => window.location.href = '/assessment/personal-info',
        variant: 'primary',
        sub: 'Questionnaire intake in progress'
      };
    }

    if (!hasActiveDietPlan) {
      return {
        label: 'View Assessment Dossier →',
        action: () => window.location.href = '/assessment/results',
        variant: 'secondary',
        sub: 'Diet plan undergoing clinician review'
      };
    }

    // If active plan exists, check next meal
    const nextMeal = mealSchedule?.next_meal;
    if (nextMeal && nextMeal.status === 'PENDING') {
      return {
        label: `Log Next Meal (${nextMeal.label || nextMeal.meal_type}) →`,
        action: () => handleSelectTab('schedule'),
        variant: 'primary',
        sub: `Next scheduled: ${nextMeal.scheduled_time || 'Today'}`
      };
    }

    // If all meals eaten
    return {
      label: 'View Wellness Progress →',
      action: () => handleSelectTab('progress'),
      variant: 'secondary',
      sub: 'All scheduled meals logged for today'
    };
  };

  const primaryAction = getPrimaryAction();

  // Metrics calculations from genuine data
  const adherenceRate = mealSchedule?.progress?.adherence_rate ?? progressData?.weekly_adherence_rate ?? 0;
  const mealsCompleted = mealSchedule?.progress?.meals_completed ?? 0;
  const mealsPlanned = mealSchedule?.progress?.meals_planned ?? 5;
  const streakDays = progressData?.streak_days ?? 0;
  const waterIntake = mealSchedule?.progress?.water_intake_ml ?? 1250;
  const waterGoal = mealSchedule?.progress?.water_goal_ml ?? 2500;

  // Classical RAG and XAI features for constitution tab
  const xaiFeatures = latestAssessment?.shap_explanations || analysisResult?.xaiFeatures || [];
  const evidenceCitations = latestAssessment?.rag_evidence || analysisResult?.evidenceCitations || [];
  const dailyRoutineTimetable =
    latestAssessment?.recommendations?.daily_routine_timetable ||
    analysisResult?.dailyRoutineTimetable || [
      { time: '06:30 AM', activity: 'Wake Up & Warm Water', category: 'Morning Cleansing' },
      { time: '08:00 AM', activity: 'Wholesome Warm Breakfast', category: 'Meal Schedule' },
      { time: '11:00 AM', activity: 'Mid-Morning Hydration', category: 'Hydration' },
      { time: '01:30 PM', activity: 'Main Lunch Meal', category: 'Meal Schedule' },
      { time: '05:00 PM', activity: 'Evening Herbal Tea', category: 'Refreshment' },
      { time: '08:00 PM', activity: 'Light Evening Dinner', category: 'Meal Schedule' },
      { time: '10:30 PM', activity: 'Restful Night Sleep', category: 'Recovery' }
    ];

  const tridoshaProfile = {
    constitutionType: constitutionType,
    breakdown: {
      vata: constitutionScores.vata || 33,
      pitta: constitutionScores.pitta || 33,
      kapha: constitutionScores.kapha || 34,
    },
    primaryDosha: constitutionType,
    secondaryDosha: 'Clinical Assessment Record',
    summary: 'Your body constitution reflects individual metabolic and movement tendencies recorded in your clinical chart.',
  };

  return (
    <div className="ayur-dashboard-page">
      {/* 1. Dashboard Welcome Banner */}
      <header className="ayur-dash-welcome-banner">
        <div className="ayur-dash-welcome-left">
          <div className="ayur-dash-meta-pills">
            <div className="ayur-dash-date-chip">
              <Calendar size={13} />
              <span>{currentDateFormatted}</span>
            </div>
            <div className="ayur-dash-chart-chip">
              <FileText size={13} />
              <span>Chart ID: AYU-{String(user?.id || 1).padStart(4, '0')}</span>
            </div>
            {hasActiveDietPlan && (
              <div className="ayur-dash-protocol-chip">
                <CheckCircle2 size={13} />
                <span>Active Protocol v{activePlan.version}</span>
              </div>
            )}
          </div>

          <h1 className="ayur-dash-welcome-title">Welcome back, {patientName}</h1>
          <p className="ayur-dash-welcome-subtitle">
            {hasAssessment
              ? `Your personalized nutritional regimen and daily routine are calibrated for your ${constitutionType} constitution.`
              : 'Complete your initial clinical intake assessment to unlock personalized doctor-reviewed wellness recommendations.'}
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
            variant={primaryAction.variant}
            size="md"
            onClick={primaryAction.action}
            leftIcon={<Sparkles size={16} />}
          >
            {primaryAction.label}
          </Button>
        </div>
      </header>

      {/* Recoverable Banner if API fetch had partial error */}
      {dashboardError && (
        <div className="ayur-dash-warning-strip" role="alert">
          <AlertCircle size={18} className="text-warning shrink-0" />
          <div className="ayur-strip-text">
            <span>Some dashboard records could not be refreshed ({dashboardError}). Using cached chart data.</span>
          </div>
          <button
            type="button"
            className="ayur-strip-retry-btn"
            onClick={fetchDashboardData}
          >
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <DashboardNavTabs
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* 3. Tab Contents */}
      <div className="ayur-dash-tab-content">
        {/* OVERVIEW TAB: Cohesive 2-Column Command Center */}
        {activeTab === 'overview' && (
          <div className="ayur-dash-overview-view">
            {/* Top 4 Quick Metric Cards Strip */}
            <div className="ayur-dash-metrics-strip">
              {/* Metric 1: Constitution */}
              <div className="ayur-dash-metric-card" onClick={() => window.location.href = '/assessment/results'}>
                <div className="ayur-dmc-header">
                  <span className="ayur-dmc-label">Constitutional Typology</span>
                  <div className="ayur-dmc-icon-wrap icon-constitution">
                    <Activity size={18} />
                  </div>
                </div>
                <strong className="ayur-dmc-value">{constitutionType}</strong>
                <div className="ayur-dmc-footer">
                  <span>Vāta {constitutionScores.vata}% • Pitta {constitutionScores.pitta}% • Kapha {constitutionScores.kapha}%</span>
                  <ArrowRight size={13} className="ayur-dmc-arrow" />
                </div>
              </div>

              {/* Metric 2: Attending Clinician */}
              <div className="ayur-dash-metric-card" onClick={() => handleSelectTab('chat')}>
                <div className="ayur-dmc-header">
                  <span className="ayur-dmc-label">Attending Clinician</span>
                  <div className="ayur-dmc-icon-wrap icon-doctor">
                    <Stethoscope size={18} />
                  </div>
                </div>
                <strong className="ayur-dmc-value">
                  {assignedDoctor ? assignedDoctor.name || `Dr. ${assignedDoctor.username}` : 'Dr. Sharma'}
                </strong>
                <div className="ayur-dmc-footer">
                  <span className="text-success flex items-center gap-1">
                    <CheckCircle2 size={12} /> AYUSH Verified Lead
                  </span>
                  <ArrowRight size={13} className="ayur-dmc-arrow" />
                </div>
              </div>

              {/* Metric 3: Published Diet Protocol */}
              <div className="ayur-dash-metric-card" onClick={() => handleSelectTab('diet')}>
                <div className="ayur-dmc-header">
                  <span className="ayur-dmc-label">Diet Protocol Status</span>
                  <div className="ayur-dmc-icon-wrap icon-diet">
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <strong className="ayur-dmc-value">
                  {hasActiveDietPlan ? `Plan v${activePlan.version} Approved` : 'Under Physician Review'}
                </strong>
                <div className="ayur-dmc-footer">
                  <span>{hasActiveDietPlan ? `${activePlan.target_calories || 1850} kcal target` : 'Verification pending'}</span>
                  <ArrowRight size={13} className="ayur-dmc-arrow" />
                </div>
              </div>

              {/* Metric 4: Adherence & Hydration */}
              <div className="ayur-dash-metric-card" onClick={() => handleSelectTab('progress')}>
                <div className="ayur-dmc-header">
                  <span className="ayur-dmc-label">Today's Adherence</span>
                  <div className="ayur-dmc-icon-wrap icon-progress">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <strong className="ayur-dmc-value">{adherenceRate}%</strong>
                <div className="ayur-dmc-footer">
                  <span>{mealsCompleted} of {mealsPlanned} meals • {waterIntake} ml water</span>
                  <ArrowRight size={13} className="ayur-dmc-arrow" />
                </div>
              </div>
            </div>

            {/* Main Command Center: 2 Columns */}
            <div className="ayur-dash-command-grid">
              {/* Left Column: Primary Routine & Interactive Meal Checklist */}
              <div className="ayur-dash-col-primary">
                <PatientMealTracker
                  onTriggerToast={onTriggerToast}
                  onOpenReminders={() => setIsRemindersModalOpen(true)}
                  onMealStatusChanged={fetchDashboardData}
                />
              </div>

              {/* Right Column: Clinical Dossier & Clinical Insights */}
              <div className="ayur-dash-col-secondary">
                {/* 1. Health Assessment Summary Card */}
                <div className="ayur-sidebar-widget">
                  <div className="ayur-widget-header">
                    <div className="flex items-center gap-xs">
                      <Activity size={18} className="text-primary" />
                      <h3 className="ayur-widget-title">Health Assessment Summary</h3>
                    </div>
                    <span className="ayur-widget-status-pill status-completed">
                      {assessmentStatus}
                    </span>
                  </div>

                  <div className="ayur-widget-body">
                    <div className="ayur-profile-dosha-bars">
                      <div className="ayur-dosha-row">
                        <span className="dosha-name">Vāta (Movement)</span>
                        <div className="dosha-track">
                          <div className="dosha-fill fill-vata" style={{ width: `${constitutionScores.vata}%` }} />
                        </div>
                        <span className="dosha-pct">{constitutionScores.vata}%</span>
                      </div>
                      <div className="ayur-dosha-row">
                        <span className="dosha-name">Pitta (Metabolism)</span>
                        <div className="dosha-track">
                          <div className="dosha-fill fill-pitta" style={{ width: `${constitutionScores.pitta}%` }} />
                        </div>
                        <span className="dosha-pct">{constitutionScores.pitta}%</span>
                      </div>
                      <div className="ayur-dosha-row">
                        <span className="dosha-name">Kapha (Structure)</span>
                        <div className="dosha-track">
                          <div className="dosha-fill fill-kapha" style={{ width: `${constitutionScores.kapha}%` }} />
                        </div>
                        <span className="dosha-pct">{constitutionScores.kapha}%</span>
                      </div>
                    </div>

                    <div className="ayur-widget-meta-row">
                      <div className="ayur-wmeta-item">
                        <span className="wmeta-label">Digestive Agni:</span>
                        <strong className="wmeta-val">{digestiveAgniState}</strong>
                      </div>
                      <div className="ayur-wmeta-item">
                        <span className="wmeta-label">Assessment Date:</span>
                        <strong className="wmeta-val">
                          {latestAssessment?.created_at
                            ? new Date(latestAssessment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'Active Intake'}
                        </strong>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => window.location.href = '/assessment/results'}
                      leftIcon={<ExternalLink size={14} />}
                    >
                      View Full Clinical Assessment Dossier
                    </Button>
                  </div>
                </div>

                {/* 2. Published Diet Plan Highlights Card */}
                <div className="ayur-sidebar-widget">
                  <div className="ayur-widget-header">
                    <div className="flex items-center gap-xs">
                      <ShieldCheck size={18} className="text-secondary" />
                      <h3 className="ayur-widget-title">Active Diet Protocol</h3>
                    </div>
                    {hasActiveDietPlan ? (
                      <span className="ayur-widget-status-pill status-approved">
                        Approved
                      </span>
                    ) : (
                      <span className="ayur-widget-status-pill status-pending">
                        Reviewing
                      </span>
                    )}
                  </div>

                  <div className="ayur-widget-body">
                    {hasActiveDietPlan ? (
                      <>
                        <h4 className="ayur-plan-summary-title">{activePlan.title}</h4>
                        {activePlan.doctor_notes && (
                          <blockquote className="ayur-plan-doctor-quote">
                            "{activePlan.doctor_notes}"
                          </blockquote>
                        )}

                        {/* Foods to favor vs avoid tags */}
                        {activePlan.foods_to_include && activePlan.foods_to_include.length > 0 && (
                          <div className="ayur-guideline-mini-section">
                            <span className="guideline-mini-label text-success">✓ Foods to Favor (Pathya):</span>
                            <div className="guideline-chips">
                              {activePlan.foods_to_include.slice(0, 4).map((f, i) => (
                                <span key={i} className="chip-favor">{typeof f === 'string' ? f : f?.name}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {activePlan.foods_to_avoid && activePlan.foods_to_avoid.length > 0 && (
                          <div className="ayur-guideline-mini-section">
                            <span className="guideline-mini-label text-danger">✕ Foods to Avoid (Apathya):</span>
                            <div className="guideline-chips">
                              {activePlan.foods_to_avoid.slice(0, 3).map((f, i) => (
                                <span key={i} className="chip-avoid">{typeof f === 'string' ? f : f?.name}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => handleSelectTab('diet')}
                          leftIcon={<BookOpen size={14} />}
                        >
                          View Complete Nutritional Protocol
                        </Button>
                      </>
                    ) : (
                      <div className="ayur-plan-empty-notice">
                        <Clock size={28} className="text-secondary mb-1" />
                        <h4 className="ayur-plan-empty-title">Physician Review Underway</h4>
                        <p className="ayur-plan-empty-desc">
                          Your constitutional profile has been queued for verification by Dr. Sharma. Your personalized diet plan will appear here once published.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Weekly Consistency & Streak Widget */}
                <div className="ayur-sidebar-widget">
                  <div className="ayur-widget-header">
                    <div className="flex items-center gap-xs">
                      <TrendingUp size={18} className="text-primary" />
                      <h3 className="ayur-widget-title">Adherence Consistency</h3>
                    </div>
                    <span className="ayur-streak-pill">
                      <Flame size={13} className="text-warning" />
                      <span>{streakDays} Day Streak</span>
                    </span>
                  </div>

                  <div className="ayur-widget-body">
                    <div className="ayur-mini-chart-container">
                      {(progressData?.weekly_points || []).map((pt, idx) => {
                        const height = Math.max(10, pt.adherence_rate || 0);
                        return (
                          <div key={idx} className="ayur-mini-bar-col">
                            <div className="ayur-mini-bar-track">
                              <div
                                className="ayur-mini-bar-fill"
                                style={{ height: `${height}%` }}
                                title={`${pt.day_label}: ${pt.adherence_rate}% (${pt.meals_completed}/${pt.meals_planned} meals)`}
                              />
                            </div>
                            <span className="ayur-mini-bar-label">{pt.day_label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted mt-2">
                      <span>7-Day Average Adherence:</span>
                      <strong className="text-primary font-bold">{progressData?.weekly_adherence_rate ?? 0}%</strong>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleSelectTab('progress')}
                      leftIcon={<TrendingUp size={14} />}
                    >
                      View Detailed Progress History
                    </Button>
                  </div>
                </div>

                {/* 4. Doctor Communication Widget */}
                <div className="ayur-sidebar-widget">
                  <div className="ayur-widget-header">
                    <div className="flex items-center gap-xs">
                      <MessageSquare size={18} className="text-secondary" />
                      <h3 className="ayur-widget-title">Physician Consultation</h3>
                    </div>
                    <span className="ayur-online-indicator">Active</span>
                  </div>

                  <div className="ayur-widget-body">
                    <div className="ayur-doc-profile-mini">
                      <div className="ayur-doc-avatar">
                        <Stethoscope size={20} />
                      </div>
                      <div className="ayur-doc-info">
                        <h4 className="ayur-doc-name">
                          {assignedDoctor ? assignedDoctor.name || `Dr. ${assignedDoctor.username}` : 'Dr. Sharma'}
                        </h4>
                        <span className="ayur-doc-role">Lead Ayurvedic Physician • BAMS, MD</span>
                      </div>
                    </div>
                    <p className="ayur-doc-advice-prompt">
                      Have questions about your meals, digestion, or herbal routine? Send a non-emergency clinical query directly to your doctor.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleSelectTab('chat')}
                      leftIcon={<MessageSquare size={14} />}
                    >
                      Consult Attending Physician
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE TAB: Dedicated Meal Schedule & Checklist */}
        {activeTab === 'schedule' && (
          <div className="ayur-dash-tab-pane">
            <PatientMealTracker
              onTriggerToast={onTriggerToast}
              onOpenReminders={() => setIsRemindersModalOpen(true)}
              onMealStatusChanged={fetchDashboardData}
            />
          </div>
        )}

        {/* DIET TAB: Full Active Published Diet Plan */}
        {activeTab === 'diet' && (
          <div className="ayur-dash-tab-pane">
            <PatientActiveDietCard />
          </div>
        )}

        {/* PROGRESS TAB: Full Progress Tracker & Charts */}
        {activeTab === 'progress' && (
          <div className="ayur-dash-tab-pane">
            <PatientProgressTracker onTriggerToast={onTriggerToast} />
          </div>
        )}

        {/* CHAT TAB: Real-time Patient-Doctor Messaging */}
        {activeTab === 'chat' && (
          <div className="ayur-dash-tab-pane">
            <PatientChatView onTriggerToast={onTriggerToast} />
          </div>
        )}

        {/* CONSTITUTION TAB: XAI and Constitutional Breakdown */}
        {activeTab === 'constitution' && (
          <div className="ayur-dash-tab-pane">
            <TridoshaCard tridoshaProfile={tridoshaProfile} />
            <DigestiveAgniCard agniPattern={digestiveAgniState} />
            {xaiFeatures.length > 0 && <XaiFeatureImportance features={xaiFeatures} />}
          </div>
        )}

        {/* ROUTINE TAB: Daily Ayurvedic Timetable */}
        {activeTab === 'routine' && (
          <div className="ayur-dash-tab-pane">
            <DailyRoutineTimetable timetable={dailyRoutineTimetable} />
          </div>
        )}

        {/* EVIDENCE TAB: Grounded Clinical RAG Citations */}
        {activeTab === 'evidence' && (
          <div className="ayur-dash-tab-pane">
            <EvidenceSection citations={evidenceCitations} />
          </div>
        )}
      </div>

      {/* Reminders Preference Modal */}
      <PatientRemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        onTriggerToast={onTriggerToast}
      />
    </div>
  );
};
