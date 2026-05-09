import Badge, { getAppointmentStatus } from '../ui/Badge.jsx'
import { formatSlotDate } from '../../utils/formatDate.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function AppointmentRow({ appointment, onComplete, onCancel, showDoctor = false }) {
  const status = getAppointmentStatus(appointment)
  const { docData, userData, slotDate, slotTime, amount } = appointment

  return (
    <tr className="border-b border-outline-variant/50 hover:bg-surface-container/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
            {userData?.image ? (
              <img src={userData.image} alt={userData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-outline text-[16px]">person</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">{userData?.name || '—'}</p>
            <p className="text-xs text-on-surface-variant">{userData?.email || '—'}</p>
          </div>
        </div>
      </td>

      {showDoctor && (
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
              {docData?.image ? (
                <img src={docData.image} alt={docData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-[16px]">person</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">{docData?.name || '—'}</p>
              <p className="text-xs text-on-surface-variant">{docData?.speciality || '—'}</p>
            </div>
          </div>
        </td>
      )}

      <td className="py-3 px-4 text-sm text-on-surface">
        {formatSlotDate(slotDate)}
      </td>
      <td className="py-3 px-4 text-sm text-on-surface">{slotTime}</td>
      <td className="py-3 px-4 text-sm font-semibold text-on-surface">
        {formatCurrency(amount)}
      </td>
      <td className="py-3 px-4">
        <Badge status={status} />
      </td>
      <td className="py-3 px-4">
        {!appointment.cancelled && !appointment.isCompleted && (
          <div className="flex gap-2">
            {onComplete && (
              <button
                onClick={() => onComplete(appointment._id)}
                className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                title="Marquer terminé"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(appointment._id)}
                className="p-1.5 rounded-lg bg-error-container text-on-error-container hover:bg-error-container/70 transition-colors"
                title="Annuler"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}
