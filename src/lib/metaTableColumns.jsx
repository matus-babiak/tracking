import { RoasBadge } from '../components/ui'
import { fmtEur, fmtNum, fmtPct, monthKey, monthFull, computeMetaDerived } from './helpers'

function fmtDec(v, digits = 2) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

const METRIC_DEFS = {
  spend: { key: 'spend', label: 'Investícia', align: 'num', sort: (r) => r.spend, render: (r) => fmtEur(r.spend) },
  value: { key: 'value', label: 'Hodnota nákupov', align: 'num', sort: (r) => r.value, render: (r) => fmtEur(r.value) },
  roas: { key: 'roas', label: 'ROAS', align: 'num', sort: (r) => r.roas, render: (r) => <RoasBadge value={r.roas} /> },
  purchases: { key: 'purchases', label: 'Nákupy', align: 'num', sort: (r) => r.purchases, render: (r) => fmtNum(r.purchases) },
  costPerPurchase: { key: 'costPerPurchase', label: 'Cena / nákup', align: 'num', sort: (r) => r.costPerPurchase, render: (r) => fmtEur(r.costPerPurchase, 2) },
  aov: { key: 'aov', label: 'AOV', align: 'num', sort: (r) => r.aov, render: (r) => fmtEur(r.aov, 2) },
  cpm: { key: 'cpm', label: 'CPM', align: 'num', sort: (r) => r.cpm, render: (r) => fmtEur(r.cpm, 2) },
  impressions: { key: 'impressions', label: 'Impresie', align: 'num', sort: (r) => r.impressions, render: (r) => fmtNum(r.impressions) },
  reach: { key: 'reach', label: 'Dosah', align: 'num', sort: (r) => r.reach, render: (r) => fmtNum(r.reach) },
  frequency: { key: 'frequency', label: 'Frekvencia', align: 'num', sort: (r) => r.frequency, render: (r) => fmtDec(r.frequency) },
  clicks: { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (r) => r.clicks, render: (r) => fmtNum(r.clicks) },
  cpc: { key: 'cpc', label: 'CPC', align: 'num', sort: (r) => r.cpc, render: (r) => fmtEur(r.cpc, 2) },
  ctr: { key: 'ctr', label: 'CTR', align: 'num', sort: (r) => r.ctr, render: (r) => fmtPct(r.ctr, 2) },
  addToCart: { key: 'addToCart', label: 'Do košíka', align: 'num', sort: (r) => r.addToCart, render: (r) => fmtNum(r.addToCart) },
  costPerAddToCart: { key: 'costPerAddToCart', label: 'Cena / do košíka', align: 'num', sort: (r) => r.costPerAddToCart, render: (r) => fmtEur(r.costPerAddToCart, 2) },
  landingPageViews: { key: 'landingPageViews', label: 'Návštevy (LPV)', align: 'num', sort: (r) => r.landingPageViews, render: (r) => fmtNum(r.landingPageViews) },
  costPerLandingPageView: { key: 'costPerLandingPageView', label: 'Cena / LPV', align: 'num', sort: (r) => r.costPerLandingPageView, render: (r) => fmtEur(r.costPerLandingPageView, 2) },
  engagements: { key: 'engagements', label: 'Post engagement', align: 'num', sort: (r) => r.engagements, render: (r) => fmtNum(r.engagements) },
  costPerEngagement: { key: 'costPerEngagement', label: 'Cena / interakciu', align: 'num', sort: (r) => r.costPerEngagement, render: (r) => fmtEur(r.costPerEngagement, 2) },
  saves: { key: 'saves', label: 'Uloženia', align: 'num', sort: (r) => r.saves, render: (r) => fmtNum(r.saves) },
  shares: { key: 'shares', label: 'Zdieľania', align: 'num', sort: (r) => r.shares, render: (r) => fmtNum(r.shares) },
  comments: { key: 'comments', label: 'Komentáre', align: 'num', sort: (r) => r.comments, render: (r) => fmtNum(r.comments) },
}

