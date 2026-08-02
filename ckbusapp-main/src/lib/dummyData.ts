import type {
  Student, Parent, Driver, Admin, Bus, Route, Stop,
  AttendanceRecord, Complaint, LeaveRequest, Announcement,
  EmergencyContact, Notification, ChatMessage, Rating, CalendarEvent, AIInsight,
  Schedule, JourneyEvent, DailyOperation, DriverAvailability,
  TransportTimetable, StopSchedule, DailyTransportAssignment,
} from './types';

const stopCoords: Record<string, { lat: number; lng: number }> = {
  'Cuddalore New Bus Stand': { lat: 11.7437, lng: 79.7489 },
  Manjakuppam: { lat: 11.7486, lng: 79.7578 },
  Thirupapuliyur: { lat: 11.7521, lng: 79.7631 },
  Semmandalam: { lat: 11.7589, lng: 79.7698 },
  Panruti: { lat: 11.7764, lng: 79.7521 },
  Kurinjipadi: { lat: 11.7982, lng: 79.7412 },
  Neyveli: { lat: 11.6651, lng: 79.7128 },
  Vadalur: { lat: 11.6102, lng: 79.7056 },
  Chidambaram: { lat: 11.3999, lng: 79.6931 },
};

let stopSeq = 0;
function makeStop(name: string, sequence: number, arrivalTime: string, departureTime: string, boarding: number, capacity: number, routeId: string): Stop {
  const c = stopCoords[name] ?? { lat: 11.7, lng: 79.7 };
  return { id: `stop-${++stopSeq}`, name, sequence, arrivalTime, departureTime, lat: c.lat, lng: c.lng, studentsBoarding: boarding, capacity, active: true, routeId };
}

export const routes: Route[] = [
  { id: 'route-01', name: 'Route A — Cuddalore City Loop', busId: 'CKCET-01', distanceKm: 12.4, durationMin: 42, shift: 'morning', active: true, stops: [
    makeStop('Cuddalore New Bus Stand', 0, '07:00', '07:03', 8, 15, 'route-01'), makeStop('Manjakuppam', 1, '07:08', '07:10', 6, 12, 'route-01'),
    makeStop('Thirupapuliyur', 2, '07:15', '07:17', 5, 10, 'route-01'), makeStop('Semmandalam', 3, '07:22', '07:25', 4, 8, 'route-01'),
  ]},
  { id: 'route-02', name: 'Route B — Panruti Express', busId: 'CKCET-02', distanceKm: 24.8, durationMin: 58, shift: 'morning', active: true, stops: [
    makeStop('Panruti', 0, '06:45', '06:48', 10, 18, 'route-02'), makeStop('Kurinjipadi', 1, '07:02', '07:05', 7, 14, 'route-02'), makeStop('Semmandalam', 2, '07:25', '07:28', 5, 10, 'route-02'),
  ]},
  { id: 'route-03', name: 'Route C — Neyveli Line', busId: 'CKCET-03', distanceKm: 32.1, durationMin: 72, shift: 'morning', active: true, stops: [
    makeStop('Neyveli', 0, '06:30', '06:33', 12, 20, 'route-03'), makeStop('Vadalur', 1, '06:50', '06:53', 8, 15, 'route-03'), makeStop('Kurinjipadi', 2, '07:15', '07:18', 6, 12, 'route-03'),
  ]},
  { id: 'route-04', name: 'Route D — Chidambaram Coastal', busId: 'CKCET-04', distanceKm: 41.6, durationMin: 85, shift: 'morning', active: true, stops: [
    makeStop('Chidambaram', 0, '06:15', '06:18', 14, 22, 'route-04'), makeStop('Vadalur', 1, '06:45', '06:48', 5, 12, 'route-04'), makeStop('Panruti', 2, '07:10', '07:13', 6, 14, 'route-04'),
  ]},
];

export const drivers: Driver[] = [
  { id: 'drv-01', role: 'driver', name: 'R. Senthil Kumar', email: 'senthil@ckcet.ac.in', phone: '+91 98765 43210', driverId: 'CKCET-DRV-01', licenseNo: 'TN-CDL-2021001234', busId: 'CKCET-01', routeId: 'route-01', experienceYears: 9, rating: 4.7, availability: 'assigned' },
  { id: 'drv-02', role: 'driver', name: 'M. Arumugam', email: 'arumugam@ckcet.ac.in', phone: '+91 98765 43211', driverId: 'CKCET-DRV-02', licenseNo: 'TN-CDL-2021001567', busId: 'CKCET-02', routeId: 'route-02', experienceYears: 12, rating: 4.9, availability: 'assigned' },
  { id: 'drv-03', role: 'driver', name: 'P. Mohanraj', email: 'mohanraj@ckcet.ac.in', phone: '+91 98765 43212', driverId: 'CKCET-DRV-03', licenseNo: 'TN-CDL-2021001890', busId: 'CKCET-03', routeId: 'route-03', experienceYears: 7, rating: 4.5, availability: 'assigned' },
  { id: 'drv-04', role: 'driver', name: 'K. Baskar', email: 'baskar@ckcet.ac.in', phone: '+91 98765 43213', driverId: 'CKCET-DRV-04', licenseNo: 'TN-CDL-2021002112', busId: 'CKCET-04', routeId: 'route-04', experienceYears: 15, rating: 4.8, availability: 'on-leave' },
  { id: 'drv-05', role: 'driver', name: 'S. Murugan', email: 'murugan@ckcet.ac.in', phone: '+91 98765 43214', driverId: 'CKCET-DRV-05', licenseNo: 'TN-CDL-2021002345', busId: '', routeId: '', experienceYears: 5, rating: 4.3, availability: 'available' },
  { id: 'drv-06', role: 'driver', name: 'T. Ramesh Kumar', email: 'ramesh@ckcet.ac.in', phone: '+91 98765 43215', driverId: 'CKCET-DRV-06', licenseNo: 'TN-CDL-2021002567', busId: '', routeId: '', experienceYears: 8, rating: 4.6, availability: 'available' },
];

