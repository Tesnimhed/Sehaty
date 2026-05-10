import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doctorApi } from '../../api/doctorApi.js'
import DoctorCard from '../../components/doctor/DoctorCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

const SPECIALITIES = [
  'Tous', 'Généraliste', 'Cardiologue', 'Dermatologue', 'Gastro-entérologue',
  'Neurologue', 'Gynécologue', 'Pédiatre', 'Psychiatre',
  'Ophtalmologue', 'Orthopédiste', 'ORL', 'Urologue',
]

const STATS = [
  { icon: 'medical_services', value: '200+', label: 'Médecins spécialistes' },
  { icon: 'people', value: '15 000+', label: 'Patients satisfaits' },
  { icon: 'calendar_month', value: '50 000+', label: 'Rendez-vous pris' },
  { icon: 'star', value: '4.9/5', label: 'Note moyenne' },
]

export default function HomePage() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSpeciality, setActiveSpeciality] = useState('Tous')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    doctorApi.getList().then((res) => {
      if (res.data.success) setDoctors(res.data.doctors || [])
    }).finally(() => setLoading(false))
  }, [])

  const filtered = doctors
    .filter((d) => d.available)
    .filter((d) => activeSpeciality === 'Tous' || d.speciality === activeSpeciality)
    .filter((d) =>
      search === '' ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.speciality.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 6)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/medecins?q=${search}`)
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[580px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary/90 to-on-primary-fixed-variant" />
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-lg w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Plateforme médicale certifiée — Algérie
            </div>
            <h1 className="text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
              Réservez votre<br />consultation en ligne
            </h1>
            <p className="text-lg text-white/85 mb-8 leading-relaxed">
              Accédez aux meilleurs spécialistes en Algérie. Prenez rendez-vous en quelques clics, 24h/24 et 7j/7.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-outline">search</span>
                <input
                  type="text"
                  placeholder="Nom du médecin ou spécialité"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-sm text-on-surface placeholder:text-outline"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all active:scale-95"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-24 bottom-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/3" />
      </section>

      {/* Stats bar */}
      <div className="bg-surface-container-lowest shadow-md">
        <div className="max-w-container-max mx-auto px-lg py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">{stat.icon}</span>
              </div>
              <div>
                <div className="text-lg font-bold text-on-surface">{stat.value}</div>
                <div className="text-xs text-on-surface-variant">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialities */}
      <section className="py-10 max-w-container-max mx-auto px-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Spécialités populaires</h2>
          <button
            onClick={() => navigate('/medecins')}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
          >
            Voir tout <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {SPECIALITIES.map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveSpeciality(spec)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                activeSpeciality === spec
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:border-primary/30'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="pb-16 max-w-container-max mx-auto px-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Médecins disponibles</h2>
          <button
            onClick={() => navigate('/medecins')}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
          >
            Voir tous <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {loading ? (
          <Spinner size="lg" className="py-16" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline block mb-3">search_off</span>
            Aucun médecin disponible pour cette spécialité
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-surface-container py-16">
        <div className="max-w-container-max mx-auto px-lg text-center">
          <h2 className="text-3xl font-bold text-on-surface mb-4">
            Vous êtes médecin ?
          </h2>
          <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
            Rejoignez le réseau Sehaty et gérez votre cabinet en ligne. Touchez plus de patients et simplifiez votre planning.
          </p>
          <button
            onClick={() => navigate('/medecin/connexion')}
            className="h-12 px-8 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95"
          >
            Rejoindre Sehaty
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-inverse-surface text-inverse-on-surface py-8">
        <div className="max-w-container-max mx-auto px-lg text-center">
          <p className="text-sm font-bold mb-1">Sehaty</p>
          <p className="text-xs opacity-60">
            © 2026 Sehaty Algérie. Tous droits réservés. Système certifié de gestion médicale.
          </p>
        </div>
      </footer>
    </div>
  )
}
