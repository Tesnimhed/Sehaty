/**
 * Format a timestamp or date string to French format
 * e.g., "15 janvier 2025"
 */
export function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Parse slotDate "day_month_year" to a readable date
 * e.g., "15_1_2025" → "15 janvier 2025"
 */
export function formatSlotDate(slotDate) {
  if (!slotDate) return ''
  const [day, month, year] = slotDate.split('_')
  const date = new Date(year, parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format date to "dd_mm_yyyy" for slot storage
 */
export function toSlotDate(date) {
  const d = new Date(date)
  return `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`
}

/**
 * Short date format: "15 jan."
 */
export function formatShortDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
