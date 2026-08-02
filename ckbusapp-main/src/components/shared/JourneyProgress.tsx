import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function JourneyProgress({ progress, status, className }: { progress: number; status?: string; className?: string }) {
  const pct = Math.round(progress);
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Journey Progress</span>
        <span className="font-mono font-semibold text-primary">{pct}%</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
      </div>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}
