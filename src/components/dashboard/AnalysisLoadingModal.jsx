import React, { useState, useEffect } from 'react';
import './AnalysisLoadingModal.css';
import { Brain, CheckCircle2, Sparkles, Loader2, AlertCircle, RotateCcw, X } from 'lucide-react';
import { ProgressBar, Button } from '../ui';

const LOADING_STAGES = [
  { id: 1, label: 'Ingesting multi-domain physiological & demographic parameters' },
  { id: 2, label: 'Calibrating constitutional energy baseline & metabolic digestion' },
  { id: 3, label: 'Computing explainable AI feature importances & SHAP attributions' },
  { id: 4, label: 'Grounding personalized protocols in classical literature RAG citations' }
];

export const AnalysisLoadingModal = ({
  isOpen = false,
  status = 'loading', // 'loading' | 'failure' | 'success'
  error = null,
  onRetry,
  onClose,
  onComplete,
  className = ''
}) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [progressPct, setProgressPct] = useState(25);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(1);
      setProgressPct(25);
      return;
    }

    if (status === 'failure') {
      return;
    }

    if (status === 'success') {
      setProgressPct(100);
      const timer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Incremental progress while loading
    const t1 = setTimeout(() => {
      setCurrentStage(2);
      setProgressPct(50);
    }, 700);

    const t2 = setTimeout(() => {
      setCurrentStage(3);
      setProgressPct(75);
    }, 1400);

    const t3 = setTimeout(() => {
      setCurrentStage(4);
      setProgressPct(90);
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, status, onComplete]);

  if (!isOpen) return null;

  const isFailure = status === 'failure';

  return (
    <div className={`ayur-loading-modal-backdrop ${className}`.trim()} role="dialog" aria-modal="true">
      <div className="ayur-loading-modal-card">
        {onClose && (
          <button
            type="button"
            className="ayur-loading-modal-close"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            <X size={18} />
          </button>
        )}

        {isFailure ? (
          <>
            <div className="ayur-loading-icon-pulse" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.08)' }}>
              <AlertCircle size={44} className="text-danger" style={{ color: '#DC2626' }} />
            </div>

            <div className="ayur-loading-header">
              <h2 className="ayur-loading-title" style={{ color: '#991B1B' }}>Inference Request Failed</h2>
              <p className="ayur-loading-sub">
                The clinical decision support backend could not complete AI reasoning at this time.
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                margin: '1rem 0',
                fontSize: '0.85rem',
                color: '#7F1D1D',
                textAlign: 'left'
              }}
            >
              <strong>Error details:</strong> {error || 'Connection failed. Please ensure the Django backend server is running on port 8000.'}
              <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#4B5563' }}>
                All of your questionnaire answers have been safely preserved.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <Button variant="outline" size="md" onClick={onClose}>
                Back to Review
              </Button>
              {onRetry && (
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<RotateCcw size={16} />}
                  onClick={onRetry}
                >
                  Retry AI Inference
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="ayur-loading-icon-pulse">
              <Brain size={44} className="text-primary" />
            </div>

            <div className="ayur-loading-header">
              <h2 className="ayur-loading-title">Analyzing Your Assessment Data</h2>
              <p className="ayur-loading-sub">
                AyuRAG-XAI reasoning pipeline is synthesizing multi-domain parameters...
              </p>
            </div>

            <div className="ayur-loading-progress-wrap">
              <ProgressBar value={progressPct} color="accent" size="md" showValue={false} />
              <div className="flex justify-between items-center text-micro font-mono text-muted mt-2xs">
                <span>Inference Pipeline</span>
                <span>{progressPct}%</span>
              </div>
            </div>

            <div className="ayur-loading-stages-list">
              {LOADING_STAGES.map((stage) => {
                const isDone = currentStage > stage.id || progressPct === 100;
                const isCurrent = currentStage === stage.id && progressPct < 100;

                return (
                  <div
                    key={stage.id}
                    className={`ayur-loading-stage-row ${isDone ? 'ayur-loading-stage-row--done' : isCurrent ? 'ayur-loading-stage-row--current' : ''}`}
                  >
                    <div className="ayur-stage-icon-wrap">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-success" />
                      ) : isCurrent ? (
                        <Loader2 size={16} className="text-accent ayur-spin-anim" />
                      ) : (
                        <div className="ayur-stage-dot" />
                      )}
                    </div>
                    <span className="ayur-stage-label">{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

