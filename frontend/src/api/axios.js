import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach correct token per route
api.interceptors.request.use((config) => {
  const url = config.url || ''

  if (url.includes('/api/user/')) {
    const utoken = localStorage.getItem('utoken')
    if (utoken) config.headers['token'] = utoken
  } else if (url.includes('/api/doctor/') && !url.includes('/api/doctor/list')) {
    const dtoken = localStorage.getItem('dtoken')
    if (dtoken) config.headers['dtoken'] = dtoken
  } else if (url.includes('/api/admin/')) {
    const atoken = localStorage.getItem('atoken')
    if (atoken) config.headers['atoken'] = atoken
  }

  return config
})

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => {
    // If backend returns success: false, show toast error
    if (response.data && response.data.success === false) {
      const msg = response.data.message || 'Une erreur est survenue'
      toast.error(msg)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear all tokens and redirect
      localStorage.removeItem('utoken')
      localStorage.removeItem('dtoken')
      localStorage.removeItem('atoken')
      toast.error('Session expirée, veuillez vous reconnecter.')
      window.location.href = '/connexion'
    } else {
      const msg =
        error.response?.data?.message || 'Erreur de connexion au serveur'
      toast.error(msg)
    }
    return Promise.reject(error)
  }
)

export default api
