import { Kpi, Section, MonthLineChart, MonthBarChart, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, fmtPct, sum, pctChange, hasEshopTab } from '../lib/helpers'
import { fmtSkCount } from '../lib/skGrammar'
import AnalyticsGa4 from './AnalyticsGa4'

function hasGa4Export(months) {
  const withGa = months.filter((m) => m.ga)
  if (!withGa.length) return false
  const hasLegacy = withGa.some((m) => m.ga.paid && !m.ga.snapshot && !m.ga.trafficAcquisition)
  const hasNew = withGa.some((m) => m.ga.snapshot || m.ga.trafficAcquisition)
  if (hasLegacy && hasNew) return false
  return hasNew
}

function durationSec(s) {
  if (!s || s === '–') return null
  const [h, m, sec] = s.split(':').map(Number)
  return h * 3600 + m * 60 + sec
}

function gaStats(months) {
  const rows = months.filter((m) => m.ga)
  const paidSessions = sum(rows, (m) => m.ga.paid?.sessions)
  const organicSessions = sum(rows, (m) => m.ga.organic?.sessions)
  return {
    paidSessions,
    organicSessions,
    totalSessions: (paidSessions ?? 0) + (organicSessions ?? 0),
    paidUsers: sum(rows, (m) => m.ga.paid?.users),
    organicUsers: sum(rows, (m) => m.ga.organic?.users),
    eshopRevenue: sum(rows, (m) => m.eshop?.revenue),
    eshopItems: sum(rows, (m) => m.eshop?.items),
  }
}

const trafficColumns = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'paidSessions', label: 'Relácie (kampane)', align: 'num', sort: (m) => m.ga.paid?.sessions, render: (m) => fmtNum(m.ga.paid?.sessions) },
  { key: 'paidUsers', label: 'Návšt. (kampane)', align: 'num', sort: (m) => m.ga.paid?.users, render: (m) => fmtNum(m.ga.paid?.users) },
  { key: 'paidEng', label: 'Interakcia (kamp.)', align: 'num', sort: (m) => m.ga.paid?.engagementRate, render: (m) => fmtPct(m.ga.paid?.engagementRate, 1) },
  { key: 'paidDur', label: 'Trvanie (kamp.)', align: 'num', sort: (m) => durationSec(m.ga.paid?.avgDuration), render: (m) => m.ga.paid?.avgDuration ?? '–' },
  { key: 'orgSessions', label: 'Relácie (org.)', align: 'num', sort: (m) => m.ga.organic?.sessions, render: (m) => fmtNum(m.ga.organic?.sessions) },
  { key: 'orgUsers', label: 'Návšt. (org.)', align: 'num', sort: (m) => m.ga.organic?.users, render: (m) => fmtNum(m.ga.organic?.users) },
  { key: 'orgEng', label: 'Interakcia (org.)', align: 'num', sort: (m) => m.ga.organic?.engagementRate, render: (m) => fmtPct(m.ga.organic?.engagementRate, 1) },
  { key: 'orgDur', label: 'Trvanie (org.)', align: 'num', sort: (m) => durationSec(m.ga.organic?.avgDuration), render: (m) => m.ga.organic?.avgDuration ?? '–' },
]

const eshopColumns = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'revenue', label: 'Tržby', align: 'num', sort: (m) => m.eshop?.revenue, render: (m) => fmtEur(m.eshop?.revenue) },
  { key: 'netRevenue', label: 'Čisté predaje', align: 'num', sort: (m) => m.eshop?.netRevenue, render: (m) => fmtEur(m.eshop?.netRevenue) },
  { key: 'items', label: 'Predané položky', align: 'num', sort: (m) => m.eshop?.items, render: (m) => fmtNum(m.eshop?.items) },
  { key: 'orders', label: 'Objednávky', align: 'num', sort: (m) => m.eshop?.orders, render: (m) => fmtNum(m.eshop?.orders) },
  { key: 'ency', label: 'z toho Encyklopédia (ks)', align: 'num', sort: (m) => m.eshop?.encyItems, render: (m) => fmtNum(m.eshop?.encyItems) },
]

export default function Analytics({ months, compare, client }) {
  if (hasGa4Export(months)) {
    return <AnalyticsGa4 months={months} compare={compare} />
  }

  const showEshopInGa = !hasEshopTab(client)

  const rows = months.filter((m) => m.ga)
  const cur = gaStats(months)
  const prev = compare ? gaStats(compare.months) : null
  const d = (key) => (prev ? pctChange(cur[key], prev[key]) : null)

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    paid: m.ga.paid?.sessions,
    organic: m.ga.organic?.sessions,
    engPaid: m.ga.paid?.engagementRate,
    engOrganic: m.ga.organic?.engagementRate,
    revenue: m.eshop?.revenue,
    items: m.eshop?.items,
  }))

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Relácie z kampaní" value={fmtNum(cur.paidSessions)} sub={fmtSkCount(cur.paidUsers, 'navstevnik')}
          delta={d('paidSessions')} />
        <Kpi label="Relácie bez kampaní" value={fmtNum(cur.organicSessions)} sub={fmtSkCount(cur.organicUsers, 'navstevnik')}
          delta={d('organicSessions')} />
        <Kpi label="Relácie spolu" value={fmtNum(cur.totalSessions)} delta={d('totalSessions')} />
        {showEshopInGa && (
          <>
            <Kpi label="Tržby e-shopu (GA4)" value={fmtEur(cur.eshopRevenue)} delta={d('eshopRevenue')} />
            <Kpi label="Predané položky" value={fmtNum(cur.eshopItems)} delta={d('eshopItems')} />
          </>
        )}
      </div>

      <Section title="Návštevnosť webu" hint="relácie mesačne">
        <div className="card">
          <MonthLineChart data={chartData} series={[
            { key: 'paid', name: 'Z platených kampaní', color: '#2680eb' },
            { key: 'organic', name: 'Bez platených kampaní', color: '#10b981' },
          ]} height={280} />
        </div>
      </Section>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Miera interakcie <span className="hint">%</span></div>
          <div className="card">
            <MonthLineChart data={chartData} unit="%" series={[
              { key: 'engPaid', name: 'Z kampaní', color: '#2680eb' },
              { key: 'engOrganic', name: 'Bez kampaní', color: '#10b981' },
            ]} />
          </div>
        </div>
        {showEshopInGa && (
          <div>
            <div className="section-title">Tržby e-shopu <span className="hint">GA4 – všetky predaje</span></div>
            <div className="card">
              <MonthBarChart data={chartData} series={[{ key: 'revenue', name: 'Tržby', color: '#8b5cf6', eur: true }]} />
            </div>
          </div>
        )}
      </div>

      <Section title="Mesačný detail">
        <SortableTable
          columns={trafficColumns}
          rows={rows}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
        />
      </Section>

      {showEshopInGa && (
        <Section title="E-shop (GA4)" hint="tržby, položky a objednávky podľa reportov">
          <SortableTable
            columns={eshopColumns}
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
