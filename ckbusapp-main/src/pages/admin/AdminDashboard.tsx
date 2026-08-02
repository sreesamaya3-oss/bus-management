import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bus, Users, GraduationCap, Route as RouteIcon, TrendingUp, AlertTriangle, Clock, Sparkles, Megaphone, Activity, Wrench, Circle, ArrowRight } from 'lucide-react';
import { busService, routeService, studentService, driverService, complaintService, leaveService, announcementService, analyticsService, journeyService, scheduleService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OperationsStatus } from '@/components/shared/OperationsStatus';
import { AISummaryCard } from '@/components/shared/AISummaryCard';
import { SectionHeader } from '@/components/ui/EmptyState';
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Legend, RadialBarChart, RadialBar } from 'recharts';
import { cn } from '@/lib/utils';

const statusConfig = {
  'in-transit': { dot: 'bg-success', label: 'Running', text: 'text-success' },
  'on-time': { dot: 'bg-success', label: 'On Time', text: 'text-success' },
  delayed: { dot: 'bg-warning', label: 'Delayed', text: 'text-warning' },
  maintenance: { dot: 'bg-destructive', label: 'Maintenance', text: 'text-destructive' },
  idle: { dot: 'bg-muted-foreground', label: 'Offline', text: 'text-muted-foreground' },
};

