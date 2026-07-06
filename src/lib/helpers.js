import { isEcommerceClient } from './clientType'

export const MONTH_NAMES = {
  1: 'Január', 2: 'Február', 3: 'Marec', 4: 'Apríl', 5: 'Máj', 6: 'Jún',
  7: 'Júl', 8: 'August', 9: 'September', 10: 'Október', 11: 'November', 12: 'December',
}

export const MONTH_SHORT = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Máj', 6: 'Jún',
  7: 'Júl', 8: 'Aug', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec',
}

// ---------- formátovanie ----------

/** Sumy v EUR — vždy 2 desatinné miesta (investícia, tržby, CPC, CPM, …). */
export function fmtEur(v, digits = 2) {
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
  { id: '3m', label: '3 mesiace' },
  { id: '6m', label: '6 mesiacov' },
  { id: 'ytd', label: 'Tento rok' },
  { id: 'all', label: 'Celé obdobie' },
]

// Rozšírené preset-y pre resolvePeriod (12m, lastyear — nie v UI)
const PRESET_RESOLVE = {
  ...Object.fromEntries(PRESETS.map((p) => [p.id, p.id])),
  '12m': '12m',
  lastyear: 'lastyear',
  custom: 'custom',
}

export const DEFAULT_PRESET = '1m'

export function presetRange(client, presetId) {
  const months = resolvePeriod(client, PRESET_RESOLVE[presetId] ?? presetId, null, null)
  if (!months.length) return null
  return { from: monthKey(months[0]), to: monthKey(months[months.length - 1]) }
}

/** Posun zvoleného rozsahu o rovnaký počet mesiacov dopredu (+1) alebo dozadu (−1). */
export function shiftPeriodRange(client, from, to, direction) {
  const all = client?.months ?? []
  if (!all.length || !from || !to || !direction) return null

  const selected = resolvePeriod(client, 'custom', from, to)
  if (!selected.length) return null

  const span = selected.length
  const startIdx = all.findIndex((m) => monthKey(m) === from)
  if (startIdx < 0) return null

  const newStartIdx = startIdx + direction * span
  if (newStartIdx < 0 || newStartIdx + span > all.length) return null

  return {
    from: monthKey(all[newStartIdx]),
    to: monthKey(all[newStartIdx + span - 1]),
  }
}

export function canShiftPeriodRange(client, from, to, direction) {
  return shiftPeriodRange(client, from, to, direction) != null
}

export function hasEshopTab(client) {
  if (!isEcommerceClient(client)) return false
  return client.months.some((x) => x.eshop)
}

// Ktoré taby má klient k dispozícii podľa dostupných dát
export function clientTabs(client) {
  const m = client.months
  const has = {
    overview: true,
    meta: m.some((x) => x.meta),
    google: m.some((x) => x.google),
    ga: m.some((x) => x.ga),
    eshop: hasEshopTab(client),
    email: m.some((x) => x.email),
  }
  return Object.entries(has).filter(([, ok]) => ok).map(([id]) => id)
}

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
  if (n === 0) return []
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

// % zmena; null keď sa nedá spočítať (predtým 0 a teraz > 0 → použite absChange)
export function pctChange(cur, prev) {
  if (cur == null || prev == null) return null
  if (prev === 0) return cur === 0 ? 0 : null
  return ((cur - prev) / Math.abs(prev)) * 100
}

export function absChange(cur, prev) {
  if (cur == null || prev == null) return null
  return cur - prev
}

// ---------- agregácie ----------

/** Riadky Meta tabuľky — reklamy alebo kampane podľa nastavenia klienta. */
export function campaignRowToAd(item) {
  if (!item) return item
  if (item.campaign) return item
  if (/^Hagard_/i.test(item.name)) {
    return { ...item, campaign: item.name, name: '—' }
  }
  return { ...item, campaign: '—', name: item.name }
}

export function metaBreakdownRows(month, client, mode = 'auto') {
  const meta = month?.meta
  if (!meta) return []
  const wantAds = mode === 'ads' || (mode === 'auto' && client?.metaBreakdown === 'ads')
  if (wantAds) {
    if (meta.ads?.length) return meta.ads
    if (meta.campaigns?.length) return meta.campaigns.map(campaignRowToAd)
    return []
  }
  return meta.campaigns ?? []
}

/** Odvodené metriky po agregácii riadkov Meta. */
export function computeMetaDerived(row) {
  const r = { ...row }
  if (r.roas == null && r.spend > 0 && r.value != null) r.roas = r.value / r.spend
  if (r.costPerPurchase == null && r.purchases > 0 && r.spend != null) r.costPerPurchase = r.spend / r.purchases
  if (r.aov == null && r.purchases > 0 && r.value != null) r.aov = r.value / r.purchases
  if (r.cpm == null && r.impressions > 0 && r.spend != null) r.cpm = (r.spend / r.impressions) * 1000
  if (r.frequency == null && r.reach > 0 && r.impressions != null) r.frequency = r.impressions / r.reach
  if (r.cpc == null && r.clicks > 0 && r.spend != null) r.cpc = r.spend / r.clicks
  if (r.ctr == null && r.impressions > 0 && r.clicks != null) r.ctr = (r.clicks / r.impressions) * 100
  if (r.costPerAddToCart == null && r.addToCart > 0 && r.spend != null) r.costPerAddToCart = r.spend / r.addToCart
  if (r.costPerLandingPageView == null && r.landingPageViews > 0 && r.spend != null) {
    r.costPerLandingPageView = r.spend / r.landingPageViews
  }
  if (r.costPerEngagement == null && r.engagements > 0 && r.spend != null) r.costPerEngagement = r.spend / r.engagements
  return r
}

/** Súčet reklám/kampaní Meta za obdobie (podľa mena, príp. kampaň + reklama). */
export function aggregateMetaBreakdown(months, client, { mode = 'auto' } = {}) {
  const sumKeys = [
    'spend', 'purchases', 'value', 'clicks', 'addToCart', 'impressions', 'reach',
    'landingPageViews', 'engagements', 'saves', 'shares', 'comments',
  ]
  const map = new Map()
  for (const m of months.filter((x) => x.meta)) {
    for (const item of metaBreakdownRows(m, client, mode)) {
      const key = item.campaign ? `${item.campaign}::${item.name}` : item.name
      const prev = map.get(key) ?? {
        name: item.name,
        campaign: item.campaign ?? null,
        months: 0,
      }
      for (const k of sumKeys) {
        if (item[k] == null) continue
        prev[k] = (prev[k] ?? 0) + item[k]
      }
      prev.months += 1
      map.set(key, prev)
    }
  }
  return [...map.values()].map(computeMetaDerived)
}

/** Súhrn Meta reklám podľa kampane (pre tabuľku Kampane). */
export function aggregateMetaCampaignRollup(months, client) {
  const ads = aggregateMetaBreakdown(months, client, { mode: 'ads' })
  if (!ads.length) return []
  const sumKeys = [
    'spend', 'purchases', 'value', 'clicks', 'addToCart', 'impressions', 'reach',
    'landingPageViews', 'engagements', 'saves', 'shares', 'comments', 'months',
  ]
  const map = new Map()
  for (const ad of ads) {
    const campaign = ad.campaign && ad.campaign !== '—' ? ad.campaign : null
    if (!campaign) continue
    const prev = map.get(campaign) ?? { name: campaign, months: 0 }
    for (const k of sumKeys) {
      if (ad[k] == null) continue
      prev[k] = (prev[k] ?? 0) + ad[k]
    }
    map.set(campaign, prev)
  }
  return [...map.values()].map(computeMetaDerived)
}

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
