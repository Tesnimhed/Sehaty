/**
 * Generate available appointment slots for a doctor
 * Returns 7 days, each with available time slots
 * Excludes slots already booked in doctor.slots_booked
 * Excludes past time slots for today
 */
export function generateSlots(doctor) {
  const slots = []
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  for (let i = 0; i < 7; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() + i)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const slotDate = `${day}_${month}_${year}`

    const bookedForDay = doctor?.slots_booked?.[slotDate] || []
    const isToday = i === 0

    const daySlots = []

    // Morning: 9:00 to 13:00 every 30 min
    for (let hour = 9; hour < 13; hour++) {
      for (let min of [0, 30]) {
        // Skip past slots for today (add 30min buffer)
        if (isToday) {
          const slotTotalMin = hour * 60 + min
          const nowTotalMin = currentHour * 60 + currentMinute + 30
          if (slotTotalMin <= nowTotalMin) continue
        }
        const time = `${hour}:${min === 0 ? '00' : min}`
        if (!bookedForDay.includes(time)) {
          daySlots.push(time)
        }
      }
    }

    // Afternoon: 14:00 to 18:00 every 30 min
    for (let hour = 14; hour < 18; hour++) {
      for (let min of [0, 30]) {
        if (isToday) {
          const slotTotalMin = hour * 60 + min
          const nowTotalMin = currentHour * 60 + currentMinute + 30
          if (slotTotalMin <= nowTotalMin) continue
        }
        const time = `${hour}:${min === 0 ? '00' : min}`
        if (!bookedForDay.includes(time)) {
          daySlots.push(time)
        }
      }
    }

    // Skip today entirely if no slots left
    if (isToday && daySlots.length === 0) continue

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