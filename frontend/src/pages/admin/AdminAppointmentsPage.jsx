import { useEffect, useState } from 'react'
import { useAdminStore } from '../../store/useAdminStore.js'
import AppointmentRow from '../../components/appointment/AppointmentRow.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'

const TABS = ['Tous', 'En attente', 'Payé', 'Terminé', 'Annulé']

export default function AdminAppointmentsPage() {
  const { appointments, loading, fetchAppointments, cancelAppointment } = useAdminStore()
  const [activeTab, setActiveTab] = useState('Tous')
  const [confirmId, setConfirmId] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchAppointments() }, [])

  const filtered = appointments
    .filter((a) => {
      if (activeTab === 'Tous') return true
      if (activeTab === 'Annulé') return a.cancelled
      if (activeTab === 'Terminé') return !a.cancelled && a.isCompleted
      if (activeTab === 'Payé') return !a.cancelled && !a.isCompleted && a.isPaid
      if (activeTab === 'En attente') return !a.cancelled && !a.isCompleted && !a.isPaid
      return true
    })
    .filter((a) =>
      search === '' ||
      a.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.docData?.name?.toLowerCase().includes(search.toLowerCase())
    )

  const handleCancel = async () => {
    setCancelling(true)
    await cancelAppointment(confirmId)
    setCancelling(false)
    setConfirmId(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Rendez-vous</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {appointments.length} rendez-vous au total
          </p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            type="text"
            placeholder="Patient ou médecin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 pr-4 rounded-xl border border-outline-variant bg-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-64"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
                  {['Patient', 'Médecin', 'Date', 'Heure', 'Montant', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => (
                  <AppointmentRow
                    key={appt._id}
                    appointment={appt}
                    showDoctor={true}
                    onCancel={!appt.cancelled && !appt.isCompleted ? (id) => setConfirmId(id) : null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Annuler le rendez-vous"
        message="Êtes-vous sûr de vouloir annuler ce rendez-vous ? Le patient sera notifié."
        confirmLabel="Oui, annuler"
        variant="danger"
      />
    </div>
  )
}
