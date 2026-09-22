import React, { useState } from 'react';
import './Symptoms.css';
import { SYMPTOM_TAXONOMY, SYMPTOM_CATEGORIES } from '../../data/symptomQuestions';
import { Search, Plus, Check, X } from 'lucide-react';

/**
 * AyuRAG-XAI SymptomSearch Component
 * Live searchable symptom explorer with multi-category filtering.
 */
export const SymptomSearch = ({
  selectedSymptomIds = [],
  onToggleSymptom,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSymptoms = SYMPTOM_TAXONOMY.filter((symptom) => {
    // Category match
    const categoryMatches = activeCategory === 'all' || symptom.category === activeCategory;
    if (!categoryMatches) return false;

    // Search query match
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      symptom.name.toLowerCase().includes(term) ||
      (symptom.sanskritName && symptom.sanskritName.toLowerCase().includes(term)) ||
      (symptom.description && symptom.description.toLowerCase().includes(term)) ||
      (symptom.tags && symptom.tags.some((t) => t.toLowerCase().includes(term)))
    );
  });

  return (
    <div className={`ayur-symptom-search-container ${className}`.trim()}>
      {/* Search Input Bar */}
      <div className="ayur-symptom-search-bar">
        <Search size={18} className="text-muted shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search symptoms by name, sensation, or dosha tag (e.g. bloating, sleep, fatigue, skin)..."
          className="ayur-symptom-search-input"
          aria-label="Search symptoms"
        />
        {searchTerm && (
          <button
            type="button"
            className="ayur-search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="ayur-symptom-cat-pills" role="tablist">
        {SYMPTOM_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`ayur-cat-pill ${isActive ? 'ayur-cat-pill--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Symptoms Grid */}
      <div className="ayur-symptoms-results-grid">
        {filteredSymptoms.length === 0 ? (
          <div className="ayur-symptoms-empty">
            <p className="text-muted text-sm">No symptoms found matching "{searchTerm}".</p>
            <button
              type="button"
              className="text-accent text-xs underline mt-xs"
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredSymptoms.map((symptom) => {
            const isSelected = selectedSymptomIds.includes(symptom.id);

            return (
              <div
                key={symptom.id}
                className={`ayur-symptom-card ${isSelected ? 'ayur-symptom-card--selected' : ''}`}
                onClick={() => onToggleSymptom(symptom)}
              >
                <div className="ayur-symptom-card__top">
                  <span className="ayur-symptom-category-label">
                    {symptom.category}
                  </span>
                  {symptom.sanskritName && (
                    <span className="font-serif text-accent italic text-xs">
                      {symptom.sanskritName}
                    </span>
                  )}
                </div>

                <h4 className="ayur-symptom-card__title">{symptom.name}</h4>

                {symptom.description && (
                  <p className="ayur-symptom-card__desc">{symptom.description}</p>
                )}

                <div className="ayur-symptom-card__action">
                  {isSelected ? (
                    <span className="ayur-symptom-status-badge ayur-symptom-status-badge--added">
                      <Check size={13} strokeWidth={3} /> Added to Intake
                    </span>
                  ) : (
                    <span className="ayur-symptom-status-badge ayur-symptom-status-badge--add">
                      <Plus size={13} /> Add Symptom
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