export const buses: Bus[] = [
  { id: 'CKCET-01', number: 'TN 22 AB 4521', capacity: 48, occupied: 23, driverId: 'drv-01', driverName: 'R. Senthil Kumar', routeId: 'route-01', routeName: 'Route A — Cuddalore City Loop', status: 'in-transit', currentStop: 'Manjakuppam', nextStop: 'Thirupapuliyur', etaMinutes: 7, progress: 35, lastService: '2026-06-18', speed: 32, lastUpdated: new Date().toISOString() },
  { id: 'CKCET-02', number: 'TN 22 AB 4522', capacity: 48, occupied: 28, driverId: 'drv-02', driverName: 'M. Arumugam', routeId: 'route-02', routeName: 'Route B — Panruti Express', status: 'delayed', currentStop: 'Kurinjipadi', nextStop: 'Semmandalam', etaMinutes: 14, progress: 62, lastService: '2026-05-30', speed: 18, lastUpdated: new Date().toISOString() },
  { id: 'CKCET-03', number: 'TN 22 AB 4523', capacity: 52, occupied: 26, driverId: 'drv-03', driverName: 'P. Mohanraj', routeId: 'route-03', routeName: 'Route C — Neyveli Line', status: 'on-time', currentStop: 'Vadalur', nextStop: 'Kurinjipadi', etaMinutes: 12, progress: 48, lastService: '2026-06-02', speed: 28, lastUpdated: new Date().toISOString() },
  { id: 'CKCET-04', number: 'TN 22 AB 4524', capacity: 52, occupied: 0, driverId: 'drv-04', driverName: 'K. Baskar (On Leave)', routeId: 'route-04', routeName: 'Route D — Chidambaram Coastal', status: 'maintenance', currentStop: 'Vadalur', nextStop: 'Panruti', etaMinutes: 0, progress: 0, lastService: '2026-07-20', speed: 0, lastUpdated: new Date().toISOString() },
];

export const parents: Parent[] = [
  { id: 'par-01', role: 'parent', name: 'S. Lakshmi', email: 'lakshmi.s@parent.ckcet.ac.in', phone: '+91 91234 56780', childId: 'stu-01', childName: 'S. Kavin', childRegisterNo: 'CKCET21CS045', relation: 'Mother', emergencyContacts: [
    { id: 'ec-1', name: 'S. Rajesh (Father)', role: 'Parent', phone: '+91 91234 56781', available: true },
    { id: 'ec-2', name: 'Transport Office', role: 'Office', phone: '+91 4142 220 100', available: true },
  ]},
  { id: 'par-02', role: 'parent', name: 'D. Priya', email: 'priya.d@parent.ckcet.ac.in', phone: '+91 91234 56782', childId: 'stu-02', childName: 'R. Divya', childRegisterNo: 'CKCET22EC012', relation: 'Mother', emergencyContacts: [
    { id: 'ec-3', name: 'R. Suresh (Father)', role: 'Parent', phone: '+91 91234 56783', available: true },
  ]},
  { id: 'par-03', role: 'parent', name: 'A. Kavitha', email: 'kavitha.a@parent.ckcet.ac.in', phone: '+91 91234 56784', childId: 'stu-03', childName: 'A. Vignesh', childRegisterNo: 'CKCET23ME078', relation: 'Mother', emergencyContacts: [
    { id: 'ec-4', name: 'A. Senthil (Father)', role: 'Parent', phone: '+91 91234 56785', available: true },
  ]},
  { id: 'par-04', role: 'parent', name: 'T. Meena', email: 'meena.t@parent.ckcet.ac.in', phone: '+91 91234 56786', childId: 'stu-04', childName: 'T. Bhuvana', childRegisterNo: 'CKCET21IT033', relation: 'Mother', emergencyContacts: [
    { id: 'ec-5', name: 'T. Gopi (Father)', role: 'Parent', phone: '+91 91234 56787', available: true },
  ]},
];

