import { useEffect, useState } from 'react'
import { useAdminStore } from '../../store/useAdminStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'
import { formatDate } from '../../utils/formatDate.js'

export default function AdminPatientsPage() {
  const { patients, loading, fetchPatients, deletePatient } = useAdminStore()
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchPatients() }, [])

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  const handleDelete = async () => {
    setDeleting(true)
    await deletePatient(confirmId)
    setDeleting(false)
    setConfirmId(null)
  }

  const formatDob = (dob) => {
    if (!dob || dob === 'Not Selected') return '—'
    const d = new Date(dob)
    if (isNaN(d)) return dob
    return d.toLocaleDateString('fr-FR')
  }

  const formatGender = (g) => {
    if (!g || g === 'Not Selected') return '—'
    return g
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Patients</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {patients.length} patient{patients.length > 1 ? 's' : ''} enregistré{patients.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            type="text"
            placeholder="Nom, email, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 pr-4 rounded-xl border border-outline-variant bg-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-full md:w-72"
          />
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="group"
          title="Aucun patient trouvé"
          description="Aucun patient ne correspond à votre recherche."
        />
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container">
                  {['Patient', 'Email', 'Téléphone', 'Genre', 'Date de naissance', 'Inscrit le', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient._id} className="border-b border-outline-variant/40 hover:bg-surface-container/30 transition-colors">
                    {/* Patient */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
                          {patient.image
                            ? <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-outline text-[16px]">person</span>
                              </div>
                          }
                        </div>
                        <span className="text-sm font-semibold text-on-surface whitespace-nowrap">{patient.name || '—'}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-sm text-on-surface-variant">{patient.email || '—'}</td>

                    {/* Téléphone */}
                    <td className="py-3 px-4 text-sm text-on-surface">
                      {(!patient.phone || patient.phone === '0000000000') ? '—' : patient.phone}
                    </td>

                    {/* Genre */}
                    <td className="py-3 px-4 text-sm text-on-surface">{formatGender(patient.gender)}</td>

                    {/* Date de naissance */}
                    <td className="py-3 px-4 text-sm text-on-surface">{formatDob(patient.dob)}</td>

                    {/* Inscrit le */}
                    <td className="py-3 px-4 text-sm text-on-surface-variant whitespace-nowrap">
                      {patient.createdAt ? formatDate(patient.createdAt) : '—'}
                    </td>

                    {/* Actions — FIX : toujours visible, plus opacity-0 */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setConfirmId(patient._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-error bg-error-container/40 hover:bg-error-container rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*
        FIX : les props passées à ConfirmDialog étaient incorrectes.
        AdminPatientsPage passait : open, onConfirm, onCancel
        Mais ConfirmDialog attend  : isOpen, onConfirm, onClose
        → le dialog ne s'ouvrait jamais, le bouton supprimer ne faisait rien.
      */}
      <ConfirmDialog
        isOpen={!!confirmId}
        title="Supprimer ce patient ?"
        message="Cette action est irréversible. Le compte et tous les rendez-vous en cours seront supprimés définitivement."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmId(null)}
      />
    </div>
  )
}