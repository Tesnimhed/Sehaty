import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.js'

const navItems = [
  { to: '/admin/tableau-de-bord', icon: 'dashboard', label: 'Tableau de bord' },
  { to: '/admin/medecins', icon: 'medical_services', label: 'Médecins' },
  { to: '/admin/patients', icon: 'group', label: 'Patients' },
  { to: '/admin/rendez-vous', icon: 'calendar_month', label: 'Rendez-vous' },
]

export default function AdminSidebar() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/connexion')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 py-3 px-4 transition-colors duration-200 ${
      isActive
        ? 'text-primary font-semibold border-l-4 border-primary bg-secondary-container/10 translate-x-px'
        : 'text-on-surface-variant border-l-4 border-transparent hover:bg-surface-container'
    }`

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-6 z-40 bg-surface-container-lowest shadow-md w-64">
      <div className="px-4 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-on-tertiary">
          <span className="material-symbols-outlined">admin_panel_settings</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary leading-none">Sehaty</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Administration</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 py-3 px-4 text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors rounded-xl"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
