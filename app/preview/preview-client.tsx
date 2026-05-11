"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { AppHeader } from "@/components/email-builder/app-header"
import { Button } from "@/components/ui/button"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Clipboard, ClipboardCheck, Trash2, AlertCircle, Eye } from "lucide-react"

/* ─── helpers ─── */
function decodeEntities(encoded: string): string {
  // Replace &amp; last to avoid double-decoding
  return encoded
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&amp;/g, "&")
}

function countEntities(encoded: string): number {
  return (encoded.match(/&[a-zA-Z0-9#]+;/g) || []).length
}

const PLACEHOLDER = `Paste your HTML entity-encoded email here.

For example:
&lt;table width="600"&gt;
  &lt;tr&gt;
    &lt;td style="padding:20px;font-family:Arial,sans-serif;font-size:14px;"&gt;
      &lt;h1&gt;Hello, World!&lt;/h1&gt;
      &lt;p&gt;This is a &lt;strong&gt;preview&lt;/strong&gt; of your email.&lt;/p&gt;
    &lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;`

export default function PreviewClient() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const decoded = input.trim() ? decodeEntities(input) : ""

  /* Push decoded HTML into the iframe */
  useEffect(() => {
    const frame = iframeRef.current
    if (!frame) return
    const doc = frame.contentDocument || frame.contentWindow?.document
    if (!doc) return
    doc.open()
    doc.write(decoded || `<html><body style="margin:0;background:#f9fafb;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;"><p style="color:#9ca3af;font-size:13px;">Paste HTML entities in the left panel to see a preview.</p></body></html>`)
    doc.close()
  }, [decoded])

  const handleCopy = useCallback(async () => {
    if (!decoded) return
    await navigator.clipboard.writeText(decoded)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [decoded])

  const handleClear = useCallback(() => {
    setInput("")
  }, [])

  const entityCount = countEntities(input)
  const charCount = input.length

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader currentPath="/preview">
        <div className="ml-auto flex items-center gap-2">
          {decoded && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard className="h-3.5 w-3.5" />
                  Copy HTML
                </>
              )}
            </Button>
          )}
          {input && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              onClick={handleClear}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </AppHeader>

      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {/* ─── Left: Entity input ─── */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
          <div className="flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">HTML Entities</span>
                {input && (
                  <span className="text-[10px] text-muted-foreground">
                    {charCount.toLocaleString()} chars · {entityCount.toLocaleString()} entities decoded
                  </span>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="flex-1 relative overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={PLACEHOLDER}
                spellCheck={false}
                className="absolute inset-0 w-full h-full resize-none border-0 bg-background px-4 py-3 font-mono text-[12px] leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-t bg-muted/20 shrink-0">
              <AlertCircle className="h-3 w-3 text-muted-foreground shrink-0" />
              <p className="text-[10px] text-muted-foreground">
                Paste entity-encoded HTML. The preview updates live as you type.
              </p>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* ─── Right: Live preview ─── */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30 shrink-0">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Live Preview</span>
              {decoded && (
                <span className="ml-auto text-[10px] text-muted-foreground">
                  Rendered from decoded HTML
                </span>
              )}
            </div>

            {/* iframe preview */}
            <div className="flex-1 bg-muted/10 overflow-hidden">
              <iframe
                ref={iframeRef}
                title="HTML Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
