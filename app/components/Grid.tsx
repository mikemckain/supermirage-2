'use client'

import { useRef } from 'react'
import { HeroEllipse } from './HeroEllipse'
import { MediaItems } from './MediaItems'

export const Grid = () => {
  // Stable sentinel so the first fixed hero cell never reloads on reshuffle
  const sentinelRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-[4px] p-0 lg:grid-cols-3 lg:p-[72px]">
        <HeroEllipse />
        <MediaItems sentinelRef={sentinelRef} />
      </div>
      
      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />
      
      {/* Imperative lightbox manages its own backdrop */}
    </>
  )
} 