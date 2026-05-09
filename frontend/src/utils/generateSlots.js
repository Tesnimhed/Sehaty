/**
 * Generate available appointment slots for a doctor
 * Returns 7 days, each with available time slots
 * Excludes slots already booked in doctor.slots_booked
 */
export function generateSlots(doctor) {
  const slots = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const slotDate = `${day}_${month}_${year}`

    const bookedForDay = doctor?.slots_booked?.[slotDate] || []

    const daySlots = []

    // Morning: 9:00 to 13:00 every 30 min
    for (let hour = 9; hour < 13; hour++) {
      for (let min of [0, 30]) {
        const time = `${hour}:${min === 0 ? '00' : min}`
        if (!bookedForDay.includes(time)) {
          daySlots.push(time)
        }
      }
    }

    // Afternoon: 14:00 to 18:00 every 30 min
    for (let hour = 14; hour < 18; hour++) {
      for (let min of [0, 30]) {
        const time = `${hour}:${min === 0 ? '00' : min}`
        if (!bookedForDay.includes(time)) {
          daySlots.push(time)
        }
      }
    }

    slots.push({
      date,
      slotDate,
      displayDate: date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      times: daySlots,
    })
  }

  return slots
}
