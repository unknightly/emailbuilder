# Email Builder

A client-side email template builder that outputs table-based HTML compatible with major email clients (Outlook, Gmail, Apple Mail, Yahoo).

## Pages

| Route | Description |
|---|---|
| `/` | Email Builder — compose templates with a drag-and-drop component editor |
| `/preview` | HTML Preview — paste HTML entity-encoded content and see the rendered output |
| `/architecture` | Architecture diagram of the component tree and data flow |
| `/architecture/schema` | Full JSON schema reference with rich text syntax table |
| `/changelog` | Release history |

## Getting Started

```bash
pnpm dev
```

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **shadcn/ui** — Radix primitives + Tailwind CSS
- **TypeScript**

No backend, no database, no API calls. All state is ephemeral — templates are saved as JSON files downloaded by the user.

## Project Structure

```
app/
  page.tsx                    # Email Builder entry
  preview/                    # HTML Preview entry
  architecture/               # Docs: architecture diagram + schema
  changelog/                  # Docs: release history
  live-editor/                # Unused — kept for reference

components/
  email-builder/
    email-builder.tsx         # Root builder component
    builder-panel.tsx         # Left panel — component list and section management
    preview-panel.tsx         # Right panel — Preview / HTML / Entities tabs + File dropdown
    component-editor.tsx      # Per-component editing forms (heading, paragraph, image, list, indent, HTML)
    visual-text-input.tsx     # contentEditable input that renders markdown visually
    markdown-guide.tsx        # Popover reference for supported markdown syntax
    section-editor.tsx        # Section-level controls (header/body/footer)
    theme-editor.tsx          # 11-property colour theme editor
    add-component-menu.tsx    # Component type picker
    app-header.tsx            # Top navigation bar + burger menu

lib/
  email-types.ts              # Types, constants, default data (EmailComponent, EmailSection, EmailTheme)
  email-html-generator.ts     # Converts component tree + theme → email-safe HTML
```

## Rich Text

Content is stored as markdown strings. The editor renders them visually (grey mono markers for `**`, `*`, `__`). The HTML generator converts them to inline-styled HTML at export time.

Supported syntax:

| Syntax | Output |
|---|---|
| `**text**` | Bold |
| `*text*` | Italic |
| `__text__` | Underline |
| `[text](url)` | Hyperlink |
| `[text](mailto:a@b.com)` | Email link |
| `[text](tel:+61400000)` | Phone link |
| `$FirstName` | Mail-merge variable |

## Template Variables

`$FirstName` `$LastName` `$PolicyOwnerNumber` `$ApplicationReference`

## Extending

- **Add a component type** — add to `ComponentType` in `email-types.ts`, add a case in `email-html-generator.ts`, add an editor in `component-editor.tsx`, add a picker entry in `add-component-menu.tsx`.
- **Add a theme property** — extend `EmailTheme` in `email-types.ts` and add a control in `theme-editor.tsx`.
- **Add a template variable** — add to `TEMPLATE_VARIABLES` in `email-types.ts`.
