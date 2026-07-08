# Marketing Analytika — kompletná dokumentácia

Offline analytický nástroj (SPA) na sledovanie mesačných marketingových výsledkov klientov.
Dáta sa neťahajú z API — sú ručne/skriptami importované z mesačných exportov platforiem
(Meta Ads, Google Ads, GA4, Mailchimp, WooCommerce) do statických JS súborov v repozitári.
Dizajn je inšpirovaný nástrojom Umami: jednoduchý, čistý, bez zbytočností. Celé UI je po slovensky.

---

## 1. Technologický stack

| Vrstva | Technológia |
|---|---|
| UI framework | React 18 |
| Routing | react-router-dom 7 |
| Grafy | Recharts 2 |
| PDF export | html2pdf.js |
| Build | Vite 5 + @vitejs/plugin-react |
| Dáta | statické JS moduly v `src/data/` (žiadna DB, žiadny backend) |
| Auth | heslá hashované SHA-256, zapečatené AES-256-GCM v `public/passwords.sealed.json`, overované v prehliadači cez Web Crypto API |
| Hosting | Vercel (`vercel.json` rewrite) alebo Netlify-style (`public/_redirects`) — SPA fallback na `index.html` |

## 2. Spustenie a npm skripty

```bash
npm install        # prvýkrát
npm run dev        # dev server na http://localhost:5173
npm run build      # produkčný build do dist/
npm run preview    # náhľad buildu
```

Ďalšie skripty:

```bash
npm run import:meta-ads   # node scripts/import-meta-ads-csv.mjs <export.csv>
npm run seal-passwords    # node scripts/seal-passwords.mjs — zapečatí heslá
```

Nutná konfigurácia: `.env.local` s `VITE_AUTH_KEY=<dlhý náhodný secret>` — bez neho
auth vyhodí chybu „Nastav VITE_AUTH_KEY v .env.local“.

## 3. Štruktúra projektu

```
tracking/
├── index.html                  # vstupný HTML (Vite)
├── vite.config.js              # Vite + React plugin, port 5173
├── vercel.json                 # SPA rewrite pre Vercel
├── public/
│   ├── passwords.sealed.json   # zapečatené (AES-GCM) hashe hesiel
│   ├── _redirects              # SPA fallback (Netlify)
│   └── favicon.webp
├── src/
│   ├── main.jsx                # ReactDOM root + BrowserRouter ("/", "/:clientSlug", "*")
│   ├── App.jsx                 # hlavný layout: sidebar, mobilné menu, taby, auth toky
│   ├── styles.css              # všetky štýly (jeden súbor)
│   ├── components/             # AuthGate, ui (PeriodPicker, ClientDropdown…), ReportEditableText, ClientGuideContent
│   ├── pages/                  # stránky tabov + Import dát, Návody, ClientReport, NotFound
│   ├── lib/                    # doménová logika (helpers, auth, reporty, gramatika…)
│   └── data/                   # dátové súbory klientov + index.js (register)
├── scripts/                    # importné/patch skripty (Node .mjs, Python)
├── imports/                    # zdrojové CSV exporty (napr. sanaplant/2025/*.csv)
└── .cursor/rules/              # konvencie projektu pre AI editor (mdc pravidlá)
```

Citlivé súbory mimo gitu (`.gitignore`): `passwords.local.json` (plaintext heslá),
`.env.local` (VITE_AUTH_KEY), `Kontext.md`, `reportyHH/` (PDF reporty klientov).

## 4. Routing a navigácia

Router má jedinú dynamickú routu `/:clientSlug` (`src/main.jsx`); všetko rieši `App.jsx`:

| URL | Obsah |
|---|---|
| `/` | Admin hub (výber klienta) — vyžaduje globálne prihlásenie; guest je presmerovaný na svojho default klienta |
| `/<client-id>` | Dashboard klienta (napr. `/sanaplant`) — priamy link chránený heslom klienta |
| `/prehlady` | **Import dát** — matica importovaných mesiacov podľa klienta (len superadmin) |
| `/navody` | **Návody** — postup exportu dát z platforiem podľa klienta (len superadmin) |
| iné | `NotFound` |

