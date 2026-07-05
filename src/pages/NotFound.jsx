import clients from '../data'

export default function NotFound() {
  return (
    <div className="auth-gate">
      <div className="auth-card">
        <div className="logo auth-logo"><span className="logo-dot" />Analytika</div>
        <h1 className="auth-title">Stránka nenájdená</h1>
        <p className="auth-subtitle">
          Neplatná adresa klienta. Dostupné cesty:{' '}
          {clients.map((c, i) => (
            <span key={c.id}>
              {i > 0 && ', '}
              <a href={`/${c.id}`}>/{c.id}</a>
            </span>
          ))}
        </p>
        <a className="auth-button auth-button-link" href="/">Prejsť na hlavnú stránku</a>
      </div>
    </div>
  )
}
