import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, Users, Bus, ArrowRight, Play, CheckCircle2, LogOut, Navigation, CalendarClock } from 'lucide-react';
import { driverService, busService, routeService, studentService, timetableService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RouteTimeline } from '@/components/shared/RouteTimeline';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { StopTimetable } from '@/components/shared/StopTimetable';
import { SectionHeader } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

export default function DriverTrips() {
  const { data: me } = useQuery({ queryKey: ['driver-me'], queryFn: driverService.me });
  const { data: bus } = useQuery({ queryKey: ['driver-bus', me?.busId], queryFn: () => busService.get(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const { data: route } = useQuery({ queryKey: ['driver-route', me?.routeId], queryFn: () => routeService.get(me?.routeId ?? 'route-01'), enabled: !!me });
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: studentService.list });
  const { data: driverSchedule } = useQuery({ queryKey: ['driver-schedule', me?.id], queryFn: () => timetableService.forDriver(me?.id ?? 'drv-01'), enabled: !!me });
  const [stopIndex, setStopIndex] = useState(1);
  const [tripStarted, setTripStarted] = useState(true);
  const myStudents = students?.filter((s) => s.busId === me?.busId) ?? [];

  const trips = [
    { id: 't1', shift: 'Morning', time: '06:45 - 08:00', route: route?.name ?? '—', status: 'in-progress', students: myStudents.length },
    { id: 't2', shift: 'Evening', time: '16:30 - 17:45', route: route?.name ?? '—', status: 'upcoming', students: myStudents.length },
  ];

  const currentStop = driverSchedule?.stops[stopIndex];
  const isLastStop = stopIndex >= (driverSchedule?.stops.length ?? 1) - 1;

  return (
    <div className="space-y-6">
      <SectionHeader title="Today Trips" subtitle="Your scheduled trips and stop-wise timetable" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Morning Trip" value={trips[0].status === 'in-progress' ? 'Active' : 'Done'} icon={<Bus className="h-5 w-5" />} accent="primary" />
        <StatCard label="Evening Trip" value="Upcoming" icon={<Clock className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Students Today" value={myStudents.length} icon={<Users className="h-5 w-5" />} accent="accent" />
      </div>
      <div className="space-y-3">
        {trips.map((t) => (
          <Card key={t.id} hover>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', t.status === 'in-progress' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground')}><Bus className="h-6 w-6" /></div>
                <div><p className="font-semibold">{t.shift} Trip</p><p className="text-sm text-muted-foreground">{t.time}</p><p className="text-xs text-muted-foreground">{t.route}</p></div>
              </div>
              <div className="flex items-center gap-3"><Badge tone="outline"><Users className="h-3 w-3" /> {t.students} students</Badge><Badge tone={t.status === 'in-progress' ? 'success' : 'warning'} className="capitalize">{t.status.replace('-', ' ')}</Badge></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {driverSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> Today Trip — Stop Sequence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2"><Bus className="h-5 w-5 text-primary" /><div><p className="text-xs text-muted-foreground">Bus</p><p className="font-semibold">{driverSchedule.busId}</p></div></div>
              <div className="flex items-center gap-2"><Navigation className="h-5 w-5 text-secondary" /><div><p className="text-xs text-muted-foreground">Route</p><p className="font-semibold text-sm">{driverSchedule.routeName}</p></div></div>
              <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-accent" /><div><p className="text-xs text-muted-foreground">Shift Time</p><p className="font-mono font-semibold">{driverSchedule.startTime} - {driverSchedule.endTime}</p></div></div>
            </div>
            <StopTimetable stops={driverSchedule.stops} currentStopIndex={stopIndex} />
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <Button onClick={() => setTripStarted(true)} disabled={tripStarted} variant={tripStarted ? 'outline' : 'primary'}><Play className="h-4 w-4" /> Start Trip</Button>
              <Button onClick={() => setStopIndex((i) => Math.min(i + 1, driverSchedule.stops.length - 1))} disabled={!tripStarted || isLastStop}><CheckCircle2 className="h-4 w-4" /> Arrived at Stop</Button>
              <Button onClick={() => setStopIndex((i) => Math.min(i + 1, driverSchedule.stops.length - 1))} disabled={!tripStarted || isLastStop} variant="outline"><LogOut className="h-4 w-4" /> Departed</Button>
              {currentStop && <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto"><MapPin className="h-4 w-4 text-primary" /> Current: <strong className="text-foreground">{currentStop.stopName}</strong></div>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Current Trip Progress</CardTitle></CardHeader>
          <CardContent>
            <JourneyProgress progress={bus?.progress ?? 0} status={`At ${bus?.currentStop}`} />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground"><MapPin className="inline h-3 w-3" /> Current</p><p className="font-semibold">{bus?.currentStop}</p></div>
              <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground"><ArrowRight className="inline h-3 w-3" /> Next</p><p className="font-semibold">{bus?.nextStop}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Stops Timeline</CardTitle></CardHeader><CardContent><RouteTimeline stops={route?.stops ?? []} progress={bus?.progress ?? 0} /></CardContent></Card>
      </div>
    </div>
  );
}
