import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

export function useAuth() {
  const { utoken, dtoken, atoken, logout } = useAuthStore()
  const navigate = useNavigate()

  const isUser = !!utoken
  const isDoctor = !!dtoken
  const isAdmin = !!atoken

  const handleLogout = () => {
    logout()
    navigate('/connexion')
  }

  return { isUser, isDoctor, isAdmin, handleLogout, utoken, dtoken, atoken }
}
