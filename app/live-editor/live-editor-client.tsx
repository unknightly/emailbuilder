"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { AppHeader } from "@/components/email-builder/app-header"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Copy,
  Check,
  Trash2,
  Bold,
  Italic,
  Underline,
  Link2,
  Braces,
  Plus,
  X,
} from "lucide-react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { TEMPLATE_VARIABLES } from "@/lib/email-types"

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

// ── SSR-safe entity encode/decode ──
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

// ── Types for component editing modal ──
type ModalType = "paragraph" | "heading" | "image" | "list" | null
interface ModalState {
  type: ModalType
  elIndex: string
  content: string
  tag?: string
  items?: string[]
  src?: string
  alt?: string
  width?: string
  isNew?: boolean
  insertAfterIndex?: string
}

// ── Build interactive iframe HTML ──
function buildInteractiveDoc(html: string): string {
  const styles = `
<style data-v0-editor>
[data-v0-idx] { position: relative; transition: outline 0.15s, background 0.15s; cursor: pointer; }
[data-v0-idx]:hover { outline: 2px solid #1a73e8 !important; outline-offset: 2px !important; background: rgba(26,115,232,0.03) !important; }
[data-v0-idx].v0-selected { outline: 2px solid #1a73e8 !important; outline-offset: 2px !important; background: rgba(26,115,232,0.06) !important; }
.v0-edit-btn { display: none; position: absolute; top: 2px; right: 2px; width: 22px; height: 22px; background: #1a73e8; border: none; border-radius: 4px; cursor: pointer; z-index: 50; align-items: center; justify-content: center; padding: 0; }
.v0-edit-btn svg { width: 12px; height: 12px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
[data-v0-idx]:hover > .v0-edit-btn { display: flex; }
.v0-add-zone { height: 4px; transition: height 0.15s, background 0.15s; position: relative; }
.v0-add-zone:hover { height: 28px; background: rgba(26,115,232,0.06); border-radius: 4px; }
.v0-add-btn { display: none; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); padding: 3px 12px; font-size: 11px; font-weight: 500; background: #1a73e8; color: #fff; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; z-index: 100; font-family: system-ui, sans-serif; }
.v0-add-zone:hover .v0-add-btn { display: block; }
.v0-type-popup { position: fixed; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.14); padding: 6px; z-index: 500; min-width: 160px; font-family: system-ui, sans-serif; }
.v0-type-popup button { display: flex; align-items: center; gap: 10px; width: 100%; border: none; background: none; padding: 8px 12px; font-size: 13px; color: #333; cursor: pointer; border-radius: 5px; text-align: left; }
.v0-type-popup button:hover { background: #f0f4ff; color: #1a73e8; }
.v0-overlay { position: fixed; inset: 0; z-index: 400; }
.v0-tag-label { position: absolute; top: -18px; left: 0; font-size: 10px; font-family: system-ui, sans-serif; background: #1a73e8; color: #fff; padding: 1px 6px; border-radius: 3px 3px 0 0; display: none; z-index: 60; pointer-events: none; }
[data-v0-idx]:hover > .v0-tag-label { display: block; }
</style>`

  const script = `
<script data-v0-editor>
(function() {
  var PENCIL = '<svg viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>';
  var idx = 0;

  function classify(el) {
    var tag = el.tagName.toLowerCase();
    if (tag.match(/^h[1-6]$/)) return 'heading';
    if (tag === 'p') return 'paragraph';
    if (tag === 'img') return 'image';
    if (tag === 'table' && (el.querySelector('ul') || el.querySelector('ol'))) return 'list';
    if (tag === 'table' && el.querySelector('img')) return 'image';
    return null;
  }

  function labelFor(type) {
    if (type === 'heading') return 'Heading';
    if (type === 'paragraph') return 'Paragraph';
    if (type === 'image') return 'Image';
    if (type === 'list') return 'List';
    return 'Component';
  }

  function indexEl(el) {
    var type = classify(el);
    if (!type) return;
    var i = String(idx++);
    el.setAttribute('data-v0-idx', i);
    el.setAttribute('data-v0-type', type);
    el.style.position = 'relative';

    // Tag label
    var lbl = document.createElement('span');
    lbl.className = 'v0-tag-label';
    lbl.textContent = labelFor(type);
    el.appendChild(lbl);

    // Edit button
    var btn = document.createElement('button');
    btn.className = 'v0-edit-btn';
    btn.innerHTML = PENCIL;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openEditModal(el);
    });
    el.appendChild(btn);

    // Click to open edit
    el.addEventListener('click', function(e) {
      if (e.target.closest('.v0-edit-btn') || e.target.closest('.v0-add-btn')) return;
      e.preventDefault();
      e.stopPropagation();
      openEditModal(el);
    });
  }

  function getCleanText(el) {
    var clone = el.cloneNode(true);
    clone.querySelectorAll('.v0-edit-btn, .v0-tag-label').forEach(function(x) { x.remove(); });
    return clone;
  }

  function openEditModal(el) {
    var type = el.getAttribute('data-v0-type');
    var i = el.getAttribute('data-v0-idx');
    var data = { type: type, elIndex: i };
    if (type === 'paragraph') {
      var clean = getCleanText(el);
      data.content = clean.innerHTML.replace(/<br\\s*\\/?>/gi, '\\n').replace(/<[^>]+>/g, '');
    } else if (type === 'heading') {
      var cleanH = getCleanText(el);
      data.content = cleanH.textContent || '';
      data.tag = el.tagName.toLowerCase();
    } else if (type === 'image') {
      var img = el.tagName === 'IMG' ? el : el.querySelector('img');
      data.src = img ? img.src : '';
      data.alt = img ? img.alt : '';
      data.width = img ? String(img.width || '') : '';
    } else if (type === 'list') {
      var ul = el.querySelector('ul') || el.querySelector('ol');
      var items = [];
      if (ul) ul.querySelectorAll('li').forEach(function(li) { items.push(li.textContent || ''); });
      data.items = items;
    }
    window.parent.postMessage({ type: 'v0-open-modal', data: data }, '*');
  }

  // ── Index elements ──
  var bodyText = document.querySelector('.body-text');
  if (bodyText) {
    Array.from(bodyText.children).forEach(function(child) {
      if (classify(child)) indexEl(child);
    });
  }
  // Header/footer images
  document.querySelectorAll('td.header img, td.footer-text img').forEach(function(img) {
    var wrapper = img.closest('table');
    if (wrapper && !wrapper.getAttribute('data-v0-idx')) indexEl(wrapper);
  });
  document.querySelectorAll('td.footer-text > p').forEach(function(p) {
    if (!p.getAttribute('data-v0-idx')) indexEl(p);
  });

  // ── Add zones ──
  if (bodyText) {
    var kids = Array.from(bodyText.children).filter(function(c) { return c.hasAttribute('data-v0-idx'); });
    // Zone before first
    if (kids.length > 0) bodyText.insertBefore(makeZone(null), kids[0]);
    // Zone after each
    kids.forEach(function(kid) {
      var zone = makeZone(kid.getAttribute('data-v0-idx'));
      kid.after(zone);
    });
  }

  function makeZone(afterIdx) {
    var z = document.createElement('div');
    z.className = 'v0-add-zone';
    z.setAttribute('data-v0-after', afterIdx || '');
    var b = document.createElement('button');
    b.className = 'v0-add-btn';
    b.textContent = '+ Add Component';
    b.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showTypePicker(e, afterIdx);
    });
    z.appendChild(b);
    return z;
  }

  function showTypePicker(evt, afterIdx) {
    closePopups();
    var overlay = document.createElement('div');
    overlay.className = 'v0-overlay';
    overlay.addEventListener('click', function() { closePopups(); });
    document.body.appendChild(overlay);

    var popup = document.createElement('div');
    popup.className = 'v0-type-popup';
    var types = [
      { label: 'Heading', type: 'heading' },
      { label: 'Paragraph', type: 'paragraph' },
      { label: 'Image', type: 'image' },
      { label: 'List', type: 'list' },
      { label: 'Indent Block', type: 'indent' },
    ];
    types.forEach(function(t) {
      var b = document.createElement('button');
      b.textContent = t.label;
      b.addEventListener('click', function(e) {
        e.stopPropagation();
        closePopups();
        window.parent.postMessage({
          type: 'v0-open-modal',
          data: { type: t.type, elIndex: '__new__', isNew: true, insertAfterIndex: afterIdx || '', content: '', items: ['Item 1'], src: '', alt: '', width: '', tag: 'h3' }
        }, '*');
      });
      popup.appendChild(b);
    });

    var rect = evt.target.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2 - 80) + 'px';
    popup.style.top = (rect.bottom + 4) + 'px';
    document.body.appendChild(popup);
  }

  function closePopups() {
    document.querySelectorAll('.v0-type-popup, .v0-overlay').forEach(function(el) { el.remove(); });
  }

  // ── Receive updates from parent modal ──
  window.addEventListener('message', function(e) {
    if (!e.data) return;
    if (e.data.type === 'v0-update-component') {
      var d = e.data.data;
      var el = document.querySelector('[data-v0-idx="' + d.elIndex + '"]');
      if (!el) return;
      if (d.componentType === 'paragraph') {
        // Preserve the edit btn and tag label
        var editBtn = el.querySelector('.v0-edit-btn');
        var tagLbl = el.querySelector('.v0-tag-label');
        el.innerHTML = d.content.replace(/\\n/g, '<br>');
        if (tagLbl) el.appendChild(tagLbl);
        if (editBtn) el.appendChild(editBtn);
      } else if (d.componentType === 'heading') {
        if (d.tag && d.tag !== el.tagName.toLowerCase()) {
          var newEl = document.createElement(d.tag);
          var sizes = { h1: '26px', h2: '22px', h3: '18px', h4: '16px' };
          var lh = { h1: '32px', h2: '28px', h3: '24px', h4: '22px' };
          newEl.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:' + (sizes[d.tag]||'18px') + ';line-height:' + (lh[d.tag]||'24px') + ';font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;position:relative;';
          newEl.textContent = d.content;
          newEl.setAttribute('data-v0-idx', d.elIndex);
          newEl.setAttribute('data-v0-type', 'heading');
          var lbl2 = document.createElement('span');
          lbl2.className = 'v0-tag-label';
          lbl2.textContent = 'Heading';
          newEl.appendChild(lbl2);
          var btn2 = document.createElement('button');
          btn2.className = 'v0-edit-btn';
          btn2.innerHTML = PENCIL;
          btn2.addEventListener('click', function(ev) { ev.preventDefault(); ev.stopPropagation(); openEditModal(newEl); });
          newEl.appendChild(btn2);
          newEl.addEventListener('click', function(ev) { if (!ev.target.closest('.v0-edit-btn')) { ev.preventDefault(); ev.stopPropagation(); openEditModal(newEl); } });
          el.replaceWith(newEl);
        } else {
          var editBtn2 = el.querySelector('.v0-edit-btn');
          var tagLbl2 = el.querySelector('.v0-tag-label');
          el.textContent = d.content;
          if (tagLbl2) el.appendChild(tagLbl2);
          if (editBtn2) el.appendChild(editBtn2);
        }
      } else if (d.componentType === 'image') {
        var img2 = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (img2) {
          if (d.src) img2.src = d.src;
          if (d.alt !== undefined) img2.alt = d.alt;
          if (d.width) img2.width = parseInt(d.width);
        }
      } else if (d.componentType === 'list') {
        var ul2 = el.querySelector('ul') || el.querySelector('ol');
        if (ul2 && d.items) {
          ul2.innerHTML = '';
          d.items.forEach(function(txt) {
            var li = document.createElement('li');
            li.style.cssText = 'padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;';
            li.textContent = txt;
            ul2.appendChild(li);
          });
        }
      }
      syncToParent();
    } else if (e.data.type === 'v0-delete-component') {
      var el3 = document.querySelector('[data-v0-idx="' + e.data.elIndex + '"]');
      if (el3) { el3.remove(); syncToParent(); }
    } else if (e.data.type === 'v0-add-component') {
      var d2 = e.data.data;
      var bodyText2 = document.querySelector('.body-text');
      if (!bodyText2) return;
      var newComp;
      if (d2.componentType === 'paragraph') {
        newComp = document.createElement('p');
        newComp.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;';
        newComp.innerHTML = (d2.content || 'New paragraph...').replace(/\\n/g, '<br>');
      } else if (d2.componentType === 'heading') {
        var htag = d2.tag || 'h3';
        newComp = document.createElement(htag);
        var hs = { h1: '26px', h2: '22px', h3: '18px', h4: '16px' };
        var hlh = { h1: '32px', h2: '28px', h3: '24px', h4: '22px' };
        newComp.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:' + (hs[htag]||'18px') + ';line-height:' + (hlh[htag]||'24px') + ';font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;';
        newComp.textContent = d2.content || 'New heading';
      } else if (d2.componentType === 'image') {
        var tblI = document.createElement('table');
        tblI.setAttribute('border','0'); tblI.setAttribute('cellpadding','0'); tblI.setAttribute('cellspacing','0'); tblI.setAttribute('width','100%');
        tblI.style.cssText = 'padding:0 0 12px 0;';
        tblI.innerHTML = '<tr><td align="left"><img border="0" style="display:block;max-width:100%;height:auto;" src="' + (d2.src || 'https://placehold.co/400x200') + '" width="' + (d2.width || '400') + '" alt="' + (d2.alt || 'Image') + '" /></td></tr>';
        newComp = tblI;
      } else if (d2.componentType === 'list') {
        var tblL = document.createElement('table');
        tblL.setAttribute('border','0'); tblL.setAttribute('cellpadding','0'); tblL.setAttribute('cellspacing','0'); tblL.setAttribute('width','100%');
        tblL.style.cssText = 'padding:0 0 12px 0;';
        var liHtml = (d2.items || ['Item 1']).map(function(t) { return '<li style="padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;">' + t + '</li>'; }).join('');
        tblL.innerHTML = '<tr><td><ul style="margin:0;padding:0 0 0 24px;">' + liHtml + '</ul></td></tr>';
        newComp = tblL;
      } else if (d2.componentType === 'indent') {
        var tblIn = document.createElement('table');
        tblIn.setAttribute('border','0'); tblIn.setAttribute('cellpadding','0'); tblIn.setAttribute('cellspacing','0'); tblIn.setAttribute('width','100%');
        tblIn.style.cssText = 'margin:0 0 12px 0;';
        tblIn.innerHTML = '<tr><td style="background-color:#f7f7f7;border-radius:4px;padding:16px 20px;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;">' + (d2.content || 'Indented content...') + '</td></tr>';
        newComp = tblIn;
      }
      if (!newComp) return;

      // Find insert position
      var afterEl = d2.insertAfterIndex ? document.querySelector('[data-v0-idx="' + d2.insertAfterIndex + '"]') : null;
      if (afterEl) {
        // Insert after the add-zone that follows afterEl
        var nextZone = afterEl.nextElementSibling;
        if (nextZone && nextZone.classList.contains('v0-add-zone')) {
          nextZone.after(newComp);
        } else {
          afterEl.after(newComp);
        }
      } else {
        // Insert at beginning
        var firstChild = bodyText2.firstElementChild;
        if (firstChild && firstChild.classList.contains('v0-add-zone')) {
          firstChild.after(newComp);
        } else {
          bodyText2.prepend(newComp);
        }
      }

      // Index and add zone
      indexEl(newComp);
      var nz = makeZone(newComp.getAttribute('data-v0-idx'));
      newComp.after(nz);

      syncToParent();
    }
  });

  function syncToParent() {
    var clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('.v0-add-zone, .v0-edit-btn, .v0-tag-label, .v0-edit-menu, .v0-type-popup, .v0-overlay, [data-v0-editor]').forEach(function(z) { z.remove(); });
    clone.querySelectorAll('[data-v0-idx]').forEach(function(el) {
      el.removeAttribute('data-v0-idx');
      el.removeAttribute('data-v0-type');
    });
    clone.querySelectorAll('[data-v0-wrapper]').forEach(function(el) { el.removeAttribute('data-v0-wrapper'); });
    var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\\n' + clone.outerHTML;
    window.parent.postMessage({ type: 'v0-live-editor-sync', html: html }, '*');
  }
})();
<\/script>`

  let result = html
  if (result.includes("</head>")) {
    result = result.replace("</head>", styles + "\n</head>")
  } else {
    result = styles + result
  }
  if (result.includes("</body>")) {
    result = result.replace("</body>", script + "\n</body>")
  } else {
    result = result + script
  }
  return result
}

