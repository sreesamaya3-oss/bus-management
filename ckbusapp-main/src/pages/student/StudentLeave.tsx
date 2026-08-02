import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarPlus, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { leaveService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  fromDate: z.string().min(1, 'Select start date'),
  toDate: z.string().min(1, 'Select end date'),
  reason: z.string().min(5, 'Please describe your reason'),
  type: z.enum(['sick', 'personal', 'exam', 'other']),
});
type FormData = z.infer<typeof schema>;

export default function StudentLeave() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: leaves } = useQuery({ queryKey: ['student-leaves', user?.id], queryFn: () => leaveService.forStudent(user?.id ?? 'stu-01') });
  const create = useMutation({ mutationFn: (data: Partial<FormData> & { studentId: string; studentName: string }) => leaveService.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['student-leaves'] }); setOpen(false); } });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    create.mutate({ ...data, studentId: user?.id ?? 'stu-01', studentName: user?.name ?? 'S. Kavin' });
    reset();
  };
  const statusTone = (s: string) => s === 'approved' ? 'success' : s === 'rejected' ? 'destructive' : 'warning';
  const statusIcon = (s: string) => s === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : s === 'rejected' ? <XCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />;

  return (
    <div className="space-y-6">
      <SectionHeader title="Leave Request" subtitle="Apply for transport leave and track its status" action={<Button onClick={() => setOpen(true)}><CalendarPlus className="h-4 w-4" /> Apply Leave</Button>} />
      <Card>
        <CardHeader><CardTitle>Your Leave Requests</CardTitle><CardDescription>History of all transport leave applications</CardDescription></CardHeader>
        <CardContent>
          {leaves?.length ? (
            <div className="space-y-3">
              {leaves.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <div className="flex items-center gap-2"><p className="font-semibold">{l.fromDate} → {l.toDate}</p><Badge tone="outline" className="capitalize">{l.type}</Badge></div>
                    <p className="mt-1 text-sm text-muted-foreground">{l.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Applied {l.createdAt}{l.reviewedBy ? ` · Reviewed by ${l.reviewedBy}` : ''}</p>
                  </div>
                  <Badge tone={statusTone(l.status)}>{statusIcon(l.status)} <span className="capitalize">{l.status}</span></Badge>
                </div>
              ))}
            </div>
          ) : <EmptyState icon={<CalendarPlus className="h-8 w-8" />} title="No leave requests" description="Click Apply Leave to submit your first request." />}
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Apply for Transport Leave" description="Your request will be reviewed by the Transport Office.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="from">From Date</Label><Input id="from" type="date" {...register('fromDate')} />{errors.fromDate && <p className="mt-1 text-xs text-destructive">{errors.fromDate.message}</p>}</div>
            <div><Label htmlFor="to">To Date</Label><Input id="to" type="date" {...register('toDate')} />{errors.toDate && <p className="mt-1 text-xs text-destructive">{errors.toDate.message}</p>}</div>
          </div>
          <div><Label htmlFor="type">Leave Type</Label><Select id="type" {...register('type')}><option value="sick">Sick</option><option value="personal">Personal</option><option value="exam">Exam</option><option value="other">Other</option></Select></div>
          <div><Label htmlFor="reason">Reason</Label><Textarea id="reason" rows={3} {...register('reason')} placeholder="Briefly describe your reason for leave" />{errors.reason && <p className="mt-1 text-xs text-destructive">{errors.reason.message}</p>}</div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={create.isPending}>{create.isPending ? 'Submitting…' : 'Submit Request'}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
