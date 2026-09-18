import React, { useState, useEffect } from 'react';
import './AnalysisLoadingModal.css';
import { Brain, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { ProgressBar } from '../ui';

const LOADING_STAGES = [
  { id: 1, label: 'Ingesting multi-domain physiological & demographic parameters' },
  { id: 2, label: 'Calibrating Tridosha baseline (Vāta-Pitta-Kapha) & metabolic Agni' },
  { id: 3, label: 'Computing explainable AI feature importances & SHAP attributions' },
  { id: 4, label: 'Grounding personalized protocols in classical Samhita RAG citations' }
];

export const AnalysisLoadingModal = ({
  isOpen = false,
  onComplete,
  className = ''
}) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [progressPct, setProgressPct] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(1);
      setProgressPct(15);
      return;
    }

    const t1 = setTimeout(() => {
      setCurrentStage(2);
      setProgressPct(45);
    }, 700);

    const t2 = setTimeout(() => {
      setCurrentStage(3);
      setProgressPct(75);
    }, 1500);

    const t3 = setTimeout(() => {
      setCurrentStage(4);
      setProgressPct(95);
    }, 2300);

    const t4 = setTimeout(() => {
      setProgressPct(100);
      setTimeout(() => {
        onComplete?.();
      }, 400);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className={`ayur-loading-modal-backdrop ${className}`.trim()} role="dialog" aria-modal="true">
      <div className="ayur-loading-modal-card">
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
      </div>
    </div>
  );
};