export const students: Student[] = [
  { id: 'stu-01', role: 'student', name: 'S. Kavin', email: 'kavin.s@ckcet.ac.in', phone: '+91 90000 11111', registerNo: 'CKCET21CS045', department: 'Computer Science & Engineering', year: 3, section: 'A', busId: 'CKCET-01', routeId: 'route-01', pickupStop: 'Manjakuppam', dropStop: 'Semmandalam', scheduleId: 'sch-01', parent: parents[0] },
  { id: 'stu-02', role: 'student', name: 'R. Divya', email: 'divya.r@ckcet.ac.in', phone: '+91 90000 22222', registerNo: 'CKCET22EC012', department: 'Electronics & Communication Engineering', year: 2, section: 'B', busId: 'CKCET-02', routeId: 'route-02', pickupStop: 'Panruti', dropStop: 'Semmandalam', scheduleId: 'sch-02', parent: parents[1] },
  { id: 'stu-03', role: 'student', name: 'A. Vignesh', email: 'vignesh.a@ckcet.ac.in', phone: '+91 90000 33333', registerNo: 'CKCET23ME078', department: 'Mechanical Engineering', year: 1, section: 'A', busId: 'CKCET-03', routeId: 'route-03', pickupStop: 'Neyveli', dropStop: 'Kurinjipadi', scheduleId: 'sch-03', parent: parents[2] },
  { id: 'stu-04', role: 'student', name: 'T. Bhuvana', email: 'bhuvana.t@ckcet.ac.in', phone: '+91 90000 44444', registerNo: 'CKCET21IT033', department: 'Information Technology', year: 3, section: 'B', busId: 'CKCET-04', routeId: 'route-04', pickupStop: 'Chidambaram', dropStop: 'Panruti', scheduleId: 'sch-04', parent: parents[3] },
  { id: 'stu-05', role: 'student', name: 'Sree Samaya', email: 'samaya.s@ckcet.ac.in', phone: '+91 90000 55555', registerNo: 'CKCET22CS067', department: 'Computer Science & Engineering', year: 2, section: 'A', busId: 'CKCET-02', routeId: 'route-02', pickupStop: 'Panruti', dropStop: 'Semmandalam', scheduleId: 'sch-02', parent: parents[1] },
  { id: 'stu-06', role: 'student', name: 'V. Karthik', email: 'karthik.v@ckcet.ac.in', phone: '+91 90000 66666', registerNo: 'CKCET21EC089', department: 'Electronics & Communication Engineering', year: 3, section: 'A', busId: 'CKCET-01', routeId: 'route-01', pickupStop: 'Cuddalore New Bus Stand', dropStop: 'Thirupapuliyur', scheduleId: 'sch-01', parent: parents[0] },
];

export const admin: Admin = {
  id: 'adm-01', role: 'admin', name: 'Dr. V. Anand', email: 'anand.v@ckcet.ac.in', phone: '+91 4142 220 100', staffId: 'CKCET-TO-001', designation: 'Transport Officer',
};

export const attendance: AttendanceRecord[] = [
  { id: 'att-01', studentId: 'stu-01', studentName: 'S. Kavin', registerNo: 'CKCET21CS045', busId: 'CKCET-01', date: '2026-07-27', boardingTime: '07:09', dropTime: null, status: 'present', method: 'qr' },
  { id: 'att-02', studentId: 'stu-01', studentName: 'S. Kavin', registerNo: 'CKCET21CS045', busId: 'CKCET-01', date: '2026-07-26', boardingTime: '07:08', dropTime: '16:42', status: 'present', method: 'qr' },
  { id: 'att-03', studentId: 'stu-01', studentName: 'S. Kavin', registerNo: 'CKCET21CS045', busId: 'CKCET-01', date: '2026-07-25', boardingTime: '07:10', dropTime: '16:38', status: 'present', method: 'qr' },
  { id: 'att-04', studentId: 'stu-01', studentName: 'S. Kavin', registerNo: 'CKCET21CS045', busId: 'CKCET-01', date: '2026-07-24', boardingTime: null, dropTime: null, status: 'absent', method: 'manual' },
  { id: 'att-05', studentId: 'stu-01', studentName: 'S. Kavin', registerNo: 'CKCET21CS045', busId: 'CKCET-01', date: '2026-07-23', boardingTime: '07:07', dropTime: '16:45', status: 'present', method: 'qr' },
  { id: 'att-06', studentId: 'stu-05', studentName: 'Sree Samaya', registerNo: 'CKCET22CS067', busId: 'CKCET-02', date: '2026-07-27', boardingTime: '06:48', dropTime: null, status: 'present', method: 'qr' },
  { id: 'att-07', studentId: 'stu-02', studentName: 'R. Divya', registerNo: 'CKCET22EC012', busId: 'CKCET-02', date: '2026-07-27', boardingTime: '06:50', dropTime: null, status: 'present', method: 'qr' },
];

export const complaints: Complaint[] = [
  { id: 'cmp-01', studentId: 'stu-01', studentName: 'S. Kavin', category: 'Delay', subject: 'Bus arrived 20 minutes late', description: 'CKCET-01 was delayed on Monday morning without prior notification.', status: 'in-progress', priority: 'high', createdAt: '2026-07-22' },
  { id: 'cmp-02', studentId: 'stu-01', studentName: 'S. Kavin', category: 'Cleanliness', subject: 'Seats need cleaning', description: 'Last row seats were not cleaned last week.', status: 'resolved', priority: 'low', createdAt: '2026-07-15', resolvedAt: '2026-07-17', response: 'Cleaning schedule updated. Thank you for reporting.' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'lv-01', studentId: 'stu-01', studentName: 'S. Kavin', fromDate: '2026-07-30', toDate: '2026-07-31', reason: 'Family function out of town', type: 'personal', status: 'pending', createdAt: '2026-07-26' },
  { id: 'lv-02', studentId: 'stu-01', studentName: 'S. Kavin', fromDate: '2026-07-12', toDate: '2026-07-12', reason: 'Fever and medical rest', type: 'sick', status: 'approved', createdAt: '2026-07-11', reviewedBy: 'Dr. V. Anand' },
];

