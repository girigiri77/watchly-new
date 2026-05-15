"use client"

import { ReactNode, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number // How much the card tilts. Higher is more intense.
}

export default function TiltCard({ children, className = "", intensity = 15 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth return to center
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)

  // Map mouse position to rotation angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity])
  
  // Subtle glow overlay that follows the mouse
  const glareOpacity = useTransform(y, [-0.5, 0.5], [0.05, 0.15])
  const glareY = useTransform(y, [-0.5, 0.5], ["-20%", "120%"])
  const glareX = useTransform(x, [-0.5, 0.5], ["-20%", "120%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reduceMotion) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Calculate mouse position relative to center of element (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      <motion.div
        className="h-full w-full relative"
        style={{
          perspective: 1200,
          rotateX,
          rotateY,
        }}
      >
        {children}
        
        {/* Soft glare effect overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] overflow-hidden mix-blend-overlay"
          style={{ opacity: glareOpacity }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-white blur-[40px]"
            style={{
              x: glareX,
              y: glareY,
              width: "150%",
              height: "150%",
              top: "-25%",
              left: "-25%",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
