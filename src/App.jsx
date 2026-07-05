import { useMemo, useState } from 'react'
import clients from './data'
import { monthKey, resolvePeriod, resolveCompare, rangeLabel, COMPARE_MODES } from './lib/helpers'
import { PeriodPicker } from './components/ui'
import Overview from './pages/Overview'
import MetaAds from './pages/MetaAds'
import GoogleAds from './pages/GoogleAds'
import Analytics from './pages/Analytics'
import Email from './pages/Email'

const ICONS = {
  overview: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  meta: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  google: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ga: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  email: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>,
}

const TABS = [
  { id: 'overview', label: 'Prehľad', icon: ICONS.overview },
  { id: 'meta', label: 'Meta Ads', icon: ICONS.meta },
  { id: 'google', label: 'Google Ads', icon: ICONS.google },
  { id: 'ga', label: 'Google Analytics', icon: ICONS.ga },
  { id: 'email', label: 'Email marketing', icon: ICONS.email },
]

const TAB_SUBTITLES = {
  overview: 'PPC reklamy a výsledky e-shopu',
  meta: 'Kampane, boosting a výsledky na platforme Meta',
  google: 'Search, Display a Performance Max kampane',
  ga: 'Návštevnosť webu a predaje e-shopu (GA4)',
  email: 'Výsledky e-mailových kampaní (Mailchimp)',
}

export default function App() {
  const [clientId, setClientId] = useState(clients[0].id)
  const [tab, setTab] = useState('overview')
  const [preset, setPreset] = useState('all')
  const [compareMode, setCompareMode] = useState('none')

  const client = clients.find((c) => c.id === clientId)
  const firstKey = monthKey(client.months[0])
  const lastKey = monthKey(client.months[client.months.length - 1])
  const [customFrom, setCustomFrom] = useState(firstKey)
  const [customTo, setCustomTo] = useState(lastKey)

  const months = useMemo(
    () => resolvePeriod(client, preset, customFrom, customTo),
    [client, preset, customFrom, customTo],
  )
  const compare = useMemo(
    () => resolveCompare(client, months, compareMode),
    [client, months, compareMode],
  )

  const changeClient = (id) => {
    setClientId(id)
    const c = clients.find((x) => x.id === id)
    setPreset('all')
    setCompareMode('none')
    setCustomFrom(monthKey(c.months[0]))
    setCustomTo(monthKey(c.months[c.months.length - 1]))
  }

  const Page = { overview: Overview, meta: MetaAds, google: GoogleAds, ga: Analytics, email: Email }[tab]
  const compareLabel = COMPARE_MODES.find((c) => c.id === compareMode)?.label

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo"><span className="logo-dot" />Analytika</div>

        <div className="nav-label">Klient</div>
        <select className="client-select" value={clientId} onChange={(e) => changeClient(e.target.value)}>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div className="nav-label">Nástroje</div>
        {TABS.map((t) => (
          <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon}
            {t.label}
          </button>
        ))}

        <div className="sidebar-footer">
          Offline analytika z mesačných reportov.<br />
          {client.name} · {rangeLabel(client.months)}
        </div>
      </aside>

      <main className="main">
        <div className="page-header">
          <div>
            <div className="page-title">{TABS.find((t) => t.id === tab).label}</div>
            <div className="page-subtitle">{client.name} · {TAB_SUBTITLES[tab]}</div>
            <div className="period-info">
              <strong>{rangeLabel(months)}</strong>
              {compare && <> · porovnanie: {compareLabel?.toLowerCase()} (<strong>{compare.label}</strong>)</>}
            </div>
          </div>
          <PeriodPicker
            client={client}
            preset={preset} onPreset={setPreset}
            customFrom={customFrom} customTo={customTo}
            onCustomFrom={setCustomFrom} onCustomTo={setCustomTo}
            compare={compareMode} onCompare={setCompareMode}
          />
        </div>

        <Page months={months} compare={compare} client={client} />

        {client.notes?.length > 0 && (
          <div className="notes">
            <strong>Poznámky k dátam</strong>
            <ul>
              {client.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
