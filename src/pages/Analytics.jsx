import { Kpi, Section, MonthLineChart, MonthBarChart } from '../components/ui'
import { monthFull, monthLabel, fmtEur, fmtNum, fmtPct, sum, pctChange } from '../lib/helpers'

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

export default function Analytics({ months, compare }) {
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
        <Kpi label="Relácie z kampaní" value={fmtNum(cur.paidSessions)} sub={`${fmtNum(cur.paidUsers)} návštevníkov`}
          delta={d('paidSessions')} />
        <Kpi label="Relácie bez kampaní" value={fmtNum(cur.organicSessions)} sub={`${fmtNum(cur.organicUsers)} návštevníkov`}
          delta={d('organicSessions')} />
        <Kpi label="Relácie spolu" value={fmtNum(cur.totalSessions)} delta={d('totalSessions')} />
        <Kpi label="Tržby e-shopu (GA4)" value={fmtEur(cur.eshopRevenue)} delta={d('eshopRevenue')} />
        <Kpi label="Predané položky" value={fmtNum(cur.eshopItems)} delta={d('eshopItems')} />
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
        <div>
          <div className="section-title">Tržby e-shopu <span className="hint">GA4 – všetky predaje</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'revenue', name: 'Tržby', color: '#8b5cf6', eur: true }]} />
          </div>
        </div>
      </div>

      <Section title="Mesačný detail">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mesiac</th>
                <th className="num">Relácie (kampane)</th>
                <th className="num">Návšt. (kampane)</th>
                <th className="num">Interakcia (kamp.)</th>
                <th className="num">Trvanie (kamp.)</th>
                <th className="num">Relácie (org.)</th>
                <th className="num">Návšt. (org.)</th>
                <th className="num">Interakcia (org.)</th>
                <th className="num">Trvanie (org.)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={`${m.year}-${m.month}`}>
                  <td>{monthFull(m)}</td>
                  <td className="num">{fmtNum(m.ga.paid?.sessions)}</td>
                  <td className="num">{fmtNum(m.ga.paid?.users)}</td>
                  <td className="num">{fmtPct(m.ga.paid?.engagementRate, 1)}</td>
                  <td className="num">{m.ga.paid?.avgDuration ?? '–'}</td>
                  <td className="num">{fmtNum(m.ga.organic?.sessions)}</td>
                  <td className="num">{fmtNum(m.ga.organic?.users)}</td>
                  <td className="num">{fmtPct(m.ga.organic?.engagementRate, 1)}</td>
                  <td className="num">{m.ga.organic?.avgDuration ?? '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="E-shop (GA4)" hint="tržby, položky a objednávky podľa reportov">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mesiac</th>
                <th className="num">Tržby</th>
                <th className="num">Čisté predaje</th>
                <th className="num">Predané položky</th>
                <th className="num">Objednávky</th>
                <th className="num">z toho Encyklopédia (ks)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={`${m.year}-${m.month}`}>
                  <td>{monthFull(m)}</td>
                  <td className="num">{fmtEur(m.eshop?.revenue)}</td>
                  <td className="num">{fmtEur(m.eshop?.netRevenue)}</td>
                  <td className="num">{fmtNum(m.eshop?.items)}</td>
                  <td className="num">{fmtNum(m.eshop?.orders)}</td>
                  <td className="num">{fmtNum(m.eshop?.encyItems)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  )
}
