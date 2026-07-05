# Marketing Analytika (offline)

Offline analytický nástroj pre sledovanie výsledkov klientov z mesačných reportov.
Dizajn inšpirovaný nástrojom Umami — jednoduchý, čistý, bez zbytočností.

## Spustenie

```bash
npm install   # iba prvýkrát
npm run dev   # otvorí sa na http://localhost:5173
```

## Štruktúra

- **Prehľad** — PPC reklamy (Meta + Google + boosting) vs. tržby e-shopu, ROAS, PNO
- **Meta Ads** — prehľad, kampane, boosting, mesačný detail
- **Google Ads** — prehľad, kampane (Search / Display / PMax), mesačný detail
- **Google Analytics** — návštevnosť (platená / organická), miera interakcie, predaje e-shopu (GA4)
- **Email marketing** — Mailchimp: open/click rate, objednávky, tržby

## Výber obdobia a porovnávanie

Vpravo hore je GA4-style výber obdobia s presetmi: posledný mesiac / 3 mesiace /
6 mesiacov / 12 mesiacov / tento rok / minulý rok / celé obdobie / vlastné obdobie.

Vedľa neho je výber porovnania:
- **Predchádzajúce obdobie** — napr. pri 3 mesiacoch porovná s 3 mesiacmi tesne pred nimi
- **Rovnaké obdobie vlani** — medziročné porovnanie (YoY)

Percentuálne zmeny sa zobrazia pri KPI kartách (zelená = zlepšenie, červená = zhoršenie;
pri investícii je zmena neutrálna — sivá).

## Ako pridať nového klienta

1. Skopíruj `src/data/sanaplant.js` ako `src/data/<klient>.js`
2. Uprav `id`, `name` a vyplň pole `months` podľa reportov klienta — každý mesiac má
   `year` a `month`, mesiace drž chronologicky zoradené
   (metrika, ktorá v reporte nie je, sa nastaví na `null` — appka ju zobrazí ako „–“)
3. Zaregistruj klienta v `src/data/index.js` (jediný register — stačí len tu):

```js
import novyKlient from './novyKlient'
const clients = [sanaplant, novyKlient]
```

Klient sa automaticky objaví vo výbere v menu, v **Import dát** (`/prehlady`), v **Návody** (`/navody`) a na route `/<id>`. Obsah návodu doplníš neskôr do `guideContent` v `src/data/guides.js` — registrácia klienta sa tam neopakuje.

## Ako pridať ďalšie mesiace

Do poľa `months` v dátovom súbore klienta pridaj ďalšie objekty mesiacov
(s `year` a `month`) na koniec poľa. Roky sú súčasťou jednej časovej osi,
takže medziročné porovnanie funguje automaticky.

## Plán do budúcna

- Upload PDF reportu / CSV tabuľky a automatické parsovanie dát
- Vytváranie klientov priamo v UI (ukladanie do localStorage alebo súborov)
- Porovnanie medzi klientmi
