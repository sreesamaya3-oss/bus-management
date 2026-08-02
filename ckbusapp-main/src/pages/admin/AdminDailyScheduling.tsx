import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, Clock, Sunrise, Sunset, Bus, UserCheck, Route as RouteIcon, AlertTriangle, CheckCircle2, UserCog, CalendarClock, RefreshCw } from 'lucide-react';
import { busService, driverService, routeService, studentService, assignmentService, timetableService } from '@/lib/services';
import { useDailyAssignmentStore } from '@/store/dailyAssignmentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { StopTimetable } from '@/components/shared/StopTimetable';
import type { DailyTransportAssignment } from '@/lib/types';
import { cn } from '@/lib/utils';

const today = '2026-07-28';

export default function AdminDailyScheduling() {
  const assignments = useDailyAssignmentStore((s) => s.assignments);
  const lastUpdated = useDailyAssignmentStore((s) => s.lastUpdated);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [replacementOpen, setReplacementOpen] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replacementDriver, setReplacementDriver] = useState('');

  const { data: buses } = useQuery({ queryKey: ['buses-daily'], queryFn: busService.list });
  const { data: drivers } = useQuery({ queryKey: ['drivers-daily'], queryFn: driverService.list });
  const { data: routes } = useQuery({ queryKey: ['routes-daily'], queryFn: routeService.list });
  const { data: timetables } = useQuery({ queryKey: ['timetables-daily'], queryFn: timetableService.list });
  const { data: allStudents } = useQuery({ queryKey: ['students-daily'], queryFn: studentService.list });

  const busesList = buses ?? [];
  const driversList = drivers ?? [];
  const routesList = routes ?? [];

  const blank = { busId: '', driverId: '', routeId: '', morningStart: '', morningEnd: '', eveningStart: '', eveningEnd: '', pickupTime: '', dropTime: '' };
  const [form, setForm] = useState(blank);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const driver = driversList.find((d) => d.id === form.driverId);
    const route = routesList.find((r) => r.id === form.routeId);
    const myStudents = (allStudents ?? []).filter((s) => s.busId === form.busId);
    const studentCount = myStudents.filter((s) => s.busId === form.busId).length;
    const data: Omit<DailyTransportAssignment, 'id'> = {
      date: today, busId: form.busId, driverId: form.driverId, driverName: driver?.name ?? '',
      routeId: form.routeId, routeName: route?.name ?? '',
      morningShift: { startTime: form.morningStart, endTime: form.morningEnd, collegeArrival: form.morningEnd },
      eveningShift: { startTime: form.eveningStart, endTime: form.eveningEnd, collegeDeparture: form.eveningStart },
      pickupTime: form.pickupTime, dropTime: form.dropTime,
      status: 'on-time', leaveApproved: false, studentCount: myStudents.length,
    };
    if (editId) { assignmentService.update(editId, data); } else { assignmentService.create(data); }
    setOpen(false); setEditId(null); setForm(blank);
  };

  const confirmReplacement = () => {
    if (!replacementOpen || !replacementDriver) return;
    const driver = driversList.find((d) => d.id === replacementDriver);
    if (driver) {
      assignmentService.assignReplacement(replacementOpen, driver.id, driver.name);
      assignmentService.approveLeave(replacementOpen);
    }
    setReplacementOpen(null); setReplacementDriver('');
  };

  const todays = assignments.filter((a) => a.date === today);
  const onTime = todays.filter((a) => a.status === 'on-time').length;
  const delayed = todays.filter((a) => a.status === 'delayed').length;
  const onLeave = todays.filter((a) => a.leaveApproved).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Daily Transport Scheduling"
        subtitle="Assign buses, drivers, routes and shifts for today — changes sync to all portals instantly"
        action={<Button onClick={() => { setForm(blank); setEditId(null); setOpen(true); }}><Plus className="h-4 w-4" /> New Assignment</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="py-4"><p className="text-xs text-muted-foreground">Total Assignments</p><p className="mt-1 font-display text-2xl font-bold">{todays.length}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-muted-foreground">On Time</p><p className="mt-1 font-display text-2xl font-bold text-success">{onTime}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-muted-foreground">Delayed</p><p className="mt-1 font-display text-2xl font-bold text-warning">{delayed}</p></CardContent></Card>
        <Card><CardContent className="py-4"><p className="text-xs text-muted-foreground">Driver on Leave</p><p className="mt-1 font-display text-2xl font-bold text-secondary">{onLeave}</p></CardContent></Card>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <RefreshCw className="h-3 w-3" /> Last synced: {new Date(lastUpdated).toLocaleTimeString()} · Changes auto-propagate to Student, Parent, Driver and Admin portals
      </div>

      <div className="space-y-3">
        {todays.map((a) => {
          const tt = (timetables ?? []).find((t) => t.busId === a.busId && t.shift === 'morning');
          const expanded = expandedId === a.id;
          return (
            <Card key={a.id} hover>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary"><Bus className="h-5 w-5" /></div>
                    <div>
                      <p className="font-semibold">{a.busId}</p>
                      <p className="text-xs text-muted-foreground">{a.routeName}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={a.status === 'on-time' ? 'success' : a.status === 'delayed' ? 'warning' : 'destructive'} className="capitalize">{a.status.replace('-', ' ')}</Badge>
                    {a.leaveApproved && <Badge tone="secondary">Leave Approved</Badge>}
                    {a.replacementDriverName && <Badge tone="accent"><UserCog className="h-3 w-3" /> {a.replacementDriverName}</Badge>}
                    <Badge tone="outline"><UserCheck className="h-3 w-3" /> {a.studentCount} students</Badge>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-warning"><Sunrise className="h-3.5 w-3.5" /> Morning Shift</p>
                    <div className="mt-1.5 space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Start:</span><span className="font-mono font-semibold">{a.morningShift.startTime}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">College Arrival:</span><span className="font-mono font-semibold">{a.morningShift.collegeArrival}</span></div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-secondary"><Sunset className="h-3.5 w-3.5" /> Evening Shift</p>
                    <div className="mt-1.5 space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">College Departure:</span><span className="font-mono font-semibold">{a.eveningShift.collegeDeparture}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Drop End:</span><span className="font-mono font-semibold">{a.eveningShift.endTime}</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-3">
                  <div className="flex items-center gap-1.5"><UserCheck className="h-4 w-4 text-primary" /><span className="text-muted-foreground">Driver:</span><span className="font-medium">{a.replacementDriverName ?? a.driverName}</span></div>
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /><span className="text-muted-foreground">Pickup:</span><span className="font-mono font-medium">{a.pickupTime}</span></div>
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-secondary" /><span className="text-muted-foreground">Drop:</span><span className="font-mono font-medium">{a.dropTime}</span></div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="outline" onClick={() => { const existing = todays.find((x) => x.id === a.id); if (existing) { setForm({ busId: existing.busId, driverId: existing.driverId, routeId: existing.routeId, morningStart: existing.morningShift.startTime, morningEnd: existing.morningShift.endTime, eveningStart: existing.eveningShift.startTime, eveningEnd: existing.eveningShift.endTime, pickupTime: existing.pickupTime, dropTime: existing.dropTime }); setEditId(existing.id); setOpen(true); } }}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => setReplacementOpen(a.id)} disabled={a.leaveApproved}><UserCog className="h-3.5 w-3.5" /> Assign Replacement</Button>
                  <Button size="sm" variant="outline" onClick={() => assignmentService.setStatus(a.id, a.status === 'on-time' ? 'delayed' : 'on-time')}>{a.status === 'on-time' ? 'Mark Delayed' : 'Mark On-Time'}</Button>
                  {tt && <Button size="sm" variant="ghost" onClick={() => setExpandedId(expanded ? null : a.id)}><CalendarClock className="h-3.5 w-3.5" /> {expanded ? 'Hide' : 'View'} Timetable</Button>}
                  <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:bg-destructive/10" onClick={() => assignmentService.remove(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>

                {expanded && tt && (
                  <div className="border-t border-border pt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><RouteIcon className="h-4 w-4 text-primary" /> Stop-wise Timetable — {a.busId}</p>
                    <StopTimetable stops={tt.stops} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {todays.length === 0 && <EmptyState icon={<CalendarClock className="h-8 w-8" />} title="No assignments for today" description="Create a daily transport assignment to get started." />}
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setEditId(null); }} title={editId ? 'Edit Assignment' : 'New Daily Assignment'} description="Assign a bus, driver and route for today. Changes sync instantly.">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Bus</Label><Select value={form.busId} onChange={(e) => setForm((f) => ({ ...f, busId: e.target.value }))} required><option value="">Select…</option>{busesList.map((b) => <option key={b.id} value={b.id}>{b.id}</option>)}</Select></div>
            <div><Label>Driver</Label><Select value={form.driverId} onChange={(e) => setForm((f) => ({ ...f, driverId: e.target.value }))} required><option value="">Select…</option>{driversList.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select></div>
            <div className="col-span-2"><Label>Route</Label><Select value={form.routeId} onChange={(e) => setForm((f) => ({ ...f, routeId: e.target.value }))} required><option value="">Select…</option>{routesList.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></div>
            <div><Label>Morning Start</Label><Input type="time" value={form.morningStart} onChange={(e) => setForm((f) => ({ ...f, morningStart: e.target.value }))} required /></div>
            <div><Label>Morning Arrival</Label><Input type="time" value={form.morningEnd} onChange={(e) => setForm((f) => ({ ...f, morningEnd: e.target.value }))} required /></div>
            <div><Label>Evening Departure</Label><Input type="time" value={form.eveningStart} onChange={(e) => setForm((f) => ({ ...f, eveningStart: e.target.value }))} required /></div>
            <div><Label>Evening End</Label><Input type="time" value={form.eveningEnd} onChange={(e) => setForm((f) => ({ ...f, eveningEnd: e.target.value }))} required /></div>
            <div><Label>Pickup Time</Label><Input type="time" value={form.pickupTime} onChange={(e) => setForm((f) => ({ ...f, pickupTime: e.target.value }))} required /></div>
            <div><Label>Drop Time</Label><Input type="time" value={form.dropTime} onChange={(e) => setForm((f) => ({ ...f, dropTime: e.target.value }))} required /></div>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => { setOpen(false); setEditId(null); }}>Cancel</Button><Button type="submit">{editId ? 'Update' : 'Create'}</Button></div>
        </form>
      </Modal>

      <Modal open={!!replacementOpen} onClose={() => setReplacementOpen(null)} title="Assign Replacement Driver" description="Select a replacement driver and approve the original driver's leave.">
        <div className="space-y-4">
          <div>
            <Label>Replacement Driver</Label>
            <Select value={replacementDriver} onChange={(e) => setReplacementDriver(e.target.value)}>
              <option value="">Select…</option>
              {driversList.filter((d) => d.availability === 'available').map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div className="rounded-lg bg-warning/10 p-3 text-sm text-muted-foreground"><AlertTriangle className="mb-1 h-4 w-4 text-warning" /> The original driver will be marked on leave and the replacement will appear on all portals immediately.</div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setReplacementOpen(null)}>Cancel</Button><Button onClick={confirmReplacement} disabled={!replacementDriver}><CheckCircle2 className="h-4 w-4" /> Approve & Assign</Button></div>
        </div>
      </Modal>
    </div>
  );
}
