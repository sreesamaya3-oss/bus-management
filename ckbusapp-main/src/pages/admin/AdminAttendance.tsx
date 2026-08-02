import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react';
import { attendanceService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import type { AttendanceRecord } from '@/lib/types';

export default function AdminAttendance() {
  const { data: records } = useQuery({ queryKey: ['all-attendance'], queryFn: attendanceService.all });
  const present = records?.filter((r) => r.status === 'present').length ?? 0;
  const absent = records?.filter((r) => r.status === 'absent').length ?? 0;
  const rate = records?.length ? Math.round((present / records.length) * 100) : 0;
  return (
    <div className="space-y-6">
      <SectionHeader title="Attendance Management" subtitle="Track boarding attendance across all buses" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Attendance Rate" value={`${rate}%`} icon={<ClipboardCheck className="h-5 w-5" />} accent="success" />
        <StatCard label="Present" value={present} icon={<CheckCircle2 className="h-5 w-5" />} accent="primary" />
        <StatCard label="Absent" value={absent} icon={<XCircle className="h-5 w-5" />} accent="destructive" />
      </div>
      <Card>
        <CardHeader><CardTitle>Attendance Records</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Register No</th><th className="px-4 py-3 font-medium">Bus</th><th className="px-4 py-3 font-medium">Date</th><th className="px-4 py-3 font-medium">Boarding</th><th className="px-4 py-3 font-medium">Drop</th><th className="px-4 py-3 font-medium">Method</th><th className="px-4 py-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {records?.map((r: AttendanceRecord) => (
                  <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{r.studentName}</td>
                    <td className="px-4 py-3 font-mono">{r.registerNo}</td>
                    <td className="px-4 py-3">{r.busId}</td>
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3 font-mono">{r.boardingTime ?? '—'}</td>
                    <td className="px-4 py-3 font-mono">{r.dropTime ?? '—'}</td>
                    <td className="px-4 py-3"><Badge tone="outline">{r.method.toUpperCase()}</Badge></td>
                    <td className="px-4 py-3"><Badge tone={r.status === 'present' ? 'success' : 'destructive'} className="capitalize">{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
