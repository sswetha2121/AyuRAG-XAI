import React from 'react';
import './DoshaBadge.css';
import { Wind, Flame, Mountain } from 'lucide-react';

const DOSHA_CONFIG = {
  Vata: {
    label: 'Movement Energy (Air & Space)',
    icon: Wind,
    className: 'ayur-dosha-badge--vata'
  },
  Pitta: {
    label: 'Metabolic Energy (Fire & Water)',
    icon: Flame,
    className: 'ayur-dosha-badge--pitta'
  },
  Kapha: {
    label: 'Structural Energy (Earth & Water)',
    icon: Mountain,
    className: 'ayur-dosha-badge--kapha'
  }
};

export const DoshaBadge = ({ dosha = 'Vata', size = 'md', className = '' }) => {
  const config = DOSHA_CONFIG[dosha] || DOSHA_CONFIG.Vata;
  const Icon = config.icon;

  return (
    <span className={`ayur-dosha-badge ${config.className} ayur-dosha-badge--${size} ${className}`.trim()}>
      <Icon size={size === 'sm' ? 12 : 14} className="ayur-dosha-badge__icon" />
      <span className="ayur-dosha-badge__label">{config.label}</span>
    </span>
  );
};
