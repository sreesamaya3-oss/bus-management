import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, User } from '@/lib/types';

interface AuthState {
  role: UserRole | null;
  user: User | null;
  setRole: (role: UserRole | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null, user: null,
      setRole: (role) => set({ role }),
      setUser: (user) => set({ user }),
      logout: () => set({ role: null, user: null }),
    }),
    { name: 'ckcet-auth' }
  )
);