Taby v rámci klienta (Prehľad, Meta Ads, Google Ads, Google Analytics, E-shop, Email
marketing, Prehľad pre klienta) **nie sú v URL** — držia sa v stave a perzistujú
v `localStorage` (pozri §8). Viditeľné taby sa odvodzujú automaticky z dát
(`clientTabs()` v `helpers.js`): tab sa zobrazí, len ak má klient aspoň jeden mesiac
s daným blokom (`meta`, `google`, `ga`, `eshop`, `email`).

Registrácia slugov: `src/lib/routes.js` (`clientBySlug`, `IMPORT_OVERVIEW_SLUG = 'prehlady'`,
`GUIDES_SLUG = 'navody'`).

## 5. Autentifikácia a roly

Implementácia: `src/lib/auth.js`, `src/components/AuthGate.jsx`, `scripts/seal-passwords.mjs`.

### Roly

| Rola | Prihlásenie | Prístup |
|---|---|---|
| **admin** (superadmin, „Matúš“) | globálne heslo (`_global`) | všetci klienti + `/prehlady` + `/navody` |
| **guest** („Chillix“) | guest heslo (`_guest`) | len klienti z `GUEST_CLIENT_IDS` (blumeria-consulting, mahax, kava-dante, sanaplant, chillix, hagard-hal); po prihlásení presmerovanie na `GUEST_DEFAULT_CLIENT_ID` (`sanaplant`) |
| **klient (priamy link)** | heslo konkrétneho klienta na `/<id>` | len daný klient; odomknutie sa drží v `sessionStorage` |

Na klientskej bráne (`AuthGate mode="client"`) funguje aj admin heslo — odomkne celú appku.

### Ako sú uložené heslá

1. Plaintext heslá píšeš do `passwords.local.json` (kľúče = client id, plus `_global`, `_guest`) — súbor je v `.gitignore`.
2. `npm run seal-passwords`: každé heslo sa zahashuje `SHA-256("tracking-client-auth-v1:" + heslo)`, výsledný JSON `{salt, hashes}` sa zašifruje **AES-256-GCM** kľúčom odvodeným zo `VITE_AUTH_KEY` (SHA-256) a zapíše do `public/passwords.sealed.json` (`{v, iv, tag, data}` v base64).
3. V prehliadači `auth.js` súbor stiahne, dešifruje cez Web Crypto (`crypto.subtle`), zadané heslo zahashuje rovnako a porovná v konštantnom čase (`timingSafeEqual`).

### Ukladanie session

- Globálne odomknutie: `localStorage` — `tracking-auth:app = '1'`, `tracking-auth:role = admin|guest` (prežije zavretie prehliadača; je tam aj migrácia zo starého `sessionStorage`).
- Priame odomknutie klienta: `sessionStorage` — `tracking-auth:clients = ["<id>", …]`.
- Odhlásenie (`lockApp` / `lockClient`) tieto kľúče maže a čistí aj uložené UI filtre.

## 6. Dátový model klienta

Každý klient = jeden súbor `src/data/<id>.js`, ktorý exportuje objekt:

```js
const klient = {
  id: 'sanaplant',              // slug v URL a kľúč hesla
  name: 'Sanaplant',            // zobrazované meno
  businessType: 'ecommerce',    // 'ecommerce' | 'services'
  currency: '€',
  // voliteľné konfiguračné vlajky (pozri §7):
  metaBreakdown: 'ads',         // Meta tabuľka na úrovni reklám (inak kampaní)
  metaShowCampaigns: true,      // zobrazi aj rollup podľa kampaní
  metaProfile: 'leadgen',       // leadgen variant Meta stránky (services klienti)
  leadgenProfile: 'dual',       // services klient s Meta + Google (konverzné akcie)
  adsProfile: 'eshop',          // e-commerce klient so zjednodušeným PPC profilom ('ads-eshop')
  eshopTab: 'woocommerce',
  googleConversionKeys: ['add_to_cart', 'begin_checkout', 'purchase'],
  notes: [ '…poznámky k dátam, anomáliám, výpadkom…' ],
  months: [ /* chronologicky zoradené mesiace */ ],
}
export default klient
```

### Objekt mesiaca

