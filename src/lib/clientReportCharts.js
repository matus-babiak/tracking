import { monthLabel, sum } from './helpers'
import { mergeCategoryRows } from './eshopMerge'
import {
  aggregateGaChannels,
  ga4ExportMonths,
  legacyGaMonths,
} from './ga4Report'

const PIE_COLORS = ['#1877F2', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b', '#06b6d4', '#ec4899']

const AD_PLATFORM_COLORS = {
  meta: '#1877F2',
  google: '#f59e0b',
  boosting: '#94a3b8',
}

function barChart({ title, height = 220, series, data }) {
  if (!data?.length || !series?.length) return null
  return { type: 'bar', title, height, series, data }
}

function lineChart({ title, height = 200, series, data, unit }) {
  if (!data?.length || !series?.length) return null
  return { type: 'line', title, height, series, data, unit }
}

function pieChart({ title, height = 210, data, eur = false }) {
  const slices = (data ?? []).filter((d) => (d.value ?? 0) > 0)
  if (slices.length < 2) return null
  return { type: 'pie', title, height, data: slices, eur }
}

function topPieSlices(items, valueKey, { max = 5, otherLabel = 'Ostatné' } = {}) {
  const sorted = [...items]
    .filter((i) => (i[valueKey] ?? 0) > 0)
    .sort((a, b) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0))
  if (!sorted.length) return null

  const top = sorted.slice(0, max)
  const restSum = sorted.slice(max).reduce((s, i) => s + (i[valueKey] ?? 0), 0)
  const data = top.map((item, i) => ({
    name: item.name,
    value: item[valueKey],
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))
  if (restSum > 0) {
    data.push({ name: otherLabel, value: restSum, color: PIE_COLORS[5] })
  }
  return data.length >= 2 ? data : null
}

function aggregateMetaCampaigns(months) {
  const map = new Map()
  for (const m of months) {
    for (const c of m.meta?.campaigns ?? []) {
      const prev = map.get(c.name) ?? { name: c.name, spend: 0, value: 0 }
      prev.spend += c.spend ?? 0
      prev.value += c.value ?? c.purchaseValue ?? 0
      map.set(c.name, prev)
    }
  }
  return [...map.values()]
}

function aggregateGoogleCampaigns(months) {
  const map = new Map()
  for (const m of months) {
    for (const c of m.google?.campaigns ?? []) {
      const prev = map.get(c.name) ?? { name: c.name, spend: 0, value: 0 }
      prev.spend += c.spend ?? 0
      prev.value += c.value ?? c.purchaseValue ?? 0
      map.set(c.name, prev)
    }
  }
  return [...map.values()]
}

function aggregateCategories(months) {
  return mergeCategoryRows(months.flatMap((m) => m.eshop?.categories ?? []))
}

export function buildMetaCharts(months, { isEshop = false } = {}) {
  const charts = []
  const rows = months.filter((m) => m.meta?.spend != null)

  if (rows.length) {
    charts.push(barChart({
      title: isEshop ? 'Investícia a hodnota nákupov mesačne' : 'Investícia a kliknutia mesačne',
      series: isEshop
        ? [
          { key: 'spend', name: 'Investícia', color: '#94a3b8', eur: true },
          { key: 'value', name: 'Hodnota nákupov', color: '#1877F2', eur: true },
        ]
        : [
          { key: 'spend', name: 'Investícia', color: '#94a3b8', eur: true },
          { key: 'clicks', name: 'Kliknutia', color: '#1877F2' },
        ],
      data: rows.map((m) => ({
        label: monthLabel(m),
        spend: m.meta.spend,
        value: m.meta.purchaseValue ?? 0,
        clicks: m.meta.clicks ?? 0,
      })),
    }))
  }

  const campaigns = aggregateMetaCampaigns(months)
  const pieData = topPieSlices(campaigns, isEshop ? 'value' : 'spend')
  if (pieData) {
    charts.push(pieChart({
      title: isEshop ? 'Podiel kampaní podľa tržieb' : 'Podiel kampaní podľa investície',
      height: 220,
      data: pieData,
      eur: isEshop,
    }))
  }

  return charts.filter(Boolean)
}

export function buildGoogleCharts(months, { isEshop = false } = {}) {
  const charts = []
  const rows = months.filter((m) => m.google?.spend != null)

  if (rows.length) {
    if (isEshop) {
      charts.push({
        type: 'spendRoas',
        title: 'Investícia, tržby a ROAS mesačne',
        height: 230,
        data: rows.map((m) => ({
          label: monthLabel(m),
          spend: m.google.spend,
          value: m.google.purchaseValue ?? 0,
          roas: m.google.spend > 0 ? (m.google.purchaseValue ?? 0) / m.google.spend : null,
        })),
      })
    } else {
      charts.push(barChart({
        title: 'Investícia a kliknutia mesačne',
        series: [
          { key: 'spend', name: 'Investícia', color: '#94a3b8', eur: true },
          { key: 'clicks', name: 'Kliknutia', color: '#4285F4' },
        ],
        data: rows.map((m) => ({
          label: monthLabel(m),
          spend: m.google.spend,
          clicks: m.google.clicks ?? 0,
        })),
      }))
    }
  }

  const campaigns = aggregateGoogleCampaigns(months)
  const pieData = topPieSlices(campaigns, isEshop ? 'value' : 'spend')
  if (pieData) {
    charts.push(pieChart({
      title: isEshop ? 'Podiel kampaní podľa tržieb' : 'Podiel kampaní podľa investície',
      height: 220,
      data: pieData,
      eur: isEshop,
    }))
  }

  return charts.filter(Boolean)
}

export function buildGaCharts(months) {
  const charts = []
  const ga4Rows = ga4ExportMonths(months)
  const legacyRows = legacyGaMonths(months)

  if (ga4Rows.length > 1) {
    const snapshotData = ga4Rows
      .filter((m) => m.ga?.snapshot)
      .map((m) => ({
        label: monthLabel(m),
        sessions: m.ga.snapshot.sessions ?? 0,
        revenue: m.ga.snapshot.totalRevenue ?? 0,
      }))
    if (snapshotData.length > 1) {
      charts.push(lineChart({
        title: 'Relácie mesačne (GA4)',
        series: [{ key: 'sessions', name: 'Relácie', color: '#4285f4' }],
        data: snapshotData,
      }))
      if (snapshotData.some((d) => d.revenue > 0)) {
        charts.push(barChart({
          title: 'Tržby mesačne (GA4)',
          series: [{ key: 'revenue', name: 'Tržby', color: '#8b5cf6', eur: true }],
          data: snapshotData,
        }))
      }
    }
  }

  if (ga4Rows.length) {
    const ranked = aggregateGaChannels(months).slice(0, 8)
    if (ranked.length) {
      charts.push(barChart({
        title: ga4Rows.length > 1 ? 'Relácie podľa kanála (GA4)' : 'Relácie podľa kanála',
        series: [{ key: 'sessions', name: 'Relácie', color: '#4285f4' }],
        data: ranked.map((c) => ({ label: c.name, sessions: c.sessions })),
      }))
      const withRevenue = ranked.filter((c) => c.revenue > 0)
      if (withRevenue.length > 1) {
        charts.push(pieChart({
          title: 'Tržby podľa kanála (GA4)',
          data: withRevenue.map((c, i) => ({
            name: c.name,
            value: c.revenue,
            color: PIE_COLORS[i % PIE_COLORS.length],
          })),
          eur: true,
        }))
      }
    }
  }

  if (legacyRows.length && !ga4Rows.length) {
    charts.push(barChart({
      title: legacyRows.length > 1 ? 'Návštevnosť webu mesačne' : 'Návštevnosť webu',
      series: [
        { key: 'organic', name: 'Organická', color: '#10b981' },
        { key: 'paid', name: 'Platená', color: '#f59e0b' },
      ],
      data: legacyRows.map((m) => ({
        label: monthLabel(m),
        paid: m.ga?.paid?.sessions ?? 0,
        organic: m.ga?.organic?.sessions ?? 0,
      })),
    }))

    const paid = sum(legacyRows, (m) => m.ga?.paid?.sessions ?? 0)
    const organic = sum(legacyRows, (m) => m.ga?.organic?.sessions ?? 0)
    if (paid > 0 && organic > 0) {
      charts.push(pieChart({
        title: 'Podiel návštevnosti za obdobie',
        data: [
          { name: 'Organická', value: organic, color: '#10b981' },
          { name: 'Platená', value: paid, color: '#f59e0b' },
        ],
      }))
    }
  }

  return charts.filter(Boolean).slice(0, 2)
}

export function buildEmailCharts(months) {
  const charts = []
  const revenueRows = months.filter((m) => m.email?.revenue != null)
  const openRows = months.filter((m) => m.email?.openRate != null)

  if (revenueRows.length) {
    charts.push(barChart({
      title: 'Tržby z e-mailov mesačne',
      height: 200,
      series: [{ key: 'revenue', name: 'Tržby', color: '#8b5cf6', eur: true }],
      data: revenueRows.map((m) => ({
        label: monthLabel(m),
        revenue: m.email.revenue ?? 0,
      })),
    }))
  }

  if (openRows.length) {
    charts.push(lineChart({
      title: 'Open rate mesačne',
      height: 200,
      unit: '%',
      series: [{ key: 'openRate', name: 'Open rate', color: '#8b5cf6' }],
      data: openRows.map((m) => ({
        label: monthLabel(m),
        openRate: m.email.openRate ?? 0,
      })),
    }))
  }

  return charts.filter(Boolean)
}

export function buildEshopCharts(months) {
  const charts = []
  const rows = months.filter((m) => m.eshop?.netRevenue != null || m.eshop?.revenue != null)

  if (rows.length) {
    charts.push(barChart({
      title: 'Čisté predaje a objednávky mesačne',
      series: [
        { key: 'netRevenue', name: 'Čisté predaje', color: '#10b981', eur: true },
        { key: 'orders', name: 'Objednávky', color: '#6366f1' },
      ],
      data: rows.map((m) => ({
        label: monthLabel(m),
        netRevenue: m.eshop.netRevenue ?? m.eshop.revenue ?? 0,
        orders: m.eshop.orders ?? 0,
      })),
    }))
  }

  const categories = aggregateCategories(months)
  const pieData = topPieSlices(categories, 'netRevenue', { max: 6 })
  if (pieData) {
    charts.push(pieChart({
      title: 'Predaje podľa kategórií',
      height: 230,
      data: pieData,
      eur: true,
    }))
  }

  return charts.filter(Boolean)
}

export function buildOverviewCharts(months, agg) {
  const charts = []

  const metaSpend = sum(months.filter((m) => m.meta), (m) => m.meta.spend ?? 0)
  const googleSpend = sum(months.filter((m) => m.google), (m) => m.google.spend ?? 0)
  const boostSpend = sum(months.filter((m) => m.boosting), (m) => m.boosting?.spend ?? 0)

  const spendSlices = [
    metaSpend > 0 ? { name: 'Meta Ads', value: metaSpend, color: AD_PLATFORM_COLORS.meta } : null,
    googleSpend > 0 ? { name: 'Google Ads', value: googleSpend, color: AD_PLATFORM_COLORS.google } : null,
    boostSpend > 0 ? { name: 'Boosting', value: boostSpend, color: AD_PLATFORM_COLORS.boosting } : null,
  ].filter(Boolean)

  if (spendSlices.length >= 2) {
    charts.push(pieChart({
      title: 'Rozdelenie investície do reklám',
      height: 220,
      data: spendSlices,
      eur: true,
    }))
  }

  const adRows = months.filter((m) => m.meta?.spend != null || m.google?.spend != null)
  const eshopRows = months.filter((m) => m.eshop?.netRevenue != null || m.eshop?.revenue != null)

  if (adRows.length || eshopRows.length) {
    const keys = [...new Set([
      ...adRows.map((m) => `${m.year}-${m.month}`),
      ...eshopRows.map((m) => `${m.year}-${m.month}`),
    ])].sort()

    const byKey = Object.fromEntries(months.map((m) => [`${m.year}-${m.month}`, m]))

    charts.push(barChart({
      title: 'Reklama vs. e-shop mesačne',
      height: 230,
      series: [
        { key: 'adSpend', name: 'Investícia reklamy', color: '#94a3b8', eur: true },
        { key: 'netRevenue', name: 'Čisté predaje e-shop', color: '#10b981', eur: true },
      ],
      data: keys.map((key) => {
        const m = byKey[key]
        return {
          label: monthLabel(m),
          adSpend: (m.meta?.spend ?? 0) + (m.google?.spend ?? 0),
          netRevenue: m.eshop?.netRevenue ?? m.eshop?.revenue ?? 0,
        }
      }),
    }))
  }

  return charts.filter(Boolean)
}

// Spätná kompatibilita — staré volania vracajú prvý graf
export const buildMetaChart = (months) => buildMetaCharts(months)[0] ?? null
export const buildGoogleChart = (months) => buildGoogleCharts(months, { isEshop: true })[0] ?? null
export const buildGaChart = (months) => buildGaCharts(months)[0] ?? null
export const buildEmailChart = (months) => buildEmailCharts(months)[0] ?? null
export const buildEshopChart = (months) => buildEshopCharts(months)[0] ?? null
export const buildOverviewChart = (months, agg) => buildOverviewCharts(months, agg)[0] ?? null
