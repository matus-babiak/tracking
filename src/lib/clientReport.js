import { aggregate, fmtEur, fmtNum, fmtPct, fmtRoas, rangeLabel, sum } from './helpers'
import { metricToneFromLabel } from './metricTone'
import { getClientUiProfile } from './clientMetrics'
import { isEcommerceClient } from './clientType'
import {
  ESHOP_GOOGLE_CONV_LABELS,
  getGoogleConvKeys,
  sumTrackedConversions,
} from './googleConversions'
import {
  fmtSkCount,
  skNavstevyNaWeb,
  skNavstevyZReklam,
  skOsloviliLudi,
  skPhrase,
  skPredanychPoloziek,
  skZ,
  topReklamy,
} from './skGrammar'
import {
  buildEmailCharts,
  buildEshopCharts,
  buildGaCharts,
  buildGoogleCharts,
  buildMetaCharts,
  buildOverviewCharts,
} from './clientReportCharts'
import { aggregateEmailCampaignRollup } from './emailCampaigns'
import {
  aggregateLegacyGa,
  fmtEngagementRate,
  ga4ExportPeriodLabel,
  getGaReportContext,
  pickTopGaChannels,
  pickTopGaProducts,
} from './ga4Report'

export const TOP_CAMPAIGNS_LIMIT = 5

const CONV_LABELS = {
  click_tel: 'Telefónne hovory',
  form_start: 'Začaté formuláre',
  form_submit: 'Odoslané formuláre',
}

export function getReportProfile(client) {
  if (isEcommerceClient(client)) return 'eshop'
  return getClientUiProfile(client)
}

function metric(label, value, hint) {
  return { label, value, hint: hint ?? null }
}

function row(label, value, hint) {
  return { label, value, hint: hint ?? null, tone: metricToneFromLabel(label) }
}

function pickMetrics(rows, labels) {
  const map = new Map(rows.map((r) => [r.label, r]))
  return labels
    .map((label) => map.get(label))
    .filter(Boolean)
    .map((r) => metric(r.label, r.value, r.hint))
}

function fmtDec(v, digits = 2) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function hasMoney(v) {
  return v != null
}

function hasCount(v) {
  return v != null && v > 0
}

function metaSum(months, key) {
  return sum(months.filter((m) => m.meta), (m) => m.meta[key])
}

function googleSum(months, key) {
  return sum(months.filter((m) => m.google), (m) => m.google[key])
}

function periodHasSource(months, key) {
  return months.some((m) => m[key] != null)
}

function avgMetric(months, get) {
  const rows = months.filter((m) => get(m) != null)
  if (!rows.length) return null
  return rows.reduce((acc, m) => acc + get(m), 0) / rows.length
}

function breakdownList(month, sourceKey, client) {
  const src = month[sourceKey]
  if (!src) return []
  if (sourceKey === 'meta' && client?.metaBreakdown === 'ads') {
    return src.ads?.length ? src.ads : (src.campaigns ?? [])
  }
  return src.campaigns ?? []
}

function aggregateCampaigns(months, sourceKey, client) {
  const map = new Map()
  for (const m of months) {
    const items = breakdownList(m, sourceKey, client)
    if (!items.length) continue
    for (const c of items) {
      const key = c.campaign ? `${c.campaign}::${c.name}` : c.name
      const prev = map.get(key) ?? {
        name: c.name,
        campaign: c.campaign ?? null,
        spend: null,
        clicks: null,
        purchases: null,
        value: null,
        landingPageViews: null,
        engagements: null,
      }
      const add = (key, raw = c[key]) => {
        if (raw == null) return
        prev[key] = (prev[key] ?? 0) + raw
      }
      add('spend')
      add('clicks')
      add('purchases')
      add('value')
      add('landingPageViews')
      add('engagements')
      map.set(key, prev)
    }
  }
  return [...map.values()]
}

function formatTopCampaign(c, mode) {
  if (mode === 'eshop') {
    const parts = []
    if (c.campaign) parts.push(c.campaign)
    if (hasMoney(c.spend)) parts.push(`Investícia ${fmtEur(c.spend)}`)
    if (hasCount(c.purchases)) parts.push(skPhrase(c.purchases, 'nakup', 'acc'))
    if (hasMoney(c.spend) && hasMoney(c.value)) parts.push(`ROAS ${fmtRoas(c.value / c.spend)}`)
    return {
      name: c.name,
      value: hasMoney(c.value) ? fmtEur(c.value) : (hasMoney(c.spend) ? fmtEur(c.spend) : '–'),
      detail: parts.length ? parts.join(' · ') : null,
      tone: hasMoney(c.value) ? 'revenue' : (hasMoney(c.spend) ? 'spend' : null),
    }
  }

  const parts = []
  if (hasMoney(c.spend)) parts.push(`Investícia ${fmtEur(c.spend)}`)
  if (hasCount(c.clicks)) parts.push(skPhrase(c.clicks, 'kliknutie', 'acc'))
  if (hasCount(c.landingPageViews)) parts.push(skPhrase(c.landingPageViews, 'navsteva', 'acc'))
  if (hasCount(c.engagements)) parts.push(skPhrase(c.engagements, 'interakcia', 'acc'))
  return {
    name: c.name,
    value: hasMoney(c.spend) ? fmtEur(c.spend) : '–',
    detail: parts.length ? parts.join(' · ') : null,
    tone: hasMoney(c.spend) ? 'spend' : null,
  }
}

function pickTopCampaigns(months, sourceKey, mode, client, limit = TOP_CAMPAIGNS_LIMIT) {
  const campaigns = aggregateCampaigns(months, sourceKey, client)
  if (!campaigns.length) return null

  const sorted = [...campaigns].sort((a, b) => {
    if (mode === 'eshop') {
      const va = a.value ?? 0
      const vb = b.value ?? 0
      if (vb !== va) return vb - va
      return (b.spend ?? 0) - (a.spend ?? 0)
    }
    return (b.spend ?? 0) - (a.spend ?? 0)
  })

  const items = sorted
    .filter((c) => hasMoney(c.spend) || hasMoney(c.value) || hasCount(c.clicks) || hasCount(c.engagements))
    .slice(0, limit)
    .map((c) => formatTopCampaign(c, mode))

  if (!items.length) return null
  return { heading: topReklamy(Math.min(limit, items.length)), items }
}

function pickTopEmailCampaigns(months, limit = TOP_CAMPAIGNS_LIMIT) {
  if (!months.some((m) => m.email?.campaigns?.length)) return null

  const items = aggregateEmailCampaignRollup(months)
    .filter((c) => c.name !== 'Celkom')
    .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0) || (b.clicks ?? 0) - (a.clicks ?? 0))
    .slice(0, limit)
    .map((c) => {
      const parts = []
      if (hasCount(c.sent)) parts.push(`${fmtNum(c.sent)} odoslaných`)
      if (c.openRate != null) parts.push(`open ${fmtPct(c.openRate)}`)
      if (hasCount(c.clicks)) parts.push(skPhrase(c.clicks, 'kliknutie', 'acc'))
      return {
        name: c.name,
        value: hasMoney(c.revenue) ? fmtEur(c.revenue) : (hasCount(c.clicks) ? fmtNum(c.clicks) : '–'),
        detail: parts.length ? parts.join(' · ') : null,
        tone: hasMoney(c.revenue) ? 'revenue' : null,
      }
    })

  if (!items.length) return null
  return { heading: 'Top e-mailové kampane', items }
}

