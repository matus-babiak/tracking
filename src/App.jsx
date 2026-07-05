import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clients from './data'
import { clientBySlug } from './lib/routes'
import { monthKey, resolvePeriod, resolveCompare, rangeLabel, COMPARE_MODES, clientTabs } from './lib/helpers'
import { resolveClientUiState, saveClientUiState } from './lib/uiState'
import { isAppUnlocked, isClientUnlocked, lockApp, lockClient, getAuthRole, getAccessUserName, clientsForRole, isGuestAllowedClient } from './lib/auth'
import { PeriodPicker, ClientDropdown } from './components/ui'
import AuthGate from './components/AuthGate'
import NotFound from './pages/NotFound'
import Overview from './pages/Overview'
import OverviewLeadgen from './pages/OverviewLeadgen'
import MetaAds from './pages/MetaAds'
import MetaAdsLeadgen from './pages/MetaAdsLeadgen'
import GoogleAds from './pages/GoogleAds'
import GoogleAdsLeadgen from './pages/GoogleAdsLeadgen'
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

const TAB_SUBTITLES_LEADGEN = {
  overview: 'Meta Ads — investícia, dosah a leady',
  meta: 'Dosah, kliknutia, leady a návštevy cieľovej stránky',
  google: 'Search a Performance Max — kliknutia a konverzie',
}

const TAB_SUBTITLES_DUAL = {
  overview: 'Meta + Google Ads — investícia, návštevy a konverzie',
  meta: 'Kliknutia, návštevy cieľovej stránky a engagement',
  google: 'Kliknutia, konverzie — telefón, formulár',
}

const TAB_SUBTITLES_ESHOP = {
  overview: 'PPC reklamy a výsledky e-shopu',
  meta: 'Investícia, nákupy, ROAS a pridania do košíka',
  google: 'Investícia, nákupy, ROAS a cena za nákup',
  ga: 'Návštevnosť webu a predaje e-shopu (GA4)',
}

function resolvePage(client, tab) {
  const leadgen = client.metaProfile === 'leadgen'
  if (tab === 'overview') return leadgen ? OverviewLeadgen : Overview
  if (tab === 'meta') return leadgen ? MetaAdsLeadgen : MetaAds
  if (tab === 'google') return leadgen ? GoogleAdsLeadgen : GoogleAds
  return { overview: Overview, meta: MetaAds, google: GoogleAds, ga: Analytics, email: Email }[tab]
}

function defaultClientSlug() {
  if (isAppUnlocked() && getAuthRole() === 'guest') return 'chillix'
  return null
}

