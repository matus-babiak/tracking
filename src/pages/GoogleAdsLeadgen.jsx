import { Kpi, Section, MonthBarChart, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, sum, pctChange, absChange } from '../lib/helpers'

const RENTCAR_CONVS = ['click_tel', 'form_start', 'form_submit']

function fmtDec(v, digits = 2) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function fmtPct(v) {
  if (v == null) return '–'
  return `${v.toLocaleString('sk-SK')} %`
}

function googleStats(months) {
  const rows = months.filter((m) => m.google)
  const spend = sum(rows, (m) => m.google.spend)
  const impressions = sum(rows, (m) => m.google.impressions)
  const clicks = sum(rows, (m) => m.google.clicks)
  const interactions = sum(rows, (m) => m.google.interactions)
  const conversions = sum(rows, (m) => m.google.conversions)
  return {
    spend,
    impressions,
    clicks,
    interactions,
    conversions,
    ctr: impressions ? (clicks / impressions) * 100 : null,
    cpc: clicks ? spend / clicks : null,
    costPerConv: conversions ? spend / conversions : null,
  }
}

function convActionKeys(months) {
  const keys = new Set()
  for (const m of months) {
    if (!m.google?.conversionActions) continue
    for (const k of Object.keys(m.google.conversionActions)) keys.add(k)
  }
  return [...keys].sort()
}

function convLabel(key) {
  return key.replace(/^rentcarslovakia\.sk \(web\) /, '')
}

const monthColumns = (convKeys) => [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.google.spend, render: (m) => fmtEur(m.google.spend) },
  { key: 'impressions', label: 'Zobrazenia', align: 'num', sort: (m) => m.google.impressions, render: (m) => fmtNum(m.google.impressions) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.google.clicks, render: (m) => fmtNum(m.google.clicks) },
  { key: 'ctr', label: 'CTR', align: 'num', sort: (m) => m.google.ctr, render: (m) => fmtPct(m.google.ctr) },
  { key: 'cpc', label: 'CPC', align: 'num', sort: (m) => m.google.cpc, render: (m) => fmtEur(m.google.cpc, 2) },
  { key: 'interactions', label: 'Interakcie', align: 'num', sort: (m) => m.google.interactions, render: (m) => fmtNum(m.google.interactions) },
  { key: 'interactionRate', label: 'Miera interakcií', align: 'num', sort: (m) => m.google.interactionRate, render: (m) => fmtPct(m.google.interactionRate) },
  { key: 'impressionsTop', label: 'Impresie (Top) %', align: 'num', sort: (m) => m.google.impressionsTop, render: (m) => fmtPct(m.google.impressionsTop) },
  { key: 'impressionsAbsTop', label: 'Impresie (Abs. Top) %', align: 'num', sort: (m) => m.google.impressionsAbsTop, render: (m) => fmtPct(m.google.impressionsAbsTop) },
  { key: 'convRate', label: 'Miera konverzií', align: 'num', sort: (m) => m.google.convRate, render: (m) => fmtPct(m.google.convRate) },
  { key: 'conversions', label: 'Konverzie', align: 'num', sort: (m) => m.google.conversions, render: (m) => fmtDec(m.google.conversions) },
  { key: 'costPerConv', label: 'Cena / konverziu', align: 'num', sort: (m) => m.google.costPerConv, render: (m) => fmtEur(m.google.costPerConv, 2) },
  ...convKeys.map((key) => ({
    key: `conv_${key}`,
    label: convLabel(key),
    align: 'num',
    sort: (m) => m.google.conversionActions?.[key] ?? 0,
    render: (m) => fmtDec(m.google.conversionActions?.[key] ?? 0),
  })),
]

function buildCampaignColumnsDual() {
  return [
    { key: 'name', label: 'Kampaň', sort: (c) => c.name, render: (c) => c.name },
    { key: 'type', label: 'Typ', sort: (c) => c.type, render: (c) => c.type || '–' },
    { key: 'spend', label: 'Investícia', align: 'num', sort: (c) => c.spend, render: (c) => fmtEur(c.spend) },
    { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (c) => c.clicks, render: (c) => fmtNum(c.clicks) },
    { key: 'conversions', label: 'Konverzie', align: 'num', sort: (c) => c.conversions, render: (c) => fmtDec(c.conversions) },
    ...RENTCAR_CONVS.map((key) => ({
      key: `conv_${key}`,
      label: key,
      align: 'num',
      sort: (c) => c.conversionActions?.[key] ?? 0,
      render: (c) => fmtDec(c.conversionActions?.[key] ?? 0),
    })),
    { key: 'costPerConv', label: 'Cena / konverziu', align: 'num', sort: (c) => c.costPerConv, render: (c) => fmtEur(c.costPerConv, 2) },
    { key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months },
  ]
}

