import { Kpi, Section, SortableTable } from '../components/ui'
import { monthFull, monthKey, fmtNum, fmtPct, fmtEur } from '../lib/helpers'
import { skSucetZaMesiace } from '../lib/skGrammar'

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

function aggregateSnapshot(months) {
  const rows = months.filter((m) => m.ga?.snapshot)
  return {
    activeUsers: rows.reduce((s, m) => s + (m.ga.snapshot.activeUsers ?? 0), 0),
    newUsers: rows.reduce((s, m) => s + (m.ga.snapshot.newUsers ?? 0), 0),
    sessions: rows.reduce((s, m) => s + (m.ga.snapshot.sessions ?? 0), 0),
    avgEngagement: rows.length === 1 ? rows[0].ga.snapshot.avgEngagementTimePerActiveUser : null,
  }
}

export default function AnalyticsGa4({ months }) {
  const rows = months.filter((m) => m.ga?.snapshot)
  if (!rows.length) {
    return (
      <div className="empty-state">
        Zatiaľ nie sú dostupné GA4 dáta pre zvolené obdobie.
      </div>
    )
  }

  const snap = aggregateSnapshot(rows)
  const single = rows.length === 1 ? rows[0].ga : null

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
    { key: 'avgEngagementTimePerActiveUser', label: 'Priem. engagement (s)', align: 'num', sort: (r) => r.avgEngagementTimePerActiveUser, render: (r) => fmtDec(r.avgEngagementTimePerActiveUser, 1) },
    { key: 'eventCount', label: 'Udalosti', align: 'num', sort: (r) => r.eventCount, render: (r) => fmtNum(r.eventCount) },
    { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (r) => r.keyEvents, render: (r) => fmtNum(r.keyEvents) },
    { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (r) => r.totalRevenue, render: (r) => fmtEur(r.totalRevenue) },
  ]

  const trafficColumns = [
    { key: 'channelGroup', label: 'Kanál', sort: (r) => r.channelGroup, render: (r) => r.channelGroup },
    { key: 'sourceMedium', label: 'Zdroj / médium', sort: (r) => r.sourceMedium, render: (r) => r.sourceMedium },
    { key: 'sessions', label: 'Relácie', align: 'num', sort: (r) => r.sessions, render: (r) => fmtNum(r.sessions) },
    { key: 'engagedSessions', label: 'Engaged relácie', align: 'num', sort: (r) => r.engagedSessions, render: (r) => fmtNum(r.engagedSessions) },
    { key: 'engagementRate', label: 'Engagement rate', align: 'num', sort: (r) => r.engagementRate, render: (r) => fmtRate(r.engagementRate) },
    { key: 'avgEngagementTimePerSession', label: 'Priem. engagement / relácia (s)', align: 'num', sort: (r) => r.avgEngagementTimePerSession, render: (r) => fmtDec(r.avgEngagementTimePerSession, 1) },
    { key: 'eventsPerSession', label: 'Udalostí / relácia', align: 'num', sort: (r) => r.eventsPerSession, render: (r) => fmtDec(r.eventsPerSession) },
    { key: 'eventCount', label: 'Počet udalostí', align: 'num', sort: (r) => r.eventCount, render: (r) => fmtNum(r.eventCount) },
    { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (r) => r.keyEvents, render: (r) => fmtNum(r.keyEvents) },
    { key: 'sessionKeyEventRate', label: 'Session key event rate', align: 'num', sort: (r) => r.sessionKeyEventRate, render: (r) => fmtRate(r.sessionKeyEventRate) },
    { key: 'totalRevenue', label: 'Tržby', align: 'num', sort: (r) => r.totalRevenue, render: (r) => fmtEur(r.totalRevenue) },
  ]

  const userAcqColumns = [
    { key: 'firstUserChannelGroup', label: 'Kanál (first user)', sort: (r) => r.firstUserChannelGroup, render: (r) => r.firstUserChannelGroup },
    { key: 'sourceMedium', label: 'Zdroj / médium', sort: (r) => r.sourceMedium, render: (r) => r.sourceMedium },
    { key: 'totalUsers', label: 'Používatelia', align: 'num', sort: (r) => r.totalUsers, render: (r) => fmtNum(r.totalUsers) },
    { key: 'newUsers', label: 'Noví', align: 'num', sort: (r) => r.newUsers, render: (r) => fmtNum(r.newUsers) },
    { key: 'returningUsers', label: 'Vracajúci sa', align: 'num', sort: (r) => r.returningUsers, render: (r) => fmtNum(r.returningUsers) },
    { key: 'avgEngagementTimePerActiveUser', label: 'Priem. engagement (s)', align: 'num', sort: (r) => r.avgEngagementTimePerActiveUser, render: (r) => fmtDec(r.avgEngagementTimePerActiveUser, 1) },
    { key: 'engagedSessionsPerActiveUser', label: 'Engaged rel. / user', align: 'num', sort: (r) => r.engagedSessionsPerActiveUser, render: (r) => fmtDec(r.engagedSessionsPerActiveUser) },
    { key: 'eventCount', label: 'Počet udalostí', align: 'num', sort: (r) => r.eventCount, render: (r) => fmtNum(r.eventCount) },
    { key: 'keyEvents', label: 'Kľúčové udalosti', align: 'num', sort: (r) => r.keyEvents, render: (r) => fmtNum(r.keyEvents) },
    { key: 'userKeyEventRate', label: 'User key event rate', align: 'num', sort: (r) => r.userKeyEventRate, render: (r) => fmtRate(r.userKeyEventRate) },
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

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Aktívni useri" value={fmtNum(snap.activeUsers)} sub={rows.length > 1 ? skSucetZaMesiace(rows.length) : null} />
        <Kpi label="Noví useri" value={fmtNum(snap.newUsers)} />
        <Kpi label="Relácie" value={fmtNum(snap.sessions)} />
        <Kpi
          label="Priem. engagement"
          value={snap.avgEngagement != null ? fmtSec(snap.avgEngagement) : '–'}
          sub="na aktívneho usera"
        />
      </div>

      {single && (
        <>
          <Section title="Relácie podľa zdroja" hint="Reports snapshot">
            <SortableTable
              columns={sourceSessionColumns}
              rows={single.sessionsBySource ?? []}
              rowKey={(r) => r.sourceMedium}
              defaultSortKey="sessions"
              defaultSortDir="desc"
            />
          </Section>

          <Section title="Aktívni useri podľa first user zdroja" hint="Reports snapshot">
            <SortableTable
              columns={sourceUserColumns}
              rows={single.activeUsersByFirstUserSource ?? []}
              rowKey={(r) => r.sourceMedium}
              defaultSortKey="activeUsers"
              defaultSortDir="desc"
            />
          </Section>

          <Section title="Udalosti" hint="Events: Event name">
            <SortableTable
              columns={eventColumns}
              rows={single.events ?? []}
              rowKey={(r) => r.name}
              defaultSortKey="eventCount"
              defaultSortDir="desc"
            />
          </Section>

          <Section title="Stránky a obrazovky" hint="Pages and screens">
            <SortableTable
              columns={pageColumns}
              rows={single.pages ?? []}
              rowKey={(r) => r.path}
              defaultSortKey="views"
              defaultSortDir="desc"
            />
          </Section>

          <Section title="Traffic acquisition" hint="Session primary channel group">
            <SortableTable
              columns={trafficColumns}
              rows={single.trafficAcquisition ?? []}
              rowKey={(r) => `${r.channelGroup}-${r.sourceMedium}`}
              defaultSortKey="sessions"
              defaultSortDir="desc"
            />
          </Section>

          <Section title="User acquisition" hint="First user primary channel group">
            <SortableTable
              columns={userAcqColumns}
              rows={single.userAcquisition ?? []}
              rowKey={(r) => `${r.firstUserChannelGroup}-${r.sourceMedium}`}
              defaultSortKey="totalUsers"
              defaultSortDir="desc"
            />
          </Section>
        </>
      )}

      {rows.length > 1 && (
        <Section title="Snapshot po mesiacoch">
          <SortableTable
            columns={[
              { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
              { key: 'activeUsers', label: 'Aktívni useri', align: 'num', sort: (m) => m.ga.snapshot.activeUsers, render: (m) => fmtNum(m.ga.snapshot.activeUsers) },
              { key: 'newUsers', label: 'Noví useri', align: 'num', sort: (m) => m.ga.snapshot.newUsers, render: (m) => fmtNum(m.ga.snapshot.newUsers) },
              { key: 'sessions', label: 'Relácie', align: 'num', sort: (m) => m.ga.snapshot.sessions, render: (m) => fmtNum(m.ga.snapshot.sessions) },
              { key: 'avgEngagement', label: 'Priem. engagement', align: 'num', sort: (m) => m.ga.snapshot.avgEngagementTimePerActiveUser, render: (m) => fmtSec(m.ga.snapshot.avgEngagementTimePerActiveUser) },
            ]}
            rows={rows}
            rowKey={(m) => `${m.year}-${m.month}`}
            defaultSortKey="month"
            defaultSortDir="desc"
          />
        </Section>
      )}
    </>
  )
}