function AuthBadge({ userName }) {
  if (!userName) return null
  return (
    <div className="auth-badge">
      <span className="auth-badge-dot" aria-hidden />
      <span className="auth-badge-text">
        Prihlásený <strong>{userName}</strong>
      </span>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const { clientSlug } = useParams()
  const urlClient = clientSlug ? clientBySlug(clientSlug) : null

  const [clientId, setClientId] = useState(urlClient?.id ?? defaultClientSlug() ?? '')
  const [tab, setTab] = useState('overview')
  const [compareMode, setCompareMode] = useState('none')
  const [menuOpen, setMenuOpen] = useState(false)
  const [appUnlocked, setAppUnlocked] = useState(() => isAppUnlocked())
  const [clientUnlockTick, setClientUnlockTick] = useState(0)
  const [periodFrom, setPeriodFrom] = useState(0)
  const [periodTo, setPeriodTo] = useState(0)
  const skipSaveRef = useRef(false)

  const lockedToClient = Boolean(clientSlug && !isAppUnlocked())

  const authRole = getAuthRole()
  const availableClients = useMemo(
    () => clientsForRole(clients, authRole),
    [authRole, clientUnlockTick],
  )

  const isAdminHub = !clientSlug && appUnlocked && authRole === 'admin'

  const selectedClientId = urlClient?.id ?? clientId
  const client = selectedClientId ? (clients.find((c) => c.id === selectedClientId) ?? null) : null
  const accessUserName = getAccessUserName({ direct: lockedToClient, clientName: client?.name })
  useEffect(() => {
    if (!clientSlug && appUnlocked && authRole === 'guest') {
      navigate('/chillix', { replace: true })
    }
  }, [clientSlug, appUnlocked, authRole, navigate])

  // Sync stavu pri zmene URL (späť/vpred, prepínač klientov) — obnoví uložený filter alebo default
  useEffect(() => {
    if (!urlClient) {
      if (authRole === 'admin') setClientId('')
      return
    }
    setClientId(urlClient.id)
    skipSaveRef.current = true
    const ui = resolveClientUiState(urlClient)
    setPeriodFrom(ui.periodFrom)
    setPeriodTo(ui.periodTo)
    setCompareMode(ui.compareMode)
    setTab(ui.tab)
  }, [clientSlug])

  // Uloženie filtra pri zmene (prežije refresh, reset až pri novom prihlásení)
  useEffect(() => {
    if (!client?.id || !periodFrom || !periodTo) return
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }
    saveClientUiState(client.id, { periodFrom, periodTo, compareMode, tab })
  }, [client?.id, periodFrom, periodTo, compareMode, tab])

  // Guest nemá prístup k ostatným klientom (napr. /muse)
  useEffect(() => {
    if (!urlClient || lockedToClient || authRole !== 'guest') return
    if (!isGuestAllowedClient(urlClient.id)) {
      navigate('/chillix', { replace: true })
    }
  }, [urlClient, lockedToClient, authRole, navigate])

  const months = useMemo(() => {
    if (!client?.months.length) return []
    const from = periodFrom || monthKey(client.months[0])
    const to = periodTo || monthKey(client.months[client.months.length - 1])
    return resolvePeriod(client, 'custom', from, to)
  }, [client, periodFrom, periodTo])
  const compare = useMemo(
    () => (client ? resolveCompare(client, months, compareMode) : null),
    [client, months, compareMode],
  )

  const changeClient = (id) => {
    navigate(id ? `/${id}` : '/')
  }

  const visibleTabs = useMemo(() => {
    if (!client) return []
    const ids = clientTabs(client)
    return TABS.filter((t) => ids.includes(t.id))
  }, [client])

  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === tab)) setTab('overview')
  }, [visibleTabs, tab])

  const Page = client ? resolvePage(client, tab) : null
  const compareLabel = COMPARE_MODES.find((c) => c.id === compareMode)?.label
  const activeTab = visibleTabs.find((t) => t.id === tab) || visibleTabs[0]
  const tabSubtitle = client
    ? ((client.leadgenProfile === 'dual'
        ? TAB_SUBTITLES_DUAL
        : client.adsProfile === 'eshop'
          ? TAB_SUBTITLES_ESHOP
          : client.metaProfile === 'leadgen'
            ? TAB_SUBTITLES_LEADGEN
            : TAB_SUBTITLES)[tab] || TAB_SUBTITLES[tab])
    : ''

  const selectTab = (id) => {
    setTab(id)
    setMenuOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const clientReady = useMemo(
    () => isAdminHub || (client && isClientUnlocked(client.id, { direct: lockedToClient })),
    [client, clientId, clientUnlockTick, lockedToClient, isAdminHub],
  )

  const handleLogout = () => {
    if (lockedToClient) {
      lockClient(selectedClientId)
      setClientUnlockTick((v) => v + 1)
    } else {
      lockApp()
      setAppUnlocked(false)
      navigate('/')
    }
  }

  if (clientSlug && !urlClient) return <NotFound />

  if (!clientSlug && !appUnlocked) {
    return (
      <AuthGate
        onUnlock={(role) => {
          setAppUnlocked(true)
          if (role === 'guest') navigate('/chillix', { replace: true })
        }}
      />
    )
  }

  if (!clientSlug && !isAdminHub) return null

  if (!clientReady && client) {
    return (
      <AuthGate
        mode="client"
        client={client}
        onUnlock={(role) => {
          if (role === 'admin') setAppUnlocked(true)
          setClientUnlockTick((v) => v + 1)
        }}
      />
    )
  }

  return (
    <div className="app">
      <header className="mobile-header">
        <div className="logo"><span className="logo-dot" />Analytika</div>
        <div className="mobile-header-right">
          <span className="mobile-current-tab">{isAdminHub ? 'Výber klienta' : activeTab?.label}</span>
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)} />
          <nav className="mobile-menu">
            <AuthBadge userName={accessUserName} />
            <div className="nav-label">Klient</div>
            {!lockedToClient ? (
              <ClientDropdown
                value={selectedClientId}
                clients={availableClients}
                placeholder={authRole === 'admin' ? 'Vybrať klienta' : undefined}
                onChange={(id) => { changeClient(id); setMenuOpen(false) }}
              />
            ) : (
              <div className="client-locked-name">{client?.name}</div>
            )}
            {!isAdminHub && (
              <>
                <div className="nav-label">Nástroje</div>
                {visibleTabs.map((t) => (
                  <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => selectTab(t.id)}>
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </>
            )}
          </nav>
        </>
      )}

      <aside className="sidebar">
        <div className="logo"><span className="logo-dot" />Analytika</div>

        <AuthBadge userName={accessUserName} />

        <div className="nav-label">Klient</div>
        {!lockedToClient ? (
          <ClientDropdown
            value={selectedClientId}
            clients={availableClients}
            placeholder={authRole === 'admin' ? 'Vybrať klienta' : undefined}
            onChange={changeClient}
          />
        ) : (
          <div className="client-locked-name">{client?.name}</div>
        )}

        {!isAdminHub && (
          <>
            <div className="nav-label">Nástroje</div>
            {visibleTabs.map((t) => (
              <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => selectTab(t.id)}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </>
        )}

        <div className="sidebar-footer">
          Offline analytika z mesačných reportov.<br />
          {isAdminHub ? 'Vyberte klienta v menu.' : <>{client?.name} · {rangeLabel(client?.months ?? [])}</>}
          <button type="button" className="auth-lock-btn" onClick={handleLogout}>
            Odhlásiť
          </button>
        </div>
      </aside>

      <main className="main">
        {isAdminHub ? (
          <div className="hub-welcome">
            <div className="page-title">Marketingová analytika</div>
            <p className="hub-subtitle">Vyberte klienta v ľavom menu a zobrazia sa reporty.</p>
          </div>
        ) : client ? (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">{activeTab?.label}</div>
                <div className="page-subtitle">{client?.name} · {tabSubtitle}</div>
                <div className="period-info">
                  <strong>{rangeLabel(months)}</strong>
                  {compare && <> · porovnanie: {compareLabel?.toLowerCase()} (<strong>{compare.label}</strong>)</>}
                </div>
              </div>
              <PeriodPicker
                client={client}
                from={periodFrom} to={periodTo}
                onFrom={setPeriodFrom} onTo={setPeriodTo}
                compare={compareMode} onCompare={setCompareMode}
              />
            </div>

            {Page && <Page months={months} compare={compare} client={client} />}

            {client?.notes?.length > 0 && (
              <div className="notes">
                <strong>Poznámky k dátam</strong>
                <ul>
                  {client.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
