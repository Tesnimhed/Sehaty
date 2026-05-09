export default function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px] text-outline">
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-on-surface mb-2">
        {title || 'Aucun résultat'}
      </h3>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
