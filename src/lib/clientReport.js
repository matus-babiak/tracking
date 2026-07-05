import { aggregate, fmtEur, fmtNum, fmtPct, fmtRoas, rangeLabel, sum } from './helpers'

const CONV_LABELS = {
  click_tel: 'Telefónne hovory',
  form_start: 'Začaté formuláre',
  form_submit: 'Odoslané formuláre',
}

export function getReportProfile(client) {
  if (client.leadgenProfile === 'dual') return 'dual'
  if (client.metaProfile === 'leadgen') return 'leadgen'
  return 'eshop'
}

function aggregateLeadgen(months) {
  const rows = months.filter((m) => m.meta)
  const spend = sum(rows, (m) => m.meta.spend)
  const reach = sum(rows, (m) => m.meta.reach)
  const lpv = sum(rows, (m) => m.meta.landingPageViews)
  const clicks = sum(rows, (m) => m.meta.clicks)
  const engagements = sum(rows, (m) => m.meta.engagements)
  return { spend, reach, lpv, clicks, engagements }
}

function aggregateDual(months) {
  const metaSpend = sum(months, (m) => m.meta?.spend ?? 0)
  const googleSpend = sum(months, (m) => m.google?.spend ?? 0)
  const lpv = sum(months, (m) => m.meta?.landingPageViews ?? 0)
  const metaClicks = sum(months, (m) => m.meta?.clicks ?? 0)
  const googleClicks = sum(months, (m) => m.google?.clicks ?? 0)
  const conversions = sum(months, (m) => m.google?.conversions ?? 0)
  const convActions = {}
  for (const m of months) {
    const actions = m.google?.conversionActions
    if (!actions) continue
    for (const [key, val] of Object.entries(actions)) {
      convActions[key] = (convActions[key] ?? 0) + (val ?? 0)
    }
  }
  return {
    totalSpend: metaSpend + googleSpend,
    metaSpend,
    googleSpend,
    lpv,
    metaClicks,
    googleClicks,
    totalClicks: metaClicks + googleClicks,
    conversions,
    convActions,
    costPerConv: conversions ? googleSpend / conversions : null,
  }
}

function aggregateGa(months) {
  let paidSessions = 0
  let organicSessions = 0
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
  }
  return {
    paidSessions: hasPaid ? paidSessions : null,
    organicSessions: hasOrganic ? organicSessions : null,
    totalSessions: (hasPaid || hasOrganic) ? paidSessions + organicSessions : null,
  }
}

function row(label, value, hint) {
  return { label, value, hint }
}

