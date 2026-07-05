import { describeClientMetrics, metricLabel } from '../lib/clientMetrics'
import { getClientGuideExport } from '../data/guides'

export function GuidesPrinciples() {
  return (
    <section className="guides-section">
      <h2 className="guides-section-title">Princíp metrík</h2>
      <div className="guides-prose">
        <p>
          Každý klient má <strong>vlastný súbor dát</strong> (<code>src/data/&lt;id&gt;.js</code>).
          Metriky v analytike sa <strong>nekopírujú zo Sanaplantu</strong> — prispôsobujú sa tomu,
          čo je reálne v importe (CSV / export z platformy).
        </p>
        <ul>
          <li>V menu sa zobrazia len taby so zdrojmi, ktoré klient má v dátach (Meta, Google, GA4, e-mail…).</li>
          <li>Stĺpce a KPI na stránkach vychádzajú z polí v mesačných dátach — ak metrika v importe chýba, v UI sa neukazuje.</li>
          <li>Profil klienta (<em>eshop</em>, <em>leadgen</em>, <em>dual</em>) určuje typ dashboardu (nákupy vs. dosah vs. konverzie), nie konkrétny zoznam stĺpcov.</li>
          <li><strong>Report pre klienta</strong> nie je jedna šablóna — Blumeria nemá rovnaký report ako Sanaplant; zostavuje sa z dostupných dát za zvolené obdobie.</li>
          <li>Nový klient = nový individuálny dataset + voliteľný popis exportu v návodoch.</li>
        </ul>
      </div>
    </section>
  )
}

export default function ClientGuideContent({ client }) {
  const info = describeClientMetrics(client)
  const exportGuide = getClientGuideExport(client.id)

  return (
    <div className="guides-client-content">
      <GuidesPrinciples />

      <section className="guides-section">
        <h2 className="guides-section-title">{client.name}</h2>
        <dl className="guides-meta">
          <div>
            <dt>Profil dashboardu</dt>
            <dd>{info.profileLabel}</dd>
          </div>
          <div>
            <dt>Aktívne taby</dt>
            <dd>{info.tabs.join(' · ')}</dd>
          </div>
          <div>
            <dt>Importované zdroje</dt>
            <dd>
              {info.sources.length
                ? info.sources.map((s) => s.label).join(' · ')
                : 'Zatiaľ žiadne'}
            </dd>
          </div>
        </dl>
      </section>

      {info.sources.length > 0 && (
        <section className="guides-section">
          <h2 className="guides-section-title">Metriky podľa importu</h2>
          <p className="guides-section-lead">
            Nasledujúci zoznam sa odvodzuje z reálnych dát klienta — zobrazujú sa len metriky,
            ktoré sa aspoň v jednom mesiaci v importe vyskytli.
          </p>
          <div className="guides-metrics-grid">
            {info.sources.map((source) => {
              const keys = info.metricsBySource[source.key] ?? []
              return (
                <div key={source.key} className="guides-metrics-card">
                  <h3 className="guides-metrics-source">{source.label}</h3>
                  {keys.length ? (
                    <ul className="guides-metrics-list">
                      {keys.map((key) => (
                        <li key={key}>
                          <span className="guides-metric-label">{metricLabel(key)}</span>
                          <span className="guides-metric-key">{key}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="guides-metrics-empty">Bez škalarných metrík</p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {exportGuide && (
        <section className="guides-section">
          <h2 className="guides-section-title">Export dát</h2>
          <div className="guides-prose">{exportGuide}</div>
        </section>
      )}

      {client.notes?.length > 0 && (
        <section className="guides-section">
          <h2 className="guides-section-title">Poznámky k metrikám</h2>
          <ul className="guides-notes">
            {client.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
