import { Kpi, Section, SortableTable, MonthBarChart, MonthLineChart, CategoryPieChart } from '../components/ui'
import { monthFull, monthKey, monthLabel, fmtNum, fmtPct, fmtEur } from '../lib/helpers'
import { skSucetZaMesiace } from '../lib/skGrammar'

const CHANNEL_COLORS = ['#4285f4', '#1877F2', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b', '#06b6d4', '#ec4899', '#94a3b8']

function shortLabel(text, max = 32) {
  if (!text || text.length <= max) return text
  return `…${text.slice(-max + 1)}`
}

function channelBarData(traffic, valueKey, limit = 8) {
  return [...(traffic ?? [])]
    .sort((a, b) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0))
    .slice(0, limit)
    .map((r) => ({
      label: r.channelGroup,
      sessions: r.sessions ?? 0,
      revenue: r.totalRevenue ?? 0,
      keyEvents: r.keyEvents ?? 0,
    }))
}

function channelPieData(traffic, valueKey) {
  return (traffic ?? [])
    .filter((r) => (r[valueKey] ?? 0) > 0)
    .map((r, i) => ({
      name: r.channelGroup,
      value: r[valueKey],
      color: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
    }))
}

/** Max. 4 grafy — len pri jednom mesiaci s GA4 CSV exportom. */
function pickTopGa4Charts({
  singleMonth,
  ga4Rows,
  single,
  eshopFormat,
  snapshotChartData,
  legacyChartData,
  channelSessions,
  landingChartData,
  productChartData,
}) {
  const charts = []
  const multiGa4 = ga4Rows.length > 1

  if (multiGa4 && snapshotChartData.length > 1) {
    charts.push({
      title: 'Relácie mesačne',
      node: (
        <MonthLineChart
          data={snapshotChartData}
          height={260}
          series={[{ key: 'sessions', name: 'Relácie', color: '#4285f4' }]}
        />
      ),
    })
    if (snapshotChartData.some((d) => d.revenue > 0)) {
      charts.push({
        title: 'Tržby (GA4) mesačne',
        node: (
          <MonthBarChart
            data={snapshotChartData}
            series={[{ key: 'revenue', name: 'Tržby', color: '#8b5cf6', eur: true }]}
          />
        ),
      })
    }
  }

  if (!singleMonth) return charts.slice(0, 4)

  if (single?.trafficAcquisition?.length) {
    charts.push({
      title: 'Relácie podľa kanála',
      node: (
        <MonthBarChart
          data={channelSessions}
          series={[{ key: 'sessions', name: 'Relácie', color: '#4285f4' }]}
        />
      ),
    })
    const revenuePie = channelPieData(single.trafficAcquisition, 'totalRevenue')
    if (revenuePie.length >= 2) {
      charts.push({
        title: 'Tržby podľa kanála',
        node: <CategoryPieChart data={revenuePie} eur />,
      })
    }
  }

  if (legacyChartData.length > 1) {
    charts.push({
      title: 'Platená vs. organická návštevnosť',
      hint: 'mesačne',
      node: (
        <MonthLineChart
          data={legacyChartData}
          height={260}
          series={[
            { key: 'paid', name: 'Z platených kampaní', color: '#2680eb' },
            { key: 'organic', name: 'Bez platených kampaní', color: '#10b981' },
          ]}
        />
      ),
    })
  }

  if (eshopFormat && productChartData.length) {
    charts.push({
      title: 'Top produkty',
      hint: 'tržby',
      node: (
        <MonthBarChart
          data={productChartData}
          height={260}
          series={[{ key: 'revenue', name: 'Tržby', color: '#8b5cf6', eur: true }]}
        />
      ),
    })
  }

  if (eshopFormat && landingChartData.length) {
    charts.push({
      title: 'Top vstupné stránky',
      hint: 'relácie',
      node: (
        <MonthBarChart
          data={landingChartData}
          height={260}
          series={[{ key: 'sessions', name: 'Relácie', color: '#4285f4' }]}
        />
      ),
    })
  }

  if (!eshopFormat && single?.pages?.length) {
    const pageData = single.pages
      .slice(0, 8)
      .map((r) => ({ label: shortLabel(r.path), views: r.views ?? 0 }))
    charts.push({
      title: 'Top stránky',
      hint: 'zobrazenia',
      node: (
        <MonthBarChart
          data={pageData}
          height={260}
          series={[{ key: 'views', name: 'Zobrazenia', color: '#4285f4' }]}
        />
      ),
    })
  }

  if (
    singleMonth
    && single?.trafficAcquisition?.length
    && charts.length < 4
    && !charts.some((c) => c.title === 'Tržby podľa kanála')
  ) {
    const sessionsPie = channelPieData(single.trafficAcquisition, 'sessions')
    if (sessionsPie.length >= 2) {
      charts.push({
        title: 'Podiel relácií podľa kanála',
        node: <CategoryPieChart data={sessionsPie} />,
      })
    }
  }

  return charts.slice(0, 4)
}

