import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Circle, Sunrise, Sunset, Moon } from 'lucide-react';
import type { DailyOperation } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const phaseIcon = {
  'morning-prep': Sunrise, 'morning-boarding': Sunrise, 'morning-transit': Sunrise,
  'college-hours': Moon, 'evening-boarding': Sunset, 'evening-transit': Sunset, 'completed': Moon,
};

export function OperationsStatus({ operations, className }: { operations: DailyOperation[]; className?: string }) {
  const done = operations.filter((o) => o.status === 'done').length;
  const active = operations.find((o) => o.status === 'active');
  const progress = Math.round((done / operations.length) * 100);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Operations</span>
          <Badge tone={active ? 'primary' : 'success'}>{progress}% Complete</Badge>
        </CardTitle>
        <CardDescription>
          {active ? `Current: ${active.label}` : 'All operations completed'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} />
        </div>
        <div className="space-y-1">
          {operations.map((op, i) => {
            const Icon = phaseIcon[op.phase] ?? Clock;
            const last = i === operations.length - 1;
            return (
              <div key={op.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', op.status === 'done' && 'bg-success/15 text-success', op.status === 'active' && 'bg-primary text-primary-foreground', op.status === 'upcoming' && 'bg-muted text-muted-foreground')}>
                    {op.status === 'done' ? <CheckCircle2 className="h-4 w-4" /> : op.status === 'active' ? <Icon className="h-4 w-4 animate-pulse" /> : <Circle className="h-4 w-4" />}
                  </div>
                  {!last && <div className={cn('w-0.5 flex-1 min-h-[24px] rounded-full', op.status === 'done' ? 'bg-success/40' : 'bg-border')} />}
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs text-muted-foreground">{op.time}</p>
                    {op.status === 'active' && <Badge tone="primary" className="text-[10px]">Active</Badge>}
                  </div>
                  <p className="text-sm font-medium">{op.label}</p>
                  <p className="text-xs text-muted-foreground">{op.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
