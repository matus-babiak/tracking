import { useMemo } from 'react'
import { Kpi, Section, MonthBarChart, SortableTable } from '../components/ui'
import { monthLabel, fmtEur, fmtNum, sum, pctChange, aggregateMetaBreakdown, computeMetaDerived } from '../lib/helpers'
import { buildMetaBreakdownColumns, buildMetaMonthColumns } from '../lib/metaTableColumns.jsx'

function fmtDec(v, digits = 2) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function metaStats(months) {
  const rows = months.filter((m) => m.meta)
  const spend = sum(rows, (m) => m.meta.spend)
  const clicks = sum(rows, (m) => m.meta.clicks)
  const impressions = sum(rows, (m) => m.meta.impressions)
  const reach = sum(rows, (m) => m.meta.reach)
  const lpv = sum(rows, (m) => m.meta.landingPageViews)
  const engagements = sum(rows, (m) => m.meta.engagements)
  const saves = sum(rows, (m) => m.meta.saves)
  return {
    spend,
    clicks,
    impressions,
    reach,
    lpv,
    engagements,
    saves,
    cpm: impressions && spend != null ? (spend / impressions) * 1000 : null,
    frequency: reach ? impressions / reach : null,
    costPerEngagement: spend != null && engagements ? spend / engagements : null,
  }
}

function campaignMetrics(c) {
  return computeMetaDerived({
    ...c,
    cpm: c.impressions && c.spend != null ? (c.spend / c.impressions) * 1000 : null,
    frequency: c.reach ? c.impressions / c.reach : null,
    costPerEngagement: c.engagements && c.spend != null ? c.spend / c.engagements : null,
  })
}

export default function MetaAdsLeadgen({ months, compare, client }) {
  const rows = months.filter((m) => m.meta)

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        Vo vybranom období nie sú dostupné dáta Meta Ads.
      </div>
    )
  }

  const cur = metaStats(months)
  const prev = compare ? metaStats(compare.months) : null
  const d = (key) => (prev ? pctChange(cur[key], prev[key]) : null)

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    spend: m.meta.spend,
    reach: m.meta.reach,
    impressions: m.meta.impressions,
    clicks: m.meta.clicks,
    lpv: m.meta.landingPageViews,
    engagements: m.meta.engagements,
    saves: m.meta.saves,
  }))

  const campaignMap = new Map()
  for (const m of rows) {
    for (const c of m.meta.campaigns || []) {
      const curC = campaignMap.get(c.name) || {
        name: c.name, spend: 0, reach: 0, impressions: 0, clicks: 0,
        landingPageViews: 0, engagements: 0, saves: 0, months: 0,
      }
      curC.spend += c.spend ?? 0
      curC.reach += c.reach ?? 0
      curC.impressions += c.impressions ?? 0
      curC.clicks += c.clicks ?? 0
      curC.landingPageViews += c.landingPageViews ?? 0
      curC.engagements += c.engagements ?? 0
      curC.saves += c.saves ?? 0
      curC.months += 1
      campaignMap.set(c.name, curC)
    }
  }
  const campaigns = [...campaignMap.values()].map(campaignMetrics)
  const breakdown = aggregateMetaBreakdown(rows, client)
  const useAds = client?.metaBreakdown === 'ads' && breakdown.length > 0
  const tableRows = useAds ? breakdown : campaigns
  const dual = client?.leadgenProfile === 'dual'

  const adColumns = useMemo(
    () => buildMetaBreakdownColumns(tableRows, { profile: 'leadgen', useAds }),
    [tableRows, useAds],
  )
  const monthColumns = useMemo(
    () => buildMetaMonthColumns(rows, { profile: 'leadgen' }),
    [rows],
  )

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia" value={fmtEur(cur.spend)} delta={d('spend')} deltaGood="neutral" />
        {dual ? (
          <>
            <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')} />
            <Kpi label="Návštevy" value={fmtNum(cur.lpv)} delta={d('lpv')}
              sub="Pozretia cieľovej stránky" />
            <Kpi label="Post engagement" value={fmtNum(cur.engagements)} delta={d('engagements')} />
            <Kpi label="Cena za interakciu" value={fmtEur(cur.costPerEngagement)} delta={d('costPerEngagement')} deltaGood="neutral" />
          </>
        ) : (
          <>
            <Kpi label="Dosah" value={fmtNum(cur.reach)} delta={d('reach')} />
            <Kpi label="Zobrazenia" value={fmtNum(cur.impressions)} delta={d('impressions')} />
            <Kpi label="CPM" value={fmtEur(cur.cpm, 2)} delta={d('cpm')} deltaGood="neutral" />
            <Kpi label="Frekvencia" value={fmtDec(cur.frequency)} delta={d('frequency')} />
            <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')} />
            <Kpi label="Návštevy" value={fmtNum(cur.lpv)} delta={d('lpv')} />
            <Kpi label="Post engagement" value={fmtNum(cur.engagements)} delta={d('engagements')} />
            <Kpi label="Cena za interakciu" value={fmtEur(cur.costPerEngagement)} delta={d('costPerEngagement')} deltaGood="neutral" />
            <Kpi label="Uloženia" value={fmtNum(cur.saves)} delta={d('saves')} />
          </>
        )}
      </div>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Investícia <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'spend', name: 'Investícia', color: '#2680eb', eur: true }]} />
          </div>
        </div>
        <div>
          <div className="section-title">{dual ? 'Návštevy cieľovej stránky' : 'Dosah'} <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: dual ? 'lpv' : 'reach', name: dual ? 'Návštevy' : 'Dosah', color: dual ? '#f59e0b' : '#8b5cf6' }]} />
          </div>
        </div>
      </div>

      {!dual && (
      <div className="chart-grid section">
        <div>
          <div className="section-title">Post engagement <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'engagements', name: 'Post engagement', color: '#10b981' }]} />
          </div>
        </div>
        <div>
          <div className="section-title">Návštevy cieľovej stránky <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'lpv', name: 'Návštevy', color: '#f59e0b' }]} />
          </div>
        </div>
      </div>
      )}

      {dual && (
      <div className="chart-grid section">
        <div>
          <div className="section-title">Kliknutia <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'clicks', name: 'Kliknutia', color: '#2680eb' }]} />
          </div>
        </div>
        <div>
          <div className="section-title">Post engagement <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'engagements', name: 'Post engagement', color: '#10b981' }]} />
          </div>
        </div>
      </div>
      )}

      {tableRows.length > 0 && (
        <Section title="Reklamy" hint="súčet za vybrané obdobie">
          <SortableTable
            columns={adColumns}
            rows={tableRows}
            rowKey={(c) => (c.campaign ? `${c.campaign}::${c.name}` : c.name)}
            defaultSortKey="spend"
          />
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
