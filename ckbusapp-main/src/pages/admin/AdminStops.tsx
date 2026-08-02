import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, Users, CheckCircle2, XCircle, Route as RouteIcon } from 'lucide-react';
import { routeService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/EmptyState';
import type { Stop } from '@/lib/types';

export default function AdminStops() {
  const { data: routes } = useQuery({ queryKey: ['routes'], queryFn: routeService.list });
  const allStops = routes?.flatMap((r) => r.stops.map((s) => ({ ...s, routeName: r.name, routeId: r.id }))) ?? [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Official Stop Management" subtitle="Only admin can create and manage stops. Students select from approved stops only." action={<Button><MapPin className="h-4 w-4" /> Add Stop</Button>} />
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-center gap-3"><MapPin className="h-5 w-5 text-warning" /><p className="text-sm text-muted-foreground">Students cannot manually enter locations. They can only select from the approved stops on their assigned route.</p></CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allStops.map((s: Stop & { routeName: string }) => (
          <Card key={s.id} hover>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">Stop #{s.sequence + 1}</p>
                  </div>
                </div>
                <Badge tone={s.active ? 'success' : 'destructive'}>{s.active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} {s.active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><RouteIcon className="h-3.5 w-3.5 text-secondary" /> {s.routeName}</p>
                <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> Pickup: {s.arrivalTime} · Drop: {s.departureTime}</p>
                <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-accent" /> Boarding: {s.studentsBoarding}/{s.capacity} students</p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-xs text-muted-foreground">Capacity: {Math.round((s.studentsBoarding / s.capacity) * 100)}% full</span>
                <Button variant="ghost" size="sm" className="text-xs">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Stop Summary by Route</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {routes?.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15 text-secondary"><RouteIcon className="h-4 w-4" /></div><div><p className="text-sm font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.stops.length} stops · {r.distanceKm} km</p></div></div>
              <div className="flex gap-1">{r.stops.map((s) => <span key={s.id} className={`h-2 w-2 rounded-full ${s.active ? 'bg-success' : 'bg-destructive'}`} title={s.name} />)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
