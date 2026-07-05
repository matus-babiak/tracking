import { Kpi, Section, MonthLineChart, MonthBarChart, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, fmtPct, sum, pctChange } from '../lib/helpers'

function emailStats(months) {
  const rows = months.filter((m) => m.email)
  return {
    sent: sum(rows, (m) => m.email.sent),
    orders: sum(rows, (m) => m.email.orders),
    revenue: sum(rows, (m) => m.email.revenue),
    clicks: sum(rows, (m) => m.email.uniqueClicks),
    avgOpen: rows.length ? rows.reduce((a, m) => a + (m.email.openRate ?? 0), 0) / rows.length : null,
    avgClick: rows.length ? rows.reduce((a, m) => a + (m.email.clickRate ?? 0), 0) / rows.length : null,
  }
}

const monthColumns = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'campaigns', label: 'Kampane', align: 'num', sort: (m) => m.email.campaignsCount, render: (m) => fmtNum(m.email.campaignsCount) },
  { key: 'sent', label: 'Odoslané', align: 'num', sort: (m) => m.email.sent, render: (m) => fmtNum(m.email.sent) },
  { key: 'openRate', label: 'Open rate', align: 'num', sort: (m) => m.email.openRate, render: (m) => fmtPct(m.email.openRate) },
  { key: 'clickRate', label: 'Click rate', align: 'num', sort: (m) => m.email.clickRate, render: (m) => fmtPct(m.email.clickRate, 2) },
  { key: 'clicks', label: 'Unikátne kliky', align: 'num', sort: (m) => m.email.uniqueClicks, render: (m) => fmtNum(m.email.uniqueClicks) },
  { key: 'unsub', label: 'Odhlásenia', align: 'num', sort: (m) => m.email.unsubRate, render: (m) => fmtPct(m.email.unsubRate, 2) },
  { key: 'orders', label: 'Objednávky', align: 'num', sort: (m) => m.email.orders, render: (m) => fmtNum(m.email.orders) },
  { key: 'revenue', label: 'Tržby', align: 'num', sort: (m) => m.email.revenue, render: (m) => fmtEur(m.email.revenue) },
]

export default function Email({ months, compare }) {
  const rows = months.filter((m) => m.email)
  const cur = emailStats(months)
  const prev = compare ? emailStats(compare.months) : null
  const d = (key) => (prev ? pctChange(cur[key], prev[key]) : null)

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    openRate: m.email.openRate,
    clickRate: m.email.clickRate,
    sent: m.email.sent,
    revenue: m.email.revenue,
  }))

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Odoslané e-maily" value={fmtNum(cur.sent)} delta={d('sent')} deltaGood="neutral" />
        <Kpi label="Priem. open rate" value={fmtPct(cur.avgOpen)} delta={d('avgOpen')} />
        <Kpi label="Priem. click rate" value={fmtPct(cur.avgClick, 2)} delta={d('avgClick')} />
        <Kpi label="Unikátne kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')} />
        <Kpi label="Objednávky" value={fmtNum(cur.orders)} delta={d('orders')} />
        <Kpi label="Tržby z e-mailov" value={fmtEur(cur.revenue)} delta={d('revenue')} />
      </div>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Open rate <span className="hint">%</span></div>
          <div className="card">
            <MonthLineChart data={chartData} unit="%" series={[{ key: 'openRate', name: 'Open rate', color: '#2680eb' }]} />
          </div>
        </div>
        <div>
          <div className="section-title">Click rate <span className="hint">%</span></div>
          <div className="card">
            <MonthLineChart data={chartData} unit="%" series={[{ key: 'clickRate', name: 'Click rate', color: '#10b981' }]} />
          </div>
        </div>
      </div>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Odoslané e-maily</div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'sent', name: 'Odoslané', color: '#94a3b8' }]} />
          </div>
        </div>
        <div>
          <div className="section-title">Tržby z e-mail marketingu</div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'revenue', name: 'Tržby', color: '#8b5cf6', eur: true }]} />
          </div>
        </div>
      </div>

      <Section title="Mesačný detail" hint="Mailchimp">
        <SortableTable
          columns={monthColumns}
          rows={rows}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
        />
      </Section>
    </>
  )
}
