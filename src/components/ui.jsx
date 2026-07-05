import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import { fmtEur, fmtNum, PRESETS, COMPARE_MODES, monthKey, monthFull } from '../lib/helpers'

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

// GA4-style výber obdobia: preset + vlastný rozsah + porovnanie
export function PeriodPicker({ client, preset, onPreset, customFrom, customTo, onCustomFrom, onCustomTo, compare, onCompare }) {
  const all = client.months
  return (
    <div className="period-picker">
      <div className="period-row">
        <select className="period-select" value={preset} onChange={(e) => onPreset(e.target.value)}>
          {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <select className="period-select compare" value={compare} onChange={(e) => onCompare(e.target.value)}>
          {COMPARE_MODES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      {preset === 'custom' && (
        <div className="period-row">
          <select className="period-select" value={customFrom} onChange={(e) => onCustomFrom(Number(e.target.value))}>
            {all.map((m) => (
              <option key={monthKey(m)} value={monthKey(m)} disabled={monthKey(m) > customTo}>{monthFull(m)}</option>
            ))}
          </select>
          <span className="range-sep">→</span>
          <select className="period-select" value={customTo} onChange={(e) => onCustomTo(Number(e.target.value))}>
            {all.map((m) => (
              <option key={monthKey(m)} value={monthKey(m)} disabled={monthKey(m) < customFrom}>{monthFull(m)}</option>
            ))}
          </select>
        </div>
      )}
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
  const isEur = series.some((s) => s.eur)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barGap={2} barCategoryGap="28%">
        {baseAxes()}
        <YAxis tick={{ fontSize: 11.5, fill: '#999' }} axisLine={false} tickLine={false} width={52}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toLocaleString('sk-SK')}k` : v} />
        <Tooltip contentStyle={tooltipStyle}
          formatter={(val, name, item) => [isEur && item?.dataKey !== 'roas' ? eurFmt(val) : numFmt(val), name]}
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
