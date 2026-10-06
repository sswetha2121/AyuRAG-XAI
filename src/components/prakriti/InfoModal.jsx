import React, { useEffect } from 'react';
import './InfoModal.css';
import { Button } from '../ui';
import { X, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ayur-modal-backdrop" onClick={onClose} aria-hidden="true">
      <div
        className="ayur-info-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prakriti-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ayur-modal-header">
          <div className="flex items-center gap-xs">
            <div className="ayur-modal-icon">
              <BookOpen size={18} />
            </div>
            <h3 id="prakriti-modal-title" className="ayur-modal-title">
              What is Body Constitution in Healthcare?
            </h3>
          </div>
          <button
            type="button"
            className="ayur-modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ayur-modal-content">
          <p className="text-body">
            <strong>Body Constitution</strong> represents your innate physical and biological profile. Every individual possesses a distinct ratio of three foundational biological energies established by genetics and physiological development:
          </p>

          <div className="ayur-modal-section">
            <h4 className="font-semibold text-primary mb-2xs">1. Movement Energy (Air & Space)</h4>
            <p className="text-small text-muted">Governs cellular motility, nerve impulses, breathing rhythm, circulation, and sensory perception.</p>
          </div>

          <div className="ayur-modal-section">
            <h4 className="font-semibold text-accent mb-2xs">2. Metabolic Energy (Fire & Water)</h4>
            <p className="text-small text-muted">Governs metabolism, enzymatic digestion, cellular transformation, body temperature, and cognitive acuity.</p>
          </div>

          <div className="ayur-modal-section">
            <h4 className="font-semibold text-primary mb-2xs">3. Structural Energy (Water & Earth)</h4>
            <p className="text-small text-muted">Governs structural integrity, lubrication of joints, cellular cohesion, fluid balance, and immunological resilience.</p>
          </div>

          <div className="ayur-modal-highlight">
            <div className="flex items-center gap-xs text-primary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Baseline Constitution vs. Current Imbalance</span>
            </div>
            <p className="text-caption text-secondary">
              While your baseline constitution represents your lifelong physiological foundation, current imbalances refer to temporary fluctuations caused by diet, stress, or lifestyle shifts. AyuRAG-XAI models both dimensions to deliver grounded, transparent recommendations.
            </p>
          </div>
        </div>

        <div className="ayur-modal-footer">
          <Button variant="primary" size="md" onClick={onClose}>
            Got it, return to assessment
          </Button>
        </div>
      </div>
    </div>
  );
};
