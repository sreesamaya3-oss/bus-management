import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, Clock, CheckCircle2, Bus, School, MapPin } from 'lucide-react';
import type { ScheduleStatus } from '@/lib/types';
import { pad, cn } from '@/lib/utils';

const statusConfig: Record<ScheduleStatus, { label: string; tone: string; icon: typeof Clock }> = {
  'upcoming': { label: 'Upcoming', tone: 'bg-muted text-muted-foreground', icon: Clock },
  'arriving-soon': { label: 'Arriving Soon', tone: 'bg-warning/15 text-warning', icon: Timer },
  'waiting-at-stop': { label: 'Waiting at Stop', tone: 'bg-primary/15 text-primary', icon: MapPin },
  'departed': { label: 'Departed', tone: 'bg-accent/15 text-accent', icon: Bus },
  'reached-college': { label: 'Reached College', tone: 'bg-success/15 text-success', icon: School },
};

export function ScheduleCountdown({ seconds, status, statusMessage }: { seconds: number; status: ScheduleStatus; statusMessage: string }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    setRemaining(seconds);
    const t = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const cfg = statusConfig[status] ?? statusConfig.upcoming;
  const Icon = cfg.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', cfg.tone)}><Icon className="h-6 w-6" /></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Bus arriving in</p>
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', cfg.tone)}>{cfg.label}</span>
          </div>
          <motion.p key={remaining} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="font-mono text-3xl font-bold tabular-nums">{pad(m)}:{pad(s)}</motion.p>
        </div>
      </div>
      <div className={cn('flex items-center gap-2 rounded-lg p-3 text-sm', cfg.tone)}>
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{statusMessage}</span>
      </div>
    </div>
  );
}
