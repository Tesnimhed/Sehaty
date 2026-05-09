import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { doctorApi } from '../../api/doctorApi.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import toast from 'react-hot-toast'

export default function DoctorLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setDToken } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await doctorApi.login(form)
      if (res.data.success) {
        setDToken(res.data.token)
        toast.success('Connexion réussie !')
        navigate('/medecin/tableau-de-bord')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <main className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden bg-surface-container-lowest">
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-primary to-on-primary-fixed-variant items-center justify-center p-10">
          <div className="relative z-10 text-on-primary max-w-sm">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-on-primary/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">medical_services</span>
              </div>
              <span className="text-3xl font-bold block">Sehaty</span>
              <p className="text-sm opacity-80 mt-1">Portail Médical</p>
              <div className="h-1 w-10 bg-on-primary rounded-full mt-2" />
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Gérez votre<br />cabinet en ligne
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Accédez à votre planning, gérez vos rendez-vous et suivez vos gains depuis un seul tableau de bord.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <Link
  to="/"
  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
>
  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
  Retour à l’accueil
</Link>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[16px]">medical_services</span>
              </div>
              <span className="text-sm font-semibold text-primary">Espace Médecin</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-1">Connexion Médecin</h1>
            <p className="text-sm text-on-surface-variant">
              Accédez à votre portail de gestion médicale.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="email">Email professionnel</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input
                  id="email" type="email" required placeholder="docteur@exemple.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  id="password" type="password" required placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Se connecter <span className="material-symbols-outlined text-[18px]">login</span></>}
            </button>
          </form>

          <p className="text-sm text-on-surface-variant text-center mt-8">
            Vous êtes patient ?{' '}
            <Link to="/connexion" className="text-primary font-semibold hover:underline">Espace patient</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
