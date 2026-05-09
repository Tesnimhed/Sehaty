import { useEffect } from 'react'
import { useAdminStore } from '../../store/useAdminStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatSlotDate } from '../../utils/formatDate.js'
import Badge, { getAppointmentStatus } from '../../components/ui/Badge.jsx'

function StatCard({ icon, label, value, sub, color = 'primary' }) {
  const colors = {
    primary: 'from-primary to-on-primary-fixed-variant',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <span className="material-symbols-outlined text-[28px] opacity-90">{icon}</span>
        {sub && <span className="text-xs font-semibold opacity-80 bg-white/20 px-2 py-1 rounded-full">{sub}</span>}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-80 mt-1">{label}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { dashData, appointments, loading, fetchDashboard, fetchAppointments } = useAdminStore()

  useEffect(() => {
    fetchDashboard()
    fetchAppointments()
  }, [])

  if (loading && !dashData) return <Spinner size="lg" className="py-32" />

  // ── Calcul des revenus totaux depuis la liste des rendez-vous ──
  // (l'API /dashboard ne renvoie pas de revenus, on les calcule)
  const totalRevenue = appointments.reduce((sum, appt) => {
    return (appt.isCompleted || appt.isPaid) && !appt.cancelled ? sum + (appt.amount || 0) : sum
  }, 0)

  const recentAppts = appointments.slice(0, 8)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Tableau de bord</h1>
        <p className="text-on-surface-variant text-sm mt-1">Vue d'ensemble de la plateforme Sehaty</p>
      </div>

      {/* Stats */}
      {/* Le backend renvoie : dashData.doctors / dashData.patients / dashData.appointments */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="medical_services"
          label="Médecins"
          value={dashData?.doctors ?? '—'}
          color="primary"
        />
        <StatCard
          icon="group"
          label="Patients"
          value={dashData?.patients ?? '—'}
          color="green"
        />
        <StatCard
          icon="calendar_month"
          label="Rendez-vous"
          value={dashData?.appointments ?? '—'}
          color="amber"
        />
        <StatCard
          icon="payments"
          label="Revenus"
          value={appointments.length > 0 ? formatCurrency(totalRevenue) : '—'}
          color="purple"
        />
      </div>

      {/* Latest appointments */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-5">Derniers rendez-vous</h2>
        {recentAppts.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-[40px] text-outline block mb-2">calendar_month</span>
            <p className="text-sm text-on-surface-variant">Aucun rendez-vous pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container">
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Patient</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Médecin</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Montant</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentAppts.map((appt) => (
                  <tr key={appt._id} className="border-b border-outline-variant/40 hover:bg-surface-container/30 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-on-surface">{appt.userData?.name || '—'}</td>
                    <td className="py-3 px-4 text-sm text-on-surface-variant">{appt.docData?.name || '—'}</td>
                    <td className="py-3 px-4 text-sm text-on-surface">{formatSlotDate(appt.slotDate)} – {appt.slotTime}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-on-surface">{formatCurrency(appt.amount)}</td>
                    <td className="py-3 px-4">
                      <Badge status={getAppointmentStatus(appt)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}