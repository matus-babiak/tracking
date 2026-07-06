/** E-commerce klienti — metriky nákupov, ROAS, tržby, GA4 e-commerce, tab E-shop. */
export const ECOMMERCE_CLIENT_IDS = new Set([
  'kava-dante',
  'sanaplant',
  'hagard-hal',
])

export function getClientBusinessType(client) {
  if (!client) return 'services'
  if (client.businessType === 'ecommerce' || client.businessType === 'services') {
    return client.businessType
  }
  return ECOMMERCE_CLIENT_IDS.has(client.id) ? 'ecommerce' : 'services'
}

export function isEcommerceClient(client) {
  return getClientBusinessType(client) === 'ecommerce'
}

export function isServicesClient(client) {
  return getClientBusinessType(client) === 'services'
}

export const BUSINESS_TYPE_LABELS = {
  ecommerce: 'E-commerce (nákupy, ROAS, tržby)',
  services: 'Služby (leady, návštevy, engagement)',
}

export function getClientBusinessTypeLabel(client) {
  return BUSINESS_TYPE_LABELS[getClientBusinessType(client)]
}
