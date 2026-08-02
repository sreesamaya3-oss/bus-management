import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, MapPin, Navigation, Clock, Bus } from 'lucide-react';
import { parentService, studentService, busService, routeService, journeyService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LiveMap } from '@/components/shared/LiveMap';
import { RouteTimeline } from '@/components/shared/RouteTimeline';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { ETACountdown } from '@/components/shared/ETACountdown';
import { AISummaryCard } from '@/components/shared/AISummaryCard';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function ParentTracking() {
  const { data: parent } = useQuery({ queryKey: ['parent-me'], queryFn: parentService.me });
  const { data: child } = useQuery({ queryKey: ['child', parent?.childId], queryFn: () => studentService.get(parent?.childId ?? 'stu-01'), enabled: !!parent });
  const { data: bus } = useQuery({ queryKey: ['child-bus', child?.busId], queryFn: () => busService.get(child?.busId ?? 'CKCET-01'), enabled: !!child });
  const { data: route } = useQuery({ queryKey: ['child-route', child?.routeId], queryFn: () => routeService.get(child?.routeId ?? 'route-01'), enabled: !!child });
  const { data: journey } = useQuery({ queryKey: ['child-journey', child?.busId], queryFn: () => journeyService.current(child?.busId ?? 'CKCET-01'), enabled: !!child });
  const progress = journey?.progress ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader title="Live Tracking" subtitle={`Following ${child?.name ?? 'your child'} on ${child?.busId ?? 'bus'}`} action={<Badge tone="success"><ShieldCheck className="h-3 w-3" /> Child Safe</Badge>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Stop" value={bus?.currentStop ?? '—'} icon={<MapPin className="h-5 w-5" />} accent="primary" />
        <StatCard label="Next Stop" value={bus?.nextStop ?? '—'} icon={<Navigation className="h-5 w-5" />} accent="secondary" />
        <StatCard label="ETA" value={`${bus?.etaMinutes ?? 0}m`} icon={<Clock className="h-5 w-5" />} accent="accent" />
        <StatCard label="Occupancy" value={`${bus?.occupied}/${bus?.capacity}`} icon={<Bus className="h-5 w-5" />} accent="success" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Route Map</CardTitle><CardDescription>Real-time position of your child bus</CardDescription></CardHeader>
          <CardContent><LiveMap stops={route?.stops ?? []} progress={progress} className="aspect-square w-full" /></CardContent>
        </Card>
        <div className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base">Route Timeline</CardTitle></CardHeader><CardContent><RouteTimeline stops={route?.stops ?? []} progress={progress} /></CardContent></Card>
          <ETACountdown seconds={journey?.etaSeconds ?? 0} label="Drop ETA" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Journey Progress</CardTitle></CardHeader><CardContent className="space-y-4"><JourneyProgress progress={progress} status={`${progress}% complete`} /></CardContent></Card>
        <AISummaryCard severity="low" message={`${child?.name} is safe and onboard. The bus will reach the drop stop ${child?.dropStop} in about ${bus?.etaMinutes} minutes.`} />
      </div>
    </div>
  );
}
