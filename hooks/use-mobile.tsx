"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Only access window in useEffect (client-side only)
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener for resize
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}
