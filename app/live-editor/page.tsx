"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { AppHeader } from "@/components/email-builder/app-header"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Trash2 } from "lucide-react"
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

// Pure string-based entity decoder -- SSR safe, no DOM access
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

// Build interactive iframe document with inline editing, component type popup, and edit icons
function buildInteractiveDoc(html: string): string {
  const injectedStyles = `
<style data-v0-editor>
/* Hover highlight for all editable elements */
[data-v0-el] {
  position: relative;
  transition: outline 0.1s;
}
[data-v0-el]:hover {
  outline: 2px solid #1a73e8 !important;
  outline-offset: 2px !important;
}
[data-v0-el]:focus {
  outline: 2px solid #1a73e8 !important;
  outline-offset: 2px !important;
  background: rgba(26,115,232,0.04) !important;
}
img[data-v0-img]:hover {
  outline: 2px solid #1a73e8 !important;
  outline-offset: 2px !important;
  cursor: pointer !important;
}

/* Edit icon on hover */
.v0-edit-btn {
  display: none;
  position: absolute;
  top: 2px;
  right: 2px;
  width: 22px;
  height: 22px;
  background: #1a73e8;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 50;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.v0-edit-btn svg { width: 12px; height: 12px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
[data-v0-el]:hover > .v0-edit-btn,
[data-v0-wrapper]:hover > .v0-edit-btn { display: flex; }

/* Edit menu popup */
.v0-edit-menu {
  position: absolute;
  top: 26px;
  right: 2px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  padding: 4px;
  z-index: 200;
  min-width: 140px;
  font-family: system-ui, -apple-system, sans-serif;
}
.v0-edit-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: none;
  padding: 6px 10px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
}
.v0-edit-menu button:hover { background: #f0f4ff; color: #1a73e8; }

/* Add zone between components */
.v0-add-zone {
  position: relative;
  height: 4px;
  margin: 0;
  transition: height 0.15s, background 0.15s;
}
.v0-add-zone:hover {
  height: 28px;
  background: rgba(26,115,232,0.06);
  border-radius: 4px;
}
.v0-add-btn {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 3px 12px;
  font-size: 11px;
  font-family: system-ui, -apple-system, sans-serif;
  font-weight: 500;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  z-index: 100;
}
.v0-add-zone:hover .v0-add-btn { display: block; }

/* Component type picker popup */
.v0-type-popup {
  position: fixed;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.14);
  padding: 6px;
  z-index: 500;
  min-width: 160px;
  font-family: system-ui, -apple-system, sans-serif;
}
.v0-type-popup button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: none;
  background: none;
  padding: 8px 12px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  text-align: left;
}
.v0-type-popup button:hover { background: #f0f4ff; color: #1a73e8; }
.v0-type-popup .v0-type-icon { width: 16px; height: 16px; opacity: 0.6; }

/* Overlay backdrop */
.v0-overlay { position: fixed; inset: 0; z-index: 400; }
</style>`

  const injectedScript = `
<script data-v0-editor>
(function() {
  var PENCIL_SVG = '<svg viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>';

  // ── Helpers ──
  function makeEditable(el) {
    el.setAttribute('data-v0-el', '');
    el.setAttribute('contenteditable', 'true');
    el.style.position = 'relative';
    addEditButton(el);
  }

  function addEditButton(el) {
    var btn = document.createElement('button');
    btn.className = 'v0-edit-btn';
    btn.innerHTML = PENCIL_SVG;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showEditMenu(el, btn);
    });
    el.appendChild(btn);
  }

  function showEditMenu(el, anchor) {
    closeAllMenus();
    var menu = document.createElement('div');
    menu.className = 'v0-edit-menu';
    menu.setAttribute('data-v0-menu', '');

    var tag = el.tagName.toLowerCase();

    if (tag.match(/^h[1-6]$/)) {
      // Heading: change level
      ['H2','H3','H4'].forEach(function(level) {
        var b = document.createElement('button');
        b.textContent = 'Change to ' + level;
        if (el.tagName === level) b.style.fontWeight = '700';
        b.addEventListener('click', function(ev) {
          ev.stopPropagation();
          changeTag(el, level.toLowerCase());
          closeAllMenus();
        });
        menu.appendChild(b);
      });
    } else if (tag === 'ul' || el.querySelector('ul')) {
      // List: add item
      var addBtn = document.createElement('button');
      addBtn.textContent = 'Add list item';
      addBtn.addEventListener('click', function(ev) {
        ev.stopPropagation();
        var ul = tag === 'ul' ? el : el.querySelector('ul');
        if (ul) {
          var li = document.createElement('li');
          li.style.cssText = 'padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;';
          li.textContent = 'New item';
          li.setAttribute('contenteditable', 'true');
          li.setAttribute('data-v0-el', '');
          ul.appendChild(li);
          li.focus();
          syncToParent();
        }
        closeAllMenus();
      });
      menu.appendChild(addBtn);

      var removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove last item';
      removeBtn.style.color = '#d32f2f';
      removeBtn.addEventListener('click', function(ev) {
        ev.stopPropagation();
        var ul = tag === 'ul' ? el : el.querySelector('ul');
        if (ul && ul.lastElementChild) {
          ul.lastElementChild.remove();
          syncToParent();
        }
        closeAllMenus();
      });
      menu.appendChild(removeBtn);
    } else if (tag === 'p') {
      var delBtn = document.createElement('button');
      delBtn.textContent = 'Delete paragraph';
      delBtn.style.color = '#d32f2f';
      delBtn.addEventListener('click', function(ev) {
        ev.stopPropagation();
        el.remove();
        syncToParent();
        closeAllMenus();
      });
      menu.appendChild(delBtn);
    } else if (tag === 'img' || el.querySelector('img')) {
      var imgEl = tag === 'img' ? el : el.querySelector('img');
      var srcBtn = document.createElement('button');
      srcBtn.textContent = 'Change image URL';
      srcBtn.addEventListener('click', function(ev) {
        ev.stopPropagation();
        var ns = prompt('Image URL:', imgEl.src);
        if (ns) { imgEl.src = ns; syncToParent(); }
        closeAllMenus();
      });
      menu.appendChild(srcBtn);
    }

    // Always add a delete option
    if (tag !== 'p' && tag !== 'li') {
      var del2 = document.createElement('button');
      del2.textContent = 'Delete component';
      del2.style.color = '#d32f2f';
      del2.addEventListener('click', function(ev) {
        ev.stopPropagation();
        el.remove();
        syncToParent();
        closeAllMenus();
      });
      menu.appendChild(del2);
    }

    el.appendChild(menu);

    // Close on click outside
    setTimeout(function() {
      document.addEventListener('click', closeAllMenus, { once: true });
    }, 10);
  }

  function changeTag(el, newTag) {
    var newEl = document.createElement(newTag);
    newEl.innerHTML = el.innerHTML;
    // Copy base style but update font-size
    var sizes = { h2: '22px', h3: '18px', h4: '16px' };
    var lineHeights = { h2: '28px', h3: '24px', h4: '22px' };
    newEl.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:' + (sizes[newTag]||'18px') + ';line-height:' + (lineHeights[newTag]||'24px') + ';font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;';
    newEl.setAttribute('data-v0-el', '');
    newEl.setAttribute('contenteditable', 'true');
    newEl.style.position = 'relative';
    addEditButton(newEl);
    el.replaceWith(newEl);
    syncToParent();
  }

  function closeAllMenus() {
    document.querySelectorAll('[data-v0-menu]').forEach(function(m) { m.remove(); });
    document.querySelectorAll('.v0-type-popup').forEach(function(m) { m.remove(); });
    document.querySelectorAll('.v0-overlay').forEach(function(m) { m.remove(); });
  }

  // ── Init editable elements ──
  document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(function(el) {
    if (el.closest('.v0-add-zone') || el.closest('.v0-type-popup') || el.closest('.v0-edit-menu')) return;
    makeEditable(el);
  });

  document.querySelectorAll('li').forEach(function(el) {
    el.setAttribute('data-v0-el', '');
    el.setAttribute('contenteditable', 'true');
  });

  // Wrap list tables + images in a relative container for the edit button
  document.querySelectorAll('table').forEach(function(tbl) {
    if (tbl.querySelector('ul') || tbl.querySelector('ol')) {
      tbl.style.position = 'relative';
      tbl.setAttribute('data-v0-wrapper', '');
      addEditButton(tbl);
    }
  });

  document.querySelectorAll('img').forEach(function(img) {
    img.setAttribute('data-v0-img', '');
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var ns = prompt('Enter new image URL:', img.src);
      if (ns && ns !== img.src) { img.src = ns; syncToParent(); }
    });
  });

  // ── Add zones between content elements ──
  function insertAddZones(container) {
    if (!container) return;
    var kids = Array.from(container.children).filter(function(c) { return !c.classList.contains('v0-add-zone'); });
    // Add zone before first child
    container.insertBefore(createAddZone(container, null, kids[0]), kids[0] || null);
    // Add zones after each child
    kids.forEach(function(kid) {
      var zone = createAddZone(container, kid, kid.nextSibling);
      kid.after(zone);
    });
  }

  function createAddZone(container, afterEl, beforeEl) {
    var zone = document.createElement('div');
    zone.className = 'v0-add-zone';
    var btn = document.createElement('button');
    btn.className = 'v0-add-btn';
    btn.textContent = '+ Add Component';
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showTypePopup(e, container, zone);
    });
    zone.appendChild(btn);
    return zone;
  }

  function showTypePopup(evt, container, afterZone) {
    closeAllMenus();

    // Overlay to catch outside clicks
    var overlay = document.createElement('div');
    overlay.className = 'v0-overlay';
    overlay.addEventListener('click', function(e) { e.stopPropagation(); closeAllMenus(); });
    document.body.appendChild(overlay);

    var popup = document.createElement('div');
    popup.className = 'v0-type-popup';

    var types = [
      { label: 'Heading', tag: 'h3' },
      { label: 'Paragraph', tag: 'p' },
      { label: 'Image', tag: 'img' },
      { label: 'List', tag: 'ul' },
    ];

    types.forEach(function(t) {
      var b = document.createElement('button');
      b.textContent = t.label;
      b.addEventListener('click', function(e) {
        e.stopPropagation();
        insertComponent(t.tag, container, afterZone);
        closeAllMenus();
      });
      popup.appendChild(b);
    });

    // Position near the button
    var rect = afterZone.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2 - 80) + 'px';
    popup.style.top = (rect.bottom + 4) + 'px';
    document.body.appendChild(popup);
  }

  function insertComponent(tag, container, afterZone) {
    var newEl;
    if (tag === 'h3') {
      newEl = document.createElement('h3');
      newEl.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:18px;line-height:24px;font-weight:bold;color:#333333;font-family:Helvetica, Arial, sans-serif;';
      newEl.textContent = 'New heading';
      makeEditable(newEl);
    } else if (tag === 'p') {
      newEl = document.createElement('p');
      newEl.style.cssText = 'margin:0;padding:0 0 12px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;';
      newEl.textContent = 'New paragraph text...';
      makeEditable(newEl);
    } else if (tag === 'img') {
      var src = prompt('Image URL:', 'https://placehold.co/400x200');
      if (!src) return;
      newEl = document.createElement('img');
      newEl.src = src;
      newEl.alt = 'Image';
      newEl.style.cssText = 'display:block;max-width:100%;height:auto;padding:0 0 12px 0;';
      newEl.setAttribute('data-v0-img', '');
      newEl.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var ns = prompt('Enter new image URL:', newEl.src);
        if (ns) { newEl.src = ns; syncToParent(); }
      });
    } else if (tag === 'ul') {
      // Wrap in a table like the builder does
      var tbl = document.createElement('table');
      tbl.setAttribute('border','0');
      tbl.setAttribute('cellpadding','0');
      tbl.setAttribute('cellspacing','0');
      tbl.setAttribute('width','100%');
      tbl.style.cssText = 'padding:0 0 12px 0;';
      tbl.innerHTML = '<tr><td><ul style="margin:0;padding:0 0 0 24px;"><li style="padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;" contenteditable="true" data-v0-el>Item 1</li><li style="padding:2px 0;font-size:14px;line-height:20px;color:#333333;font-family:Helvetica, Arial, sans-serif;" contenteditable="true" data-v0-el>Item 2</li></ul></td></tr>';
      tbl.style.position = 'relative';
      tbl.setAttribute('data-v0-wrapper', '');
      addEditButton(tbl);
      newEl = tbl;
    }

    if (!newEl) return;

    // Insert after the add zone, then add a new zone after the element
    afterZone.after(newEl);
    var nz = createAddZone(container, newEl, newEl.nextSibling);
    newEl.after(nz);

    // Focus text elements
    if (tag === 'h3' || tag === 'p') newEl.focus();

    syncToParent();
  }

  // Apply add zones to body-text
  var bodyText = document.querySelector('.body-text');
  insertAddZones(bodyText);

  // ── Sync back to parent ──
  function syncToParent() {
    var clone = document.documentElement.cloneNode(true);
    // Remove all editor UI
    clone.querySelectorAll('.v0-add-zone, .v0-edit-btn, .v0-edit-menu, .v0-type-popup, .v0-overlay, [data-v0-editor]').forEach(function(z) { z.remove(); });
    clone.querySelectorAll('[data-v0-el]').forEach(function(el) {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-v0-el');
      el.style.removeProperty('position');
    });
    clone.querySelectorAll('[data-v0-img]').forEach(function(el) {
      el.removeAttribute('data-v0-img');
      el.style.removeProperty('cursor');
    });
    clone.querySelectorAll('[data-v0-wrapper]').forEach(function(el) {
      el.removeAttribute('data-v0-wrapper');
      el.style.removeProperty('position');
    });
    var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\\n' + clone.outerHTML;
    window.parent.postMessage({ type: 'v0-live-editor-sync', html: html }, '*');
  }

  // Sync on blur
  document.addEventListener('blur', function(e) {
    if (e.target && e.target.hasAttribute && (e.target.hasAttribute('data-v0-el'))) {
      syncToParent();
    }
  }, true);

  // Debounced sync on input
  var _syncTimer;
  document.addEventListener('input', function(e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-v0-el')) {
      clearTimeout(_syncTimer);
      _syncTimer = setTimeout(syncToParent, 400);
    }
  }, true);
})();
<\/script>`

  let result = html
  if (result.includes("</head>")) {
    result = result.replace("</head>", injectedStyles + "\n</head>")
  } else {
    result = injectedStyles + result
  }
  if (result.includes("</body>")) {
    result = result.replace("</body>", injectedScript + "\n</body>")
  } else {
    result = result + injectedScript
  }
  return result
}

export default function LiveEditorPage() {
  const [entitiesCode, setEntitiesCode] = useState(DEFAULT_ENTITIES_CODE)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const decodedHtml = useMemo(() => decodeEntities(entitiesCode), [entitiesCode])
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
        <ResizablePanel defaultSize={50} minSize={25} id="entities-editor" order={1}>
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

        <ResizablePanel defaultSize={50} minSize={25} id="live-preview" order={2}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold tracking-tight">Live Preview</h2>
              <span className="text-[10px] text-muted-foreground">
                Click text to edit / hover between elements to add
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
