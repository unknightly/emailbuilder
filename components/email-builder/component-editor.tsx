"use client"

import type { EmailComponent } from "@/lib/email-types"
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
        <div className="ml-auto flex items-center gap-0.5">
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
      </div>

      {/* Editor body */}
      <div className="flex flex-col gap-2">
        {component.type === "heading" && (
          <>
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
                value={component.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Heading text"
                className="h-8 text-sm"
              />
            </div>
          </>
        )}

        {component.type === "paragraph" && (
          <Textarea
            value={component.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Paragraph text..."
            className="min-h-[80px] text-sm resize-y"
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
