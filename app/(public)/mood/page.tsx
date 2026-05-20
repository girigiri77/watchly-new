'use client'

import MoodCinemaSection from '@/components/MoodCinemaSection'
import MouseGlow from '@/components/effects/MouseGlow'

export default function MoodPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAFAF7]">
      <MouseGlow />
      <MoodCinemaSection title="Mood Cinema" />
    </div>
  )
}