// ── React component ──
export default function LiveEditorPage() {
  const [entitiesCode, setEntitiesCode] = useState(DEFAULT_ENTITIES_CODE)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Modal state
  const [modal, setModal] = useState<ModalState | null>(null)

  const decodedHtml = useMemo(() => decodeEntities(entitiesCode), [entitiesCode])
  const iframeSrcDoc = useMemo(() => buildInteractiveDoc(decodedHtml), [decodedHtml])

  // Listen for messages from iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data) return
      if (e.data.type === "v0-live-editor-sync" && typeof e.data.html === "string") {
        setEntitiesCode(encodeEntities(e.data.html))
      }
      if (e.data.type === "v0-open-modal" && e.data.data) {
        const d = e.data.data
        setModal({
          type: d.type as ModalType,
          elIndex: d.elIndex,
          content: d.content || "",
          tag: d.tag || "h3",
          items: d.items || ["Item 1"],
          src: d.src || "",
          alt: d.alt || "",
          width: d.width || "",
          isNew: d.isNew || false,
          insertAfterIndex: d.insertAfterIndex || "",
        })
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Send update to iframe
  const sendToIframe = useCallback(
    (msgType: string, data: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage({ type: msgType, ...data }, "*")
    },
    [],
  )

  const handleSave = useCallback(() => {
    if (!modal) return
    if (modal.isNew) {
      sendToIframe("v0-add-component", {
        data: {
          componentType: modal.type,
          insertAfterIndex: modal.insertAfterIndex,
          content: modal.content,
          tag: modal.tag,
          items: modal.items,
          src: modal.src,
          alt: modal.alt,
          width: modal.width,
        },
      })
    } else {
      sendToIframe("v0-update-component", {
        data: {
          elIndex: modal.elIndex,
          componentType: modal.type,
          content: modal.content,
          tag: modal.tag,
          items: modal.items,
          src: modal.src,
          alt: modal.alt,
          width: modal.width,
        },
      })
    }
    setModal(null)
  }, [modal, sendToIframe])

  const handleDelete = useCallback(() => {
    if (!modal || modal.isNew) return
    sendToIframe("v0-delete-component", { elIndex: modal.elIndex })
    setModal(null)
  }, [modal, sendToIframe])

  // Text formatting helpers
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wrapSelection = useCallback(
    (prefix: string, suffix: string) => {
      if (!modal || !textareaRef.current) return
      const el = textareaRef.current
      const start = el.selectionStart ?? 0
      const end = el.selectionEnd ?? 0
      const text = modal.content
      const selected = text.slice(start, end)
      const before = text.slice(Math.max(0, start - prefix.length), start)
      const after = text.slice(end, end + suffix.length)
      if (before === prefix && after === suffix) {
        const newContent = text.slice(0, start - prefix.length) + selected + text.slice(end + suffix.length)
        setModal({ ...modal, content: newContent })
        requestAnimationFrame(() => {
          el.selectionStart = start - prefix.length
          el.selectionEnd = end - prefix.length
          el.focus()
        })
        return
      }
      const wrapped = prefix + selected + suffix
      const newContent = text.slice(0, start) + wrapped + text.slice(end)
      setModal({ ...modal, content: newContent })
      requestAnimationFrame(() => {
        el.selectionStart = start + prefix.length
        el.selectionEnd = selected.length > 0 ? end + prefix.length : start + prefix.length
        el.focus()
      })
    },
    [modal],
  )

  const insertVariable = useCallback(
    (v: string) => {
      if (!modal || !textareaRef.current) return
      const el = textareaRef.current
      const pos = el.selectionStart ?? modal.content.length
      const newContent = modal.content.slice(0, pos) + v + modal.content.slice(pos)
      setModal({ ...modal, content: newContent })
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = pos + v.length
        el.focus()
      })
    },
    [modal],
  )

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(decodedHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [decodedHtml])

  const clearCode = useCallback(() => {
    setEntitiesCode("")
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader currentPath="/live-editor" />

      <ResizablePanelGroup direction="horizontal" className="flex-1" id="live-editor-panels">
        <ResizablePanel defaultSize={50} minSize={25} id="entities-editor" order={1}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">HTML Entities</h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-muted-foreground" onClick={copyToClipboard}>
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-muted-foreground" onClick={clearCode}>
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
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

        <ResizablePanel defaultSize={50} minSize={25} id="live-preview" order={2}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">Live Preview</h2>
              <span className="text-[10px] text-muted-foreground">Click to edit / hover between to add</span>
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={iframeSrcDoc}
              title="Live Email Preview"
              className="h-full w-full border-0 bg-background"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* ── Component Editor Modal ── */}
      <Dialog open={modal !== null} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base capitalize">
              {modal?.isNew ? "Add" : "Edit"} {modal?.type}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-2 pb-1">
            {/* ── Paragraph ── */}
            {modal?.type === "paragraph" && (
              <div className="flex flex-col gap-0">
                <div className="flex items-center border rounded-t-md bg-muted/40 px-1.5 py-1 gap-px">
                  <button type="button" title="Bold" onClick={() => wrapSelection("**", "**")} className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" title="Italic" onClick={() => wrapSelection("*", "*")} className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" title="Underline" onClick={() => wrapSelection("__", "__")} className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" title="Insert variable" className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                        <Braces className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {TEMPLATE_VARIABLES.map((v) => (
                        <DropdownMenuItem key={v} onClick={() => insertVariable(v)} className="font-mono text-xs">
                          {v}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea
                  ref={textareaRef}
                  value={modal.content}
                  onChange={(e) => setModal({ ...modal, content: e.target.value })}
                  placeholder="Enter paragraph text... (use Enter for line breaks)"
                  className="min-h-[100px] text-sm resize-y rounded-t-none border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}

            {/* ── Heading ── */}
            {modal?.type === "heading" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">Level</Label>
                  <div className="flex gap-1.5">
                    {(["h1", "h2", "h3", "h4"] as const).map((level) => (
                      <Button
                        key={level}
                        variant={modal.tag === level ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs flex-1"
                        onClick={() => setModal({ ...modal, tag: level })}
                      >
                        {level.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-0">
                  <div className="flex items-center border rounded-t-md bg-muted/40 px-1.5 py-1 gap-px">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" title="Insert variable" className="inline-flex items-center justify-center rounded h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                          <Braces className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {TEMPLATE_VARIABLES.map((v) => (
                          <DropdownMenuItem key={v} onClick={() => insertVariable(v)} className="font-mono text-xs">
                            {v}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Input
                    ref={textareaRef as unknown as React.Ref<HTMLInputElement>}
                    value={modal.content}
                    onChange={(e) => setModal({ ...modal, content: e.target.value })}
                    placeholder="Heading text..."
                    className="h-9 text-sm rounded-t-none border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </>
            )}

            {/* ── Image ── */}
            {modal?.type === "image" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">Image URL</Label>
                  <Input value={modal.src || ""} onChange={(e) => setModal({ ...modal, src: e.target.value })} placeholder="https://..." className="h-8 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Alt text</Label>
                    <Input value={modal.alt || ""} onChange={(e) => setModal({ ...modal, alt: e.target.value })} placeholder="Description" className="h-8 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">Width</Label>
                    <div className="flex items-center gap-1.5">
                      <Input type="number" value={modal.width || ""} onChange={(e) => setModal({ ...modal, width: e.target.value })} placeholder="400" className="h-8 text-sm" />
                      <span className="text-xs text-muted-foreground shrink-0">px</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── List ── */}
            {modal?.type === "list" && (
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium">List items</Label>
                {modal.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{i + 1}.</span>
                    <Input
                      value={item}
                      onChange={(e) => {
                        const items = [...(modal.items || [])]
                        items[i] = e.target.value
                        setModal({ ...modal, items })
                      }}
                      className="h-8 text-sm flex-1"
                      placeholder="Item text..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => {
                        const items = [...(modal.items || [])]
                        items.splice(i, 1)
                        setModal({ ...modal, items: items.length ? items : ["Item 1"] })
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 w-full"
                  onClick={() => setModal({ ...modal, items: [...(modal.items || []), ""] })}
                >
                  <Plus className="h-3 w-3" />
                  Add item
                </Button>
              </div>
            )}

            {/* ── Indent ── */}
            {modal?.type === "indent" as string && (
              <Textarea
                value={modal?.content || ""}
                onChange={(e) => modal && setModal({ ...modal, content: e.target.value })}
                placeholder="Indented content..."
                className="min-h-[80px] text-sm resize-y"
              />
            )}
          </div>

          <DialogFooter className="flex-row gap-2">
            {!modal?.isNew && (
              <Button variant="destructive" size="sm" className="mr-auto text-xs gap-1.5" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              {modal?.isNew ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
