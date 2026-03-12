"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { AppHeader } from "@/components/email-builder/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import {
  Copy,
  Check,
  Trash2,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Pencil,
  FileText,
} from "lucide-react"
import { createId } from "@/lib/email-types"

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

interface BulletEntry {
  id: string
  title: string           // bold heading for the bullet
  description: string     // paragraph below
  valueStatement: string  // green bold value statement
  videoLink: string       // link for "Watch Demo" button (blank = no button)
}

interface ContentSection {
  id: string
  sectionTitle: string   // e.g. "TAL Connect delivery highlights"
  bullets: BulletEntry[]
}

interface NewsletterData {
  subject: string
  incrementTitle: string       // e.g. "Platform Update  Increment 28.2"
  introText: string
  introSubHeading: string      // e.g. "Delivering with TAL Connect"
  introSubText: string
  sections: ContentSection[]
  feedbackHeading: string
  feedbackBody: string
  showcaseHeading: string
  showcaseBody: string
  showcaseVideoLink: string
  footerText: string
}

// ────────────────────────────────────────────────
// Default data extracted from the TAL template
// ────────────────────────────────────────────────

function buildDefaultData(): NewsletterData {
  return {
    subject: "FOR REVIEW: Continuous Delivery | GL&R Platform Update - Product Increment 28.3",
    incrementTitle: "Platform Update  Increment 28.2",
    introText: "Hello and welcome to the platform update",
    introSubHeading: "Delivering with TAL Connect",
    introSubText: "As always, our focus is on our TAL Connect delivery plan and onboarding new arrangements with our partners.",
    sections: [
      {
        id: createId(),
        sectionTitle: "TAL Connect delivery highlights",
        bullets: [
          {
            id: createId(),
            title: "Cbus Super — Standalone Cancel Journey",
            description: "As part of NGS Super TAL Connect onboarding, we've completed development of the end-to-end New Member Offer (NMO) among many other improvements. Progress for NGS Super onboarding is currently at 85% with a targeted release for October 2025 and a delivery date to be determined.",
            valueStatement: "Increased member engagement, reduced time for Application lodgement, reduced rework / manual process, and improved decision time (available to ~115,000 members)",
            videoLink: "https://talconnect-my.sharepoint.com/",
          },
          {
            id: createId(),
            title: "AustralianSuper — Change Work Rating",
            description: "We've successfully completed the development of the end-to-end Change Work Rating application journey for AustralianSuper as part of their induction on to TAL Connect. Progress for the Change Work Rating is at 90% & targeting release for September 2025 with a delivery date to be determined.",
            valueStatement: "Increased member engagement, reduced time for Application lodgement, reduced rework / manual process, and improved decision time (available to ~1.5m insured members)",
            videoLink: "https://talconnect-my.sharepoint.com/",
          },
          {
            id: createId(),
            title: "Cbus Super — TAL Connect Onboarding",
            description: "In continuation of the Cbus Super TAL Connect onboarding, we've implemented rules and configuration items ensuring alignment with product requirements. Progress for Cbus Super TAL Connect – Phase 1 onboarding is currently at 55% & targeting release for early 2026 with a delivery date to be determined.",
            valueStatement: "Increased member engagement, reduced time for Application lodgement, reduced rework / manual process, and improved decision time (available to ~910,000 insured members)",
            videoLink: "",
          },
        ],
      },
    ],
    feedbackHeading: "Don't miss out on the action!",
    feedbackBody: "Truly great products are built with feedback and the showcase is the opportunity to give yours! If you happened to miss the last one, catch up via the button below.",
    showcaseHeading: "In true continuous delivery spirit, we're constantly looking to improve how we deliver updates,",
    showcaseBody: "if you have any feedback, we'd love to hear from you!",
    showcaseVideoLink: "https://talconnect-my.sharepoint.com/",
    footerText: "TAL Life Limited ABN 70 050 109 450 AFSL 237848. This email and any attachments are confidential.",
  }
}

// ────────────────────────────────────────────────
// HTML Generator
// ────────────────────────────────────────────────

