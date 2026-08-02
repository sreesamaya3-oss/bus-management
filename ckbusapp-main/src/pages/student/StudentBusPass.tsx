import { useQuery } from '@tanstack/react-query';
import { Download, Bus, Route as RouteIcon, MapPin, Calendar, ShieldCheck } from 'lucide-react';
import { studentService, busService, routeService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QRCode } from '@/components/shared/QRCode';
import { SectionHeader } from '@/components/ui/EmptyState';
import { INSTITUTION_SHORT } from '@/lib/constants';
import { initials } from '@/lib/utils';

export default function StudentBusPass() {
  const { data: me } = useQuery({ queryKey: ['student-me'], queryFn: studentService.me });
  const { data: bus } = useQuery({ queryKey: ['student-bus', me?.busId], queryFn: () => busService.get(me?.busId ?? 'CKCET-01'), enabled: !!me });
  const { data: route } = useQuery({ queryKey: ['student-route', me?.routeId], queryFn: () => routeService.get(me?.routeId ?? 'route-01'), enabled: !!me });
  const qrValue = `CKCET|${me?.registerNo ?? ''}|${me?.busId ?? ''}|2026-2027`;

  return (
    <div className="space-y-6">
      <SectionHeader title="Digital Bus Pass" subtitle="Your official CKCET transport pass — present the QR code while boarding." action={<Button variant="outline" size="sm"><Download className="h-4 w-4" /> Download</Button>} />
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-1 shadow-soft">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative rounded-xl bg-card/90 p-6 backdrop-blur">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white"><Bus className="h-5 w-5" /></div>
                <div><p className="font-display text-lg font-bold">{INSTITUTION_SHORT} Transport Pass</p><p className="text-xs text-muted-foreground">Academic Year 2026–2027</p></div>
              </div>
              <Badge tone="success"><ShieldCheck className="h-3 w-3" /> Valid</Badge>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent font-display text-2xl font-bold text-white">{me ? initials(me.name) : 'SK'}</div>
                  <div>
                    <p className="font-display text-xl font-bold">{me?.name}</p>
                    <p className="text-sm text-muted-foreground">{me?.registerNo}</p>
                    <p className="text-xs text-muted-foreground">{me?.department}</p>
                    <p className="text-xs text-muted-foreground">Year {me?.year} · Section {me?.section}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                  <Detail icon={<Bus className="h-4 w-4" />} label="Bus" value={me?.busId} />
                  <Detail icon={<RouteIcon className="h-4 w-4" />} label="Route" value={route?.name.split('—')[0]} />
                  <Detail icon={<MapPin className="h-4 w-4" />} label="Pickup" value={me?.pickupStop} />
                  <Detail icon={<MapPin className="h-4 w-4" />} label="Drop" value={me?.dropStop} />
                  <Detail icon={<Calendar className="h-4 w-4" />} label="Valid Till" value="Apr 2027" />
                  <Detail icon={<ShieldCheck className="h-4 w-4" />} label="Status" value="Active" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <QRCode value={qrValue} size={160} />
                <p className="text-xs text-muted-foreground">Scan to verify</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>Issued by Transport Office · {INSTITUTION_SHORT}</span><span className="font-mono">{me?.registerNo}</span></div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">This pass is valid only for the assigned bus and route. Misuse is punishable under college transport policy.</p>
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
