"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { AppHeader } from "@/components/email-builder/app-header"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Trash2, Plus } from "lucide-react"
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

// Pure string-based entity decoder (no DOM needed, works on server + client)
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
}

function encodeEntities(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Inject interactive editing styles + scripts into the iframe
function buildInteractiveDoc(html: string): string {
  const editStyles = `
<style>
  [data-editable]:hover {
    outline: 2px solid #1a73e8 !important;
    outline-offset: 2px !important;
    cursor: text !important;
  }
  [data-editable]:focus {
    outline: 2px solid #1a73e8 !important;
    outline-offset: 2px !important;
    background: rgba(26,115,232,0.04) !important;
  }
  img[data-editable-img]:hover {
    outline: 2px solid #1a73e8 !important;
    outline-offset: 2px !important;
    cursor: pointer !important;
  }
  .v0-add-zone {
    position: relative;
    height: 16px;
    margin: 0;
    padding: 0;
  }
  .v0-add-btn {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 3px 10px;
    font-size: 11px;
    font-family: system-ui, sans-serif;
    background: #1a73e8;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    z-index: 100;
  }
  .v0-add-zone:hover .v0-add-btn {
    display: block;
  }
  .v0-add-zone:hover {
    background: rgba(26,115,232,0.06);
    border-radius: 4px;
  }
</style>`

  const editScript = `
<script>
(function() {
  // Make text elements editable
  var selectors = 'p, h1, h2, h3, h4, h5, h6, li';
  document.querySelectorAll(selectors).forEach(function(el) {
    // Skip if inside a spacer/add zone
    if (el.closest('.v0-add-zone')) return;
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-editable', 'true');
  });

  // Mark images as editable
  document.querySelectorAll('img').forEach(function(img) {
    img.setAttribute('data-editable-img', 'true');
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var newSrc = prompt('Enter new image URL:', img.src);
      if (newSrc && newSrc !== img.src) {
        img.src = newSrc;
        syncToParent();
      }
    });
  });

  // Insert add-zones between content elements inside body-text
  var bodyText = document.querySelector('.body-text');
  if (bodyText) {
    var children = Array.from(bodyText.children).filter(function(c) {
      return !c.classList.contains('v0-add-zone');
    });
    for (var i = 0; i < children.length; i++) {
      var zone = document.createElement('div');
      zone.className = 'v0-add-zone';
      var btn = document.createElement('button');
      btn.className = 'v0-add-btn';
      btn.textContent = '+ Add Component';
      btn.setAttribute('data-insert-after', String(i));
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-insert-after'));
        handleAdd(idx);
      });
      zone.appendChild(btn);
      children[i].after(zone);
    }
  }

  // Also add a zone at the very top of body-text
  if (bodyText && bodyText.firstElementChild && !bodyText.firstElementChild.classList.contains('v0-add-zone')) {
    var topZone = document.createElement('div');
    topZone.className = 'v0-add-zone';
    var topBtn = document.createElement('button');
    topBtn.className = 'v0-add-btn';
    topBtn.textContent = '+ Add Component';
    topBtn.setAttribute('data-insert-after', '-1');
    topBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleAdd(-1);
    });
    topZone.appendChild(topBtn);
    bodyText.insertBefore(topZone, bodyText.firstElementChild);
  }

  function handleAdd(afterIdx) {
    var type = prompt('Component type: paragraph, heading, or image', 'paragraph');
    if (!type) return;
    type = type.trim().toLowerCase();

    var newEl;
    if (type === 'heading' || type === 'h3') {
      var text = prompt('Heading text:', 'New heading');
      if (!text) return;
      newEl = document.createElement('h3');
      newEl.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:18px;line-height:24px;font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;';
      newEl.textContent = text;
      newEl.setAttribute('contenteditable', 'true');
      newEl.setAttribute('data-editable', 'true');
    } else if (type === 'image' || type === 'img') {
      var src = prompt('Image URL:', 'https://placehold.co/400x200');
      if (!src) return;
      newEl = document.createElement('img');
      newEl.src = src;
      newEl.alt = 'Image';
      newEl.style.cssText = 'display:block;max-width:100%;height:auto;padding:0 0 12px 0;';
      newEl.setAttribute('data-editable-img', 'true');
      newEl.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var ns = prompt('Enter new image URL:', newEl.src);
        if (ns && ns !== newEl.src) { newEl.src = ns; syncToParent(); }
      });
    } else {
      var pText = prompt('Paragraph text:', 'New paragraph');
      if (!pText) return;
      newEl = document.createElement('p');
      newEl.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;';
      newEl.textContent = pText;
      newEl.setAttribute('contenteditable', 'true');
      newEl.setAttribute('data-editable', 'true');
    }

    var bt = document.querySelector('.body-text');
    if (!bt) return;

    // Get content children (skip add zones)
    var contentKids = Array.from(bt.children).filter(function(c) { return !c.classList.contains('v0-add-zone'); });

    if (afterIdx < 0) {
      bt.insertBefore(newEl, bt.firstElementChild);
    } else if (afterIdx < contentKids.length) {
      contentKids[afterIdx].after(newEl);
    } else {
      bt.appendChild(newEl);
    }

    // Add a new zone after the new element
    var nz = document.createElement('div');
    nz.className = 'v0-add-zone';
    var nb = document.createElement('button');
    nb.className = 'v0-add-btn';
    nb.textContent = '+ Add Component';
    nb.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      // Simple: just add after this new element
      var allContent = Array.from(bt.children).filter(function(c) { return !c.classList.contains('v0-add-zone'); });
      var myIdx = allContent.indexOf(newEl);
      handleAdd(myIdx);
    });
    nz.appendChild(nb);
    newEl.after(nz);

    syncToParent();
  }

  // Sync edits back to parent
  function syncToParent() {
    // Remove add zones before serializing
    var clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('.v0-add-zone').forEach(function(z) { z.remove(); });
    clone.querySelectorAll('[data-editable]').forEach(function(el) {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-editable');
    });
    clone.querySelectorAll('[data-editable-img]').forEach(function(el) {
      el.removeAttribute('data-editable-img');
    });
    // Remove the injected style and script
    clone.querySelectorAll('style').forEach(function(s) {
      if (s.textContent.indexOf('v0-add-zone') !== -1) s.remove();
    });
    clone.querySelectorAll('script').forEach(function(s) { s.remove(); });

    var cleanHtml = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\\n' + clone.outerHTML;
    window.parent.postMessage({ type: 'v0-live-editor-sync', html: cleanHtml }, '*');
  }

  // Sync on blur (text edit finished)
  document.addEventListener('blur', function(e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-editable')) {
      syncToParent();
    }
  }, true);

  // Also sync on input for more responsiveness
  document.addEventListener('input', function(e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-editable')) {
      // Debounce
      clearTimeout(window._v0SyncTimer);
      window._v0SyncTimer = setTimeout(syncToParent, 500);
    }
  }, true);
})();
<\/script>`

  // Inject styles before </head> and script before </body>
  let result = html
  if (result.includes("</head>")) {
    result = result.replace("</head>", editStyles + "\n</head>")
  } else {
    result = editStyles + result
  }
  if (result.includes("</body>")) {
    result = result.replace("</body>", editScript + "\n</body>")
  } else {
    result = result + editScript
  }
  return result
}

export default function LiveEditorPage() {
  const [entitiesCode, setEntitiesCode] = useState(DEFAULT_ENTITIES_CODE)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Decode entities using pure string replacement (SSR-safe)
  const decodedHtml = useMemo(() => decodeEntities(entitiesCode), [entitiesCode])

  // Build iframe doc with interactive editing injected
  const iframeSrcDoc = useMemo(() => buildInteractiveDoc(decodedHtml), [decodedHtml])

  // Listen for sync messages from iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "v0-live-editor-sync" && typeof e.data.html === "string") {
        setEntitiesCode(encodeEntities(e.data.html))
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(decodedHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = decodedHtml
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [decodedHtml])

  const clearCode = useCallback(() => {
    setEntitiesCode("")
  }, [])

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
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5 text-muted-foreground"
                onClick={clearCode}
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
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
              <h2 className="text-sm font-semibold tracking-tight">
                Live Preview
              </h2>
              <span className="text-[11px] text-muted-foreground">
                Click text to edit, hover between elements to add
              </span>
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={iframeSrcDoc}
              title="Live Email Preview"
              className="h-full w-full border-0 bg-background"
              sandbox="allow-same-origin allow-scripts allow-modals"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
