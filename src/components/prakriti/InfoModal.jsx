import React, { useEffect, useState } from 'react';
import './InfoModal.css';
import { Button } from '../ui';
import { X, BookOpen, ShieldCheck, Sparkles, Wind, Flame, Mountain, CheckCircle2, AlertCircle } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('vata');

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
        style={{ maxWidth: '640px' }}
      >
        <div className="ayur-modal-header">
          <div className="flex items-center gap-xs">
            <div className="ayur-modal-icon">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 id="prakriti-modal-title" className="ayur-modal-title">
                The 3 Doshas (Principles) Explained
              </h3>
              <span className="text-caption text-muted">A Beginner's Quick Reference</span>
            </div>
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
          <p className="text-body mb-sm">
            In Ayurvedic medicine, a <strong>"Dosha"</strong> is a fundamental bio-energetic principle that governs your body and mind. Just like nature is made of elements (Air, Space, Fire, Water, Earth), your body operates through three dynamic forces:
          </p>

          {/* Quick Dosha Selection Bar in Modal */}
          <div className="flex items-center gap-xs mb-md" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <button
              type="button"
              className={`px-sm py-xs rounded-md text-xs font-semibold flex items-center gap-xs ${
                activeTab === 'vata'
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-muted text-secondary hover:text-primary'
              }`}
              onClick={() => setActiveTab('vata')}
            >
              <Wind size={14} />
              <span>Vāta (Movement)</span>
            </button>
            <button
              type="button"
              className={`px-sm py-xs rounded-md text-xs font-semibold flex items-center gap-xs ${
                activeTab === 'pitta'
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-muted text-secondary hover:text-primary'
              }`}
              onClick={() => setActiveTab('pitta')}
            >
              <Flame size={14} />
              <span>Pitta (Metabolism)</span>
            </button>
            <button
              type="button"
              className={`px-sm py-xs rounded-md text-xs font-semibold flex items-center gap-xs ${
                activeTab === 'kapha'
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-muted text-secondary hover:text-primary'
              }`}
              onClick={() => setActiveTab('kapha')}
            >
              <Mountain size={14} />
              <span>Kapha (Structure)</span>
            </button>
          </div>

          {activeTab === 'vata' && (
            <div className="ayur-modal-section">
              <div className="flex items-center justify-between mb-xs">
                <h4 className="font-semibold text-primary">1. Vāta Dosha • Kinetic Principle</h4>
                <span className="text-caption text-muted font-medium">Air + Space Elements</span>
              </div>
              <p className="text-small text-muted mb-xs">
                <strong>Plain English:</strong> Like the wind — quick, light, cool, dry, and mobile. Controls breathing, heartbeats, nervous signals, and all bodily motion.
              </p>
              <div className="p-xs bg-bg-alt rounded-md text-xs mb-xs">
                <strong className="text-success flex items-center gap-2xs mb-2xs">
                  <CheckCircle2 size={12} /> When Balanced:
                </strong>
                <span>Creative, agile, flexible, lively, cheerful, quick to learn.</span>
              </div>
              <div className="p-xs bg-bg-alt rounded-md text-xs">
                <strong className="text-warning flex items-center gap-2xs mb-2xs">
                  <AlertCircle size={12} /> When Imbalanced:
                </strong>
                <span>Dry skin, gas/bloating, constipation, anxiety, restless sleep, feeling cold.</span>
              </div>
            </div>
          )}

          {activeTab === 'pitta' && (
            <div className="ayur-modal-section">
              <div className="flex items-center justify-between mb-xs">
                <h4 className="font-semibold text-accent">2. Pitta Dosha • Transformation Principle</h4>
                <span className="text-caption text-muted font-medium">Fire + Water Elements</span>
              </div>
              <p className="text-small text-muted mb-xs">
                <strong>Plain English:</strong> Like the sun — warm, sharp, bright, and transforming. Controls digestion, enzymes, body heat, metabolism, and intellect.
              </p>
              <div className="p-xs bg-bg-alt rounded-md text-xs mb-xs">
                <strong className="text-success flex items-center gap-2xs mb-2xs">
                  <CheckCircle2 size={12} /> When Balanced:
                </strong>
                <span>Sharp intellect, hearty digestion, warm glowing complexion, focused leader.</span>
              </div>
              <div className="p-xs bg-bg-alt rounded-md text-xs">
                <strong className="text-warning flex items-center gap-2xs mb-2xs">
                  <AlertCircle size={12} /> When Imbalanced:
                </strong>
                <span>Acidity, heartburn, skin rashes/acne, irritability, impatience, overheating.</span>
              </div>
            </div>
          )}

          {activeTab === 'kapha' && (
            <div className="ayur-modal-section">
              <div className="flex items-center justify-between mb-xs">
                <h4 className="font-semibold text-secondary">3. Kapha Dosha • Structural Principle</h4>
                <span className="text-caption text-muted font-medium">Water + Earth Elements</span>
              </div>
              <p className="text-small text-muted mb-xs">
                <strong>Plain English:</strong> Like the solid earth and water — calm, stable, lubricating, and strong. Controls body frame, joints, fluid balance, and immunity.
              </p>
              <div className="p-xs bg-bg-alt rounded-md text-xs mb-xs">
                <strong className="text-success flex items-center gap-2xs mb-2xs">
                  <CheckCircle2 size={12} /> When Balanced:
                </strong>
                <span>Great endurance, deep peaceful sleep, calm demeanor, compassion, strong immunity.</span>
              </div>
              <div className="p-xs bg-bg-alt rounded-md text-xs">
                <strong className="text-warning flex items-center gap-2xs mb-2xs">
                  <AlertCircle size={12} /> When Imbalanced:
                </strong>
                <span>Sluggish digestion, heaviness, oversleeping, weight gain, lethargy, congestion.</span>
              </div>
            </div>
          )}

          <div className="ayur-modal-highlight mt-md">
            <div className="flex items-center gap-xs text-primary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Everyone Has All Three Doshas</span>
            </div>
            <p className="text-caption text-secondary">
              You are never just 100% one dosha. Most individuals have a dominant dosha and a secondary dosha (e.g., Vāta-Pitta). AyuRAG-XAI analyzes your answers across all 10 questions to determine your specific biological ratio with explainable AI proof.
            </p>
          </div>
        </div>

        <div className="ayur-modal-footer">
          <Button variant="primary" size="md" onClick={onClose}>
            Understood, Continue Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};
