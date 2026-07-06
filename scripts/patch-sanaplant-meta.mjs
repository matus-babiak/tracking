#!/usr/bin/env node
/**
 * Import Meta Ads CSV (úroveň Reklama) → meta.ads v src/data/sanaplant.js
 *
 * Jeden mesiac:
 *   node scripts/patch-sanaplant-meta.mjs 2025 2 /path/to/export.csv
 *
 * Všetky CSV v priečinku (názov: 2025-02.csv alebo 2025-02-meta.csv):
 *   node scripts/patch-sanaplant-meta.mjs --dir imports/sanaplant/2025
 *
 * Voľby:
 *   --drop-boosting   odstráni boosting blok mesiaca (ak je už v Meta CSV)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { importMetaAdsCsv } from './import-meta-ads-csv.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, '../src/data/sanaplant.js')

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
  const addToCart = m.addToCart != null ? ` addToCart: ${m.addToCart},` : ''
  return [
    '      meta: {',
    `        spend: ${m.spend}, impressions: ${m.impressions},${reachPart} clicks: ${m.clicks},`,
    `        purchases: ${m.purchases}, purchaseValue: ${m.purchaseValue}, roas: ${m.roas},${addToCart}`,
    `        cpc: ${m.cpc}, costPerPurchase: ${m.costPerPurchase},`,
    '        ads: [',
    m.ads.map((a) => `          ${fmtAd(a)}`).join(',\n'),
    '        ],',
    '      },',
  ].join('\n')
}

function replaceMetaBlock(src, year, month, block) {
  const marker = `year: ${year}, month: ${month},`
  const start = src.indexOf(marker)
  if (start === -1) throw new Error(`Mesiac ${month}/${year} v sanaplant.js nenájdený`)

  const metaStart = src.indexOf('meta: {', start)
  if (metaStart === -1) throw new Error(`meta blok pre ${month}/${year} nenájdený`)

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
        if (nextNewline === -1) throw new Error(`Neočakávaný koniec po meta (${month}/${year})`)
        return src.slice(0, lineStart) + block + src.slice(nextNewline)
      }
    }
  }
  throw new Error(`Neuzavretý meta blok (${month}/${year})`)
}

function dropBoostingBlock(src, year, month) {
  const marker = `year: ${year}, month: ${month},`
  const start = src.indexOf(marker)
  if (start === -1) return src

  const boostStart = src.indexOf('boosting: {', start)
  if (boostStart === -1) return src

  const nextYear = src.indexOf('year:', boostStart + 1)
  const nextSection = Math.min(
    ...['google:', 'ga:', 'email:', 'eshop:', 'year:']
      .map((s) => {
        const idx = src.indexOf(`\n      ${s}`, boostStart)
        return idx === -1 ? Infinity : idx
      }),
  )
  const end = nextSection === Infinity ? nextYear : Math.min(nextSection, nextYear === -1 ? Infinity : nextYear)
  if (end === Infinity) return src

  const lineStart = src.lastIndexOf('\n', boostStart) + 1
  return src.slice(0, lineStart) + src.slice(end)
}

function parseDirEntry(filename) {
  const m = filename.match(/^(\d{4})-(\d{1,2})(?:-meta)?\.csv$/i)
  if (!m) return null
  return { year: Number(m[1]), month: Number(m[2]) }
}

function parseArgs(argv) {
  const opts = { dropBoosting: false, jobs: [] }
  let i = 0
  while (i < argv.length) {
    const a = argv[i]
    if (a === '--drop-boosting') {
      opts.dropBoosting = true
      i++
      continue
    }
    if (a === '--dir') {
      const dir = argv[++i]
      if (!dir) throw new Error('--dir vyžaduje cestu')
      for (const name of fs.readdirSync(dir).sort()) {
        if (!name.endsWith('.csv')) continue
        const parsed = parseDirEntry(name)
        if (!parsed) {
          console.warn(`Preskočené (zlý názov): ${name}`)
          continue
        }
        opts.jobs.push({ ...parsed, csvPath: path.join(dir, name) })
      }
      i++
      continue
    }
    const year = Number(a)
    const month = Number(argv[++i])
    const csvPath = argv[++i]
    if (!year || !month || !csvPath) {
      throw new Error('Použitie: node scripts/patch-sanaplant-meta.mjs [rok mesiac csv ...] | --dir imports/sanaplant/2025 [--drop-boosting]')
    }
    opts.jobs.push({ year, month, csvPath: path.resolve(csvPath) })
    i++
  }
  return opts
}

const { dropBoosting, jobs } = parseArgs(process.argv.slice(2))
if (!jobs.length) {
  console.error(`Použitie:
  node scripts/patch-sanaplant-meta.mjs 2025 2 ./imports/sanaplant/2025-02.csv
  node scripts/patch-sanaplant-meta.mjs --dir ./imports/sanaplant/2025 [--drop-boosting]

Názov súboru v --dir: 2025-02.csv alebo 2025-02-meta.csv`)
  process.exit(1)
}

let src = fs.readFileSync(DATA_PATH, 'utf8')

for (const { year, month, csvPath } of jobs) {
  if (!fs.existsSync(csvPath)) throw new Error(`CSV neexistuje: ${csvPath}`)
  const meta = importMetaAdsCsv(fs.readFileSync(csvPath, 'utf8'))
  src = replaceMetaBlock(src, year, month, fmtMeta(meta))
  if (dropBoosting) src = dropBoostingBlock(src, year, month)
  console.log(`✓ ${month}/${year} — ${meta.ads.length} reklám, spend ${meta.spend} € ← ${path.basename(csvPath)}`)
}

fs.writeFileSync(DATA_PATH, src)
console.log('Uložené:', DATA_PATH)
