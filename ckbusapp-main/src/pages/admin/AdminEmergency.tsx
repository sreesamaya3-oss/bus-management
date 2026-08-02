import { useQuery } from '@tanstack/react-query';
import { Siren, Phone, ShieldCheck, Users, AlertTriangle } from 'lucide-react';
import { emergencyService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function AdminEmergency() {
  const { data: contacts } = useQuery({ queryKey: ['emergency'], queryFn: emergencyService.list });
  return (
    <div className="space-y-6">
      <SectionHeader title="Emergency Management" subtitle="Emergency contacts and response procedures" />
      <Card className="border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent">
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20 text-destructive"><Siren className="h-6 w-6" /></div><div><p className="font-semibold">Broadcast Emergency Alert</p><p className="text-sm text-muted-foreground">Send an instant alert to all students, parents and drivers.</p></div></div>
          <Button variant="destructive" size="lg"><Siren className="h-4 w-4" /> Broadcast Alert</Button>
        </CardContent>
      </Card>
      <div>
        <p className="mb-3 font-semibold">Emergency Contacts</p>
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
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Emergency Response Protocol</CardTitle></CardHeader>
        <CardContent><ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground"><li>Trigger the emergency broadcast to alert all stakeholders immediately.</li><li>Notify campus security and the Transport Office control room.</li><li>Contact the concerned driver directly for situational awareness.</li><li>Coordinate with local emergency services (108) if medical aid is needed.</li><li>Log the incident and follow up with a detailed report within 24 hours.</li><li>Inform affected parents with status updates until the situation is resolved.</li></ol></CardContent>
      </Card>
    </div>
  );
}
