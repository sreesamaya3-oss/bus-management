import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, APP_NAME, INSTITUTION_SHORT } from '@/lib/constants';
import type { UserRole } from '@/lib/types';

export function Sidebar({ role, open, onClose }: { role: UserRole; open: boolean; onClose: () => void }) {
  const items = NAV_ITEMS[role];
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={cn('fixed z-40 h-full w-64 shrink-0 border-r border-border bg-card/80 backdrop-blur-xl transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-secondary text-white shadow-glow">
            <Icons.Bus className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold tracking-tight">{APP_NAME}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{INSTITUTION_SHORT}</p>
          </div>
        </div>
        <nav className="scrollbar-thin h-[calc(100%-4rem)] overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{role === 'admin' ? 'Transport Office' : role + ' portal'}</p>
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[item.icon] ?? Icons.Circle;
              return (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === `/${role}`} onClick={onClose} className={({ isActive }) => cn('group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                    {({ isActive }) => (
                      <>
                        {isActive && <motion.div layoutId="nav-active" className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary to-accent" transition={{ type: 'spring', damping: 26, stiffness: 300 }} />}
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
