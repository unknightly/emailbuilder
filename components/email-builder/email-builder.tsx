"use client"

import { useState, useMemo, useCallback } from "react"
import type { EmailSection, EmailComponent, ComponentType } from "@/lib/email-types"
import { createDefaultSections, createComponent } from "@/lib/email-types"
import { generateEmailHTML } from "@/lib/email-html-generator"
import { BuilderPanel } from "./builder-panel"
import { PreviewPanel } from "./preview-panel"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Mail } from "lucide-react"

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

  const html = useMemo(() => generateEmailHTML(sections), [sections])

  return (
    <div className="flex h-screen flex-col bg-background">
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
