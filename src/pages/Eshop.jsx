import { Kpi, Section, MonthBarChart, SortableTable } from '../components/ui'
import { monthFull, monthLabel, monthKey, fmtEur, fmtNum, sum, pctChange } from '../lib/helpers'
import { mergeCategoryRows, mergeProductRows } from '../lib/eshopMerge'

function eshopStats(months) {
  const rows = months.filter((m) => m.eshop)
  return {
    revenue: sum(rows, (m) => m.eshop.revenue),
    netRevenue: sum(rows, (m) => m.eshop.netRevenue),
    grossSales: sum(rows, (m) => m.eshop.grossSales),
    orders: sum(rows, (m) => m.eshop.orders),
    items: sum(rows, (m) => m.eshop.items),
    variants: sum(rows, (m) => m.eshop.variants),
    refunds: sum(rows, (m) => m.eshop.refunds ?? 0),
    coupons: sum(rows, (m) => m.eshop.coupons ?? 0),
    taxes: sum(rows, (m) => m.eshop.taxes ?? 0),
    shipping: sum(rows, (m) => m.eshop.shipping ?? 0),
  }
}

function aggregateRankings(months, key) {
  const all = []
  for (const m of months) {
    all.push(...(m.eshop?.[key] ?? []))
  }
  return key === 'products' ? mergeProductRows(all) : mergeCategoryRows(all)
}

function aggregateCategories(months) {
  const all = []
  for (const m of months) {
    all.push(...(m.eshop?.categories ?? []))
  }
  return mergeCategoryRows(all)
}

const monthColumns = [
  { key: 'month', label: 'Mesiac', sort: (m) => monthKey(m), render: (m) => monthFull(m) },
  { key: 'revenue', label: 'Celkové predaje', align: 'num', sort: (m) => m.eshop.revenue, render: (m) => fmtEur(m.eshop.revenue) },
  { key: 'netRevenue', label: 'Čisté predaje', align: 'num', sort: (m) => m.eshop.netRevenue, render: (m) => fmtEur(m.eshop.netRevenue) },
  { key: 'grossSales', label: 'Hrubý predaj', align: 'num', sort: (m) => m.eshop.grossSales, render: (m) => fmtEur(m.eshop.grossSales) },
  { key: 'orders', label: 'Objednávky', align: 'num', sort: (m) => m.eshop.orders, render: (m) => fmtNum(m.eshop.orders) },
  { key: 'items', label: 'Predané položky', align: 'num', sort: (m) => m.eshop.items, render: (m) => fmtNum(m.eshop.items) },
  { key: 'variants', label: 'Predané varianty', align: 'num', sort: (m) => m.eshop.variants, render: (m) => fmtNum(m.eshop.variants) },
  { key: 'coupons', label: 'Zľavové kódy', align: 'num', sort: (m) => m.eshop.coupons, render: (m) => fmtEur(m.eshop.coupons) },
  { key: 'taxes', label: 'Dane', align: 'num', sort: (m) => m.eshop.taxes, render: (m) => fmtEur(m.eshop.taxes) },
  { key: 'shipping', label: 'Doprava', align: 'num', sort: (m) => m.eshop.shipping, render: (m) => fmtEur(m.eshop.shipping) },
]

const categoryColumns = [
  { key: 'name', label: 'Kategória', sort: (r) => r.name, render: (r) => r.name },
  { key: 'items', label: 'Predané položky', align: 'num', sort: (r) => r.items, render: (r) => fmtNum(r.items) },
  { key: 'netRevenue', label: 'Čisté predaje', align: 'num', sort: (r) => r.netRevenue, render: (r) => fmtEur(r.netRevenue) },
]

const productColumns = [
  { key: 'name', label: 'Produkt', sort: (r) => r.name, render: (r) => r.name },
  { key: 'sku', label: 'Katalógové číslo', sort: (r) => r.sku, render: (r) => r.sku || '–' },
  { key: 'items', label: 'Predané položky', align: 'num', sort: (r) => r.items, render: (r) => fmtNum(r.items) },
  { key: 'netRevenue', label: 'Čisté predaje', align: 'num', sort: (r) => r.netRevenue, render: (r) => fmtEur(r.netRevenue) },
  { key: 'orders', label: 'Objednávky', align: 'num', sort: (r) => r.orders, render: (r) => fmtNum(r.orders) },
  { key: 'variants', label: 'Varianty', align: 'num', sort: (r) => r.variants, render: (r) => fmtNum(r.variants) },
]

