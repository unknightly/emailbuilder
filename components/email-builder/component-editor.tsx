"use client"

import { useRef, useCallback, useState } from "react"
import type { EmailComponent, ParagraphLink, LinkType } from "@/lib/email-types"
import { TEMPLATE_VARIABLES, createId } from "@/lib/email-types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VisualTextInput } from "./visual-text-input"
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
  Globe,
  Mail,
  Phone,
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

const linkTypeConfig: Record<LinkType, { icon: React.ReactNode; label: string; placeholder: string; urlLabel: string }> = {
  web: { icon: <Globe className="h-3.5 w-3.5" />, label: "Web", placeholder: "https://example.com", urlLabel: "URL" },
  email: { icon: <Mail className="h-3.5 w-3.5" />, label: "Email", placeholder: "hello@example.com", urlLabel: "Email" },
  telephone: { icon: <Phone className="h-3.5 w-3.5" />, label: "Phone", placeholder: "+61 400 000 000", urlLabel: "Phone" },
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
          <Textarea
            value={component.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Indented content... (use Enter for line breaks)"
            className="min-h-[60px] text-sm resize-y"
          />
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

/* ─── Rich Text Hook ─── */

function useRichText({
  component,
  onUpdate,
  updateProps,
  inputRef,
}: {
  component: EmailComponent
  onUpdate: (updates: Partial<EmailComponent>) => void
  updateProps: (key: string, value: unknown) => void
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>
}) {
  const links = (component.props.links as ParagraphLink[]) || []

  const insertAtCursor = useCallback(
    (text: string) => {
      const el = inputRef.current
      if (!el) {
        onUpdate({ content: component.content + text })
        return
      }
      const start = el.selectionStart ?? component.content.length
      const end = el.selectionEnd ?? component.content.length
      onUpdate({ content: component.content.slice(0, start) + text + component.content.slice(end) })
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + text.length
        el.focus()
      })
    },
    [component.content, onUpdate, inputRef],
  )

  const addLink = useCallback(
    (link: ParagraphLink) => {
      updateProps("links", [...links, link])
      insertAtCursor(`[link:${link.id}]`)
    },
    [links, updateProps, insertAtCursor],
  )

  const removeLink = useCallback(
    (linkId: string) => {
      updateProps("links", links.filter((l) => l.id !== linkId))
      const placeholder = `[link:${linkId}]`
      if (component.content.includes(placeholder)) {
        onUpdate({ content: component.content.replace(placeholder, "") })
      }
    },
    [links, updateProps, component.content, onUpdate],
  )

  const wrapSelection = useCallback(
    (prefix: string, suffix: string) => {
      const el = inputRef.current
      if (!el) return
      const start = el.selectionStart ?? 0
      const end = el.selectionEnd ?? 0
      const text = component.content
      const selected = text.slice(start, end)

      // If selection is already wrapped, unwrap it
      const beforePrefix = text.slice(Math.max(0, start - prefix.length), start)
      const afterSuffix = text.slice(end, end + suffix.length)
      if (beforePrefix === prefix && afterSuffix === suffix) {
        const newContent =
          text.slice(0, start - prefix.length) + selected + text.slice(end + suffix.length)
        onUpdate({ content: newContent })
        requestAnimationFrame(() => {
          el.selectionStart = start - prefix.length
          el.selectionEnd = end - prefix.length
          el.focus()
        })
        return
      }

      const wrapped = prefix + selected + suffix
      const newContent = text.slice(0, start) + wrapped + text.slice(end)
      onUpdate({ content: newContent })
      requestAnimationFrame(() => {
        if (selected.length > 0) {
          el.selectionStart = start + prefix.length
          el.selectionEnd = end + prefix.length
        } else {
          el.selectionStart = el.selectionEnd = start + prefix.length
        }
        el.focus()
      })
    },
    [component.content, onUpdate, inputRef],
  )

  return { links, insertAtCursor, wrapSelection, addLink, removeLink }
}

/* ─── Inline Link Creator ─── */

