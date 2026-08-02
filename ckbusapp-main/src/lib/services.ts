import {
  students, parents, drivers, admin, buses, routes, attendance,
  complaints, leaveRequests, announcements, emergencyContacts,
  notifications, chatMessages, ratings, calendarEvents,
  weeklyAttendance, routePerformance, monthlyTrend, aiInsights,
  schedules, journeyEvents, dailyOperations, driverAvailability,
  transportTimetables,
} from './dummyData';
import type {
  Student, Parent, Driver, Admin, Bus, Route, AttendanceRecord,
  Complaint, LeaveRequest, Announcement, EmergencyContact,
  Notification, ChatMessage, Rating, CalendarEvent, AIInsight, UserRole,
  Schedule, JourneyEvent, DailyOperation, DriverAvailability,
  TransportTimetable, StopSchedule, StudentScheduleView, ParentScheduleView, DriverScheduleView, ScheduleStatus,
  DailyTransportAssignment, JourneyPhase,
} from './types';
import { useDailyAssignmentStore } from '@/store/dailyAssignmentStore';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function withSim<T>(data: T, ms = 350): Promise<T> {
  await delay(ms);
  return structuredClone(data);
}

export const authService = {
  async login(role: UserRole, email: string) {
    await delay(500);
    const user = { student: students[0], parent: parents[0], driver: drivers[0], admin }[role];
    if (!user || !email) throw new Error('Invalid credentials');
    return user;
  },
};