```js
{
  year: 2026, month: 6,
  meta:   { … } | null,   // Meta Ads
  google: { … } | null,   // Google Ads
  ga:     { … } | null,   // Google Analytics (GA4)
  email:  { … } | null,   // Mailchimp
  eshop:  { … } | null,   // WooCommerce
}
```

`null` = metrika/zdroj v danom mesiaci nebol dostupný — UI zobrazí „–“.
Interný kľúč mesiaca je `monthKey = year * 100 + month` (napr. `202606`).

### Blok `meta` (Meta Ads)

Súhrn mesiaca: `spend, impressions, reach, clicks, purchases, purchaseValue, roas,
addToCart, cpc, costPerPurchase, cpm, frequency, landingPageViews, engagements,
costPerEngagement, saves` (podľa profilu klienta).
Plus rozpad na riadky:

- `ads: [ … ]` — úroveň reklám (`name`, `campaign`, `spend`, `value`, `roas`, `purchases`, `costPerPurchase`, `aov`, `cpm`, `impressions`, `reach`, `frequency`, `clicks`, `cpc`, `ctr`, `addToCart`, `costPerAddToCart`, `landingPageViews`, `costPerLandingPageView`, `engagements`, `costPerEngagement`, `saves`, `shares`, `comments`), alebo
- `campaigns: [ … ]` — úroveň kampaní (leadgen klienti).

Agregácie za obdobie a dopočet odvodených metrík (ROAS, CPC, CTR, CPM, frekvencia,
ceny za akcie…) rieši `aggregateMetaBreakdown` / `computeMetaDerived` v `helpers.js` —
odvodené metriky sa po sčítaní prepočítavajú, nie priemerujú.

### Blok `google` (Google Ads)

E-commerce: `spend, impressions, clicks, cpc, ctr, interactions, interactionRate,
convRate, costPerConv, purchases, purchaseValue, conversions, roas,
conversionActions: {add_to_cart, begin_checkout, purchase}` +
`campaigns: [{name, type (Search/Display/Performance Max), status, purchases, value, conversionActions}]`.

Leadgen (dual): konverzie podľa akcií (`click_tel`, `form_start`, `form_submit`, …).

Pre e-shop klientov sa počítajú **len sledované konverzné akcie**
(add_to_cart, begin_checkout, purchase) — logika v `src/lib/googleConversions.js`;
Google „všetky konverzie“ sa ignorujú.

### Blok `ga` (Google Analytics)

Dve generácie dát (rozlišuje `src/lib/ga4Report.js`):

1. **Legacy (z PDF reportov)** — len `paid` / `organic`: `{sessions, users, engagementRate, avgDuration}`.
2. **GA4 CSV export** — navyše `snapshot` (activeUsers, newUsers, sessions, engagedSessions, engagementRate, totalRevenue, keyEvents), `trafficAcquisition[]` a `userAcquisition[]` (podľa channel group), `landingPages[]`, `ecommerceItems[]`, prípadne `events[]` a `pages[]`.

Mesiac s exportom spozná `isGa4ExportMonth()`; matica Import dát ich odlišuje ako
„GA4 z PDF (staré)“ vs „GA4 CSV export (nové)“.

### Blok `email` (Mailchimp)

`sent, openRate, clickRate, uniqueClicks, unsubRate, orders, revenue, campaignsCount`
+ voliteľne `campaigns: [{name, sent, openRate, clicks, clickRate, unsubRate, revenue}]`
(rozpad rieši `src/lib/emailCampaigns.js`).

### Blok `eshop` (WooCommerce)

`revenue, netRevenue, grossSales, orders, items, variants, refunds, coupons, taxes,
shipping`, `categories: [{name, items, netRevenue}]`, `products: [{name, sku, items,
netRevenue, orders, variants}]`, voliteľne `combinedShops: ['sanaplant.sk', 'novy']`.
Zlučovanie duplicitných kategórií/produktov medzi starým a novým e-shopom rieši
`src/lib/eshopMerge.js` (normalizácia názvov + aliasy).

## 7. Typy klientov a UI profily

`src/lib/clientType.js` + `src/lib/clientMetrics.js`:

- **businessType** — `'ecommerce'` (nákupy, ROAS, tržby, tab E-shop) vs `'services'`
  (leady, návštevy, engagement). Explicitne v dátach klienta; fallback cez
  `ECOMMERCE_CLIENT_IDS` (kava-dante, sanaplant, hagard-hal).
