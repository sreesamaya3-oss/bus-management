import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Send, Bus, Users, History } from 'lucide-react';
import { ratingService, driverService, busService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea, Label, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function StudentRatings() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [target, setTarget] = useState('drv-01');
  const { data: ratings } = useQuery({ queryKey: ['student-ratings', user?.id], queryFn: () => ratingService.forStudent(user?.id ?? 'stu-01') });
  const { data: drivers } = useQuery({ queryKey: ['drivers'], queryFn: driverService.list });
  const { data: buses } = useQuery({ queryKey: ['buses'], queryFn: busService.list });
  const create = useMutation({ mutationFn: ratingService.create, onSuccess: () => { qc.invalidateQueries({ queryKey: ['student-ratings'] }); setOpen(false); setComment(''); setStars(5); } });

  const submit = () => {
    const isDriver = target.startsWith('drv');
    const driver = isDriver ? drivers?.find((d) => d.id === target) : undefined;
    const bus = !isDriver ? buses?.find((b) => b.id === target) : undefined;
    const targetName = driver?.name ?? bus?.id ?? '';
    create.mutate({ studentId: user?.id ?? 'stu-01', studentName: user?.name ?? 'S. Kavin', targetType: isDriver ? 'driver' : 'bus', targetId: target, targetName, stars, comment });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Ratings & Feedback" subtitle="Rate your driver and bus experience" action={<Button onClick={() => setOpen(true)}><Star className="h-4 w-4" /> Give Rating</Button>} />
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Your Ratings</CardTitle></CardHeader>
        <CardContent>
          {ratings?.length ? (
            <div className="space-y-3">
              {ratings.map((r) => (
                <div key={r.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">{r.targetType === 'driver' ? <Users className="h-4 w-4 text-primary" /> : <Bus className="h-4 w-4 text-secondary" />}<p className="font-semibold">{r.targetName}</p></div>
                    <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cn('h-4 w-4', n <= r.stars ? 'fill-warning text-warning' : 'text-muted-foreground/30')} />)}</div>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-muted-foreground">"{r.comment}"</p>}
                  <p className="mt-2 text-xs text-muted-foreground">{r.createdAt}</p>
                </div>
              ))}
            </div>
          ) : <EmptyState icon={<Star className="h-8 w-8" />} title="No ratings yet" description="Share your experience to help improve service." />}
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Give a Rating" description="Rate your driver or bus ride.">
        <div className="space-y-4">
          <div><Label htmlFor="target">Rate</Label><Select id="target" value={target} onChange={(e) => setTarget(e.target.value)}><optgroup label="Drivers">{drivers?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup><optgroup label="Buses">{buses?.map((b) => <option key={b.id} value={b.id}>{b.id}</option>)}</optgroup></Select></div>
          <div><Label>Stars</Label><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" onClick={() => setStars(n)} className="focus-ring rounded p-1"><Star className={cn('h-7 w-7 transition-colors', n <= stars ? 'fill-warning text-warning' : 'text-muted-foreground/40 hover:text-warning/60')} /></button>)}</div></div>
          <div><Label htmlFor="comment">Comment (optional)</Label><Textarea id="comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience…" /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} disabled={create.isPending}>{create.isPending ? 'Submitting…' : <><Send className="h-4 w-4" /> Submit</>}</Button></div>
        </div>
      </Modal>
    </div>
  );
}