export const announcements: Announcement[] = [
  { id: 'ann-01', title: 'Route A timing change from August 1', message: 'CKCET-01 morning pickup shifted 10 minutes earlier for Route A students.', type: 'route-change', audience: 'student', createdAt: '2026-07-25', createdBy: 'Dr. V. Anand' },
  { id: 'ann-02', title: 'Heavy rain advisory', message: 'Expect 10-15 min delays across all routes due to heavy rain in Cuddalore.', type: 'warning', audience: 'all', createdAt: '2026-07-24', createdBy: 'Transport Office' },
  { id: 'ann-03', title: 'Emergency drill on Friday', message: 'A transport safety drill will be conducted on Friday at 15:30.', type: 'emergency', audience: 'all', createdAt: '2026-07-23', createdBy: 'Dr. V. Anand' },
];

export const emergencyContacts: EmergencyContact[] = [
  { id: 'ec-01', name: 'Transport Office', role: 'Office', phone: '+91 4142 220 100', available: true },
  { id: 'ec-02', name: 'Campus Security', role: 'Security', phone: '+91 4142 220 911', available: true },
  { id: 'ec-03', name: 'R. Senthil Kumar (Driver)', role: 'Driver', phone: '+91 98765 43210', available: true },
  { id: 'ec-04', name: 'Ambulance', role: 'Medical', phone: '108', available: true },
];

export const notifications: Notification[] = [
  { id: 'n-01', title: 'Bus approaching your stop', message: 'CKCET-01 will reach Manjakuppam in 4 minutes.', type: 'info', read: false, createdAt: '2026-07-27T06:56:00', audience: 'student' },
  { id: 'n-02', title: 'Delay predicted', message: 'AI predicts a 6-min delay for your route today.', type: 'warning', read: false, createdAt: '2026-07-27T06:40:00', audience: 'all' },
  { id: 'n-03', title: 'Leave approved', message: 'Your sick leave for Jul 12 was approved.', type: 'leave', read: true, createdAt: '2026-07-11T10:20:00', audience: 'student' },
  { id: 'n-04', title: 'Complaint resolved', message: 'Your complaint about seat cleanliness has been resolved.', type: 'complaint', read: false, createdAt: '2026-07-17T14:00:00', audience: 'student' },
  { id: 'n-05', title: 'Route change announced', message: 'Route A pickup times changed from August 1. Check the announcements page.', type: 'route-change', read: false, createdAt: '2026-07-25T09:00:00', audience: 'student' },
  { id: 'n-06', title: 'Child boarded bus', message: 'S. Kavin boarded CKCET-01 at Manjakuppam at 07:09 AM.', type: 'success', read: true, createdAt: '2026-07-27T07:09:00', audience: 'parent' },
  { id: 'n-07', title: 'Bus delayed', message: 'CKCET-02 is running 6 minutes late due to traffic at Kurinjipadi.', type: 'warning', read: false, createdAt: '2026-07-27T07:05:00', audience: 'all' },
  { id: 'n-08', title: 'Emergency drill notice', message: 'Transport safety drill scheduled for Friday at 15:30.', type: 'emergency', read: true, createdAt: '2026-07-23T11:00:00', audience: 'all' },
  { id: 'n-09', title: 'Schedule Updated', message: 'Your bus pickup time has changed from 7:45 AM to 7:55 AM for Semmandalam stop.', type: 'route-change', read: false, createdAt: '2026-07-27T05:30:00', audience: 'student' },
  { id: 'n-10', title: 'Bus Delay', message: 'CKCET-02 is delayed by 10 minutes due to traffic at Kurinjipadi.', type: 'warning', read: false, createdAt: '2026-07-27T07:10:00', audience: 'all' },
  { id: 'n-11', title: 'Driver Change', message: 'Your assigned driver has been changed. S. Murugan will now drive CKCET-04 for today.', type: 'info', read: false, createdAt: '2026-07-27T06:00:00', audience: 'student' },
  { id: 'n-12', title: 'Child schedule updated', message: 'S. Kavin pickup time changed to 7:10 AM at Manjakuppam. Bus will wait 3 minutes.', type: 'route-change', read: false, createdAt: '2026-07-27T05:35:00', audience: 'parent' },
];

export const chatMessages: ChatMessage[] = [
  { id: 'm-01', sender: 'office', text: 'Hello Kavin, how can we help you today?', createdAt: '2026-07-27T09:00:00' },
  { id: 'm-02', sender: 'student', text: 'My bus was late yesterday, can I get an update?', createdAt: '2026-07-27T09:02:00' },
  { id: 'm-03', sender: 'office', text: 'Apologies for the inconvenience. There was a traffic diversion. Today the route is on schedule.', createdAt: '2026-07-27T09:05:00' },
];

