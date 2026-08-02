import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, Star } from 'lucide-react';
import { driverService } from '@/lib/services';
import { ManagementList, RowActions } from '@/components/shared/ManagementList';
import type { Driver } from '@/lib/types';
import { initials } from '@/lib/utils';

export default function AdminDrivers() {
  const { data: drivers } = useQuery({ queryKey: ['drivers'], queryFn: driverService.list });
  return (
    <ManagementList title="Driver Management" subtitle="All assigned drivers" data={drivers ?? []} emptyIcon={<BadgeCheck className="h-8 w-8" />} searchKeys={['name', 'driverId', 'busId', 'licenseNo']} onAdd={() => {}} addLabel="Add Driver" rowActions={() => <RowActions />}
      columns={[
        { key: 'name', label: 'Driver', render: (d: Driver) => <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-secondary text-xs font-bold text-white">{initials(d.name)}</div><span className="font-semibold">{d.name}</span></div> },
        { key: 'driverId', label: 'Driver ID', render: (d: Driver) => <span className="font-mono">{d.driverId}</span> },
        { key: 'licenseNo', label: 'License' },
        { key: 'busId', label: 'Bus' },
        { key: 'experienceYears', label: 'Experience', render: (d: Driver) => `${d.experienceYears} yrs` },
        { key: 'rating', label: 'Rating', render: (d: Driver) => <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {d.rating}</span> },
      ]}
    />
  );
}
