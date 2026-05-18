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
    <div className="py-24 px-4 sm:px-8 lg:px-12 text-[#111827] bg-[#FAFAF7] min-h-screen relative">
      <MouseGlow />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="color-[#7C3AED] hover:text-purple-700 text-xs sm:text-sm font-bold text-decoration-none mb-6 inline-block transition-colors">
            ← Back to Home
          </Link>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#7C3AED] mb-3 font-sans">
            {TRENDING_CONFIG.LABEL}
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#111827] mb-4">
            {TRENDING_CONFIG.PAGE_TITLE}
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base max-w-xl">
            Curated list of the most watched and talked about movies this week.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
          {trendingMovies.map((movie, i) => (
            <MovieCard key={movie.uuid} movie={movie} index={i} />
          ))}

          {trendingMovies.length === 0 && (
            <div className="col-span-full text-center py-20 text-neutral-400 text-sm font-sans">
              <div className="text-5xl mb-4">🎬</div>
              <div className="text-lg font-bold text-[#111827]">{TRENDING_CONFIG.EMPTY_FALLBACK}</div>
              <p className="mt-2 text-xs">Check back later for new trending titles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