export const ratings: Rating[] = [
  { id: 'r-01', studentId: 'stu-01', studentName: 'S. Kavin', targetType: 'driver', targetId: 'drv-01', targetName: 'R. Senthil Kumar', stars: 5, comment: 'Very punctual and friendly driver.', createdAt: '2026-07-20' },
  { id: 'r-02', studentId: 'stu-01', studentName: 'S. Kavin', targetType: 'bus', targetId: 'CKCET-01', targetName: 'CKCET-01', stars: 4, comment: 'Bus is comfortable but AC could be cooler.', createdAt: '2026-07-18' },
];

export const calendarEvents: CalendarEvent[] = [
  { id: 'cal-01', title: 'Independence Day Holiday', date: '2026-08-15', type: 'holiday', description: 'No transport services on Independence Day.' },
  { id: 'cal-02', title: 'Semester Exam — Special Buses', date: '2026-08-05', type: 'exam-bus', description: 'Additional buses scheduled for exam days.' },
  { id: 'cal-03', title: 'CKCET-04 Maintenance', date: '2026-07-28', type: 'maintenance', description: 'Engine servicing and tyre check.' },
  { id: 'cal-04', title: 'Industrial Visit Special Transport', date: '2026-08-10', type: 'special', description: 'Special buses arranged for III-year CSE visit.' },
];

export const weeklyAttendance = [
  { day: 'Mon', present: 142, absent: 8 }, { day: 'Tue', present: 138, absent: 12 },
  { day: 'Wed', present: 145, absent: 5 }, { day: 'Thu', present: 140, absent: 10 },
  { day: 'Fri', present: 130, absent: 20 }, { day: 'Sat', present: 90, absent: 60 },
];

export const routePerformance = [
  { route: 'Route A', onTime: 92, delayed: 8 }, { route: 'Route B', onTime: 78, delayed: 22 },
  { route: 'Route C', onTime: 85, delayed: 15 }, { route: 'Route D', onTime: 70, delayed: 30 },
];

export const monthlyTrend = [
  { month: 'Feb', trips: 420, complaints: 12 }, { month: 'Mar', trips: 460, complaints: 9 },
  { month: 'Apr', trips: 440, complaints: 14 }, { month: 'May', trips: 380, complaints: 7 },
  { month: 'Jun', trips: 470, complaints: 11 }, { month: 'Jul', trips: 488, complaints: 8 },
];

export const aiInsights: AIInsight[] = [
  { id: 'ai-01', title: 'Route B recurring delay', insight: 'CKCET-02 has been delayed 4 of the last 7 days at Kurinjipadi junction. Consider shifting pickup 8 minutes earlier.', severity: 'high' },
  { id: 'ai-02', title: 'Attendance dip on Saturdays', insight: 'Saturday attendance dropped 38% this month. Recommend reviewing weekend schedule demand.', severity: 'medium' },
  { id: 'ai-03', title: 'Driver performance leader', insight: 'M. Arumugam maintains 4.9 rating with 99% on-time record. Consider recognition.', severity: 'low' },
];

export const schedules: Schedule[] = [
  { id: 'sch-01', driverId: 'drv-01', driverName: 'R. Senthil Kumar', busId: 'CKCET-01', routeId: 'route-01', routeName: 'Route A — Cuddalore City Loop', shift: 'morning', startTime: '07:00', endTime: '08:30', date: '2026-07-28', hasConflict: false },
  { id: 'sch-02', driverId: 'drv-02', driverName: 'M. Arumugam', busId: 'CKCET-02', routeId: 'route-02', routeName: 'Route B — Panruti Express', shift: 'morning', startTime: '06:45', endTime: '08:15', date: '2026-07-28', hasConflict: false },
  { id: 'sch-03', driverId: 'drv-03', driverName: 'P. Mohanraj', busId: 'CKCET-03', routeId: 'route-03', routeName: 'Route C — Neyveli Line', shift: 'morning', startTime: '06:30', endTime: '08:00', date: '2026-07-28', hasConflict: false },
  { id: 'sch-04', driverId: 'drv-05', driverName: 'S. Murugan (Substitute)', busId: 'CKCET-04', routeId: 'route-04', routeName: 'Route D — Chidambaram Coastal', shift: 'morning', startTime: '06:15', endTime: '07:50', date: '2026-07-28', substituteDriverId: 'drv-05', substituteDriverName: 'S. Murugan', hasConflict: false },
  { id: 'sch-05', driverId: 'drv-01', driverName: 'R. Senthil Kumar', busId: 'CKCET-01', routeId: 'route-01', routeName: 'Route A — Cuddalore City Loop', shift: 'evening', startTime: '16:30', endTime: '18:00', date: '2026-07-28', hasConflict: false },
  { id: 'sch-06', driverId: 'drv-02', driverName: 'M. Arumugam', busId: 'CKCET-02', routeId: 'route-02', routeName: 'Route B — Panruti Express', shift: 'evening', startTime: '16:15', endTime: '17:45', date: '2026-07-28', hasConflict: false },
  { id: 'sch-07', driverId: 'drv-03', driverName: 'P. Mohanraj', busId: 'CKCET-03', routeId: 'route-03', routeName: 'Route C — Neyveli Line', shift: 'evening', startTime: '16:00', endTime: '17:30', date: '2026-07-28', hasConflict: false },
  { id: 'sch-08', driverId: 'drv-05', driverName: 'S. Murugan (Substitute)', busId: 'CKCET-04', routeId: 'route-04', routeName: 'Route D — Chidambaram Coastal', shift: 'evening', startTime: '15:45', endTime: '17:15', date: '2026-07-28', substituteDriverId: 'drv-05', substituteDriverName: 'S. Murugan', hasConflict: false },
];

