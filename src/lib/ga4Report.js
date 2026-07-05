import { fmtEur, fmtNum, fmtPct, monthLabel, sum } from './helpers'
import { skPhrase } from './skGrammar'

export function isGa4ExportMonth(m) {
  return !!(m.ga?.trafficAcquisition?.length || m.ga?.landingPages?.length)
}

export function ga4ExportMonths(months) {
  return months.filter(isGa4ExportMonth)
}

export function legacyGaMonths(months) {
  return months.filter((m) => m.ga?.paid && !isGa4ExportMonth(m))
}

export function aggregateGaSnapshot(months) {
  const rows = months.filter((m) => m.ga?.snapshot)
  if (!rows.length) return null
  const sessions = sum(rows, (m) => m.ga.snapshot.sessions)
  const engagedSessions = sum(rows, (m) => m.ga.snapshot.engagedSessions)
  return {
    activeUsers: sum(rows, (m) => m.ga.snapshot.activeUsers),
    sessions,
    newUsers: sum(rows, (m) => m.ga.snapshot.newUsers),
    totalRevenue: sum(rows, (m) => m.ga.snapshot.totalRevenue) || null,
    keyEvents: sum(rows, (m) => m.ga.snapshot.keyEvents) || null,
    engagementRate: sessions > 0 && engagedSessions ? engagedSessions / sessions : null,
  }
}

export function aggregateLegacyGa(months) {
  let paidSessions = 0
  let organicSessions = 0
  let paidUsers = 0
  let organicUsers = 0
  let hasPaid = false
  let hasOrganic = false
  for (const m of months) {
    if (m.ga?.paid?.sessions != null) {
      paidSessions += m.ga.paid.sessions
      hasPaid = true
    }
    if (m.ga?.organic?.sessions != null) {
      organicSessions += m.ga.organic.sessions
      hasOrganic = true
    }
    if (m.ga?.paid?.users != null) paidUsers += m.ga.paid.users
    if (m.ga?.organic?.users != null) organicUsers += m.ga.organic.users
  }
  const avg = (pick) => {
    const vals = months.map(pick).filter((v) => v != null)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }
  return {
    paidSessions: hasPaid ? paidSessions : null,
    organicSessions: hasOrganic ? organicSessions : null,
    totalSessions: (hasPaid || hasOrganic) ? paidSessions + organicSessions : null,
    paidUsers: hasPaid && paidUsers ? paidUsers : null,
    organicUsers: hasOrganic && organicUsers ? organicUsers : null,
    paidEngagement: avg((m) => m.ga?.paid?.engagementRate),
    organicEngagement: avg((m) => m.ga?.organic?.engagementRate),
  }
}

const PAID_CHANNELS = new Set(['Paid Social', 'Paid Search', 'Cross-network'])
const ORGANIC_CHANNELS = new Set([
  'Organic Search', 'Organic Social', 'Organic Shopping', 'Organic Video', 'Direct', 'Referral', 'Email',
])

export function aggregateGaChannels(months) {
  const byChannel = new Map()
  for (const m of ga4ExportMonths(months)) {
    for (const r of m.ga.trafficAcquisition ?? []) {
      const prev = byChannel.get(r.channelGroup) ?? { sessions: 0, revenue: 0, keyEvents: 0 }
      byChannel.set(r.channelGroup, {
        sessions: prev.sessions + (r.sessions ?? 0),
        revenue: prev.revenue + (r.totalRevenue ?? 0),
        keyEvents: prev.keyEvents + (r.keyEvents ?? 0),
      })
    }
  }
  return [...byChannel.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.sessions - a.sessions)
}

export function aggregateGaProducts(months, limit = 5) {
  const byName = new Map()
  for (const m of ga4ExportMonths(months)) {
    for (const p of m.ga.ecommerceItems ?? []) {
      const prev = byName.get(p.name) ?? { revenue: 0, purchased: 0 }
      byName.set(p.name, {
        revenue: prev.revenue + (p.itemRevenue ?? 0),
        purchased: prev.purchased + (p.itemsPurchased ?? 0),
      })
    }
  }
  return [...byName.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .filter((p) => p.revenue > 0 || p.purchased > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export function ga4ExportPeriodLabel(ga4Months) {
  if (!ga4Months.length) return null
  if (ga4Months.length === 1) return monthLabel(ga4Months[0])
  return ga4Months.map(monthLabel).join(' · ')
}

export function channelSessionSplit(channels) {
  let paid = 0
  let organic = 0
  for (const c of channels) {
    if (PAID_CHANNELS.has(c.name)) paid += c.sessions
    else if (ORGANIC_CHANNELS.has(c.name)) organic += c.sessions
  }
  return { paidSessions: paid || null, organicSessions: organic || null }
}

export function getGaReportContext(months) {
  const ga4Months = ga4ExportMonths(months)
  const legacyMonths = legacyGaMonths(months)
  const snapshot = aggregateGaSnapshot(ga4Months)
  const legacy = aggregateLegacyGa(legacyMonths)
  const channels = aggregateGaChannels(months)
  const channelSplit = channelSessionSplit(channels)

  return {
    hasGa4: ga4Months.length > 0,
    hasLegacy: legacyMonths.length > 0,
    isGa4Only: ga4Months.length > 0 && legacyMonths.length === 0,
    isMixed: ga4Months.length > 0 && legacyMonths.length > 0,
    ga4Months,
    legacyMonths,
    snapshot,
    legacy,
    channels,
    topProducts: aggregateGaProducts(months, 5),
    paidSessions: snapshot?.sessions != null && channelSplit.paidSessions
      ? channelSplit.paidSessions
      : legacy.paidSessions,
    organicSessions: snapshot?.sessions != null && channelSplit.organicSessions
      ? channelSplit.organicSessions
      : legacy.organicSessions,
    totalSessions: snapshot?.sessions ?? legacy.totalSessions,
  }
}

export function pickTopGaChannels(ctx, limit = 5) {
  if (!ctx.channels.length) return null
  const items = ctx.channels.slice(0, limit).map((c) => ({
    name: c.name,
    value: fmtNum(c.sessions),
    detail: c.revenue > 0 ? `${fmtEur(c.revenue)} tržby` : null,
  }))
  return { heading: `Top ${items.length} kanálov (relácie)`, items }
}

export function pickTopGaProducts(ctx, limit = 5) {
  if (!ctx.topProducts.length) return null
  const items = ctx.topProducts.slice(0, limit).map((p) => ({
    name: p.name,
    value: fmtEur(p.revenue),
    detail: p.purchased > 0 ? skPhrase(p.purchased, 'kus', 'nom') : null,
    tone: 'revenue',
  }))
  return { heading: `Top ${items.length} produktov (GA4 tržby)`, items }
}

export function fmtEngagementRate(rate) {
  if (rate == null) return null
  return rate <= 1 ? fmtPct(rate * 100, 1) : fmtPct(rate, 1)
}
