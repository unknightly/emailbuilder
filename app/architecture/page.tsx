"use client"

import { AppHeader } from "@/components/email-builder/app-header"

const ACCENT = "#1a73e8"
const MUTED = "#64748b"
const BORDER = "#e2e8f0"
const BG_CARD = "#ffffff"
const BG_PAGE = "#f8fafc"
const BG_SECTION = "#f1f5f9"

function Box({
  title,
  subtitle,
  items,
  color = ACCENT,
  width = "w-56",
  className = "",
}: {
  title: string
  subtitle?: string
  items?: string[]
  color?: string
  width?: string
  className?: string
}) {
  return (
    <div
      className={`${width} rounded-lg border bg-card shadow-sm ${className}`}
      style={{ borderColor: BORDER, backgroundColor: BG_CARD }}
    >
      <div
        className="rounded-t-lg px-4 py-2.5"
        style={{ backgroundColor: color }}
      >
        <p className="text-xs font-semibold text-white leading-tight">{title}</p>
        {subtitle && (
          <p className="text-[10px] text-white/70 mt-0.5">{subtitle}</p>
        )}
      </div>
      {items && items.length > 0 && (
        <ul className="px-4 py-2.5 flex flex-col gap-1">
          {items.map((item, idx) => (
            <li key={`${idx}-${item}`} className="text-[11px] leading-tight" style={{ color: MUTED }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Arrow({ direction = "down", label }: { direction?: "down" | "right" | "left" | "up" | "both-down"; label?: string }) {
  if (direction === "right") {
    return (
      <div className="flex items-center gap-1 px-2">
        <div className="h-px w-8" style={{ backgroundColor: MUTED }} />
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
          <path d="M1 1L6 6L1 11" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label && <span className="text-[9px] absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ color: MUTED }}>{label}</span>}
      </div>
    )
  }
  if (direction === "left") {
    return (
      <div className="flex items-center gap-1 px-2">
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
          <path d="M7 1L2 6L7 11" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="h-px w-8" style={{ backgroundColor: MUTED }} />
      </div>
    )
  }
  if (direction === "both-down") {
    return (
      <div className="flex flex-col items-center py-1">
        {label && <span className="text-[9px] mb-1 whitespace-nowrap" style={{ color: MUTED }}>{label}</span>}
        <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
          <path d="M6 0V14M18 0V14" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 11L6 15L9 11" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 11L18 15L21 11" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center py-1">
      {label && <span className="text-[9px] mb-1 whitespace-nowrap" style={{ color: MUTED }}>{label}</span>}
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
        <path d="M6 0V14" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 11L6 16L10 11" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: MUTED }}>{children}</span>
      <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
    </div>
  )
}

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: BG_PAGE }}>
      <AppHeader currentPath="/architecture" />

      <div className="px-8 py-6" style={{ backgroundColor: BG_CARD, borderBottom: `1px solid ${BORDER}` }}>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "#0f172a" }}>
          Email Builder -- Architecture Diagram
        </h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Client-side Next.js application. No backend or database required.
        </p>
      </div>

      <main className="px-8 py-10 max-w-6xl mx-auto">

        {/* Layer 1: Entry Point */}
        <SectionLabel>Entry Point</SectionLabel>
        <div className="flex justify-center mb-2">
          <Box
            title="app/page.tsx"
            subtitle="Next.js route"
            items={["Renders <EmailBuilder />"]}
            color="#0f172a"
            width="w-64"
          />
        </div>
        <div className="flex justify-center">
          <Arrow label="mounts" />
        </div>

        {/* Layer 2: Main Orchestrator */}
        <SectionLabel>State Management + Orchestration</SectionLabel>
        <div className="flex justify-center mb-2">
          <Box
            title="EmailBuilder"
            subtitle="email-builder.tsx -- Main orchestrator"
            items={[
              "State: sections (EmailSection[])",
              "State: theme (EmailTheme)",
              "Actions: add / update / remove / move components",
              "Download: serialize to JSON",
              "Upload: parse JSON, hydrate state",
              "Generates HTML via useMemo",
            ]}
            color={ACCENT}
            width="w-[420px]"
          />
        </div>
        <div className="flex justify-center">
          <Arrow label="passes state + callbacks via props" both-down />
        </div>

        {/* Layer 3: Two Panels */}
        <SectionLabel>Split-Pane Layout (ResizablePanelGroup)</SectionLabel>
        <div className="flex justify-center items-start gap-6 mb-2">

          {/* LEFT PANEL */}
          <div className="flex flex-col items-center">
            <Box
              title="BuilderPanel"
              subtitle="builder-panel.tsx -- Left pane"
              items={[
                "Receives: sections, theme, callbacks",
                "Renders: ThemeEditor + SectionEditor(s)",
                "Scrollable with ScrollArea",
              ]}
              color="#0ea5e9"
              width="w-72"
            />
            <Arrow />
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <Box
                  title="ThemeEditor"
                  subtitle="theme-editor.tsx"
                  items={[
                    "11 color pickers grouped by:",
                    "- Backgrounds (5)",
                    "- Text colours (4)",
                    "- Other: indent bg (1)",
                    "Collapsible panel",
                  ]}
                  color="#8b5cf6"
                  width="w-52"
                />
              </div>
              <div className="flex flex-col items-center">
                <Box
                  title="SectionEditor"
                  subtitle="section-editor.tsx"
                  items={[
                    "One per section: Header, Body, Footer",
                    "Collapsible with colored left border",
                    "Renders ComponentEditor(s)",
                    "AddComponentMenu for new items",
                  ]}
                  color="#8b5cf6"
                  width="w-56"
                />
                <Arrow />
                <div className="flex gap-3 items-start">
                  <Box
                    title="ComponentEditor"
                    subtitle="component-editor.tsx"
                    items={[
                      "Per-component editing forms:",
                      "- HeadingEditor (H1-H4 + rich text)",
                      "- ParagraphEditor (rich text)",
                      "- Image (URL, alt, width)",
                      "- List (dynamic items)",
                      "- Indent (textarea)",
                      "- HTML (raw code)",
                      "",
                      "RichTextField toolbar:",
                      "  Bold / Italic / Underline",
                      "  Link insert (web/email/tel)",
                      "  Variable insert dropdown",
                      "",
                      "Kebab menu (sm) / inline btns (md+)",
                    ]}
                    color="#f59e0b"
                    width="w-60"
                  />
                  <Box
                    title="AddComponentMenu"
                    subtitle="add-component-menu.tsx"
                    items={[
                      "Popover with 6 options:",
                      "Heading, Paragraph, Image,",
                      "List, Indent, HTML",
                    ]}
                    color="#f59e0b"
                    width="w-48"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="flex flex-col items-center justify-center self-stretch py-8">
            <div className="w-px flex-1" style={{ backgroundColor: BORDER }} />
            <span className="text-[9px] font-medium py-2 rotate-0" style={{ color: MUTED }}>Resizable Handle</span>
            <div className="w-px flex-1" style={{ backgroundColor: BORDER }} />
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col items-center">
            <Box
              title="PreviewPanel"
              subtitle="preview-panel.tsx -- Right pane"
              items={[
                "3 tab views:",
                "- Preview: full-width iframe (srcDoc)",
                "- HTML: raw code + copy button",
                "- Entities: HTML-entity encoded + copy",
              ]}
              color="#0ea5e9"
              width="w-72"
            />
            <Arrow label="receives generated HTML string" />
            <Box
              title="iframe (srcDoc)"
              subtitle="Live email render"
              items={[
                "Sandboxed, full-width",
                "Real-time updates via srcDoc",
                "No external dependencies",
              ]}
              color="#10b981"
              width="w-64"
            />
          </div>
        </div>

        {/* Layer 4: Data Layer */}
        <div className="mt-8">
          <SectionLabel>Data Layer (lib/)</SectionLabel>
          <div className="flex justify-center gap-6">
            <Box
              title="email-types.ts"
              subtitle="Type definitions + factories"
              items={[
                "EmailTheme (11 color properties)",
                "EmailSection { header | body | footer }",
                "EmailComponent (6 types)",
                "ParagraphLink (web | email | telephone)",
                "TEMPLATE_VARIABLES (4 merge fields)",
                "createDefaultSections()",
                "createComponent(type)",
                "createId()",
              ]}
              color="#0f172a"
              width="w-72"
            />
            <Box
              title="email-html-generator.ts"
              subtitle="Pure function: sections + theme -> HTML"
              items={[
                "generateEmailHTML(sections, theme)",
                "",
                "Component renderers:",
                "  renderHeading (H1-H4, themed)",
                "  renderParagraph (rich content)",
                "  renderImage (responsive table)",
                "  renderList (ul/li)",
                "  renderIndent (colored block)",
                "  renderHtmlBlock (raw passthrough)",
                "",
                "processRichContent():",
                "  **bold**, *italic*, __underline__",
                "  [link:id] placeholders",
                "  \\n -> <br> line breaks",
                "",
                "Output: HTML 4.01 Transitional",
                "  Table-based layout (600px)",
                "  Full email-client CSS resets",
                "  Outlook/mso compatibility",
                "  Responsive @media queries",
              ]}
              color="#0f172a"
              width="w-72"
            />
          </div>
        </div>

        {/* Layer 5: Data Flow */}
        <div className="mt-10">
          <SectionLabel>Data Model</SectionLabel>
          <div
            className="rounded-lg border p-6"
            style={{ borderColor: BORDER, backgroundColor: BG_CARD }}
          >
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-xs font-bold mb-3" style={{ color: "#0f172a" }}>EmailSection</h3>
                <div className="rounded border p-3 text-[11px] font-mono leading-relaxed" style={{ borderColor: BORDER, backgroundColor: BG_SECTION, color: MUTED }}>
                  <p>{'{'}</p>
                  <p className="pl-3">id: string</p>
                  <p className="pl-3">type: header | body | footer</p>
                  <p className="pl-3">label: string</p>
                  <p className="pl-3">components: EmailComponent[]</p>
                  <p>{'}'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold mb-3" style={{ color: "#0f172a" }}>EmailComponent</h3>
                <div className="rounded border p-3 text-[11px] font-mono leading-relaxed" style={{ borderColor: BORDER, backgroundColor: BG_SECTION, color: MUTED }}>
                  <p>{'{'}</p>
                  <p className="pl-3">id: string</p>
                  <p className="pl-3">type: heading | paragraph |</p>
                  <p className="pl-6">image | list | indent | html</p>
                  <p className="pl-3">content: string</p>
                  <p className="pl-3">{'props: { level?, items?,'}</p>
                  <p className="pl-6">{'alt?, width?, links? }'}</p>
                  <p>{'}'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold mb-3" style={{ color: "#0f172a" }}>EmailTheme</h3>
                <div className="rounded border p-3 text-[11px] font-mono leading-relaxed" style={{ borderColor: BORDER, backgroundColor: BG_SECTION, color: MUTED }}>
                  <p>{'{'}</p>
                  <p className="pl-3">outerBackground</p>
                  <p className="pl-3">containerBackground</p>
                  <p className="pl-3">headerBackground</p>
                  <p className="pl-3">bodyBackground</p>
                  <p className="pl-3">footerBackground</p>
                  <p className="pl-3">headingColor</p>
                  <p className="pl-3">bodyTextColor</p>
                  <p className="pl-3">footerTextColor</p>
                  <p className="pl-3">linkColor</p>
                  <p className="pl-3">indentBackground</p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 6: File/Export */}
        <div className="mt-10">
          <SectionLabel>Import / Export</SectionLabel>
          <div className="flex justify-center gap-6">
            <Box
              title="Download (.json)"
              subtitle="Client-side file save"
              items={[
                "Serializes { sections, theme }",
                "User names the file via dialog",
                "Blob + URL.createObjectURL",
              ]}
              color="#10b981"
              width="w-60"
            />
            <Box
              title="Upload (.json)"
              subtitle="Client-side file load"
              items={[
                "Hidden <input type='file'>",
                "FileReader -> JSON.parse",
                "Validates structure before hydrating",
                "Supports legacy (array) format",
              ]}
              color="#10b981"
              width="w-60"
            />
            <Box
              title="Copy HTML"
              subtitle="Clipboard export"
              items={[
                "Copy raw HTML from HTML tab",
                "Copy entity-encoded from Entities tab",
                "navigator.clipboard.writeText",
              ]}
              color="#10b981"
              width="w-60"
            />
          </div>
        </div>

        {/* Key Features Summary */}
        <div className="mt-10">
          <SectionLabel>Key Characteristics</SectionLabel>
          <div
            className="rounded-lg border p-6 grid grid-cols-2 gap-x-10 gap-y-3"
            style={{ borderColor: BORDER, backgroundColor: BG_CARD }}
          >
            {[
              ["Runtime", "Client-side only -- no server, no database, no API calls"],
              ["Framework", "Next.js 16 App Router with React 19"],
              ["UI Library", "shadcn/ui (Radix primitives + Tailwind CSS)"],
              ["Email Output", "HTML 4.01 Transitional, table-based, inline styles, 600px container"],
              ["Compatibility", "Outlook, Gmail, Apple Mail, Yahoo -- full email-client CSS resets"],
              ["State", "React useState -- ephemeral, no persistence layer"],
              ["Persistence", "JSON file download/upload (user-managed)"],
              ["Rich Text", "Markdown-style: **bold**, *italic*, __underline__, [link:id] placeholders"],
              ["Variables", "$FirstName, $LastName, $PolicyOwnerNumber, $ApplicationReference"],
              ["Theming", "11 color overrides applied at generation time via EmailTheme"],
            ].map(([label, desc]) => (
              <div key={label} className="flex gap-3">
                <span className="text-[11px] font-bold shrink-0 w-24 text-right" style={{ color: "#0f172a" }}>{label}</span>
                <span className="text-[11px]" style={{ color: MUTED }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center py-4 border-t" style={{ borderColor: BORDER }}>
          <a href="/" className="text-xs font-medium hover:underline" style={{ color: ACCENT }}>
            Back to Email Builder
          </a>
          <a href="/architecture/schema" className="text-xs font-medium hover:underline" style={{ color: ACCENT }}>
            JSON Schema Breakdown
          </a>
        </div>
      </main>
    </div>
  )
}
