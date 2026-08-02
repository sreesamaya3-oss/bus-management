export type { UserRole } from './constants';

export interface User {
  id: string;
  role: import('./constants').UserRole;
  name: string;
  email: string;
  phone: string;
}

export interface Student extends User {
  role: 'student';
  registerNo: string;
  department: string;
  year: number;
  section: string;
  busId: string;
  routeId: string;
  pickupStop: string;
  dropStop: string;
  scheduleId: string;
  parent: Parent;
}

export interface Parent extends User {
  role: 'parent';
  childId: string;
  childName: string;
  childRegisterNo: string;
  relation: string;
  emergencyContacts: EmergencyContact[];
}

export interface Driver extends User {
  role: 'driver';
  driverId: string;
  licenseNo: string;
  busId: string;
  routeId: string;
  experienceYears: number;
  rating: number;
  availability: 'available' | 'assigned' | 'on-leave' | 'unavailable';
}

export interface Admin extends User {
  role: 'admin';
  staffId: string;
  designation: string;
}

export interface Bus {
  id: string;
  number: string;
  capacity: number;
  occupied: number;
  driverId: string;
  driverName: string;
  routeId: string;
  routeName: string;
  status: 'on-time' | 'delayed' | 'maintenance' | 'in-transit' | 'idle';
  currentStop: string;
  nextStop: string;
  etaMinutes: number;
  progress: number;
  lastService: string;
  speed: number;
  lastUpdated: string;
}

export interface Stop {
  id: string;
  name: string;
  sequence: number;
  arrivalTime: string;
  departureTime: string;
  lat: number;
  lng: number;
  studentsBoarding: number;
  capacity: number;
  active: boolean;
  routeId: string;
}

export interface Route {
  id: string;
  name: string;
  busId: string;
  stops: Stop[];
  distanceKm: number;
  durationMin: number;
  shift: 'morning' | 'evening';
  active: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  registerNo: string;
  busId: string;
  date: string;
  boardingTime: string | null;
  dropTime: string | null;
  status: 'present' | 'absent' | 'leave';
  method: 'qr' | 'manual';
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  response?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  type: 'sick' | 'personal' | 'exam' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'route-change';
  audience: import('./constants').UserRole | 'all';
  createdAt: string;
  createdBy: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  available: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'emergency' | 'route-change' | 'complaint' | 'leave';
  read: boolean;
  createdAt: string;
  audience: import('./constants').UserRole | 'all';
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'office';
  text: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  studentId: string;
  studentName: string;
  targetType: 'driver' | 'bus';
  targetId: string;
  targetName: string;
  stars: number;
  comment: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'holiday' | 'exam-bus' | 'maintenance' | 'special';
  description: string;
}

export interface AIInsight {
  id: string;
  title: string;
  insight: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Schedule {
  id: string;
  driverId: string;
  driverName: string;
  busId: string;
  routeId: string;
  routeName: string;
  shift: 'morning' | 'evening';
  startTime: string;
  endTime: string;
  date: string;
  substituteDriverId?: string;
  substituteDriverName?: string;
  hasConflict: boolean;
}

export interface JourneyEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'done' | 'active' | 'upcoming';
  icon: 'home' | 'pickup' | 'boarded' | 'transit' | 'campus' | 'return' | 'drop';
}

export interface DailyOperation {
  id: string;
  phase: 'morning-prep' | 'morning-boarding' | 'morning-transit' | 'college-hours' | 'evening-boarding' | 'evening-transit' | 'completed';
  label: string;
  description: string;
  status: 'done' | 'active' | 'upcoming';
  time: string;
}

export interface DriverAvailability {
  driverId: string;
  driverName: string;
  status: 'available' | 'assigned' | 'on-leave' | 'unavailable';
  assignedBusId?: string;
  assignedRoute?: string;
  todaySchedule?: string;
  rating: number;
  experienceYears: number;
  phone: string;
  licenseNo: string;
}

export interface StopSchedule {
  stopName: string;
  sequence: number;
  arrivalTime: string;
  departureTime: string;
  waitingDuration: number;
  studentsBoarding: number;
  isCampus: boolean;
}

export interface TransportTimetable {
  id: string;
  busId: string;
  routeId: string;
  routeName: string;
  shift: 'morning' | 'evening';
  stops: StopSchedule[];
  collegeArrival: string;
  collegeDeparture: string;
}

export type ScheduleStatus = 'upcoming' | 'arriving-soon' | 'waiting-at-stop' | 'departed' | 'reached-college';

export interface StudentScheduleView {
  busId: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  pickupStop: string;
  pickupArrivalTime: string;
  pickupWaitingDuration: number;
  pickupDepartureTime: string;
  collegeArrival: string;
  dropStop: string;
  dropArrivalTime: string;
  eveningDeparture: string;
  eveningDropArrival: string;
  status: ScheduleStatus;
  countdownSeconds: number;
  statusMessage: string;
}

export interface ParentScheduleView {
  childName: string;
  childRegisterNo: string;
  busId: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  pickupStop: string;
  pickupScheduledTime: string;
  pickupActualTime: string;
  pickupWaitingDuration: number;
  collegeArrival: string;
  collegeArrivalActual: string;
  dropStop: string;
  eveningDeparture: string;
  eveningDropArrival: string;
  pickupStatus: 'completed' | 'pending' | 'in-progress';
  arrivalStatus: 'completed' | 'pending' | 'in-progress';
}

export interface DriverScheduleView {
  busId: string;
  routeName: string;
  shift: 'morning' | 'evening';
  stops: StopSchedule[];
  startTime: string;
  endTime: string;
  tripStatus: 'not-started' | 'in-progress' | 'completed';
  currentStopIndex: number;
}

export type JourneyPhase = 'waiting' | 'boarded' | 'travelling' | 'reached-college' | 'returning' | 'reached-home';

export interface DailyTransportAssignment {
  id: string;
  date: string;
  busId: string;
  driverId: string;
  driverName: string;
  replacementDriverId?: string;
  replacementDriverName?: string;
  routeId: string;
  routeName: string;
  morningShift: { startTime: string; endTime: string; collegeArrival: string; };
  eveningShift: { startTime: string; endTime: string; collegeDeparture: string; };
  pickupTime: string;
  dropTime: string;
  status: 'on-time' | 'delayed' | 'cancelled';
  leaveApproved: boolean;
  studentCount: number;
}
