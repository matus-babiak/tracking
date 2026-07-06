#!/usr/bin/env node
/**
 * Import Meta Ads CSV (úroveň Reklama) → mesačný blok meta.ads pre HAGARD:HAL
 * Použitie: doplni cesty k CSV v FILES a spusti node scripts/patch-hagardhal-meta.mjs
 */
import { importMetaAdsCsv } from './import-meta-ads-csv.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '../src/data/hagardhal.js')

// [mesiac, cesta k Meta exportu „Reklamy“]
const FILES = [
  // [5, '/Users/matus/Downloads/Hagard.sk-Reklamy-1.-5.-2026-31.-5.-2026.csv'],
  // [6, '/Users/matus/Downloads/Hagard.sk-Reklamy-1.-6.-2026-30.-6.-2026.csv'],
]

function fmtAd(ad) {
  const parts = [`{ name: ${JSON.stringify(ad.name)}, campaign: ${JSON.stringify(ad.campaign)}`]
  for (const [k, v] of Object.entries(ad)) {
    if (k === 'name' || k === 'campaign') continue
    if (v == null) continue
    parts.push(`${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`)
  }
  return `${parts.join(', ')} }`
}

function fmtMeta(m, prev) {
  const reach = m.ads.reduce((s, a) => s + (a.reach ?? 0), 0) || prev?.reach || null
  const reachPart = reach ? ` reach: ${reach},` : ''
  const lines = [
    '      meta: {',
    `        spend: ${m.spend}, impressions: ${m.impressions},${reachPart} clicks: ${m.clicks},`,
    `        purchases: ${m.purchases}, purchaseValue: ${m.purchaseValue}, roas: ${m.roas},`,
  ]
  if (m.addToCart != null) lines.push(`        addToCart: ${m.addToCart},`)
  if (m.cpc != null) lines.push(`        cpc: ${m.cpc}, costPerPurchase: ${m.costPerPurchase},`)
  lines.push(
    '        ads: [',
    m.ads.map((a) => `          ${fmtAd(a)}`).join(',\n'),
    '        ],',
    '      },',
  )
  return lines.join('\n')
}

function replaceMetaBlock(src, month, block) {
  const marker = `year: 2026, month: ${month},`
  const start = src.indexOf(marker)
  if (start === -1) throw new Error(`Month ${month}/2026 not found`)

  const metaStart = src.indexOf('meta: {', start)
  if (metaStart === -1) throw new Error(`meta block for month ${month} not found`)

  const lineStart = src.lastIndexOf('\n', metaStart) + 1
  let depth = 0
  let i = metaStart + 'meta: '.length
  for (; i < src.length; i++) {
    const ch = src[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        i++
        if (src[i] === ',') i++
        const nextNewline = src.indexOf('\n', i)
        if (nextNewline === -1) throw new Error(`Unexpected end after meta block (month ${month})`)
        return src.slice(0, lineStart) + block + src.slice(nextNewline)
      }
    }
  }
  throw new Error(`Unclosed meta block (month ${month})`)
}

if (!FILES.length) {
  console.log('Pridaj CSV cesty do FILES v scripts/patch-hagardhal-meta.mjs')
  process.exit(0)
}

let src = fs.readFileSync(DATA_FILE, 'utf8')

for (const [month, csvPath] of FILES) {
  if (!fs.existsSync(csvPath)) {
    console.warn(`Skip ${month}/2026 — file not found: ${csvPath}`)
    continue
  }
  const m = importMetaAdsCsv(fs.readFileSync(csvPath, 'utf8'))
  src = replaceMetaBlock(src, month, fmtMeta(m))
  console.log(`Updated ${month}/2026 — ${m.ads.length} ads, spend ${m.spend} €`)
}

fs.writeFileSync(DATA_FILE, src)
console.log('Saved src/data/hagardhal.js')
