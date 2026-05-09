import Badge, { getAppointmentStatus } from '../ui/Badge.jsx'
import { formatSlotDate } from '../../utils/formatDate.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function AppointmentCard({ appointment, onCancel, onPay }) {
  const status = getAppointmentStatus(appointment)
  const { docData, slotDate, slotTime, amount, isPaid } = appointment

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/50 p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-high flex-shrink-0">
          {docData?.image ? (
            <img
              src={docData.image}
              alt={docData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-outline">person</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-semibold text-on-surface">{docData?.name}</h3>
              <p className="text-sm text-primary font-semibold">{docData?.speciality}</p>
            </div>
            <Badge status={status} />
          </div>

          <div className="flex flex-wrap gap-3 mt-2 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              {formatSlotDate(slotDate)}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {slotTime}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">payments</span>
              {formatCurrency(amount)}
            </span>
          </div>
        </div>
      </div>

      {!appointment.cancelled && !appointment.isCompleted && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-outline-variant/50">
          {!isPaid && onPay && (
            <button
              onClick={() => onPay(appointment)}
              className="flex-1 h-9 bg-primary text-on-primary text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95"
            >
              Payer maintenant
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(appointment._id)}
              className="flex-1 h-9 border border-error text-error text-xs font-semibold rounded-xl hover:bg-error-container/30 transition-all active:scale-95"
            >
              Annuler
            </button>
          )}
        </div>
      )}
    </div>
  )
}
