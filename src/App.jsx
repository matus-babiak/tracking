import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clients from './data'
import { clientBySlug, isImportOverviewSlug, isGuidesSlug, isSuperAdminRoute, IMPORT_OVERVIEW_SLUG, GUIDES_SLUG } from './lib/routes'
import { monthKey, resolvePeriod, resolveCompare, rangeLabel, COMPARE_MODES, clientTabs } from './lib/helpers'
import { resolveClientUiState, saveClientUiState, loadSidebarCollapsed, saveSidebarCollapsed } from './lib/uiState'
import { isAppUnlocked, isClientUnlocked, lockApp, lockClient, getAuthRole, getAccessUserName, clientsForRole, isGuestAllowedClient, isSuperAdmin } from './lib/auth'
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
import ImportOverview from './pages/ImportOverview'
import GuidesOverview from './pages/GuidesOverview'
import ClientReport from './pages/ClientReport'

const ICONS = {
  overview: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  meta: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  google: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ga: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  email: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>,
  import: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  guides: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  clientReport: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
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
      <span className="auth-badge-text sidebar-hide-collapsed">
        Prihlásený <strong>{userName}</strong>
      </span>
    </div>
  )
}

function SidebarEdgeToggle({ collapsed, onClick }) {
  return (
    <button
      type="button"
      className="sidebar-edge-toggle"
      onClick={onClick}
      aria-expanded={!collapsed}
      aria-label={collapsed ? 'Rozbaliť bočný panel' : 'Zbaliť bočný panel'}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {collapsed ? (
          <polyline points="9 18 15 12 9 6" />
        ) : (
          <polyline points="15 18 9 12 15 6" />
        )}
      </svg>
    </button>
  )
}

