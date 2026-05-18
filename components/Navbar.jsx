'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, startTransition } from 'react'
import { Search, Menu, X, TrendingUp, Calendar, Heart, Film } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const isHomeHero = pathname === '/'
  const useSolidBar = scrolled || !isHomeHero

  const navBg = useSolidBar
    ? 'rgba(250,250,247,0.94)'
    : isHomeHero
      ? 'rgba(255,255,255,0.38)'
      : 'transparent'

  const navBlur = useSolidBar
    ? 'blur(20px) saturate(180%)'
    : isHomeHero
      ? 'blur(28px) saturate(200%)'
      : 'none'

  const navBorderBottom = useSolidBar
    ? '1px solid rgba(124,58,237,0.1)'
    : isHomeHero
      ? '1px solid rgba(255,255,255,0.45)'
      : 'none'

  const pillBg =
    scrolled || !isHomeHero ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.52)'

  const pillBorder = '1px solid rgba(124,58,237,0.1)'

  useEffect(() => {
    const onScroll = () => {
      startTransition(() => setScrolled(window.scrollY > 40))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Discover', icon: Film },
    { href: '/releases', label: 'New Releases', icon: Calendar },
    { href: '/mood', label: 'Mood Cinema', icon: Heart },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
  ]

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled ? 'py-3 px-4 sm:px-8 lg:px-12' : 'py-5 px-4 sm:px-8 lg:px-12'
        }`}
        style={{
          background: navBg,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          borderBottom: navBorderBottom,
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-4 transition-transform duration-300 hover:scale-[1.02]">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-black text-white shadow-md relative overflow-hidden">
            <div className="shimmer absolute inset-0 opacity-30" />
            <span className="relative z-10">🎬</span>
          </div>
          <div>
            <span className="font-playfair text-xl sm:text-2xl md:text-3xl font-black text-[#111827] tracking-tight leading-none block">
              Absolute
              <span className="gradient-text-purple"> Cinema</span>
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] text-[#7C3AED] tracking-[0.2em] uppercase font-semibold font-sans mt-1">
              Cinema for Every Emotion
            </span>
          </div>
        </Link>

        {/* Center Nav - Desktop */}
        <div style={{
          display: 'flex', gap: 4,
          background: pillBg,
          border: pillBorder,
          padding: '8px 8px',
          borderRadius: 100,
          backdropFilter: 'blur(20px)',
          boxShadow: 'var(--card-shadow)',
        }} className="hidden lg:flex">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} style={{
              color: '#4B5563',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.3px',
              padding: '12px 20px',
              borderRadius: 100,
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#111827'
              e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#4B5563'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              <Icon size={14} style={{ color: '#7C3AED' }} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex relative items-center">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: searchFocused ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.8)',
              border: searchFocused ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(124,58,237,0.1)',
              padding: '12px 24px',
              borderRadius: 100,
              transition: 'all 0.3s',
              minWidth: '240px',
              backdropFilter: 'blur(20px)',
              boxShadow: 'var(--card-shadow)',
            }}
            onMouseEnter={() => setSearchFocused(true)}
            onMouseLeave={() => setSearchFocused(false)}
            >
              <Search size={18} style={{
                color: searchFocused ? '#7C3AED' : '#4B5563',
                transition: 'color 0.3s',
              }} />
              <input
                type="text"
                placeholder="Discover cinema..."
                suppressHydrationWarning
                autoComplete="off"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#111827',
                  fontSize: 14,
                  fontWeight: 500,
                  width: '100%',
                  opacity: searchFocused ? 1 : 0.85,
                  transition: 'opacity 0.3s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Search Button - Mobile */}
          <Link href="/search" className="md:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white/80 border border-purple-100/50 text-[#4B5563] rounded-full shadow-sm hover:bg-purple-50/50 hover:text-[#7C3AED] hover:border-purple-200 transition duration-300">
            <Search size={18} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white/80 border border-purple-100/50 text-[#4B5563] rounded-full shadow-sm hover:bg-purple-50/50 hover:text-[#7C3AED] hover:border-purple-200 transition duration-300"
            suppressHydrationWarning
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#FAFAF7]/98 backdrop-blur-xl z-[99] pt-24 px-4 sm:px-6 overflow-y-auto duration-300">
          <div className="max-w-md mx-auto flex flex-col gap-4 py-8">
            {navItems.map(({ href, label, icon: Icon }, index) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-purple-100/50 text-[#4B5563] hover:text-[#111827] hover:bg-purple-50/40 hover:border-purple-200 hover:translate-x-1.5 transition-all duration-300 font-semibold"
              >
                <Icon size={20} className="text-[#7C3AED]" />
                <span>{label}</span>
              </Link>
            ))}

            {/* Mobile Search Input */}
            <div className="mt-6 p-1">
              <div className="flex items-center gap-3 bg-white border border-purple-100 p-4 rounded-full shadow-sm focus-within:border-purple-300 focus-within:bg-purple-50/30 transition-all duration-300">
                <Search size={20} className="text-[#7C3AED]" />
                <input
                  type="text"
                  placeholder="Discover movies & emotions..."
                  suppressHydrationWarning
                  autoComplete="off"
                  className="bg-transparent border-none outline-none text-[#111827] text-base w-full font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
