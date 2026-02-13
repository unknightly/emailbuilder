"use client"

import { Heading, AlignLeft, ImageIcon, List, IndentIncrease } from "lucide-react"
import type { ComponentType } from "@/lib/email-types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"

const componentOptions: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
  { type: "heading", label: "Heading", icon: <Heading className="h-4 w-4" /> },
  { type: "paragraph", label: "Paragraph", icon: <AlignLeft className="h-4 w-4" /> },
  { type: "image", label: "Image", icon: <ImageIcon className="h-4 w-4" /> },
  { type: "list", label: "List", icon: <List className="h-4 w-4" /> },
  { type: "indent", label: "Indent", icon: <IndentIncrease className="h-4 w-4" /> },
]

interface AddComponentMenuProps {
  onAdd: (type: ComponentType) => void
}

export function AddComponentMenu({ onAdd }: AddComponentMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Add Component
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="center">
        <div className="flex flex-col gap-1">
          {componentOptions.map((opt) => (
            <button
              key={opt.type}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors text-left"
              onClick={() => {
                onAdd(opt.type)
                setOpen(false)
              }}
            >
              <span className="text-muted-foreground">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
