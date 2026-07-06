import { useMemo } from 'react'
import { Kpi, Section, SpendRoasChart, MonthBarChart, SortableTable } from '../components/ui'
import { monthLabel, monthKey, fmtEur, fmtNum, fmtRoas, sum, pctChange, aggregateMetaBreakdown, aggregateMetaCampaignRollup } from '../lib/helpers'
import { buildMetaBreakdownColumns, buildMetaMonthColumns } from '../lib/metaTableColumns.jsx'
import { skNakupySub } from '../lib/skGrammar'

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

export default function MetaAds({ months, compare, client }) {
  const rows = months.filter((m) => m.meta)
  const eshopKpis = client?.adsProfile === 'eshop' || client?.metaAdsProfile === 'eshop'
  const useAds = client?.metaBreakdown === 'ads'
  const tableProfile = eshopKpis ? 'eshop' : 'leadgen'
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

  const breakdown = aggregateMetaBreakdown(rows, client, { mode: useAds ? 'ads' : 'campaigns' })
  const campaignRollup = useMemo(
    () => (useAds && client?.metaShowCampaigns ? aggregateMetaCampaignRollup(rows, client) : []),
    [rows, client, useAds],
  )

  const adColumns = useMemo(
    () => buildMetaBreakdownColumns(breakdown, { profile: tableProfile, useAds }),
    [breakdown, tableProfile, useAds],
  )

  const campaignColumns = useMemo(
    () => buildMetaBreakdownColumns(campaignRollup, { profile: tableProfile, useAds: false }),
    [campaignRollup, tableProfile],
  )

  const monthColumns = useMemo(
    () => buildMetaMonthColumns(rows, { profile: tableProfile }),
    [rows, tableProfile],
  )

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia" value={fmtEur(cur.spend)} delta={d('spend')} deltaGood="neutral" />
        <Kpi label="Hodnota nákupov" value={fmtEur(cur.value)} sub={skNakupySub(cur.purchases)} delta={d('value')} />
        <Kpi label="ROAS" value={fmtRoas(cur.roas)} delta={d('roas')}
          subClass={cur.roas >= 3 ? 'up' : cur.roas < 1 ? 'down' : ''} />
        {eshopKpis ? (
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
        {eshopKpis ? (
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

      {campaignRollup.length > 0 && (
        <Section title="Kampane" hint="súhrn podľa názvu kampane za vybrané obdobie">
          <SortableTable
            columns={campaignColumns}
            rows={campaignRollup}
            rowKey={(c) => c.name}
            defaultSortKey="spend"
          />
        </Section>
      )}

      <Section title={useAds ? 'Reklamy' : 'Kampane'} hint="súčet za vybrané obdobie">
        <SortableTable
          columns={adColumns}
          rows={breakdown}
          rowKey={(c) => (c.campaign ? `${c.campaign}::${c.name}` : c.name)}
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
