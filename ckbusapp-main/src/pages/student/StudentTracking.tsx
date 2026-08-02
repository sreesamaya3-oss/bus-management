import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bus, MapPin, Navigation, Gauge, AlertTriangle, Sparkles } from 'lucide-react';
import { studentService, busService, routeService, journeyService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LiveMap } from '@/components/shared/LiveMap';
import { RouteTimeline } from '@/components/shared/RouteTimeline';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import { ETACountdown } from '@/components/shared/ETACountdown';
import { AISummaryCard } from '@/components/shared/AISummaryCard';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function StudentTracking() {
  const { data: me } = useQuery({ queryKey: ['student-me'], queryFn: studentService.me });
  const { data: bus } = useQuery({ queryKey: ['student-bus', me?.busId], queryFn: () => busService.get(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const { data: route } = useQuery({ queryKey: ['student-route', me?.routeId], queryFn: () => routeService.get(me?.routeId ?? 'route-01'), enabled: !!me });
  const { data: journey } = useQuery({ queryKey: ['student-journey', me?.busId], queryFn: () => journeyService.current(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const progress = journey?.progress ?? 0;
  const remainingStops = (route?.stops ?? []).filter((s) => s.name !== bus?.currentStop).length;

  return (
    <div className="space-y-6">
      <SectionHeader title="Live Tracking" subtitle={`Following ${me?.busId ?? 'your bus'} · ${bus?.routeName}`} action={<Badge tone={bus?.status === 'on-time' ? 'success' : bus?.status === 'delayed' ? 'warning' : 'primary'}>{bus?.status?.replace('-', ' ')}</Badge>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Stop" value={bus?.currentStop ?? '—'} icon={<MapPin className="h-5 w-5" />} accent="primary" />
        <StatCard label="Next Stop" value={bus?.nextStop ?? '—'} icon={<Navigation className="h-5 w-5" />} accent="secondary" />
        <StatCard label="Remaining Stops" value={remainingStops} icon={<Bus className="h-5 w-5" />} accent="accent" />
        <StatCard label="Delay" value={`+${journey?.delayMinutes ?? 0}m`} icon={<Gauge className="h-5 w-5" />} accent={journey?.delayMinutes ? 'warning' : 'success'} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Interactive Route Map</CardTitle><CardDescription>Real-time bus position along your route</CardDescription></CardHeader>
          <CardContent><LiveMap stops={route?.stops ?? []} progress={progress} className="aspect-square w-full" /></CardContent>
        </Card>
        <div className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base">Route Timeline</CardTitle></CardHeader><CardContent><RouteTimeline stops={route?.stops ?? []} progress={progress} /></CardContent></Card>
          <ETACountdown seconds={journey?.etaSeconds ?? 0} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Journey Progress</CardTitle><CardDescription>Overall completion of today trip</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <JourneyProgress progress={progress} status={`${progress}% complete · ${remainingStops} stops remaining`} />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Bus Status</p><p className="font-display text-lg font-bold capitalize">{bus?.status?.replace('-', ' ')}</p></div>
              <div className="rounded-lg bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Occupancy</p><p className="font-display text-lg font-bold">{bus?.occupied}/{bus?.capacity}</p></div>
              <div className="rounded-lg bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Distance</p><p className="font-display text-lg font-bold">{route?.distanceKm} km</p></div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <AISummaryCard title="AI Delay Prediction" severity={journey?.delayMinutes ? 'high' : 'low'} message={`Predicted delay at ${bus?.nextStop}: +${journey?.aiDelayPrediction ?? 0} min. ${journey?.delayMinutes ? 'Already running late due to traffic.' : 'Route is currently on schedule.'}`} />
          <Card className="border-warning/30"><CardContent className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-warning" /><div><p className="text-sm font-semibold">Traffic advisory</p><p className="text-xs text-muted-foreground">Heavy rain reported near {bus?.nextStop}. Expect minor delays.</p></div></CardContent></Card>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">AI assistant: Your bus is <strong className="text-foreground">{progress}% through</strong> its route. You will reach your drop stop <strong className="text-foreground">{me?.dropStop}</strong> in approximately <strong className="text-foreground">{bus?.etaMinutes} minutes</strong>.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
