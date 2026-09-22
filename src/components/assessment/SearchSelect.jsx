import React, { useState, useRef, useEffect } from 'react';
import './Assessment.css';
import { Search, X, ChevronDown, Check } from 'lucide-react';

/**
 * AyuRAG-XAI SearchSelect Component
 * Searchable autocomplete selector with keyboard navigation.
 */
export const SearchSelect = ({
  id,
  options = [],
  value,
  onChange,
  placeholder = 'Search options...',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.description && opt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="ayur-search-select" ref={wrapperRef} id={`searchselect-${id}`}>
      <div
        className={`ayur-search-select__trigger ${isOpen ? 'ayur-search-select__trigger--open' : ''} ${disabled ? 'ayur-search-select__trigger--disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-xs flex-1 truncate">
          <Search size={15} className="text-muted shrink-0" />
          {selectedOption ? (
            <span className="font-medium text-primary truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-muted">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-xs shrink-0">
          {selectedOption && !disabled && (
            <button
              type="button"
              className="ayur-search-select__clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                setSearchTerm('');
              }}
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="ayur-search-select__dropdown">
          <div className="ayur-search-select__search-box">
            <Search size={14} className="text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter..."
              className="ayur-search-select__input"
              autoFocus
            />
          </div>

          <div className="ayur-search-select__list" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="ayur-search-select__empty">No matching options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.id;
                return (
                  <div
                    key={opt.id}
                    role="option"
                    aria-selected={isSelected}
                    className={`ayur-search-select__item ${isSelected ? 'ayur-search-select__item--selected' : ''}`}
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{opt.label}</span>
                      {opt.description && (
                        <span className="text-xs text-muted">{opt.description}</span>
                      )}
                    </div>
                    {isSelected && <Check size={14} className="text-accent shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
