import { motion } from 'framer-motion';
import { Home, MapPin, Bus, School, ArrowRight, CheckCircle2, Clock, Navigation } from 'lucide-react';
import type { JourneyEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

const iconMap = {
  home: Home, pickup: MapPin, boarded: Bus, transit: Navigation, campus: School, return: Bus, drop: Home,
};

export function JourneyTimeline({ events, className }: { events: JourneyEvent[]; className?: string }) {
  return (
    <div className={cn('space-y-1', className)}>
      {events.map((e, i) => {
        const Icon = iconMap[e.icon] ?? MapPin;
        const last = i === events.length - 1;
        return (
          <div key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.06 }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  e.status === 'done' && 'bg-success/15 text-success',
                  e.status === 'active' && 'bg-primary text-primary-foreground shadow-glow',
                  e.status === 'upcoming' && 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              {!last && <div className={cn('w-0.5 flex-1 min-h-[36px] rounded-full', e.status === 'done' ? 'bg-success/40' : 'bg-border')} />}
            </div>
            <div className="pb-5">
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-semibold">{e.time}</p>
                {e.status === 'done' && <span className="flex items-center gap-0.5 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success"><CheckCircle2 className="h-3 w-3" /> Done</span>}
                {e.status === 'active' && <span className="flex items-center gap-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary"><Clock className="h-3 w-3" /> Now</span>}
                {e.status === 'upcoming' && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Upcoming</span>}
              </div>
              <p className="mt-0.5 font-medium">{e.title}</p>
              <p className="text-sm text-muted-foreground">{e.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
