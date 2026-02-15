import dynamic from "next/dynamic"

const LiveEditorPage = dynamic(
  () => import("./live-editor-client"),
  { ssr: false }
)

export default function Page() {
  return <LiveEditorPage />
}
