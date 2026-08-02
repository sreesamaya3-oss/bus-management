import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Bus, Wrench, PartyPopper, GraduationCap } from 'lucide-react';
import { calendarService } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const typeMap = {
  holiday: { icon: PartyPopper, tone: 'bg-secondary/15 text-secondary', label: 'Holiday' },
  'exam-bus': { icon: GraduationCap, tone: 'bg-primary/15 text-primary', label: 'Exam Bus' },
  maintenance: { icon: Wrench, tone: 'bg-warning/15 text-warning', label: 'Maintenance' },
  special: { icon: Bus, tone: 'bg-accent/15 text-accent', label: 'Special' },
};

export default function AdminCalendar() {
  const { data: events } = useQuery({ queryKey: ['calendar'], queryFn: calendarService.list });
  const sorted = [...(events ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="space-y-6">
      <SectionHeader title="Transport Calendar" subtitle="Holidays, exam buses, maintenance and special transport" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((e) => {
          const { icon: Icon, tone, label } = typeMap[e.type];
          const date = new Date(e.date);
          return (
            <Card key={e.id} hover>
              <CardContent className="flex gap-3">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', tone)}><Icon className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between"><p className="font-semibold">{e.title}</p><Badge tone="outline">{label}</Badge></div>
                  <p className="mt-1 text-xs text-muted-foreground">{date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardContent>
          <p className="flex items-center gap-2 font-semibold"><CalendarDays className="h-5 w-5 text-primary" /> Legend</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(typeMap) as [keyof typeof typeMap, typeof typeMap.holiday][]).map(([key, v]) => {
              const Icon = v.icon;
              return <div key={key} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-sm"><div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', v.tone)}><Icon className="h-4 w-4" /></div>{v.label}</div>;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
