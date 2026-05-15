'use client'
import { useState, useMemo, useRef } from 'react'
import { moods } from '@/data/moods'
import { useSyncedMoviesFromAdmin } from '@/hooks/useSyncedMoviesFromAdmin'
import MovieCard from '@/components/MovieCard'
import TiltCard from '@/components/effects/TiltCard'
import { getMoviesByMoodOrdered } from '@/lib/mood-utils'

export default function MoodCinemaSection({ title = "Mood Cinema", subtitle = "Cinema for Every Emotion" }) {
  const { movies: allMovies, moodOrders } = useSyncedMoviesFromAdmin()
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const moodRecommendations = useMemo(() => {
    if (!selectedMood) return []
    return getMoviesByMoodOrdered(allMovies, moodOrders, selectedMood)
  }, [selectedMood, allMovies, moodOrders])

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
      <section style={{ 
        padding: '80px 48px', 
        background: '#F3F4F6', 
        borderTop: '1px solid rgba(124,58,237,0.1)', 
        borderBottom: '1px solid rgba(124,58,237,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 32, marginBottom: 56 }}>
          <div>
            <div style={{ 
              fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', 
              color: '#7C3AED', marginBottom: 16,
              fontFamily: 'Inter, sans-serif',
            }}>{title}</div>
            <h2 className="font-playfair" style={{ 
              fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1,
              color: '#111827',
            }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {moods.map(mood => (
            <TiltCard key={mood.name} intensity={15} className="block h-full w-full">
              <button suppressHydrationWarning onClick={() => handleMoodSelect(selectedMood === mood.name ? null : mood.name)} style={{
                width: '100%',
                background: selectedMood === mood.name ? 'rgba(124,58,237,0.08)' : '#FFFFFF',
                border: selectedMood === mood.name ? '1px solid #7C3AED' : '1px solid rgba(124,58,237,0.1)',
                borderRadius: 24, padding: '32px 16px',
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
                  width: 64, height: 64, borderRadius: 20,
                  background: selectedMood === mood.name 
                    ? 'var(--purple-gradient)'
                    : 'rgba(124,58,237,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, margin: '0 auto 16px',
                  transition: 'all 0.3s',
                  boxShadow: selectedMood === mood.name 
                    ? 'var(--soft-shadow)' 
                    : 'none',
                }}>{mood.emoji}</div>
                <div style={{ 
                  fontSize: 13, fontWeight: 700, 
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
        <section style={{ 
          padding: '80px 48px', 
          background: '#FFFFFF',
          borderTop: '1px solid rgba(124,58,237,0.1)',
        }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ 
              fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', 
              color: '#7C3AED', marginBottom: 24,
              fontFamily: 'Inter, sans-serif',
            }}>Mood Recommendations</div>
            <h2 className="font-playfair" style={{ 
              fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1,
              color: '#111827', marginBottom: 32,
            }}>
              {selectedMood} Movies
              <br />
              <span style={{ color: '#4B5563' }}>For Your Vibe</span>
            </h2>
          </div>

          {moodRecommendations.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
              gap: 32,
            }}>
              {moodRecommendations.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
               <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
               <div style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>No movies found for this mood</div>
               <p style={{ marginTop: 8 }}>Try selecting another emotion to discover more cinema.</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button onClick={() => setSelectedMood(null)} style={{
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
              cursor: 'pointer',
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
              Clear Mood Filter
              <span style={{ fontSize: 16, marginLeft: 8 }}>x</span>
            </button>
          </div>
        </section>
      )}
    </>
  )
}
