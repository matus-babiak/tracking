import { monthFull, monthKey, monthLabel } from './helpers'

function addCount(total, value) {
  if (value == null) return total
  return (total ?? 0) + value
}

/** Riadky kampaní pre tabuľku — reálny rozklad alebo mesačný súhrn. */
export function flattenEmailCampaignRows(months) {
  const rows = []
  for (const m of months) {
    if (!m.email) continue
    const period = monthFull(m)
    const key = monthKey(m)
    const campaigns = m.email.campaigns?.length
      ? m.email.campaigns
      : [{
          name: 'Celkom',
          sent: m.email.sent,
          openRate: m.email.openRate,
          clicks: m.email.uniqueClicks,
          clickRate: m.email.clickRate,
          unsubRate: m.email.unsubRate,
          revenue: m.email.revenue,
          rollup: true,
        }]

    for (const c of campaigns) {
      rows.push({
        ...c,
        year: m.year,
        month: m.month,
        monthKey: key,
        monthLabel: monthLabel(m),
        monthFull: period,
        rowKey: `${key}::${c.name}`,
      })
    }
  }
  return rows
}

/** Súčet rovnako pomenovaných kampaní za obdobie. */
export function aggregateEmailCampaignRollup(months) {
  const flat = flattenEmailCampaignRows(months)
  const map = new Map()

  for (const row of flat) {
    const prev = map.get(row.name) ?? {
      name: row.name,
      sent: null,
      clicks: null,
      revenue: null,
      openRateSum: 0,
      clickRateSum: 0,
      unsubRateSum: 0,
      unsubMonths: 0,
      months: 0,
    }
    prev.sent = addCount(prev.sent, row.sent)
    prev.clicks = addCount(prev.clicks, row.clicks)
    prev.revenue = addCount(prev.revenue, row.revenue)
    if (row.openRate != null) {
      prev.openRateSum += row.openRate
      prev.months += 1
    }
    if (row.clickRate != null) prev.clickRateSum += row.clickRate
    if (row.unsubRate != null) {
      prev.unsubRateSum += row.unsubRate
      prev.unsubMonths += 1
    }
    map.set(row.name, prev)
  }

  return [...map.values()]
    .map((r) => ({
      name: r.name,
      sent: r.sent,
      clicks: r.clicks,
      revenue: r.revenue,
      openRate: r.months ? r.openRateSum / r.months : null,
      clickRate: r.months ? r.clickRateSum / r.months : null,
      unsubRate: r.unsubMonths ? r.unsubRateSum / r.unsubMonths : null,
      months: r.months,
      rowKey: r.name,
    }))
    .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0) || (b.clicks ?? 0) - (a.clicks ?? 0))
}
