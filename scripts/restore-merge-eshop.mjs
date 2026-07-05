#!/usr/bin/env node
/** Obnoví a zlúči eshop kategórie/produkty v sanaplant.js z agent transcriptu. */
import fs from 'fs'
import { mergeCategoryRows, mergeProductRows } from '../src/lib/eshopMerge.js'

const transcript = fs.readFileSync(
  '/Users/matus/.cursor/projects/Users-matus-Documents-Claude-tracking/agent-transcripts/797877e3-21e6-4909-b02f-7e7566791fbb/797877e3-21e6-4909-b02f-7e7566791fbb.jsonl',
  'utf8',
)

function parseEshopBlocks() {
  const byRev = new Map()
  for (const line of transcript.split('\n')) {
    if (!line.includes('StrReplace') || !line.includes('eshop: {')) continue
    const m = line.match(/"new_string":"((?:\\.|[^"\\])*)"/)
    if (!m) continue
    const raw = JSON.parse(`"${m[1]}"`)
    const rev = Number(raw.match(/revenue: ([0-9.]+)/)?.[1])
    if (!rev) continue
    byRev.set(rev, raw)
  }
  return byRev
}

function parseCategories(text) {
  const catBlock = text.match(/categories: \[([\s\S]*?)\],\s*\n\s*products:/)?.[1] ?? ''
  return [...catBlock.matchAll(/\{ name: '([^']+)', items: (\d+(?:\.\d+)?), netRevenue: (\d+(?:\.\d+)?) \}/g)]
    .map((m) => ({ name: m[1], items: Number(m[2]), netRevenue: Number(m[3]) }))
}

function parseProducts(text) {
  const prodBlock = text.match(/products: \[([\s\S]*?)\],\s*\n\s*\},/)?.[1] ?? ''
  return [...prodBlock.matchAll(
    /\{ name: '([^']+)'(?:, sku: '([^']*)')?, items: (\d+(?:\.\d+)?), netRevenue: (\d+(?:\.\d+)?), orders: (\d+(?:\.\d+)?), variants: (\d+(?:\.\d+)?) \}/g,
  )].map((m) => ({
    name: m[1],
    sku: m[2] || undefined,
    items: Number(m[3]),
    netRevenue: Number(m[4]),
    orders: Number(m[5]),
    variants: Number(m[6]),
  }))
}

function fmtCategories(cats) {
  const lines = cats.map(
    (c) => `          { name: '${c.name.replace(/'/g, "\\'")}', items: ${c.items}, netRevenue: ${c.netRevenue} },`,
  )
  return `        categories: [\n${lines.join('\n')}\n        ],`
}

function fmtProducts(products) {
  const lines = products.map((p) => {
    const sku = p.sku ? `, sku: '${p.sku.replace(/'/g, "\\'")}'` : ''
    return `          { name: '${p.name.replace(/'/g, "\\'")}'${sku}, items: ${p.items}, netRevenue: ${p.netRevenue}, orders: ${p.orders}, variants: ${p.variants ?? 0} },`
  })
  return `        products: [\n${lines.join('\n')}\n        ],`
}

function mergeEshopText(text) {
  let out = text
  if (text.includes('categories: [')) {
    const cats = mergeCategoryRows(parseCategories(text))
    out = out.replace(/categories: \[[\s\S]*?\],\s*\n\s*products:/, `${fmtCategories(cats)},\n        products:`)
  }
  const prods = mergeProductRows(parseProducts(text))
  return out.replace(/products: \[[\s\S]*?\],\s*\n\s*\},/, `${fmtProducts(prods)},\n      },`)
}

const REVENUE_BY_MONTH = {
  1: 6024.13,
  2: 22046.88,
  3: 45993.29,
  4: 37215.1,
  5: 28655.76,
  6: 24537.89,
}

const byRev = parseEshopBlocks()
const path = new URL('../src/data/sanaplant.js', import.meta.url)
let src = fs.readFileSync(path, 'utf8')

for (const [month, revenue] of Object.entries(REVENUE_BY_MONTH)) {
  const original = byRev.get(revenue)
  if (!original) {
    console.warn(`Chýba transcript pre mesiac ${month} (revenue ${revenue})`)
    continue
  }

  const merged = mergeEshopText(original)
  const rawCats = parseCategories(original)
  const mergedCats = mergeCategoryRows(rawCats)

  // nájdi eshop blok podľa revenue v súbore
  const revStr = String(revenue)
  const revIdx = src.indexOf(`revenue: ${revStr},`)
  if (revIdx === -1) {
    console.warn(`Nenájdené revenue ${revStr} v sanaplant.js`)
    continue
  }
  const eshopStart = src.lastIndexOf('eshop: {', revIdx)
  const eshopEnd = src.indexOf('\n      },', eshopStart) + '\n      },'.length
  const eshopBlock = merged.trimEnd().replace(/^      /, '')

  src = src.slice(0, eshopStart) + eshopBlock + src.slice(eshopEnd)
  console.log(
    `${month}/2026 — kategórie ${rawCats.length} → ${mergedCats.length}` +
      (month === '6' ? `, Fungicídy: ${mergedCats.find((c) => c.name === 'Fungicídy')?.items ?? '?'}` : ''),
  )
}

fs.writeFileSync(path, src)
console.log('Hotovo — sanaplant.js obnovený a zlúčený')