- **UI profil** (`getClientUiProfile`) určuje variant stránok, nie dáta:
  - `eshop` — plný e-commerce dashboard (Meta + Google nákupy, ROAS, tržby),
  - `ads-eshop` — e-commerce so zjednodušeným PPC (klient s `adsProfile: 'eshop'`),
  - `leadgen` — services klient len s Meta (dosah, engagement, LPV),
  - `dual` — services klient s Meta + Google (`leadgenProfile: 'dual'`; konverzie telefón/formulár).

Podľa profilu `App.jsx` vyberá stránku: `Overview` vs `OverviewLeadgen`,
`MetaAds` vs `MetaAdsLeadgen`, `GoogleAds` vs `GoogleAdsLeadgen`, a mení podtitulky tabov.

## 8. Výber obdobia, porovnávanie a perzistencia filtrov

`src/lib/helpers.js` + `src/lib/uiState.js` + `PeriodPicker` v `components/ui.jsx`:

- **Presety**: posledný mesiac (default), 3 mesiace, 6 mesiacov, tento rok, celé obdobie,
  vlastné obdobie (od–do); interne aj 12m a minulý rok. Rozsah sa dá posúvať o celé
  okno dopredu/dozadu (`shiftPeriodRange`).
- **Porovnanie** (`resolveCompare`): _bez porovnania_ / _predchádzajúce obdobie_
  (rovnako dlhé okno tesne pred) / _rovnaké obdobie vlani_ (YoY). Percentuálne zmeny
  pri KPI kartách: zelená = zlepšenie, červená = zhoršenie, investícia = neutrálna sivá.
- **Perzistencia**: filtre (obdobie, porovnanie, tab, obdobie klientskeho reportu) sa
  ukladajú per-klient do `localStorage` (`tracking-ui:filters`) — prežijú refresh,
  mažú sa pri prihlásení/odhlásení. Uložené hodnoty sa pri načítaní validujú proti
  existujúcim mesiacom klienta (`resolveClientUiState`). Zbalenie sidebaru:
  `tracking-ui:sidebar-collapsed`.

## 9. Stránky (src/pages/)

| Stránka | Popis |
|---|---|
| `Overview.jsx` | E-commerce prehľad: investícia do PPC (Meta + Google + boosting) vs tržby e-shopu, ROAS, PNO, podiel reklám na tržbách (`aggregate()` v helpers) |
| `OverviewLeadgen.jsx` | Prehľad pre services klientov: investícia, dosah, návštevy, leady/konverzie |
| `MetaAds.jsx` / `MetaAdsLeadgen.jsx` | KPI + tabuľky reklám/kampaní + mesačný detail; stĺpce v `lib/metaTableColumns.jsx` |
| `GoogleAds.jsx` / `GoogleAdsLeadgen.jsx` | KPI + kampane (Search/Display/PMax) / konverzné akcie |
| `Analytics.jsx` | GA legacy — platená vs organická návštevnosť |
| `AnalyticsGa4.jsx` | GA4 export — snapshot, kanály (traffic/user acquisition), vstupné stránky, e-commerce produkty, udalosti |
| `Eshop.jsx` | WooCommerce — tržby, objednávky, kategórie, produkty (so zlučovaním e-shopov) |
| `Email.jsx` | Mailchimp — open/click rate, objednávky, tržby, rozpad kampaní; stĺpce v `lib/emailTableColumns.jsx` |
| `ClientReport.jsx` | „Prehľad pre klienta“ — generovaný report (pozri §10) |
| `ImportOverview.jsx` | `/prehlady` — matica klient × mesiac s indikátormi importovaných zdrojov (M/G/A/E/Em) a kompletnosti |
| `GuidesOverview.jsx` | `/navody` — pre každého klienta: profil, taby, metriky auto-odvodené z importu (`describeClientMetrics`) + ručný návod na export z platforiem (`src/data/guides.jsx`) |
| `NotFound.jsx` | 404 |

## 10. Report pre klienta (Prehľad pre klienta)

Najkomplexnejšia časť — klientom prezentovateľný report za zvolené obdobie
(vlastný výber obdobia nezávislý od dashboardových filtrov):

