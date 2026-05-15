"use client"

import { ReactNode, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"

interface ParallaxWrapperProps {
  children: ReactNode
  className?: string
  multiplier?: number // Depth multiplier. Negative goes with mouse, positive goes opposite.
}

export default function ParallaxWrapper({ 
  children, 
  className = "", 
  multiplier = 10 
}: ParallaxWrapperProps) {
  const reduceMotion = useReducedMotion()
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth depth
  const springConfig = { damping: 40, stiffness: 150, mass: 1 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Transform raw mouse percentages (-0.5 to 0.5) to pixel translations
  const x = useTransform(smoothX, [-0.5, 0.5], [-multiplier, multiplier])
  const y = useTransform(smoothY, [-0.5, 0.5], [-multiplier, multiplier])

  useEffect(() => {
    if (reduceMotion) return

    // Ensure it's a mouse device
    if (!matchMedia('(pointer:fine)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -0.5 to 0.5 based on window dimensions
      const xPct = e.clientX / window.innerWidth - 0.5
      const yPct = e.clientY / window.innerHeight - 0.5
      mouseX.set(xPct)
      mouseY.set(yPct)
    }

    const handleMouseLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mouseX, mouseY, reduceMotion])

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  )
}
