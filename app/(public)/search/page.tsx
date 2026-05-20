'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon, X, SlidersHorizontal, Film, Eye } from 'lucide-react'
import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import MovieCard from '@/components/MovieCard'
import FadeInView from '@/components/motion/FadeInView'
import MouseGlow from '@/components/effects/MouseGlow'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const { movies, loading, error } = useSyncedMoviesFromAdmin()
  const [query, setQuery] = useState(initialQuery)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedOTT, setSelectedOTT] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const uniqueLanguages = useMemo(() => {
    const langs = new Set<string>()
    movies.forEach((m) => {
      if (m.language) langs.add(m.language)
    })
    return Array.from(langs)
  }, [movies])

  const uniqueOTTs = useMemo(() => {
    const otts = new Set<string>()
    movies.forEach((m) => {
      if (m.ott) otts.add(m.ott)
    })
    return Array.from(otts)
  }, [movies])

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesQuery =
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.ott.toLowerCase().includes(query.toLowerCase()) ||
        movie.language.toLowerCase().includes(query.toLowerCase()) ||
        movie.moods.some((m) => m.toLowerCase().includes(query.toLowerCase())) ||
        (movie.genre && movie.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())))

      const matchesLanguage = !selectedLanguage || movie.language === selectedLanguage
      const matchesOTT = !selectedOTT || movie.ott === selectedOTT

      return matchesQuery && matchesLanguage && matchesOTT
    })
  }, [movies, query, selectedLanguage, selectedOTT])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAFAF7] px-4 py-6 text-[#111827] sm:px-6 sm:py-8 lg:px-8">
      <MouseGlow />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center sm:mb-8 sm:text-left">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] transition-colors hover:text-purple-700 sm:text-sm"
          >
            ← Back to Home
          </Link>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED] sm:text-sm">
            Premium Search
          </div>
          <h1 className="font-playfair text-2xl font-black tracking-tight text-[#111827] sm:text-4xl md:text-5xl">
            Discover Cinema
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-500 sm:mx-0 sm:text-base">
            Search across OTT platforms, languages, emotional vibes, or genres to find your next watch instantly.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4">
          <div className="relative w-full">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 sm:left-5">
              <SearchIcon size={18} className="sm:size-5" />
            </div>
            <input
              type="search"
              placeholder="Movie, language, platform, or mood..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              suppressHydrationWarning
              autoFocus
              className="w-full rounded-full border border-purple-100/80 bg-white py-3.5 pl-11 pr-20 text-sm shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all focus:border-purple-300 focus:outline-none sm:py-4 sm:pl-14 sm:pr-24 sm:text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-14 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-600 sm:right-16"
              >
                <X size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
              className={`absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border transition-all sm:right-4 sm:h-10 sm:w-10 ${
                showFilters
                  ? 'border-purple-200 bg-purple-50 text-[#7C3AED]'
                  : 'border-purple-100 bg-white text-neutral-500 hover:border-purple-200'
              }`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-col gap-4 rounded-2xl border border-purple-100/50 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.02)] sm:gap-5 sm:rounded-3xl sm:p-6 md:flex-row md:items-start md:gap-8">
              <div className="min-w-0 flex-1">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Language
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage(null)}
                    className={`touch-target rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selectedLanguage === null
                        ? 'border-transparent bg-[#7C3AED] text-white'
                        : 'border-gray-100 bg-neutral-50 text-[#4B5563] hover:border-purple-200'
                    }`}
                  >
                    All
                  </button>
                  {uniqueLanguages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`touch-target rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        selectedLanguage === lang
                          ? 'border-transparent bg-[#7C3AED] text-white'
                          : 'border-gray-100 bg-neutral-50 text-[#4B5563] hover:border-purple-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Streaming Platform
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedOTT(null)}
                    className={`touch-target rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selectedOTT === null
                        ? 'border-transparent bg-[#7C3AED] text-white'
                        : 'border-gray-100 bg-neutral-50 text-[#4B5563] hover:border-purple-200'
                    }`}
                  >
                    All
                  </button>
                  {uniqueOTTs.map((ott) => (
                    <button
                      key={ott}
                      type="button"
                      onClick={() => setSelectedOTT(ott)}
                      className={`touch-target rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        selectedOTT === ott
                          ? 'border-transparent bg-[#7C3AED] text-white'
                          : 'border-gray-100 bg-neutral-50 text-[#4B5563] hover:border-purple-200'
                      }`}
                    >
                      {ott}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 sm:py-20">
            <p>Error searching movies: {error}</p>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-neutral-500 sm:mb-6">
              <Eye size={13} className="text-[#7C3AED]" />
              Found {filteredMovies.length} matching {filteredMovies.length === 1 ? 'title' : 'titles'}
            </div>

            <FadeInView>
            <div className="movie-grid">
              {filteredMovies.map((movie, i) => (
                <MovieCard key={movie.uuid} movie={movie} index={i} />
              ))}
            </div>
            </FadeInView>
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-[460px] rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:mt-12 sm:p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-[#7C3AED] sm:h-14 sm:w-14">
              <Film className="size-5 sm:size-6" />
            </div>
            <h2 className="font-playfair text-lg font-bold text-[#111827] sm:text-xl">No titles matched</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#6B7280] sm:text-sm">
              We couldn&apos;t find any movies matching &ldquo;{query}&rdquo;. Check your spelling or clear some filters above!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-[#FAFAF7]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
