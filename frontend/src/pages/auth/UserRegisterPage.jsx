import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userApi } from '../../api/userApi.js'
import toast from 'react-hot-toast'

export default function UserRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await userApi.register(form)
      if (res.data.success) {
        toast.success('Code envoyé ! Vérifiez votre boîte email.')
        // Redirige vers la page de vérification en passant les données d'inscription
        navigate('/verifier-email', {
          state: { email: form.email, name: form.name, password: form.password }
        })
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
              Rejoignez<br />Sehaty.
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Créez votre compte et accédez aux meilleurs spécialistes en Algérie en quelques minutes.
            </p>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">how_to_reg</span>
                <span className="font-semibold">Inscription gratuite</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
                <span className="font-semibold">Suivi de santé personnalisé</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]">notifications</span>
                <span className="font-semibold">Rappels de rendez-vous</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-primary">Sehaty</span>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-on-surface mb-1">Créer un compte</h1>
            <p className="text-sm text-on-surface-variant">
              Remplissez le formulaire pour rejoindre Sehaty.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="name">
                Nom complet
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Votre nom complet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none text-sm"
                />
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 caractères"
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
                <>Créer mon compte <span className="material-symbols-outlined text-[18px]">how_to_reg</span></>
              )}
            </button>
          </form>

          <p className="text-sm text-on-surface-variant text-center mt-8">
            Déjà un compte ?{' '}
            <Link to="/connexion" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
