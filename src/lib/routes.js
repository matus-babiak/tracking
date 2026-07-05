import clients from '../data'

export const IMPORT_OVERVIEW_SLUG = 'prehlady'

export function isImportOverviewSlug(slug) {
  return slug === IMPORT_OVERVIEW_SLUG
}

export function clientBySlug(slug) {
  if (isImportOverviewSlug(slug)) return null
  return clients.find((c) => c.id === slug) ?? null
}

export function isValidClientSlug(slug) {
  return Boolean(clientBySlug(slug))
}
