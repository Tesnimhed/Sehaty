import { useEffect, useState, useRef } from 'react'
import { useAdminStore } from '../../store/useAdminStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

const SPECIALITIES = [
  'Généraliste', 'Cardiologue', 'Dermatologue', 'Gastro-entérologue',
  'Neurologue', 'Gynécologue', 'Pédiatre', 'Psychiatre',
  'Ophtalmologue', 'Orthopédiste', 'ORL', 'Urologue',
  'Endocrinologue', 'Rhumatologue', 'Radiologue',
]

const EXPERIENCE_OPTIONS = ['1 an', '2 ans', '3 ans', '5 ans', '10 ans', '15 ans', '20 ans+']

const EMPTY_FORM = {
  name: '', email: '', password: '', speciality: 'Généraliste',
  degree: '', experience: '1 an', about: '', fees: '',
  address: '', available: true,
}

export default function AdminDoctorsPage() {
  const { doctors, loading, fetchDoctors, addDoctor, deleteDoctor, toggleAvailability } = useAdminStore()
  const [showAdd, setShowAdd] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [search, setSearch] = useState('')
  const fileRef = useRef()

  useEffect(() => { fetchDoctors() }, [])

  const filtered = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.speciality.toLowerCase().includes(search.toLowerCase())
  )

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleAdd = async () => {
    if (!imageFile) { alert('Photo requise'); return }
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('image', imageFile)
    const ok = await addDoctor(fd)
    if (ok) {
      setShowAdd(false)
      setForm(EMPTY_FORM)
      setImageFile(null)
      setImagePreview(null)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteDoctor(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  const F = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) })
  const inputCls = 'w-full h-11 px-4 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm'

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Médecins</h1>
          <p className="text-sm text-on-surface-variant mt-1">{doctors.length} médecin{doctors.length > 1 ? 's' : ''} enregistré{doctors.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 pr-4 rounded-xl border border-outline-variant bg-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="h-10 px-5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Ajouter
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : filtered.length === 0 ? (
        <EmptyState icon="medical_services" title="Aucun médecin" description="Ajoutez votre premier médecin en cliquant sur le bouton ci-dessus." />
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container">
                  {['Médecin', 'Spécialité', 'Diplôme', 'Honoraires', 'Disponible', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc._id} className="border-b border-outline-variant/40 hover:bg-surface-container/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
                          {doc.image ? (
                            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-outline text-[16px]">person</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{doc.name}</p>
                          <p className="text-xs text-on-surface-variant">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-on-surface">{doc.speciality}</td>
                    <td className="py-3 px-4 text-sm text-on-surface-variant">{doc.degree}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-on-surface">{formatCurrency(doc.fees)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleAvailability(doc._id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${doc.available ? 'bg-primary' : 'bg-outline-variant'}`}
                      >
                        <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${doc.available ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setDeleteId(doc._id)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Ajouter un médecin" size="lg">
        <div className="space-y-5">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                onClick={() => fileRef.current.click()}
                className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant hover:border-primary cursor-pointer bg-surface-container-high flex items-center justify-center transition-colors"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[28px] text-outline">add_photo_alternate</span>
                    <p className="text-xs text-outline mt-1">Photo *</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nom complet *</label>
              <input type="text" required placeholder="Dr. Prénom NOM" className={inputCls} {...F('name')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email *</label>
              <input type="email" required placeholder="docteur@exemple.com" className={inputCls} {...F('email')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Mot de passe *</label>
              <input type="password" required placeholder="••••••••" className={inputCls} {...F('password')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Spécialité *</label>
              <select className={inputCls} {...F('speciality')}>
                {SPECIALITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Diplôme *</label>
              <input type="text" required placeholder="Ex: Doctorat en médecine" className={inputCls} {...F('degree')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Expérience *</label>
              <select className={inputCls} {...F('experience')}>
                {EXPERIENCE_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Honoraires (DZD) *</label>
              <input type="number" required min={0} placeholder="Ex: 2500" className={inputCls} {...F('fees')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Adresse du cabinet</label>
              <input type="text" placeholder="Adresse complète" className={inputCls} {...F('address')} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">À propos</label>
            <textarea
              rows={3}
              placeholder="Description professionnelle du médecin..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm resize-none"
              {...F('about')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowAdd(false)} className="h-11 px-6 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-xl hover:bg-surface-container transition-colors">
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="h-11 px-6 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Ajouter le médecin
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Supprimer le médecin"
        message="Êtes-vous sûr de vouloir supprimer ce médecin ? Tous ses rendez-vous seront impactés."
        confirmLabel="Supprimer définitivement"
        variant="danger"
      />
    </div>
  )
}
