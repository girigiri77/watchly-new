'use client'

import type { ReactNode } from 'react'
import FadeInView from '@/components/motion/FadeInView'

type MovieSectionProps = {
  eyebrow: string
  title: ReactNode
  children: ReactNode
  className?: string
  delay?: number
  headerExtra?: ReactNode
}

export default function MovieSection({
  eyebrow,
  title,
  children,
  className = '',
  delay = 0,
  headerExtra,
}: MovieSectionProps) {
  return (
    <section className={`section-padding relative ${className}`}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInView delay={delay}>
          <div
            className={`mb-6 sm:mb-8 ${headerExtra ? 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between' : ''}`}
          >
            <div>
              <p className="text-eyebrow mb-2 text-purple-400">{eyebrow}</p>
              <h2 className="section-title">{title}</h2>
            </div>
            {headerExtra}
          </div>
        </FadeInView>
        <FadeInView delay={delay + 0.08}>
          <div className="movie-row movie-row-peek">{children}</div>
        </FadeInView>
      </div>
    </section>
  )
}
