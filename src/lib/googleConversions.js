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

export function getGoogleConvKeys(client) {
  return client?.googleConversionKeys ?? null
}
