import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell,
} from 'recharts'
import { fmtEur, fmtNum, PRESETS, COMPARE_MODES, monthKey, monthFull, presetRange, canShiftPeriodRange, shiftPeriodRange } from '../lib/helpers'
import {
  buildMockRow,
  computeTableTotals,
  firstLabelColumnIndex,
  getColumnTotalType,
  hasTotalRow,
} from '../lib/tableTotals'

function compareSortValues(a, b, dir) {
  const mul = dir === 'asc' ? 1 : -1
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b, 'sk') * mul
  return (a - b) * mul
}

// Tabuľka s triedením stĺpcov (klik na hlavičku: najprv zostupne, potom vzostupne)
const TABLE_ROW_LIMIT = 10
const STICKY_WIDTHS = [160, 220, 120]

function stickyLeft(columns, colIndex) {
  const col = columns[colIndex]
  if (!col?.sticky) return null
  let left = 0
  for (let i = 0; i < colIndex; i++) {
    if (columns[i].sticky) {
      const idx = columns.slice(0, i + 1).filter((c) => c.sticky).length - 1
      left += STICKY_WIDTHS[idx] ?? 140
    }
  }
  return left
}

function stickyIndex(columns, colIndex) {
  if (!columns[colIndex]?.sticky) return null
  return columns.slice(0, colIndex + 1).filter((c) => c.sticky).length - 1
}

function cellClass(col, columns, colIndex, isLastSticky) {
  const parts = []
  if (col.align === 'num') parts.push('num')
  if (col.sticky) {
    parts.push('sticky-col')
    if (isLastSticky) parts.push('sticky-col-edge')
  }
  return parts.join(' ')
}

function TotalCell({ col, totals }) {
  const type = getColumnTotalType(col)
  if (type === 'label' || type === 'none') return '–'
  const v = totals[col.key]
  if (v == null) return '–'
  if (col.key === 'roas') return <RoasBadge value={v} />
  return col.render(buildMockRow(totals))
}

function TableTotalRow({ columns, rows, label, lastStickyIndex, labelColIndex, rowClass = 'total' }) {
  const totals = useMemo(() => computeTableTotals(columns, rows), [columns, rows])
  return (
    <tr className={rowClass}>
      {columns.map((col, colIndex) => (
        <td
          key={col.key}
          className={cellClass(col, columns, colIndex, colIndex === lastStickyIndex)}
          style={col.sticky ? { left: stickyLeft(columns, colIndex) } : undefined}
          data-sticky-idx={stickyIndex(columns, colIndex) ?? undefined}
        >
          {colIndex === labelColIndex
            ? label
            : getColumnTotalType(col) === 'label'
              ? ''
              : <TotalCell col={col} totals={totals} />}
        </td>
      ))}
    </tr>
  )
}

