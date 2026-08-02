import { useQuery } from '@tanstack/react-query';
import { GraduationCap, Bus, User, Phone, Route as RouteIcon, MapPin, School, Clock, Navigation, ShieldCheck, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { parentService, studentService, busService, driverService, journeyService, assignmentService, timetableService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { StopTimetable } from '@/components/shared/StopTimetable';
import type { JourneyPhase } from '@/lib/types';
import { cn } from '@/lib/utils';

const phaseConfig: Record<JourneyPhase, { label: string; tone: string; step: number }> = {
  'waiting': { label: 'Waiting', tone: 'bg-muted text-muted-foreground', step: 0 },
  'boarded': { label: 'Boarded', tone: 'bg-primary/15 text-primary', step: 1 },
  'travelling': { label: 'Travelling', tone: 'bg-accent/15 text-accent', step: 2 },
  'reached-college': { label: 'Reached College', tone: 'bg-success/15 text-success', step: 3 },
  'returning': { label: 'Returning', tone: 'bg-warning/15 text-warning', step: 4 },
  'reached-home': { label: 'Reached Home', tone: 'bg-success/15 text-success', step: 5 },
};
const phaseOrder: JourneyPhase[] = ['waiting', 'boarded', 'travelling', 'reached-college', 'returning', 'reached-home'];

export function ChildTransportCard({ parentId }: { parentId: string }) {
  const { data: parent } = useQuery({ queryKey: ['parent-me-for-card'], queryFn: parentService.me });
  const { data: assignment } = useQuery({
    queryKey: ['daily-assignment-parent', parentId],
    queryFn: () => assignmentService.forChild(parent?.childId ?? 'stu-01'),
    enabled: !!parent,
  });
  const { data: child } = useQuery({
    queryKey: ['child-for-card', parent?.childId],
    queryFn: () => studentService.get(parent?.childId ?? 'stu-01'),
    enabled: !!parent,
  });
  const { data: bus } = useQuery({
    queryKey: ['child-bus-card', assignment?.busId],
    queryFn: () => busService.get(assignment?.busId ?? 'CKCET-01'),
    enabled: !!assignment,
  });
  const { data: driver } = useQuery({
    queryKey: ['child-driver-card', assignment?.replacementDriverId ?? assignment?.driverId],
    queryFn: () => driverService.get(assignment?.replacementDriverId ?? assignment?.driverId ?? 'drv-01'),
    enabled: !!assignment,
  });
  const { data: journey } = useQuery({
    queryKey: ['child-journey-card', assignment?.busId],
    queryFn: () => journeyService.current(assignment?.busId ?? 'CKCET-01'),
    enabled: !!assignment,
  });
  const { data: timetable } = useQuery({
    queryKey: ['child-timetable-card', assignment?.busId],
    queryFn: () => timetableService.forBus(assignment?.busId ?? 'CKCET-01'),
    enabled: !!assignment,
    select: (list) => list?.[0],
  });

  if (!assignment || !child) return null;

  const phase = assignmentService.getChildPhase(parent?.childId ?? 'stu-01');
  const activeDriverName = assignment.replacementDriverName ?? assignment.driverName;
  const lastUpdated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-success" /> Child Transport Details</span>
          <Badge tone={assignment.status === 'on-time' ? 'success' : 'warning'} className="capitalize">{assignment.status.replace('-', ' ')}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="grid gap-0 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <Field icon={<GraduationCap className="h-4 w-4 text-primary" />} label="Child Name" value={child.name} />
          <Field icon={<Bus className="h-4 w-4 text-primary" />} label="Today's Bus Number" value={assignment.busId} sub={bus?.number} />
          <Field icon={<User className="h-4 w-4 text-secondary" />} label="Assigned Driver" value={activeDriverName} sub={assignment.replacementDriverName ? 'Replacement' : undefined} />
          <Field icon={<Phone className="h-4 w-4 text-accent" />} label="Driver Contact" value={driver?.phone ?? '—'} />
          <Field icon={<RouteIcon className="h-4 w-4 text-accent" />} label="Today's Route" value={assignment.routeName} />
          <Field icon={<MapPin className="h-4 w-4 text-warning" />} label="Pickup Stop" value={child.pickupStop} />
          <Field icon={<School className="h-4 w-4 text-success" />} label="Drop Location" value={child.dropStop} />
          <Field icon={<Clock className="h-4 w-4 text-primary" />} label="Pickup Time" value={assignment.pickupTime} mono />
          <Field icon={<Clock className="h-4 w-4 text-secondary" />} label="Expected Arrival" value={assignment.morningShift.collegeArrival} mono />
        </div>

        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
          <p className="mb-3 text-sm font-semibold">Journey Status</p>
          <div className="flex flex-wrap gap-2">
            {phaseOrder.map((p) => {
              const cfg = phaseConfig[p];
              const completed = phaseConfig[phase].step > cfg.step;
              const current = phase === p;
              return (
                <div key={p} className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium', current ? cfg.tone : completed ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                  {completed ? <CheckCircle2 className="h-3 w-3" /> : current ? <Circle className="h-3 w-3 fill-current" /> : <Circle className="h-3 w-3" />}
                  {cfg.label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Navigation className="h-3.5 w-3.5" /> Live Bus Tracking</p>
                <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
              </div>
              <p className="mt-1 text-lg font-bold">{bus?.currentStop ?? '—'}</p>
              <p className="text-xs text-muted-foreground">Next: {bus?.nextStop ?? '—'} · {bus?.speed ?? 0} km/h · ETA {bus?.etaMinutes ?? 0} min</p>
            </div>
            <JourneyProgress progress={journey?.progress ?? 0} status={`Bus heading to ${bus?.nextStop}`} />
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Bus className="h-4 w-4 text-primary" /> Today's Bus Schedule</p>
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
