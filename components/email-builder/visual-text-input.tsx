"use client"

import { useRef, useEffect, useCallback, useLayoutEffect } from "react"
import type { ParagraphLink } from "@/lib/email-types"

interface VisualTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  links?: ParagraphLink[]
}

// ── Markdown → display HTML ────────────────────────────────────────────────
function markdownToHtml(markdown: string, multiline: boolean, links: ParagraphLink[]): string {
  let html = markdown

  // Link placeholders → non-editable anchor chips
  for (const link of links) {
    const token = `[link:${link.id}]`
    html = html.split(token).join(
      `<a data-link-id="${link.id}" class="text-blue-600 underline cursor-pointer" contenteditable="false" tabindex="-1">${link.text}</a>`
    )
  }

  // Bold  **text**
  html = html.replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
  // Underline  __text__
  html = html.replace(/__(.+?)__/gs, '<u>$1</u>')
  // Italic  *text*  (not part of **)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/gs, '<em>$1</em>')
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

  // Restore link placeholders
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
    // fallback to end
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

// ── Component ──────────────────────────────────────────────────────────────
export function VisualTextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  className,
  links = [],
}: VisualTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  // Track the last markdown we pushed into the DOM so we don't overwrite
  // user input with a stale React re-render.
  const lastPushedRef = useRef<string>("")

  // Compute the target HTML once
  const targetHtml = markdownToHtml(value, multiline, links)

  // Push into DOM only when the external value changes (not during user input)
  useLayoutEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (lastPushedRef.current === value) return // same markdown — skip
    if (document.activeElement === el) {
      // User is typing — save & restore cursor
      const offset = getCursorOffset(el)
      el.innerHTML = targetHtml
      lastPushedRef.current = value
      setCursorOffset(el, offset)
    } else {
      el.innerHTML = targetHtml
      lastPushedRef.current = value
    }
  }, [value, targetHtml])

  // On mount: seed content
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    el.innerHTML = targetHtml
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
