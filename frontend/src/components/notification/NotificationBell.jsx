import { useState } from 'react'
import { useUserStore } from '../../store/useUserStore.js'
import { formatDate } from '../../utils/formatDate.js'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markNotificationRead } = useUserStore()

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      await markNotificationRead(notif._id)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant z-40 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
              <span className="font-semibold text-on-surface">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-on-surface-variant">
                  Aucune notification
                </div>
              ) : (
                notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotifClick(notif)}
                    className={`flex gap-3 px-5 py-3 border-b border-outline-variant/50 cursor-pointer hover:bg-surface-container transition-colors ${
                      !notif.isRead ? 'bg-secondary-container/20' : ''
                    }`}
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0">
                      {!notif.isRead && (
                        <span className="block w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-outline mt-1">
                        {formatDate(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
