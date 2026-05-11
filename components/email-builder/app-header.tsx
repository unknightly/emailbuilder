"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Menu, X, LayoutDashboard, FileJson, ScrollText, MonitorPlay } from "lucide-react"

const APP_ITEMS = [
  { href: "/preview", label: "HTML Preview", icon: MonitorPlay },
  { href: "/", label: "Email Builder", icon: Mail },
]

const DOC_ITEMS = [
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
          </div>
        </div>

        {/* Right-side actions passed via children */}
        {children}
      </div>

      {/* Dropdown nav menu */}
      {menuOpen && (
        <nav className="absolute left-0 top-full z-50 w-64 border-b border-r rounded-br-lg bg-background shadow-lg">
          {/* App pages */}
          <ul className="flex flex-col py-1">
            {APP_ITEMS.map((item) => {
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

          {/* Divider + docs section */}
          <div className="border-t mx-0">
            <p className="px-4 pt-2.5 pb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 select-none">
              Docs
            </p>
            <ul className="flex flex-col pb-1">
              {DOC_ITEMS.map((item) => {
                const isActive = currentPath === item.href
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      )}
    </header>
  )
}
