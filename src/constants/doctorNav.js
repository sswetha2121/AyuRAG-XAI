import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BrainCircuit,
  Sparkles,
  FileBarChart,
  BookOpen,
  User,
  Settings,
  LogOut,
  Stethoscope
} from 'lucide-react';

export const DOCTOR_NAV_ITEMS = [
  {
    id: 'doctor-dashboard',
    label: 'Dashboard',
    sublabel: 'Clinical Overview',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: 'doctor-patients',
    label: 'Patients',
    sublabel: 'Cohort & Intake',
    icon: Users,
    badge: '5',
    subItems: [
      { id: 'all-patients', label: 'All Patients', filter: 'all' },
      { id: 'active-assessments', label: 'Active Assessments', filter: 'IN_PROGRESS' },
      { id: 'completed-assessments', label: 'Completed Assessments', filter: 'COMPLETED' },
    ],
  },
  {
    id: 'doctor-reviews',
    label: 'Clinical Reviews',
    sublabel: 'Validation Queue',
    icon: ClipboardCheck,
    badge: '2 Pending',
    badgeVariant: 'warning',
  },
  {
    id: 'doctor-ai-analysis',
    label: 'AI Analysis',
    sublabel: 'ML, XAI & Grounding',
    icon: BrainCircuit,
    badge: 'XAI',
    subItems: [
      { id: 'ai-ml-analysis', label: 'ML Analysis' },
      { id: 'ai-shap', label: 'SHAP Feature Weights' },
      { id: 'ai-lime', label: 'LIME Local Explanations' },
      { id: 'ai-rag-evidence', label: 'RAG Classical Evidence' },
    ],
  },
  {
    id: 'doctor-recommendations',
    label: 'Recommendations',
    sublabel: 'Ahara, Vihara & Formulations',
    icon: Sparkles,
  },
  {
    id: 'doctor-reports',
    label: 'Reports',
    sublabel: 'Clinical Audit & Export',
    icon: FileBarChart,
  },
  {
    id: 'doctor-knowledge-base',
    label: 'Knowledge Base',
    sublabel: 'Samhitas & Corpus',
    icon: BookOpen,
  },
];

export const DOCTOR_UTILITY_ITEMS = [
  {
    id: 'doctor-profile',
    label: 'Profile',
    icon: User,
  },
  {
    id: 'doctor-settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    isDanger: true,
  },
];
