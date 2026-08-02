import { useQuery } from '@tanstack/react-query';
import { Phone, Mail, Star, BadgeCheck, Bus, ShieldCheck, Award } from 'lucide-react';
import { parentService, studentService, busService, routeService, driverService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/EmptyState';
import { initials } from '@/lib/utils';

export default function ParentDriverDetails() {
  const { data: parent } = useQuery({ queryKey: ['parent-me'], queryFn: parentService.me });
  const { data: child } = useQuery({ queryKey: ['child', parent?.childId], queryFn: () => studentService.get(parent?.childId ?? 'stu-01'), enabled: !!parent });
  const { data: bus } = useQuery({ queryKey: ['child-bus', child?.busId], queryFn: () => busService.get(child?.busId ?? 'CKCET-01'), enabled: !!child });
  const { data: driver } = useQuery({ queryKey: ['child-driver', bus?.driverId], queryFn: () => driverService.get(bus?.driverId ?? 'drv-01'), enabled: !!bus });
  const { data: route } = useQuery({ queryKey: ['child-route', child?.routeId], queryFn: () => routeService.get(child?.routeId ?? 'route-01'), enabled: !!child });

  return (
    <div className="space-y-6">
      <SectionHeader title="Driver Details" subtitle="Information about your child assigned driver" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent font-display text-3xl font-bold text-white shadow-glow">{driver ? initials(driver.name) : 'D'}</div>
            <p className="mt-4 font-display text-xl font-bold">{driver?.name}</p>
            <p className="text-sm text-muted-foreground">{driver?.driverId}</p>
            <div className="mt-2 flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /><span className="font-semibold">{driver?.rating}</span><span className="text-xs text-muted-foreground">rating</span></div>
            <div className="mt-4 flex gap-2"><Button size="sm"><Phone className="h-4 w-4" /> Call</Button><Button size="sm" variant="outline"><Mail className="h-4 w-4" /> Email</Button></div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Driver Information</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail icon={<BadgeCheck className="h-4 w-4" />} label="License No" value={driver?.licenseNo} />
              <Detail icon={<Award className="h-4 w-4" />} label="Experience" value={`${driver?.experienceYears} years`} />
              <Detail icon={<Phone className="h-4 w-4" />} label="Phone" value={driver?.phone} />
              <Detail icon={<Mail className="h-4 w-4" />} label="Email" value={driver?.email} />
              <Detail icon={<Bus className="h-4 w-4" />} label="Assigned Bus" value={driver?.busId} />
              <Detail icon={<ShieldCheck className="h-4 w-4" />} label="Background Check" value="Verified" />
            </div>
            <div className="mt-4 rounded-lg bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Route</p><p className="font-semibold">{route?.name}</p><p className="text-xs text-muted-foreground">{route?.distanceKm} km · {route?.durationMin} min</p></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return <div className="rounded-lg bg-muted/50 p-3"><p className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon} {label}</p><p className="mt-0.5 font-semibold">{value ?? '—'}</p></div>;
}
