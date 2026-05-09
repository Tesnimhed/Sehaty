import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doctorApi } from '../../api/doctorApi.js'
import { userApi } from '../../api/userApi.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import SlotPicker from '../../components/doctor/SlotPicker.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import toast from 'react-hot-toast'

export default function DoctorProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { utoken } = useAuthStore()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    doctorApi.getList().then((res) => {
      if (res.data.success) {
        const doc = res.data.doctors.find((d) => d._id === id)
        setDoctor(doc || null)
      }
    }).finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!utoken) {
      toast.error('Veuillez vous connecter pour réserver')
      navigate('/connexion')
      return
    }
    if (!selectedSlot) {
      toast.error('Veuillez sélectionner un créneau')
      return
    }

    setBooking(true)
    try {
      const res = await userApi.bookAppointment({
        docId: id,
        slotDate: selectedSlot.slotDate,
        slotTime: selectedSlot.slotTime,
      })
      if (res.data.success) {
        toast.success('Rendez-vous réservé avec succès !')
        navigate('/mes-rendez-vous')
      }
    } finally {
      setBooking(false)
    }
  }

  const handlePay = () => {
    if (!utoken) {
      toast.error('Veuillez vous connecter pour payer')
      navigate('/connexion')
      return
    }
    if (!selectedSlot) {
      toast.error('Veuillez sélectionner un créneau')
      return
    }
    navigate('/paiement', {
      state: {
        docId: id,
        slotDate: selectedSlot.slotDate,
        slotTime: selectedSlot.slotTime,
        amount: doctor.fees,
        doctorName: doctor.name,
      },
    })
  }

  if (loading) return <Spinner size="lg" className="py-32" />

  if (!doctor) {
    return (
      <div className="text-center py-32">
        <span className="material-symbols-outlined text-[48px] text-outline block mb-3">person_off</span>
        <p className="text-on-surface-variant">Médecin introuvable</p>
        <button onClick={() => navigate('/medecins')} className="mt-4 text-primary text-sm font-semibold hover:underline">
          Retour à la liste
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-lg py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
            <div className="flex gap-6">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary-fixed ring-4 ring-primary/5 flex-shrink-0">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-outline">person</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-bold text-on-surface">{doctor.name}</h1>
                    <p className="text-primary font-semibold mt-0.5">{doctor.speciality}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${doctor.available ? 'bg-green-100 text-green-700' : 'bg-surface-variant text-on-surface-variant'}`}>
                    <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-outline'}`} />
                    {doctor.available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    {doctor.degree}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">work_history</span>
                    {doctor.experience} d'expérience
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
                    {formatCurrency(doctor.fees)}
                  </span>
                </div>
              </div>
            </div>

            {doctor.about && (
              <div className="mt-6 pt-6 border-t border-outline-variant">
                <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">À propos</h3>
                <p className="text-sm text-on-surface leading-relaxed">{doctor.about}</p>
              </div>
            )}

            {doctor.address && (
              <div className="mt-4 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-outline mt-0.5">location_on</span>
                <p className="text-sm text-on-surface-variant">{doctor.address}</p>
              </div>
            )}
          </div>

          {/* Slot picker */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-on-surface mb-5">
              Choisir un créneau
            </h2>
            {doctor.available ? (
              <SlotPicker doctor={doctor} onSelect={setSelectedSlot} />
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-[40px] text-outline block mb-2">event_busy</span>
                <p className="text-sm text-on-surface-variant">Ce médecin n'est pas disponible pour le moment</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking panel */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-on-surface mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Médecin</span>
                <span className="font-semibold text-on-surface text-right">{doctor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Spécialité</span>
                <span className="font-semibold text-on-surface">{doctor.speciality}</span>
              </div>
              {selectedSlot && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Date</span>
                    <span className="font-semibold text-on-surface">{selectedSlot.displayDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Heure</span>
                    <span className="font-semibold text-on-surface">{selectedSlot.slotTime}</span>
                  </div>
                </>
              )}
              <div className="h-px bg-outline-variant" />
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Honoraires</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(doctor.fees)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePay}
                disabled={!selectedSlot || !doctor.available || booking}
                className="w-full h-12 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">credit_card</span>
                Payer et réserver
              </button>
              <button
                onClick={handleBook}
                disabled={!selectedSlot || !doctor.available || booking}
                className="w-full h-11 border border-primary text-primary font-semibold text-sm rounded-xl hover:bg-primary/5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {booking ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <>
                  <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                  Réserver sans payer
                </>}
              </button>
            </div>

            <p className="text-xs text-center text-on-surface-variant mt-4 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">security</span>
              Paiement sécurisé · Annulation gratuite
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
