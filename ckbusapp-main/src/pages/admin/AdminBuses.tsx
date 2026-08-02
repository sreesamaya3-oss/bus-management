import { useQuery } from '@tanstack/react-query';
import { Bus } from 'lucide-react';
import { busService } from '@/lib/services';
import { ManagementList, RowActions } from '@/components/shared/ManagementList';
import { Badge } from '@/components/ui/Badge';
import type { Bus as BusType } from '@/lib/types';

export default function AdminBuses() {
  const { data: buses } = useQuery({ queryKey: ['buses'], queryFn: busService.list });
  const statusTone = (s: string) => s === 'on-time' ? 'success' : s === 'delayed' ? 'warning' : s === 'maintenance' ? 'destructive' : 'default';
  return (
    <ManagementList title="Bus Management" subtitle="Manage all college transport buses" data={buses ?? []} emptyIcon={<Bus className="h-8 w-8" />} searchKeys={['id', 'number', 'driverName']} onAdd={() => {}} addLabel="Add Bus" rowActions={() => <RowActions />}
      columns={[
        { key: 'id', label: 'Bus ID', render: (b: BusType) => <span className="font-semibold">{b.id}</span> },
        { key: 'number', label: 'Reg. Number', render: (b: BusType) => <span className="font-mono">{b.number}</span> },
        { key: 'routeName', label: 'Route' },
        { key: 'driverName', label: 'Driver' },
        { key: 'occupied', label: 'Occupancy', render: (b: BusType) => `${b.occupied}/${b.capacity}` },
        { key: 'status', label: 'Status', render: (b: BusType) => <Badge tone={statusTone(b.status)} className="capitalize">{b.status.replace('-', ' ')}</Badge> },
      ]}
    />
  );
}
