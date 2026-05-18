'use client'
import { useState, useMemo, useRef } from 'react'
import { moods } from '@/data/moods'
import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import MovieCard from '@/components/MovieCard'
import TiltCard from '@/components/effects/TiltCard'
import { getMoviesByMoodOrdered } from '@/lib/mood-utils'

export default function MoodCinemaSection({ title = "Mood Cinema", subtitle = "Cinema for Every Emotion" }) {
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
      <span style={{ color: '#4B5563' }}>Every Emotion</span>
    </>
  )

  return (
    <>
      {/* Mood Categories Grid Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#F3F4F6] border-y border-purple-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 sm:mb-12">
          <div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#7C3AED] mb-3 font-sans">
              {title}
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#111827]">
              {subtitle === "Cinema for Every Emotion" ? defaultSubtitle : (
                (subtitle.includes('\n') || subtitle.includes('\\n')) ? (
                  subtitle.split(subtitle.includes('\n') ? '\n' : '\\n').map((line, i) => (
                    <span key={i} style={i === 1 ? { color: '#4B5563' } : {}}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))
                ) : (
                  subtitle
                )
              )}
            </h2>
          </div>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 sm:gap-6">
          {moods.map(mood => (
            <TiltCard key={mood.name} intensity={15} className="block h-full w-full">
              <button suppressHydrationWarning onClick={() => handleMoodSelect(selectedMood === mood.name ? null : mood.name)} style={{
                width: '100%',
                background: selectedMood === mood.name ? 'rgba(124,58,237,0.08)' : '#FFFFFF',
                border: selectedMood === mood.name ? '1px solid #7C3AED' : '1px solid rgba(124,58,237,0.1)',
                borderRadius: 24, padding: '24px 12px sm:padding: 32px 16px',
                textAlign: 'center', cursor: 'pointer',
                transform: selectedMood === mood.name ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(20px)',
                boxShadow: selectedMood === mood.name ? 'var(--hover-shadow)' : 'var(--card-shadow)',
              }}
              onMouseEnter={e => { 
                if (selectedMood !== mood.name) {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                  e.currentTarget.style.background = 'rgba(124,58,237,0.05)'
                } 
              }}
              onMouseLeave={e => { 
                if (selectedMood !== mood.name) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.1)'
                  e.currentTarget.style.background = '#FFFFFF'
                } 
              }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: selectedMood === mood.name 
                    ? 'var(--purple-gradient)'
                    : 'rgba(124,58,237,0.05)',
                  display: 'flex', alignItems: 'center', justifyCenter: 'center',
                  fontSize: 24, margin: '0 auto 12px',
                  transition: 'all 0.3s',
                  boxShadow: selectedMood === mood.name 
                    ? 'var(--soft-shadow)' 
                    : 'none',
                }} className="flex items-center justify-center">{mood.emoji}</div>
                <div style={{ 
                  fontSize: 12, fontWeight: 700, 
                  color: selectedMood === mood.name ? '#7C3AED' : '#4B5563', 
                  transition: 'color 0.2s',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.5px',
                }}>
                  {mood.name}
                </div>
              </button>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Mood Recommendations Results Section */}
      <div ref={resultsRef} />
      {selectedMood && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white border-t border-purple-100">
          <div className="mb-10 sm:mb-12">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#7C3AED] mb-3 font-sans">
              Mood Recommendations
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#111827]">
              {selectedMood} Movies
              <br />
              <span className="text-[#4B5563]">For Your Vibe</span>
            </h2>
          </div>

          {moodRecommendations.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
              {moodRecommendations.map((movie, i) => (
                <MovieCard key={movie.uuid} movie={movie} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-500 font-sans">
               <div className="text-5xl mb-4">🎬</div>
               <div className="text-lg font-bold text-[#111827]">No movies found for this mood</div>
               <p className="mt-2 text-sm">Try selecting another emotion to discover more cinema.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button onClick={() => setSelectedMood(null)} className="bg-transparent text-[#7C3AED] border border-[#7C3AED] hover:bg-purple-50/50 py-3.5 px-8 sm:py-4 sm:px-10 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
              Clear Mood Filter
              <span className="text-sm">x</span>
            </button>
          </div>
        </section>
      )}
    </>
  )
}
