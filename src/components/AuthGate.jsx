import { useState } from 'react'
import { verifyAppPassword, verifyClientPassword, markAppUnlocked, markClientUnlocked } from '../lib/auth'

export default function AuthGate({ mode = 'app', client, onUnlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'client') {
        const appResult = await verifyAppPassword(password)
        if (appResult?.role === 'admin') {
          markAppUnlocked('admin')
          onUnlock(appResult.role)
          setLoading(false)
          return
        }
        const ok = await verifyClientPassword(client.id, password)
        if (!ok) {
          setError('Nesprávne heslo')
          setLoading(false)
          return
        }
        markClientUnlocked(client.id)
        onUnlock()
      } else {
        const result = await verifyAppPassword(password)
        if (!result) {
          setError('Nesprávne heslo')
          setLoading(false)
          return
        }
        markAppUnlocked(result.role)
        onUnlock(result.role)
      }
    } catch {
      setError('Chyba overenia — skontroluj konfiguráciu (VITE_AUTH_KEY, passwords.sealed.json)')
    }
    setLoading(false)
  }

  const isClient = mode === 'client'

  return (
    <div className="auth-gate">
      <div className="auth-card">
        <div className="logo auth-logo"><span className="logo-dot" />Analytika</div>
        <h1 className="auth-title">{isClient ? client.name : 'Marketingové reporty'}</h1>
        <p className="auth-subtitle">
          {isClient
            ? 'Report tohto klienta je chránený heslom. Zadajte prístupový kód.'
            : 'Zadajte prístupové heslo pre vstup do analytiky.'}
        </p>
        <form className="auth-form" onSubmit={submit}>
          <label className="auth-label" htmlFor="auth-password">Heslo</label>
          <input
            id="auth-password"
            className="auth-input"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-button" type="submit" disabled={loading || !password}>
            {loading ? 'Overujem…' : isClient ? 'Zobraziť report' : 'Vstúpiť'}
          </button>
        </form>
      </div>
    </div>
  )
}
