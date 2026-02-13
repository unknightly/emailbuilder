"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Menu, X, LayoutDashboard, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: "/", label: "Email Builder", icon: Mail },
  { href: "/architecture", label: "Architecture Diagram", icon: LayoutDashboard },
  { href: "/architecture/schema", label: "JSON Schema", icon: FileCode },
]

export function AppNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="relative">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background transition-colors hover:bg-foreground/90"
          aria-label="Navigation menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
        <div>
          <h1 className="text-sm font-semibold tracking-tight leading-none">Email Builder</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Compose table-based email templates</p>
        </div>
      </div>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute left-0 top-full mt-2 z-50 w-56 rounded-lg border bg-card shadow-lg">
            <nav className="flex flex-col p-1.5">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}

export function AppNavStandalone({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center gap-3 border-b px-5 py-3 shrink-0 bg-card">
      <AppNav />
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </header>
  )
}
