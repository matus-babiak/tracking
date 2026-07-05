/**
 * Slovenské skloňovanie po čísle (spisovná slovenčina).
 * Nominatív: „5 nákupov“, „2 nákupy“, „1 nákup“.
 * Genitív: „z 202 objednávok“, „z 1 objednávky“.
 * Inštrumentál: „6 731 reláciami“.
 * Akuzatív: „zaznamenal 18 744 relácií“.
 */

const CASES = ['nom', 'gen', 'acc', 'ins']

function lemma(key) {
  const forms = SK[key]
  if (!forms) throw new Error(`Unknown SK lemma: ${key}`)
  return forms
}

/** Vráti správny tvar podľa čísla v nominatíve / akuzatíve (spisovná slovenčina). */
export function skForm(n, forms) {
  const abs = Math.abs(Number(n))
  if (!Number.isFinite(abs)) return forms.many

  if (!Number.isInteger(abs)) return forms.many

  if (abs === 1) return forms.one
  if (abs >= 2 && abs <= 4) return forms.few

  const mod10 = abs % 10
  const mod100 = abs % 100

  if (mod10 === 1) return forms.many
  if (mod100 >= 12 && mod100 <= 14) return forms.many
  if (mod100 >= 22 && mod100 <= 24) return forms.few
  if (mod10 >= 2 && mod10 <= 4 && mod100 < 10) return forms.few

  return forms.many
}

function pickCaseForm(n, caseForms, grammaticalCase) {
  const abs = Math.abs(Number(n))
  if (!Number.isFinite(abs)) return caseForms.other ?? caseForms.many

  if (!Number.isInteger(abs)) {
    return caseForms.other ?? caseForms.many
  }

  if (grammaticalCase === 'gen' || grammaticalCase === 'ins') {
    if (abs === 1) return caseForms.one
    return caseForms.other ?? caseForms.many
  }

  return skForm(abs, caseForms)
}

export function skWord(n, formKey, grammaticalCase = 'nom') {
  const entry = lemma(formKey)
  const caseForms = entry[grammaticalCase] ?? entry.nom
  return pickCaseForm(n, caseForms, grammaticalCase)
}

function formatNum(n) {
  return typeof n === 'number' ? n.toLocaleString('sk-SK') : String(n)
}

/** „2 nákupy“, „5 nákupov“, „z 202 objednávok“ (podľa pádu). */
export function skPhrase(n, formKey, grammaticalCase = 'nom') {
  if (n == null || !Number.isFinite(Number(n))) return '–'
  return `${formatNum(n)} ${skWord(n, formKey, grammaticalCase)}`
}

/** Skratka: nominatív. */
export function fmtSkCount(n, formKey) {
  return skPhrase(n, formKey, 'nom')
}

/** „z 202 objednávok“, „z 1 objednávky“. */
export function skZ(n, formKey) {
  return `z ${skPhrase(n, formKey, 'gen')}`
}

/** „669 predaných položiek“, „1 predaná položka“, „3 predané položky“. */
export function skPredanychPoloziek(n) {
  if (n == null || !Number.isFinite(Number(n))) return null
  const abs = Math.abs(Number(n))
  const num = formatNum(n)
  if (Number.isInteger(abs) && abs === 1) return `${num} predaná položka`
  const word = skWord(n, 'polozka', 'nom')
  const adj = word === SK.polozka.nom.few ? 'predané' : 'predaných'
  return `${num} ${adj} ${word}`
}

