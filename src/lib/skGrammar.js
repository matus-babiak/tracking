/**
 * Slovenské skloňovanie po čísle (1 / 2–4 / 5+).
 * Používaj pri každom texte typu „5 nákupov“ → „2 nákupy“.
 */

export const SK = {
  reklama: { one: 'reklama', few: 'reklamy', many: 'reklám' },
  nakup: { one: 'nákup', few: 'nákupy', many: 'nákupov' },
  objednavka: { one: 'objednávka', few: 'objednávky', many: 'objednávok' },
  kliknutie: { one: 'kliknutie', few: 'kliknutia', many: 'kliknutí' },
  navsteva: { one: 'návšteva', few: 'návštevy', many: 'návštev' },
  navstevnik: { one: 'návštevník', few: 'návštevníci', many: 'návštevníkov' },
  clovek: { one: 'človek', few: 'ľudia', many: 'ľudí' },
  interakcia: { one: 'interakcia', few: 'interakcie', many: 'interakcií' },
  mesiac: { one: 'mesiac', few: 'mesiace', many: 'mesiacov' },
  kampan: { one: 'kampaň', few: 'kampane', many: 'kampaní' },
  konverzia: { one: 'konverzia', few: 'konverzie', many: 'konverzií' },
  relacia: { one: 'relácia', few: 'relácie', many: 'relácií' },
  email: { one: 'e-mail', few: 'e-maily', many: 'e-mailov' },
}

/** Vráti správny tvar podľa čísla (1 / 2–4 / 5+, vrátane 12–14). */
export function skForm(n, forms) {
  const abs = Math.abs(Math.trunc(n))
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (abs === 1) return forms.one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms.few
  return forms.many
}

/** „2 nákupy“, „5 nákupov“ — s formátovaným číslom sk-SK. */
export function skCount(n, forms) {
  if (n == null) return '–'
  const num = typeof n === 'number' ? n.toLocaleString('sk-SK') : n
  return `${num} ${skForm(n, forms)}`
}

/** Skratka: skCount(n, SK.nakup) */
export function fmtSkCount(n, formKey) {
  return skCount(n, SK[formKey])
}

/** „Top 2 reklamy“, „Top 5 reklám“. */
export function topReklamy(n) {
  return `Top ${skCount(n, SK.reklama)}`
}

/** „Súhrn za 3 mesiace“. */
export function skZaObdobieMesiace(n) {
  return `Súhrn za ${skCount(n, SK.mesiac)}`
}

/** „Súčet za 6 mesiacov“. */
export function skSucetZaMesiace(n) {
  return `Súčet za ${skCount(n, SK.mesiac)}`
}

export function skReachSummary(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Reklamu videl 1 človek.'
  const form = skForm(n, SK.clovek)
  if (form === SK.clovek.few) return `Reklamu videli ${skCount(n, SK.clovek)}.`
  return `Reklamu videlo ${skCount(n, SK.clovek)}.`
}

export function skNavstevyZReklam(n, source = 'reklám') {
  if (n == null || n <= 0) return null
  if (n === 1) return `Na web prišla 1 návšteva z ${source}.`
  const form = skForm(n, SK.navsteva)
  if (form === SK.navsteva.few) return `Na web prišli ${skCount(n, SK.navsteva)} z ${source}.`
  return `Na web prišlo ${skCount(n, SK.navsteva)} z ${source}.`
}

export function skInterakcieSummary(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Na príspevkoch bola 1 interakcia.'
  const form = skForm(n, SK.interakcia)
  if (form === SK.interakcia.few) return `Na príspevkoch boli ${skCount(n, SK.interakcia)}.`
  return `Na príspevkoch bolo ${skCount(n, SK.interakcia)}.`
}

export function skKonverzieSummary(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Google Ads zaznamenali 1 konverziu (hovor, formulár a pod.).'
  const form = skForm(n, SK.konverzia)
  const detail = form === SK.konverzia.one ? '(hovor, formulár a pod.)' : '(hovory, formuláre a pod.)'
  return `Google Ads zaznamenali ${skCount(n, SK.konverzia)} ${detail}`
}

export function skClicksSummary(n) {
  if (n == null || n <= 0) return null
  const num = n.toLocaleString('sk-SK')
  return `Používatelia klikli ${num}-krát.`
}

/** Podtitulok KPI: „2 nákupy · 481,33 €“ */
export function skNakupySub(n, suffix = '') {
  const base = fmtSkCount(n, 'nakup')
  return suffix ? `${base} · ${suffix}` : base
}
