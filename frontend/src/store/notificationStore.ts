import { create } from 'zustand'
import { Notification } from '../types'
import api from '../services/api'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  fetchUnread: () => Promise<void>
  fetchAll: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  setOpen: (open: boolean) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,

  fetchUnread: async () => {
    try {
      const { data } = await api.get('/api/notifications/unread')
      set({ unreadCount: data.count, notifications: data.notifications })
    } catch { /* ignore */ }
  },

  fetchAll: async () => {
    try {
      const { data } = await api.get('/api/notifications')
      set({ notifications: data, unreadCount: data.filter((n: Notification) => !n.isRead).length })
    } catch { /* ignore */ }
  },

  markRead: async (id) => {
    await api.patch(`/api/notifications/${id}/read`)
    set((state) => ({
      notifications: state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  markAllRead: async () => {
    await api.patch('/api/notifications/read-all')
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }))
    get().fetchAll()
  },

  setOpen: (open) => {
    set({ isOpen: open })
    if (open) get().fetchAll()
  },
}))
