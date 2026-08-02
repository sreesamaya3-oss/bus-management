import { useEffect, useState } from 'react';
import { formatTime, formatDate } from '@/lib/utils';

export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={className}>
      <p className="font-mono text-3xl font-semibold tabular-nums tracking-tight">{formatTime(now)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{formatDate(now)}</p>
    </div>
  );
}