const METRIC_TOTALS = {
  spend: 'sum', value: 'sum', purchases: 'sum', clicks: 'sum', impressions: 'sum', reach: 'sum',
  addToCart: 'sum', landingPageViews: 'sum', engagements: 'sum', saves: 'sum', shares: 'sum', comments: 'sum',
  roas: 'derived', costPerPurchase: 'derived', aov: 'derived', cpm: 'derived', frequency: 'derived',
  cpc: 'derived', ctr: 'derived', costPerAddToCart: 'derived', costPerLandingPageView: 'derived',
  costPerEngagement: 'derived',
}

for (const [key, total] of Object.entries(METRIC_TOTALS)) {
  if (METRIC_DEFS[key]) METRIC_DEFS[key].total = total
}

/** Poradie stĺpcov pre e-shop Meta tabuľky. */
export const META_TABLE_ESHOP_ORDER = [
  'spend', 'value', 'roas', 'purchases', 'costPerPurchase', 'aov',
  'cpm', 'impressions', 'reach', 'frequency', 'clicks', 'cpc', 'ctr',
  'addToCart', 'costPerAddToCart', 'landingPageViews', 'costPerLandingPageView',
  'engagements', 'costPerEngagement', 'saves', 'shares',
]

/** Spoločné + leadgen metriky Meta tabuliek. */
export const META_TABLE_LEADGEN_ORDER = [
  'spend', 'impressions', 'reach', 'frequency', 'cpm', 'clicks', 'cpc', 'ctr',
  'landingPageViews', 'costPerLandingPageView', 'engagements', 'costPerEngagement',
  'saves', 'shares', 'comments',
]

const ID_COLUMNS_ADS = [
  { key: 'campaign', label: 'Kampaň', sticky: true, sort: (r) => r.campaign, render: (r) => r.campaign ?? '–' },
  { key: 'name', label: 'Reklama', sticky: true, sort: (r) => r.name, render: (r) => r.name },
]

const ID_COLUMNS_CAMPAIGNS = [
  { key: 'name', label: 'Kampaň', sticky: true, sort: (r) => r.name, render: (r) => r.name },
]

const MONTH_COLUMN = { key: 'month', label: 'Mesiac', sticky: true, sort: (m) => monthKey(m), render: (m) => monthFull(m) }

function hasMetric(rows, key) {
  return rows.some((r) => r[key] != null)
}

function pickOrderedColumns(rows, order) {
  return order.filter((key) => hasMetric(rows, key) && METRIC_DEFS[key]).map((key) => METRIC_DEFS[key])
}

function metaRowFromMonth(m) {
  if (!m.meta) return null
  return {
    ...m.meta,
    value: m.meta.value ?? m.meta.purchaseValue,
    month: m,
  }
}

function monthMetricSort(key) {
  return (m) => m.meta?.[key]
}

function monthMetricRender(key, render) {
  return (m) => render({ ...m.meta, month: m })
}

function enrichRows(rows) {
  return rows.map(computeMetaDerived)
}

function buildMetricColumns(rows, profile) {
  const order = profile === 'leadgen' ? META_TABLE_LEADGEN_ORDER : META_TABLE_ESHOP_ORDER
  return pickOrderedColumns(rows, order)
}

export function buildMetaBreakdownColumns(rows, { profile = 'eshop', useAds = false, showMonths = true } = {}) {
  const data = enrichRows(rows)
  const idCols = useAds ? ID_COLUMNS_ADS : ID_COLUMNS_CAMPAIGNS
  const metrics = buildMetricColumns(data, profile)
  const tail = showMonths && hasMetric(data, 'months')
    ? [{ key: 'months', label: 'Aktívna (mes.)', align: 'num', total: 'sum', sort: (r) => r.months, render: (r) => r.months }]
    : []
  return [...idCols, ...metrics, ...tail]
}

export function buildMetaMonthColumns(monthRows, { profile = 'eshop' } = {}) {
  const data = enrichRows(monthRows.map(metaRowFromMonth).filter(Boolean))
  const metricDefs = buildMetricColumns(data, profile)
  const monthCols = metricDefs.map((col) => ({
    ...col,
    sort: monthMetricSort(col.key),
    render: monthMetricRender(col.key, (r) => col.render(r)),
  }))
  return [MONTH_COLUMN, ...monthCols]
}
