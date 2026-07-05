import { Kpi, Section, MonthLineChart, MonthBarChart } from '../components/ui'
import { monthFull, monthLabel, fmtEur, fmtNum, fmtPct, sum, pctChange } from '../lib/helpers'

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
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mesiac</th>
                <th className="num">Kampane</th>
                <th className="num">Odoslané</th>
                <th className="num">Open rate</th>
                <th className="num">Click rate</th>
                <th className="num">Unikátne kliky</th>
                <th className="num">Odhlásenia</th>
                <th className="num">Objednávky</th>
                <th className="num">Tržby</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={`${m.year}-${m.month}`}>
                  <td>{monthFull(m)}</td>
                  <td className="num">{fmtNum(m.email.campaignsCount)}</td>
                  <td className="num">{fmtNum(m.email.sent)}</td>
                  <td className="num">{fmtPct(m.email.openRate)}</td>
                  <td className="num">{fmtPct(m.email.clickRate, 2)}</td>
                  <td className="num">{fmtNum(m.email.uniqueClicks)}</td>
                  <td className="num">{fmtPct(m.email.unsubRate, 2)}</td>
                  <td className="num">{fmtNum(m.email.orders)}</td>
                  <td className="num">{fmtEur(m.email.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  )
}
