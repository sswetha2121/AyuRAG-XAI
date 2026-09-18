import React from 'react';
import './PersonalInfoForm.css';
import { Input, Select, Badge } from '../ui';
import { GenderSelector } from './GenderSelector';
import { UnitToggle } from './UnitToggle';
import { User, MapPin, Compass, Sparkles, Scale, Ruler, HeartPulse } from 'lucide-react';

const CLIMATE_ZONES = [
  { value: 'tropical-coastal', label: 'Tropical & Coastal (Ānūpa Desha — Humid, Kapha/Pitta)' },
  { value: 'arid-dry', label: 'Arid & Semi-Dry (Jāṅgala Desha — Dry, Vata dominant)' },
  { value: 'temperate', label: 'Temperate & Plains (Sādhāraṇa Desha — Balanced elements)' },
  { value: 'cold-mountainous', label: 'Cold & Mountainous (Hima Desha — Cold, Vata/Kapha)' }
];

const HEALTH_GOALS = [
  { id: 'digestion-agni', label: 'Digestive Health & Agni', icon: '🔥' },
  { id: 'stress-sleep', label: 'Stress Relief & Sleep (Nidrā)', icon: '🌙' },
  { id: 'energy-vitality', label: 'Vital Energy (Prāṇa)', icon: '⚡' },
  { id: 'immunity-ojas', label: 'Immunity & Resilience (Ojas)', icon: '🛡️' },
  { id: 'general', label: 'General Prakriti Discovery', icon: '🌿' }
];