export const studentService = {
  list: () => withSim(students),
  get: (id: string) => withSim(students.find((s) => s.id === id) ?? students[0]),
  me: () => withSim(students[0]),
  forBus: (busId: string) => withSim(students.filter((s) => s.busId === busId)),
  forRoute: (routeId: string) => withSim(students.filter((s) => s.routeId === routeId)),
  async create(payload: Partial<Student>) {
    await delay(400);
    const s: Student = { id: `stu-${Date.now()}`, role: 'student', name: payload.name ?? '', email: payload.email ?? '', phone: payload.phone ?? '', registerNo: payload.registerNo ?? '', department: payload.department ?? '', year: payload.year ?? 1, section: payload.section ?? 'A', busId: payload.busId ?? '', routeId: payload.routeId ?? '', pickupStop: payload.pickupStop ?? '', dropStop: payload.dropStop ?? '', scheduleId: payload.scheduleId ?? '', parent: payload.parent ?? parents[0] };
    students.push(s); return s;
  },
};
export const parentService = {
  list: () => withSim(parents),
  me: () => withSim(parents[0]),
  get: (id: string) => withSim(parents.find((p) => p.id === id) ?? parents[0]),
};
export const driverService = {
  list: () => withSim(drivers),
  get: (id: string) => withSim(drivers.find((d) => d.id === id) ?? drivers[0]),
  me: () => withSim(drivers[0]),
  availability: () => withSim(driverAvailability),
};
export const adminService = { me: () => withSim(admin) };
export const busService = {
  list: () => withSim(buses),
  get: (id: string) => withSim(buses.find((b) => b.id === id) ?? buses[0]),
  async updateLocation(id: string, speed: number, progress: number, currentStop: string, nextStop: string) {
    await delay(100);
    const bus = buses.find((b) => b.id === id);
    if (bus) { bus.speed = speed; bus.progress = progress; bus.currentStop = currentStop; bus.nextStop = nextStop; bus.lastUpdated = new Date().toISOString(); }
    return structuredClone(bus ?? buses[0]);
  },
};
export const routeService = {
  list: () => withSim(routes),
  get: (id: string) => withSim(routes.find((r) => r.id === id) ?? routes[0]),
  stops: (routeId: string) => withSim((routes.find((r) => r.id === routeId) ?? routes[0]).stops),
};
export const attendanceService = {
  forStudent: (id: string) => withSim(attendance.filter((a) => a.studentId === id)),
  forBus: (busId: string) => withSim(attendance.filter((a) => a.busId === busId)),
  all: () => withSim(attendance),
};
export const complaintService = {
  forStudent: (id: string) => withSim(complaints.filter((c) => c.studentId === id)),
  all: () => withSim(complaints),
  async create(payload: Partial<Complaint>) {
    await delay(400);
    const c: Complaint = { id: `cmp-${Date.now()}`, studentId: payload.studentId ?? 'stu-01', studentName: payload.studentName ?? 'S. Kavin', category: payload.category ?? 'General', subject: payload.subject ?? '', description: payload.description ?? '', status: 'open', priority: payload.priority ?? 'medium', createdAt: new Date().toISOString().slice(0, 10) };
    complaints.unshift(c); return c;
  },
  async resolve(id: string, response: string) {
    await delay(300);
    const c = complaints.find((x) => x.id === id);
    if (c) { c.status = 'resolved'; c.response = response; c.resolvedAt = new Date().toISOString().slice(0, 10); }
    return c;
  },
};
export const leaveService = {
  forStudent: (id: string) => withSim(leaveRequests.filter((l) => l.studentId === id)),
  all: () => withSim(leaveRequests),
  async create(payload: Partial<LeaveRequest>) {
    await delay(400);
    const l: LeaveRequest = { id: `lv-${Date.now()}`, studentId: payload.studentId ?? 'stu-01', studentName: payload.studentName ?? 'S. Kavin', fromDate: payload.fromDate ?? '', toDate: payload.toDate ?? '', reason: payload.reason ?? '', type: payload.type ?? 'personal', status: 'pending', createdAt: new Date().toISOString().slice(0, 10) };
    leaveRequests.unshift(l); return l;
  },
  async approve(id: string, reviewedBy: string) {
    await delay(300);
    const l = leaveRequests.find((x) => x.id === id);
    if (l) { l.status = 'approved'; l.reviewedBy = reviewedBy; }
    return l;
  },
  async reject(id: string, reviewedBy: string) {
    await delay(300);
    const l = leaveRequests.find((x) => x.id === id);
    if (l) { l.status = 'rejected'; l.reviewedBy = reviewedBy; }
    return l;
  },
};
export const announcementService = {
  list: () => withSim(announcements),
  async create(payload: Partial<Announcement>) {
    await delay(400);
    const a: Announcement = { id: `ann-${Date.now()}`, title: payload.title ?? '', message: payload.message ?? '', type: payload.type ?? 'info', audience: payload.audience ?? 'all', createdAt: new Date().toISOString().slice(0, 10), createdBy: payload.createdBy ?? 'Dr. V. Anand' };
    announcements.unshift(a); return a;
  },
};
export const emergencyService = { list: () => withSim(emergencyContacts) };
export const notificationService = {
  list: () => withSim(notifications),
  forRole: (role: UserRole) => withSim(notifications.filter((n) => n.audience === 'all' || n.audience === role)),
};
export const chatService = {
  history: () => withSim(chatMessages),
  async send(text: string) {
    await delay(300);
    const m: ChatMessage = { id: `m-${Date.now()}`, sender: 'student', text, createdAt: new Date().toISOString() };
    chatMessages.push(m); return m;
  },
};
export const ratingService = {
  forStudent: (id: string) => withSim(ratings.filter((r) => r.studentId === id)),
  all: () => withSim(ratings),
  async create(payload: Partial<Rating>) {
    await delay(400);
    const r: Rating = { id: `r-${Date.now()}`, studentId: payload.studentId ?? 'stu-01', studentName: payload.studentName ?? 'S. Kavin', targetType: payload.targetType ?? 'driver', targetId: payload.targetId ?? '', targetName: payload.targetName ?? '', stars: payload.stars ?? 5, comment: payload.comment ?? '', createdAt: new Date().toISOString().slice(0, 10) };
    ratings.unshift(r); return r;
  },
};
export const calendarService = { list: () => withSim(calendarEvents) };
export const analyticsService = {
  weeklyAttendance: () => withSim(weeklyAttendance),
  routePerformance: () => withSim(routePerformance),
  monthlyTrend: () => withSim(monthlyTrend),
  aiInsights: () => withSim(aiInsights),
};
export const journeyService = {
  async current(busId: string) {
    await delay(250);
    const bus = buses.find((b) => b.id === busId) ?? buses[0];
    return { busId: bus.id, status: bus.status === 'maintenance' ? 'not-started' : 'in-transit', progress: bus.progress, etaSeconds: bus.etaMinutes * 60, delayMinutes: bus.status === 'delayed' ? 6 : 0, aiDelayPrediction: 4, speed: bus.speed, currentStop: bus.currentStop, nextStop: bus.nextStop, lastUpdated: bus.lastUpdated };
  },
  events: () => withSim(journeyEvents),
  operations: () => withSim(dailyOperations),
};
export const scheduleService = {
  list: () => withSim(schedules),
  forDate: (date: string) => withSim(schedules.filter((s) => s.date === date)),
  forDriver: (driverId: string) => withSim(schedules.filter((s) => s.driverId === driverId)),
  forBus: (busId: string) => withSim(schedules.filter((s) => s.busId === busId)),
  async create(payload: Partial<Schedule>) {
    await delay(400);
    const conflicts = schedules.filter((s) => s.driverId === payload.driverId && s.date === (payload.date ?? '2026-07-28') && s.shift === payload.shift);
    const s: Schedule = { id: `sch-${Date.now()}`, driverId: payload.driverId ?? '', driverName: payload.driverName ?? '', busId: payload.busId ?? '', routeId: payload.routeId ?? '', routeName: payload.routeName ?? '', shift: payload.shift ?? 'morning', startTime: payload.startTime ?? '', endTime: payload.endTime ?? '', date: payload.date ?? '2026-07-28', hasConflict: conflicts.length > 0 };
    schedules.push(s); return s;
  },
  async delete(id: string) {
    await delay(200);
    const idx = schedules.findIndex((s) => s.id === id);
    if (idx >= 0) schedules.splice(idx, 1);
    return true;
  },
  checkConflict: (driverId: string, date: string, shift: string) => {
    return schedules.filter((s) => s.driverId === driverId && s.date === date && s.shift === shift).length > 0;
  },
};

