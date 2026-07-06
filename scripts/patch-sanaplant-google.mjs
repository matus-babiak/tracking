#!/usr/bin/env node
/**
 * Import Google Ads Campaign report CSV → google blok v src/data/sanaplant.js
 *
 * Jeden mesiac:
 *   node scripts/patch-sanaplant-google.mjs 2025 4 /path/to/Campaign\ report.csv
 *
 * Viac mesiacov (mapa month → csv):
 *   node scripts/patch-sanaplant-google.mjs 2025 --batch
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { importGoogleAdsCsv } from './import-google-ads-csv.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, '../src/data/sanaplant.js')

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

function replaceGoogleBlock(src, year, month, block) {
  const marker = `year: ${year}, month: ${month},`
  const start = src.indexOf(marker)
  if (start === -1) throw new Error(`Mesiac ${month}/${year} nenájdený`)

  const googleStart = src.indexOf('google: {', start)
  if (googleStart === -1) throw new Error(`Google blok pre ${month}/${year} nenájdený`)

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
  throw new Error(`Neuzavretý google blok (${month}/${year})`)
}

function patchMonth(src, year, month, csvPath) {
  const g = importGoogleAdsCsv(fs.readFileSync(csvPath, 'utf8'))
  const next = replaceGoogleBlock(src, year, month, fmtGoogle(g))
  console.log(`✓ ${month}/${year} — ${g.campaigns.length} kampaní, spend ${g.spend} €, nákupy ${g.purchases}, konverzie ${g.conversions}`)
  return next
}

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Použitie: node scripts/patch-sanaplant-google.mjs <rok> <mesiac> <csv>')
  console.error('         node scripts/patch-sanaplant-google.mjs 2025 --batch')
  process.exit(1)
}

const year = Number(args[0])
let src = fs.readFileSync(DATA_PATH, 'utf8')

if (args[1] === '--batch') {
  const batch = {
    2025: {
      4: '/Users/matus/Downloads/Campaign report (3).csv',
      5: '/Users/matus/Downloads/Campaign report (4).csv',
      6: '/Users/matus/Downloads/Campaign report (5).csv',
      7: '/Users/matus/Downloads/Campaign report (6).csv',
      8: '/Users/matus/Downloads/Campaign report (7).csv',
      9: '/Users/matus/Downloads/Campaign report (8).csv',
      10: '/Users/matus/Downloads/Campaign report (9).csv',
      11: '/Users/matus/Downloads/Campaign report (10).csv',
    },
    2026: {
      1: '/Users/matus/Downloads/Campaign report (8).csv',
      2: '/Users/matus/Downloads/Campaign report (9).csv',
      3: '/Users/matus/Downloads/Campaign report (10).csv',
      4: '/Users/matus/Downloads/Campaign report (11).csv',
      5: '/Users/matus/Downloads/Campaign report (12).csv',
      6: '/Users/matus/Downloads/Campaign report (13).csv',
    },
  }
  const files = batch[year]
  if (!files) throw new Error(`Batch pre rok ${year} nie je definovaný`)
  for (const [monthStr, csvPath] of Object.entries(files)) {
    src = patchMonth(src, year, Number(monthStr), csvPath)
  }
} else {
  const month = Number(args[1])
  const csvPath = args[2]
  if (!csvPath) {
    console.error('Chýba cesta k CSV')
    process.exit(1)
  }
  src = patchMonth(src, year, month, csvPath)
}

fs.writeFileSync(DATA_PATH, src)
console.log('Uložené src/data/sanaplant.js')
