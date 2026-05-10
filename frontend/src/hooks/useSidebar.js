import { create } from 'zustand'

/**
 * useSidebar — état de la sidebar.
 * - Desktop (≥768px) : ouverte par défaut, reste ouverte au changement de route
 * - Mobile  (<768px) : fermée par défaut, se ferme au changement de route
 */

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768

export const useSidebar = create((set) => ({
  isOpen: isDesktop(),
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  // Appelé à chaque changement de route — ferme uniquement sur mobile
  closeOnMobile: () => {
    if (!isDesktop()) set({ isOpen: false })
  },
}))