import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { pad } from '@/lib/utils';

export function ETACountdown({ seconds, label = 'ETA' }: { seconds: number; label?: string }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    setRemaining(seconds);
    const t = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary"><Timer className="h-6 w-6" /></div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-mono text-2xl font-bold tabular-nums">{pad(m)}:{pad(s)}</p>
      </div>
    </div>
  );
}
