import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Bus, User, Route as RouteIcon, MapPin, School, Navigation, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { studentService, busService, routeService, driverService, journeyService, assignmentService, timetableService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { ETACountdown } from '@/components/shared/ETACountdown';
import { StopTimetable } from '@/components/shared/StopTimetable';
import { cn } from '@/lib/utils';

export function TodayTransportAssignment({ studentId }: { studentId: string }) {
  const { data: me } = useQuery({ queryKey: ['student-me'], queryFn: studentService.me });
  const { data: assignment } = useQuery({
    queryKey: ['daily-assignment-student', studentId],
    queryFn: () => assignmentService.forStudent(studentId),
  });
  const { data: bus } = useQuery({
    queryKey: ['assignment-bus', assignment?.busId],
    queryFn: () => busService.get(assignment?.busId ?? 'CKCET-01'),
    enabled: !!assignment,
  });
  const { data: driver } = useQuery({
    queryKey: ['assignment-driver', assignment?.replacementDriverId ?? assignment?.driverId],
    queryFn: () => driverService.get(assignment?.replacementDriverId ?? assignment?.driverId ?? 'drv-01'),
    enabled: !!assignment,
  });
  const { data: timetable } = useQuery({
    queryKey: ['assignment-timetable', assignment?.busId],
    queryFn: () => timetableService.forBus(assignment?.busId ?? 'CKCET-01'),
    enabled: !!assignment,
    select: (list) => list?.[0],
  });
  const { data: journey } = useQuery({
    queryKey: ['assignment-journey', assignment?.busId],
    queryFn: () => journeyService.current(assignment?.busId ?? 'CKCET-01'),
    enabled: !!assignment,
  });

  if (!assignment || !me) return null;

  const todayDate = new Date(assignment.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const activeDriverName = assignment.replacementDriverName ?? assignment.driverName;
  const routeStops = timetable?.stops.map((s: { stopName: string }) => s.stopName).join(' → ') ?? assignment.routeName;

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Today's Transport Assignment</span>
          <Badge tone={assignment.status === 'on-time' ? 'success' : assignment.status === 'delayed' ? 'warning' : 'destructive'} className="capitalize">{assignment.status.replace('-', ' ')}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="grid gap-0 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <Field icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Today's Date" value={todayDate} />
          <Field icon={<Bus className="h-4 w-4 text-primary" />} label="Today's Bus" value={assignment.busId} sub={bus?.number} />
          <Field icon={<User className="h-4 w-4 text-secondary" />} label="Today's Driver" value={activeDriverName} sub={assignment.replacementDriverName ? 'Replacement Driver' : undefined} />
          <Field icon={<RouteIcon className="h-4 w-4 text-accent" />} label="Today's Route" value={routeStops} />
          <Field icon={<MapPin className="h-4 w-4 text-warning" />} label="Pickup Stop" value={me.pickupStop} />
          <Field icon={<School className="h-4 w-4 text-success" />} label="Drop Stop" value={me.dropStop} />
          <Field icon={<Clock className="h-4 w-4 text-primary" />} label="Pickup Time" value={assignment.pickupTime} mono />
          <Field icon={<Clock className="h-4 w-4 text-secondary" />} label="Expected Arrival" value={assignment.morningShift.collegeArrival} mono />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Navigation className="h-3.5 w-3.5" /> Current Bus Location</p>
              <p className="mt-1 text-lg font-bold">{bus?.currentStop ?? '—'}</p>
              <p className="text-xs text-muted-foreground">Next: {bus?.nextStop ?? '—'} · {bus?.speed ?? 0} km/h</p>
            </div>
            <JourneyProgress progress={journey?.progress ?? 0} status={`Bus at ${bus?.currentStop}, heading to ${bus?.nextStop}`} />
            <ETACountdown seconds={journey?.etaSeconds ?? 0} label="Live ETA Countdown" />
            <div className={cn('flex items-center gap-2 rounded-lg p-3 text-sm', assignment.status === 'on-time' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
              {assignment.status === 'on-time' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <span>Today's Status: <strong>{assignment.status === 'on-time' ? 'On Time' : assignment.status === 'delayed' ? 'Delayed' : 'Cancelled'}</strong></span>
            </div>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Calendar className="h-4 w-4 text-primary" /> Today's Bus Schedule</p>
            {timetable && <StopTimetable stops={timetable.stops} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ icon, label, value, sub, mono }: { icon: React.ReactNode; label: string; value: string; sub?: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn('font-semibold', mono && 'font-mono', 'truncate')}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
