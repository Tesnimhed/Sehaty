import { useEffect, useState, useRef } from 'react'
import { useUserStore } from '../../store/useUserStore.js'
import Spinner from '../../components/ui/Spinner.jsx'

const GENDERS = ['Homme', 'Femme', 'Non précisé']

export default function UserProfilePage() {
  const { profile, loading, fetchProfile, updateProfile } = useUserStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', dob: '', gender: '', line1: '', line2: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()

  useEffect(() => { fetchProfile() }, [])

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        dob: profile.dob ? profile.dob.slice(0, 10) : '',
        gender: ['Homme', 'Femme', 'Non précisé'].includes(profile.gender) ? profile.gender : '',
        line1: profile.address?.line1 || '',
        line2: profile.address?.line2 || '',
      })
    }
  }, [profile])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('phone', form.phone)
    fd.append('dob', form.dob)
    fd.append('gender', form.gender)
    fd.append('address', JSON.stringify({ line1: form.line1, line2: form.line2 }))
    if (imageFile) fd.append('image', imageFile)
    await updateProfile(fd)
    setSaving(false)
    setEditing(false)
    setImageFile(null)
  }

  if (loading && !profile) return <Spinner size="lg" className="py-32" />

  return (
    <div className="max-w-2xl mx-auto px-lg py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface">Mon profil</h1>
        <p className="text-on-surface-variant mt-1">Gérez vos informations personnelles</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary to-on-primary-fixed-variant" />

        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-14 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-lg bg-surface-container-high">
                {(imagePreview || profile?.image) ? (
                  <img
                    src={imagePreview || profile.image}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-outline">person</span>
                  </div>
                )}
              </div>
              {editing && (
                <>
                  <button
                    onClick={() => fileRef.current.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </>
              )}
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
                  onClick={() => {
                    setEditing(false)
                    setImageFile(null)
                    setImagePreview(null)
                    if (profile) {
                      setForm({
                        name: profile.name || '',
                        phone: profile.phone || '',
                        dob: profile.dob ? profile.dob.slice(0, 10) : '',
                        gender: ['Homme', 'Femme', 'Non précisé'].includes(profile.gender) ? profile.gender : '',
                        line1: profile.address?.line1 || '',
                        line2: profile.address?.line2 || '',
                      })
                    }
                  }}
                  className="h-10 px-5 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-xl hover:bg-surface-container transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-10 px-5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  Enregistrer
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nom complet</label>
              {editing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                />
              ) : (
                <p className="text-sm font-semibold text-on-surface">{profile?.name || '—'}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email</label>
              <p className="text-sm text-on-surface-variant">{profile?.email || '—'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Téléphone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+213 6XX XXX XXX"
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                ) : (
                  <p className="text-sm text-on-surface">{profile?.phone || '—'}</p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date de naissance</label>
                {editing ? (
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                ) : (
                  <p className="text-sm text-on-surface">{profile?.dob || '—'}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Genre</label>
                {editing ? (
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  >
                    <option value="">Sélectionner</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                ) : (
                  <p className="text-sm text-on-surface">{profile?.gender || '—'}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Adresse</label>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    placeholder="Adresse ligne 1"
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    placeholder="Adresse ligne 2 (optionnel)"
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>
              ) : (
                <p className="text-sm text-on-surface">
                  {profile?.address?.line1 || '—'}
                  {profile?.address?.line2 ? `, ${profile.address.line2}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}