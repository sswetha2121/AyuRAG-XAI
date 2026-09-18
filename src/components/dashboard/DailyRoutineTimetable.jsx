import React from 'react';
import './DailyRoutineTimetable.css';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../ui';
import { Sunrise, Sun, Sunset, Moon, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

const ICON_MAP = {
  Sunrise,
  Sun,
  Sunset,
  Moon
};

export const DailyRoutineTimetable = ({
  timetable = [],
  className = ''
}) => {
  return (
    <div className={`ayur-routine-timetable-wrap ${className}`.trim()}>
      <Card variant="highlighted" className="ayur-routine-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-xs">
            <div className="flex items-center gap-xs">
              <Badge color="accent" variant="solid" size="sm" icon={<Clock size={12} />}>
                Circadian Architecture
              </Badge>
              <Badge color="primary" variant="subtle" size="sm">
                Dinacharya Protocol
              </Badge>
            </div>
            <span className="ayur-demo-badge">4-Phase Circadian Guidance</span>
          </div>

          <CardTitle as="h2" className="ayur-routine-title">
            Personalized Daily Routine <span className="ayur-routine-highlight">(Dinacaryā)</span>
          </CardTitle>

          <CardDescription className="ayur-routine-desc">
            An optimal 24-hour physiological schedule synchronizing your biological clocks with natural solar energy transitions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-timetable-grid">
            {timetable.map((phase, idx) => {
              const Icon = ICON_MAP[phase.icon] || Sun;

              return (
                <div key={idx} className="ayur-timetable-phase-card">
                  <div className="ayur-timetable-phase-header">
                    <div className="ayur-timetable-icon-box">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="ayur-timetable-phase-name">{phase.phase}</h3>
                      <span className="ayur-timetable-time-tag">{phase.sanskrit}</span>
                    </div>
                  </div>

                  <div className="ayur-timetable-focus-box">
                    <span className="ayur-timetable-focus-label">Physiological Focus:</span>
                    <span className="ayur-timetable-focus-val">{phase.focus}</span>
                  </div>

                  <ul className="ayur-timetable-steps-list">
                    {phase.steps.map((step, sIdx) => (
                      <li key={sIdx} className="ayur-timetable-step-item">
                        <CheckCircle2 size={13} className="text-secondary mt-2xs flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
