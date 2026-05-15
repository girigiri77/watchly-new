'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import ParallaxWrapper from '@/components/effects/ParallaxWrapper'

function HeroParticles() {
  const reduceMotion = useReducedMotion()
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 7 + 13) % 100}%`,
        top: `${(i * 11 + 7) % 100}%`,
        size: 2 + (i % 4),
        duration: 14 + (i % 9) * 1.2,
        delay: (i % 10) * 0.35,
      })),
    []
  )

  if (reduceMotion) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/35 shadow-[0_0_12px_rgba(168,85,247,0.45)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0.15, y: 0 }}
          animate={{
            opacity: [0.15, 0.55, 0.2],
            y: [0, -28, 8, 0],
            x: [0, 6, -4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

const easeOut = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const reduceMotion = useReducedMotion()

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.1,
          delayChildren: reduceMotion ? 0 : 0.06,
        },
      },
    }),
    [reduceMotion]
  )

  const itemVariants = useMemo(
    () =>
      reduceMotion
        ? {
            hidden: { opacity: 1, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0 } },
          }
        : {
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.58, ease: easeOut },
            },
          },
    [reduceMotion]
  )

  return (
    <div className="relative min-h-[100dvh] min-h-screen overflow-hidden bg-white">
      {/* Background: full art on mobile (contain + top), richer fill on desktop (cover + center) */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-contain bg-top bg-no-repeat opacity-[0.98] md:bg-cover md:bg-center ${
          reduceMotion ? '' : 'md:[background-attachment:fixed]'
        }`}
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
        }}
      />

      {/* Lighter overlays — keep the plate clean, not milky */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-white/22 via-white/10 to-white/52" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-white/16 via-transparent to-white/14" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_42%,rgba(255,255,255,0.22)_100%)]" />

      <ParallaxWrapper multiplier={-15} className="absolute inset-0 pointer-events-none z-[2]">
        <motion.div
          className="absolute -left-24 top-0 h-[min(100vw,500px)] w-[min(100vw,500px)] rounded-full bg-purple-500/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.08, 1], opacity: [0.4, 0.58, 0.4] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-16 top-24 h-[min(90vw,400px)] w-[min(90vw,400px)] rounded-full bg-fuchsia-400/18 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.12, 1], opacity: [0.35, 0.62, 0.35] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-full bg-violet-400/12 blur-3xl"
          animate={
            reduceMotion ? undefined : { opacity: [0.2, 0.38, 0.2], y: [0, -12, 0] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </ParallaxWrapper>

      <HeroParticles />

      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          boxShadow: 'inset 0 0 100px rgba(15, 23, 42, 0.14)',
        }}
      />

      <div className="relative z-10 flex min-h-[100dvh] min-h-screen w-full flex-col items-center justify-center px-5 pb-24 pt-36 sm:px-6 md:pb-28 md:pt-40">
        <ParallaxWrapper multiplier={10} className="w-full flex justify-center">
          <motion.section
            className="mx-auto flex w-full max-w-4xl flex-col items-center text-center lg:max-w-5xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-purple-300/70 bg-white/55 px-5 py-2 text-sm font-medium text-purple-800 shadow-sm backdrop-blur-md"
          >
            <span aria-hidden>🎬</span>
            Premium Cinema Discovery
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-playfair mt-6 max-w-[22ch] text-balance text-5xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:mt-7 sm:text-6xl md:mt-7 md:text-7xl lg:text-8xl"
          >
            <span className="text-neutral-950">Find What To Watch</span>
            <br />
            <span className="bg-gradient-to-r from-purple-700 via-violet-500 to-fuchsia-400 bg-clip-text text-transparent">
              Tonight
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-4 max-w-2xl text-pretty text-center text-base font-medium leading-relaxed tracking-wide text-zinc-800 sm:mt-5 sm:text-lg"
          >
            Latest OTT releases, mood-based recommendations, and regional cinema updates — all in one place.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4 md:gap-5"
          >
            <Link
              href="/releases?tab=latest"
              className="inline-flex min-h-[3rem] min-w-[10rem] items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-2xl transition hover:scale-[1.03] sm:px-8 sm:py-4 sm:text-base"
            >
              <span className="mr-2" aria-hidden>
                🎭
              </span>
              New Releases
            </Link>
            <Link
              href="/mood"
              className="inline-flex min-h-[3rem] min-w-[10rem] items-center justify-center rounded-full border border-purple-300/80 bg-white/65 px-7 py-3.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur-md transition hover:bg-white sm:px-8 sm:py-4 sm:text-base"
            >
              <span className="mr-2" aria-hidden>
                🎨
              </span>
              Mood Cinema →
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex w-full max-w-md flex-col items-center justify-center gap-2 sm:mt-11"
          >
            <p className="text-center text-[11px] font-medium leading-relaxed tracking-[0.12em] text-purple-950/90 sm:text-xs sm:tracking-wide">
              Swipe up to explore OTT platforms
            </p>
            <motion.div
              aria-hidden
              className="flex flex-col items-center text-purple-600"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, 7, 0],
                      opacity: [0.75, 1, 0.75],
                    }
              }
              transition={{
                duration: 1.65,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.45))',
              }}
            >
              <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
            </motion.div>
          </motion.div>
        </motion.section>
        </ParallaxWrapper>
      </div>
    </div>
  )
}
