import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileBarChart,
  Bell,
  User,
  Settings,
  LogOut,
  Stethoscope
} from 'lucide-react';

/**
 * Doctor Decision Support Workspace Navigation
 * Only displays routes and workflows actually implemented in the platform.
 */
export const DOCTOR_NAV_ITEMS = [
  {
    id: 'doctor-dashboard',
    label: 'Overview',
    sublabel: 'Clinical Decision Support',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: 'doctor-patients',
    label: 'Patients',
    sublabel: 'Cohort & Intake Records',
    icon: Users,
    badge: null,
  },
  {
    id: 'doctor-reviews',
    label: 'Reviews',
    sublabel: 'Clinical Validation Queue',
    icon: ClipboardCheck,
    badge: null,
  },
  {
    id: 'doctor-reports',
    label: 'Care Plans & Reports',
    sublabel: 'Dossiers & Audit Registry',
    icon: FileBarChart,
    badge: null,
  },
  {
    id: 'doctor-notifications',
    label: 'Notifications',
    sublabel: 'Clinical Alerts',
    icon: Bell,
    badge: null,
  },
];

export const DOCTOR_UTILITY_ITEMS = [
  {
    id: 'doctor-profile',
    label: 'Physician Profile',
    icon: User,
  },
  {
    id: 'logout',
    label: 'Sign Out',
    icon: LogOut,
    isDanger: true,
  },
];
