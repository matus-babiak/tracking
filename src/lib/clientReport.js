import { aggregate, fmtEur, fmtNum, fmtPct, fmtRoas, rangeLabel, sum } from './helpers'
import { metricToneFromLabel } from './metricTone'
import { getClientUiProfile } from './clientMetrics'
import {
  fmtSkCount,
  skClicksSummary,
  skInterakcieSummary,
  skKonverzieSummary,
  skNavstevyZReklam,
  skReachSummary,
  topReklamy,
} from './skGrammar'

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

function row(label, value, hint) {
  return { label, value, hint: hint ?? null, tone: metricToneFromLabel(label) }
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
    items: sum(rows, (m) => m.eshop.items),
    orders: sum(rows, (m) => m.eshop.orders),
    netRevenue: sum(rows, (m) => m.eshop.netRevenue),
  }
}

function aggregateGa(months) {
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
  const paidEngagement = avgMetric(months, (m) => m.ga?.paid?.engagementRate)
  const organicEngagement = avgMetric(months, (m) => m.ga?.organic?.engagementRate)

  return {
    paidSessions: hasPaid ? paidSessions : null,
    organicSessions: hasOrganic ? organicSessions : null,
    totalSessions: (hasPaid || hasOrganic) ? paidSessions + organicSessions : null,
    paidUsers: hasPaid && paidUsers ? paidUsers : null,
    organicUsers: hasOrganic && organicUsers ? organicUsers : null,
    paidEngagement,
    organicEngagement,
  }
}

function aggregateGaSnapshot(months) {
  const activeUsers = sum(months, (m) => m.ga?.snapshot?.activeUsers)
  const sessions = sum(months, (m) => m.ga?.snapshot?.sessions)
  const newUsers = sum(months, (m) => m.ga?.snapshot?.newUsers)
  const hasSnapshot = months.some((m) => m.ga?.snapshot)
  if (!hasSnapshot) return null
  return { activeUsers, sessions, newUsers }
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

  return {
    title: 'Meta Ads (Facebook & Instagram)',
    intro,
    rows,
    topCampaigns,
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
  const conversions = googleSum(months, 'conversions')
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

  const rows = [
    hasMoney(spend) ? row('Investícia', fmtEur(spend)) : null,
    isEshop && hasMoney(purchaseValue) ? row('Hodnota nákupov', fmtEur(purchaseValue)) : null,
    isEshop && hasCount(purchases) ? row('Počet nákupov', fmtNum(purchases)) : null,
    isEshop && hasMoney(spend) && hasMoney(purchaseValue)
      ? row('Návratnosť', fmtRoas(purchaseValue / spend))
      : null,
    hasCount(clicks) ? row('Kliknutia', fmtNum(clicks)) : null,
    isEshop && hasCount(impressions) ? row('Zobrazenia', fmtNum(impressions)) : null,
    isEshop && hasMoney(spend) && hasCount(clicks) ? row('CPC', fmtEur(spend / clicks)) : null,
    isEshop && hasMoney(spend) && hasCount(purchases) ? row('Cena / nákup', fmtEur(spend / purchases)) : null,
    (isDual || !isEshop) && hasCount(conversions) ? row('Konverzie celkom', fmtNum(conversions)) : null,
    ...Object.entries(convActions)
      .filter(([, val]) => hasCount(val))
      .map(([key, val]) => row(CONV_LABELS[key] ?? key, fmtNum(val))),
    (isDual || !isEshop) && hasMoney(spend) && hasCount(conversions)
      ? row('Cena za konverziu', fmtEur(spend / conversions))
      : null,
  ].filter(Boolean)

  if (!rows.length) return null

  const intro = isEshop
    ? 'Vyhľadávanie a Performance Max — kliknutia a nákupy.'
    : 'Vyhľadávanie — kliknutia, telefónne hovory a formuláre.'

  const topCampaigns = pickTopCampaigns(months, 'google', isEshop ? 'eshop' : 'leadgen', client)

  return { title: 'Google Ads', intro, rows, topCampaigns }
}

function buildWebSection(months) {
  const ga = aggregateGa(months)
  const snapshot = aggregateGaSnapshot(months)
  const eshop = aggregateEshop(months)

  const rows = [
    hasMoney(eshop?.revenue) ? row('Tržby e-shopu', fmtEur(eshop.revenue)) : null,
    hasMoney(eshop?.netRevenue) ? row('Čisté predaje', fmtEur(eshop.netRevenue)) : null,
    hasCount(eshop?.orders) ? row('Objednávky', fmtNum(eshop.orders)) : null,
    hasCount(eshop?.items) ? row('Predané položky', fmtNum(eshop.items)) : null,
    ga.totalSessions != null && hasCount(ga.totalSessions)
      ? row('Návštevy webu', fmtNum(ga.totalSessions), 'Google Analytics')
      : null,
    ga.paidSessions != null && hasCount(ga.paidSessions) ? row('Platená návštevnosť', fmtNum(ga.paidSessions)) : null,
    ga.organicSessions != null && hasCount(ga.organicSessions)
      ? row('Organická návštevnosť', fmtNum(ga.organicSessions))
      : null,
    ga.paidEngagement != null ? row('Miera interakcie — platená', fmtPct(ga.paidEngagement)) : null,
    ga.organicEngagement != null ? row('Miera interakcie — organická', fmtPct(ga.organicEngagement)) : null,
    snapshot?.sessions != null && hasCount(snapshot.sessions)
      ? row('Relácie (GA4)', fmtNum(snapshot.sessions))
      : null,
    snapshot?.activeUsers != null && hasCount(snapshot.activeUsers)
      ? row('Aktívni používatelia (GA4)', fmtNum(snapshot.activeUsers))
      : null,
    snapshot?.newUsers != null && hasCount(snapshot.newUsers)
      ? row('Noví používatelia (GA4)', fmtNum(snapshot.newUsers))
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

  return {
    title: 'E-mail marketing (Mailchimp)',
    intro: 'Newsletter a automatické e-maily — odoslanie, otvorenosť a tržby.',
    rows,
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

  if (profile === 'eshop') {
    if (hasMoney(adSpend)) {
      highlights.push({ label: 'Investícia do reklám', value: fmtEur(adSpend), hint: 'Meta + Google + boosting', tone: 'spend' })
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
      highlights.push({ label: 'Návratnosť reklám', value: fmtRoas(agg.roas), hint: 'Koľko € nákupov na 1 € investície' })
    }
    if (hasMoney(agg.eshopRevenue)) {
      highlights.push({
        label: 'Tržby e-shopu',
        value: fmtEur(agg.eshopRevenue),
        hint: agg.adShareOfRevenue != null ? `${fmtPct(agg.adShareOfRevenue)} z reklám` : null,
        tone: 'revenue',
      })
    }
    if (hasMoney(email?.revenue)) {
      highlights.push({
        label: 'Tržby z e-mailov',
        value: fmtEur(email.revenue),
        hint: hasCount(email.orders) ? fmtSkCount(email.orders, 'objednavka') : 'Mailchimp',
        tone: 'revenue',
      })
    }
    return highlights.slice(0, 5)
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
    return highlights
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

  return highlights
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

function buildSections(months, profile, agg, client) {
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
  const highlights = buildHighlights(months, profile, agg)
  const summary = buildSummary(months, profile, agg, highlights)
  const sections = buildSections(months, profile, agg, client)

  return {
    profile,
    period,
    clientName: client.name,
    summary,
    highlights,
    sections,
  }
}
