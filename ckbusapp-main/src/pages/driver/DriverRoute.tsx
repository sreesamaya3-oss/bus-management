import { useQuery } from '@tanstack/react-query';
import { Route as RouteIcon, MapPin, Clock, Ruler, Bus, Navigation } from 'lucide-react';
import { driverService, busService, routeService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LiveMap } from '@/components/shared/LiveMap';
import { RouteTimeline } from '@/components/shared/RouteTimeline';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function DriverRoute() {
  const { data: me } = useQuery({ queryKey: ['driver-me'], queryFn: driverService.me });
  const { data: bus } = useQuery({ queryKey: ['driver-bus', me?.busId], queryFn: () => busService.get(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const { data: route } = useQuery({ queryKey: ['driver-route', me?.routeId], queryFn: () => routeService.get(me?.routeId ?? 'route-01'), enabled: !!me });

  return (
    <div className="space-y-6">
      <SectionHeader title="Assigned Route" subtitle={route?.name} action={<Badge tone={route?.active ? 'success' : 'default'}>{route?.active ? 'Active' : 'Inactive'}</Badge>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailCard icon={<Ruler className="h-5 w-5" />} label="Distance" value={`${route?.distanceKm} km`} tone="primary" />
        <DetailCard icon={<Clock className="h-5 w-5" />} label="Duration" value={`${route?.durationMin} min`} tone="secondary" />
        <DetailCard icon={<MapPin className="h-5 w-5" />} label="Stops" value={route?.stops.length ?? 0} tone="accent" />
        <DetailCard icon={<Bus className="h-5 w-5" />} label="Bus" value={bus?.id ?? '—'} tone="success" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Route Map</CardTitle><CardDescription>Follow this path for today trip</CardDescription></CardHeader><CardContent><LiveMap stops={route?.stops ?? []} progress={bus?.progress ?? 0} className="aspect-square w-full" /></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Navigation className="h-4 w-4" /> Stops Sequence</CardTitle></CardHeader><CardContent><RouteTimeline stops={route?.stops ?? []} progress={bus?.progress ?? 0} /></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Stop Details</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="py-2 pr-4">#</th><th className="py-2 pr-4">Stop</th><th className="py-2 pr-4">Arrival</th><th className="py-2">Boarding</th></tr></thead>
              <tbody>
                {route?.stops.map((s, i) => (
                  <tr key={s.id} className="border-b border-border/60"><td className="py-3 pr-4 font-mono text-muted-foreground">{i + 1}</td><td className="py-3 pr-4 font-medium">{s.name}</td><td className="py-3 pr-4 font-mono">{s.arrivalTime}</td><td className="py-3">{s.studentsBoarding} students</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone: 'primary' | 'secondary' | 'accent' | 'success' }) {
  const tones = { primary: 'bg-primary/15 text-primary', secondary: 'bg-secondary/15 text-secondary', accent: 'bg-accent/15 text-accent', success: 'bg-success/15 text-success' };
  return <Card><CardContent className="flex items-center gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div><div><p className="text-xs text-muted-foreground">{label}</p><p className="font-display text-lg font-bold">{value}</p></div></CardContent></Card>;
}
