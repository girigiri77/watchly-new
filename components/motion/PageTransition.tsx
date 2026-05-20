'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  )
}
