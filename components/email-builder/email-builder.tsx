"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import type { EmailSection, EmailComponent, ComponentType } from "@/lib/email-types"
import { createDefaultSections, createComponent } from "@/lib/email-types"
import { generateEmailHTML } from "@/lib/email-html-generator"
import { BuilderPanel } from "./builder-panel"
import { PreviewPanel } from "./preview-panel"
import { Button } from "@/components/ui/button"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Mail, Download, Upload } from "lucide-react"

export function EmailBuilder() {
  const [sections, setSections] = useState<EmailSection[]>(createDefaultSections)

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

  const injectHTML = useCallback((sectionId: string, html: string) => {
    const htmlComponent = createComponent("html")
    htmlComponent.content = html
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, components: [...s.components, htmlComponent] }
          : s
      )
    )
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const html = useMemo(() => generateEmailHTML(sections), [sections])

  const handleDownload = useCallback(() => {
    const data = JSON.stringify(sections, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `email-template-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [sections])

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string)
          if (Array.isArray(parsed) && parsed.every((s) => s.id && s.type && s.label && Array.isArray(s.components))) {
            setSections(parsed as EmailSection[])
          }
        } catch {
          // Invalid JSON - silently ignore
        }
      }
      reader.readAsText(file)
      // Reset the input so the same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    []
  )

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleUpload}
      />

      {/* App header */}
      <header className="flex items-center gap-3 border-b px-5 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
            <Mail className="h-4 w-4 text-background" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight leading-none">Email Builder</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Compose table-based email templates</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={42} minSize={30} maxSize={60}>
            <BuilderPanel
              sections={sections}
              onAddComponent={addComponent}
              onUpdateComponent={updateComponent}
              onRemoveComponent={removeComponent}
              onMoveComponent={moveComponent}
              onInjectHTML={injectHTML}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={58} minSize={30}>
            <PreviewPanel html={html} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
