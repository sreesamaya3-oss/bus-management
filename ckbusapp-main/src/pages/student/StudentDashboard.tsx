import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Route as RouteIcon, Users, MapPin, Clock, QrCode, CalendarPlus, MessageSquareWarning, Star, Bell, Sparkles, TrendingUp, Navigation, CalendarClock } from 'lucide-react';
import { studentService, busService, routeService, driverService, journeyService, notificationService, timetableService } from '@/lib/services';
import { TodayTransportAssignment } from '@/components/shared/TodayTransportAssignment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LiveClock } from '@/components/shared/LiveClock';
import { ETACountdown } from '@/components/shared/ETACountdown';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { JourneyTimeline } from '@/components/shared/JourneyTimeline';
import { ScheduleCountdown } from '@/components/shared/ScheduleCountdown';
import { WeatherCard } from '@/components/shared/WeatherCard';
import { AISummaryCard } from '@/components/shared/AISummaryCard';
import { SectionHeader } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';

const quickActions = [
  { label: 'Track Bus', to: '/student/tracking', icon: MapPin, tone: 'primary' },
  { label: 'Show Pass', to: '/student/pass', icon: QrCode, tone: 'secondary' },
  { label: 'Mark Attendance', to: '/student/attendance', icon: QrCode, tone: 'accent' },
  { label: 'Apply Leave', to: '/student/leave', icon: CalendarPlus, tone: 'warning' },
  { label: 'Complaint', to: '/student/complaints', icon: MessageSquareWarning, tone: 'destructive' },
  { label: 'Rate Driver', to: '/student/ratings', icon: Star, tone: 'primary' },
] as const;

const toneMap: Record<string, string> = {
  primary: 'bg-primary/15 text-primary', secondary: 'bg-secondary/15 text-secondary',
  accent: 'bg-accent/15 text-accent', warning: 'bg-warning/15 text-warning', destructive: 'bg-destructive/15 text-destructive',
};

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { data: me } = useQuery({ queryKey: ['student-me'], queryFn: studentService.me });
  const { data: bus } = useQuery({ queryKey: ['student-bus', me?.busId], queryFn: () => busService.get(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const { data: route } = useQuery({ queryKey: ['student-route', me?.routeId], queryFn: () => routeService.get(me?.routeId ?? 'route-01'), enabled: !!me });
  const { data: driver } = useQuery({ queryKey: ['student-driver', bus?.driverId], queryFn: () => driverService.get(bus?.driverId ?? 'drv-01'), enabled: !!bus });
  const { data: journey } = useQuery({ queryKey: ['student-journey', me?.busId], queryFn: () => journeyService.current(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const { data: notifs } = useQuery({ queryKey: ['notifications'], queryFn: notificationService.list });
  const { data: events } = useQuery({ queryKey: ['journey-events'], queryFn: journeyService.events });
  const { data: mySchedule } = useQuery({ queryKey: ['student-schedule', me?.id], queryFn: () => timetableService.forStudent(me?.id ?? 'stu-01'), enabled: !!me });
  const firstName = (user?.name ?? me?.name ?? 'Student').split(' ')[0];

  return (
    <div className="space-y-6">
      <SectionHeader title={`Welcome back, ${firstName}`} subtitle="Here is your transport overview for today." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card glass className="lg:col-span-2">
          <CardContent className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <LiveClock />
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary"><Bus className="h-6 w-6" /></div>
              <div><p className="text-xs text-muted-foreground">Today Bus</p><p className="font-display text-lg font-bold">{me?.busId ?? 'CKCET-01'}</p><p className="text-xs text-muted-foreground">{bus?.routeName}</p></div>
            </div>
          </CardContent>
        </Card>
        <WeatherCard />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Assigned Route" value={route?.name.split('—')[0] ?? '—'} icon={<RouteIcon className="h-5 w-5" />} accent="primary" />
        <StatCard label="Pickup Stop" value={me?.pickupStop ?? '—'} icon={<MapPin className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Drop Stop" value={me?.dropStop ?? '—'} icon={<MapPin className="h-5 w-5" />} accent="accent" />
        <StatCard label="Driver" value={driver?.name.split(' ').slice(-1)[0] ?? '—'} icon={<Users className="h-5 w-5" />} accent="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Today Journey</CardTitle><CardDescription>Live status of your assigned bus</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={journey?.status === 'in-transit' ? 'success' : 'warning'}>{journey?.status === 'in-transit' ? 'In Transit' : journey?.status?.replace('-', ' ') ?? '—'}</Badge>
              <Badge tone="outline"><Clock className="h-3 w-3" /> ETA {bus?.etaMinutes ?? 0} min</Badge>
              <Badge tone="outline">Current: {bus?.currentStop}</Badge>
              <Badge tone="outline">Next: {bus?.nextStop}</Badge>
              <Badge tone="outline"><Navigation className="h-3 w-3" /> {bus?.speed ?? 0} km/h</Badge>
            </div>
            <JourneyProgress progress={journey?.progress ?? 0} status={`Bus at ${bus?.currentStop}, heading to ${bus?.nextStop}`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ETACountdown seconds={journey?.etaSeconds ?? 0} label="Arrival Countdown" />
              <div className="flex flex-col justify-between rounded-xl border border-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">AI Delay Prediction</p>
                <p className="mt-1 font-display text-2xl font-bold text-warning">+{journey?.aiDelayPrediction ?? 0} min</p>
                <p className="text-xs text-muted-foreground">Traffic-heavy near {bus?.nextStop}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <AISummaryCard severity="medium" message={`Your bus ${me?.busId} is predicted to arrive ${journey?.aiDelayPrediction ?? 0} minutes late today due to morning traffic near ${bus?.nextStop}. Consider leaving for your stop 5 minutes earlier.`} />
          <Card>
            <CardHeader><CardTitle className="text-base">Today Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(notifs ?? []).slice(0, 3).map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-muted">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${n.type === 'warning' ? 'bg-warning/15 text-warning' : n.type === 'success' ? 'bg-success/15 text-success' : n.type === 'emergency' ? 'bg-destructive/15 text-destructive' : n.type === 'complaint' ? 'bg-accent/15 text-accent' : n.type === 'leave' ? 'bg-secondary/15 text-secondary' : 'bg-secondary/15 text-secondary'}`}><Bell className="h-3.5 w-3.5" /></div>
                  <div><p className="text-sm font-medium leading-tight">{n.title}</p><p className="text-xs text-muted-foreground">{n.message}</p></div>
                </div>
              ))}
              <Link to="/student/notifications" className="block pt-1 text-center text-xs font-medium text-primary hover:underline">View all</Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <TodayTransportAssignment studentId={me?.id ?? 'stu-01'} />

      <div className="grid gap-4 lg:grid-cols-2">
          <SectionHeader title="Quick Actions" subtitle="Jump to common tasks" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickActions.map(({ label, to, icon: Icon, tone }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={to}>
                  <Card hover className="h-full">
                    <CardContent className="flex flex-col items-center gap-2 py-5 text-center">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneMap[tone]}`}><Icon className="h-5 w-5" /></div>
                      <span className="text-xs font-medium">{label}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <Card className="mt-3">
            <CardContent className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <p className="text-sm text-muted-foreground">AI assistant: Your bus is <strong className="text-foreground">{journey?.progress ?? 0}% through</strong> its route. You will reach <strong className="text-foreground">{me?.dropStop}</strong> in ~<strong className="text-foreground">{bus?.etaMinutes} min</strong>.</p>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
