"use client"

import { useState, useMemo, useCallback } from "react"
import { AppHeader } from "@/components/email-builder/app-header"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

const DEFAULT_ENTITIES_CODE = `&lt;!DOCTYPE html PUBLIC &quot;-//W3C//DTD HTML 4.01 Transitional//EN&quot; &quot;http://www.w3.org/TR/html4/loose.dtd&quot;&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
  &lt;meta http-equiv=&quot;Content-Type&quot; content=&quot;text/html; charset=UTF-8&quot;&gt;
  &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;
  &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge&quot;&gt;
  &lt;meta name=&quot;format-detection&quot; content=&quot;telephone=no&quot;&gt;
  &lt;title&gt;Email&lt;/title&gt;
  
  &lt;style type=&quot;text/css&quot;&gt;
body {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
table {
  border-spacing: 0;
}
table td {
  border-collapse: collapse;
}
.ExternalClass {
  width: 100%;
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
  line-height: 100%;
}
.ReadMsgBody {
  width: 100%;
  background-color: #F0F0F0;
}
table {
  mso-table-lspace: 0pt;
  mso-table-rspace: 0pt;
}
img {
  -ms-interpolation-mode: bicubic;
}
.yshortcuts a {
  border-bottom: none !important;
}
@media screen and (max-width: 599px) {
  .force-row,
  .container {
    width: 100% !important;
    max-width: 100% !important;
  }
}
@media screen and (max-width: 400px) {
  .container-padding {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}
.ios-footer a {
  color: #aaaaaa !important;
  text-decoration: underline;
}
&lt;/style&gt;
&lt;/head&gt;
 
&lt;body bgcolor=&quot;#F0F0F0&quot; leftmargin=&quot;0&quot; topmargin=&quot;0&quot; marginwidth=&quot;0&quot; marginheight=&quot;0&quot;&gt;
 
&lt;!-- 100% background wrapper --&gt;
&lt;table border=&quot;0&quot; width=&quot;100%&quot; height=&quot;100%&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; bgcolor=&quot;#F0F0F0&quot;&gt;
  &lt;tr&gt;
    &lt;td align=&quot;center&quot; valign=&quot;top&quot; bgcolor=&quot;#F0F0F0&quot; style=&quot;background-color: #F0F0F0;&quot;&gt;
 
      &lt;br&gt;
 
      &lt;!-- 600px container --&gt;
      &lt;table border=&quot;0&quot; width=&quot;600&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; class=&quot;container&quot; style=&quot;width:600px;max-width:600px;background-color:#FFFFFF;&quot;&gt;
        &lt;tr&gt;
          &lt;td class=&quot;container-padding header&quot; align=&quot;left&quot; style=&quot;font-family:Helvetica, Arial, sans-serif;font-size:14px;color:#333333;padding:24px;&quot; bgcolor=&quot;#FFFFFF&quot;&gt;
          &lt;table border=&quot;0&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; width=&quot;100%&quot; style=&quot;padding:0 0 12px 0;&quot;&gt;
  &lt;tr&gt;
    &lt;td align=&quot;left&quot;&gt;
      &lt;img border=&quot;0&quot; style=&quot;display:block;max-width:100%;height:auto;&quot; src=&quot;https://placehold.co/204x67/ffffff/333333?text=Your+Logo&quot; width=&quot;204&quot; alt=&quot;Company Logo&quot; /&gt;
    &lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
        
          &lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
          &lt;td class=&quot;container-padding content&quot; align=&quot;left&quot; style=&quot;padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;&quot; bgcolor=&quot;#FFFFFF&quot;&gt;
&lt;div class=&quot;body-text&quot; style=&quot;font-family:Helvetica, Arial, sans-serif;font-size:14px;text-align:left;color:#333333&quot;&gt;

&lt;p style=&quot;margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Dear $FirstName,&lt;br&gt;User number: $PolicyOwnerNumber&lt;br&gt;&lt;/p&gt;
          &lt;h3 style=&quot;margin:0;padding:0 0 12px 0;font-size:18px;line-height:24px;font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Thanks for doing that thing: $ApplicationReference&lt;/h3&gt;
          &lt;p style=&quot;margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Thank you for your recent enquiry. We are currently reviewing your request and will be in touch shortly.&lt;br&gt;&lt;/p&gt;
          &lt;h3 style=&quot;margin:0;padding:0 0 12px 0;font-size:18px;line-height:24px;font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;What happens next?&lt;/h3&gt;
          &lt;p style=&quot;margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Our team will review the information you have provided. You can track the status of your request by logging into your account.&lt;/p&gt;
          &lt;table border=&quot;0&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; width=&quot;100%&quot; style=&quot;padding:0 0 12px 0;&quot;&gt;
  &lt;tr&gt;
    &lt;td&gt;
      &lt;ul style=&quot;margin:0;padding:0 0 0 24px;&quot;&gt;
        &lt;li style=&quot;padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Item 1&lt;/li&gt;
        &lt;li style=&quot;padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Item 2&lt;/li&gt;
        &lt;li style=&quot;padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Item 3&lt;/li&gt;
      &lt;/ul&gt;
    &lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
          &lt;h3 style=&quot;margin:0;padding:0 0 12px 0;font-size:18px;line-height:24px;font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;We&#39;d love your feedback&lt;/h3&gt;
          &lt;p style=&quot;margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;We&#39;d appreciate it if you could spare a few moments to provide some feedback on your recent experience.&lt;/p&gt;
          &lt;p style=&quot;margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;&quot;&gt;Sincerely,&lt;br&gt;The Team&lt;/p&gt;

&lt;/div&gt;

          &lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
          &lt;td class=&quot;container-padding footer-text&quot; align=&quot;left&quot; style=&quot;font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px;padding-top:8px;&quot; bgcolor=&quot;#F0F0F0&quot;&gt;
          &lt;table border=&quot;0&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; width=&quot;100%&quot; style=&quot;padding:0 0 12px 0;&quot;&gt;
  &lt;tr&gt;
    &lt;td align=&quot;center&quot;&gt;
      &lt;img border=&quot;0&quot; style=&quot;display:block;max-width:100%;height:auto;&quot; src=&quot;https://placehold.co/36x14/f0f0f0/aaaaaa?text=Logo&quot; width=&quot;36&quot; alt=&quot;Footer Logo&quot; /&gt;
    &lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
          &lt;p style=&quot;margin:0;padding:0 0 12px 0;font-size:12px;line-height:16px;color:#aaaaaa;font-family:Helvetica, Arial, sans-serif;&quot;&gt;The way in which we collect, use, store, disclose and secure information is set out in our Privacy Policy, available free of charge on request.&lt;/p&gt;
        
          &lt;/td&gt;
        &lt;/tr&gt;
      &lt;/table&gt;
&lt;!--/600px container --&gt;


    &lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
&lt;!--/100% background wrapper--&gt;

&lt;/body&gt;
&lt;/html&gt;`

export default function LiveEditorPage() {
  const [entitiesCode, setEntitiesCode] = useState(DEFAULT_ENTITIES_CODE)
  const [copied, setCopied] = useState(false)

  const decodedHtml = useMemo(() => {
    // Decode HTML entities to actual HTML
    const textarea = document.createElement("textarea")
    textarea.innerHTML = entitiesCode
    return textarea.value
  }, [entitiesCode])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(decodedHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = decodedHtml
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [decodedHtml])

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader currentPath="/live-editor">
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy HTML
              </>
            )}
          </Button>
        </div>
      </AppHeader>

      <ResizablePanelGroup direction="horizontal" className="flex-1" id="live-editor-panels">
        <ResizablePanel defaultSize={50} minSize={30} id="entities-editor" order={1}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">HTML Entities Code</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <Textarea
                value={entitiesCode}
                onChange={(e) => setEntitiesCode(e.target.value)}
                className="h-full w-full resize-none rounded-none border-0 font-mono text-xs leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Paste HTML entities code here..."
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30} id="live-preview" order={2}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">Live Preview</h2>
            </div>
            <iframe
              srcDoc={decodedHtml}
              title="Live Email Preview"
              className="h-full w-full border-0 bg-background"
              sandbox="allow-same-origin"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
