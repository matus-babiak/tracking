import { Kpi, Section, MonthBarChart, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, sum, pctChange } from '../lib/helpers'

const RENTCAR_CONVS = ['click_tel', 'form_start', 'form_submit']

function fmtDec(v, digits = 2) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function monthMetrics(m) {
  const meta = m.meta || {}
  return {
    spend: meta.spend ?? 0,
    reach: meta.reach ?? 0,
    impressions: meta.impressions ?? 0,
    cpm: meta.cpm ?? (meta.impressions && meta.spend != null ? (meta.spend / meta.impressions) * 1000 : null),
    frequency: meta.frequency ?? (meta.reach ? meta.impressions / meta.reach : null),
    clicks: meta.clicks ?? 0,
    lpv: meta.landingPageViews ?? 0,
    engagements: meta.engagements ?? 0,
    costPerEngagement: meta.costPerEngagement ?? (meta.engagements && meta.spend != null ? meta.spend / meta.engagements : null),
    saves: meta.saves ?? 0,
  }
}

function aggregateLeadgen(months) {
  const rows = months.filter((m) => m.meta)
  const spend = sum(rows, (m) => m.meta.spend)
  const clicks = sum(rows, (m) => m.meta.clicks)
  const reach = sum(rows, (m) => m.meta.reach)
  const lpv = sum(rows, (m) => m.meta.landingPageViews)
  const impressions = sum(rows, (m) => m.meta.impressions)
  const engagements = sum(rows, (m) => m.meta.engagements)
  const saves = sum(rows, (m) => m.meta.saves)
  return {
    spend,
    clicks,
    reach,
    lpv,
    impressions,
    engagements,
    saves,
    cpm: impressions && spend != null ? (spend / impressions) * 1000 : null,
    frequency: reach ? impressions / reach : null,
    costPerEngagement: spend != null && engagements ? spend / engagements : null,
  }
}

function aggregateDual(months) {
  const metaSpend = sum(months, (m) => m.meta?.spend ?? 0)
  const googleSpend = sum(months, (m) => m.google?.spend ?? 0)
  const metaClicks = sum(months, (m) => m.meta?.clicks ?? 0)
  const googleClicks = sum(months, (m) => m.google?.clicks ?? 0)
  const lpv = sum(months, (m) => m.meta?.landingPageViews ?? 0)
  const conversions = sum(months, (m) => m.google?.conversions ?? 0)
  const convActions = Object.fromEntries(
    RENTCAR_CONVS.map((key) => [key, sum(months, (m) => m.google?.conversionActions?.[key] ?? 0)]),
  )
  const totalSpend = metaSpend + googleSpend
  return {
    totalSpend,
    metaSpend,
    googleSpend,
    metaClicks,
    googleClicks,
    totalClicks: metaClicks + googleClicks,
    lpv,
    conversions,
    convActions,
    costPerConv: conversions ? googleSpend / conversions : null,
  }
}

