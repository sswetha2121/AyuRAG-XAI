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
  Layers
} from 'lucide-react';

/**
 * AyuRAG-XAI Patient Portal Primary Navigation
 * As specified in Phase 2 Requirements:
 * - Overview
 * - My Assessment
 * - My Wellness Plan
 * - Progress
 * - Notifications
 * - Profile and account actions
 */
export const PATIENT_PORTAL_NAV_ITEMS = [
  {
    id: 'dashboard-overview',
    label: 'Overview',
    sublabel: 'Status & Next Actions',
    icon: LayoutDashboard,
    route: '/dashboard',
    tab: 'overview'
  },
  {
    id: 'my-assessment',
    label: 'My Assessment',
    sublabel: 'Take or Review Intake',
    icon: Activity,
    route: '/assessment-overview',
  },
  {
    id: 'wellness-plan',
    label: 'My Wellness Plan',
    sublabel: 'Daily Schedule & Diet',
    icon: Utensils,
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
    id: 'patient-notifications',
    label: 'Notifications',
    sublabel: 'Reminders & Clinical Alerts',
    icon: Bell,
    badge: null
  }
];

export const PATIENT_UTILITY_ITEMS = [
  {
    id: 'patient-profile',
    label: 'Profile & Account',
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
