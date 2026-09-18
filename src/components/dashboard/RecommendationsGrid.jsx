import React, { useState } from 'react';
import './RecommendationsGrid.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '../ui';
import {
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Link,
  Target,
  Filter
} from 'lucide-react';

export const RecommendationsGrid = ({
  recommendations = [],
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedIds, setExpandedIds] = useState(['rec_1']);

  const categories = [
    { id: 'all', label: 'All Recommendations' },
    { id: 'diet', label: 'Diet & Agni' },
    { id: 'sleep', label: 'Sleep & Circadian' },
    { id: 'activity', label: 'Movement' },
    { id: 'stress', label: 'Stress & Mind' }
  ];

  const filteredRecs = recommendations.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.categoryKey === selectedCategory;
  });

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={`ayur-recs-container ${className}`.trim()}>
      <div className="ayur-recs-top-bar">
        <div>
          <h2 className="ayur-recs-main-title">
            Personalized Clinical <span className="ayur-recs-highlight">Recommendations</span>
          </h2>
          <p className="ayur-recs-main-sub">
            Actionable lifestyle protocols grounded in explainability and your multi-domain assessment signals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="ayur-recs-filter-track">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`ayur-rec-filter-btn ${selectedCategory === cat.id ? 'ayur-rec-filter-btn--active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="ayur-recs-grid">
        {filteredRecs.map((rec) => {
          const isExpanded = expandedIds.includes(rec.id);
          const priorityClass = rec.priority.toLowerCase();

          return (
            <div key={rec.id} className="ayur-rec-card">
              <div className="ayur-rec-card-header" onClick={() => toggleExpand(rec.id)}>
                <div className="flex items-center gap-xs flex-wrap">
                  <span className={`ayur-rec-prio-badge ayur-rec-prio-badge--${priorityClass}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="ayur-rec-cat-tag">{rec.category}</span>
                  <h3 className="ayur-rec-title">{rec.title}</h3>
                </div>

                <button
                  type="button"
                  className="ayur-rec-expand-toggle"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {/* What Statement */}
              <div className="ayur-rec-what-box">
                <span className="ayur-rec-label">What to do:</span>
                <p className="ayur-rec-val">{rec.what}</p>
              </div>

              {/* Expanded Why & Evidence Details */}
              {isExpanded && (
                <div className="ayur-rec-drawer">
                  {/* Why */}
                  <div className="ayur-rec-detail-block">
                    <span className="ayur-rec-label">Why this matters:</span>
                    <p className="ayur-rec-val">{rec.why}</p>
                  </div>

                  {/* Based on what */}
                  <div className="ayur-rec-evidence-block">
                    <div className="flex items-center gap-xs text-micro font-semibold text-secondary mb-2xs">
                      <Link size={12} />
                      <span>Evidence Attribution:</span>
                    </div>
                    <p className="ayur-rec-evidence-text">{rec.basedOnWhat}</p>
                  </div>

                  {/* Practical Tip */}
                  {rec.practicalTip && (
                    <div className="ayur-rec-tip-block">
                      <Lightbulb size={14} className="text-accent" />
                      <span className="text-small text-muted">{rec.practicalTip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
