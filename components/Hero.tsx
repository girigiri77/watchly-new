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
    <div className="relative min-h-[72dvh] overflow-hidden bg-white sm:min-h-[85dvh] lg:min-h-[100dvh]">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-contain bg-top bg-no-repeat opacity-[0.98] sm:bg-cover sm:bg-center"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
        }}
      />

      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-white/22 via-white/10 to-white/52" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-white/16 via-transparent to-white/14" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_42%,rgba(255,255,255,0.22)_100%)]" />

      <ParallaxWrapper multiplier={-15} className="pointer-events-none absolute inset-0 z-[2]">
        <motion.div
          className="absolute -left-24 top-0 h-[min(80vw,400px)] w-[min(80vw,400px)] rounded-full bg-purple-500/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.08, 1], opacity: [0.4, 0.58, 0.4] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-16 top-24 h-[min(70vw,320px)] w-[min(70vw,320px)] rounded-full bg-fuchsia-400/18 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.12, 1], opacity: [0.35, 0.62, 0.35] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </ParallaxWrapper>

      <HeroParticles />

      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          boxShadow: 'inset 0 0 100px rgba(15, 23, 42, 0.14)',
        }}
      />

      <div className="relative z-10 flex min-h-[72dvh] w-full flex-col items-center justify-center px-4 pb-16 pt-24 sm:min-h-[85dvh] sm:px-6 sm:pb-20 sm:pt-28 md:pb-24 md:pt-32 lg:min-h-[100dvh]">
        <ParallaxWrapper multiplier={10} className="flex w-full justify-center">
          <motion.section
            className="mx-auto flex w-full max-w-4xl flex-col items-center px-1 text-center lg:max-w-5xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/70 bg-white/55 px-3 py-1.5 text-xs font-medium text-purple-800 shadow-sm backdrop-blur-md sm:gap-2 sm:px-5 sm:py-2 sm:text-sm"
            >
              <span aria-hidden>🎬</span>
              Premium Cinema Discovery
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-display font-playfair mt-4 max-w-[20ch] text-balance text-neutral-950 sm:mt-6 sm:max-w-[22ch]"
            >
              <span className="text-neutral-950">Find What To Watch</span>
              <br />
              <span className="bg-gradient-to-r from-purple-700 via-violet-500 to-fuchsia-400 bg-clip-text text-transparent">
                Tonight
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-3 max-w-md text-pretty px-2 text-center text-sm font-medium leading-relaxed text-zinc-800 sm:mt-4 sm:max-w-2xl sm:text-base md:text-lg"
            >
              Latest OTT releases, mood-based recommendations, and regional cinema updates — all in one place.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex w-full max-w-xs flex-col items-stretch gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
            >
              <Link
                href="/releases?tab=latest"
                className="touch-target inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-xl transition active:scale-[0.98] sm:w-auto sm:px-8 sm:py-3.5 md:hover:scale-[1.03]"
              >
                <span className="mr-2" aria-hidden>
                  🎭
                </span>
                New Releases
              </Link>
              <Link
                href="/mood"
                className="touch-target inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-purple-300/80 bg-white/65 px-6 py-3 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur-md transition active:scale-[0.98] sm:w-auto sm:px-8 sm:py-3.5 md:hover:bg-white"
              >
                <span className="mr-2" aria-hidden>
                  🎨
                </span>
                Mood Cinema →
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-2 sm:mt-10"
            >
              <p className="text-center text-[10px] font-medium leading-relaxed tracking-[0.1em] text-purple-950/90 sm:text-xs sm:tracking-wide">
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
