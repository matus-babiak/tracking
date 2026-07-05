import { Kpi, Section, SpendRoasChart, MonthBarChart, RoasBadge, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, fmtRoas, sum, pctChange } from '../lib/helpers'

function metaStats(months) {
  const rows = months.filter((m) => m.meta)
  const spend = sum(rows, (m) => m.meta.spend)
  const value = sum(rows, (m) => m.meta.purchaseValue)
  const purchases = sum(rows, (m) => m.meta.purchases)
  return {
    spend,
    value,
    purchases,
    impressions: sum(rows, (m) => m.meta.impressions),
    clicks: sum(rows, (m) => m.meta.clicks),
    atc: sum(rows, (m) => m.meta.addToCart),
    roas: spend > 0 ? value / spend : null,
    cpp: purchases > 0 ? spend / purchases : null,
  }
}

const campaignColumnsFull = [
  { key: 'name', label: 'Kampaň', sort: (c) => c.name, render: (c) => c.name },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (c) => c.spend, render: (c) => fmtEur(c.spend) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (c) => c.clicks, render: (c) => fmtNum(c.clicks || null) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (c) => c.purchases, render: (c) => fmtNum(c.purchases) },
  { key: 'value', label: 'Hodnota', align: 'num', sort: (c) => c.value, render: (c) => fmtEur(c.value) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (c) => (c.spend > 0 ? c.value / c.spend : null), render: (c) => <RoasBadge value={c.spend > 0 ? c.value / c.spend : null} /> },
  { key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months },
]

const campaignColumnsEshop = [
  { key: 'name', label: 'Reklama', sort: (c) => c.name, render: (c) => c.name },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (c) => c.spend, render: (c) => fmtEur(c.spend) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (c) => c.clicks, render: (c) => fmtNum(c.clicks || null) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (c) => c.purchases, render: (c) => fmtNum(c.purchases) },
  { key: 'value', label: 'Hodnota nákupov', align: 'num', sort: (c) => c.value, render: (c) => fmtEur(c.value) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (c) => (c.spend > 0 ? c.value / c.spend : null), render: (c) => <RoasBadge value={c.spend > 0 ? c.value / c.spend : null} /> },
  { key: 'cpp', label: 'Cena / nákup', align: 'num', sort: (c) => (c.purchases > 0 ? c.spend / c.purchases : null), render: (c) => fmtEur(c.purchases > 0 ? c.spend / c.purchases : null, 2) },
  { key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months },
]

const monthColumnsFull = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.meta.spend, render: (m) => fmtEur(m.meta.spend) },
  { key: 'impressions', label: 'Zobrazenia', align: 'num', sort: (m) => m.meta.impressions, render: (m) => fmtNum(m.meta.impressions) },
  { key: 'reach', label: 'Dosah', align: 'num', sort: (m) => m.meta.reach, render: (m) => fmtNum(m.meta.reach) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.meta.clicks, render: (m) => fmtNum(m.meta.clicks) },
  { key: 'atc', label: 'Do košíka', align: 'num', sort: (m) => m.meta.addToCart, render: (m) => fmtNum(m.meta.addToCart) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (m) => m.meta.purchases, render: (m) => fmtNum(m.meta.purchases) },
  { key: 'value', label: 'Hodnota', align: 'num', sort: (m) => m.meta.purchaseValue, render: (m) => fmtEur(m.meta.purchaseValue) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (m) => m.meta.roas, render: (m) => <RoasBadge value={m.meta.roas} /> },
]

const monthColumnsEshop = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.meta.spend, render: (m) => fmtEur(m.meta.spend) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.meta.clicks, render: (m) => fmtNum(m.meta.clicks) },
  { key: 'atc', label: 'Do košíka', align: 'num', sort: (m) => m.meta.addToCart, render: (m) => fmtNum(m.meta.addToCart) },
  { key: 'purchases', label: 'Nákupy', align: 'num', sort: (m) => m.meta.purchases, render: (m) => fmtNum(m.meta.purchases) },
  { key: 'value', label: 'Hodnota nákupov', align: 'num', sort: (m) => m.meta.purchaseValue, render: (m) => fmtEur(m.meta.purchaseValue) },
  { key: 'roas', label: 'ROAS', align: 'num', sort: (m) => m.meta.roas, render: (m) => <RoasBadge value={m.meta.roas} /> },
  { key: 'cpp', label: 'Cena / nákup', align: 'num', sort: (m) => m.meta.costPerPurchase, render: (m) => fmtEur(m.meta.costPerPurchase, 2) },
]

export default function MetaAds({ months, compare, client }) {
  const rows = months.filter((m) => m.meta)
  const eshop = client?.adsProfile === 'eshop'
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
    atc: m.meta.addToCart,
  }))

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
  const campaigns = [...campaignMap.values()]

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia" value={fmtEur(cur.spend)} delta={d('spend')} deltaGood="neutral" />
        <Kpi label="Hodnota nákupov" value={fmtEur(cur.value)} sub={`${fmtNum(cur.purchases)} nákupov`} delta={d('value')} />
        <Kpi label="ROAS" value={fmtRoas(cur.roas)} delta={d('roas')}
          subClass={cur.roas >= 3 ? 'up' : cur.roas < 1 ? 'down' : ''} />
        {eshop ? (
          <>
            <Kpi label="Nákupy" value={fmtNum(cur.purchases)} delta={d('purchases')} />
            <Kpi label="Cena za nákup" value={fmtEur(cur.cpp, 2)} delta={d('cpp')} deltaGood="down" />
            <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')}
              sub={cur.clicks && cur.spend ? `CPC ${fmtEur(cur.spend / cur.clicks, 2)}` : null} />
            <Kpi label="Pridania do košíka" value={fmtNum(cur.atc)} delta={d('atc')} />
          </>
        ) : (
          <>
            <Kpi label="Zobrazenia" value={fmtNum(cur.impressions)} delta={d('impressions')} />
            <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')}
              sub={cur.clicks && cur.spend ? `CPC ${fmtEur(cur.spend / cur.clicks, 2)}` : null} />
            <Kpi label="Pridania do košíka" value={fmtNum(cur.atc)} delta={d('atc')} />
          </>
        )}
      </div>

      <Section title="Investícia vs. hodnota nákupov" hint="mesačne">
        <div className="card">
          <SpendRoasChart data={chartData} />
        </div>
      </Section>

      <div className="chart-grid section">
        {eshop ? (
          <>
            <div>
              <div className="section-title">Nákupy <span className="hint">mesačne</span></div>
              <div className="card">
                <MonthBarChart data={chartData} series={[{ key: 'purchases', name: 'Nákupy', color: '#10b981' }]} />
              </div>
            </div>
            <div>
              <div className="section-title">Pridania do košíka <span className="hint">mesačne</span></div>
              <div className="card">
                <MonthBarChart data={chartData} series={[{ key: 'atc', name: 'Do košíka', color: '#f59e0b' }]} />
              </div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <Section title={eshop ? 'Reklamy' : 'Kampane'} hint="súčet za vybrané obdobie">
        <SortableTable
          columns={eshop ? campaignColumnsEshop : campaignColumnsFull}
          rows={campaigns}
          rowKey={(c) => c.name}
          defaultSortKey="spend"
        />
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
