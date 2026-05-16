'use client'
import Link from 'next/link'
import MovieCard from '@/components/MovieCard'
import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import { getTrendingMovies } from '@/lib/trending'
import { TRENDING_CONFIG } from '@/data/trending'
import MouseGlow from '@/components/effects/MouseGlow'

export default function TrendingPage() {
  const { movies } = useSyncedMoviesFromAdmin()
  const trendingMovies = getTrendingMovies(movies)

  return (
    <div style={{padding:'120px 48px',color:'#111827',background:'#FAFAF7',minHeight:'100vh',position:'relative'}}>
      <MouseGlow />
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <Link href="/" style={{ color: '#7C3AED', fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
            ← Back to Home
          </Link>
          <div style={{ 
            fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', 
            color: '#7C3AED', marginBottom: 16,
            fontFamily: 'Inter, sans-serif',
          }}>{TRENDING_CONFIG.LABEL}</div>
          <h1 className="font-playfair" style={{fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-3px', color: '#111827', marginBottom: 16, lineHeight: 1}}>
            {TRENDING_CONFIG.PAGE_TITLE}
          </h1>
          <p style={{ color: '#6B7280', fontSize: 18, maxWidth: 600 }}>
            Curated list of the most watched and talked about movies this week.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 40 }}>
          {trendingMovies.map((movie, i) => (
            <MovieCard key={movie.uuid} movie={movie} index={i} />
          ))}

          {trendingMovies.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: '#6B7280' }}>
              <div style={{ fontSize: 48, marginBottom: 24 }}>🎬</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>{TRENDING_CONFIG.EMPTY_FALLBACK}</div>
              <p style={{ marginTop: 8 }}>Check back later for new trending titles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

