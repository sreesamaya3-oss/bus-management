import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bus, Users, Star, MapPin, Clock, Route as RouteIcon, Gauge, Navigation, Activity, MessageSquareWarning, CheckCircle2, AlertTriangle, Circle, ArrowRight } from 'lucide-react';
import { busService, routeService, studentService, driverService, attendanceService, complaintService, ratingService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { JourneyProgress } from '@/components/shared/JourneyProgress';
import type { Bus as BusType } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusConfig = {
  'in-transit': { color: 'success', dot: 'bg-success', label: 'Running', icon: Activity },
  'on-time': { color: 'success', dot: 'bg-success', label: 'On Time', icon: CheckCircle2 },
  delayed: { color: 'warning', dot: 'bg-warning', label: 'Delayed', icon: Clock },
  maintenance: { color: 'destructive', dot: 'bg-destructive', label: 'Maintenance', icon: AlertTriangle },
  idle: { color: 'default', dot: 'bg-muted-foreground', label: 'Offline', icon: Circle },
};

export function FleetControlCard({ bus, onClick }: { bus: BusType; onClick: () => void }) {
  const cfg = statusConfig[bus.status] ?? statusConfig.idle;
  const Icon = cfg.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card hover className="cursor-pointer" onClick={onClick}>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('relative flex h-11 w-11 items-center justify-center rounded-xl', cfg.dot + '/15 text-' + cfg.color)}>
                <Bus className="h-5 w-5" />
                <span className={cn('absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full ring-2 ring-card', cfg.dot)} />
              </div>
              <div>
                <p className="font-display text-base font-bold">{bus.id}</p>
                <p className="text-xs text-muted-foreground">{bus.number}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon className={cn('h-3.5 w-3.5', 'text-' + cfg.color)} />
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', `bg-${cfg.color}/15 text-${cfg.color}`)}>{cfg.label}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-muted-foreground">Speed</p><p className="font-mono font-semibold">{bus.speed} km/h</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-muted-foreground">ETA</p><p className="font-mono font-semibold">{bus.etaMinutes}m</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-muted-foreground">Seats</p><p className="font-mono font-semibold">{bus.occupied}/{bus.capacity}</p></div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Navigation className="h-3.5 w-3.5 text-primary" />
            <span>At {bus.currentStop}</span>
            <ArrowRight className="h-3 w-3" />
            <span>Next: {bus.nextStop}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function BusDetailModal({ busId, open, onClose }: { busId: string | null; open: boolean; onClose: () => void }) {
  const { data: bus } = useQuery({ queryKey: ['bus-detail', busId], queryFn: () => busService.get(busId ?? 'CKCET-01'), enabled: !!busId && open });
  const { data: route } = useQuery({ queryKey: ['bus-route', bus?.routeId], queryFn: () => routeService.get(bus?.routeId ?? 'route-01'), enabled: !!bus });
  const { data: driver } = useQuery({ queryKey: ['bus-driver', bus?.driverId], queryFn: () => driverService.get(bus?.driverId ?? 'drv-01'), enabled: !!bus });
  const { data: students } = useQuery({ queryKey: ['bus-students', bus?.id], queryFn: () => studentService.forBus(bus?.id ?? 'CKCET-01'), enabled: !!bus });
  const { data: attendance } = useQuery({ queryKey: ['bus-attendance', bus?.id], queryFn: () => attendanceService.forBus(bus?.id ?? 'CKCET-01'), enabled: !!bus });
  const { data: complaints } = useQuery({ queryKey: ['all-complaints'], queryFn: complaintService.all, enabled: open });
  const { data: ratings } = useQuery({ queryKey: ['all-ratings'], queryFn: ratingService.all, enabled: open });

  if (!bus) return null;
  const studentIds = (students ?? []).map((s) => s.id);
  const busComplaints = (complaints ?? []).filter((c) => studentIds.includes(c.studentId));
  const busRatings = (ratings ?? []).filter((r) => r.targetId === bus.id || r.targetId === bus.driverId);
  const presentToday = (attendance ?? []).filter((a) => a.date === '2026-07-27' && a.status === 'present').length;

  return (
    <Modal open={open} onClose={onClose} title={`${bus.id} — Fleet Details`} description={bus.routeName} className="max-w-2xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DetailBox icon={<Gauge className="h-4 w-4" />} label="Speed" value={`${bus.speed} km/h`} />
          <DetailBox icon={<Clock className="h-4 w-4" />} label="ETA" value={`${bus.etaMinutes} min`} />
          <DetailBox icon={<Users className="h-4 w-4" />} label="Students" value={`${students?.length ?? 0}`} />
          <DetailBox icon={<CheckCircle2 className="h-4 w-4" />} label="Present Today" value={`${presentToday}`} />
        </div>
        <JourneyProgress progress={bus.progress} status={`At ${bus.currentStop}, heading to ${bus.nextStop}`} />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Users className="h-3.5 w-3.5" /> Driver</p>
            <p className="mt-1 font-semibold">{driver?.name}</p>
            <p className="text-xs text-muted-foreground">{driver?.phone}</p>
            <div className="mt-1 flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-warning text-warning" /> {driver?.rating}</div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><RouteIcon className="h-3.5 w-3.5" /> Route</p>
            <p className="mt-1 font-semibold">{route?.name}</p>
            <p className="text-xs text-muted-foreground">{route?.distanceKm} km · {route?.durationMin} min</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Assigned Students ({students?.length ?? 0})</p>
          <div className="scrollbar-thin max-h-32 space-y-1 overflow-y-auto">
            {(students ?? []).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-1.5 text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.registerNo} · {s.pickupStop}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold">Complaints ({busComplaints.length})</p>
            {busComplaints.length ? busComplaints.map((c) => (
              <div key={c.id} className="rounded-lg bg-muted/30 px-3 py-2 text-sm"><p className="font-medium">{c.subject}</p><p className="text-xs text-muted-foreground">{c.status}</p></div>
            )) : <p className="text-xs text-muted-foreground">No complaints</p>}
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Ratings ({busRatings.length})</p>
            {busRatings.length ? busRatings.map((r) => (
              <div key={r.id} className="rounded-lg bg-muted/30 px-3 py-2 text-sm"><div className="flex items-center justify-between"><span className="font-medium">{r.targetName}</span><span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-warning text-warning" /> {r.stars}</span></div><p className="text-xs text-muted-foreground">{r.comment}</p></div>
            )) : <p className="text-xs text-muted-foreground">No ratings</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function DetailBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1 text-xs text-muted-foreground">{icon} {label}</p><p className="mt-1 font-display text-lg font-bold">{value}</p></div>;
}
