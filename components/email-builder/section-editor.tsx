"use client"

import { useState } from "react"
import type { EmailSection, EmailComponent, ComponentType } from "@/lib/email-types"
import { createComponent } from "@/lib/email-types"
import { ComponentEditor } from "./component-editor"
import { AddComponentMenu } from "./add-component-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, LayoutTemplate, FileText, Copyright } from "lucide-react"
import { cn } from "@/lib/utils"

const sectionIcons: Record<string, React.ReactNode> = {
  header: <LayoutTemplate className="h-4 w-4" />,
  body: <FileText className="h-4 w-4" />,
  footer: <Copyright className="h-4 w-4" />,
}

const sectionAccentColors: Record<string, string> = {
  header: "border-l-sky-500",
  body: "border-l-foreground/30",
  footer: "border-l-muted-foreground/50",
}

interface SectionEditorProps {
  section: EmailSection
  onAddComponent: (sectionId: string, type: ComponentType) => void
  onUpdateComponent: (sectionId: string, componentId: string, updates: Partial<EmailComponent>) => void
  onRemoveComponent: (sectionId: string, componentId: string) => void
  onMoveComponent: (sectionId: string, componentId: string, direction: "up" | "down") => void
}

export function SectionEditor({
  section,
  onAddComponent,
  onUpdateComponent,
  onRemoveComponent,
  onMoveComponent,
}: SectionEditorProps) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "rounded-lg border border-l-[3px] bg-card overflow-hidden",
          sectionAccentColors[section.type]
        )}
      >
        <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors">
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-90"
            )}
          />
          <span className="text-muted-foreground">{sectionIcons[section.type]}</span>
          <span className="font-medium text-sm">{section.label}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {section.components.length} {section.components.length === 1 ? "item" : "items"}
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4">
            {section.components.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {section.components.map((comp, index) => (
                  <ComponentEditor
                    key={comp.id}
                    component={comp}
                    onUpdate={(updates) => onUpdateComponent(section.id, comp.id, updates)}
                    onRemove={() => onRemoveComponent(section.id, comp.id)}
                    onMove={(dir) => onMoveComponent(section.id, comp.id, dir)}
                    isFirst={index === 0}
                    isLast={index === section.components.length - 1}
                  />
                ))}
              </div>
            )}

            {section.components.length === 0 && (
              <div className="rounded-lg border border-dashed py-6 mb-3 flex flex-col items-center gap-1 text-muted-foreground">
                <span className="text-xs">No components yet</span>
              </div>
            )}

            <AddComponentMenu onAdd={(type) => onAddComponent(section.id, type)} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
