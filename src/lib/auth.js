import { clearUiState } from './uiState'

const SALT = 'tracking-client-auth-v1'
const GLOBAL_KEY = '_global'
const GUEST_KEY = '_guest'
const SESSION_KEY = 'tracking-auth:app'
const ROLE_KEY = 'tracking-auth:role'
const CLIENTS_KEY = 'tracking-auth:clients'

function readRole() {
  return localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY)
}

function readAppUnlocked() {
  if (localStorage.getItem(SESSION_KEY) === '1') return true
  // migrácia zo starého sessionStorage
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    localStorage.setItem(SESSION_KEY, '1')
    const role = sessionStorage.getItem(ROLE_KEY)
    if (role) localStorage.setItem(ROLE_KEY, role)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(ROLE_KEY)
    return true
  }
  return false
}

function writeAppSession(role) {
  localStorage.setItem(SESSION_KEY, '1')
  localStorage.setItem(ROLE_KEY, role)
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(ROLE_KEY)
  sessionStorage.removeItem(CLIENTS_KEY)
  clearUiState()
}

function clearAppSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(ROLE_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(ROLE_KEY)
  sessionStorage.removeItem(CLIENTS_KEY)
  clearUiState()
}

const APP_ROLES = {
  [GLOBAL_KEY]: 'admin',
  [GUEST_KEY]: 'guest',
}

/** Klienti viditeľní a dostupní pre prístup „chillix“ (guest). Admin vidí všetkých. */
export const GUEST_CLIENT_IDS = [
  'blumeria-consulting',
  'mahax',
  'kava-dante',
  'sanaplant',
  'chillix',
  'hagard-hal',
]

/** Po prihlásení guest heslom (chillix) otvorí sa tento klient. */
export const GUEST_DEFAULT_CLIENT_ID = 'sanaplant'

export function isGuestAllowedClient(clientId) {
  return GUEST_CLIENT_IDS.includes(clientId)
}

export function clientsForRole(allClients, role) {
  if (role === 'admin') return allClients
  if (role === 'guest') return allClients.filter((c) => isGuestAllowedClient(c.id))
  return allClients
}

let cache = null

function authKey() {
  const key = import.meta.env.VITE_AUTH_KEY
  if (!key || key === 'change-me-to-a-long-random-secret') {
    throw new Error('Nastav VITE_AUTH_KEY v .env.local')
  }
  return key
}

async function deriveAesKey(secret) {
  const enc = new TextEncoder()
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(secret))
  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['decrypt'])
}

async function loadHashes() {
  if (cache) return cache
  const res = await fetch('/passwords.sealed.json')
  if (!res.ok) throw new Error('Nepodarilo sa načítať passwords.sealed.json')
  const sealed = await res.json()

  const key = await deriveAesKey(authKey())
  const iv = Uint8Array.from(atob(sealed.iv), (c) => c.charCodeAt(0))
  const tag = Uint8Array.from(atob(sealed.tag), (c) => c.charCodeAt(0))
  const data = Uint8Array.from(atob(sealed.data), (c) => c.charCodeAt(0))
  const cipherWithTag = new Uint8Array(data.length + tag.length)
  cipherWithTag.set(data)
  cipherWithTag.set(tag, data.length)

  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherWithTag)
  const parsed = JSON.parse(new TextDecoder().decode(plain))
  cache = { salt: parsed.salt || SALT, hashes: parsed.hashes }
  return cache
}

async function hashPassword(password, salt) {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(`${salt}:${password}`))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export function getAuthRole() {
  return readRole()
}

/** Matbab (globálne admin heslo) — nie Chillix guest. */
export function isSuperAdmin() {
  return getAuthRole() === 'admin'
}

/** Meno prihláseného používateľa pre UI (sidebar). */
export function getAccessUserName({ direct = false, clientName = null } = {}) {
  if (direct && !readAppUnlocked()) return clientName
  const role = getAuthRole()
  if (role === 'admin') return 'Matúš'
  if (role === 'guest') return 'Chillix'
  if (direct) return clientName
  return null
}

export function isAppUnlocked() {
  return readAppUnlocked()
}

export function isClientUnlocked(clientId, { direct = false } = {}) {
  if (isAppUnlocked()) {
    const role = getAuthRole()
    if (role === 'admin') return true
    if (role === 'guest' && isGuestAllowedClient(clientId)) return true
  }
  if (!direct) return false
  try {
    const list = JSON.parse(sessionStorage.getItem(CLIENTS_KEY) || '[]')
    return list.includes(clientId)
  } catch {
    return false
  }
}

export function markAppUnlocked(role) {
  writeAppSession(role)
}

export function markClientUnlocked(clientId) {
  if (getAuthRole() === 'admin') return
  if (getAuthRole() === 'guest' && isGuestAllowedClient(clientId)) return
  clearUiState()
  const list = JSON.parse(sessionStorage.getItem(CLIENTS_KEY) || '[]')
  if (!list.includes(clientId)) {
    list.push(clientId)
    sessionStorage.setItem(CLIENTS_KEY, JSON.stringify(list))
  }
}

export function lockClient(clientId) {
  const list = JSON.parse(sessionStorage.getItem(CLIENTS_KEY) || '[]').filter((id) => id !== clientId)
  sessionStorage.setItem(CLIENTS_KEY, JSON.stringify(list))
}

export function lockApp() {
  clearAppSession()
}

export async function verifyAppPassword(password) {
  const { salt, hashes } = await loadHashes()
  const actual = await hashPassword(password, salt)
  for (const [key, role] of Object.entries(APP_ROLES)) {
    const expected = hashes[key]
    if (expected && timingSafeEqual(actual, expected)) return { role }
  }
  return null
}

export async function verifyClientPassword(clientId, password) {
  const { salt, hashes } = await loadHashes()
  const actual = await hashPassword(password, salt)
  const keys = clientId === 'chillix' ? [clientId, GUEST_KEY] : [clientId]
  for (const key of keys) {
    const expected = hashes[key]
    if (expected && timingSafeEqual(actual, expected)) return true
  }
  return false
}
