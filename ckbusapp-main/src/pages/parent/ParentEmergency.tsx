import { useQuery } from '@tanstack/react-query';
import { Phone, Siren, ShieldCheck, Users } from 'lucide-react';
import { emergencyService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function ParentEmergency() {
  const { data: contacts } = useQuery({ queryKey: ['emergency'], queryFn: emergencyService.list });
  return (
    <div className="space-y-6">
      <SectionHeader title="Emergency Contacts" subtitle="Quick access in case of an emergency" />
      <Card className="border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent">
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20 text-destructive"><Siren className="h-6 w-6" /></div><div><p className="font-semibold">Emergency SOS</p><p className="text-sm text-muted-foreground">Press to alert the transport office and security instantly.</p></div></div>
          <Button variant="destructive" size="lg"><Siren className="h-4 w-4" /> Trigger SOS</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(contacts ?? []).map((c) => (
          <Card key={c.id} hover>
            <CardContent className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">{c.role === 'Security' ? <ShieldCheck className="h-5 w-5" /> : c.role === 'Driver' ? <Users className="h-5 w-5" /> : <Phone className="h-5 w-5" />}</div>
              <div className="flex-1"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.role}</p><p className="text-sm font-mono">{c.phone}</p></div>
              <Badge tone={c.available ? 'success' : 'default'}>{c.available ? 'Available' : 'Offline'}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card><CardContent><p className="font-semibold">Emergency Instructions</p><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground"><li>Stay calm and ensure your child is in a safe location.</li><li>Press the SOS button to instantly alert the transport office and campus security.</li><li>Call the driver directly using the number above.</li><li>If unreachable, contact the Transport Office at +91 4142 220 100.</li><li>For medical emergencies, dial 108 (Ambulance).</li></ol></CardContent></Card>
    </div>
  );
}
