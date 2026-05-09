import { useEffect, useState } from 'react'
import { useAdminStore } from '../../store/useAdminStore.js'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { formatDate } from '../../utils/formatDate.js'

export default function AdminPatientsPage() {
  const { patients, loading, fetchPatients } = useAdminStore()
  const [search, setSearch] = useState('')

  useEffect(() => { fetchPatients() }, [])

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  return (
    <div className="p-6 space-y-6">
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
            className="h-10 pl-10 pr-4 rounded-xl border border-outline-variant bg-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-64"
          />
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : filtered.length === 0 ? (
        <EmptyState icon="group" title="Aucun patient trouvé" description="Aucun patient ne correspond à votre recherche." />
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container">
                  {['Patient', 'Email', 'Téléphone', 'Genre', 'Date de naissance', 'Inscrit le'].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient._id} className="border-b border-outline-variant/40 hover:bg-surface-container/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
                          {patient.image ? (
                            <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-outline text-[18px]">person</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-on-surface">{patient.name || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-on-surface-variant">{patient.email || '—'}</td>
                    <td className="py-3 px-4 text-sm text-on-surface">{patient.phone || '—'}</td>
                    <td className="py-3 px-4 text-sm text-on-surface-variant">{patient.gender || '—'}</td>
                    <td className="py-3 px-4 text-sm text-on-surface">{patient.dob || '—'}</td>
                    <td className="py-3 px-4 text-sm text-on-surface-variant whitespace-nowrap">{formatDate(patient.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
