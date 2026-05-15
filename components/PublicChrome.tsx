'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

/** Single client boundary for nav + content + footer to avoid hydration ordering issues with nested client roots. */
export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isMovieDetail = pathname.startsWith('/movie/')
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div
        className={
          isMovieDetail
            ? 'flex-1 scroll-pt-52 pt-[calc(11rem+env(safe-area-inset-top,0px))] sm:scroll-pt-56 sm:pt-[calc(12.5rem+env(safe-area-inset-top,0px))] md:pt-[calc(13rem+env(safe-area-inset-top,0px))]'
            : isHome
              ? 'flex-1 scroll-pt-32'
              : 'flex-1 scroll-pt-32 pt-32 sm:scroll-pt-36 sm:pt-36'
        }
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}
