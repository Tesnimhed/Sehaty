import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore.js'
import AppointmentCard from '../../components/appointment/AppointmentCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'

const TABS = ['Tous', 'En attente', 'Payé', 'Terminé', 'Annulé']

export default function MyAppointmentsPage() {
  const { appointments, loading, fetchAppointments, cancelAppointment } = useUserStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Tous')
  const [confirmId, setConfirmId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => { fetchAppointments() }, [])

  const filtered = appointments.filter((a) => {
    if (activeTab === 'Tous') return true
    if (activeTab === 'Annulé') return a.cancelled
    if (activeTab === 'Terminé') return !a.cancelled && a.isCompleted
    if (activeTab === 'Payé') return !a.cancelled && !a.isCompleted && a.isPaid
    if (activeTab === 'En attente') return !a.cancelled && !a.isCompleted && !a.isPaid
    return true
  })

  const handleCancel = async () => {
    setCancelling(true)
    await cancelAppointment(confirmId)
    setCancelling(false)
    setConfirmId(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-lg py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface">Mes rendez-vous</h1>
        <p className="text-on-surface-variant mt-1">
          {appointments.length} rendez-vous au total
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
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
        <EmptyState
          icon="calendar_month"
          title="Aucun rendez-vous"
          description="Vous n'avez pas encore de rendez-vous dans cette catégorie."
          action={
            <button
              onClick={() => navigate('/medecins')}
              className="h-10 px-6 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all"
            >
              Trouver un médecin
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              onCancel={!appt.cancelled && !appt.isCompleted ? (id) => setConfirmId(id) : null}
              onPay={
                !appt.cancelled && !appt.isCompleted && !appt.isPaid
                  ? (a) =>
                      navigate('/paiement', {
                        state: {
                          docId: a.docId,
                          slotDate: a.slotDate,
                          slotTime: a.slotTime,
                          amount: a.amount,
                          doctorName: a.docData?.name,
                        },
                      })
                  : null
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Annuler le rendez-vous"
        message="Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est irréversible."
        confirmLabel="Oui, annuler"
        variant="danger"
      />
    </div>
  )
}
