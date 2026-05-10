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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useNotifications()

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false)
    setMobileMenuOpen(false)
    navigate('/connexion')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-primary font-semibold border-b-2 border-primary pb-0.5 transition-colors duration-200'
      : 'text-on-surface-variant text-sm hover:text-primary transition-colors duration-200'

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-on-surface hover:bg-surface-container'
    }`

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-md">
        <nav className="flex justify-between items-center w-full px-4 md:px-lg py-md max-w-container-max mx-auto">

          {/* ── Logo ── */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link to="/" className="text-xl font-bold text-primary tracking-tight">
              Sehaty
            </Link>

            {/* ── Liens desktop ── */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/" end className={navLinkClass}>Accueil</NavLink>
              <NavLink to="/medecins" className={navLinkClass}>Médecins</NavLink>
              <NavLink to="/a-propos" className={navLinkClass}>À propos</NavLink>
            </div>
          </div>

          {/* ── Droite ── */}
          <div className="flex items-center gap-2 md:gap-3">
            {utoken ? (
              <>
                <NotificationBell />

                {/* Menu profil desktop */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors"
                    aria-expanded={profileMenuOpen}
                    aria-label="Menu profil"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high">
                      {profile?.image ? (
                        <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline text-[20px]">person</span>
                        </div>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      {profileMenuOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {profileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setProfileMenuOpen(false)} />
                      <div className="absolute right-0 top-12 w-52 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant z-40 overflow-hidden py-1">
                        <Link
                          to="/mon-profil"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <span className="material-symbols-outlined text-[18px] text-outline">person</span>
                          Mon profil
                        </Link>
                        <Link
                          to="/mes-rendez-vous"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <span className="material-symbols-outlined text-[18px] text-outline">calendar_month</span>
                          Mes rendez-vous
                        </Link>
                        <Link
                          to="/notifications"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <span className="material-symbols-outlined text-[18px] text-outline">notifications</span>
                          Notifications
                        </Link>
                        <div className="h-px bg-outline-variant mx-4 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error-container/30 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Déconnexion
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Avatar mobile (sans dropdown — géré dans le menu hamburger) */}
                <div className="md:hidden w-9 h-9 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high flex-shrink-0">
                  {profile?.image ? (
                    <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline text-[20px]">person</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/connexion" className="text-sm font-semibold text-primary hover:underline">
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

            {/* ── Bouton hamburger (mobile uniquement) ── */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant"
              aria-expanded={mobileMenuOpen}
              aria-label="Menu principal"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Menu mobile déroulant ── */}
      <div
        className={`
          fixed top-[64px] left-0 right-0 z-40 md:hidden
          bg-surface-container-lowest shadow-xl border-t border-outline-variant
          transition-all duration-300 ease-in-out overflow-hidden
          ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="p-4 flex flex-col gap-1">
          {/* Liens de navigation */}
          <NavLink to="/" end className={mobileNavLinkClass} onClick={closeMobileMenu}>
            <span className="material-symbols-outlined text-[20px]">home</span>
            Accueil
          </NavLink>
          <NavLink to="/medecins" className={mobileNavLinkClass} onClick={closeMobileMenu}>
            <span className="material-symbols-outlined text-[20px]">medical_services</span>
            Médecins
          </NavLink>
          <NavLink to="/a-propos" className={mobileNavLinkClass} onClick={closeMobileMenu}>
            <span className="material-symbols-outlined text-[20px]">info</span>
            À propos
          </NavLink>

          {utoken ? (
            <>
              <div className="h-px bg-outline-variant my-2" />
              <NavLink to="/mon-profil" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                <span className="material-symbols-outlined text-[20px]">person</span>
                Mon profil
              </NavLink>
              <NavLink to="/mes-rendez-vous" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                Mes rendez-vous
              </NavLink>
              <NavLink to="/notifications" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                Notifications
              </NavLink>
              <div className="h-px bg-outline-variant my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error-container/30 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <div className="h-px bg-outline-variant my-2" />
              <Link
                to="/connexion"
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                onClick={closeMobileMenu}
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors"
                onClick={closeMobileMenu}
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay pour fermer le menu mobile en cliquant dehors */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  )
}