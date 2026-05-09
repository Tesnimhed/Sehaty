export default function Input({
  label,
  id,
  icon,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full h-12 ${icon ? 'pl-12' : 'pl-4'} pr-4 rounded-xl border ${
            error ? 'border-error' : 'border-outline-variant'
          } bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none text-sm text-on-surface placeholder:text-outline ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  )
}
