import React, { useState, useMemo } from 'react';
import './SymptomsAssessmentPage.css';
import { useAssessment } from '../context/AssessmentContext';
import { SYMPTOM_CATALOG, SYMPTOM_CATEGORIES } from '../data/symptomData';
import {
  SymptomSearchBar,
  SymptomCategoryFilter,
  SymptomCatalogGrid,
  SelectedSymptomCard,
  ChiefConcernSelector,
  SymptomSummary
} from '../components/symptoms';
import { Button, Badge, ProgressBar } from '../components/ui';
import { ArrowLeft, ArrowRight, Sparkles, Plus, CheckCircle2, RotateCcw } from 'lucide-react';

export const SymptomsAssessmentPage = ({ onContinueToNextPhase, onTriggerToast }) => {
  const {
    personalInfo,
    symptomAnswers,
    addSymptom,
    removeSymptom,
    updateSymptomDetail,
    setPrimaryConcern,
    setAdditionalNotes,
    resetSymptomAnswers,
    markStepCompleted
  } = useAssessment();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const selectedSymptoms = symptomAnswers.selectedSymptoms || [];
  const selectedIds = selectedSymptoms.map((s) => s.id);

  // Filter symptoms based on search and category
  const filteredSymptoms = useMemo(() => {
    return SYMPTOM_CATALOG.filter((sym) => {
      const matchesCategory = activeCategory === 'all' || sym.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const nameMatch = sym.name.toLowerCase().includes(term);
      const sanskritMatch = (sym.sanskritName || '').toLowerCase().includes(term);
      const descMatch = (sym.description || '').toLowerCase().includes(term);
      const keywordMatch = (sym.keywords || []).some((k) => k.toLowerCase().includes(term));

      return nameMatch || sanskritMatch || descMatch || keywordMatch;
    });
  }, [searchTerm, activeCategory]);

  const handleToggleSymptom = (sym) => {
    if (selectedIds.includes(sym.id)) {
      removeSymptom(sym.id);
    } else {
      addSymptom(sym);
      onTriggerToast?.({
        type: 'info',
        title: 'Symptom Added',
        message: `${sym.name} added to your health context.`
      });
    }
  };

  const handleContinue = () => {
    markStepCompleted('symptoms');
    onTriggerToast?.({
      type: 'success',
      title: 'Health Context Saved',
      message: `${selectedSymptoms.length} symptoms and primary focus registered for review.`
    });
    onContinueToNextPhase?.();
  };

  const handleReset = () => {
    if (window.confirm('Clear all recorded symptoms and chief concerns?')) {
      resetSymptomAnswers();
      onTriggerToast?.({
        type: 'info',
        title: 'Symptoms Cleared',
        message: 'All symptom context reset.'
      });
    }
  };

  return (
    <div className="ayur-symptoms-page">
      {/* 1. Global Pipeline Progress Header */}
      <div className="ayur-sym-global-pipeline">
        <div className="ayur-sym-pipeline-track">
          <div className="ayur-sym-pipeline-step ayur-sym-pipeline-step--done">
            <span className="ayur-sym-pipeline-dot">✓</span>
            <span className="ayur-sym-pipeline-text">Personal Information</span>
          </div>
          <div className="ayur-sym-pipeline-line ayur-sym-pipeline-line--done" />
          <div className="ayur-sym-pipeline-step ayur-sym-pipeline-step--done">
            <span className="ayur-sym-pipeline-dot">✓</span>
            <span className="ayur-sym-pipeline-text">Prakriti</span>
          </div>
          <div className="ayur-sym-pipeline-line ayur-sym-pipeline-line--done" />
          <div className="ayur-sym-pipeline-step ayur-sym-pipeline-step--done">
            <span className="ayur-sym-pipeline-dot">✓</span>
            <span className="ayur-sym-pipeline-text">Lifestyle</span>
          </div>
          <div className="ayur-sym-pipeline-line ayur-sym-pipeline-line--done" />
          <div className="ayur-sym-pipeline-step ayur-sym-pipeline-step--done">
            <span className="ayur-sym-pipeline-dot">✓</span>
            <span className="ayur-sym-pipeline-text">Diet</span>
          </div>
          <div className="ayur-sym-pipeline-line ayur-sym-pipeline-line--active" />
          <div className="ayur-sym-pipeline-step ayur-sym-pipeline-step--current">
            <span className="ayur-sym-pipeline-dot">●</span>
            <span className="ayur-sym-pipeline-text">Symptoms</span>
          </div>
          <div className="ayur-sym-pipeline-line" />
          <div className="ayur-sym-pipeline-step">
            <span className="ayur-sym-pipeline-dot">○</span>
            <span className="ayur-sym-pipeline-text">Review</span>
          </div>
        </div>
      </div>

      {/* 2. Page Editorial Header */}
      <div className="ayur-symptoms-header">
        <div className="ayur-symptoms-header__meta">
          <div className="flex items-center gap-xs flex-wrap">
            <Badge color="accent" variant="subtle" size="md" icon={<Sparkles size={13} />}>
              STEP 5 OF 6
            </Badge>
            <Badge color="primary" variant="subtle" size="md">
              Symptoms & Health Context
            </Badge>
          </div>

          <div className="ayur-symptoms-header__progress">
            <span className="text-caption text-muted font-medium">Pipeline Progress (Step 5/6)</span>
            <ProgressBar value={83} color="accent" size="sm" showValue />
          </div>
        </div>

        <h1 className="ayur-symptoms-header__title">
          Tell us what you're <span className="ayur-sym-title-accent">experiencing</span>
        </h1>

        <p className="ayur-symptoms-header__desc">
          Share the symptoms, physical sensations, or health concerns you would like to include in your personalized assessment.
        </p>
      </div>

      {/* 3. Main 2-Column Layout */}
      <div className="ayur-symptoms-layout">
        {/* Main Content Column */}
        <div className="ayur-symptoms-main-col">
          {/* Chief Concern Selector */}
          <ChiefConcernSelector
            primaryConcern={symptomAnswers.primaryConcern}
            onSelectConcern={setPrimaryConcern}
            additionalNotes={symptomAnswers.additionalNotes}
            onNotesChange={setAdditionalNotes}
          />

          {/* Selected Symptoms Refinement Section */}
          {selectedSymptoms.length > 0 && (
            <div className="ayur-selected-symptoms-section">
              <div className="ayur-selected-sym-sec-header">
                <h3 className="ayur-selected-sym-sec-title">
                  Selected Symptoms ({selectedSymptoms.length})
                </h3>
                <span className="text-micro text-muted">Adjust severity and chronicity for each symptom</span>
              </div>

              <div className="ayur-selected-symptoms-list">
                {selectedSymptoms.map((sym) => (
                  <SelectedSymptomCard
                    key={sym.id}
                    symptom={sym}
                    onUpdateDetail={updateSymptomDetail}
                    onRemove={removeSymptom}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Symptom Catalog Section */}
          <div className="ayur-symptom-catalog-section">
            <div className="ayur-catalog-sec-header">
              <h3 className="ayur-catalog-sec-title">Symptom Catalog</h3>
              <span className="text-micro text-muted">Click any symptom to add or remove it from your profile</span>
            </div>

            {/* Search Bar */}
            <SymptomSearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              matchCount={filteredSymptoms.length}
            />

            {/* Category Filter Tabs */}
            <SymptomCategoryFilter
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* Catalog Cards Grid */}
            <SymptomCatalogGrid
              symptoms={filteredSymptoms}
              selectedIds={selectedIds}
              onToggleSymptom={handleToggleSymptom}
            />
          </div>

          {/* Action Bar */}
          <div className="ayur-symptoms-actions">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => onTriggerToast?.({ type: 'info', title: 'Navigation', message: 'Use sidebar or review to move back' })}
            >
              Back to Diet
            </Button>

            <div className="flex items-center gap-sm">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw size={14} />}
                onClick={handleReset}
              >
                Clear All
              </Button>

              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                onClick={handleContinue}
              >
                {selectedSymptoms.length === 0 ? 'Continue to Clinical Review (No Symptoms)' : 'Continue to Clinical Review →'}
              </Button>
            </div>
          </div>
        </div>

        {/* Side Summary Column */}
        <div className="ayur-symptoms-side-col">
          <SymptomSummary
            selectedSymptoms={selectedSymptoms}
            primaryConcern={symptomAnswers.primaryConcern}
            patientName={personalInfo.fullName}
          />
        </div>
      </div>
    </div>
  );
};
