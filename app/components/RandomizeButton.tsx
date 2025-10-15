'use client'

import Image from 'next/image'

export const RandomizeButton = () => {
  const handleRandomize = () => {
    window.scrollTo(0, 0)
    // Broadcast a reshuffle event; listeners will bump a nonce to refetch
    window.dispatchEvent(new CustomEvent('supermirage:reshuffle'))
  }

  return (
    <button
      onClick={handleRandomize}
      className="cursor-media-cell group absolute right-1 top-1 bg-black p-1 text-white sm:right-4 sm:top-4"
      aria-label="Randomize media order"
    >
      <Image
        src="/assets/icons/spiral.svg"
        alt="Randomize"
        width={16}
        height={16}
        className="h-5 w-5 transition-transform hover:opacity-100 group-hover:animate-spin-slow motion-reduce:animate-none sm:h-5 sm:w-5 lg:opacity-80"
      />
    </button>
  )
} 