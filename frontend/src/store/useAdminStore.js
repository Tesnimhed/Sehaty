import { create } from 'zustand'
import { adminApi } from '../api/adminApi.js'
import toast from 'react-hot-toast'

export const useAdminStore = create((set, get) => ({
  doctors:      [],
  patients:     [],
  appointments: [],
  dashData:     null,
  loading:      false,

  fetchDoctors: async () => {
    set({ loading: true })
    try {
      const res = await adminApi.getDoctors()
      if (res.data.success) set({ doctors: res.data.doctors || [] })
    } finally { set({ loading: false }) }
  },

  addDoctor: async (formData) => {
    set({ loading: true })
    try {
      const res = await adminApi.addDoctor(formData)
      if (res.data.success) {
        toast.success('Médecin ajouté avec succès')
        await get().fetchDoctors()
        return true
      }
      return false
    } catch { return false }
    finally { set({ loading: false }) }
  },

  deleteDoctor: async (docId) => {
    try {
      const res = await adminApi.deleteDoctor(docId)
      if (res.data.success) {
        toast.success('Médecin supprimé')
        await get().fetchDoctors()
      }
    } catch {}
  },

  toggleAvailability: async (docId) => {
    try {
      const res = await adminApi.toggleAvailability(docId)
      if (res.data.success) {
        toast.success('Disponibilité mise à jour')
        await get().fetchDoctors()
      }
    } catch {}
  },

  fetchPatients: async () => {
    set({ loading: true })
    try {
      const res = await adminApi.getPatients()
      if (res.data.success) set({ patients: res.data.users || [] })
    } finally { set({ loading: false }) }
  },

  // ✅ Supprimer un patient
  deletePatient: async (userId) => {
    try {
      const res = await adminApi.deletePatient(userId)
      if (res.data.success) {
        toast.success('Patient supprimé')
        set((s) => ({ patients: s.patients.filter((p) => p._id !== userId) }))
      }
    } catch {}
  },

  fetchAppointments: async () => {
    set({ loading: true })
    try {
      const res = await adminApi.getAppointments()
      if (res.data.success) set({ appointments: res.data.appointments || [] })
    } finally { set({ loading: false }) }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      const res = await adminApi.cancelAppointment(appointmentId)
      if (res.data.success) {
        toast.success('Rendez-vous annulé')
        await get().fetchAppointments()
      }
    } catch {}
  },

  fetchDashboard: async () => {
    set({ loading: true })
    try {
      const res = await adminApi.getDashboard()
      if (res.data.success) set({ dashData: res.data.dashData })
    } finally { set({ loading: false }) }
  },
}))