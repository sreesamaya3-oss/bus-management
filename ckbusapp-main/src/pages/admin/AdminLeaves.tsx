import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { leaveService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import type { LeaveRequest } from '@/lib/types';

export default function AdminLeaves() {
  const { data: leaves } = useQuery({ queryKey: ['all-leaves'], queryFn: leaveService.all });
  const statusTone = (s: string) => s === 'approved' ? 'success' : s === 'rejected' ? 'destructive' : 'warning';
  const statusIcon = (s: string) => s === 'approved' ? <CheckCircle2 className="h-3 w-3" /> : s === 'rejected' ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />;
  return (
    <div className="space-y-6">
      <SectionHeader title="Leave Request Management" subtitle="Review and approve student transport leave requests" />
      <Card>
        <CardContent className="space-y-3 p-3">
          {(leaves ?? []).length ? (leaves ?? []).map((l: LeaveRequest) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="font-semibold">{l.studentName}</p><Badge tone="outline" className="capitalize">{l.type}</Badge></div>
                <p className="mt-1 text-sm">{l.fromDate} → {l.toDate}</p>
                <p className="text-sm text-muted-foreground">{l.reason}</p>
                <p className="mt-1 text-xs text-muted-foreground">Applied {l.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                {l.status === 'pending' ? (<><Button size="sm" variant="outline" className="text-destructive">Reject</Button><Button size="sm">Approve</Button></>) : <Badge tone={statusTone(l.status)}>{statusIcon(l.status)} <span className="capitalize">{l.status}</span></Badge>}
              </div>
            </div>
          )) : <EmptyState icon={<CalendarPlus className="h-8 w-8" />} title="No leave requests" description="All caught up." />}
        </CardContent>
      </Card>
    </div>
  );
}
