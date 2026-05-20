import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Absolute Cinema — Premium OTT Discovery',
  description:
    'Find the best Telugu and Indian OTT movies. Weekly releases, mood-based recommendations, trailers, reviews, and trending cinema updates.',

  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],

    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-[#0B0B0F] text-[#F5F3FF] antialiased font-inter overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}