export const SK = {
  reklama: {
    nom: { one: 'reklama', few: 'reklamy', many: 'reklám' },
    gen: { one: 'reklamy', other: 'reklám' },
    acc: { one: 'reklamu', few: 'reklamy', many: 'reklám' },
    ins: { one: 'reklamou', other: 'reklamami' },
  },
  nakup: {
    nom: { one: 'nákup', few: 'nákupy', many: 'nákupov' },
    gen: { one: 'nákupu', other: 'nákupov' },
    acc: { one: 'nákup', few: 'nákupy', many: 'nákupov' },
    ins: { one: 'nákupom', other: 'nákupmi' },
  },
  objednavka: {
    nom: { one: 'objednávka', few: 'objednávky', many: 'objednávok' },
    gen: { one: 'objednávky', other: 'objednávok' },
    acc: { one: 'objednávku', few: 'objednávky', many: 'objednávok' },
    ins: { one: 'objednávkou', other: 'objednávkami' },
  },
  kliknutie: {
    nom: { one: 'kliknutie', few: 'kliknutia', many: 'kliknutí' },
    gen: { one: 'kliknutia', other: 'kliknutí' },
    acc: { one: 'kliknutie', few: 'kliknutia', many: 'kliknutí' },
    ins: { one: 'kliknutím', other: 'kliknutiami' },
  },
  navsteva: {
    nom: { one: 'návšteva', few: 'návštevy', many: 'návštev' },
    gen: { one: 'návštevy', other: 'návštev' },
    acc: { one: 'návštevu', few: 'návštevy', many: 'návštev' },
    ins: { one: 'návštevou', other: 'návštevami' },
  },
  navstevnik: {
    nom: { one: 'návštevník', few: 'návštevníci', many: 'návštevníkov' },
    gen: { one: 'návštevníka', other: 'návštevníkov' },
    acc: { one: 'návštevníka', few: 'návštevníkov', many: 'návštevníkov' },
    ins: { one: 'návštevníkom', other: 'návštevníkmi' },
  },
  clovek: {
    nom: { one: 'človek', few: 'ľudia', many: 'ľudí' },
    gen: { one: 'človeka', other: 'ľudí' },
    acc: { one: 'človeka', few: 'ľudí', many: 'ľudí' },
    ins: { one: 'človekom', other: 'ľuďmi' },
  },
  interakcia: {
    nom: { one: 'interakcia', few: 'interakcie', many: 'interakcií' },
    gen: { one: 'interakcie', other: 'interakcií' },
    acc: { one: 'interakciu', few: 'interakcie', many: 'interakcií' },
    ins: { one: 'interakciou', other: 'interakciami' },
  },
  mesiac: {
    nom: { one: 'mesiac', few: 'mesiace', many: 'mesiacov' },
    gen: { one: 'mesiaca', other: 'mesiacov' },
    acc: { one: 'mesiac', few: 'mesiace', many: 'mesiacov' },
    ins: { one: 'mesiacom', other: 'mesiacmi' },
  },
  kampan: {
    nom: { one: 'kampaň', few: 'kampane', many: 'kampaní' },
    gen: { one: 'kampane', other: 'kampaní' },
    acc: { one: 'kampaň', few: 'kampane', many: 'kampaní' },
    ins: { one: 'kampanou', other: 'kampaňami' },
  },
  konverzia: {
    nom: { one: 'konverzia', few: 'konverzie', many: 'konverzií' },
    gen: { one: 'konverzie', other: 'konverzií' },
    acc: { one: 'konverziu', few: 'konverzie', many: 'konverzií' },
    ins: { one: 'konverziou', other: 'konverziami' },
  },
  relacia: {
    nom: { one: 'relácia', few: 'relácie', many: 'relácií' },
    gen: { one: 'relácie', other: 'relácií' },
    acc: { one: 'reláciu', few: 'relácie', many: 'relácií' },
    ins: { one: 'reláciou', other: 'reláciami' },
  },
  email: {
    nom: { one: 'e-mail', few: 'e-maily', many: 'e-mailov' },
    gen: { one: 'e-mailu', other: 'e-mailov' },
    acc: { one: 'e-mail', few: 'e-maily', many: 'e-mailov' },
    ins: { one: 'e-mailom', other: 'e-mailmi' },
  },
  polozka: {
    nom: { one: 'položka', few: 'položky', many: 'položiek' },
    gen: { one: 'položky', other: 'položiek' },
    acc: { one: 'položku', few: 'položky', many: 'položiek' },
    ins: { one: 'položkou', other: 'položkami' },
  },
  kus: {
    nom: { one: 'kus', few: 'ks', many: 'kusov' },
    gen: { one: 'ksu', other: 'kusov' },
    acc: { one: 'kus', few: 'ks', many: 'kusov' },
    ins: { one: 'ksom', other: 'ksmi' },
  },
}

