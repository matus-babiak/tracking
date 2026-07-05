import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import clients from '../data'
import { buildImportMatrix, getImportYears, importColumnLabel, IMPORT_SOURCES } from '../lib/importOverview'
import { fmtNum } from '../lib/helpers'

function CheckIcon({ ok }) {
  if (!ok) {
    return <span className="import-check import-check--no" aria-label="Chýba">–</span>
  }
  return (
    <span className="import-check import-check--yes" aria-label="Importované">
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
        <span key={s.key} className="import-source-dot" title={s.label}>{s.short}</span>
      ))}
    </span>
  )
}

export default function ImportOverview() {
  const years = useMemo(() => getImportYears(clients), [])
  const [year, setYear] = useState(() => years[years.length - 1] ?? new Date().getFullYear())

  const { columns, rows } = useMemo(
    () => buildImportMatrix(clients, year),
    [year],
  )

  const totalImported = rows.reduce((sum, r) => sum + r.imported, 0)
  const totalCells = rows.reduce((sum, r) => sum + r.total, 0)

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
          <span className="import-stat-value">{totalCells ? Math.round((totalImported / totalCells) * 100) : 0} %</span>
          <span className="import-stat-label">vyplnených buniek</span>
        </div>
      </div>

      <div className="import-legend">
        <span><CheckIcon ok /> mesiac importovaný</span>
        <span><CheckIcon ok={false} /> mesiac chýba</span>
        <span className="import-legend-sources">
          Zdroje:
          {IMPORT_SOURCES.map((s) => (
            <span key={s.key} className="import-source-dot">{s.short}</span>
          ))}
          = Meta, Google, GA4, E-shop, Email
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
            {rows.map(({ client, cells, imported, total }) => (
              <tr key={client.id}>
                <td className="import-matrix-client">
                  <Link to={`/${client.id}`} className="import-client-link">{client.name}</Link>
                </td>
                <td className="num import-matrix-count">
                  <span className={imported === total ? 'import-count-full' : 'import-count-partial'}>
                    {imported}/{total}
                  </span>
                </td>
                {cells.map((cell) => (
                  <td key={cell.key} className="num import-matrix-cell">
                    <div className="import-cell-inner" title={
                      cell.imported
                        ? `Importované: ${cell.sources.map((k) => IMPORT_SOURCES.find((s) => s.key === k)?.label).join(', ')}`
                        : 'Mesiac bez dát'
                    }>
                      <CheckIcon ok={cell.imported} />
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
