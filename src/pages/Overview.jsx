import { Kpi, Section, SpendRoasChart, MonthBarChart, RoasBadge } from '../components/ui'
import { monthFull, monthLabel, fmtEur, fmtNum, fmtPct, fmtRoas, aggregate, pctChange } from '../lib/helpers'

// Prehľad: PPC reklamy (Meta + Google) vs. výsledky e-shopu
export default function Overview({ months, compare }) {
  const agg = aggregate(months)
  const prev = compare ? aggregate(compare.months) : null
  const d = (key) => (prev ? pctChange(agg[key], prev[key]) : null)

  const chartData = months.map((m) => {
    const spend = (m.meta?.spend ?? 0) + (m.google?.spend ?? 0) + (m.boosting?.spend ?? 0)
    const value = (m.meta?.purchaseValue ?? 0) + (m.google?.purchaseValue ?? 0) + (m.boosting?.value ?? 0)
    return {
      label: monthLabel(m),
      spend: Math.round(spend * 100) / 100,
      value: Math.round(value * 100) / 100,
      roas: spend > 0 ? Math.round((value / spend) * 100) / 100 : null,
      eshop: m.eshop?.revenue,
      metaSpend: m.meta?.spend ?? 0,
      googleSpend: m.google?.spend ?? 0,
    }
  })

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia do reklám" value={fmtEur(agg.adSpend)} sub="Meta + Google + boosting"
          delta={d('adSpend')} deltaGood="neutral" />
        <Kpi label="Hodnota nákupov z reklám" value={fmtEur(agg.adValue)} sub={`${fmtNum(agg.adPurchases)} nákupov`}
          delta={d('adValue')} />
        <Kpi label="Celkový ROAS" value={fmtRoas(agg.roas)} sub={agg.pno != null ? `PNO ${fmtPct(agg.pno)}` : null}
          subClass={agg.roas >= 3 ? 'up' : agg.roas < 1 ? 'down' : ''} delta={d('roas')} />
        <Kpi label="Tržby e-shopu" value={fmtEur(agg.eshopRevenue)}
          sub={agg.adShareOfRevenue != null ? `${fmtPct(agg.adShareOfRevenue)} priamo z reklám` : null}
          delta={d('eshopRevenue')} />
        <Kpi label="Meta Ads" value={fmtEur(agg.metaSpend)} sub={`${fmtNum(agg.metaPurchases)} nákupov · ${fmtEur(agg.metaValue)}`}
          delta={d('metaValue')} />
        <Kpi label="Google Ads" value={fmtEur(agg.googleSpend)} sub={`${fmtNum(agg.googlePurchases)} nákupov · ${fmtEur(agg.googleValue)}`}
          delta={d('googleValue')} />
      </div>

      <Section title="Investícia vs. hodnota nákupov z reklám" hint="Meta + Google + boosting, mesačne">
        <div className="card">
          <SpendRoasChart data={chartData} />
        </div>
      </Section>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Tržby e-shopu <span className="hint">celkové, mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'eshop', name: 'Tržby', color: '#8b5cf6', eur: true }]} />
          </div>
        </div>
        <div>
          <div className="section-title">Rozdelenie investície <span className="hint">Meta vs. Google</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[
              { key: 'metaSpend', name: 'Meta Ads', color: '#2680eb', eur: true },
              { key: 'googleSpend', name: 'Google Ads', color: '#f59e0b', eur: true },
            ]} />
          </div>
        </div>
      </div>

      <Section title="Mesačný prehľad">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mesiac</th>
                <th className="num">Investícia</th>
                <th className="num">Hodnota z reklám</th>
                <th className="num">ROAS</th>
                <th className="num">Nákupy z reklám</th>
                <th className="num">Tržby e-shopu</th>
                <th className="num">Podiel reklám</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => {
                const spend = (m.meta?.spend ?? 0) + (m.google?.spend ?? 0) + (m.boosting?.spend ?? 0)
                const value = (m.meta?.purchaseValue ?? 0) + (m.google?.purchaseValue ?? 0) + (m.boosting?.value ?? 0)
                const purchases = (m.meta?.purchases ?? 0) + (m.google?.purchases ?? 0) + (m.boosting?.purchases ?? 0)
                const share = m.eshop?.revenue ? (value / m.eshop.revenue) * 100 : null
                return (
                  <tr key={`${m.year}-${m.month}`}>
                    <td>{monthFull(m)}</td>
                    <td className="num">{fmtEur(spend)}</td>
                    <td className="num">{fmtEur(value)}</td>
                    <td className="num"><RoasBadge value={spend > 0 ? value / spend : null} /></td>
                    <td className="num">{fmtNum(purchases)}</td>
                    <td className="num">{fmtEur(m.eshop?.revenue)}</td>
                    <td className="num">{share != null ? fmtPct(share) : '–'}</td>
                  </tr>
                )
              })}
              <tr className="total">
                <td>Spolu</td>
                <td className="num">{fmtEur(agg.adSpend)}</td>
                <td className="num">{fmtEur(agg.adValue)}</td>
                <td className="num"><RoasBadge value={agg.roas} /></td>
                <td className="num">{fmtNum(agg.adPurchases)}</td>
                <td className="num">{fmtEur(agg.eshopRevenue)}</td>
                <td className="num">{agg.adShareOfRevenue != null ? fmtPct(agg.adShareOfRevenue) : '–'}</td>
              </tr>
              {prev && (
                <tr className="total compare-row">
                  <td>{compare.label}</td>
                  <td className="num">{fmtEur(prev.adSpend)}</td>
                  <td className="num">{fmtEur(prev.adValue)}</td>
                  <td className="num"><RoasBadge value={prev.roas} /></td>
                  <td className="num">{fmtNum(prev.adPurchases)}</td>
                  <td className="num">{fmtEur(prev.eshopRevenue)}</td>
                  <td className="num">{prev.adShareOfRevenue != null ? fmtPct(prev.adShareOfRevenue) : '–'}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  )
}
