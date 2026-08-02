import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, MapPin, Bus, Users, ShieldCheck, AlertCircle } from 'lucide-react';
import { parentService, studentService, busService, routeService, driverService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function ParentChildStatus() {
  const { data: parent } = useQuery({ queryKey: ['parent-me'], queryFn: parentService.me });
  const { data: child } = useQuery({ queryKey: ['child', parent?.childId], queryFn: () => studentService.get(parent?.childId ?? 'stu-01'), enabled: !!parent });
  const { data: bus } = useQuery({ queryKey: ['child-bus', child?.busId], queryFn: () => busService.get(child?.busId ?? 'CKCET-01'), enabled: !!child });
  const { data: route } = useQuery({ queryKey: ['child-route', child?.routeId], queryFn: () => routeService.get(child?.routeId ?? 'route-01'), enabled: !!child });
  const { data: driver } = useQuery({ queryKey: ['child-driver', bus?.driverId], queryFn: () => driverService.get(bus?.driverId ?? 'drv-01'), enabled: !!bus });

  return (
    <div className="space-y-6">
      <SectionHeader title="Child Status" subtitle={`${child?.name ?? 'Your child'} current transport status`} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-success/30 bg-gradient-to-br from-success/10 to-transparent lg:col-span-1">
          <CardContent className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/20 text-success"><ShieldCheck className="h-8 w-8" /></div>
            <p className="mt-3 font-display text-lg font-bold text-success">Safe & Onboard</p>
            <p className="text-xs text-muted-foreground">Last updated just now</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Status Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Pickup</p>
                <p className="mt-1 font-semibold">{child?.pickupStop}</p>
                <p className="text-xs text-muted-foreground">Boarded 07:09 AM</p>
                <Badge tone="success" className="mt-2">Confirmed</Badge>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Drop</p>
                <p className="mt-1 font-semibold">{child?.dropStop}</p>
                <p className="text-xs text-muted-foreground">Expected 04:40 PM</p>
                <Badge tone="warning" className="mt-2">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bus" value={child?.busId ?? '—'} icon={<Bus className="h-5 w-5" />} accent="primary" />
        <StatCard label="Route" value={route?.name.split('—')[0] ?? '—'} icon={<MapPin className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Driver" value={driver?.name.split(' ').slice(-1)[0] ?? '—'} icon={<Users className="h-5 w-5" />} accent="accent" />
        <StatCard label="Attendance" value="96%" icon={<ShieldCheck className="h-5 w-5" />} accent="success" />
      </div>
      <Card className="border-secondary/30 bg-secondary/5"><CardContent className="flex items-center gap-3"><AlertCircle className="h-5 w-5 text-secondary" /><p className="text-sm">You will receive instant notifications for pickup confirmation, drop confirmation and any safety alerts during the journey.</p></CardContent></Card>
    </div>
  );
}
