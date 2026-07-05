#!/usr/bin/env node
/**
 * Doplní / aktualizuje google bloky Sanaplant 2026 z Campaign report CSV.
 */
import fs from 'fs'
import { importGoogleAdsCsv } from './import-google-ads-csv.mjs'

function fmtCampaign(c) {
  const parts = [`{ name: ${JSON.stringify(c.name)}`]
  if (c.type) parts.push(`type: ${JSON.stringify(c.type)}`)
  if (c.status) parts.push(`status: ${JSON.stringify(c.status)}`)
  parts.push(`purchases: ${c.purchases}, value: ${c.value}`)
  if (c.conversionActions && Object.keys(c.conversionActions).length) {
    const conv = Object.entries(c.conversionActions).map(([k, v]) => `${k}: ${v}`).join(', ')
    parts.push(`conversionActions: { ${conv} }`)
  }
  return parts.join(', ') + ' }'
}

function fmtGoogle(g) {
  const lines = []
  lines.push('      google: {')
  lines.push(`        spend: ${g.spend}, impressions: ${g.impressions}, clicks: ${g.clicks}, cpc: ${g.cpc}, ctr: ${g.ctr},`)
  if (g.interactions != null) {
    lines.push(`        interactions: ${g.interactions}, interactionRate: ${g.interactionRate}, convRate: ${g.convRate}, costPerConv: ${g.costPerConv},`)
  }
  lines.push(`        purchases: ${g.purchases}, purchaseValue: ${g.purchaseValue}, conversions: ${g.conversions}, roas: ${g.roas},`)
  if (g.conversionActions && Object.keys(g.conversionActions).length) {
    const conv = Object.entries(g.conversionActions).map(([k, v]) => `${k}: ${v}`).join(', ')
    lines.push(`        conversionActions: { ${conv} },`)
  }
  if (g.campaigns?.length) {
    lines.push('        campaigns: [')
    lines.push(g.campaigns.map((c) => `          ${fmtCampaign(c)}`).join(',\n'))
    lines.push('        ],')
  }
  lines.push('      },')
  return lines.join('\n')
}

function replaceGoogleBlock(src, month, block) {
  const marker = `year: 2026, month: ${month},`
  const start = src.indexOf(marker)
  if (start === -1) throw new Error(`Mesiac ${month}/2026 nenájdený`)

  const googleStart = src.indexOf('google: {', start)
  if (googleStart === -1) throw new Error(`Google blok pre ${month}/2026 nenájdený`)

  const lineStart = src.lastIndexOf('\n', googleStart) + 1
  let depth = 0
  let i = googleStart + 'google: '.length
  for (; i < src.length; i++) {
    const ch = src[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        i++
        if (src[i] === ',') i++
        const nextNewline = src.indexOf('\n', i)
        return src.slice(0, lineStart) + block + src.slice(nextNewline)
      }
    }
  }
  throw new Error(`Neuzavretý google blok (${month}/2026)`)
}

const path = new URL('../src/data/sanaplant.js', import.meta.url)
let src = fs.readFileSync(path, 'utf8')

const files = {
  1: '/Users/matus/Downloads/Campaign report (8).csv',
  2: '/Users/matus/Downloads/Campaign report (9).csv',
  3: '/Users/matus/Downloads/Campaign report (10).csv',
  4: '/Users/matus/Downloads/Campaign report (11).csv',
  5: '/Users/matus/Downloads/Campaign report (12).csv',
  6: '/Users/matus/Downloads/Campaign report (13).csv',
}

for (const [monthStr, csvPath] of Object.entries(files)) {
  const month = Number(monthStr)
  const g = importGoogleAdsCsv(fs.readFileSync(csvPath, 'utf8'))
  src = replaceGoogleBlock(src, month, fmtGoogle(g))
  console.log(`✓ ${month}/2026 — ${g.campaigns.length} kampaní, spend ${g.spend} €, konverzie ${g.conversions}`)
}

fs.writeFileSync(path, src)
console.log('Uložené src/data/sanaplant.js')
