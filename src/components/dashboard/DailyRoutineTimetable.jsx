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
  // Normalize timetable: support both 4-phase structured array and flat item list
  const normalizedPhases = React.useMemo(() => {
    if (!Array.isArray(timetable) || timetable.length === 0) return [];

    // Check if items are already 4-phase cards
    const isPhased = timetable.some((item) => item && (item.phase || item.steps));
    if (isPhased) {
      return timetable.map((p, idx) => ({
        phase: p.phase || `Phase ${idx + 1}`,
        timeWindow: p.timeWindow || p.scheduleName || p.time || 'Daily Window',
        icon: p.icon || (idx === 0 ? 'Sunrise' : idx === 1 ? 'Sun' : idx === 2 ? 'Sunset' : 'Moon'),
        focus: p.focus || p.category || 'Circadian Balance',
        steps: Array.isArray(p.steps) ? p.steps : (p.activity ? [p.activity] : ['Circadian balancing protocol'])
      }));
    }

    // Flat list of { time, activity, category } -> group into 4 circadian blocks
    const morning = [];
    const midday = [];
    const evening = [];
    const night = [];

    timetable.forEach((item) => {
      const text = item.activity || item.text || item.title || JSON.stringify(item);
      const time = (item.time || '').toLowerCase();
      if (time.includes('am') && (time.startsWith('05') || time.startsWith('06') || time.startsWith('07') || time.startsWith('08') || time.startsWith('09') || time.startsWith('10') || time.startsWith('11'))) {
        morning.push(`${item.time ? item.time + ' — ' : ''}${text}`);
      } else if (time.includes('pm') && (time.startsWith('12') || time.startsWith('01') || time.startsWith('02') || time.startsWith('03'))) {
        midday.push(`${item.time ? item.time + ' — ' : ''}${text}`);
      } else if (time.includes('pm') && (time.startsWith('04') || time.startsWith('05') || time.startsWith('06') || time.startsWith('07') || time.startsWith('08'))) {
        evening.push(`${item.time ? item.time + ' — ' : ''}${text}`);
      } else {
        night.push(`${item.time ? item.time + ' — ' : ''}${text}`);
      }
    });

    return [
      {
        phase: 'Morning Routine & Awakening',
        timeWindow: '06:00 – 09:00 AM (Prāna Phase)',
        icon: 'Sunrise',
        focus: 'Gentle Awakening & Metabolic Kindling (Agni Dīpana)',
        steps: morning.length > 0 ? morning : ['Wake with sunrise, drink warm water with cumin', 'Gentle movement and respiratory exercise']
      },
      {
        phase: 'Midday Peak Metabolism',
        timeWindow: '11:30 AM – 02:00 PM (Pitta Phase)',
        icon: 'Sun',
        focus: 'Optimal Digestion & Primary Nourishment',
        steps: midday.length > 0 ? midday : ['Main nutritious warm lunch', 'Sip warm herbal water; avoid cold drinks']
      },
      {
        phase: 'Evening Decompression',
        timeWindow: '05:00 – 08:30 PM (Vata Phase)',
        icon: 'Sunset',
        focus: 'Calming Pacing & Light Evening Nourishment',
        steps: evening.length > 0 ? evening : ['Light, easily digestible warm dinner', 'Quiet contemplative wind-down']
      },
      {
        phase: 'Night Rest & Cellular Recovery',
        timeWindow: '10:00 – 10:30 PM (Kapha Nidrā Phase)',
        icon: 'Moon',
        focus: 'Cellular Repair & Deep Restful Sleep (Nidrā)',
        steps: night.length > 0 ? night : ['Screen disconnect 45 minutes before sleep', 'Grounding breathing exercises and peaceful rest']
      }
    ];
  }, [timetable]);

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
                Daily Routine Protocol
              </Badge>
            </div>
            <span className="ayur-demo-badge">4-Phase Circadian Guidance</span>
          </div>

          <CardTitle as="h2" className="ayur-routine-title">
            Personalized Daily Routine <span className="ayur-routine-highlight">Schedule</span>
          </CardTitle>

          <CardDescription className="ayur-routine-desc">
            An optimal 24-hour physiological schedule synchronizing your biological clocks with natural solar energy transitions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="ayur-timetable-grid">
            {normalizedPhases.map((phase, idx) => {
              const Icon = ICON_MAP[phase.icon] || Sun;
              const steps = Array.isArray(phase.steps) ? phase.steps : [];

              return (
                <div key={idx} className="ayur-timetable-phase-card">
                  <div className="ayur-timetable-phase-header">
                    <div className="ayur-timetable-icon-box">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="ayur-timetable-phase-name">{phase.phase}</h3>
                      <span className="ayur-timetable-time-tag">{phase.timeWindow || phase.scheduleName || 'Daily Window'}</span>
                    </div>
                  </div>

                  <div className="ayur-timetable-focus-box">
                    <span className="ayur-timetable-focus-label">Physiological Focus:</span>
                    <span className="ayur-timetable-focus-val">{phase.focus}</span>
                  </div>

                  <ul className="ayur-timetable-steps-list">
                    {steps.map((step, sIdx) => (
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
