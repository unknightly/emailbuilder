"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

const PASS = "AGILE2026"
const STORAGE_KEY = "email-builder-auth"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true)
    }
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (input === PASS) {
        sessionStorage.setItem(STORAGE_KEY, "1")
        setAuthed(true)
        setError(false)
      } else {
        setError(true)
      }
    },
    [input],
  )

  if (!mounted) {
    return null
  }

  if (authed) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
            <Lock className="h-5 w-5 text-background" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold tracking-tight">Email Builder</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Enter the password to continue</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="password"
            placeholder="Password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError(false)
            }}
            autoFocus
            className={error ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {error && (
            <p className="text-xs text-destructive">Incorrect password. Please try again.</p>
          )}
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
