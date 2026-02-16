"use client"

import { useEffect, useRef, useState } from "react"
import type { ParagraphLink } from "@/lib/email-types"
import { cn } from "@/lib/utils"

interface RichTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
  links?: ParagraphLink[]
}

/**
 * Converts markdown syntax to HTML for visual display
 */
function markdownToHtml(text: string, links: ParagraphLink[] = []): string {
  let html = text
  
  // Escape HTML entities first
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  
  // Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  
  // Italic: *text* -> <em>text</em>
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>")
  
  // Underline: __text__ -> <u>text</u>
  html = html.replace(/__([^_]+)__/g, "<u>$1</u>")
  
  // Links: [link:id] -> <a>text</a>
  links.forEach((link) => {
    const placeholder = `[link:${link.id}]`
    const linkHtml = `<a href="#" data-link-id="${link.id}" style="color: #3b82f6; text-decoration: underline;" contenteditable="false">${link.text}</a>`
    html = html.replace(placeholder, linkHtml)
  })
  
  // Variables: $VarName -> <span class="variable">$VarName</span>
  html = html.replace(/(\$[A-Za-z0-9_]+)/g, '<span class="variable" style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">$1</span>')
  
  // Line breaks
  if (html.includes("\n")) {
    html = html.replace(/\n/g, "<br>")
  }
  
  return html
}

/**
 * Converts HTML back to markdown syntax
 */
function htmlToMarkdown(html: string, links: ParagraphLink[] = []): string {
  let text = html
  
  // Links first (preserve placeholders)
  links.forEach((link) => {
    const linkPattern = new RegExp(`<a[^>]*data-link-id="${link.id}"[^>]*>.*?</a>`, "g")
    text = text.replace(linkPattern, `[link:${link.id}]`)
  })
  
  // Variables
  text = text.replace(/<span[^>]*class="variable"[^>]*>(\$[A-Za-z0-9_]+)<\/span>/g, "$1")
  
  // Bold
  text = text.replace(/<strong>([^<]+)<\/strong>/g, "**$1**")
  
  // Italic
  text = text.replace(/<em>([^<]+)<\/em>/g, "*$1*")
  
  // Underline
  text = text.replace(/<u>([^<]+)<\/u>/g, "__$1__")
  
  // Line breaks
  text = text.replace(/<br\s*\/?>/g, "\n")
  
  // Clean up other HTML tags
  text = text.replace(/<[^>]+>/g, "")
  
  // Unescape HTML entities
  text = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
  
  return text
}

export function RichTextInput({
  value,
  onChange,
  placeholder = "Enter text...",
  multiline = true,
  className,
  links = [],
}: RichTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Update editor content when value changes externally
  useEffect(() => {
    if (!editorRef.current || isFocused) return
    
    const html = markdownToHtml(value, links)
    if (editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html || ""
    }
  }, [value, links, isFocused])

  const handleInput = () => {
    if (!editorRef.current) return
    
    const html = editorRef.current.innerHTML
    const markdown = htmlToMarkdown(html, links)
    
    if (markdown !== value) {
      onChange(markdown)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPaste={handlePaste}
      data-placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 text-sm bg-background border rounded-md",
        "focus:outline-none focus:ring-1 focus:ring-ring",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground",
        multiline ? "min-h-[80px]" : "min-h-[36px]",
        className
      )}
      style={{
        whiteSpace: multiline ? "pre-wrap" : "nowrap",
        overflowWrap: "break-word",
      }}
    />
  )
}
