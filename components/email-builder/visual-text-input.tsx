"use client"

import { useRef, useEffect, useCallback, useLayoutEffect, useImperativeHandle, forwardRef } from "react"
import type { ParagraphLink } from "@/lib/email-types"

export interface VisualTextInputHandle {
  wrapSelection: (prefix: string, suffix: string) => void
  insertText: (text: string) => void
  focus: () => void
}

interface VisualTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  links?: ParagraphLink[]
  /** When true, displays raw markdown syntax instead of rendering it visually */
  rawMarkdown?: boolean
}

// ── Shared helpers ─────────────────────────────────────────────────────────
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// ── Markdown → display HTML ────────────────────────────────────────────────
const MARKER = (m: string) =>
  `<span class="font-mono text-[11px] text-muted-foreground/60 select-none">${m}</span>`

function markdownToHtml(markdown: string, multiline: boolean, links: ParagraphLink[]): string {
  let html = markdown

  // [link:id] placeholders → non-editable anchor chips (legacy / toolbar-inserted links)
  for (const link of links) {
    const token = `[link:${link.id}]`
    html = html.split(token).join(
      `<a data-link-id="${link.id}" class="text-blue-600 underline cursor-pointer" contenteditable="false" tabindex="-1">${link.text}</a>`
    )
  }

  // Standard markdown links  [text](url)  → non-editable anchor chip with grey mono markers
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, text, url) =>
      `${MARKER("[")}<a data-md-link="${url}" class="text-blue-600 underline cursor-pointer" contenteditable="false" tabindex="-1">${text}</a>${MARKER(`](${url})`)}`
  )

  // Bold  **text**  — show markers in grey mono, content in bold
  html = html.replace(/\*\*(.+?)\*\*/gs, `${MARKER("**")}<strong>$1</strong>${MARKER("**")}`)
  // Underline  __text__  — show markers in grey mono, content underlined
  html = html.replace(/__(.+?)__/gs, `${MARKER("__")}<u>$1</u>${MARKER("__")}`)
  // Italic  *text*  (not part of **) — show markers in grey mono, content italic
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/gs, `${MARKER("*")}<em>$1</em>${MARKER("*")}`)
  // Variables  $VarName
  html = html.replace(
    /\$([A-Z][a-zA-Z0-9]*)/g,
    '<span data-var="$1" class="font-mono text-purple-600 bg-purple-50 px-0.5 rounded text-[11px]" contenteditable="false">$$$1</span>'
  )

  if (multiline) html = html.replace(/\n/g, '<br>')
  return html
}

// ── Display HTML → markdown ────────────────────────────────────────────────
function htmlToMarkdown(html: string): string {
  let md = html

  // <br> → newline
  md = md.replace(/<br\s*\/?>/gi, '\n')

  // Restore standard markdown links  [text](url)
  md = md.replace(/<a[^>]*data-md-link="([^"]+)"[^>]*>(.*?)<\/a>/gs, '[$2]($1)')

  // Restore [link:id] placeholders (toolbar-inserted links)
  md = md.replace(/<a[^>]*data-link-id="([^"]+)"[^>]*>.*?<\/a>/gs, '[link:$1]')

  // Restore variable placeholders
  md = md.replace(/<span[^>]*data-var="([^"]+)"[^>]*>[^<]*<\/span>/gs, '$$$1')

  // Restore formatting tags
  md = md.replace(/<strong>(.*?)<\/strong>/gs, '**$1**')
  md = md.replace(/<u>(.*?)<\/u>/gs, '__$1__')
  md = md.replace(/<em>(.*?)<\/em>/gs, '*$1*')

  // Strip any remaining tags
  md = md.replace(/<[^>]+>/g, '')

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&')
  md = md.replace(/&lt;/g, '<')
  md = md.replace(/&gt;/g, '>')
  md = md.replace(/&nbsp;/g, ' ')

  return md
}

// ── Cursor helpers ─────────────────────────────────────────────────────────
function getCursorOffset(el: HTMLElement): number {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return 0
  const range = sel.getRangeAt(0).cloneRange()
  range.selectNodeContents(el)
  range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset)
  return range.toString().length
}