export const journeyEvents: JourneyEvent[] = [
  { id: 'je-01', time: '06:50', title: 'Left Home', description: 'Walking to pickup stop', status: 'done', icon: 'home' },
  { id: 'je-02', time: '07:05', title: 'Pickup Confirmed', description: 'Arrived at Manjakuppam stop', status: 'done', icon: 'pickup' },
  { id: 'je-03', time: '07:09', title: 'Boarded Bus', description: 'QR scanned on CKCET-01', status: 'done', icon: 'boarded' },
  { id: 'je-04', time: '07:09', title: 'Journey Started', description: 'Bus departed from pickup stop', status: 'active', icon: 'transit' },
  { id: 'je-05', time: '07:45', title: 'Reached College', description: 'Arriving at CKCET campus', status: 'upcoming', icon: 'campus' },
  { id: 'je-06', time: '16:30', title: 'Return Journey', description: 'Evening trip starts from campus', status: 'upcoming', icon: 'return' },
  { id: 'je-07', time: '16:40', title: 'Reached Home', description: 'Drop at Semmandalam', status: 'upcoming', icon: 'drop' },
];

export const dailyOperations: DailyOperation[] = [
  { id: 'op-01', phase: 'morning-prep', label: 'Morning Fleet Preparation', description: 'Admin prepares fleet, assigns drivers and activates buses', status: 'done', time: '05:30' },
  { id: 'op-02', phase: 'morning-boarding', label: 'Student Boarding', description: 'Students board at assigned stops, QR attendance collected', status: 'done', time: '06:15' },
  { id: 'op-03', phase: 'morning-transit', label: 'Morning Transit', description: 'Buses en route to campus with live monitoring active', status: 'active', time: '06:45' },
  { id: 'op-04', phase: 'college-hours', label: 'College Hours', description: 'Students on campus, buses idle for maintenance', status: 'upcoming', time: '08:30' },
  { id: 'op-05', phase: 'evening-boarding', label: 'Evening Boarding', description: 'Students board for return trip', status: 'upcoming', time: '16:15' },
  { id: 'op-06', phase: 'evening-transit', label: 'Evening Transit', description: 'Return trip with live monitoring and parent notifications', status: 'upcoming', time: '16:30' },
  { id: 'op-07', phase: 'completed', label: 'Daily Report', description: 'Daily transport report generated and archived', status: 'upcoming', time: '18:00' },
];

export const driverAvailability: DriverAvailability[] = [
  { driverId: 'drv-01', driverName: 'R. Senthil Kumar', status: 'assigned', assignedBusId: 'CKCET-01', assignedRoute: 'Route A — Cuddalore City Loop', todaySchedule: 'Morning 07:00-08:30, Evening 16:30-18:00', rating: 4.7, experienceYears: 9, phone: '+91 98765 43210', licenseNo: 'TN-CDL-2021001234' },
  { driverId: 'drv-02', driverName: 'M. Arumugam', status: 'assigned', assignedBusId: 'CKCET-02', assignedRoute: 'Route B — Panruti Express', todaySchedule: 'Morning 06:45-08:15, Evening 16:15-17:45', rating: 4.9, experienceYears: 12, phone: '+91 98765 43211', licenseNo: 'TN-CDL-2021001567' },
  { driverId: 'drv-03', driverName: 'P. Mohanraj', status: 'assigned', assignedBusId: 'CKCET-03', assignedRoute: 'Route C — Neyveli Line', todaySchedule: 'Morning 06:30-08:00, Evening 16:00-17:30', rating: 4.5, experienceYears: 7, phone: '+91 98765 43212', licenseNo: 'TN-CDL-2021001890' },
  { driverId: 'drv-04', driverName: 'K. Baskar', status: 'on-leave', rating: 4.8, experienceYears: 15, phone: '+91 98765 43213', licenseNo: 'TN-CDL-2021002112' },
  { driverId: 'drv-05', driverName: 'S. Murugan', status: 'available', todaySchedule: 'Substitute for CKCET-04 (K. Baskar on leave)', rating: 4.3, experienceYears: 5, phone: '+91 98765 43214', licenseNo: 'TN-CDL-2021002345' },
  { driverId: 'drv-06', driverName: 'T. Ramesh Kumar', status: 'available', rating: 4.6, experienceYears: 8, phone: '+91 98765 43215', licenseNo: 'TN-CDL-2021002567' },
];

