import { useQuery } from '@tanstack/react-query';
import { Route as RouteIcon, MapPin } from 'lucide-react';
import { routeService } from '@/lib/services';
import { ManagementList, RowActions } from '@/components/shared/ManagementList';
import { Badge } from '@/components/ui/Badge';
import type { Route } from '@/lib/types';

export default function AdminRoutes() {
  const { data: routes } = useQuery({ queryKey: ['routes'], queryFn: routeService.list });
  return (
    <ManagementList title="Route Management" subtitle="Manage bus routes and assignments" data={routes ?? []} emptyIcon={<RouteIcon className="h-8 w-8" />} searchKeys={['name', 'busId']} onAdd={() => {}} addLabel="Add Route" rowActions={() => <RowActions />}
      columns={[
        { key: 'name', label: 'Route', render: (r: Route) => <span className="font-semibold">{r.name}</span> },
        { key: 'busId', label: 'Bus' },
        { key: 'stops', label: 'Stops', render: (r: Route) => <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {r.stops.length}</span> },
        { key: 'distanceKm', label: 'Distance', render: (r: Route) => `${r.distanceKm} km` },
        { key: 'durationMin', label: 'Duration', render: (r: Route) => `${r.durationMin} min` },
        { key: 'shift', label: 'Shift', render: (r: Route) => <Badge tone="outline" className="capitalize">{r.shift}</Badge> },
        { key: 'active', label: 'Status', render: (r: Route) => <Badge tone={r.active ? 'success' : 'default'}>{r.active ? 'Active' : 'Inactive'}</Badge> },
      ]}
    />
  );
}
