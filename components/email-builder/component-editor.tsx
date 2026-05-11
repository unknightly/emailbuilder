"use client"

import { useRef, useState } from "react"
import type { EmailComponent } from "@/lib/email-types"
import { TEMPLATE_VARIABLES } from "@/lib/email-types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VisualTextInput, type VisualTextInputHandle } from "./visual-text-input"
import { MarkdownGuide } from "./markdown-guide"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Heading,
  AlignLeft,
  ImageIcon,
  List,
  IndentIncrease,
  Code,
  Plus,
  X,
  Link2,
  MoreVertical,
  Bold,
  Italic,
  Underline,
  Braces,
} from "lucide-react"

/* ─── Constants ─── */

const typeIcons: Record<string, React.ReactNode> = {
  heading: <Heading className="h-3.5 w-3.5" />,
  paragraph: <AlignLeft className="h-3.5 w-3.5" />,
  image: <ImageIcon className="h-3.5 w-3.5" />,
  list: <List className="h-3.5 w-3.5" />,
  indent: <IndentIncrease className="h-3.5 w-3.5" />,
  html: <Code className="h-3.5 w-3.5" />,
}

const typeLabels: Record<string, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  image: "Image",
  list: "List",
  indent: "Indent",
  html: "HTML",
}

/* ─── Main Component Editor ─── */

interface ComponentEditorProps {
  component: EmailComponent
  onUpdate: (updates: Partial<EmailComponent>) => void
  onRemove: () => void
  onMove: (direction: "up" | "down") => void
  isFirst: boolean
  isLast: boolean
}

export function ComponentEditor({
  component,
  onUpdate,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: ComponentEditorProps) {
  const updateProps = (key: string, value: unknown) => {
    onUpdate({ props: { ...component.props, [key]: value } })
  }

  return (
    <div className="group rounded-lg border bg-card p-3 transition-colors hover:border-foreground/20">
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-foreground">{typeIcons[component.type]}</span>
        <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0">
          {typeLabels[component.type]}
        </Badge>
        {/* Inline actions - visible on md+ */}
        <div className="ml-auto hidden md:flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onMove("up")}
            disabled={isFirst}
          >
            <ChevronUp className="h-3.5 w-3.5" />
            <span className="sr-only">Move up</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onMove("down")}
            disabled={isLast}
          >
            <ChevronDown className="h-3.5 w-3.5" />
            <span className="sr-only">Move down</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>

        {/* Kebab menu - visible on small screens only */}
        <div className="ml-auto md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Component actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onMove("up")} disabled={isFirst}>
                <ChevronUp className="h-4 w-4" />
                Move up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove("down")} disabled={isLast}>
                <ChevronDown className="h-4 w-4" />
                Move down
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-col gap-2">
        {component.type === "heading" && (
          <HeadingEditor component={component} onUpdate={onUpdate} updateProps={updateProps} />
        )}
        {component.type === "paragraph" && (
          <ParagraphEditor component={component} onUpdate={onUpdate} updateProps={updateProps} />
        )}
        {component.type === "image" && (
          <>
            <Input
              value={component.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Image URL"
              className="h-8 text-sm font-mono"
            />
            <div className="flex items-center gap-2">
              <Input
                value={(component.props.alt as string) || ""}
                onChange={(e) => updateProps("alt", e.target.value)}
                placeholder="Alt text"
                className="h-8 text-sm"
              />
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  value={(component.props.width as number) || 600}
                  onChange={(e) => updateProps("width", Number(e.target.value))}
                  placeholder="Width"
                  className="h-8 text-sm w-24"
                />
                <span className="text-xs text-muted-foreground shrink-0">px</span>
              </div>
            </div>
          </>
        )}
        {component.type === "list" && (
          <ListEditor
            items={(component.props.items as string[]) || []}
            onChange={(items) => updateProps("items", items)}
          />
        )}
        {component.type === "indent" && (
          <IndentEditor component={component} onUpdate={onUpdate} updateProps={updateProps} />
        )}
        {component.type === "html" && (
          <pre className="rounded-md bg-muted p-3 text-xs font-mono overflow-x-auto max-h-32 overflow-y-auto text-muted-foreground">
            {component.content}
          </pre>
        )}
      </div>
    </div>
  )
}

/* ─── Rich Text Field (shared by Heading + Paragraph) ─── */

