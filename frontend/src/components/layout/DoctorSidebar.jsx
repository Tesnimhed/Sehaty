import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore.js'
import { useDoctorStore } from '../../store/useDoctorStore.js'
import { useSidebar } from '../../hooks/useSidebar.js'

const navItems = [
  { to: '/medecin/tableau-de-bord', icon: 'dashboard',      label: 'Tableau de bord' },
  { to: '/medecin/rendez-vous',     icon: 'calendar_month', label: 'Rendez-vous' },
  { to: '/medecin/profil',          icon: 'person',         label: 'Mon profil' },
  { to: '/medecin/gains',           icon: 'payments',       label: 'Gains' },
]

export default function DoctorSidebar() {
  const { logout }  = useAuthStore()
  const { profile } = useDoctorStore()
  const navigate    = useNavigate()
  const location    = useLocation()
  const { isOpen, close, closeOnMobile } = useSidebar()

  // ✅ Ferme uniquement sur mobile au changement de route
  useEffect(() => { closeOnMobile() }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen && window.innerWidth < 768 ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleLogout = () => { logout(); navigate('/medecin/connexion') }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 py-3 px-4 transition-colors duration-200 ${
      isActive
        ? 'text-primary font-semibold border-l-4 border-primary bg-secondary-container/10'
        : 'text-on-surface-variant border-l-4 border-transparent hover:bg-surface-container'
    }`

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={close} aria-hidden="true" />
      )}

      <aside
        className={`fixed left-0 top-0 h-full flex flex-col py-6 z-40 bg-surface-container-lowest shadow-md w-64 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation médecin"
      >
        <div className="px-4 mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary leading-none">Sehaty</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Portail Médical</p>
            </div>
          </div>
          <button onClick={close} className="md:hidden p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {profile && (
          <div className="mx-4 mb-6 p-3 bg-surface-container rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
              {profile.image
                ? <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-surface-container-high"><span className="material-symbols-outlined text-outline text-[18px]">person</span></div>
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{profile.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{profile.speciality}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 py-3 px-4 text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors rounded-xl">
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}