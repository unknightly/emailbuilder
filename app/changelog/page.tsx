"use client"

import { AppHeader } from "@/components/email-builder/app-header"

const MUTED = "#64748b"
const BORDER = "#e2e8f0"
const BG_CARD = "#ffffff"
const BG_PAGE = "#f8fafc"
const ACCENT = "#1a73e8"

type ChangeType = "added" | "changed" | "fixed" | "removed"

const TAG_COLORS: Record<ChangeType, { bg: string; text: string }> = {
  added: { bg: "#dcfce7", text: "#166534" },
  changed: { bg: "#dbeafe", text: "#1e40af" },
  fixed: { bg: "#fef9c3", text: "#854d0e" },
  removed: { bg: "#fee2e2", text: "#991b1b" },
}

interface ChangeEntry {
  type: ChangeType
  description: string
}

interface ChangelogRelease {
  version: string
  date: string
  title: string
  changes: ChangeEntry[]
}

const CHANGELOG: ChangelogRelease[] = [
  {
    version: "1.5.0",
    date: "2026-02-15",
    title: "Changelog + Architecture Updates",
    changes: [
      { type: "added", description: "Changelog page to track version history and feature progress" },
      { type: "changed", description: "Architecture diagram updated to include Live Editor WYSIWYG system and postMessage communication protocol" },
      { type: "changed", description: "Key Characteristics section now lists all application pages" },
      { type: "added", description: "Changelog link added to navigation menu" },
    ],
  },
  {
    version: "1.4.0",
    date: "2026-02-15",
    title: "Live Editor WYSIWYG Mode",
    changes: [
      { type: "added", description: "Live Editor page (/live-editor) with split-pane WYSIWYG editing" },
      { type: "added", description: "Left pane: editable HTML entities code textarea with Clear and Copy buttons" },
      { type: "added", description: "Right pane: interactive iframe preview with hover highlights and type badges" },
      { type: "added", description: "Pencil edit icon on components opens React modal with full editing capabilities" },
      { type: "added", description: "'+' add-component zones between elements with type picker popup" },
      { type: "added", description: "Edit modals: rich text toolbar, heading level selector (H1-H4), list item management, image URL/alt/width" },
      { type: "added", description: "Delete component button in edit modals" },
      { type: "added", description: "Bidirectional postMessage communication protocol between iframe and parent" },
      { type: "fixed", description: "SSR hydration errors resolved by using dynamic imports with ssr: false" },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-02-15",
    title: "Navigation + Documentation Pages",
    changes: [
      { type: "added", description: "Hamburger menu navigation with links to all pages" },
      { type: "added", description: "Architecture Diagram page (/architecture) with full system overview" },
      { type: "added", description: "JSON Schema Breakdown page (/architecture/schema) with complete file format specification" },
      { type: "changed", description: "Menu button styled with white background and text-colored icon" },
      { type: "added", description: "Active page highlighting in navigation menu" },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-02-15",
    title: "UI Polish + Component Improvements",
    changes: [
      { type: "changed", description: "Move up/down and delete buttons show inline on md+ screens, kebab dropdown on small screens" },
      { type: "changed", description: "Variables toolbar changed from inline chips to a dropdown icon with Braces icon" },
      { type: "changed", description: "Reset Theme button moved inside the collapsible theme styling dropdown" },
      { type: "added", description: "Unit of measurement label (px) added to image width input" },
      { type: "removed", description: "Paste HTML dialog removed from section editor" },
      { type: "changed", description: "Email preview panel expanded to fill entire right-side div" },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-02-15",
    title: "Sample Template + Default Content",
    changes: [
      { type: "changed", description: "Default template updated with richer sample content including multiple headings, paragraphs, and list" },
      { type: "added", description: "Template variables used in default content: $FirstName, $PolicyOwnerNumber, $ApplicationReference" },
      { type: "added", description: "Feedback section and multi-item list in default body" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-02-14",
    title: "Initial Release -- Email Template Builder",
    changes: [
      { type: "added", description: "Split-pane email template builder with resizable panels" },
      { type: "added", description: "6 component types: Heading, Paragraph, Image, List, Indent Block, Raw HTML" },
      { type: "added", description: "Rich text editing with Bold, Italic, Underline formatting" },
      { type: "added", description: "Link insertion supporting web URLs, email addresses, and telephone numbers" },
      { type: "added", description: "Template variable system: $FirstName, $LastName, $PolicyOwnerNumber, $ApplicationReference" },
      { type: "added", description: "Theme editor with 11 color properties grouped by Background, Text, and Other" },
      { type: "added", description: "3-tab preview panel: rendered Preview, raw HTML, and HTML Entities" },
      { type: "added", description: "JSON download/upload for template persistence" },
      { type: "added", description: "HTML 4.01 Transitional output with table-based layout, inline styles, and email-client CSS resets" },
      { type: "added", description: "Responsive @media queries and Outlook/mso compatibility in generated HTML" },
      { type: "added", description: "Section types: Header, Body, Footer with collapsible editors" },
      { type: "added", description: "Component reordering with move up/down controls" },
    ],
  },
]

function Tag({ type }: { type: ChangeType }) {
  const colors = TAG_COLORS[type]
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shrink-0"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {type}
    </span>
  )
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: BG_PAGE }}>
      <AppHeader currentPath="/changelog" />
      <div className="border-b px-8 py-5" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
        <h2 className="text-lg font-bold tracking-tight" style={{ color: "#0f172a" }}>
          Changelog
        </h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>
          Version history, new features, and improvements.
        </p>
      </div>

      <main className="px-8 py-10 max-w-3xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{ backgroundColor: BORDER }}
          />

          <div className="flex flex-col gap-10">
            {CHANGELOG.map((release) => (
              <div key={release.version} className="relative pl-8">
                {/* Timeline dot */}
                <div
                  className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2"
                  style={{ borderColor: ACCENT, backgroundColor: BG_CARD }}
                />

                {/* Version header */}
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: "#0f172a" }}
                  >
                    v{release.version}
                  </span>
                  <span className="text-xs" style={{ color: MUTED }}>
                    {release.date}
                  </span>
                </div>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "#0f172a" }}
                >
                  {release.title}
                </h3>

                {/* Changes list */}
                <div
                  className="rounded-lg border"
                  style={{ borderColor: BORDER, backgroundColor: BG_CARD }}
                >
                  <ul className="divide-y" style={{ borderColor: BORDER }}>
                    {release.changes.map((change, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 px-4 py-2.5"
                      >
                        <Tag type={change.type} />
                        <span className="text-xs leading-relaxed" style={{ color: MUTED }}>
                          {change.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
