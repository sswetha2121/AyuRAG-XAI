import React from 'react';
import './DigestiveAgniCard.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../ui';
import { Flame, Sparkles, ShieldCheck, HeartPulse, GlassWater } from 'lucide-react';

export const DigestiveAgniCard = ({
  agniPattern = 'Viṣamāgni (Variable Digestive Fire)',
  className = ''
}) => {
  return (
    <div className={`ayur-agni-card-wrap ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-agni-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" size="sm" icon={<Flame size={12} />}>
                Metabolic Intelligence
              </Badge>
              <Badge color="primary" variant="subtle" size="sm">
                Agni Evaluation
              </Badge>
            </div>
            <span className="ayur-demo-badge">Demonstration Agni Signal</span>
          </div>

          <CardTitle as="h2" className="ayur-agni-title">
            Digestive Capacity & <span className="ayur-agni-highlight">Agni Equilibrium</span>
          </CardTitle>

          <CardDescription className="ayur-agni-desc">
            Evaluating the metabolic fire responsible for nutrient assimilation, bio-transformation, and toxic accumulation (Ama) prevention.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-agni-content-grid">
            <div className="ayur-agni-status-box">
              <div className="flex items-center gap-xs mb-xs">
                <Flame size={18} className="text-accent" />
                <span className="font-semibold text-body text-primary">Assessed Agni State:</span>
              </div>
              <h3 className="ayur-agni-status-val">{agniPattern}</h3>
              <p className="text-small text-muted mt-2xs mb-0">
                Characterized by fluctuating hunger, prone to abdominal distension when meals are delayed or cold.
              </p>
            </div>

            <div className="ayur-agni-protocols-box">
              <h4 className="ayur-agni-protocol-title">Core Agni Optimization Rules:</h4>
              <ul className="ayur-agni-rules-list">
                <li>Eat in a calm, seated environment without emotional distress or digital distractions</li>
                <li>Leave one-third of the stomach capacity empty for enzymatic churning (Mitāhāra)</li>
                <li>Favor warm water (Uṣṇodaka) seasoned with fresh ginger slices before heavy meals</li>
                <li>Avoid cold yogurt, heavy fried items, or iced desserts late in the evening</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
