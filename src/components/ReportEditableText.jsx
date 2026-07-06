import { useEffect, useRef, useState } from 'react'
import { parseMarkdownBold } from '../lib/reportText'

function RenderBoldText({ text }) {
  const segments = parseMarkdownBold(text)
  return (
    <>
      {segments.map((seg, i) => (
        seg.bold ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>
      ))}
    </>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export default function ReportEditableText({
  value,
  onChange,
  placeholder = 'Sem napíšte text…',
  displayClassName = 'client-report-editable-display',
  inputClassName = 'client-report-editable-input',
  forceDisplay = false,
  startInEditMode = false,
  minRows = 4,
  variant = 'default',
  onEditEnd,
}) {
  const [editing, setEditing] = useState(startInEditMode)
  const textareaRef = useRef(null)
  const isInline = variant === 'inline'
  const showEditor = editing && !forceDisplay

  useEffect(() => {
    if (forceDisplay) setEditing(false)
  }, [forceDisplay])

  useEffect(() => {
    if (startInEditMode && !forceDisplay) setEditing(true)
  }, [startInEditMode, forceDisplay])

  useEffect(() => {
    if (showEditor && textareaRef.current) {
      textareaRef.current.focus()
      const len = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(len, len)
    }
  }, [showEditor])

  const paragraphs = value.trim() ? value.split(/\n\n+/) : []
  const rowCount = Math.max(minRows, value.split('\n').length + 1)

  const finishEditing = () => {
    setEditing(false)
    onEditEnd?.()
  }

  const beginEditing = () => {
    if (!forceDisplay) setEditing(true)
  }

  const rootClass = [
    'client-report-editable',
    showEditor ? 'client-report-editable--editing' : '',
    isInline ? 'client-report-editable--inline' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={rootClass}>
      {showEditor ? (
        <textarea
          ref={textareaRef}
          className={inputClassName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              finishEditing()
            }
          }}
          rows={rowCount}
          placeholder={placeholder}
        />
      ) : (
        <div
          className={`client-report-editable-body${isInline || !forceDisplay ? ' client-report-editable-body--clickable' : ''}`}
          onClick={beginEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              beginEditing()
            }
          }}
          role={isInline || !forceDisplay ? 'button' : undefined}
          tabIndex={isInline || !forceDisplay ? 0 : undefined}
          aria-label={isInline || !forceDisplay ? 'Upraviť text' : undefined}
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, i) => (
              <p key={i} className={displayClassName}>
                <RenderBoldText text={paragraph} />
              </p>
            ))
          ) : (
            !isInline && (
              <p className={`${displayClassName} client-report-editable-placeholder`}>{placeholder}</p>
            )
          )}
        </div>
      )}

      {!forceDisplay && !showEditor && !isInline && (
        <button
          type="button"
          className="client-report-editable-edit client-report-no-pdf"
          onMouseDown={(e) => e.preventDefault()}
          onClick={beginEditing}
          aria-label="Upraviť text"
          title="Upraviť text"
        >
          <EditIcon />
        </button>
      )}
    </div>
  )
}
