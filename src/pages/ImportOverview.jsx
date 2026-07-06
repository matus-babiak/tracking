import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import clients from '../data'
import {
  buildImportMatrix,
  getImportYears,
  importCellTitle,
  importColumnLabel,
  IMPORT_SOURCES,
} from '../lib/importOverview'
import { fmtNum } from '../lib/helpers'

function CheckIcon({ state }) {
  if (state === 'missing') {
    return <span className="import-check import-check--no" aria-label="Chýba">–</span>
  }
  if (state === 'partial') {
    return (
      <span className="import-check import-check--partial" aria-label="Čiastočný import">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
    )
  }
  return (
    <span className="import-check import-check--yes" aria-label="Kompletný import">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  )
}

function SourceDots({ sources }) {
  if (!sources.length) return null
  return (
    <span className="import-source-dots">
      {IMPORT_SOURCES.filter((s) => sources.includes(s.key)).map((s) => (
        <span
          key={s.key}
          className={`import-source-dot${s.variant ? ` import-source-dot--${s.variant}` : ''}`}
          title={s.label}
        >
          {s.short}
        </span>
      ))}
    </span>
  )
}

function cellCheckState(cell) {
  if (!cell.imported) return 'missing'
  return cell.complete ? 'complete' : 'partial'
}

export default function ImportOverview() {
  const years = useMemo(() => getImportYears(clients), [])
  const [year, setYear] = useState(() => years[years.length - 1] ?? new Date().getFullYear())

  const { columns, rows, totals } = useMemo(
    () => buildImportMatrix(clients, year),
    [year],
  )

  const fillPct = totals.cells ? Math.round((totals.imported / totals.cells) * 100) : 0
  const completePct = totals.cells ? Math.round((totals.complete / totals.cells) * 100) : 0

  return (
    <div className="import-overview">
      <div className="import-toolbar">
        <div className="import-year-picker">
          <span className="import-year-label">Rok</span>
          <div className="import-year-chips">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                className={`import-year-chip${y === year ? ' active' : ''}`}
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="import-summary">
        <div className="import-stat">
          <span className="import-stat-value">{fmtNum(clients.length)}</span>
          <span className="import-stat-label">klientov</span>
        </div>
        <div className="import-stat">
          <span className="import-stat-value">{year}</span>
          <span className="import-stat-label">zobrazený rok</span>
        </div>
        <div className="import-stat">
          <span className="import-stat-value">{fillPct} %</span>
          <span className="import-stat-label">mesiacov s dátami</span>
        </div>
        <div className="import-stat">
          <span className="import-stat-value">{completePct} %</span>
          <span className="import-stat-label">kompletných mesiacov</span>
        </div>
        <div className="import-stat">
          <span className="import-stat-value">{totals.gaExport}</span>
          <span className="import-stat-label">GA4 CSV (nové)</span>
        </div>
        <div className="import-stat">
          <span className="import-stat-value">{totals.gaLegacy}</span>
          <span className="import-stat-label">GA4 PDF (staré)</span>
        </div>
      </div>

      <div className="import-legend">
        <span><CheckIcon state="complete" /> kompletný mesiac (všetky povinné zdroje)</span>
        <span><CheckIcon state="partial" /> čiastočný import (chýba zdroj)</span>
        <span><CheckIcon state="missing" /> mesiac chýba</span>
        <span className="import-legend-sources">
          Zdroje:
          {IMPORT_SOURCES.map((s) => (
            <span
              key={s.key}
              className={`import-source-dot${s.variant ? ` import-source-dot--${s.variant}` : ''}`}
            >
              {s.short}
            </span>
          ))}
          = Meta, Google, GA4 staré/PDF, GA4 nové/CSV, E-shop, Email
        </span>
      </div>

      <div className="table-wrap import-matrix-wrap">
        <table className="import-matrix">
          <thead>
            <tr>
              <th className="import-matrix-client">Klient</th>
              <th className="import-matrix-count num">Mesiace</th>
              {columns.map((key) => (
                <th key={key} className="import-matrix-month num">{importColumnLabel(key, { withYear: false })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ client, cells, imported, complete, total }) => (
              <tr key={client.id}>
                <td className="import-matrix-client">
                  <Link to={`/${client.id}`} className="import-client-link">{client.name}</Link>
                </td>
                <td className="num import-matrix-count">
                  <span className={complete === total ? 'import-count-full' : 'import-count-partial'} title={`${complete} kompletných z ${imported} importovaných`}>
                    {complete}/{total}
                  </span>
                </td>
                {cells.map((cell) => (
                  <td key={cell.key} className="num import-matrix-cell">
                    <div
                      className={`import-cell-inner${cell.imported && !cell.complete ? ' import-cell-inner--partial' : ''}${cell.gaTier === 'export' ? ' import-cell-inner--ga-export' : ''}${cell.gaTier === 'legacy' ? ' import-cell-inner--ga-legacy' : ''}`}
                      title={importCellTitle(cell)}
                    >
                      <CheckIcon state={cellCheckState(cell)} />
                      {cell.imported && <SourceDots sources={cell.sources} />}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
