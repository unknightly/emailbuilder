export interface EmailTheme {
  outerBackground: string
  containerBackground: string
  headerBackground: string
  bodyBackground: string
  footerBackground: string
  headingColor: string
  bodyTextColor: string
  footerTextColor: string
  linkColor: string
  lineItemBorderColor: string
}

export const DEFAULT_THEME: EmailTheme = {
  outerBackground: "#F0F0F0",
  containerBackground: "#FFFFFF",
  headerBackground: "#FFFFFF",
  bodyBackground: "#FFFFFF",
  footerBackground: "#F0F0F0",
  headingColor: "#333333",
  bodyTextColor: "#333333",
  footerTextColor: "#aaaaaa",
  linkColor: "#1a73e8",
  lineItemBorderColor: "#e0e0e0",
}

export type ComponentType =
  | "heading"
  | "paragraph"
  | "image"
  | "list"
  | "line-item"
  | "html"

export type LinkType = "web" | "email" | "telephone"

export interface ParagraphLink {
  id: string
  text: string
  url: string
  linkType: LinkType
}

export const TEMPLATE_VARIABLES = [
  "$FirstName",
  "$LastName",
  "$PolicyOwnerNumber",
  "$ApplicationReference",
] as const

export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number]

export interface EmailComponent {
  id: string
  type: ComponentType
  content: string
  props: Record<string, unknown>
}

export type SectionType = "header" | "body" | "footer"

export interface EmailSection {
  id: string
  type: SectionType
  label: string
  components: EmailComponent[]
}

export function createId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function createDefaultSections(): EmailSection[] {
  return [
    {
      id: createId(),
      type: "header",
      label: "Header",
      components: [
        {
          id: createId(),
          type: "image",
          content: "https://placehold.co/204x67/ffffff/333333?text=Your+Logo",
          props: { alt: "Company Logo", width: 204 },
        },
      ],
    },
    {
      id: createId(),
      type: "body",
      label: "Body",
      components: [
        {
          id: createId(),
          type: "paragraph",
          content: "Dear $FirstName,",
          props: {},
        },
        {
          id: createId(),
          type: "paragraph",
          content: "Thank you for your recent enquiry. We are currently reviewing your request and will be in touch shortly.",
          props: {},
        },
        {
          id: createId(),
          type: "heading",
          content: "What happens next?",
          props: { level: 3 },
        },
        {
          id: createId(),
          type: "paragraph",
          content: "Our team will review the information you have provided. You can track the status of your request by logging into your account.",
          props: {},
        },
        {
          id: createId(),
          type: "paragraph",
          content: "Sincerely,\nThe Team",
          props: {},
        },
      ],
    },
    {
      id: createId(),
      type: "footer",
      label: "Footer",
      components: [
        {
          id: createId(),
          type: "image",
          content: "https://placehold.co/36x14/f0f0f0/aaaaaa?text=Logo",
          props: { alt: "Footer Logo", width: 36 },
        },
        {
          id: createId(),
          type: "paragraph",
          content: "The way in which we collect, use, store, disclose and secure information is set out in our Privacy Policy, available free of charge on request.",
          props: {},
        },
      ],
    },
  ]
}

export function createComponent(type: ComponentType): EmailComponent {
  const id = createId()
  switch (type) {
    case "heading":
      return { id, type, content: "Heading text", props: { level: 3 } }
    case "paragraph":
      return { id, type, content: "Enter your paragraph text here...", props: {} }
    case "image":
      return {
        id,
        type,
        content: "https://placehold.co/600x200/f0f0f0/333333?text=Your+Image",
        props: { alt: "Image description", width: 600 },
      }
    case "list":
      return { id, type, content: "", props: { items: ["Item 1", "Item 2", "Item 3"] } }
    case "line-item":
      return { id, type, content: "", props: { label: "Item", value: "$0.00" } }
    case "html":
      return { id, type, content: "<p>Custom HTML content</p>", props: {} }
  }
}
