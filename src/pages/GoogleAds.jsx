import { Kpi, Section, SpendRoasChart, MonthBarChart, RoasBadge, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, fmtRoas, sum, pctChange } from '../lib/helpers'
import { skNakupySub } from '../lib/skGrammar'
import {
  ESHOP_GOOGLE_CONV_LABELS,
  getGoogleConvKeys,
  sumTrackedConversions,
} from '../lib/googleConversions'

function fmtDec(v, digits = 2) {
  if (v == null) return '–'
  return v.toLocaleString('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function googleStats(months, convKeys) {
  const rows = months.filter((m) => m.google)
  const spend = sum(rows, (m) => m.google.spend)
  const value = sum(rows, (m) => m.google.purchaseValue)
  const purchases = sum(rows, (m) => m.google.purchases)
  const clicks = sum(rows, (m) => m.google.clicks)
  const conversions = convKeys
    ? sum(rows, (m) => sumTrackedConversions(m.google.conversionActions, convKeys))
    : sum(rows, (m) => m.google.conversions ?? m.google.purchases)
  return {
    spend, value, purchases, clicks, conversions,
    impressions: sum(rows, (m) => m.google.impressions),
    roas: spend > 0 ? value / spend : null,
    cpp: purchases > 0 ? spend / purchases : null,
    cpc: clicks ? spend / clicks : null,
    costPerConv: conversions > 0 ? spend / conversions : null,
  }
}

function convColumns(convKeys, getActions) {
  return convKeys.map((key) => ({
    key: `conv_${key}`,
    label: ESHOP_GOOGLE_CONV_LABELS[key] ?? key,
    align: 'num',
    sort: (row) => getActions(row)?.[key] ?? 0,
    render: (row) => fmtDec(getActions(row)?.[key] ?? 0),
  }))
}

function fmtPct(v) {
  if (v == null) return '–'
  return `${v.toLocaleString('sk-SK')} %`
}

function buildCampaignColumns(eshop, convKeys) {
  if (convKeys) {
    return [
      { key: 'name', label: 'Kampaň', sort: (c) => c.name, render: (c) => c.name },
      { key: 'type', label: 'Typ', sort: (c) => c.type, render: (c) => c.type || '–' },
      { key: 'status', label: 'Stav', sort: (c) => c.status, render: (c) => c.status || '–' },
      {
        key: 'conversions', label: 'Konverzie', align: 'num',
        sort: (c) => sumTrackedConversions(c.conversionActions, convKeys),
        render: (c) => fmtDec(sumTrackedConversions(c.conversionActions, convKeys)),
      },
      ...convColumns(convKeys, (c) => c.conversionActions),
      { key: 'purchases', label: 'Nákupy', align: 'num', sort: (c) => c.purchases, render: (c) => fmtDec(c.purchases) },
      { key: 'value', label: 'Hodnota nákupov', align: 'num', sort: (c) => c.value, render: (c) => fmtEur(c.value) },
      { key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months },
    ]
  }

  const cols = [
    { key: 'name', label: 'Kampaň', sort: (c) => c.name, render: (c) => c.name },
    { key: 'spend', label: 'Investícia', align: 'num', sort: (c) => c.spend, render: (c) => fmtEur(c.spend) },
    { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (c) => c.clicks, render: (c) => fmtNum(c.clicks || null) },
    { key: 'purchases', label: 'Nákupy', align: 'num', sort: (c) => c.purchases, render: (c) => fmtNum(c.purchases) },
    { key: 'value', label: eshop ? 'Hodnota nákupov' : 'Hodnota', align: 'num', sort: (c) => c.value, render: (c) => fmtEur(c.value) },
    {
      key: 'roas', label: 'ROAS', align: 'num',
      sort: (c) => (c.spend > 0 ? c.value / c.spend : null),
      render: (c) => <RoasBadge value={c.spend > 0 && c.value > 0 ? c.value / c.spend : c.spend > 0 ? 0 : null} />,
    },
  ]
  if (eshop) {
    cols.push({
      key: 'cpp', label: 'Cena / nákup', align: 'num',
      sort: (c) => (c.purchases > 0 ? c.spend / c.purchases : null),
      render: (c) => fmtEur(c.purchases > 0 ? c.spend / c.purchases : null, 2),
    })
  }
  cols.push({ key: 'months', label: 'Aktívna (mes.)', align: 'num', sort: (c) => c.months, render: (c) => c.months })
  return cols
}

function buildMonthColumns(eshop, convKeys) {
  if (convKeys) {
    return [
      { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
      { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.google.spend, render: (m) => fmtEur(m.google.spend) },
      { key: 'impressions', label: 'Zobrazenia', align: 'num', sort: (m) => m.google.impressions, render: (m) => fmtNum(m.google.impressions) },
      { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.google.clicks, render: (m) => fmtNum(m.google.clicks) },
      { key: 'interactions', label: 'Interakcie', align: 'num', sort: (m) => m.google.interactions, render: (m) => fmtNum(m.google.interactions) },
      { key: 'ctr', label: 'CTR', align: 'num', sort: (m) => m.google.ctr, render: (m) => fmtPct(m.google.ctr) },
      { key: 'cpc', label: 'CPC', align: 'num', sort: (m) => m.google.cpc, render: (m) => fmtEur(m.google.cpc, 2) },
      { key: 'convRate', label: 'Miera konverzií', align: 'num', sort: (m) => m.google.convRate, render: (m) => fmtPct(m.google.convRate) },
      {
        key: 'conversions', label: 'Konverzie', align: 'num',
        sort: (m) => sumTrackedConversions(m.google.conversionActions, convKeys),
        render: (m) => fmtDec(sumTrackedConversions(m.google.conversionActions, convKeys)),
      },
      ...convColumns(convKeys, (m) => m.google.conversionActions),
      { key: 'purchases', label: 'Nákupy', align: 'num', sort: (m) => m.google.purchases, render: (m) => fmtDec(m.google.purchases) },
      { key: 'value', label: 'Hodnota nákupov', align: 'num', sort: (m) => m.google.purchaseValue, render: (m) => fmtEur(m.google.purchaseValue) },
      {
        key: 'roas', label: 'ROAS', align: 'num',
        sort: (m) => (m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null),
        render: (m) => <RoasBadge value={m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null} />,
      },
      { key: 'costPerConv', label: 'Cena / konverziu', align: 'num', sort: (m) => m.google.costPerConv, render: (m) => fmtEur(m.google.costPerConv, 2) },
      {
        key: 'cpp', label: 'Cena / nákup', align: 'num',
        sort: (m) => (m.google.purchases > 0 ? m.google.spend / m.google.purchases : null),
        render: (m) => fmtEur(m.google.purchases > 0 ? m.google.spend / m.google.purchases : null, 2),
      },
    ]
  }

  const cols = [
    { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
    { key: 'spend', label: 'Investícia', align: 'num', sort: (m) => m.google.spend, render: (m) => fmtEur(m.google.spend) },
  ]
  if (!eshop) {
    cols.push(
      { key: 'impressions', label: 'Zobrazenia', align: 'num', sort: (m) => m.google.impressions, render: (m) => fmtNum(m.google.impressions) },
    )
  }
  cols.push(
    { key: 'clicks', label: 'Kliknutia', align: 'num', sort: (m) => m.google.clicks, render: (m) => fmtNum(m.google.clicks) },
  )
  if (!eshop) {
    cols.push(
      { key: 'ctr', label: 'CTR', align: 'num', sort: (m) => m.google.ctr, render: (m) => (m.google.ctr != null ? `${m.google.ctr.toLocaleString('sk-SK')} %` : '–') },
    )
  }
  cols.push({ key: 'cpc', label: 'CPC', align: 'num', sort: (m) => m.google.cpc, render: (m) => fmtEur(m.google.cpc, 2) })
  cols.push(
    { key: 'purchases', label: 'Nákupy', align: 'num', sort: (m) => m.google.purchases, render: (m) => fmtNum(m.google.purchases) },
    { key: 'value', label: eshop ? 'Hodnota nákupov' : 'Hodnota', align: 'num', sort: (m) => m.google.purchaseValue, render: (m) => fmtEur(m.google.purchaseValue) },
    {
      key: 'roas', label: 'ROAS', align: 'num',
      sort: (m) => (m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null),
      render: (m) => <RoasBadge value={m.google.spend > 0 ? m.google.purchaseValue / m.google.spend : null} />,
    },
  )
  if (eshop) {
    cols.push({
      key: 'cpp', label: 'Cena / nákup', align: 'num',
      sort: (m) => (m.google.purchases > 0 ? m.google.spend / m.google.purchases : null),
      render: (m) => fmtEur(m.google.purchases > 0 ? m.google.spend / m.google.purchases : null, 2),
    })
  }
  return cols
}

export default function GoogleAds({ months, compare, client }) {
  const rows = months.filter((m) => m.google)
  const eshop = client?.adsProfile === 'eshop'
  const convKeys = getGoogleConvKeys(client)

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        Vo vybranom období nebežali žiadne Google Ads kampane.
      </div>
    )
  }

  const cur = googleStats(months, convKeys)
  const prev = compare && compare.months.some((m) => m.google) ? googleStats(compare.months, convKeys) : null
  const d = (key) => (prev ? pctChange(cur[key], prev[key]) : null)

  const convTotals = convKeys
    ? Object.fromEntries(convKeys.map((key) => [
      key,
      sum(rows, (m) => m.google.conversionActions?.[key] ?? 0),
    ]))
    : null

  const dc = (key) => {
    if (!convTotals || !compare?.months.some((m) => m.google)) return null
    const prevTotal = sum(
      compare.months.filter((m) => m.google),
      (m) => m.google.conversionActions?.[key] ?? 0,
    )
    return pctChange(convTotals[key], prevTotal)
  }

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    spend: m.google.spend,
    value: m.google.purchaseValue,
    roas: m.google.spend > 0 ? Math.round((m.google.purchaseValue / m.google.spend) * 100) / 100 : null,
    clicks: m.google.clicks,
    purchases: m.google.purchases,
    conversions: convKeys
      ? sumTrackedConversions(m.google.conversionActions, convKeys)
      : m.google.conversions ?? m.google.purchases,
  }))

  const campaignMap = new Map()
  for (const m of rows) {
    for (const c of m.google.campaigns || []) {
      const curC = campaignMap.get(c.name) || {
        name: c.name,
        type: c.type,
        status: c.status,
        spend: 0,
        purchases: 0,
        value: 0,
        clicks: 0,
        conversionActions: {},
        months: 0,
      }
      curC.spend += c.spend ?? 0
      curC.purchases += c.purchases ?? 0
      curC.value += c.value ?? 0
      curC.clicks += c.clicks ?? 0
      curC.type = c.type ?? curC.type
      curC.status = c.status ?? curC.status
      curC.months += 1
      for (const [k, v] of Object.entries(c.conversionActions || {})) {
        curC.conversionActions[k] = (curC.conversionActions[k] ?? 0) + v
      }
      campaignMap.set(c.name, curC)
    }
  }
  const campaigns = [...campaignMap.values()]

  const convRows = convKeys?.map((key) => ({
    key,
    name: ESHOP_GOOGLE_CONV_LABELS[key] ?? key,
    total: convTotals[key],
  })) ?? []

  return (
    <>
      <div className="kpi-grid">
        <Kpi label="Investícia" value={fmtEur(cur.spend)} delta={d('spend')} deltaGood="neutral" />
        <Kpi label="Hodnota nákupov" value={fmtEur(cur.value)} sub={skNakupySub(cur.purchases)} delta={d('value')} />
        <Kpi label="ROAS" value={fmtRoas(cur.roas)} delta={d('roas')}
          subClass={cur.roas >= 3 ? 'up' : cur.roas < 1 ? 'down' : ''} />
        <Kpi label="Kliknutia" value={fmtNum(cur.clicks)} delta={d('clicks')}
          sub={cur.cpc != null ? `CPC ${fmtEur(cur.cpc, 2)}` : null} />
        {convKeys ? (
          <>
            <Kpi label="Konverzie" value={fmtDec(cur.conversions)}
              sub={cur.costPerConv != null ? `Cena / konv. ${fmtEur(cur.costPerConv, 2)}` : null}
              delta={d('conversions')} />
            <Kpi label="Nákupy" value={fmtDec(cur.purchases)} delta={d('purchases')} />
            <Kpi label="Pridanie do košíka" value={fmtDec(convTotals.add_to_cart)} delta={dc('add_to_cart')} />
            <Kpi label="Začatie checkoutu" value={fmtDec(convTotals.begin_checkout)} delta={dc('begin_checkout')} />
            <Kpi label="Nákup (purchase)" value={fmtDec(convTotals.purchase)} delta={dc('purchase')} />
          </>
        ) : eshop ? (
          <>
            <Kpi label="Nákupy" value={fmtNum(cur.purchases)} delta={d('purchases')} />
            <Kpi label="Cena za nákup" value={fmtEur(cur.cpp, 2)} delta={d('cpp')} deltaGood="down" />
          </>
        ) : (
          <>
            <Kpi label="Zobrazenia" value={fmtNum(cur.impressions)} delta={d('impressions')} />
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
          <div className="section-title">
            {convKeys ? 'Konverzie' : 'Nákupy'}
            <span className="hint">mesačne</span>
          </div>
          <div className="card">
            <MonthBarChart
              data={chartData}
              series={[{
                key: convKeys ? 'conversions' : 'purchases',
                name: convKeys ? 'Konverzie' : 'Nákupy',
                color: '#10b981',
              }]}
            />
          </div>
        </div>
        <div>
          <div className="section-title">Investícia <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart
              data={chartData}
              series={[{ key: 'spend', name: 'Investícia', color: '#f59e0b', eur: true }]}
            />
          </div>
        </div>
      </div>

      {convRows.length > 0 && (
        <Section title="Konverzie podľa akcie" hint="add_to_cart · begin_checkout · purchase">
          <SortableTable
            columns={[
              { key: 'name', label: 'Konverzná akcia', sort: (r) => r.name, render: (r) => r.name },
              { key: 'total', label: 'Počet', align: 'num', sort: (r) => r.total, render: (r) => fmtDec(r.total) },
            ]}
            rows={convRows}
            rowKey={(r) => r.key}
            defaultSortKey="total"
            defaultSortDir="desc"
          />
        </Section>
      )}

      <Section title="Kampane" hint={convKeys ? 'konverzie podľa exportu — bez investície na úrovni kampane' : 'súčet za vybrané obdobie'}>
        <SortableTable
          columns={buildCampaignColumns(eshop, convKeys)}
          rows={campaigns}
          rowKey={(c) => c.name}
          defaultSortKey={convKeys ? 'conversions' : 'spend'}
        />
      </Section>

      <Section title="Mesačný detail">
        <SortableTable
          columns={buildMonthColumns(eshop, convKeys)}
          rows={rows}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
        />
      </Section>
    </>
  )
}