function setCursorOffset(el: HTMLElement, offset: number) {
  const sel = window.getSelection()
  if (!sel) return
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let remaining = offset
  let node: Text | null = null
  let nodeOffset = 0
  while (walk.nextNode()) {
    const text = walk.currentNode as Text
    if (remaining <= text.length) {
      node = text
      nodeOffset = remaining
      break
    }
    remaining -= text.length
  }
  if (!node && el.lastChild) {
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
    return
  }
  if (node) {
    const range = document.createRange()
    range.setStart(node, nodeOffset)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

// ── Get selected text range within the contentEditable ─────────────────────
function getSelectionOffsets(el: HTMLElement): { start: number; end: number } {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return { start: 0, end: 0 }

  const range = sel.getRangeAt(0)

  // start offset
  const startRange = range.cloneRange()
  startRange.selectNodeContents(el)
  startRange.setEnd(range.startContainer, range.startOffset)
  const start = startRange.toString().length

  // end offset
  const endRange = range.cloneRange()
  endRange.selectNodeContents(el)
  endRange.setEnd(range.endContainer, range.endOffset)
  const end = endRange.toString().length

  return { start, end }
}

// ── Component ──────────────────────────────────────────────────────────────
export const VisualTextInput = forwardRef<VisualTextInputHandle, VisualTextInputProps>(
  function VisualTextInput(
    {
      value,
      onChange,
      placeholder,
      multiline = false,
      className,
      links = [],
      rawMarkdown = false,
    },
    ref
  ) {
    const editorRef = useRef<HTMLDivElement>(null)
    const lastPushedRef = useRef<string>("")
    // Keep a stable ref to latest markdown value for use in imperative methods
    const valueRef = useRef(value)
    valueRef.current = value

    // ── Helper: rebuild innerHTML from markdown string ─────────────────────
    const buildHtml = useCallback(
      (md: string) =>
        rawMarkdown
          ? multiline
            ? escapeHtml(md).replace(/\n/g, "<br>")
            : escapeHtml(md)
          : markdownToHtml(md, multiline, links),
      [rawMarkdown, multiline, links]
    )

    // ── Imperative handle for toolbar buttons ──────────────────────────────
    useImperativeHandle(ref, () => ({
      focus() {
        editorRef.current?.focus()
      },
      insertText(text: string) {
        const el = editorRef.current
        if (!el) return
        el.focus()
        // Get cursor position from current markdown
        const sel = window.getSelection()
        let insertPos = valueRef.current.length
        if (sel && sel.rangeCount > 0) {
          const { start } = getSelectionOffsets(el)
          insertPos = start
        }
        const current = valueRef.current
        const newMd = current.slice(0, insertPos) + text + current.slice(insertPos)
        lastPushedRef.current = newMd
        el.innerHTML = buildHtml(newMd)
        onChange(newMd)
        // Place cursor after inserted text
        setCursorOffset(el, insertPos + text.length)
      },
      wrapSelection(prefix: string, suffix: string) {
        const el = editorRef.current
        if (!el) return
        el.focus()
        const { start, end } = getSelectionOffsets(el)
        const current = valueRef.current
        const selected = current.slice(start, end)

        // Toggle off if already wrapped
        const pre = current.slice(Math.max(0, start - prefix.length), start)
        const post = current.slice(end, end + suffix.length)
        let newMd: string
        let newCursorStart: number
        let newCursorEnd: number

        if (pre === prefix && post === suffix) {
          // Unwrap
          newMd = current.slice(0, start - prefix.length) + selected + current.slice(end + suffix.length)
          newCursorStart = start - prefix.length
          newCursorEnd = end - prefix.length
        } else {
          // Wrap
          newMd = current.slice(0, start) + prefix + selected + suffix + current.slice(end)
          newCursorStart = start + prefix.length
          newCursorEnd = end + prefix.length
        }

        lastPushedRef.current = newMd
        el.innerHTML = buildHtml(newMd)
        onChange(newMd)

        // Restore selection
        if (newCursorStart !== newCursorEnd) {
          const sel = window.getSelection()
          if (sel) {
            const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
            let startNode: Text | null = null; let startOff = 0
            let endNode: Text | null = null; let endOff = 0
            let rem = newCursorStart
            while (walk.nextNode()) {
              const t = walk.currentNode as Text
              if (!startNode && rem <= t.length) { startNode = t; startOff = rem }
              else if (!startNode) { rem -= t.length }
            }
            rem = newCursorEnd
            const walk2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
            while (walk2.nextNode()) {
              const t = walk2.currentNode as Text
              if (rem <= t.length) { endNode = t; endOff = rem; break }
              rem -= t.length
            }
            if (startNode && endNode) {
              const range = document.createRange()
              range.setStart(startNode, startOff)
              range.setEnd(endNode, endOff)
              sel.removeAllRanges()
              sel.addRange(range)
            }
          }
        } else {
          setCursorOffset(el, newCursorStart)
        }
      },
    }), [multiline, links, onChange])

    // Push into DOM only when the external value changes (not during user input)
    useLayoutEffect(() => {
      const el = editorRef.current
      if (!el) return
      if (lastPushedRef.current === value) return
      const html = buildHtml(value)
      if (document.activeElement === el) {
        const offset = getCursorOffset(el)
        el.innerHTML = html
        lastPushedRef.current = value
        setCursorOffset(el, offset)
      } else {
        el.innerHTML = html
        lastPushedRef.current = value
      }
    }, [value, buildHtml])

    // On mount: seed content
    useEffect(() => {
      const el = editorRef.current
      if (!el) return
      el.innerHTML = buildHtml(value)
      lastPushedRef.current = value
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleInput = useCallback(() => {
      const el = editorRef.current
      if (!el) return
      const md = htmlToMarkdown(el.innerHTML)
      lastPushedRef.current = md
      onChange(md)
    }, [onChange])

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData.getData("text/plain")
      document.execCommand("insertText", false, text)
    }, [])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault()
        }
      },
      [multiline]
    )

    return (
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={[
          "w-full text-sm focus:outline-none",
          multiline ? "min-h-[80px]" : "min-h-[28px]",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
          className ?? "",
        ].join(" ")}
        style={{
          whiteSpace: multiline ? "pre-wrap" : "nowrap",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      />
    )
  }
)
