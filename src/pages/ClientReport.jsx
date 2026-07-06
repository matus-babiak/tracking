import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'
import { MonthBarChart, MonthLineChart, SpendRoasChart } from '../components/ui'
import ReportEditableText from '../components/ReportEditableText'
import { buildClientReport } from '../lib/clientReport'
import { downloadReportPdf, reportPdfFilename } from '../lib/downloadReportPdf'
import { metricToneClass, resolveMetricTone } from '../lib/metricTone'
import { buildDefaultEdits } from '../lib/reportEdits'
import { skZaObdobieMesiace } from '../lib/skGrammar'

function toneClass(item) {
  return metricToneClass(resolveMetricTone(item))
}

function ReportRows({ rows }) {
  if (!rows?.length) return null
  return (
    <dl className="client-report-rows client-report-rows--metrics">
      {rows.map((r) => (
        <div key={r.label} className="client-report-row client-report-pdf-avoid">
          <dt className="client-report-row-label">{r.label}</dt>
          <dd className={`client-report-row-value ${toneClass(r)}`.trim()}>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function formatPieValue(val, eur) {
  if (eur) {
    return val.toLocaleString('sk-SK', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  }
  return val.toLocaleString('sk-SK')
}

function ReportPieChart({ chart }) {
  return (
    <ResponsiveContainer width="100%" height={chart.height ?? 200}>
      <PieChart>
        <Pie
          data={chart.data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={78}
          paddingAngle={1}
          isAnimationActive={false}
        >
          {chart.data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(val) => formatPieValue(val, chart.eur)} />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function ReportChart({ chart }) {
  if (!chart) return null
  return (
    <figure className="client-report-figure client-report-pdf-avoid">
      {chart.title && <figcaption className="client-report-figure-caption">{chart.title}</figcaption>}
      <div className="client-report-figure-body">
        {chart.type === 'bar' && (
          <MonthBarChart data={chart.data} series={chart.series} height={chart.height ?? 200} />
        )}
        {chart.type === 'line' && (
          <MonthLineChart data={chart.data} series={chart.series} height={chart.height ?? 200} unit={chart.unit} />
        )}
        {chart.type === 'spendRoas' && (
          <SpendRoasChart data={chart.data} height={chart.height ?? 210} />
        )}
        {chart.type === 'pie' && <ReportPieChart chart={chart} />}
      </div>
    </figure>
  )
}

function ReportCharts({ charts, chart }) {
  const items = charts?.length ? charts : (chart ? [chart] : [])
  if (!items.length) return null

  const layoutClass = items.length === 1
    ? 'client-report-charts--single'
    : 'client-report-charts--double'

  return (
    <div className={`client-report-charts ${layoutClass} client-report-pdf-avoid`}>
      {items.map((c, i) => (
        <ReportChart key={c.title ?? i} chart={c} />
      ))}
    </div>
  )
}

function ReportSectionCommentary({
  value,
  onChange,
  forceDisplay,
}) {
  const [open, setOpen] = useState(!!value?.trim())
  const [startEdit, setStartEdit] = useState(false)
  const show = open || !!value?.trim()

  useEffect(() => {
    if (startEdit) setStartEdit(false)
  }, [startEdit])

  if (!show) {
    return (
      <div className="client-report-commentary client-report-no-pdf">
        <button
          type="button"
          className="client-report-commentary-add"
          onClick={() => {
            setOpen(true)
            setStartEdit(true)
          }}
        >
          Text k výsledkom
        </button>
      </div>
    )
  }

  if (forceDisplay && !value?.trim()) return null

  return (
    <div className={`client-report-commentary client-report-pdf-avoid${startEdit ? ' client-report-commentary--editing' : ''}`}>
      <ReportEditableText
        value={value}
        onChange={onChange}
        placeholder="Text k výsledkom tejto sekcie…"
        displayClassName="client-report-commentary-text"
        inputClassName="client-report-commentary-input"
        forceDisplay={forceDisplay}
        startInEditMode={startEdit}
        variant="inline"
        minRows={3}
        onEditEnd={() => {
          if (!value?.trim()) setOpen(false)
        }}
      />
    </div>
  )
}

function ReportDownloadButton({ onClick, downloading, className }) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={downloading}
      aria-label="Stiahnuť PDF"
      title="Stiahnuť PDF"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {downloading ? 'Generujem…' : 'Stiahnuť PDF'}
    </button>
  )
}

function ReportSection({
  id,
  title,
  intro,
  rows,
  topCampaigns,
  topProducts,
  charts,
  chart,
  sectionComment,
  onSectionCommentChange,
  forceDisplay,
}) {
  if (!rows?.length) return null
  return (
    <section className="client-report-section client-report-pdf-avoid">
      <h3 className="client-report-section-title">{title}</h3>
      {intro && <p className="client-report-section-intro">{intro}</p>}
      <ReportCharts charts={charts} chart={chart} />
      <ReportRows rows={rows} />
      {topCampaigns?.items?.length > 0 && (
        <div className="client-report-subsection client-report-subsection--campaigns">
          <h4 className="client-report-subsection-title">{topCampaigns.heading}</h4>
          <dl className="client-report-rows">
            {topCampaigns.items.map((c) => (
              <div key={c.name} className="client-report-row">
                <dt className="client-report-row-label">
                  {c.name}
                  {c.detail && <span className="client-report-row-hint">{c.detail}</span>}
                </dt>
                <dd className={`client-report-row-value ${toneClass(c)}`.trim()}>{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {topProducts?.items?.length > 0 && (
        <div className="client-report-subsection client-report-subsection--campaigns">
          <h4 className="client-report-subsection-title">{topProducts.heading}</h4>
          <dl className="client-report-rows">
            {topProducts.items.map((c) => (
              <div key={c.name} className="client-report-row">
                <dt className="client-report-row-label">
                  {c.name}
                  {c.detail && <span className="client-report-row-hint">{c.detail}</span>}
                </dt>
                <dd className={`client-report-row-value ${toneClass(c)}`.trim()}>{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <ReportSectionCommentary
        value={sectionComment}
        onChange={onSectionCommentChange}
        forceDisplay={forceDisplay}
      />
    </section>
  )
}

function ReportSummary({ title, summaryText, onSummaryChange, forceDisplay }) {
  if (!summaryText && !title) return null
  return (
    <section className="client-report-section client-report-section--summary client-report-pdf-avoid">
      <h3 className="client-report-section-title">{title}</h3>
      <ReportEditableText
        value={summaryText}
        onChange={onSummaryChange}
        placeholder="Zhrnutie za obdobie…"
        displayClassName="client-report-summary-p"
        inputClassName="client-report-editable-input client-report-summary-input"
        forceDisplay={forceDisplay}
        minRows={8}
      />
    </section>
  )
}

function ReportOverview({
  overview,
  sectionComment,
  onSectionCommentChange,
  forceDisplay,
}) {
  if (!overview) return null
  const metrics = (overview.highlights ?? []).slice(0, 6)

  return (
    <section className="client-report-section client-report-section--overview client-report-pdf-avoid">
      <h3 className="client-report-section-title">{overview.title}</h3>

      {metrics.length > 0 && (
        <div className="client-report-kpi-grid">
          {metrics.map((m) => (
            <div key={m.label} className="client-report-kpi">
              <div className={`client-report-kpi-value ${toneClass(m)}`.trim()}>{m.value}</div>
              <div className="client-report-kpi-label">{m.label}</div>
              {m.hint && <div className="client-report-kpi-hint">{m.hint}</div>}
            </div>
          ))}
        </div>
      )}

      <ReportCharts charts={overview.charts} />

      <ReportSectionCommentary
        value={sectionComment}
        onChange={onSectionCommentChange}
        forceDisplay={forceDisplay}
      />
    </section>
  )
}

export default function ClientReport({ client, months }) {
  const docRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [pdfMode, setPdfMode] = useState(false)
  const report = useMemo(() => buildClientReport(client, months), [client, months])

  const [edits, setEdits] = useState(() => buildDefaultEdits(report))

  useEffect(() => {
    setEdits(buildDefaultEdits(report))
  }, [report])

  const setSummaryText = useCallback((summary) => {
    setEdits((prev) => ({ ...prev, summary }))
  }, [])

  const setSectionComment = useCallback((sectionId, text) => {
    setEdits((prev) => ({
      ...prev,
      sections: { ...prev.sections, [sectionId]: text },
    }))
  }, [])

  const handleDownload = async () => {
    if (!docRef.current || downloading) return
    setDownloading(true)
    setPdfMode(true)
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    try {
      await downloadReportPdf(
        docRef.current,
        reportPdfFilename(report.clientName, report.period),
      )
    } catch {
      window.alert('PDF sa nepodarilo vygenerovať. Skúste to znova.')
    } finally {
      setPdfMode(false)
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
  const generatedAt = new Date().toLocaleDateString('sk-SK', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <article className="client-report-doc" ref={docRef}>
      <ReportDownloadButton
        onClick={handleDownload}
        downloading={downloading}
        className="client-report-download client-report-download--top client-report-no-pdf"
      />

      <header className="client-report-cover client-report-pdf-avoid">
        <p className="client-report-kicker">Marketingový report</p>
        <h2 className="client-report-title">{report.clientName}</h2>
        <p className="client-report-period">{report.period}</p>
        <p className="client-report-meta">
          {isSingleMonth ? 'Mesačný prehľad' : skZaObdobieMesiace(months.length)}
          {' · '}
          {generatedAt}
        </p>
      </header>

      <div className="client-report-body">
        {report.sections.map((section) => (
          <ReportSection
            key={section.id ?? section.title}
            {...section}
            sectionComment={edits.sections[section.id] ?? ''}
            onSectionCommentChange={(text) => setSectionComment(section.id, text)}
            forceDisplay={pdfMode}
          />
        ))}

        <ReportOverview
          overview={report.overview}
          sectionComment={edits.sections.overview ?? ''}
          onSectionCommentChange={(text) => setSectionComment('overview', text)}
          forceDisplay={pdfMode}
        />

        <ReportSummary
          title={report.summary?.title}
          summaryText={edits.summary}
          onSummaryChange={setSummaryText}
          forceDisplay={pdfMode}
        />

        <div className="client-report-download-bar client-report-no-pdf">
          <ReportDownloadButton
            onClick={handleDownload}
            downloading={downloading}
            className="client-report-download client-report-download--bottom"
          />
        </div>
      </div>

      <footer className="client-report-footer client-report-pdf-avoid">
        <p>
          {report.clientName} · {generatedAt} · Meta Ads, Google Ads, Google Analytics, Mailchimp, WooCommerce
        </p>
      </footer>
    </article>
  )
}
