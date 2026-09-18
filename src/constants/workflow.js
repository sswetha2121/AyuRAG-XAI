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
    icon: User,
    phase: 2
  },
  {
    id: 'prakriti',
    number: '02',
    label: 'Prakriti Assessment',
    sublabel: 'Dosha Constitution (V-P-K)',
    icon: Activity,
    phase: 3
  },
  {
    id: 'lifestyle',
    number: '03',
    label: 'Lifestyle Assessment',
    sublabel: 'Dinacharya & Routine',
    icon: HeartPulse,
    phase: 4
  },
  {
    id: 'diet',
    number: '04',
    label: 'Dietary Assessment',
    sublabel: 'Ahara Habits & Agni',
    icon: Utensils,
    phase: 4
  },
  {
    id: 'symptoms',
    number: '05',
    label: 'Symptoms & Chief Complaint',
    sublabel: 'Vikriti & Imbalance',
    icon: Stethoscope,
    phase: 5
  },
  {
    id: 'review',
    number: '06',
    label: 'Clinical Review',
    sublabel: 'Input Verification',
    icon: ClipboardCheck,
    phase: 5
  },
  {
    id: 'dashboard',
    number: '07',
    label: 'AI Decision Dashboard',
    sublabel: 'RAG + XAI Explanations',
    icon: LayoutDashboard,
    phase: 6
  },
  {
    id: 'design-system',
    number: 'DS',
    label: 'Design System Showcase',
    sublabel: 'Phase 1 Token & UI Matrix',
    icon: Layers,
    isDevelopment: true
  }
];