export const timetableService = {
  list: () => withSim(transportTimetables),
  forBus: (busId: string) => withSim(transportTimetables.filter((t) => t.busId === busId)),
  forRoute: (routeId: string) => withSim(transportTimetables.filter((t) => t.routeId === routeId)),
  morning: () => withSim(transportTimetables.filter((t) => t.shift === 'morning')),
  evening: () => withSim(transportTimetables.filter((t) => t.shift === 'evening')),
  get: (id: string) => withSim(transportTimetables.find((t) => t.id === id) ?? transportTimetables[0]),
  async forStudent(studentId: string) {
    await delay(300);
    const student = students.find((s) => s.id === studentId) ?? students[0];
    const morning = transportTimetables.find((t) => t.busId === student.busId && t.shift === 'morning') ?? transportTimetables[0];
    const evening = transportTimetables.find((t) => t.busId === student.busId && t.shift === 'evening') ?? transportTimetables[1];
    const pickupStopSchedule = morning.stops.find((s) => s.stopName === student.pickupStop);
    const dropStopSchedule = evening.stops.find((s) => s.stopName === student.dropStop);
    const driver = drivers.find((d) => d.id === buses.find((b) => b.id === student.busId)?.driverId) ?? drivers[0];
    const bus = buses.find((b) => b.id === student.busId) ?? buses[0];

    const status: ScheduleStatus = 'arriving-soon';
    const countdownSeconds = 324;
    const statusMessage = 'Bus will wait for 5 minutes at your stop';

    const view: StudentScheduleView = {
      busId: student.busId, busNumber: bus.number, driverName: driver.name, driverPhone: driver.phone,
      routeName: routes.find((r) => r.id === student.routeId)?.name ?? '',
      pickupStop: student.pickupStop,
      pickupArrivalTime: pickupStopSchedule?.arrivalTime ?? '07:00',
      pickupWaitingDuration: pickupStopSchedule?.waitingDuration ?? 5,
      pickupDepartureTime: pickupStopSchedule?.departureTime ?? '07:05',
      collegeArrival: morning.collegeArrival,
      dropStop: student.dropStop,
      dropArrivalTime: dropStopSchedule?.arrivalTime ?? '17:00',
      eveningDeparture: evening.collegeDeparture,
      eveningDropArrival: dropStopSchedule?.arrivalTime ?? '17:30',
      status, countdownSeconds, statusMessage,
    };
    return structuredClone(view);
  },
  async forParent(parentId: string) {
    await delay(300);
    const parent = parents.find((p) => p.id === parentId) ?? parents[0];
    const child = students.find((s) => s.id === parent.childId) ?? students[0];
    const morning = transportTimetables.find((t) => t.busId === child.busId && t.shift === 'morning') ?? transportTimetables[0];
    const evening = transportTimetables.find((t) => t.busId === child.busId && t.shift === 'evening') ?? transportTimetables[1];
    const pickupStopSchedule = morning.stops.find((s) => s.stopName === child.pickupStop);
    const dropStopSchedule = evening.stops.find((s) => s.stopName === child.dropStop);
    const driver = drivers.find((d) => d.id === buses.find((b) => b.id === child.busId)?.driverId) ?? drivers[0];

    const view: ParentScheduleView = {
      childName: child.name, childRegisterNo: child.registerNo,
      busId: child.busId, driverName: driver.name, driverPhone: driver.phone,
      routeName: routes.find((r) => r.id === child.routeId)?.name ?? '',
      pickupStop: child.pickupStop,
      pickupScheduledTime: pickupStopSchedule?.arrivalTime ?? '07:00',
      pickupActualTime: '07:02',
      pickupWaitingDuration: pickupStopSchedule?.waitingDuration ?? 5,
      collegeArrival: morning.collegeArrival,
      collegeArrivalActual: '08:22',
      dropStop: child.dropStop,
      eveningDeparture: evening.collegeDeparture,
      eveningDropArrival: dropStopSchedule?.arrivalTime ?? '17:30',
      pickupStatus: 'completed', arrivalStatus: 'in-progress',
    };
    return structuredClone(view);
  },
  async forDriver(driverId: string) {
    await delay(300);
    const driver = drivers.find((d) => d.id === driverId) ?? drivers[0];
    const bus = buses.find((b) => b.id === driver.busId) ?? buses[0];
    const morning = transportTimetables.find((t) => t.busId === driver.busId && t.shift === 'morning') ?? transportTimetables[0];
    const routeName = routes.find((r) => r.id === driver.routeId)?.name ?? '';
    const driverSchedules = schedules.filter((s) => s.driverId === driverId);
    const morningSched = driverSchedules.find((s) => s.shift === 'morning');

    const view: DriverScheduleView = {
      busId: driver.busId, routeName, shift: 'morning',
      stops: morning.stops,
      startTime: morningSched?.startTime ?? morning.stops[0]?.arrivalTime ?? '07:00',
      endTime: morningSched?.endTime ?? morning.collegeArrival,
      tripStatus: 'in-progress', currentStopIndex: 1,
    };
    return structuredClone(view);
  },
};

