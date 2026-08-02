import { useQuery } from '@tanstack/react-query';
import { Megaphone, Info, AlertTriangle, Siren, Route as RouteIcon } from 'lucide-react';
import { announcementService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const typeMap = {
  info: { icon: Info, tone: 'bg-secondary/15 text-secondary' },
  warning: { icon: AlertTriangle, tone: 'bg-warning/15 text-warning' },
  emergency: { icon: Siren, tone: 'bg-destructive/15 text-destructive' },
  'route-change': { icon: RouteIcon, tone: 'bg-primary/15 text-primary' },
};

export default function DriverAnnouncements() {
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.list });
  return (
    <div className="space-y-6">
      <SectionHeader title="Announcements" subtitle="Official notices from the Transport Office" />
      <Card>
        <CardContent className="space-y-3 p-3">
          {(announcements ?? []).length ? (announcements ?? []).map((a) => {
            const { icon: Icon, tone } = typeMap[a.type];
            return (
              <div key={a.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tone)}><Icon className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between"><p className="font-semibold">{a.title}</p><Badge tone="outline" className="capitalize">{a.type.replace('-', ' ')}</Badge></div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{a.createdAt} · by {a.createdBy}</p>
                </div>
              </div>
            );
          }) : <EmptyState icon={<Megaphone className="h-8 w-8" />} title="No announcements" description="Nothing to show right now." />}
        </CardContent>
      </Card>
    </div>
  );
}
