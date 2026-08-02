import { useQuery } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { parentService, studentService, busService, journeyService } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { JourneyTimeline } from '@/components/shared/JourneyTimeline';
import { SectionHeader } from '@/components/ui/EmptyState';

export default function ParentTimeline() {
  const { data: parent } = useQuery({ queryKey: ['parent-me'], queryFn: parentService.me });
  const { data: child } = useQuery({ queryKey: ['child', parent?.childId], queryFn: () => studentService.get(parent?.childId ?? 'stu-01'), enabled: !!parent });
  const { data: bus } = useQuery({ queryKey: ['child-bus', child?.busId], queryFn: () => busService.get(child?.busId ?? 'CKCET-01'), enabled: !!child });
  const { data: events } = useQuery({ queryKey: ['journey-events'], queryFn: journeyService.events });

  return (
    <div className="space-y-6">
      <SectionHeader title="Safety Timeline" subtitle="Complete journey timeline for your child" action={<Badge tone="success"><ShieldCheck className="h-3 w-3" /> Child Safe</Badge>} />
      <Card>
        <CardHeader><CardTitle>Today Journey</CardTitle><CardDescription>Track every stage of {child?.name} transport — from home to college and back</CardDescription></CardHeader>
        <CardContent><JourneyTimeline events={events ?? []} /></CardContent>
      </Card>
      <Card className="border-success/30 bg-gradient-to-br from-success/5 to-transparent"><CardContent className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-success" /><p className="text-sm">All safety checkpoints passed so far. Your child is secure and being monitored throughout the journey.</p></CardContent></Card>
    </div>
  );
}
