"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export function ConfettiEffect() {
  useEffect(() => {
    // Function to create and trigger side cannons
    const triggerSideCannons = () => {
      const end = Date.now() + 3 * 1000 // 3 seconds
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

      const frame = () => {
        if (Date.now() > end) return

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        })

        requestAnimationFrame(frame)
      }

      frame()
    }

    // Set a timeout to trigger confetti after 1 second
    const timer = setTimeout(() => {
      triggerSideCannons()
    }, 3000)

    // Clean up function
    return () => {
      clearTimeout(timer)
      confetti.reset()
    }
  }, []) // Empty dependency array means this runs once on mount

  return null
}

