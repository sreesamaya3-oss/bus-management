import { motion } from 'framer-motion';
import { MapPin, Clock, Users, ArrowDown, School, Timer } from 'lucide-react';
import type { StopSchedule } from '@/lib/types';
import { cn } from '@/lib/utils';

export function StopTimetable({ stops, className, currentStopIndex }: { stops: StopSchedule[]; className?: string; currentStopIndex?: number }) {
  return (
    <div className={cn('space-y-1', className)}>
      {stops.map((stop, i) => {
        const last = i === stops.length - 1;
        const isCurrent = currentStopIndex === i;
        const isPast = currentStopIndex !== undefined && i < currentStopIndex;
        const Icon = stop.isCampus ? School : MapPin;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  isPast && 'bg-success/15 text-success',
                  isCurrent && 'bg-primary text-primary-foreground shadow-glow',
                  !isPast && !isCurrent && 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              {!last && <div className={cn('w-0.5 flex-1 min-h-[48px] rounded-full', isPast ? 'bg-success/40' : 'bg-border')} />}
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{stop.stopName}</p>
                {isCurrent && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">Current</span>}
                {stop.isCampus && <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-medium text-secondary">Campus</span>}
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> Arrival: <strong className="font-mono text-foreground">{stop.arrivalTime}</strong></span>
                {!stop.isCampus && <span className="flex items-center gap-1"><Timer className="h-3 w-3 text-warning" /> Wait: <strong className="font-mono text-foreground">{stop.waitingDuration} min</strong></span>}
                {!stop.isCampus && <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-accent" /> Departure: <strong className="font-mono text-foreground">{stop.departureTime}</strong></span>}
                <span className="flex items-center gap-1"><Users className="h-3 w-3 text-secondary" /> {stop.studentsBoarding} students</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