const monthColumnsDual = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.google.spend, render: (m) => fmtEur(m.google.spend) },
  { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.google.clicks, render: (m) => fmtNum(m.google.clicks) },
  { key: 'cpc', label: 'CPC', align: 'num', sort: (m) => m.google.cpc, render: (m) => fmtEur(m.google.cpc, 2) },
  { key: 'conversions', label: 'Konverzie', align: 'num', sort: (m) => m.google.conversions, render: (m) => fmtDec(m.google.conversions) },
  ...RENTCAR_CONVS.map((key) => ({
    key: `conv_${key}`,
    label: key,
    align: 'num',
    sort: (m) => m.google.conversionActions?.[key] ?? 0,
    render: (m) => fmtDec(m.google.conversionActions?.[key] ?? 0),
  })),
  { key: 'costPerConv', label: 'Cena / konverziu', align: 'num', sort: (m) => m.google.costPerConv, render: (m) => fmtEur(m.google.costPerConv, 2) },
]

function buildCampaignColumns(convKeys) {
  return [
    { key: 'name', label: 'Kampaň', sort: (c) => c.name, render: (c) => c.name },
    { key: 'type', label: 'Typ', sort: (c) => c.type, render: (c) => c.type || '–' },
    { key: 'spend', label: 'Investícia', align: 'num', sort: (c) => c.spend, render: (c) => fmtEur(c.spend) },
    { key: 'impressions', label: 'Zobrazenia', align: 'num', sort: (c) => c.impressions, render: (c) => fmtNum(c.impressions) },
    { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (c) => c.clicks, render: (c) => fmtNum(c.clicks) },
    { key: 'ctr', label: 'CTR', align: 'num', sort: (c) => c.ctr, render: (c) => fmtPct(c.ctr) },
    { key: 'cpc', label: 'CPC', align: 'num', sort: (c) => c.cpc, render: (c) => fmtEur(c.cpc, 2) },
    { key: 'interactions', label: 'Interakcie', align: 'num', sort: (c) => c.interactions, render: (c) => fmtNum(c.interactions) },
    { key: 'convRate', label: 'Miera konverzií', align: 'num', sort: (c) => c.convRate, render: (c) => fmtPct(c.convRate) },
    { key: 'conversions', label: 'Konverzie', align: 'num', sort: (c) => c.conversions, render: (c) => fmtDec(c.conversions) },
    { key: 'costPerConv', label: 'Cena / konverziu', align: 'num', sort: (c) => c.costPerConv, render: (c) => fmtEur(c.costPerConv, 2) },
    ...convKeys.map((key) => ({
      key: `conv_${key}`,
      label: convLabel(key),
      align: 'num',
      sort: (c) => c.conversionActions?.[key] ?? 0,
      render: (c) => fmtDec(c.conversionActions?.[key] ?? 0),
    })),
    { key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months },
  ]
}

