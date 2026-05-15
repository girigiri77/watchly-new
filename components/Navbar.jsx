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
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: scrolled ? '20px 48px' : '28px 48px',
        background: navBg,
        backdropFilter: navBlur,
        WebkitBackdropFilter: navBlur,
        borderBottom: navBorderBottom,
        transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '16px',
          transition: 'transform 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: 48, height: 48,
            background: 'var(--purple-gradient)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20, fontWeight: 900,
            boxShadow: 'var(--soft-shadow)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div className="shimmer" style={{
              position: 'absolute', inset: 0,
              opacity: 0.3,
            }} />
            <span style={{ position: 'relative', zIndex: 1, color: 'white' }}>🎬</span>
          </div>
          <div>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 28,
              fontWeight: 900,
              color: '#111827',
              letterSpacing: '-0.5px',
              display: 'block',
              lineHeight: 1,
            }}>
              Absolute
              <span className="gradient-text-purple"> Cinema</span>
            </span>
            <span style={{
              fontSize: 10,
              color: '#7C3AED',
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
            }}>Cinema for Every Emotion</span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
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
          <Link href="/search" className="md:hidden" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44,
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(124,58,237,0.1)',
            color: '#4B5563',
            borderRadius: 100,
            textDecoration: 'none',
            transition: 'all 0.3s',
            boxShadow: 'var(--card-shadow)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
            e.currentTarget.style.color = '#111827'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.8)'
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.1)'
            e.currentTarget.style.color = '#4B5563'
          }}
          >
            <Search size={20} />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden"
            suppressHydrationWarning
            style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(124,58,237,0.1)',
              color: '#4B5563',
              width: 44, height: 44,
              borderRadius: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: 'var(--card-shadow)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
              e.currentTarget.style.color = '#111827'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.8)'
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.1)'
              e.currentTarget.style.color = '#4B5563'
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(250,250,247,0.95)',
          backdropFilter: 'blur(30px) saturate(180%)',
          zIndex: 99,
          paddingTop: '100px',
          animation: 'slideInRight 0.3s ease',
        }}>
          <div style={{
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {navItems.map(({ href, label, icon: Icon }, index) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '20px 28px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(124,58,237,0.1)',
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'all 0.3s',
                  animation: `slideInLeft 0.3s ease ${index * 0.1}s both`,
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                  e.currentTarget.style.color = '#111827'
                  e.currentTarget.style.transform = 'translateX(8px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.1)'
                  e.currentTarget.style.color = '#4B5563'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <Icon size={20} style={{ color: '#7C3AED' }} />
                {label}
              </Link>
            ))}

            {/* Mobile Search */}
            <div style={{
              padding: '20px 28px',
              marginTop: 20,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(124,58,237,0.1)',
                padding: '16px 24px',
                borderRadius: 100,
              }}>
                <Search size={20} style={{ color: '#7C3AED' }} />
                <input
                  type="text"
                  placeholder="Discover cinema, emotions, stories..."
                  suppressHydrationWarning
                  autoComplete="off"
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#111827',
                    fontSize: 16,
                    fontWeight: 500,
                    width: '100%',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
