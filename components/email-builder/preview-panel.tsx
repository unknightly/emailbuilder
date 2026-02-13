"use client"

import { useState, useCallback, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye, Code, Copy, Check, Braces } from "lucide-react"

interface PreviewPanelProps {
  html: string
}

export function PreviewPanel({ html }: PreviewPanelProps) {
  const [copied, setCopied] = useState(false)
  const [copiedEntities, setCopiedEntities] = useState(false)

  const entitiesHtml = useMemo(() => {
    return html
      .replace(/&/g, "\x26amp;")
      .replace(/</g, "\x26lt;")
      .replace(/>/g, "\x26gt;")
      .replace(/"/g, "\x26quot;")
      .replace(/'/g, "\x26#39;")
  }, [html])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement("textarea")
      textarea.value = html
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [html])

  const copyEntitiesToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(entitiesHtml)
      setCopiedEntities(true)
      setTimeout(() => setCopiedEntities(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = entitiesHtml
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopiedEntities(true)
      setTimeout(() => setCopiedEntities(false), 2000)
    }
  }, [entitiesHtml])

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="preview" className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList className="h-8">
            <TabsTrigger value="preview" className="text-xs gap-1.5 px-3">
              <Eye className="h-3.5 w-3.5" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html" className="text-xs gap-1.5 px-3">
              <Code className="h-3.5 w-3.5" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="entities" className="text-xs gap-1.5 px-3">
              <Braces className="h-3.5 w-3.5" />
              Entities
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy HTML
              </>
            )}
          </Button>
        </div>

        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
          <div className="h-full bg-muted/30 p-4 overflow-auto">
            <div className="mx-auto max-w-[660px]">
              <iframe
                srcDoc={html}
                title="Email Preview"
                className="w-full rounded-md border bg-background shadow-sm"
                style={{ minHeight: "600px", height: "100%" }}
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="html" className="flex-1 m-0 overflow-hidden">
          <div className="h-full overflow-auto bg-[hsl(var(--muted))]">
            <pre className="p-4 text-xs leading-relaxed font-mono text-foreground whitespace-pre-wrap break-words">
              {html}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="entities" className="flex-1 m-0 overflow-hidden">
          <div className="h-full overflow-auto bg-[hsl(var(--muted))]">
            <div className="flex justify-end p-2 border-b">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={copyEntitiesToClipboard}
              >
                {copiedEntities ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy Entities
                  </>
                )}
              </Button>
            </div>
            <pre className="p-4 text-xs leading-relaxed font-mono text-foreground whitespace-pre-wrap break-words">
              {entitiesHtml}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
