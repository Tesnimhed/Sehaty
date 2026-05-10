import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore.js'
import toast from 'react-hot-toast'

const GENDERS = ['Homme', 'Femme', 'Non précisé']

const STEPS = [
  { id: 'identity', label: 'Identité', icon: 'person' },
  { id: 'contact', label: 'Contact', icon: 'call' },
  { id: 'photo', label: 'Photo', icon: 'photo_camera' },
]

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const { updateProfile } = useUserStore()
  const fileRef = useRef()

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '',
    dob: '',
    // FIX : gender par défaut à 'Non précisé' pour éviter l'échec de validation
    // backend qui exige un genre non vide. L'utilisateur peut toujours choisir.
    gender: 'Non précisé',
    phone: '',
    line1: '',
    line2: '',
  })

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors((e) => ({ ...e, image: undefined }))
  }

  // ── Validation par étape ──────────────────────────────────
  const validateStep = (s) => {
    const errs = {}
    if (s === 0) {
      if (!form.name.trim()) errs.name = 'Nom requis'
      // gender a toujours une valeur par défaut, pas besoin de valider
    }
    if (s === 1) {
      if (form.phone && !/^(\+213|0)[5-7]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
        errs.phone = 'Numéro invalide (ex: 0661 234 567)'
      }
    }
    return errs
  }

  const handleNext = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep((s) => s + 1)
  }

  const handleBack = () => { setErrors({}); setStep((s) => s - 1) }

  // ── Soumission finale ─────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name.trim() || 'Utilisateur')
      if (form.phone) fd.append('phone', form.phone)
      if (form.dob) fd.append('dob', form.dob)
      // FIX : on envoie toujours un genre valide (jamais vide)
      fd.append('gender', form.gender || 'Non précisé')
      if (form.line1 || form.line2)
        fd.append('address', JSON.stringify({ line1: form.line1, line2: form.line2 }))
      if (imageFile) fd.append('image', imageFile)

      const ok = await updateProfile(fd)
      if (ok) {
        navigate('/', { replace: true })
      } else {
        // FIX : affiche un message d'erreur explicite si l'API échoue
        toast.error('Impossible de sauvegarder le profil. Réessayez.')
      }
    } catch (err) {
      toast.error('Une erreur est survenue. Réessayez.')
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => navigate('/', { replace: true })

  const inputCls = (field) =>
    `w-full h-11 px-4 rounded-xl border bg-white outline-none text-sm transition-all focus:ring-2 focus:ring-primary focus:border-primary ${
      errors[field] ? 'border-error focus:ring-error' : 'border-outline-variant'
    }`

  const progress = Math.round(((step) / STEPS.length) * 100)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <main className="w-full max-w-5xl flex shadow-2xl rounded-2xl overflow-hidden bg-surface-container-lowest">

        {/* ── Panel gauche ───────────────────────────────── */}
        <div className="hidden md:flex md:w-5/12 relative bg-primary flex-col items-start justify-between p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <div className="relative z-10 w-full">
            <span className="text-3xl font-bold text-on-primary block mb-1">Sehaty</span>
            <div className="h-1 w-10 bg-on-primary rounded-full mb-10" />
            <h2 className="text-4xl font-bold text-on-primary leading-tight mb-4">
              Bienvenue !<br />Dites-nous<br />qui vous êtes.
            </h2>
            <p className="text-on-primary/80 text-base leading-relaxed">
              Complétez votre profil pour une expérience personnalisée. Vous pourrez modifier ces informations à tout moment.
            </p>

            {/* Steps list */}
            <div className="mt-10 flex flex-col gap-5">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    i < step ? 'bg-on-primary text-primary' :
                    i === step ? 'bg-on-primary/20 text-on-primary ring-2 ring-on-primary' :
                    'bg-on-primary/10 text-on-primary/40'
                  }`}>
                    {i < step
                      ? <span className="material-symbols-outlined text-[18px]">check</span>
                      : <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                    }
                  </div>
                  <span className={`font-semibold text-sm transition-all ${
                    i <= step ? 'text-on-primary' : 'text-on-primary/40'
                  }`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 w-full mt-10">
            <div className="flex justify-between text-xs text-on-primary/70 mb-2">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-on-primary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-on-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Panel droit ────────────────────────────────── */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-between min-h-[560px]">
          {/* Header mobile */}
          <div className="md:hidden mb-6 text-center">
            <span className="text-2xl font-bold text-primary">Sehaty</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">

            {/* ── Étape 0 : Identité ── */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-on-surface">Votre identité</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Ces informations nous permettent de personnaliser votre expérience.</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Nom complet <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Prénom NOM"
                    className={inputCls('name')}
                    autoFocus
                  />
                  {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Genre
                  </label>
                  <div className="flex gap-3">
                    {GENDERS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => set('gender', g)}
                        className={`flex-1 h-11 rounded-xl border text-sm font-semibold transition-all ${
                          form.gender === g
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => set('dob', e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className={inputCls('dob')}
                  />
                </div>
              </div>
            )}

            {/* ── Étape 1 : Contact ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-on-surface">Vos coordonnées</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Ces informations sont facultatives mais utiles pour vos rendez-vous.</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="0661 234 567"
                    className={inputCls('phone')}
                    autoFocus
                  />
                  {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={form.line1}
                    onChange={(e) => set('line1', e.target.value)}
                    placeholder="Rue, numéro, quartier"
                    className={inputCls('line1')}
                  />
                  <input
                    type="text"
                    value={form.line2}
                    onChange={(e) => set('line2', e.target.value)}
                    placeholder="Wilaya, ville (optionnel)"
                    className={`${inputCls('line2')} mt-2`}
                  />
                </div>
              </div>
            )}

            {/* ── Étape 2 : Photo ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-on-surface">Votre photo</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Une photo de profil pour que les médecins vous reconnaissent. Optionnel.</p>
                </div>

                <div className="flex flex-col items-center gap-4 py-4">
                  <div
                    onClick={() => fileRef.current.click()}
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-dashed border-outline-variant hover:border-primary cursor-pointer bg-surface-container-high flex items-center justify-center transition-all group"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[40px] text-outline">add_a_photo</span>
                        <p className="text-xs text-outline mt-1">Choisir</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                  {imagePreview ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => fileRef.current.click()}
                        className="h-9 px-4 border border-outline-variant rounded-xl text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                      >
                        Changer
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null) }}
                        className="h-9 px-4 border border-outline-variant rounded-xl text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-outline text-center">JPG, PNG — max 5 Mo</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ───────────────────────────────── */}
          <div className="mt-8">
            {/* Mobile progress */}
            <div className="md:hidden mb-4">
              <div className="h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-outline text-center mt-1">Étape {step + 1} / {STEPS.length}</p>
            </div>

            <div className="flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-11 px-5 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-xl hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Retour
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="h-11 px-5 text-on-surface-variant text-sm hover:text-on-surface transition-colors"
                >
                  Passer pour l'instant
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-11 px-6 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                >
                  Suivant
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="h-11 px-6 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
                >
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-[16px]">check</span>
                  }
                  Terminer
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}