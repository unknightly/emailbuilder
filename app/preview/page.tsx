"use client"

import dynamic from "next/dynamic"

const PreviewClient = dynamic(() => import("./preview-client"), { ssr: false })

export default function Page() {
  return <PreviewClient />
}
