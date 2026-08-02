import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

type Severity = 'high' | 'medium' | 'low';
const sevMap: Record<Severity, { icon: typeof AlertTriangle; tone: string }> = {
  high: { icon: AlertTriangle, tone: 'text-destructive bg-destructive/10' },
  medium: { icon: TrendingUp, tone: 'text-warning bg-warning/10' },
  low: { icon: Lightbulb, tone: 'text-success bg-success/10' },
};

export function AISummaryCard({ title = 'AI Summary', message, severity = 'low' }: { title?: string; message: string; severity?: Severity }) {
  const { icon: Icon, tone } = sevMap[severity];
  return (
    <Card className="relative overflow-hidden border-primary/30">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
      <CardContent className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Sparkles className="h-5 w-5" /></div>
          <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">AI-powered insight</p></div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <div className={cn('mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', tone)}>
          <Icon className="h-3.5 w-3.5" />
          {severity === 'high' ? 'Needs attention' : severity === 'medium' ? 'Recommended' : 'On track'}
        </div>
      </CardContent>
    </Card>
  );
}