export function SortableTable({
  columns,
  rows,
  rowKey,
  footer,
  compareRows,
  compareLabel,
  totalLabel = 'Celkom',
  defaultSortKey,
  defaultSortDir = 'desc',
  limit = TABLE_ROW_LIMIT,
  expandable = true,
}) {
  const [sortKey, setSortKey] = useState(defaultSortKey || columns.find((c) => c.sort)?.key)
  const [sortDir, setSortDir] = useState(defaultSortDir)
  const [expanded, setExpanded] = useState(false)

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sort) return rows
    return [...rows].sort((a, b) => compareSortValues(col.sort(a), col.sort(b), sortDir))
  }, [rows, columns, sortKey, sortDir])

  useEffect(() => {
    setExpanded(false)
  }, [rows, sortKey, sortDir])

  const canExpand = expandable && sorted.length > limit
  const visibleRows = expandable && expanded ? sorted : sorted.slice(0, limit)
  const hiddenCount = sorted.length - limit

  const onSort = (col) => {
    if (!col.sort) return
    if (sortKey === col.key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else {
      setSortKey(col.key)
      setSortDir('desc')
    }
  }

  const hasSticky = columns.some((c) => c.sticky)
  const lastStickyIndex = columns.reduce((acc, c, i) => (c.sticky ? i : acc), -1)
  const labelColIndex = firstLabelColumnIndex(columns)
  const showAutoFooter = footer === undefined && hasTotalRow(columns, rows)
  const autoFooter = showAutoFooter && (
    <>
      <TableTotalRow
        columns={columns}
        rows={rows}
        label={totalLabel}
        lastStickyIndex={lastStickyIndex}
        labelColIndex={labelColIndex}
      />
      {compareRows?.length > 0 && compareLabel && (
        <TableTotalRow
          columns={columns}
          rows={compareRows}
          label={compareLabel}
          lastStickyIndex={lastStickyIndex}
          labelColIndex={labelColIndex}
          rowClass="total compare-row"
        />
      )}
    </>
  )

  return (
    <div className="sortable-table">
      {hasSticky && <p className="table-scroll-hint">Posuňte tabuľku do strán pre ďalšie stĺpce.</p>}
      <div className={`table-wrap${hasSticky ? ' table-sticky-cols' : ''}`}>
        <table>
          <thead>
            <tr>
              {columns.map((col, colIndex) => {
                const sIdx = stickyIndex(columns, colIndex)
                return (
                <th
                  key={col.key}
                  className={[
                    col.align === 'num' ? 'num' : '',
                    col.sort ? 'sortable' : '',
                    col.sticky ? 'sticky-col' : '',
                    colIndex === lastStickyIndex ? 'sticky-col-edge' : '',
                  ].filter(Boolean).join(' ')}
                  style={col.sticky ? { left: stickyLeft(columns, colIndex) } : undefined}
                  data-sticky-idx={sIdx ?? undefined}
                  onClick={() => onSort(col)}
                  aria-sort={col.sort && sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  <span className="th-label">{col.label}</span>
                  {col.sort && sortKey === col.key && (
                    <span className="sort-indicator" aria-hidden>{sortDir === 'desc' ? '↓' : '↑'}</span>
                  )}
                </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className={cellClass(col, columns, colIndex, colIndex === lastStickyIndex)}
                    style={col.sticky ? { left: stickyLeft(columns, colIndex) } : undefined}
                    data-sticky-idx={stickyIndex(columns, colIndex) ?? undefined}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {footer ?? autoFooter}
          </tbody>
        </table>
      </div>
      {canExpand && !expanded && (
        <div
          className="table-show-more"
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setExpanded(true)
            }
          }}
        >
          Zobraziť viac ({hiddenCount})
        </div>
      )}
    </div>
  )
}

// delta: % zmena voči porovnávaciemu obdobiu (null = neukázať)
// deltaGood: 'up' (rast = dobrý, zelený), 'down' (pokles = dobrý), 'neutral'
export function Kpi({ label, value, sub, subClass, delta, deltaGood = 'up' }) {
  let deltaEl = null
  if (delta != null && Number.isFinite(delta)) {
    const up = delta >= 0
    const good = deltaGood === 'neutral' ? null : (deltaGood === 'up') === up
    const cls = good == null ? '' : good ? 'up' : 'down'
    const arrow = up ? '↑' : '↓'
    deltaEl = (
      <span className={`kpi-delta ${cls}`}>
        {arrow} {Math.abs(delta).toLocaleString('sk-SK', { maximumFractionDigits: 1 })} %
      </span>
    )
  }
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value-row">
        <div className="kpi-value">{value}</div>
        {deltaEl}
      </div>
      {sub != null && <div className={`kpi-sub ${subClass || ''}`}>{sub}</div>}
    </div>
  )
}

export function Section({ title, hint, children }) {
  return (
    <div className="section">
      <div className="section-title">
        {title}
        {hint && <span className="hint">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

// GA4-style výber obdobia: od–do + rýchle predvoľby
export function PeriodPicker({ client, from, to, onFrom, onTo, compare, onCompare, showCompare = true }) {
  const all = client.months

  const setFrom = (key) => {
    onFrom(key)
    if (key > to) onTo(key)
  }

  const setTo = (key) => {
    onTo(key)
    if (key < from) onFrom(key)
  }

  const canBack = canShiftPeriodRange(client, from, to, -1)
  const canForward = canShiftPeriodRange(client, from, to, 1)

  const shiftPeriod = (direction) => {
    const next = shiftPeriodRange(client, from, to, direction)
    if (!next) return
    onFrom(next.from)
    onTo(next.to)
  }

  return (
    <div className="period-picker">
      <div className="period-row">
        <button
          type="button"
          className="period-nav-btn"
          onClick={() => shiftPeriod(-1)}
          disabled={!canBack}
          aria-label="Predchádzajúce obdobie"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <select className="period-select" value={from} onChange={(e) => setFrom(Number(e.target.value))} aria-label="Od mesiaca">
          {all.map((m) => (
            <option key={monthKey(m)} value={monthKey(m)}>{monthFull(m)}</option>
          ))}
        </select>
        <span className="range-sep">–</span>
        <select className="period-select" value={to} onChange={(e) => setTo(Number(e.target.value))} aria-label="Do mesiaca">
          {all.map((m) => (
            <option key={monthKey(m)} value={monthKey(m)}>{monthFull(m)}</option>
          ))}
        </select>
        <button
          type="button"
          className="period-nav-btn"
          onClick={() => shiftPeriod(1)}
          disabled={!canForward}
          aria-label="Nasledujúce obdobie"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="period-row period-actions">
        <div className="period-chips">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="period-chip"
              onClick={() => {
                const range = presetRange(client, p.id)
                if (range) {
                  onFrom(range.from)
                  onTo(range.to)
                }
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {showCompare && (
          <select className="period-select compare" value={compare} onChange={(e) => onCompare(e.target.value)} aria-label="Porovnanie">
            {COMPARE_MODES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}

const tooltipStyle = {
  fontSize: 12.5,
  borderRadius: 8,
  border: '1px solid #e8e8e8',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
}

const eurFmt = (v) => fmtEur(v)
const numFmt = (v) => fmtNum(v)

function baseAxes() {
  return [
    <CartesianGrid key="g" strokeDasharray="0" stroke="#f2f2f2" vertical={false} />,
    <XAxis key="x" dataKey="label" tick={{ fontSize: 11.5, fill: '#999' }} axisLine={false} tickLine={false} />,
  ]
}

// Stĺpcový graf — series: [{ key, name, color, eur }]
export function MonthBarChart({ data, series, height = 240 }) {
  const seriesByKey = Object.fromEntries(series.map((s) => [s.key, s]))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barGap={2} barCategoryGap="28%">
        {baseAxes()}
        <YAxis tick={{ fontSize: 11.5, fill: '#999' }} axisLine={false} tickLine={false} width={52}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toLocaleString('sk-SK')}k` : v} />
        <Tooltip contentStyle={tooltipStyle}
          formatter={(val, name, item) => [
            seriesByKey[item?.dataKey]?.eur ? eurFmt(val) : numFmt(val),
            name,
          ]}
          cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12.5 }} iconType="circle" iconSize={8} />}
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={34} isAnimationActive={false} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthLineChart({ data, series, height = 240, unit }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {baseAxes()}
        <YAxis tick={{ fontSize: 11.5, fill: '#999' }} axisLine={false} tickLine={false} width={52}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toLocaleString('sk-SK')}k` : v} />
        <Tooltip contentStyle={tooltipStyle}
          formatter={(val, name) => [unit === '€' ? eurFmt(val) : unit === '%' ? `${val} %` : numFmt(val), name]} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12.5 }} iconType="circle" iconSize={8} />}
        {series.map((s) => (
          <Line key={s.key} dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: s.color }} activeDot={{ r: 4 }} connectNulls
            strokeDasharray={s.dashed ? '5 4' : undefined} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

const PIE_COLORS = ['#4285f4', '#1877F2', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b', '#06b6d4', '#ec4899', '#94a3b8']

// Koláčový graf — data: [{ name, value, color? }], eur = formát hodnoty
export function CategoryPieChart({ data, height = 240, eur = false }) {
  const slices = (data ?? []).filter((d) => (d.value ?? 0) > 0)
  if (slices.length < 2) return null
  const colored = slices.map((d, i) => ({ ...d, color: d.color ?? PIE_COLORS[i % PIE_COLORS.length] }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={colored}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={height * 0.22}
          outerRadius={height * 0.32}
          paddingAngle={1}
          isAnimationActive={false}
        >
          {colored.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(val) => [eur ? eurFmt(val) : numFmt(val)]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Kombinovaný graf: stĺpce (spend/hodnota) + čiara (ROAS)
export function SpendRoasChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} barGap={2} barCategoryGap="28%">
        {baseAxes()}
        <YAxis yAxisId="eur" tick={{ fontSize: 11.5, fill: '#999' }} axisLine={false} tickLine={false} width={52}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toLocaleString('sk-SK')}k` : v} />
        <YAxis yAxisId="roas" orientation="right" tick={{ fontSize: 11.5, fill: '#999' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip contentStyle={tooltipStyle}
          formatter={(val, name, item) => [item?.dataKey === 'roas' ? val : eurFmt(val), name]}
          cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Legend wrapperStyle={{ fontSize: 12.5 }} iconType="circle" iconSize={8} />
        <Bar yAxisId="eur" dataKey="spend" name="Investícia" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={false} />
        <Bar yAxisId="eur" dataKey="value" name="Hodnota nákupov" fill="#2680eb" radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={false} />
        <Line yAxisId="roas" dataKey="roas" name="ROAS" stroke="#10b981" strokeWidth={2}
          dot={{ r: 3, strokeWidth: 0, fill: '#10b981' }} connectNulls isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export function RoasBadge({ value }) {
  if (value == null) return <span className="badge na">–</span>
  const cls = value >= 3 ? 'good' : value >= 1 ? 'mid' : 'bad'
  return <span className={`badge ${cls}`}>{value.toLocaleString('sk-SK', { maximumFractionDigits: 2 })}</span>
}

export function ClientDropdown({ value, clients, onChange, placeholder, className = '', compact = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const selected = clients.find((c) => c.id === value)
  const label = selected?.name ?? placeholder ?? 'Vybrať klienta'

  useEffect(() => {
    if (!open) return undefined
    const close = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const pick = (id) => {
    onChange(id)
    setOpen(false)
  }

  const options = placeholder ? [{ id: '', name: placeholder }, ...clients] : clients

  return (
    <div ref={rootRef} className={`client-dropdown ${compact ? 'compact' : ''} ${className}`.trim()}>
      <button
        type="button"
        className={`client-dropdown-trigger ${!selected && placeholder ? 'placeholder' : ''} ${open ? 'open' : ''} ${compact ? 'compact' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={compact ? label : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {compact ? (
          <svg className="client-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ) : (
          <>
            <span className="client-dropdown-label">{label}</span>
            <svg className="client-dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </>
        )}
      </button>
      {open && (
        <ul className="client-dropdown-menu" role="listbox">
          {options.map((c) => (
            <li key={c.id || '__placeholder__'} role="option" aria-selected={value === c.id}>
              <button
                type="button"
                className={`client-dropdown-option ${value === c.id ? 'active' : ''}`}
                onClick={() => pick(c.id)}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
