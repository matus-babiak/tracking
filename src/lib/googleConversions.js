/** E-shop Google konverzie — iba tieto 3 sa počítajú a zobrazujú. */
export const ESHOP_GOOGLE_CONV_KEYS = ['add_to_cart', 'begin_checkout', 'purchase']

export const ESHOP_GOOGLE_CONV_LABELS = {
  add_to_cart: 'Pridanie do košíka',
  begin_checkout: 'Začatie checkoutu',
  purchase: 'Nákup',
}

export function normalizeGoogleConvAction(raw) {
  if (!raw || raw === '--' || raw === ' --') return null
  const s = raw.trim().toLowerCase()
  return ESHOP_GOOGLE_CONV_KEYS.includes(s) ? s : null
}

export function pickConversionActions(all = {}) {
  const out = {}
  for (const key of ESHOP_GOOGLE_CONV_KEYS) {
    const v = all[key]
    if (v != null && v > 0) out[key] = v
  }
  return out
}

export function sumTrackedConversions(conversionActions, keys = ESHOP_GOOGLE_CONV_KEYS) {
  if (!conversionActions) return 0
  return keys.reduce((s, k) => s + (conversionActions[k] ?? 0), 0)
}

/** Konverzie mesiaca — vždy súčet sledovaných akcií, nie Google „všetky konverzie“. */
export function monthTrackedConversions(google, keys = ESHOP_GOOGLE_CONV_KEYS) {
  if (!google) return 0
  if (keys?.length && google.conversionActions) {
    return sumTrackedConversions(google.conversionActions, keys)
  }
  return google.conversions ?? google.purchases ?? 0
}

export function monthTrackedCostPerConv(google, keys = ESHOP_GOOGLE_CONV_KEYS) {
  const conv = monthTrackedConversions(google, keys)
  return conv > 0 && google?.spend != null ? google.spend / conv : null
}

export function sumGoogleConvAction(months, key) {
  return months
    .filter((m) => m.google)
    .reduce((s, m) => s + (m.google.conversionActions?.[key] ?? 0), 0)
}

export function sumGoogleTrackedConversions(months, keys = ESHOP_GOOGLE_CONV_KEYS) {
  return months
    .filter((m) => m.google)
    .reduce((s, m) => s + monthTrackedConversions(m.google, keys), 0)
}

export function getGoogleConvKeys(client) {
  return client?.googleConversionKeys ?? null
}
