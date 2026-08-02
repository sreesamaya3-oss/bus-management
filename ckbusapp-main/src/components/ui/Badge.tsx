import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'destructive' | 'outline';

const tones: Record<Tone, string> = {
  default: 'bg-muted text-muted-foreground', primary: 'bg-primary/15 text-primary', secondary: 'bg-secondary/15 text-secondary',
  accent: 'bg-accent/15 text-accent', success: 'bg-success/15 text-success', warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/15 text-destructive', outline: 'border border-border text-foreground',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { tone?: Tone; }

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)} {...props} />;
}
