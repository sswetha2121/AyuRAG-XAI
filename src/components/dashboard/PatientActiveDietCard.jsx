import React, { useState, useEffect } from 'react';
import './PatientActiveDietCard.css';
import { api } from '../../services/api';
import {
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileCheck,
  Sparkles,
  Info,
  Droplets,
  Flame,
  HeartPulse,
  BookOpen
} from 'lucide-react';

export const PatientActiveDietCard = () => {
  const [dietData, setDietData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getPatientCurrentDiet()
      .then((res) => {
        if (isMounted) {
          setDietData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err.message || 'Could not load your active diet plan.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="ayur-patient-diet-card ayur-patient-diet-loading">
        <div className="ayur-spinner-mini" />
        <span>Loading your personalized doctor-approved diet protocol...</span>
      </div>
    );
  }

  // If no approved active plan exists yet
  if (!dietData || !dietData.has_active_plan || !dietData.diet_plan) {
    return (
      <div className="ayur-patient-diet-card ayur-patient-diet-pending">
        <div className="ayur-pstatus-icon-wrap">
          <Clock size={32} className="text-secondary" />
        </div>
        <div className="ayur-pstatus-content">
          <span className="ayur-pstatus-badge">Clinical Review In Progress</span>
          <h3 className="ayur-pstatus-title">Personalized Diet Plan Under Physician Review</h3>
          <p className="ayur-pstatus-desc">
            Your constitutional assessment is currently undergoing clinical verification by our medical staff. 
            Once your attending physician reviews and approves your individualized dietary regimen, 
            it will be activated right here on your dashboard.
          </p>
          <div className="ayur-pstatus-steps">
            <span className="step-item step-done">✓ Assessment Submitted</span>
            <span className="step-item step-active">● Doctor Verification & Approval</span>
            <span className="step-item">○ Active Personalized Regimen</span>
          </div>
        </div>
      </div>
    );
  }

  const plan = dietData.diet_plan;
  const meals = [
    { key: 'breakfast', label: 'Breakfast', data: plan.breakfast, icon: Flame },
    { key: 'mid_morning', label: 'Mid-Morning Snack', data: plan.mid_morning, icon: Droplets },
    { key: 'lunch', label: 'Lunch (Main Meal)', data: plan.lunch, icon: Utensils },
    { key: 'evening', label: 'Evening Snack', data: plan.evening, icon: HeartPulse },
    { key: 'dinner', label: 'Dinner (Light Meal)', data: plan.dinner, icon: Clock },
  ];

  return (
    <div className="ayur-patient-diet-card">
      {/* 1. Header Banner */}
      <div className="ayur-pdiet-hero">
        <div className="ayur-pdiet-hero__left">
          <div className="flex items-center gap-xs mb-xs flex-wrap">
            <span className="ayur-doctor-approved-badge">
              <ShieldCheck size={16} />
              DOCTOR APPROVED
            </span>
            <span className="ayur-pversion-chip">Plan Version {plan.version}</span>
          </div>
          <h2 className="ayur-pdiet-hero__title">MY PERSONALIZED DIET PLAN</h2>
          <p className="ayur-pdiet-hero__subtitle">{plan.title}</p>
          {plan.objective && (
            <p className="ayur-pdiet-objective">
              <strong>Objective:</strong> {plan.objective}
            </p>
          )}
        </div>

        <div className="ayur-pdiet-hero__right">
          <div className="ayur-approval-stamp-card">
            <CheckCircle2 size={24} className="text-success" />
            <div>
              <span className="ayur-stamp-label">Approved by Attending Physician</span>
              <strong className="ayur-stamp-doctor">{plan.approved_by_name || 'Dr. Clinical Physician'}</strong>
              <span className="ayur-stamp-date">
                {plan.approved_at ? new Date(plan.approved_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Attending Physician Notes (if any) */}
      {plan.doctor_notes && (
        <div className="ayur-pdiet-doctor-notes">
          <div className="flex items-center gap-xs mb-xs">
            <Info size={16} className="text-primary" />
            <h4 className="font-serif font-bold text-primary">Physician's Direct Clinical Advice</h4>
          </div>
          <p className="ayur-pdoctor-notes-text">{plan.doctor_notes}</p>
        </div>
      )}

      {/* 3. Today's Meals Timeline */}
      <div className="ayur-pdiet-section">
        <h3 className="ayur-pdiet-section__title">
          <Utensils size={18} className="text-secondary" />
          <span>Daily Meal Schedule (Meals & Timings)</span>
        </h3>

        <div className="ayur-pmeals-grid">
          {meals.map((m) => {
            const Icon = m.icon;
            const items = m.data?.items || [];
            return (
              <div key={m.key} className="ayur-pmeal-box">
                <div className="ayur-pmeal-box__header">
                  <div className="flex items-center gap-xs">
                    <Icon size={16} className="text-secondary" />
                    <span className="ayur-pmeal-label">{m.label}</span>
                  </div>
                  {m.data?.time && (
                    <span className="ayur-pmeal-time">{m.data.time}</span>
                  )}
                </div>

                {m.data?.title && (
                  <h4 className="ayur-pmeal-title">{m.data.title}</h4>
                )}

                <ul className="ayur-pmeal-items-list">
                  {items.map((it, idx) => (
                    <li key={idx}>
                      <span className="ayur-pbullet">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                {(m.data?.calories_approx || m.data?.digestive_properties || m.data?.ayurvedic_properties) && (
                  <div className="ayur-pmeal-footer">
                    {m.data.calories_approx && (
                      <span className="ayur-pcalorie-tag">{m.data.calories_approx}</span>
                    )}
                    {(m.data.digestive_properties || m.data.ayurvedic_properties) && (
                      <span className="ayur-pproperties-tag">{m.data.digestive_properties || m.data.ayurvedic_properties}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Foods to Include vs Avoid */}
      <div className="ayur-pdiet-section">
        <div className="ayur-pguidelines-split">
          {/* Foods to Include */}
          <div className="ayur-pguide-card ayur-pguide-card--include">
            <h4 className="ayur-pguide-title text-success font-serif font-bold">
              ✓ Foods to Favor (Wholesome Options)
            </h4>
            <ul className="ayur-pguide-list">
              {(plan.foods_to_include || []).map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
          </div>

          {/* Foods to Avoid */}
          <div className="ayur-pguide-card ayur-pguide-card--avoid">
            <h4 className="ayur-pguide-title text-danger font-serif font-bold">
              ✕ Foods to Avoid (Contraindications)
            </h4>
            <ul className="ayur-pguide-list">
              {(plan.foods_to_avoid || []).map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Lifestyle & Precautions */}
      <div className="ayur-pdiet-section">
        <div className="ayur-pguidelines-split">
          {/* Lifestyle */}
          <div className="ayur-pguide-card">
            <h4 className="ayur-pguide-title text-primary font-serif font-bold">
              Lifestyle & Daily Routine Guidance
            </h4>
            <ul className="ayur-pguide-list">
              {(plan.lifestyle_notes || []).map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>

          {/* Precautions */}
          <div className="ayur-pguide-card">
            <h4 className="ayur-pguide-title text-warning font-serif font-bold">
              Clinical Precautions & Timing
            </h4>
            <ul className="ayur-pguide-list">
              {(plan.precautions || []).map((prec, idx) => (
                <li key={idx}>{prec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Classical Knowledge References (RAG) */}
      {plan.knowledge_references && plan.knowledge_references.length > 0 && (
        <div className="ayur-pdiet-section">
          <h3 className="ayur-pdiet-section__title">
            <BookOpen size={18} className="text-secondary" />
            <span>Classical Ayurvedic Foundation</span>
          </h3>

          <div className="ayur-prag-list">
            {plan.knowledge_references.map((ref, idx) => (
              <div key={idx} className="ayur-prag-item">
                <span className="ayur-prag-source">{ref.source}</span>
                {ref.translation && <p className="ayur-prag-trans">{ref.translation}</p>}
                {ref.passage && !ref.translation && <p className="ayur-prag-trans">{ref.passage}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
