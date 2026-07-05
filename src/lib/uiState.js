import { monthKey, presetRange, DEFAULT_PRESET, COMPARE_MODES } from './helpers'

const STORAGE_KEY = 'tracking-ui:filters'

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

export function defaultClientUiState(client) {
  const range = presetRange(client, DEFAULT_PRESET)
  if (range) {
    return { periodFrom: range.from, periodTo: range.to, compareMode: 'none', tab: 'overview' }
  }
  if (client.months.length) {
    return {
      periodFrom: monthKey(client.months[0]),
      periodTo: monthKey(client.months[client.months.length - 1]),
      compareMode: 'none',
      tab: 'overview',
    }
  }
  return { periodFrom: 0, periodTo: 0, compareMode: 'none', tab: 'overview' }
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

  return {
    periodFrom: Math.min(from, to),
    periodTo: Math.max(from, to),
    compareMode,
    tab,
  }
}
