"use client"

/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import { Calendar, ExternalLink, Play, Star } from "lucide-react"
import { startTransition, useMemo, useState } from "react"
import type { MovieCurated } from "@/types/movie"
import { getResolvedPosterUrl } from "@/lib/movie-images"
import TiltCard from "@/components/effects/TiltCard"

type MovieCardProps = {
  movie: MovieCurated
  index?: number
}

const platformStyle: Record<string, { bg: string; label: string; gradient: string }> = {
  Netflix: { bg: "#E50914", label: "NETFLIX", gradient: "linear-gradient(135deg, #E50914 0%, #B20710 100%)" },
  "Prime Video": { bg: "#00A8E0", label: "PRIME", gradient: "linear-gradient(135deg, #00A8E0 0%, #0066CC 100%)" },
  Hotstar: { bg: "#1F80E0", label: "HOTSTAR", gradient: "linear-gradient(135deg, #1F80E0 0%, #0066B3 100%)" },
  Zee5: { bg: "#8B2FC9", label: "ZEE5", gradient: "linear-gradient(135deg, #8B2FC9 0%, #6B1FA9 100%)" },
  SonyLIV: { bg: "#FF5722", label: "SONY", gradient: "linear-gradient(135deg, #FF5722 0%, #E64A19 100%)" },
  Aha: { bg: "#F97316", label: "AHA", gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" },
  JioCinema: { bg: "#D946EF", label: "JIO", gradient: "linear-gradient(135deg, #D946EF 0%, #7C3AED 100%)" },
}

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/)
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const platform = platformStyle[movie.ott] ?? {
    bg: "#52525B",
    label: movie.ott,
    gradient: "linear-gradient(135deg, #52525B 0%, #27272A 100%)",
  }
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(movie.trailer), [movie.trailer])
  const posterUrl = useMemo(() => {
    const url = getResolvedPosterUrl(movie)
    return url === "" ? "/placeholder.jpg" : url
  }, [movie.poster])


  return (
    <>
      <TiltCard intensity={10} className="block h-full w-full">
        <article className="h-full group overflow-hidden rounded-[20px] border border-white/10 bg-[#111111] shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out md:hover:-translate-y-2">
          <Link href={`/movie/${movie.uuid}`} className="block">
          <div className="relative aspect-[2/3] overflow-hidden bg-[#191919]">
            {!imageFailed ? (
              <img
                key={posterUrl}
                src={posterUrl}
                alt={movie.title}
                onError={() => {
                  startTransition(() => setImageFailed(true))
                }}
                className="h-full w-full object-cover transition duration-700 md:group-hover:scale-105 md:group-hover:brightness-110"
              />
            ) : (
              <div
                className="flex h-full flex-col items-center justify-center px-4 text-center sm:px-6"
              >
                <div className="mb-3 text-3xl sm:mb-5 sm:text-5xl">🎬</div>
                <div className="font-playfair text-base font-black text-white sm:text-xl">{movie.title}</div>
                <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 sm:text-[10px]">{movie.language}</div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />

            <div
              className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white shadow-lg sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px]"
              style={{ background: platform.gradient }}
            >
              {platform.label}
            </div>

            <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
              <Star size={11} fill="#F5C542" stroke="none" className="sm:size-3" />
              {Number(movie.rating || 0).toFixed(1)}
            </div>

            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
              <p className="line-clamp-2 text-xs font-medium leading-4 text-white/80 sm:text-sm sm:leading-5">{movie.description}</p>
            </div>
          </div>
        </Link>

        <div className="space-y-3 p-3.5 sm:space-y-4 sm:p-4">
          <div>
            <Link href={`/movie/${movie.uuid}`} className="font-playfair text-base font-black leading-tight text-white transition sm:text-xl md:group-hover:text-[#C4B5FD] line-clamp-1">
              {movie.title}
            </Link>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 sm:mt-2 sm:gap-2 sm:text-xs">
              <span>{movie.language}</span>
              <span>•</span>
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {movie.moods.slice(0, 2).map((mood) => (
              <span key={mood} className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/60 sm:px-3 sm:py-1 sm:text-xs">
                {mood}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-white/45 sm:gap-1.5 sm:text-xs">
              <Calendar size={11} className="sm:size-[13px]" />
              <span className="hidden sm:inline">{movie.release_date}</span>
              <span className="inline sm:hidden">{new Date(movie.release_date).getFullYear()}</span>
            </div>

            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              suppressHydrationWarning
              className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#C4B5FD] sm:gap-2 sm:px-3.5 sm:py-2 sm:text-xs"
            >
              <Play size={11} fill="currentColor" className="sm:size-[13px]" />
              Trailer
            </button>
          </div>
        </div>
      </article>
      </TiltCard>

      {trailerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="font-playfair text-2xl font-black text-white">{movie.title}</div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Manual trailer link</div>
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
                title={`${movie.title} trailer`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center text-white">
                <p className="max-w-md text-white/70">This trailer URL cannot be embedded, but the manual link can open directly.</p>
                <button
                  type="button"
                  onClick={() => window.open(movie.trailer, "_blank", "noopener,noreferrer")}

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
    </>
  )
}
