"use client"

import Link from "next/link"
import { ArrowLeft, Database, Cloud, RefreshCw, FileJson, Mail, Users, GitBranch, Lock, Zap } from "lucide-react"

/* ─── Design tokens (matching schema page) ─── */
const BG = "#09090b"
const BG_CARD = "#18181b"
const BORDER = "#27272a"
const MUTED = "#a1a1aa"

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-10 mb-4">
      <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
      <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: MUTED }}>
        {children}
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
    </div>
  )
}

function Card({ title, icon, children, color = "#3b82f6" }: { title: string; icon: React.ReactNode; children: React.ReactNode; color?: string }) {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
      <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: color }}>
        {icon}
        <span className="text-sm font-bold text-white">{title}</span>
      </div>
      <div className="p-5 text-xs leading-relaxed" style={{ color: MUTED }}>
        {children}
      </div>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="rounded-md p-3 text-[10px] leading-relaxed overflow-x-auto font-mono"
      style={{ backgroundColor: "#0f0f10", color: "#e4e4e7" }}
    >
      {code}
    </pre>
  )
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="w-px h-6" style={{ backgroundColor: BORDER }} />
      <div className="absolute w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent" style={{ borderTopColor: BORDER, transform: "translateY(12px)" }} />
    </div>
  )
}

