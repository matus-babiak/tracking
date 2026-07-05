import sanaplant from './sanaplant'
import hagardhal from './hagardhal'
import chillix from './chillix'
import muse from './muse'
import blumeria from './blumeria'
import mahax from './mahax'
import kavadante from './kavadante'
import rentcarslovakia from './rentcarslovakia'
import sevasbarber from './sevasbarber'

/**
 * Jediný register klientov — nový klient = súbor src/data/<id>.js + import + riadok v poli clients.
 * Z tohto poľa sa automaticky ťahajú: sidebar, import (/prehlady), návody (/navody), reporty, auth hub.
 * Neregistruj klienta inde (guides.js, importOverview, …) — len sem.
 */
const clients = [
  sanaplant, hagardhal, chillix, muse,
  blumeria, mahax, kavadante, rentcarslovakia, sevasbarber,
]

export default clients

export function clientIds() {
  return clients.map((c) => c.id)
}

export function clientById(id) {
  return clients.find((c) => c.id === id) ?? null
}
