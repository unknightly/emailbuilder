"use client"

import { useState, useMemo, useCallback } from "react"
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
  ChevronUp,
  ChevronDown,
  Pencil,
  FileText,
  Image as ImageIcon,
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
  demoNote: string        // demo description text (e.g. "Jordan R. demoed...")
  videoLink: string       // link for "Watch Demo" button (blank = no button)
}

interface ContentSection {
  id: string
  sectionTitle: string
  subGroupTitle: string  // optional sub-group label (e.g. "Group Life", "Investments")
  bullets: BulletEntry[]
}

interface NewsletterData {
  subject: string
  incrementTitle: string
  introText: string
  introSubHeading: string
  introSubText: string
  // Logo & Banner image placeholders (stored as data URLs or left as "" for placeholder)
  logoImageUrl: string
  bannerImageUrl: string
  sections: ContentSection[]
  // Feedback / showcase panel
  feedbackHeading: string
  feedbackBody: string
  showcaseIntroText: string
  showcaseVideoLink: string
  // Second showcase section image placeholder
  showcaseImageUrl: string
  footerText: string
}

// ────────────────────────────────────────────────
// Default data – full TAL template
// ────────────────────────────────────────────────

function buildDefaultData(): NewsletterData {
  const id = createId
  return {
    subject: "FOR REVIEW: Continuous Delivery | GL&R Platform Update - Product Increment 28.3",
    incrementTitle: "Platform Update – Increment 28.2",
    introText: "Hello and welcome to the platform update",
    introSubHeading: "Delivering with TAL Connect",
    introSubText:
      "As always, our focus is on our TAL Connect delivery plan and onboarding new arrangements with our partners.",
    logoImageUrl: "",
    bannerImageUrl: "",
    sections: [
      // ── TAL Connect delivery highlights ──
      {
        id: id(),
        sectionTitle: "TAL Connect delivery highlights",
        subGroupTitle: "",
        bullets: [
          {
            id: id(),
            title: "Cbus Super – Standalone Cancel Journey",
            description:
              "As part of NGS Super TAL Connect onboarding, we've completed development of the end-to-end New Member Offer (NMO) among many other improvements. Progress for NGS Super onboarding is currently at 85% with a targeted release for October 2025 and a delivery date to be determined.",
            valueStatement:
              "Increased member engagement, reduced time for Application lodgement, reduced rework / manual process, and improved decision time (available to ~115,000 members)",
            demoNote:
              "Jordan R. demoed the uplift of the standalone cancel journey, highlighting its simplified process for members to cancel cover without providing unnecessary personal information, and showed the generation of related emails and PDFs for both full and partial cancellations",
            videoLink: "https://talconnect-my.sharepoint.com/",
          },
          {
            id: id(),
            title: "AustralianSuper – Change Work Rating",
            description:
              "We've successfully completed the development of the end-to-end Change Work Rating application journey for AustralianSuper as part of their induction on to TAL Connect. Progress for the Change Work Rating is at 90% & targeting release for September 2025 with a delivery date to be determined.",
            valueStatement:
              "Increased member engagement, reduced time for Application lodgement, reduced rework / manual process, and improved decision time (available to ~1.5m insured members)",
            demoNote:
              "Integrated with URE v27, completed NMO End-To-End journey, PYS election response capture, added \u2018Submit Declaration\u2019 acknowledgement, updated NMO Contentful models for tailored cover",
            videoLink: "https://talconnect-my.sharepoint.com/",
          },
          {
            id: id(),
            title: "Cbus Super – TAL Connect Onboarding",
            description:
              "In continuation of the Cbus Super TAL Connect onboarding, we've implemented rules and configuration items ensuring alignment with product requirements. Progress for Cbus Super TAL Connect – Phase 1 onboarding is currently at 55% & targeting release for early 2026 with a delivery date to be determined.",
            valueStatement:
              "Increased member engagement, reduced time for Application lodgement, reduced rework / manual process, and improved decision time (available to ~910,000 insured members)",
            demoNote:
              "Implemented occupation category unit rates for Death/TDP/IP, unitised death plan max rules per occupation category unit rates, TPD max cover rules, restrictions for members in a \u2018decline\u2019 occupation",
            videoLink: "",
          },
        ],
      },
      // ── Digital growth solutions ──
      {
        id: id(),
        sectionTitle: "Digital growth solutions",
        subGroupTitle: "",
        bullets: [
          {
            id: id(),
            title: "AI Chatbot Prototype",
            description:
              "As we continue development of the AI Chatbot Prototype, we've configured TAL Connect enterprise security authorisation standards, ensuring alignment with other TAL microsites and journeys. Furthermore, fixes have been implemented ensuring the member data packet is consumed for contextual awareness. The AI Chatbot Prototype is currently at 50% with work ongoing.",
            valueStatement: "",
            demoNote: "No demonstration this showcase.",
            videoLink: "",
          },
        ],
      },
      // ── Digital retirement solutions ──
      {
        id: id(),
        sectionTitle: "Digital retirement solutions",
        subGroupTitle: "",
        bullets: [
          {
            id: id(),
            title: "Retirement Calculator – Download PDF enhancements",
            description:
              "As part of an uplift to the downloadable PDFs, we've made content changes to ensure a clear and intuitively readable document, thanks to feedback following initial release.",
            valueStatement:
              "Support TAL's growth strategy and Retirement positioning to the market",
            demoNote: "No demonstration this showcase.",
            videoLink: "",
          },
        ],
      },
      // ── Digital health solutions ──
      {
        id: id(),
        sectionTitle: "Digital health solutions",
        subGroupTitle: "",
        bullets: [
          {
            id: id(),
            title: "Digital Health Platform - Onboarding",
            description:
              "As part of the development of the Digital Health Platform, we've made database improvements to allow flexibility across funds, begun work on enabling Single Sign On (SSO) with member data. Furthermore, we've begun building the front-end with Contentful and components in GLS GEL V2.",
            valueStatement: "",
            demoNote: "No demonstration this showcase.",
            videoLink: "",
          },
        ],
      },
      // ── Policy administration solutions ──
      {
        id: id(),
        sectionTitle: "Policy administration solutions",
        subGroupTitle: "Group Life",
        bullets: [
          {
            id: id(),
            title: "GLAS Monthly Accrual Correction for all Frequencies",
            description:
              "Correct the monthly accrual process so it posts correctly for monthly, quarterly and half yearly policies in line with the standard annual cases.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "CMORE Binding Nomination Expiry Letters for staff policies",
            description:
              "Extend the binding nomination expiry process to include new letters for staff cases.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
        ],
      },
      // ── Investments ──
      {
        id: id(),
        sectionTitle: "Investments",
        subGroupTitle: "",
        bullets: [
          {
            id: id(),
            title: "LEO Exit Statements Remediation",
            description:
              "Having corrected ongoing processing, 203 statements were reproduced and dispatched with an apology letter to close off the incident.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "SSS Quarterly Cash Flow report for Brighter Super",
            description:
              "A new report to detail cash flows for LGIA policies (SUP1&SUP2) to allow Brighter Super to meet their reporting obligations with APRA",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
        ],
      },
      // ── Technology excellence ──
      {
        id: id(),
        sectionTitle: "Delivering and maintaining a first-class technology stack",
        subGroupTitle: "Technology excellence",
        bullets: [
          {
            id: id(),
            title: "Kong-APIM - Retirement of SSL certificates",
            description:
              "Successfully transitioned from internal TAL CA SSL certificates to DigiCert SSL.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "AustralianSuper – Cancel Microsite Automation",
            description:
              "Completed Automation scenarios for end-to-end journey for the AustralianSuper instance of the Cancel microsite.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "Google Analytics - Cancel Microsite",
            description:
              "Implemented changes in the Cancel Microsite by enforcing fund name in the tag key ensuring data contamination",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "Cancel Microsite - GraphQL Introspection Enabled",
            description:
              "Resolved pen-test item involving GraphQL Introspection, which was allowing users to query for underlying schema information.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "TAL Connect Lite – Member impersonation",
            description:
              "Resolved pen-test item allowing a user to impersonate member given correct member details were entered and verified against during registration.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "NGS Super – Onboarding, UAT readiness",
            description:
              "Successfully completed preparation tasks for UAT for NGS Super onboarding to TAL Connect.",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "User Interface, Front-end – Updates to various",
            description:
              "Claims React upgraded from V1 to V2, implemented updates to GLS GEL Storybook, completed development of the Prime Super V1 theme",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
          {
            id: id(),
            title: "Rulebook Integration - Life Events, Change Occupation",
            description:
              "Implemented bullet train fixes for Life Events and Change Occupation pipelines",
            valueStatement: "",
            demoNote: "",
            videoLink: "",
          },
        ],
      },
    ],
    feedbackHeading: "Don't miss out on the action!",
    feedbackBody:
      "Truly great products are built with feedback and the showcase is the opportunity to give yours! If you happened to miss the last one, catch up via the button below.",
    showcaseIntroText:
      "In true continuous delivery spirit, we're constantly looking to improve how we deliver updates, if you have any feedback, we'd love to hear from you!",
    showcaseVideoLink: "https://talconnect-my.sharepoint.com/",
    showcaseImageUrl: "",
    footerText:
      "TAL Life Limited ABN 70 050 109 450 AFSL 237848 a Dai-ichi Life Group Company GPO Box 5380, Sydney, NSW, 2001, Australia",
  }
}

// ────────────────────────────────────────────────
// HTML Generator
// ────────────────────────────────────────────────

const GREEN = "#328600"
const LIGHT_GREEN = "#80C342"
const SECTION_BG = "#EDF7F3"
const OUTER_BG = "#F7F7F7"
const ROW_BORDER = "#B3E5A1"

const PLACEHOLDER_LOGO = `https://placehold.co/200x50/328600/ffffff?text=TAL+Logo`
const PLACEHOLDER_BANNER = `https://placehold.co/600x160/328600/ffffff?text=Banner+Image`
const PLACEHOLDER_SHOWCASE = `https://placehold.co/560x160/EDF7F3/328600?text=Showcase+Image`

function generateNewsletterHtml(data: NewsletterData): string {
  const logoSrc = data.logoImageUrl || PLACEHOLDER_LOGO
  const bannerSrc = data.bannerImageUrl || PLACEHOLDER_BANNER
  const showcaseSrc = data.showcaseImageUrl || PLACEHOLDER_SHOWCASE

  const watchDemoButton = (link: string) =>
    link
      ? `<td align="right" valign="middle" style="padding:4px 0 4px 8px;width:120px;white-space:nowrap;">
          <a href="${link}" style="display:inline-block;padding:6px 14px;background-color:${LIGHT_GREEN};color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-decoration:none;border-radius:3px;" target="_blank">Watch Demo</a>
        </td>`
      : ""

  const bulletRows = (bullets: BulletEntry[]) =>
    bullets
      .map(
        (b) => `
      <tr>
        <td style="padding:8px 0 2px 0;">
          <ul style="margin:0 0 4px 0;padding-left:20px;">
            <li style="font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;font-weight:bold;margin:0;">${b.title}</li>
          </ul>
          <p style="margin:4px 0 4px 20px;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${b.description}</p>
          ${b.valueStatement ? `<p style="margin:0 0 6px 20px;font-size:10.5pt;font-family:Arial,sans-serif;color:${GREEN};font-weight:bold;line-height:1.5;">${b.valueStatement}</p>` : ""}
          ${
            b.demoNote || b.videoLink
              ? `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-top:1px solid ${ROW_BORDER};margin-top:6px;">
              <tr>
                <td valign="middle" style="padding:6px 0;font-size:10pt;font-family:Arial,sans-serif;color:#444444;line-height:1.4;">${b.demoNote}</td>
                ${watchDemoButton(b.videoLink)}
              </tr>
            </table>`
              : ""
          }
        </td>
      </tr>`
      )
      .join("\n")

  const sectionHtml = (sec: ContentSection) => `
    <!-- Section: ${sec.sectionTitle} -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:14px;">
      <tr>
        <td valign="top" style="background:${SECTION_BG};border-bottom:3px solid ${LIGHT_GREEN};padding:7px 10px;font-size:10.5pt;font-family:Arial,sans-serif;font-weight:bold;color:#000000;">
          ${sec.sectionTitle}
        </td>
      </tr>
      ${
        sec.subGroupTitle
          ? `<tr><td style="background:${SECTION_BG};padding:4px 10px 0 10px;font-size:10pt;font-family:Arial,sans-serif;font-weight:bold;color:${GREEN};">${sec.subGroupTitle}</td></tr>`
          : ""
      }
      <tr>
        <td style="background:${SECTION_BG};padding:2px 10px 8px 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            ${bulletRows(sec.bullets)}
          </table>
        </td>
      </tr>
    </table>`

  const allSections = data.sections.map(sectionHtml).join("\n")

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${data.subject}</title>
  <style type="text/css">
    body { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; margin:0; padding:0; background-color:${OUTER_BG}; }
    table { border-spacing:0; }
    table td { border-collapse:collapse; }
    img { display:block; max-width:100%; height:auto; border:0; }
    @media screen and (max-width:620px) {
      .email-container { width:100% !important; max-width:100% !important; }
      .container-pad { padding-left:12px !important; padding-right:12px !important; }
    }
  </style>
</head>
<body bgcolor="${OUTER_BG}" style="margin:0;padding:0;">

<table role="presentation" border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="${OUTER_BG}">
  <tr>
    <td align="center" valign="top" style="padding:20px 0;">

      <table role="presentation" border="0" width="600" cellpadding="0" cellspacing="0" class="email-container" style="width:600px;max-width:600px;background-color:#ffffff;">

        <!-- ── Logo ── -->
        <tr>
          <td class="container-pad" style="padding:20px 24px 12px 24px;background-color:#ffffff;">
            <img src="${logoSrc}" alt="TAL" width="200" style="width:200px;max-width:200px;height:auto;">
          </td>
        </tr>

        <!-- ── Banner image ── -->
        <tr>
          <td align="center" style="padding:0;background-color:#ffffff;">
            <img src="${bannerSrc}" alt="${data.incrementTitle}" width="600" style="width:600px;max-width:100%;height:auto;display:block;">
          </td>
        </tr>

        <!-- ── Subject / title bar ── -->
        <tr>
          <td class="container-pad" style="padding:16px 24px 0 24px;background-color:#ffffff;">
            <p style="margin:0 0 4px 0;font-size:9pt;font-family:Arial,sans-serif;color:#555555;"><strong>Subject:</strong> ${data.subject}</p>
            <p style="margin:0 0 12px 0;font-size:15px;font-family:Arial,sans-serif;font-weight:bold;color:${GREEN};line-height:1.4;">${data.incrementTitle}</p>
          </td>
        </tr>

        <!-- ── Intro ── -->
        <tr>
          <td class="container-pad" style="padding:0 24px 8px 24px;background-color:#ffffff;">
            <p style="margin:0 0 12px 0;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${data.introText}</p>
            <p style="margin:0 0 4px 0;font-size:10.5pt;font-family:Arial,sans-serif;font-weight:bold;color:#000000;line-height:1.5;">${data.introSubHeading}</p>
            <p style="margin:0 0 16px 0;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${data.introSubText}</p>
          </td>
        </tr>

        <!-- ── Content sections ── -->
        <tr>
          <td class="container-pad" style="padding:0 24px 8px 24px;background-color:#ffffff;">
            ${allSections}
          </td>
        </tr>

        <!-- ── Feedback / Showcase banner ── -->
        <tr>
          <td style="padding:0;background-color:#ffffff;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F1F1F1;border-collapse:collapse;">
              <tr>
                <td class="container-pad" style="padding:14px 24px 10px 24px;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">
                  ${data.showcaseIntroText}
                </td>
              </tr>
              <tr>
                <td class="container-pad" style="padding:4px 24px 16px 24px;">
                  <p style="margin:0 0 6px 0;font-size:13pt;font-family:Arial,sans-serif;font-weight:bold;color:${GREEN};">${data.feedbackHeading}</p>
                  <p style="margin:0 0 12px 0;font-size:10.5pt;font-family:Arial,sans-serif;color:#000000;line-height:1.5;">${data.feedbackBody}</p>
                  ${
                    data.showcaseVideoLink
                      ? `<a href="${data.showcaseVideoLink}" style="display:inline-block;padding:8px 20px;background-color:${LIGHT_GREEN};color:#ffffff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-decoration:none;border-radius:3px;" target="_blank">Watch Showcase</a>`
                      : ""
                  }
                </td>
              </tr>
              <tr>
                <td class="container-pad" style="padding:0 24px 16px 24px;">
                  <img src="${showcaseSrc}" alt="Showcase" width="552" style="width:100%;max-width:552px;height:auto;display:block;border-radius:4px;">
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td class="container-pad" style="padding:14px 24px;background-color:#E8E8E8;">
            <p style="margin:0;font-size:9px;font-family:Arial,sans-serif;color:#888888;line-height:1.6;text-align:center;">${data.footerText}</p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
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
// Image Placeholder Row
// ────────────────────────────────────────────────

function ImagePlaceholderRow({
  label,
  description,
  hasImage,
}: {
  label: string
  description: string
  hasImage: boolean
}) {
  return (
    <div className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50 transition-colors">
      <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded border border-dashed border-muted-foreground/30 bg-muted/30">
        <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-xs text-muted-foreground italic leading-tight">{description}</p>
      </div>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${hasImage ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
        {hasImage ? "Custom" : "Placeholder"}
      </span>
    </div>
  )
}

// ────────────────────────────────────────────────
// BulletEditor
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
      <div className="flex items-center justify-end gap-0.5">
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

      <div className="flex flex-col gap-2">
        <div>
          <Label className="text-xs mb-1 block">Title</Label>
          <Input
            value={bullet.title}
            onChange={(e) => onChange({ ...bullet, title: e.target.value })}
            className="h-8 text-sm"
            placeholder="e.g. Cbus Super – Standalone Cancel Journey"
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
          <Label className="text-xs mb-1 block">
            Value Statement{" "}
            <span className="text-[10px] text-muted-foreground">(shown in green — leave blank to hide)</span>
          </Label>
          <Input
            value={bullet.valueStatement}
            onChange={(e) => onChange({ ...bullet, valueStatement: e.target.value })}
            className="h-8 text-sm"
            placeholder="e.g. Increased member engagement..."
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">
            Demo Note{" "}
            <span className="text-[10px] text-muted-foreground">(appears in demo row — leave blank to hide row)</span>
          </Label>
          <Textarea
            value={bullet.demoNote}
            onChange={(e) => onChange({ ...bullet, demoNote: e.target.value })}
            className="text-sm min-h-[52px] resize-y"
            placeholder="e.g. Jordan R. demoed the uplift... / No demonstration this showcase."
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">
            Watch Demo URL{" "}
            <span className="text-[10px] text-muted-foreground">(leave blank to hide button)</span>
          </Label>
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

// ────────────────────────────────────────────────
// SectionEditor
// ────────────────────────────────────────────────

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
          demoNote: "",
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
      <div className="flex items-start gap-2 px-3 py-2.5 bg-muted/40 border-b">
        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <Input
            value={section.sectionTitle}
            onChange={(e) => onChange({ ...section, sectionTitle: e.target.value })}
            className="h-7 text-sm font-medium border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 flex-1"
            placeholder="Section title..."
          />
          <Input
            value={section.subGroupTitle}
            onChange={(e) => onChange({ ...section, subGroupTitle: e.target.value })}
            className="h-6 text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-muted-foreground"
            placeholder="Sub-group label (optional, e.g. Group Life)..."
          />
        </div>
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

type SimpleField =
  | "subject"
  | "incrementTitle"
  | "introText"
  | "introSubHeading"
  | "introSubText"
  | "feedbackHeading"
  | "feedbackBody"
  | "showcaseIntroText"
  | "showcaseVideoLink"
  | "footerText"

type EditModal =
  | { field: SimpleField; label: string; multiline?: boolean }
  | null

export default function NewsletterEditorPage() {
  const [data, setData] = useState<NewsletterData>(buildDefaultData)
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "html">("editor")
  const [copied, setCopied] = useState(false)
  const [editModal, setEditModal] = useState<EditModal>(null)
  const [editValue, setEditValue] = useState("")

  const generatedHtml = useMemo(() => generateNewsletterHtml(data), [data])

  // Open a quick-edit modal for top-level text fields
  const openEdit = (field: SimpleField, label: string, multiline?: boolean) => {
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
          subGroupTitle: "",
          bullets: [
            {
              id: createId(),
              title: "",
              description: "",
              valueStatement: "",
              demoNote: "",
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

  const resetData = () => setData(buildDefaultData())

  // ── Inline field editor (pencil icon rows) ──
  const FieldRow = ({
    label,
    field,
    value,
    multiline,
  }: {
    label: string
    field: SimpleField
    value: string
    multiline?: boolean
  }) => (
    <div className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-sm text-foreground leading-relaxed ${multiline ? "whitespace-pre-wrap line-clamp-3" : "truncate"}`}>
          {value || <span className="text-muted-foreground italic">Empty</span>}
        </p>
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

  // ── Shared editor panel ──
  const EditorPanel = () => (
    <div className="flex flex-col gap-4">
      {/* Email Header */}
      <div className="rounded-xl border overflow-hidden">
        <div className="bg-muted/40 border-b px-3 py-2">
          <p className="text-xs font-semibold tracking-tight">Email Header</p>
        </div>
        <div className="flex flex-col divide-y">
          <FieldRow label="Subject Line" field="subject" value={data.subject} />
          <FieldRow label="Increment Title" field="incrementTitle" value={data.incrementTitle} />
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border overflow-hidden">
        <div className="bg-muted/40 border-b px-3 py-2">
          <p className="text-xs font-semibold tracking-tight">Images</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Placeholder images are used in preview. Upload support coming soon.</p>
        </div>
        <div className="flex flex-col divide-y">
          <ImagePlaceholderRow
            label="Logo"
            description="Displayed top-left (200×50px recommended)"
            hasImage={!!data.logoImageUrl}
          />
          <ImagePlaceholderRow
            label="Banner Image"
            description="Full-width banner below logo (600×160px recommended)"
            hasImage={!!data.bannerImageUrl}
          />
          <ImagePlaceholderRow
            label="Showcase Image"
            description="Image in feedback section (552×160px recommended)"
            hasImage={!!data.showcaseImageUrl}
          />
        </div>
      </div>

      {/* Introduction */}
      <div className="rounded-xl border overflow-hidden">
        <div className="bg-muted/40 border-b px-3 py-2">
          <p className="text-xs font-semibold tracking-tight">Introduction</p>
        </div>
        <div className="flex flex-col divide-y">
          <FieldRow label="Intro Text" field="introText" value={data.introText} multiline />
          <FieldRow label="Sub-Heading" field="introSubHeading" value={data.introSubHeading} />
          <FieldRow label="Sub-Heading Body" field="introSubText" value={data.introSubText} multiline />
        </div>
      </div>

      {/* Sections */}
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

      {/* Feedback & Showcase */}
      <div className="rounded-xl border overflow-hidden">
        <div className="bg-muted/40 border-b px-3 py-2">
          <p className="text-xs font-semibold tracking-tight">Feedback &amp; Showcase</p>
        </div>
        <div className="flex flex-col divide-y">
          <FieldRow label="Banner Intro Text" field="showcaseIntroText" value={data.showcaseIntroText} multiline />
          <FieldRow label="Feedback Heading" field="feedbackHeading" value={data.feedbackHeading} />
          <FieldRow label="Feedback Body" field="feedbackBody" value={data.feedbackBody} multiline />
          <FieldRow label="Watch Showcase URL" field="showcaseVideoLink" value={data.showcaseVideoLink} />
        </div>
      </div>

      {/* Footer */}
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
  )

  return (
    <div className="flex h-screen flex-col bg-background">
      <AppHeader currentPath="/newsletter-editor">
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Desktop tab switcher */}
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
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetData}>
            Reset
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={copyHtml}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy HTML"}
          </Button>
        </div>
      </AppHeader>

      {/* Mobile tab bar */}
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

      {/* ── Desktop: split panel ── */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full hidden sm:flex">
          {/* Left: editor */}
          <ResizablePanel defaultSize={42} minSize={28} id="nl-editor" order={1}>
            <div className="h-full flex flex-col overflow-hidden">
              <div className="border-b px-4 py-2.5 shrink-0">
                <h2 className="text-sm font-semibold tracking-tight">Newsletter Editor</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <EditorPanel />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: preview or HTML */}
          <ResizablePanel defaultSize={58} minSize={30} id="nl-preview" order={2}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between border-b px-4 py-2.5 shrink-0">
                <div className="flex items-center gap-1 border rounded-md p-0.5 bg-muted/40">
                  {(["preview", "html"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab === "preview" ? "preview" : "html")}
                      className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                        activeTab === tab
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

        {/* ── Mobile: tab panels ── */}
        <div className="sm:hidden h-full overflow-hidden">
          {activeTab === "editor" && (
            <div className="h-full overflow-y-auto p-3">
              <EditorPanel />
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
