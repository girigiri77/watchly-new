'use client'
import MoodCinemaSection from '@/components/MoodCinemaSection'
import MouseGlow from '@/components/effects/MouseGlow'

export default function MoodPage() {
  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh', position: 'relative' }}>
      <MouseGlow />
      <div style={{ paddingTop: 100 }}>
        <MoodCinemaSection 
          title="Mood Cinema" 
        />
      </div>
    </div>
  )
}