/** Overenie, že každé lemma má štyri pády (dev-only sanity). */
if (import.meta.env?.DEV) {
  for (const [key, entry] of Object.entries(SK)) {
    for (const c of CASES) {
      if (!entry[c]) console.warn(`SK.${key} missing case ${c}`)
    }
  }
}

/** „2 nákupy“, „5 nákupov“ (spätná kompatibilita). */
export function skCount(n, forms) {
  if (n == null) return '–'
  return `${formatNum(n)} ${skForm(n, forms)}`
}

/** „Top 2 reklamy“, „Top 5 reklám“. */
export function topReklamy(n) {
  return `Top ${skCount(n, SK.reklama.nom)}`
}

/** „Súhrn za 3 mesiace“. */
export function skZaObdobieMesiace(n) {
  return `Súhrn za ${skCount(n, SK.mesiac.nom)}`
}

/** „Súčet za 6 mesiacov“. */
export function skSucetZaMesiace(n) {
  return `Súčet za ${skCount(n, SK.mesiac.nom)}`
}

export function skReachSummary(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Reklamu videl 1 človek.'
  const form = skForm(n, SK.clovek.nom)
  if (form === SK.clovek.nom.few) return `Reklamu videli ${skCount(n, SK.clovek.nom)}.`
  return `Reklamu videlo ${skCount(n, SK.clovek.nom)}.`
}

export function skNavstevyZReklam(n, source = 'reklám') {
  if (n == null || n <= 0) return null
  if (n === 1) return `Na web prišla 1 návšteva z ${source}.`
  const form = skForm(n, SK.navsteva.nom)
  if (form === SK.navsteva.nom.few) return `Na web prišli ${skCount(n, SK.navsteva.nom)} z ${source}.`
  return `Na web prišlo ${skCount(n, SK.navsteva.nom)} z ${source}.`
}

export function skInterakcieSummary(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Na príspevkoch bola 1 interakcia.'
  const form = skForm(n, SK.interakcia.nom)
  if (form === SK.interakcia.nom.few) return `Na príspevkoch boli ${skCount(n, SK.interakcia.nom)}.`
  return `Na príspevkoch bolo ${skCount(n, SK.interakcia.nom)}.`
}

export function skKonverzieSummary(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Google Ads zaznamenali 1 konverziu (hovor, formulár a pod.).'
  const form = skForm(n, SK.konverzia.nom)
  const detail = form === SK.konverzia.nom.few ? '(hovory, formuláre a pod.)' : '(hovor, formulár a pod.)'
  return `Google Ads zaznamenali ${skCount(n, SK.konverzia.nom)} ${detail}`
}

export function skNavstevyNaWeb(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Z reklám na web prišla 1 návšteva'
  const form = skForm(n, SK.navsteva.nom)
  if (form === SK.navsteva.nom.few) return `Z reklám na web prišli ${skPhrase(n, 'navsteva', 'nom')}`
  return `Z reklám na web prišlo ${skPhrase(n, 'navsteva', 'nom')}`
}

export function skOsloviliLudi(n) {
  if (n == null || n <= 0) return null
  if (n === 1) return 'Reklamy oslovili 1 človeka'
  return `Reklamy oslovili ${skPhrase(n, 'clovek', 'acc')}`
}

export function skClicksSummary(n) {
  if (n == null || n <= 0) return null
  return `Používatelia klikli ${formatNum(n)}-krát.`
}

/** Podtitulok KPI: „2 nákupy · 481,33 €“ */
export function skNakupySub(n, suffix = '') {
  const base = fmtSkCount(n, 'nakup')
  return suffix ? `${base} · ${suffix}` : base
}
