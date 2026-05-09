import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { userApi } from '../../api/userApi.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency.js'

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      color: '#191b23',
      '::placeholder': { color: '#737686' },
    },
    invalid: { color: '#ba1a1a' },
  },
}

export default function StripePaymentForm({ docId, slotDate, slotTime, amount, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    try {
      // Step 1: Create payment intent
      const intentRes = await userApi.createBookingIntent({ docId, slotDate, slotTime })
      if (!intentRes.data.success) return

      const { clientSecret } = intentRes.data

      // Step 2: Confirm card payment
      const cardElement = elements.getElement(CardElement)
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (error) {
        toast.error(error.message || 'Erreur de paiement')
        return
      }

      // Step 3: Confirm booking
      const bookRes = await userApi.confirmAndBook({
        paymentIntentId: paymentIntent.id,
        docId,
        slotDate,
        slotTime,
      })

      if (bookRes.data.success) {
        toast.success('Rendez-vous confirmé et paiement effectué !')
        if (onSuccess) onSuccess()
        else navigate('/mes-rendez-vous')
      }
    } catch (err) {
      toast.error('Erreur lors du paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-on-surface-variant mb-2">
          Informations de paiement
        </label>
        <div className="p-4 rounded-xl border border-outline-variant bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <CardElement options={CARD_OPTIONS} />
        </div>
      </div>

      {amount && (
        <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl">
          <span className="text-sm text-on-surface-variant">Total à payer</span>
          <span className="text-lg font-bold text-on-surface">{formatCurrency(amount)}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-12 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Payer {amount ? formatCurrency(amount) : ''}
          </>
        )}
      </button>

      <p className="text-xs text-center text-on-surface-variant flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-[14px]">security</span>
        Paiement sécurisé par Stripe. Vos données sont chiffrées.
      </p>
    </form>
  )
}
