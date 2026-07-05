#!/usr/bin/env node
import { importMetaAdsCsv } from './import-meta-ads-csv.mjs'
import fs from 'fs'

const files = [
  [1, '/Users/matus/Downloads/Sanaplant.sk-Reklamy-1.-1.-2026-31.-1.-2026.csv'],
  [2, '/Users/matus/Downloads/Sanaplant.sk-Reklamy-1.-2.-2026-28.-2.-2026.csv'],
  [3, '/Users/matus/Downloads/Sanaplant.sk-Reklamy-1.-3.-2026-31.-3.-2026.csv'],
  [4, '/Users/matus/Downloads/Sanaplant.sk-Reklamy-1.-4.-2026-30.-4.-2026.csv'],
  [5, '/Users/matus/Downloads/Sanaplant.sk-Reklamy-1.-5.-2026-31.-5.-2026 (2).csv'],
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

function fmtMeta(m) {
  const reach = m.ads.reduce((s, a) => s + (a.reach ?? 0), 0) || null
  const reachPart = reach ? ` reach: ${reach},` : ''
  return [
    '      meta: {',
    `        spend: ${m.spend}, impressions: ${m.impressions},${reachPart} clicks: ${m.clicks},`,
    `        purchases: ${m.purchases}, purchaseValue: ${m.purchaseValue}, roas: ${m.roas}, addToCart: ${m.addToCart},`,
    `        cpc: ${m.cpc}, costPerPurchase: ${m.costPerPurchase},`,
    '        ads: [',
    m.ads.map((a) => `          ${fmtAd(a)}`).join(',\n'),
    '        ],',
    '      },',
  ].join('\n')
}

function replaceMetaBlock(src, month, block) {
  const marker = `year: 2026, month: ${month},`
  const start = src.indexOf(marker)
  if (start === -1) throw new Error(`Month ${month} not found`)

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

const path = new URL('../src/data/sanaplant.js', import.meta.url)
let src = fs.readFileSync(path, 'utf8')

for (const [month, csvPath] of files) {
  const m = importMetaAdsCsv(fs.readFileSync(csvPath, 'utf8'))
  src = replaceMetaBlock(src, month, fmtMeta(m))
  console.log(`Updated ${month}/2026 — ${m.ads.length} ads, spend ${m.spend} €`)
}

fs.writeFileSync(path, src)
console.log('Saved src/data/sanaplant.js')
