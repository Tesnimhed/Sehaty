import { create } from 'zustand'
import { doctorApi } from '../api/doctorApi.js'
import toast from 'react-hot-toast'

export const useDoctorStore = create((set, get) => ({
  profile: null,
  appointments: [],
  dashData: null,
  loading: false,

  fetchProfile: async () => {
    set({ loading: true })
    try {
      const res = await doctorApi.getProfile()
      if (res.data.success) {
        set({ profile: res.data.profileData })
      }
    } finally {
      set({ loading: false })
    }
  },

  updateProfile: async (data) => {
    set({ loading: true })
    try {
      const res = await doctorApi.updateProfile(data)
      if (res.data.success) {
        toast.success('Profil mis à jour avec succès')
        await get().fetchProfile()
      }
    } finally {
      set({ loading: false })
    }
  },

  fetchAppointments: async () => {
    set({ loading: true })
    try {
      const res = await doctorApi.getAppointments()
      if (res.data.success) {
        set({ appointments: res.data.appointments || [] })
      }
    } finally {
      set({ loading: false })
    }
  },

  completeAppointment: async (appointmentId) => {
    try {
      const profile = get().profile
      if (!profile) return
      const res = await doctorApi.completeAppointment(profile._id, appointmentId)
      if (res.data.success) {
        toast.success('Rendez-vous marqué comme terminé')
        await get().fetchAppointments()
      }
    } catch {}
  },

  cancelAppointment: async (appointmentId) => {
    try {
      const profile = get().profile
      if (!profile) return
      const res = await doctorApi.cancelAppointment(profile._id, appointmentId)
      if (res.data.success) {
        toast.success('Rendez-vous annulé')
        await get().fetchAppointments()
      }
    } catch {}
  },

  fetchDashboard: async () => {
    set({ loading: true })
    try {
      const res = await doctorApi.getDashboard()
      if (res.data.success) {
        set({ dashData: res.data.dashData })
      }
    } finally {
      set({ loading: false })
    }
  },

  changeAvailability: async () => {
    try {
      const profile = get().profile
      if (!profile) return
      const res = await doctorApi.changeAvailability(profile._id)
      if (res.data.success) {
        toast.success('Disponibilité mise à jour')
        await get().fetchProfile()
      }
    } catch {}
  },
}))
