/**
 * Voliteľné návody na export dát podľa client.id.
 * Zoznam klientov a metriky z importu sa berú automaticky z src/data/index.js + clientMetrics.js.
 * Tu dopĺňaj len postup exportu z platforiem.
 */
const guideExport = {
  'blumeria-consulting': (
    <>
      <p><strong>Meta Ads:</strong> export na úrovni reklám / kampaní — investícia, dosah, zobrazenia, kliknutia (outbound), post engagement. Klient nemá e-shop ani Google Ads.</p>
    </>
  ),
  chillix: (
    <>
      <p><strong>Meta Ads:</strong> awareness / traffic — dosah, zobrazenia, LPV, engagement, uloženia.</p>
      <p><strong>GA4 (od 6/2026):</strong> plný mesačný export — snapshot, udalosti, stránky, traffic a user acquisition.</p>
    </>
  ),
  sanaplant: (
    <>
      <p><strong>Meta + Google + GA4 + Mailchimp + e-shop:</strong> mesačné PDF reporty a CSV exporty. E-shop metriky (tržby, položky) podľa dostupnosti v reporte.</p>
    </>
  ),
  rentcarslovakia: (
    <>
      <p><strong>Meta Ads:</strong> LPV, kliknutia, engagement.</p>
      <p><strong>Google Ads:</strong> Search — konverzie podľa akcií (telefón, formulár). Každá akcia v <code>conversionActions</code>.</p>
    </>
  ),
}

export function getClientGuideExport(clientId) {
  return guideExport[clientId] ?? null
}

export default guideExport
