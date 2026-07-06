#!/usr/bin/env node
/**
 * Import Google Ads Campaign report CSV (e-shop Sanaplant).
 * Počíta len add_to_cart, begin_checkout, purchase — ostatné konverzie ignoruje.
 */
import fs from 'fs'

function parseLine(line) {
  const vals = []
  let cur = ''
  let inQ = false
  for (const c of line) {
    if (c === '"') { inQ = !inQ; continue }
    if (c === ',' && !inQ) { vals.push(cur); cur = ''; continue }
    cur += c
  }
  vals.push(cur)
  return vals
}

function parseCsv(text) {
  const lines = text.trim().split('\n')
  const headerIdx = lines.findIndex((l) => l.startsWith('Conversion action'))
  if (headerIdx === -1) throw new Error('Chýba hlavička „Conversion action“')
  const headers = parseLine(lines[headerIdx]).map((h) => h.trim())
  return lines.slice(headerIdx + 1).map((line) => {
    const vals = parseLine(line)
    const obj = {}
    headers.forEach((h, i) => { obj[h] = (vals[i] ?? '').trim() })
    return obj
  })
}

function num(v) {
  if (!v || v === '--' || v === ' --') return null
  const n = parseFloat(String(v).replace(/,/g, '').replace('%', ''))
  return Number.isFinite(n) ? n : null
}

function r2(n) {
  return n == null ? null : Math.round(n * 100) / 100
}

/** Funnel akcie — bez purchase variant (tie rieši pickPurchaseMetrics). */
function funnelAction(raw) {
  if (!raw || raw === '--' || raw === ' --') return null
  const s = raw.trim().toLowerCase()
  if (s === 'add_to_cart' || s === 'add_to_cart_book') return 'add_to_cart'
  if (s === 'begin_checkout' || s === 'begin_checkout_book') return 'begin_checkout'
  return null
}

function purchaseSourceKind(raw) {
  if (!raw || raw === '--' || raw === ' --') return null
  const s = raw.trim().toLowerCase()
  if (s.includes('woocommerce purchase')) return 'woo'
  if (s.includes('(web) purchase')) return 'web'
  if (s === 'purchase') return 'purchase'
  return null
}

/** Jedna purchase metrika — bez sčítania duplicitných WooCommerce / GA4 / generic riadkov. */
function pickPurchaseMetrics(rows) {
  const candidates = []
  for (const r of rows) {
    const kind = purchaseSourceKind(r['Conversion action'])
    if (!kind) continue
    candidates.push({
      kind,
      conv: num(r['Conversions']) ?? 0,
      val: num(r['Conv. value']) ?? 0,
    })
  }
  const exact = candidates.find((c) => c.kind === 'purchase')
  const woo = candidates.find((c) => c.kind === 'woo')
  const web = candidates.find((c) => c.kind === 'web')

  let source = null
  if (woo?.conv > 0 && (!exact?.conv || woo.conv >= exact.conv)) source = woo
  else if (exact?.conv > 0) source = exact
  else if (web?.conv > 0) source = web
  if (!source) return { purchases: 0, purchaseValue: 0 }

  let purchaseValue = source.val
  if (purchaseValue === 0) {
    const fallback = [woo, exact, web].filter((c) => c && c.val > 0).sort((a, b) => b.val - a.val)[0]
    purchaseValue = fallback?.val ?? 0
  }

  return { purchases: r2(source.conv), purchaseValue: r2(purchaseValue) }
}

function pickConvRows(rows) {
  const actions = {}
  for (const r of rows) {
    const key = funnelAction(r['Conversion action'])
    if (!key) continue
    const conv = num(r['Conversions'])
    if (conv == null || conv <= 0) continue
    actions[key] = r2((actions[key] ?? 0) + conv)
  }
  const { purchases, purchaseValue } = pickPurchaseMetrics(rows)
  if (purchases > 0) actions.purchase = purchases
  return { actions, purchaseValue }
}

function accountMetrics(row) {
  if (!row) return null
  return {
    spend: r2(num(row['Cost'])),
    impressions: num(row['Impr.']),
    clicks: num(row['Clicks']),
    interactions: num(row['Interactions']),
    cpc: r2(num(row['Avg. CPC'])),
    ctr: r2(num(row['CTR'])),
    interactionRate: r2(num(row['Interaction rate'])),
    convRate: r2(num(row['Conv. rate'])),
    costPerConv: r2(num(row['Cost / conv.'])),
  }
}

function isCampaignRow(r) {
  const name = r['Campaign']
  const status = r['Campaign status']
  if (!name || name === ' --') return false
  if (!status || status.startsWith('Total')) return false
  return status === 'Enabled' || status === 'Paused'
}

function campaignStatus(rows) {
  const raw = rows[0]?.['Campaign status']
  if (raw === 'Paused') return 'Paused'
  if (raw === 'Enabled') return 'Enabled'
  return raw || null
}

function buildCampaign(name, rows) {
  const type = rows.find((r) => r['Campaign type'] && r['Campaign type'] !== ' --')?.['Campaign type']
  const { actions, purchaseValue } = pickConvRows(rows)
  const purchases = actions.purchase ?? 0
  const value = purchaseValue ?? 0
  const conversions = r2(Object.values(actions).reduce((s, v) => s + v, 0))
  return {
    name,
    type: type || undefined,
    status: campaignStatus(rows),
    purchases,
    value,
    conversionActions: actions,
    conversions,
  }
}

export function importGoogleAdsCsv(text) {
  const rows = parseCsv(text)

  const accountBase = rows.find(
    (r) => r['Campaign status'] === 'Total: Account' && !r['Conversion action'],
  )
  const accountConvRows = rows.filter(
    (r) => r['Campaign status'] === 'Total: Account' && r['Conversion action'],
  )
  const { actions: conversionActions, purchaseValue } = pickConvRows(accountConvRows)

  const base = accountMetrics(accountBase) ?? {}
  const spend = base.spend ?? 0
  const purchases = conversionActions.purchase ?? 0
  const trackedTotal = Object.values(conversionActions).reduce((s, v) => s + v, 0)

  const campaignNames = [...new Set(
    rows.filter(isCampaignRow).map((r) => r['Campaign']),
  )]

  const campaigns = campaignNames.map((name) => {
    const campRows = rows.filter((r) => r['Campaign'] === name && isCampaignRow(r))
    return buildCampaign(name, campRows)
  }).sort((a, b) => (b.conversions ?? 0) - (a.conversions ?? 0))

  return {
    spend,
    impressions: base.impressions,
    clicks: base.clicks,
    interactions: base.interactions,
    cpc: base.cpc,
    ctr: base.ctr,
    interactionRate: base.interactionRate,
    convRate: base.convRate,
    costPerConv: trackedTotal > 0 && spend != null ? r2(spend / trackedTotal) : null,
    purchases,
    purchaseValue: purchaseValue ?? 0,
    roas: spend > 0 && purchaseValue ? r2(purchaseValue / spend) : null,
    conversions: r2(trackedTotal),
    conversionActions,
    campaigns,
  }
}

if (process.argv[1]?.includes('import-google-ads-csv')) {
  const path = process.argv[2]
  if (!path) {
    console.error('Použitie: node scripts/import-google-ads-csv.mjs /path/to/Campaign\\ report.csv')
    process.exit(1)
  }
  console.log(JSON.stringify(importGoogleAdsCsv(fs.readFileSync(path, 'utf8')), null, 2))
}
