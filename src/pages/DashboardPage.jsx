import React, { useState } from 'react';
import './DashboardPage.css';
import { useAssessment } from '../context/AssessmentContext';
import {
  DashboardHeader,
  DashboardNavTabs,
  TridoshaCard,
  XaiFeatureImportance,
  RecommendationsGrid,
  EvidenceSection,
  DailyRoutineTimetable,
  DigestiveAgniCard,
  EmptyAssessmentState
} from '../components/dashboard';

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

  const [activeTab, setActiveTab] = useState('overview');

  // Handle case where user hasn't generated analysis yet
  if (!analysisResult) {
    return (
      <div className="ayur-dashboard-page">
        <EmptyAssessmentState
          onStartAssessment={onStartAssessment}
          onLoadDemo={() => {
            loadDemoPreset();
            onTriggerToast?.({
              type: 'success',
              title: 'Demo Profile Loaded',
              message: 'Realistic multi-domain assessment profile loaded for review.'
            });
          }}
        />
      </div>
    );
  }

  const {
    patientName,
    generatedAt,
    tridoshaProfile,
    xaiFeatures,
    evidenceCitations,
    recommendations,
    dailyRoutineTimetable
  } = analysisResult;

  return (
    <div className="ayur-dashboard-page">
      {/* 1. Dashboard Editorial Header */}
      <DashboardHeader
        patientName={patientName || personalInfo.fullName || 'Assessment User'}
        generatedAt={generatedAt}
        constitutionType={tridoshaProfile?.constitutionType || 'Vata-Pitta'}
        onReevaluate={onReevaluate}
        onTriggerToast={onTriggerToast}
      />

      {/* 2. Navigation Tabs */}
      <DashboardNavTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 3. Dynamic Tab Content View */}
      <div className="ayur-dash-tab-content">
        {activeTab === 'overview' && (
          <div className="ayur-dash-overview-stack">
            <TridoshaCard tridoshaProfile={tridoshaProfile} />
            <XaiFeatureImportance features={xaiFeatures} />
            <RecommendationsGrid recommendations={recommendations} />
            <DigestiveAgniCard />
            <DailyRoutineTimetable timetable={dailyRoutineTimetable} />
            <EvidenceSection citations={evidenceCitations} />
          </div>
        )}

        {activeTab === 'constitution' && (
          <div className="ayur-dash-tab-pane">
            <TridoshaCard tridoshaProfile={tridoshaProfile} />
            <DigestiveAgniCard />
          </div>
        )}

        {activeTab === 'explainability' && (
          <div className="ayur-dash-tab-pane">
            <XaiFeatureImportance features={xaiFeatures} />
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="ayur-dash-tab-pane">
            <RecommendationsGrid recommendations={recommendations} />
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
    </div>
  );
};
