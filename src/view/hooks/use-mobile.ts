'use client'

import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint: number = 768): boolean {
 const [isMobile, setIsMobile] = useState(false)

 useEffect(() => {
  const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)

  const handleChange = (e: MediaQueryListEvent) => {
   setIsMobile(e.matches)
  }

  // Set initial value
  setIsMobile(mediaQuery.matches)

  // Add listener
  mediaQuery.addEventListener('change', handleChange)

  // Cleanup
  return () => mediaQuery.removeEventListener('change', handleChange)
 }, [breakpoint])

 return isMobile
}
