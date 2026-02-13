import type { EmailSection, EmailComponent, ParagraphLink } from "./email-types"

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/* ─── Individual component renderers ─── */

function renderHeading(component: EmailComponent, section: EmailSection): string {
  const level = (component.props.level as number) || 1
  const sizes: Record<number, string> = {
    1: "font-size:24px;line-height:30px;",
    2: "font-size:20px;line-height:26px;",
    3: "font-size:18px;line-height:24px;",
    4: "font-size:16px;line-height:22px;",
  }
  const tag = `h${level}`
  const color = section.type === "header" ? "#ffffff" : section.type === "footer" ? "#aaaaaa" : "#333333"
  const links = (component.props.links as ParagraphLink[]) || []
  const inner = processRichContent(component.content, links)
  return `<${tag} style="margin:0;padding:0 0 12px 0;${sizes[level] || sizes[1]}font-weight:bold;color:${color};font-family:Helvetica, Arial, sans-serif;">${inner}</${tag}>`
}

function buildLinkHref(link: ParagraphLink): string {
  switch (link.linkType) {
    case "email":
      return `mailto:${link.url}`
    case "telephone":
      return `tel:${link.url.replace(/\s/g, "")}`
    case "web":
    default:
      return link.url.startsWith("http") ? link.url : `https://${link.url}`
  }
}

function processRichContent(content: string, links: ParagraphLink[]): string {
  // First escape the raw text
  let processed = escapeHtml(content)

  // Replace link placeholders: [link:id] with anchor tags
  for (const link of links) {
    const placeholder = escapeHtml(`[link:${link.id}]`)
    const href = escapeHtml(buildLinkHref(link))
    const linkHtml = `<a href="${href}" style="color:#1a73e8;text-decoration:underline;">${escapeHtml(link.text)}</a>`
    processed = processed.replace(placeholder, linkHtml)
  }

  // Convert \n line breaks to <br>
  processed = processed.replace(/\n/g, "<br>")

  return processed
}

function renderParagraph(component: EmailComponent, section: EmailSection): string {
  const color = section.type === "footer" ? "#aaaaaa" : "#333333"
  const fontSize = section.type === "footer" ? "12px" : "14px"
  const lineHeight = section.type === "footer" ? "16px" : "20px"
  const links = (component.props.links as ParagraphLink[]) || []
  const inner = processRichContent(component.content, links)
  return `<p style="margin:0;padding:0 0 12px 0;font-size:${fontSize};line-height:${lineHeight};color:${color};font-family:Helvetica, Arial, sans-serif;">${inner}</p>`
}

function renderImage(component: EmailComponent, section: EmailSection): string {
  const alt = (component.props.alt as string) || ""
  const width = (component.props.width as number) || 600
  const isFooter = section.type === "footer"
  const align = isFooter ? "center" : "left"
  return `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:0 0 12px 0;">
  <tr>
    <td align="${align}">
      <img border="0" style="display:block;max-width:100%;height:auto;" src="${escapeHtml(component.content)}" width="${width}" alt="${escapeHtml(alt)}" />
    </td>
  </tr>
</table>`
}

function renderList(component: EmailComponent, section: EmailSection): string {
  const items = (component.props.items as string[]) || []
  if (items.length === 0) return ""
  const color = section.type === "footer" ? "#aaaaaa" : "#333333"
  const fontSize = section.type === "footer" ? "12px" : "14px"
  const lineHeight = section.type === "footer" ? "16px" : "20px"
  const listItems = items
    .map(
      (item) =>
        `<li style="padding:2px 0;font-size:${fontSize};line-height:${lineHeight};color:${color};font-family:Helvetica, Arial, sans-serif;">${escapeHtml(item)}</li>`
    )
    .join("\n        ")
  return `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:0 0 12px 0;">
  <tr>
    <td>
      <ul style="margin:0;padding:0 0 0 24px;">
        ${listItems}
      </ul>
    </td>
  </tr>
</table>`
}

function renderLineItem(component: EmailComponent, section: EmailSection): string {
  const label = (component.props.label as string) || ""
  const value = (component.props.value as string) || ""
  const color = section.type === "footer" ? "#aaaaaa" : "#333333"
  return `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom:1px solid #e0e0e0;">
  <tr>
    <td style="font-size:14px;line-height:20px;color:${color};font-family:Helvetica, Arial, sans-serif;padding:8px 0;" align="left">${escapeHtml(label)}</td>
    <td style="font-size:14px;line-height:20px;color:${color};font-weight:bold;font-family:Helvetica, Arial, sans-serif;padding:8px 0;" align="right">${escapeHtml(value)}</td>
  </tr>
</table>`
}

function renderHtmlBlock(component: EmailComponent): string {
  return component.content
}

function renderComponent(component: EmailComponent, section: EmailSection): string {
  switch (component.type) {
    case "heading":
      return renderHeading(component, section)
    case "paragraph":
      return renderParagraph(component, section)
    case "image":
      return renderImage(component, section)
    case "list":
      return renderList(component, section)
    case "line-item":
      return renderLineItem(component, section)
    case "html":
      return renderHtmlBlock(component)
    default:
      return ""
  }
}

/* ─── Section rendering ─── */

function getSectionStyles(type: string): { td: string; bg: string } {
  switch (type) {
    case "header":
      return {
        td: "font-family:Helvetica, Arial, sans-serif;font-size:14px;color:#333333;padding:24px;",
        bg: "#FFFFFF",
      }
    case "body":
      return {
        td: "padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;",
        bg: "#FFFFFF",
      }
    case "footer":
      return {
        td: "font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px;padding-top:8px;",
        bg: "",
      }
    default:
      return {
        td: "padding:24px;",
        bg: "#FFFFFF",
      }
  }
}

function renderSection(section: EmailSection): string {
  if (section.components.length === 0) return ""

  const styles = getSectionStyles(section.type)
  const componentsHtml = section.components
    .map((c) => renderComponent(c, section))
    .join("\n          ")

  const bgAttr = styles.bg ? ` bgcolor="${styles.bg}"` : ""
  const containerClass =
    section.type === "body"
      ? ' class="container-padding content"'
      : section.type === "footer"
        ? ' class="container-padding footer-text"'
        : ' class="container-padding header"'

  // Body content gets wrapped in a body-text div matching the template
  const inner =
    section.type === "body"
      ? `\n<div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;text-align:left;color:#333333">\n\n${componentsHtml}\n\n</div>\n`
      : `\n          ${componentsHtml}\n        `

  return `        <tr>
          <td${containerClass} align="left" style="${styles.td}"${bgAttr}>${inner}
          </td>
        </tr>`
}

/* ─── Full email generation ─── */

export function generateEmailHTML(sections: EmailSection[]): string {
  const sectionsHtml = sections.map((s) => renderSection(s)).join("\n")

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <title>Email</title>
  
  <style type="text/css">
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
  background-color: #ebebeb;
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
</style>
</head>
 
<body bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
 
<!-- 100% background wrapper (grey background) -->
<table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0">
  <tr>
    <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;">
 
      <br>
 
      <!-- 600px container (white background) -->
      <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px">
${sectionsHtml}
      </table>
<!--/600px container -->


    </td>
  </tr>
</table>
<!--/100% background wrapper-->

</body>
</html>`
}
