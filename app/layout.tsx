import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthGate } from '@/components/auth-gate'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Email Builder',
  description: 'Build table-based email templates with a visual editor. Create sections, add components, preview in real-time, and export HTML.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  )
}