export default function CMSIntegrationPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: "#fafafa" }}>
      {/* Header */}
      <header className="border-b px-8 py-4 flex items-center gap-4" style={{ borderColor: BORDER }}>
        <Link
          href="/architecture"
          className="inline-flex items-center gap-1.5 text-xs hover:underline"
          style={{ color: MUTED }}
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Architecture
        </Link>
        <div className="h-4 w-px" style={{ backgroundColor: BORDER }} />
        <h1 className="text-sm font-semibold">CMS Integration Theory</h1>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#3b82f6", color: "white" }}>
          Proposal
        </span>
      </header>

      <main className="px-8 py-10 max-w-5xl mx-auto">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">Headless CMS Integration</h2>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            This document explores how the Email Template Builder could integrate with a headless CMS like 
            <strong className="text-white"> Contentful</strong>, <strong className="text-white">Sanity</strong>, or 
            <strong className="text-white"> Strapi</strong> to enable collaborative template management, version control, 
            and multi-environment workflows. The current system is fully client-side with JSON export/import — 
            a CMS integration would add persistence, collaboration, and governance.
          </p>
        </div>

        {/* Why CMS */}
        <SectionLabel>Why Integrate with a CMS?</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Persistence & History" icon={<Database className="w-4 h-4 text-white" />} color="#8b5cf6">
            <ul className="space-y-1.5">
              <li>• Templates stored in the cloud, not local JSON files</li>
              <li>• Full version history with rollback capability</li>
              <li>• Automatic backups and disaster recovery</li>
              <li>• No risk of losing work if browser closes</li>
            </ul>
          </Card>
          <Card title="Collaboration" icon={<Users className="w-4 h-4 text-white" />} color="#0ea5e9">
            <ul className="space-y-1.5">
              <li>• Multiple users can edit templates</li>
              <li>• Role-based access (editor, reviewer, admin)</li>
              <li>• Approval workflows before publishing</li>
              <li>• Comments and change tracking</li>
            </ul>
          </Card>
          <Card title="Multi-Environment" icon={<GitBranch className="w-4 h-4 text-white" />} color="#10b981">
            <ul className="space-y-1.5">
              <li>• Draft / Preview / Production environments</li>
              <li>• Test templates before going live</li>
              <li>• Scheduled publishing</li>
              <li>• A/B testing different versions</li>
            </ul>
          </Card>
        </div>

        {/* Content Model Mapping */}
        <SectionLabel>Content Model Mapping</SectionLabel>
        <p className="text-xs mb-4" style={{ color: MUTED }}>
          The existing JSON schema maps naturally to Contentful&apos;s content model structure. Each level of the hierarchy becomes a Content Type.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Schema */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Current JSON Schema</p>
            <CodeBlock code={`EmailTemplate
├── id: string
├── name: string
├── theme: EmailTheme
└── sections: EmailSection[]
    ├── id: string
    ├── type: "header" | "body" | "footer"
    └── components: EmailComponent[]
        ├── id: string
        ├── type: ComponentType
        ├── content: string
        └── props: Record<string, any>`} />
          </div>

          {/* Contentful Model */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Contentful Content Types</p>
            <CodeBlock code={`Content Type: "emailTemplate"
├── name (Short text)
├── theme (JSON object)
└── sections (References, many)
    └── Content Type: "emailSection"
        ├── sectionType (Short text, validation)
        └── components (References, many)
            └── Content Type: "emailComponent"
                ├── componentType (Short text)
                ├── content (Long text)
                └── props (JSON object)`} />
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
          <p className="text-xs font-semibold mb-2 text-white">Alternative: Single Entry Approach</p>
          <p className="text-xs" style={{ color: MUTED }}>
            Instead of splitting into multiple Content Types, the entire template could be stored as a single JSON field 
            in one &quot;emailTemplate&quot; entry. This is simpler but loses Contentful&apos;s built-in validation, search, and 
            component reuse. <strong className="text-white">Recommended for MVP</strong>, then migrate to structured types later.
          </p>
          <CodeBlock code={`Content Type: "emailTemplate"
├── name (Short text)
├── templateData (JSON object)  // The entire EmailTemplate
└── generatedHtml (Long text)   // Cached HTML output`} />
        </div>

        {/* Sync Patterns */}
        <SectionLabel>Sync Architecture Patterns</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card title="Pattern A: Read-Only CMS" icon={<Cloud className="w-4 h-4 text-white" />} color="#f59e0b">
            <p className="mb-3">
              CMS is the source of truth. The builder fetches templates from Contentful and generates HTML locally. 
              Edits are made in the Contentful web UI, not the builder.
            </p>
            <p className="font-semibold text-white mb-1">Flow:</p>
            <ol className="space-y-1">
              <li>1. User selects template from CMS-powered dropdown</li>
              <li>2. Builder fetches entry via Contentful Delivery API</li>
              <li>3. JSON is loaded into local state for preview/export</li>
              <li>4. Generated HTML can be copied or sent to ESP</li>
            </ol>
            <p className="mt-3 text-[10px] italic">Best for: Strict governance, non-technical editors in CMS</p>
          </Card>

          <Card title="Pattern B: Bidirectional Sync" icon={<RefreshCw className="w-4 h-4 text-white" />} color="#ec4899">
            <p className="mb-3">
              Builder can both read and write to CMS. Users edit visually in the builder, then save changes back 
              to Contentful via the Management API.
            </p>
            <p className="font-semibold text-white mb-1">Flow:</p>
            <ol className="space-y-1">
              <li>1. User authenticates with Contentful (OAuth or token)</li>
              <li>2. Fetches template list from CMS</li>
              <li>3. Edits in the visual builder (existing UX)</li>
              <li>4. Saves changes back to CMS entry</li>
              <li>5. CMS handles versioning, publishing, approval</li>
            </ol>
            <p className="mt-3 text-[10px] italic">Best for: Visual editing workflow, power users</p>
          </Card>
        </div>

        {/* API Integration */}
        <SectionLabel>Contentful API Integration</SectionLabel>

        <div className="space-y-4">
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: "#0f172a" }}>
              <FileJson className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white">Fetch Template (Delivery API)</span>
            </div>
            <div className="p-4">
              <CodeBlock code={`// lib/contentful.ts
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
})

export async function getTemplate(id: string): Promise<EmailTemplate> {
  const entry = await client.getEntry(id)
  
  // If using single-entry JSON approach:
  return entry.fields.templateData as EmailTemplate
  
  // If using structured Content Types:
  // return transformContentfulToSchema(entry)
}

export async function listTemplates(): Promise<{ id: string; name: string }[]> {
  const entries = await client.getEntries({
    content_type: 'emailTemplate',
    select: ['sys.id', 'fields.name'],
    order: ['-sys.updatedAt'],
  })
  
  return entries.items.map(e => ({
    id: e.sys.id,
    name: e.fields.name as string,
  }))
}`} />
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: "#0f172a" }}>
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white">Save Template (Management API)</span>
            </div>
            <div className="p-4">
              <CodeBlock code={`// lib/contentful-management.ts
import { createClient } from 'contentful-management'

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
})

export async function saveTemplate(
  entryId: string, 
  template: EmailTemplate
): Promise<void> {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment('master')
  const entry = await environment.getEntry(entryId)
  
  // Update the JSON field
  entry.fields.templateData = { 'en-US': template }
  entry.fields.generatedHtml = { 
    'en-US': generateEmailHtml(template, template.theme) 
  }
  
  const updated = await entry.update()
  
  // Optionally auto-publish (or leave as draft for review)
  // await updated.publish()
}`} />
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <SectionLabel>Proposed Architecture</SectionLabel>

        <div className="rounded-lg border p-6" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
          <div className="flex flex-col items-center gap-2">
            {/* Row 1: Users */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-md text-xs font-semibold text-white" style={{ backgroundColor: "#8b5cf6" }}>
                Marketing Team (Contentful UI)
              </div>
              <div className="px-4 py-2 rounded-md text-xs font-semibold text-white" style={{ backgroundColor: "#0ea5e9" }}>
                Template Designers (Builder UI)
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <div className="w-px h-6" style={{ backgroundColor: BORDER }} />
              <span className="text-[10px]" style={{ color: MUTED }}>OAuth / API Token</span>
              <div className="w-px h-6" style={{ backgroundColor: BORDER }} />
            </div>

            {/* Row 2: CMS */}
            <div className="px-6 py-3 rounded-md text-sm font-bold text-white" style={{ backgroundColor: "#f59e0b" }}>
              Contentful (Headless CMS)
            </div>
            <p className="text-[10px]" style={{ color: MUTED }}>Content Types + Webhooks + CDN</p>

            <div className="flex items-center gap-2 py-2">
              <span className="text-[10px]" style={{ color: MUTED }}>Delivery API (read)</span>
              <div className="w-px h-6" style={{ backgroundColor: BORDER }} />
              <span className="text-[10px]" style={{ color: MUTED }}>Management API (write)</span>
            </div>

            {/* Row 3: Builder */}
            <div className="px-6 py-3 rounded-md text-sm font-bold text-white" style={{ backgroundColor: "#10b981" }}>
              Email Template Builder (Next.js)
            </div>
            <p className="text-[10px]" style={{ color: MUTED }}>Visual Editor + Live Preview + HTML Generator</p>

            <div className="w-px h-6" style={{ backgroundColor: BORDER }} />

            {/* Row 4: Outputs */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-md text-xs font-semibold text-white" style={{ backgroundColor: "#64748b" }}>
                ESP (SendGrid, Mailchimp, etc.)
              </div>
              <div className="px-4 py-2 rounded-md text-xs font-semibold text-white" style={{ backgroundColor: "#64748b" }}>
                Generated HTML Download
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Integration */}
        <SectionLabel>Webhook Automation</SectionLabel>

        <Card title="Contentful Webhooks" icon={<Zap className="w-4 h-4 text-white" />} color="#10b981">
          <p className="mb-3">
            Contentful can trigger webhooks when templates are published. This enables automated workflows:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-3 rounded-md" style={{ backgroundColor: "#0f0f10" }}>
              <p className="text-[10px] font-semibold text-white mb-2">On Publish → Generate HTML</p>
              <p className="text-[10px]">
                Webhook hits a Next.js API route that fetches the published template, runs it through 
                <code className="font-mono mx-1">generateEmailHtml()</code>, and stores the result back in a 
                &quot;generatedHtml&quot; field or external storage.
              </p>
            </div>
            <div className="p-3 rounded-md" style={{ backgroundColor: "#0f0f10" }}>
              <p className="text-[10px] font-semibold text-white mb-2">On Publish → Sync to ESP</p>
              <p className="text-[10px]">
                Webhook triggers a serverless function that pushes the generated HTML directly to an 
                Email Service Provider via their API (e.g., SendGrid Templates, Mailchimp Campaigns).
              </p>
            </div>
            <div className="p-3 rounded-md" style={{ backgroundColor: "#0f0f10" }}>
              <p className="text-[10px] font-semibold text-white mb-2">On Publish → Notify Slack</p>
              <p className="text-[10px]">
                Post a message to a Slack channel with template name, preview link, and who published it. 
                Great for team visibility and audit trails.
              </p>
            </div>
            <div className="p-3 rounded-md" style={{ backgroundColor: "#0f0f10" }}>
              <p className="text-[10px] font-semibold text-white mb-2">On Unpublish → Archive</p>
              <p className="text-[10px]">
                When a template is unpublished or deleted, automatically archive it in a backup bucket 
                or mark it as inactive in the ESP to prevent accidental sends.
              </p>
            </div>
          </div>
        </Card>

        {/* Implementation Roadmap */}
        <SectionLabel>Implementation Roadmap</SectionLabel>

        <div className="space-y-3">
          {[
            {
              phase: "Phase 1",
              title: "Read-Only Integration",
              items: [
                "Add Contentful client library",
                "Create API route to list templates from CMS",
                "Add template selector dropdown to builder UI",
                "Load selected template into existing state",
              ],
              effort: "2-3 days",
              color: "#10b981",
            },
            {
              phase: "Phase 2",
              title: "Write-Back Capability",
              items: [
                "Add Contentful Management API integration",
                "Create 'Save to CMS' button in builder",
                "Handle authentication (OAuth or token input)",
                "Implement optimistic UI with error handling",
              ],
              effort: "3-4 days",
              color: "#0ea5e9",
            },
            {
              phase: "Phase 3",
              title: "Workflow Automation",
              items: [
                "Set up Contentful webhooks",
                "Create Next.js API routes for webhook handlers",
                "Auto-generate HTML on publish",
                "Optional: Direct ESP sync integration",
              ],
              effort: "2-3 days",
              color: "#8b5cf6",
            },
            {
              phase: "Phase 4",
              title: "Advanced Features",
              items: [
                "Component library (reusable sections across templates)",
                "Template inheritance (base + variants)",
                "Real-time collaboration (Contentful Live Preview)",
                "A/B variant management with analytics",
              ],
              effort: "1-2 weeks",
              color: "#f59e0b",
            },
          ].map((phase) => (
            <div
              key={phase.phase}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: BORDER, backgroundColor: BG_CARD }}
            >
              <div className="px-5 py-2 flex items-center justify-between" style={{ backgroundColor: phase.color }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{phase.phase}:</span>
                  <span className="text-xs text-white/90">{phase.title}</span>
                </div>
                <span className="text-[10px] text-white/70">{phase.effort}</span>
              </div>
              <div className="px-5 py-3">
                <ul className="text-xs space-y-1" style={{ color: MUTED }}>
                  {phase.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Alternative CMS Options */}
        <SectionLabel>Alternative CMS Options</SectionLabel>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Sanity" icon={<Database className="w-4 h-4 text-white" />} color="#f43f5e">
            <ul className="space-y-1.5">
              <li>• Real-time collaboration built-in</li>
              <li>• GROQ query language (very flexible)</li>
              <li>• Portable Text for rich content</li>
              <li>• Custom Studio UI plugins</li>
              <li>• Free tier generous for small teams</li>
            </ul>
          </Card>
          <Card title="Strapi" icon={<Database className="w-4 h-4 text-white" />} color="#4945ff">
            <ul className="space-y-1.5">
              <li>• Self-hosted option (full control)</li>
              <li>• Open source, customizable</li>
              <li>• REST + GraphQL APIs</li>
              <li>• Plugin ecosystem</li>
              <li>• Good for regulated industries</li>
            </ul>
          </Card>
          <Card title="Payload CMS" icon={<Database className="w-4 h-4 text-white" />} color="#0f172a">
            <ul className="space-y-1.5">
              <li>• TypeScript-native</li>
              <li>• Self-hosted, runs in Next.js</li>
              <li>• Code-first configuration</li>
              <li>• Built-in auth and access control</li>
              <li>• No external dependency</li>
            </ul>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: BORDER }}>
          <p className="text-xs" style={{ color: MUTED }}>
            This is a theoretical proposal. Implementation would require environment variables for API keys, 
            authentication flow design, and decisions about content model structure.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/architecture" className="text-xs hover:underline" style={{ color: "#3b82f6" }}>
              ← Back to Architecture
            </Link>
            <Link href="/architecture/schema" className="text-xs hover:underline" style={{ color: "#3b82f6" }}>
              View JSON Schema →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
