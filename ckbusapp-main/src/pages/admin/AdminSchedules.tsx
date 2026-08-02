import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, Plus, Trash2, AlertTriangle, CheckCircle2, Sunrise, Sunset, UserCheck, Bus, Route as RouteIcon, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { scheduleService, driverService, busService, routeService, timetableService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { StopTimetable } from '@/components/shared/StopTimetable';
import type { Schedule, TransportTimetable } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AdminSchedules() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [expandedTimetable, setExpandedTimetable] = useState<string | null>(null);
  const { data: schedules } = useQuery({ queryKey: ['schedules'], queryFn: scheduleService.list });
  const { data: drivers } = useQuery({ queryKey: ['drivers'], queryFn: driverService.list });
  const { data: buses } = useQuery({ queryKey: ['buses'], queryFn: busService.list });
  const { data: routes } = useQuery({ queryKey: ['routes'], queryFn: routeService.list });
  const { data: timetables } = useQuery({ queryKey: ['timetables'], queryFn: timetableService.list });
  const [form, setForm] = useState({ driverId: '', busId: '', routeId: '', shift: 'morning' as 'morning' | 'evening', startTime: '', endTime: '', date: '2026-07-28' });

  const create = useMutation({ mutationFn: scheduleService.create, onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedules'] }); setOpen(false); } });
  const del = useMutation({ mutationFn: scheduleService.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['schedules'] }) });

  const availableDrivers = drivers ?? [];
  const availableBuses = buses ?? [];
  const availableRoutes = routes ?? [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const driver = availableDrivers.find((d) => d.id === form.driverId);
    const route = availableRoutes.find((r) => r.id === form.routeId);
    const hasConflict = scheduleService.checkConflict(form.driverId, form.date, form.shift);
    create.mutate({ ...form, driverName: driver?.name ?? '', routeName: route?.name ?? '', hasConflict });
    setForm({ driverId: '', busId: '', routeId: '', shift: 'morning', startTime: '', endTime: '', date: '2026-07-28' });
  };

  const morning = (schedules ?? []).filter((s) => s.shift === 'morning');
  const evening = (schedules ?? []).filter((s) => s.shift === 'evening');
  const conflicts = (schedules ?? []).filter((s) => s.hasConflict);
  const morningTimetables = (timetables ?? []).filter((t) => t.shift === 'morning');
  const eveningTimetables = (timetables ?? []).filter((t) => t.shift === 'evening');

  return (
    <div className="space-y-6">
      <SectionHeader title="Transport Schedule Management" subtitle="Complete timetable system — manage bus, driver, route and stop-wise schedules" action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create Schedule</Button>} />
      {conflicts.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-destructive" /><div><p className="text-sm font-semibold text-destructive">{conflicts.length} scheduling conflict{conflicts.length > 1 ? 's' : ''} detected</p><p className="text-xs text-muted-foreground">A driver is assigned to multiple buses in the same shift. Please review.</p></div></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sunrise className="h-5 w-5 text-warning" /> Morning Pickup Timetables</CardTitle>
          <CardDescription>Stop-wise arrival, waiting and departure times for morning routes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {morningTimetables.map((tt) => (
            <TimetableRow key={tt.id} tt={tt} expanded={expandedTimetable === tt.id} onToggle={() => setExpandedTimetable(expandedTimetable === tt.id ? null : tt.id)} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sunset className="h-5 w-5 text-secondary" /> Evening Drop Timetables</CardTitle>
          <CardDescription>Stop-wise arrival, waiting and departure times for evening return routes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {eveningTimetables.map((tt) => (
            <TimetableRow key={tt.id} tt={tt} expanded={expandedTimetable === tt.id} onToggle={() => setExpandedTimetable(expandedTimetable === tt.id ? null : tt.id)} />
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScheduleColumn title="Morning Shift Schedules" icon={<Sunrise className="h-4 w-4" />} schedules={morning} onDelete={(id) => del.mutate(id)} />
        <ScheduleColumn title="Evening Shift Schedules" icon={<Sunset className="h-4 w-4" />} schedules={evening} onDelete={(id) => del.mutate(id)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Driver Availability Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {availableDrivers.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><p className="text-sm font-medium">{d.name}</p><p className="text-xs text-muted-foreground">{d.busId || 'No bus assigned'}</p></div>
                <Badge tone={d.availability === 'assigned' ? 'success' : d.availability === 'available' ? 'primary' : d.availability === 'on-leave' ? 'warning' : 'default'} className="capitalize">{d.availability.replace('-', ' ')}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Schedule" description="Assign driver to bus and route for a shift.">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Driver</Label><Select value={form.driverId} onChange={(e) => setForm((f) => ({ ...f, driverId: e.target.value }))} required><option value="">Select…</option>{availableDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select></div>
            <div><Label>Bus</Label><Select value={form.busId} onChange={(e) => setForm((f) => ({ ...f, busId: e.target.value }))} required><option value="">Select…</option>{availableBuses.map((b) => <option key={b.id} value={b.id}>{b.id}</option>)}</Select></div>
            <div><Label>Route</Label><Select value={form.routeId} onChange={(e) => setForm((f) => ({ ...f, routeId: e.target.value }))} required><option value="">Select…</option>{availableRoutes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></div>
            <div><Label>Shift</Label><Select value={form.shift} onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value as 'morning' | 'evening' }))}><option value="morning">Morning</option><option value="evening">Evening</option></Select></div>
            <div><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} required /></div>
            <div><Label>End Time</Label><Input type="time" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} required /></div>
          </div>
          <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required /></div>
          {form.driverId && scheduleService.checkConflict(form.driverId, form.date, form.shift) && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="h-4 w-4" /> Conflict: This driver is already assigned to a bus in the {form.shift} shift on this date.</div>
          )}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={create.isPending}>{create.isPending ? 'Creating…' : 'Create'}</Button></div>
        </form>
      </Modal>
    </div>
  );
}

function TimetableRow({ tt, expanded, onToggle }: { tt: TransportTimetable; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-lg border border-border">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-3 hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Bus className="h-5 w-5" /></div>
          <div className="text-left">
            <p className="font-semibold">{tt.busId}</p>
            <p className="text-xs text-muted-foreground">{tt.routeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-muted-foreground">College {tt.shift === 'morning' ? 'Arrival' : 'Departure'}</p>
            <p className="font-mono text-sm font-semibold">{tt.shift === 'morning' ? tt.collegeArrival : tt.collegeDeparture}</p>
          </div>
          <Badge tone={tt.shift === 'morning' ? 'warning' : 'secondary'} className="capitalize">{tt.shift}</Badge>
          {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border p-4">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold"><RouteIcon className="h-4 w-4 text-primary" /> Stop-wise Schedule</p>
          <StopTimetable stops={tt.stops} />
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>College {tt.shift === 'morning' ? 'arrival' : 'departure'}: <strong className="font-mono">{tt.shift === 'morning' ? tt.collegeArrival : tt.collegeDeparture}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleColumn({ title, icon, schedules, onDelete }: { title: string; icon: React.ReactNode; schedules: Schedule[]; onDelete: (id: string) => void }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base">{icon} {title}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {schedules.length ? schedules.map((s) => (
          <div key={s.id} className={cn('rounded-lg border p-3', s.hasConflict ? 'border-destructive/40 bg-destructive/5' : 'border-border')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Badge tone="primary">{s.busId}</Badge><span className="text-sm font-medium">{s.driverName}</span></div>
              <button onClick={() => onDelete(s.id)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{s.routeName}</p>
            <div className="mt-1 flex items-center gap-2 text-xs"><span className="font-mono">{s.startTime} - {s.endTime}</span>{s.hasConflict && <Badge tone="destructive" className="text-[10px]"><AlertTriangle className="h-2.5 w-2.5" /> Conflict</Badge>}{s.substituteDriverName && <Badge tone="warning" className="text-[10px]">Substitute</Badge>}</div>
          </div>
        )) : <EmptyState icon={<CalendarClock className="h-8 w-8" />} title="No schedules" description="Create a schedule to get started." className="py-6" />}
      </CardContent>
    </Card>
  );
}