- **`src/lib/clientReport.js`** (`buildClientReport`) — poskladá celý report: textové
  zhrnutie (odseky s tučnými kľúčovými metrikami), sekcie podľa dostupných zdrojov
  (Meta, Google, GA, E-shop, Email), KPI mriežky, top kampane/reklamy (limit 5),
  top kanály a produkty z GA4.
- **`src/lib/clientReportCharts.js`** — dátové série pre Recharts grafy jednotlivých sekcií.
- **`src/lib/skGrammar.js`** — slovenské skloňovanie číselných fráz (1 nákup / 2 nákupy /
  5 nákupov; „oslovili X ľudí“, „X návštev na web“…), aby generovaný text znel prirodzene.
- **`src/lib/reportText.js` + `reportEdits.js` + `components/ReportEditableText.jsx`** —
  texty reportu sú editovateľné priamo v UI (markdown `**bold**` ↔ `<strong>`);
  predvolené edity sa generujú z reportu.
- **`src/lib/metricTone.js`** — farebné tónovanie metrík: investícia = červená,
  tržby/zisk = zelená (rozpoznáva sa z labelu).
- **`src/lib/downloadReportPdf.js`** — export reportu do PDF cez html2pdf.js
  (názov súboru z mena klienta a obdobia).

## 11. Knižnica `src/lib/` — prehľad súborov

| Súbor | Zodpovednosť |
|---|---|
| `helpers.js` | formátovanie (fmtEur/fmtNum/fmtPct/fmtRoas — sk-SK locale), mesiace a obdobia (monthKey, presety, resolvePeriod/resolveCompare, pctChange), viditeľné taby, agregácie Meta a celkový `aggregate()` (ROAS, PNO) |
| `routes.js` | slugy a superadmin routy |
| `auth.js` | roly, overovanie hesiel, session (pozri §5) |
| `uiState.js` | perzistencia filtrov a sidebaru (pozri §8) |
| `clientType.js` | ecommerce vs services |
| `clientMetrics.js` | UI profily, labely metrík, auto-odvodenie importovaných metrík klienta (pre Návody) |
| `googleConversions.js` | sledované Google konverzné akcie pre e-shop |
| `ga4Report.js` | legacy vs GA4-export mesiace, agregácie snapshotu/kanálov/produktov |
| `eshopMerge.js` | zlučovanie kategórií a produktov WooCommerce (dva e-shopy, aliasy) |
| `emailCampaigns.js` | rozpad a rollup e-mailových kampaní |
| `metaTableColumns.jsx`, `emailTableColumns.jsx` | definície stĺpcov tabuliek |
| `tableTotals.js` | súčtový riadok tabuliek (čo sa sčítava vs prepočítava) |
| `importOverview.js` | zdroje importu, matica Import dát, kompletnosť mesiaca |
| `clientReport.js`, `clientReportCharts.js`, `reportText.js`, `reportEdits.js`, `metricTone.js`, `skGrammar.js`, `downloadReportPdf.js` | klientsky report (pozri §10) |

## 12. Importné skripty (`scripts/`)

Dáta sa do `src/data/*.js` dostávajú poloautomaticky:

- **`import-meta-ads-csv.mjs`** (`npm run import:meta-ads <csv>`) — Meta Ads export na
  úrovni reklám → blok `meta.ads` mesiaca (vlastný CSV parser, čísla s čiarkou aj bodkou).
- **`import-google-ads-csv.mjs`** — Google Ads Campaign report (e-shop Sanaplant);
  počíta len add_to_cart / begin_checkout / purchase.
- **`import-ga4-sanaplant-jun2026.mjs`** — GA4 CSV exporty (traffic/user acquisition,
  landing pages, e-commerce) → blok `ga`.
- **`patch-*.mjs`** (sanaplant/hagardhal/rentcar × mesiac) — jednorazové skripty, ktoré
  do dátového súboru klienta doplnili/opravili konkrétny mesiac (GA4, Meta, Google).
- **`migrate-hagardhal-meta-ads.mjs`**, **`restore-merge-eshop.mjs`** — jednorazové
  migrácie/opravy štruktúry dát.
