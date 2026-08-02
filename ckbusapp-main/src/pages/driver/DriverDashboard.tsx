import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bus, Route as RouteIcon, Users, Clock, QrCode, Siren, Megaphone, TrendingUp, Star, CalendarClock, Sunrise, Sunset, MapPin, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { driverService, busService, routeService, studentService, timetableService } from '@/lib/services';
import { useDailyAssignmentStore } from '@/store/dailyAssignmentStore';
import { StopTimetable } from '@/components/shared/StopTimetable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LiveClock } from '@/components/shared/LiveClock';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { AISummaryCard } from '@/components/shared/AISummaryCard';
import { SectionHeader } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const { data: me } = useQuery({ queryKey: ['driver-me'], queryFn: driverService.me });
  const { data: bus } = useQuery({ queryKey: ['driver-bus', me?.busId], queryFn: () => busService.get(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const { data: route } = useQuery({ queryKey: ['driver-route', me?.routeId], queryFn: () => routeService.get(me?.routeId ?? 'route-01'), enabled: !!me });
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: studentService.list });
  const myStudents = students?.filter((s) => s.busId === me?.busId) ?? [];
  const assignment = useDailyAssignmentStore((s) => s.forDriver(me?.id ?? 'drv-01'));
  const { data: timetable } = useQuery({ queryKey: ['driver-timetable', assignment?.busId], queryFn: () => timetableService.forBus(assignment?.busId ?? 'CKCET-01'), enabled: !!assignment, select: (list) => list?.[0] });
  const boardedCount = 18;
  const remainingCount = (assignment?.studentCount ?? myStudents.length) - boardedCount;

  return (
    <div className="space-y-6">
      <SectionHeader title={`Hello, ${user?.name?.split(' ').slice(-1)[0] ?? 'Driver'}`} subtitle="Your trips and duties for today" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card glass className="lg:col-span-2">
          <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <LiveClock />
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary"><Bus className="h-6 w-6" /></div>
              <div><p className="text-xs text-muted-foreground">Your Bus</p><p className="font-display text-lg font-bold">{me?.busId ?? 'CKCET-01'}</p><p className="text-xs text-muted-foreground">{bus?.number}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center gap-3"><Star className="h-8 w-8 fill-warning text-warning" /><div><p className="text-xs text-muted-foreground">Your Rating</p><p className="font-display text-2xl font-bold">{me?.rating} / 5</p></div></CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned Route" value={route?.name.split('—')[0] ?? '—'} icon={<RouteIcon className="h-5 w-5" />} accent="primary" />
        <StatCard label="Students" value={myStudents.length} icon={<Users className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Capacity" value={`${bus?.occupied}/${bus?.capacity}`} icon={<Bus className="h-5 w-5" />} accent="accent" />
        <StatCard label="Experience" value={`${me?.experienceYears} yrs`} icon={<TrendingUp className="h-5 w-5" />} accent="success" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Today Trip</CardTitle><CardDescription>Current trip progress and status</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone={bus?.status === 'on-time' ? 'success' : bus?.status === 'delayed' ? 'warning' : 'primary'} className="capitalize">{bus?.status?.replace('-', ' ')}</Badge>
              <Badge tone="outline"><Clock className="h-3 w-3" /> ETA {bus?.etaMinutes} min</Badge>
              <Badge tone="outline">At: {bus?.currentStop}</Badge>
            </div>
            <JourneyProgress progress={bus?.progress ?? 0} status={`Heading to ${bus?.nextStop}`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/driver/scanner"><Button className="w-full"><QrCode className="h-4 w-4" /> Open QR Scanner</Button></Link>
              <Link to="/driver/delay"><Button variant="outline" className="w-full"><Clock className="h-4 w-4" /> Report Delay</Button></Link>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" /> Journey Timeline updates in real time as you progress through stops.
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <AISummaryCard severity="medium" message={`Traffic is building up near ${bus?.nextStop}. Consider departing 5 minutes earlier to maintain your on-time record.`} />
          <Card className="border-destructive/30"><CardContent className="flex items-center gap-3"><Siren className="h-6 w-6 text-destructive" /><div className="flex-1"><p className="text-sm font-semibold">Emergency SOS</p><p className="text-xs text-muted-foreground">Alert office instantly</p></div><Link to="/driver/sos"><Button variant="destructive" size="sm">SOS</Button></Link></CardContent></Card>
        </div>
      </div>

      {assignment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> Today's Assignment</CardTitle>
            <CardDescription>Your assigned bus, route and shift details for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Bus className="h-3.5 w-3.5 text-primary" /> Assigned Bus</p><p className="mt-0.5 font-bold">{assignment.busId}</p></div>
              <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><RouteIcon className="h-3.5 w-3.5 text-secondary" /> Assigned Route</p><p className="mt-0.5 text-sm font-semibold">{assignment.routeName}</p></div>
              <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarClock className="h-3.5 w-3.5 text-accent" /> Shift</p><p className="mt-0.5 font-semibold capitalize">{assignment.date}</p></div>
              <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><UserCheck className="h-3.5 w-3.5 text-success" /> Students</p><p className="mt-0.5 font-bold">{assignment.studentCount}</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-warning"><Sunrise className="h-3.5 w-3.5" /> Morning Shift</p>
                <div className="mt-1.5 flex justify-between text-sm"><span className="text-muted-foreground">Pickup:</span><span className="font-mono font-semibold">{assignment.morningShift.startTime}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">College Arrival:</span><span className="font-mono font-semibold">{assignment.morningShift.collegeArrival}</span></div>
              </div>
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-secondary"><Sunset className="h-3.5 w-3.5" /> Evening Shift</p>
                <div className="mt-1.5 flex justify-between text-sm"><span className="text-muted-foreground">College Departure:</span><span className="font-mono font-semibold">{assignment.eveningShift.collegeDeparture}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Drop End:</span><span className="font-mono font-semibold">{assignment.eveningShift.endTime}</span></div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-success/10 p-3 text-center"><p className="text-xs text-muted-foreground">Boarded</p><p className="font-display text-2xl font-bold text-success">{boardedCount}</p></div>
              <div className="rounded-lg bg-warning/10 p-3 text-center"><p className="text-xs text-muted-foreground">Remaining</p><p className="font-display text-2xl font-bold text-warning">{remainingCount}</p></div>
              <div className="rounded-lg bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">Next Stop</p><p className="font-bold text-primary">{bus?.nextStop ?? '—'}</p></div>
            </div>
            {timetable && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><MapPin className="h-4 w-4 text-primary" /> Today's Timetable</p>
                <StopTimetable stops={timetable.stops} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Megaphone className="h-4 w-4" /> Recent Announcements</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="rounded-lg bg-muted/50 p-3"><p className="text-sm font-medium">Heavy rain advisory</p><p className="text-xs text-muted-foreground">Expect 10-15 min delays across all routes.</p></div>
          <Link to="/driver/announcements" className="block text-center text-xs font-medium text-primary hover:underline">View all</Link>
        </CardContent>
      </Card>
    </div>
  );
}
