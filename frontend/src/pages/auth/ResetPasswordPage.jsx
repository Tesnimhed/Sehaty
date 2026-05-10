import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { userApi } from '../../api/userApi.js'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()

  const { email } = location.state || {}

  // Redirige si on arrive sans email
  useEffect(() => {
    if (!email) navigate('/mot-de-passe-oublie', { replace: true })
  }, [email, navigate])

  // Compte à rebours pour le renvoi
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // ── Gestion OTP ──────────────────────────────────────────────
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]

    if (value.length > 1) {
      const chars = value.slice(0, 6 - index).split('')
      chars.forEach((ch, i) => { newDigits[index + i] = ch })
      setDigits(newDigits)
      const nextIndex = Math.min(index + chars.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    newDigits[index] = value
    setDigits(newDigits)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newDigits = [...digits]
    pasted.split('').forEach((ch, i) => { newDigits[i] = ch })
    setDigits(newDigits)
    const nextFocus = Math.min(pasted.length, 5)
    inputRefs.current[nextFocus]?.focus()
  }

  // ── Renvoi du code ───────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return
    setResending(true)
    try {
      const res = await userApi.forgotPassword({ email })
      if (res.data.success) {
        toast.success('Nouveau code envoyé !')
        setDigits(['', '', '', '', '', ''])
        setCountdown(60)
        setCanResend(false)
        inputRefs.current[0]?.focus()
      }
    } finally {
      setResending(false)
    }
  }

  // ── Soumission ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) {
      toast.error('Veuillez saisir les 6 chiffres du code.')
      return
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      const res = await userApi.resetPassword({ email, otp, newPassword: password })
      if (res.data.success) {
        toast.success('Mot de passe réinitialisé avec succès !')
        navigate('/connexion')
      }
    } finally {
      setLoading(false)
    }
  }

  const otpComplete = digits.every((d) => d !== '')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <main className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden bg-surface-container-lowest">

        {/* ── Panneau gauche ── */}
        <div className="hidden md:flex md:w-1/2 relative bg-primary items-center justify-center p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <div className="relative z-10 text-on-primary max-w-sm">
            <div className="mb-8">
              <span className="text-3xl font-bold block">Sehaty</span>
              <div className="h-1 w-10 bg-on-primary rounded-full mt-2" />
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Nouveau<br />mot de passe
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Saisissez le code reçu par email et choisissez un nouveau mot de passe sécurisé.
            </p>
            <div className="mt-10 p-4 bg-white/10 rounded-xl">
              <p className="text-sm opacity-80 mb-1">Code envoyé à</p>
              <p className="font-semibold truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* ── Panneau droit ── */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <Link
            to="/mot-de-passe-oublie"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Changer d'email
          </Link>

          <div className="md:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-primary">Sehaty</span>
          </div>

          <div className="mb-8 flex flex-col items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]">key</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface mb-1">Réinitialisation</h1>
              <p className="text-sm text-on-surface-variant">
                Code envoyé à <span className="font-semibold text-on-surface">{email}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── Saisie OTP ── */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Code de vérification (6 chiffres)
              </label>
              <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`
                      w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none
                      transition-all duration-200 bg-white
                      ${d
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-outline-variant text-on-surface'
                      }
                      focus:border-primary focus:ring-2 focus:ring-primary/20
                    `}
                    aria-label={`Chiffre ${i + 1}`}
                  />
                ))}
              </div>

              {/* Renvoi */}
              <div className="flex items-center justify-end gap-1 text-xs">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-primary font-semibold hover:underline disabled:opacity-60"
                  >
                    {resending ? 'Envoi...' : 'Renvoyer le code'}
                  </button>
                ) : (
                  <span className="text-on-surface-variant">
                    Renvoyer dans <span className="font-semibold text-on-surface">{countdown}s</span>
                  </span>
                )}
              </div>
            </div>

            {/* ── Nouveau mot de passe ── */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* ── Confirmation ── */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="confirm">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock_open</span>
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-12 pl-12 pr-4 rounded-xl border bg-white focus:ring-2 focus:ring-primary transition-all duration-200 outline-none text-sm ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-error focus:border-error focus:ring-error/20'
                      : 'border-outline-variant focus:border-primary'
                  }`}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-error flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !otpComplete || password !== confirmPassword}
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Réinitialiser le mot de passe
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}