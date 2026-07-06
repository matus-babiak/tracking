#!/usr/bin/env node
/**
 * Premigruje meta.campaigns → meta.ads (iba v meta bloku) pre HAGARD:HAL.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function campaignRowToAd(item) {
  if (item.campaign) return { ...item }
  if (/^Hagard_/i.test(item.name)) {
    return { ...item, campaign: item.name, name: '—' }
  }
  return { ...item, campaign: '—', name: item.name }
}

function toJs(obj, indent = 10) {
  const pad = ' '.repeat(indent)
  const padInner = ' '.repeat(indent + 2)
  if (obj == null) return 'null'
  if (typeof obj === 'number') return String(obj)
  if (typeof obj === 'string') return JSON.stringify(obj)
  if (Array.isArray(obj)) {
    if (!obj.length) return '[]'
    return `[\n${obj.map((item) => `${padInner}${toJs(item, indent + 2)}`).join(',\n')}\n${pad}]`
  }
  const entries = Object.entries(obj).map(([k, v]) => `${padInner}${k}: ${toJs(v, indent + 2)}`)
  return `{\n${entries.join(',\n')}\n${pad}}`
}

const dataPath = path.join(__dirname, '../src/data/hagardhal.js')
const mod = await import(`file://${dataPath}`)
const hagardhal = mod.default
let migrated = 0

for (const month of hagardhal.months) {
  const meta = month.meta
  if (!meta?.campaigns?.length || meta.ads?.length) continue
  const ads = meta.campaigns.map(campaignRowToAd)
  const { campaigns, ...rest } = meta
  month.meta = { ...rest, ads }
  migrated += 1
}

if (!migrated) {
  console.log('Nothing to migrate')
  process.exit(0)
}

const header = `// Klient: HAGARD:HAL — dáta z mesačných reportov 1/2025 – 6/2026.
// Vygenerované zo súborov v reportyHH/

const hagardhal = ${toJs(hagardhal, 0).replace(/^/m, (line, i) => (i === 0 ? line : line))}

export default hagardhal
`

// Preserve notes and client-level fields via structured serialize
function serializeClient(client) {
  const lines = [
    '// Klient: HAGARD:HAL — dáta z mesačných reportov 1/2025 – 6/2026.',
    '// Vygenerované zo súborov v reportyHH/',
    '',
    'const hagardhal = {',
    `  id: ${JSON.stringify(client.id)},`,
    `  name: ${JSON.stringify(client.name)},`,
    `  businessType: ${JSON.stringify(client.businessType)},`,
    `  adsProfile: ${JSON.stringify(client.adsProfile)},`,
    `  metaBreakdown: ${JSON.stringify(client.metaBreakdown)},`,
    `  metaAdsProfile: ${JSON.stringify(client.metaAdsProfile)},`,
    `  metaShowCampaigns: ${client.metaShowCampaigns},`,
    `  currency: ${JSON.stringify(client.currency)},`,
    '  notes: [',
    ...client.notes.map((n) => `    ${JSON.stringify(n)},`),
    '  ],',
    '  months: ' + toJs(client.months, 2).replace(/^\{\n/, '[\n').replace(/\n\}$/, '\n  ],'),
    '}',
    '',
    'export default hagardhal',
    '',
  ]
  return lines.join('\n')
}

fs.writeFileSync(dataPath, serializeClient(hagardhal))
console.log(`Migrated ${migrated} month(s): meta.campaigns → meta.ads`)
