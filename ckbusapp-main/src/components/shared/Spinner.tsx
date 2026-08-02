import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin', className)} />;
}

export function FullPageLoader({ label = 'Loading CKCET-ITMS' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <motion.div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary" animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </motion.div>
      <p className="font-display text-lg font-semibold gradient-text">{label}</p>
      <p className="text-sm text-muted-foreground">CK College of Engineering and Technology</p>
    </div>
  );
}
