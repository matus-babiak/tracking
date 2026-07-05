import { IMPORT_SOURCES, getMonthSources } from './importOverview'
import { clientTabs } from './helpers'

/** Typ dashboardu — určuje variant stránok (KPI, stĺpce), nie samotné dáta. */
export function getClientUiProfile(client) {
  if (client.leadgenProfile === 'dual') return 'dual'
  if (client.metaProfile === 'leadgen') return 'leadgen'
  if (client.adsProfile === 'eshop') return 'ads-eshop'
  return 'eshop'
}

const PROFILE_LABELS = {
  eshop: 'E-shop (Meta + Google nákupy, ROAS, tržby)',
  'ads-eshop': 'E-shop — zjednodušené PPC (nákupy, ROAS)',
  leadgen: 'Leadgen (Meta — dosah, engagement, návštevy)',
  dual: 'Leadgen dual (Meta + Google — konverzie, formuláre, telefón)',
}

export function getClientProfileLabel(client) {
  return PROFILE_LABELS[getClientUiProfile(client)] ?? PROFILE_LABELS.eshop
}

const METRIC_LABELS = {
  spend: 'Investícia',
  impressions: 'Zobrazenia',
  reach: 'Dosah',
  clicks: 'Kliknutia',
  purchases: 'Nákupy',
  purchaseValue: 'Hodnota nákupov',
  roas: 'ROAS',
  addToCart: 'Pridané do košíka',
  cpc: 'CPC',
  costPerPurchase: 'Cena / nákup',
  cpm: 'CPM',
  frequency: 'Frekvencia',
  landingPageViews: 'Návštevy (LPV)',
  engagements: 'Post engagement',
  costPerEngagement: 'Cena / interakciu',
  saves: 'Uloženia',
  ctr: 'CTR',
  convRate: 'Miera konverzie',
  conversions: 'Konverzie',
  costPerConv: 'Cena / konverziu',
  conversionActions: 'Konverzie podľa akcií',
  interactions: 'Interakcie',
  interactionRate: 'Miera interakcie',
  impressionsTop: 'Zobrazenia navrchu',
  impressionsAbsTop: 'Absolútne navrchu',
  sent: 'Odoslané',
  openRate: 'Open rate',
  clickRate: 'Click rate',
  uniqueClicks: 'Unikátne kliknutia',
  unsubRate: 'Odhlásenia',
  orders: 'Objednávky',
  revenue: 'Tržby',
  campaignsCount: 'Počet kampaní',
  items: 'Predané položky',
  netRevenue: 'Čisté predaje',
  encyItems: 'Encyklopédia (ks)',
  encyOrders: 'Encyklopédia (obj.)',
  encyRevenue: 'Encyklopédia (tržby)',
  'paid.sessions': 'Platené — relácie',
  'paid.users': 'Platené — používatelia',
  'paid.engagementRate': 'Platené — miera interakcie',
  'paid.avgDuration': 'Platené — priem. trvanie',
  'organic.sessions': 'Organické — relácie',
  'organic.users': 'Organické — používatelia',
  'organic.engagementRate': 'Organické — miera interakcie',
  'organic.avgDuration': 'Organické — priem. trvanie',
  snapshot: 'GA4 snapshot',
  events: 'GA4 udalosti',
  pages: 'GA4 stránky',
  trafficAcquisition: 'GA4 traffic acquisition',
  userAcquisition: 'GA4 user acquisition',
  pageviews: 'Zobrazenia stránok',
  visits: 'Návštevy',
  sessions: 'Relácie',
  sectionViews: 'Zobrazenia sekcií',
  countries: 'Krajiny',
  browsers: 'Prehliadače',
  devices: 'Zariadenia',
  referrers: 'Referrer',
  clicks: 'Kliknutia',
  scroll: 'Scroll depth',
}

const SKIP_KEYS = new Set(['campaigns', 'ads'])

function collectScalarKeys(obj, prefix = '') {
  const keys = new Set()
  if (!obj || typeof obj !== 'object') return keys
  for (const [k, v] of Object.entries(obj)) {
    if (SKIP_KEYS.has(k)) continue
    const path = prefix ? `${prefix}.${k}` : k
    if (v == null) continue
    if (Array.isArray(v)) {
      keys.add(path)
      continue
    }
    if (typeof v === 'object') {
      if (k === 'paid' || k === 'organic') {
        for (const sub of collectScalarKeys(v, path)) keys.add(sub)
      } else {
        keys.add(path)
      }
      continue
    }
    keys.add(path)
  }
  return keys
}

/** Metriky, ktoré sa reálne vyskytujú v importe klienta (union všetkých mesiacov). */
export function getImportedMetricKeys(client, sourceKey) {
  const keys = new Set()
  for (const month of client.months) {
    const block = month[sourceKey]
    if (!block) continue
    for (const k of collectScalarKeys(block)) keys.add(k)
  }
  return [...keys].sort()
}

export function metricLabel(key) {
  return METRIC_LABELS[key] ?? key
}

/** Zdroje s aspoň jedným importovaným mesiacom. */
export function getClientImportSources(client) {
  const seen = new Set()
  for (const month of client.months) {
    for (const key of getMonthSources(month)) seen.add(key)
  }
  return IMPORT_SOURCES.filter((s) => seen.has(s.key))
}

const TAB_LABELS = {
  overview: 'Prehľad',
  meta: 'Meta Ads',
  google: 'Google Ads',
  ga: 'Google Analytics',
  email: 'Email marketing',
}

/** Popis klienta pre návody — profil, taby, metriky z importu. */
export function describeClientMetrics(client) {
  const sources = getClientImportSources(client)
  const tabs = clientTabs(client).map((id) => TAB_LABELS[id] ?? id)
  const metricsBySource = Object.fromEntries(
    sources.map((s) => [s.key, getImportedMetricKeys(client, s.key)]),
  )
  return {
    profile: getClientUiProfile(client),
    profileLabel: getClientProfileLabel(client),
    tabs,
    sources,
    metricsBySource,
  }
}
