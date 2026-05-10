import { create } from 'zustand'

/**
 * useSidebar — état de la sidebar.
 * - Desktop (≥768px) : ouverte par défaut
 * - Mobile  (<768px) : fermée par défaut
 * - Toggle fonctionne sur les deux
 */

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

export const useSidebar = create((set) => ({
  isOpen: !isMobile(),
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))