export const PersonalInfoForm = ({
  formData,
  onChange,
  errors = {},
  disabled = false,
  className = ''
}) => {
  return (
    <form className={`ayur-pi-form ${className}`.trim()} noValidate onSubmit={(e) => e.preventDefault()}>
      {/* Section 1: Personal Identity */}
      <div className="ayur-form-section">
        <div className="ayur-form-section__header">
          <div className="flex items-center gap-xs">
            <span className="ayur-section-icon">
              <User size={16} />
            </span>
            <h3 className="ayur-form-section__title">Personal Identity</h3>
          </div>
          <span className="ayur-form-section__desc">Basic demographic parameters for Ayurvedic baseline scoring</span>
        </div>

        <div className="ayur-form-grid ayur-form-grid--2">
          <Input
            label="Full Name"
            placeholder="e.g. Swetha Sundar"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            errorMessage={errors.fullName}
            error={Boolean(errors.fullName)}
            helperText="Used to address you throughout the assessment"
            required
            disabled={disabled}
          />

          <Input
            label="Age (Years)"
            type="number"
            min="1"
            max="120"
            placeholder="e.g. 24"
            value={formData.age}
            onChange={(e) => onChange('age', e.target.value)}
            errorMessage={errors.age}
            error={Boolean(errors.age)}
            helperText="Age stage (Vaya) informs metabolic Kapha/Pitta/Vata transitions"
            required
            disabled={disabled}
          />
        </div>

        {/* Gender Selection */}
        <div className="mt-sm">
          <GenderSelector
            value={formData.gender}
            onChange={(val) => onChange('gender', val)}
            errorMessage={errors.gender}
            error={Boolean(errors.gender)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Section 2: Physical Vitals & Dimensions */}
      <div className="ayur-form-section">
        <div className="ayur-form-section__header">
          <div className="flex items-center gap-xs">
            <span className="ayur-section-icon">
              <Scale size={16} />
            </span>
            <h3 className="ayur-form-section__title">Physical Measurements</h3>
          </div>
          <span className="ayur-form-section__desc">Dimensions to assess physical build and metabolic tissue density</span>
        </div>

        <div className="ayur-form-grid ayur-form-grid--2">
          {/* Height with Unit Toggle */}
          <div className="ayur-field-with-unit">
            <div className="flex items-center justify-between mb-xs">
              <label className="ayur-form-label">
                <span>Height</span>
                <span className="ayur-form-label__required">*</span>
              </label>
              <UnitToggle
                options={[
                  { value: 'cm', label: 'cm' },
                  { value: 'ft-in', label: 'ft / in' }
                ]}
                value={formData.heightUnit}
                onChange={(unit) => onChange('heightUnit', unit)}
                disabled={disabled}
              />
            </div>
            <Input
              type="number"
              placeholder={formData.heightUnit === 'cm' ? 'e.g. 168' : 'e.g. 5.6'}
              value={formData.height}
              onChange={(e) => onChange('height', e.target.value)}
              errorMessage={errors.height}
              error={Boolean(errors.height)}
              helperText={formData.heightUnit === 'cm' ? 'Centimeters' : 'Feet.Inches (e.g. 5.6)'}
              disabled={disabled}
            />
          </div>

          {/* Weight with Unit Toggle */}
          <div className="ayur-field-with-unit">
            <div className="flex items-center justify-between mb-xs">
              <label className="ayur-form-label">
                <span>Weight</span>
                <span className="ayur-form-label__required">*</span>
              </label>
              <UnitToggle
                options={[
                  { value: 'kg', label: 'kg' },
                  { value: 'lb', label: 'lb' }
                ]}
                value={formData.weightUnit}
                onChange={(unit) => onChange('weightUnit', unit)}
                disabled={disabled}
              />
            </div>
            <Input
              type="number"
              placeholder={formData.weightUnit === 'kg' ? 'e.g. 58' : 'e.g. 128'}
              value={formData.weight}
              onChange={(e) => onChange('weight', e.target.value)}
              errorMessage={errors.weight}
              error={Boolean(errors.weight)}
              helperText={formData.weightUnit === 'kg' ? 'Kilograms' : 'Pounds'}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Environmental & Habitat Context (Desha) */}
      <div className="ayur-form-section">
        <div className="ayur-form-section__header">
          <div className="flex items-center gap-xs">
            <span className="ayur-section-icon">
              <Compass size={16} />
            </span>
            <h3 className="ayur-form-section__title">Environmental Context (Desha)</h3>
          </div>
          <span className="ayur-form-section__desc">Ayurveda considers geographic ecology and climate as direct influences on Dosha balance</span>
        </div>

        <div className="ayur-form-grid ayur-form-grid--2">
          <Input
            label="Location / City"
            placeholder="e.g. Bengaluru, Karnataka"
            value={formData.location}
            onChange={(e) => onChange('location', e.target.value)}
            helperText="City or region for environmental contextualization"
            disabled={disabled}
            leftIcon={<MapPin size={16} />}
          />

          <Select
            label="Ecosystem & Climate Type"
            value={formData.climateZone}
            onChange={(e) => onChange('climateZone', e.target.value)}
            options={CLIMATE_ZONES}
            helperText="Matches classical Desha (Ānūpa, Jāṅgala, Sādhāraṇa)"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Section 4: Primary Wellness Focus */}
      <div className="ayur-form-section">
        <div className="ayur-form-section__header">
          <div className="flex items-center gap-xs">
            <span className="ayur-section-icon">
              <HeartPulse size={16} />
            </span>
            <h3 className="ayur-form-section__title">Primary Health Focus</h3>
          </div>
          <span className="ayur-form-section__desc">Select your primary wellness intention for tailored XAI recommendations</span>
        </div>

        <div className="ayur-goals-grid">
          {HEALTH_GOALS.map((goal) => {
            const isSelected = formData.primaryGoal === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                className={`ayur-goal-chip ${isSelected ? 'ayur-goal-chip--selected' : ''}`}
                onClick={() => !disabled && onChange('primaryGoal', goal.id)}
                disabled={disabled}
              >
                <span className="ayur-goal-chip__icon">{goal.icon}</span>
                <span className="ayur-goal-chip__label">{goal.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
};
