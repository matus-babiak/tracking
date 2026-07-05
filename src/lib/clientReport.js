import { aggregate, fmtEur, fmtNum, fmtPct, fmtRoas, monthLabel, rangeLabel, sum } from './helpers'
import { mergeCategoryRows } from './eshopMerge'
import { metricToneFromLabel } from './metricTone'
import { getClientUiProfile } from './clientMetrics'
import {
  ESHOP_GOOGLE_CONV_LABELS,
  getGoogleConvKeys,
  sumTrackedConversions,
} from './googleConversions'
import {
  fmtSkCount,
  skClicksSummary,
  skInterakcieSummary,
  skKonverzieSummary,
  skNavstevyZReklam,
  skReachSummary,
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
  const profile = getClientUiProfile(client)
  return profile === 'ads-eshop' ? 'eshop' : profile
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
    if (hasCount(c.purchases)) parts.push(fmtSkCount(c.purchases, 'nakup'))
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
  if (hasCount(c.clicks)) parts.push(fmtSkCount(c.clicks, 'kliknutie'))
  if (hasCount(c.landingPageViews)) parts.push(fmtSkCount(c.landingPageViews, 'navsteva'))
  if (hasCount(c.engagements)) parts.push(fmtSkCount(c.engagements, 'interakcia'))
  return {
    name: c.name,
    value: hasMoney(c.spend) ? fmtEur(c.spend) : '–',
    detail: parts.length ? parts.join(' · ') : null,
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
    ? 'Reklamy na sociálnych sieťach — dosah, kliknutia a nákupy.'
    : hasCount(metaSum(months, 'landingPageViews'))
      ? 'Prehľad výsledkov reklamných kampaní — dosah, návštevy a interakcie.'
      : 'Prehľad výsledkov reklamných kampaní — dosah a interakcie.'

  const topCampaigns = pickTopCampaigns(months, 'meta', isEshop ? 'eshop' : 'leadgen', client)

  const metrics = isEshop
    ? pickMetrics(rows, ['Investícia', 'Hodnota nákupov', 'Návratnosť', 'Počet nákupov'])
    : pickMetrics(rows, ['Investícia', 'Dosah', 'Návštevy webu', 'Interakcie', 'Kliknutia'])

  return {
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
    ? 'Vyhľadávanie a Performance Max — zobrazenia, kliknutia, konverzie a nákupy.'
    : 'Vyhľadávanie — kliknutia, telefónne hovory a formuláre.'

  const topCampaigns = pickTopCampaigns(months, 'google', isEshop ? 'eshop' : 'leadgen', client)

  const metrics = isEshop
    ? pickMetrics(rows, ['Investícia', 'Hodnota nákupov', 'Návratnosť', 'Počet nákupov'])
    : pickMetrics(rows, ['Investícia', 'Kliknutia', 'Konverzie celkom'])

  return {
    title: 'Google Ads',
    accent: 'google',
    intro,
    metrics,
    rows,
    topCampaigns,
    charts: buildGoogleCharts(months, { isEshop }),
  }
}

function buildGaSection(months) {
  const ctx = getGaReportContext(months)
  const ga = aggregateGa(months)
  const snapshot = ctx.snapshot
  const ga4Label = ctx.hasGa4 ? ga4ExportPeriodLabel(ctx.ga4Months) : null
  const ga4Hint = ga4Label ? `GA4 export — ${ga4Label}` : null
  const legacyHint = ctx.hasLegacy ? 'PDF report — starší import' : null

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
      ? row('Používatelia — platená', fmtNum(ga.paidUsers))
      : null,
    !ctx.hasGa4 && ga.organicUsers != null && hasCount(ga.organicUsers)
      ? row('Používatelia — organická', fmtNum(ga.organicUsers))
      : null,
    !ctx.hasGa4 && ga.paidEngagement != null
      ? row('Miera interakcie — platená', fmtPct(ga.paidEngagement))
      : null,
    !ctx.hasGa4 && ga.organicEngagement != null
      ? row('Miera interakcie — organická', fmtPct(ga.organicEngagement))
      : null,
    snapshot?.engagementRate != null
      ? row('Engagement rate', fmtEngagementRate(snapshot.engagementRate), ga4Hint)
      : null,
    snapshot?.totalRevenue != null && hasMoney(snapshot.totalRevenue)
      ? row('Tržby (GA4)', fmtEur(snapshot.totalRevenue), ga4Hint)
      : null,
    snapshot?.keyEvents != null && hasCount(snapshot.keyEvents)
      ? row('Kľúčové udalosti', fmtNum(snapshot.keyEvents), ga4Hint)
      : null,
  ].filter(Boolean)

  if (!rows.length) return null

  let intro = 'Návštevnosť webu — platená vs. organická návštevnosť a miera interakcie.'
  if (ctx.isGa4Only) {
    intro = 'Návštevnosť webu z GA4 exportov — relácie podľa kanálov, používatelia a tržby.'
  } else if (ctx.isMixed) {
    intro = `GA4 CSV export za ${ga4Label}; staršie mesiace majú zjednodušený import z PDF reportu.`
  } else if (ctx.hasGa4) {
    intro = 'Návštevnosť webu z GA4 exportov podľa kanálov.'
  }

  const metrics = ctx.hasGa4
    ? pickMetrics(rows, ['Relácie', 'Aktívni používatelia', 'Tržby (GA4)', 'Kľúčové udalosti'])
    : pickMetrics(rows, [
        'Návštevy webu celkom',
        'Platená návštevnosť',
        'Organická návštevnosť',
        'Miera interakcie — organická',
      ])

  return {
    title: 'Google Analytics',
    accent: 'analytics',
    intro,
    metrics,
    rows,
    topCampaigns: pickTopGaChannels(ctx),
    topProducts: pickTopGaProducts(ctx),
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
    ? 'Predaje a objednávky z WooCommerce — súhrn za zvolené obdobie.'
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
    title: 'E-shop',
    accent: 'eshop',
    intro,
    metrics,
    rows,
    charts: buildEshopCharts(months),
  }
}

function buildWebSection(months) {
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
    snapshot?.totalRevenue != null && hasMoney(snapshot.totalRevenue)
      ? row('Tržby (GA4)', fmtEur(snapshot.totalRevenue))
      : null,
  ].filter(Boolean)

  if (!rows.length) return null

  const hasEshop = hasMoney(eshop?.revenue) || hasCount(eshop?.orders)
  return {
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
    title: 'E-mail marketing (Mailchimp)',
    accent: 'email',
    intro: 'Newsletter a automatické e-maily — odoslanie, otvorenosť a tržby.',
    metrics,
    rows,
    charts: buildEmailCharts(months),
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
      })
    }
    if (hasEshopAds && hasMoney(adValue)) {
      highlights.push({
        label: 'Hodnota nákupov z reklám',
        value: fmtEur(adValue),
        hint: hasCount(agg.adPurchases) ? fmtSkCount(agg.adPurchases, 'nakup') : null,
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
      })
    } else if (hasMoney(agg.eshopRevenue)) {
      highlights.push({
        label: 'Tržby e-shopu',
        value: fmtEur(agg.eshopRevenue),
        hint: agg.adShareOfRevenue != null ? `${fmtPct(agg.adShareOfRevenue)} z reklám` : null,
      })
    }
    if (hasCount(eshop?.orders)) {
      highlights.push({
        label: 'Objednávky e-shopu',
        value: fmtNum(eshop.orders),
        hint: hasCount(eshop.items) ? `${fmtNum(eshop.items)} predaných položiek` : null,
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
        hint: hasCount(email.orders) ? fmtSkCount(email.orders, 'objednavka') : 'Mailchimp',
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

function buildOverviewRows(months, profile, agg) {
  if (profile !== 'eshop') return []

  const email = aggregateEmail(months)
  const eshop = aggregateEshop(months)
  const ga = aggregateGa(months)
  const ctx = getGaReportContext(months)

  return [
    hasMoney(agg.adSpend) ? row('Investícia do reklám celkom', fmtEur(agg.adSpend)) : null,
    hasMoney(agg.adValue) ? row('Hodnota nákupov z reklám', fmtEur(agg.adValue)) : null,
    agg.roas != null ? row('Návratnosť reklám (ROAS)', fmtRoas(agg.roas)) : null,
    agg.pno != null ? row('PNO (podiel nákladov)', fmtPct(agg.pno)) : null,
    hasMoney(eshop?.revenue) ? row('Celkové predaje e-shopu', fmtEur(eshop.revenue)) : null,
    hasMoney(eshop?.netRevenue) ? row('Čisté predaje e-shopu', fmtEur(eshop.netRevenue)) : null,
    hasCount(eshop?.orders) ? row('Objednávky e-shopu', fmtNum(eshop.orders)) : null,
    hasCount(eshop?.items) ? row('Predané položky', fmtNum(eshop.items)) : null,
    hasCount(ga.totalSessions) ? row(ctx.hasGa4 ? 'Relácie (GA4)' : 'Návštevy webu (GA)', fmtNum(ga.totalSessions)) : null,
    hasMoney(email?.revenue) ? row('Tržby z e-mailov', fmtEur(email.revenue)) : null,
  ].filter(Boolean)
}

function buildSummaryCallout(months, profile, agg, client) {
  if (profile !== 'eshop') {
    const text = buildComprehensiveSummary(months, profile, agg, client)[0]
    return text ? { lead: [summaryPart(text)], blocks: [], note: null } : null
  }

  const email = aggregateEmail(months)
  const eshop = aggregateEshop(months)
  const ga = aggregateGa(months)
  const ctx = getGaReportContext(months)
  const metaSpend = metaSum(months, 'spend')
  const metaValue = metaSum(months, 'purchaseValue')
  const googleSpend = googleSum(months, 'spend')
  const googleValue = googleSum(months, 'purchaseValue')
  const period = rangeLabel(months)

  const lead = []
  if (hasMoney(eshop?.netRevenue)) {
    lead.push(
      summaryPart('Za obdobie '),
      summaryPart(period, true),
      summaryPart(' dosiahli ste '),
      summaryPart('čisté predaje ', true),
      summaryPart(fmtEur(eshop.netRevenue), true),
      summaryPart(hasCount(eshop.orders) ? ` z ${fmtSkCount(eshop.orders, 'objednavka')}.` : '.'),
    )
  } else if (hasMoney(eshop?.revenue)) {
    lead.push(
      summaryPart('Za obdobie '),
      summaryPart(period, true),
      summaryPart(' dosiahli ste tržby e-shopu '),
      summaryPart(fmtEur(eshop.revenue), true),
      summaryPart('.'),
    )
  } else {
    lead.push(summaryPart(`Prehľad marketingových výsledkov za ${period}.`))
  }

  const blocks = []

  if (hasMoney(agg.adSpend)) {
    blocks.push({
      title: 'Platená reklama',
      lines: [[
        summaryPart('Investícia '),
        summaryPart(fmtEur(agg.adSpend), true),
        summaryPart(' (Meta '),
        summaryPart(fmtEur(metaSpend), true),
        summaryPart(' · Google '),
        summaryPart(fmtEur(googleSpend), true),
        summaryPart(') priniesla nákupy v hodnote '),
        summaryPart(fmtEur(agg.adValue), true),
        summaryPart(agg.roas != null ? ` — ROAS ${fmtRoas(agg.roas)}.` : '.'),
      ]],
    })
  }

  if (hasMoney(metaValue) || hasMoney(googleValue)) {
    const lines = []
    if (hasMoney(metaValue)) {
      lines.push([
        summaryPart('Meta Ads: '),
        summaryPart(fmtEur(metaValue), true),
        summaryPart(' hodnoty nákupov pri investícii '),
        summaryPart(fmtEur(metaSpend), true),
        summaryPart(metaSpend > 0 ? ` (ROAS ${fmtRoas(metaValue / metaSpend)}).` : '.'),
      ])
    }
    if (hasMoney(googleValue)) {
      lines.push([
        summaryPart('Google Ads: '),
        summaryPart(fmtEur(googleValue), true),
        summaryPart(' hodnoty nákupov pri investícii '),
        summaryPart(fmtEur(googleSpend), true),
        summaryPart(googleSpend > 0 ? ` (ROAS ${fmtRoas(googleValue / googleSpend)}).` : '.'),
      ])
    }
    if (lines.length) blocks.push({ title: 'Kanály', lines })
  }

  if (hasCount(ga.totalSessions)) {
    const parts = [
      summaryPart('Google Analytics zaznamenal '),
      summaryPart(fmtNum(ga.totalSessions), true),
      summaryPart(ctx.hasGa4 ? ' relácií' : ' návštev'),
    ]
    if (ctx.hasGa4 && ctx.snapshot?.totalRevenue) {
      parts.push(summaryPart(' a tržby '), summaryPart(fmtEur(ctx.snapshot.totalRevenue), true))
    }
    if (hasCount(ga.organicSessions) && hasCount(ga.paidSessions)) {
      parts.push(
        summaryPart(' — organické kanály '),
        summaryPart(fmtNum(ga.organicSessions), true),
        summaryPart(', platené '),
        summaryPart(fmtNum(ga.paidSessions), true),
      )
    }
    parts.push(summaryPart('.'))
    blocks.push({ title: 'Web', lines: [parts] })
  }

  if (email && (hasMoney(email.revenue) || hasCount(email.sent))) {
    blocks.push({
      title: 'E-mail',
      lines: [[
        hasCount(email.sent) ? summaryPart(fmtSkCount(email.sent, 'email')) : summaryPart('Kampane'),
        summaryPart(' odoslaných'),
        email.avgOpen != null ? summaryPart(', open rate ') : null,
        email.avgOpen != null ? summaryPart(fmtPct(email.avgOpen), true) : null,
        hasMoney(email.revenue) ? summaryPart(', tržby ') : null,
        hasMoney(email.revenue) ? summaryPart(fmtEur(email.revenue), true) : null,
        summaryPart('.'),
      ].filter(Boolean)],
    })
  }

  if (eshop && (hasMoney(eshop.revenue) || hasCount(eshop.orders))) {
    blocks.push({
      title: 'E-shop',
      lines: [[
        summaryPart('Celkové predaje '),
        summaryPart(fmtEur(eshop.revenue), true),
        hasMoney(eshop.netRevenue) ? summaryPart(', čisté predaje ') : null,
        hasMoney(eshop.netRevenue) ? summaryPart(fmtEur(eshop.netRevenue), true) : null,
        hasCount(eshop.items) ? summaryPart(`, ${fmtNum(eshop.items)} predaných položiek`) : null,
        summaryPart('.'),
      ].filter(Boolean)],
    })
  }

  const note = 'Report spája dáta z reklamných účtov, Google Analytics, Mailchimpu a WooCommerce. '
    + 'E-shopové metriky sú ručne exportované — nemusia zodpovedať 1:1 analytike v administrácii. '
    + 'Atribúcia nákupov k reklamám závisí od meracích modelov platformy.'

  return { lead, blocks, note }
}

function buildReportHook(months, profile, agg) {
  const period = rangeLabel(months)
  if (profile === 'eshop' && hasMoney(agg.eshopRevenue)) {
    return `Jeden prehľad za ${period} — reklama, návštevnosť webu, e-mail a predaje e-shopu bez prepínania medzi nástrojmi.`
  }
  return `Marketingový report za ${period} — prehľadne a bez zbytočného šumu.`
}

function buildComprehensiveSummary(months, profile, agg, client) {
  const email = aggregateEmail(months)
  const eshop = aggregateEshop(months)
  const ga = aggregateGa(months)
  const paragraphs = []

  if (profile === 'eshop') {
    const metaSpend = metaSum(months, 'spend')
    const metaValue = metaSum(months, 'purchaseValue')
    const metaPurchases = metaSum(months, 'purchases')
    const googleSpend = googleSum(months, 'spend')
    const googleValue = googleSum(months, 'purchaseValue')
    const googlePurchases = googleSum(months, 'purchases')
    const convKeys = getGoogleConvKeys(client)

    if (hasMoney(metaSpend)) {
      let p = `Meta Ads (Facebook a Instagram): investícia ${fmtEur(metaSpend)}`
      if (hasMoney(metaValue)) {
        p += `, hodnota nákupov ${fmtEur(metaValue)}`
        if (hasCount(metaPurchases)) p += ` (${fmtSkCount(metaPurchases, 'nakup')})`
        if (metaSpend > 0) p += `, ROAS ${fmtRoas(metaValue / metaSpend)}`
      }
      if (hasCount(metaSum(months, 'reach'))) {
        p += `. Dosah ${fmtNum(metaSum(months, 'reach'))} ľudí`
      }
      if (hasCount(metaSum(months, 'clicks'))) {
        p += `, ${fmtSkCount(metaSum(months, 'clicks'), 'kliknutie')}`
      }
      paragraphs.push(`${p}.`)
    }

    if (hasMoney(googleSpend)) {
      let p = `Google Ads: investícia ${fmtEur(googleSpend)}`
      if (hasMoney(googleValue)) {
        p += `, hodnota nákupov ${fmtEur(googleValue)}`
        if (hasCount(googlePurchases)) p += ` (${fmtDec(googlePurchases)} nákupov)`
        if (googleSpend > 0) p += `, ROAS ${fmtRoas(googleValue / googleSpend)}`
      }
      if (convKeys) {
        const actions = []
        for (const m of months) {
          if (!m.google?.conversionActions) continue
          for (const key of convKeys) {
            if (m.google.conversionActions[key] != null) {
              actions[key] = (actions[key] ?? 0) + m.google.conversionActions[key]
            }
          }
        }
        const funnel = convKeys
          .filter((k) => hasCount(actions[k]))
          .map((k) => `${ESHOP_GOOGLE_CONV_LABELS[k]} ${fmtDec(actions[k])}`)
        if (funnel.length) p += `. Konverzný lievik: ${funnel.join(' → ')}`
      }
      paragraphs.push(`${p}.`)
    }

    if (hasMoney(agg.adSpend) && (hasMoney(metaSpend) || hasMoney(googleSpend))) {
      let p = `Platená reklama celkom: investícia ${fmtEur(agg.adSpend)}`
      if (hasMoney(agg.adValue)) {
        p += `, hodnota nákupov ${fmtEur(agg.adValue)}`
        if (agg.roas != null) p += ` (ROAS ${fmtRoas(agg.roas)})`
      }
      if (hasMoney(eshop?.netRevenue) && hasMoney(agg.adValue)) {
        p += `. Podiel hodnoty nákupov z reklám voči čistým predajom e-shopu: ${fmtPct(agg.adShareOfRevenue)}`
      }
      paragraphs.push(`${p}.`)
    }

    if (hasCount(ga.totalSessions)) {
      const ctx = getGaReportContext(months)
      let p = ctx.hasGa4
        ? `Google Analytics (GA4 export): ${fmtSkCount(ga.totalSessions, 'relacia')} webu`
        : `Google Analytics: ${fmtSkCount(ga.totalSessions, 'navsteva')} webu`
      if (hasCount(ga.paidSessions) && hasCount(ga.organicSessions)) {
        p += ctx.hasGa4
          ? ` (organické kanály ${fmtNum(ga.organicSessions)}, platené ${fmtNum(ga.paidSessions)})`
          : ` (platená ${fmtNum(ga.paidSessions)}, organická ${fmtNum(ga.organicSessions)})`
      }
      if (ctx.snapshot?.totalRevenue) {
        p += `. Tržby v GA4 ${fmtEur(ctx.snapshot.totalRevenue)}`
      }
      if (!ctx.hasGa4 && ga.organicEngagement != null) {
        p += `. Organická miera interakcie ${fmtPct(ga.organicEngagement)}`
        if (ga.paidEngagement != null) p += `, platená ${fmtPct(ga.paidEngagement)}`
      } else if (ctx.snapshot?.engagementRate != null) {
        p += `. Engagement rate ${fmtEngagementRate(ctx.snapshot.engagementRate)}`
      }
      const topChannel = ctx.channels[0]
      if (topChannel) {
        p += `. Najsilnejší kanál: ${topChannel.name} (${fmtNum(topChannel.sessions)} relácií)`
      }
      paragraphs.push(`${p}.`)
    }

    if (email && (hasCount(email.sent) || hasMoney(email.revenue))) {
      let p = 'E-mail marketing (Mailchimp)'
      if (hasCount(email.sent)) p += `: ${fmtSkCount(email.sent, 'email')} odoslaných`
      if (email.avgOpen != null) p += `, priemerná otvorenosť ${fmtPct(email.avgOpen)}`
      if (hasMoney(email.revenue)) {
        p += `, tržby ${fmtEur(email.revenue)}`
        if (hasCount(email.orders)) p += ` z ${fmtSkCount(email.orders, 'objednavka')}`
      }
      paragraphs.push(`${p}.`)
    }

    if (eshop && (hasMoney(eshop.revenue) || hasCount(eshop.orders))) {
      let p = 'E-shop'
      if (hasMoney(eshop.revenue)) p += `: celkové predaje ${fmtEur(eshop.revenue)}`
      if (hasMoney(eshop.netRevenue)) p += `, čisté predaje ${fmtEur(eshop.netRevenue)}`
      if (hasCount(eshop.orders)) p += `, ${fmtSkCount(eshop.orders, 'objednavka')}`
      if (hasCount(eshop.items)) p += `, ${fmtNum(eshop.items)} predaných položiek`
      if (eshop.combinedShops.length) {
        p += `. Upozornenie: časť obdobia zahŕňa súčet viacerých e-shopov (${eshop.combinedShops.join(' + ')})`
      }
      paragraphs.push(`${p}.`)
    }

    if (paragraphs.length) {
      paragraphs.push(
        'Report spája dáta z reklamných účtov, Google Analytics, Mailchimpu a WooCommerce. '
        + 'E-shopové rebríčky a niektoré metriky sú ručne exportované — nemusia zodpovedať 1:1 kompletnej analytike v administrácii. '
        + 'Atribúcia nákupov k reklamám závisí od meracích modelov platformy.',
      )
    }

    return paragraphs
  }

  const fallback = buildSummary(months, profile, agg, buildHighlights(months, profile, agg))
  return fallback ? [fallback] : []
}

function buildSummary(months, profile, agg, highlights) {
  const parts = []
  const email = aggregateEmail(months)

  if (profile === 'eshop') {
    if (hasMoney(agg.adSpend)) parts.push(`Do online reklám sme za zvolené obdobie investovali ${fmtEur(agg.adSpend)}.`)
    const hasEshopAds = hasMoney(agg.adValue) || hasCount(agg.adPurchases)
    if (hasEshopAds && hasMoney(agg.adValue)) {
      parts.push(
        `Reklamy priniesli nákupy v hodnote ${fmtEur(agg.adValue)}`
        + (hasCount(agg.adPurchases) ? ` (${fmtSkCount(agg.adPurchases, 'nakup')})` : '')
        + '.',
      )
    }
    if (hasEshopAds && agg.roas != null) {
      parts.push(`Na každé 1 € investované do reklám pripadá približne ${fmtRoas(agg.roas)} € v hodnote nákupov.`)
    }
    if (hasMoney(agg.eshopRevenue)) parts.push(`Celkové tržby e-shopu boli ${fmtEur(agg.eshopRevenue)}.`)
    if (hasMoney(email?.revenue)) {
      parts.push(
        `E-mail marketing (Mailchimp) priniesol tržby ${fmtEur(email.revenue)}`
        + (hasCount(email.orders) ? ` z ${fmtSkCount(email.orders, 'objednavka')}` : '')
        + '.',
      )
    }
  } else if (profile === 'dual') {
    const totalSpend = (metaSum(months, 'spend') ?? 0) + (googleSum(months, 'spend') ?? 0)
    const lpv = metaSum(months, 'landingPageViews')
    const conversions = googleSum(months, 'conversions')
    if (hasMoney(totalSpend)) parts.push(`Do online reklám sme investovali ${fmtEur(totalSpend)} (Meta + Google).`)
    const lpvSentence = skNavstevyZReklam(lpv, 'Meta reklám')
    if (lpvSentence) parts.push(lpvSentence)
    const convSentence = skKonverzieSummary(conversions)
    if (convSentence) parts.push(convSentence)
  } else {
    const spend = metaSum(months, 'spend')
    const reach = metaSum(months, 'reach')
    const lpv = metaSum(months, 'landingPageViews')
    const clicks = metaSum(months, 'clicks')
    const engagements = metaSum(months, 'engagements')
    if (hasMoney(spend)) parts.push(`Do reklám na Meta sme investovali ${fmtEur(spend)}.`)
    const reachSentence = skReachSummary(reach)
    if (reachSentence) parts.push(reachSentence)
    const lpvSentence = skNavstevyZReklam(lpv, 'reklám')
    if (lpvSentence) parts.push(lpvSentence)
    const interSentence = skInterakcieSummary(engagements)
    if (interSentence) parts.push(interSentence)
    const clicksSentence = skClicksSummary(clicks)
    if (clicksSentence) parts.push(clicksSentence)
  }

  if (!parts.length) {
    return highlights.length
      ? 'Nižšie nájdete prehľad kľúčových čísel za zvolené obdobie.'
      : 'Za zvolené obdobie zatiaľ nemáme kompletné dáta pre zhrnutie.'
  }

  return parts.join(' ')
}

function monthAdRoas(m) {
  const spend = (m.meta?.spend ?? 0) + (m.google?.spend ?? 0) + (m.boosting?.spend ?? 0)
  const value = (m.meta?.purchaseValue ?? 0) + (m.google?.purchaseValue ?? 0) + (m.boosting?.value ?? 0)
  return spend > 0 ? value / spend : null
}

function detectGaAnomalyMonth(months) {
  for (const m of months) {
    const paid = m.ga?.paid?.sessions ?? 0
    const organic = m.ga?.organic?.sessions ?? 0
    const engagement = m.ga?.paid?.engagementRate
    if (paid > 50000 && paid > organic * 2.5 && engagement != null && engagement < 15) {
      return monthLabel(m)
    }
  }
  return null
}

function topCategoryShare(months) {
  const categories = mergeCategoryRows(months.flatMap((m) => m.eshop?.categories ?? []))
  const total = sum(categories, (c) => c.netRevenue)
  if (!total || !categories.length) return null
  const top = categories[0]
  return { name: top.name, share: top.netRevenue / total, revenue: top.netRevenue }
}

function buildEshopInsights(months, agg) {
  const strengths = []
  const watchouts = []
  const recommendations = []
  const verdict = []

  const metaSpend = agg.metaSpend ?? 0
  const googleSpend = agg.googleSpend ?? 0
  const metaRoas = metaSpend > 0 && agg.metaValue != null ? agg.metaValue / metaSpend : null
  const googleRoas = googleSpend > 0 && agg.googleValue != null ? agg.googleValue / googleSpend : null
  const email = aggregateEmail(months)
  const eshop = aggregateEshop(months)
  const ga = aggregateGa(months)
  const ctx = getGaReportContext(months)

  if (agg.roas != null) {
    if (agg.roas >= 2) {
      verdict.push(
        summaryPart('Reklama sa '),
        summaryPart('vypláca', true),
        summaryPart(` (ROAS ${fmtRoas(agg.roas)}). `),
      )
    } else if (agg.roas >= 1) {
      verdict.push(
        summaryPart('Reklama je '),
        summaryPart('na hranici rentability', true),
        summaryPart(` (ROAS ${fmtRoas(agg.roas)}). `),
      )
    } else {
      verdict.push(
        summaryPart('Reklama v atribúcii '),
        summaryPart('nevracia investíciu', true),
        summaryPart(` (ROAS ${fmtRoas(agg.roas)}). `),
      )
    }
  }

  if (metaRoas != null && googleRoas != null && metaSpend >= 100 && googleSpend >= 100) {
    if (googleRoas >= metaRoas * 1.25) {
      verdict.push(
        summaryPart('Najsilnejší kanál je '),
        summaryPart('Google Ads', true),
        summaryPart(` (ROAS ${fmtRoas(googleRoas)} vs Meta ${fmtRoas(metaRoas)}). `),
      )
      strengths.push(`Google Ads má ROAS ${fmtRoas(googleRoas)} — výrazne lepší než Meta (${fmtRoas(metaRoas)}).`)
      if (metaSpend > googleSpend * 1.5) {
        recommendations.push('Google prináša lepšiu návratnosť — zvážiť posun časti rozpočtu z Meta na Google Ads.')
      }
    } else if (metaRoas >= googleRoas * 1.25) {
      verdict.push(
        summaryPart('Najsilnejší kanál je '),
        summaryPart('Meta Ads', true),
        summaryPart(` (ROAS ${fmtRoas(metaRoas)} vs Google ${fmtRoas(googleRoas)}). `),
      )
      strengths.push(`Meta Ads má ROAS ${fmtRoas(metaRoas)} — lepší než Google (${fmtRoas(googleRoas)}).`)
    }
  } else if (googleRoas != null && googleRoas >= 3 && googleSpend >= 100) {
    strengths.push(`Google Ads dosahuje ROAS ${fmtRoas(googleRoas)} pri investícii ${fmtEur(googleSpend)}.`)
  } else if (metaRoas != null && metaRoas >= 3 && metaSpend >= 100) {
    strengths.push(`Meta Ads dosahuje ROAS ${fmtRoas(metaRoas)} pri investícii ${fmtEur(metaSpend)}.`)
  }

  if (hasMoney(eshop?.netRevenue) && hasMoney(agg.adValue) && eshop.netRevenue > agg.adValue * 1.2) {
    const organicShare = agg.adShareOfRevenue != null ? 100 - agg.adShareOfRevenue : null
    verdict.push(
      summaryPart('Väčšina tržieb e-shopu prichádza '),
      summaryPart('mimo priamej atribúcie reklám', true),
      summaryPart('.'),
    )
    if (organicShare != null && organicShare >= 50) {
      strengths.push(`Len ${fmtPct(agg.adShareOfRevenue)} tržieb e-shopu ide z reklám — silná organická a priama návštevnosť.`)
    }
  }

  if (agg.roas != null && agg.roas >= 2.5) {
    if (!strengths.some((s) => s.includes('ROAS'))) {
      strengths.push(`Celkový ROAS ${fmtRoas(agg.roas)} — reklama prináša merateľné tržby nad investíciou.`)
    }
  }

  if (hasCount(ga.totalSessions) && hasCount(ga.organicSessions)) {
    const organicPct = (ga.organicSessions / ga.totalSessions) * 100
    const organicLabel = ctx.hasGa4 ? 'Organické kanály' : 'Organická návštevnosť'
    if (organicPct >= 45) {
      strengths.push(`${organicLabel} tvorí ${fmtPct(organicPct)} relácií — značka má dosah aj mimo platených kanálov.`)
    } else if (organicPct <= 25 && ga.paidSessions > ga.organicSessions) {
      watchouts.push(`Platené kanály dominujú (${fmtPct(100 - organicPct)} relácií) — vysoká závislosť od reklám.`)
    }
  }

  if (email && hasMoney(email.revenue) && email.revenue >= 200) {
    const hint = email.avgOpen != null ? ` pri open rate ${fmtPct(email.avgOpen)}` : ''
    strengths.push(`E-mail marketing priniesol ${fmtEur(email.revenue)} tržieb${hint}.`)
  } else if (email && email.avgOpen != null && email.avgOpen >= 18 && (!email.revenue || email.revenue < 200)) {
    watchouts.push(`Open rate ${fmtPct(email.avgOpen)} je solídny, ale tržby z e-mailov sú nízke — priestor pre lepšie CTA a produktové bloky.`)
    recommendations.push('Posilniť predajné výzvy a produktové sekcie v newslettri — otvorenosť je dobrá, chýba konverzia.')
  }

  if (months.length >= 3) {
    const roasByMonth = months
      .map((m) => ({ label: monthLabel(m), roas: monthAdRoas(m) }))
      .filter((r) => r.roas != null)
    if (roasByMonth.length >= 2) {
      const best = roasByMonth.reduce((a, b) => (b.roas > a.roas ? b : a))
      const avg = roasByMonth.reduce((s, r) => s + r.roas, 0) / roasByMonth.length
      if (best.roas >= avg * 1.4 && best.roas >= 2) {
        strengths.push(`${best.label}: ROAS ${fmtRoas(best.roas)} — najlepší mesiac v zvolenom období.`)
      }
      const last = roasByMonth[roasByMonth.length - 1]
      if (last.roas < avg * 0.7 && avg >= 1.5) {
        watchouts.push(`${last.label} mal ROAS ${fmtRoas(last.roas)} vs priemer ${fmtRoas(avg)} — skontrolovať kampane a sezónnosť.`)
      }
    }
  }

  if (agg.pno != null && agg.pno > 40) {
    watchouts.push(`PNO ${fmtPct(agg.pno)} — vysoký podiel nákladov voči tržbám z reklám.`)
  }

  if (metaRoas != null && metaRoas < 1.5 && metaSpend >= 300) {
    watchouts.push(`Meta Ads ROAS ${fmtRoas(metaRoas)} — pod cieľom; skontrolovať cielenie a produktové sety.`)
    if (!recommendations.some((r) => r.includes('Meta'))) {
      recommendations.push('Optimalizovať Meta kampane (creatives, audience, produktové katalógy) pred ďalším zvyšovaním rozpočtu.')
    }
  }

  const catShare = topCategoryShare(months)
  if (catShare && catShare.share >= 0.35) {
    watchouts.push(`Kategória „${catShare.name}" tvorí ${fmtPct(catShare.share * 100)} predaja — vysoká koncentrácia.`)
  }

  const gaAnomaly = detectGaAnomalyMonth(months)
  if (gaAnomaly) {
    watchouts.push(`${gaAnomaly}: extrémna platená návštevnosť s nízkou interakciou — pravdepodobne bot traffic, nepočítať ako reálny rast.`)
  }

  if (hasCount(ga.totalSessions) && hasCount(ga.organicSessions)) {
    const organicPct = (ga.organicSessions / ga.totalSessions) * 100
    if (organicPct >= 50 && !recommendations.length) {
      recommendations.push('Organická návštevnosť je silná — investovať do obsahu a SEO, nie len do PPC.')
    }
  }

  if (ctx.hasGa4 && ctx.topProducts[0] && !strengths.some((s) => s.includes('produkt'))) {
    const top = ctx.topProducts[0]
    strengths.push(`Najpredávanejší produkt v GA4: „${top.name}" (${fmtEur(top.revenue)}).`)
  }

  if (catShare && catShare.share >= 0.35 && !recommendations.some((r) => r.includes('kategóri'))) {
    recommendations.push(`Rozšíriť kampane aj mimo kategórie „${catShare.name}" — znížiť závislosť od jedného segmentu.`)
  }

  return {
    verdict: verdict.length ? verdict : null,
    strengths: strengths.slice(0, 3),
    watchouts: watchouts.slice(0, 2),
    recommendations: recommendations.slice(0, 2),
  }
}

function buildLeadgenInsights(months, profile, agg) {
  const strengths = []
  const watchouts = []
  const recommendations = []
  const verdict = []

  const metaSpend = metaSum(months, 'spend')
  const googleSpend = googleSum(months, 'spend')
  const totalSpend = (metaSpend ?? 0) + (googleSpend ?? 0)
  const lpv = metaSum(months, 'landingPageViews')
  const conversions = googleSum(months, 'conversions')
  const clicks = (metaSum(months, 'clicks') ?? 0) + (googleSum(months, 'clicks') ?? 0)

  if (hasMoney(totalSpend) && hasCount(conversions)) {
    verdict.push(
      summaryPart('Investícia '),
      summaryPart(fmtEur(totalSpend), true),
      summaryPart(` priniesla ${fmtSkCount(conversions, 'konverzia')}. `),
    )
  } else if (hasMoney(totalSpend)) {
    verdict.push(summaryPart(`Do reklám investované ${fmtEur(totalSpend)} za zvolené obdobie.`))
  }

  if (hasCount(lpv) && totalSpend > 0) {
    const cpl = totalSpend / lpv
    strengths.push(`${fmtSkCount(lpv, 'navsteva')} z reklám pri cene ${fmtEur(cpl)} / návštevu.`)
  }

  if (hasCount(conversions) && totalSpend > 0) {
    strengths.push(`${fmtSkCount(conversions, 'konverzia')} pri priemernej cene ${fmtEur(totalSpend / conversions)} / konverziu.`)
  }

  if (profile === 'dual' && metaSpend > 0 && googleSpend > 0) {
    const metaClicks = metaSum(months, 'clicks') ?? 0
    const googleClicks = googleSum(months, 'clicks') ?? 0
    if (googleClicks > metaClicks * 1.5 && conversions > 0) {
      strengths.push('Google Ads generuje viac kliknutí a konverzií — silnejší performance kanál.')
    } else if (metaClicks > googleClicks * 1.5 && hasCount(lpv)) {
      strengths.push('Meta Ads prináša dosah a návštevy cieľovej stránky — silný horný lievik.')
    }
  }

  if (hasMoney(totalSpend) && !hasCount(conversions) && !hasCount(lpv)) {
    watchouts.push('Reklama beží, ale chýbajú merateľné konverzie alebo návštevy — skontrolovať tracking.')
    recommendations.push('Overiť meranie konverzií a UTM parametre na cieľových stránkach.')
  }

  return {
    verdict: verdict.length ? verdict : null,
    strengths: strengths.slice(0, 3),
    watchouts: watchouts.slice(0, 2),
    recommendations: recommendations.slice(0, 2),
  }
}

function buildInsights(months, profile, agg) {
  if (!months.length) return null

  const insights = profile === 'eshop'
    ? buildEshopInsights(months, agg)
    : buildLeadgenInsights(months, profile, agg)

  const hasContent = insights.verdict
    || insights.strengths.length
    || insights.watchouts.length
    || insights.recommendations.length

  return hasContent ? insights : null
}

function buildOverview(months, profile, agg, client) {
  const highlights = buildHighlights(months, profile, agg)
  const callout = buildSummaryCallout(months, profile, agg, client)
  const insights = buildInsights(months, profile, agg)

  if (!highlights.length && !callout && !insights) return null

  return {
    title: 'Celkový prehľad',
    highlights,
    insights,
    callout,
    charts: buildOverviewCharts(months, agg),
  }
}

function buildSections(months, profile, agg, client) {
  if (profile === 'eshop') {
    return [
      buildMetaSection(months, profile, client),
      buildBoostingSection(months),
      buildGoogleSection(months, profile, client),
      buildGaSection(months),
      buildEmailSection(months),
      buildEshopSection(months),
    ].filter(Boolean)
  }

  return [
    buildMetaSection(months, profile, client),
    buildBoostingSection(months),
    buildGoogleSection(months, profile, client),
    buildWebSection(months),
    buildEmailSection(months),
  ].filter(Boolean)
}

export function buildClientReport(client, months) {
  const profile = getReportProfile(client)
  const period = rangeLabel(months)
  const agg = profile === 'eshop' ? aggregate(months) : {}
  const sections = buildSections(months, profile, agg, client)
  const overview = buildOverview(months, profile, agg, client)

  return {
    profile,
    period,
    clientName: client.name,
    hook: buildReportHook(months, profile, agg),
    sections,
    overview,
  }
}
