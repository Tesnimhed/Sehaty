import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userApi } from '../../api/userApi.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import toast from 'react-hot-toast'

export default function UserLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setUToken } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await userApi.login(form)
      if (res.data.success) {
        setUToken(res.data.token)
        toast.success('Connexion réussie !')
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

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
              Votre santé,<br />simplifiée.
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Accédez à votre dossier médical, prenez rendez-vous et gérez vos consultations en un seul endroit sécurisé.
            </p>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
                <span className="font-semibold">Données 100% Sécurisées</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">calendar_today</span>
                <span className="font-semibold">Rendez-vous instantanés</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">medical_services</span>
                <span className="font-semibold">Meilleurs spécialistes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <Link
  to="/"
  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
>
  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
  Retour à l’accueil
</Link>
          <div className="md:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-primary">Sehaty</span>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-on-surface mb-1">Bienvenue</h1>
            <p className="text-sm text-on-surface-variant">
              Connectez-vous pour accéder à votre portail patient.
            </p>
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">
                  Mot de passe
                </label>
                <a href="#" className="text-xs text-primary hover:underline">Oublié ?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                <>Se connecter <span className="material-symbols-outlined text-[18px]">login</span></>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center w-full gap-4">
              <div className="h-px bg-outline-variant flex-1" />
              <span className="text-xs text-outline">OU</span>
              <div className="h-px bg-outline-variant flex-1" />
            </div>
            <div className="flex gap-3 w-full">
              <Link
                to="/medecin/connexion"
                className="flex-1 h-11 border border-outline-variant rounded-xl flex items-center justify-center gap-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-outline">medical_services</span>
                Espace médecin
              </Link>
              <Link
                to="/admin/connexion"
                className="flex-1 h-11 border border-outline-variant rounded-xl flex items-center justify-center gap-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-outline">admin_panel_settings</span>
                Administration
              </Link>
            </div>
            <p className="text-sm text-on-surface-variant">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="text-primary font-semibold hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
