import React from 'react';
import './SymptomCatalogGrid.css';
import { Check, Plus, AlertCircle } from 'lucide-react';
import { Badge } from '../ui';

export const SymptomCatalogGrid = ({
  symptoms = [],
  selectedIds = [],
  onToggleSymptom,
  className = ''
}) => {
  if (symptoms.length === 0) {
    return (
      <div className="ayur-symptom-catalog-empty">
        <AlertCircle size={28} className="text-muted" />
        <p className="text-body text-muted">No symptoms found matching your search.</p>
      </div>
    );
  }

  return (
    <div className={`ayur-symptom-catalog-grid ${className}`.trim()}>
      {symptoms.map((sym) => {
        const isSelected = selectedIds.includes(sym.id);

        return (
          <div
            key={sym.id}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            className={`ayur-symptom-catalog-card ${isSelected ? 'ayur-symptom-catalog-card--selected' : ''}`}
            onClick={() => onToggleSymptom?.(sym)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggleSymptom?.(sym);
              }
            }}
          >
            <div className="ayur-symptom-catalog-card__top">
              <span className="ayur-sym-cat-tag">{sym.category}</span>
              <div className="ayur-sym-toggle-btn">
                {isSelected ? (
                  <Check size={14} strokeWidth={3} className="text-inverse" />
                ) : (
                  <Plus size={14} strokeWidth={2.5} />
                )}
              </div>
            </div>

            <h4 className="ayur-symptom-catalog-card__name">{sym.name}</h4>
            {sym.sanskritName && (
              <span className="ayur-symptom-catalog-card__sanskrit">{sym.sanskritName}</span>
            )}
            <p className="ayur-symptom-catalog-card__desc">{sym.description}</p>
          </div>
        );
      })}
    </div>
  );
};
