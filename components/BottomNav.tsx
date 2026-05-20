'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Film, Heart, Search, TrendingUp } from 'lucide-react'

const tabs = [
  { href: '/', label: 'Home', icon: Film, match: (p: string) => p === '/' },
  { href: '/releases', label: 'New', icon: Calendar, match: (p: string) => p.startsWith('/releases') },
  { href: '/search', label: 'Search', icon: Search, match: (p: string) => p.startsWith('/search'), accent: true },
  { href: '/mood', label: 'Mood', icon: Heart, match: (p: string) => p.startsWith('/mood') },
  { href: '/trending', label: 'Trending', icon: TrendingUp, match: (p: string) => p.startsWith('/trending') },
]

export default function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/movie/')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[90] lg:hidden"
      aria-label="Primary mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-3 mb-3 rounded-2xl border border-white/10 bg-[#0f0f14]/92 shadow-[0_-8px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(124,58,237,0.12)] backdrop-blur-xl">
        <div className="flex items-stretch justify-around px-1 py-1.5">
          {tabs.map(({ href, label, icon: Icon, match, accent }) => {
            const active = match(pathname)
            return (
              <Link
                key={href}
                href={href}
                className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    className="absolute inset-1 rounded-xl bg-purple-500/15 ring-1 ring-purple-400/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    accent && !active
                      ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 text-violet-300'
                      : active
                        ? 'text-violet-300'
                        : 'text-white/55'
                  }`}
                >
                  <Icon
                    size={accent ? 20 : 18}
                    strokeWidth={active ? 2.25 : 2}
                    className={active ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : ''}
                  />
                </span>
                <span
                  className={`relative text-[10px] font-semibold tracking-wide ${
                    active ? 'text-violet-200' : 'text-white/45'
                  }`}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
