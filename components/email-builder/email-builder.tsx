"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import type { EmailSection, EmailComponent, ComponentType, EmailTheme } from "@/lib/email-types"
import { createDefaultSections, createComponent, DEFAULT_THEME } from "@/lib/email-types"
import { generateEmailHTML } from "@/lib/email-html-generator"
import { BuilderPanel } from "./builder-panel"
import { PreviewPanel } from "./preview-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Download, Upload } from "lucide-react"
import { AppHeader } from "./app-header"

export function EmailBuilder() {
  const [sections, setSections] = useState<EmailSection[]>(createDefaultSections)
  const [theme, setTheme] = useState<EmailTheme>(() => ({ ...DEFAULT_THEME }))

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



  const fileInputRef = useRef<HTMLInputElement>(null)
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [downloadFileName, setDownloadFileName] = useState("")

  const html = useMemo(() => generateEmailHTML(sections, theme), [sections, theme])

  const openDownloadDialog = useCallback(() => {
    setDownloadFileName(`email-template-${new Date().toISOString().slice(0, 10)}`)
    setDownloadDialogOpen(true)
  }, [])

  const handleDownload = useCallback(() => {
    const name = downloadFileName.trim() || `email-template-${new Date().toISOString().slice(0, 10)}`
    const data = JSON.stringify({ sections, theme }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadDialogOpen(false)
  }, [sections, theme, downloadFileName])

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string)
          // Support new format { sections, theme } and legacy array format
          if (parsed && parsed.sections && Array.isArray(parsed.sections)) {
            setSections(parsed.sections as EmailSection[])
            if (parsed.theme) setTheme({ ...DEFAULT_THEME, ...parsed.theme } as EmailTheme)
          } else if (Array.isArray(parsed) && parsed.every((s: Record<string, unknown>) => s.id && s.type && s.label && Array.isArray(s.components))) {
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

      <AppHeader currentPath="/">
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
            onClick={openDownloadDialog}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </AppHeader>

      {/* Download dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Download Template</DialogTitle>
            <DialogDescription>Choose a file name for your email template.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 py-2">
            <Label htmlFor="filename" className="text-xs font-medium">File name</Label>
            <div className="flex items-center gap-2">
              <Input
                id="filename"
                value={downloadFileName}
                onChange={(e) => setDownloadFileName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleDownload() }}
                placeholder="email-template"
                className="text-sm"
                autoFocus
              />
              <span className="text-sm text-muted-foreground shrink-0">.json</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDownloadDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" id="email-builder-panels">
          <ResizablePanel defaultSize={42} minSize={30} maxSize={60} id="builder-panel">
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
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={58} minSize={30} id="preview-panel">
            <PreviewPanel html={html} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
