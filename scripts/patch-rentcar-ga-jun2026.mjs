import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOWNLOADS = '/Users/matus/Downloads'
const DATA_FILE = path.join(__dirname, '../src/data/rentcarslovakia.js')

const FILES = {
  traffic: 'Traffic_acquisition_Session_primary_channel_group_(Default_Channel_Group) (4).csv',
  user: 'User_acquisition_First_user_primary_channel_group_(Default_Channel_Group) (4).csv',
  landing: 'Landing_page_Landing_page (4).csv',
  events: 'Events_Event_name.csv',
}

const TRAFFIC_CHANNEL = 'Session primary channel group (Default Channel Group)'
const USER_CHANNEL = 'First user primary channel group (Default Channel Group)'

function parseCsv(content) {
  const lines = content.split(/\r?\n/)
  let i = 0
  while (i < lines.length && (lines[i].startsWith('#') || !lines[i].trim())) i++
  const header = lines[i].split(',').map((h) => h.trim())
  i++
  const rows = []
  for (; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.startsWith('#')) continue
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

function weightedAvg(rows, valueKey, weightKey) {
  let weight = 0
  let sum = 0
  for (const r of rows) {
    const w = r[weightKey] ?? 0
    const v = r[valueKey]
    if (w > 0 && v != null) {
      weight += w
      sum += w * v
    }
  }
  return weight > 0 ? sum / weight : null
}

const trafficAcquisition = readCsv(FILES.traffic).map((r) => ({
  channelGroup: r[TRAFFIC_CHANNEL],
  sessions: num(r.Sessions),
  engagedSessions: num(r['Engaged sessions']),
  engagementRate: num(r['Engagement rate']),
  avgEngagementTimePerSession: num(r['Average engagement time per session']),
  eventsPerSession: num(r['Events per session']),
  keyEvents: num(r['Key events']),
  bounceRate: num(r['Bounce rate']),
}))

const userAcquisition = readCsv(FILES.user).map((r) => ({
  firstUserChannelGroup: r[USER_CHANNEL],
  totalUsers: num(r['Total users']),
  newUsers: num(r['New users']),
  returningUsers: num(r['Returning users']),
  avgEngagementTimePerActiveUser: num(r['Average engagement time per active user']),
  engagedSessionsPerActiveUser: num(r['Engaged sessions per active user']),
  keyEvents: num(r['Key events']),
  bounceRate: num(r['Bounce rate']),
}))

const landingPages = topRows(
  readCsv(FILES.landing).map((r) => ({
    path: r['Landing page'],
    sessions: num(r.Sessions),
    activeUsers: num(r['Active users']),
    newUsers: num(r['New users']),
    avgEngagementTimePerSession: num(r['Average engagement time per session']),
    keyEvents: num(r['Key events']),
    bounceRate: num(r['Bounce rate']),
  })),
  'sessions',
  50,
)

const events = readCsv(FILES.events).map((r) => ({
  name: r['Event name'],
  eventCount: num(r['Event count']),
  totalUsers: num(r['Total users']),
  eventCountPerActiveUser: num(r['Event count per active user']),
}))

const sessions = trafficAcquisition.reduce((s, r) => s + (r.sessions ?? 0), 0)
const engagedSessions = trafficAcquisition.reduce((s, r) => s + (r.engagedSessions ?? 0), 0)
const keyEvents = trafficAcquisition.reduce((s, r) => s + (r.keyEvents ?? 0), 0)
const sessionStart = events.find((e) => e.name === 'session_start')
const firstVisit = events.find((e) => e.name === 'first_visit')

const ga = {
  snapshot: {
    activeUsers: sessionStart?.totalUsers ?? null,
    newUsers: firstVisit?.totalUsers ?? userAcquisition.reduce((s, r) => s + (r.newUsers ?? 0), 0),
    sessions,
    engagedSessions,
    engagementRate: sessions > 0 ? engagedSessions / sessions : null,
    bounceRate: weightedAvg(trafficAcquisition, 'bounceRate', 'sessions'),
    keyEvents,
    avgEngagementTimePerActiveUser: weightedAvg(userAcquisition, 'avgEngagementTimePerActiveUser', 'totalUsers'),
  },
  trafficAcquisition,
  userAcquisition,
  landingPages,
  events,
}

function toJs(obj, indent = 8) {
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

const gaJs = toJs(ga, 8)
const content = fs.readFileSync(DATA_FILE, 'utf8')
const marker = `          },
        ],
      },
    },
    {
      year: 2026, month: 7,`
const idx = content.indexOf(marker)
if (idx === -1) throw new Error('RentCar June 2026 block not found')

const updated = content.slice(0, idx) + `          },
        ],
      },
      ga: ${gaJs},
    },
    {
      year: 2026, month: 7,` + content.slice(idx + marker.length)
fs.writeFileSync(DATA_FILE, updated)
console.log(`Updated rentcarslovakia.js June 2026 GA — ${sessions} sessions, ${sessionStart?.totalUsers ?? '?'} users, ${keyEvents} key events`)
