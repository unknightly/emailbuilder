import type { EmailSection, EmailComponent } from "./email-types"

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function renderHeading(component: EmailComponent): string {
  const level = (component.props.level as number) || 1
  const sizes: Record<number, string> = {
    1: "font-size:28px;line-height:34px;",
    2: "font-size:24px;line-height:30px;",
    3: "font-size:20px;line-height:26px;",
    4: "font-size:16px;line-height:22px;",
  }
  const tag = `h${level}`
  return `<${tag} style="margin:0;padding:0 0 12px 0;${sizes[level] || sizes[1]}font-weight:700;color:#1a1a2e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${escapeHtml(component.content)}</${tag}>`
}

function renderParagraph(component: EmailComponent): string {
  return `<p style="margin:0;padding:0 0 16px 0;font-size:16px;line-height:24px;color:#334155;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${escapeHtml(component.content)}</p>`
}

function renderImage(component: EmailComponent): string {
  const alt = (component.props.alt as string) || ""
  const width = (component.props.width as number) || 600
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:0 0 16px 0;">
  <tr>
    <td align="center">
      <img src="${escapeHtml(component.content)}" alt="${escapeHtml(alt)}" width="${width}" style="display:block;max-width:100%;height:auto;border:0;border-radius:6px;" />
    </td>
  </tr>
</table>`
}

function renderList(component: EmailComponent): string {
  const items = (component.props.items as string[]) || []
  if (items.length === 0) return ""
  const listItems = items
    .map(
      (item) =>
        `<li style="padding:4px 0;font-size:16px;line-height:24px;color:#334155;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${escapeHtml(item)}</li>`
    )
    .join("\n        ")
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:0 0 16px 0;">
  <tr>
    <td>
      <ul style="margin:0;padding:0 0 0 24px;">
        ${listItems}
      </ul>
    </td>
  </tr>
</table>`
}

function renderLineItem(component: EmailComponent): string {
  const label = (component.props.label as string) || ""
  const value = (component.props.value as string) || ""
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:6px 0;border-bottom:1px solid #e2e8f0;">
  <tr>
    <td style="font-size:15px;line-height:22px;color:#334155;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:6px 0;" align="left">${escapeHtml(label)}</td>
    <td style="font-size:15px;line-height:22px;color:#1a1a2e;font-weight:600;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:6px 0;" align="right">${escapeHtml(value)}</td>
  </tr>
</table>`
}

function renderHtmlBlock(component: EmailComponent): string {
  return component.content
}

function renderComponent(component: EmailComponent): string {
  switch (component.type) {
    case "heading":
      return renderHeading(component)
    case "paragraph":
      return renderParagraph(component)
    case "image":
      return renderImage(component)
    case "list":
      return renderList(component)
    case "line-item":
      return renderLineItem(component)
    case "html":
      return renderHtmlBlock(component)
    default:
      return ""
  }
}

const sectionStyles: Record<string, string> = {
  header:
    "background-color:#1a1a2e;padding:32px 40px;border-radius:8px 8px 0 0;",
  body: "background-color:#ffffff;padding:32px 40px;",
  footer:
    "background-color:#f1f5f9;padding:24px 40px;border-radius:0 0 8px 8px;",
}

const sectionTextOverrides: Record<string, string> = {
  header: "color:#f8fafc;",
  footer: "color:#64748b;font-size:13px;",
}

function renderSection(section: EmailSection): string {
  if (section.components.length === 0) return ""
  const style = sectionStyles[section.type] || sectionStyles.body
  let componentsHtml = section.components
    .map((c) => renderComponent(c))
    .join("\n          ")

  // Override text colors for header/footer sections
  if (sectionTextOverrides[section.type]) {
    const overrides = sectionTextOverrides[section.type]
    componentsHtml = componentsHtml
      .replace(/color:#334155;/g, overrides.includes("color:") ? overrides.split(";")[0] + ";" : "color:#334155;")
      .replace(/color:#1a1a2e;/g, section.type === "header" ? "color:#f8fafc;" : "color:#1a1a2e;")
  }

  return `      <!-- ${section.type.toUpperCase()} -->
      <tr>
        <td style="${style}">
          ${componentsHtml}
        </td>
      </tr>`
}

export function generateEmailHTML(sections: EmailSection[]): string {
  const sectionsHtml = sections.map((s) => renderSection(s)).join("\n")

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Email</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .fallback-font { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#e2e8f0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#e2e8f0;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-collapse:collapse;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
${sectionsHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
