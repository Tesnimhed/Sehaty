import { useEffect } from 'react'
import { useDoctorStore } from '../../store/useDoctorStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatSlotDate } from '../../utils/formatDate.js'
import Badge, { getAppointmentStatus } from '../../components/ui/Badge.jsx'

function StatCard({ icon, label, value, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    secondary: 'bg-secondary-container text-on-secondary-container',
  }
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
      <p className="text-sm text-on-surface-variant mt-1">{label}</p>
    </div>
  )
}

export default function DoctorDashboardPage() {
  const { dashData, appointments, loading, fetchDashboard, fetchAppointments, fetchProfile, profile, changeAvailability } = useDoctorStore()

  useEffect(() => {
    fetchDashboard()
    fetchAppointments()
    fetchProfile()
  }, [])

  if (loading && !dashData) return <Spinner size="lg" className="py-32" />

  // ── Calculs dérivés depuis la liste des rendez-vous ──
  // (le backend renvoie : dashData.earnings / dashData.appointments / dashData.patients)
  // completed et pending ne sont pas dans dashData → on les calcule depuis appointments
  const completedCount = appointments.filter(a => a.isCompleted).length
  const pendingCount   = appointments.filter(a => !a.isCompleted && !a.cancelled).length

  const recentAppts = appointments.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Tableau de bord</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Bienvenue, {profile?.name || 'Docteur'}
          </p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer bg-surface-container-lowest rounded-xl px-5 py-3 shadow-md border border-outline-variant">
          <span className="text-sm font-semibold text-on-surface">
            {profile?.available ? 'Disponible' : 'Indisponible'}
          </span>
          <div className="relative" onClick={changeAvailability}>
            <div
              className={`w-12 h-6 rounded-full transition-colors ${
                profile?.available ? 'bg-primary' : 'bg-outline-variant'
              }`}
            />
            <div
              className={`absolute top-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${
                profile?.available ? 'translate-x-[26px]' : 'translate-x-[2px]'
              }`}
            />
          </div>
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="calendar_month"
          label="Total rendez-vous"
          value={dashData?.appointments ?? '—'}
          color="primary"
        />
        <StatCard
          icon="check_circle"
          label="Terminés"
          value={appointments.length > 0 ? completedCount : (dashData ? '0' : '—')}
          color="green"
        />
        <StatCard
          icon="pending"
          label="En attente"
          value={appointments.length > 0 ? pendingCount : (dashData ? '0' : '—')}
          color="amber"
        />
        <StatCard
          icon="payments"
          label="Revenus totaux"
          value={dashData?.earnings != null ? formatCurrency(dashData.earnings) : '—'}
          color="secondary"
        />
      </div>

      {/* Recent appointments */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-5">Rendez-vous récents</h2>
        {recentAppts.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-[40px] text-outline block mb-2">calendar_month</span>
            <p className="text-sm text-on-surface-variant">Aucun rendez-vous pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAppts.map((appt) => (
              <div key={appt._id} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
                  {appt.userData?.image ? (
                    <img src={appt.userData.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline text-[18px]">person</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{appt.userData?.name || '—'}</p>
                  <p className="text-xs text-on-surface-variant">
                    {formatSlotDate(appt.slotDate)} à {appt.slotTime}
                  </p>
                </div>
                <Badge status={getAppointmentStatus(appt)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}