function InlineLinkCreator({ onAdd, onCancel }: { onAdd: (link: ParagraphLink) => void; onCancel: () => void }) {
  const [linkType, setLinkType] = useState<LinkType>("web")
  const [text, setText] = useState("")
  const [url, setUrl] = useState("")

  const handleAdd = () => {
    if (!text.trim() || !url.trim()) return
    onAdd({ id: createId(), text: text.trim(), url: url.trim(), linkType })
    setText("")
    setUrl("")
  }

  const cfg = linkTypeConfig[linkType]

  return (
    <div className="rounded-md border bg-muted/30 p-2.5 flex flex-col gap-2">
      {/* Type toggle */}
      <div className="flex items-center gap-1">
        {(["web", "email", "telephone"] as const).map((type) => {
          const c = linkTypeConfig[type]
          return (
            <button
              key={type}
              type="button"
              onClick={() => setLinkType(type)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                linkType === type
                  ? "bg-foreground text-background"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.icon}
              {c.label}
            </button>
          )
        })}
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-muted-foreground" onClick={onCancel}>
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
      {/* Fields */}
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <Label className="text-[10px] text-muted-foreground">Display text</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Click here" className="h-7 text-xs" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <Label className="text-[10px] text-muted-foreground">{cfg.urlLabel}</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
            placeholder={cfg.placeholder}
            className="h-7 text-xs font-mono"
          />
        </div>
        <Button size="sm" className="h-7 text-xs shrink-0" disabled={!text.trim() || !url.trim()} onClick={handleAdd}>
          Insert
        </Button>
      </div>
    </div>
  )
}

/* ─── Links Summary ─── */

function LinksList({ links, onRemove }: { links: ParagraphLink[]; onRemove: (id: string) => void }) {
  if (links.length === 0) return null

  return (
    <div className="flex flex-col gap-1">
      {links.map((link) => {
        const cfg = linkTypeConfig[link.linkType]
        return (
          <div key={link.id} className="flex items-center gap-2 rounded-md bg-muted/40 px-2 py-1">
            <span className="text-muted-foreground shrink-0">{cfg.icon}</span>
            <span className="text-xs truncate flex-1">
              <span className="font-medium">{link.text}</span>
              <span className="text-muted-foreground mx-1">-</span>
              <span className="text-muted-foreground font-mono text-[11px]">{link.url}</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(link.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove link</span>
            </Button>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Rich Text Field (shared by Heading + Paragraph) ─── */

function RichTextField({
  component,
  onUpdate,
  updateProps,
  multiline,
}: {
  component: EmailComponent
  onUpdate: (updates: Partial<EmailComponent>) => void
  updateProps: (key: string, value: unknown) => void
  multiline: boolean
}) {
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null)
  const [showLinkCreator, setShowLinkCreator] = useState(false)
  const { links, insertAtCursor, wrapSelection, addLink, removeLink } = useRichText({ component, onUpdate, updateProps, inputRef })

  const handleAddLink = (link: ParagraphLink) => {
    addLink(link)
    setShowLinkCreator(false)
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Unified toolbar */}
      <div className="flex items-center border rounded-t-md bg-muted/40 px-1.5 py-1 gap-px">
        {/* Formatting group */}
        <button
          type="button"
          title="Bold (**text**)"
          onClick={() => wrapSelection("**", "**")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Bold className="h-3.5 w-3.5" />
          <span className="sr-only">Bold</span>
        </button>
        <button
          type="button"
          title="Italic (*text*)"
          onClick={() => wrapSelection("*", "*")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Italic className="h-3.5 w-3.5" />
          <span className="sr-only">Italic</span>
        </button>
        <button
          type="button"
          title="Underline (__text__)"
          onClick={() => wrapSelection("__", "__")}
          className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Underline className="h-3.5 w-3.5" />
          <span className="sr-only">Underline</span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* Link toggle */}
        <button
          type="button"
          title="Insert link"
          onClick={() => setShowLinkCreator(!showLinkCreator)}
          className={`inline-flex items-center justify-center rounded h-7 w-7 transition-colors ${
            showLinkCreator
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
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
                onClick={() => insertAtCursor(v)}
                className="font-mono text-xs"
              >
                {v}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Link creator (inline, slides in below toolbar) */}
      {showLinkCreator && (
        <div className="border-x border-b bg-muted/20 p-2">
          <InlineLinkCreator onAdd={handleAddLink} onCancel={() => setShowLinkCreator(false)} />
        </div>
      )}

      {/* Text input - connects visually to toolbar */}
      <div className={`border ${showLinkCreator ? "" : "rounded-b-md"} border-t-0 px-3 py-2`}>
        <VisualTextInput
          value={component.content}
          onChange={(newValue) => onUpdate({ content: newValue })}
          placeholder={multiline ? "Enter text... (use Enter for line breaks)" : "Enter text..."}
          multiline={multiline}
        />
      </div>

      {/* Existing links summary */}
      {links.length > 0 && (
        <div className="mt-2">
          <LinksList links={links} onRemove={removeLink} />
        </div>
      )}
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
      <RichTextField component={component} onUpdate={onUpdate} updateProps={updateProps} multiline={false} />
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
    <RichTextField component={component} onUpdate={onUpdate} updateProps={updateProps} multiline={true} />
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
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs w-4 text-right shrink-0">{i + 1}.</span>
          <Input value={item} onChange={(e) => updateItem(i, e.target.value)} className="h-7 text-sm" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
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
