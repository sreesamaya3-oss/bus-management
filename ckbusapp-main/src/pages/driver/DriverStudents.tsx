import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Users, Search, Phone, MapPin, QrCode } from 'lucide-react';
import { driverService, studentService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { QRCode } from '@/components/shared/QRCode';
import { SectionHeader, EmptyState } from '@/components/ui/EmptyState';
import { initials } from '@/lib/utils';

export default function DriverStudents() {
  const { data: me } = useQuery({ queryKey: ['driver-me'], queryFn: driverService.me });
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: studentService.list });
  const [query, setQuery] = useState('');
  const myStudents = (students ?? []).filter((s) => s.busId === me?.busId);
  const filtered = myStudents.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.registerNo.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <SectionHeader title="Student List" subtitle={`Students assigned to your bus ${me?.busId ?? ''}`} />
      <Card><CardContent className="p-3"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or register no…" className="pl-9" /></div></CardContent></Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} hover>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-semibold text-white">{initials(s.name)}</div>
                <div className="flex-1"><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.registerNo}</p></div>
                <QRCode value={`CKCET|${s.id}`} size={48} />
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> Pickup: <span className="font-medium text-foreground">{s.pickupStop}</span></p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-secondary" /> Drop: <span className="font-medium text-foreground">{s.dropStop}</span></p>
                <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {s.phone}</p>
              </div>
              <Badge tone="outline" className="capitalize">{s.department.split(' ')[0]} · Y{s.year}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <EmptyState icon={<Users className="h-8 w-8" />} title="No students found" description={query ? 'Try a different search.' : 'No students assigned to your bus yet.'} />}
    </div>
  );
}
