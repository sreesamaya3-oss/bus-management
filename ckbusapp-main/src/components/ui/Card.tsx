import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

export function Card({ className, glass, hover, ...props }: CardProps) {
  return <div className={cn('rounded-xl border border-border bg-card text-card-foreground shadow-soft', glass && 'glass', hover && 'card-hover', className)} {...props} />;
}
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-5 pb-0', className)} {...props} />;
}
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-lg font-semibold tracking-tight', className)} {...props} />;
}
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-5 pt-0', className)} {...props} />;
}

interface StatCardProps {
  label: string; value: ReactNode; icon?: ReactNode; trend?: string; trendUp?: boolean;
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'destructive';
}

export function StatCard({ label, value, icon, trend, trendUp, accent = 'primary' }: StatCardProps) {
  const accentMap = {
    primary: 'from-primary/20 to-primary/5 text-primary', secondary: 'from-secondary/20 to-secondary/5 text-secondary',
    accent: 'from-accent/20 to-accent/5 text-accent', success: 'from-success/20 to-success/5 text-success',
    warning: 'from-warning/20 to-warning/5 text-warning', destructive: 'from-destructive/20 to-destructive/5 text-destructive',
  };
  return (
    <Card hover className="relative overflow-hidden">
      <div className={cn('absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl opacity-60', accentMap[accent])} />
      <CardContent className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{value}</p>
            {trend && <p className={cn('mt-1 text-xs font-medium', trendUp ? 'text-success' : 'text-destructive')}>{trend}</p>}
          </div>
          {icon && <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br', accentMap[accent])}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
