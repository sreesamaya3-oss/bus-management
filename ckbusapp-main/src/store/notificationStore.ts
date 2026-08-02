import { create } from 'zustand';
import type { Notification } from '@/lib/types';
import { notifications as seed } from '@/lib/dummyData';

interface NotificationState {
  items: Notification[];
  unread: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: seed,
  unread: seed.filter((n) => !n.read).length,
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })), unread: 0 })),
  markRead: (id) => set((s) => {
    const items = s.items.map((n) => (n.id === id ? { ...n, read: true } : n));
    return { items, unread: items.filter((n) => !n.read).length };
  }),
}));
