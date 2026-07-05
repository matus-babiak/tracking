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
      <p><strong>Meta Ads:</strong> export na úrovni reklám — investícia, dosah, zobrazenia, kliknutia, nákupy, ROAS, pridané do košíka, LPV, engagement.</p>
      <p><strong>Google Ads:</strong> export kampaní — investícia, zobrazenia, kliknutia, konverzie (nákup, košík, checkout), hodnota konverzií, ROAS.</p>
      <p><strong>GA4 (máj + jún 2026):</strong> CSV exporty z Google Analytics — importované za tieto mesiace:</p>
      <ul>
        <li><em>Traffic acquisition</em> — Session primary channel group (Default channel group)</li>
        <li><em>User acquisition</em> — First user primary channel group (Default channel group)</li>
        <li><em>Landing page</em> — Landing page (top 50 podľa relácií)</li>
        <li><em>E-commerce purchases</em> — Item name (top 50 podľa tržieb)</li>
        <li><em>Reports snapshot</em> — voliteľný súhrn (máj 2026)</li>
      </ul>
      <p>Ostatné mesiace: platená vs. organická návštevnosť z PDF reportu.</p>
      <p><strong>Mailchimp:</strong> mesačný report — odoslané, open rate, click rate, tržby z e-mailov.</p>
      <p><strong>E-shop (WooCommerce):</strong> manuálne skopírované dáta z administrácie — tržby, objednávky, kategórie, produkty (sanaplant.sk + novy).</p>
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
