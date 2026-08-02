import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { DEMO_MODE_MESSAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function DemoModeBanner({ className }: { className?: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className={cn('flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-muted-foreground', className)}>
      <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="flex-1">{DEMO_MODE_MESSAGE}</span>
      <button onClick={() => setDismissed(true)} className="shrink-0 rounded p-0.5 hover:bg-muted" aria-label="Dismiss"><X className="h-3.5 w-3.5" /></button>
    </div>
  );
}
