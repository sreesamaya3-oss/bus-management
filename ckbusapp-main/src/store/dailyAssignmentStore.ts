import { create } from 'zustand';
import { initialDailyAssignments, students } from '@/lib/dummyData';
import type { DailyTransportAssignment, JourneyPhase } from '@/lib/types';

interface DailyAssignmentState {
  assignments: DailyTransportAssignment[];
  childJourneyPhases: Record<string, JourneyPhase>;
  lastUpdated: string;

  createAssignment: (a: Omit<DailyTransportAssignment, 'id'>) => void;
  updateAssignment: (id: string, patch: Partial<DailyTransportAssignment>) => void;
  deleteAssignment: (id: string) => void;
  assignReplacementDriver: (assignmentId: string, driverId: string, driverName: string) => void;
  approveDriverLeave: (assignmentId: string) => void;
  setAssignmentStatus: (id: string, status: DailyTransportAssignment['status']) => void;
  setChildPhase: (childId: string, phase: JourneyPhase) => void;

  forBus: (busId: string) => DailyTransportAssignment | undefined;
  forDriver: (driverId: string) => DailyTransportAssignment | undefined;
  forStudent: (studentId: string) => DailyTransportAssignment | undefined;
  forChild: (childId: string) => DailyTransportAssignment | undefined;
}

const today = '2026-07-28';

export const useDailyAssignmentStore = create<DailyAssignmentState>((set, get) => ({
  assignments: structuredClone(initialDailyAssignments),
  childJourneyPhases: {},
  lastUpdated: new Date().toISOString(),

  createAssignment: (a) =>
    set((s) => ({
      assignments: [...s.assignments, { ...a, id: `da-${Date.now()}` }],
      lastUpdated: new Date().toISOString(),
    })),

  updateAssignment: (id, patch) =>
    set((s) => ({
      assignments: s.assignments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      lastUpdated: new Date().toISOString(),
    })),

  deleteAssignment: (id) =>
    set((s) => ({
      assignments: s.assignments.filter((a) => a.id !== id),
      lastUpdated: new Date().toISOString(),
    })),

  assignReplacementDriver: (assignmentId, driverId, driverName) =>
    set((s) => ({
      assignments: s.assignments.map((a) =>
        a.id === assignmentId ? { ...a, replacementDriverId: driverId, replacementDriverName: driverName } : a
      ),
      lastUpdated: new Date().toISOString(),
    })),

  approveDriverLeave: (assignmentId) =>
    set((s) => ({
      assignments: s.assignments.map((a) => (a.id === assignmentId ? { ...a, leaveApproved: true } : a)),
      lastUpdated: new Date().toISOString(),
    })),

  setAssignmentStatus: (id, status) =>
    set((s) => ({
      assignments: s.assignments.map((a) => (a.id === id ? { ...a, status } : a)),
      lastUpdated: new Date().toISOString(),
    })),

  setChildPhase: (childId, phase) =>
    set((s) => ({
      childJourneyPhases: { ...s.childJourneyPhases, [childId]: phase },
      lastUpdated: new Date().toISOString(),
    })),

  forBus: (busId) => get().assignments.find((a) => a.busId === busId && a.date === today),
  forDriver: (driverId) =>
    get().assignments.find(
      (a) => (a.driverId === driverId || a.replacementDriverId === driverId) && a.date === today
    ),
  forStudent: (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? get().assignments.find((a) => a.busId === student.busId && a.date === today) : undefined;
  },
  forChild: (childId) => {
    const child = students.find((s) => s.id === childId);
    return child ? get().assignments.find((a) => a.busId === child.busId && a.date === today) : undefined;
  },
}));
