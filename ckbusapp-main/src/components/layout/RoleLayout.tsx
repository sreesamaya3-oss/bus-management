import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DemoModeBanner } from '@/components/shared/DemoModeBanner';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/lib/constants';

export function RoleLayout({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false);
  const { role: storedRole } = useAuthStore();
  const location = useLocation();
  if (storedRole && storedRole !== role) return <Navigate to={`/${storedRole}`} replace />;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          <DemoModeBanner className="mb-4" />
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
