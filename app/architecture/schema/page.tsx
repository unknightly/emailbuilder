"use client"

import { AppHeader } from "@/components/email-builder/app-header"

const ACCENT = "#1a73e8"
const MUTED = "#64748b"
const BORDER = "#e2e8f0"
const BG_CARD = "#ffffff"
const BG_PAGE = "#f8fafc"
const BG_CODE = "#f1f5f9"

const TYPE_COLORS: Record<string, string> = {
  string: "#0ea5e9",
  number: "#f59e0b",
  boolean: "#10b981",
  enum: "#8b5cf6",
  array: "#ec4899",
  object: "#0f172a",
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
      style={{ backgroundColor: TYPE_COLORS[type] || MUTED }}
    >
      {type}
    </span>
  )
}

function SchemaField({
  name,
  type,
  required = true,
  description,
  enumValues,
  defaultValue,
  children,
}: {
  name: string
  type: string
  required?: boolean
  description: string
  enumValues?: string[]
  defaultValue?: string
  children?: React.ReactNode
}) {
  return (
    <div className="border-l-2 pl-4 py-3" style={{ borderColor: TYPE_COLORS[type] || BORDER }}>
      <div className="flex items-center gap-2 flex-wrap">
        <code className="text-sm font-semibold" style={{ color: "#0f172a" }}>{name}</code>
        <TypeBadge type={type} />
        {!required && (
          <span className="text-[10px] font-medium rounded-full border px-1.5 py-0.5" style={{ color: MUTED, borderColor: BORDER }}>
            optional
          </span>
        )}
        {required && (
          <span className="text-[10px] font-medium text-red-500">required</span>
        )}
      </div>
      <p className="text-xs mt-1" style={{ color: MUTED }}>{description}</p>
      {enumValues && (
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {enumValues.map((v) => (
            <code
              key={v}
              className="text-[11px] rounded border px-1.5 py-0.5"
              style={{ borderColor: BORDER, backgroundColor: BG_CODE, color: "#0f172a" }}
            >
              {`"${v}"`}
            </code>
          ))}
        </div>
      )}
      {defaultValue && (
        <p className="text-[11px] mt-1" style={{ color: MUTED }}>
          Default: <code className="rounded border px-1 py-0.5" style={{ borderColor: BORDER, backgroundColor: BG_CODE }}>{defaultValue}</code>
        </p>
      )}
      {children && <div className="mt-3 ml-2">{children}</div>}
    </div>
  )
}

function SchemaCard({
  title,
  description,
  color = ACCENT,
  children,
}: {
  title: string
  description: string
  color?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
      <div className="px-5 py-4" style={{ backgroundColor: color }}>
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="text-[11px] text-white/70 mt-0.5">{description}</p>
      </div>
      <div className="px-5 py-4 flex flex-col gap-1">
        {children}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-10">
      <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: MUTED }}>{children}</span>
      <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="rounded-lg border p-4 text-xs font-mono leading-relaxed overflow-x-auto"
      style={{ borderColor: BORDER, backgroundColor: BG_CODE, color: "#0f172a" }}
    >
      {code}
    </pre>
  )
}

