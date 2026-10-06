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
                Digestive Metabolism
              </Badge>
            </div>
            <span className="ayur-demo-badge">Metabolic Signal</span>
          </div>

          <CardTitle as="h2" className="ayur-agni-title">
            Digestive Capacity & <span className="ayur-agni-highlight">Metabolic Balance</span>
          </CardTitle>

          <CardDescription className="ayur-agni-desc">
            Evaluating the metabolic capacity responsible for nutrient assimilation, bio-transformation, and digestive waste prevention.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-agni-content-grid">
            <div className="ayur-agni-status-box">
              <div className="flex items-center gap-xs mb-xs">
                <Flame size={18} className="text-accent" />
                <span className="font-semibold text-body text-primary">Assessed Digestive State:</span>
              </div>
              <h3 className="ayur-agni-status-val">{agniPattern}</h3>
              <p className="text-small text-muted mt-2xs mb-0">
                Characterized by fluctuating hunger, prone to abdominal distension when meals are delayed or cold.
              </p>
            </div>

            <div className="ayur-agni-protocols-box">
              <h4 className="ayur-agni-protocol-title">Core Digestive Optimization Rules:</h4>
              <ul className="ayur-agni-rules-list">
                <li>Eat in a calm, seated environment without emotional distress or digital distractions</li>
                <li>Leave one-third of stomach capacity empty for optimal digestive circulation</li>
                <li>Favor warm water infused with fresh ginger slices before heavy meals</li>
                <li>Avoid cold dairy, heavy fried items, or iced desserts late in the evening</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