- **`extract_hh.py`**, **`build_hagardhal.py`** — Python extrakcia dát Hagard Hal
  z PDF reportov a zostavenie dátového súboru.
- **`seal-passwords.mjs`** — pozri §5.

Zdrojové CSV sa archivujú v `imports/<klient>/<rok>/<rok>-<mesiac>.csv`.

## 13. Klienti v systéme (stav dát)

| id (URL) | Názov | Typ / profil | Dáta |
|---|---|---|---|
| `sanaplant` | Sanaplant | e-commerce / eshop | najbohatší klient: Meta (reklamy), Google (PMax + konverzné akcie), GA (legacy aj GA4 export 1–6/2026), Mailchimp (kampane), WooCommerce (2 e-shopy); 1/2025 – 7/2026 |
| `hagard-hal` | Hagard Hal | e-commerce / ads-eshop (`adsProfile: 'eshop'`) | Meta reklamy, GA patche 1–6/2026 |
| `chillix` | Chillix | services / leadgen | Meta (awareness/traffic), GA4 export od 6/2026 |
| `muse` | MUSE Movement Studio | services / leadgen | Meta kampane 6–7/2026 |
| `blumeria-consulting` | Blumeria Consulting | services / leadgen | Meta kampane od 7/2026 |
| `rentcarslovakia` | RentCarSlovakia | services / **dual** (Meta + Google) | Google konverzné akcie (telefón/formulár), Meta, GA4 od 6/2026 |
| `mahax` | Mahax | services | zatiaľ bez dát |
| `kava-dante` | Káva Dante | e-commerce | zatiaľ bez dát |
| `sevasbarber` | Sevas Barber | services | zatiaľ bez dát |

(Bývalý klient `js` bol zrušený — jeho URL sa presmeruje na `/`.)

## 14. Ako pridať nového klienta

Jediný register je `src/data/index.js` — **nikde inde sa klient neregistruje**
(pravidlo `.cursor/rules/new-client.mdc`):

1. Vytvor `src/data/<id>.js` — šablóna podľa profilu (e-commerce: `sanaplant.js`,
   leadgen: `muse.js`/`blumeria.js`, dual: `rentcarslovakia.js`).
2. V `src/data/index.js` pridaj import a položku do poľa `clients`.
3. Hotovo — klient sa automaticky objaví v sidebar dropdowne, na route `/<id>`,
   v Import dát (`/prehlady`), v Návodoch (`/navody`) aj v auth hube.
4. Voliteľne: heslo do `passwords.local.json` + `npm run seal-passwords`;
   postup exportu do `guideExport` v `src/data/guides.jsx`.

**Ďalší mesiac** = pridať objekt `{year, month, …}` na koniec poľa `months`
(chronologicky). Medziročné porovnanie potom funguje automaticky.

## 15. Konvencie (.cursor/rules)

Projekt má pravidlá pre AI editor v `.cursor/rules/`:

- `new-client.mdc` — jeden register klientov (viď §14),
- `client-metrics.mdc`, `table-metrics.mdc` — práca s metrikami a stĺpcami tabuliek,
- `format-money.mdc` — peniaze vždy cez `fmtEur` (sk-SK, 2 desatinné miesta),
- `sk-grammar.mdc` — počty vždy cez `skGrammar` helpery (správne skloňovanie),
- `client-report.mdc` — štruktúra klientskeho reportu.

## 16. Bezpečnostné poznámky

- V repozitári nie sú žiadne plaintext heslá — len AES-GCM zapečatené SHA-256 hashe;
  dešifrovací kľúč (`VITE_AUTH_KEY`) je build-time env premenná mimo gitu.
- Ide o **klientskú** ochranu (statická SPA bez backendu) — heslo bráni bežnému
  prístupu k reportom, dáta klientov sú však súčasťou JS bundlu. Nenahrádza to
  serverovú autentifikáciu; citlivé PDF a kontextové súbory sú preto v `.gitignore`.
- Porovnanie hashov je v konštantnom čase; heslá sa hashujú so soľou
  `tracking-client-auth-v1`.

## 17. Plán do budúcna (z README)

- Upload PDF reportu / CSV tabuľky a automatické parsovanie dát.
- Vytváranie klientov priamo v UI (localStorage / súbory).
- Porovnanie medzi klientmi.
