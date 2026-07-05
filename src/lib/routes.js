import clients from '../data'

export function clientBySlug(slug) {
  return clients.find((c) => c.id === slug) ?? null
}

export function isValidClientSlug(slug) {
  return Boolean(clientBySlug(slug))
}