function aggregateEmail(months) {
  const rows = months.filter((m) => m.email)
  if (!rows.length) return null
  return {
    sent: sum(rows, (m) => m.email.sent),
    orders: sum(rows, (m) => m.email.orders),
    revenue: sum(rows, (m) => m.email.revenue),
    clicks: sum(rows, (m) => m.email.uniqueClicks),
    campaignsCount: sum(rows, (m) => m.email.campaignsCount),
    avgOpen: avgMetric(rows, (m) => m.email.openRate),
    avgClick: avgMetric(rows, (m) => m.email.clickRate),
    avgUnsub: avgMetric(rows, (m) => m.email.unsubRate),
  }
}

function aggregateBoosting(months) {
  const rows = months.filter((m) => m.boosting)
  if (!rows.length) return null
  return {
    spend: sum(rows, (m) => m.boosting.spend),
    interactions: sum(rows, (m) => m.boosting.interactions),
    purchases: sum(rows, (m) => m.boosting.purchases),
    value: sum(rows, (m) => m.boosting.value),
  }
}

function aggregateEshop(months) {
  const rows = months.filter((m) => m.eshop)
  if (!rows.length) return null
  return {
    revenue: sum(rows, (m) => m.eshop.revenue),
    netRevenue: sum(rows, (m) => m.eshop.netRevenue),
    grossSales: sum(rows, (m) => m.eshop.grossSales),
    items: sum(rows, (m) => m.eshop.items),
    orders: sum(rows, (m) => m.eshop.orders),
    variants: sum(rows, (m) => m.eshop.variants),
    refunds: sum(rows, (m) => m.eshop.refunds),
    coupons: sum(rows, (m) => m.eshop.coupons),
    taxes: sum(rows, (m) => m.eshop.taxes),
    shipping: sum(rows, (m) => m.eshop.shipping),
    hasWoo: rows.some((m) => m.eshop.woocommerce),
    combinedShops: [...new Set(rows.flatMap((m) => m.eshop.combinedShops ?? []))],
  }
}

function aggregateGa(months) {
  const ctx = getGaReportContext(months)
  if (ctx.hasGa4) {
    return {
      paidSessions: ctx.paidSessions,
      organicSessions: ctx.organicSessions,
      totalSessions: ctx.totalSessions,
      paidUsers: ctx.legacy.paidUsers,
      organicUsers: ctx.legacy.organicUsers,
      paidEngagement: ctx.legacy.paidEngagement,
      organicEngagement: ctx.legacy.organicEngagement,
      snapshot: ctx.snapshot,
      hasGa4: true,
    }
  }
  return { ...aggregateLegacyGa(months), snapshot: null, hasGa4: false }
}

function aggregateGaSnapshot(months) {
  const ctx = getGaReportContext(months)
  return ctx.snapshot
}

function buildMetaSection(months, mode, client) {
  if (!periodHasSource(months, 'meta')) return null

  const spend = metaSum(months, 'spend')
  const purchases = metaSum(months, 'purchases')
  const purchaseValue = metaSum(months, 'purchaseValue')
  const hasEshopMeta = hasMoney(purchaseValue) || hasCount(purchases)
  const isEshop = mode === 'eshop' && hasEshopMeta

  const rows = [
    hasMoney(spend) ? row('Investícia', fmtEur(spend)) : null,
    isEshop && hasMoney(purchaseValue) ? row('Hodnota nákupov', fmtEur(purchaseValue)) : null,
    isEshop && hasCount(purchases) ? row('Počet nákupov', fmtNum(purchases)) : null,
    isEshop && hasMoney(spend) && hasMoney(purchaseValue)
      ? row('Návratnosť', fmtRoas(purchaseValue / spend))
      : null,
    hasCount(metaSum(months, 'reach'))
      ? row('Dosah', fmtNum(metaSum(months, 'reach')), 'Unikátni ľudia')
      : null,
    hasCount(metaSum(months, 'impressions'))
      ? row('Zobrazenia', fmtNum(metaSum(months, 'impressions')), 'Koľkokrát sa reklama zobrazila')
      : null,
    hasCount(metaSum(months, 'clicks')) ? row('Kliknutia', fmtNum(metaSum(months, 'clicks'))) : null,
    isEshop && hasCount(metaSum(months, 'addToCart'))
      ? row('Pridané do košíka', fmtNum(metaSum(months, 'addToCart')))
      : null,
    !isEshop && hasCount(metaSum(months, 'landingPageViews'))
      ? row('Návštevy webu', fmtNum(metaSum(months, 'landingPageViews')), 'Pozretia cieľovej stránky')
      : null,
    !isEshop && hasCount(metaSum(months, 'engagements'))
      ? row('Interakcie', fmtNum(metaSum(months, 'engagements')), 'Lajky, komentáre, zdieľania')
      : null,
    !isEshop && hasCount(metaSum(months, 'saves')) ? row('Uloženia', fmtNum(metaSum(months, 'saves'))) : null,
    !isEshop && hasMoney(spend) && hasCount(metaSum(months, 'engagements'))
      ? row('Cena / interakciu', fmtEur(spend / metaSum(months, 'engagements')))
      : null,
    isEshop && hasMoney(spend) && hasCount(metaSum(months, 'clicks'))
      ? row('CPC', fmtEur(spend / metaSum(months, 'clicks')))
      : null,
    isEshop && hasMoney(spend) && hasCount(purchases)
      ? row('Cena / nákup', fmtEur(spend / purchases))
      : null,
  ].filter(Boolean)

  if (!rows.length) return null

  const intro = isEshop
    ? 'Reklamy na sociálnych sieťach: dosah, kliknutia a nákupy.'
    : hasCount(metaSum(months, 'landingPageViews'))
      ? 'Prehľad výsledkov reklamných kampaní: dosah, návštevy a interakcie.'
      : 'Prehľad výsledkov reklamných kampaní: dosah a interakcie.'

  const topCampaigns = pickTopCampaigns(months, 'meta', isEshop ? 'eshop' : 'leadgen', client)

  const metrics = isEshop
    ? pickMetrics(rows, ['Investícia', 'Hodnota nákupov', 'Návratnosť', 'Počet nákupov'])
    : pickMetrics(rows, ['Investícia', 'Dosah', 'Návštevy webu', 'Interakcie', 'Kliknutia'])

  return {
    id: 'meta',
    title: 'Meta Ads (Facebook & Instagram)',
    accent: 'meta',
    intro,
    metrics,
    rows,
    topCampaigns,
    charts: buildMetaCharts(months, { isEshop }),
  }
}

