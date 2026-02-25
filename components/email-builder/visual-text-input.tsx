"use client"

import { useRef, useEffect, useCallback } from "react"
import type { ParagraphLink } from "@/lib/email-types"

interface VisualTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  links?: ParagraphLink[]
}

export function VisualTextInput({ value, onChange, placeholder, multiline, className, links = [] }: VisualTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  // Convert markdown to HTML for display
  const markdownToHtml = useCallback((markdown: string) => {
    let html = markdown
    // Render link placeholders as styled link text
    for (const link of links) {
      const placeholder = `[link:${link.id}]`
      // Use a data attribute so we can round-trip back to the placeholder
      html = html.split(placeholder).join(
        `<a data-link-id="${link.id}" class="text-blue-600 underline cursor-pointer" contenteditable="false">${link.text}</a>`
      )
    }
    // Bold **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Underline __text__
    html = html.replace(/__(.+?)__/g, '<u>$1</u>')
    // Italic *text* (not **)
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    // Variables $VarName
    html = html.replace(/\$([A-Z][a-zA-Z0-9]*)/g, '<span class="font-mono text-purple-600 bg-purple-50 px-1 rounded" contenteditable="false">$$$1</span>')
    // Line breaks
    if (multiline) {
      html = html.replace(/\n/g, '<br>')
    }
    return html
  }, [multiline, links])

  // Convert HTML back to markdown
  const htmlToMarkdown = useCallback((html: string) => {
    let markdown = html
    // Remove <br> tags
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n')
    // Convert tags back to markdown
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*')
    markdown = markdown.replace(/<u>(.*?)<\/u>/g, '__$1__')
    // Restore link placeholders from <a data-link-id="..."> tags
    markdown = markdown.replace(/<a[^>]*data-link-id="([^"]+)"[^>]*>.*?<\/a>/g, '[link:$1]')
    // Remove variable styling spans but restore $VarName
    markdown = markdown.replace(/<span[^>]*contenteditable="false"[^>]*>\$([A-Z][a-zA-Z0-9]*)<\/span>/g, '$$$1')
    // Remove any remaining HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '')
    return markdown
  }, [])

  // Update editor content when value changes externally
  useEffect(() => {
    if (editorRef.current) {
      const html = markdownToHtml(value)
      // Only update if content is different and we're not currently editing
      if (document.activeElement !== editorRef.current && editorRef.current.innerHTML !== html) {
        const selection = window.getSelection()
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
        const offset = range ? range.startOffset : 0
        
        editorRef.current.innerHTML = html
        
        // Try to restore cursor position
        if (range && editorRef.current.firstChild) {
          try {
            const newRange = document.createRange()
            const textNode = editorRef.current.firstChild
            newRange.setStart(textNode, Math.min(offset, (textNode.textContent || '').length))
            newRange.collapse(true)
            selection?.removeAllRanges()
            selection?.addRange(newRange)
          } catch (e) {
            // Ignore cursor restoration errors
          }
        }
      }
    }
  }, [value, markdownToHtml])

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      const markdown = htmlToMarkdown(html)
      onChange(markdown)
    }
  }, [onChange, htmlToMarkdown])

  // Handle paste - strip formatting
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }, [])

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      className={`
        w-full text-sm resize-none focus:outline-none
        ${multiline ? 'min-h-[100px]' : 'min-h-[36px]'}
        ${className || ''}
        empty:before:content-[attr(data-placeholder)]
        empty:before:text-muted-foreground
      `}
      style={{
        whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        overflowWrap: 'break-word',
      }}
      suppressContentEditableWarning
    />
  )
}
