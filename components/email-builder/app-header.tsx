"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Menu, X, LayoutDashboard, FileJson, Code2, ScrollText } from "lucide-react"

const NAV_ITEMS = [
  { href: "/", label: "Email Builder", icon: Mail },
  { href: "/live-editor", label: "Live Editor", icon: Code2 },
  { href: "/architecture", label: "Architecture Diagram", icon: LayoutDashboard },
  { href: "/architecture/schema", label: "JSON Schema", icon: FileJson },
  { href: "/changelog", label: "Changelog", icon: ScrollText },
]

export function AppHeader({
  children,
  currentPath,
}: {
  children?: React.ReactNode
  currentPath?: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative border-b shrink-0">
      <div className="flex items-center gap-3 px-5 py-3">
        {/* Hamburger + logo */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground border transition-colors hover:bg-accent"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
          <div>
            <h1 className="text-sm font-semibold tracking-tight leading-none">Email Builder</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Compose table-based email templates</p>
          </div>
        </div>

        {/* Right-side actions passed via children */}
        {children}
      </div>

      {/* Dropdown nav menu */}
      {menuOpen && (
        <nav className="absolute left-0 top-full z-50 w-64 border-b border-r rounded-br-lg bg-background shadow-lg">
          <ul className="flex flex-col py-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
