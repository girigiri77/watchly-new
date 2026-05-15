"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"

export default function MouseGlow() {
  const reduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  
  // Motion values for x and y
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  // Smooth the motion using spring physics for that cinematic, weighty feel
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (reduceMotion) return

    // Only show the effect if the user has a mouse
    const isMouseDevice = matchMedia('(pointer:fine)').matches
    if (!isMouseDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    // Hide when mouse leaves the window
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [mouseX, mouseY, isVisible, reduceMotion])

  if (reduceMotion) return null

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[50] overflow-hidden mix-blend-screen"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
      aria-hidden="true"
    >
      <motion.div
        className="pointer-events-none absolute -left-[300px] -top-[300px] h-[600px] w-[600px] rounded-full"
        style={{
          x,
          y,
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(217, 70, 239, 0.03) 40%, transparent 70%)",
        }}
      />
    </motion.div>
  )
}
