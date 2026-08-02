import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Bus, Users, Star } from 'lucide-react';
import { analyticsService, driverService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, LineChart, Line } from 'recharts';

export default function AdminAnalytics() {
  const { data: weekly } = useQuery({ queryKey: ['weekly-attendance'], queryFn: analyticsService.weeklyAttendance });
  const { data: routePerf } = useQuery({ queryKey: ['route-perf'], queryFn: analyticsService.routePerformance });
  const { data: monthly } = useQuery({ queryKey: ['monthly-trend'], queryFn: analyticsService.monthlyTrend });
  const { data: drivers } = useQuery({ queryKey: ['drivers'], queryFn: driverService.list });
  const totalTrips = monthly?.reduce((a, m) => a + m.trips, 0) ?? 0;
  const avgRating = drivers?.length ? (drivers.reduce((a, d) => a + d.rating, 0) / drivers.length).toFixed(2) : '0';
  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" subtitle="Transport performance and trends" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Trips (6mo)" value={totalTrips} icon={<Bus className="h-5 w-5" />} accent="primary" trend="+8%" trendUp />
        <StatCard label="Active Buses" value={drivers?.length ?? 0} icon={<BarChart3 className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Avg Driver Rating" value={`${avgRating}/5`} icon={<Star className="h-5 w-5" />} accent="accent" />
        <StatCard label="On-time Avg" value="81%" icon={<TrendingUp className="h-5 w-5" />} accent="success" trend="+3%" trendUp />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Trip & Complaint Trend</CardTitle><CardDescription>Last 6 months</CardDescription></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly}>
                  <defs><linearGradient id="tripsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Area type="monotone" dataKey="trips" stroke="hsl(var(--primary))" fill="url(#tripsGrad)" strokeWidth={2} />
                  <Line type="monotone" dataKey="complaints" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Route On-time Performance</CardTitle><CardDescription>On-time vs delayed %</CardDescription></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routePerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="route" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="onTime" stackId="a" fill="hsl(var(--success))" />
                  <Bar dataKey="delayed" stackId="a" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Weekly Attendance Pattern</CardTitle><CardDescription>Present vs absent by day</CardDescription></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="absent" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Driver Performance</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {drivers?.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><p className="font-semibold">{d.name}</p><p className="text-xs text-muted-foreground">{d.busId} · {d.experienceYears} yrs</p></div>
              <div className="flex items-center gap-3"><Badge tone="outline"><Users className="h-3 w-3" /> {d.busId}</Badge><span className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-warning text-warning" /> {d.rating}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
