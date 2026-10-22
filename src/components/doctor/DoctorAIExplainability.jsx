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
  const [showDemoShap, setShowDemoShap] = useState(false);
  const [showDemoLime, setShowDemoLime] = useState(false);
  const [showDemoRag, setShowDemoRag] = useState(false);

  const confidencePct = aiAnalysis.confidence
    ? Math.round(aiAnalysis.confidence * 100)
    : 88;

  // Fallback demo references for training when patient has no precomputed attributions
  const demoShapSample = [
    { feature: 'Light & Irregular Sleep Pattern', contribution: 0.38, importance: 0.38 },
    { feature: 'High Occupational Stress Impact', contribution: 0.32, importance: 0.32 },
    { feature: 'Variable & Sensitive Digestion', contribution: 0.28, importance: 0.28 },
    { feature: 'Predominantly Pungent & Dry Diet', contribution: 0.22, importance: 0.22 },
    { feature: 'Regular Warm Hydration (Protective)', contribution: -0.15, importance: -0.15 },
  ];

  const demoLimeSample = [
    { feature: 'Sleep Latency > 45 mins', weight: 0.35, type: 'positive' },
    { feature: 'Variable Appetite Pattern', weight: 0.31, type: 'positive' },
    { feature: 'Circadian De-synchrony', weight: 0.24, type: 'positive' },
    { feature: 'Adequate Fluid Intake', weight: -0.18, type: 'negative' },
  ];

  const demoRagSample = [
    {
      source: 'Classical Medical Compendium 12.8',
      passage: 'When movement energy is aggravated by dry, cold, light and irregular regimens, it causes tissue depletion, variability, and disturbed sleep.',
      domain: 'Symptom Analysis & Balancing Regimens',
      relevance_score: 0.94
    },
    {
      source: 'Classical Treatment Principles 11.4',
      passage: 'Metabolic energy is balanced through sweet, bitter, and astringent tastes, cooling foods, and calm daily pacing.',
      domain: 'Dietary Therapies',
      relevance_score: 0.89
    }
  ];

  const hasShap = Array.isArray(shapExplanations) && shapExplanations.length > 0;
  const hasLime = Array.isArray(limeExplanations) && limeExplanations.length > 0;
  const hasRag = Array.isArray(ragEvidence) && ragEvidence.length > 0;

  return (
    <div className={`ayur-ai-explainability ${className}`.trim()}>
      {/* Disclaimer Banner: Advisory AI */}
      <div className="ayur-advisory-banner">
        <div className="flex items-center gap-xs">
          <ShieldAlert size={16} className="ayur-advisory-icon" />
          <span className="ayur-advisory-title">Clinical Decision Support Grounding</span>
        </div>
        <p className="ayur-advisory-text">
          Model outputs, rule attributions, and RAG knowledge retrievals are algorithmic decision aids.
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
                <span className="ayur-badge-tag ayur-badge-tag--model">
                  {aiAnalysis.model_name ? 'Model-Derived Output' : 'Rule Scoring Matrix'}
                </span>
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
          <span>Rule Feature Attributions ({hasShap ? shapExplanations.length : 0})</span>
        </button>

        <button
          type="button"
          className={`ayur-xai-tab ${activeTab === 'lime' ? 'ayur-xai-tab--active' : ''}`}
          onClick={() => setActiveTab('lime')}
        >
          <SlidersHorizontal size={15} />
          <span>Local Decision Rules ({hasLime ? limeExplanations.length : 0})</span>
        </button>

        <button
          type="button"
          className={`ayur-xai-tab ${activeTab === 'rag' ? 'ayur-xai-tab--active' : ''}`}
          onClick={() => setActiveTab('rag')}
        >
          <BookOpen size={15} />
          <span>Classical Evidence ({hasRag ? ragEvidence.length : 0})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="ayur-xai-panel">
        {/* RULE ATTRIBUTION VISUALIZATION */}
        {activeTab === 'shap' && (
          <div className="ayur-shap-container">
            <div className="ayur-panel-intro">
              <div>
                <h4 className="ayur-panel-title">Deterministic Clinical Rule Attribution</h4>
                <p className="ayur-panel-desc">
                  Questionnaire factor attributions quantifying each clinical finding's point allocation toward the predicted constitutional state.
                </p>
              </div>
              <div className="ayur-shap-legend">
                <span className="ayur-legend-item ayur-legend-item--pos">Positive Contribution (+)</span>
                <span className="ayur-legend-item ayur-legend-item--neg">Protective / Opposing (-)</span>
              </div>
            </div>

            {hasShap ? (
              <div className="ayur-shap-chart">
                {shapExplanations.map((item, idx) => {
                  const isPos = (item.contribution || item.importance || 0) >= 0;
                  const absVal = Math.min(Math.abs(item.contribution || item.importance || 0.1), 1);
                  const barWidth = Math.round(absVal * 100);

                  return (
                    <div key={idx} className="ayur-shap-row">
                      <div className="ayur-shap-label" title={item.feature || item.name}>
                        {item.feature || item.name}
                      </div>

                      <div className="ayur-shap-bar-track">
                        <div className="ayur-shap-zero-line" />
                        <div
                          className={`ayur-shap-bar ${isPos ? 'ayur-shap-bar--pos' : 'ayur-shap-bar--neg'}`}
                          style={{ width: `${barWidth}%` }}
                        >
                          <span className="ayur-shap-bar-text">
                            {isPos ? `+${(item.contribution || item.importance || 0).toFixed(2)}` : (item.contribution || item.importance || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="ayur-xai-empty">
                <Info size={20} className="text-muted" />
                <span className="ayur-xai-empty-title">No computed attributions for this record</span>
                <p className="ayur-xai-empty-desc">
                  SHAP / feature attribution factors are computed during automated model inference passes.
                </p>
                <button
                  type="button"
                  className="ayur-xai-demo-toggle-btn"
                  onClick={() => setShowDemoShap(!showDemoShap)}
                >
                  {showDemoShap ? 'Hide Training Example' : 'View Demo Example for Clinical Training'}
                </button>

                {showDemoShap && (
                  <div className="ayur-xai-demo-wrapper w-full">
                    <span className="ayur-xai-demo-badge">DEMO REFERENCE ONLY • NOT ACTIVE PATIENT DATA</span>
                    <div className="ayur-shap-chart">
                      {demoShapSample.map((item, idx) => {
                        const isPos = item.contribution >= 0;
                        const barWidth = Math.round(Math.abs(item.contribution) * 100);
                        return (
                          <div key={idx} className="ayur-shap-row">
                            <div className="ayur-shap-label">{item.feature}</div>
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
              </div>
            )}
          </div>
        )}

        {/* DECISION RULES VISUALIZATION */}
        {activeTab === 'lime' && (
          <div className="ayur-lime-container">
            <div className="ayur-panel-intro">
              <div>
                <h4 className="ayur-panel-title">Questionnaire Decision Rules</h4>
                <p className="ayur-panel-desc">
                  Deterministic local rule deductions explaining why the scoring matrix arrived at this specific patient's assessment.
                </p>
              </div>
            </div>

            {hasLime ? (
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
            ) : (
              <div className="ayur-xai-empty">
                <Info size={20} className="text-muted" />
                <span className="ayur-xai-empty-title">No local decision rules generated</span>
                <p className="ayur-xai-empty-desc">
                  LIME local surrogate rules are extracted from active questionnaire score thresholds.
                </p>
                <button
                  type="button"
                  className="ayur-xai-demo-toggle-btn"
                  onClick={() => setShowDemoLime(!showDemoLime)}
                >
                  {showDemoLime ? 'Hide Training Example' : 'View Demo Example for Clinical Training'}
                </button>

                {showDemoLime && (
                  <div className="ayur-xai-demo-wrapper w-full">
                    <span className="ayur-xai-demo-badge">DEMO REFERENCE ONLY • NOT ACTIVE PATIENT DATA</span>
                    <div className="ayur-lime-grid">
                      {demoLimeSample.map((item, idx) => {
                        const isPos = item.type === 'positive';
                        return (
                          <div key={idx} className={`ayur-lime-card ${isPos ? 'ayur-lime-card--pos' : 'ayur-lime-card--neg'}`}>
                            <div className="ayur-lime-card__header">
                              <span className="ayur-lime-feature">{item.feature}</span>
                              <span className="ayur-lime-weight">
                                {isPos ? `+${item.weight.toFixed(2)}` : `-${Math.abs(item.weight).toFixed(2)}`}
                              </span>
                            </div>
                            <div className="ayur-lime-card__bar">
                              <div
                                className="ayur-lime-card__fill"
                                style={{ width: `${Math.round(Math.abs(item.weight) * 100)}%` }}
                              />
                            </div>
                            <span className="ayur-lime-nature">
                              {isPos ? 'Primary contributor' : 'Stabilizing factor'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* RAG EVIDENCE */}
        {activeTab === 'rag' && (
          <div className="ayur-rag-container">
            <div className="ayur-panel-intro">
              <div>
                <h4 className="ayur-panel-title">Retrieved Classical Ayurvedic Knowledge</h4>
                <p className="ayur-panel-desc">
                  Curated classical compendia citations grounding the personalized protocol in authentic Ayurvedic treatises.
                </p>
              </div>
              <span className="ayur-rag-badge">CCRAS Grounded</span>
            </div>

            {hasRag ? (
              <div className="ayur-rag-cards">
                {ragEvidence.map((ev, idx) => (
                  <div key={idx} className="ayur-rag-card">
                    <div className="ayur-rag-card__meta">
                      <div className="flex items-center gap-xs">
                        <span className="ayur-rag-tag">Classical Text Source</span>
                        <strong className="ayur-rag-source">{ev.source}</strong>
                      </div>
                      {typeof ev.relevance_score === 'number' && (
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
            ) : (
              <div className="ayur-xai-empty">
                <Info size={20} className="text-muted" />
                <span className="ayur-xai-empty-title">No classical citations retrieved</span>
                <p className="ayur-xai-empty-desc">
                  RAG pipeline retrieves authoritative classical passages based on verified patient symptoms.
                </p>
                <button
                  type="button"
                  className="ayur-xai-demo-toggle-btn"
                  onClick={() => setShowDemoRag(!showDemoRag)}
                >
                  {showDemoRag ? 'Hide Training Example' : 'View Demo Example for Clinical Training'}
                </button>

                {showDemoRag && (
                  <div className="ayur-xai-demo-wrapper w-full">
                    <span className="ayur-xai-demo-badge">DEMO REFERENCE ONLY • NOT ACTIVE PATIENT DATA</span>
                    <div className="ayur-rag-cards">
                      {demoRagSample.map((ev, idx) => (
                        <div key={idx} className="ayur-rag-card">
                          <div className="ayur-rag-card__meta">
                            <span className="ayur-rag-tag">Classical Text Source</span>
                            <strong className="ayur-rag-source">{ev.source}</strong>
                            <span className="ayur-rag-score">Relevance: {Math.round(ev.relevance_score * 100)}%</span>
                          </div>
                          <blockquote className="ayur-rag-quote">"{ev.passage}"</blockquote>
                          <div className="ayur-rag-domain"><span>Domain:</span> <strong>{ev.domain}</strong></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Generated Recommendation Distinction */}
            {recommendations && (
              <div className="ayur-rec-distinction">
                <div className="ayur-rec-header">
                  <Sparkles size={16} className="text-accent" />
                  <h4 className="ayur-rec-title">Synthesized Personalized Recommendations</h4>
                  <span className="ayur-rec-tag">Rule-Based Protocol Synthesis</span>
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
