import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate()

  return (
    <div
      className="bg-surface-container-lowest p-6 rounded-2xl shadow-md border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/medecins/${doctor._id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-fixed ring-4 ring-primary/5 flex-shrink-0">
          {doctor.image ? (
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-outline">person</span>
            </div>
          )}
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            doctor.available
              ? 'bg-green-100 text-green-700'
              : 'bg-surface-variant text-on-surface-variant'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              doctor.available ? 'bg-green-500' : 'bg-outline'
            }`}
          />
          {doctor.available ? 'Disponible' : 'Indisponible'}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-on-surface">{doctor.name}</h3>
      <p className="text-primary text-sm font-semibold mb-3">{doctor.speciality}</p>

      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
        <span className="material-symbols-outlined text-[16px]">school</span>
        <span>{doctor.degree}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
        <span className="material-symbols-outlined text-[16px]">payments</span>
        <span>
          Honoraires :{' '}
          <span className="font-semibold text-on-surface">
            {formatCurrency(doctor.fees)}
          </span>
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/medecins/${doctor._id}`)
        }}
        className="w-full h-10 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 duration-150"
      >
        Prendre RDV
      </button>
    </div>
  )
}
