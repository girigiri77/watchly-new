'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import PageTransition from '@/components/motion/PageTransition'

export default function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isMovieDetail = pathname.startsWith('/movie/')
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <div
        className={`flex min-h-0 flex-1 flex-col ${
          isMovieDetail
            ? 'scroll-pt-20 pt-20 sm:scroll-pt-24 sm:pt-24 md:pt-28'
            : isHome
              ? 'scroll-pt-16 pb-bottom-nav lg:pb-0'
              : 'scroll-pt-16 pt-16 pb-bottom-nav sm:scroll-pt-20 sm:pt-20 md:pt-24 lg:pb-0'
        }`}
      >
        <PageTransition>{children}</PageTransition>
      </div>
      {!isHome && <Footer />}
      <BottomNav />
    </div>
  )
}
