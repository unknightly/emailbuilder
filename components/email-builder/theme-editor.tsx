"use client"

import { useCallback } from "react"
import type { EmailTheme } from "@/lib/email-types"
import { DEFAULT_THEME } from "@/lib/email-types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, Palette, RotateCcw } from "lucide-react"

interface ThemeEditorProps {
  theme: EmailTheme
  onChange: (theme: EmailTheme) => void
}

const THEME_FIELDS: { key: keyof EmailTheme; label: string; group: string }[] = [
  { key: "outerBackground", label: "Outer background", group: "Background" },
  { key: "containerBackground", label: "Container", group: "Background" },
  { key: "headerBackground", label: "Header", group: "Background" },
  { key: "bodyBackground", label: "Body", group: "Background" },
  { key: "footerBackground", label: "Footer", group: "Background" },
  { key: "headingColor", label: "Headings", group: "Text" },
  { key: "bodyTextColor", label: "Body text", group: "Text" },
  { key: "footerTextColor", label: "Footer text", group: "Text" },
  { key: "linkColor", label: "Links", group: "Text" },
  { key: "indentBackground", label: "Indent block", group: "Other" },
]

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  const updateField = useCallback(
    (key: keyof EmailTheme, value: string) => {
      onChange({ ...theme, [key]: value })
    },
    [theme, onChange]
  )

  const resetTheme = useCallback(() => {
    onChange({ ...DEFAULT_THEME })
  }, [onChange])

  const groups = THEME_FIELDS.reduce<Record<string, typeof THEME_FIELDS>>(
    (acc, field) => {
      if (!acc[field.group]) acc[field.group] = []
      acc[field.group].push(field)
      return acc
    },
    {}
  )

  return (
    <Collapsible>
      <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
        <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left">
          <Palette className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">Theme Colours</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto transition-transform [[data-state=open]_&]:rotate-180" />
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground shrink-0"
          onClick={resetTheme}
          title="Reset to defaults"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="sr-only">Reset theme to defaults</span>
        </Button>
      </div>

      <CollapsibleContent>
        <div className="flex flex-col gap-4 rounded-b-lg border border-t-0 bg-card px-3 py-3">
          {Object.entries(groups).map(([groupName, fields]) => (
            <div key={groupName} className="flex flex-col gap-2">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                {groupName}
              </span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {fields.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <Label htmlFor={`theme-${key}`} className="text-[11px] text-muted-foreground">
                      {label}
                    </Label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative shrink-0">
                        <input
                          type="color"
                          value={theme[key]}
                          onChange={(e) => updateField(key, e.target.value)}
                          className="absolute inset-0 h-7 w-7 cursor-pointer opacity-0"
                          title={label}
                        />
                        <div
                          className="h-7 w-7 rounded-md border shadow-sm"
                          style={{ backgroundColor: theme[key] }}
                        />
                      </div>
                      <Input
                        id={`theme-${key}`}
                        value={theme[key]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className="h-7 text-xs font-mono flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
