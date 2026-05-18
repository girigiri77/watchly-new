'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search as SearchIcon, X, SlidersHorizontal, Film, Eye } from 'lucide-react'
import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import MovieCard from '@/components/MovieCard'
import MouseGlow from '@/components/effects/MouseGlow'

export default function SearchPage() {
  const { movies, loading, error } = useSyncedMoviesFromAdmin()
  const [query, setQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedOTT, setSelectedOTT] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique languages and platforms for filters
  const uniqueLanguages = useMemo(() => {
    const langs = new Set<string>()
    movies.forEach(m => {
      if (m.language) langs.add(m.language)
    })
    return Array.from(langs)
  }, [movies])

  const uniqueOTTs = useMemo(() => {
    const otts = new Set<string>()
    movies.forEach(m => {
      if (m.ott) otts.add(m.ott)
    })
    return Array.from(otts)
  }, [movies])

  // Filter movies based on query and selected criteria
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesQuery = 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.ott.toLowerCase().includes(query.toLowerCase()) ||
        movie.language.toLowerCase().includes(query.toLowerCase()) ||
        movie.moods.some(m => m.toLowerCase().includes(query.toLowerCase())) ||
        (movie.genre && movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())))

      const matchesLanguage = !selectedLanguage || movie.language === selectedLanguage
      const matchesOTT = !selectedOTT || movie.ott === selectedOTT

      return matchesQuery && matchesLanguage && matchesOTT
    })
  }, [movies, query, selectedLanguage, selectedOTT])

  return (
    <div className="py-24 px-4 sm:px-8 lg:px-12 text-[#111827] bg-[#FAFAF7] min-h-screen relative">
      <MouseGlow />
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <Link href="/" className="text-[#7C3AED] hover:text-purple-700 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors mb-6">
            ← Back to Home
          </Link>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#7C3AED] mb-3 font-sans">
            Premium Search
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#111827]">
            Discover Cinema
          </h1>
          <p className="mt-2 text-neutral-500 text-sm sm:text-base max-w-xl">
            Search across OTT platforms, languages, emotional vibes, or genres to find your next watch instantly.
          </p>
        </div>

        {/* Search Input and Control Row */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative flex items-center w-full">
            <div className="absolute left-5 text-neutral-400">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              placeholder="Type movie name, language, streaming service, or emotional vibe..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              suppressHydrationWarning
              autoFocus
              className="w-full bg-white border border-purple-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-full py-4.5 pl-14 pr-12 text-sm sm:text-base focus:border-purple-300 focus:outline-none transition-all font-medium placeholder-neutral-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-14 text-neutral-400 hover:text-neutral-600 transition"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-4 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all ${
                showFilters 
                  ? 'bg-purple-50 text-[#7C3AED] border-purple-200' 
                  : 'bg-white text-neutral-500 border-purple-100 hover:border-purple-200'
              }`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Collapsible Filters Panel */}
          {showFilters && (
            <div className="p-5 sm:p-6 bg-white border border-purple-100/50 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.02)] flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8 transition-all">
              {/* Language Filter */}
              <div>
                <div className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-2.5">Language</div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedLanguage(null)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                      selectedLanguage === null
                        ? 'bg-[#7C3AED] text-white border-transparent'
                        : 'bg-neutral-50 text-[#4B5563] border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    All
                  </button>
                  {uniqueLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                        selectedLanguage === lang
                          ? 'bg-[#7C3AED] text-white border-transparent'
                          : 'bg-neutral-50 text-[#4B5563] border-gray-100 hover:border-purple-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streaming Platform Filter */}
              <div>
                <div className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-2.5">Streaming Platform</div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedOTT(null)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                      selectedOTT === null
                        ? 'bg-[#7C3AED] text-white border-transparent'
                        : 'bg-neutral-50 text-[#4B5563] border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    All
                  </button>
                  {uniqueOTTs.map(ott => (
                    <button
                      key={ott}
                      onClick={() => setSelectedOTT(ott)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                        selectedOTT === ott
                          ? 'bg-[#7C3AED] text-white border-transparent'
                          : 'bg-neutral-50 text-[#4B5563] border-gray-100 hover:border-purple-200'
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

        {/* Results Block */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>Error searching movies: {error}</p>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div>
            <div className="text-xs text-neutral-500 mb-6 font-semibold flex items-center gap-2">
              <Eye size={13} className="text-[#7C3AED]" />
              Found {filteredMovies.length} matching {filteredMovies.length === 1 ? 'title' : 'titles'}
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
              {filteredMovies.map((movie, i) => (
                <MovieCard key={movie.uuid} movie={movie} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[460px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-12 py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-violet-50 text-[#7C3AED] mb-4">
              <Film className="size-6" />
            </div>
            <h2 className="font-playfair text-xl font-bold text-[#111827]">
              No titles matched
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
              We couldn’t find any movies matching &ldquo;{query}&rdquo;. Check your spelling or clear some filters above!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}