export default function GoogleAdsLeadgen({ months, compare, client }) {
  const rows = months.filter((m) => m.google)
  const dual = client?.leadgenProfile === 'dual'

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
  const convKeys = convActionKeys(rows)

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    spend: m.google.spend,
    clicks: m.google.clicks,
    conversions: m.google.conversions,
  }))

  const campaignMap = new Map()
  for (const m of rows) {
    for (const c of m.google.campaigns || []) {
      const curC = campaignMap.get(c.name) || {
        name: c.name,
        type: c.type,
        spend: 0,
        impressions: 0,
        clicks: 0,
        interactions: 0,
        conversions: 0,
        conversionActions: {},
        months: 0,
      }
      curC.spend += c.spend ?? 0
      curC.impressions += c.impressions ?? 0
      curC.clicks += c.clicks ?? 0
      curC.interactions += c.interactions ?? 0
      curC.conversions += c.conversions ?? 0
      curC.months += 1
      for (const [k, v] of Object.entries(c.conversionActions || {})) {
        curC.conversionActions[k] = (curC.conversionActions[k] ?? 0) + v
      }
      campaignMap.set(c.name, curC)
    }
  }
  const campaigns = [...campaignMap.values()].map((c) => ({
    ...c,
    ctr: c.impressions ? (c.clicks / c.impressions) * 100 : null,
    cpc: c.clicks ? c.spend / c.clicks : null,
    convRate: c.clicks ? (c.conversions / c.clicks) * 100 : null,
    costPerConv: c.conversions ? c.spend / c.conversions : null,
  }))

  const convRows = (dual ? RENTCAR_CONVS : convKeys).map((key) => ({
    key,
    name: dual ? key : convLabel(key),
    total: sum(rows, (m) => m.google.conversionActions?.[key] ?? 0),
  }))

  const convCompare = (key) => {
    if (!compare?.months.some((m) => m.google)) return null
    const curVal = sum(rows, (m) => m.google.conversionActions?.[key] ?? 0)
    const prevVal = sum(compare.months.filter((m) => m.google), (m) => m.google.conversionActions?.[key] ?? 0)
    return {
      prev: prevVal,
      pct: pctChange(curVal, prevVal),
      abs: absChange(curVal, prevVal),
    }
  }

  const fmtConvSub = (prevVal) => (prevVal != null ? `oproti ${fmtDec(prevVal)}` : null)

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia" value={fmtEur(cur.spend)} delta={d('spend')} deltaGood="neutral" />
        <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')}
          sub={cur.cpc != null ? `CPC ${fmtEur(cur.cpc, 2)}` : null} />
        <Kpi label="Konverzie" value={fmtDec(cur.conversions)} delta={d('conversions')}
          sub={cur.costPerConv != null ? `Cena / konv. ${fmtEur(cur.costPerConv, 2)}` : null} />
        {!dual && (
          <>
            <Kpi label="Zobrazenia" value={fmtNum(cur.impressions)} delta={d('impressions')} />
            <Kpi label="CTR" value={fmtPct(cur.ctr != null ? Math.round(cur.ctr * 100) / 100 : null)} delta={d('ctr')} />
            <Kpi label="Interakcie" value={fmtNum(cur.interactions)} delta={d('interactions')} />
            <Kpi label="Cena za konverziu" value={fmtEur(cur.costPerConv, 2)} delta={d('costPerConv')} deltaGood="down" />
          </>
        )}
      </div>

      <div className="chart-grid section">
        <div>
          <div className="section-title">Investícia vs. konverzie <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[
              { key: 'spend', name: 'Investícia', color: '#f59e0b', eur: true },
              { key: 'conversions', name: 'Konverzie', color: '#10b981' },
            ]} />
          </div>
        </div>
        <div>
          <div className="section-title">Kliknutia <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart data={chartData} series={[{ key: 'clicks', name: 'Kliknutia', color: '#2680eb' }]} />
          </div>
        </div>
      </div>

      {convRows.length > 0 && (
        <Section title="Konverzie podľa akcie">
          <div className={`kpi-grid${convRows.length === 3 ? ' kpi-grid--3' : ''}`}>
            {convRows.map((r) => {
              const cmp = convCompare(r.key)
              return (
                <Kpi
                  key={r.key}
                  label={r.name}
                  value={fmtDec(r.total)}
                  sub={cmp ? fmtConvSub(cmp.prev) : null}
                  delta={cmp?.pct}
                  deltaAbs={cmp?.pct == null ? cmp?.abs : null}
                  deltaFmt={(v) => fmtDec(v)}
                />
              )
            })}
          </div>
        </Section>
      )}

      <Section title="Kampane" hint="súčet za vybrané obdobie">
        <SortableTable
          columns={dual ? buildCampaignColumnsDual() : buildCampaignColumns(convKeys)}
          rows={campaigns}
          rowKey={(c) => c.name}
          defaultSortKey="spend"
        />
      </Section>

      <Section title="Mesačný detail">
        <SortableTable
          columns={dual ? monthColumnsDual : monthColumns(convKeys)}
          rows={rows}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
        />
      </Section>
    </>
  )
}
