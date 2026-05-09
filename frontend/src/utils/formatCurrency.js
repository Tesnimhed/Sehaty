/**
 * Format a number as DZD currency
 * e.g., 2500 → "2 500 DZD"
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '— DZD'
  return (
    new Intl.NumberFormat('fr-DZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' DZD'
  )
}
