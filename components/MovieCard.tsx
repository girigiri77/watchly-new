"use client"

import Link from "next/link"
import { Calendar, ExternalLink, Play, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { memo, useMemo, useState, useCallback, startTransition } from "react"
import type { MovieCurated } from "@/types/movie"
import { getResolvedPosterUrl } from "@/lib/movie-images"
import PosterImage from "@/components/ui/PosterImage"
import TiltCard from "@/components/effects/TiltCard"

type MovieCardProps = {
  movie: MovieCurated
  index?: number
}

const platformStyle: Record<string, { label: string; gradient: string }> = {
  Netflix: { label: "NETFLIX", gradient: "linear-gradient(135deg, #E50914 0%, #B20710 100%)" },
  "Prime Video": { label: "PRIME", gradient: "linear-gradient(135deg, #00A8E0 0%, #0066CC 100%)" },
  Hotstar: { label: "HOTSTAR", gradient: "linear-gradient(135deg, #1F80E0 0%, #0066B3 100%)" },
  Zee5: { label: "ZEE5", gradient: "linear-gradient(135deg, #8B2FC9 0%, #6B1FA9 100%)" },
  SonyLIV: { label: "SONY", gradient: "linear-gradient(135deg, #FF5722 0%, #E64A19 100%)" },
  Aha: { label: "AHA", gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" },
  JioCinema: { label: "JIO", gradient: "linear-gradient(135deg, #D946EF 0%, #7C3AED 100%)" },
}

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null
}

function MovieCardComponent({ movie }: MovieCardProps) {
  const [trailerOpen, setTrailerOpen] = useState(false)
  const platform = platformStyle[movie.ott] ?? {
    label: movie.ott.slice(0, 8).toUpperCase(),
    gradient: "linear-gradient(135deg, #52525B 0%, #27272A 100%)",
  }
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(movie.trailer), [movie.trailer])
  const posterUrl = useMemo(() => {
    const url = getResolvedPosterUrl(movie)
    return url === "" ? "/placeholder.jpg" : url
  }, [movie])

  const closeTrailer = useCallback(() => setTrailerOpen(false), [])
  const openTrailer = useCallback(() => setTrailerOpen(true), [])

  return (
    <>
      <TiltCard intensity={8} className="block h-full w-full">
        <motion.article
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="tap-scale group h-full w-full max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f12] cinematic-card-shadow transition-shadow duration-300 sm:rounded-[18px] md:hover:cinematic-glow md:hover:-translate-y-1.5"
        >
          <Link href={`/movie/${movie.uuid}`} className="block">
            <div className="relative aspect-[2/3] overflow-hidden bg-[#141414]">
              <PosterImage src={posterUrl} alt={movie.title} className="md:group-hover:scale-[1.04] md:transition-transform md:duration-700" />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

              <div
                className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] text-white shadow-lg sm:left-2.5 sm:top-2.5 sm:px-2.5 sm:py-1 sm:text-[9px]"
                style={{ background: platform.gradient }}
              >
                {platform.label}
              </div>

              <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-full border border-white/12 bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md sm:right-2.5 sm:top-2.5 sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Star size={10} fill="#F5C542" stroke="none" />
                {Number(movie.rating || 0).toFixed(1)}
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 hidden sm:block md:bottom-3 md:left-3 md:right-3">
                <p className="line-clamp-2 text-[11px] font-medium leading-snug text-white/75 sm:text-xs">
                  {movie.description}
                </p>
              </div>
            </div>
          </Link>

          <div className="space-y-2.5 p-2.5 sm:space-y-3 sm:p-3.5 md:p-4">
            <div>
              <Link
                href={`/movie/${movie.uuid}`}
                className="font-playfair line-clamp-1 text-sm font-black leading-tight text-white transition sm:text-base md:group-hover:text-violet-300"
              >
                {movie.title}
              </Link>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:text-[10px]">
                {movie.language} · {new Date(movie.release_date).getFullYear()}
              </p>
            </div>

            {movie.moods.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {movie.moods.slice(0, 2).map((mood) => (
                  <span
                    key={mood}
                    className="rounded-full border border-white/[0.08] bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-medium text-white/55 sm:px-2 sm:text-[10px]"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <span className="flex items-center gap-1 text-[9px] font-medium text-white/40 sm:text-[10px]">
                <Calendar size={10} className="opacity-70" />
                <span className="sm:hidden">{new Date(movie.release_date).getFullYear()}</span>
                <span className="hidden sm:inline">{movie.release_date}</span>
              </span>
              <button
                type="button"
                onClick={openTrailer}
                suppressHydrationWarning
                className="touch-target inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-black transition active:scale-95 sm:px-2.5 sm:py-1.5 sm:text-[10px] md:hover:bg-violet-200"
              >
                <Play size={9} fill="currentColor" />
                Trailer
              </button>
            </div>
          </div>
        </motion.article>
      </TiltCard>

      <AnimatePresence>
        {trailerOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/85 p-0 backdrop-blur-md sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#0B0B0F] shadow-2xl sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl"
              initial={{ y: '100%', opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
                <div className="min-w-0 flex-1">
                  <div className="font-playfair truncate text-lg font-black text-white sm:text-2xl">{movie.title}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:text-xs">Trailer</div>
                </div>
                <button
                  type="button"
                  onClick={closeTrailer}
                  suppressHydrationWarning
                  className="touch-target shrink-0 rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-white/70 hover:text-white"
                >
                  Close
                </button>
              </div>

              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${movie.title} trailer`}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center text-white sm:py-20">
                  <p className="max-w-md text-sm text-white/70">Open the trailer in your browser.</p>
                  <button
                    type="button"
                    onClick={() => window.open(movie.trailer, "_blank", "noopener,noreferrer")}
                    suppressHydrationWarning
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-wider text-black"
                  >
                    <ExternalLink size={15} />
                    Open Trailer
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const MovieCard = memo(MovieCardComponent)
export default MovieCard
