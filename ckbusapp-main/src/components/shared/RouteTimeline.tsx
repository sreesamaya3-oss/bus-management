import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Stop } from '@/lib/types';
import { cn } from '@/lib/utils';

export function RouteTimeline({ stops, progress }: { stops: Stop[]; progress: number }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 2000);
    return () => clearInterval(t);
  }, []);
  const totalSegments = Math.max(stops.length - 1, 1);
  const currentIndex = Math.min(Math.floor((progress / 100) * totalSegments), stops.length - 1);

  return (
    <div className="space-y-1">
      {stops.map((stop, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const upcoming = i > currentIndex;
        return (
          <div key={stop.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : active ? (
                <div className="relative">
                  <motion.div className="h-5 w-5 rounded-full bg-primary" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                  <span className="sr-only">Current stop {tick}</span>
                </div>
              ) : <Circle className="h-5 w-5 text-muted-foreground/40" />}
              {i < stops.length - 1 && <div className={cn('w-0.5 flex-1 min-h-[28px] rounded-full', done ? 'bg-success/50' : 'bg-border')} />}
            </div>
            <div>
              <p className={cn('text-sm font-medium', upcoming && 'text-muted-foreground')}>{stop.name}</p>
              <p className="text-xs text-muted-foreground">{active ? 'Bus is here now' : done ? `Arrived ${stop.arrivalTime}` : `Expected ${stop.arrivalTime}`}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
