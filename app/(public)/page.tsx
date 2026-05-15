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
  const { movies: allMovies } = useSyncedMoviesFromAdmin()
  const { picks: teluguPicks, loading: teluguPicksLoading } = usePublicTeluguPicks()

  // Admin-controlled sections - use flags from admin panel
  const weeklyReleases = allMovies.filter(m => m.weeklyOTTRelease).sort((a, b) => (a.weeklyOrder || 999) - (b.weeklyOrder || 999)).slice(0, 8)
  const latestMovies = allMovies.filter(m => m.latestMovie).slice(0, 8)
  const trendingMovies = getHomepageTrending(allMovies, TRENDING_CONFIG.HOME_LIMIT)

  return (
    <main style={{ background: '#FAFAF7', minHeight: '100vh', position: 'relative' }}>
      <MouseGlow />
      <Hero />
      {/* â”€â”€ THIS WEEK'S OTT RELEASES â”€â”€ */}
      <section style={{ 
        padding: '100px 48px', 
        background: '#FFFFFF',
      }}>
        <ParallaxWrapper multiplier={5} className="mb-[48px]">
          <div style={{ 
            fontSize: 20, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', 
            color: '#7C3AED', marginBottom: 40,
            fontFamily: 'Inter, sans-serif',
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
            position: 'relative',
            lineHeight: 1.2,
          }}>
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
          <h2 className="font-playfair" style={{ 
            fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1,
            color: '#111827', marginBottom: 0,
          }}>
            Latest Movies & Shows
            <br />
            <span style={{ color: '#4B5563' }}>Across All Platforms</span>
          </h2>
        </ParallaxWrapper>

        {/* OTT Releases Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 32,
        }}>
          {weeklyReleases.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/releases?tab=week" style={{
            background: 'var(--purple-gradient)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: 100,
            fontSize: 14, fontWeight: 600,
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
            View All Releases
            <span style={{ fontSize: 16 }}>→</span>
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

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 32,
        }}>
          {latestMovies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>
      </section>

      {/* â”€â”€ EDITORIAL TICKER â”€â”€ */}
      <div style={{ 
        background: 'var(--purple-gradient)', 
        padding: '16px 0', overflow: 'hidden',
        boxShadow: 'var(--soft-shadow)',
      }}>
        <div className="ticker-animate">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 14, fontWeight: 700,
              letterSpacing: 3, textTransform: 'uppercase',
              color: 'white',
              padding: '0 32px', whiteSpace: 'nowrap',
            }}>
              {item} <span style={{ color: 'white', margin: '0 12px', opacity: 0.7 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* â”€â”€ EDITORIAL STATS â”€â”€ */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, background: 'rgba(124,58,237,0.1)',
      }}>
        {[['500+', 'Curated Films'], ['8', 'Streaming Platforms'], ['7', 'Cinematic Moods'], ['12', 'Languages']].map(([num, label]) => (
          <div key={label} style={{
            background: '#FFFFFF', 
            padding: '48px 32px',
            borderBottom: '2px solid transparent',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderBottomColor = '#7C3AED'
            e.currentTarget.style.background = '#F9FAFB'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderBottomColor = 'transparent'
            e.currentTarget.style.background = '#FFFFFF'
          }}
          >
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(36px, 4vw, 56px)',
              fontWeight: 900, letterSpacing: '-2px',
              background: 'var(--purple-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 12,
            }}>{num}</div>
            <div style={{ 
              fontSize: 11, color: '#4B5563', 
              textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
            }}>{label}</div>
          </div>
        ))}
      </div>

      {/* â”€â”€ MOOD CINEMA SECTION â”€â”€ */}
      <MoodCinemaSection />

      {/* â”€â”€ TRENDING MOVIES â”€â”€ */}
      <section style={{ 
        padding: '80px 48px', 
        background: '#FFFFFF',
      }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ 
            fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', 
            color: '#7C3AED', marginBottom: 24,
            fontFamily: 'Inter, sans-serif',
          }}>{TRENDING_CONFIG.LABEL}</div>
          <h2 className="font-playfair" style={{ 
            fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.1,
            color: '#111827', marginBottom: 32,
          }}>
            {TRENDING_CONFIG.SECTION_TITLE}
          </h2>
        </div>

        {/* Trending Movies Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 32,
        }}>
          {trendingMovies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
          {trendingMovies.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
              {TRENDING_CONFIG.EMPTY_FALLBACK}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/trending" style={{
            background: 'transparent',
            color: '#7C3AED',
            border: '1px solid #7C3AED',
            padding: '16px 32px',
            borderRadius: 100,
            fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '1px',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          >
            View All Trending
            <span style={{ fontSize: 16 }}>→</span>
          </Link>
        </div>
      </section>

      {/* â”€â”€ TELUGU PICKS â”€â”€ */}
      <section style={{ 
        padding: '80px 48px', 
        background: '#F9FAFB',
      }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ 
            fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', 
            color: '#FF6B6B', marginBottom: 24,
            fontFamily: 'Inter, sans-serif',
          }}>Telugu Picks</div>
          <h2 className="font-playfair" style={{ 
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1,
            color: '#111827', marginBottom: 32,
          }}>
            Curated Tollywood
            <br />
            <span style={{ color: '#4B5563' }}>Masterpieces</span>
          </h2>
        </div>

        {/* Telugu Picks — curated via /admin/telugu-picks (API + data/telugu-picks.json) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: 32,
        }}>
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
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 16px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              No Telugu Picks added yet.
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/telugu" style={{
            background: 'transparent',
            color: '#FF6B6B',
            border: '1px solid #FF6B6B',
            padding: '16px 32px',
            borderRadius: 100,
            fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '1px',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,107,107,0.08)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          >
            View All Telugu
            <span style={{ fontSize: 16 }}>→</span>
          </Link>
        </div>
      </section>

      {/* â”€â”€ EDITORIAL FOOTER â”€â”€ */}
      <footer style={{ 
        padding: '80px 48px 60px', 
        borderTop: '1px solid rgba(124,58,237,0.1)',
        background: '#F3F4F6',
      }}>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
          flexWrap: 'wrap', gap: 48, marginBottom: 56 
        }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ 
                width: 48, height: 48, 
                background: 'var(--purple-gradient)',
                borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 20, fontWeight: 900,
                boxShadow: 'var(--soft-shadow)',
              }}>🎬</div>
              <span className="font-playfair" style={{ 
                fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px',
                color: '#111827',
              }}>
                Absolute<span className="gradient-text-purple"> Cinema</span>
              </span>
            </div>
            <p style={{ 
              fontSize: 14, color: '#4B5563', lineHeight: 1.8,
              fontFamily: 'Inter, sans-serif',
            }}>
              Premium cinematic discovery platform. 
              <br />
              Every mood. Every story. Every emotion.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 64 }}>
            {([
              ['Discover', [['/', 'Home'], ['/releases', 'New Releases'], ['/mood', 'Mood Cinema'], ['/search', 'Search']] as [string, string][]],
              ['Languages', [['/','Telugu'], ['/','Tamil'], ['/','Hindi'], ['/','Malayalam']] as [string, string][]],
            ] as [string, [string, string][]][]).map(([title, links]: [string, [string, string][]]) => (
              <div key={title}>
                <h4 className="font-playfair" style={{ 
                  fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', 
                  marginBottom: 24, color: '#7C3AED' 
                }}>{title}</h4>
                {links.map(([href, label]: [string, string]) => (
                  <Link key={label} href={href} style={{
                    display: 'block', color: '#4B5563',
                    textDecoration: 'none', fontSize: 14, marginBottom: 16,
                    transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#7C3AED'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#4B5563'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                  >{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 40, borderTop: '1px solid rgba(124,58,237,0.1)',
          fontSize: 12, color: '#4B5563',
          fontFamily: 'Inter, sans-serif',
        }}>
          <span>Â© 2026 Absolute Cinema. Premium cinematic discovery.</span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/admin" style={{
              color: '#4B5563',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#7C3AED'}
            onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}
            >
              Admin
            </Link>
            <span style={{ color: '#7C3AED' }}>Cinema for Every Emotion</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