function buildBoostingSection(months) {
  const boost = aggregateBoosting(months)
  if (!boost) return null

  const rows = [
    hasMoney(boost.spend) ? row('Investícia', fmtEur(boost.spend)) : null,
    hasCount(boost.interactions) ? row('Interakcie s obsahom', fmtNum(boost.interactions)) : null,
    hasMoney(boost.value) ? row('Hodnota nákupov', fmtEur(boost.value)) : null,
    hasCount(boost.purchases) ? row('Nákupy', fmtNum(boost.purchases)) : null,
  ].filter(Boolean)

  if (!rows.length) return null

  return {
    id: 'boosting',
    title: 'Boosting organických príspevkov',
    accent: 'boosting',
    intro: 'Platené propagovanie existujúceho obsahu na Meta (samostatne vykazované do 12/2025).',
    rows,
  }
}

function buildGoogleSection(months, mode, client) {
  if (!periodHasSource(months, 'google')) return null

  const spend = googleSum(months, 'spend')
  const purchases = googleSum(months, 'purchases')
  const purchaseValue = googleSum(months, 'purchaseValue')
  const clicks = googleSum(months, 'clicks')
  const impressions = googleSum(months, 'impressions')
  const interactions = googleSum(months, 'interactions')
  const conversions = googleSum(months, 'conversions')
  const convKeys = getGoogleConvKeys(client)
  const hasEshopGoogle = hasMoney(purchaseValue) || hasCount(purchases)
  const isEshop = mode === 'eshop' && hasEshopGoogle
  const isDual = mode === 'dual'

  const convActions = {}
  for (const m of months) {
    const actions = m.google?.conversionActions
    if (!actions) continue
    for (const [key, val] of Object.entries(actions)) {
      convActions[key] = (convActions[key] ?? 0) + (val ?? 0)
    }
  }

  const trackedConversions = convKeys
    ? sum(months.filter((m) => m.google), (m) => sumTrackedConversions(m.google.conversionActions, convKeys))
    : conversions

  const avgInteractionRate = avgMetric(months, (m) => m.google?.interactionRate)
  const avgConvRate = avgMetric(months, (m) => m.google?.convRate)
  const avgCostPerConv = avgMetric(months, (m) => m.google?.costPerConv)

  const convActionRows = convKeys
    ? convKeys
      .filter((key) => hasCount(convActions[key]))
      .map((key) => row(ESHOP_GOOGLE_CONV_LABELS[key] ?? key, fmtDec(convActions[key])))
    : Object.entries(convActions)
      .filter(([, val]) => hasCount(val))
      .map(([key, val]) => row(CONV_LABELS[key] ?? key, fmtNum(val)))

  const rows = [
    hasMoney(spend) ? row('Investícia', fmtEur(spend)) : null,
    isEshop && hasMoney(purchaseValue) ? row('Hodnota nákupov', fmtEur(purchaseValue)) : null,
    isEshop && hasCount(purchases) ? row('Počet nákupov', fmtDec(purchases)) : null,
    isEshop && hasMoney(spend) && hasMoney(purchaseValue)
      ? row('Návratnosť', fmtRoas(purchaseValue / spend))
      : null,
    hasCount(impressions) ? row('Zobrazenia', fmtNum(impressions)) : null,
    hasCount(clicks) ? row('Kliknutia', fmtNum(clicks)) : null,
    hasCount(interactions) ? row('Interakcie', fmtNum(interactions)) : null,
    avgInteractionRate != null ? row('Miera interakcií', fmtPct(avgInteractionRate)) : null,
    isEshop && hasMoney(spend) && hasCount(clicks) ? row('CPC', fmtEur(spend / clicks, 2)) : null,
    isEshop && hasCount(trackedConversions) ? row('Konverzie celkom', fmtDec(trackedConversions)) : null,
    ...convActionRows,
    avgConvRate != null ? row('Miera konverzií', fmtPct(avgConvRate)) : null,
    isEshop && hasMoney(spend) && hasCount(purchases)
      ? row('Cena / nákup', fmtEur(spend / purchases, 2))
      : null,
    (hasMoney(spend) && hasCount(trackedConversions))
      ? row('Cena / konverziu', fmtEur(spend / trackedConversions, 2))
      : (avgCostPerConv != null ? row('Cena / konverziu', fmtEur(avgCostPerConv, 2)) : null),
    (isDual || !isEshop) && !convKeys && hasCount(conversions)
      ? row('Konverzie celkom', fmtNum(conversions))
      : null,
    (isDual || !isEshop) && hasMoney(spend) && hasCount(conversions) && !convKeys
      ? row('Cena za konverziu', fmtEur(spend / conversions))
      : null,
  ].filter(Boolean)

  if (!rows.length) return null

  const intro = isEshop
    ? 'Vyhľadávanie a Performance Max: zobrazenia, kliknutia, konverzie a nákupy.'
    : 'Vyhľadávanie: kliknutia, telefónne hovory a formuláre.'

  const topCampaigns = pickTopCampaigns(months, 'google', isEshop ? 'eshop' : 'leadgen', client)

  const metrics = isEshop
    ? pickMetrics(rows, ['Investícia', 'Hodnota nákupov', 'Návratnosť', 'Počet nákupov'])
    : pickMetrics(rows, ['Investícia', 'Kliknutia', 'Konverzie celkom'])

  return {
    id: 'google',
    title: 'Google Ads',
    accent: 'google',
    intro,
    metrics,
    rows,
    topCampaigns,
    charts: buildGoogleCharts(months, { isEshop }),
  }
}

