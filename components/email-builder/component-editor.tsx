"use client"

import { useRef, useCallback, useState } from "react"
import type { EmailComponent, ParagraphLink, LinkType } from "@/lib/email-types"
import { TEMPLATE_VARIABLES, createId } from "@/lib/email-types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Heading,
  AlignLeft,
  ImageIcon,
  List,
  Minus,
  Code,
  Plus,
  X,
  Link,
  Globe,
  Mail,
  Phone,
  Variable,
  MoreVertical,
} from "lucide-react"

const typeIcons: Record<string, React.ReactNode> = {
  heading: <Heading className="h-3.5 w-3.5" />,
  paragraph: <AlignLeft className="h-3.5 w-3.5" />,
  image: <ImageIcon className="h-3.5 w-3.5" />,
  list: <List className="h-3.5 w-3.5" />,
  "line-item": <Minus className="h-3.5 w-3.5" />,
  html: <Code className="h-3.5 w-3.5" />,
}

const typeLabels: Record<string, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  image: "Image",
  list: "List",
  "line-item": "Line Item",
  html: "HTML",
}

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
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Component actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => onMove("up")}
                disabled={isFirst}
              >
                <ChevronUp className="h-4 w-4" />
                Move up
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onMove("down")}
                disabled={isLast}
              >
                <ChevronDown className="h-4 w-4" />
                Move down
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onRemove}
                className="text-destructive focus:text-destructive"
              >
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
          <HeadingEditor
            component={component}
            onUpdate={onUpdate}
            updateProps={updateProps}
          />
        )}

        {component.type === "paragraph" && (
          <ParagraphEditor
            component={component}
            onUpdate={onUpdate}
            updateProps={updateProps}
          />
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
              <Input
                type="number"
                value={(component.props.width as number) || 600}
                onChange={(e) => updateProps("width", Number(e.target.value))}
                placeholder="Width"
                className="h-8 text-sm w-24"
              />
            </div>
          </>
        )}

        {component.type === "list" && (
          <ListEditor
            items={(component.props.items as string[]) || []}
            onChange={(items) => updateProps("items", items)}
          />
        )}

        {component.type === "line-item" && (
          <div className="flex items-center gap-2">
            <Input
              value={(component.props.label as string) || ""}
              onChange={(e) => updateProps("label", e.target.value)}
              placeholder="Label"
              className="h-8 text-sm"
            />
            <Input
              value={(component.props.value as string) || ""}
              onChange={(e) => updateProps("value", e.target.value)}
              placeholder="Value"
              className="h-8 text-sm w-32"
            />
          </div>
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

/* ─── Shared Rich Text Toolbar + Links Editor ─── */

const linkTypeIcons: Record<LinkType, React.ReactNode> = {
  web: <Globe className="h-3 w-3" />,
  email: <Mail className="h-3 w-3" />,
  telephone: <Phone className="h-3 w-3" />,
}

const linkTypePlaceholders: Record<LinkType, string> = {
  web: "https://example.com",
  email: "hello@example.com",
  telephone: "+61 400 000 000",
}

function useRichTextEditor({
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
      const before = component.content.slice(0, start)
      const after = component.content.slice(end)
      onUpdate({ content: before + text + after })
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + text.length
        el.focus()
      })
    },
    [component.content, onUpdate, inputRef]
  )

  const commitLink = useCallback(
    (link: ParagraphLink) => {
      updateProps("links", [...links, link])
      insertAtCursor(`[link:${link.id}]`)
    },
    [links, updateProps, insertAtCursor]
  )

  const updateLink = useCallback(
    (linkId: string, updates: Partial<ParagraphLink>) => {
      updateProps("links", links.map((l) => (l.id === linkId ? { ...l, ...updates } : l)))
    },
    [links, updateProps]
  )

  const removeLink = useCallback(
    (linkId: string) => {
      updateProps("links", links.filter((l) => l.id !== linkId))
      const placeholder = `[link:${linkId}]`
      if (component.content.includes(placeholder)) {
        onUpdate({ content: component.content.replace(placeholder, "") })
      }
    },
    [links, updateProps, component.content, onUpdate]
  )

  return { links, insertAtCursor, commitLink, updateLink, removeLink }
}

/* ─── Add Link Dialog ─── */

function AddLinkDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (link: ParagraphLink) => void
}) {
  const [linkType, setLinkType] = useState<LinkType>("web")
  const [text, setText] = useState("")
  const [url, setUrl] = useState("")

  const reset = () => {
    setLinkType("web")
    setText("")
    setUrl("")
  }

  const handleConfirm = () => {
    if (!text.trim() || !url.trim()) return
    onConfirm({
      id: createId(),
      text: text.trim(),
      url: url.trim(),
      linkType,
    })
    reset()
    onOpenChange(false)
  }

  const handleCancel = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleCancel(); else onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Insert Link</DialogTitle>
          <DialogDescription>Choose a link type and fill in the details.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {/* Link type selector */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Link type</Label>
            <div className="flex gap-2">
              {(["web", "email", "telephone"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLinkType(type)}
                  className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                    linkType === type
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  {type === "web" && <Globe className="h-3.5 w-3.5" />}
                  {type === "email" && <Mail className="h-3.5 w-3.5" />}
                  {type === "telephone" && <Phone className="h-3.5 w-3.5" />}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Display text */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-text" className="text-xs font-medium">Display text</Label>
            <Input
              id="link-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={linkType === "telephone" ? "Call us" : linkType === "email" ? "Email us" : "Click here"}
              className="text-sm"
            />
            <p className="text-[11px] text-muted-foreground">The text the reader will see and click on.</p>
          </div>

          {/* URL / destination */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-url" className="text-xs font-medium">
              {linkType === "email" ? "Email address" : linkType === "telephone" ? "Phone number" : "Web URL"}
            </Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={linkTypePlaceholders[linkType]}
              className="text-sm font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              {linkType === "email"
                ? "The email address to open in the reader's mail client."
                : linkType === "telephone"
                ? "The phone number to dial when tapped."
                : "The full URL to navigate to. Include https://."}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!text.trim() || !url.trim()}
          >
            Insert Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Rich Text Toolbar ─── */

function RichTextToolbar({
  insertAtCursor,
  onAddLink,
}: {
  insertAtCursor: (text: string) => void
  onAddLink: () => void
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
            <Variable className="h-3 w-3" />
            Variable
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-1" align="start">
          <div className="flex flex-col">
            {TEMPLATE_VARIABLES.map((v) => (
              <button
                key={v}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left font-mono"
                onClick={() => insertAtCursor(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={onAddLink}>
        <Link className="h-3 w-3" />
        Link
      </Button>
    </div>
  )
}

/* ─── Inline Links List ─── */

function LinksEditor({
  links,
  updateLink,
  removeLink,
}: {
  links: ParagraphLink[]
  updateLink: (linkId: string, updates: Partial<ParagraphLink>) => void
  removeLink: (linkId: string) => void
}) {
  if (links.length === 0) return null

  const linkTypeLabels: Record<LinkType, string> = {
    web: "Web",
    email: "Email",
    telephone: "Phone",
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-md border bg-muted/50 p-2">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Links</span>
      {links.map((link) => (
        <div key={link.id} className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5">
          <span className="text-muted-foreground shrink-0">
            {link.linkType === "web" && <Globe className="h-3.5 w-3.5" />}
            {link.linkType === "email" && <Mail className="h-3.5 w-3.5" />}
            {link.linkType === "telephone" && <Phone className="h-3.5 w-3.5" />}
          </span>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium truncate">{link.text || "Untitled"}</span>
            <span className="text-[11px] text-muted-foreground font-mono truncate">
              {link.url || <span className="italic">No URL set</span>}
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
            {linkTypeLabels[link.linkType]}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => removeLink(link.id)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove link</span>
          </Button>
        </div>
      ))}
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const { links, insertAtCursor, commitLink, updateLink, removeLink } = useRichTextEditor({
    component,
    onUpdate,
    updateProps,
    inputRef,
  })

  return (
    <div className="flex flex-col gap-2">
      <RichTextToolbar insertAtCursor={insertAtCursor} onAddLink={() => setLinkDialogOpen(true)} />
      <div className="flex items-center gap-2">
        <Select
          value={String(component.props.level || 1)}
          onValueChange={(val) => updateProps("level", Number(val))}
        >
          <SelectTrigger className="w-20 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
          </SelectContent>
        </Select>
        <Input
          ref={inputRef}
          value={component.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Heading text"
          className="h-8 text-sm"
        />
      </div>
      <LinksEditor links={links} updateLink={updateLink} removeLink={removeLink} />
      <AddLinkDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen} onConfirm={commitLink} />
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const { links, insertAtCursor, commitLink, updateLink, removeLink } = useRichTextEditor({
    component,
    onUpdate,
    updateProps,
    inputRef: textareaRef,
  })

  return (
    <div className="flex flex-col gap-2">
      <RichTextToolbar insertAtCursor={insertAtCursor} onAddLink={() => setLinkDialogOpen(true)} />
      <Textarea
        ref={textareaRef}
        value={component.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Paragraph text... (use Enter for line breaks)"
        className="min-h-[80px] text-sm resize-y font-mono"
      />
      <LinksEditor links={links} updateLink={updateLink} removeLink={removeLink} />
      <AddLinkDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen} onConfirm={commitLink} />
    </div>
  )
}

/* ─── List Editor ─── */

function ListEditor({
  items,
  onChange,
}: {
  items: string[]
  onChange: (items: string[]) => void
}) {
  const updateItem = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange(newItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, "New item"])
  }

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs w-4 text-right shrink-0">
            {index + 1}.
          </span>
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="h-7 text-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(index)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-muted-foreground"
        onClick={addItem}
      >
        <Plus className="mr-1 h-3 w-3" />
        Add item
      </Button>
    </div>
  )
}
