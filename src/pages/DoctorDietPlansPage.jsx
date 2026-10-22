import React, { useState, useEffect } from 'react';
import './DoctorDietPlansPage.css';
import { api } from '../services/api';
import { DoctorDietPlanEditor } from '../components/doctor/DoctorDietPlanEditor';
import {
  Utensils,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  HeartPulse,
  Leaf,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DoctorDietPlansPage = ({ onTriggerToast }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [showGeneratorPanel, setShowGeneratorPanel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planRefreshKey, setPlanRefreshKey] = useState(0);

  // Clinical Diet Generator Configuration state
  const [dietaryPreference, setDietaryPreference] = useState('VEGETARIAN');
  const [regionalPreference, setRegionalPreference] = useState('South Indian');
  const [mealFrequency, setMealFrequency] = useState(5);
  const [excludedAllergens, setExcludedAllergens] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState('1800');
  const [clinicalTargetNotes, setClinicalTargetNotes] = useState(
    'Promote metabolic equilibrium, nourish digestive agni, prioritize easily digestible warm preparations'
  );

  const allergenOptions = [
    { id: 'Gluten', label: 'Gluten' },
    { id: 'Dairy', label: 'Dairy / Lactose' },
    { id: 'Peanuts', label: 'Peanuts' },
    { id: 'Soy', label: 'Soy' },
    { id: 'Tree Nuts', label: 'Tree Nuts' },
    { id: 'Nightshades', label: 'Nightshades' },
  ];

  const fetchAssignedPatients = async () => {
    try {
      setIsLoadingPatients(true);
      const res = await api.getDoctorPatients({ scope: 'assigned' });
      const pts = res.patients || [];
      setPatients(pts);

      if (pts.length > 0) {
        // Select first patient by default if none selected
        const defaultPt = pts[0];
        setSelectedPatientId(defaultPt.patient || defaultPt.id);
        loadPatientDetail(defaultPt.patient || defaultPt.id);
      }
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Error Loading Patients',
        message: err.message || 'Could not load your assigned patients.',
      });
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const loadPatientDetail = async (patientId) => {
    try {
      const data = await api.getDoctorPatientDetail(patientId);
      setSelectedPatientData(data);
    } catch (err) {
      console.log('Error loading patient detail:', err);
    }
  };

  useEffect(() => {
    fetchAssignedPatients();
  }, []);

  const handleSelectPatient = (ptId) => {
    setSelectedPatientId(ptId);
    loadPatientDetail(ptId);
  };

  const toggleAllergen = (item) => {
    setExcludedAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleGeneratePlan = async () => {
    if (!selectedPatientId) {
      onTriggerToast?.({
        type: 'warning',
        title: 'No Patient Selected',
        message: 'Please select an assigned patient before generating a diet plan.',
      });
      return;
    }

    try {
      setIsGenerating(true);
      const config = {
        dietary_preference: dietaryPreference,
        regional_preference: regionalPreference,
        meal_frequency: mealFrequency,
        allergens_excluded: excludedAllergens,
        target_calories: calorieTarget,
        clinical_objective: clinicalTargetNotes,
      };

      const res = await api.generateDietPlan(selectedPatientId, config);

      onTriggerToast?.({
        type: 'success',
        title: 'Diet Plan Synthesized',
        message: res.message || 'Personalized clinical diet plan generated with deterministic nutrition calculations.',
      });

      setShowGeneratorPanel(false);
      setPlanRefreshKey((prev) => prev + 1);
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Plan Generation Failed',
        message: err.message || 'Failed to generate personalized diet plan.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ayur-diet-plans-page flex flex-col gap-lg">
      {/* 1. Header Banner */}
      <div className="ayur-diet-plans-header">
        <div className="flex items-center justify-between flex-wrap gap-md">
          <div>
            <div className="flex items-center gap-xs mb-xs">
              <span className="ayur-doc-pill">CLINICAL DIET GENERATOR & PROTOCOLS</span>
              <span className="ayur-doc-pill ayur-doc-pill--ifct">IFCT 2017 & AYUR-RAG</span>
            </div>
            <h1 className="ayur-diet-page-title">Personalized Dietary Management</h1>
            <p className="ayur-diet-page-desc">
              Generate, customize, recalculate, and approve evidence-grounded Ayurvedic nutrition regimens.
            </p>
          </div>

          <div className="flex items-center gap-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAssignedPatients}
              leftIcon={<RefreshCw size={15} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowGeneratorPanel(!showGeneratorPanel)}
              leftIcon={<Sparkles size={16} />}
            >
              {showGeneratorPanel ? 'Close Generator Config' : 'Configure New Diet Plan'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Patient Selector Bar */}
      <div className="ayur-patient-selector-card">
        <div className="flex items-center justify-between flex-wrap gap-sm mb-xs">
          <div className="flex items-center gap-xs text-xs font-semibold uppercase text-muted">
            <Users size={15} />
            <span>Assigned Patient Registry:</span>
          </div>
          {patients.length > 0 && (
            <span className="text-xs text-secondary font-medium">
              {patients.length} Patient{patients.length === 1 ? '' : 's'} Under Your Direct Care
            </span>
          )}
        </div>

        {isLoadingPatients ? (
          <div className="p-sm text-center text-xs text-muted">Loading assigned patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-md text-center text-xs text-muted bg-surface rounded-md border border-border">
            You do not currently have assigned patients. Navigate to <strong>Patients Cohort</strong> to assign patients to your care.
          </div>
        ) : (
          <div className="ayur-pt-pills-row">
            {patients.map((pt) => {
              const pId = pt.patient || pt.id;
              const isSelected = pId === selectedPatientId;
              const constitution = pt.primary_prakriti || 'Balanced';

              return (
                <button
                  key={pt.id}
                  type="button"
                  className={`ayur-pt-selector-btn ${isSelected ? 'ayur-pt-selector-btn--active' : ''}`}
                  onClick={() => handleSelectPatient(pId)}
                >
                  <div className="ayur-pt-avatar-mini">
                    {(pt.patient_name || 'PT')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="ayur-pt-sel-name">{pt.patient_name}</div>
                    <div className="ayur-pt-sel-meta">
                      <span>ID: AYU-{String(pt.id).padStart(4, '0')}</span> • <span>{constitution}</span>
                    </div>
                  </div>
                  {isSelected && <span className="ayur-pt-sel-check">✓ Active</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Collapsible Clinical Diet Generator Configuration Panel */}
      {showGeneratorPanel && (
        <div className="ayur-generator-config-card">
          <div className="ayur-gen-header">
            <div className="flex items-center gap-xs">
              <Sparkles size={18} className="text-accent" />
              <h3 className="font-serif font-bold text-base text-primary">
                Dietary Plan Synthesis Parameters
              </h3>
            </div>
            <span className="text-xs text-muted">
              Target Patient: <strong>{selectedPatientData?.patient_name || 'Selected Patient'}</strong>
            </span>
          </div>

          <div className="ayur-gen-disclaimer">
            <AlertCircle size={16} className="text-accent flex-shrink-0" />
            <span>
              <strong>Clinical Guardrails:</strong> Prakriti constitution is one contextual baseline input,
              not the sole determinant of nutritional requirements. Calculated totals are derived deterministically
              from IFCT 2017 portion data. Generated plans do not claim to treat, cure, or diagnose illness.
            </span>
          </div>

          <div className="ayur-gen-grid">
            {/* Dietary Preference */}
            <div className="ayur-gen-field">
              <label>Dietary Preference</label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="ayur-gen-select"
              >
                <option value="VEGETARIAN">Vegetarian (Lacto-Vegetarian)</option>
                <option value="VEGAN">Strict Vegan (Plant-Based)</option>
                <option value="EGG_INCLUSIVE">Vegetarian + Egg-Inclusive</option>
                <option value="SATTVIC">Sattvic / Ayurvedic Classic (No Onion/Garlic)</option>
              </select>
            </div>

            {/* Regional Preference */}
            <div className="ayur-gen-field">
              <label>Regional Cuisine & Staples</label>
              <select
                value={regionalPreference}
                onChange={(e) => setRegionalPreference(e.target.value)}
                className="ayur-gen-select"
              >
                <option value="South Indian">South Indian (Rice, Dal, Coconut, Sambar)</option>
                <option value="North Indian">North Indian (Whole Wheat Roti, Moong, Sabzi)</option>
                <option value="Western Indian">Western Indian (Khichdi, Kadhi, Millets)</option>
                <option value="Eastern Indian">Eastern Indian (Rice, Lentil broths, Stews)</option>
                <option value="Pan-Indian">Pan-Indian Balanced Staples</option>
              </select>
            </div>

            {/* Meal Frequency */}
            <div className="ayur-gen-field">
              <label>Meal Frequency & Schedule</label>
              <select
                value={mealFrequency}
                onChange={(e) => setMealFrequency(Number(e.target.value))}
                className="ayur-gen-select"
              >
                <option value={3}>3 Meals / Day (Breakfast, Lunch, Dinner)</option>
                <option value={4}>4 Meals / Day (Breakfast, Lunch, Snack, Dinner)</option>
                <option value={5}>5 Meals / Day (Optimal Balanced Chronobiology)</option>
              </select>
            </div>

            {/* Caloric Target */}
            <div className="ayur-gen-field">
              <label>Estimated Calorie Target (kcal)</label>
              <input
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(e.target.value)}
                className="ayur-gen-input"
                placeholder="e.g. 1800"
              />
            </div>
          </div>

          {/* Allergens & Intolerances */}
          <div className="ayur-gen-allergens-section">
            <label className="text-xs font-semibold text-text-primary block mb-xs">
              Allergens & Food Intolerances to Exclude:
            </label>
            <div className="flex flex-wrap gap-xs">
              {allergenOptions.map((a) => {
                const isChecked = excludedAllergens.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={`ayur-allergen-chip ${isChecked ? 'ayur-allergen-chip--checked' : ''}`}
                    onClick={() => toggleAllergen(a.id)}
                  >
                    <span>{isChecked ? '✕' : '+'}</span>
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clinician Notes / Objectives */}
          <div className="ayur-gen-field mt-sm">
            <label>Clinician Target Objective & Guidance</label>
            <textarea
              rows={2}
              value={clinicalTargetNotes}
              onChange={(e) => setClinicalTargetNotes(e.target.value)}
              className="ayur-gen-textarea"
              placeholder="e.g. Calibrate for high digestive fire, soothe hyperacidity, emphasize warm soothing broths..."
            />
          </div>

          {/* Action Row */}
          <div className="ayur-gen-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGeneratorPanel(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              leftIcon={<Sparkles size={16} />}
            >
              {isGenerating ? 'Synthesizing with IFCT 2017 & Classical RAG...' : 'Generate Clinical Diet Plan'}
            </Button>
          </div>
        </div>
      )}

      {/* 4. Active Diet Plan Editor & Viewer */}
      {selectedPatientId ? (
        <DoctorDietPlanEditor
          key={`${selectedPatientId}-${planRefreshKey}`}
          patientId={selectedPatientId}
          patientData={selectedPatientData}
          effectiveProfile={selectedPatientData}
          onTriggerToast={onTriggerToast}
        />
      ) : (
        <div className="p-xl text-center text-muted">
          Select an assigned patient above to view, generate, or modify diet plans.
        </div>
      )}
    </div>
  );
};