function buildGaSection(months, client) {
  const ctx = getGaReportContext(months)
  const ga = aggregateGa(months)
  const snapshot = ctx.snapshot
  const ga4Label = ctx.hasGa4 ? ga4ExportPeriodLabel(ctx.ga4Months) : null
  const ga4Hint = ga4Label ? `GA4 export (${ga4Label})` : null
  const legacyHint = ctx.hasLegacy ? 'PDF report, starší import' : null

  const rows = [
    ctx.hasGa4 && snapshot?.sessions != null && hasCount(snapshot.sessions)
      ? row('Relácie', fmtNum(snapshot.sessions), ga4Hint)
      : null,
    !ctx.hasGa4 && ga.totalSessions != null && hasCount(ga.totalSessions)
      ? row('Návštevy webu celkom', fmtNum(ga.totalSessions))
      : null,
    ctx.hasGa4 && ctx.paidSessions != null && hasCount(ctx.paidSessions)
      ? row('Platené kanály', fmtNum(ctx.paidSessions), 'Cross-network, Paid Social, Paid Search')
      : null,
    ctx.hasGa4 && ctx.organicSessions != null && hasCount(ctx.organicSessions)
      ? row('Organické kanály', fmtNum(ctx.organicSessions), 'Search, Direct, Social, E-mail…')
      : null,
    !ctx.hasGa4 && ga.paidSessions != null && hasCount(ga.paidSessions)
      ? row('Platená návštevnosť', fmtNum(ga.paidSessions), 'Relácie z reklám')
      : null,
    !ctx.hasGa4 && ga.organicSessions != null && hasCount(ga.organicSessions)
      ? row('Organická návštevnosť', fmtNum(ga.organicSessions))
      : null,
    ctx.hasLegacy && ctx.legacy.totalSessions != null && hasCount(ctx.legacy.totalSessions)
      ? row('Návštevy (PDF import)', fmtNum(ctx.legacy.totalSessions), legacyHint)
      : null,
    ctx.hasLegacy && ctx.legacy.paidSessions != null && hasCount(ctx.legacy.paidSessions)
      ? row('Platená (PDF)', fmtNum(ctx.legacy.paidSessions), legacyHint)
      : null,
    ctx.hasLegacy && ctx.legacy.organicSessions != null && hasCount(ctx.legacy.organicSessions)
      ? row('Organická (PDF)', fmtNum(ctx.legacy.organicSessions), legacyHint)
      : null,
    snapshot?.activeUsers != null && hasCount(snapshot.activeUsers)
      ? row('Aktívni používatelia', fmtNum(snapshot.activeUsers), ga4Hint)
      : null,
    snapshot?.newUsers != null && hasCount(snapshot.newUsers)
      ? row('Noví používatelia', fmtNum(snapshot.newUsers), ga4Hint)
      : null,
    !ctx.hasGa4 && ga.paidUsers != null && hasCount(ga.paidUsers)
      ? row('Používatelia (platená)', fmtNum(ga.paidUsers))
      : null,
    !ctx.hasGa4 && ga.organicUsers != null && hasCount(ga.organicUsers)
      ? row('Používatelia (organická)', fmtNum(ga.organicUsers))
      : null,
    !ctx.hasGa4 && ga.paidEngagement != null
      ? row('Miera interakcie (platená)', fmtPct(ga.paidEngagement))
      : null,
    !ctx.hasGa4 && ga.organicEngagement != null
      ? row('Miera interakcie (organická)', fmtPct(ga.organicEngagement))
      : null,
    snapshot?.engagementRate != null
      ? row('Engagement rate', fmtEngagementRate(snapshot.engagementRate), ga4Hint)
      : null,
    snapshot?.bounceRate != null
      ? row('Bounce rate', fmtEngagementRate(snapshot.bounceRate), ga4Hint)
      : null,
    snapshot?.totalRevenue != null && hasMoney(snapshot.totalRevenue) && isEcommerceClient(client)
      ? row('Tržby (GA4)', fmtEur(snapshot.totalRevenue), ga4Hint)
      : null,
    snapshot?.keyEvents != null && hasCount(snapshot.keyEvents)
      ? row('Kľúčové udalosti', fmtNum(snapshot.keyEvents), ga4Hint)
      : null,
  ].filter(Boolean)

  if (!rows.length) return null

  let intro = 'Návštevnosť webu: platená a organická návštevnosť, miera interakcie.'
  if (ctx.isGa4Only) {
    intro = 'Návštevnosť webu z GA4 exportov: relácie podľa kanálov, používatelia a tržby.'
  } else if (ctx.isMixed) {
    intro = `GA4 CSV export za ${ga4Label}; staršie mesiace majú zjednodušený import z PDF reportu.`
  } else if (ctx.hasGa4) {
    intro = 'Návštevnosť webu z GA4 exportov podľa kanálov.'
  }

  const metrics = ctx.hasGa4
    ? pickMetrics(rows, isEcommerceClient(client)
      ? ['Relácie', 'Aktívni používatelia', 'Tržby (GA4)', 'Bounce rate']
      : ['Relácie', 'Aktívni používatelia', 'Engagement rate', 'Bounce rate'])
    : pickMetrics(rows, [
        'Návštevy webu celkom',
        'Platená návštevnosť',
        'Organická návštevnosť',
        'Miera interakcie (organická)',
      ])

  return {
    id: 'analytics',
    title: 'Google Analytics',
    accent: 'analytics',
    intro,
    metrics,
    rows,
    topCampaigns: pickTopGaChannels(ctx),
    topProducts: isEcommerceClient(client) ? pickTopGaProducts(ctx) : null,
    charts: buildGaCharts(months),
  }
}

function buildEshopSection(months) {
  const eshop = aggregateEshop(months)
  if (!eshop) return null

  const rows = [
    hasMoney(eshop.revenue) ? row('Celkové predaje', fmtEur(eshop.revenue)) : null,
    hasMoney(eshop.netRevenue) ? row('Čisté predaje', fmtEur(eshop.netRevenue)) : null,
    hasMoney(eshop.grossSales) ? row('Hrubý predaj', fmtEur(eshop.grossSales)) : null,
    hasCount(eshop.orders) ? row('Objednávky', fmtNum(eshop.orders)) : null,
    hasCount(eshop.items) ? row('Predané položky', fmtNum(eshop.items)) : null,
    hasCount(eshop.variants) ? row('Predané varianty', fmtNum(eshop.variants)) : null,
    hasMoney(eshop.refunds) ? row('Refundácie', fmtEur(eshop.refunds)) : null,
    hasMoney(eshop.coupons) ? row('Zľavové kódy', fmtEur(eshop.coupons)) : null,
    hasMoney(eshop.taxes) ? row('Dane', fmtEur(eshop.taxes)) : null,
    hasMoney(eshop.shipping) ? row('Doprava', fmtEur(eshop.shipping)) : null,
  ].filter(Boolean)

  if (!rows.length) return null

  let intro = eshop.hasWoo
    ? 'Predaje a objednávky z WooCommerce: súhrn za zvolené obdobie.'
    : 'Predaje v e-shope podľa dostupných reportov.'

  if (eshop.combinedShops.length) {
    intro += ` Niektoré mesiace zahŕňajú súčet viacerých e-shopov (${eshop.combinedShops.join(' + ')}).`
  }

  const metrics = pickMetrics(rows, [
    'Celkové predaje',
    'Čisté predaje',
    'Objednávky',
    'Predané položky',
  ])

  return {
    id: 'eshop',
    title: 'E-shop',
    accent: 'eshop',
    intro,
    metrics,
    rows,
    charts: buildEshopCharts(months),
  }
}

