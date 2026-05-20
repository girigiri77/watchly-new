"use client"

/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { Calendar, ExternalLink, Play, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { memo, useMemo, useState } from "react"
import PosterImage from "@/components/ui/PosterImage"
import type { TeluguPick } from "@/types/telugu-pick"

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

function TeluguPickCardInner({ pick }: { pick: TeluguPick }) {
  const [trailerOpen, setTrailerOpen] = useState(false)

  const platform = platformStyle[pick.ott] ?? {
    label: pick.ott.toUpperCase().slice(0, 8),
    gradient: "linear-gradient(135deg, #52525B 0%, #27272A 100%)",
  }

  const embedUrl = useMemo(() => getYouTubeEmbedUrl(pick.trailerUrl), [pick.trailerUrl])
  const detailHref = pick.libraryMovieId ? `/movie/${pick.libraryMovieId}` : "/telugu"

  const posterToUse = useMemo(() => {
    const url = pick.customPoster || pick.posterUrl
    return url && url.trim() !== "" ? url : "/placeholder.jpg"
  }, [pick.customPoster, pick.posterUrl])

  return (
    <>
      <motion.article
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="tap-scale group h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f12] cinematic-card-shadow sm:rounded-[18px] md:hover:cinematic-glow md:hover:-translate-y-1.5"
      >
        <Link href={detailHref} className="block">
          <div className="relative aspect-[2/3] overflow-hidden bg-[#141414]">
            <PosterImage src={posterToUse} alt={pick.title} />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

            <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1 sm:left-3 sm:top-3 sm:gap-2">
              <div
                className="rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white shadow-lg sm:px-3 sm:py-1.5 sm:text-[10px]"
                style={{ background: platform.gradient }}
              >
                {platform.label}
              </div>
              {pick.featured ? (
                <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-amber-100">
                  Featured
                </span>
              ) : null}
            </div>

            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              <Star size={12} fill="#F5C542" stroke="none" />
              {Number(pick.rating || 0).toFixed(1)}
            </div>


            <div className="absolute bottom-4 left-4 right-4">
              {pick.description ? (
                <p className="line-clamp-2 text-sm font-medium leading-5 text-white/85">{pick.description}</p>
              ) : null}
            </div>
          </div>
        </Link>

        <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
          <div>
            <Link href={detailHref} className="font-playfair line-clamp-1 text-base font-black leading-tight text-white transition sm:text-xl md:group-hover:text-[#C4B5FD]">
              {pick.title}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              <span>{pick.language}</span>
              <span>•</span>
              <span>{pick.year}</span>
              <span>•</span>
              <span>{pick.duration}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {pick.moods.slice(0, 3).map((mood) => (
              <span key={mood} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                {mood}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/45">
              <Calendar size={13} />
              {pick.releaseDate}
            </div>
            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              suppressHydrationWarning
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#C4B5FD]"
            >
              <Play size={13} fill="currentColor" />
              Trailer
            </button>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
      {trailerOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#0B0B0F] shadow-2xl sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5 sm:py-4">
              <div className="min-w-0 flex-1">
                <div className="font-playfair truncate text-lg font-black text-white sm:text-2xl">{pick.title}</div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Trailer</div>
              </div>
              <button
                type="button"
                onClick={() => setTrailerOpen(false)}
                suppressHydrationWarning
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/70 hover:text-white"
              >
                Close
              </button>
            </div>

            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${pick.title} trailer`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center text-white">
                <p className="max-w-md text-white/70">This trailer URL cannot be embedded, but the manual link can open directly.</p>
                <button
                  type="button"
                  onClick={() => window.open(pick.trailerUrl, "_blank", "noopener,noreferrer")}
                  suppressHydrationWarning
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black"
                >
                  <ExternalLink size={15} />
                  Open Trailer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </AnimatePresence>
    </>
  )
}

export default memo(TeluguPickCardInner)
