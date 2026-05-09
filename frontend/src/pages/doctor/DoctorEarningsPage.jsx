import { useEffect } from 'react'
import { useDoctorStore } from '../../store/useDoctorStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatSlotDate } from '../../utils/formatDate.js'

function StatCard({ icon, label, value, color }) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-600',
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

export default function DoctorEarningsPage() {
  const { dashData, appointments, loading, fetchDashboard, fetchAppointments } = useDoctorStore()

  useEffect(() => {
    fetchDashboard()
    fetchAppointments()
  }, [])

  if (loading && !dashData) return <Spinner size="lg" className="py-32" />

  const paidAppts = appointments.filter((a) => a.isPaid && !a.cancelled)
  const totalEarnings = paidAppts.reduce((sum, a) => sum + (a.amount || 0), 0)
  const pendingAppts = appointments.filter((a) => !a.isPaid && !a.cancelled && !a.isCompleted)
  const pendingAmount = pendingAppts.reduce((sum, a) => sum + (a.amount || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Gains & Facturation</h1>
        <p className="text-on-surface-variant text-sm mt-1">Suivi de vos revenus de consultation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon="payments" label="Total encaissé" value={formatCurrency(totalEarnings)} color="green" />
        <StatCard icon="pending_actions" label="En attente de paiement" value={formatCurrency(pendingAmount)} color="secondary" />
        <StatCard icon="receipt_long" label="Consultations payées" value={paidAppts.length} color="primary" />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-5">Historique des paiements</h2>
        {paidAppts.length === 0 ? (
          <EmptyState icon="payments" title="Aucun paiement reçu" description="Vos paiements apparaîtront ici une fois les consultations payées par les patients." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="pb-3 px-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Patient</th>
                  <th className="pb-3 px-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="pb-3 px-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Heure</th>
                  <th className="pb-3 px-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {paidAppts.map((appt) => (
                  <tr key={appt._id} className="border-b border-outline-variant/40 hover:bg-surface-container/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
                          {appt.userData?.image ? (
                            <img src={appt.userData.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-outline text-[14px]">person</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{appt.userData?.name || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-on-surface">{formatSlotDate(appt.slotDate)}</td>
                    <td className="py-3 px-2 text-sm text-on-surface">{appt.slotTime}</td>
                    <td className="py-3 px-2 text-sm font-bold text-green-600 text-right">
                      +{formatCurrency(appt.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-outline-variant">
                  <td colSpan={3} className="pt-3 px-2 text-sm font-bold text-on-surface">Total</td>
                  <td className="pt-3 px-2 text-base font-bold text-primary text-right">{formatCurrency(totalEarnings)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
