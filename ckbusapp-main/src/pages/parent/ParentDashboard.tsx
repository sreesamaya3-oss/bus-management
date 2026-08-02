import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Clock, Users, Bell, Bus, CheckCircle2, Navigation, CalendarClock, Sunrise, Sunset, TrendingUp, TrendingDown } from 'lucide-react';
import { parentService, studentService, busService, routeService, driverService, journeyService, notificationService, timetableService } from '@/lib/services';
import { ChildTransportCard } from '@/components/shared/ChildTransportCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LiveClock } from '@/components/shared/LiveClock';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { ETACountdown } from '@/components/shared/ETACountdown';
import { JourneyTimeline } from '@/components/shared/JourneyTimeline';
import { AISummaryCard } from '@/components/shared/AISummaryCard';
import { SectionHeader } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

export default function ParentDashboard() {
  const { data: parent } = useQuery({ queryKey: ['parent-me'], queryFn: parentService.me });
  const { data: child } = useQuery({ queryKey: ['child', parent?.childId], queryFn: () => studentService.get(parent?.childId ?? 'stu-01'), enabled: !!parent });
  const { data: bus } = useQuery({ queryKey: ['child-bus', child?.busId], queryFn: () => busService.get(child?.busId ?? 'CKCET-01'), enabled: !!child });
  const { data: driver } = useQuery({ queryKey: ['child-driver', bus?.driverId], queryFn: () => driverService.get(bus?.driverId ?? 'drv-01'), enabled: !!bus });
  const { data: journey } = useQuery({ queryKey: ['child-journey', child?.busId], queryFn: () => journeyService.current(child?.busId ?? 'CKCET-01'), enabled: !!child });
  const { data: notifs } = useQuery({ queryKey: ['notifications'], queryFn: notificationService.list });
  const { data: events } = useQuery({ queryKey: ['journey-events'], queryFn: journeyService.events });
  const { data: childSchedule } = useQuery({ queryKey: ['parent-schedule', parent?.id], queryFn: () => timetableService.forParent(parent?.id ?? 'par-01'), enabled: !!parent });

  return (
    <div className="space-y-6">
      <SectionHeader title="Parent Dashboard" subtitle={`Monitoring ${parent?.childName ?? 'your child'} journey`} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card glass className="lg:col-span-2">
          <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <LiveClock />
            <div className="flex items-center gap-3 rounded-xl bg-success/10 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20 text-success"><ShieldCheck className="h-6 w-6" /></div>
              <div><p className="text-xs text-muted-foreground">Child Status</p><p className="font-display text-lg font-bold text-success">Safe & Onboard</p><p className="text-xs text-muted-foreground">{child?.name} · {child?.busId}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold"><Users className="h-4 w-4 text-primary" /> Driver</p>
            <p className="font-medium">{driver?.name}</p>
            <p className="text-xs text-muted-foreground">{driver?.phone}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><span className="text-warning">★ {driver?.rating}</span> · {driver?.experienceYears} yrs exp</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Stop" value={bus?.currentStop ?? '—'} icon={<MapPin className="h-5 w-5" />} accent="primary" />
        <StatCard label="Next Stop" value={bus?.nextStop ?? '—'} icon={<Navigation className="h-5 w-5" />} accent="secondary" />
        <StatCard label="ETA" value={`${bus?.etaMinutes ?? 0} min`} icon={<Clock className="h-5 w-5" />} accent="accent" />
        <StatCard label="Bus" value={child?.busId ?? '—'} icon={<Bus className="h-5 w-5" />} accent="success" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Live Journey</CardTitle><CardDescription>{child?.name} current trip status</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-success/30 bg-success/5 p-4"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Pickup Confirmed</p><p className="mt-1 font-semibold">{child?.pickupStop}</p><p className="text-xs text-muted-foreground">Boarded at 07:09</p></div>
              <div className="rounded-xl border border-border bg-muted/30 p-4"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Drop Pending</p><p className="mt-1 font-semibold">{child?.dropStop}</p><p className="text-xs text-muted-foreground">Expected ~16:40</p></div>
            </div>
            <JourneyProgress progress={journey?.progress ?? 0} status={`Bus en route to ${bus?.nextStop}`} />
            <ETACountdown seconds={journey?.etaSeconds ?? 0} label="Drop ETA" />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <AISummaryCard severity="low" message={`${child?.name} boarded safely at ${child?.pickupStop}. The bus is on schedule and will reach ${child?.dropStop} in approximately ${bus?.etaMinutes} minutes.`} />
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(notifs ?? []).slice(0, 3).map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-muted"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-sm font-medium leading-tight">{n.title}</p><p className="text-xs text-muted-foreground">{n.message}</p></div></div>
              ))}
              <Link to="/parent/notifications" className="block pt-1 text-center text-xs font-medium text-primary hover:underline">View all</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChildTransportCard parentId={parent?.id ?? 'par-01'} />

      {childSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /> Child Transport Schedule</CardTitle>
            <CardDescription>{childSchedule.childName} ({childSchedule.childRegisterNo}) — assigned transport timetable</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Bus className="h-3.5 w-3.5 text-primary" /> Assigned Bus</p><p className="mt-0.5 font-semibold">{childSchedule.busId}</p></div>
              <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5 text-secondary" /> Driver</p><p className="mt-0.5 font-semibold">{childSchedule.driverName}</p><p className="text-xs text-muted-foreground">{childSchedule.driverPhone}</p></div>
              <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Navigation className="h-3.5 w-3.5 text-accent" /> Route</p><p className="mt-0.5 font-semibold text-sm">{childSchedule.routeName}</p></div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-warning"><Sunrise className="h-4 w-4" /> Morning Pickup</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Pickup Stop:</span><span className="font-semibold">{childSchedule.pickupStop}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Scheduled Time:</span><span className="font-mono font-semibold">{childSchedule.pickupScheduledTime}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Bus Waiting Duration:</span><span className="font-mono font-semibold">{childSchedule.pickupWaitingDuration} minutes</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">College Arrival:</span><span className="font-mono font-semibold">{childSchedule.collegeArrival}</span></div>
                </div>
              </div>
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-secondary"><Sunset className="h-4 w-4" /> Evening Drop</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">College Departure:</span><span className="font-mono font-semibold">{childSchedule.eveningDeparture}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Drop Stop:</span><span className="font-semibold">{childSchedule.dropStop}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expected Home Arrival:</span><span className="font-mono font-semibold">{childSchedule.eveningDropArrival}</span></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-success" /> Safety Information</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-card p-3">
                  <p className="text-xs font-medium text-muted-foreground">Pickup</p>
                  <div className="mt-1 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Scheduled:</span><span className="font-mono">{childSchedule.pickupScheduledTime}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Actual:</span><span className="font-mono">{childSchedule.pickupActualTime}</span></div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', childSchedule.pickupStatus === 'completed' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning')}>
                        {childSchedule.pickupStatus === 'completed' && <CheckCircle2 className="h-3 w-3" />} {childSchedule.pickupStatus.charAt(0).toUpperCase() + childSchedule.pickupStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-card p-3">
                  <p className="text-xs font-medium text-muted-foreground">College Arrival</p>
                  <div className="mt-1 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Scheduled:</span><span className="font-mono">{childSchedule.collegeArrival}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Actual:</span><span className="font-mono">{childSchedule.collegeArrivalActual}</span></div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', childSchedule.arrivalStatus === 'completed' ? 'bg-success/15 text-success' : childSchedule.arrivalStatus === 'in-progress' ? 'bg-primary/15 text-primary' : 'bg-warning/15 text-warning')}>
                        {childSchedule.arrivalStatus === 'completed' && <CheckCircle2 className="h-3 w-3" />} {childSchedule.arrivalStatus === 'in-progress' ? 'In Progress' : childSchedule.arrivalStatus.charAt(0).toUpperCase() + childSchedule.arrivalStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                {childSchedule.pickupActualTime > childSchedule.pickupScheduledTime ? <TrendingUp className="h-3 w-3 text-warning" /> : <TrendingDown className="h-3 w-3 text-success" />}
                <span>Pickup was {childSchedule.pickupActualTime > childSchedule.pickupScheduledTime ? '2 min late' : 'on time'} · College arrival {childSchedule.collegeArrivalActual > childSchedule.collegeArrival ? '2 min late' : 'on time'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Navigation className="h-4 w-4 text-primary" /> Child Safety Timeline</CardTitle><CardDescription>Complete journey tracking from home to college and back</CardDescription></CardHeader>
          <CardContent><JourneyTimeline events={events ?? []} /></CardContent>
        </Card>
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-semibold">Track your child live</p><p className="text-sm text-muted-foreground">Open the live map to follow the bus in real time.</p></div>
            <Link to="/parent/tracking"><Button>Open Live Tracking</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
