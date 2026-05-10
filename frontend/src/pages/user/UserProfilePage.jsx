import { useEffect, useState, useRef } from 'react'
import { useUserStore } from '../../store/useUserStore.js'
import Spinner from '../../components/ui/Spinner.jsx'

const GENDERS = ['Homme', 'Femme', 'Non précisé']

// Max date for DOB = today (can't be born in the future)
const TODAY = new Date().toISOString().split('T')[0]
// Min date = 120 years ago (reasonable human lifespan)
const MIN_DOB = `${new Date().getFullYear() - 120}-01-01`

export default function UserProfilePage() {
  const { profile, loading, fetchProfile, updateProfile } = useUserStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', dob: '', gender: '', line1: '', line2: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef()

  useEffect(() => { fetchProfile() }, [])

  useEffect(() => {
    if (profile) resetForm(profile)
  }, [profile])

  // FIX : strip les valeurs sentinelles MongoDB ('Not Selected', '0000000000')
  // pour que les champs du formulaire partent de '' et non de ces placeholders.
  const clean = (v, ...sentinels) =>
    (!v || sentinels.includes(v)) ? '' : v

  const resetForm = (p) => setForm({
    name:   p.name || '',
    phone:  clean(p.phone, '0000000000'),
    dob:    clean(p.dob, 'Not Selected') ? p.dob.slice(0, 10) : '',
    // FIX: si le genre vient de CompleteProfilePage ('Non précisé' inclus),
    // on le conserve. Si absent ou inconnu, on tombe sur 'Non précisé'
    // plutôt que '' pour ne pas bloquer la validation backend (!gender).
    gender: GENDERS.includes(p.gender) ? p.gender : 'Non précisé',
    line1:  p.address?.line1 || '',
    line2:  p.address?.line2 || '',
  })

  const handleCancel = () => {
    setEditing(false)
    setImageFile(null)
    setImagePreview(null)
    if (profile) resetForm(profile)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    const fd = new FormData()
    fd.append('name',    form.name || 'Utilisateur')
    if (form.phone)   fd.append('phone',   form.phone)
    if (form.dob)     fd.append('dob',     form.dob)
    // FIX: on envoie toujours un genre valide (jamais vide)
    // pour satisfaire la validation backend (!gender → 400)
    fd.append('gender', form.gender || 'Non précisé')
    fd.append('address', JSON.stringify({ line1: form.line1, line2: form.line2 }))
    if (imageFile) fd.append('image', imageFile)
    await updateProfile(fd)
    setSaving(false)
    setEditing(false)
    setImageFile(null)
    // FIX: reset l'aperçu local — l'image réelle vient du profil rechargé
    setImagePreview(null)
  }

  if (loading && !profile) return <Spinner size="lg" className="py-32" />

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface">Mon profil</h1>
        <p className="text-on-surface-variant mt-1">Gérez vos informations personnelles</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary to-on-primary-fixed-variant" />

        <div className="px-5 sm:px-8 pb-8">
          {/* Avatar + actions */}
          <div className="flex items-end justify-between -mt-14 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-lg bg-surface-container-high">
                {(imagePreview || profile?.image)
                  ? <img src={imagePreview || profile.image} alt="Avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-[40px] text-outline">person</span></div>
                }
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
                <button onClick={handleCancel} className="h-10 px-4 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-xl hover:bg-surface-container transition-colors">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving} className="h-10 px-5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2">
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Enregistrer
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Nom */}
            <Field label="Nom complet">
              {editing
                ? <Input value={form.name} onChange={(v) => setForm({ ...form, name: v }) } placeholder="Votre nom complet" />
                : <Value>{profile?.name}</Value>
              }
            </Field>

            {/* Email (readonly toujours) */}
            <Field label="Email">
              <p className="text-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                {profile?.email || '—'}
              </p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Téléphone */}
              <Field label="Téléphone">
                {editing
                  ? <Input type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+213 6XX XXX XXX" />
                  : <Value>{profile?.phone}</Value>
                }
              </Field>

              {/* Date de naissance — max = aujourd'hui, min = -120 ans */}
              <Field label="Date de naissance">
                {editing
                  ? (
                    <input
                      type="date"
                      value={form.dob}
                      max={TODAY}
                      min={MIN_DOB}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    />
                  )
                  : <Value>{profile?.dob ? new Date(profile.dob).toLocaleDateString('fr-FR') : null}</Value>
                }
              </Field>

              {/* Genre */}
              <Field label="Genre">
                {editing
                  ? (
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                    >
                      <option value="">Sélectionner</option>
                      {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  )
                  : <Value>{profile?.gender}</Value>
                }
              </Field>
            </div>

            {/* Adresse */}
            <Field label="Adresse">
              {editing
                ? (
                  <div className="space-y-2">
                    <Input value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} placeholder="Rue, quartier, ville…" />
                    <Input value={form.line2} onChange={(v) => setForm({ ...form, line2: v })} placeholder="Complément d'adresse (optionnel)" />
                  </div>
                )
                : (
                  <Value>
                    {profile?.address?.line1
                      ? `${profile.address.line1}${profile.address.line2 ? `, ${profile.address.line2}` : ''}`
                      : null}
                  </Value>
                )
              }
            </Field>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ── */
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

function Input({ type = 'text', value, onChange, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-shadow"
    />
  )
}

// FIX : filtre les valeurs sentinelles par défaut du modèle MongoDB
// ('Not Selected', '0000000000') héritées d'un profil jamais complété.
const EMPTY_SENTINELS = ['Not Selected', '0000000000']
function Value({ children }) {
  const display = children && !EMPTY_SENTINELS.includes(String(children)) ? children : null
  return <p className="text-sm text-on-surface">{display || '—'}</p>
}