function DualOverview({ months, compare }) {
  const hasData = months.some((m) => m.meta || m.google)
  if (!hasData) {
    return (
      <div className="empty-state">
        Zatiaľ nie sú dostupné dáta. Pošli Meta alebo Google export a doplníme ich.
      </div>
    )
  }

  const agg = aggregateDual(months)
  const prev = compare ? aggregateDual(compare.months) : null
  const d = (key) => (prev ? pctChange(agg[key], prev[key]) : null)
  const dc = (key) => (prev ? pctChange(agg.convActions[key], prev.convActions[key]) : null)

  const chartData = months.map((m) => ({
    label: monthLabel(m),
    totalSpend: (m.meta?.spend ?? 0) + (m.google?.spend ?? 0),
    lpv: m.meta?.landingPageViews ?? 0,
    conversions: m.google?.conversions ?? 0,
  }))

  const tableColumns = [
    { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
    { key: 'totalSpend', label: 'Investícia', align: 'num', sort: (m) => (m.meta?.spend ?? 0) + (m.google?.spend ?? 0), render: (m) => fmtEur((m.meta?.spend ?? 0) + (m.google?.spend ?? 0)) },
    { key: 'metaSpend', label: 'Meta', align: 'num', sort: (m) => m.meta?.spend ?? 0, render: (m) => fmtEur(m.meta?.spend ?? null) },
    { key: 'googleSpend', label: 'Google', align: 'num', sort: (m) => m.google?.spend ?? 0, render: (m) => fmtEur(m.google?.spend ?? null) },
    { key: 'lpv', label: 'Návštevy (Meta)', align: 'num', sort: (m) => m.meta?.landingPageViews ?? 0, render: (m) => fmtNum(m.meta?.landingPageViews ?? null) },
    { key: 'metaClicks', label: 'Klik. Meta', align: 'num', sort: (m) => m.meta?.clicks ?? 0, render: (m) => fmtNum(m.meta?.clicks ?? null) },
    { key: 'googleClicks', label: 'Klik. Google', align: 'num', sort: (m) => m.google?.clicks ?? 0, render: (m) => fmtNum(m.google?.clicks ?? null) },
    { key: 'conversions', label: 'Konverzie', align: 'num', sort: (m) => m.google?.conversions ?? 0, render: (m) => fmtDec(m.google?.conversions ?? null) },
    ...RENTCAR_CONVS.map((key) => ({
      key,
      label: key,
      align: 'num',
      sort: (m) => m.google?.conversionActions?.[key] ?? 0,
      render: (m) => fmtDec(m.google?.conversionActions?.[key] ?? null),
    })),
  ]

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia celkom" value={fmtEur(agg.totalSpend)} delta={d('totalSpend')} deltaGood="neutral"
          sub={`Meta ${fmtEur(agg.metaSpend)} · Google ${fmtEur(agg.googleSpend)}`} />
        <Kpi label="Návštevy webu" value={fmtNum(agg.lpv)} delta={d('lpv')}
          sub="Meta — pozretia cieľovej stránky" />
        <Kpi label="Kliknutia celkom" value={fmtNum(agg.totalClicks)} delta={d('totalClicks')}
          sub={`Meta ${fmtNum(agg.metaClicks)} · Google ${fmtNum(agg.googleClicks)}`} />
        <Kpi label="Google konverzie" value={fmtDec(agg.conversions)} delta={d('conversions')}
          sub={agg.costPerConv != null ? `Cena / konv. ${fmtEur(agg.costPerConv, 2)}` : null} />
        <Kpi label="click_tel" value={fmtDec(agg.convActions.click_tel)} delta={dc('click_tel')} />
        <Kpi label="form_start" value={fmtDec(agg.convActions.form_start)} delta={dc('form_start')} />
        <Kpi label="form_submit" value={fmtDec(agg.convActions.form_submit)} delta={dc('form_submit')} />
      </div>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Investícia <span className="hint">Meta + Google, mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'totalSpend', name: 'Investícia', color: '#2680eb', eur: true }]} />
          </div>
        </div>
        <div>
          <div className="section-title">Návštevy vs. konverzie <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[
              { key: 'lpv', name: 'Návštevy (Meta)', color: '#f59e0b' },
              { key: 'conversions', name: 'Konverzie (Google)', color: '#10b981' },
            ]} />
          </div>
        </div>
      </div>

      <Section title="Mesačný prehľad">
        <SortableTable
          columns={tableColumns}
          rows={months.filter((m) => m.meta || m.google)}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
          footer={(
            <>
              <tr className="total">
                <td>Spolu</td>
                <td className="num">{fmtEur(agg.totalSpend)}</td>
                <td className="num">{fmtEur(agg.metaSpend)}</td>
                <td className="num">{fmtEur(agg.googleSpend)}</td>
                <td className="num">{fmtNum(agg.lpv)}</td>
                <td className="num">{fmtNum(agg.metaClicks)}</td>
                <td className="num">{fmtNum(agg.googleClicks)}</td>
                <td className="num">{fmtDec(agg.conversions)}</td>
                {RENTCAR_CONVS.map((key) => (
                  <td key={key} className="num">{fmtDec(agg.convActions[key])}</td>
                ))}
              </tr>
              {prev && (
                <tr className="total compare-row">
                  <td>{compare.label}</td>
                  <td className="num">{fmtEur(prev.totalSpend)}</td>
                  <td className="num">{fmtEur(prev.metaSpend)}</td>
                  <td className="num">{fmtEur(prev.googleSpend)}</td>
                  <td className="num">{fmtNum(prev.lpv)}</td>
                  <td className="num">{fmtNum(prev.metaClicks)}</td>
                  <td className="num">{fmtNum(prev.googleClicks)}</td>
                  <td className="num">{fmtDec(prev.conversions)}</td>
                  {RENTCAR_CONVS.map((key) => (
                    <td key={key} className="num">{fmtDec(prev.convActions[key])}</td>
                  ))}
                </tr>
              )}
            </>
          )}
        />
      </Section>
    </>
  )
}

