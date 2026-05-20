'use client'

/* eslint-disable @next/next/no-img-element */

import { memo, startTransition, useState } from 'react'
import { motion } from 'framer-motion'

type PosterImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

function PosterImageInner({
  src,
  alt,
  className = '',
  sizes = '(max-width: 767px) 142px, (max-width: 1023px) 25vw, 200px',
  priority = false,
}: PosterImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-[#1a1a1a] ${className}`}>
        <span className="text-3xl opacity-40" aria-hidden>
          🎬
        </span>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1a1a1a]">
      <div
        className={`poster-shimmer absolute inset-0 transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden
      />
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        onLoad={() => startTransition(() => setLoaded(true))}
        onError={() => startTransition(() => setFailed(true))}
        initial={false}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.02 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full w-full object-cover ${className}`}
      />
    </div>
  )
}

export default memo(PosterImageInner)
