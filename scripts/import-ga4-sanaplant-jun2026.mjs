import fs from 'fs'
import path from 'path'

const DOWNLOADS = '/Users/matus/Downloads'

function parseCsv(content) {
  const lines = content.split(/\r?\n/)
  let i = 0
  while (i < lines.length && (lines[i].startsWith('#') || !lines[i].trim())) i++
  const header = lines[i].split(',').map((h) => h.trim())
  i++
  const rows = []
  for (; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const cols = []
    let cur = ''
    let inQuotes = false
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      if (ch === '"') { inQuotes = !inQuotes; continue }
      if (ch === ',' && !inQuotes) { cols.push(cur); cur = ''; continue }
      cur += ch
    }
    cols.push(cur)
    const row = {}
    header.forEach((h, idx) => { row[h] = cols[idx] ?? '' })
    rows.push(row)
  }
  return rows
}

function num(v) {
  if (v == null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function readCsv(name) {
  return parseCsv(fs.readFileSync(path.join(DOWNLOADS, name), 'utf8'))
}

function topRows(rows, sortKey, limit = 50) {
  return [...rows]
    .sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0))
    .slice(0, limit)
}

// Traffic acquisition
const trafficRaw = readCsv('Traffic_acquisition_Session_primary_channel_group_(Default_channel_group) (1).csv')
const trafficAcquisition = trafficRaw.map((r) => ({
  channelGroup: r['Session primary channel group (Default channel group)'],
  sessions: num(r.Sessions),
  engagedSessions: num(r['Engaged sessions']),
  engagementRate: num(r['Engagement rate']),
  avgEngagementTimePerSession: num(r['Average engagement time per session']),
  eventsPerSession: num(r['Events per session']),
  eventCount: num(r['Event count']),
  keyEvents: num(r['Key events']),
  sessionKeyEventRate: num(r['Session key event rate']),
  totalRevenue: num(r['Total revenue']),
}))

// User acquisition
const userRaw = readCsv('User_acquisition_First_user_primary_channel_group_(Default_channel_group) (1).csv')
const userAcquisition = userRaw.map((r) => ({
  firstUserChannelGroup: r['First user primary channel group (Default channel group)'],
  totalUsers: num(r['Total users']),
  newUsers: num(r['New users']),
  returningUsers: num(r['Returning users']),
  avgEngagementTimePerActiveUser: num(r['Average engagement time per active user']),
  engagedSessionsPerActiveUser: num(r['Engaged sessions per active user']),
  eventCount: num(r['Event count']),
  keyEvents: num(r['Key events']),
  userKeyEventRate: num(r['User key event rate']),
}))

// Landing pages
const landingRaw = readCsv('Landing_page_Landing_page.csv')
const landingPages = topRows(
  landingRaw.map((r) => ({
    path: r['Landing page'],
    sessions: num(r.Sessions),
    activeUsers: num(r['Active users']),
    newUsers: num(r['New users']),
    avgEngagementTimePerSession: num(r['Average engagement time per session']),
    totalRevenue: num(r['Total revenue']),
    bounceRate: num(r['Bounce rate']),
    addToCart: num(r['Add to baskets']),
    checkouts: num(r.Checkouts),
    purchases: num(r['E-commerce purchases']),
  })),
  'sessions',
  50,
)

// E-commerce items — exclude junk rows, top by revenue then purchases
const itemsRaw = readCsv('E-commerce_purchases_Item_name.csv')
const ecommerceItems = topRows(
  itemsRaw
    .filter((r) => r['Item name'] && r['Item name'] !== '(not set)')
    .map((r) => ({
      name: r['Item name'],
      itemsViewed: num(r['Items viewed']),
      itemsAddedToCart: num(r['Items added to cart']),
      itemsPurchased: num(r['Items purchased']),
      itemRevenue: num(r['Item revenue']),
    }))
    .filter((r) => (r.itemsPurchased ?? 0) > 0 || (r.itemRevenue ?? 0) > 0),
  'itemRevenue',
  50,
)

// Snapshot totals from traffic
const sessions = trafficAcquisition.reduce((s, r) => s + (r.sessions ?? 0), 0)
const engagedSessions = trafficAcquisition.reduce((s, r) => s + (r.engagedSessions ?? 0), 0)
const totalRevenue = trafficAcquisition.reduce((s, r) => s + (r.totalRevenue ?? 0), 0)
const keyEvents = trafficAcquisition.reduce((s, r) => s + (r.keyEvents ?? 0), 0)
const totalUsers = userAcquisition.reduce((s, r) => s + (r.totalUsers ?? 0), 0)
const newUsers = userAcquisition.reduce((s, r) => s + (r.newUsers ?? 0), 0)

const ga = {
  snapshot: {
    activeUsers: totalUsers,
    newUsers,
    sessions,
    engagedSessions,
    engagementRate: sessions > 0 ? engagedSessions / sessions : null,
    totalRevenue,
    keyEvents,
  },
  trafficAcquisition,
  userAcquisition,
  landingPages,
  ecommerceItems,
}

console.log(JSON.stringify(ga, null, 2))
