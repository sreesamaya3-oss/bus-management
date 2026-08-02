import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, Phone, Star, Clock, Bus, Route as RouteIcon, CheckCircle2, XCircle, CalendarOff } from 'lucide-react';
import { driverService, scheduleService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import { cn, initials } from '@/lib/utils';
import type { DriverAvailability } from '@/lib/types';

const statusConfig = {
  available: { tone: 'success', label: 'Available', icon: CheckCircle2 },
  assigned: { tone: 'primary', label: 'Assigned', icon: Bus },
  'on-leave': { tone: 'warning', label: 'On Leave', icon: CalendarOff },
  unavailable: { tone: 'destructive', label: 'Unavailable', icon: XCircle },
};

export default function AdminDriverAvailability() {
  const { data: availability } = useQuery({ queryKey: ['driver-availability'], queryFn: driverService.availability });
  const { data: schedules } = useQuery({ queryKey: ['schedules'], queryFn: scheduleService.list });

  const available = availability?.filter((d) => d.status === 'available').length ?? 0;
  const assigned = availability?.filter((d) => d.status === 'assigned').length ?? 0;
  const onLeave = availability?.filter((d) => d.status === 'on-leave').length ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader title="Driver Availability" subtitle="Track driver status, assignments and availability" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Available" value={available} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" />
        <StatCard label="Assigned" value={assigned} icon={<Bus className="h-5 w-5" />} accent="primary" />
        <StatCard label="On Leave" value={onLeave} icon={<CalendarOff className="h-5 w-5" />} accent="warning" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(availability ?? []).map((d: DriverAvailability) => {
          const cfg = statusConfig[d.status];
          const Icon = cfg.icon;
          const driverSchedules = (schedules ?? []).filter((s) => s.driverId === d.driverId);
          return (
            <Card key={d.driverId} hover>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-semibold text-white">{initials(d.driverName)}</div>
                    <div>
                      <p className="font-semibold">{d.driverName}</p>
                      <p className="text-xs text-muted-foreground">{d.driverId.replace('drv-', 'CKCET-DRV-0')}</p>
                    </div>
                  </div>
                  <Badge tone={cfg.tone as 'success' | 'primary' | 'warning' | 'destructive'}><Icon className="h-3 w-3" /> {cfg.label}</Badge>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {d.phone}</p>
                  <p className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5" /> License: {d.licenseNo}</p>
                  <p className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {d.rating} · {d.experienceYears} yrs exp</p>
                  {d.assignedBusId && <p className="flex items-center gap-1.5"><Bus className="h-3.5 w-3.5 text-primary" /> {d.assignedBusId}</p>}
                  {d.assignedRoute && <p className="flex items-center gap-1.5"><RouteIcon className="h-3.5 w-3.5 text-secondary" /> {d.assignedRoute}</p>}
                  {d.todaySchedule && <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-accent" /> {d.todaySchedule}</p>}
                </div>
                {driverSchedules.length > 0 && (
                  <div className="border-t border-border pt-2">
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">Schedule History</p>
                    <div className="mt-1 space-y-1">
                      {driverSchedules.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-xs"><span className="font-mono">{s.startTime} - {s.endTime}</span><Badge tone="outline" className="text-[10px] capitalize">{s.shift}</Badge></div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
