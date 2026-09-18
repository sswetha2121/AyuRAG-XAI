import React from 'react';
import './DoshaBadge.css';
import { Wind, Flame, Mountain } from 'lucide-react';

const DOSHA_CONFIG = {
  Vata: {
    label: 'Vāta (Air + Ether)',
    icon: Wind,
    className: 'ayur-dosha-badge--vata'
  },
  Pitta: {
    label: 'Pitta (Fire + Water)',
    icon: Flame,
    className: 'ayur-dosha-badge--pitta'
  },
  Kapha: {
    label: 'Kapha (Water + Earth)',
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