export default function Eshop({ months, compare }) {
  const rows = months.filter((m) => m.eshop)
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        Vo vybranom období nie sú dostupné dáta z WooCommerce.
      </div>
    )
  }

  const cur = eshopStats(months)
  const prev = compare?.months.some((m) => m.eshop) ? eshopStats(compare.months) : null
  const d = (key) => (prev ? pctChange(cur[key], prev[key]) : null)

  const hasVariants = rows.some((m) => m.eshop.variants != null)
  const hasRevenueDetail = rows.some((m) => m.eshop.grossSales != null)

  const chartData = rows.map((m) => ({
    label: monthLabel(m),
    netRevenue: m.eshop.netRevenue ?? m.eshop.revenue,
    orders: m.eshop.orders,
    revenue: m.eshop.revenue,
    items: m.eshop.items,
  }))

  const categories = aggregateCategories(rows)
  const products = aggregateRankings(rows, 'products')
  const hasRankings = categories.length > 0 || products.length > 0
  const combinedShops = [...new Set(rows.flatMap((m) => m.eshop.combinedShops ?? []))]
  const combinedMonths = rows.filter((m) => m.eshop.combinedShops?.length)

  return (
    <>
      <div className="eshop-alert" role="status">
        <span>
          Údaje sú ručne skopírované z WooCommerce a nezobrazujú 1:1 kompletnú analytiku z administrácie e-shopu.
        </span>
        {combinedShops.length > 0 && (
          <>
            <span className="eshop-alert-sep" aria-hidden="true"> · </span>
            <span>
              {combinedMonths.map(monthLabel).join(', ')} — súčet e-shopov {combinedShops.join(' + ')}.
            </span>
          </>
        )}
      </div>
      <div className="kpi-grid">
        <Kpi label="Celkové predaje" value={fmtEur(cur.revenue)} delta={d('revenue')} />
        <Kpi label="Čisté predaje" value={fmtEur(cur.netRevenue)} delta={d('netRevenue')} />
        <Kpi label="Objednávky" value={fmtNum(cur.orders)} delta={d('orders')} />
        <Kpi label="Predané položky" value={fmtNum(cur.items)} delta={d('items')} />
        {hasVariants && (
          <Kpi label="Predané varianty" value={fmtNum(cur.variants)} delta={d('variants')} />
        )}
      </div>

      {hasRevenueDetail && (
        <div className="kpi-grid">
          <Kpi label="Hrubý predaj" value={fmtEur(cur.grossSales)} delta={d('grossSales')} />
          <Kpi label="Refundácie" value={fmtEur(cur.refunds)} delta={d('refunds')} deltaGood="down" />
          <Kpi label="Zľavové kódy" value={fmtEur(cur.coupons)} delta={d('coupons')} deltaGood="down" />
          <Kpi label="Dane" value={fmtEur(cur.taxes)} delta={d('taxes')} />
          <Kpi label="Doprava" value={fmtEur(cur.shipping)} delta={d('shipping')} />
        </div>
      )}

      <div className="chart-grid section">
        <div>
          <div className="section-title">Čisté predaje <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart
              data={chartData}
              series={[{ key: 'netRevenue', name: 'Čisté predaje', color: '#8b5cf6', eur: true }]}
            />
          </div>
        </div>
        <div>
          <div className="section-title">Objednávky <span className="hint">mesačne</span></div>
          <div className="card">
            <MonthBarChart
              data={chartData}
              series={[{ key: 'orders', name: 'Objednávky', color: '#10b981' }]}
            />
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <Section title="Najlepšie kategórie" hint="predané položky · WooCommerce">
          <SortableTable
            columns={categoryColumns}
            rows={categories}
            rowKey={(r) => r.name}
            defaultSortKey="items"
            defaultSortDir="desc"
            limit={10}
          />
        </Section>
      )}

      {products.length > 0 && (
        <Section title="Najlepšie produkty" hint="predané položky · WooCommerce">
          <SortableTable
            columns={productColumns}
            rows={products}
            rowKey={(r) => r.sku ? `${r.sku}-${r.name}` : r.name}
            defaultSortKey="items"
            defaultSortDir="desc"
            limit={10}
          />
        </Section>
      )}

      {!hasRankings && rows.length === 1 && (
        <p className="section-hint" style={{ marginBottom: '1rem' }}>
          Rebríčky kategórií a produktov sú k dispozícii len pre mesiace s detailným WooCommerce exportom.
        </p>
      )}

      <Section title="Mesačný detail" hint="WooCommerce">
        <SortableTable
          columns={monthColumns.filter((col) => {
            if (col.key === 'variants') return hasVariants
            if (['grossSales', 'coupons', 'taxes', 'shipping'].includes(col.key)) return hasRevenueDetail
            return true
          })}
          rows={rows}
          rowKey={(m) => `${m.year}-${m.month}`}
          defaultSortKey="month"
          defaultSortDir="desc"
          limit={12}
        />
      </Section>
    </>
  )
}
