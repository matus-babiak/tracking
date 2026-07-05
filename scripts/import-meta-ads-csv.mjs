#!/usr/bin/env node
/**
 * Import Meta Ads CSV (úroveň Reklama) → mesačný blok meta.ads
 * Použitie: node scripts/import-meta-ads-csv.mjs /path/to/export.csv
 */
import fs from 'fs'

function parseCsv(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, ''))
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const vals = []
    let cur = ''
    let inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue }
      if (ch === ',' && !inQ) { vals.push(cur); cur = ''; continue }
      cur += ch
    }
    vals.push(cur)
    const obj = {}
    headers.forEach((h, idx) => { obj[h] = vals[idx] ?? '' })
    rows.push(obj)
  }
  return rows
}

function num(v) {
  if (v == null || v === '') return null
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function r2(n) {
  return n == null ? null : Math.round(n * 100) / 100
}

function mapRow(r) {
  const spend = num(r['Minutá suma (EUR)'])
  const purchases = num(r['Nákupy'])
  const value = num(r['Purchases conversion value'])
  const clicks = num(r['Odchodové kliknutia'])
  const addToCart = num(r['Pridania do košíka'])
  const impressions = num(r['Impresie'])
  const reach = num(r['Dosah'])

  const ad = {
    name: r['Názov reklamy'].replace(/^\u200b\s*/, '').trim(),
    campaign: r['Názov kampane'],
    spend: r2(spend),
    value: r2(value),
    roas: r2(num(r['ROAS pre nákupy (Návratnosť reklamných výdavkov)'])),
    purchases: purchases ?? 0,
    costPerPurchase: r2(num(r['Cena za jeden nákup (EUR)'])),
    aov: r2(num(r['Average purchases conversion value [Incremental attribution all conversions]'])),
    cpm: r2(num(r['CPM (cena za 1000 impresií) (EUR)'])),
    impressions: impressions ?? null,
    reach: reach ?? null,
    frequency: r2(num(r['Frekvencia'])),
    clicks: clicks ?? null,
    cpc: r2(num(r['Cena za odchodové kliknutie (EUR)'])),
    ctr: r2(num(r['Outbound CTR (click-through rate)'])),
    addToCart: addToCart ?? null,
    costPerAddToCart: r2(num(r['Cena za pridanie do košíka (EUR)'])),
    landingPageViews: num(r['Pozretia cieľovej stránky']) ?? null,
    costPerLandingPageView: r2(num(r['Cena za pozretie cieľovej stránky (EUR)'])),
    engagements: num(r['Post engagements']) ?? null,
    costPerEngagement: r2(num(r['Cena za interakciu s príspevkom (EUR)'])),
    saves: num(r['Uloženia príspevkov']) ?? null,
    shares: num(r['Zdieľania príspevku']) ?? null,
    comments: num(r['Komentáre k príspevku']) ?? null,
  }

  for (const [k, v] of Object.entries(ad)) {
    if (v === 0 && !['purchases', 'value', 'spend'].includes(k)) {
      if (['purchases', 'value'].includes(k)) continue
      ad[k] = 0
    }
  }
  return ad
}

export function importMetaAdsCsv(text) {
  const raw = parseCsv(text)
  const map = new Map()
  const totals = {
    spend: 0, purchases: 0, value: 0, clicks: 0, addToCart: 0, impressions: 0,
  }

  for (const r of raw) {
    const ad = mapRow(r)
    totals.spend += ad.spend ?? 0
    totals.purchases += ad.purchases ?? 0
    totals.value += ad.value ?? 0
    totals.clicks += ad.clicks ?? 0
    totals.addToCart += ad.addToCart ?? 0
    totals.impressions += ad.impressions ?? 0

    const key = `${ad.campaign}|||${ad.name}`
    const prev = map.get(key)
    if (!prev) {
      map.set(key, ad)
      continue
    }
    for (const k of Object.keys(ad)) {
      if (k === 'name' || k === 'campaign') continue
      const a = ad[k]
      const b = prev[k]
      if (a == null) continue
      if (typeof a === 'number' && typeof b === 'number') prev[k] = r2(a + b)
      else if (b == null) prev[k] = a
    }
  }

  const ads = [...map.values()].sort((a, b) => (b.spend ?? 0) - (a.spend ?? 0))
  const spend = r2(totals.spend)
  const purchaseValue = r2(totals.value)
  const meta = {
    spend,
    impressions: totals.impressions || null,
    clicks: totals.clicks || null,
    purchases: totals.purchases || 0,
    purchaseValue,
    roas: spend > 0 ? r2(purchaseValue / spend) : null,
    addToCart: totals.addToCart || null,
    cpc: totals.clicks > 0 ? r2(spend / totals.clicks) : null,
    costPerPurchase: totals.purchases > 0 ? r2(spend / totals.purchases) : null,
    ads,
  }
  return meta
}

function fmtAd(ad) {
  const parts = [`{ name: ${JSON.stringify(ad.name)}, campaign: ${JSON.stringify(ad.campaign)}`]
  for (const [k, v] of Object.entries(ad)) {
    if (k === 'name' || k === 'campaign') continue
    if (v == null) continue
    parts.push(`${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`)
  }
  parts.push('}')
  return parts.join(', ') + ' '
}

if (process.argv[1]?.includes('import-meta-ads-csv')) {
  const path = process.argv[2]
  if (!path) {
    console.error('Použitie: node scripts/import-meta-ads-csv.mjs /path/to/export.csv')
    process.exit(1)
  }
  const meta = importMetaAdsCsv(fs.readFileSync(path, 'utf8'))
  console.log(JSON.stringify(meta, null, 2))
  console.error('\n// ads pre sanaplant.js:')
  console.error(meta.ads.map(fmtAd).join(',\n          '))
}
