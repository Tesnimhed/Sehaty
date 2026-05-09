import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { doctorApi } from '../../api/doctorApi.js'
import DoctorCard from '../../components/doctor/DoctorCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'

const SPECIALITIES = [
  'Généraliste', 'Cardiologue', 'Dermatologue', 'Gastro-entérologue',
  'Neurologue', 'Gynécologue', 'Pédiatre', 'Psychiatre',
  'Ophtalmologue', 'Orthopédiste', 'ORL', 'Urologue',
  'Endocrinologue', 'Rhumatologue', 'Radiologue',
]

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedSpecialities, setSelectedSpecialities] = useState([])
  const [availableOnly, setAvailableOnly] = useState(false)

  useEffect(() => {
    doctorApi.getList().then((res) => {
      if (res.data.success) setDoctors(res.data.doctors || [])
    }).finally(() => setLoading(false))
  }, [])

  const toggleSpeciality = (spec) => {
    setSelectedSpecialities((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )
  }

  const filtered = doctors
    .filter((d) => !availableOnly || d.available)
    .filter((d) => selectedSpecialities.length === 0 || selectedSpecialities.includes(d.speciality))
    .filter((d) =>
      search === '' ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.speciality.toLowerCase().includes(search.toLowerCase())
    )

  const clearFilters = () => {
    setSelectedSpecialities([])
    setAvailableOnly(false)
    setSearch('')
  }

  return (
    <div className="max-w-container-max mx-auto px-lg py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Trouver un médecin</h1>
          <p className="text-on-surface-variant mt-1">
            {filtered.length} spécialiste{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Nom, spécialité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-12 pr-4 bg-white border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-md sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-on-surface">Filtres</h2>
              <span className="material-symbols-outlined text-outline">filter_list</span>
            </div>

            {/* Available toggle */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-semibold text-on-surface">Disponible uniquement</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </div>
              </label>
            </div>

            {/* Speciality filters */}
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Spécialité</h3>
              <div className="space-y-2.5">
                {SPECIALITIES.map((spec) => (
                  <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedSpecialities.includes(spec)}
                      onChange={() => toggleSpeciality(spec)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            {(selectedSpecialities.length > 0 || availableOnly || search) && (
              <button
                onClick={clearFilters}
                className="w-full mt-6 py-2.5 bg-surface-container hover:bg-surface-variant text-on-surface-variant text-sm font-semibold rounded-xl transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </aside>

        {/* Doctor grid */}
        <div className="flex-1">
          {loading ? (
            <Spinner size="lg" className="py-16" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="person_search"
              title="Aucun médecin trouvé"
              description="Essayez de modifier vos filtres ou votre recherche."
              action={
                <button onClick={clearFilters} className="h-10 px-6 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all">
                  Réinitialiser
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
