import { fmtEur, fmtNum, fmtPct } from './helpers'

export const EMAIL_CAMPAIGN_COLUMNS = [
  {
    key: 'name',
    label: 'Kampaň',
    sticky: true,
    sort: (r) => r.name,
    render: (r) => r.name,
  },
  {
    key: 'sent',
    label: 'Odoslané',
    align: 'num',
    sort: (r) => r.sent,
    render: (r) => fmtNum(r.sent),
  },
  {
    key: 'openRate',
    label: 'Open rate',
    align: 'num',
    total: 'avg',
    sort: (r) => r.openRate,
    render: (r) => fmtPct(r.openRate),
  },
  {
    key: 'clicks',
    label: 'Kliknutia',
    align: 'num',
    sort: (r) => r.clicks,
    render: (r) => fmtNum(r.clicks),
  },
  {
    key: 'clickRate',
    label: 'Click rate',
    align: 'num',
    total: 'avg',
    sort: (r) => r.clickRate,
    render: (r) => fmtPct(r.clickRate, 2),
  },
  {
    key: 'unsubRate',
    label: 'Odhlásenia',
    align: 'num',
    total: 'avg',
    sort: (r) => r.unsubRate,
    render: (r) => fmtPct(r.unsubRate, 2),
  },
  {
    key: 'revenue',
    label: 'Tržby',
    align: 'num',
    sort: (r) => r.revenue,
    render: (r) => fmtEur(r.revenue),
  },
]

export function buildEmailCampaignMonthColumns() {
  return [
    {
      key: 'month',
      label: 'Mesiac',
      sticky: true,
      sort: (r) => r.monthKey,
      render: (r) => r.monthFull,
    },
    ...EMAIL_CAMPAIGN_COLUMNS,
  ]
}

export function buildEmailCampaignRollupColumns() {
  return [
    ...EMAIL_CAMPAIGN_COLUMNS,
    {
      key: 'months',
      label: 'Mesiace',
      align: 'num',
      sort: (r) => r.months,
      render: (r) => fmtNum(r.months),
    },
  ]
}
