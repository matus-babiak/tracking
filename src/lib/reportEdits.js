import { summaryPartsToMarkdown } from './reportText'

export function summaryPartsToPlainText(paragraphs) {
  return summaryPartsToMarkdown(paragraphs)
}

export function buildDefaultEdits(report) {
  return {
    summary: summaryPartsToPlainText(report.summary?.paragraphs),
    sections: {},
  }
}
