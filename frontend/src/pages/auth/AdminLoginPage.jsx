import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../../api/adminApi.js'
import { useAuthStore } from '../../store/useAuthStore.js'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setAToken } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminApi.login(form)
      if (res.data.success) {
        setAToken(res.data.token)
        toast.success('Connexion administrateur réussie !')
        navigate('/admin/tableau-de-bord')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <main className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-[32px]">admin_panel_settings</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Administration</h1>
            <p className="text-sm text-on-surface-variant mt-1">Accès réservé aux administrateurs Sehaty</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="email">Email administrateur</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input
                  id="email" type="email" required placeholder="admin@sehaty.dz"
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
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Connexion <span className="material-symbols-outlined text-[18px]">login</span></>}
            </button>
          </form>

          <p className="text-xs text-center text-on-surface-variant mt-6">
            <Link to="/connexion" className="text-primary hover:underline">← Retour espace patient</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
