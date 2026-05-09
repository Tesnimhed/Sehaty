const TEAM = [
  {
    name: 'Dr. Karim Benali',
    role: 'Fondateur & Directeur médical',
    speciality: 'Cardiologue',
    icon: 'favorite',
  },
  {
    name: 'Yasmine Hamdani',
    role: 'Directrice technique',
    speciality: 'Ingénieure logiciel',
    icon: 'code',
  },
  {
    name: 'Amine Meziane',
    role: 'Responsable partenariats',
    speciality: 'Relations médicales',
    icon: 'handshake',
  },
]

const VALUES = [
  {
    icon: 'verified_user',
    title: 'Confiance & Sécurité',
    description:
      'Toutes vos données médicales sont chiffrées et stockées de manière sécurisée. Votre vie privée est notre priorité absolue.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: 'accessibility',
    title: 'Accessibilité',
    description:
      'Sehaty est conçu pour être accessible à tous les Algériens, où qu\'ils se trouvent, à tout moment de la journée.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: 'local_hospital',
    title: 'Excellence médicale',
    description:
      'Nous sélectionnons rigoureusement les médecins partenaires pour garantir des soins de la plus haute qualité.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: 'speed',
    title: 'Rapidité',
    description:
      'Prenez rendez-vous en moins de 2 minutes. Fini les longues attentes téléphoniques et les files d\'attente.',
    color: 'bg-secondary-container text-on-secondary-container',
  },
]

const STATS = [
  { value: '200+', label: 'Médecins partenaires', icon: 'medical_services' },
  { value: '15 000+', label: 'Patients satisfaits', icon: 'people' },
  { value: '48', label: 'Wilayas couvertes', icon: 'location_on' },
  { value: '4.9/5', label: 'Note de satisfaction', icon: 'star' },
]

const FAQ = [
  {
    q: 'Comment fonctionne Sehaty ?',
    a: 'Sehaty est une plateforme qui vous met en relation avec des médecins spécialistes. Créez un compte gratuit, choisissez un médecin, sélectionnez un créneau disponible et confirmez votre rendez-vous en ligne.',
  },
  {
    q: 'Les paiements sont-ils sécurisés ?',
    a: 'Oui, tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. Vos données bancaires ne sont jamais stockées sur nos serveurs.',
  },
  {
    q: 'Puis-je annuler un rendez-vous ?',
    a: 'Vous pouvez annuler un rendez-vous depuis votre espace « Mes rendez-vous ». En cas de paiement préalable, un remboursement est traité automatiquement.',
  },
  {
    q: 'Comment devenir médecin partenaire ?',
    a: 'Les médecins sont ajoutés via notre équipe d\'administration après vérification de leurs diplômes et de leur numéro d\'inscription à l\'Ordre des médecins.',
  },
  {
    q: 'Sehaty est-il disponible dans toute l\'Algérie ?',
    a: 'Oui, Sehaty couvre les 48 wilayas d\'Algérie. Notre réseau de médecins s\'agrandit chaque semaine.',
  },
]

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-on-primary-fixed-variant py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-container-max mx-auto px-lg text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px]">info</span>
            À propos de Sehaty
          </div>
          <h1 className="text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
            La santé digitale<br />au service de l'Algérie
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Sehaty est la première plateforme algérienne de réservation médicale en ligne. Notre mission : connecter chaque patient au bon spécialiste, rapidement et en toute sécurité.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
      </section>

      {/* Stats */}
      <section className="bg-surface-container-lowest shadow-md">
        <div className="max-w-container-max mx-auto px-lg py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center gap-2 py-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">{s.icon}</span>
              </div>
              <p className="text-2xl font-bold text-on-surface">{s.value}</p>
              <p className="text-xs text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-container-max mx-auto px-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Notre mission</span>
            <h2 className="text-3xl font-bold text-on-surface mt-2 mb-5 leading-snug">
              Rendre la médecine spécialisée accessible à tous
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              En Algérie, obtenir un rendez-vous chez un spécialiste peut prendre des semaines. Sehaty change la donne en permettant à chaque patient de réserver une consultation en quelques clics, 24h/24 et 7j/7.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Fondée en 2024, Sehaty rassemble aujourd'hui plus de 200 médecins agréés dans toutes les spécialités et les 48 wilayas d'Algérie.
            </p>
            <button
              onClick={() => navigate('/medecins')}
              className="h-12 px-8 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              Trouver un médecin
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'calendar_month', text: 'Réservation 24h/24' },
              { icon: 'credit_card', text: 'Paiement sécurisé' },
              { icon: 'notifications', text: 'Rappels automatiques' },
              { icon: 'folder_shared', text: 'Dossier patient en ligne' },
            ].map((item) => (
              <div key={item.text} className="bg-surface-container-lowest rounded-2xl p-5 shadow-md flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[24px]">{item.icon}</span>
                </div>
                <p className="text-sm font-semibold text-on-surface">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface-container/40">
        <div className="max-w-container-max mx-auto px-lg">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Nos valeurs</span>
            <h2 className="text-3xl font-bold text-on-surface mt-2">Ce qui nous guide chaque jour</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-surface-container-lowest rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${v.color}`}>
                  <span className="material-symbols-outlined text-[24px]">{v.icon}</span>
                </div>
                <h3 className="font-bold text-on-surface mb-2">{v.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-container-max mx-auto px-lg">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">L'équipe</span>
          <h2 className="text-3xl font-bold text-on-surface mt-2">Ceux qui font Sehaty</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {TEAM.map((member) => (
            <div key={member.name} className="bg-surface-container-lowest rounded-2xl p-6 shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-[36px]">{member.icon}</span>
              </div>
              <h3 className="font-bold text-on-surface">{member.name}</h3>
              <p className="text-sm text-primary font-semibold mt-0.5">{member.role}</p>
              <p className="text-xs text-on-surface-variant mt-1">{member.speciality}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-surface-container/40">
        <div className="max-w-2xl mx-auto px-lg">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl font-bold text-on-surface mt-2">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-semibold text-on-surface text-sm">{item.q}</span>
                  <span className={`material-symbols-outlined text-outline flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-on-surface-variant leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-container-max mx-auto px-lg text-center">
        <div className="bg-gradient-to-br from-primary to-on-primary-fixed-variant rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">Prêt à prendre soin de votre santé ?</h2>
            <p className="text-white/85 mb-8 max-w-xl mx-auto">
              Rejoignez des milliers de patients qui font confiance à Sehaty pour gérer leur santé en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/inscription')}
                className="h-12 px-8 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all active:scale-95"
              >
                Créer un compte gratuit
              </button>
              <button
                onClick={() => navigate('/medecins')}
                className="h-12 px-8 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-all active:scale-95 backdrop-blur-sm border border-white/20"
              >
                Parcourir les médecins
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-inverse-surface text-inverse-on-surface py-8">
        <div className="max-w-container-max mx-auto px-lg text-center">
          <p className="text-sm font-bold mb-1">Sehaty</p>
          <p className="text-xs opacity-60">
            © 2025 Sehaty Algérie. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
