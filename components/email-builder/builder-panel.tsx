"use client"

import type { EmailSection, EmailComponent, ComponentType, EmailTheme } from "@/lib/email-types"
import { SectionEditor } from "./section-editor"
import { ThemeEditor } from "./theme-editor"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BuilderPanelProps {
  sections: EmailSection[]
  theme: EmailTheme
  onThemeChange: (theme: EmailTheme) => void
  onAddComponent: (sectionId: string, type: ComponentType) => void
  onUpdateComponent: (sectionId: string, componentId: string, updates: Partial<EmailComponent>) => void
  onRemoveComponent: (sectionId: string, componentId: string) => void
  onMoveComponent: (sectionId: string, componentId: string, direction: "up" | "down") => void
  onInjectHTML: (sectionId: string, html: string) => void
}

export function BuilderPanel({
  sections,
  theme,
  onThemeChange,
  onAddComponent,
  onUpdateComponent,
  onRemoveComponent,
  onMoveComponent,
  onInjectHTML,
}: BuilderPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight">Sections</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-4">
          <ThemeEditor theme={theme} onChange={onThemeChange} />
          {sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              onAddComponent={onAddComponent}
              onUpdateComponent={onUpdateComponent}
              onRemoveComponent={onRemoveComponent}
              onMoveComponent={onMoveComponent}
              onInjectHTML={onInjectHTML}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
