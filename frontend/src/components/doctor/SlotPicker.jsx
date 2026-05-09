import { useState } from 'react'
import { generateSlots } from '../../utils/generateSlots.js'

export default function SlotPicker({ doctor, onSelect }) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedTime, setSelectedTime] = useState(null)

  const slots = generateSlots(doctor)
  const currentDay = slots[selectedDay]

  const handleSelect = (time) => {
    setSelectedTime(time)
    if (onSelect) {
      onSelect({
        slotDate: currentDay.slotDate,
        slotTime: time,
        displayDate: currentDay.displayDate,
      })
    }
  }

  return (
    <div>
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        {slots.map((slot, idx) => (
          <button
            key={slot.slotDate}
            onClick={() => {
              setSelectedDay(idx)
              setSelectedTime(null)
            }}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all duration-150 ${
              selectedDay === idx
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container-lowest border-outline-variant hover:border-primary/30 text-on-surface-variant'
            }`}
          >
            <span className="text-xs font-semibold capitalize">
              {slot.displayDate.split(' ')[0]}
            </span>
            <span className="text-lg font-bold leading-none mt-0.5">
              {slot.displayDate.split(' ')[1]}
            </span>
            <span className="text-xs mt-0.5 capitalize">
              {slot.displayDate.split(' ').slice(2).join(' ')}
            </span>
          </button>
        ))}
      </div>

      {/* Time slots */}
      {currentDay?.times.length === 0 ? (
        <div className="text-center py-8 text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[32px] text-outline block mb-2">event_busy</span>
          Aucun créneau disponible pour ce jour
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {currentDay?.times.map((time) => (
            <button
              key={time}
              onClick={() => handleSelect(time)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                selectedTime === time
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-lowest border-outline-variant hover:border-primary/30 text-on-surface-variant hover:text-primary'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
