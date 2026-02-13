export type ComponentType =
  | "heading"
  | "paragraph"
  | "image"
  | "list"
  | "line-item"
  | "html"

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
    { id: createId(), type: "header", label: "Header", components: [] },
    { id: createId(), type: "body", label: "Body", components: [] },
    { id: createId(), type: "footer", label: "Footer", components: [] },
  ]
}

export function createComponent(type: ComponentType): EmailComponent {
  const id = createId()
  switch (type) {
    case "heading":
      return { id, type, content: "Heading text", props: { level: 1 } }
    case "paragraph":
      return { id, type, content: "Enter your paragraph text here...", props: {} }
    case "image":
      return {
        id,
        type,
        content: "https://placehold.co/600x200/e2e8f0/64748b?text=Your+Image",
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
