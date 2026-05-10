import { create } from 'zustand'
import { userApi } from '../api/userApi.js'
import toast from 'react-hot-toast'

export const useUserStore = create((set, get) => ({
  profile: null,
  appointments: [],
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchProfile: async () => {
    set({ loading: true })
    try {
      const res = await userApi.getProfile()
      if (res.data.success) {
        set({ profile: res.data.userData })
      }
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (formData) => {
    set({ loading: true })
    try {
      const res = await userApi.updateProfile(formData)
      if (res.data.success) {
        toast.success('Profil mis à jour avec succès')
        await get().fetchProfile()
        return true
      }
      return false
    } catch {
      return false
    } finally {
      set({ loading: false })
    }
  },

  fetchAppointments: async () => {
    set({ loading: true })
    try {
      const res = await userApi.getAppointments()
      if (res.data.success) {
        set({ appointments: res.data.appointments || [] })
      }
    } finally {
      set({ loading: false })
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      const res = await userApi.cancelAppointment(appointmentId)
      if (res.data.success) {
        toast.success('Rendez-vous annulé')
        await get().fetchAppointments()
      }
    } catch {}
  },

  fetchNotifications: async () => {
    try {
      const res = await userApi.getNotifications()
      if (res.data.success) {
        const notifs = res.data.notifications || []
        const unread = notifs.filter((n) => !n.isRead).length
        set({ notifications: notifs, unreadCount: unread })
      }
    } catch {}
  },

  markNotificationRead: async (notificationId) => {
    try {
      const res = await userApi.markNotificationRead(notificationId)
      if (res.data.success) {
        const notifs = get().notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
        const unread = notifs.filter((n) => !n.isRead).length
        set({ notifications: notifs, unreadCount: unread })
      }
    } catch {}
  },
}))