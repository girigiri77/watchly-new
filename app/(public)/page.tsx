'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import { usePublicTeluguPicks } from '@/hooks/usePublicTeluguPicks'
import MovieCard from '@/components/MovieCard'
import TeluguPickCard from '@/components/TeluguPickCard'
import type { Movie } from '@/lib/types'
import { getMoviesByMood } from '@/lib/movie-utils'
import { moods } from '@/data/moods'
import Hero from '@/components/Hero'
import MouseGlow from '@/components/effects/MouseGlow'
import TiltCard from '@/components/effects/TiltCard'
import ParallaxWrapper from '@/components/effects/ParallaxWrapper'
import { getHomepageTrending } from '@/lib/trending'
import { TRENDING_CONFIG } from '@/data/trending'
import MoodCinemaSection from '@/components/MoodCinemaSection'

const tickerItems = ["Netflix", "Prime Video", "Hotstar", "Telugu Cinema", "Tamil Stories", "Bollywood", "Malayalam Gems", "Weekly Releases", "Mood Discovery", "Zee5", "SonyLIV"]

export default function HomePage() {
  const { movies: allMovies, loading, error } = useSyncedMoviesFromAdmin()
  const { picks: teluguPicks, loading: teluguPicksLoading } = usePublicTeluguPicks()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF7] p-8 text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-[#111827]">Connection Error</h2>
        <p className="text-[#4B5563]">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-[#7C3AED] px-8 py-3 font-semibold text-white transition-all hover:bg-[#6D28D9]"
        >
          Retry
        </button>
      </div>
    )
  }

  // Admin-controlled sections - use flags from admin panel
  const weeklyReleases = allMovies.filter(m => m.weekly).sort((a, b) => (a.mood_order || 999) - (b.mood_order || 999)).slice(0, 8)
  const latestMovies = allMovies.filter(m => m.featured).slice(0, 8)
  const trendingMovies = getHomepageTrending(allMovies, TRENDING_CONFIG.HOME_LIMIT)


  return (
    <main style={{ background: '#FAFAF7', minHeight: '100vh', position: 'relative' }}>
      <MouseGlow />
      <Hero />
      {/* ── THIS WEEK'S OTT RELEASES ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white">
        <ParallaxWrapper multiplier={5} className="mb-10 sm:mb-12">
          <div className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-[#7C3AED] mb-4 sm:mb-6 font-sans relative inline-block">
            THIS WEEK&apos;S OTT RELEASES
            <span style={{
              position: 'absolute',
              bottom: '-12px',
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, transparent, #7C3AED 15%, #7C3AED 85%, transparent)',
              opacity: 0.7,
            }} />
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#111827] mt-3">
            Latest Movies & Shows
            <br />
            <span className="text-[#4B5563]">Across All Platforms</span>
          </h2>
        </ParallaxWrapper>

        {/* OTT Releases Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
          {weeklyReleases.map((movie, i) => (
            <MovieCard key={movie.uuid} movie={movie} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/releases?tab=week" className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white py-3.5 px-8 sm:py-4 sm:px-10 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            View All Releases
            <span className="text-sm">→</span>
          </Link>
        </div>
      </section>

      {/* â”€â”€ LATEST MOVIES â”€â”€ */}
      <section style={{ 
        padding: '100px 48px', 
        background: '#F9FAFB',
      }}>
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
          <div style={{ 
            fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', 
            color: '#7C3AED', marginBottom: 24,
            fontFamily: 'Inter, sans-serif',
          }}>Latest Movies</div>
          <h2 className="font-playfair" style={{ 
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1,
            color: '#111827', marginBottom: 0,
          }}>
            Fresh Releases
            <br />
            <span style={{ color: '#4B5563' }}>Handpicked for You</span>
          </h2>
          </div>
          <Link href="/releases?tab=latest" style={{
            background: 'var(--purple-gradient)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: 100,
            fontSize: 13, fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '1px',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: 'var(--soft-shadow)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--hover-shadow)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--soft-shadow)'
          }}
          >
            View all new releases
            <span style={{ fontSize: 14 }}>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
          {latestMovies.map((movie, i) => (
            <MovieCard key={movie.uuid} movie={movie} index={i} />
          ))}
        </div>
      </section>

      {/* ── EDITORIAL TICKER ── */}
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 py-3.5 sm:py-4 overflow-hidden shadow-sm">
        <div className="ticker-animate">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="font-playfair text-xs sm:text-sm font-bold tracking-widest uppercase text-white px-8 inline-block white-space-nowrap">
              {item} <span className="text-white/60 mx-3">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── EDITORIAL STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-purple-100/50">
        {[['500+', 'Curated Films'], ['8', 'Streaming Platforms'], ['7', 'Cinematic Moods'], ['12', 'Languages']].map(([num, label]) => (
          <div key={label} className="bg-white py-8 px-4 sm:py-12 sm:px-6 border-b-2 border-transparent transition-all duration-300 hover:border-purple-600 hover:bg-neutral-50/50 relative overflow-hidden text-center shadow-sm">
            <div className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent mb-2 sm:mb-3">
              {num}
            </div>
            <div className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-semibold font-sans">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── MOOD CINEMA SECTION ── */}
      <MoodCinemaSection />

      {/* ── TRENDING MOVIES ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white">
        <div className="mb-10 sm:mb-12">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#7C3AED] mb-3 font-sans">
            {TRENDING_CONFIG.LABEL}
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#111827]">
            {TRENDING_CONFIG.SECTION_TITLE}
          </h2>
        </div>

        {/* Trending Movies Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
          {trendingMovies.map((movie, i) => (
            <MovieCard key={movie.uuid} movie={movie} index={i} />
          ))}
          {trendingMovies.length === 0 && (
            <div className="col-span-full text-center py-10 text-neutral-400 text-sm font-sans">
              {TRENDING_CONFIG.EMPTY_FALLBACK}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/trending" className="bg-transparent text-[#7C3AED] border border-[#7C3AED] hover:bg-purple-50/50 py-3.5 px-8 sm:py-4 sm:px-10 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            View All Trending
            <span className="text-sm">→</span>
          </Link>
        </div>
      </section>

      {/* ── TELUGU PICKS ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-neutral-50/50">
        <div className="mb-10 sm:mb-12">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#FF6B6B] mb-3 font-sans">
            Telugu Picks
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#111827]">
            Curated Tollywood
            <br />
            <span className="text-[#4B5563]">Masterpieces</span>
          </h2>
        </div>

        {/* Telugu Picks Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
          {teluguPicksLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shimmer rounded-[20px] border border-gray-200 bg-gray-100"
                style={{ height: 420 }}
              />
            ))
          ) : teluguPicks.length > 0 ? (
            teluguPicks.map((pick) => (
              <TeluguPickCard key={pick.id} pick={pick} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-neutral-500 text-sm font-sans">
              No Telugu Picks added yet.
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/telugu" className="bg-transparent text-[#FF6B6B] border border-[#FF6B6B] hover:bg-red-50/40 py-3.5 px-8 sm:py-4 sm:px-10 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            View All Telugu
            <span className="text-sm">→</span>
          </Link>
        </div>
      </section>

      {/* ── EDITORIAL FOOTER ── */}
      <footer className="py-16 px-4 sm:px-8 lg:px-12 border-t border-purple-100 bg-[#F3F4F6]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-14">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-xl flex items-center justify-center text-lg font-black text-white shadow-sm relative overflow-hidden">
                <span className="relative z-10">🎬</span>
              </div>
              <span className="font-playfair text-xl sm:text-2xl font-black text-[#111827] tracking-tight leading-none block">
                Absolute<span className="gradient-text-purple"> Cinema</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-sans">
              Premium cinematic discovery platform.
              <br />
              Every mood. Every story. Every emotion.
            </p>
          </div>
          <div className="flex gap-12 sm:gap-16">
            {([
              ['Discover', [['/', 'Home'], ['/releases', 'New Releases'], ['/mood', 'Mood Cinema'], ['/search', 'Search']] as [string, string][]],
              ['Languages', [['/','Telugu'], ['/','Tamil'], ['/','Hindi'], ['/','Malayalam']] as [string, string][]],
            ] as [string, [string, string][]][]).map(([title, links]: [string, [string, string][]]) => (
              <div key={title}>
                <h4 className="font-playfair text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 text-[#7C3AED]">{title}</h4>
                {links.map(([href, label]: [string, string]) => (
                  <Link key={label} href={href} className="block text-xs sm:text-sm text-[#4B5563] hover:text-[#7C3AED] hover:translate-x-1 transition-all duration-200 mb-3.5 font-sans">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 border-t border-purple-100 text-[11px] sm:text-xs text-[#4B5563] font-sans">
          <span>© 2026 Absolute Cinema. Premium cinematic discovery.</span>
          <div className="flex gap-4 sm:gap-6 items-center">
            <Link href="/admin" className="text-[#4B5563] hover:text-[#7C3AED] transition-colors">
              Admin
            </Link>
            <span className="text-[#7C3AED] font-semibold">Cinema for Every Emotion</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
