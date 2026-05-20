'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, TrendingUp, Calendar, Heart, Film } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Discover', icon: Film },
  { href: '/releases', label: 'New Releases', icon: Calendar },
  { href: '/mood', label: 'Mood Cinema', icon: Heart },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
]

const drawerSpring = { type: 'spring', stiffness: 380, damping: 34 }

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const isHomeHero = pathname === '/'
  const useSolidBar = scrolled || !isHomeHero

  useEffect(() => {
    const onScroll = () => {
      startTransition(() => setScrolled(window.scrollY > 40))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`)
      } else {
        router.push('/search')
      }
      setMenuOpen(false)
      setSearchQuery('')
    },
    [searchQuery, router]
  )

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled
            ? 'h-14 px-3 py-0 sm:h-16 sm:px-6 lg:px-10'
            : 'h-16 px-3 py-0 sm:h-[4.5rem] sm:px-6 lg:px-10'
        } ${
          useSolidBar
            ? 'glass-nav border-b border-purple-500/10 bg-[#FAFAF7]/95 shadow-sm'
            : isHomeHero
              ? 'border-b border-white/40 bg-white/40 backdrop-blur-2xl'
              : 'bg-transparent'
        }`}
      >
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 transition-transform duration-300 active:scale-[0.98] sm:gap-3 md:hover:scale-[1.02]"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-base font-black text-white shadow-md cinematic-glow sm:h-11 sm:w-11 sm:rounded-2xl sm:text-xl">
            <div className="shimmer absolute inset-0 opacity-30" />
            <span className="relative z-10">🎬</span>
          </div>
          <div className="min-w-0">
            <span className="font-playfair block truncate text-base font-black leading-none tracking-tight text-[#111827] sm:text-xl md:text-2xl">
              Absolute
              <span className="gradient-text-purple"> Cinema</span>
            </span>
            <span className="mt-0.5 hidden truncate text-[8px] font-semibold uppercase tracking-[0.18em] text-[#7C3AED] sm:block sm:text-[9px]">
              Cinema for Every Emotion
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-purple-100/80 bg-white/80 px-1.5 py-1.5 shadow-sm backdrop-blur-xl lg:flex">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium tracking-wide transition-all duration-300 ${
                  active
                    ? 'bg-purple-100/80 text-[#111827]'
                    : 'text-[#4B5563] hover:bg-purple-50/60 hover:text-[#111827]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-purple-100/90"
                    transition={drawerSpring}
                  />
                )}
                <Icon size={14} className="relative z-10 text-[#7C3AED]" />
                <span className="relative z-10">{label}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <div className="flex items-center gap-2.5 rounded-full border border-purple-100/80 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-xl transition-all focus-within:border-purple-300 focus-within:bg-purple-50/30 focus-within:ring-2 focus-within:ring-purple-200/50 lg:min-w-[200px] xl:min-w-[240px]">
              <Search size={16} className="shrink-0 text-[#7C3AED]" />
              <input
                type="search"
                placeholder="Discover cinema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suppressHydrationWarning
                autoComplete="off"
                className="w-full min-w-0 border-none bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
          </form>

          <Link
            href="/search"
            aria-label="Search"
            className="touch-target flex h-10 w-10 items-center justify-center rounded-full border border-purple-100/50 bg-white/80 text-[#4B5563] shadow-sm transition active:scale-95 md:hidden md:hover:border-purple-200 md:hover:text-[#7C3AED]"
          >
            <Search size={18} />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="touch-target flex h-10 w-10 items-center justify-center rounded-full border border-purple-100/50 bg-white/80 text-[#4B5563] shadow-sm transition active:scale-95 lg:hidden"
            suppressHydrationWarning
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-[98] bg-black/45 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-[99] flex w-[min(100vw,320px)] flex-col border-l border-purple-100/30 bg-[#FAFAF7]/98 shadow-2xl backdrop-blur-xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={drawerSpring}
            >
              <div className="flex items-center justify-between border-b border-purple-100/50 px-5 py-4">
                <span className="text-sm font-bold uppercase tracking-wider text-[#7C3AED]">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="touch-target flex h-10 w-10 items-center justify-center rounded-full border border-purple-100/50 bg-white text-[#4B5563] active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-5">
                {navItems.map(({ href, label, icon: Icon }, i) => {
                  const active = pathname === href
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, ...drawerSpring }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-[15px] font-semibold transition-colors active:scale-[0.98] ${
                          active
                            ? 'border-purple-200 bg-purple-50/70 text-[#111827] shadow-sm'
                            : 'border-purple-100/50 bg-white text-[#4B5563]'
                        }`}
                      >
                        <Icon size={20} className="shrink-0 text-[#7C3AED]" />
                        {label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="border-t border-purple-100/50 px-4 py-5">
                <form onSubmit={handleSearch}>
                  <div className="flex items-center gap-3 rounded-full border border-purple-100 bg-white p-3.5 shadow-sm focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-200/40">
                    <Search size={18} className="shrink-0 text-[#7C3AED]" />
                    <input
                      type="search"
                      placeholder="Search movies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      suppressHydrationWarning
                      autoComplete="off"
                      className="w-full min-w-0 border-none bg-transparent text-base font-medium text-[#111827] outline-none"
                    />
                  </div>
                  <button type="submit" className="btn-premium mt-3 w-full py-3 text-sm font-bold uppercase tracking-wider active:scale-[0.98]">
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
