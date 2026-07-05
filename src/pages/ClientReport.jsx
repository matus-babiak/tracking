import { useMemo, useRef, useState } from 'react'
import { buildClientReport } from '../lib/clientReport'
import { downloadReportPdf, reportPdfFilename } from '../lib/downloadReportPdf'
import { metricToneClass, metricToneFromLabel } from '../lib/metricTone'
import { skZaObdobieMesiace } from '../lib/skGrammar'

function valueToneClass(tone, label) {
  return metricToneClass(tone ?? metricToneFromLabel(label))
}

function ReportHighlight({ label, value, hint, tone }) {
  const toneCls = valueToneClass(tone, label)
  return (
    <div className="client-report-highlight client-report-pdf-avoid">
      <div className={`client-report-highlight-value${toneCls ? ` ${toneCls}` : ''}`}>{value}</div>
      <div className="client-report-highlight-label">{label}</div>
      {hint && <div className="client-report-highlight-hint">{hint}</div>}
    </div>
  )
}

function ReportSection({ title, intro, rows, topCampaigns }) {
  if (!rows.length) return null
  return (
    <section className="client-report-section">
      <div className="client-report-section-head client-report-pdf-avoid">
        <h3 className="client-report-section-title">{title}</h3>
        {intro && <p className="client-report-section-intro">{intro}</p>}
      </div>
      <dl className="client-report-rows">
        {rows.map((r) => {
          const toneCls = valueToneClass(r.tone, r.label)
          return (
          <div key={r.label} className="client-report-row client-report-pdf-avoid">
            <dt className="client-report-row-label">
              {r.label}
              {r.hint && <span className="client-report-row-hint">{r.hint}</span>}
            </dt>
            <dd className={`client-report-row-value${toneCls ? ` ${toneCls}` : ''}`}>{r.value}</dd>
          </div>
          )
        })}
      </dl>
      {topCampaigns?.items?.length > 0 && (
        <div className="client-report-top-campaigns client-report-pdf-avoid">
          <h4 className="client-report-top-heading">{topCampaigns.heading}</h4>
          <dl className="client-report-rows client-report-top-rows">
            {topCampaigns.items.map((c) => {
              const toneCls = valueToneClass(c.tone)
              return (
              <div key={c.name} className="client-report-row client-report-top-row">
                <dt className="client-report-row-label">
                  {c.name}
                  {c.detail && <span className="client-report-row-hint">{c.detail}</span>}
                </dt>
                <dd className={`client-report-row-value${toneCls ? ` ${toneCls}` : ''}`}>{c.value}</dd>
              </div>
              )
            })}
          </dl>
        </div>
      )}
    </section>
  )
}

export default function ClientReport({ client, months }) {
  const docRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const report = useMemo(() => buildClientReport(client, months), [client, months])

  const handleDownload = async () => {
    if (!docRef.current || downloading) return
    setDownloading(true)
    try {
      await downloadReportPdf(
        docRef.current,
        reportPdfFilename(report.clientName, report.period),
      )
    } catch {
      window.alert('PDF sa nepodarilo vygenerovať. Skúste to znova.')
    } finally {
      setDownloading(false)
    }
  }

  if (!months.length) {
    return (
      <div className="client-report-empty">
        Pre zvolené obdobie nie sú dostupné dáta.
      </div>
    )
  }

  const isSingleMonth = months.length === 1

  return (
    <article className="client-report-doc" ref={docRef}>
      <button
        type="button"
        className="client-report-download"
        onClick={handleDownload}
        disabled={downloading}
        aria-label="Stiahnuť PDF"
        title="Stiahnuť PDF"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloading ? 'Generujem…' : 'PDF'}
      </button>

      <header className="client-report-cover client-report-pdf-avoid">
        <p className="client-report-kicker">Marketingový report</p>
        <h2 className="client-report-title">{report.clientName}</h2>
        <p className="client-report-period">{report.period}</p>
        <p className="client-report-meta">
          {isSingleMonth ? 'Mesačný prehľad' : skZaObdobieMesiace(months.length)}
          {' · '}
          {new Date().toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      <div className="client-report-body">
        {report.summary && (
          <section className="client-report-summary-block client-report-pdf-avoid">
            <h3 className="client-report-summary-heading">Zhrnutie</h3>
            <p className="client-report-summary">{report.summary}</p>
          </section>
        )}

        {report.highlights.length > 0 && (
          <section className="client-report-highlights-wrap client-report-pdf-avoid">
            <h3 className="client-report-summary-heading">Kľúčové čísla</h3>
            <div className="client-report-highlights">
              {report.highlights.map((h) => (
                <ReportHighlight key={h.label} {...h} />
              ))}
            </div>
          </section>
        )}

        {report.sections.map((section) => (
          <ReportSection key={section.title} {...section} />
        ))}
      </div>
    </article>
  )
}