export default function SchemaPage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: BG_PAGE }}>
      <AppHeader currentPath="/architecture/schema" />

      <div className="px-8 py-6" style={{ backgroundColor: BG_CARD, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <a href="/architecture" className="text-xs hover:underline" style={{ color: ACCENT }}>Architecture</a>
            <span className="text-xs" style={{ color: MUTED }}>/</span>
            <span className="text-xs" style={{ color: MUTED }}>Schema</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#0f172a" }}>
            JSON Schema Breakdown
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Complete specification of the JSON file format used for importing and exporting email templates.
          </p>
        </div>
      </div>

      <main className="px-8 py-8 max-w-5xl mx-auto">

        {/* Top-Level Structure */}
        <SectionLabel>Top-Level File Structure</SectionLabel>
        <p className="text-xs mb-4" style={{ color: MUTED }}>
          The exported <code className="font-mono">.json</code> file contains two top-level keys. When uploading, the builder also supports a legacy format where the root is an array of sections (without theme).
        </p>
        <CodeBlock code={`{
  "sections": EmailSection[],   // Array of 3 sections (header, body, footer)
  "theme": EmailTheme            // Color overrides for the generated HTML
}`} />

        {/* EmailSection */}
        <SectionLabel>EmailSection</SectionLabel>
        <SchemaCard title="EmailSection" description="A structural region of the email. There are always exactly 3: header, body, and footer." color="#0f172a">
          <SchemaField name="id" type="string" description="Unique identifier. 8-character alphanumeric string generated via Math.random().toString(36)." />
          <SchemaField name="type" type="enum" description="The structural role of this section in the email layout." enumValues={["header", "body", "footer"]} />
          <SchemaField name="label" type="string" description="Human-readable display name shown in the builder sidebar (e.g. 'Header', 'Body', 'Footer')." />
          <SchemaField name="components" type="array" description="Ordered list of content blocks inside this section. Rendered top-to-bottom in the generated HTML." />
        </SchemaCard>

        {/* EmailComponent */}
        <SectionLabel>EmailComponent</SectionLabel>
        <SchemaCard title="EmailComponent" description="A single content block within a section. Six types are supported, each with different props." color={ACCENT}>
          <SchemaField name="id" type="string" description="Unique identifier for this component instance." />
          <SchemaField name="type" type="enum" description="Determines the rendering strategy and which props are relevant." enumValues={["heading", "paragraph", "image", "list", "indent", "html"]} />
          <SchemaField name="content" type="string" description="Primary text content. Usage varies by type (see Component Types below)." />
          <SchemaField name="props" type="object" description="Type-specific properties. See the per-type breakdown below for valid keys." />
        </SchemaCard>

        {/* Component Type Details */}
        <SectionLabel>Component Types (props breakdown)</SectionLabel>
        <div className="grid grid-cols-1 gap-4">

          <SchemaCard title="heading" description="Renders an H1-H4 element with themed color. Supports rich text (bold, italic, underline, links, variables)." color="#8b5cf6">
            <SchemaField name="content" type="string" description="The heading text. Supports **bold**, *italic*, __underline__ syntax and $Variable placeholders." />
            <SchemaField name="props.level" type="number" description="HTML heading level." enumValues={["1", "2", "3", "4"]} defaultValue="3" />
            <SchemaField name="props.links" type="array" required={false} description="Array of ParagraphLink objects for inline hyperlinks. Referenced in content via [link:id] placeholders." />
          </SchemaCard>

          <SchemaCard title="paragraph" description="Renders a <p> element. Supports rich text formatting, links, variables, and line breaks (\n -> <br>)." color="#8b5cf6">
            <SchemaField name="content" type="string" description="Paragraph text. Supports **bold**, *italic*, __underline__, \n line breaks, $Variable placeholders, and [link:id] references." />
            <SchemaField name="props.links" type="array" required={false} description="Array of ParagraphLink objects for inline hyperlinks." />
          </SchemaCard>

          <SchemaCard title="image" description="Renders a responsive table-based image block with alt text." color="#8b5cf6">
            <SchemaField name="content" type="string" description="The image URL (absolute or relative)." />
            <SchemaField name="props.alt" type="string" description="Alt text for accessibility and email clients that block images." defaultValue={'"Image description"'} />
            <SchemaField name="props.width" type="number" description="Display width in pixels. The image is rendered responsively with max-width." defaultValue="600" />
          </SchemaCard>

          <SchemaCard title="list" description="Renders an unordered <ul> list with bullet points. Each item supports rich text formatting." color="#8b5cf6">
            <SchemaField name="content" type="string" description="Unused (empty string). List items are stored in props." defaultValue='""' />
            <SchemaField name="props.items" type="array" description='Array of strings, each rendered as a <li> element. Supports **bold**, *italic*, __underline__ syntax. e.g. ["Step one", "**Important** step two"]' />
            <SchemaField name="props.links" type="array" required={false} description="Array of ParagraphLink objects for inline hyperlinks within list items. Referenced via [link:id] in item strings." />
          </SchemaCard>

          <SchemaCard title="indent" description="Renders a visually indented block with a themed background color. Used for callouts, quotes, or highlighted content. Supports rich text." color="#8b5cf6">
            <SchemaField name="content" type="string" description="The indented text content. Supports **bold**, *italic*, __underline__, [link:id] references, and \n line breaks." />
            <SchemaField name="props.links" type="array" required={false} description="Array of ParagraphLink objects for inline hyperlinks within the indent block." />
          </SchemaCard>

          <SchemaCard title="html" description="Renders raw HTML directly into the email. No escaping or processing is applied." color="#8b5cf6">
            <SchemaField name="content" type="string" description="Raw HTML string injected as-is into the generated email output." />
            <SchemaField name="props" type="object" description="No additional props." />
          </SchemaCard>
        </div>

        {/* ParagraphLink */}
        <SectionLabel>ParagraphLink</SectionLabel>
        <SchemaCard title="ParagraphLink" description="Defines an inline hyperlink used inside heading or paragraph components. Referenced by [link:id] in content." color="#10b981">
          <SchemaField name="id" type="string" description="Unique identifier matching the [link:id] placeholder in the parent component's content." />
          <SchemaField name="text" type="string" description="The visible display text rendered inside the <a> tag." />
          <SchemaField name="url" type="string" description="The destination. For web: full URL. For email: address only (mailto: prefix is added). For telephone: number (tel: prefix is added)." />
          <SchemaField name="linkType" type="enum" description="Determines the URL prefix and input validation." enumValues={["web", "email", "telephone"]} />
        </SchemaCard>

        {/* EmailTheme */}
        <SectionLabel>EmailTheme</SectionLabel>
        <SchemaCard title="EmailTheme" description="11 hex color strings that override the default email template colors at generation time." color="#f59e0b">
          <SchemaField name="outerBackground" type="string" description="Background color of the full-width wrapper table behind the email container." defaultValue='"#F0F0F0"' />
          <SchemaField name="containerBackground" type="string" description="Background of the centered 600px email container." defaultValue='"#FFFFFF"' />
          <SchemaField name="headerBackground" type="string" description="Background of the header section row." defaultValue='"#FFFFFF"' />
          <SchemaField name="bodyBackground" type="string" description="Background of the body section row." defaultValue='"#FFFFFF"' />
          <SchemaField name="footerBackground" type="string" description="Background of the footer section row." defaultValue='"#F0F0F0"' />
          <SchemaField name="headingColor" type="string" description="Text color for all heading components in the body section." defaultValue='"#333333"' />
          <SchemaField name="bodyTextColor" type="string" description="Text color for paragraphs, lists, and indent blocks in the body." defaultValue='"#333333"' />
          <SchemaField name="footerTextColor" type="string" description="Text color for all content in the footer section." defaultValue='"#aaaaaa"' />
          <SchemaField name="linkColor" type="string" description="Color applied to all <a> tag styles in the generated HTML." defaultValue='"#1a73e8"' />
          <SchemaField name="indentBackground" type="string" description="Background color of indent (callout) blocks." defaultValue='"#f7f7f7"' />
        </SchemaCard>

        {/* Template Variables */}
        <SectionLabel>Template Variables</SectionLabel>
        <div className="rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
          <div className="px-5 py-4" style={{ backgroundColor: "#0f172a" }}>
            <h2 className="text-sm font-bold text-white">Supported Merge Fields</h2>
            <p className="text-[11px] text-white/70 mt-0.5">Variables are rendered as-is in the HTML output. They are intended to be replaced by an external mail-merge or templating system at send time.</p>
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "$FirstName", description: "Recipient's first name" },
                { name: "$LastName", description: "Recipient's last name" },
                { name: "$PolicyOwnerNumber", description: "Policy or member reference number" },
                { name: "$ApplicationReference", description: "Application or case reference ID" },
              ].map((v) => (
                <div key={v.name} className="flex items-center gap-3 rounded border p-2.5" style={{ borderColor: BORDER, backgroundColor: BG_CODE }}>
                  <code className="text-xs font-bold font-mono" style={{ color: "#0f172a" }}>{v.name}</code>
                  <span className="text-[11px]" style={{ color: MUTED }}>{v.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rich Text Syntax */}
        <SectionLabel>Rich Text Formatting Syntax</SectionLabel>
        <div className="rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
          <div className="px-5 py-4" style={{ backgroundColor: "#0f172a" }}>
            <h2 className="text-sm font-bold text-white">Inline Formatting</h2>
            <p className="text-[11px] text-white/70 mt-0.5">Applied during HTML generation via processRichContent(). Supported in heading, paragraph, list item, and indent content strings. Rendered visually in the editor via VisualTextInput (contentEditable).</p>
          </div>
          <div className="px-5 py-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: BORDER }}>
                  <th className="text-left pb-2 font-semibold" style={{ color: "#0f172a" }}>Syntax</th>
                  <th className="text-left pb-2 font-semibold" style={{ color: "#0f172a" }}>HTML Output</th>
                  <th className="text-left pb-2 font-semibold" style={{ color: "#0f172a" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { syntax: "**text**", output: "<strong>text</strong>", desc: "Bold text" },
                  { syntax: "*text*", output: "<em>text</em>", desc: "Italic text" },
                  { syntax: "__text__", output: "<u>text</u>", desc: "Underlined text" },
                  { syntax: "[link:abc123]", output: '<a href="...">Display Text</a>', desc: "Inline hyperlink (resolved from props.links array)" },
                  { syntax: "\\n", output: "<br>", desc: "Line break" },
                  { syntax: "$FirstName", output: "$FirstName", desc: "Variable (passed through as-is for mail-merge)" },
                ].map((r) => (
                  <tr key={r.syntax} className="border-b last:border-0" style={{ borderColor: BORDER }}>
                    <td className="py-2 pr-4">
                      <code className="rounded border px-1.5 py-0.5 font-mono" style={{ borderColor: BORDER, backgroundColor: BG_CODE }}>{r.syntax}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code className="rounded border px-1.5 py-0.5 font-mono text-[11px]" style={{ borderColor: BORDER, backgroundColor: BG_CODE }}>{r.output}</code>
                    </td>
                    <td className="py-2" style={{ color: MUTED }}>{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Example */}
        <SectionLabel>Complete JSON Example</SectionLabel>
        <CodeBlock code={`{
  "sections": [
    {
      "id": "a1b2c3d4",
      "type": "header",
      "label": "Header",
      "components": [
        {
          "id": "e5f6g7h8",
          "type": "image",
          "content": "https://example.com/logo.png",
          "props": {
            "alt": "Company Logo",
            "width": 204
          }
        }
      ]
    },
    {
      "id": "i9j0k1l2",
      "type": "body",
      "label": "Body",
      "components": [
        {
          "id": "m3n4o5p6",
          "type": "paragraph",
          "content": "Dear $FirstName,\\nUser number: $PolicyOwnerNumber",
          "props": {}
        },
        {
          "id": "q7r8s9t0",
          "type": "heading",
          "content": "What happens next?",
          "props": { "level": 3 }
        },
        {
          "id": "u1v2w3x4",
          "type": "paragraph",
          "content": "Please visit our **support portal** for more information.",
          "props": {
            "links": [
              {
                "id": "y5z6a7b8",
                "text": "support portal",
                "url": "https://support.example.com",
                "linkType": "web"
              }
            ]
          }
        },
        {
          "id": "c9d0e1f2",
          "type": "list",
          "content": "",
          "props": {
            "items": ["Step one", "Step two", "Step three"]
          }
        },
        {
          "id": "g3h4i5j6",
          "type": "indent",
          "content": "Important: Please keep this reference for your records.",
          "props": {}
        }
      ]
    },
    {
      "id": "k7l8m9n0",
      "type": "footer",
      "label": "Footer",
      "components": [
        {
          "id": "o1p2q3r4",
          "type": "paragraph",
          "content": "Privacy Policy applies.",
          "props": {}
        }
      ]
    }
  ],
  "theme": {
    "outerBackground": "#F0F0F0",
    "containerBackground": "#FFFFFF",
    "headerBackground": "#FFFFFF",
    "bodyBackground": "#FFFFFF",
    "footerBackground": "#F0F0F0",
    "headingColor": "#333333",
    "bodyTextColor": "#333333",
    "footerTextColor": "#aaaaaa",
    "linkColor": "#1a73e8",
    "indentBackground": "#f7f7f7"
  }
}`} />

        {/* Validation Rules */}
        <SectionLabel>Upload Validation Rules</SectionLabel>
        <div className="rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
          <div className="px-5 py-4">
            <ul className="flex flex-col gap-2 text-xs" style={{ color: MUTED }}>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0 w-4 text-center" style={{ color: "#0f172a" }}>1</span>
                File must be valid JSON (parsed via JSON.parse)
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0 w-4 text-center" style={{ color: "#0f172a" }}>2</span>
                {'Root must be an object with a "sections" key containing an array, OR a legacy array of sections directly'}
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0 w-4 text-center" style={{ color: "#0f172a" }}>3</span>
                {'Each section must have: id (string), type (string), label (string), components (array)'}
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0 w-4 text-center" style={{ color: "#0f172a" }}>4</span>
                {'If a "theme" key is present, it is merged with DEFAULT_THEME (missing keys get defaults)'}
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0 w-4 text-center" style={{ color: "#0f172a" }}>5</span>
                Invalid files are silently rejected (no error shown to user)
              </li>
            </ul>
          </div>
        </div>

        {/* Footer nav */}
        <div className="mt-10 flex justify-between items-center py-4 border-t" style={{ borderColor: BORDER }}>
          <a href="/architecture" className="text-xs font-medium hover:underline" style={{ color: ACCENT }}>
            Back to Architecture Diagram
          </a>
          <a href="/" className="text-xs font-medium hover:underline" style={{ color: ACCENT }}>
            Back to Email Builder
          </a>
        </div>
      </main>
    </div>
  )
}