export type { Student, Parent, Driver, Admin, Bus, Route, AttendanceRecord, Complaint, LeaveRequest, Announcement, EmergencyContact, Notification, ChatMessage, Rating, CalendarEvent, AIInsight, Schedule, JourneyEvent, DailyOperation, DriverAvailability, TransportTimetable, StopSchedule, StudentScheduleView, ParentScheduleView, DriverScheduleView, ScheduleStatus, DailyTransportAssignment, JourneyPhase };

export const assignmentService = {
  list: () => useDailyAssignmentStore.getState().assignments,
  forBus: (busId: string) => useDailyAssignmentStore.getState().forBus(busId),
  forDriver: (driverId: string) => useDailyAssignmentStore.getState().forDriver(driverId),
  forStudent: (studentId: string) => useDailyAssignmentStore.getState().forStudent(studentId),
  forChild: (childId: string) => useDailyAssignmentStore.getState().forChild(childId),
  getChildPhase: (childId: string): JourneyPhase => useDailyAssignmentStore.getState().childJourneyPhases[childId] ?? 'travelling',
  create: (a: Omit<DailyTransportAssignment, 'id'>) => useDailyAssignmentStore.getState().createAssignment(a),
  update: (id: string, patch: Partial<DailyTransportAssignment>) => useDailyAssignmentStore.getState().updateAssignment(id, patch),
  remove: (id: string) => useDailyAssignmentStore.getState().deleteAssignment(id),
  assignReplacement: (assignmentId: string, driverId: string, driverName: string) =>
    useDailyAssignmentStore.getState().assignReplacementDriver(assignmentId, driverId, driverName),
  approveLeave: (assignmentId: string) => useDailyAssignmentStore.getState().approveDriverLeave(assignmentId),
  setStatus: (id: string, status: DailyTransportAssignment['status']) => useDailyAssignmentStore.getState().setAssignmentStatus(id, status),
  setChildPhase: (childId: string, phase: JourneyPhase) => useDailyAssignmentStore.getState().setChildPhase(childId, phase),
  get lastUpdated() { return useDailyAssignmentStore.getState().lastUpdated; },
};