function buildEshopReport(client, months) {
  const agg = aggregate(months)
  const ga = aggregateGa(months)
  const hasMeta = months.some((m) => m.meta)
  const hasGoogle = months.some((m) => m.google)
  const hasGa = months.some((m) => m.ga)
  const hasEmail = months.some((m) => m.email)
  const hasEshop = months.some((m) => m.eshop?.revenue != null)

  const summaryParts = []
  if (agg.adSpend) {
    summaryParts.push(`Do online reklám sme za zvolené obdobie investovali ${fmtEur(agg.adSpend)}.`)
  }
  if (agg.adValue) {
    summaryParts.push(
      `Reklamy priniesli nákupy v hodnote ${fmtEur(agg.adValue)}`
      + (agg.adPurchases ? ` (${fmtNum(agg.adPurchases)} objednávok)` : '')
      + '.',
    )
  }
  if (agg.roas != null) {
    summaryParts.push(`Na každé 1 € investované do reklám pripadá približne ${fmtRoas(agg.roas)} € v hodnote nákupov.`)
  }
  if (agg.eshopRevenue) {
    summaryParts.push(`Celkové tržby e-shopu boli ${fmtEur(agg.eshopRevenue)}.`)
  }
  if (!summaryParts.length) {
    summaryParts.push('Za zvolené obdobie zatiaľ nemáme kompletné dáta pre zhrnutie.')
  }

  const highlights = []
  if (agg.adSpend) highlights.push({ label: 'Investícia do reklám', value: fmtEur(agg.adSpend), hint: 'Meta + Google' })
  if (agg.adValue) highlights.push({ label: 'Hodnota nákupov z reklám', value: fmtEur(agg.adValue), hint: agg.adPurchases ? `${fmtNum(agg.adPurchases)} nákupov` : null })
  if (agg.roas != null) highlights.push({ label: 'Návratnosť reklám', value: fmtRoas(agg.roas), hint: 'Koľko € nákupov na 1 € investície' })
  if (agg.eshopRevenue) highlights.push({ label: 'Tržby e-shopu', value: fmtEur(agg.eshopRevenue), hint: agg.adShareOfRevenue != null ? `${fmtPct(agg.adShareOfRevenue)} z reklám` : null })

  const sections = []

  if (hasMeta) {
    sections.push({
      title: 'Meta Ads (Facebook & Instagram)',
      intro: 'Reklamy na sociálnych sieťach — dosah, kliknutia a nákupy.',
      rows: [
        row('Investícia', fmtEur(agg.metaSpend)),
        row('Hodnota nákupov', fmtEur(agg.metaValue)),
        row('Počet nákupov', fmtNum(agg.metaPurchases)),
        agg.metaSpend && agg.metaValue ? row('Návratnosť', fmtRoas(agg.metaValue / agg.metaSpend)) : null,
      ].filter(Boolean),
    })
  }

  if (hasGoogle) {
    sections.push({
      title: 'Google Ads',
      intro: 'Vyhľadávanie a Performance Max — kliknutia a nákupy.',
      rows: [
        row('Investícia', fmtEur(agg.googleSpend)),
        row('Hodnota nákupov', fmtEur(agg.googleValue)),
        row('Počet nákupov', fmtNum(agg.googlePurchases)),
        agg.googleSpend && agg.googleValue ? row('Návratnosť', fmtRoas(agg.googleValue / agg.googleSpend)) : null,
      ].filter(Boolean),
    })
  }

  if (hasEshop || hasGa) {
    const webRows = []
    if (agg.eshopRevenue) webRows.push(row('Tržby e-shopu', fmtEur(agg.eshopRevenue)))
    if (ga.totalSessions != null) webRows.push(row('Návštevy webu', fmtNum(ga.totalSessions), 'Google Analytics'))
    if (ga.paidSessions != null) webRows.push(row('Platená návštevnosť', fmtNum(ga.paidSessions)))
    if (ga.organicSessions != null) webRows.push(row('Organická návštevnosť', fmtNum(ga.organicSessions)))
    if (webRows.length) {
      sections.push({
        title: 'Web a e-shop',
        intro: 'Návštevnosť webu a predaje v e-shope.',
        rows: webRows,
      })
    }
  }

  if (hasEmail) {
    sections.push({
      title: 'E-mail marketing',
      intro: 'Newsletter a automatické e-maily.',
      rows: [
        row('Tržby z e-mailov', fmtEur(agg.emailRevenue)),
        row('Objednávky z e-mailov', fmtNum(agg.emailOrders)),
      ],
    })
  }

  return { summary: summaryParts.join(' '), highlights, sections }
}

function buildLeadgenReport(months) {
  const agg = aggregateLeadgen(months)
  const hasData = months.some((m) => m.meta)
  if (!hasData) {
    return { summary: 'Za zvolené obdobie zatiaľ nemáme dáta z Meta Ads.', highlights: [], sections: [] }
  }

  const summaryParts = []
  if (agg.spend) summaryParts.push(`Do reklám na Meta sme investovali ${fmtEur(agg.spend)}.`)
  if (agg.reach) summaryParts.push(`Reklamy videlo približne ${fmtNum(agg.reach)} ľudí.`)
  if (agg.lpv) summaryParts.push(`Web navštívilo ${fmtNum(agg.lpv)} návštevníkov z reklám.`)
  if (agg.clicks) summaryParts.push(`Používatelia klikli ${fmtNum(agg.clicks)}-krát.`)

  const highlights = []
  if (agg.spend) highlights.push({ label: 'Investícia', value: fmtEur(agg.spend), hint: 'Meta Ads' })
  if (agg.reach) highlights.push({ label: 'Dosah', value: fmtNum(agg.reach), hint: 'Koľko ľudí videlo reklamu' })
  if (agg.lpv) highlights.push({ label: 'Návštevy webu', value: fmtNum(agg.lpv), hint: 'Z reklám na Meta' })
  if (agg.clicks) highlights.push({ label: 'Kliknutia', value: fmtNum(agg.clicks), hint: null })

  const sections = [{
    title: 'Meta Ads (Facebook & Instagram)',
    intro: 'Prehľad výsledkov reklamných kampaní.',
    rows: [
      row('Investícia', fmtEur(agg.spend)),
      row('Dosah', fmtNum(agg.reach), 'Unikátni ľudia'),
      row('Zobrazenia', fmtNum(sum(months, (m) => m.meta?.impressions)), 'Koľkokrát sa reklama zobrazila'),
      row('Návštevy webu', fmtNum(agg.lpv), 'Pozretia cieľovej stránky'),
      row('Kliknutia', fmtNum(agg.clicks)),
      agg.engagements ? row('Interakcie', fmtNum(agg.engagements), 'Lajky, komentáre, zdieľania') : null,
    ].filter(Boolean),
  }]

  return { summary: summaryParts.join(' '), highlights, sections }
}

