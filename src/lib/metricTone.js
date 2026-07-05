/** Farebný tón metriky v reportoch: investícia = červená, tržba/zisk = zelená. */

export function metricToneFromLabel(label) {
  if (!label) return null
  const l = label.toLowerCase()

  if (l.includes('investícia')) {
    return 'spend'
  }

  if (
    l.includes('tržb')
    || l.includes('trz')
    || l.includes('predaj')
    || l.includes('hodnota nákupov')
    || l.includes('hodnota z reklám')
    || l.includes('zisk')
  ) {
    return 'revenue'
  }

  return null
}

export function metricToneClass(tone) {
  if (tone === 'spend') return 'metric-tone-spend'
  if (tone === 'revenue') return 'metric-tone-revenue'
  return ''
}

export function resolveMetricTone({ tone, label } = {}) {
  return tone ?? metricToneFromLabel(label) ?? null
}
