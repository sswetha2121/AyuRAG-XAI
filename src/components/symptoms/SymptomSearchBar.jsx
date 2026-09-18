import React from 'react';
import './SymptomSearchBar.css';
import { Search, X } from 'lucide-react';

export const SymptomSearchBar = ({
  searchTerm = '',
  onSearchChange,
  matchCount = 0,
  className = ''
}) => {
  return (
    <div className={`ayur-symptom-search ${className}`.trim()}>
      <div className="ayur-symptom-search__input-wrap">
        <Search size={18} className="ayur-symptom-search__icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search symptoms by name, sensation or keyword (e.g. bloating, sleep, fatigue)..."
          className="ayur-symptom-search__input"
          aria-label="Search symptoms"
        />
        {searchTerm && (
          <button
            type="button"
            className="ayur-symptom-search__clear"
            onClick={() => onSearchChange?.('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {searchTerm && (
        <span className="ayur-symptom-search__count">
          {matchCount} {matchCount === 1 ? 'symptom' : 'symptoms'} found
        </span>
      )}
    </div>
  );
};
