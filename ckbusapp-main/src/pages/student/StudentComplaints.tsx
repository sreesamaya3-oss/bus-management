import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquareWarning, Plus, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { complaintService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  category: z.string().min(1, 'Select category'),
  subject: z.string().min(3, 'Enter a subject'),
  description: z.string().min(10, 'Describe your complaint'),
  priority: z.enum(['low', 'medium', 'high']),
});
type FormData = z.infer<typeof schema>;

export default function StudentComplaints() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: complaints } = useQuery({ queryKey: ['student-complaints', user?.id], queryFn: () => complaintService.forStudent(user?.id ?? 'stu-01') });
  const create = useMutation({ mutationFn: (data: Partial<FormData> & { studentId: string; studentName: string }) => complaintService.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['student-complaints'] }); setOpen(false); } });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = (data: FormData) => { create.mutate({ ...data, studentId: user?.id ?? 'stu-01', studentName: user?.name ?? 'S. Kavin' }); reset(); };
  const statusTone = (s: string) => s === 'resolved' || s === 'closed' ? 'success' : s === 'in-progress' ? 'secondary' : 'warning';

  return (
    <div className="space-y-6">
      <SectionHeader title="Complaint Portal" subtitle="Raise and track transport-related complaints" action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New Complaint</Button>} />
      <Card>
        <CardHeader><CardTitle>Your Complaints</CardTitle></CardHeader>
        <CardContent>
          {complaints?.length ? (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2"><Badge tone="outline">{c.category}</Badge><Badge tone={c.priority === 'high' ? 'destructive' : c.priority === 'medium' ? 'warning' : 'default'} className="capitalize">{c.priority}</Badge></div>
                    <Badge tone={statusTone(c.status)} className="capitalize">{c.status === 'resolved' || c.status === 'closed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{c.status}</Badge>
                  </div>
                  <p className="mt-2 font-semibold">{c.subject}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  {c.response && <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm"><p className="text-xs font-medium text-muted-foreground">Office response</p><p className="mt-0.5">{c.response}</p></div>}
                  <p className="mt-2 text-xs text-muted-foreground">Filed {c.createdAt}{c.resolvedAt ? ` · Resolved ${c.resolvedAt}` : ''}</p>
                </div>
              ))}
            </div>
          ) : <EmptyState icon={<MessageSquareWarning className="h-8 w-8" />} title="No complaints" description="You have not filed any complaints yet." />}
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="New Complaint" description="The Transport Office will respond within 2 working days.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="category">Category</Label><Select id="category" {...register('category')}><option value="">Select…</option><option value="Delay">Delay</option><option value="Cleanliness">Cleanliness</option><option value="Driver Behaviour">Driver Behaviour</option><option value="Safety">Safety</option><option value="Other">Other</option></Select>{errors.category && <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>}</div>
            <div><Label htmlFor="priority">Priority</Label><Select id="priority" {...register('priority')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></div>
          </div>
          <div><Label htmlFor="subject">Subject</Label><Input id="subject" {...register('subject')} placeholder="Brief subject" />{errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}</div>
          <div><Label htmlFor="description">Description</Label><Textarea id="description" rows={3} {...register('description')} placeholder="Describe the issue in detail" />{errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}</div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={create.isPending}>{create.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : 'Submit Complaint'}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