function buildWebSection(months, client) {
  const ctx = getGaReportContext(months)
  const ga = aggregateGa(months)
  const snapshot = ctx.snapshot
  const eshop = aggregateEshop(months)
  const ga4Hint = ctx.hasGa4 ? ga4ExportPeriodLabel(ctx.ga4Months) : null

  const rows = [
    hasMoney(eshop?.revenue) ? row('Tržby e-shopu', fmtEur(eshop.revenue)) : null,
    hasMoney(eshop?.netRevenue) ? row('Čisté predaje', fmtEur(eshop.netRevenue)) : null,
    hasCount(eshop?.orders) ? row('Objednávky', fmtNum(eshop.orders)) : null,
    hasCount(eshop?.items) ? row('Predané položky', fmtNum(eshop.items)) : null,
    ctx.hasGa4 && snapshot?.sessions != null && hasCount(snapshot.sessions)
      ? row('Relácie (GA4)', fmtNum(snapshot.sessions), ga4Hint)
      : null,
    ga.totalSessions != null && hasCount(ga.totalSessions) && !ctx.hasGa4
      ? row('Návštevy webu', fmtNum(ga.totalSessions), 'Google Analytics')
      : null,
    ctx.hasGa4 && ctx.paidSessions != null && hasCount(ctx.paidSessions)
      ? row('Platené kanály', fmtNum(ctx.paidSessions))
      : null,
    ctx.hasGa4 && ctx.organicSessions != null && hasCount(ctx.organicSessions)
      ? row('Organické kanály', fmtNum(ctx.organicSessions))
      : null,
    !ctx.hasGa4 && ga.paidSessions != null && hasCount(ga.paidSessions)
      ? row('Platená návštevnosť', fmtNum(ga.paidSessions))
      : null,
    !ctx.hasGa4 && ga.organicSessions != null && hasCount(ga.organicSessions)
      ? row('Organická návštevnosť', fmtNum(ga.organicSessions))
      : null,
    snapshot?.activeUsers != null && hasCount(snapshot.activeUsers)
      ? row('Aktívni používatelia (GA4)', fmtNum(snapshot.activeUsers))
      : null,
    snapshot?.totalRevenue != null && hasMoney(snapshot.totalRevenue) && isEcommerceClient(client)
      ? row('Tržby (GA4)', fmtEur(snapshot.totalRevenue))
      : null,
  ].filter(Boolean)

  if (!rows.length) return null

  const hasEshop = hasMoney(eshop?.revenue) || hasCount(eshop?.orders)
  return {
    id: 'web',
    title: hasEshop ? 'Web a e-shop' : 'Web (Google Analytics)',
    intro: hasEshop ? 'Návštevnosť webu a predaje v e-shope.' : 'Návštevnosť webu podľa GA4.',
    rows,
  }
}

function buildEmailSection(months) {
  const email = aggregateEmail(months)
  if (!email) return null

  const rows = [
    hasCount(email.sent) ? row('Odoslané e-maily', fmtNum(email.sent)) : null,
    email.avgOpen != null ? row('Priemerný open rate', fmtPct(email.avgOpen)) : null,
    email.avgClick != null ? row('Priemerný click rate', fmtPct(email.avgClick, 2)) : null,
    hasCount(email.clicks) ? row('Unikátne kliknutia', fmtNum(email.clicks)) : null,
    hasCount(email.campaignsCount) ? row('Počet kampaní', fmtNum(email.campaignsCount)) : null,
    email.avgUnsub != null ? row('Miera odhlásení', fmtPct(email.avgUnsub, 2)) : null,
    hasCount(email.orders) ? row('Objednávky z e-mailov', fmtNum(email.orders)) : null,
    hasMoney(email.revenue) ? row('Tržby z e-mailov', fmtEur(email.revenue)) : null,
  ].filter(Boolean)

  if (!rows.length) return null

  const metrics = pickMetrics(rows, [
    'Odoslané e-maily',
    'Priemerný open rate',
    'Objednávky z e-mailov',
    'Tržby z e-mailov',
  ])

  return {
    id: 'email',
    title: 'E-mail marketing (Mailchimp)',
    accent: 'email',
    intro: 'Newsletter a automatické e-maily: odoslanie, otvorenosť a tržby.',
    metrics,
    rows,
    charts: buildEmailCharts(months),
    topCampaigns: pickTopEmailCampaigns(months),
  }
}

function buildHighlights(months, profile, agg) {
  const highlights = []
  const spend = metaSum(months, 'spend')
  const googleSpend = googleSum(months, 'spend')
  const boostSpend = sum(months, (m) => m.boosting?.spend)
  const adSpend = (agg.adSpend ?? ((spend ?? 0) + (googleSpend ?? 0) + (boostSpend ?? 0))) || null
  const metaValue = metaSum(months, 'purchaseValue')
  const googleValue = googleSum(months, 'purchaseValue')
  const adValue = (metaValue ?? 0) + (googleValue ?? 0) + (sum(months, (m) => m.boosting?.value) ?? 0) || null
  const hasEshopAds = hasMoney(metaValue) || hasMoney(googleValue) || hasCount(metaSum(months, 'purchases'))
  const email = aggregateEmail(months)
  const eshop = aggregateEshop(months)
  const ga = aggregateGa(months)
  const ctx = getGaReportContext(months)

  if (profile === 'eshop') {
    if (hasMoney(adSpend)) {
      highlights.push({
        label: 'Investícia do reklám',
        value: fmtEur(adSpend),
        hint: `Meta ${fmtEur(spend)} · Google ${fmtEur(googleSpend)}`,
        tone: 'spend',
      })
    }
    if (hasEshopAds && hasMoney(adValue)) {
      highlights.push({
        label: 'Hodnota nákupov z reklám',
        value: fmtEur(adValue),
        hint: hasCount(agg.adPurchases) ? fmtSkCount(agg.adPurchases, 'nakup') : null,
        tone: 'revenue',
      })
    }
    if (hasEshopAds && agg.roas != null) {
      highlights.push({ label: 'Návratnosť reklám (ROAS)', value: fmtRoas(agg.roas), hint: 'Na 1 € investície' })
    }
    if (hasMoney(eshop?.netRevenue)) {
      highlights.push({
        label: 'Čisté predaje e-shopu',
        value: fmtEur(eshop.netRevenue),
        hint: hasMoney(eshop.revenue) ? `Celkom ${fmtEur(eshop.revenue)}` : null,
        tone: 'revenue',
      })
    } else if (hasMoney(agg.eshopRevenue)) {
      highlights.push({
        label: 'Tržby e-shopu',
        value: fmtEur(agg.eshopRevenue),
        hint: agg.adShareOfRevenue != null ? `${fmtPct(agg.adShareOfRevenue)} z reklám` : null,
        tone: 'revenue',
      })
    }
    if (hasCount(eshop?.orders)) {
      highlights.push({
        label: 'Objednávky e-shopu',
        value: fmtNum(eshop.orders),
        hint: hasCount(eshop.items) ? skPredanychPoloziek(eshop.items) : null,
      })
    }
    if (hasCount(ga.totalSessions)) {
      highlights.push({
        label: ctx.hasGa4 ? 'Relácie (GA4)' : 'Návštevy webu',
        value: fmtNum(ga.totalSessions),
        hint: hasCount(ga.organicSessions) && hasCount(ga.paidSessions)
          ? `Organické ${fmtNum(ga.organicSessions)} · platené ${fmtNum(ga.paidSessions)}`
          : ctx.hasGa4 && ctx.snapshot?.totalRevenue
            ? `Tržby ${fmtEur(ctx.snapshot.totalRevenue)}`
            : null,
      })
    }
    if (hasMoney(email?.revenue)) {
      highlights.push({
        label: 'Tržby z e-mailov',
        value: fmtEur(email.revenue),
        hint: hasCount(email.orders) ? skZ(email.orders, 'objednavka') : 'Mailchimp',
        tone: 'revenue',
      })
    }
    return highlights.slice(0, 6)
  }

  if (profile === 'dual') {
    const lpv = metaSum(months, 'landingPageViews')
    const conversions = googleSum(months, 'conversions')
    const metaClicks = metaSum(months, 'clicks')
    const googleClicks = googleSum(months, 'clicks')
    const totalClicks = (metaClicks ?? 0) + (googleClicks ?? 0) || null
    const totalSpend = (spend ?? 0) + (googleSpend ?? 0) || null

    if (hasMoney(totalSpend)) {
      highlights.push({
        label: 'Investícia celkom',
        value: fmtEur(totalSpend),
        hint: `Meta ${fmtEur(spend)} · Google ${fmtEur(googleSpend)}`,
        tone: 'spend',
      })
    }
    if (hasCount(lpv)) highlights.push({ label: 'Návštevy webu', value: fmtNum(lpv), hint: 'Z Meta reklám' })
    if (hasCount(totalClicks)) {
      highlights.push({
        label: 'Kliknutia',
        value: fmtNum(totalClicks),
        hint: `Meta ${fmtNum(metaClicks)} · Google ${fmtNum(googleClicks)}`,
      })
    }
    if (hasCount(conversions)) {
      highlights.push({
        label: 'Konverzie',
        value: fmtNum(conversions),
        hint: hasMoney(googleSpend) ? `Priemer ${fmtEur(googleSpend / conversions)} / konverziu` : null,
      })
    }
    return highlights.slice(0, 6)
  }

  const reach = metaSum(months, 'reach')
  const lpv = metaSum(months, 'landingPageViews')
  const clicks = metaSum(months, 'clicks')
  const engagements = metaSum(months, 'engagements')

  if (hasMoney(spend)) {
    highlights.push({ label: 'Investícia', value: fmtEur(spend), hint: 'Meta Ads', tone: 'spend' })
  }
  if (hasCount(reach)) highlights.push({ label: 'Dosah', value: fmtNum(reach), hint: 'Koľko ľudí videlo reklamu' })
  if (hasCount(lpv)) highlights.push({ label: 'Návštevy webu', value: fmtNum(lpv), hint: 'Z reklám na Meta' })
  if (hasCount(engagements)) highlights.push({ label: 'Interakcie', value: fmtNum(engagements), hint: 'Post engagement' })
  if (hasCount(clicks)) highlights.push({ label: 'Kliknutia', value: fmtNum(clicks), hint: null })

  return highlights.slice(0, 6)
}

