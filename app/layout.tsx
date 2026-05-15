import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Watchly — Discover OTT Movies',
  description: 'Find the best Telugu and Indian movies on OTT platforms. Weekly releases, mood-based recommendations, and more.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
