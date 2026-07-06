/**
 * Report narrative text — kľúčové metriky sa ukladajú ako **tučný** markdown
 * a pri zobrazení sa renderujú do <strong>.
 */

export function summaryPartsToMarkdown(paragraphs) {
  if (!paragraphs?.length) return ''
  return paragraphs
    .map((parts) => (parts ?? []).map(partToMarkdown).join(''))
    .join('\n\n')
}

function partToMarkdown(part) {
  if (!part?.text) return ''
  if (part.bold) return `**${part.text}**`
  return part.text
}

/** Rozdelí text na segmenty pre React (plain + bold). */
export function parseMarkdownBold(text) {
  if (!text) return [{ bold: false, text: '' }]
  const segments = []
  const re = /\*\*([^*]+)\*\*/g
  let last = 0
  let match
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ bold: false, text: text.slice(last, match.index) })
    }
    segments.push({ bold: true, text: match[1] })
    last = match.index + match[0].length
  }
  if (last < text.length) {
    segments.push({ bold: false, text: text.slice(last) })
  }
  return segments.length ? segments : [{ bold: false, text }]
}
