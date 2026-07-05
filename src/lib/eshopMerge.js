/** WooCommerce duplicitné kategórie (rôzne vetvy stromu) — zlúčiť podľa názvu. */
const CATEGORY_ALIASES = new Map([
  ['insekticídy', 'Insekcitídy'],
])

export function normalizeCategoryName(name) {
  const n = String(name ?? '').normalize('NFC').trim()
  return CATEGORY_ALIASES.get(n.toLowerCase()) ?? n
}

export function mergeCategoryRows(rows = []) {
  const map = new Map()
  for (const row of rows) {
    const key = normalizeCategoryName(row.name)
    const cur = map.get(key) || { name: key, items: 0, netRevenue: 0 }
    cur.items += row.items ?? 0
    cur.netRevenue = Math.round(((cur.netRevenue + (row.netRevenue ?? 0)) + Number.EPSILON) * 100) / 100
    map.set(key, cur)
  }
  return [...map.values()].sort((a, b) => (b.items ?? 0) - (a.items ?? 0))
}

export function normalizeProductName(name) {
  return String(name ?? '').normalize('NFC').trim()
}

/** Produkty — rovnaký názov sčítať (SKU môže byť iné medzi starým/novým e-shopom). */
export function mergeProductRows(rows = []) {
  const map = new Map()
  for (const row of rows) {
    const key = normalizeProductName(row.name)
    const cur = map.get(key) || {
      name: key,
      sku: row.sku || undefined,
      items: 0,
      netRevenue: 0,
      orders: 0,
      variants: 0,
    }
    cur.items += row.items ?? 0
    cur.netRevenue = Math.round(((cur.netRevenue + (row.netRevenue ?? 0)) + Number.EPSILON) * 100) / 100
    cur.orders += row.orders ?? 0
    cur.variants += row.variants ?? 0
    if (!cur.sku && row.sku) cur.sku = row.sku
    map.set(key, cur)
  }
  return [...map.values()].sort((a, b) => (b.items ?? 0) - (a.items ?? 0))
}