function fmtSec(v) {
  if (v == null) return '–'
  const m = Math.floor(v / 60)
  const s = Math.round(v % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function fmtRate(v) {
  if (v == null) return '–'
  return fmtPct(v * 100, 1)
}

function fmtDec(v, digits = 2) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function isEshopGaFormat(ga) {
  return ga?.landingPages != null || ga?.ecommerceItems != null
}

function aggregateSnapshot(months) {
  const rows = months.filter((m) => m.ga?.snapshot)
  if (!rows.length) return null
  const sessions = rows.reduce((s, m) => s + (m.ga.snapshot.sessions ?? 0), 0)
  const engagedSessions = rows.reduce((s, m) => s + (m.ga.snapshot.engagedSessions ?? 0), 0)
  return {
    activeUsers: rows.reduce((s, m) => s + (m.ga.snapshot.activeUsers ?? 0), 0),
    newUsers: rows.reduce((s, m) => s + (m.ga.snapshot.newUsers ?? 0), 0),
    sessions,
    engagedSessions,
    engagementRate: sessions > 0 ? engagedSessions / sessions : null,
    totalRevenue: rows.reduce((s, m) => s + (m.ga.snapshot.totalRevenue ?? 0), 0),
    keyEvents: rows.reduce((s, m) => s + (m.ga.snapshot.keyEvents ?? 0), 0),
    avgEngagement: rows.length === 1 ? rows[0].ga.snapshot.avgEngagementTimePerActiveUser : null,
  }
}

function buildTrafficColumns(includeSource) {
  const cols = [
    { key: 'channelGroup', label: 'Kanál', sort: (r) => r.channelGroup, render: (r) => r.channelGroup },
  ]
  if (includeSource) {
    cols.push({ key: 'sourceMedium', label: 'Zdroj / médium', sort: (r) => r.sourceMedium, render: (r) => r.sourceMedium })
  }
  cols.push(
    { key: 'sessions', label: 'Relácie', align: 'num', sort: (r) => r.sessions, render: (r) => fmtNum(r.sessions) },
    { key: 'engagedSessions', label: 'Engaged relácie', align: 'num', sort: (r) => r.engagedSessions, render: (r) => fmtNum(r.engagedSessions) },
    { key: 'engagementRate', label: 'Engagement rate', align: 'num', sort: (r) => r.engagementRate, render: (r) => fmtRate(r.engagementRate) },
    { key: 'avgEngagementTimePerSession', label: 'Priem. engagement / relácia', align: 'num', sort: (r) => r.avgEngagementTimePerSession, render: (r) => fmtSec(r.avgEngagementTimePerSession) },
    { key: 'eventsPerSession', label: 'Udalostí / relácia', align: 'num', sort: (r) => r.eventsPerSession, render: (r) => fmtDec(r.eventsPerSession) },
    { key: 'eventCount', label: 'Počet udalostí', align: 'num', sort: (r) => r.eventCount, render: (r) => fmtNum(r.eventCount) },
    { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (r) => r.keyEvents, render: (r) => fmtNum(r.keyEvents) },
    { key: 'sessionKeyEventRate', label: 'Session key event rate', align: 'num', sort: (r) => r.sessionKeyEventRate, render: (r) => fmtRate(r.sessionKeyEventRate) },
    { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (r) => r.totalRevenue, render: (r) => fmtEur(r.totalRevenue) },
  )
  return cols
}

function buildUserAcqColumns(includeSource) {
  const cols = [
    { key: 'firstUserChannelGroup', label: 'Kanál (first user)', sort: (r) => r.firstUserChannelGroup, render: (r) => r.firstUserChannelGroup },
  ]
  if (includeSource) {
    cols.push({ key: 'sourceMedium', label: 'Zdroj / médium', sort: (r) => r.sourceMedium, render: (r) => r.sourceMedium })
  }
  cols.push(
    { key: 'totalUsers', label: 'Používatelia', align: 'num', sort: (r) => r.totalUsers, render: (r) => fmtNum(r.totalUsers) },
    { key: 'newUsers', label: 'Noví', align: 'num', sort: (r) => r.newUsers, render: (r) => fmtNum(r.newUsers) },
    { key: 'returningUsers', label: 'Vracajúci sa', align: 'num', sort: (r) => r.returningUsers, render: (r) => fmtNum(r.returningUsers) },
    { key: 'avgEngagementTimePerActiveUser', label: 'Priem. engagement', align: 'num', sort: (r) => r.avgEngagementTimePerActiveUser, render: (r) => fmtSec(r.avgEngagementTimePerActiveUser) },
    { key: 'engagedSessionsPerActiveUser', label: 'Engaged rel. / user', align: 'num', sort: (r) => r.engagedSessionsPerActiveUser, render: (r) => fmtDec(r.engagedSessionsPerActiveUser) },
    { key: 'eventCount', label: 'Počet udalostí', align: 'num', sort: (r) => r.eventCount, render: (r) => fmtNum(r.eventCount) },
    { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (r) => r.keyEvents, render: (r) => fmtNum(r.keyEvents) },
    { key: 'userKeyEventRate', label: 'User key event rate', align: 'num', sort: (r) => r.userKeyEventRate, render: (r) => fmtRate(r.userKeyEventRate) },
  )
  return cols
}

const landingColumns = [
  { key: 'path', label: 'Vstupná stránka', sort: (r) => r.path, render: (r) => r.path },
  { key: 'sessions', label: 'Relácie', align: 'num', sort: (r) => r.sessions, render: (r) => fmtNum(r.sessions) },
  { key: 'activeUsers', label: 'Aktívni useri', align: 'num', sort: (r) => r.activeUsers, render: (r) => fmtNum(r.activeUsers) },
  { key: 'newUsers', label: 'Noví useri', align: 'num', sort: (r) => r.newUsers, render: (r) => fmtNum(r.newUsers) },
  { key: 'avgEngagementTimePerSession', label: 'Priem. engagement', align: 'num', sort: (r) => r.avgEngagementTimePerSession, render: (r) => fmtSec(r.avgEngagementTimePerSession) },
  { key: 'bounceRate', label: 'Bounce rate', align: 'num', sort: (r) => r.bounceRate, render: (r) => fmtRate(r.bounceRate) },
  { key: 'addToCart', label: 'Do košíka', align: 'num', sort: (r) => r.addToCart, render: (r) => fmtNum(r.addToCart) },
  { key: 'checkouts', label: 'Checkout', align: 'num', sort: (r) => r.checkouts, render: (r) => fmtNum(r.checkouts) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (r) => r.purchases, render: (r) => fmtNum(r.purchases) },
  { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (r) => r.totalRevenue, render: (r) => fmtEur(r.totalRevenue) },
]

const ecommerceColumns = [
  { key: 'name', label: 'Produkt', sort: (r) => r.name, render: (r) => r.name },
  { key: 'itemsViewed', label: 'Zobrazenia', align: 'num', sort: (r) => r.itemsViewed, render: (r) => fmtNum(r.itemsViewed) },
  { key: 'itemsAddedToCart', label: 'Do košíka', align: 'num', sort: (r) => r.itemsAddedToCart, render: (r) => fmtNum(r.itemsAddedToCart) },
  { key: 'itemsPurchased', label: 'Zakúpené', align: 'num', sort: (r) => r.itemsPurchased, render: (r) => fmtNum(r.itemsPurchased) },
  { key: 'itemRevenue', label: 'Tržby', align: 'num', sort: (r) => r.itemRevenue, render: (r) => fmtEur(r.itemRevenue) },
]

const eventColumns = [
  { key: 'name', label: 'Udalosť', sort: (r) => r.name, render: (r) => r.name },
  { key: 'eventCount', label: 'Počet udalostí', align: 'num', sort: (r) => r.eventCount, render: (r) => fmtNum(r.eventCount) },
  { key: 'totalUsers', label: 'Používatelia', align: 'num', sort: (r) => r.totalUsers, render: (r) => fmtNum(r.totalUsers) },
  { key: 'eventCountPerActiveUser', label: 'Udalostí / aktívny user', align: 'num', sort: (r) => r.eventCountPerActiveUser, render: (r) => fmtDec(r.eventCountPerActiveUser) },
  { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (r) => r.totalRevenue, render: (r) => fmtEur(r.totalRevenue) },
]

const pageColumns = [
  { key: 'path', label: 'Stránka', sort: (r) => r.path, render: (r) => r.path },
  { key: 'views', label: 'Zobrazenia', align: 'num', sort: (r) => r.views, render: (r) => fmtNum(r.views) },
  { key: 'activeUsers', label: 'Aktívni useri', align: 'num', sort: (r) => r.activeUsers, render: (r) => fmtNum(r.activeUsers) },
  { key: 'viewsPerActiveUser', label: 'Zobrazení / user', align: 'num', sort: (r) => r.viewsPerActiveUser, render: (r) => fmtDec(r.viewsPerActiveUser) },
  { key: 'avgEngagementTimePerActiveUser', label: 'Priem. engagement', align: 'num', sort: (r) => r.avgEngagementTimePerActiveUser, render: (r) => fmtSec(r.avgEngagementTimePerActiveUser) },
  { key: 'eventCount', label: 'Udalosti', align: 'num', sort: (r) => r.eventCount, render: (r) => fmtNum(r.eventCount) },
  { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (r) => r.keyEvents, render: (r) => fmtNum(r.keyEvents) },
  { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (r) => r.totalRevenue, render: (r) => fmtEur(r.totalRevenue) },
]

const sourceSessionColumns = [
  { key: 'sourceMedium', label: 'Zdroj / médium', sort: (r) => r.sourceMedium, render: (r) => r.sourceMedium },
  { key: 'sessions', label: 'Relácie', align: 'num', sort: (r) => r.sessions, render: (r) => fmtNum(r.sessions) },
  { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (r) => r.keyEvents, render: (r) => fmtNum(r.keyEvents) },
  { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (r) => r.totalRevenue, render: (r) => fmtEur(r.totalRevenue) },
]

const sourceUserColumns = [
  { key: 'sourceMedium', label: 'First user zdroj / médium', sort: (r) => r.sourceMedium, render: (r) => r.sourceMedium },
  { key: 'activeUsers', label: 'Aktívni useri', align: 'num', sort: (r) => r.activeUsers, render: (r) => fmtNum(r.activeUsers) },
]

export default function AnalyticsGa4({ months }) {
  const ga4Rows = months.filter((m) => m.ga?.snapshot || m.ga?.trafficAcquisition)
  const legacyRows = months.filter((m) => m.ga?.paid && !m.ga?.snapshot && !m.ga?.trafficAcquisition)

  if (!ga4Rows.length && !legacyRows.length) {
    return (
      <div className="empty-state">
        Zatiaľ nie sú dostupné GA4 dáta pre zvolené obdobie.
      </div>
    )
  }

  const snap = aggregateSnapshot(ga4Rows) ?? {
    activeUsers: null,
    newUsers: null,
    sessions: null,
    engagedSessions: null,
    engagementRate: null,
    totalRevenue: null,
    keyEvents: null,
    avgEngagement: null,
  }
  const singleMonth = months.length === 1
  const single = singleMonth && ga4Rows.length === 1 ? ga4Rows[0].ga : null
  const eshopFormat = single && isEshopGaFormat(single)
  const trafficHasSource = single?.trafficAcquisition?.some((r) => r.sourceMedium)
  const userHasSource = single?.userAcquisition?.some((r) => r.sourceMedium)

  const snapshotChartData = ga4Rows
    .filter((m) => m.ga?.snapshot)
    .map((m) => ({
      label: monthLabel(m),
      sessions: m.ga.snapshot.sessions,
      activeUsers: m.ga.snapshot.activeUsers,
      newUsers: m.ga.snapshot.newUsers,
      revenue: m.ga.snapshot.totalRevenue,
      keyEvents: m.ga.snapshot.keyEvents,
      engagementRate: m.ga.snapshot.engagementRate != null ? m.ga.snapshot.engagementRate * 100 : null,
    }))

  const legacyChartData = legacyRows.map((m) => ({
    label: monthLabel(m),
    paid: m.ga.paid?.sessions,
    organic: m.ga.organic?.sessions,
    engPaid: m.ga.paid?.engagementRate,
    engOrganic: m.ga.organic?.engagementRate,
  }))

  const channelSessions = single?.trafficAcquisition ? channelBarData(single.trafficAcquisition, 'sessions') : []
  const landingChartData = (single?.landingPages ?? [])
    .slice(0, 8)
    .map((r) => ({ label: shortLabel(r.path), sessions: r.sessions ?? 0, revenue: r.totalRevenue ?? 0 }))
  const productChartData = (single?.ecommerceItems ?? [])
    .slice(0, 8)
    .map((r) => ({ label: shortLabel(r.name, 28), revenue: r.itemRevenue ?? 0, purchased: r.itemsPurchased ?? 0 }))

  const topCharts = pickTopGa4Charts({
    singleMonth,
    ga4Rows,
    single,
    eshopFormat,
    snapshotChartData,
    legacyChartData,
    channelSessions,
    landingChartData,
    productChartData,
  })

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Relácie" value={fmtNum(snap.sessions)} sub={ga4Rows.length > 1 ? skSucetZaMesiace(ga4Rows.length) : null} />
        <Kpi label="Aktívni useri" value={fmtNum(snap.activeUsers)} />
        <Kpi label="Noví useri" value={fmtNum(snap.newUsers)} />
        {snap.totalRevenue > 0 && (
          <Kpi label="Tržby (GA4)" value={fmtEur(snap.totalRevenue)} />
        )}
        {snap.keyEvents > 0 && (
          <Kpi label="Kľúčové udalosti" value={fmtNum(snap.keyEvents)} />
        )}
        {snap.engagementRate != null && (
          <Kpi label="Engagement rate" value={fmtRate(snap.engagementRate)} sub="engaged relácie / relácie" />
        )}
        {snap.avgEngagement != null && (
          <Kpi
            label="Priem. engagement"
            value={fmtSec(snap.avgEngagement)}
            sub="na aktívneho usera"
          />
        )}
      </div>

      {topCharts.length > 0 && (
        <div className="chart-grid section">
          {topCharts.map((chart) => (
            <div key={chart.title}>
              <div className="section-title">
                {chart.title}
                {chart.hint && <span className="hint">{chart.hint}</span>}
              </div>
              <div className="card">{chart.node}</div>
            </div>
          ))}
        </div>
      )}

      {single && (
        <>
          {eshopFormat && single.trafficAcquisition?.length > 0 && (
            <Section title="Návštevnosť podľa kanála" hint="Traffic acquisition — Session primary channel group">
              <SortableTable
                columns={buildTrafficColumns(trafficHasSource)}
                rows={single.trafficAcquisition}
                rowKey={(r) => r.channelGroup + (r.sourceMedium ?? '')}
                defaultSortKey="sessions"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {eshopFormat && single.userAcquisition?.length > 0 && (
            <Section title="Získanie používateľov" hint="User acquisition — First user primary channel group">
              <SortableTable
                columns={buildUserAcqColumns(userHasSource)}
                rows={single.userAcquisition}
                rowKey={(r) => r.firstUserChannelGroup + (r.sourceMedium ?? '')}
                defaultSortKey="totalUsers"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {eshopFormat && single.landingPages?.length > 0 && (
            <Section title="Vstupné stránky" hint="Landing page — top 50 podľa relácií">
              <SortableTable
                columns={landingColumns}
                rows={single.landingPages}
                rowKey={(r) => r.path}
                defaultSortKey="sessions"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {eshopFormat && single.ecommerceItems?.length > 0 && (
            <Section title="E-commerce produkty" hint="E-commerce purchases — Item name, top 50 podľa tržieb">
              <SortableTable
                columns={ecommerceColumns}
                rows={single.ecommerceItems}
                rowKey={(r) => r.name}
                defaultSortKey="itemRevenue"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {!eshopFormat && single.sessionsBySource?.length > 0 && (
            <Section title="Relácie podľa zdroja" hint="Reports snapshot">
              <SortableTable
                columns={sourceSessionColumns}
                rows={single.sessionsBySource}
                rowKey={(r) => r.sourceMedium}
                defaultSortKey="sessions"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {!eshopFormat && single.activeUsersByFirstUserSource?.length > 0 && (
            <Section title="Aktívni useri podľa first user zdroja" hint="Reports snapshot">
              <SortableTable
                columns={sourceUserColumns}
                rows={single.activeUsersByFirstUserSource}
                rowKey={(r) => r.sourceMedium}
                defaultSortKey="activeUsers"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {!eshopFormat && single.events?.length > 0 && (
            <Section title="Udalosti" hint="Events: Event name">
              <SortableTable
                columns={eventColumns}
                rows={single.events}
                rowKey={(r) => r.name}
                defaultSortKey="eventCount"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {!eshopFormat && single.pages?.length > 0 && (
            <Section title="Stránky a obrazovky" hint="Pages and screens">
              <SortableTable
                columns={pageColumns}
                rows={single.pages}
                rowKey={(r) => r.path}
                defaultSortKey="views"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {!eshopFormat && single.trafficAcquisition?.length > 0 && (
            <Section title="Traffic acquisition" hint="Session primary channel group">
              <SortableTable
                columns={buildTrafficColumns(true)}
                rows={single.trafficAcquisition}
                rowKey={(r) => `${r.channelGroup}-${r.sourceMedium}`}
                defaultSortKey="sessions"
                defaultSortDir="desc"
              />
            </Section>
          )}

          {!eshopFormat && single.userAcquisition?.length > 0 && (
            <Section title="User acquisition" hint="First user primary channel group">
              <SortableTable
                columns={buildUserAcqColumns(true)}
                rows={single.userAcquisition}
                rowKey={(r) => `${r.firstUserChannelGroup}-${r.sourceMedium}`}
                defaultSortKey="totalUsers"
                defaultSortDir="desc"
              />
            </Section>
          )}
        </>
      )}

      {ga4Rows.length > 1 && (
        <Section title="Snapshot po mesiacoch">
          <SortableTable
            columns={[
              { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
              { key: 'sessions', label: 'Relácie', align: 'num', sort: (m) => m.ga.snapshot?.sessions, render: (m) => fmtNum(m.ga.snapshot?.sessions) },
              { key: 'activeUsers', label: 'Aktívni useri', align: 'num', sort: (m) => m.ga.snapshot?.activeUsers, render: (m) => fmtNum(m.ga.snapshot?.activeUsers) },
              { key: 'newUsers', label: 'Noví useri', align: 'num', sort: (m) => m.ga.snapshot?.newUsers, render: (m) => fmtNum(m.ga.snapshot?.newUsers) },
              { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (m) => m.ga.snapshot?.totalRevenue, render: (m) => fmtEur(m.ga.snapshot?.totalRevenue) },
              { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (m) => m.ga.snapshot?.keyEvents, render: (m) => fmtNum(m.ga.snapshot?.keyEvents) },
              { key: 'engagementRate', label: 'Engagement rate', align: 'num', sort: (m) => m.ga.snapshot?.engagementRate, render: (m) => fmtRate(m.ga.snapshot?.engagementRate) },
            ]}
            rows={ga4Rows.filter((m) => m.ga?.snapshot)}
            rowKey={(m) => `${m.year}-${m.month}`}
            defaultSortKey="month"
            defaultSortDir="desc"
          />
        </Section>
      )}

      {legacyRows.length > 0 && (
        <Section title="Platená vs. organická návštevnosť" hint="starší import z PDF reportu">
          <SortableTable
            columns={[
              { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
              { key: 'paidSessions', label: 'Relácie (kampane)', align: 'num', sort: (m) => m.ga.paid?.sessions, render: (m) => fmtNum(m.ga.paid?.sessions) },
              { key: 'paidUsers', label: 'Návšt. (kampane)', align: 'num', sort: (m) => m.ga.paid?.users, render: (m) => fmtNum(m.ga.paid?.users) },
              { key: 'paidEng', label: 'Interakcia (kamp.)', align: 'num', sort: (m) => m.ga.paid?.engagementRate, render: (m) => fmtPct(m.ga.paid?.engagementRate, 1) },
              { key: 'paidDur', label: 'Trvanie (kamp.)', align: 'num', sort: (m) => m.ga.paid?.avgDuration, render: (m) => m.ga.paid?.avgDuration ?? '–' },
              { key: 'orgSessions', label: 'Relácie (org.)', align: 'num', sort: (m) => m.ga.organic?.sessions, render: (m) => fmtNum(m.ga.organic?.sessions) },
              { key: 'orgUsers', label: 'Návšt. (org.)', align: 'num', sort: (m) => m.ga.organic?.users, render: (m) => fmtNum(m.ga.organic?.users) },
              { key: 'orgEng', label: 'Interakcia (org.)', align: 'num', sort: (m) => m.ga.organic?.engagementRate, render: (m) => fmtPct(m.ga.organic?.engagementRate, 1) },
              { key: 'orgDur', label: 'Trvanie (org.)', align: 'num', sort: (m) => m.ga.organic?.avgDuration, render: (m) => m.ga.organic?.avgDuration ?? '–' },
            ]}
            rows={legacyRows}
            rowKey={(m) => `${m.year}-${m.month}`}
            defaultSortKey="month"
            defaultSortDir="desc"
          />
        </Section>
      )}
    </>
  )
}
