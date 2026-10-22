import React, { useState, useEffect } from 'react';
import './DoctorFoodCatalogueModal.css';
import { api } from '../../services/api';
import {
  Search,
  Utensils,
  Plus,
  RefreshCw,
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Tag,
  Scale
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DoctorFoodCatalogueModal = ({
  isOpen,
  onClose,
  targetMeal = 'breakfast',
  targetMealLabel = 'Breakfast',
  onSelectFoodItem,
  onTriggerToast,
}) => {
  const [foods, setFoods] = useState([]);
  const [totalCatalogueCount, setTotalCatalogueCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDietaryPref, setSelectedDietaryPref] = useState('');
  const [substitutesForFood, setSubstitutesForFood] = useState(null);
  const [substitutesList, setSubstitutesList] = useState([]);
  const [isFindingSubstitutes, setIsFindingSubstitutes] = useState(false);
  const [portionMultipliers, setPortionMultipliers] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCatalogue(selectedCategory, selectedDietaryPref, searchQuery);
    }
  }, [isOpen, selectedCategory, selectedDietaryPref]);

  const loadCatalogue = async (category = selectedCategory, preference = selectedDietaryPref, query = searchQuery) => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await api.getFoodCatalogue({
        category: category || undefined,
        dietary_preference: preference || undefined,
        search: query || undefined,
      });

      const items = res.foods || res.items || [];
      setFoods(items);
      setTotalCatalogueCount(res.total || res.count || items.length);
    } catch (err) {
      const msg = err.message || 'Could not load clinical food catalogue.';
      setErrorMsg(msg);
      onTriggerToast?.({
        type: 'error',
        title: 'Food Catalogue Error',
        message: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCatalogue(selectedCategory, selectedDietaryPref, searchQuery);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedDietaryPref('');
    loadCatalogue('', '', '');
  };

  const handlePortionChange = (foodId, multiplier) => {
    setPortionMultipliers((prev) => ({
      ...prev,
      [foodId]: multiplier,
    }));
  };

  const handleAddFoodWithPortion = (food) => {
    const mult = portionMultipliers[food.food_id] || 1;
    const baseGrams = food.portion_grams || (food.standard_portion && food.standard_portion.grams) || 100;
    const finalGrams = Math.round(baseGrams * mult);

    const baseNut = food.nutrients_per_portion || {};
    const factor = mult;

    const adjustedNutrients = {
      calories_kcal: Math.round(((baseNut.calories_kcal || 0) * factor) * 10) / 10,
      protein_g: Math.round(((baseNut.protein_g || 0) * factor) * 10) / 10,
      carbohydrates_g: Math.round(((baseNut.carbohydrates_g || 0) * factor) * 10) / 10,
      fat_g: Math.round(((baseNut.fat_g || 0) * factor) * 10) / 10,
      fiber_g: baseNut.fiber_g !== undefined ? Math.round(((baseNut.fiber_g || 0) * factor) * 10) / 10 : 0,
      iron_mg: baseNut.iron_mg !== undefined ? Math.round(((baseNut.iron_mg || 0) * factor) * 10) / 10 : undefined,
      calcium_mg: baseNut.calcium_mg !== undefined ? Math.round(((baseNut.calcium_mg || 0) * factor) * 10) / 10 : undefined,
    };

    const finalFood = {
      ...food,
      portion_grams: finalGrams,
      standard_portion_desc: mult === 1 
        ? (food.standard_portion_desc || `${finalGrams}g`) 
        : `${finalGrams}g (${mult}x portion)`,
      nutrients_per_portion: adjustedNutrients,
    };

    onSelectFoodItem?.(finalFood, targetMeal);
    onClose();
  };

  const handleFindSubstitutes = async (food) => {
    try {
      setIsFindingSubstitutes(true);
      setSubstitutesForFood(food);
      const res = await api.getFoodSubstitutes(food.food_id);
      setSubstitutesList(res.substitutes || []);
    } catch (err) {
      onTriggerToast?.({
        type: 'error',
        title: 'Substitutes Lookup Failed',
        message: err.message || 'Could not retrieve verified food substitutes.',
      });
    } finally {
      setIsFindingSubstitutes(false);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { id: '', label: 'All Items' },
    { id: 'pulses_legumes', label: 'Legumes & Pulses' },
    { id: 'cereals_millets', label: 'Cereals & Millets' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'dairy_alternatives', label: 'Dairy & Milks' },
    { id: 'healthy_fats', label: 'Healthy Fats' },
    { id: 'nuts_seeds', label: 'Nuts & Seeds' },
    { id: 'beverages_digestives', label: 'Herbal Beverages' },
  ];

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedDietaryPref);

  return (
    <div className="ayur-food-modal-backdrop" onClick={onClose}>
      <div
        className="ayur-food-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fmodal-title"
      >
        {/* Header */}
        <div className="ayur-food-modal-header">
          <div className="flex items-center gap-xs">
            <div className="ayur-fmodal-icon">
              <Utensils size={18} />
            </div>
            <div>
              <h3 id="fmodal-title" className="ayur-fmodal-title">Clinical Food Catalogue</h3>
              <p className="ayur-fmodal-sub">
                Select standardized portion items for <strong>{targetMealLabel}</strong> with deterministic nutritional calculations.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ayur-fmodal-close-btn"
            onClick={onClose}
            aria-label="Close food catalogue"
          >
            <X size={18} />
          </button>
        </div>

        {/* Verification & License Provenance Notice */}
        <div className="ayur-fmodal-provenance-banner">
          <ShieldCheck size={15} className="text-primary flex-shrink-0" />
          <div className="ayur-fmodal-provenance-text">
            <span><strong>Primary Dataset:</strong> Indian Food Composition Tables (IFCT 2017, ICMR-NIN).</span>
            <span>All macronutrients are calculated via deterministic portion arithmetic. Development seed records are explicitly labeled.</span>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="ayur-fmodal-filters">
          <div className="ayur-fmodal-controls-row">
            <form className="ayur-fmodal-search-form" onSubmit={handleSearchSubmit}>
              <Search size={15} className="ayur-fmodal-search-icon" />
              <input
                type="text"
                placeholder="Search food by name, regional alias, or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ayur-fmodal-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="ayur-fmodal-clear-search"
                  onClick={() => {
                    setSearchQuery('');
                    loadCatalogue(selectedCategory, selectedDietaryPref, '');
                  }}
                  title="Clear search text"
                >
                  <X size={14} />
                </button>
              )}
              <Button variant="primary" size="sm" type="submit">
                Search
              </Button>
            </form>

            {hasActiveFilters && (
              <button
                type="button"
                className="ayur-fmodal-reset-btn"
                onClick={handleResetFilters}
                title="Reset all search filters"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Category Chips Bar */}
          <div className="ayur-fmodal-categories-bar" role="tablist" aria-label="Food Categories">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === c.id}
                className={`ayur-fcat-chip ${selectedCategory === c.id ? 'ayur-fcat-chip--active' : ''}`}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Substitutes Drawer / Overlay if active */}
        {substitutesForFood && (
          <div className="ayur-fsubstitutes-panel">
            <div className="flex items-center justify-between mb-xs">
              <div className="flex items-center gap-xs">
                <Sparkles size={15} className="text-accent" />
                <span className="font-semibold text-xs text-primary">
                  Clinical Alternatives for "{substitutesForFood.name}"
                </span>
              </div>
              <button
                type="button"
                className="text-xs text-muted hover:underline"
                onClick={() => setSubstitutesForFood(null)}
              >
                Close Alternatives
              </button>
            </div>

            {isFindingSubstitutes ? (
              <div className="p-xs text-center text-xs text-muted">
                Looking up compatible nutritional alternatives...
              </div>
            ) : substitutesList.length === 0 ? (
              <div className="p-xs text-center text-xs text-muted">
                No automatic alternatives in this exact macronutrient threshold.
              </div>
            ) : (
              <div className="ayur-fsub-grid">
                {substitutesList.map((sub) => (
                  <div key={sub.food_id} className="ayur-fsub-item">
                    <div className="ayur-fsub-info">
                      <div className="font-medium text-xs text-primary">{sub.name}</div>
                      <div className="text-micro text-muted">
                        {sub.portion_grams}g • {sub.nutrients_per_portion?.calories_kcal || 0} kcal •{' '}
                        {sub.nutrients_per_portion?.protein_g || 0}g protein
                      </div>
                      <div className="text-micro text-secondary font-medium">
                        Match: {sub.similarity_reason || 'Same category and calorie range'}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        handleAddFoodWithPortion(sub);
                        setSubstitutesForFood(null);
                      }}
                    >
                      Use
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Food List Container */}
        <div className="ayur-fmodal-body">
          {isLoading ? (
            <div className="ayur-fmodal-loading">
              <RefreshCw size={24} className="ayur-spin text-primary" />
              <span>Querying verified IFCT 2017 clinical food database...</span>
            </div>
          ) : errorMsg ? (
            <div className="ayur-fmodal-error">
              <AlertCircle size={28} className="text-error" />
              <div className="ayur-ferror-title">Failed to load food catalogue</div>
              <p className="ayur-ferror-text">{errorMsg}</p>
              <Button variant="outline" size="sm" onClick={() => loadCatalogue()} leftIcon={<RefreshCw size={13} />}>
                Retry Loading
              </Button>
            </div>
          ) : foods.length === 0 ? (
            <div className="ayur-fmodal-empty">
              <Utensils size={32} className="text-muted" />
              <div className="font-semibold text-sm">No food items found</div>
              <p className="text-xs text-muted max-w-sm text-center">
                No foods matched your current search and category filters. Try clearing the search or switching categories.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="xs" onClick={handleResetFilters} leftIcon={<RotateCcw size={12} />}>
                  Reset All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="ayur-fmodal-table-wrap">
              <table className="ayur-fmodal-table">
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Category</th>
                    <th>Standard Portion</th>
                    <th>Energy & Macros</th>
                    <th>Source & Provenance</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => {
                    const regional = Object.entries(food.regional_names || {})
                      .map(([lang, name]) => `${lang}: ${name}`)
                      .slice(0, 2)
                      .join(' • ');

                    const mult = portionMultipliers[food.food_id] || 1;
                    const baseNut = food.nutrients_per_portion || {};
                    const dispCal = Math.round(((baseNut.calories_kcal || 0) * mult) * 10) / 10;
                    const dispProt = Math.round(((baseNut.protein_g || 0) * mult) * 10) / 10;
                    const dispCarb = Math.round(((baseNut.carbohydrates_g || 0) * mult) * 10) / 10;
                    const dispFat = Math.round(((baseNut.fat_g || 0) * mult) * 10) / 10;
                    const dispFib = baseNut.fiber_g !== undefined ? Math.round(((baseNut.fiber_g || 0) * mult) * 10) / 10 : null;

                    const isDevSeed = food.is_dev_seed || food.verification_status === 'DEV_SEED';
                    const baseGrams = food.portion_grams || (food.standard_portion && food.standard_portion.grams) || 100;
                    const calcGrams = Math.round(baseGrams * mult);

                    return (
                      <tr key={food.food_id} className="ayur-ftr">
                        <td className="ayur-ftd-main">
                          <div className="ayur-fitem-name">{food.name}</div>
                          {regional && <div className="ayur-fitem-reg">{regional}</div>}
                          <div className="flex items-center gap-xs mt-2xs">
                            <span className="ayur-fitem-id">ID: {food.food_id}</span>
                            {isDevSeed ? (
                              <span className="ayur-fbadge-dev" title="Development-only seed item for testing common Indian dishes. Not official IFCT record.">
                                Dev Seed
                              </span>
                            ) : (
                              <span className="ayur-fbadge-verified" title="Verified against ICMR-NIN Indian Food Composition Tables 2017">
                                IFCT 2017
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="ayur-fitem-cat-badge">
                            {food.category ? food.category.replace(/_/g, ' ') : 'General'}
                          </span>
                        </td>
                        <td>
                          <div className="ayur-portion-selector-box">
                            <div className="font-semibold text-xs text-primary">
                              {calcGrams}g
                            </div>
                            <div className="text-micro text-muted">
                              {food.standard_portion_desc || `${baseGrams}g standard`}
                            </div>
                            <div className="ayur-portion-pills">
                              {[0.5, 1, 1.5, 2].map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  className={`ayur-portion-pill ${mult === m ? 'ayur-portion-pill--active' : ''}`}
                                  onClick={() => handlePortionChange(food.food_id, m)}
                                  title={`Set portion to ${m}x (${Math.round(baseGrams * m)}g)`}
                                >
                                  {m}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ayur-fnut-pills">
                            <span className="ayur-fnut-pill ayur-fnut-pill--cal">
                              {dispCal} kcal
                            </span>
                            <span className="ayur-fnut-pill ayur-fnut-pill--pro">
                              {dispProt}g P
                            </span>
                            <span className="ayur-fnut-pill ayur-fnut-pill--carb">
                              {dispCarb}g C
                            </span>
                            <span className="ayur-fnut-pill ayur-fnut-pill--fat">
                              {dispFat}g F
                            </span>
                            {dispFib !== null && dispFib > 0 && (
                              <span className="ayur-fnut-pill ayur-fnut-pill--fib">
                                {dispFib}g Fib
                              </span>
                            )}
                          </div>
                          {(food.dietary_tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-micro mt-2xs">
                              {food.dietary_tags.slice(0, 2).map((t, idx) => (
                                <span key={idx} className="ayur-ftag-pill">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="text-micro text-muted">
                            {food.preparation_method || 'Standard cooked preparation'}
                          </div>
                          <div className="text-micro text-primary font-medium mt-2xs">
                            {food.source_citation || (isDevSeed ? 'Common Indian Recipe (Dev Seed)' : 'ICMR-NIN IFCT 2017')}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-xs">
                            <button
                              type="button"
                              className="ayur-fsub-btn"
                              title="Find alternative verified items"
                              onClick={() => handleFindSubstitutes(food)}
                            >
                              Alt
                            </button>
                            <Button
                              variant="primary"
                              size="xs"
                              onClick={() => handleAddFoodWithPortion(food)}
                              leftIcon={<Plus size={13} />}
                            >
                              Add
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="ayur-fmodal-footer">
          <div className="ayur-fmodal-count-info">
            <span className="font-semibold text-primary">
              Showing {foods.length} of {totalCatalogueCount} catalogue records
            </span>
            <span className="ayur-fmodal-sep">•</span>
            <span className="text-muted text-xs">Deterministic arithmetic on portion selection</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
