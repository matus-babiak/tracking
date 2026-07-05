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
  '.client-report-summary-block',
  '.client-report-highlights-wrap',
  '.client-report-highlight',
  '.client-report-section-head',
  '.client-report-row',
  '.client-report-footer',
].join(', ')

export async function downloadReportPdf(element, filename) {
  const html2pdf = (await import('html2pdf.js')).default

  element.scrollIntoView({ block: 'start' })
  await new Promise((resolve) => requestAnimationFrame(resolve))

  element.classList.add('client-report-doc--exporting')

  try {
    await html2pdf()
      .set({
        margin: [12, 12, 12, 12],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: -window.scrollY,
          ignoreElements: (el) => el.classList?.contains('client-report-download'),
          onclone: (doc) => {
            const clone = doc.querySelector('.client-report-doc')
            if (!clone) return
            clone.classList.add('client-report-doc--exporting')
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
