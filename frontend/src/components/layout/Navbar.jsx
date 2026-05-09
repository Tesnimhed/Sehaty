import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore.js'
import { useUserStore } from '../../store/useUserStore.js'
import NotificationBell from '../notification/NotificationBell.jsx'
import { useNotifications } from '../../hooks/useNotifications.js'

export default function Navbar() {
  const { utoken, logout } = useAuthStore()
  const { profile } = useUserStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  useNotifications()

  const handleLogout = () => {
    logout()
    navigate('/connexion')
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-primary font-semibold border-b-2 border-primary pb-0.5 transition-colors duration-200'
      : 'text-on-surface-variant text-sm hover:text-primary transition-colors duration-200'

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-md">
      <nav className="flex justify-between items-center w-full px-lg py-md max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-primary tracking-tight">
            Sehaty
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Accueil</NavLink>
            <NavLink to="/medecins" className={navLinkClass}>Médecins</NavLink>
            <NavLink to="/a-propos" className={navLinkClass}>À propos</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {utoken ? (
            <>
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high">
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline text-[20px]">person</span>
                      </div>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">
                    {menuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-12 w-52 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant z-40 overflow-hidden py-1">
                      <Link
                        to="/mon-profil"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">person</span>
                        Mon profil
                      </Link>
                      <Link
                        to="/mes-rendez-vous"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">calendar_month</span>
                        Mes rendez-vous
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[18px] text-outline">notifications</span>
                        Notifications
                      </Link>
                      <div className="h-px bg-outline-variant mx-4 my-1" />
                      <button
                        onClick={() => { handleLogout(); setMenuOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error-container/30 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/connexion"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="h-10 px-5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center"
              >
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
