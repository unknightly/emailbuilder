"use client"

import { HelpCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const formattingRows = [
  {
    syntax: "**text**",
    rendered: <strong>text</strong>,
    label: "Bold",
  },
  {
    syntax: "*text*",
    rendered: <em>text</em>,
    label: "Italic",
  },
  {
    syntax: "__text__",
    rendered: <u>text</u>,
    label: "Underline",
  },
]

const linkRows = [
  {
    syntax: "[text](https://...)",
    note: "Web link",
  },
  {
    syntax: "[text](mailto:a@b.com)",
    note: "Email link",
  },
  {
    syntax: "[text](tel:+61400000000)",
    note: "Phone link",
  },
]

const variables = [
  "$FirstName",
  "$LastName",
  "$PolicyOwnerNumber",
  "$ApplicationReference",
]

export function MarkdownGuide() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Formatting guide"
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span className="sr-only">Formatting guide</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-80 p-0 text-xs">
        <div className="px-3 py-2.5 border-b">
          <p className="font-semibold text-sm">Formatting Guide</p>
          <p className="text-muted-foreground text-[11px] mt-0.5">
            Type syntax directly or use the toolbar buttons.
          </p>
        </div>

        {/* Text formatting */}
        <div className="px-3 py-2 border-b">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Text Formatting</p>
          <div className="flex flex-col gap-2">
            {formattingRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded shrink-0 w-24 text-center">
                  {row.syntax}
                </code>
                <span className="text-muted-foreground shrink-0">→</span>
                <span className="text-[12px]">{row.rendered}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="px-3 py-2 border-b">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Links</p>
          <p className="text-[11px] text-muted-foreground mb-2">
            Use standard markdown link syntax. The link button inserts a template you can edit.
          </p>
          <div className="flex flex-col gap-2">
            {linkRows.map((row) => (
              <div key={row.note} className="flex items-center gap-3">
                <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded shrink-0 truncate max-w-[160px]">
                  {row.syntax}
                </code>
                <span className="text-[11px] text-muted-foreground">{row.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line breaks */}
        <div className="px-3 py-2 border-b">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Line Breaks</p>
          <div className="flex items-center gap-3">
            <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded shrink-0">Enter</code>
            <span className="text-muted-foreground shrink-0">→</span>
            <span className="text-[11px] text-muted-foreground">New line (paragraphs only)</span>
          </div>
        </div>

        {/* Variables */}
        <div className="px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Variables</p>
          <div className="flex flex-wrap gap-1.5">
            {variables.map((v) => (
              <code key={v} className="font-mono text-[11px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">
                {v}
              </code>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Replaced with real values when the email is sent. Insert via the {"{}"} button.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
