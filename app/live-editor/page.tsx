"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import type { EmailSection, ComponentType, EmailComponent, EmailTheme } from "@/lib/email-types"
import { createDefaultSections, createComponent, DEFAULT_THEME } from "@/lib/email-types"
import { generateEmailHTML } from "@/lib/email-html-generator"
import { AppHeader } from "@/components/email-builder/app-header"
import { BuilderPanel } from "@/components/email-builder/builder-panel"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Trash2 } from "lucide-react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

export default function LiveEditorPage() {
  // Initialize with default sections
  const [sections, setSections] = useState<EmailSection[]>(createDefaultSections)
  const [theme, setTheme] = useState<EmailTheme>(() => ({ ...DEFAULT_THEME }))
  const [copied, setCopied] = useState(false)

  // Generate HTML entities from sections
  const entitiesCode = useMemo(() => {
    const html = generateEmailHTML(sections, theme)
    // Convert HTML to entities
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
  }, [sections, theme])

  // Builder panel callbacks
  const addComponent = useCallback((sectionId: string, type: ComponentType) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, components: [...s.components, createComponent(type)] }
          : s
      )
    )
  }, [])

  const updateComponent = useCallback(
    (sectionId: string, componentId: string, updates: Partial<EmailComponent>) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                components: s.components.map((c) =>
                  c.id === componentId ? { ...c, ...updates } : c
                ),
              }
            : s
        )
      )
    },
    []
  )

  const removeComponent = useCallback((sectionId: string, componentId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, components: s.components.filter((c) => c.id !== componentId) }
          : s
      )
    )
  }, [])

  const moveComponent = useCallback(
    (sectionId: string, componentId: string, direction: "up" | "down") => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s
          const idx = s.components.findIndex((c) => c.id === componentId)
          if (idx === -1) return s
          const newIdx = direction === "up" ? idx - 1 : idx + 1
          if (newIdx < 0 || newIdx >= s.components.length) return s
          const newComponents = [...s.components]
          const [moved] = newComponents.splice(idx, 1)
          newComponents.splice(newIdx, 0, moved)
          return { ...s, components: newComponents }
        })
      )
    },
    []
  )

  const copyToClipboard = useCallback(async () => {
    try {
      const html = generateEmailHTML(sections, theme)
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const html = generateEmailHTML(sections, theme)
      const textarea = document.createElement("textarea")
      textarea.value = html
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [sections, theme])

  const clearAll = useCallback(() => {
    setSections(createDefaultSections)
    setTheme({ ...DEFAULT_THEME })
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader currentPath="/live-editor">
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy HTML
              </>
            )}
          </Button>
        </div>
      </AppHeader>

      <ResizablePanelGroup direction="horizontal" className="flex-1" id="live-editor-panels">
        <ResizablePanel defaultSize={50} minSize={30} id="entities-viewer" order={1}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">HTML Entities Code (Read-Only)</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={clearAll}
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Textarea
                value={entitiesCode}
                readOnly
                className="h-full w-full resize-none rounded-none border-0 font-mono text-xs leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/30"
                placeholder="HTML entities code will appear here..."
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30} id="interactive-builder" order={2}>
          <BuilderPanel
            sections={sections}
            theme={theme}
            onThemeChange={setTheme}
            onAddComponent={addComponent}
            onUpdateComponent={updateComponent}
            onRemoveComponent={removeComponent}
            onMoveComponent={moveComponent}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
