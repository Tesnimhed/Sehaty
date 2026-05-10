import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userApi } from '../../api/userApi.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import toast from 'react-hot-toast'

export default function VerifyEmailPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])
  const { setUToken } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Les données d'inscription passées depuis UserRegisterPage via navigate state
  const { email, name, password } = location.state || {}

  // Redirige si on arrive ici sans données
  useEffect(() => {
    if (!email) navigate('/inscription', { replace: true })
  }, [email, navigate])

  // Compte à rebours pour le renvoi
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // Focus sur le premier champ à l'ouverture
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // ── Gestion des inputs ────────────────────────────────────
  const handleChange = (index, value) => {
    // N'accepte que les chiffres
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]

    if (value.length > 1) {
      // Cas collé (paste) : distribue les chiffres dans les cases
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
      const newDigits = [...digits]
      newDigits[index - 1] = ''
      setDigits(newDigits)
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newDigits = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setDigits(newDigits)
    const lastFilled = Math.min(pasted.length, 5)
    inputRefs.current[lastFilled]?.focus()
  }

  // ── Soumission ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) {
      toast.error('Veuillez entrer les 6 chiffres du code.')
      return
    }

    setLoading(true)
    try {
      const res = await userApi.verifyEmail({ email, otp })
      if (res.data.success) {
        setUToken(res.data.token)
        toast.success('Compte créé avec succès ! Bienvenue 🎉')
        navigate('/completer-profil', { replace: true })
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Code invalide.'
      toast.error(msg)
      // Vide les cases en cas d'erreur
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Auto-submit quand les 6 chiffres sont saisis
  useEffect(() => {
    if (digits.every(d => d !== '') && !loading) {
      handleSubmit()
    }
  }, [digits])

  // ── Renvoi du code ────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return
    setResending(true)
    try {
      await userApi.register({ name, email, password })
      toast.success('Nouveau code envoyé !')
      setCountdown(60)
      setCanResend(false)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch {
      toast.error('Impossible de renvoyer le code. Réessayez.')
    } finally {
      setResending(false)
    }
  }

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, (_, a, b) => `${a}${'•'.repeat(5)}${b}`)
    : ''

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <main className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden bg-surface-container-lowest">
        {/* Left panel */}
        <div className="hidden md:flex md:w-1/2 relative bg-primary items-center justify-center p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <div className="relative z-10 text-on-primary max-w-sm">
            <div className="mb-8">
              <span className="text-3xl font-bold block">Sehaty</span>
              <div className="h-1 w-10 bg-on-primary rounded-full mt-2" />
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Une dernière<br />étape.
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Nous vérifions votre adresse email pour sécuriser votre compte et vous protéger.
            </p>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
                <span className="font-semibold">Compte sécurisé</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
                <span className="font-semibold">Email vérifié</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">lock</span>
                <span className="font-semibold">Données protégées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-primary">Sehaty</span>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[44px]">mark_email_read</span>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-on-surface mb-2">Vérifiez votre email</h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Nous avons envoyé un code à 6 chiffres à<br />
              <strong className="text-on-surface">{maskedEmail}</strong>
            </p>
          </div>

          {/* OTP inputs */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={`
                    w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2
                    outline-none transition-all duration-200
                    ${digit
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant bg-white text-on-surface'
                    }
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                    caret-primary
                  `}
                  aria-label={`Chiffre ${i + 1}`}
                  disabled={loading}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-outline-variant/50 mb-6" />

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || digits.join('').length < 6}
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Vérifier mon email
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant mb-2">
              Vous n'avez pas reçu de code ?
            </p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-semibold text-primary hover:underline disabled:opacity-50"
              >
                {resending ? 'Envoi en cours...' : 'Renvoyer le code'}
              </button>
            ) : (
              <p className="text-sm text-outline">
                Renvoyer dans{' '}
                <span className="font-bold text-primary tabular-nums">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Back link */}
          <button
            onClick={() => navigate('/inscription')}
            className="mt-8 text-sm text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Retour à l'inscription
          </button>
        </div>
      </main>
    </div>
  )
}
