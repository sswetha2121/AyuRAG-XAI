import {
  User,
  Activity,
  HeartPulse,
  Utensils,
  Stethoscope,
  ClipboardCheck,
  LayoutDashboard,
  Bell,
  LogOut,
  Layers,
  MessageSquare,
  Sparkles
} from 'lucide-react';

/**
 * AyuRAG-XAI Patient Portal Primary Navigation
 * Phase 8 Specification:
 * - My Dashboard
 * - Assessment Results
 * - My Diet Plan
 * - Daily Checklist
 * - Progress
 * - Chat with Doctor
 * - My Profile
 */
export const PATIENT_PORTAL_NAV_ITEMS = [
  {
    id: 'dashboard-overview',
    label: 'My Dashboard',
    sublabel: 'Status & Next Actions',
    icon: LayoutDashboard,
    route: '/dashboard',
    tab: 'overview'
  },
  {
    id: 'results',
    label: 'Assessment Results',
    sublabel: 'Prakriti & AI Attribution',
    icon: Sparkles,
    route: '/assessment/results',
  },
  {
    id: 'my-diet-plan',
    label: 'My Diet Plan',
    sublabel: 'Doctor-Approved Protocol',
    icon: Utensils,
    route: '/dashboard',
    tab: 'diet'
  },
  {
    id: 'daily-checklist',
    label: 'Daily Checklist',
    sublabel: 'Meal Schedule & Adherence',
    icon: ClipboardCheck,
    route: '/dashboard',
    tab: 'schedule'
  },
  {
    id: 'progress',
    label: 'Progress',
    sublabel: 'Habit & Adherence Tracker',
    icon: HeartPulse,
    route: '/dashboard',
    tab: 'progress'
  },
  {
    id: 'chat-doctor',
    label: 'Chat with Doctor',
    sublabel: 'Direct Consultation',
    icon: MessageSquare,
    route: '/dashboard',
    tab: 'chat'
  },
];

export const PATIENT_UTILITY_ITEMS = [
  {
    id: 'patient-profile',
    label: 'My Profile',
    icon: User,
  },
  {
    id: 'logout',
    label: 'Sign Out',
    icon: LogOut,
    isDanger: true,
  }
];

/**
 * AyuRAG-XAI Step-by-Step Guided Intake Assessment Pipeline
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
    label: 'Body Constitution Assessment',
    sublabel: 'Physical & Metabolic Type',
    icon: Activity
  },
  {
    id: 'lifestyle',
    number: '03',
    label: 'Lifestyle Assessment',
    sublabel: 'Daily Routine & Sleep',
    icon: HeartPulse
  },
  {
    id: 'diet',
    number: '04',
    label: 'Dietary Assessment',
    sublabel: 'Eating Habits & Digestion',
    icon: Utensils
  },
  {
    id: 'symptoms',
    number: '05',
    label: 'Symptoms & Health Context',
    sublabel: 'Health Concerns',
    icon: Stethoscope
  },
  {
    id: 'review',
    number: '06',
    label: 'Clinical Review & Consent',
    sublabel: 'Pre-Inference Verification',
    icon: ClipboardCheck
  }
];
