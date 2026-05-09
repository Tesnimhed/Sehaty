import { useEffect, useState } from 'react'
import { useDoctorStore } from '../../store/useDoctorStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function DoctorProfilePage() {
  const { profile, loading, fetchProfile, updateProfile } = useDoctorStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ fees: '', address: '', available: true })

  useEffect(() => { fetchProfile() }, [])

  useEffect(() => {
    if (profile) {
      setForm({
        fees: profile.fees ?? '',
        address: profile.address ?? '',
        available: profile.available ?? true,
      })
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    await updateProfile({ fees: Number(form.fees), address: form.address, available: form.available })
    setSaving(false)
    setEditing(false)
  }

  if (loading && !profile) return <Spinner size="lg" className="py-32" />

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Mon profil</h1>
          <p className="text-sm text-on-surface-variant mt-1">Informations visibles par les patients</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 h-10 px-5 border border-outline-variant text-on-surface text-sm font-semibold rounded-xl hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="h-10 px-4 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-xl hover:bg-surface-container transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-10 px-5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Enregistrer
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Identity card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary-fixed ring-4 ring-primary/5 flex-shrink-0">
              {profile?.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                  <span className="material-symbols-outlined text-[40px] text-outline">person</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">{profile?.name}</h2>
              <p className="text-primary font-semibold">{profile?.speciality}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">school</span>
                  {profile?.degree}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">work_history</span>
                  {profile?.experience}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{profile?.email}</p>
            </div>
          </div>
          {profile?.about && (
            <div className="mt-5 pt-5 border-t border-outline-variant">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">À propos</p>
              <p className="text-sm text-on-surface leading-relaxed">{profile.about}</p>
            </div>
          )}
        </div>

        {/* Editable settings */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-6 space-y-5">
          <h3 className="text-base font-semibold text-on-surface">Paramètres de consultation</h3>

          {/* Fees */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Honoraires (DZD)
            </label>
            {editing ? (
              <input
                type="number"
                value={form.fees}
                min={0}
                onChange={(e) => setForm({ ...form, fees: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                placeholder="Ex: 2500"
              />
            ) : (
              <p className="text-sm font-semibold text-on-surface">{formatCurrency(profile?.fees)}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Adresse du cabinet
            </label>
            {editing ? (
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                placeholder="Adresse complète du cabinet"
              />
            ) : (
              <p className="text-sm text-on-surface">{profile?.address || '—'}</p>
            )}
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-surface-container rounded-xl">
            <div>
              <p className="text-sm font-semibold text-on-surface">Disponible aux consultations</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {form.available ? 'Vous apparaissez dans les recherches' : 'Vous êtes masqué des recherches'}
              </p>
            </div>
            {editing ? (
              <div
                className="relative cursor-pointer"
                onClick={() => setForm({ ...form, available: !form.available })}
              >
                <div className={`w-12 h-6 rounded-full transition-colors ${form.available ? 'bg-primary' : 'bg-outline-variant'}`} />
                <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${form.available ? 'translate-x-[26px]' : 'translate-x-[2px]'}`} />
              </div>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile?.available ? 'bg-green-100 text-green-700' : 'bg-surface-variant text-on-surface-variant'}`}>
                {profile?.available ? 'Actif' : 'Inactif'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
