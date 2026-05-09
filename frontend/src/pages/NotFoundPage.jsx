import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const orbRef = useRef(null)

  // Subtle parallax on the decorative orb
  useEffect(() => {
    const handleMove = (e) => {
      if (!orbRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden px-4">

      {/* ── Decorative background blobs ── */}
      <div
        ref={orbRef}
        className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full opacity-[0.07] transition-transform duration-700 ease-out"
        style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, var(--color-tertiary, #7c4dff) 0%, transparent 70%)' }}
      />

      {/* ── Floating medical cross icons ── */}
      <FloatingIcon icon="add" top="12%" left="8%" delay="0s" size={28} />
      <FloatingIcon icon="favorite" top="20%" right="10%" delay="0.6s" size={20} />
      <FloatingIcon icon="medical_services" bottom="18%" left="12%" delay="1.2s" size={24} />
      <FloatingIcon icon="healing" bottom="24%" right="8%" delay="0.3s" size={22} />
      <FloatingIcon icon="vaccines" top="60%" left="5%" delay="0.9s" size={18} />

      {/* ── Main card ── */}
      <div className="relative z-10 text-center max-w-lg w-full animate-fadeIn">

        {/* Stethoscope illustration */}
        <div className="mx-auto mb-6 relative w-fit">
          <div className="w-28 h-28 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto shadow-lg">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 56 }}>
              stethoscope
            </span>
          </div>
          {/* Badge 404 */}
          <span className="absolute -top-2 -right-2 bg-error text-on-error text-xs font-bold px-2 py-1 rounded-full shadow">
            404
          </span>
        </div>

        {/* Big number */}
        <p
          className="font-black leading-none mb-2 select-none"
          style={{
            fontSize: 'clamp(80px, 18vw, 140px)',
            background: 'linear-gradient(135deg, var(--color-primary) 30%, var(--color-tertiary, #7c4dff) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </p>

        <h1 className="text-2xl font-bold text-on-surface mb-3">
          Page introuvable
        </h1>
        <p className="text-on-surface/60 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          Pas d'inquiétude, notre équipe médicale est toujours là pour vous&nbsp;!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-on-primary font-semibold text-sm rounded-xl shadow-sm hover:bg-primary/90 active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Retour à l'accueil
          </button>
          <button
            onClick={() => navigate('/medecins')}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-surface-container text-on-surface font-semibold text-sm rounded-xl border border-outline-variant hover:bg-surface-container-high active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            Trouver un médecin
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-outline-variant/40">
          <p className="text-xs text-on-surface/40 uppercase tracking-widest mb-4 font-medium">
            Liens utiles
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: 'Connexion', path: '/connexion' },
              { label: 'Inscription', path: '/inscription' },
              { label: 'À propos', path: '/a-propos' },
              { label: 'Mes rendez-vous', path: '/mes-rendez-vous' },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="text-sm text-primary hover:underline underline-offset-2 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-10px) rotate(8deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }
        .animate-float {
          animation: float var(--dur, 4s) ease-in-out var(--delay, 0s) infinite;
        }
      `}</style>
    </div>
  )
}

/* ── Helper: floating icon ── */
function FloatingIcon({ icon, top, left, right, bottom, delay, size = 24 }) {
  const pos = {
    ...(top    !== undefined && { top }),
    ...(left   !== undefined && { left }),
    ...(right  !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
    '--delay': delay,
    '--dur': `${3 + Math.random() * 2}s`,
  }

  return (
    <span
      className="material-symbols-outlined animate-float pointer-events-none absolute text-primary/15 select-none"
      style={{ ...pos, fontSize: size }}
    >
      {icon}
    </span>
  )
}