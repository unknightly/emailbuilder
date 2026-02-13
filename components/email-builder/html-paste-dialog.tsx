"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Code } from "lucide-react"

interface HtmlPasteDialogProps {
  onInsert: (html: string) => void
}

export function HtmlPasteDialog({ onInsert }: HtmlPasteDialogProps) {
  const [open, setOpen] = useState(false)
  const [html, setHtml] = useState("")

  const handleInsert = () => {
    if (html.trim()) {
      onInsert(html.trim())
      setHtml("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Code className="mr-2 h-3.5 w-3.5" />
          Paste HTML
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Paste HTML Code</DialogTitle>
          <DialogDescription>
            Paste raw HTML to inject into this section. It will be rendered as-is in the email.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder={'<table role="presentation">\\n  <tr>\\n    <td>Your custom HTML...</td>\\n  </tr>\\n</table>'}
          className="min-h-[200px] font-mono text-sm"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!html.trim()}>
            Insert HTML
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
