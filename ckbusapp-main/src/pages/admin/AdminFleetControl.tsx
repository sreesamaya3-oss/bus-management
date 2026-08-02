import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bus, Activity, Clock, AlertTriangle, Circle, Gauge } from 'lucide-react';
import { busService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import { FleetControlCard, BusDetailModal } from '@/components/shared/FleetControlCard';

export default function AdminFleetControl() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: buses } = useQuery({ queryKey: ['buses'], queryFn: busService.list });

  const running = buses?.filter((b) => b.status === 'in-transit' || b.status === 'on-time').length ?? 0;
  const delayed = buses?.filter((b) => b.status === 'delayed').length ?? 0;
  const maintenance = buses?.filter((b) => b.status === 'maintenance').length ?? 0;
  const offline = buses?.filter((b) => b.status === 'idle').length ?? 0;

  const openModal = (id: string) => { setSelectedBus(id); setModalOpen(true); };

  return (
    <div className="space-y-6">
      <SectionHeader title="Transport Fleet Control" subtitle="Live monitoring of all buses in the fleet" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Running" value={running} icon={<Activity className="h-5 w-5" />} accent="success" />
        <StatCard label="Delayed" value={delayed} icon={<Clock className="h-5 w-5" />} accent="warning" />
        <StatCard label="Maintenance" value={maintenance} icon={<AlertTriangle className="h-5 w-5" />} accent="destructive" />
        <StatCard label="Offline" value={offline} icon={<Circle className="h-5 w-5" />} accent="primary" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(buses ?? []).map((bus) => (
          <FleetControlCard key={bus.id} bus={bus} onClick={() => openModal(bus.id)} />
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Gauge className="h-4 w-4" /> Fleet Legend</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-success" /><span className="text-sm">Running / On-time</span></div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-warning" /><span className="text-sm">Delayed</span></div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-destructive" /><span className="text-sm">Maintenance</span></div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-muted-foreground" /><span className="text-sm">Offline</span></div>
          </div>
        </CardContent>
      </Card>
      <BusDetailModal busId={selectedBus} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
