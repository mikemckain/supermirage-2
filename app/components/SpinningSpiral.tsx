'use client'

import Image from 'next/image'

interface SpinningSpiralProps {
  size?: number
  className?: string
}

export const SpinningSpiral = ({ size = 24, className = '' }: SpinningSpiralProps) => {
  return (
    <div 
      className={`animate-spin ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src="/assets/icons/spiral.svg"
        alt="Loading"
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  )
} 