import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Bus, Users, Wrench, PartyPopper, GraduationCap, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { scheduleService, calendarService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export default function AdminScheduleCalendar() {
  const [view, setView] = useState<ViewMode>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date('2026-07-28'));
  const { data: schedules } = useQuery({ queryKey: ['schedules'], queryFn: scheduleService.list });
  const { data: events } = useQuery({ queryKey: ['calendar'], queryFn: calendarService.list });

  const views: { key: ViewMode; label: string }[] = [{ key: 'daily', label: 'Daily' }, { key: 'weekly', label: 'Weekly' }, { key: 'monthly', label: 'Monthly' }];
  const dateStr = currentDate.toISOString().slice(0, 10);
  const daySchedules = (schedules ?? []).filter((s) => s.date === dateStr);
  const dayEvents = (events ?? []).filter((e) => e.date === dateStr);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - d.getDay() + i);
    return d;
  });

  const monthDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(1 - d.getDay() + i);
    return d;
  });

  const shiftDate = (days: number) => { const d = new Date(currentDate); d.setDate(d.getDate() + days); setCurrentDate(d); };

  const eventTypeMap = {
    holiday: { icon: PartyPopper, tone: 'bg-secondary/15 text-secondary', label: 'Holiday' },
    'exam-bus': { icon: GraduationCap, tone: 'bg-primary/15 text-primary', label: 'Exam Bus' },
    maintenance: { icon: Wrench, tone: 'bg-warning/15 text-warning', label: 'Maintenance' },
    special: { icon: Bus, tone: 'bg-accent/15 text-accent', label: 'Special' },
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Schedule Calendar" subtitle="Calendar-based view of driver, bus and route schedules" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {views.map((v) => (
            <button key={v.key} onClick={() => setView(v.key)} className={cn('rounded-lg px-4 py-2 text-sm font-medium transition-colors', view === v.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70')}>{v.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => shiftDate(view === 'daily' ? -1 : view === 'weekly' ? -7 : -30)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-display text-sm font-semibold">{currentDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <Button variant="ghost" size="icon" onClick={() => shiftDate(view === 'daily' ? 1 : view === 'weekly' ? 7 : 30)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {view === 'daily' && (
        <Card>
          <CardHeader><CardTitle>{currentDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {dayEvents.map((e) => {
              const cfg = eventTypeMap[e.type];
              const Icon = cfg.icon;
              return <div key={e.id} className={cn('flex items-center gap-3 rounded-lg p-3', cfg.tone)}><Icon className="h-5 w-5" /><div><p className="text-sm font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{e.description}</p></div><Badge tone="outline">{cfg.label}</Badge></div>;
            })}
            {daySchedules.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Bus className="h-4 w-4" /></div><div><p className="text-sm font-semibold">{s.busId} — {s.driverName}</p><p className="text-xs text-muted-foreground">{s.routeName}</p></div></div>
                <div className="flex items-center gap-2"><span className="font-mono text-sm">{s.startTime} - {s.endTime}</span><Badge tone={s.shift === 'morning' ? 'warning' : 'secondary'} className="capitalize">{s.shift}</Badge>{s.hasConflict && <Badge tone="destructive" className="text-[10px]"><AlertTriangle className="h-2.5 w-2.5" /> Conflict</Badge>}</div>
              </div>
            ))}
            {daySchedules.length === 0 && dayEvents.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No schedules or events for this day.</p>}
          </CardContent>
        </Card>
      )}

      {view === 'weekly' && (
        <div className="grid gap-2 sm:grid-cols-7">
          {weekDays.map((d) => {
            const ds = d.toISOString().slice(0, 10);
            const dsched = (schedules ?? []).filter((s) => s.date === ds);
            const devts = (events ?? []).filter((e) => e.date === ds);
            const isToday = ds === dateStr;
            return (
              <Card key={ds} className={cn('min-h-[180px]', isToday && 'border-primary ring-1 ring-primary/30')}>
                <CardContent className="p-3">
                  <p className="text-xs font-semibold text-muted-foreground">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                  <p className="font-display text-lg font-bold">{d.getDate()}</p>
                  <div className="mt-2 space-y-1">
                    {devts.map((e) => { const cfg = eventTypeMap[e.type]; return <div key={e.id} className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', cfg.tone)}>{e.title}</div>; })}
                    {dsched.map((s) => <div key={s.id} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{s.busId} {s.startTime}</div>)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {view === 'monthly' && (
        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((d) => {
                const ds = d.toISOString().slice(0, 10);
                const dsched = (schedules ?? []).filter((s) => s.date === ds);
                const devts = (events ?? []).filter((e) => e.date === ds);
                const inMonth = d.getMonth() === currentDate.getMonth();
                return (
                  <div key={ds} className={cn('min-h-[80px] rounded-lg border p-1.5 text-xs', inMonth ? 'border-border bg-card' : 'border-border/40 bg-muted/20 opacity-50')}>
                    <p className="font-semibold">{d.getDate()}</p>
                    <div className="mt-0.5 space-y-0.5">
                      {devts.slice(0, 2).map((e) => { const cfg = eventTypeMap[e.type]; return <div key={e.id} className={cn('truncate rounded px-1 text-[9px]', cfg.tone)}>{e.title}</div>; })}
                      {dsched.slice(0, 2).map((s) => <div key={s.id} className="truncate rounded bg-primary/10 px-1 text-[9px] text-primary">{s.busId}</div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Legend</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary"><Bus className="h-3.5 w-3.5" /></div><span className="text-sm">Scheduled Trip</span></div>
            {(Object.entries(eventTypeMap) as [keyof typeof eventTypeMap, typeof eventTypeMap.holiday][]).map(([key, v]) => { const Icon = v.icon; return <div key={key} className="flex items-center gap-2"><div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', v.tone)}><Icon className="h-3.5 w-3.5" /></div><span className="text-sm">{v.label}</span></div>; })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