export default function App() {
  const navigate = useNavigate()
  const { clientSlug } = useParams()
  const isImportDashboard = isImportOverviewSlug(clientSlug)
  const isGuidesDashboard = isGuidesSlug(clientSlug)
  const isSuperAdminPage = isSuperAdminRoute(clientSlug)
  const urlClient = clientSlug && !isSuperAdminPage ? clientBySlug(clientSlug) : null
  const showSuperAdminNav = isSuperAdmin()

  const [clientId, setClientId] = useState(urlClient?.id ?? defaultClientSlug() ?? '')
  const [tab, setTab] = useState('overview')
  const [compareMode, setCompareMode] = useState('none')
  const [menuOpen, setMenuOpen] = useState(false)
  const [appUnlocked, setAppUnlocked] = useState(() => isAppUnlocked())
  const [clientUnlockTick, setClientUnlockTick] = useState(0)
  const [periodFrom, setPeriodFrom] = useState(0)
  const [periodTo, setPeriodTo] = useState(0)
  const [reportPeriodFrom, setReportPeriodFrom] = useState(0)
  const [reportPeriodTo, setReportPeriodTo] = useState(0)
  const skipSaveRef = useRef(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => loadSidebarCollapsed())

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
    if (isSuperAdminPage && authRole !== 'admin') {
      navigate('/chillix', { replace: true })
    }
  }, [isSuperAdminPage, authRole, navigate])

  useEffect(() => {
    if (!clientSlug && appUnlocked && authRole === 'guest') {
      navigate('/chillix', { replace: true })
    }
  }, [clientSlug, appUnlocked, authRole, navigate])

  // Sync stavu pri zmene URL (späť/vpred, prepínač klientov) — obnoví uložený filter alebo default
  useEffect(() => {
    if (isSuperAdminRoute(clientSlug)) return
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
    setReportPeriodFrom(ui.reportPeriodFrom)
    setReportPeriodTo(ui.reportPeriodTo)
  }, [clientSlug])

  // Uloženie filtra pri zmene (prežije refresh, reset až pri novom prihlásení)
  useEffect(() => {
    if (!client?.id || !periodFrom || !periodTo) return
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }
    saveClientUiState(client.id, {
      periodFrom,
      periodTo,
      compareMode,
      tab,
      reportPeriodFrom,
      reportPeriodTo,
    })
  }, [client?.id, periodFrom, periodTo, compareMode, tab, reportPeriodFrom, reportPeriodTo])

  // Presmerovanie zrušeného klienta JS
  useEffect(() => {
    if (clientSlug === 'js') navigate('/', { replace: true })
  }, [clientSlug, navigate])

  // Guest nemá prístup k ostatným klientom (napr. /muse)
  useEffect(() => {
    if (!urlClient || lockedToClient || authRole !== 'guest') return
    if (!isGuestAllowedClient(urlClient.id)) {
      navigate('/chillix', { replace: true })
    }
  }, [urlClient, lockedToClient, authRole, navigate])

  const reportMonths = useMemo(() => {
    if (!client?.months.length) return []
    const from = reportPeriodFrom || monthKey(client.months[0])
    const to = reportPeriodTo || monthKey(client.months[client.months.length - 1])
    return resolvePeriod(client, 'custom', from, to)
  }, [client, reportPeriodFrom, reportPeriodTo])

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

  const openImportDashboard = () => {
    navigate(`/${IMPORT_OVERVIEW_SLUG}`)
    setMenuOpen(false)
  }

  const openGuidesDashboard = () => {
    navigate(`/${GUIDES_SLUG}`)
    setMenuOpen(false)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed((v) => {
      const next = !v
      saveSidebarCollapsed(next)
      return next
    })
  }

  const visibleTabs = useMemo(() => {
    if (!client) return []
    const ids = clientTabs(client)
    return TABS.filter((t) => ids.includes(t.id))
  }, [client])

  useEffect(() => {
    if (tab === 'client-report') return
    if (!visibleTabs.some((t) => t.id === tab)) setTab('overview')
  }, [visibleTabs, tab])

  const Page = client ? resolvePage(client, tab) : null
  const compareLabel = COMPARE_MODES.find((c) => c.id === compareMode)?.label
  const activeTab = tab === 'client-report'
    ? { id: 'client-report', label: 'Prehľad pre klienta' }
    : visibleTabs.find((t) => t.id === tab) || visibleTabs[0]
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

  const selectClientReport = () => selectTab('client-report')

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const clientReady = useMemo(
    () => isAdminHub || isSuperAdminPage || (client && isClientUnlocked(client.id, { direct: lockedToClient })),
    [client, clientId, clientUnlockTick, lockedToClient, isAdminHub, isSuperAdminPage],
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

  if (clientSlug && !urlClient && !isSuperAdminPage) return <NotFound />

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

  if (isSuperAdminPage && !showSuperAdminNav) return null

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
    <div className={`app${menuOpen ? ' menu-open' : ''}${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <header className="mobile-header">
        <div className="logo"><span className="logo-dot" />Analytika</div>
        <div className="mobile-header-right">
          <span className="mobile-current-tab">
            {isGuidesDashboard ? 'Návody' : isImportDashboard ? 'Import dát' : isAdminHub ? 'Výber klienta' : activeTab?.label}
          </span>
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
            {showSuperAdminNav && (
              <>
                <div className="nav-label">Prehľady</div>
                <button type="button" className={`nav-item ${isImportDashboard ? 'active' : ''}`} onClick={openImportDashboard}>
                  {ICONS.import}
                  Import dát
                </button>
                <button type="button" className={`nav-item ${isGuidesDashboard ? 'active' : ''}`} onClick={openGuidesDashboard}>
                  {ICONS.guides}
                  Návody
                </button>
              </>
            )}
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
            {!isAdminHub && !isSuperAdminPage && (
              <>
                <div className="nav-label">Nástroje</div>
                {visibleTabs.map((t) => (
                  <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => selectTab(t.id)}>
                    {t.icon}
                    {t.label}
                  </button>
                ))}
                <div className="nav-label">Reporty</div>
                <button type="button" className={`nav-item ${tab === 'client-report' ? 'active' : ''}`} onClick={selectClientReport}>
                  {ICONS.clientReport}
                  Prehľad pre klienta
                </button>
              </>
            )}
          </nav>
        </>
      )}

      <aside className="sidebar">
        <SidebarEdgeToggle collapsed={sidebarCollapsed} onClick={toggleSidebar} />

        <div className="sidebar-inner">
        <div className="logo">
          <span className="logo-dot" />
          <span className="sidebar-hide-collapsed">Analytika</span>
        </div>

        <AuthBadge userName={accessUserName} />

        {showSuperAdminNav && (
          <>
            <div className="nav-label">Prehľady</div>
            <button type="button" className={`nav-item ${isImportDashboard ? 'active' : ''}`} onClick={openImportDashboard} title="Import dát">
              {ICONS.import}
              <span className="nav-item-label sidebar-hide-collapsed">Import dát</span>
            </button>
            <button type="button" className={`nav-item ${isGuidesDashboard ? 'active' : ''}`} onClick={openGuidesDashboard} title="Návody">
              {ICONS.guides}
              <span className="nav-item-label sidebar-hide-collapsed">Návody</span>
            </button>
          </>
        )}

        <div className="nav-label">Klient</div>
        {!lockedToClient ? (
          <ClientDropdown
            value={selectedClientId}
            clients={availableClients}
            placeholder={authRole === 'admin' ? 'Vybrať klienta' : undefined}
            onChange={changeClient}
            compact={sidebarCollapsed}
          />
        ) : (
          <div className="client-locked-name" title={client?.name}>
            <span className="sidebar-hide-collapsed">{client?.name}</span>
            <span className="client-locked-icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          </div>
        )}

        {!isAdminHub && !isSuperAdminPage && (
          <>
            <div className="nav-label">Nástroje</div>
            {visibleTabs.map((t) => (
              <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => selectTab(t.id)} title={t.label}>
                {t.icon}
                <span className="nav-item-label sidebar-hide-collapsed">{t.label}</span>
              </button>
            ))}
            <div className="nav-label">Reporty</div>
            <button type="button" className={`nav-item ${tab === 'client-report' ? 'active' : ''}`} onClick={selectClientReport} title="Prehľad pre klienta">
              {ICONS.clientReport}
              <span className="nav-item-label sidebar-hide-collapsed">Prehľad pre klienta</span>
            </button>
          </>
        )}

        <div className="sidebar-footer">
          <p className="sidebar-footer-text sidebar-hide-collapsed">
            <span className="sidebar-footer-meta">
              {isAdminHub ? 'Vyberte klienta v menu.' : isGuidesDashboard ? 'Matbab · návody' : isImportDashboard ? 'Matbab · import dát' : <>{client?.name} · {rangeLabel(client?.months ?? [])}</>}
            </span>
          </p>
          <button type="button" className="auth-lock-btn" onClick={handleLogout} title="Odhlásiť">
            <svg className="auth-lock-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="sidebar-hide-collapsed">Odhlásiť</span>
          </button>
        </div>
        </div>
      </aside>

      <main className="main">
        {isGuidesDashboard ? (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">Návody</div>
                <div className="page-subtitle">Export dát z platforiem a metriky podľa klienta</div>
              </div>
            </div>
            <GuidesOverview />
          </>
        ) : isImportDashboard ? (
          <>
            <div className="page-header">
              <div>
                <div className="page-title">Import dát</div>
                <div className="page-subtitle">Prehľad mesiacov so importovanými dátami podľa klienta</div>
              </div>
            </div>
            <ImportOverview />
          </>
        ) : isAdminHub ? (
          <div className="hub-welcome">
            <div className="page-title">Marketingová analytika</div>
            <p className="hub-subtitle">Vyberte klienta v ľavom menu a zobrazia sa reporty.</p>
          </div>
        ) : client ? (
          <>
          {tab === 'client-report' ? (
            <>
              <div className="page-header">
                <div>
                  <div className="page-title">Prehľad pre klienta</div>
                  <div className="page-subtitle">{client.name} · report pre klienta</div>
                  <div className="period-info">
                    <strong>{rangeLabel(reportMonths)}</strong>
                  </div>
                </div>
                <PeriodPicker
                  client={client}
                  from={reportPeriodFrom}
                  to={reportPeriodTo}
                  onFrom={setReportPeriodFrom}
                  onTo={setReportPeriodTo}
                  showCompare={false}
                />
              </div>
              <ClientReport client={client} months={reportMonths} />
            </>
          ) : (
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
          </>
          )}

          <p className="main-disclaimer">
            Analytika zobrazuje mesačné exporty z reklamných a analytických platforiem.
          </p>
          </>
        ) : null}
      </main>
    </div>
  )
}
