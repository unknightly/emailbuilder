"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { Bold, Italic, Underline, Link as LinkIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ParagraphLink } from "@/lib/email-types"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  links: ParagraphLink[]
  onLinksChange: (links: ParagraphLink[]) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  links,
  onLinksChange,
  placeholder = "Enter text...",
  className,
  minHeight = "100px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)

  // Parse markdown and links to HTML
  const markdownToHtml = useCallback((text: string, linksList: ParagraphLink[]) => {
    let html = text
    
    // Replace link placeholders with actual links
    linksList.forEach((link) => {
      const placeholder = `[link:${link.id}]`
      const linkHtml = `<a href="${link.url}" data-link-id="${link.id}" class="rich-link" contenteditable="false" style="color: #0ea5e9; text-decoration: underline; cursor: pointer; position: relative; display: inline-flex; align-items: center; gap: 2px;">${link.text}<button data-link-action="edit" data-link-id="${link.id}" class="link-edit-btn" style="display: inline-flex; align-items: center; justify-center; width: 14px; height: 14px; border-radius: 2px; background: #e2e8f0; margin-left: 2px; cursor: pointer; border: none;" title="Edit link">✎</button><button data-link-action="remove" data-link-id="${link.id}" class="link-remove-btn" style="display: inline-flex; align-items: center; justify-center; width: 14px; height: 14px; border-radius: 2px; background: #fee; color: #dc2626; margin-left: 2px; cursor: pointer; border: none;" title="Remove link">×</button></a>`
      html = html.replace(placeholder, linkHtml)
    })

    // Bold: **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Italic: *text*
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Underline: __text__
    html = html.replace(/__(.+?)__/g, '<u>$1</u>')
    
    // Line breaks
    html = html.replace(/\n/g, '<br>')
    
    return html
  }, [])

  // Convert HTML back to markdown
  const htmlToMarkdown = useCallback((html: string) => {
    let text = html
    
    // Remove link HTML elements (keep placeholders)
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    doc.querySelectorAll('a[data-link-id]').forEach((link) => {
      const id = link.getAttribute('data-link-id')
      const placeholder = `[link:${id}]`
      link.replaceWith(placeholder)
    })
    text = doc.body.innerHTML
    
    // Convert <strong> to **
    text = text.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    
    // Convert <em> to *
    text = text.replace(/<em>(.*?)<\/em>/g, '*$1*')
    
    // Convert <u> to __
    text = text.replace(/<u>(.*?)<\/u>/g, '__$1__')
    
    // Convert <br> to \n
    text = text.replace(/<br\s*\/?>/g, '\n')
    
    // Remove any remaining HTML tags
    text = text.replace(/<[^>]+>/g, '')
    
    return text
  }, [])

  // Update editor content when value or links change
  useEffect(() => {
    if (!editorRef.current || isFocused) return
    const html = markdownToHtml(value, links)
    if (editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html
    }
  }, [value, links, markdownToHtml, isFocused])

  // Handle content changes
  const handleInput = useCallback(() => {
    if (!editorRef.current) return
    const markdown = htmlToMarkdown(editorRef.current.innerHTML)
    onChange(markdown)
  }, [onChange, htmlToMarkdown])

  // Handle link actions
  useEffect(() => {
    if (!editorRef.current) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Edit link
      if (target.hasAttribute('data-link-action') && target.getAttribute('data-link-action') === 'edit') {
        e.preventDefault()
        e.stopPropagation()
        const linkId = target.getAttribute('data-link-id')
        if (linkId) {
          const link = links.find(l => l.id === linkId)
          if (link) {
            const newText = prompt('Link text:', link.text)
            const newUrl = prompt('Link URL:', link.url)
            if (newText !== null && newUrl !== null) {
              onLinksChange(links.map(l => l.id === linkId ? { ...l, text: newText, url: newUrl } : l))
            }
          }
        }
      }
      
      // Remove link
      if (target.hasAttribute('data-link-action') && target.getAttribute('data-link-action') === 'remove') {
        e.preventDefault()
        e.stopPropagation()
        const linkId = target.getAttribute('data-link-id')
        if (linkId) {
          // Remove link from list
          onLinksChange(links.filter(l => l.id !== linkId))
          
          // Replace link placeholder with just the link text in the value
          const link = links.find(l => l.id === linkId)
          if (link) {
            const newValue = value.replace(`[link:${linkId}]`, link.text)
            onChange(newValue)
          }
        }
      }
    }

    const editor = editorRef.current
    editor.addEventListener('click', handleClick)
    return () => editor.removeEventListener('click', handleClick)
  }, [links, onLinksChange, value, onChange])

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "w-full px-3 py-2 text-sm rounded-md border bg-background",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground",
        className
      )}
      style={{ minHeight }}
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  )
}
