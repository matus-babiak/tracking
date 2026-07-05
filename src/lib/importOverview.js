import { monthKey, MONTH_SHORT } from './helpers'

export const IMPORT_SOURCES = [
  { key: 'meta', label: 'Meta', short: 'M' },
  { key: 'google', label: 'Google Ads', short: 'G' },
  { key: 'ga', label: 'GA4', short: 'A' },
  { key: 'eshop', label: 'E-shop', short: 'E' },
  { key: 'email', label: 'Email', short: 'Em' },
]

export function importColumnLabel(key, { withYear = true } = {}) {
  const month = key % 100
  const y = Math.floor(key / 100)
  if (!withYear) return MONTH_SHORT[month]
  return `${MONTH_SHORT[month]} ${String(y).slice(2)}`
}

export function getImportYears(allClients) {
  const years = new Set()
  for (const client of allClients) {
    for (const month of client.months) {
      years.add(month.year)
    }
  }
  return [...years].sort((a, b) => a - b)
}

function yearMonthKeys(year) {
  return Array.from({ length: 12 }, (_, i) => year * 100 + (i + 1))
}

export function getMonthSources(month) {
  return IMPORT_SOURCES.filter((s) => month[s.key] != null).map((s) => s.key)
}

export function buildImportMatrix(allClients, year) {
  const columns = yearMonthKeys(year)
  const rows = allClients.map((client) => {
    const byKey = new Map(client.months.map((m) => [monthKey(m), m]))
    const cells = columns.map((key) => {
      const month = byKey.get(key) ?? null
      return {
        key,
        imported: Boolean(month),
        sources: month ? getMonthSources(month) : [],
      }
    })
    const imported = cells.filter((c) => c.imported).length
    return { client, cells, imported, total: columns.length }
  })

  return { columns, rows, year }
}
