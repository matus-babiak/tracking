import { useState } from 'react'
import clients from '../data'
import ClientGuideContent from '../components/ClientGuideContent'

export default function GuidesOverview() {
  const [clientId, setClientId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === clientId)

  return (
    <div className="guides-overview">
      <p className="guides-intro">
        Návody a prehľad metrík podľa klienta — každý klient má vlastný import; UI zobrazuje len to, čo je v dátach.
      </p>

      <div className="period-chips guides-client-tabs" role="tablist" aria-label="Klient">
        {clients.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={clientId === c.id}
            className={`period-chip${clientId === c.id ? ' active' : ''}`}
            onClick={() => setClientId(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="guides-client-panel" role="tabpanel">
        {client ? (
          <ClientGuideContent client={client} />
        ) : (
          <div className="guides-empty">Vyber klienta.</div>
        )}
      </div>
    </div>
  )
}
