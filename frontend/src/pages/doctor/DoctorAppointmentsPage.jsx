import { useEffect, useState } from 'react'
import { useDoctorStore } from '../../store/useDoctorStore.js'
import AppointmentRow from '../../components/appointment/AppointmentRow.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'

const TABS = ['Tous', 'En attente', 'Terminé', 'Annulé']

export default function DoctorAppointmentsPage() {
  const { appointments, loading, fetchAppointments, completeAppointment, cancelAppointment } = useDoctorStore()
  const [activeTab, setActiveTab] = useState('Tous')
  const [confirmAction, setConfirmAction] = useState(null) // { type, id }
  const [acting, setActing] = useState(false)

  useEffect(() => { fetchAppointments() }, [])

  const filtered = appointments.filter((a) => {
    if (activeTab === 'Tous') return true
    if (activeTab === 'Annulé') return a.cancelled
    if (activeTab === 'Terminé') return !a.cancelled && a.isCompleted
    if (activeTab === 'En attente') return !a.cancelled && !a.isCompleted
    return true
  })

  const handleConfirm = async () => {
    setActing(true)
    if (confirmAction.type === 'complete') await completeAppointment(confirmAction.id)
    if (confirmAction.type === 'cancel') await cancelAppointment(confirmAction.id)
    setActing(false)
    setConfirmAction(null)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Mes rendez-vous</h1>
        <p className="text-on-surface-variant text-sm mt-1">{appointments.length} rendez-vous au total</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:border-primary/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : filtered.length === 0 ? (
        <EmptyState icon="calendar_month" title="Aucun rendez-vous" description="Aucun rendez-vous dans cette catégorie." />
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container">
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Patient</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Heure</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Montant</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Statut</th>
                  <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => (
                  <AppointmentRow
                    key={appt._id}
                    appointment={appt}
                    onComplete={!appt.cancelled && !appt.isCompleted ? (id) => setConfirmAction({ type: 'complete', id }) : null}
                    onCancel={!appt.cancelled && !appt.isCompleted ? (id) => setConfirmAction({ type: 'cancel', id }) : null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        loading={acting}
        title={confirmAction?.type === 'complete' ? 'Marquer comme terminé' : 'Annuler le rendez-vous'}
        message={
          confirmAction?.type === 'complete'
            ? 'Confirmer que ce rendez-vous est terminé ?'
            : 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?'
        }
        confirmLabel={confirmAction?.type === 'complete' ? 'Confirmer' : 'Annuler le RDV'}
        variant={confirmAction?.type === 'complete' ? 'primary' : 'danger'}
      />
    </div>
  )
}
