import { Kpi, Section, SpendRoasChart, MonthBarChart, RoasBadge } from '../components/ui'
import { monthFull, monthLabel, fmtEur, fmtNum, fmtRoas, sum, pctChange } from '../lib/helpers'

function googleStats(months) {
  const rows = months.filter((m) => m.google)
  const spend = sum(rows, (m) => m.google.spend)
  const value = sum(rows, (m) => m.google.purchaseValue)
  const purchases = sum(rows, (m) => m.google.purchases)
  return {
    spend, value, purchases,
    impressions: sum(rows, (m) => m.google.impressions),
    clicks: sum(rows, (m) => m.google.clicks),
    roas: spend > 0 ? value / spend : null,
    cpp: purchases > 0 ? spend / purchases : null,
  }
}

export default function GoogleAds({ months, compare }) {
  const rows = months.filter((m) => m.google)

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        Vo vybranom období nebežali žiadne Google Ads kampane.
      </div>
    )
  }

  const cur = googleStats(months)
  const prev = compare && compare.months.some((m) => m.google) ? googleStats(compare.months) : null
  const d = (key) => (prev ? pctChange(cur[key], prev[key]) : null)

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    spend: m.google.spend,
    value: m.google.purchaseValue,
    roas: m.google.spend > 0 ? Math.round((m.google.purchaseValue / m.google.spend) * 100) / 100 : null,
    clicks: m.google.clicks,
    purchases: m.google.purchases,
  }))

  const campaignMap = new Map()
  for (const m of rows) {
    for (const c of m.google.campaigns || []) {
      const curC = campaignMap.get(c.name) || { name: c.name, spend: 0, purchases: 0, value: 0, clicks: 0, months: 0 }
      curC.spend += c.spend ?? 0
      curC.purchases += c.purchases ?? 0
      curC.value += c.value ?? 0
      curC.clicks += c.clicks ?? 0
      curC.months += 1
      campaignMap.set(c.name, curC)
    }
  }
  const campaigns = [...campaignMap.values()].sort((a, b) => b.spend - a.spend)

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia" value={fmtEur(cur.spend)} delta={d('spend')} deltaGood="neutral" />
        <Kpi label="Hodnota nákupov" value={fmtEur(cur.value)} sub={`${fmtNum(cur.purchases)} nákupov`} delta={d('value')} />
        <Kpi label="ROAS" value={fmtRoas(cur.roas)} delta={d('roas')}
          subClass={cur.roas >= 3 ? 'up' : cur.roas < 1 ? 'down' : ''} />
        <Kpi label="Zobrazenia" value={fmtNum(cur.impressions)} delta={d('impressions')} />
        <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')}
          sub={cur.clicks && cur.spend ? `CPC ${fmtEur(cur.spend / cur.clicks, 2)}` : null} />
        <Kpi label="Cena za nákup" value={fmtEur(cur.cpp, 2)} delta={d('cpp')} deltaGood="down" />
      </div>

      <Section title="Investícia vs. hodnota nákupov" hint="mesačne">
        <div className="card">
          <SpendRoasChart data={chartData} />
        </div>
      </Section>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Kliknutia</div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'clicks', name: 'Kliknutia', color: '#f59e0b' }]} />
          </div>
        </div>
        <div>
          <div className="section-title">Nákupy</div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'purchases', name: 'Nákupy', color: '#10b981' }]} />
          </div>
        </div>
      </div>

      <Section title="Kampane" hint="súčet za vybrané obdobie">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kampaň</th>
                <th className="num">Investícia</th>
                <th className="num">Kliknutia</th>
                <th className="num">Nákupy</th>
                <th className="num">Hodnota</th>
                <th className="num">ROAS</th>
                <th className="num">Aktívna (mes.)</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td className="num">{fmtEur(c.spend)}</td>
                  <td className="num">{fmtNum(c.clicks || null)}</td>
                  <td className="num">{fmtNum(c.purchases)}</td>
                  <td className="num">{fmtEur(c.value)}</td>
                  <td className="num"><RoasBadge value={c.spend > 0 && c.value > 0 ? c.value / c.spend : c.spend > 0 ? 0 : null} /></td>
                  <td className="num">{c.months}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Mesačný detail">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mesiac</th>
                <th className="num">Investícia</th>
                <th className="num">Zobrazenia</th>
                <th className="num">Kliknutia</th>
                <th className="num">CTR</th>
                <th className="num">CPC</th>
                <th className="num">Nákupy</th>
                <th className="num">Hodnota</th>
                <th className="num">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={`${m.year}-${m.month}`}>
                  <td>{monthFull(m)}</td>
                  <td className="num">{fmtEur(m.google.spend)}</td>
                  <td className="num">{fmtNum(m.google.impressions)}</td>
                  <td className="num">{fmtNum(m.google.clicks)}</td>
                  <td className="num">{m.google.ctr != null ? `${m.google.ctr.toLocaleString('sk-SK')} %` : '–'}</td>
                  <td className="num">{fmtEur(m.google.cpc, 2)}</td>
                  <td className="num">{fmtNum(m.google.purchases)}</td>
                  <td className="num">{fmtEur(m.google.purchaseValue)}</td>
                  <td className="num"><RoasBadge value={m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  )
}
