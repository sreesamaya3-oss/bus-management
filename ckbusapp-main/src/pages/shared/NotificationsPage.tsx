import { useQuery } from '@tanstack/react-query';
import { Bell, Info, CheckCircle2, AlertTriangle, Siren, Check, Route as RouteIcon, MessageSquareWarning, CalendarPlus, Star } from 'lucide-react';
import { notificationService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const typeMap = {
  info: { icon: Info, tone: 'text-secondary bg-secondary/15', label: 'Transport Alert' },
  success: { icon: CheckCircle2, tone: 'text-success bg-success/15', label: 'Success' },
  warning: { icon: AlertTriangle, tone: 'text-warning bg-warning/15', label: 'Delay Alert' },
  emergency: { icon: Siren, tone: 'text-destructive bg-destructive/15', label: 'Emergency' },
  'route-change': { icon: RouteIcon, tone: 'text-primary bg-primary/15', label: 'Route Change' },
  complaint: { icon: MessageSquareWarning, tone: 'text-accent bg-accent/15', label: 'Complaint Update' },
  leave: { icon: CalendarPlus, tone: 'text-secondary bg-secondary/15', label: 'Leave Update' },
};

export default function NotificationsPage() {
  const { role } = useAuthStore();
  const { data: serverNotifs } = useQuery({ queryKey: ['notifications'], queryFn: () => notificationService.list() });
  const { markAllRead } = useNotificationStore();
  const notifs = serverNotifs ?? [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Smart Notifications" subtitle="Transport alerts, emergency notices, route changes, complaint updates and more" action={<Button variant="outline" size="sm" onClick={markAllRead}><Check className="h-4 w-4" /> Mark all read</Button>} />
      <Card>
        <CardContent className="space-y-2 p-3">
          {notifs.length ? notifs.map((n) => {
            const { icon: Icon, tone, label } = typeMap[n.type] ?? typeMap.info;
            return (
              <div key={n.id} className={cn('flex items-start gap-3 rounded-lg p-3', n.read ? 'opacity-60' : '')}>
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', tone)}><Icon className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{n.title}</p>
                    <div className="flex items-center gap-1.5">{!n.read && <Badge tone="primary">New</Badge>}<Badge tone="outline">{label}</Badge></div>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString('en-IN')} · For: <span className="capitalize">{n.audience}</span></p>
                </div>
              </div>
            );
          }) : <EmptyState icon={<Bell className="h-8 w-8" />} title="No notifications" description="You are all caught up." />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Notification Types</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(typeMap) as [keyof typeof typeMap, typeof typeMap.info][]).map(([key, v]) => {
              const Icon = v.icon;
              return <div key={key} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-sm"><div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', v.tone)}><Icon className="h-4 w-4" /></div>{v.label}</div>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { CardHeader, CardTitle } from '@/components/ui/Card';
