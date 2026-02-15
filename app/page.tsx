"use client"

import dynamic from "next/dynamic"

const EmailBuilder = dynamic(
  () => import("@/components/email-builder/email-builder").then((m) => m.EmailBuilder),
  { ssr: false }
)

export default function Page() {
  return <EmailBuilder />
}