export const initialDailyAssignments: DailyTransportAssignment[] = [
  { id: 'da-01', date: '2026-07-28', busId: 'CKCET-01', driverId: 'drv-01', driverName: 'R. Senthil Kumar', routeId: 'route-01', routeName: 'Route A — Cuddalore City Loop', morningShift: { startTime: '07:00', endTime: '08:15', collegeArrival: '08:15' }, eveningShift: { startTime: '16:30', endTime: '17:30', collegeDeparture: '16:30' }, pickupTime: '07:10', dropTime: '17:15', status: 'on-time', leaveApproved: false, studentCount: 14 },
  { id: 'da-02', date: '2026-07-28', busId: 'CKCET-02', driverId: 'drv-02', driverName: 'M. Arumugam', routeId: 'route-02', routeName: 'Route B — Panruti Express', morningShift: { startTime: '06:45', endTime: '08:20', collegeArrival: '08:20' }, eveningShift: { startTime: '16:40', endTime: '17:45', collegeDeparture: '16:40' }, pickupTime: '07:15', dropTime: '17:45', status: 'delayed', leaveApproved: false, studentCount: 22 },
  { id: 'da-03', date: '2026-07-28', busId: 'CKCET-03', driverId: 'drv-03', driverName: 'P. Mohanraj', routeId: 'route-03', routeName: 'Route C — Neyveli Line', morningShift: { startTime: '06:30', endTime: '08:10', collegeArrival: '08:10' }, eveningShift: { startTime: '16:30', endTime: '17:40', collegeDeparture: '16:30' }, pickupTime: '06:30', dropTime: '17:40', status: 'on-time', leaveApproved: false, studentCount: 26 },
  { id: 'da-04', date: '2026-07-28', busId: 'CKCET-04', driverId: 'drv-04', driverName: 'K. Baskar (On Leave)', replacementDriverId: 'drv-05', replacementDriverName: 'S. Murugan', routeId: 'route-04', routeName: 'Route D — Chidambaram Coastal', morningShift: { startTime: '06:15', endTime: '08:25', collegeArrival: '08:25' }, eveningShift: { startTime: '16:40', endTime: '18:00', collegeDeparture: '16:40' }, pickupTime: '06:15', dropTime: '18:00', status: 'on-time', leaveApproved: true, studentCount: 25 },
];

