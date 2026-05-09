import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { useUserStore } from '../store/useUserStore.js'

export function useNotifications() {
  const { utoken } = useAuthStore()
  const { fetchNotifications } = useUserStore()

  useEffect(() => {
    if (!utoken) return

    // Fetch immediately
    fetchNotifications()

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [utoken, fetchNotifications])
}
