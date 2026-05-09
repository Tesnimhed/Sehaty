import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  utoken: localStorage.getItem('utoken') || null,
  dtoken: localStorage.getItem('dtoken') || null,
  atoken: localStorage.getItem('atoken') || null,

  setUToken: (token) => {
    localStorage.setItem('utoken', token)
    set({ utoken: token })
  },
  setDToken: (token) => {
    localStorage.setItem('dtoken', token)
    set({ dtoken: token })
  },
  setAToken: (token) => {
    localStorage.setItem('atoken', token)
    set({ atoken: token })
  },
  logout: () => {
    localStorage.removeItem('utoken')
    localStorage.removeItem('dtoken')
    localStorage.removeItem('atoken')
    set({ utoken: null, dtoken: null, atoken: null })
  },
}))