export default function AdminDashboard() {
  const { data: buses } = useQuery({ queryKey: ['buses'], queryFn: busService.list });
  const { data: routes } = useQuery({ queryKey: ['routes'], queryFn: routeService.list });
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: studentService.list });
  const { data: drivers } = useQuery({ queryKey: ['drivers'], queryFn: driverService.list });
  const { data: complaints } = useQuery({ queryKey: ['all-complaints'], queryFn: complaintService.all });
  const { data: leaves } = useQuery({ queryKey: ['all-leaves'], queryFn: leaveService.all });
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.list });
  const { data: weekly } = useQuery({ queryKey: ['weekly-attendance'], queryFn: analyticsService.weeklyAttendance });
  const { data: routePerf } = useQuery({ queryKey: ['route-perf'], queryFn: analyticsService.routePerformance });
  const { data: ai } = useQuery({ queryKey: ['ai-insights'], queryFn: analyticsService.aiInsights });
  const { data: operations } = useQuery({ queryKey: ['operations'], queryFn: journeyService.operations });
  const { data: schedules } = useQuery({ queryKey: ['schedules'], queryFn: scheduleService.list });

  const activeBuses = buses?.filter((b) => b.status === 'in-transit' || b.status === 'on-time').length ?? 0;
  const delayedBuses = buses?.filter((b) => b.status === 'delayed').length ?? 0;
  const maintBuses = buses?.filter((b) => b.status === 'maintenance').length ?? 0;
  const openComplaints = complaints?.filter((c) => c.status === 'open' || c.status === 'in-progress').length ?? 0;
  const pendingLeaves = leaves?.filter((l) => l.status === 'pending').length ?? 0;
  const onTimeRate = routePerf?.length ? Math.round(routePerf.reduce((acc, r) => acc + r.onTime, 0) / routePerf.length) : 0;
  const radialData = [{ name: 'On-time', value: onTimeRate, fill: 'hsl(var(--primary))' }];
  const conflicts = (schedules ?? []).filter((s) => s.hasConflict).length;

  return (
    <div className="space-y-6">
      <SectionHeader title="Transport Control Center" subtitle="Real-time fleet monitoring and operations overview" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card glass className="lg:col-span-2">
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <FleetStat label="Running" value={activeBuses} dot="bg-success" icon={<Activity className="h-4 w-4" />} />
            <FleetStat label="Delayed" value={delayedBuses} dot="bg-warning" icon={<Clock className="h-4 w-4" />} />
            <FleetStat label="Maintenance" value={maintBuses} dot="bg-destructive" icon={<Wrench className="h-4 w-4" />} />
            <FleetStat label="Offline" value={0} dot="bg-muted-foreground" icon={<Circle className="h-4 w-4" />} />
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center gap-3"><Sparkles className="h-8 w-8 text-primary" /><div><p className="text-xs text-muted-foreground">AI On-time Prediction</p><p className="font-display text-2xl font-bold">{onTimeRate}%</p></div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={students?.length ?? 0} icon={<GraduationCap className="h-5 w-5" />} accent="primary" trend="+12 this term" trendUp />
        <StatCard label="Total Buses" value={buses?.length ?? 0} icon={<Bus className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Active Routes" value={routes?.filter((r) => r.active).length ?? 0} icon={<RouteIcon className="h-5 w-5" />} accent="accent" />
        <StatCard label="Drivers" value={drivers?.length ?? 0} icon={<Users className="h-5 w-5" />} accent="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Fleet Status</CardTitle>
            <CardDescription>Real-time status of all buses — click to view details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {buses?.map((b) => {
              const cfg = statusConfig[b.status] ?? statusConfig.idle;
              return (
                <Link key={b.id} to="/admin/fleet" className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><Bus className={cn('h-5 w-5', cfg.text)} /><span className={cn('absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full ring-2 ring-card', cfg.dot)} /></div>
                    <div><p className="text-sm font-semibold">{b.id}</p><p className="text-xs text-muted-foreground">{b.routeName}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block"><p className="text-xs text-muted-foreground">Speed</p><p className="font-mono text-sm font-semibold">{b.speed} km/h</p></div>
                    <span className="text-xs text-muted-foreground">{b.occupied}/{b.capacity}</span>
                    <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', `bg-${cfg.text.replace('text-', '')}/15`, cfg.text)}>
                      {cfg.label}{b.status === 'delayed' && ` ${b.etaMinutes}m`}
                    </span>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
        <OperationsStatus operations={operations ?? []} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Weekly Attendance</CardTitle><CardDescription>Present vs absent students this week</CardDescription></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="present" stackId="a" fill="hsl(var(--primary))" />
                  <Bar dataKey="absent" stackId="a" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>On-time Performance</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={radialData} startAngle={90} endAngle={90 - (onTimeRate / 100) * 360}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="-mt-28 font-display text-3xl font-bold">{onTimeRate}%</p>
            <p className="mt-12 text-xs text-muted-foreground">Average across all routes this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI Insights</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {ai?.slice(0, 3).map((i) => (
              <div key={i.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold">{i.title}</p><Badge tone={i.severity === 'high' ? 'destructive' : i.severity === 'medium' ? 'warning' : 'success'} className="capitalize">{i.severity}</Badge></div>
                <p className="mt-1 text-xs text-muted-foreground">{i.insight}</p>
              </div>
            ))}
            <Link to="/admin/ai" className="block text-center text-xs font-medium text-primary hover:underline">View all insights</Link>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <AISummaryCard severity="medium" message={`${conflicts} scheduling conflict${conflicts !== 1 ? 's' : ''} detected. Route B has recurring delays and Saturday attendance is dropping. Consider schedule adjustments.`} />
          <Card>
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link to="/admin/fleet"><Button variant="outline" size="sm">Fleet Control</Button></Link>
              <Link to="/admin/schedules"><Button variant="outline" size="sm">Schedules</Button></Link>
              <Link to="/admin/assignment"><Button variant="outline" size="sm">Assign Student</Button></Link>
              <Link to="/admin/leaves"><Button variant="outline" size="sm">Leaves ({pendingLeaves})</Button></Link>
              <Link to="/admin/complaints"><Button variant="outline" size="sm">Complaints ({openComplaints})</Button></Link>
              <Link to="/admin/driver-availability"><Button variant="outline" size="sm">Drivers</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="font-semibold">Daily Operations Workflow</p><p className="text-sm text-muted-foreground">Morning fleet prep → Boarding → Transit → College → Evening return → Daily report</p></div>
          <Link to="/admin/fleet"><Button>Open Fleet Control <ArrowRight className="h-4 w-4" /></Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}

function FleetStat({ label, value, dot, icon }: { label: string; value: number; dot: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/30 p-3">
      <div className="flex items-center gap-2">
        <span className={cn('h-2.5 w-2.5 rounded-full', dot)} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