export const transportTimetables: TransportTimetable[] = [
  { id: 'tt-01', busId: 'CKCET-01', routeId: 'route-01', routeName: 'Route A — Cuddalore City Loop', shift: 'morning', collegeArrival: '08:15', collegeDeparture: '16:30', stops: [
    { stopName: 'Cuddalore New Bus Stand', sequence: 0, arrivalTime: '07:00', departureTime: '07:05', waitingDuration: 5, studentsBoarding: 8, isCampus: false },
    { stopName: 'Manjakuppam', sequence: 1, arrivalTime: '07:10', departureTime: '07:13', waitingDuration: 3, studentsBoarding: 6, isCampus: false },
    { stopName: 'Thirupapuliyur', sequence: 2, arrivalTime: '07:18', departureTime: '07:21', waitingDuration: 3, studentsBoarding: 5, isCampus: false },
    { stopName: 'Semmandalam', sequence: 3, arrivalTime: '07:26', departureTime: '07:31', waitingDuration: 5, studentsBoarding: 4, isCampus: false },
    { stopName: 'CKCET Campus', sequence: 4, arrivalTime: '08:15', departureTime: '08:15', waitingDuration: 0, studentsBoarding: 0, isCampus: true },
  ]},
  { id: 'tt-02', busId: 'CKCET-02', routeId: 'route-02', routeName: 'Route B — Panruti Express', shift: 'morning', collegeArrival: '08:20', collegeDeparture: '16:40', stops: [
    { stopName: 'Panruti', sequence: 0, arrivalTime: '07:15', departureTime: '07:20', waitingDuration: 5, studentsBoarding: 10, isCampus: false },
    { stopName: 'Kurinjipadi', sequence: 1, arrivalTime: '07:35', departureTime: '07:38', waitingDuration: 3, studentsBoarding: 7, isCampus: false },
    { stopName: 'Semmandalam', sequence: 2, arrivalTime: '07:55', departureTime: '08:00', waitingDuration: 5, studentsBoarding: 5, isCampus: false },
    { stopName: 'CKCET Campus', sequence: 3, arrivalTime: '08:20', departureTime: '08:20', waitingDuration: 0, studentsBoarding: 0, isCampus: true },
  ]},
  { id: 'tt-03', busId: 'CKCET-03', routeId: 'route-03', routeName: 'Route C — Neyveli Line', shift: 'morning', collegeArrival: '08:10', collegeDeparture: '16:30', stops: [
    { stopName: 'Neyveli', sequence: 0, arrivalTime: '06:30', departureTime: '06:35', waitingDuration: 5, studentsBoarding: 12, isCampus: false },
    { stopName: 'Vadalur', sequence: 1, arrivalTime: '06:50', departureTime: '06:53', waitingDuration: 3, studentsBoarding: 8, isCampus: false },
    { stopName: 'Kurinjipadi', sequence: 2, arrivalTime: '07:15', departureTime: '07:18', waitingDuration: 3, studentsBoarding: 6, isCampus: false },
    { stopName: 'CKCET Campus', sequence: 3, arrivalTime: '08:10', departureTime: '08:10', waitingDuration: 0, studentsBoarding: 0, isCampus: true },
  ]},
  { id: 'tt-04', busId: 'CKCET-04', routeId: 'route-04', routeName: 'Route D — Chidambaram Coastal', shift: 'morning', collegeArrival: '08:25', collegeDeparture: '16:40', stops: [
    { stopName: 'Chidambaram', sequence: 0, arrivalTime: '06:15', departureTime: '06:20', waitingDuration: 5, studentsBoarding: 14, isCampus: false },
    { stopName: 'Vadalur', sequence: 1, arrivalTime: '06:45', departureTime: '06:48', waitingDuration: 3, studentsBoarding: 5, isCampus: false },
    { stopName: 'Panruti', sequence: 2, arrivalTime: '07:10', departureTime: '07:15', waitingDuration: 5, studentsBoarding: 6, isCampus: false },
    { stopName: 'CKCET Campus', sequence: 3, arrivalTime: '08:25', departureTime: '08:25', waitingDuration: 0, studentsBoarding: 0, isCampus: true },
  ]},
  { id: 'tt-01e', busId: 'CKCET-01', routeId: 'route-01', routeName: 'Route A — Cuddalore City Loop', shift: 'evening', collegeArrival: '08:15', collegeDeparture: '16:30', stops: [
    { stopName: 'CKCET Campus', sequence: 0, arrivalTime: '16:30', departureTime: '16:35', waitingDuration: 5, studentsBoarding: 23, isCampus: true },
    { stopName: 'Semmandalam', sequence: 1, arrivalTime: '16:50', departureTime: '16:53', waitingDuration: 3, studentsBoarding: 4, isCampus: false },
    { stopName: 'Thirupapuliyur', sequence: 2, arrivalTime: '17:05', departureTime: '17:08', waitingDuration: 3, studentsBoarding: 5, isCampus: false },
    { stopName: 'Manjakuppam', sequence: 3, arrivalTime: '17:15', departureTime: '17:20', waitingDuration: 5, studentsBoarding: 6, isCampus: false },
    { stopName: 'Cuddalore New Bus Stand', sequence: 4, arrivalTime: '17:30', departureTime: '17:30', waitingDuration: 0, studentsBoarding: 8, isCampus: false },
  ]},
  { id: 'tt-02e', busId: 'CKCET-02', routeId: 'route-02', routeName: 'Route B — Panruti Express', shift: 'evening', collegeArrival: '08:20', collegeDeparture: '16:40', stops: [
    { stopName: 'CKCET Campus', sequence: 0, arrivalTime: '16:40', departureTime: '16:45', waitingDuration: 5, studentsBoarding: 28, isCampus: true },
    { stopName: 'Semmandalam', sequence: 1, arrivalTime: '17:00', departureTime: '17:03', waitingDuration: 3, studentsBoarding: 5, isCampus: false },
    { stopName: 'Kurinjipadi', sequence: 2, arrivalTime: '17:20', departureTime: '17:23', waitingDuration: 3, studentsBoarding: 7, isCampus: false },
    { stopName: 'Panruti', sequence: 3, arrivalTime: '17:45', departureTime: '17:45', waitingDuration: 0, studentsBoarding: 10, isCampus: false },
  ]},
  { id: 'tt-03e', busId: 'CKCET-03', routeId: 'route-03', routeName: 'Route C — Neyveli Line', shift: 'evening', collegeArrival: '08:10', collegeDeparture: '16:30', stops: [
    { stopName: 'CKCET Campus', sequence: 0, arrivalTime: '16:30', departureTime: '16:35', waitingDuration: 5, studentsBoarding: 26, isCampus: true },
    { stopName: 'Kurinjipadi', sequence: 1, arrivalTime: '16:55', departureTime: '16:58', waitingDuration: 3, studentsBoarding: 6, isCampus: false },
    { stopName: 'Vadalur', sequence: 2, arrivalTime: '17:15', departureTime: '17:18', waitingDuration: 3, studentsBoarding: 8, isCampus: false },
    { stopName: 'Neyveli', sequence: 3, arrivalTime: '17:40', departureTime: '17:40', waitingDuration: 0, studentsBoarding: 12, isCampus: false },
  ]},
  { id: 'tt-04e', busId: 'CKCET-04', routeId: 'route-04', routeName: 'Route D — Chidambaram Coastal', shift: 'evening', collegeArrival: '08:25', collegeDeparture: '16:40', stops: [
    { stopName: 'CKCET Campus', sequence: 0, arrivalTime: '16:40', departureTime: '16:45', waitingDuration: 5, studentsBoarding: 25, isCampus: true },
    { stopName: 'Panruti', sequence: 1, arrivalTime: '17:10', departureTime: '17:13', waitingDuration: 3, studentsBoarding: 6, isCampus: false },
    { stopName: 'Vadalur', sequence: 2, arrivalTime: '17:35', departureTime: '17:38', waitingDuration: 3, studentsBoarding: 5, isCampus: false },
    { stopName: 'Chidambaram', sequence: 3, arrivalTime: '18:00', departureTime: '18:00', waitingDuration: 0, studentsBoarding: 14, isCampus: false },
  ]},
];
