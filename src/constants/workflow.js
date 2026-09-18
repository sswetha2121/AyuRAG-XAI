import {
  User,
  Activity,
  HeartPulse,
  Utensils,
  Stethoscope,
  ClipboardCheck,
  LayoutDashboard,
  Layers
} from 'lucide-react';

/**
 * AyuRAG-XAI Assessment Workflow Steps
 */
export const WORKFLOW_STEPS = [
  {
    id: 'personal-info',
    number: '01',
    label: 'Personal Information',
    sublabel: 'Demographics & Vitals',
    icon: User
  },
  {
    id: 'prakriti',
    number: '02',
    label: 'Prakriti Assessment',
    sublabel: 'Dosha Constitution (V-P-K)',
    icon: Activity
  },
  {
    id: 'lifestyle',
    number: '03',
    label: 'Lifestyle Assessment',
    sublabel: 'Dinacharya & Routine',
    icon: HeartPulse
  },
  {
    id: 'diet',
    number: '04',
    label: 'Dietary Assessment',
    sublabel: 'Ahara Habits & Agni',
    icon: Utensils
  },
  {
    id: 'symptoms',
    number: '05',
    label: 'Symptoms & Health Context',
    sublabel: 'Manifestation Mapping',
    icon: Stethoscope
  },
  {
    id: 'review',
    number: '06',
    label: 'Clinical Review',
    sublabel: 'Pre-Analysis Validation',
    icon: ClipboardCheck
  },
  {
    id: 'dashboard',
    number: '07',
    label: 'AI Decision Dashboard',
    sublabel: 'XAI & RAG Grounding',
    icon: LayoutDashboard
  },
  {
    id: 'design-system',
    number: 'DS',
    label: 'Design System Showcase',
    sublabel: 'Component Token Matrix',
    icon: Layers,
    isDevelopment: true
  }
];
