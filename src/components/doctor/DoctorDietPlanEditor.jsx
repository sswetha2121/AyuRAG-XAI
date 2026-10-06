import React, { useState, useEffect } from 'react';
import './DoctorDietPlanEditor.css';
import { api } from '../../services/api';
import {
  Utensils,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileCheck,
  BookOpen,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
  X,
  History,
  Layers,
  ChevronDown,
  Info,
  Flame,
  Droplets,
  HeartPulse
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorDietPlanEditor = ({
  patientId,
  patientData,
  effectiveProfile,
  onTriggerToast,
}) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [planForm, setPlanForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [activeTab, setActiveTab] = useState('meals'); // 'meals' | 'guidelines' | 'rag' | 'notes' | 'history'

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const res = await api.getPatientDietPlans(patientId);
      const planList = res.diet_plans || [];
      setPlans(planList);

      if (planList.length > 0) {
        // If an active plan exists, select it; otherwise select the newest draft
        const active = planList.find((p) => p.status === 'ACTIVE');
        const defaultPlan = active || planList[0];
        setSelectedPlanId(defaultPlan.id);
        setPlanForm(JSON.parse(JSON.stringify(defaultPlan)));
      } else {
        setSelectedPlanId(null);
        setPlanForm(null);
      }
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Diet Plans Failed',
        message: err.message || 'Could not load diet plans for this patient.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPlans();
    }
  }, [patientId]);

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    const chosen = plans.find((p) => p.id === planId);
    if (chosen) {
      setPlanForm(JSON.parse(JSON.stringify(chosen)));
    }
  };

  const handleGenerateDiet = async () => {
    try {
      setIsGenerating(true);
      const res = await api.generateDietPlan(patientId);
      onTriggerToast?.({
        type: 'success',
        title: 'Diet Plan Generated',
        message: res.message || 'New personalized diet plan draft created.',
      });
      await fetchPlans();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Generation Failed',
        message: err.message || 'Failed to synthesize personalized diet plan.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!planForm?.id) return;
    try {
      setIsSaving(true);
      const res = await api.updateDietPlan(planForm.id, planForm);
      onTriggerToast?.({
        type: 'success',
        title: 'Draft Saved',
        message: res.message || 'Physician modifications saved successfully.',
      });
      // Update plan in list
      setPlans((prev) => prev.map((p) => (p.id === planForm.id ? res.diet_plan : p)));
      setPlanForm(JSON.parse(JSON.stringify(res.diet_plan)));
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save diet plan modifications.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprovePlan = async () => {
    if (!planForm?.id) return;
    try {
      setIsApproving(true);
      const res = await api.approveDietPlan(planForm.id, {
        notes: planForm.doctor_notes || 'Approved and activated by attending physician.',
      });
      onTriggerToast?.({
        type: 'success',
        title: 'Diet Plan Activated!',
        message: `Plan v${res.diet_plan?.version} is now ACTIVE. Patient has been notified.`,
      });
      setShowApproveModal(false);
      await fetchPlans();
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Approval Failed',
        message: err.message || 'Could not approve and activate diet plan.',
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Meal item editor helpers
  const handleMealChange = (mealKey, field, val) => {
    setPlanForm((prev) => ({
      ...prev,
      [mealKey]: {
        ...(prev[mealKey] || {}),
        [field]: val,
      },
    }));
  };

  const handleAddMealItem = (mealKey) => {
    setPlanForm((prev) => {
      const currentItems = prev[mealKey]?.items || [];
      return {
        ...prev,
        [mealKey]: {
          ...(prev[mealKey] || {}),
          items: [...currentItems, 'New dietary item / preparation'],
        },
      };
    });
  };

  const handleUpdateMealItem = (mealKey, itemIndex, val) => {
    setPlanForm((prev) => {
      const items = [...(prev[mealKey]?.items || [])];
      items[itemIndex] = val;
      return {
        ...prev,
        [mealKey]: {
          ...(prev[mealKey] || {}),
          items,
        },
      };
    });
  };

  const handleRemoveMealItem = (mealKey, itemIndex) => {
    setPlanForm((prev) => {
      const items = (prev[mealKey]?.items || []).filter((_, i) => i !== itemIndex);
      return {
        ...prev,
        [mealKey]: {
          ...(prev[mealKey] || {}),
          items,
        },
      };
    });
  };

  // Guidelines helper (foods to include / avoid, lifestyle, precautions)
  const handleGuidelineItemUpdate = (fieldKey, index, val) => {
    setPlanForm((prev) => {
      const arr = [...(prev[fieldKey] || [])];
      arr[index] = val;
      return { ...prev, [fieldKey]: arr };
    });
  };

  const handleAddGuidelineItem = (fieldKey) => {
    setPlanForm((prev) => ({
      ...prev,
      [fieldKey]: [...(prev[fieldKey] || []), 'New clinical guidance entry'],
    }));
  };

  const handleRemoveGuidelineItem = (fieldKey, index) => {
    setPlanForm((prev) => ({
      ...prev,
      [fieldKey]: (prev[fieldKey] || []).filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="ayur-diet-loading">
        <div className="ayur-spinner-mini" />
        <span>Loading personalized diet plan protocols...</span>
      </div>
    );
  }

  const mealSlots = [
    { key: 'breakfast', label: 'Prātaḥ-āśā (Breakfast)', icon: Flame },
    { key: 'mid_morning', label: 'Madhya-āśā (Mid-Morning)', icon: Droplets },
    { key: 'lunch', label: 'Madhyāhna-bhojana (Lunch - Main Meal)', icon: Utensils },
    { key: 'evening', label: 'Sāyaṁ-āśā (Evening Snack & Herbals)', icon: HeartPulse },
    { key: 'dinner', label: 'Rātri-bhojana (Dinner - Light Pathya)', icon: Clock },
  ];

  return (
    <div className="ayur-diet-editor-container">
      {/* Top Bar: Version Switcher & Primary Actions */}
      <div className="ayur-diet-header">
        <div className="ayur-diet-header__left">
          <div className="flex items-center gap-xs">
            <Utensils size={20} className="text-primary" />
            <h2 className="ayur-diet-title">Personalized Dietary Clinical Protocol</h2>
          </div>

          {plans.length > 0 && (
            <div className="ayur-version-selector-group">
              <span className="text-xs text-muted font-semibold uppercase">Version:</span>
              <div className="flex items-center gap-xs flex-wrap">
                {plans.map((p) => {
                  const isActive = p.status === 'ACTIVE';
                  const isSelected = p.id === selectedPlanId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`ayur-vbtn ${isSelected ? 'ayur-vbtn--selected' : ''} ${isActive ? 'ayur-vbtn--active-plan' : ''}`}
                      onClick={() => handleSelectPlan(p.id)}
                    >
                      <span>v{p.version}</span>
                      {isActive && <span className="ayur-active-dot">● ACTIVE</span>}
                      {p.status === 'DRAFT' && <span className="ayur-draft-dot">DRAFT</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="ayur-diet-header__right">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateDiet}
            disabled={isGenerating}
            leftIcon={<Sparkles size={16} />}
          >
            {isGenerating ? 'Synthesizing...' : 'Generate New AI Plan Draft'}
          </Button>

          {planForm && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving || planForm.status === 'ARCHIVED'}
                leftIcon={<Save size={16} />}
              >
                {isSaving ? 'Saving...' : 'Save Modifications'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowApproveModal(true)}
                disabled={isApproving || planForm.status === 'ACTIVE'}
                leftIcon={<ShieldCheck size={16} />}
              >
                {planForm.status === 'ACTIVE' ? 'Currently Active' : 'Approve & Activate'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Empty State if No Plan Exists Yet */}
      {!planForm && (
        <div className="ayur-diet-empty-card">
          <div className="ayur-empty-icon">
            <Sparkles size={36} className="text-secondary" />
          </div>
          <h3>No Diet Plan Generated Yet</h3>
          <p>
            Synthesize an individualized dietary regimen informed by doctor-verified
            body constitution, metabolic digestive status, and evidence citations.
          </p>
          <Button
            variant="primary"
            onClick={handleGenerateDiet}
            disabled={isGenerating}
            leftIcon={<Sparkles size={16} />}
          >
            {isGenerating ? 'Synthesizing Plan...' : 'Generate Personalized Diet Plan'}
          </Button>
        </div>
      )}

      {/* Active Plan Workspace */}
      {planForm && (
        <div className="ayur-diet-workspace">
          {/* Plan Provenance & Metadata Banner */}
          <div className="ayur-diet-meta-banner">
            <div className="ayur-meta-row">
              <div className="flex items-center gap-sm flex-wrap">
                <input
                  type="text"
                  className="ayur-plan-title-input"
                  value={planForm.title || ''}
                  onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                />
                <span className={`ayur-status-chip ayur-status-chip--${planForm.status.toLowerCase()}`}>
                  {planForm.status}
                </span>
                <span className="ayur-prov-chip">
                  PROVENANCE: {planForm.generated_by}
                </span>
              </div>

              {planForm.approved_by_name && (
                <div className="ayur-approved-stamp">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>
                    Clinically Approved by <strong>{planForm.approved_by_name}</strong> on{' '}
                    {new Date(planForm.approved_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="ayur-meta-inputs-grid">
              <div className="ayur-minput-group">
                <label>Cycle Duration:</label>
                <input
                  type="text"
                  value={planForm.duration || ''}
                  onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                  placeholder="e.g. 4 Weeks"
                />
              </div>
              <div className="ayur-minput-group grow">
                <label>Clinical Objective:</label>
                <input
                  type="text"
                  value={planForm.objective || ''}
                  onChange={(e) => setPlanForm({ ...planForm, objective: e.target.value })}
                  placeholder="e.g. Pacify aggravated Vata, kindle Vishama Agni, hydrate Rasa dhatu"
                />
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="ayur-diet-subtabs">
            <button
              type="button"
              className={`ayur-subtab ${activeTab === 'meals' ? 'ayur-subtab--active' : ''}`}
              onClick={() => setActiveTab('meals')}
            >
              <Utensils size={15} />
              <span>Meal Regimes (Diet)</span>
            </button>
            <button
              type="button"
              className={`ayur-subtab ${activeTab === 'guidelines' ? 'ayur-subtab--active' : ''}`}
              onClick={() => setActiveTab('guidelines')}
            >
              <FileCheck size={15} />
              <span>Dietary Guidelines</span>
            </button>
            <button
              type="button"
              className={`ayur-subtab ${activeTab === 'rag' ? 'ayur-subtab--active' : ''}`}
              onClick={() => setActiveTab('rag')}
            >
              <BookOpen size={15} />
              <span>Classical RAG Evidence</span>
            </button>
            <button
              type="button"
              className={`ayur-subtab ${activeTab === 'notes' ? 'ayur-subtab--active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <Info size={15} />
              <span>Physician Rx & Notes</span>
            </button>
            <button
              type="button"
              className={`ayur-subtab ${activeTab === 'history' ? 'ayur-subtab--active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={15} />
              <span>Version Audit ({planForm.version_history?.length || 0})</span>
            </button>
          </div>

          {/* TAB 1: MEAL SLOTS */}
          {activeTab === 'meals' && (
            <div className="ayur-meals-grid">
              {mealSlots.map((slot) => {
                const mealData = planForm[slot.key] || {};
                const items = mealData.items || [];
                const Icon = slot.icon;

                return (
                  <div key={slot.key} className="ayur-meal-card">
                    <div className="ayur-meal-card__header">
                      <div className="flex items-center gap-xs">
                        <Icon size={16} className="text-secondary" />
                        <h4 className="ayur-meal-card__title">{slot.label}</h4>
                      </div>
                      <input
                        type="text"
                        className="ayur-meal-time-input"
                        value={mealData.time || ''}
                        onChange={(e) => handleMealChange(slot.key, 'time', e.target.value)}
                        placeholder="Time window..."
                      />
                    </div>

                    <div className="ayur-meal-headline-input-wrap">
                      <label className="text-xs text-muted font-semibold">Regime Title / Theme:</label>
                      <input
                        type="text"
                        className="ayur-input-sm"
                        value={mealData.title || ''}
                        onChange={(e) => handleMealChange(slot.key, 'title', e.target.value)}
                        placeholder="e.g. Spiced Moong Khichdi..."
                      />
                    </div>

                    <div className="ayur-meal-items-list">
                      <label className="text-xs text-muted font-semibold">Prescribed Items & Formulations:</label>
                      {items.map((item, idx) => (
                        <div key={idx} className="ayur-meal-item-row">
                          <input
                            type="text"
                            className="ayur-meal-item-input"
                            value={item}
                            onChange={(e) => handleUpdateMealItem(slot.key, idx, e.target.value)}
                          />
                          <button
                            type="button"
                            className="ayur-item-del-btn"
                            onClick={() => handleRemoveMealItem(slot.key, idx)}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="ayur-add-item-btn"
                        onClick={() => handleAddMealItem(slot.key)}
                      >
                        <Plus size={14} />
                        <span>Add Dietary Item</span>
                      </button>
                    </div>

                    <div className="ayur-meal-properties">
                      <div className="ayur-mprop-item">
                        <span className="ayur-mprop-label">Calorie Guidance:</span>
                        <input
                          type="text"
                          className="ayur-input-xs"
                          value={mealData.calories_approx || ''}
                          onChange={(e) => handleMealChange(slot.key, 'calories_approx', e.target.value)}
                          placeholder="e.g. 450 - 500 kcal"
                        />
                      </div>
                      <div className="ayur-mprop-item">
                        <span className="ayur-mprop-label">Ayurvedic Properties (Guna/Virya):</span>
                        <input
                          type="text"
                          className="ayur-input-xs"
                          value={mealData.ayurvedic_properties || ''}
                          onChange={(e) => handleMealChange(slot.key, 'ayurvedic_properties', e.target.value)}
                          placeholder="e.g. Snigdha, Laghu, Deepana"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: GUIDELINES (PATHYA / APATHYA) */}
          {activeTab === 'guidelines' && (
            <div className="ayur-guidelines-grid">
              {/* Foods to Include */}
              <div className="ayur-guide-card ayur-guide-card--include">
                <div className="ayur-guide-card__header">
                  <h4 className="text-success font-serif font-bold">Foods to Include (Wholesome Options)</h4>
                  <button
                    type="button"
                    className="ayur-mini-add-btn"
                    onClick={() => handleAddGuidelineItem('foods_to_include')}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="ayur-guide-list">
                  {(planForm.foods_to_include || []).map((item, idx) => (
                    <div key={idx} className="ayur-guide-row">
                      <input
                        type="text"
                        className="ayur-guide-input"
                        value={item}
                        onChange={(e) => handleGuidelineItemUpdate('foods_to_include', idx, e.target.value)}
                      />
                      <button
                        type="button"
                        className="ayur-item-del-btn"
                        onClick={() => handleRemoveGuidelineItem('foods_to_include', idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div className="ayur-guide-card ayur-guide-card--avoid">
                <div className="ayur-guide-card__header">
                  <h4 className="text-danger font-serif font-bold">Foods to Avoid (Contraindications)</h4>
                  <button
                    type="button"
                    className="ayur-mini-add-btn"
                    onClick={() => handleAddGuidelineItem('foods_to_avoid')}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="ayur-guide-list">
                  {(planForm.foods_to_avoid || []).map((item, idx) => (
                    <div key={idx} className="ayur-guide-row">
                      <input
                        type="text"
                        className="ayur-guide-input"
                        value={item}
                        onChange={(e) => handleGuidelineItemUpdate('foods_to_avoid', idx, e.target.value)}
                      />
                      <button
                        type="button"
                        className="ayur-item-del-btn"
                        onClick={() => handleRemoveGuidelineItem('foods_to_avoid', idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Guidance */}
              <div className="ayur-guide-card">
                <div className="ayur-guide-card__header">
                  <h4 className="text-primary font-serif font-bold">Lifestyle Guidance (Daily Routine & Activity)</h4>
                  <button
                    type="button"
                    className="ayur-mini-add-btn"
                    onClick={() => handleAddGuidelineItem('lifestyle_notes')}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="ayur-guide-list">
                  {(planForm.lifestyle_notes || []).map((item, idx) => (
                    <div key={idx} className="ayur-guide-row">
                      <input
                        type="text"
                        className="ayur-guide-input"
                        value={item}
                        onChange={(e) => handleGuidelineItemUpdate('lifestyle_notes', idx, e.target.value)}
                      />
                      <button
                        type="button"
                        className="ayur-item-del-btn"
                        onClick={() => handleRemoveGuidelineItem('lifestyle_notes', idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions */}
              <div className="ayur-guide-card">
                <div className="ayur-guide-card__header">
                  <h4 className="text-warning font-serif font-bold">Clinical Precautions & Timing Rules</h4>
                  <button
                    type="button"
                    className="ayur-mini-add-btn"
                    onClick={() => handleAddGuidelineItem('precautions')}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="ayur-guide-list">
                  {(planForm.precautions || []).map((item, idx) => (
                    <div key={idx} className="ayur-guide-row">
                      <input
                        type="text"
                        className="ayur-guide-input"
                        value={item}
                        onChange={(e) => handleGuidelineItemUpdate('precautions', idx, e.target.value)}
                      />
                      <button
                        type="button"
                        className="ayur-item-del-btn"
                        onClick={() => handleRemoveGuidelineItem('precautions', idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLASSICAL RAG EVIDENCE */}
          {activeTab === 'rag' && (
            <div className="ayur-rag-evidence-container">
              <div className="ayur-rag-intro">
                <BookOpen size={20} className="text-secondary" />
                <div>
                  <h4 className="font-serif font-bold text-primary">Authentic Classical Citations (RAG Retrieval)</h4>
                  <p className="text-sm text-muted">
                    Verified classical principles retrieved from primary Ayurvedic compendia (Charaka, Sushruta, Ashtanga Hridaya) matching the verified patient constitution and symptomatology.
                  </p>
                </div>
              </div>

              <div className="ayur-rag-cards-list">
                {(planForm.knowledge_references || []).map((ref, idx) => (
                  <div key={idx} className="ayur-rag-card">
                    <div className="ayur-rag-card__top">
                      <span className="ayur-rag-source">{ref.source}</span>
                      {ref.relevance_score > 0 && (
                        <span className="ayur-rag-score">Relevance: {(ref.relevance_score * 100).toFixed(0)}%</span>
                      )}
                    </div>
                    {ref.retrieved_text && (
                      <p className="ayur-rag-sanskrit">{ref.retrieved_text}</p>
                    )}
                    {ref.translation && (
                      <p className="ayur-rag-translation">
                        <strong>Translation:</strong> {ref.translation}
                      </p>
                    )}
                    {ref.passage && !ref.retrieved_text && (
                      <p className="ayur-rag-passage">{ref.passage}</p>
                    )}
                  </div>
                ))}
                {(!planForm.knowledge_references || planForm.knowledge_references.length === 0) && (
                  <div className="ayur-rag-unavailable">
                    <AlertCircle size={20} className="text-warning" />
                    <span>Knowledge retrieval unavailable for this configuration.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PHYSICIAN RX & REASONING */}
          {activeTab === 'notes' && (
            <div className="ayur-notes-container">
              <div className="ayur-form-group">
                <label className="ayur-label">AI Explainable Clinical Rationale (Transparent Algorithm Output)</label>
                <div className="ayur-ai-reasoning-box">
                  <Sparkles size={16} className="text-secondary shrink-0 mt-xs" />
                  <p>{planForm.ai_reasoning || 'Individualized formulation based on multi-parameter clinical assessment.'}</p>
                </div>
              </div>

              <div className="ayur-form-group">
                <label className="ayur-label">Attending Doctor Notes & Clinical Instructions (Visible to Patient)</label>
                <textarea
                  className="ayur-textarea"
                  rows={5}
                  value={planForm.doctor_notes || ''}
                  onChange={(e) => setPlanForm({ ...planForm, doctor_notes: e.target.value })}
                  placeholder="Enter specific doctor advice, custom herbals, follow-up timelines, or modifications..."
                />
              </div>
            </div>
          )}

          {/* TAB 5: VERSION HISTORY */}
          {activeTab === 'history' && (
            <div className="ayur-version-history-container">
              <h4 className="font-serif font-bold text-primary mb-md">Historical Plan Snapshots</h4>
              <div className="ayur-history-timeline">
                {(planForm.version_history || []).map((hist) => (
                  <div key={hist.id} className="ayur-timeline-item">
                    <div className="ayur-timeline-dot" />
                    <div className="ayur-timeline-content">
                      <div className="flex items-center justify-between mb-xs">
                        <span className="font-bold text-primary">Version {hist.version_number}</span>
                        <span className="text-xs text-muted">
                          {new Date(hist.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted">{hist.change_summary || 'Plan update snapshot.'}</p>
                      <small className="text-xs text-secondary">
                        Logged by: {hist.created_by_name || 'System / AI'}
                      </small>
                    </div>
                  </div>
                ))}
                {(!planForm.version_history || planForm.version_history.length === 0) && (
                  <p className="text-sm text-muted italic">No prior archived snapshots for this plan.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal Before Activation */}
      {showApproveModal && (
        <div className="ayur-approve-modal-overlay">
          <div className="ayur-approve-modal">
            <div className="ayur-amodal-header">
              <div className="flex items-center gap-xs">
                <ShieldCheck size={20} className="text-success" />
                <h3 className="font-serif font-bold text-primary">Confirm Clinical Activation</h3>
              </div>
              <button
                type="button"
                className="ayur-modal-close"
                onClick={() => setShowApproveModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ayur-amodal-body">
              <div className="ayur-amodal-warning">
                <AlertCircle size={20} className="text-accent shrink-0" />
                <p className="text-sm">
                  You are about to activate <strong>{planForm.title} (v{planForm.version})</strong>.
                </p>
              </div>

              <ul className="ayur-amodal-points">
                <li>This plan will become the <strong>sole ACTIVE diet plan</strong> visible to the patient.</li>
                <li>Any previously active diet plan for this patient will be automatically <strong>ARCHIVED</strong>.</li>
                <li>A permanent version snapshot will be logged in the clinical audit history.</li>
                <li>The patient will receive an immediate notification that their personalized diet plan is approved.</li>
              </ul>
            </div>

            <div className="ayur-amodal-footer">
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
                disabled={isApproving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleApprovePlan}
                disabled={isApproving}
                leftIcon={<ShieldCheck size={16} />}
              >
                {isApproving ? 'Activating Plan...' : 'Confirm & Activate'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
