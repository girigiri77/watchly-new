'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type FadeInViewProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'none'
}

export default function FadeInView({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: FadeInViewProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: direction === 'up' ? 28 : 0,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, margin: '-40px 0px -60px 0px', amount: 0.12 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
