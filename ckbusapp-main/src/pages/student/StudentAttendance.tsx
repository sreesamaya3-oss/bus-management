import { useQuery } from '@tanstack/react-query';
import { QrCode, CheckCircle2, XCircle, CalendarClock, History } from 'lucide-react';
import { attendanceService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { QRCode } from '@/components/shared/QRCode';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';

export default function StudentAttendance() {
  const { user } = useAuthStore();
  const { data: records } = useQuery({ queryKey: ['student-attendance', user?.id], queryFn: () => attendanceService.forStudent(user?.id ?? 'stu-01') });
  const today = records?.find((r) => r.date === '2026-07-27');
  const present = records?.filter((r) => r.status === 'present').length ?? 0;
  const absent = records?.filter((r) => r.status === 'absent').length ?? 0;
  const rate = records?.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader title="Attendance" subtitle="QR boarding and your attendance history" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Attendance Rate" value={`${rate}%`} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" />
        <StatCard label="Days Present" value={present} icon={<CheckCircle2 className="h-5 w-5" />} accent="primary" />
        <StatCard label="Days Absent" value={absent} icon={<XCircle className="h-5 w-5" />} accent="destructive" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>QR Boarding</CardTitle><CardDescription>Present this code to the driver while boarding</CardDescription></CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <div className="rounded-2xl border-2 border-primary/30 bg-white p-4 shadow-glow"><QRCode value={`CKCET|${user?.id ?? 'stu-01'}|2026-07-27`} size={180} /></div>
            <Badge tone="primary"><QrCode className="h-3 w-3" /> Ready to scan</Badge>
            <p className="text-center text-xs text-muted-foreground">Your boarding QR refreshes daily. The driver scans it to mark you present.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Today Attendance</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {today ? (
              <>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${today.status === 'present' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>{today.status === 'present' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}</div>
                    <div><p className="font-semibold capitalize">{today.status}</p><p className="text-xs text-muted-foreground">{today.date}</p></div>
                  </div>
                  <Badge tone={today.status === 'present' ? 'success' : 'destructive'}>{today.method.toUpperCase()}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Boarding Time</p><p className="font-mono text-lg font-bold">{today.boardingTime ?? '—'}</p></div>
                  <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Drop Time</p><p className="font-mono text-lg font-bold">{today.dropTime ?? 'Pending'}</p></div>
                </div>
              </>
            ) : <EmptyState icon={<CalendarClock className="h-8 w-8" />} title="No record today" description="Board the bus and scan your QR to mark attendance." />}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Attendance History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {records?.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${r.status === 'present' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>{r.status === 'present' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}</div>
                  <div><p className="text-sm font-medium">{r.date}</p><p className="text-xs text-muted-foreground">Bus {r.busId} · {r.method.toUpperCase()}</p></div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">Board: {r.boardingTime ?? '—'}</span>
                  <span className="text-muted-foreground">Drop: {r.dropTime ?? '—'}</span>
                  <Badge tone={r.status === 'present' ? 'success' : 'destructive'}>{r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
