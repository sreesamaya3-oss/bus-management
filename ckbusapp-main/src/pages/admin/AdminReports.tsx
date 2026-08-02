import { useState } from 'react';
import { FileText, Calendar, Download, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';

type Period = 'daily' | 'weekly' | 'monthly';
const reportData: Record<Period, { totalTrips: number; onTimeTrips: number; delayedTrips: number; attendanceRate: number; complaintsResolved: number; fuelCost: number }> = {
  daily: { totalTrips: 8, onTimeTrips: 6, delayedTrips: 2, attendanceRate: 92, complaintsResolved: 1, fuelCost: 4200 },
  weekly: { totalTrips: 48, onTimeTrips: 38, delayedTrips: 10, attendanceRate: 89, complaintsResolved: 5, fuelCost: 28400 },
  monthly: { totalTrips: 488, onTimeTrips: 396, delayedTrips: 92, attendanceRate: 87, complaintsResolved: 22, fuelCost: 168000 },
};

export default function AdminReports() {
  const [period, setPeriod] = useState<Period>('weekly');
  const r = reportData[period];
  const periods: { key: Period; label: string }[] = [{ key: 'daily', label: 'Daily' }, { key: 'weekly', label: 'Weekly' }, { key: 'monthly', label: 'Monthly' }];
  return (
    <div className="space-y-6">
      <SectionHeader title="Reports" subtitle="Generate transport performance reports" action={<Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export PDF</Button>} />
      <div className="flex gap-2">
        {periods.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${period === p.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}><Calendar className="h-4 w-4" /> {p.label}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Trips" value={r.totalTrips} icon={<FileText className="h-5 w-5" />} accent="primary" />
        <StatCard label="On-time Trips" value={r.onTimeTrips} icon={<TrendingUp className="h-5 w-5" />} accent="success" />
        <StatCard label="Delayed Trips" value={r.delayedTrips} icon={<FileText className="h-5 w-5" />} accent="warning" />
        <StatCard label="Attendance Rate" value={`${r.attendanceRate}%`} icon={<TrendingUp className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Complaints Resolved" value={r.complaintsResolved} icon={<FileText className="h-5 w-5" />} accent="accent" />
        <StatCard label="Fuel Cost" value={`Rs ${r.fuelCost.toLocaleString('en-IN')}`} icon={<FileText className="h-5 w-5" />} accent="destructive" />
      </div>
      <Card>
        <CardHeader><CardTitle>{periods.find((p) => p.key === period)?.label} Report Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Row label="Report Period" value={periods.find((p) => p.key === period)?.label ?? ''} />
          <Row label="On-time Percentage" value={`${Math.round((r.onTimeTrips / r.totalTrips) * 100)}%`} />
          <Row label="Average Attendance" value={`${r.attendanceRate}%`} />
          <Row label="Complaints Resolution Rate" value="85%" />
          <Row label="Total Fuel Expense" value={`Rs ${r.fuelCost.toLocaleString('en-IN')}`} />
          <Row label="Cost per Trip" value={`Rs ${Math.round(r.fuelCost / r.totalTrips).toLocaleString('en-IN')}`} />
          <div className="flex items-center justify-between border-b border-border/60 py-2"><span className="text-muted-foreground">Status</span><Badge tone={r.delayedTrips > r.onTimeTrips * 0.3 ? 'warning' : 'success'}>{r.delayedTrips > r.onTimeTrips * 0.3 ? 'Needs Attention' : 'Healthy'}</Badge></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
        <CardContent><ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground"><li>Route B has the highest delay rate — consider revising pickup times.</li><li>Saturday attendance is consistently lower — review weekend demand.</li><li>Fuel costs are within budget; maintain current routing efficiency.</li><li>Complaint resolution improved 15% vs last period.</li></ul></CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-border/60 py-2 last:border-0"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>;
}
