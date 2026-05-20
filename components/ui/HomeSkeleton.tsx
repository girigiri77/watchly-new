'use client'

import { motion } from 'framer-motion'

export default function HomeSkeleton() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0B0F] text-white">
      <motion.div
        className="relative h-[72dvh] overflow-hidden sm:h-[85dvh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 skeleton-shimmer bg-gradient-to-b from-[#1a1030] via-[#120a1f] to-[#0B0B0F]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B0B0F] to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          <div className="h-8 w-48 rounded-full skeleton-shimmer opacity-60" />
          <div className="h-12 w-64 max-w-full rounded-xl skeleton-shimmer" />
          <div className="h-4 w-56 max-w-full rounded-lg skeleton-shimmer opacity-70" />
          <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
            <div className="h-11 w-full rounded-full skeleton-shimmer" />
            <div className="h-11 w-full rounded-full skeleton-shimmer opacity-80" />
          </div>
        </div>
      </motion.div>

      {[1, 2, 3].map((section, sIdx) => (
        <motion.section
          key={section}
          className="section-padding px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + sIdx * 0.1, duration: 0.45 }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 h-3 w-28 rounded-full skeleton-shimmer sm:mb-8" />
            <div className="mb-4 h-9 w-4/5 max-w-md rounded-lg skeleton-shimmer" />
            <div className="skeleton-row">
              {Array.from({ length: section === 1 ? 6 : 5 }).map((_, i) => (
                <div key={i} className="skeleton-card skeleton-shimmer" />
              ))}
            </div>
          </div>
        </motion.section>
      ))}
    </main>
  )
}
