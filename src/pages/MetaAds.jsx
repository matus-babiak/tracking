import { Kpi, Section, SpendRoasChart, MonthBarChart, RoasBadge } from '../components/ui'
import { monthFull, monthLabel, fmtEur, fmtNum, fmtRoas, sum, pctChange } from '../lib/helpers'

function metaStats(months) {
  const rows = months.filter((m) => m.meta)
  return {
    spend: sum(rows, (m) => m.meta.spend),
    value: sum(rows, (m) => m.meta.purchaseValue),
    purchases: sum(rows, (m) => m.meta.purchases),
    impressions: sum(rows, (m) => m.meta.impressions),
    clicks: sum(rows, (m) => m.meta.clicks),
    atc: sum(rows, (m) => m.meta.addToCart),
    roas: (() => {
      const s = sum(rows, (m) => m.meta.spend)
      const v = sum(rows, (m) => m.meta.purchaseValue)
      return s > 0 ? v / s : null
    })(),
  }
}

export default function MetaAds({ months, compare }) {
  const rows = months.filter((m) => m.meta)
  const cur = metaStats(months)
  const prev = compare ? metaStats(compare.months) : null
  const d = (key) => (prev ? pctChange(cur[key], prev[key]) : null)

  const boostRows = rows.filter((m) => m.boosting)
  const boostSpend = sum(boostRows, (m) => m.boosting.spend)
  const boostValue = sum(boostRows, (m) => m.boosting.value)
  const boostInteractions = sum(boostRows, (m) => m.boosting.interactions)

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    spend: m.meta.spend,
    value: m.meta.purchaseValue,
    roas: m.meta.roas,
    clicks: m.meta.clicks,
    purchases: m.meta.purchases,
  }))

  // kampane naprieč vybranými mesiacmi, zoskupené podľa názvu
  const campaignMap = new Map()
  for (const m of rows) {
    for (const c of m.meta.campaigns || []) {
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
        <Kpi label="Pridania do košíka" value={fmtNum(cur.atc)} delta={d('atc')} />
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
            <MonthBarChart data={chartData} series={[{ key: 'clicks', name: 'Kliknutia', color: '#2680eb' }]} />
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
                  <td className="num"><RoasBadge value={c.spend > 0 ? c.value / c.spend : null} /></td>
                  <td className="num">{c.months}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {boostRows.length > 0 && (
        <Section title="Boosting organických postov" hint="samostatne vykazovaný do 12/2025">
          <div className="kpi-grid">
            <Kpi label="Investícia" value={fmtEur(boostSpend)} />
            <Kpi label="Interakcie s obsahom" value={fmtNum(boostInteractions)} />
            <Kpi label="Hodnota nákupov" value={fmtEur(boostValue)} />
          </div>
        </Section>
      )}

      <Section title="Mesačný detail">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mesiac</th>
                <th className="num">Investícia</th>
                <th className="num">Zobrazenia</th>
                <th className="num">Dosah</th>
                <th className="num">Kliknutia</th>
                <th className="num">Do košíka</th>
                <th className="num">Nákupy</th>
                <th className="num">Hodnota</th>
                <th className="num">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={`${m.year}-${m.month}`}>
                  <td>{monthFull(m)}</td>
                  <td className="num">{fmtEur(m.meta.spend)}</td>
                  <td className="num">{fmtNum(m.meta.impressions)}</td>
                  <td className="num">{fmtNum(m.meta.reach)}</td>
                  <td className="num">{fmtNum(m.meta.clicks)}</td>
                  <td className="num">{fmtNum(m.meta.addToCart)}</td>
                  <td className="num">{fmtNum(m.meta.purchases)}</td>
                  <td className="num">{fmtEur(m.meta.purchaseValue)}</td>
                  <td className="num"><RoasBadge value={m.meta.roas} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  )
}
