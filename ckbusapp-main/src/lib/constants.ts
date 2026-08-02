export const APP_NAME = 'CKCET-ITMS';
export const APP_FULL_NAME = 'CKCET Intelligent Transport Management System';
export const INSTITUTION_NAME = 'CK College of Engineering and Technology';
export const INSTITUTION_SHORT = 'CKCET';
export const LOCATION = 'Cuddalore, Tamil Nadu';

export const DEMO_MODE_MESSAGE = 'Demo Mode — Real-time transport data is simulated. Production version will integrate backend services and live GPS data.';
export const GPS_SIM_NOTE = 'Live location is simulated for demonstration. Production deployment will integrate GPS updates from the driver mobile application or GPS hardware.';

export type UserRole = 'student' | 'parent' | 'driver' | 'admin';

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  parent: 'Parent',
  driver: 'Driver',
  admin: 'Transport Officer',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  student: 'Track your bus, view your pass, mark attendance and more.',
  parent: "Monitor your child's journey and safety in real time.",
  driver: 'Manage trips, scan QR attendance and report delays.',
  admin: 'Oversee the entire transport operation and analytics.',
};

export const BUS_IDS = ['CKCET-01', 'CKCET-02', 'CKCET-03', 'CKCET-04'] as const;

export const STOPS = [
  'Cuddalore New Bus Stand', 'Manjakuppam', 'Thirupapuliyur', 'Semmandalam',
  'Panruti', 'Kurinjipadi', 'Neyveli', 'Vadalur', 'Chidambaram',
] as const;

export const DEPARTMENTS = [
  'Computer Science & Engineering', 'Electronics & Communication Engineering',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical & Electronics Engineering',
  'Information Technology', 'Artificial Intelligence & Data Science',
] as const;

export const NAV_ITEMS: Record<UserRole, { label: string; to: string; icon: string }[]> = {
  student: [
    { label: 'Dashboard', to: '/student', icon: 'LayoutDashboard' },
    { label: 'Live Tracking', to: '/student/tracking', icon: 'MapPin' },
    { label: 'My Schedule', to: '/student', icon: 'CalendarClock' },
    { label: 'Bus Pass', to: '/student/pass', icon: 'CreditCard' },
    { label: 'Attendance', to: '/student/attendance', icon: 'QrCode' },
    { label: 'Leave Request', to: '/student/leave', icon: 'CalendarPlus' },
    { label: 'Complaints', to: '/student/complaints', icon: 'MessageSquareWarning' },
    { label: 'Contact Office', to: '/student/contact', icon: 'MessagesSquare' },
    { label: 'Ratings', to: '/student/ratings', icon: 'Star' },
    { label: 'Notifications', to: '/student/notifications', icon: 'Bell' },
    { label: 'Profile', to: '/student/profile', icon: 'User' },
    { label: 'Settings', to: '/student/settings', icon: 'Settings' },
  ],
  parent: [
    { label: 'Dashboard', to: '/parent', icon: 'LayoutDashboard' },
    { label: 'Live Tracking', to: '/parent/tracking', icon: 'MapPin' },
    { label: 'Child Status', to: '/parent/child', icon: 'ShieldCheck' },
    { label: 'Safety Timeline', to: '/parent/timeline', icon: 'Route' },
    { label: 'Driver Details', to: '/parent/driver', icon: 'Users' },
    { label: 'Notifications', to: '/parent/notifications', icon: 'Bell' },
    { label: 'Emergency Contacts', to: '/parent/emergency', icon: 'Siren' },
    { label: 'Profile', to: '/parent/profile', icon: 'User' },
    { label: 'Settings', to: '/parent/settings', icon: 'Settings' },
  ],
  driver: [
    { label: 'Dashboard', to: '/driver', icon: 'LayoutDashboard' },
    { label: "Today's Trips", to: '/driver/trips', icon: 'CalendarClock' },
    { label: 'Assigned Route', to: '/driver/route', icon: 'Route' },
    { label: 'Student List', to: '/driver/students', icon: 'Users' },
    { label: 'QR Scanner', to: '/driver/scanner', icon: 'ScanLine' },
    { label: 'Announcements', to: '/driver/announcements', icon: 'Megaphone' },
    { label: 'Delay Report', to: '/driver/delay', icon: 'Clock' },
    { label: 'Emergency SOS', to: '/driver/sos', icon: 'Siren' },
    { label: 'Profile', to: '/driver/profile', icon: 'User' },
  ],
  admin: [
    { label: 'Control Center', to: '/admin', icon: 'LayoutDashboard' },
    { label: 'Fleet Control', to: '/admin/fleet', icon: 'Bus' },
    { label: 'Schedules', to: '/admin/schedules', icon: 'CalendarClock' },
    { label: 'Daily Scheduling', to: '/admin/daily-scheduling', icon: 'CalendarPlus' },
    { label: 'Schedule Calendar', to: '/admin/schedule-calendar', icon: 'CalendarDays' },
    { label: 'Student Assignment', to: '/admin/assignment', icon: 'UserPlus' },
    { label: 'Driver Availability', to: '/admin/driver-availability', icon: 'BadgeCheck' },
    { label: 'Routes', to: '/admin/routes', icon: 'Route' },
    { label: 'Stops', to: '/admin/stops', icon: 'MapPin' },
    { label: 'Students', to: '/admin/students', icon: 'GraduationCap' },
    { label: 'Parents', to: '/admin/parents', icon: 'Users' },
    { label: 'Drivers', to: '/admin/drivers', icon: 'IdCard' },
    { label: 'Attendance', to: '/admin/attendance', icon: 'ClipboardCheck' },
    { label: 'Complaints', to: '/admin/complaints', icon: 'MessageSquareWarning' },
    { label: 'Leave Requests', to: '/admin/leaves', icon: 'CalendarPlus' },
    { label: 'Announcements', to: '/admin/announcements', icon: 'Megaphone' },
    { label: 'Analytics', to: '/admin/analytics', icon: 'BarChart3' },
    { label: 'AI Insights', to: '/admin/ai', icon: 'Sparkles' },
    { label: 'Reports', to: '/admin/reports', icon: 'FileText' },
    { label: 'Calendar', to: '/admin/calendar', icon: 'CalendarDays' },
    { label: 'Emergency', to: '/admin/emergency', icon: 'Siren' },
  ],
};
