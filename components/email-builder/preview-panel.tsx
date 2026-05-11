"use client"

import { useState, useCallback, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye, Code, Copy, Check, Braces, ChevronDown, Upload, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PreviewPanelProps {
  html: string
  onUpload?: () => void
  onDownload?: () => void
}

export function PreviewPanel({ html, onUpload, onDownload }: PreviewPanelProps) {
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
        <div className="flex items-center gap-2 border-b px-4 py-2">
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

          {(onUpload || onDownload) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 ml-auto">
                  File
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onUpload && (
                  <DropdownMenuItem onClick={onUpload} className="text-xs gap-2">
                    <Upload className="h-3.5 w-3.5" />
                    Upload JSON
                  </DropdownMenuItem>
                )}
                {onDownload && (
                  <DropdownMenuItem onClick={onDownload} className="text-xs gap-2">
                    <Download className="h-3.5 w-3.5" />
                    Download JSON
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
          <iframe
            srcDoc={html}
            title="Email Preview"
            className="h-full w-full border-0 bg-background"
            sandbox="allow-same-origin"
          />
        </TabsContent>

        <TabsContent value="html" className="flex-1 m-0 overflow-hidden">
          <div className="h-full overflow-auto bg-[hsl(var(--muted))]">
            <div className="flex justify-end p-2 border-b">
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