function buildDualReport(months) {
  const agg = aggregateDual(months)
  const hasData = months.some((m) => m.meta || m.google)
  if (!hasData) {
    return { summary: 'Za zvolené obdobie zatiaľ nemáme dáta z reklám.', highlights: [], sections: [] }
  }

  const summaryParts = []
  if (agg.totalSpend) summaryParts.push(`Do online reklám sme investovali ${fmtEur(agg.totalSpend)} (Meta + Google).`)
  if (agg.lpv) summaryParts.push(`Web navštívilo ${fmtNum(agg.lpv)} návštevníkov z Meta reklám.`)
  if (agg.conversions) summaryParts.push(`Google Ads zaznamenali ${fmtNum(agg.conversions)} konverzií (hovory, formuláre a pod.).`)

  const highlights = []
  if (agg.totalSpend) highlights.push({ label: 'Investícia celkom', value: fmtEur(agg.totalSpend), hint: `Meta ${fmtEur(agg.metaSpend)} · Google ${fmtEur(agg.googleSpend)}` })
  if (agg.lpv) highlights.push({ label: 'Návštevy webu', value: fmtNum(agg.lpv), hint: 'Z Meta reklám' })
  if (agg.totalClicks) highlights.push({ label: 'Kliknutia', value: fmtNum(agg.totalClicks), hint: `Meta ${fmtNum(agg.metaClicks)} · Google ${fmtNum(agg.googleClicks)}` })
  if (agg.conversions) highlights.push({ label: 'Konverzie', value: fmtNum(agg.conversions), hint: agg.costPerConv != null ? `Priemer ${fmtEur(agg.costPerConv, 2)} / konverziu` : null })

  const sections = []

  if (months.some((m) => m.meta)) {
    sections.push({
      title: 'Meta Ads',
      intro: 'Reklamy na Facebooku a Instagrame — návštevy a kliknutia.',
      rows: [
        row('Investícia', fmtEur(agg.metaSpend)),
        row('Návštevy webu', fmtNum(agg.lpv)),
        row('Kliknutia', fmtNum(agg.metaClicks)),
      ],
    })
  }

  if (months.some((m) => m.google)) {
    const googleRows = [
      row('Investícia', fmtEur(agg.googleSpend)),
      row('Kliknutia', fmtNum(agg.googleClicks)),
      row('Konverzie celkom', fmtNum(agg.conversions)),
    ]
    for (const [key, val] of Object.entries(agg.convActions)) {
      if (val) googleRows.push(row(CONV_LABELS[key] ?? key, fmtNum(val)))
    }
    if (agg.costPerConv != null) googleRows.push(row('Cena za konverziu', fmtEur(agg.costPerConv, 2)))
    sections.push({
      title: 'Google Ads',
      intro: 'Vyhľadávanie — kliknutia, telefónne hovory a formuláre.',
      rows: googleRows,
    })
  }

  return { summary: summaryParts.join(' '), highlights, sections }
}

export function buildClientReport(client, months) {
  const profile = getReportProfile(client)
  const period = rangeLabel(months)
  const content = profile === 'dual'
    ? buildDualReport(months)
    : profile === 'leadgen'
      ? buildLeadgenReport(months)
      : buildEshopReport(client, months)

  return {
    profile,
    period,
    clientName: client.name,
    ...content,
  }
}