function generateNewsletterHtml(data: NewsletterData): string {
  const green = "#328600"
  const lightGreen = "#80C342"
  const sectionBg = "#EDF7F3"
  const sectionBorder = "#80C342"
  const rowBorder = "#B3E5A1"
  const outerBg = "#F7F7F7"

  const watchDemoButton = (link: string) =>
    link
      ? `<td align="right" valign="top" style="padding:6px 0;width:120px;">
          <a href="${link}" style="display:inline-block;padding:6px 14px;background-color:${lightGreen};color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-decoration:none;border-radius:3px;" target="_blank">Watch Demo</a>
        </td>`
      : ""

  const bulletRows = (bullets: BulletEntry[]) =>
    bullets
      .map(
        (b, idx) => `
      <!-- Bullet: ${b.title} -->
      <tr>
        <td style="padding:0 0 0 0;">
          <!-- Bullet title -->
          <ul style="margin:0 0 4px 0;padding-left:20px;">
            <li style="font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;font-weight:bold;margin:6px 0;">${b.title}</li>
          </ul>
          <!-- Description -->
          <p style="margin:0 0 4px 18px;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${b.description}</p>
          <!-- Value statement -->
          <p style="margin:0 0 6px 18px;font-size:10.5pt;font-family:Arial,sans-serif;color:${green};font-weight:bold;line-height:1.5;">${b.valueStatement}</p>
          ${
            b.videoLink
              ? `<!-- Demo table row -->
          <table border="0" cellpadding="0" cellspacing="0" style="margin-left:18px;border-collapse:collapse;width:calc(100% - 18px);margin-bottom:8px;">
            <tr>
              <td valign="top" style="border-bottom:1px solid ${rowBorder};padding:6px 0;font-size:10.5pt;font-family:Arial,sans-serif;">
                Demo available – click Watch Demo to view the recording
              </td>
              ${watchDemoButton(b.videoLink)}
            </tr>
          </table>`
              : ""
          }
        </td>
      </tr>`
      )
      .join("\n")

  const sectionsHtml = data.sections
    .map(
      (sec) => `
      <!-- Section: ${sec.sectionTitle} -->
      <table border="0" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td valign="top" style="background:${sectionBg};border-bottom:3px solid ${sectionBorder};padding:6px 8px;font-size:10.5pt;font-family:Arial,sans-serif;font-weight:bold;color:#000000;">
            ${sec.sectionTitle}
          </td>
        </tr>
        <tr>
          <td style="background:${sectionBg};padding:4px 8px 8px 8px;">
            <table border="0" cellpadding="0" cellspacing="0" style="width:100%;">
              ${bulletRows(sec.bullets)}
            </table>
          </td>
        </tr>
      </table>`
    )
    .join("\n")

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${data.subject}</title>
  <style type="text/css">
    body { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; margin:0; padding:0; }
    table { border-spacing:0; }
    table td { border-collapse:collapse; }
    img { display:block; max-width:100%; height:auto; }
    @media screen and (max-width:620px) {
      .container { width:100% !important; max-width:100% !important; }
      .container-padding { padding-left:12px !important; padding-right:12px !important; }
    }
  </style>
</head>
<body bgcolor="${outerBg}" style="margin:0;padding:0;background-color:${outerBg};">

<!-- 100% wrapper -->
<table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="${outerBg}">
  <tr>
    <td align="center" valign="top" bgcolor="${outerBg}" style="padding:20px 0;">

      <!-- 600px container -->
      <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px;background-color:#FFFFFF;">

        <!-- Header: Logo -->
        <tr>
          <td class="container-padding" style="padding:20px 24px 12px 24px;background-color:#FFFFFF;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left">
                  <p style="margin:0;font-size:18px;font-family:Arial,sans-serif;font-weight:bold;color:${green};">TAL Continuous Delivery</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Banner -->
        <tr>
          <td align="center" style="padding:0;background-color:#FFFFFF;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background:linear-gradient(135deg,${green} 0%,${lightGreen} 100%);">
              <tr>
                <td align="center" style="padding:32px 24px;">
                  <p style="margin:0;font-size:22px;font-family:Arial,sans-serif;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">${data.incrementTitle}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main body -->
        <tr>
          <td class="container-padding" style="padding:24px;background-color:#FFFFFF;">

            <!-- Intro -->
            <p style="margin:0 0 8px 0;font-size:15px;font-family:Arial,sans-serif;font-weight:bold;color:${green};line-height:1.4;">${data.incrementTitle}</p>
            <p style="margin:0 0 12px 0;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${data.introText}</p>

            <p style="margin:0 0 4px 0;font-size:10.5pt;font-family:Arial,sans-serif;font-weight:bold;line-height:1.5;">${data.introSubHeading}</p>
            <p style="margin:0 0 16px 0;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${data.introSubText}</p>

            ${sectionsHtml}

            <!-- Feedback banner -->
            <table border="0" cellpadding="0" cellspacing="0" style="width:100%;background:#F1F1F1;border-collapse:collapse;margin-bottom:0;">
              <tr>
                <td style="padding:12px 10px;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">
                  In true continuous delivery spirit, we're constantly looking to improve how we deliver updates, <strong>${data.showcaseBody}</strong>
                </td>
              </tr>
              <tr>
                <td style="padding:0 10px 10px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td valign="top" style="padding-right:16px;">
                        <p style="margin:0 0 6px 0;font-size:12pt;font-family:Arial,sans-serif;font-weight:bold;color:${green};">${data.feedbackHeading} <span style="color:${lightGreen};">!</span></p>
                        <p style="margin:0 0 8px 0;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${data.feedbackBody}</p>
                        ${
                          data.showcaseVideoLink
                            ? `<a href="${data.showcaseVideoLink}" style="display:inline-block;padding:8px 20px;background-color:${lightGreen};color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-decoration:none;border-radius:3px;" target="_blank">Watch Showcase</a>`
                            : ""
                        }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="container-padding" style="padding:16px 24px;background-color:#F0F0F0;">
            <p style="margin:0;font-size:11px;font-family:Arial,sans-serif;color:#888888;line-height:1.5;text-align:center;">${data.footerText}</p>
          </td>
        </tr>

      </table>
      <!-- /600px container -->

    </td>
  </tr>
</table>
<!-- /100% wrapper -->

</body>
</html>`
}

// ────────────────────────────────────────────────
// Utilities
// ────────────────────────────────────────────────

function encodeEntities(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// ────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────

function BulletEditor({
  bullet,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  bullet: BulletEntry
  onChange: (b: BulletEntry) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <div className="border rounded-lg p-3 bg-card flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-muted-foreground flex-1 truncate">{bullet.title || "Untitled bullet"}</span>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveUp} disabled={isFirst} title="Move up">
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveDown} disabled={isLast} title="Move down">
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={onDelete} title="Delete bullet">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <Label className="text-xs mb-1 block">Title (bold bullet heading)</Label>
          <Input
            value={bullet.title}
            onChange={(e) => onChange({ ...bullet, title: e.target.value })}
            className="h-8 text-sm"
            placeholder="e.g. Cbus Super — Standalone Cancel Journey"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Description</Label>
          <Textarea
            value={bullet.description}
            onChange={(e) => onChange({ ...bullet, description: e.target.value })}
            className="text-sm min-h-[72px] resize-y"
            placeholder="Describe what was delivered..."
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Value Statement <span className="text-[10px] text-muted-foreground">(shown in green)</span></Label>
          <Input
            value={bullet.valueStatement}
            onChange={(e) => onChange({ ...bullet, valueStatement: e.target.value })}
            className="h-8 text-sm"
            placeholder="e.g. Increased member engagement..."
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Watch Demo URL <span className="text-[10px] text-muted-foreground">(leave blank to hide button)</span></Label>
          <Input
            value={bullet.videoLink}
            onChange={(e) => onChange({ ...bullet, videoLink: e.target.value })}
            className="h-8 text-sm font-mono"
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  )
}

function SectionEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  section: ContentSection
  onChange: (s: ContentSection) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const addBullet = () => {
    onChange({
      ...section,
      bullets: [
        ...section.bullets,
        {
          id: createId(),
          title: "",
          description: "",
          valueStatement: "",
          videoLink: "",
        },
      ],
    })
  }

  const updateBullet = (idx: number, b: BulletEntry) => {
    const bullets = [...section.bullets]
    bullets[idx] = b
    onChange({ ...section, bullets })
  }

  const deleteBullet = (idx: number) => {
    onChange({ ...section, bullets: section.bullets.filter((_, i) => i !== idx) })
  }

  const moveBullet = (idx: number, dir: -1 | 1) => {
    const bullets = [...section.bullets]
    const target = idx + dir
    if (target < 0 || target >= bullets.length) return
    ;[bullets[idx], bullets[target]] = [bullets[target], bullets[idx]]
    onChange({ ...section, bullets })
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-muted/20">
      {/* Section header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 border-b">
        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Input
          value={section.sectionTitle}
          onChange={(e) => onChange({ ...section, sectionTitle: e.target.value })}
          className="h-7 text-sm font-medium border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 flex-1"
          placeholder="Section title..."
        />
        <div className="flex items-center gap-0.5 shrink-0">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveUp} disabled={isFirst} title="Move section up">
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveDown} disabled={isLast} title="Move section down">
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={onDelete} title="Delete section">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Bullets */}
      <div className="flex flex-col gap-2.5 p-3">
        {section.bullets.map((b, idx) => (
          <BulletEditor
            key={b.id}
            bullet={b}
            onChange={(updated) => updateBullet(idx, updated)}
            onDelete={() => deleteBullet(idx)}
            onMoveUp={() => moveBullet(idx, -1)}
            onMoveDown={() => moveBullet(idx, 1)}
            isFirst={idx === 0}
            isLast={idx === section.bullets.length - 1}
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5 w-full"
          onClick={addBullet}
        >
          <Plus className="h-3 w-3" /> Add Bullet Point
        </Button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────

type EditModal =
  | { field: "subject" | "incrementTitle" | "introText" | "introSubHeading" | "introSubText" | "feedbackHeading" | "feedbackBody" | "showcaseHeading" | "showcaseBody" | "showcaseVideoLink" | "footerText"; label: string; multiline?: boolean }
  | null

export default function NewsletterEditorPage() {
  const [data, setData] = useState<NewsletterData>(buildDefaultData)
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "html">("editor")
  const [copied, setCopied] = useState(false)
  const [editModal, setEditModal] = useState<EditModal>(null)
  const [editValue, setEditValue] = useState("")

  const generatedHtml = useMemo(() => generateNewsletterHtml(data), [data])
  const entitiesCode = useMemo(() => encodeEntities(generatedHtml), [generatedHtml])

  // Open a quick-edit modal for top-level text fields
  const openEdit = (field: NonNullable<EditModal>["field"], label: string, multiline?: boolean) => {
    setEditValue(data[field])
    setEditModal({ field, label, multiline })
  }

  const saveEdit = () => {
    if (!editModal) return
    setData((d) => ({ ...d, [editModal.field]: editValue }))
    setEditModal(null)
  }

  // Section helpers
  const addSection = () => {
    setData((d) => ({
      ...d,
      sections: [
        ...d.sections,
        {
          id: createId(),
          sectionTitle: "New Section",
          bullets: [
            {
              id: createId(),
              title: "",
              description: "",
              valueStatement: "",
              videoLink: "",
            },
          ],
        },
      ],
    }))
  }

  const updateSection = (idx: number, sec: ContentSection) => {
    setData((d) => {
      const sections = [...d.sections]
      sections[idx] = sec
      return { ...d, sections }
    })
  }

  const deleteSection = (idx: number) => {
    setData((d) => ({ ...d, sections: d.sections.filter((_, i) => i !== idx) }))
  }

  const moveSection = (idx: number, dir: -1 | 1) => {
    setData((d) => {
      const sections = [...d.sections]
      const target = idx + dir
      if (target < 0 || target >= sections.length) return d
      ;[sections[idx], sections[target]] = [sections[target], sections[idx]]
      return { ...d, sections }
    })
  }

  const copyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml)
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generatedHtml])

  const resetData = () => {
    setData(buildDefaultData())
  }

  // ── Inline field editor (pencil icon rows) ──
  const FieldRow = ({
    label,
    field,
    value,
    multiline,
  }: {
    label: string
    field: NonNullable<EditModal>["field"]
    value: string
    multiline?: boolean
  }) => (
    <div className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-sm text-foreground leading-relaxed ${multiline ? "whitespace-pre-wrap" : "truncate"}`}>{value || <span className="text-muted-foreground italic">Empty</span>}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
        onClick={() => openEdit(field, label, multiline)}
        title={`Edit ${label}`}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  )

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader currentPath="/newsletter-editor">
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Tab buttons */}
          <div className="hidden sm:flex items-center gap-1 border rounded-md p-0.5 bg-muted/40">
            {(["editor", "preview", "html"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "html" ? "HTML" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={resetData} title="Reset to template defaults">
            Reset
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={copyHtml}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy HTML"}
          </Button>
        </div>
      </AppHeader>

      {/* ── Mobile tab bar ── */}
      <div className="sm:hidden flex border-b">
        {(["editor", "preview", "html"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab === "html" ? "HTML" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Desktop: split panel; Mobile: tab panel ── */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop: always show side-by-side editor + preview */}
        <ResizablePanelGroup direction="horizontal" className="h-full hidden sm:flex">
          {/* Left: editor */}
          <ResizablePanel defaultSize={42} minSize={28} id="nl-editor" order={1}>
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b px-4 py-2.5">
                <h2 className="text-sm font-semibold tracking-tight">Newsletter Editor</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* ── Global fields ── */}
                <div className="rounded-xl border overflow-hidden">
                  <div className="bg-muted/40 border-b px-3 py-2">
                    <p className="text-xs font-semibold tracking-tight">Email Header</p>
                  </div>
                  <div className="flex flex-col">
                    <FieldRow label="Subject Line" field="subject" value={data.subject} />
                    <FieldRow label="Increment Title" field="incrementTitle" value={data.incrementTitle} />
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <div className="bg-muted/40 border-b px-3 py-2">
                    <p className="text-xs font-semibold tracking-tight">Introduction</p>
                  </div>
                  <div className="flex flex-col">
                    <FieldRow label="Intro Text" field="introText" value={data.introText} multiline />
                    <FieldRow label="Sub-Heading" field="introSubHeading" value={data.introSubHeading} />
                    <FieldRow label="Sub-Heading Body" field="introSubText" value={data.introSubText} multiline />
                  </div>
                </div>

                {/* ── Sections ── */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-tight">Content Sections</p>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={addSection}>
                      <Plus className="h-3 w-3" /> Add Section
                    </Button>
                  </div>
                  {data.sections.map((sec, idx) => (
                    <SectionEditor
                      key={sec.id}
                      section={sec}
                      onChange={(s) => updateSection(idx, s)}
                      onDelete={() => deleteSection(idx)}
                      onMoveUp={() => moveSection(idx, -1)}
                      onMoveDown={() => moveSection(idx, 1)}
                      isFirst={idx === 0}
                      isLast={idx === data.sections.length - 1}
                    />
                  ))}
                </div>

                {/* ── Feedback / Showcase ── */}
                <div className="rounded-xl border overflow-hidden">
                  <div className="bg-muted/40 border-b px-3 py-2">
                    <p className="text-xs font-semibold tracking-tight">Feedback & Showcase</p>
                  </div>
                  <div className="flex flex-col">
                    <FieldRow label="Feedback Heading" field="feedbackHeading" value={data.feedbackHeading} />
                    <FieldRow label="Feedback Body" field="feedbackBody" value={data.feedbackBody} multiline />
                    <FieldRow label="Banner Body Text" field="showcaseBody" value={data.showcaseBody} multiline />
                    <FieldRow label="Showcase Video URL" field="showcaseVideoLink" value={data.showcaseVideoLink} />
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <div className="bg-muted/40 border-b px-3 py-2">
                    <p className="text-xs font-semibold tracking-tight">Footer</p>
                  </div>
                  <div className="flex flex-col">
                    <FieldRow label="Footer Text" field="footerText" value={data.footerText} multiline />
                  </div>
                </div>

                <div className="pb-4" />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: preview or HTML */}
          <ResizablePanel defaultSize={58} minSize={30} id="nl-preview" order={2}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-1 border rounded-md p-0.5 bg-muted/40">
                  {(["preview", "html"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab === "preview" ? "editor" : "html")}
                      className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                        (tab === "preview" && activeTab !== "html") || (tab === "html" && activeTab === "html")
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab === "html" ? "HTML" : "Preview"}
                    </button>
                  ))}
                </div>
              </div>
              {activeTab === "html" ? (
                <div className="flex-1 overflow-auto">
                  <pre className="p-4 text-[11px] font-mono leading-relaxed whitespace-pre-wrap text-foreground">{generatedHtml}</pre>
                </div>
              ) : (
                <iframe
                  key={generatedHtml}
                  srcDoc={generatedHtml}
                  title="Newsletter Preview"
                  className="h-full w-full border-0 bg-white"
                  sandbox="allow-same-origin"
                />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Mobile: tab-based views */}
        <div className="sm:hidden h-full overflow-hidden">
          {activeTab === "editor" && (
            <div className="h-full overflow-y-auto p-3 flex flex-col gap-3">
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-muted/40 border-b px-3 py-2">
                  <p className="text-xs font-semibold">Email Header</p>
                </div>
                <FieldRow label="Subject Line" field="subject" value={data.subject} />
                <FieldRow label="Increment Title" field="incrementTitle" value={data.incrementTitle} />
              </div>
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-muted/40 border-b px-3 py-2">
                  <p className="text-xs font-semibold">Introduction</p>
                </div>
                <FieldRow label="Intro Text" field="introText" value={data.introText} multiline />
                <FieldRow label="Sub-Heading" field="introSubHeading" value={data.introSubHeading} />
                <FieldRow label="Sub-Heading Body" field="introSubText" value={data.introSubText} multiline />
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs font-semibold">Content Sections</p>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addSection}>
                  <Plus className="h-3 w-3" /> Add Section
                </Button>
              </div>
              {data.sections.map((sec, idx) => (
                <SectionEditor
                  key={sec.id}
                  section={sec}
                  onChange={(s) => updateSection(idx, s)}
                  onDelete={() => deleteSection(idx)}
                  onMoveUp={() => moveSection(idx, -1)}
                  onMoveDown={() => moveSection(idx, 1)}
                  isFirst={idx === 0}
                  isLast={idx === data.sections.length - 1}
                />
              ))}
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-muted/40 border-b px-3 py-2">
                  <p className="text-xs font-semibold">Feedback & Showcase</p>
                </div>
                <FieldRow label="Feedback Heading" field="feedbackHeading" value={data.feedbackHeading} />
                <FieldRow label="Feedback Body" field="feedbackBody" value={data.feedbackBody} multiline />
                <FieldRow label="Banner Body Text" field="showcaseBody" value={data.showcaseBody} multiline />
                <FieldRow label="Showcase Video URL" field="showcaseVideoLink" value={data.showcaseVideoLink} />
              </div>
              <div className="rounded-xl border overflow-hidden">
                <div className="bg-muted/40 border-b px-3 py-2">
                  <p className="text-xs font-semibold">Footer</p>
                </div>
                <FieldRow label="Footer Text" field="footerText" value={data.footerText} multiline />
              </div>
              <div className="pb-4" />
            </div>
          )}
          {activeTab === "preview" && (
            <iframe
              key={generatedHtml}
              srcDoc={generatedHtml}
              title="Newsletter Preview"
              className="h-full w-full border-0 bg-white"
              sandbox="allow-same-origin"
            />
          )}
          {activeTab === "html" && (
            <div className="h-full overflow-auto p-3">
              <pre className="text-[10px] font-mono leading-relaxed whitespace-pre-wrap">{generatedHtml}</pre>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Field Dialog ── */}
      <Dialog open={editModal !== null} onOpenChange={(open) => { if (!open) setEditModal(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Edit {editModal?.label}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {editModal?.multiline ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="min-h-[100px] resize-y text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) saveEdit()
                }}
              />
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit()
                }}
              />
            )}
            {editModal?.multiline && (
              <p className="text-[10px] text-muted-foreground mt-1.5">Ctrl+Enter to save</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setEditModal(null)}>Cancel</Button>
            <Button size="sm" onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
