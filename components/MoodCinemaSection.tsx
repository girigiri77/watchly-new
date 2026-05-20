'use client'

import { useState, useMemo, useRef } from 'react'
import { moods } from '@/data/moods'
import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import MovieCard from '@/components/MovieCard'
import TiltCard from '@/components/effects/TiltCard'
import FadeInView from '@/components/motion/FadeInView'
import { getMoviesByMoodOrdered } from '@/lib/mood-utils'

export default function MoodCinemaSection({
  title = 'Mood Cinema',
  subtitle = 'Cinema for Every Emotion',
}) {
  const { movies: allMovies } = useSyncedMoviesFromAdmin()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const moodRecommendations = useMemo(() => {
    if (!selectedMood) return []
    return getMoviesByMoodOrdered(allMovies, selectedMood)
  }, [selectedMood, allMovies])

  const handleMoodSelect = (mood: string | null) => {
    setSelectedMood(mood)
    if (mood) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  const defaultSubtitle = (
    <>
      Cinema for
      <br />
      <span className="text-[#4B5563]">Every Emotion</span>
    </>
  )

  return (
    <>
      <section className="section-padding border-y border-purple-100 bg-[#F3F4F6] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeInView className="mb-6 sm:mb-10">
            <div>
              <p className="text-eyebrow mb-2 text-[#7C3AED]">{title}</p>
              <h2 className="section-title text-[#111827]">
                {subtitle === 'Cinema for Every Emotion'
                  ? defaultSubtitle
                  : subtitle.includes('\n') || subtitle.includes('\\n')
                    ? subtitle.split(subtitle.includes('\n') ? '\n' : '\\n').map((line, i) => (
                        <span key={i}>
                          {i === 1 ? (
                            <span className="text-[#4B5563]">{line}</span>
                          ) : (
                            <>
                              {line}
                              <br />
                            </>
                          )}
                        </span>
                      ))
                    : subtitle}
            </h2>
            </div>
          </FadeInView>

          <FadeInView delay={0.05}>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
            {moods.map((mood) => {
              const isSelected = selectedMood === mood.name
              return (
                <TiltCard key={mood.name} intensity={10} className="block h-full w-full">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() =>
                      handleMoodSelect(isSelected ? null : mood.name)
                    }
                    className={`flex w-full flex-col items-center rounded-2xl border px-2 py-4 text-center transition-all duration-300 sm:rounded-3xl sm:px-3 sm:py-5 md:py-6 ${
                      isSelected
                        ? '-translate-y-1 border-[#7C3AED] bg-purple-50/80 shadow-[var(--hover-shadow)]'
                        : 'border-purple-100/80 bg-white shadow-[var(--card-shadow)] hover:-translate-y-1 hover:border-purple-300/50 hover:bg-purple-50/40'
                    }`}
                  >
                    <div
                      className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all sm:mb-3 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl md:h-[52px] md:w-[52px] ${
                        isSelected
                          ? 'bg-gradient-to-br from-purple-600 to-violet-700 shadow-md'
                          : 'bg-purple-50'
                      }`}
                    >
                      {mood.emoji}
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-wide sm:text-xs ${
                        isSelected ? 'text-[#7C3AED]' : 'text-[#4B5563]'
                      }`}
                    >
                      {mood.name}
                    </span>
                  </button>
                </TiltCard>
              )
            })}
          </div>
          </FadeInView>
        </div>
      </section>

      <div ref={resultsRef} />
      {selectedMood && (
        <section className="section-padding border-t border-purple-100 bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 sm:mb-10">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED] sm:text-sm">
                Mood Recommendations
              </div>
              <h2 className="section-title text-[#111827]">
                {selectedMood} Movies
                <br />
                <span className="text-[#4B5563]">For Your Vibe</span>
              </h2>
            </div>

            {moodRecommendations.length > 0 ? (
              <div className="movie-row movie-row-peek">
                {moodRecommendations.map((movie, i) => (
                  <MovieCard key={movie.uuid} movie={movie} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center font-sans text-neutral-500 sm:py-16">
                <div className="mb-4 text-4xl sm:text-5xl">🎬</div>
                <div className="text-base font-bold text-[#111827] sm:text-lg">
                  No movies found for this mood
                </div>
                <p className="mt-2 text-sm">Try selecting another emotion to discover more cinema.</p>
              </div>
            )}

            <div className="mt-8 text-center sm:mt-12">
              <button
                type="button"
                onClick={() => setSelectedMood(null)}
                className="touch-target inline-flex items-center gap-2 rounded-full border border-[#7C3AED] bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#7C3AED] transition hover:bg-purple-50/50 active:scale-[0.98] sm:px-8 sm:py-3.5 sm:text-sm"
              >
                Clear Mood Filter
                <span className="text-sm">×</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
