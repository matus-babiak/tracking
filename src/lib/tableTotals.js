import { computeMetaDerived } from './helpers'

const LABEL_KEYS = new Set([
  'month', 'name', 'campaign', 'path', 'sourceMedium', 'channelGroup',
  'firstUserChannelGroup', 'type', 'event', 'channel',
])

const SUM_KEYS = new Set([
  'spend', 'value', 'purchases', 'clicks', 'impressions', 'reach', 'addToCart',
  'landingPageViews', 'lpv', 'engagements', 'saves', 'shares', 'comments', 'months',
  'orders', 'revenue', 'sent', 'items', 'netRevenue', 'eshop', 'ency', 'conversions',
  'sessions', 'activeUsers', 'newUsers', 'eventCount', 'totalUsers', 'views', 'keyEvents',
  'engagedSessions', 'total', 'totalRevenue', 'metaSpend', 'googleSpend', 'totalSpend',
  'metaClicks', 'googleClicks', 'interactions', 'campaigns', 'clicks', 'paidSessions',
  'paidUsers', 'orgSessions', 'orgUsers', 'totalUsers', 'newUsers',
])

const AVG_KEYS = new Set([
  'frequency', 'openRate', 'clickRate', 'unsub', 'unsubRate', 'paidEng', 'orgEng',
  'paidDur', 'orgDur', 'avgEngagement', 'eventCountPerActiveUser', 'viewsPerActiveUser',
  'avgEngagementTimePerActiveUser', 'avgEngagementTimePerSession', 'eventsPerSession',
  'engagementRate', 'sessionKeyEventRate', 'interactionRate', 'impressionsTop',
  'impressionsAbsTop', 'convRate',
])

const DERIVED_KEYS = new Set([
  'roas', 'cpc', 'cpm', 'ctr', 'costPerPurchase', 'cpp', 'aov', 'costPerAddToCart',
  'costPerLandingPageView', 'costPerEngagement', 'costPerConv', 'share',
])

export function getColumnTotalType(col) {
  if (col.total) return col.total
  if (LABEL_KEYS.has(col.key) || col.key.startsWith('conv_')) {
    return col.key.startsWith('conv_') ? 'sum' : 'label'
  }
  if (DERIVED_KEYS.has(col.key)) return 'derived'
  if (AVG_KEYS.has(col.key)) return 'avg'
  if (SUM_KEYS.has(col.key)) return 'sum'
  if (col.align === 'num' && col.sort) return 'sum'
  return 'none'
}

function extractConvActions(totals) {
  const actions = {}
  for (const [key, val] of Object.entries(totals)) {
    if (key.startsWith('conv_')) actions[key.slice(5)] = val
  }
  return actions
}

function formatDurationFromSec(sec) {
  if (sec == null) return '–'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function buildMockRow(totals) {
  const conversionActions = extractConvActions(totals)
  const google = {
    spend: totals.spend,
    clicks: totals.clicks,
    purchases: totals.purchases,
    purchaseValue: totals.value,
    impressions: totals.impressions,
    ctr: totals.ctr,
    cpc: totals.cpc,
    interactions: totals.interactions,
    interactionRate: totals.interactionRate,
    impressionsTop: totals.impressionsTop,
    impressionsAbsTop: totals.impressionsAbsTop,
    convRate: totals.convRate,
    conversions: totals.conversions,
    costPerConv: totals.costPerConv,
    conversionActions,
  }
  const meta = {
    spend: totals.metaSpend ?? totals.spend,
    clicks: totals.metaClicks ?? totals.clicks,
    purchaseValue: totals.value,
    purchases: totals.purchases,
    reach: totals.reach,
    impressions: totals.impressions,
    landingPageViews: totals.landingPageViews ?? totals.lpv,
    engagements: totals.engagements,
    saves: totals.saves,
    cpc: totals.cpc,
    ctr: totals.ctr,
    cpm: totals.cpm,
    frequency: totals.frequency,
    costPerEngagement: totals.costPerEngagement,
  }
  return {
    ...totals,
    google,
    meta,
    conversionActions,
    eshop: {
      revenue: totals.revenue ?? totals.eshop,
      netRevenue: totals.netRevenue,
      items: totals.items,
      orders: totals.orders,
      encyItems: totals.ency,
    },
    email: {
      sent: totals.sent,
      openRate: totals.openRate,
      clickRate: totals.clickRate,
      unsubRate: totals.unsub,
      uniqueClicks: totals.clicks,
      orders: totals.orders,
      revenue: totals.revenue,
      campaignsCount: totals.campaigns,
    },
    ga: {
      paid: {
        sessions: totals.paidSessions,
        users: totals.paidUsers,
        engagementRate: totals.paidEng,
        avgDuration: totals.paidDur != null ? formatDurationFromSec(totals.paidDur) : undefined,
      },
      organic: {
        sessions: totals.orgSessions,
        users: totals.orgUsers,
        engagementRate: totals.orgEng,
        avgDuration: totals.orgDur != null ? formatDurationFromSec(totals.orgDur) : undefined,
      },
      snapshot: {
        activeUsers: totals.activeUsers,
        newUsers: totals.newUsers,
        sessions: totals.sessions,
        avgEngagementTimePerActiveUser: totals.avgEngagement,
      },
    },
  }
}

function applyDerivedTotals(t) {
  Object.assign(t, computeMetaDerived(t))
  if (t.spend != null && t.conversions > 0 && t.costPerConv == null) t.costPerConv = t.spend / t.conversions
  if (t.spend != null && t.purchases > 0 && t.cpp == null) t.cpp = t.spend / t.purchases
  if (t.value != null && t.eshop > 0 && t.share == null) t.share = (t.value / t.eshop) * 100
  if (t.value != null && t.eshopRevenue > 0 && t.share == null) t.share = (t.value / t.eshopRevenue) * 100
  if (t.totalSpend == null && t.metaSpend != null && t.googleSpend != null) {
    t.totalSpend = (t.metaSpend ?? 0) + (t.googleSpend ?? 0)
  }
  if (t.totalClicks == null && t.metaClicks != null && t.googleClicks != null) {
    t.totalClicks = (t.metaClicks ?? 0) + (t.googleClicks ?? 0)
  }
  return t
}

export function computeTableTotals(columns, rows) {
  const totals = {}
  const avgAcc = {}

  for (const col of columns) {
    if (!col.sort) continue
    const type = getColumnTotalType(col)
    if (type === 'label' || type === 'none' || type === 'derived') continue

    for (const row of rows) {
      const v = col.sort(row)
      if (typeof v !== 'number' || !Number.isFinite(v)) continue
      if (type === 'sum') {
        totals[col.key] = (totals[col.key] ?? 0) + v
      } else if (type === 'avg') {
        if (!avgAcc[col.key]) avgAcc[col.key] = { sum: 0, count: 0 }
        avgAcc[col.key].sum += v
        avgAcc[col.key].count += 1
      }
    }
  }

  for (const [key, { sum, count }] of Object.entries(avgAcc)) {
    totals[key] = count > 0 ? sum / count : null
  }

  return applyDerivedTotals(totals)
}

export function hasTotalRow(columns, rows) {
  if (!rows.length) return false
  return columns.some((col) => {
    const type = getColumnTotalType(col)
    return type === 'sum' || type === 'avg' || type === 'derived'
  })
}

export function firstLabelColumnIndex(columns) {
  for (let i = 0; i < columns.length; i++) {
    if (getColumnTotalType(columns[i]) === 'label') return i
  }
  return 0
}
