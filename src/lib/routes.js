import clients from '../data'

export const IMPORT_OVERVIEW_SLUG = 'prehlady'
export const GUIDES_SLUG = 'navody'

const SUPERADMIN_SLUGS = new Set([IMPORT_OVERVIEW_SLUG, GUIDES_SLUG])

export function isSuperAdminRoute(slug) {
  return SUPERADMIN_SLUGS.has(slug)
}

export function isImportOverviewSlug(slug) {
  return slug === IMPORT_OVERVIEW_SLUG
}

export function isGuidesSlug(slug) {
  return slug === GUIDES_SLUG
}

export function clientBySlug(slug) {
  if (isSuperAdminRoute(slug)) return null
  return clients.find((c) => c.id === slug) ?? null
}

export function isValidClientSlug(slug) {
  return Boolean(clientBySlug(slug))
}
