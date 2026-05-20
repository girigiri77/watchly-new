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
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAFAF7] px-4 py-6 text-[#111827] sm:px-6 sm:py-8 lg:px-8">
      <MouseGlow />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-10">
          <Link
            href="/"
            className="mb-4 inline-block text-xs font-bold text-[#7C3AED] transition-colors hover:text-purple-700 sm:text-sm"
          >
            ← Back to Home
          </Link>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED] sm:text-sm">
            {TRENDING_CONFIG.LABEL}
          </div>
          <h1 className="font-playfair text-2xl font-black leading-tight tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
            {TRENDING_CONFIG.PAGE_TITLE}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-500 sm:text-base">
            Curated list of the most watched and talked about movies this week.
          </p>
        </div>

        <div className="movie-grid">
          {trendingMovies.map((movie, i) => (
            <MovieCard key={movie.uuid} movie={movie} index={i} />
          ))}

          {trendingMovies.length === 0 && (
            <div className="col-span-full py-16 text-center font-sans text-neutral-400 sm:py-20">
              <div className="mb-4 text-4xl sm:text-5xl">🎬</div>
              <div className="text-base font-bold text-[#111827] sm:text-lg">
                {TRENDING_CONFIG.EMPTY_FALLBACK}
              </div>
              <p className="mt-2 text-xs sm:text-sm">Check back later for new trending titles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
