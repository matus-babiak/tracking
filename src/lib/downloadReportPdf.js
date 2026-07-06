function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function reportPdfFilename(clientName, period) {
  const slug = slugify(`${clientName}-${period}`)
  return `Report-${slug || 'klient'}.pdf`
}

const PDF_AVOID_SELECTORS = [
  '.client-report-cover',
  '.client-report-footer',
  '.client-report-callout',
  '.client-report-kpi',
  '.client-report-kpi-grid',
  '.client-report-insights',
  '.client-report-charts',
  '.client-report-figure',
  '.client-report-subsection',
  '.client-report-section',
  '.client-report-section--summary',
  '.client-report-row',
].join(', ')

const A4_MARGIN_MM = 12
const A4_CONTENT_WIDTH_MM = 210 - A4_MARGIN_MM * 2

export async function downloadReportPdf(element, filename) {
  const html2pdf = (await import('html2pdf.js')).default

  element.scrollIntoView({ block: 'start' })
  await new Promise((resolve) => requestAnimationFrame(resolve))

  element.classList.add('client-report-doc--exporting')
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  try {
    await html2pdf()
      .set({
        margin: [A4_MARGIN_MM, A4_MARGIN_MM, A4_MARGIN_MM, A4_MARGIN_MM],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: -window.scrollY,
          width: element.scrollWidth,
          windowWidth: element.scrollWidth,
          ignoreElements: (el) => (
            el.classList?.contains('client-report-download')
            || el.classList?.contains('client-report-no-pdf')
          ),
          onclone: (doc) => {
            const clone = doc.querySelector('.client-report-doc')
            if (!clone) return
            clone.classList.add('client-report-doc--exporting')
            clone.style.width = `${A4_CONTENT_WIDTH_MM}mm`
            clone.style.maxWidth = `${A4_CONTENT_WIDTH_MM}mm`
            clone.querySelectorAll('.client-report-no-pdf').forEach((el) => el.remove())
            clone.querySelector('.client-report-download')?.remove()
          },
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: {
          mode: ['css', 'legacy'],
          avoid: PDF_AVOID_SELECTORS,
        },
      })
      .from(element)
      .save()
  } finally {
    element.classList.remove('client-report-doc--exporting')
  }
}
