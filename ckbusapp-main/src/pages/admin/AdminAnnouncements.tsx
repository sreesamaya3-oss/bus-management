import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Megaphone, Info, AlertTriangle, Siren, Route as RouteIcon, Plus } from 'lucide-react';
import { announcementService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/constants';

const typeMap = {
  info: { icon: Info, tone: 'bg-secondary/15 text-secondary' },
  warning: { icon: AlertTriangle, tone: 'bg-warning/15 text-warning' },
  emergency: { icon: Siren, tone: 'bg-destructive/15 text-destructive' },
  'route-change': { icon: RouteIcon, tone: 'bg-primary/15 text-primary' },
};

export default function AdminAnnouncements() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.list });
  const create = useMutation({ mutationFn: announcementService.create, onSuccess: () => { qc.invalidateQueries({ queryKey: ['announcements'] }); setOpen(false); } });
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'emergency' | 'route-change'>('info');
  const [audience, setAudience] = useState<UserRole | 'all'>('all');
  const submit = (e: React.FormEvent) => { e.preventDefault(); create.mutate({ title, message, type, audience }); setTitle(''); setMessage(''); };

  return (
    <div className="space-y-6">
      <SectionHeader title="Announcement Management" subtitle="Publish notices to students, parents and drivers" action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New Announcement</Button>} />
      <Card>
        <CardContent className="space-y-3 p-3">
          {(announcements ?? []).length ? (announcements ?? []).map((a) => {
            const { icon: Icon, tone } = typeMap[a.type];
            return (
              <div key={a.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone)}><Icon className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{a.title}</p><div className="flex gap-1.5"><Badge tone="outline" className="capitalize">{a.type.replace('-', ' ')}</Badge><Badge tone="primary" className="capitalize">{a.audience}</Badge></div></div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{a.createdAt} · by {a.createdBy}</p>
                </div>
              </div>
            );
          }) : <EmptyState icon={<Megaphone className="h-8 w-8" />} title="No announcements" description="Create one to notify users." />}
        </CardContent>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="New Announcement" description="Notify selected audience instantly.">
        <form onSubmit={submit} className="space-y-4">
          <div><Label htmlFor="title">Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Announcement title" /></div>
          <div><Label htmlFor="message">Message</Label><Textarea id="message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Write your message…" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="type">Type</Label><Select id="type" value={type} onChange={(e) => setType(e.target.value as typeof type)}><option value="info">Info</option><option value="warning">Warning</option><option value="emergency">Emergency</option><option value="route-change">Route Change</option></Select></div>
            <div><Label htmlFor="audience">Audience</Label><Select id="audience" value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)}><option value="all">All</option><option value="student">Students</option><option value="parent">Parents</option><option value="driver">Drivers</option></Select></div>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={create.isPending}>{create.isPending ? 'Publishing…' : 'Publish'}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
