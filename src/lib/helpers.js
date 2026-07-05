export const MONTH_NAMES = {
  1: 'Január', 2: 'Február', 3: 'Marec', 4: 'Apríl', 5: 'Máj', 6: 'Jún',
  7: 'Júl', 8: 'August', 9: 'September', 10: 'Október', 11: 'November', 12: 'December',
}

export const MONTH_SHORT = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Máj', 6: 'Jún',
  7: 'Júl', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec',
}

// ---------- formátovanie ----------

export function fmtEur(v, digits = 0) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits }) + ' €'
}

export function fmtNum(v) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK')
}

export function fmtPct(v, digits = 1) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits }) + ' %'
}

export function fmtRoas(v) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { maximumFractionDigits: 2 })
}

// ---------- mesiace a obdobia ----------

export function monthKey(m) {
  return m.year * 100 + m.month
}

// „Feb 25" — krátky label mesiaca s rokom pre osi grafov
export function monthLabel(m) {
  return `${MONTH_SHORT[m.month]} ${String(m.year).slice(2)}`
}

// „Február 2025" — plný label pre selecty a tabuľky
export function monthFull(m) {
  return `${MONTH_NAMES[m.month]} ${m.year}`
}

// „Feb – Máj 2026" / „Nov 2025 – Feb 2026"
export function rangeLabel(months) {
  if (!months.length) return '–'
  const a = months[0]
  const b = months[months.length - 1]
  if (a === b || (a.year === b.year && a.month === b.month)) return monthFull(a)
  if (a.year === b.year) return `${MONTH_SHORT[a.month]} – ${MONTH_SHORT[b.month]} ${a.year}`
  return `${monthLabel(a)} – ${monthLabel(b)}`
}

export const PRESETS = [
  { id: '1m', label: 'Posledný mesiac' },
  { id: '3m', label: 'Posledné 3 mesiace' },
  { id: '6m', label: 'Posledných 6 mesiacov' },
  { id: '12m', label: 'Posledných 12 mesiacov' },
  { id: 'ytd', label: 'Tento rok' },
  { id: 'lastyear', label: 'Minulý rok' },
  { id: 'all', label: 'Celé obdobie' },
  { id: 'custom', label: 'Vlastné obdobie' },
]

export const COMPARE_MODES = [
  { id: 'none', label: 'Bez porovnania' },
  { id: 'prev', label: 'Predchádzajúce obdobie' },
  { id: 'yoy', label: 'Rovnaké obdobie vlani' },
]

// Vráti pole mesiacov klienta pre daný preset.
// customFrom/customTo sú monthKey hodnoty pre preset 'custom'.
export function resolvePeriod(client, preset, customFrom, customTo) {
  const all = client.months
  const n = all.length
  const lastN = (k) => all.slice(Math.max(0, n - k))
  switch (preset) {
    case '1m': return lastN(1)
    case '3m': return lastN(3)
    case '6m': return lastN(6)
    case '12m': return lastN(12)
    case 'ytd': {
      const y = all[n - 1].year
      return all.filter((m) => m.year === y)
    }
    case 'lastyear': {
      const y = all[n - 1].year - 1
      const r = all.filter((m) => m.year === y)
      return r.length ? r : all
    }
    case 'custom': {
      const from = customFrom ?? monthKey(all[0])
      const to = customTo ?? monthKey(all[n - 1])
      return all.filter((m) => monthKey(m) >= from && monthKey(m) <= to)
    }
    default: return all
  }
}

// Porovnávacie obdobie. Vracia { months, label } alebo null.
export function resolveCompare(client, selected, mode) {
  if (mode === 'none' || selected.length === 0) return null
  const all = client.months
  if (mode === 'prev') {
    const firstIdx = all.indexOf(selected[0])
    const len = selected.length
    const from = firstIdx - len
    if (firstIdx <= 0) return null
    const months = all.slice(Math.max(0, from), firstIdx)
    return months.length ? { months, label: rangeLabel(months) } : null
  }
  if (mode === 'yoy') {
    const wanted = new Set(selected.map((m) => (m.year - 1) * 100 + m.month))
    const months = all.filter((m) => wanted.has(monthKey(m)))
    return months.length ? { months, label: rangeLabel(months) } : null
  }
  return null
}

// % zmena; null keď sa nedá spočítať
export function pctChange(cur, prev) {
  if (cur == null || prev == null || prev === 0) return null
  return ((cur - prev) / Math.abs(prev)) * 100
}

// ---------- agregácie ----------

// súčet s ignorovaním null; vráti null ak nie je žiadna hodnota
export function sum(rows, get) {
  let total = null
  for (const r of rows) {
    const v = get(r)
    if (v != null) total = (total ?? 0) + v
  }
  return total
}

// agregát Meta + Google + boosting + e-shop za obdobie
export function aggregate(months) {
  const metaSpend = sum(months, (m) => m.meta?.spend)
  const metaValue = sum(months, (m) => m.meta?.purchaseValue)
  const metaPurchases = sum(months, (m) => m.meta?.purchases)
  const boostSpend = sum(months, (m) => m.boosting?.spend)
  const boostValue = sum(months, (m) => m.boosting?.value)
  const boostPurchases = sum(months, (m) => m.boosting?.purchases)
  const googleSpend = sum(months, (m) => m.google?.spend)
  const googleValue = sum(months, (m) => m.google?.purchaseValue)
  const googlePurchases = sum(months, (m) => m.google?.purchases)
  const emailRevenue = sum(months, (m) => m.email?.revenue)
  const emailOrders = sum(months, (m) => m.email?.orders)
  const eshopRevenue = sum(months, (m) => m.eshop?.revenue)

  const adSpend = (metaSpend ?? 0) + (googleSpend ?? 0) + (boostSpend ?? 0)
  const adValue = (metaValue ?? 0) + (googleValue ?? 0) + (boostValue ?? 0)

  return {
    metaSpend, metaValue, metaPurchases,
    googleSpend, googleValue, googlePurchases,
    boostSpend, boostValue, boostPurchases,
    emailRevenue, emailOrders,
    eshopRevenue,
    adSpend,
    adValue,
    adPurchases: (metaPurchases ?? 0) + (googlePurchases ?? 0) + (boostPurchases ?? 0),
    roas: adSpend > 0 ? adValue / adSpend : null,
    pno: adValue > 0 ? (adSpend / adValue) * 100 : null,
    adShareOfRevenue: eshopRevenue > 0 ? (adValue / eshopRevenue) * 100 : null,
  }
}
