import { create } from 'zustand'

/**
 * useSidebar — état global de la sidebar (ouverte/fermée sur mobile).
 * Partagé entre DoctorSidebar, AdminSidebar et leurs boutons hamburger.
 */
export const useSidebar = create((set) => ({
  isOpen: false,
  open:  () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))