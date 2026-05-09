export default function Badge({ status, className = '' }) {
  const configs = {
    cancelled: {
      label: 'Annulé',
      cls: 'bg-error-container text-on-error-container',
    },
    completed: {
      label: 'Terminé',
      cls: 'bg-surface-container-high text-on-surface-variant',
    },
    paid: {
      label: 'Payé',
      cls: 'bg-green-100 text-green-700',
    },
    refunded: {
      label: 'Remboursé',
      cls: 'bg-secondary-container text-on-secondary-container',
    },
    pending: {
      label: 'En attente',
      cls: 'bg-amber-100 text-amber-700',
    },
    available: {
      label: 'Disponible',
      cls: 'bg-green-100 text-green-700',
    },
    unavailable: {
      label: 'Indisponible',
      cls: 'bg-surface-variant text-on-surface-variant',
    },
  }

  const config = configs[status] || configs.pending

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.cls} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}

/**
 * Get badge status from appointment object
 */
export function getAppointmentStatus(appointment) {
  if (appointment.cancelled) return 'cancelled'
  if (appointment.isCompleted) return 'completed'
  if (appointment.isPaid) return 'paid'
  if (appointment.isRefunded) return 'refunded'
  return 'pending'
}
