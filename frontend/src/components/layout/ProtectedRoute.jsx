import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.js'

export default function ProtectedRoute({ children, role }) {
  const { utoken, dtoken, atoken } = useAuthStore()

  if (role === 'user' && !utoken) {
    return <Navigate to="/connexion" replace />
  }
  if (role === 'doctor' && !dtoken) {
    return <Navigate to="/medecin/connexion" replace />
  }
  if (role === 'admin' && !atoken) {
    return <Navigate to="/admin/connexion" replace />
  }

  return children
}
