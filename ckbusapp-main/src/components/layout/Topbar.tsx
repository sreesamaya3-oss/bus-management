import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Moon, Search, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { ROLE_LABELS } from '@/lib/constants';
import { initials } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useThemeStore();
  const { user, role, logout } = useAuthStore();
  const { items, unread, markAllRead } = useNotificationStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/70 px-4 backdrop-blur-xl lg:px-6">
      <button onClick={onMenu} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-ring lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
      <div className="hidden flex-1 items-center md:flex">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="search" placeholder="Search routes, students, buses…" className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-ring" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <button onClick={toggle} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-ring" aria-label="Toggle theme">{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
        <div className="relative">
          <button onClick={() => setNotifOpen((o) => !o)} className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-ring" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">{unread}</span>}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3"><p className="text-sm font-semibold">Notifications</p><button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button></div>
                <div className="scrollbar-thin max-h-72 overflow-y-auto">
                  {items.map((n) => (
                    <div key={n.id} className={`border-b border-border/60 px-4 py-3 ${n.read ? 'opacity-60' : ''}`}><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-muted-foreground">{n.message}</p></div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted focus-ring">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">{user ? initials(user.name) : 'U'}</div>
            <div className="hidden text-left sm:block"><p className="text-xs font-semibold leading-tight">{user?.name ?? 'Guest'}</p><p className="text-[10px] text-muted-foreground">{role ? ROLE_LABELS[role] : ''}</p></div>
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
                <button onClick={() => { setProfileOpen(false); navigate(`/${role}/profile`); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"><UserIcon className="h-4 w-4" /> Profile</button>
                <button onClick={() => { logout(); navigate('/'); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" /> Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