function summaryPart(text, bold = false) {
  return { text, bold: !!bold }
}

/** Bežný text odseku v reporte. */
function sp(text) {
  return summaryPart(text, false)
}

/** Kľúčová metrika alebo pojem — v reporte sa zobrazí tučne. */
function sb(text) {
  return summaryPart(text, true)
}

function buildReportSummary(months, profile, agg) {
  const period = rangeLabel(months)
  const paragraphs = []

  if (profile === 'eshop') {
    const metaSpend = metaSum(months, 'spend')
    const googleSpend = googleSum(months, 'spend')
    const boostSpend = sum(months, (m) => m.boosting?.spend)
    const adSpend = (agg.adSpend ?? ((metaSpend ?? 0) + (googleSpend ?? 0) + (boostSpend ?? 0))) || null
    const metaValue = metaSum(months, 'purchaseValue')
    const googleValue = googleSum(months, 'purchaseValue')
    const adValue = ((metaValue ?? 0) + (googleValue ?? 0) + (sum(months, (m) => m.boosting?.value) ?? 0)) || null
    const email = aggregateEmail(months)
    const eshop = aggregateEshop(months)
    const ga = aggregateGa(months)
    const ctx = getGaReportContext(months)
    const metaRoas = metaSpend > 0 && metaValue ? metaValue / metaSpend : null
    const googleRoas = googleSpend > 0 && googleValue ? googleValue / googleSpend : null

    const introParts = [
      sp('Tento report za obdobie '),
      sb(period),
      sp(' spája výsledky z platených reklám, návštevnosti webu, e-mailového marketingu a predajov v e-shope. '),
    ]
    if (hasMoney(eshop?.netRevenue)) {
      introParts.push(
        sp('V e-shope ste dosiahli '),
        sb(`čisté predaje ${fmtEur(eshop.netRevenue)}`),
      )
      if (hasCount(eshop.orders)) {
        introParts.push(sp(' '), sb(skZ(eshop.orders, 'objednavka')))
      }
      introParts.push(sp('.'))
      if (hasMoney(eshop.revenue) && eshop.revenue !== eshop.netRevenue) {
        introParts.push(
          sp(' Celkové predaje vrátane daní a dopravy boli '),
          sb(fmtEur(eshop.revenue)),
          sp('.'),
        )
      }
    } else if (hasMoney(eshop?.revenue)) {
      introParts.push(sp('Tržby e-shopu boli '), sb(fmtEur(eshop.revenue)), sp('.'))
    } else {
      introParts.push(sp('Nižšie nájdete detailné metriky z jednotlivých kanálov.'))
    }
    if (hasCount(eshop?.items)) {
      introParts.push(sp(' Predali ste '), sb(skPhrase(eshop.items, 'polozka', 'acc')), sp('.'))
    }
    paragraphs.push(introParts)

    if (hasMoney(adSpend)) {
      const adsParts = [
        sp('Do platených reklám ste investovali spolu '),
        sb(fmtEur(adSpend)),
      ]
      const channels = []
      if (hasMoney(metaSpend)) channels.push(sb(`Meta Ads ${fmtEur(metaSpend)}`))
      if (hasMoney(googleSpend)) channels.push(sb(`Google Ads ${fmtEur(googleSpend)}`))
      if (hasMoney(boostSpend)) channels.push(sb(`boosting ${fmtEur(boostSpend)}`))
      if (channels.length) {
        adsParts.push(sp(' ('))
        channels.forEach((part, i) => {
          if (i > 0) adsParts.push(sp(', '))
          adsParts.push(part)
        })
        adsParts.push(sp(')'))
      }
      adsParts.push(sp('.'))
      if (hasMoney(adValue)) {
        adsParts.push(
          sp(' Podľa atribúcie reklamných platforiem priniesli kampane nákupy v hodnote '),
          sb(fmtEur(adValue)),
        )
        if (hasCount(agg.adPurchases)) {
          adsParts.push(sp(' ('), sb(skPhrase(agg.adPurchases, 'nakup', 'acc')), sp(')'))
        }
        if (agg.roas != null) {
          adsParts.push(
            sp(', čo zodpovedá návratnosti '),
            sb(`ROAS ${fmtRoas(agg.roas)}`),
            sp(' (na každé 1 € investície pripadá približne '),
            sb(`${fmtRoas(agg.roas)} €`),
            sp(' v hodnote nákupov)'),
          )
        }
        adsParts.push(sp('. '))
      }
      if (hasMoney(metaValue) && hasMoney(metaSpend)) {
        adsParts.push(
          sb('Meta Ads'),
          sp(' dosiahli hodnotu nákupov '),
          sb(fmtEur(metaValue)),
          sp(' pri investícii '),
          sb(fmtEur(metaSpend)),
        )
        if (metaRoas != null) adsParts.push(sp(' ('), sb(`ROAS ${fmtRoas(metaRoas)}`), sp(')'))
        adsParts.push(sp('. '))
      }
      if (hasMoney(googleValue) && hasMoney(googleSpend)) {
        adsParts.push(
          sb('Google Ads'),
          sp(' priniesli '),
          sb(fmtEur(googleValue)),
          sp(' hodnoty nákupov pri investícii '),
          sb(fmtEur(googleSpend)),
        )
        if (googleRoas != null) adsParts.push(sp(' ('), sb(`ROAS ${fmtRoas(googleRoas)}`), sp(')'))
        adsParts.push(sp('. '))
      }
      if (metaRoas != null && googleRoas != null && googleRoas >= metaRoas * 1.2) {
        adsParts.push(
          sb('Google Ads'),
          sp(' sa v tomto období ukázali efektívnejšie na priamu návratnosť investície. '),
          sb('Meta Ads'),
          sp(' dopĺňajú dosah na Facebooku a Instagrame a pomáhajú budovať povedomie o značke.'),
        )
      } else if (metaRoas != null && googleRoas != null && metaRoas >= googleRoas * 1.2) {
        adsParts.push(
          sb('Meta Ads'),
          sp(' priniesli lepšiu priamu návratnosť. '),
          sb('Google Ads'),
          sp(' dopĺňajú vyhľadávanie a zachytávajú zákazníkov s nákupným zámerom.'),
        )
      } else if (agg.roas != null && agg.roas >= 2) {
        adsParts.push(sp('Platená reklama sa v tomto období '), sb('ekonomicky vyplatila'), sp('.'))
      } else if (agg.roas != null && agg.roas < 1) {
        adsParts.push(
          sp('Priamu návratnosť reklám sledujte spolu s '),
          sb('celkovými tržbami e-shopu'),
          sp('. Zákazníci často nekonvertujú hneď z prvej reklamy, ale nakúpia neskôr cez iný kanál.'),
        )
      }
      paragraphs.push(adsParts)
    }

    if (hasCount(ga.totalSessions)) {
      const webParts = [
        sb('Google Analytics'),
        sp(ctx.hasGa4 ? ' (GA4) zaznamenal ' : ' zaznamenal '),
        sb(skPhrase(ga.totalSessions, ctx.hasGa4 ? 'relacia' : 'navsteva', 'acc')),
        sp(' na webe'),
      ]
      if (hasCount(ga.organicSessions) && hasCount(ga.paidSessions)) {
        const organicPct = (ga.organicSessions / ga.totalSessions) * 100
        webParts.push(
          sp('. '),
          sb('Organické kanály'),
          sp(' prispeli '),
          sb(skPhrase(ga.organicSessions, 'relacia', 'ins')),
          sp(' ('),
          sb(fmtPct(organicPct)),
          sp('), '),
          sb('platené kanály'),
          sp(' prispeli '),
          sb(skPhrase(ga.paidSessions, 'relacia', 'ins')),
        )
      }
      if (ctx.hasGa4 && ctx.snapshot?.totalRevenue) {
        webParts.push(
          sp('. Tržby merané v GA4 boli '),
          sb(fmtEur(ctx.snapshot.totalRevenue)),
          sp(' (iný spôsob merania než WooCommerce, čísla sa nemusia zhodovať)'),
        )
      }
      const topChannel = ctx.channels?.[0]
      if (topChannel) {
        webParts.push(
          sp('. Najsilnejší kanál podľa relácií: '),
          sb(topChannel.name),
          sp(' ('),
          sb(skPhrase(topChannel.sessions, 'relacia', 'gen')),
          sp(')'),
        )
      }
      if (ctx.isMixed) {
        webParts.push(sp('. Pre časť obdobia máme plný GA4 export, staršie mesiace vychádzajú zo zjednodušeného importu z PDF reportu'))
      }
      webParts.push(sp('.'))
      paragraphs.push(webParts)
    }

    if (email && (hasCount(email.sent) || hasMoney(email.revenue))) {
      const mailParts = [sb('E-mail marketing (Mailchimp)')]
      if (hasCount(email.sent)) mailParts.push(sp(' odoslal '), sb(fmtSkCount(email.sent, 'email')))
      if (email.avgOpen != null) mailParts.push(sp(' s priemernou otvorenosťou '), sb(fmtPct(email.avgOpen)))
      if (email.avgClick != null) mailParts.push(sp(' a click rate '), sb(fmtPct(email.avgClick, 2)))
      if (hasMoney(email.revenue)) {
        mailParts.push(sp('. Tržby priradené e-mailom boli '), sb(fmtEur(email.revenue)))
        if (hasCount(email.orders)) mailParts.push(sp(' '), sb(skZ(email.orders, 'objednavka')))
      }
      mailParts.push(sp('.'))
      paragraphs.push(mailParts)
    }

    if (hasMoney(eshop?.netRevenue) && hasMoney(adValue) && eshop.netRevenue > adValue) {
      const adShare = agg.adShareOfRevenue ?? (adValue / eshop.netRevenue * 100)
      paragraphs.push([
        sp('Len '),
        sb(fmtPct(adShare)),
        sp(' tržieb e-shopu je v tomto reporte priradených priamo plateným reklamám. Zvyšok prichádza z '),
        sb('organickej návštevnosti'),
        sp(', priameho vstupu na web, e-mailov, opakovaných zákazníkov alebo iných kanálov. To je bežné: zákazník môže reklamu vidieť, ale nakúpiť až neskôr cez vyhľadávanie alebo priamo na doméne.'),
      ])
    }

    if (ctx.hasGa4 && ctx.topProducts?.[0]) {
      const top = ctx.topProducts[0]
      paragraphs.push([
        sp('Najpredávanejší produkt podľa GA4 e-commerce dát: '),
        sb(`„${top.name}"`),
        sp(' ('),
        sb(`${fmtEur(top.revenue)} tržieb`),
        sp(').'),
      ])
    }

    if (eshop?.combinedShops?.length) {
      paragraphs.push([
        sb('Upozornenie:'),
        sp(` časť obdobia zahŕňa súhrnné dáta z viacerých e-shopov (${eshop.combinedShops.join(' + ')}).`),
      ])
    }
  } else if (profile === 'dual') {
    const metaSpend = metaSum(months, 'spend')
    const googleSpend = googleSum(months, 'spend')
    const totalSpend = (metaSpend ?? 0) + (googleSpend ?? 0) || null
    const lpv = metaSum(months, 'landingPageViews')
    const conversions = googleSum(months, 'conversions')
    const googleClicks = googleSum(months, 'clicks')
    const ga = aggregateGa(months)
    const ctx = getGaReportContext(months)

    const introParts = [
      sp('Report za obdobie '),
      sb(period),
      sp(' spája '),
      sb('Meta Ads'),
      sp(' a '),
      sb('Google Ads'),
      sp('. '),
    ]
    if (hasMoney(totalSpend)) {
      introParts.push(
        sp('Do reklám ste investovali spolu '),
        sb(fmtEur(totalSpend)),
      )
      const split = []
      if (hasMoney(metaSpend)) split.push(sb(`Meta ${fmtEur(metaSpend)}`))
      if (hasMoney(googleSpend)) split.push(sb(`Google ${fmtEur(googleSpend)}`))
      if (split.length) {
        introParts.push(sp(' ('))
        split.forEach((part, i) => {
          if (i > 0) introParts.push(sp(', '))
          introParts.push(part)
        })
        introParts.push(sp(')'))
      }
      introParts.push(sp('.'))
    }
    paragraphs.push(introParts)

    if (hasCount(lpv)) {
      let meta = skNavstevyZReklam(lpv, 'reklám na sociálnych sieťach (Meta Ads)')
      if (meta && hasMoney(metaSpend) && lpv > 0) {
        meta += ` Pri investícii ${fmtEur(metaSpend)} (priemer ${fmtEur(metaSpend / lpv)} / návštevu).`
      } else if (meta) {
        meta += '.'
      }
      if (meta) paragraphs.push([sb(meta)])
    }

    if (hasCount(conversions) || hasCount(googleClicks)) {
      const googleParts = [sb('Google Ads')]
      if (hasCount(googleClicks)) {
        googleParts.push(sp(' zaznamenali '), sb(skPhrase(googleClicks, 'kliknutie', 'acc')))
      }
      if (hasCount(conversions)) {
        googleParts.push(hasCount(googleClicks) ? sp(' a ') : sp(' zaznamenali '))
        googleParts.push(sb(skPhrase(conversions, 'konverzia', 'acc')))
        if (hasMoney(googleSpend) && conversions > 0) {
          googleParts.push(
            sp(' pri investícii '),
            sb(fmtEur(googleSpend)),
            sp(' (priemer '),
            sb(`${fmtEur(googleSpend / conversions)} / konverziu`),
            sp(')'),
          )
        }
      } else if (hasMoney(googleSpend)) {
        googleParts.push(sp(' pri investícii '), sb(fmtEur(googleSpend)))
      }
      googleParts.push(sp('.'))
      paragraphs.push(googleParts)
    }

    if (hasCount(ga.totalSessions)) {
      paragraphs.push([
        sp('Web mal '),
        sb(skPhrase(ga.totalSessions, ctx.hasGa4 ? 'relacia' : 'navsteva', 'acc')),
        sp(' podľa '),
        sb('Google Analytics'),
        sp(ctx.hasGa4 ? ' (GA4).' : '.'),
      ])
    }
  } else {
    const spend = metaSum(months, 'spend')
    const reach = metaSum(months, 'reach')
    const lpv = metaSum(months, 'landingPageViews')
    const clicks = metaSum(months, 'clicks')
    const engagements = metaSum(months, 'engagements')
    const ga = aggregateGa(months)
    const ctx = getGaReportContext(months)

    const introParts = [
      sp('Report za obdobie '),
      sb(period),
      sp(' sumarizuje výsledky reklám na '),
      sb('Meta (Facebook a Instagram)'),
      sp('. '),
    ]
    if (hasMoney(spend)) {
      introParts.push(sp('Investícia do reklám bola '), sb(fmtEur(spend)), sp('.'))
    }
    paragraphs.push(introParts)

    if (hasCount(reach)) {
      paragraphs.push([
        sb(skOsloviliLudi(reach)),
        sp(' ('),
        sb('dosah'),
        sp('). To ukazuje, koľko unikátnych ľudí videlo vašu značku v tomto období.'),
      ])
    }
    if (hasCount(lpv)) {
      const lpvParts = [sb(skNavstevyNaWeb(lpv))]
      if (hasMoney(spend) && lpv > 0) {
        lpvParts.push(sp(' pri priemernej cene '), sb(`${fmtEur(spend / lpv)} / návštevu`))
      }
      lpvParts.push(sp('.'))
      paragraphs.push(lpvParts)
    }
    if (hasCount(engagements)) {
      paragraphs.push([
        sb(skPhrase(engagements, 'interakcia', 'acc')),
        sp(' s príspevkami a reklamami (lajky, komentáre, zdieľania).'),
      ])
    }
    if (hasCount(clicks)) {
      paragraphs.push([
        sb(skPhrase(clicks, 'kliknutie', 'acc')),
        sp(' na odkazy v reklamách.'),
      ])
    }
    if (hasCount(ga.totalSessions)) {
      paragraphs.push([
        sb('Google Analytics'),
        sp(ctx.hasGa4 ? ' (GA4) zaznamenal ' : ' zaznamenal '),
        sb(skPhrase(ga.totalSessions, ctx.hasGa4 ? 'relacia' : 'navsteva', 'acc')),
        sp(' na webe za rovnaké obdobie.'),
      ])
    }
  }

  paragraphs.push([
    sp('Report spája dáta z reklamných účtov, Google Analytics, Mailchimpu a prípadne e-shopu. E-shopové metriky vychádzajú z ručného exportu a nemusia sa zhodovať 1:1 s analytikou v administrácii. Atribúcia konverzií a nákupov k reklamám závisí od meracích modelov jednotlivých platforiem (Meta, Google).'),
  ])

  const contentParagraphs = paragraphs.slice(0, -1)
  if (!contentParagraphs.length) return null

  return {
    title: 'Zhrnutie za obdobie',
    paragraphs,
  }
}

