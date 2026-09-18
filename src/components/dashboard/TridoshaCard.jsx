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
                Constitutional Prakriti
              </Badge>
              <Badge color="primary" variant="subtle" size="sm">
                Tri-Dosha Assessment
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
            {/* Vata Bar */}
            <div className="ayur-dosha-bar-card ayur-dosha-bar-card--vata">
              <div className="ayur-dosha-bar-head">
                <div className="flex items-center gap-xs">
                  <div className="ayur-dosha-icon-box ayur-dosha-icon-box--vata">
                    <Wind size={16} />
                  </div>
                  <div>
                    <h4 className="ayur-dosha-name">Vāta (Movement & Space)</h4>
                    <span className="ayur-dosha-elements">Air + Ether • Light, Mobile, Cool</span>
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

            {/* Pitta Bar */}
            <div className="ayur-dosha-bar-card ayur-dosha-bar-card--pitta">
              <div className="ayur-dosha-bar-head">
                <div className="flex items-center gap-xs">
                  <div className="ayur-dosha-icon-box ayur-dosha-icon-box--pitta">
                    <Flame size={16} />
                  </div>
                  <div>
                    <h4 className="ayur-dosha-name">Pitta (Metabolism & Transformation)</h4>
                    <span className="ayur-dosha-elements">Fire + Water • Warm, Sharp, Oily</span>
                  </div>
                </div>
                <span className="ayur-dosha-pct-val font-mono">{pittaPct}%</span>
              </div>
              <ProgressBar value={pittaPct} color="accent" size="md" />
              <ul className="ayur-dosha-traits-list">
                {(qualities.pitta || ['Sharp enzymatic Agni', 'Goal-driven focus', 'Warm skin temperature']).map((trait, i) => (
                  <li key={i}>{trait}</li>
                ))}
              </ul>
            </div>

            {/* Kapha Bar */}
            <div className="ayur-dosha-bar-card ayur-dosha-bar-card--kapha">
              <div className="ayur-dosha-bar-head">
                <div className="flex items-center gap-xs">
                  <div className="ayur-dosha-icon-box ayur-dosha-icon-box--kapha">
                    <Mountain size={16} />
                  </div>
                  <div>
                    <h4 className="ayur-dosha-name">Kapha (Structure & Lubrication)</h4>
                    <span className="ayur-dosha-elements">Earth + Water • Dense, Stable, Cool</span>
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
              <span>Classical Ayurvedic Grounding (Ashtanga Hridaya Sutrasthana 1.7)</span>
            </div>
            <p className="text-small text-muted mb-0">
              <em>"Vāyuḥ pittaṁ kaphaśceti trayo doṣāḥ samāsataḥ..."</em> — Vāta, Pitta, and Kapha maintain somatic equilibrium when balanced. Your predominant baseline guides nutritional choices (Ahara) and daily lifestyle pacing (Dinacharya).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
