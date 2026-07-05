import { Kpi, Section, SpendRoasChart, MonthBarChart, RoasBadge, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, fmtPct, fmtRoas, aggregate, pctChange } from '../lib/helpers'
import { skNakupySub } from '../lib/skGrammar'

function monthMetrics(m) {
  const spend = (m.meta?.spend ?? 0) + (m.google?.spend ?? 0) + (m.boosting?.spend ?? 0)
  const value = (m.meta?.purchaseValue ?? 0) + (m.google?.purchaseValue ?? 0) + (m.boosting?.value ?? 0)
  const purchases = (m.meta?.purchases ?? 0) + (m.google?.purchases ?? 0) + (m.boosting?.purchases ?? 0)
  const share = m.eshop?.revenue ? (value / m.eshop.revenue) * 100 : null
  return { spend, value, purchases, roas: spend > 0 ? value / spend : null, share }
}

// Prehľad: PPC reklamy (Meta + Google) vs. výsledky e-shopu
export default function Overview({ months, compare }) {
  if (months.length === 0) {
    return (
      <div className="empty-state">
        Zatiaľ nie sú dostupné dáta. Pošli reporty a doplníme ich.
      </div>
    )
  }

  const agg = aggregate(months)
  const prev = compare ? aggregate(compare.months) : null
  const d = (key) => (prev ? pctChange(agg[key], prev[key]) : null)

  const chartData = months.map((m) => {
    const { spend, value } = monthMetrics(m)
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

  const tableColumns = [
    { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
    { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => monthMetrics(m).spend, render: (m) => fmtEur(monthMetrics(m).spend) },
    { key: 'value', label: 'Hodnota z reklám', align: 'num', sort: (m) => monthMetrics(m).value, render: (m) => fmtEur(monthMetrics(m).value) },
    { key: 'roas', label: 'ROAS', align: 'num', sort: (m) => monthMetrics(m).roas, render: (m) => <RoasBadge value={monthMetrics(m).roas} /> },
    { key: 'purchases', label: 'Nákupy z reklám', align: 'num', sort: (m) => monthMetrics(m).purchases, render: (m) => fmtNum(monthMetrics(m).purchases) },
    { key: 'eshop', label: 'Tržby e-shopu', align: 'num', sort: (m) => m.eshop?.revenue, render: (m) => fmtEur(m.eshop?.revenue) },
    { key: 'share', label: 'Podiel reklám', align: 'num', sort: (m) => monthMetrics(m).share, render: (m) => { const s = monthMetrics(m).share; return s != null ? fmtPct(s) : '–' } },
  ]

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia do reklám" value={fmtEur(agg.adSpend)} sub="Meta + Google + boosting"
          delta={d('adSpend')} deltaGood="neutral" />
        <Kpi label="Hodnota nákupov z reklám" value={fmtEur(agg.adValue)} sub={skNakupySub(agg.adPurchases)}
          delta={d('adValue')} />
        <Kpi label="Celkový ROAS" value={fmtRoas(agg.roas)} sub={agg.pno != null ? `PNO ${fmtPct(agg.pno)}` : null}
          subClass={agg.roas >= 3 ? 'up' : agg.roas < 1 ? 'down' : ''} delta={d('roas')} />
        <Kpi label="Tržby e-shopu" value={fmtEur(agg.eshopRevenue)}
          sub={agg.adShareOfRevenue != null ? `${fmtPct(agg.adShareOfRevenue)} priamo z reklám` : null}
          delta={d('eshopRevenue')} />
        <Kpi label="Meta Ads" value={fmtEur(agg.metaSpend)} sub={skNakupySub(agg.metaPurchases, fmtEur(agg.metaValue))}
          delta={d('metaValue')} />
        <Kpi label="Google Ads" value={fmtEur(agg.googleSpend)} sub={skNakupySub(agg.googlePurchases, fmtEur(agg.googleValue))}
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
        <SortableTable
          columns={tableColumns}
          rows={months}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
          compareRows={compare?.months}
          compareLabel={compare?.label}
        />
      </Section>
    </>
  )
}
