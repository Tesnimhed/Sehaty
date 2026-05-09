import { useLocation, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripePaymentForm from '../../components/payment/StripePaymentForm.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatSlotDate } from '../../utils/formatDate.js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { docId, slotDate, slotTime, amount, doctorName } = location.state || {}

  if (!docId || !slotDate || !slotTime) {
    return (
      <div className="max-w-md mx-auto px-lg py-16 text-center">
        <span className="material-symbols-outlined text-[48px] text-outline block mb-3">error</span>
        <p className="text-on-surface-variant mb-4">Informations de paiement manquantes.</p>
        <button onClick={() => navigate('/medecins')} className="text-primary text-sm font-semibold hover:underline">
          Retourner aux médecins
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-lg py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Retour
      </button>

      <h1 className="text-3xl font-bold text-on-surface mb-8">Paiement sécurisé</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Summary */}
        <div className="md:col-span-2">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 sticky top-24">
            <h2 className="text-base font-semibold text-on-surface mb-4">Récapitulatif</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Médecin</p>
                <p className="font-semibold text-on-surface">{doctorName || '—'}</p>
              </div>
              <div className="h-px bg-outline-variant" />
              <div>
                <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-on-surface">{formatSlotDate(slotDate)}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Heure</p>
                <p className="font-semibold text-on-surface">{slotTime}</p>
              </div>
              <div className="h-px bg-outline-variant" />
              <div className="flex items-center justify-between">
                <p className="text-on-surface-variant">Total</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(amount)}</p>
              </div>
            </div>

            <div className="mt-5 p-3 bg-green-50 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 text-[18px]">verified_user</span>
              <p className="text-xs text-green-700 font-semibold">Paiement 100% sécurisé</p>
            </div>
          </div>
        </div>

        {/* Payment form */}
        <div className="md:col-span-3">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-on-surface">Informations bancaires</h2>
                <p className="text-xs text-on-surface-variant">Vos données sont chiffrées par Stripe</p>
              </div>
            </div>
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                docId={docId}
                slotDate={slotDate}
                slotTime={slotTime}
                amount={amount}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  )
}
