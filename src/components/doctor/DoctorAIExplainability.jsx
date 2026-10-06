import React, { useState } from 'react';
import './DoctorAIExplainability.css';
import {
  BrainCircuit,
  BarChart3,
  BookOpen,
  Sparkles,
  ShieldAlert,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const DoctorAIExplainability = ({
  aiAnalysis = {},
  shapExplanations = [],
  limeExplanations = [],
  ragEvidence = [],
  recommendations = {},
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('shap'); // 'shap' | 'lime' | 'rag'

  const confidencePct = aiAnalysis.confidence
    ? Math.round(aiAnalysis.confidence * 100)
    : 88;

  return (
    <div className={`ayur-ai-explainability ${className}`.trim()}>
      {/* Disclaimer Banner: Advisory AI */}
      <div className="ayur-advisory-banner">
        <div className="flex items-center gap-xs">
          <ShieldAlert size={16} className="ayur-advisory-icon" />
          <span className="ayur-advisory-title">Clinical Decision Support Grounding</span>
        </div>
        <p className="ayur-advisory-text">
          Model outputs, SHAP/LIME attribution vectors, and RAG knowledge retrievals are algorithmic decision aids.
          They do not constitute an unquestioned diagnosis and require clinical review and physician validation.
        </p>
      </div>

      {/* Model Output Header Card */}
      <div className="ayur-model-card">
        <div className="ayur-model-card__header">
          <div className="flex items-center gap-sm">
            <div className="ayur-model-icon-box">
              <BrainCircuit size={20} />
            </div>
            <div>
              <div className="ayur-model-tag-row">
                <span className="ayur-badge-tag ayur-badge-tag--model">Model Output</span>
                <span className="ayur-badge-tag ayur-badge-tag--review">Clinical Review Required</span>
              </div>
              <h3 className="ayur-model-prediction">{aiAnalysis.prediction || 'Movement-Metabolism Imbalance (Digestive Sluggishness)'}</h3>
            </div>
          </div>

          <div className="ayur-model-metrics">
            <div className="ayur-confidence-box">
              <div className="flex items-center justify-between gap-sm mb-xs">
                <span className="ayur-metric-label">Model Confidence</span>
                <span className="ayur-metric-val">{confidencePct}%</span>
              </div>
              <div className="ayur-confidence-track">
                <div
                  className="ayur-confidence-fill"
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <span className="ayur-model-version">
                {aiAnalysis.model_name || 'AyuRAG Clinical Multi-Task Classifier v2.1'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Inspection Tabs */}
      
      <div className="ayur-xai-tabs">
        <button
          type="button"
          className={`ayur-xai-tab ${activeTab === 'shap' ? 'ayur-xai-tab--active' : ''}`}
          onClick={() => setActiveTab('shap')}
        >
          <BarChart3 size={15} />
          <span>SHAP Feature Contributions</span>
        </button>

        <button
          type="button"
          className={`ayur-xai-tab ${activeTab === 'lime' ? 'ayur-xai-tab--active' : ''}`}
          onClick={() => setActiveTab('lime')}
        >
          <SlidersHorizontal size={15} />
          <span>LIME Local Explanation</span>
        </button>

        <button
          type="button"
          className={`ayur-xai-tab ${activeTab === 'rag' ? 'ayur-xai-tab--active' : ''}`}
          onClick={() => setActiveTab('rag')}
        >
          <BookOpen size={15} />
          <span>RAG Classical Evidence ({ragEvidence.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="ayur-xai-panel">
        {/* SHAP VISUALIZATION */}
        {activeTab === 'shap' && (
          <div className="ayur-shap-container">
            <div className="ayur-panel-intro">
              <div>
                <h4 className="ayur-panel-title">SHAP (SHapley Additive exPlanations)</h4>
                <p className="ayur-panel-desc">
                  Game-theoretic feature attributions quantifying each clinical finding's push toward the predicted constitutional state.
                </p>
              </div>
              <div className="ayur-shap-legend">
                <span className="ayur-legend-item ayur-legend-item--pos">Positive Contribution (+)</span>
                <span className="ayur-legend-item ayur-legend-item--neg">Protective / Opposing (-)</span>
              </div>
            </div>

            <div className="ayur-shap-chart">
              {shapExplanations.map((item, idx) => {
                const isPos = item.contribution >= 0;
                const absVal = Math.min(Math.abs(item.contribution), 1);
                const barWidth = Math.round(absVal * 100);

                return (
                  <div key={idx} className="ayur-shap-row">
                    <div className="ayur-shap-label" title={item.feature}>
                      {item.feature}
                    </div>

                    <div className="ayur-shap-bar-track">
                      <div className="ayur-shap-zero-line" />
                      <div
                        className={`ayur-shap-bar ${isPos ? 'ayur-shap-bar--pos' : 'ayur-shap-bar--neg'}`}
                        style={{ width: `${barWidth}%` }}
                      >
                        <span className="ayur-shap-bar-text">
                          {isPos ? `+${item.contribution.toFixed(2)}` : item.contribution.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LIME VISUALIZATION */}
        {activeTab === 'lime' && (
          <div className="ayur-lime-container">
            <div className="ayur-panel-intro">
              <div>
                <h4 className="ayur-panel-title">LIME (Local Interpretable Model-agnostic Explanations)</h4>
                <p className="ayur-panel-desc">
                  Perturbation-based local surrogate model explaining why the classifier arrived at this specific patient's assessment.
                </p>
              </div>
            </div>

            <div className="ayur-lime-grid">
              {limeExplanations.map((item, idx) => {
                const isPos = item.type === 'positive' || item.weight > 0;
                return (
                  <div key={idx} className={`ayur-lime-card ${isPos ? 'ayur-lime-card--pos' : 'ayur-lime-card--neg'}`}>
                    <div className="ayur-lime-card__header">
                      <span className="ayur-lime-feature">{item.feature}</span>
                      <span className="ayur-lime-weight">
                        {isPos ? `+${Math.abs(item.weight).toFixed(2)}` : `-${Math.abs(item.weight).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="ayur-lime-card__bar">
                      <div
                        className="ayur-lime-card__fill"
                        style={{ width: `${Math.round(Math.abs(item.weight) * 100)}%` }}
                      />
                    </div>
                    <span className="ayur-lime-nature">
                      {isPos ? 'Primary risk / symptom contributor' : 'Equilibrium stabilizing factor'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RAG EVIDENCE */}
        {activeTab === 'rag' && (
          <div className="ayur-rag-container">
            <div className="ayur-panel-intro">
              <div>
                <h4 className="ayur-panel-title">Retrieved Classical Ayurvedic Knowledge</h4>
                <p className="ayur-panel-desc">
                  Vector semantic search citations grounding the personalized protocol in peer-recognized medical treatises.
                </p>
              </div>
              <span className="ayur-rag-badge">CCRAS Grounded</span>
            </div>

            <div className="ayur-rag-cards">
              {ragEvidence.map((ev, idx) => (
                <div key={idx} className="ayur-rag-card">
                  <div className="ayur-rag-card__meta">
                    <div className="flex items-center gap-xs">
                      <span className="ayur-rag-tag">Classical Text Source</span>
                      <strong className="ayur-rag-source">{ev.source}</strong>
                    </div>
                    {ev.relevance_score && (
                      <span className="ayur-rag-score">
                        Relevance: {Math.round(ev.relevance_score * 100)}%
                      </span>
                    )}
                  </div>

                  <blockquote className="ayur-rag-quote">
                    "{ev.passage}"
                  </blockquote>

                  {ev.domain && (
                    <div className="ayur-rag-domain">
                      <span>Clinical Domain:</span>
                      <strong>{ev.domain}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Generated Recommendation Distinction */}
            {recommendations && (
              <div className="ayur-rec-distinction">
                <div className="ayur-rec-header">
                  <Sparkles size={16} className="text-accent" />
                  <h4 className="ayur-rec-title">Synthesized Personalized Recommendations</h4>
                  <span className="ayur-rec-tag">Generated by RAG + LLM</span>
                </div>

                <div className="ayur-rec-grid">
                  {recommendations.ahara && (
                    <div className="ayur-rec-block">
                      <span className="ayur-rec-label">Dietary Guidelines</span>
                      <ul className="ayur-rec-list">
                        {recommendations.ahara.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendations.vihara && (
                    <div className="ayur-rec-block">
                      <span className="ayur-rec-label">Lifestyle & Daily Routine Guidelines</span>
                      <ul className="ayur-rec-list">
                        {recommendations.vihara.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendations.classical_formulations && (
                    <div className="ayur-rec-block">
                      <span className="ayur-rec-label">Supportive Herbal Formulations</span>
                      <ul className="ayur-rec-list">
                        {recommendations.classical_formulations.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
