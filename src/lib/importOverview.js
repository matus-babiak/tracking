import { monthKey, MONTH_SHORT } from './helpers'
import { isGa4ExportMonth } from './ga4Report'
import { isEcommerceClient } from './clientType'

export const IMPORT_SOURCES = [
  { key: 'meta', label: 'Meta Ads', short: 'M' },
  { key: 'google', label: 'Google Ads', short: 'G' },
  { key: 'gaLegacy', label: 'GA4 z PDF (staré)', short: 'A', variant: 'legacy' },
  { key: 'gaExport', label: 'GA4 CSV export (nové)', short: 'A', variant: 'export' },
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

export function getGaImportTier(month) {
  if (!month?.ga) return null
  return isGa4ExportMonth(month) ? 'export' : 'legacy'
}

export function getExpectedSources(client) {
  const keys = ['meta', 'google']
  if (isEcommerceClient(client)) keys.push('eshop')
  return keys
}

export function getMonthImportSources(month) {
  if (!month) return []
  const sources = []
  if (month.meta != null) sources.push('meta')
  if (month.google != null) sources.push('google')
  if (month.eshop != null) sources.push('eshop')
  if (month.email != null) sources.push('email')
  const gaTier = getGaImportTier(month)
  if (gaTier === 'export') sources.push('gaExport')
  else if (gaTier === 'legacy') sources.push('gaLegacy')
  return sources
}

/** @deprecated use getMonthImportSources */
export function getMonthSources(month) {
  return getMonthImportSources(month)
}

export function isMonthComplete(month, client) {
  if (!month) return false
  const expected = getExpectedSources(client)
  if (!expected.every((k) => month[k] != null)) return false
  return month.ga != null
}

export function buildMonthImportCell(month, client) {
  if (!month) {
    return {
      key: null,
      imported: false,
      sources: [],
      gaTier: null,
      complete: false,
      missing: getExpectedSources(client),
    }
  }

  const sources = getMonthImportSources(month)
  const expected = getExpectedSources(client)
  const missing = expected.filter((k) => month[k] == null)
  if (!month.ga) missing.push('ga')

  return {
    key: monthKey(month),
    imported: true,
    sources,
    gaTier: getGaImportTier(month),
    complete: isMonthComplete(month, client),
    missing,
  }
}

export function importCellTitle(cell) {
  if (!cell.imported) return 'Mesiac bez dát'
  const labels = cell.sources
    .map((k) => IMPORT_SOURCES.find((s) => s.key === k)?.label)
    .filter(Boolean)
  const parts = [`Importované: ${labels.join(', ')}`]
  if (cell.gaTier === 'legacy') parts.push('GA4: staré dáta z PDF (platená vs. organická)')
  if (cell.gaTier === 'export') parts.push('GA4: nový CSV export (traffic, landing, e-commerce/udalosti)')
  if (cell.missing?.length) {
    parts.push(`Chýba: ${cell.missing.map((k) => {
      if (k === 'ga') return 'GA4'
      return IMPORT_SOURCES.find((s) => s.key === k)?.label ?? k
    }).join(', ')}`)
  }
  return parts.join(' · ')
}

export function buildImportMatrix(allClients, year) {
  const columns = yearMonthKeys(year)
  const rows = allClients.map((client) => {
    const byKey = new Map(client.months.map((m) => [monthKey(m), m]))
    const cells = columns.map((key) => {
      const month = byKey.get(key) ?? null
      return { ...buildMonthImportCell(month, client), key }
    })
    const imported = cells.filter((c) => c.imported).length
    const complete = cells.filter((c) => c.complete).length
    const gaExport = cells.filter((c) => c.gaTier === 'export').length
    const gaLegacy = cells.filter((c) => c.gaTier === 'legacy').length
    return { client, cells, imported, complete, gaExport, gaLegacy, total: columns.length }
  })

  const totals = {
    imported: rows.reduce((sum, r) => sum + r.imported, 0),
    complete: rows.reduce((sum, r) => sum + r.complete, 0),
    gaExport: rows.reduce((sum, r) => sum + r.gaExport, 0),
    gaLegacy: rows.reduce((sum, r) => sum + r.gaLegacy, 0),
    cells: rows.reduce((sum, r) => sum + r.total, 0),
  }

  return { columns, rows, year, totals }
}
