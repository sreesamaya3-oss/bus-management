import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, GraduationCap, Users, BadgeCheck, ShieldCheck, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/Card';
import { APP_NAME, APP_FULL_NAME, INSTITUTION_NAME, LOCATION, ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/lib/constants';
import type { UserRole } from '@/lib/types';

const roleCards: { role: UserRole; icon: typeof GraduationCap; gradient: string }[] = [
  { role: 'student', icon: GraduationCap, gradient: 'from-primary to-accent' },
  { role: 'parent', icon: Users, gradient: 'from-secondary to-primary' },
  { role: 'driver', icon: BadgeCheck, gradient: 'from-accent to-secondary' },
  { role: 'admin', icon: ShieldCheck, gradient: 'from-primary to-secondary' },
];

export default function RoleSelect() {
  const setRole = useAuthStore((s) => s.setRole);
  const navigate = useNavigate();

  const proceed = (role: UserRole) => {
    setRole(role);
    navigate(`/${role}/login`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-glow"><Bus className="h-8 w-8 text-white" /></div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"><span className="gradient-text">{APP_NAME}</span></h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">{APP_FULL_NAME}</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {INSTITUTION_NAME}, {LOCATION}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roleCards.map(({ role, icon: Icon, gradient }, i) => (
            <motion.button key={role} onClick={() => proceed(role)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} whileHover={{ y: -6 }} className="group text-left">
              <Card hover className="h-full overflow-hidden">
                <CardContent className="relative">
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-soft`}><Icon className="h-7 w-7 text-white" /></div>
                  <p className="font-display text-lg font-semibold">{ROLE_LABELS[role]}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">Continue <ArrowRight className="h-4 w-4" /></div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </motion.div>
        <div className="mt-10 flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-primary" /> AI-powered transport management · Frontend preview</div>
      </div>
    </div>
  );
}
