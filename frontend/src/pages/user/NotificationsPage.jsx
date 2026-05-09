import { useEffect } from 'react'
import { useUserStore } from '../../store/useUserStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatDate } from '../../utils/formatDate.js'

export default function NotificationsPage() {
  const { notifications, loading, fetchNotifications, markNotificationRead } = useUserStore()

  useEffect(() => { fetchNotifications() }, [])

  const unread = notifications.filter((n) => !n.isRead)
  const read = notifications.filter((n) => n.isRead)

  const handleMarkAll = () => {
    unread.forEach((n) => markNotificationRead(n._id))
  }

  const typeIcon = (type) => {
    if (type === 'refund') return 'payments'
    return 'calendar_month'
  }

  const typeColor = (type) => {
    if (type === 'refund') return 'bg-secondary-container text-on-secondary-container'
    return 'bg-primary/10 text-primary'
  }

  return (
    <div className="max-w-2xl mx-auto px-lg py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Notifications</h1>
          {unread.length > 0 && (
            <p className="text-sm text-on-surface-variant mt-1">
              {unread.length} non lue{unread.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unread.length > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="notifications_off"
          title="Aucune notification"
          description="Vous n'avez aucune notification pour le moment. Elles apparaîtront ici après vos rendez-vous."
        />
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                Non lues
              </h2>
              <div className="space-y-3">
                {unread.map((notif) => (
                  <NotifItem key={notif._id} notif={notif} onRead={markNotificationRead} typeIcon={typeIcon} typeColor={typeColor} />
                ))}
              </div>
            </div>
          )}
          {read.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                Lues
              </h2>
              <div className="space-y-3">
                {read.map((notif) => (
                  <NotifItem key={notif._id} notif={notif} onRead={markNotificationRead} typeIcon={typeIcon} typeColor={typeColor} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NotifItem({ notif, onRead, typeIcon, typeColor }) {
  return (
    <div
      onClick={() => !notif.isRead && onRead(notif._id)}
      className={`flex gap-4 p-5 rounded-2xl border transition-all duration-200 ${
        !notif.isRead
          ? 'bg-secondary-container/10 border-primary/20 cursor-pointer hover:bg-secondary-container/20'
          : 'bg-surface-container-lowest border-outline-variant/50'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColor(notif.type)}`}>
        <span className="material-symbols-outlined text-[20px]">{typeIcon(notif.type)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-on-surface leading-relaxed">{notif.message}</p>
        <p className="text-xs text-outline mt-1">{formatDate(notif.createdAt)}</p>
      </div>
      {!notif.isRead && (
        <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1" />
      )}
    </div>
  )
}
