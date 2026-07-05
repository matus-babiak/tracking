import { monthKey, presetRange, DEFAULT_PRESET, COMPARE_MODES } from './helpers'

const STORAGE_KEY = 'tracking-ui:filters'
const SIDEBAR_KEY = 'tracking-ui:sidebar-collapsed'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function clearUiState() {
  localStorage.removeItem(STORAGE_KEY)
}

export function loadClientUiState(clientId) {
  return readAll()[clientId] ?? null
}

export function saveClientUiState(clientId, state) {
  const data = readAll()
  data[clientId] = state
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function defaultReportPeriod(client) {
  const range = presetRange(client, DEFAULT_PRESET)
  if (range) return { from: range.from, to: range.to }
  if (client.months.length) {
    const key = monthKey(client.months[client.months.length - 1])
    return { from: key, to: key }
  }
  return { from: 0, to: 0 }
}

export function defaultClientUiState(client) {
  const range = presetRange(client, DEFAULT_PRESET)
  const reportPeriod = defaultReportPeriod(client)
  if (range) {
    return {
      periodFrom: range.from,
      periodTo: range.to,
      compareMode: 'none',
      tab: 'overview',
      reportPeriodFrom: reportPeriod.from,
      reportPeriodTo: reportPeriod.to,
    }
  }
  if (client.months.length) {
    return {
      periodFrom: monthKey(client.months[0]),
      periodTo: monthKey(client.months[client.months.length - 1]),
      compareMode: 'none',
      tab: 'overview',
      reportPeriodFrom: reportPeriod.from,
      reportPeriodTo: reportPeriod.to,
    }
  }
  return {
    periodFrom: 0,
    periodTo: 0,
    compareMode: 'none',
    tab: 'overview',
    reportPeriodFrom: 0,
    reportPeriodTo: 0,
  }
}

export function resolveClientUiState(client) {
  const saved = loadClientUiState(client.id)
  const defaults = defaultClientUiState(client)
  if (!saved) return defaults

  const keys = new Set(client.months.map(monthKey))
  const from = keys.has(saved.periodFrom) ? saved.periodFrom : defaults.periodFrom
  const to = keys.has(saved.periodTo) ? saved.periodTo : defaults.periodTo
  const compareMode = COMPARE_MODES.some((c) => c.id === saved.compareMode) ? saved.compareMode : 'none'
  const tab = typeof saved.tab === 'string' ? saved.tab : 'overview'

  let reportFrom = defaults.reportPeriodFrom
  let reportTo = defaults.reportPeriodTo
  if (keys.has(saved.reportPeriodFrom)) reportFrom = saved.reportPeriodFrom
  if (keys.has(saved.reportPeriodTo)) reportTo = saved.reportPeriodTo
  if (!saved.reportPeriodFrom && keys.has(saved.reportMonthKey)) {
    reportFrom = saved.reportMonthKey
    reportTo = saved.reportMonthKey
  }
  if (!keys.has(reportFrom)) reportFrom = defaults.reportPeriodFrom
  if (!keys.has(reportTo)) reportTo = defaults.reportPeriodTo

  return {
    periodFrom: Math.min(from, to),
    periodTo: Math.max(from, to),
    compareMode,
    tab,
    reportPeriodFrom: Math.min(reportFrom, reportTo),
    reportPeriodTo: Math.max(reportFrom, reportTo),
  }
}

export function loadSidebarCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === '1'
  } catch {
    return false
  }
}

export function saveSidebarCollapsed(collapsed) {
  try {
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0')
  } catch { /* ignore */ }
}