function buildOverview(months, profile, agg) {
  const highlights = buildHighlights(months, profile, agg)
  const charts = buildOverviewCharts(months, agg)

  if (!highlights.length && !charts.length) return null

  return {
    id: 'overview',
    title: 'Celkový prehľad',
    highlights,
    charts,
  }
}

function buildSections(months, profile, agg, client) {
  if (profile === 'eshop') {
    return [
      buildMetaSection(months, profile, client),
      buildBoostingSection(months),
      buildGoogleSection(months, profile, client),
      buildGaSection(months, client),
      buildEmailSection(months),
      buildEshopSection(months),
    ].filter(Boolean)
  }

  return [
    buildMetaSection(months, profile, client),
    buildBoostingSection(months),
    buildGoogleSection(months, profile, client),
    buildWebSection(months, client),
    buildEmailSection(months),
  ].filter(Boolean)
}

export function buildClientReport(client, months) {
  const profile = getReportProfile(client)
  const period = rangeLabel(months)
  const agg = profile === 'eshop' ? aggregate(months) : {}
  const sections = buildSections(months, profile, agg, client)
  const overview = buildOverview(months, profile, agg)
  const summary = buildReportSummary(months, profile, agg)

  return {
    profile,
    period,
    clientName: client.name,
    sections,
    overview,
    summary,
  }
}
