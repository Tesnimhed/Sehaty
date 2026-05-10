import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userApi } from '../../api/userApi.js'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await userApi.forgotPassword({ email })
      if (res.data.success) {
        toast.success('Code envoyé ! Vérifiez votre boîte email.')
        navigate('/reinitialiser-mot-de-passe', { state: { email } })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <main className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden bg-surface-container-lowest">

        {/* ── Panneau gauche (décoratif) ── */}
        <div className="hidden md:flex md:w-1/2 relative bg-primary items-center justify-center p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <div className="relative z-10 text-on-primary max-w-sm">
            <div className="mb-8">
              <span className="text-3xl font-bold block">Sehaty</span>
              <div className="h-1 w-10 bg-on-primary rounded-full mt-2" />
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Mot de passe<br />oublié ?
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Pas de panique. Entrez votre adresse email et nous vous enverrons un code pour réinitialiser votre mot de passe.
            </p>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">mail</span>
                <span className="font-semibold">Code envoyé par email</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">timer</span>
                <span className="font-semibold">Valide 10 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
                <span className="font-semibold">100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Panneau droit (formulaire) ── */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <Link
            to="/connexion"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Retour à la connexion
          </Link>

          <div className="md:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-primary">Sehaty</span>
          </div>

          {/* Icône centrale */}
          <div className="mb-8 flex flex-col items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]">lock_reset</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface mb-1">Mot de passe oublié</h1>
              <p className="text-sm text-on-surface-variant">
                Saisissez votre email pour recevoir un code de réinitialisation.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="email">
                Adresse email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Envoyer le code
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link to="/connexion" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}