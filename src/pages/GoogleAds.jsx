import { Kpi, Section, SpendRoasChart, MonthBarChart, RoasBadge, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, fmtRoas, sum, pctChange } from '../lib/helpers'
import { skNakupySub } from '../lib/skGrammar'

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
    cpc: (() => {
      const clicks = sum(rows, (m) => m.google.clicks)
      return clicks ? spend / clicks : null
    })(),
  }
}

const campaignColumnsFull = [
  { key: 'name', label: 'Kampaň', sort: (c) => c.name, render: (c) => c.name },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (c) => c.spend, render: (c) => fmtEur(c.spend) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (c) => c.clicks, render: (c) => fmtNum(c.clicks || null) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (c) => c.purchases, render: (c) => fmtNum(c.purchases) },
  { key: 'value', label: 'Hodnota', align: 'num', sort: (c) => c.value, render: (c) => fmtEur(c.value) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (c) => (c.spend > 0 ? c.value / c.spend : null), render: (c) => <RoasBadge value={c.spend > 0 && c.value > 0 ? c.value / c.spend : c.spend > 0 ? 0 : null} /> },
  { key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months },
]

const campaignColumnsEshop = [
  { key: 'name', label: 'Kampaň', sort: (c) => c.name, render: (c) => c.name },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (c) => c.spend, render: (c) => fmtEur(c.spend) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (c) => c.clicks, render: (c) => fmtNum(c.clicks || null) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (c) => c.purchases, render: (c) => fmtNum(c.purchases) },
  { key: 'value', label: 'Hodnota nákupov', align: 'num', sort: (c) => c.value, render: (c) => fmtEur(c.value) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (c) => (c.spend > 0 ? c.value / c.spend : null), render: (c) => <RoasBadge value={c.spend > 0 && c.value > 0 ? c.value / c.spend : c.spend > 0 ? 0 : null} /> },
  { key: 'cpp', label: 'Cena / nákup', align: 'num', sort: (c) => (c.purchases > 0 ? c.spend / c.purchases : null), render: (c) => fmtEur(c.purchases > 0 ? c.spend / c.purchases : null, 2) },
  { key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months },
]

const monthColumnsFull = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.google.spend, render: (m) => fmtEur(m.google.spend) },
  { key: 'impressions', label: 'Zobrazenia', align: 'num', sort: (m) => m.google.impressions, render: (m) => fmtNum(m.google.impressions) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.google.clicks, render: (m) => fmtNum(m.google.clicks) },
  { key: 'ctr', label: 'CTR', align: 'num', sort: (m) => m.google.ctr, render: (m) => (m.google.ctr != null ? `${m.google.ctr.toLocaleString('sk-SK')} %` : '–') },
  { key: 'cpc', label: 'CPC', align: 'num', sort: (m) => m.google.cpc, render: (m) => fmtEur(m.google.cpc, 2) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (m) => m.google.purchases, render: (m) => fmtNum(m.google.purchases) },
  { key: 'value', label: 'Hodnota', align: 'num', sort: (m) => m.google.purchaseValue, render: (m) => fmtEur(m.google.purchaseValue) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (m) => (m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null), render: (m) => <RoasBadge value={m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null} /> },
]

const monthColumnsEshop = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.google.spend, render: (m) => fmtEur(m.google.spend) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.google.clicks, render: (m) => fmtNum(m.google.clicks) },
  { key: 'cpc', label: 'CPC', align: 'num', sort: (m) => m.google.cpc, render: (m) => fmtEur(m.google.cpc, 2) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (m) => m.google.purchases, render: (m) => fmtNum(m.google.purchases) },
  { key: 'value', label: 'Hodnota nákupov', align: 'num', sort: (m) => m.google.purchaseValue, render: (m) => fmtEur(m.google.purchaseValue) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (m) => (m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null), render: (m) => <RoasBadge value={m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null} /> },
  { key: 'cpp', label: 'Cena / nákup', align: 'num', sort: (m) => (m.google.purchases > 0 ? m.google.spend / m.google.purchases : null), render: (m) => fmtEur(m.google.purchases > 0 ? m.google.spend / m.google.purchases : null, 2) },
]

export default function GoogleAds({ months, compare, client }) {
  const rows = months.filter((m) => m.google)
  const eshop = client?.adsProfile === 'eshop'

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
  const campaigns = [...campaignMap.values()]

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia" value={fmtEur(cur.spend)} delta={d('spend')} deltaGood="neutral" />
        <Kpi label="Hodnota nákupov" value={fmtEur(cur.value)} sub={skNakupySub(cur.purchases)} delta={d('value')} />
        <Kpi label="ROAS" value={fmtRoas(cur.roas)} delta={d('roas')}
          subClass={cur.roas >= 3 ? 'up' : cur.roas < 1 ? 'down' : ''} />
        {eshop ? (
          <>
            <Kpi label="Nákupy" value={fmtNum(cur.purchases)} delta={d('purchases')} />
            <Kpi label="Cena za nákup" value={fmtEur(cur.cpp, 2)} delta={d('cpp')} deltaGood="down" />
            <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')}
              sub={cur.cpc != null ? `CPC ${fmtEur(cur.cpc, 2)}` : null} />
          </>
        ) : (
          <>
            <Kpi label="Zobrazenia" value={fmtNum(cur.impressions)} delta={d('impressions')} />
            <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')}
              sub={cur.clicks && cur.spend ? `CPC ${fmtEur(cur.spend / cur.clicks, 2)}` : null} />
            <Kpi label="Cena za nákup" value={fmtEur(cur.cpp, 2)} delta={d('cpp')} deltaGood="down" />
          </>
        )}
      </div>

      <Section title="Investícia vs. hodnota nákupov" hint="mesačne">
        <div className="card">
          <SpendRoasChart data={chartData} />
        </div>
      </Section>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Nákupy <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'purchases', name: 'Nákupy', color: '#10b981' }]} />
          </div>
        </div>
        <div>
          <div className="section-title">{eshop ? 'Investícia' : 'Kliknutia'} <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart
              data={chartData}
              series={eshop
                ? [{ key: 'spend', name: 'Investícia', color: '#f59e0b', eur: true }]
                : [{ key: 'clicks', name: 'Kliknutia', color: '#f59e0b' }]}
            />
          </div>
        </div>
      </div>

      <Section title="Kampane" hint="súčet za vybrané obdobie">
        <SortableTable
          columns={eshop ? campaignColumnsEshop : campaignColumnsFull}
          rows={campaigns}
          rowKey={(c) => c.name}
          defaultSortKey="spend"
        />
      </Section>

      <Section title="Mesačný detail">
        <SortableTable
          columns={eshop ? monthColumnsEshop : monthColumnsFull}
          rows={rows}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
        />
      </Section>
    </>
  )
}