export default function OverviewLeadgen({ months, compare, client }) {
  if (client?.leadgenProfile === 'dual') {
    return <DualOverview months={months} compare={compare} />
  }

  if (months.length === 0) {
    return (
      <div className="empty-state">
        Zatiaľ nie sú dostupné dáta. Pošli Meta export a doplníme ich.
      </div>
    )
  }

  const agg = aggregateLeadgen(months)
  const prev = compare ? aggregateLeadgen(compare.months) : null
  const d = (key) => (prev ? pctChange(agg[key], prev[key]) : null)

  const chartData = months.filter((m) => m.meta).map((m) => {
    const mm = monthMetrics(m)
    return {
      label: monthLabel(m),
      spend: mm.spend,
      reach: mm.reach,
      engagements: mm.engagements,
      saves: mm.saves,
    }
  })

  const tableColumns = [
    { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
    { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => monthMetrics(m).spend, render: (m) => fmtEur(monthMetrics(m).spend) },
    { key: 'reach', label: 'Dosah', align: 'num', sort: (m) => monthMetrics(m).reach, render: (m) => fmtNum(monthMetrics(m).reach) },
    { key: 'impressions', label: 'Zobrazenia', align: 'num', sort: (m) => monthMetrics(m).impressions, render: (m) => fmtNum(monthMetrics(m).impressions) },
    { key: 'cpm', label: 'CPM', align: 'num', sort: (m) => monthMetrics(m).cpm, render: (m) => fmtEur(monthMetrics(m).cpm, 2) },
    { key: 'frequency', label: 'Frekvencia', align: 'num', sort: (m) => monthMetrics(m).frequency, render: (m) => fmtDec(monthMetrics(m).frequency) },
    { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => monthMetrics(m).clicks, render: (m) => fmtNum(monthMetrics(m).clicks) },
    { key: 'lpv', label: 'Návštevy', align: 'num', sort: (m) => monthMetrics(m).lpv, render: (m) => fmtNum(monthMetrics(m).lpv) },
    { key: 'engagements', label: 'Post engagement', align: 'num', sort: (m) => monthMetrics(m).engagements, render: (m) => fmtNum(monthMetrics(m).engagements) },
    { key: 'costPerEngagement', label: 'Cena / interakciu', align: 'num', sort: (m) => monthMetrics(m).costPerEngagement, render: (m) => fmtEur(monthMetrics(m).costPerEngagement, 3) },
    { key: 'saves', label: 'Uloženia', align: 'num', sort: (m) => monthMetrics(m).saves, render: (m) => fmtNum(monthMetrics(m).saves) },
  ]

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia Meta Ads" value={fmtEur(agg.spend)} delta={d('spend')} deltaGood="neutral" />
        <Kpi label="Dosah" value={fmtNum(agg.reach)} delta={d('reach')} />
        <Kpi label="Zobrazenia" value={fmtNum(agg.impressions)} delta={d('impressions')} />
        <Kpi label="CPM" value={fmtEur(agg.cpm, 2)} delta={d('cpm')} deltaGood="neutral" />
        <Kpi label="Frekvencia" value={fmtDec(agg.frequency)} delta={d('frequency')} />
        <Kpi label="Kliknutia" value={fmtNum(agg.clicks)} delta={d('clicks')} />
        <Kpi label="Návštevy" value={fmtNum(agg.lpv)} delta={d('lpv')} />
        <Kpi label="Post engagement" value={fmtNum(agg.engagements)} delta={d('engagements')} />
        <Kpi label="Cena za interakciu" value={fmtEur(agg.costPerEngagement)} delta={d('costPerEngagement')} deltaGood="neutral" />
        <Kpi label="Uloženia" value={fmtNum(agg.saves)} delta={d('saves')} />
      </div>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Investícia vs. engagement <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[
              { key: 'spend', name: 'Investícia', color: '#2680eb', eur: true },
              { key: 'engagements', name: 'Post engagement', color: '#10b981' },
            ]} />
          </div>
        </div>
        <div>
          <div className="section-title">Dosah <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'reach', name: 'Dosah', color: '#8b5cf6' }]} />
          </div>
        </div>
      </div>

      <Section title="Mesačný prehľad">
        <SortableTable
          columns={tableColumns}
          rows={months.filter((m) => m.meta)}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
          footer={(
            <>
              <tr className="total">
                <td>Spolu</td>
                <td className="num">{fmtEur(agg.spend)}</td>
                <td className="num">{fmtNum(agg.reach)}</td>
                <td className="num">{fmtNum(agg.impressions)}</td>
                <td className="num">{fmtEur(agg.cpm, 2)}</td>
                <td className="num">{fmtDec(agg.frequency)}</td>
                <td className="num">{fmtNum(agg.clicks)}</td>
                <td className="num">{fmtNum(agg.lpv)}</td>
                <td className="num">{fmtNum(agg.engagements)}</td>
                <td className="num">{fmtEur(agg.costPerEngagement)}</td>
                <td className="num">{fmtNum(agg.saves)}</td>
              </tr>
              {prev && (
                <tr className="total compare-row">
                  <td>{compare.label}</td>
                  <td className="num">{fmtEur(prev.spend)}</td>
                  <td className="num">{fmtNum(prev.reach)}</td>
                  <td className="num">{fmtNum(prev.impressions)}</td>
                  <td className="num">{fmtEur(prev.cpm, 2)}</td>
                  <td className="num">{fmtDec(prev.frequency)}</td>
                  <td className="num">{fmtNum(prev.clicks)}</td>
                  <td className="num">{fmtNum(prev.lpv)}</td>
                  <td className="num">{fmtNum(prev.engagements)}</td>
                  <td className="num">{fmtEur(prev.costPerEngagement)}</td>
                  <td className="num">{fmtNum(prev.saves)}</td>
                </tr>
              )}
            </>
          )}
        />
      </Section>
    </>
  )
}
