import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, Bus, Route as RouteIcon, MapPin, Users, ShieldCheck, BadgeCheck, GraduationCap, Home, Star } from 'lucide-react';
import { studentService, parentService, driverService, adminService, busService, routeService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { ROLE_LABELS } from '@/lib/constants';
import { initials } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

export default function ProfilePage({ role }: { role: UserRole }) {
  const { user } = useAuthStore();
  const studentQ = useQuery({ queryKey: ['student-me'], queryFn: studentService.me, enabled: role === 'student' });
  const parentQ = useQuery({ queryKey: ['parent-me'], queryFn: parentService.me, enabled: role === 'parent' });
  const driverQ = useQuery({ queryKey: ['driver-me'], queryFn: driverService.me, enabled: role === 'driver' });
  const adminQ = useQuery({ queryKey: ['admin-me'], queryFn: adminService.me, enabled: role === 'admin' });
  const me = user ?? studentQ.data ?? parentQ.data ?? driverQ.data ?? adminQ.data;
  const student = role === 'student' ? studentQ.data : null;
  const parent = role === 'parent' ? parentQ.data : null;
  const driver = role === 'driver' ? driverQ.data : null;
  const admin = role === 'admin' ? adminQ.data : null;
  const busQ = useQuery({ queryKey: ['profile-bus', student?.busId ?? driver?.busId], queryFn: () => busService.get(student?.busId ?? driver?.busId ?? 'CKCET-01'), enabled: !!(student ?? driver) });
  const routeQ = useQuery({ queryKey: ['profile-route', student?.routeId ?? driver?.routeId], queryFn: () => routeService.get(student?.routeId ?? driver?.routeId ?? 'route-01'), enabled: !!(student ?? driver) });

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile" subtitle={`Your ${ROLE_LABELS[role]} profile information`} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent font-display text-3xl font-bold text-white shadow-glow">{me ? initials(me.name) : 'U'}</div>
            <p className="mt-4 font-display text-xl font-bold">{me?.name}</p>
            <p className="text-sm text-muted-foreground">{me?.email}</p>
            <Badge tone="primary" className="mt-3">{ROLE_LABELS[role]}</Badge>
            <div className="mt-4 w-full space-y-2 border-t border-border pt-4 text-left text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {me?.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {me?.phone}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {student && (<>
                <Detail icon={<GraduationCap className="h-4 w-4" />} label="Register No" value={student.registerNo} />
                <Detail icon={<GraduationCap className="h-4 w-4" />} label="Department" value={student.department} />
                <Detail icon={<GraduationCap className="h-4 w-4" />} label="Year & Section" value={`Year ${student.year} · ${student.section}`} />
                <Detail icon={<Bus className="h-4 w-4" />} label="Assigned Bus" value={student.busId} />
                <Detail icon={<RouteIcon className="h-4 w-4" />} label="Route" value={routeQ.data?.name} />
                <Detail icon={<MapPin className="h-4 w-4" />} label="Pickup Stop" value={student.pickupStop} />
                <Detail icon={<MapPin className="h-4 w-4" />} label="Drop Stop" value={student.dropStop} />
              </>)}
              {parent && (<>
                <Detail icon={<Users className="h-4 w-4" />} label="Child" value={parent.childName} />
                <Detail icon={<GraduationCap className="h-4 w-4" />} label="Child Register No" value={parent.childRegisterNo} />
                <Detail icon={<Home className="h-4 w-4" />} label="Relation" value={parent.relation} />
              </>)}
              {driver && (<>
                <Detail icon={<BadgeCheck className="h-4 w-4" />} label="Driver ID" value={driver.driverId} />
                <Detail icon={<BadgeCheck className="h-4 w-4" />} label="License No" value={driver.licenseNo} />
                <Detail icon={<Bus className="h-4 w-4" />} label="Assigned Bus" value={driver.busId} />
                <Detail icon={<RouteIcon className="h-4 w-4" />} label="Route" value={routeQ.data?.name} />
                <Detail icon={<ShieldCheck className="h-4 w-4" />} label="Experience" value={`${driver.experienceYears} years`} />
                <Detail icon={<Star className="h-4 w-4" />} label="Rating" value={`${driver.rating} / 5`} />
              </>)}
              {admin && (<>
                <Detail icon={<BadgeCheck className="h-4 w-4" />} label="Staff ID" value={admin.staffId} />
                <Detail icon={<ShieldCheck className="h-4 w-4" />} label="Designation" value={admin.designation} />
              </>)}
            </div>
            {student?.parent && (<>
              <p className="mt-6 mb-3 font-semibold">Parent / Emergency Contact</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail icon={<Users className="h-4 w-4" />} label="Parent" value={student.parent.name} />
                <Detail icon={<Phone className="h-4 w-4" />} label="Parent Phone" value={student.parent.phone} />
              </div>
            </>)}
            {parent?.emergencyContacts && (<>
              <p className="mt-6 mb-3 font-semibold">Emergency Contacts</p>
              <div className="space-y-2">
                {parent.emergencyContacts.map((ec) => (
                  <div key={ec.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div><p className="text-sm font-medium">{ec.name}</p><p className="text-xs text-muted-foreground">{ec.role}</p></div>
                    <span className="text-sm">{ec.phone}</span>
                  </div>
                ))}
              </div>
            </>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon} {label}</p>
      <p className="mt-0.5 font-semibold">{value ?? '—'}</p>
    </div>
  );
}
