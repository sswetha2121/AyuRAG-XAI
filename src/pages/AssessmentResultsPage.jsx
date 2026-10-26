import React, { useState, useEffect } from 'react';
import './AssessmentResultsPage.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAssessment } from '../context/AssessmentContext';
import { api } from '../services/api';
import {
  Sparkles,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  User,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Flame,
  Wind,
  Mountain,
  HeartPulse,
  AlertCircle,
  FileText,
  Bookmark,
  Utensils,
  ChevronRight
} from 'lucide-react';
import { Button, Badge, ProgressBar } from '../components/ui';
import { XaiFeatureImportance } from '../components/dashboard/XaiFeatureImportance';
import { EvidenceSection } from '../components/dashboard/EvidenceSection';
import { DailyRoutineTimetable } from '../components/dashboard/DailyRoutineTimetable';

export const AssessmentResultsPage = ({ onTriggerToast, onReevaluate }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    analysisResult,
    personalInfo,
    resetAllAssessment,
    setCurrentStep,
    submittedAssessmentId
  } = useAssessment();

  const [persistedData, setPersistedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Load from backend if paramId is provided or user is authenticated
  useEffect(() => {
    let isMounted = true;
    const fetchRecord = async () => {
      const targetId = paramId || submittedAssessmentId;
      if (targetId && isAuthenticated) {
        setIsLoading(true);
        try {
          const res = await api.getPatientAssessmentDetail(targetId);
          if (isMounted && res) {
            setPersistedData(res);
          }
        } catch (err) {
          console.warn('Could not fetch assessment detail by ID:', err);
          // If 403 or 404, record load error
          if (isMounted) setLoadError(err.message || 'Unable to retrieve clinical assessment record.');
        } finally {
          if (isMounted) setIsLoading(false);
        }
      } else if (isAuthenticated && !analysisResult) {
        // Fetch latest assessment for logged-in patient
        setIsLoading(true);
        try {
          const res = await api.getPatientLatestAssessment();
          if (isMounted && res?.has_assessment && res.assessment) {
            setPersistedData(res.assessment);
          }
        } catch (err) {
          console.warn('Could not fetch latest assessment:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    };

    fetchRecord();
    return () => {
      isMounted = false;
    };
  }, [paramId, submittedAssessmentId, isAuthenticated, analysisResult]);

  // Consolidate data from backend record or frontend context
  const assessmentRecord = persistedData || (analysisResult ? {
    demographics: personalInfo,
    prakriti_scores: {
      primary: analysisResult?.tridoshaProfile?.constitutionType || 'Vāta-Pitta',
      secondary: analysisResult?.tridoshaProfile?.secondaryDosha || 'Pitta',
      vata: analysisResult?.tridoshaProfile?.breakdown?.vata || 40,
      pitta: analysisResult?.tridoshaProfile?.breakdown?.pitta || 35,
      kapha: analysisResult?.tridoshaProfile?.breakdown?.kapha || 25,
      breakdown: analysisResult?.tridoshaProfile?.breakdown || { vata: 40, pitta: 35, kapha: 25 },
    },
    ai_analysis: analysisResult,
    shap_explanations: analysisResult?.xaiFeatures || analysisResult?.shapExplanations || [],
    rag_evidence: analysisResult?.evidenceCitations || analysisResult?.ragEvidence || [],
    recommendations: analysisResult?.recommendations || {},
    status: 'COMPLETED',
    created_at: new Date().toISOString()
  } : null);

  const handlePrint = () => {
    window.print();
  };

  const handleStartFresh = () => {
    if (window.confirm('Start a new assessment? This will clear current responses.')) {
      resetAllAssessment?.();
      setCurrentStep('personal-info');
      onReevaluate?.();
      navigate('/assessment');
    }
  };

  if (isLoading) {
    return (
      <div className="ayur-results-page">
        <div className="ayur-res-card text-center py-xl" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="ayur-spinner-mini" style={{ width: '32px', height: '32px', borderWidth: '3px', borderColor: '#123B2F', borderTopColor: 'transparent' }} />
          <h3 style={{ marginTop: '1.25rem', color: '#123B2F', fontFamily: 'Manrope, sans-serif' }}>Retrieving Clinical Assessment Record...</h3>
          <p className="text-muted" style={{ maxWidth: '420px', fontSize: '0.9rem' }}>
            Synchronizing constitutional metrics, explainable AI features, and classical literature citations from the AyuRAG backend.
          </p>
        </div>
      </div>
    );
  }

  if (loadError && !assessmentRecord) {
    return (
      <div className="ayur-results-page">
        <div className="ayur-res-card text-center py-xl" style={{ minHeight: '340px' }}>
          <AlertCircle size={44} style={{ color: '#DC2626', margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#991B1B', fontFamily: 'Manrope, sans-serif' }}>Assessment Record Unavailable</h2>
          <p style={{ color: '#4B5E55', maxWidth: '460px', margin: '0.5rem auto 1.5rem', lineHeight: 1.5 }}>
            {loadError}
          </p>
          <div className="flex items-center justify-center gap-sm">
            <Button variant="outline" onClick={() => navigate('/assessment')}>
              Return to Assessment Flow
            </Button>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!assessmentRecord) {
    return (
      <div className="ayur-results-page">
        <div className="ayur-res-card text-center py-xl" style={{ minHeight: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={48} style={{ color: '#A8BDA7', marginBottom: '1rem' }} />
          <h2 style={{ color: '#123B2F', fontFamily: 'Manrope, sans-serif' }}>No Active Assessment Results Found</h2>
          <p style={{ color: '#4B5E55', maxWidth: '480px', margin: '0.5rem auto 1.5rem', lineHeight: 1.6 }}>
            You haven't completed a constitutional assessment yet, or your current session has expired. Complete our 10-minute assessment to unlock personalized recommendations.
          </p>
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => {
              setCurrentStep('personal-info');
              navigate('/assessment');
            }}
          >
            Begin Clinical Assessment →
          </Button>
        </div>
      </div>
    );
  }

  // Derive metrics safely from record
  const demographics = assessmentRecord.demographics || personalInfo || {};
  const patientName = demographics.fullName || user?.name || user?.username || 'Patient';
  const patientAge = demographics.age || assessmentRecord.patient_age || '—';
  const patientGender = demographics.gender || assessmentRecord.patient_gender || '—';
  
  const prakritiScores = assessmentRecord.prakriti_scores || {};
  const constitutionType = prakritiScores.primary || prakritiScores.constitution || 'Vāta-Pitta';
  const secondaryDosha = prakritiScores.secondary || 'Pitta';
  const vataPct = prakritiScores.vata ?? prakritiScores.breakdown?.vata ?? 40;
  const pittaPct = prakritiScores.pitta ?? prakritiScores.breakdown?.pitta ?? 35;
  const kaphaPct = prakritiScores.kapha ?? prakritiScores.breakdown?.kapha ?? 25;

  const aiAnalysis = assessmentRecord.ai_analysis || {};
  const confidence = aiAnalysis.confidence || aiAnalysis.aiMetrics?.confidence || 0.88;
  const confidencePct = Math.round(Number(confidence) * 100);
  const modelName = aiAnalysis.model_name || aiAnalysis.aiMetrics?.model_name || 'AyuRAG Explainable Decision Support Engine v2.1';
  
  const digestiveAgni = aiAnalysis.digestiveAgni || assessmentRecord.digestiveAgni || {
    state: 'Variable & Sensitive Digestion',
    description: 'Fluctuating digestive rhythm prone to irregular hunger and occasional post-meal discomfort.',
    protocols: [
      'Eat freshly cooked, warm meals at fixed circadian times daily',
      'Sip warm ginger-infused water between meals to support metabolic digestion',
      'Leave one-third of stomach capacity empty to facilitate digestive comfort'
    ]
  };

  const xaiFeatures = assessmentRecord.shap_explanations || aiAnalysis.xaiFeatures || [];
  const ragCitations = assessmentRecord.rag_evidence || aiAnalysis.evidenceCitations || [];
  const recommendations = assessmentRecord.recommendations || {};
  const timetable = recommendations.daily_routine_timetable || aiAnalysis.dailyRoutineTimetable || [];
  
  const assessmentDate = assessmentRecord.created_at
    ? new Date(assessmentRecord.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recent Session';

  const isVerified = assessmentRecord.status === 'VERIFIED';
  const isPendingReview = assessmentRecord.status === 'COMPLETED' || assessmentRecord.status === 'IN_PROGRESS';

  return (
    <div className="ayur-results-page">
      {/* 1. Clinical Dossier Header */}
      <div className="ayur-results-header">
        <div className="ayur-results-header__meta">
          <div className="ayur-results-header__badges">
            <span className="ayur-results-badge ayur-results-badge--primary">
              <Sparkles size={12} />
              AI Clinical Assessment Dossier
            </span>
            <span className="ayur-results-badge ayur-results-badge--accent">
              Confidence {confidencePct}%
            </span>
            {isVerified ? (
              <span className="ayur-results-badge ayur-results-badge--verified">
                <CheckCircle2 size={12} />
                Physician Verified
              </span>
            ) : (
              <span className="ayur-results-badge ayur-results-badge--pending">
                <Clock size={12} />
                Queued for Physician Review
              </span>
            )}
          </div>

          <div className="flex items-center gap-xs">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer size={15} />}
              onClick={handlePrint}
              style={{ color: '#FAF4E8', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              Print / Export Report
            </Button>
          </div>
        </div>

        <h1 className="ayur-results-header__title">
          Constitutional Typology: <span className="ayur-results-header__highlight">{constitutionType}</span>
        </h1>

        <p className="ayur-results-header__desc">
          Your multidimensional assessment has been synthesized using CCRAS-aligned constitutional point attribution, metabolic digestion analysis, and grounded classical literature evidence.
        </p>

        <div className="ayur-results-dossier-grid">
          <div className="ayur-dossier-item">
            <span className="ayur-dossier-label">Patient Name</span>
            <span className="ayur-dossier-value">{patientName}</span>
          </div>
          <div className="ayur-dossier-item">
            <span className="ayur-dossier-label">Demographics</span>
            <span className="ayur-dossier-value">{patientAge} yrs • {patientGender}</span>
          </div>
          <div className="ayur-dossier-item">
            <span className="ayur-dossier-label">Primary Health Pattern</span>
            <span className="ayur-dossier-value">{constitutionType}</span>
          </div>
          <div className="ayur-dossier-item">
            <span className="ayur-dossier-label">Secondary Factor</span>
            <span className="ayur-dossier-value">{secondaryDosha}</span>
          </div>
          <div className="ayur-dossier-item">
            <span className="ayur-dossier-label">Assessment Date</span>
            <span className="ayur-dossier-value">{assessmentDate}</span>
          </div>
          <div className="ayur-dossier-item">
            <span className="ayur-dossier-label">Model Attribution</span>
            <span className="ayur-dossier-value" style={{ fontSize: '0.85rem' }}>{modelName}</span>
          </div>
        </div>
      </div>

      {/* 2. Medical Safety & Clinical Governance Notice */}
      <div className="ayur-results-safety-banner" role="alert">
        <ShieldCheck size={22} className="ayur-safety-icon" />
        <div className="ayur-safety-text">
          <h4>Clinical Decision Support Advisory</h4>
          <p>
            AyuRAG-XAI provides evidence-based Ayurvedic decision support and wellness intelligence. This report is intended to guide lifestyle and dietary optimization under medical supervision. It is not an automated medical diagnosis or a substitute for professional clinical consultation. In acute conditions, always consult an authorized medical practitioner.
          </p>
        </div>
      </div>

      {/* 3. Dual Grid: Body Pattern Distribution & Digestive Health */}
      <div className="ayur-results-dual-grid">
        {/* Card A: Body Pattern Distribution */}
        <div className="ayur-res-card ayur-res-card--highlight">
          <div className="flex items-center justify-between mb-sm">
            <div className="flex items-center gap-xs">
              <Wind size={18} style={{ color: '#123B2F' }} />
              <h2 className="ayur-section-title" style={{ fontSize: '1.2rem' }}>Body Pattern Distribution</h2>
            </div>
            <Badge color="primary" variant="subtle" size="sm">Point-Weighted</Badge>
          </div>

          <p className="ayur-section-subtitle mb-md">
            Relative balance of the three fundamental bio-energetic principles derived from your frame, digestion, and daily patterns.
          </p>

          <div className="ayur-dosha-breakdown-list">
            {/* Movement */}
            <div className="ayur-dosha-item">
              <div className="ayur-dosha-item-header">
                <div className="ayur-dosha-name-box">
                  <div className="ayur-dosha-circle ayur-dosha-circle--vata" />
                  <span className="ayur-dosha-label">Movement (Air & Space)</span>
                  <span className="ayur-dosha-sublabel">• Kinetic Energy</span>
                </div>
                <span className="ayur-dosha-percent">{vataPct}%</span>
              </div>
              <div className="ayur-dosha-progress-track">
                <div className="ayur-dosha-progress-fill ayur-dosha-progress-fill--vata" style={{ width: `${vataPct}%` }} />
              </div>
              <span className="ayur-dosha-qualities">Governs neuromuscular communication, respiration, nervous system responsiveness, and bodily mobility.</span>
            </div>

            {/* Metabolism */}
            <div className="ayur-dosha-item">
              <div className="ayur-dosha-item-header">
                <div className="ayur-dosha-name-box">
                  <div className="ayur-dosha-circle ayur-dosha-circle--pitta" />
                  <span className="ayur-dosha-label">Metabolism (Fire & Water)</span>
                  <span className="ayur-dosha-sublabel">• Thermal Energy</span>
                </div>
                <span className="ayur-dosha-percent">{pittaPct}%</span>
              </div>
              <div className="ayur-dosha-progress-track">
                <div className="ayur-dosha-progress-fill ayur-dosha-progress-fill--pitta" style={{ width: `${pittaPct}%` }} />
              </div>
              <span className="ayur-dosha-qualities">Governs metabolic enzymes, cellular transformation, digestive strength, and mental clarity.</span>
            </div>

            {/* Structure */}
            <div className="ayur-dosha-item">
              <div className="ayur-dosha-item-header">
                <div className="ayur-dosha-name-box">
                  <div className="ayur-dosha-circle ayur-dosha-circle--kapha" />
                  <span className="ayur-dosha-label">Structure (Earth & Water)</span>
                  <span className="ayur-dosha-sublabel">• Cohesive Energy</span>
                </div>
                <span className="ayur-dosha-percent">{kaphaPct}%</span>
              </div>
              <div className="ayur-dosha-progress-track">
                <div className="ayur-dosha-progress-fill ayur-dosha-progress-fill--kapha" style={{ width: `${kaphaPct}%` }} />
              </div>
              <span className="ayur-dosha-qualities">Provides structural cohesion, tissue lubrication, joint durability, physical endurance, and immunity.</span>
            </div>
          </div>
        </div>

        {/* Card B: Digestive & Metabolic Health */}
        <div className="ayur-res-card ayur-res-card--accent">
          <div className="flex items-center justify-between mb-sm">
            <div className="flex items-center gap-xs">
              <Flame size={18} style={{ color: '#C5A059' }} />
              <h2 className="ayur-section-title" style={{ fontSize: '1.2rem' }}>Digestive & Metabolic Health</h2>
            </div>
            <Badge color="accent" variant="subtle" size="sm">Metabolic State</Badge>
          </div>

          <p className="ayur-section-subtitle mb-md">
            In Ayurvedic medicine, digestive capacity determines assimilation efficiency and systemic wellness.
          </p>

          <div className="ayur-agni-badge-large">
            <Flame size={20} />
            <span>{digestiveAgni.state || 'Variable & Sensitive Digestion'}</span>
          </div>

          <p className="ayur-agni-description">
            {digestiveAgni.description || 'Your questionnaire responses indicate an irregular digestive rhythm. Meal timing discipline and freshly prepared warm meals provide the greatest metabolic stability.'}
          </p>

          <h4 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.9rem', color: '#123B2F', margin: '0 0 0.5rem', fontWeight: 700 }}>
            Metabolic Balance Protocols:
          </h4>
          <ul className="ayur-rules-checklist">
            {(digestiveAgni.protocols || [
              'Consume meals in a relaxed, distraction-free environment',
              'Sip warm ginger water between meals to kindle metabolic fire',
              'Avoid cold drinks, iced desserts, or heavy midnight meals'
            ]).map((proto, idx) => (
              <li key={idx}>
                <CheckCircle2 size={16} className="ayur-rules-check-icon" />
                <span>{proto}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Explainable AI (XAI) Feature Importance */}
      {xaiFeatures.length > 0 && (
        <div className="ayur-results-section">
          <div className="ayur-results-section-header">
            <div>
              <h2 className="ayur-section-title">
                <Brain size={20} style={{ color: '#123B2F' }} />
                Explainable AI (XAI) Reasoning
              </h2>
              <p className="ayur-section-subtitle">
                Inspect the physiological and lifestyle parameters that mathematically influenced your constitutional classification.
              </p>
            </div>
          </div>
          <XaiFeatureImportance features={xaiFeatures} />
        </div>
      )}

      {/* 5. Classical RAG Knowledge Base Citations */}
      {ragCitations.length > 0 && (
        <div className="ayur-results-section">
          <div className="ayur-results-section-header">
            <div>
              <h2 className="ayur-section-title">
                <BookOpen size={20} style={{ color: '#123B2F' }} />
                Classical Evidence Grounding
              </h2>
              <p className="ayur-section-subtitle">
                Canonical verses and peer-reviewed Ayurvedic treatises corroborating this constitutional profile.
              </p>
            </div>
          </div>
          <EvidenceSection citations={ragCitations} />
        </div>
      )}

      {/* 6. Circadian Dinacharya & Nutritional Guidance */}
      {timetable.length > 0 && (
        <div className="ayur-results-section">
          <div className="ayur-results-section-header">
            <div>
              <h2 className="ayur-section-title">
                <Clock size={20} style={{ color: '#123B2F' }} />
                Daily Circadian Routine Timetable
              </h2>
              <p className="ayur-section-subtitle">
                Optimal daily timing for meals, mental activity, exercise, and restorative sleep calibrated to your bio-energetic rhythms.
              </p>
            </div>
          </div>
          <DailyRoutineTimetable timetable={timetable} />
        </div>
      )}

      {/* 7. Action Bar */}
      <div className="ayur-results-actions">
        <div className="ayur-results-actions__group">
          <Button
            variant="outline"
            leftIcon={<RotateCcw size={16} />}
            onClick={handleStartFresh}
          >
            Retake Assessment
          </Button>
          <Button
            variant="outline"
            leftIcon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print Summary (PDF)
          </Button>
        </div>

        <div className="ayur-results-actions__group">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/dashboard')}
          >
            Access Daily Meal Tracker & Dashboard →
          </Button>
        </div>
      </div>
    </div>
  );
};