function RichTextField({
  component,
  onUpdate,
  multiline,
}: {
  component: EmailComponent
  onUpdate: (updates: Partial<EmailComponent>) => void
  updateProps?: (key: string, value: unknown) => void
  multiline: boolean
}) {
  const visualInputRef = useRef<VisualTextInputHandle>(null)

  return (
    <div className="flex flex-col gap-0">
      {/* Unified toolbar */}
      <div className="flex items-center border rounded-t-md bg-muted/40 px-1.5 py-1 gap-px">
        <button
          type="button"
          title="Bold"
          onClick={() => visualInputRef.current?.wrapSelection("**", "**")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Bold className="h-3.5 w-3.5" />
          <span className="sr-only">Bold</span>
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => visualInputRef.current?.wrapSelection("*", "*")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Italic className="h-3.5 w-3.5" />
          <span className="sr-only">Italic</span>
        </button>
        <button
          type="button"
          title="Underline"
          onClick={() => visualInputRef.current?.wrapSelection("__", "__")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Underline className="h-3.5 w-3.5" />
          <span className="sr-only">Underline</span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* Link — inserts markdown link syntax at cursor */}
        <button
          type="button"
          title="Insert link"
          onClick={() => visualInputRef.current?.insertText("[link text](https://)")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Link2 className="h-3.5 w-3.5" />
          <span className="sr-only">Insert link</span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* Variable dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Insert variable"
              className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Braces className="h-3.5 w-3.5" />
              <span className="sr-only">Insert variable</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {TEMPLATE_VARIABLES.map((v) => (
              <DropdownMenuItem
                key={v}
                onClick={() => visualInputRef.current?.insertText(v)}
                className="font-mono text-xs"
              >
                {v}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        <MarkdownGuide />
      </div>

      {/* Text input */}
      <div className="border rounded-b-md border-t-0 px-3 py-2">
        <VisualTextInput
          ref={visualInputRef}
          value={component.content}
          onChange={(newValue) => onUpdate({ content: newValue })}
          placeholder={multiline ? "Enter text... (use Enter for line breaks)" : "Enter text..."}
          multiline={multiline}
        />
      </div>
    </div>
  )
}

/* ─── Heading Editor ─── */

function HeadingEditor({
  component,
  onUpdate,
  updateProps,
}: {
  component: EmailComponent
  onUpdate: (updates: Partial<EmailComponent>) => void
  updateProps: (key: string, value: unknown) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Select
        value={String(component.props.level || 1)}
        onValueChange={(val) => updateProps("level", Number(val))}
      >
        <SelectTrigger className="w-20 h-7 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">H1</SelectItem>
          <SelectItem value="2">H2</SelectItem>
          <SelectItem value="3">H3</SelectItem>
          <SelectItem value="4">H4</SelectItem>
        </SelectContent>
      </Select>
      <RichTextField component={component} onUpdate={onUpdate} multiline={false} />
    </div>
  )
}

/* ─── Paragraph Editor ─── */

function ParagraphEditor({
  component,
  onUpdate,
  updateProps,
}: {
  component: EmailComponent
  onUpdate: (updates: Partial<EmailComponent>) => void
  updateProps: (key: string, value: unknown) => void
}) {
  return (
    <RichTextField component={component} onUpdate={onUpdate} multiline={true} />
  )
}

/* ─── Indent Editor ─── */

function IndentEditor({
  component,
  onUpdate,
  updateProps,
}: {
  component: EmailComponent
  onUpdate: (updates: Partial<EmailComponent>) => void
  updateProps: (key: string, value: unknown) => void
}) {
  const visualInputRef = useRef<VisualTextInputHandle>(null)

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center border rounded-t-md bg-muted/40 px-1.5 py-1 gap-px">
        <button
          type="button"
          title="Bold"
          onClick={() => visualInputRef.current?.wrapSelection("**", "**")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Bold className="h-3.5 w-3.5" />
          <span className="sr-only">Bold</span>
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => visualInputRef.current?.wrapSelection("*", "*")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Italic className="h-3.5 w-3.5" />
          <span className="sr-only">Italic</span>
        </button>
        <button
          type="button"
          title="Underline"
          onClick={() => visualInputRef.current?.wrapSelection("__", "__")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Underline className="h-3.5 w-3.5" />
          <span className="sr-only">Underline</span>
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <MarkdownGuide />
      </div>
      <div className="border rounded-b-md border-t-0 px-3 py-2">
        <VisualTextInput
          ref={visualInputRef}
          value={component.content}
          onChange={(newValue) => onUpdate({ content: newValue })}
          placeholder="Indented content... (use Enter for line breaks)"
          multiline={true}
        />
      </div>
    </div>
  )
}

/* ─── List Editor ─── */

function ListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const updateItem = (index: number, value: string) => {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <span className="text-muted-foreground text-xs w-4 text-right shrink-0 mt-1.5">{i + 1}.</span>
          <div className="flex-1 border rounded-md px-2.5 py-1.5 bg-background focus-within:ring-1 focus-within:ring-ring">
            <VisualTextInput
              value={item}
              onChange={(v) => updateItem(i, v)}
              placeholder="List item..."
              multiline={false}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive mt-0.5"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => onChange([...items, "New item"])}>
        <Plus className="mr-1 h-3 w-3" />
        Add item
      </Button>
    </div>
  )
}
