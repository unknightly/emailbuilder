"use client"

import dynamic from "next/dynamic"

const NewsletterEditorClient = dynamic(
  () => import("./newsletter-editor-client"),
  { ssr: false }
)

export default function Page() {
  return <NewsletterEditorClient />
}
