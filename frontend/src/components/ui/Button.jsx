import Spinner from './Spinner.jsx'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  icon,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm',
    secondary:
      'bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant',
    danger: 'bg-error text-on-error hover:bg-error/90 shadow-sm',
    ghost: 'text-primary hover:bg-primary/5',
    outline:
      'border border-primary text-primary hover:bg-primary/5',
  }

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-12 px-6',
    lg: 'h-14 px-8 text-base',
    icon: 'h-10 w-10 p-0',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Spinner size="sm" className="!block" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
