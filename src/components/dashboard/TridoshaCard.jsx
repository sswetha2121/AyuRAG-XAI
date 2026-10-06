import React from 'react';
import './TridoshaCard.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, ProgressBar } from '../ui';
import { Wind, Flame, Mountain, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TridoshaCard = ({
  tridoshaProfile = {},
  className = ''
}) => {
  const {
    constitutionType = 'Vāta-Pitta (Dvidoṣaja)',
    primaryDosha = 'Vāta',
    secondaryDosha = 'Pitta',
    vataPct = 45,
    pittaPct = 35,
    kaphaPct = 20,
    summaryText = '',
    qualities = {}
  } = tridoshaProfile;

  return (
    <div className={`ayur-tridosha-card-wrap ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-tridosha-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" size="sm" icon={<Sparkles size={11} />}>
                Constitutional Profile
              </Badge>
              <Badge color="primary" variant="subtle" size="sm">
                Bio-Energy Distribution
              </Badge>
            </div>
            <span className="ayur-demo-badge">Illustrative assessment visualization</span>
          </div>

          <CardTitle as="h2" className="ayur-tridosha-title">
            Constitutional Typology: <span className="ayur-tridosha-highlight">{constitutionType}</span>
          </CardTitle>

          <CardDescription className="ayur-tridosha-desc">
            {summaryText}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 3 Horizontal Distribution Bars */}
          <div className="ayur-dosha-visualizer-grid">
            {/* Movement Bar */}
            <div className="ayur-dosha-bar-card ayur-dosha-bar-card--vata">
              <div className="ayur-dosha-bar-head">
                <div className="flex items-center gap-xs">
                  <div className="ayur-dosha-icon-box ayur-dosha-icon-box--vata">
                    <Wind size={16} />
                  </div>
                  <div>
                    <h4 className="ayur-dosha-name">Movement & Circulation (Air & Space)</h4>
                    <span className="ayur-dosha-elements">Air + Space • Light, Mobile, Cool</span>
                  </div>
                </div>
                <span className="ayur-dosha-pct-val font-mono">{vataPct}%</span>
              </div>
              <ProgressBar value={vataPct} color="primary" size="md" />
              <ul className="ayur-dosha-traits-list">
                {(qualities.vata || ['Quick pacing', 'Light bone frame', 'Sensitive to cold & variable timings']).map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>

            {/* Metabolism Bar */}
            <div className="ayur-dosha-bar-card ayur-dosha-bar-card--pitta">
              <div className="ayur-dosha-bar-head">
                <div className="flex items-center gap-xs">
                  <div className="ayur-dosha-icon-box ayur-dosha-icon-box--pitta">
                    <Flame size={16} />
                  </div>
                  <div>
                    <h4 className="ayur-dosha-name">Metabolism & Digestion (Fire & Water)</h4>
                    <span className="ayur-dosha-elements">Fire + Water • Warm, Sharp, Transformative</span>
                  </div>
                </div>
                <span className="ayur-dosha-pct-val font-mono">{pittaPct}%</span>
              </div>
              <ProgressBar value={pittaPct} color="accent" size="md" />
              <ul className="ayur-dosha-traits-list">
                {(qualities.pitta || ['Strong digestive capacity', 'Goal-driven focus', 'Warm skin temperature']).map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>

            {/* Structure Bar */}
            <div className="ayur-dosha-bar-card ayur-dosha-bar-card--kapha">
              <div className="ayur-dosha-bar-head">
                <div className="flex items-center gap-xs">
                  <div className="ayur-dosha-icon-box ayur-dosha-icon-box--kapha">
                    <Mountain size={16} />
                  </div>
                  <div>
                    <h4 className="ayur-dosha-name">Structure & Nourishment (Earth & Water)</h4>
                    <span className="ayur-dosha-elements">Earth + Water • Dense, Stable, Grounding</span>
                  </div>
                </div>
                <span className="ayur-dosha-pct-val font-mono">{kaphaPct}%</span>
              </div>
              <ProgressBar value={kaphaPct} color="gradient" size="md" />
              <ul className="ayur-dosha-traits-list">
                {(qualities.kapha || ['Solid physical endurance', 'Emotional steadiness', 'Deep sound sleep']).map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clinical Balance Insight */}
          <div className="ayur-tridosha-footer-note">
            <div className="flex items-center gap-xs text-secondary font-semibold text-small mb-2xs">
              <ShieldCheck size={16} />
              <span>Evidence-Based Constitutional Principles</span>
            </div>
            <p className="text-small text-muted mb-0">
              Movement, metabolic fire, and physical stability maintain holistic equilibrium when harmonized. Your predominant baseline guides nutritional choices and personalized daily pacing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
